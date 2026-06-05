import { CompilationInterop } from "./CompilationInterop.js";
import {
  dotnet as dotnetHostBuilder,
  type MonoConfig,
  type DotnetModuleConfig,
  DotnetHostBuilder,
} from "./dotnet.js";
import type {
  WasmSharpModuleOptions,
  AssemblyExports,
  WasmSharpModuleCallbacks,
  WasmSharpOptions,
} from "./index.js";

function getDirectory(path: string) {
  var index = path.lastIndexOf("/");
  if (index !== -1) {
    return path.substring(0, index + 1);
  } else {
    return path;
  }
}

export async function initializeWasmSharpModule(
  options: WasmSharpOptions,
  imports: {}
): Promise<{compilationInterop: CompilationInterop, assemblyExports: AssemblyExports }> {
  type InternalsHostBuilder = DotnetHostBuilder & {
    //internal method: https://github.com/dotnet/runtime/blob/a270140281a13ab82a4401dff3da6d27fe499087/src/mono/wasm/runtime/loader/run.ts#L26
    withModuleConfig(config: DotnetModuleConfig): InternalsHostBuilder;
  };
  const hostBuilder: InternalsHostBuilder = dotnetHostBuilder as InternalsHostBuilder;

  const time = performance.now();
  let resourcesToLoad = 0;
  const { getAssemblyExports, getConfig, setModuleImports } = await hostBuilder
    .withModuleConfig({
      onConfigLoaded(config: MonoConfig) {
        resourcesToLoad = Object.keys(config.resources?.assembly ?? {}).length;
        resourcesToLoad += Object.keys(config.resources?.pdb ?? {}).length;
        resourcesToLoad += Object.keys(config.resources?.icu ?? {}).length;
        //we are off by one when using the above - maybe its the wasm module, maybe its something else. Either way, this resolves the issue for now
        resourcesToLoad += 1;
        options?.onConfigLoaded?.(config);
      },
      onDownloadResourceProgress(loaded: number, total: number) {
        options?.onDownloadResourceProgress?.(loaded, resourcesToLoad);
      },
    })
    .withDiagnosticTracing(options?.enableDiagnosticTracing ?? false)
    //workaround https://github.com/dotnet/runtime/issues/94238
    //.withDebugging(options?.debugLevel ?? 1)
    .withConfig({
      debugLevel: options?.debugLevel ?? 0,
    })
    .withConfig({
      //TODO: Figure out why we need this, broken since dotnet sdk update to 8.0.101
      disableIntegrityCheck: true,
    })
    .create();

  /*
  * Waits until the provided condition function returns a truthy value.
  * @param {Function} condition - The function to check periodically.
  * @param {number} [timeout=5000] - Maximum time to wait in milliseconds.
  * @param {number} [intervalTime=100] - How often to check the condition in milliseconds.
  * @returns {Promise<any>} A promise that resolves with the condition's result when met.
  */
  function waitUntil(condition: () => boolean, timeout = 5000, intervalTime = 100) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const result = condition();
        if (result) {
          clearInterval(interval);
          clearTimeout(timeoutId);
          resolve(result); // Resolve with the result (e.g., the non-null value)
        }
      }, intervalTime);

      const timeoutId = setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Timed out waiting for condition to be met'));
      }, timeout);
    });
  }

  setModuleImports("main.js", imports);
  
  const config = getConfig();
  console.log("WasmSharp: Config loaded", config);
  const assemblyExports: AssemblyExports = await getAssemblyExports(config.mainAssemblyName!);
  console.log("WasmSharp: assemblyExports", assemblyExports);

  const compilationInterop = assemblyExports.WasmSharp.Core.CompilationInterop;
  //TODO: Rewrite this to use new URL()
  const resolvedAssembliesUrl = new URL(options?.assembliesUrl ?? getDirectory(import.meta.url));
  const diff1 = performance.now() - time;
  console.log(`Finished initialising runtime in ${diff1}ms`);
  console.log(`Using following location for assemblies: ${resolvedAssembliesUrl}`);
  const resources = config.resources;

  if (!resources) {
    throw new Error("WasmSharp: No resources found in config");
  }

  if (!resources.assembly || !resources.coreAssembly || !resources.satelliteResources) {
    throw new Error("WasmSharp: config is malformed, no assemblies found");
  }

  const assembliesAssets = resources.coreAssembly.concat(resources.assembly);
  const satelliteAssemblies = Object.values(resources.satelliteResources).flatMap(
    (assets) => assets
  );

  const assemblies = assembliesAssets
    .map((x) => x)
    .concat(satelliteAssemblies)
    .filter((x) => {
      if (!x.resolvedUrl) {
        console.debug("WasmSharp: resolved URL is empty, skipping assembly", x.virtualPath);
      }
      return !!x.resolvedUrl;
    })
    .map((x) => new URL(x.resolvedUrl!, resolvedAssembliesUrl).href);

  await compilationInterop.InitAsync(assemblies);
  const diff2 = performance.now() - time;
  console.log(`Finished loading assemblies in ${diff2}ms`);
  return { compilationInterop, assemblyExports };
}
