//! Licensed to the .NET Foundation under one or more agreements.
//! The .NET Foundation licenses this file to you under the MIT license.
import * as dotnet_runtime_js from "./dotnet.runtime.js";
import * as dotnet_native_js from "./dotnet.native.js";
import dotnet_native_wasm from "./dotnet.native.wasm";
import icudt_CJK_dat from "./icudt_CJK.dat";
import icudt_EFIGS_dat from "./icudt_EFIGS.dat";
import icudt_no_CJK_dat from "./icudt_no_CJK.dat";
import System_Private_CoreLib_dll from "./System.Private.CoreLib.dll";
import System_Runtime_InteropServices_JavaScript_dll from "./System.Runtime.InteropServices.JavaScript.dll";
import Humanizer_dll from "./Humanizer.dll";
import Microsoft_CodeAnalysis_CSharp_Features_dll from "./Microsoft.CodeAnalysis.CSharp.Features.dll";
import Microsoft_CodeAnalysis_CSharp_Workspaces_dll from "./Microsoft.CodeAnalysis.CSharp.Workspaces.dll";
import Microsoft_CodeAnalysis_CSharp_dll from "./Microsoft.CodeAnalysis.CSharp.dll";
import Microsoft_CodeAnalysis_Features_dll from "./Microsoft.CodeAnalysis.Features.dll";
import Microsoft_CodeAnalysis_Scripting_dll from "./Microsoft.CodeAnalysis.Scripting.dll";
import Microsoft_CodeAnalysis_Workspaces_dll from "./Microsoft.CodeAnalysis.Workspaces.dll";
import Microsoft_CodeAnalysis_dll from "./Microsoft.CodeAnalysis.dll";
import Microsoft_DiaSymReader_dll from "./Microsoft.DiaSymReader.dll";
import Microsoft_Extensions_DependencyInjection_Abstractions_dll from "./Microsoft.Extensions.DependencyInjection.Abstractions.dll";
import Microsoft_Extensions_Logging_Abstractions_dll from "./Microsoft.Extensions.Logging.Abstractions.dll";
import System_Collections_Concurrent_dll from "./System.Collections.Concurrent.dll";
import System_Collections_Immutable_dll from "./System.Collections.Immutable.dll";
import System_Collections_NonGeneric_dll from "./System.Collections.NonGeneric.dll";
import System_Collections_Specialized_dll from "./System.Collections.Specialized.dll";
import System_Collections_dll from "./System.Collections.dll";
import System_ComponentModel_Primitives_dll from "./System.ComponentModel.Primitives.dll";
import System_ComponentModel_TypeConverter_dll from "./System.ComponentModel.TypeConverter.dll";
import System_ComponentModel_dll from "./System.ComponentModel.dll";
import System_Composition_AttributedModel_dll from "./System.Composition.AttributedModel.dll";
import System_Composition_Hosting_dll from "./System.Composition.Hosting.dll";
import System_Composition_Runtime_dll from "./System.Composition.Runtime.dll";
import System_Composition_TypedParts_dll from "./System.Composition.TypedParts.dll";
import System_Console_dll from "./System.Console.dll";
import System_Diagnostics_FileVersionInfo_dll from "./System.Diagnostics.FileVersionInfo.dll";
import System_Diagnostics_Process_dll from "./System.Diagnostics.Process.dll";
import System_Diagnostics_TraceSource_dll from "./System.Diagnostics.TraceSource.dll";
import System_Globalization_dll from "./System.Globalization.dll";
import System_IO_Compression_dll from "./System.IO.Compression.dll";
import System_IO_MemoryMappedFiles_dll from "./System.IO.MemoryMappedFiles.dll";
import System_IO_Pipelines_dll from "./System.IO.Pipelines.dll";
import System_Linq_Expressions_dll from "./System.Linq.Expressions.dll";
import System_Linq_dll from "./System.Linq.dll";
import System_Memory_dll from "./System.Memory.dll";
import System_Net_Http_dll from "./System.Net.Http.dll";
import System_Net_Primitives_dll from "./System.Net.Primitives.dll";
import System_Numerics_Vectors_dll from "./System.Numerics.Vectors.dll";
import System_ObjectModel_dll from "./System.ObjectModel.dll";
import System_Private_DataContractSerialization_dll from "./System.Private.DataContractSerialization.dll";
import System_Private_Uri_dll from "./System.Private.Uri.dll";
import System_Private_Xml_Linq_dll from "./System.Private.Xml.Linq.dll";
import System_Private_Xml_dll from "./System.Private.Xml.dll";
import System_Reflection_Metadata_dll from "./System.Reflection.Metadata.dll";
import System_Runtime_InteropServices_dll from "./System.Runtime.InteropServices.dll";
import System_Runtime_Numerics_dll from "./System.Runtime.Numerics.dll";
import System_Runtime_Serialization_Formatters_dll from "./System.Runtime.Serialization.Formatters.dll";
import System_Runtime_Serialization_Primitives_dll from "./System.Runtime.Serialization.Primitives.dll";
import System_Runtime_dll from "./System.Runtime.dll";
import System_Security_Cryptography_dll from "./System.Security.Cryptography.dll";
import System_Text_Encoding_CodePages_dll from "./System.Text.Encoding.CodePages.dll";
import System_Text_Encodings_Web_dll from "./System.Text.Encodings.Web.dll";
import System_Text_Json_dll from "./System.Text.Json.dll";
import System_Text_RegularExpressions_dll from "./System.Text.RegularExpressions.dll";
import System_Threading_Channels_dll from "./System.Threading.Channels.dll";
import System_Threading_Tasks_Parallel_dll from "./System.Threading.Tasks.Parallel.dll";
import System_Xml_Linq_dll from "./System.Xml.Linq.dll";
import System_dll from "./System.dll";
import WasmSharp_Core_dll from "./WasmSharp.Core.dll";
import csMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./cs/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import csMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./cs/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import csMicrosoft_CodeAnalysis_CSharp_resources_dll from "./cs/Microsoft.CodeAnalysis.CSharp.resources.dll";
import csMicrosoft_CodeAnalysis_Features_resources_dll from "./cs/Microsoft.CodeAnalysis.Features.resources.dll";
import csMicrosoft_CodeAnalysis_Scripting_resources_dll from "./cs/Microsoft.CodeAnalysis.Scripting.resources.dll";
import csMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./cs/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import csMicrosoft_CodeAnalysis_resources_dll from "./cs/Microsoft.CodeAnalysis.resources.dll";
import deMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./de/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import deMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./de/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import deMicrosoft_CodeAnalysis_CSharp_resources_dll from "./de/Microsoft.CodeAnalysis.CSharp.resources.dll";
import deMicrosoft_CodeAnalysis_Features_resources_dll from "./de/Microsoft.CodeAnalysis.Features.resources.dll";
import deMicrosoft_CodeAnalysis_Scripting_resources_dll from "./de/Microsoft.CodeAnalysis.Scripting.resources.dll";
import deMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./de/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import deMicrosoft_CodeAnalysis_resources_dll from "./de/Microsoft.CodeAnalysis.resources.dll";
import esMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./es/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import esMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./es/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import esMicrosoft_CodeAnalysis_CSharp_resources_dll from "./es/Microsoft.CodeAnalysis.CSharp.resources.dll";
import esMicrosoft_CodeAnalysis_Features_resources_dll from "./es/Microsoft.CodeAnalysis.Features.resources.dll";
import esMicrosoft_CodeAnalysis_Scripting_resources_dll from "./es/Microsoft.CodeAnalysis.Scripting.resources.dll";
import esMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./es/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import esMicrosoft_CodeAnalysis_resources_dll from "./es/Microsoft.CodeAnalysis.resources.dll";
import frMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./fr/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import frMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./fr/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import frMicrosoft_CodeAnalysis_CSharp_resources_dll from "./fr/Microsoft.CodeAnalysis.CSharp.resources.dll";
import frMicrosoft_CodeAnalysis_Features_resources_dll from "./fr/Microsoft.CodeAnalysis.Features.resources.dll";
import frMicrosoft_CodeAnalysis_Scripting_resources_dll from "./fr/Microsoft.CodeAnalysis.Scripting.resources.dll";
import frMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./fr/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import frMicrosoft_CodeAnalysis_resources_dll from "./fr/Microsoft.CodeAnalysis.resources.dll";
import itMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./it/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import itMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./it/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import itMicrosoft_CodeAnalysis_CSharp_resources_dll from "./it/Microsoft.CodeAnalysis.CSharp.resources.dll";
import itMicrosoft_CodeAnalysis_Features_resources_dll from "./it/Microsoft.CodeAnalysis.Features.resources.dll";
import itMicrosoft_CodeAnalysis_Scripting_resources_dll from "./it/Microsoft.CodeAnalysis.Scripting.resources.dll";
import itMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./it/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import itMicrosoft_CodeAnalysis_resources_dll from "./it/Microsoft.CodeAnalysis.resources.dll";
import jaMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./ja/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import jaMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./ja/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import jaMicrosoft_CodeAnalysis_CSharp_resources_dll from "./ja/Microsoft.CodeAnalysis.CSharp.resources.dll";
import jaMicrosoft_CodeAnalysis_Features_resources_dll from "./ja/Microsoft.CodeAnalysis.Features.resources.dll";
import jaMicrosoft_CodeAnalysis_Scripting_resources_dll from "./ja/Microsoft.CodeAnalysis.Scripting.resources.dll";
import jaMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./ja/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import jaMicrosoft_CodeAnalysis_resources_dll from "./ja/Microsoft.CodeAnalysis.resources.dll";
import koMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./ko/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import koMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./ko/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import koMicrosoft_CodeAnalysis_CSharp_resources_dll from "./ko/Microsoft.CodeAnalysis.CSharp.resources.dll";
import koMicrosoft_CodeAnalysis_Features_resources_dll from "./ko/Microsoft.CodeAnalysis.Features.resources.dll";
import koMicrosoft_CodeAnalysis_Scripting_resources_dll from "./ko/Microsoft.CodeAnalysis.Scripting.resources.dll";
import koMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./ko/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import koMicrosoft_CodeAnalysis_resources_dll from "./ko/Microsoft.CodeAnalysis.resources.dll";
import plMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./pl/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import plMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./pl/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import plMicrosoft_CodeAnalysis_CSharp_resources_dll from "./pl/Microsoft.CodeAnalysis.CSharp.resources.dll";
import plMicrosoft_CodeAnalysis_Features_resources_dll from "./pl/Microsoft.CodeAnalysis.Features.resources.dll";
import plMicrosoft_CodeAnalysis_Scripting_resources_dll from "./pl/Microsoft.CodeAnalysis.Scripting.resources.dll";
import plMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./pl/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import plMicrosoft_CodeAnalysis_resources_dll from "./pl/Microsoft.CodeAnalysis.resources.dll";
import pt_BRMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./pt-BR/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import pt_BRMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./pt-BR/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import pt_BRMicrosoft_CodeAnalysis_CSharp_resources_dll from "./pt-BR/Microsoft.CodeAnalysis.CSharp.resources.dll";
import pt_BRMicrosoft_CodeAnalysis_Features_resources_dll from "./pt-BR/Microsoft.CodeAnalysis.Features.resources.dll";
import pt_BRMicrosoft_CodeAnalysis_Scripting_resources_dll from "./pt-BR/Microsoft.CodeAnalysis.Scripting.resources.dll";
import pt_BRMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./pt-BR/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import pt_BRMicrosoft_CodeAnalysis_resources_dll from "./pt-BR/Microsoft.CodeAnalysis.resources.dll";
import ruMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./ru/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import ruMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./ru/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import ruMicrosoft_CodeAnalysis_CSharp_resources_dll from "./ru/Microsoft.CodeAnalysis.CSharp.resources.dll";
import ruMicrosoft_CodeAnalysis_Features_resources_dll from "./ru/Microsoft.CodeAnalysis.Features.resources.dll";
import ruMicrosoft_CodeAnalysis_Scripting_resources_dll from "./ru/Microsoft.CodeAnalysis.Scripting.resources.dll";
import ruMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./ru/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import ruMicrosoft_CodeAnalysis_resources_dll from "./ru/Microsoft.CodeAnalysis.resources.dll";
import trMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./tr/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import trMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./tr/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import trMicrosoft_CodeAnalysis_CSharp_resources_dll from "./tr/Microsoft.CodeAnalysis.CSharp.resources.dll";
import trMicrosoft_CodeAnalysis_Features_resources_dll from "./tr/Microsoft.CodeAnalysis.Features.resources.dll";
import trMicrosoft_CodeAnalysis_Scripting_resources_dll from "./tr/Microsoft.CodeAnalysis.Scripting.resources.dll";
import trMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./tr/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import trMicrosoft_CodeAnalysis_resources_dll from "./tr/Microsoft.CodeAnalysis.resources.dll";
import zh_HansMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./zh-Hans/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import zh_HansMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./zh-Hans/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import zh_HansMicrosoft_CodeAnalysis_CSharp_resources_dll from "./zh-Hans/Microsoft.CodeAnalysis.CSharp.resources.dll";
import zh_HansMicrosoft_CodeAnalysis_Features_resources_dll from "./zh-Hans/Microsoft.CodeAnalysis.Features.resources.dll";
import zh_HansMicrosoft_CodeAnalysis_Scripting_resources_dll from "./zh-Hans/Microsoft.CodeAnalysis.Scripting.resources.dll";
import zh_HansMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./zh-Hans/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import zh_HansMicrosoft_CodeAnalysis_resources_dll from "./zh-Hans/Microsoft.CodeAnalysis.resources.dll";
import zh_HantMicrosoft_CodeAnalysis_CSharp_Features_resources_dll from "./zh-Hant/Microsoft.CodeAnalysis.CSharp.Features.resources.dll";
import zh_HantMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll from "./zh-Hant/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll";
import zh_HantMicrosoft_CodeAnalysis_CSharp_resources_dll from "./zh-Hant/Microsoft.CodeAnalysis.CSharp.resources.dll";
import zh_HantMicrosoft_CodeAnalysis_Features_resources_dll from "./zh-Hant/Microsoft.CodeAnalysis.Features.resources.dll";
import zh_HantMicrosoft_CodeAnalysis_Scripting_resources_dll from "./zh-Hant/Microsoft.CodeAnalysis.Scripting.resources.dll";
import zh_HantMicrosoft_CodeAnalysis_Workspaces_resources_dll from "./zh-Hant/Microsoft.CodeAnalysis.Workspaces.resources.dll";
import zh_HantMicrosoft_CodeAnalysis_resources_dll from "./zh-Hant/Microsoft.CodeAnalysis.resources.dll";
var e=!1;const t=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,8,1,6,0,6,64,25,11,11])),o=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,15,1,13,0,65,1,253,15,65,2,253,15,253,128,2,11])),n=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11])),r=Symbol.for("wasm promise_control");function i(e,t){let o=null;const n=new Promise((function(n,r){o={isDone:!1,promise:null,resolve:t=>{o.isDone||(o.isDone=!0,n(t),e&&e())},reject:e=>{o.isDone||(o.isDone=!0,r(e),t&&t())}}}));o.promise=n;const i=n;return i[r]=o,{promise:i,promise_control:o}}function s(e){return e[r]}function a(e){e&&function(e){return void 0!==e[r]}(e)||Be(!1,"Promise is not controllable")}const l="__mono_message__",c=["debug","log","trace","warn","info","error"],d="MONO_WASM: ";let u,f,m,g,p,h;function w(e){g=e}function b(e){if(Pe.diagnosticTracing){const t="function"==typeof e?e():e;console.debug(d+t)}}function y(e,...t){console.info(d+e,...t)}function v(e,...t){console.info(e,...t)}function E(e,...t){console.warn(d+e,...t)}function _(e,...t){if(t&&t.length>0&&t[0]&&"object"==typeof t[0]){if(t[0].silent)return;if(t[0].toString)return void console.error(d+e,t[0].toString())}console.error(d+e,...t)}function x(e,t,o){return function(...n){try{let r=n[0];if(void 0===r)r="undefined";else if(null===r)r="null";else if("function"==typeof r)r=r.toString();else if("string"!=typeof r)try{r=JSON.stringify(r)}catch(e){r=r.toString()}t(o?JSON.stringify({method:e,payload:r,arguments:n.slice(1)}):[e+r,...n.slice(1)])}catch(e){m.error(`proxyConsole failed: ${e}`)}}}function j(e,t,o){f=t,g=e,m={...t};const n=`${o}/console`.replace("https://","wss://").replace("http://","ws://");u=new WebSocket(n),u.addEventListener("error",A),u.addEventListener("close",S),function(){for(const e of c)f[e]=x(`console.${e}`,T,!0)}()}function R(e){let t=30;const o=()=>{u?0==u.bufferedAmount||0==t?(e&&v(e),function(){for(const e of c)f[e]=x(`console.${e}`,m.log,!1)}(),u.removeEventListener("error",A),u.removeEventListener("close",S),u.close(1e3,e),u=void 0):(t--,globalThis.setTimeout(o,100)):e&&m&&m.log(e)};o()}function T(e){u&&u.readyState===WebSocket.OPEN?u.send(e):m.log(e)}function A(e){m.error(`[${g}] proxy console websocket error: ${e}`,e)}function S(e){m.debug(`[${g}] proxy console websocket closed: ${e}`,e)}function D(){Pe.preferredIcuAsset=O(Pe.config);let e="invariant"==Pe.config.globalizationMode;if(!e)if(Pe.preferredIcuAsset)Pe.diagnosticTracing&&b("ICU data archive(s) available, disabling invariant mode");else{if("custom"===Pe.config.globalizationMode||"all"===Pe.config.globalizationMode||"sharded"===Pe.config.globalizationMode){const e="invariant globalization mode is inactive and no ICU data archives are available";throw _(`ERROR: ${e}`),new Error(e)}Pe.diagnosticTracing&&b("ICU data archive(s) not available, using invariant globalization mode"),e=!0,Pe.preferredIcuAsset=null}const t="DOTNET_SYSTEM_GLOBALIZATION_INVARIANT",o=Pe.config.environmentVariables;if(void 0===o[t]&&e&&(o[t]="1"),void 0===o.TZ)try{const e=Intl.DateTimeFormat().resolvedOptions().timeZone||null;e&&(o.TZ=e)}catch(e){y("failed to detect timezone, will fallback to UTC")}}function O(e){var t;if((null===(t=e.resources)||void 0===t?void 0:t.icu)&&"invariant"!=e.globalizationMode){const t=e.applicationCulture||(ke?globalThis.navigator&&globalThis.navigator.languages&&globalThis.navigator.languages[0]:Intl.DateTimeFormat().resolvedOptions().locale),o=e.resources.icu;let n=null;if("custom"===e.globalizationMode){if(o.length>=1)return o[0].name}else t&&"all"!==e.globalizationMode?"sharded"===e.globalizationMode&&(n=function(e){const t=e.split("-")[0];return"en"===t||["fr","fr-FR","it","it-IT","de","de-DE","es","es-ES"].includes(e)?"icudt_EFIGS.dat":["zh","ko","ja"].includes(t)?"icudt_CJK.dat":"icudt_no_CJK.dat"}(t)):n="icudt.dat";if(n)for(let e=0;e<o.length;e++){const t=o[e];if(t.virtualPath===n)return t.name}}return e.globalizationMode="invariant",null}(new Date).valueOf();const C=class{constructor(e){this.url=e}toString(){return this.url}};async function k(e,t){try{const o="function"==typeof globalThis.fetch;if(Se){const n=e.startsWith("file://");if(!n&&o)return globalThis.fetch(e,t||{credentials:"same-origin"});p||(h=Ne.require("url"),p=Ne.require("fs")),n&&(e=h.fileURLToPath(e));const r=await p.promises.readFile(e);return{ok:!0,headers:{length:0,get:()=>null},url:e,arrayBuffer:()=>r,json:()=>JSON.parse(r),text:()=>{throw new Error("NotImplementedException")}}}if(o)return globalThis.fetch(e,t||{credentials:"same-origin"});if("function"==typeof read)return{ok:!0,url:e,headers:{length:0,get:()=>null},arrayBuffer:()=>new Uint8Array(read(e,"binary")),json:()=>JSON.parse(read(e,"utf8")),text:()=>read(e,"utf8")}}catch(t){return{ok:!1,url:e,status:500,headers:{length:0,get:()=>null},statusText:"ERR28: "+t,arrayBuffer:()=>{throw t},json:()=>{throw t},text:()=>{throw t}}}throw new Error("No fetch implementation available")}function I(e){return"string"!=typeof e&&Be(!1,"url must be a string"),!M(e)&&0!==e.indexOf("./")&&0!==e.indexOf("../")&&globalThis.URL&&globalThis.document&&globalThis.document.baseURI&&(e=new URL(e,globalThis.document.baseURI).toString()),e}const U=/^[a-zA-Z][a-zA-Z\d+\-.]*?:\/\//,P=/[a-zA-Z]:[\\/]/;function M(e){return Se||Ie?e.startsWith("/")||e.startsWith("\\")||-1!==e.indexOf("///")||P.test(e):U.test(e)}let L,N=0;const $=[],z=[],W=new Map,F={"js-module-threads":!0,"js-module-runtime":!0,"js-module-dotnet":!0,"js-module-native":!0,"js-module-diagnostics":!0},B={...F,"js-module-library-initializer":!0},V={...F,dotnetwasm:!0,heap:!0,manifest:!0},q={...B,manifest:!0},H={...B,dotnetwasm:!0},J={dotnetwasm:!0,symbols:!0},Z={...B,dotnetwasm:!0,symbols:!0},Q={symbols:!0};function G(e){return!("icu"==e.behavior&&e.name!=Pe.preferredIcuAsset)}function K(e,t,o){null!=t||(t=[]),Be(1==t.length,`Expect to have one ${o} asset in resources`);const n=t[0];return n.behavior=o,X(n),e.push(n),n}function X(e){V[e.behavior]&&W.set(e.behavior,e)}function Y(e){Be(V[e],`Unknown single asset behavior ${e}`);const t=W.get(e);if(t&&!t.resolvedUrl)if(t.resolvedUrl=Pe.locateFile(t.name),F[t.behavior]){const e=ge(t);e?("string"!=typeof e&&Be(!1,"loadBootResource response for 'dotnetjs' type should be a URL string"),t.resolvedUrl=e):t.resolvedUrl=ce(t.resolvedUrl,t.behavior)}else if("dotnetwasm"!==t.behavior)throw new Error(`Unknown single asset behavior ${e}`);return t}function ee(e){const t=Y(e);return Be(t,`Single asset for ${e} not found`),t}let te=!1;async function oe(){if(!te){te=!0,Pe.diagnosticTracing&&b("mono_download_assets");try{const e=[],t=[],o=(e,t)=>{!Z[e.behavior]&&G(e)&&Pe.expected_instantiated_assets_count++,!H[e.behavior]&&G(e)&&(Pe.expected_downloaded_assets_count++,t.push(se(e)))};for(const t of $)o(t,e);for(const e of z)o(e,t);Pe.allDownloadsQueued.promise_control.resolve(),Promise.all([...e,...t]).then((()=>{Pe.allDownloadsFinished.promise_control.resolve()})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e})),await Pe.runtimeModuleLoaded.promise;const n=async e=>{const t=await e;if(t.buffer){if(!Z[t.behavior]){t.buffer&&"object"==typeof t.buffer||Be(!1,"asset buffer must be array-like or buffer-like or promise of these"),"string"!=typeof t.resolvedUrl&&Be(!1,"resolvedUrl must be string");const e=t.resolvedUrl,o=await t.buffer,n=new Uint8Array(o);pe(t),await Ue.beforeOnRuntimeInitialized.promise,Ue.instantiate_asset(t,e,n)}}else J[t.behavior]?("symbols"===t.behavior&&(await Ue.instantiate_symbols_asset(t),pe(t)),J[t.behavior]&&++Pe.actual_downloaded_assets_count):(t.isOptional||Be(!1,"Expected asset to have the downloaded buffer"),!H[t.behavior]&&G(t)&&Pe.expected_downloaded_assets_count--,!Z[t.behavior]&&G(t)&&Pe.expected_instantiated_assets_count--)},r=[],i=[];for(const t of e)r.push(n(t));for(const e of t)i.push(n(e));Promise.all(r).then((()=>{Ce||Ue.coreAssetsInMemory.promise_control.resolve()})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e})),Promise.all(i).then((async()=>{Ce||(await Ue.coreAssetsInMemory.promise,Ue.allAssetsInMemory.promise_control.resolve())})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e}))}catch(e){throw Pe.err("Error in mono_download_assets: "+e),e}}}let ne=!1;function re(){if(ne)return;ne=!0;const e=Pe.config,t=[];if(e.assets)for(const t of e.assets)"object"!=typeof t&&Be(!1,`asset must be object, it was ${typeof t} : ${t}`),"string"!=typeof t.behavior&&Be(!1,"asset behavior must be known string"),"string"!=typeof t.name&&Be(!1,"asset name must be string"),t.resolvedUrl&&"string"!=typeof t.resolvedUrl&&Be(!1,"asset resolvedUrl could be string"),t.hash&&"string"!=typeof t.hash&&Be(!1,"asset resolvedUrl could be string"),t.pendingDownload&&"object"!=typeof t.pendingDownload&&Be(!1,"asset pendingDownload could be object"),t.isCore?$.push(t):z.push(t),X(t);else if(e.resources){const o=e.resources;o.wasmNative||Be(!1,"resources.wasmNative must be defined"),o.jsModuleNative||Be(!1,"resources.jsModuleNative must be defined"),o.jsModuleRuntime||Be(!1,"resources.jsModuleRuntime must be defined"),K(z,o.wasmNative,"dotnetwasm"),K(t,o.jsModuleNative,"js-module-native"),K(t,o.jsModuleRuntime,"js-module-runtime"),o.jsModuleDiagnostics&&K(t,o.jsModuleDiagnostics,"js-module-diagnostics");const n=(e,t,o)=>{const n=e;n.behavior=t,o?(n.isCore=!0,$.push(n)):z.push(n)};if(o.coreAssembly)for(let e=0;e<o.coreAssembly.length;e++)n(o.coreAssembly[e],"assembly",!0);if(o.assembly)for(let e=0;e<o.assembly.length;e++)n(o.assembly[e],"assembly",!o.coreAssembly);if(0!=e.debugLevel&&Pe.isDebuggingSupported()){if(o.corePdb)for(let e=0;e<o.corePdb.length;e++)n(o.corePdb[e],"pdb",!0);if(o.pdb)for(let e=0;e<o.pdb.length;e++)n(o.pdb[e],"pdb",!o.corePdb)}if(e.loadAllSatelliteResources&&o.satelliteResources)for(const e in o.satelliteResources)for(let t=0;t<o.satelliteResources[e].length;t++){const r=o.satelliteResources[e][t];r.culture=e,n(r,"resource",!o.coreAssembly)}if(o.coreVfs)for(let e=0;e<o.coreVfs.length;e++)n(o.coreVfs[e],"vfs",!0);if(o.vfs)for(let e=0;e<o.vfs.length;e++)n(o.vfs[e],"vfs",!o.coreVfs);const r=O(e);if(r&&o.icu)for(let e=0;e<o.icu.length;e++){const t=o.icu[e];t.name===r&&n(t,"icu",!1)}if(o.wasmSymbols)for(let e=0;e<o.wasmSymbols.length;e++)n(o.wasmSymbols[e],"symbols",!1)}if(e.appsettings)for(let t=0;t<e.appsettings.length;t++){const o=e.appsettings[t],n=he(o);"appsettings.json"!==n&&n!==`appsettings.${e.applicationEnvironment}.json`||z.push({name:o,behavior:"vfs",cache:"no-cache",useCredentials:!0})}e.assets=[...$,...z,...t]}async function ie(e){const t=await se(e);return await t.pendingDownloadInternal.response,t.buffer}async function se(e){try{return await ae(e)}catch(t){if(!Pe.enableDownloadRetry)throw t;if(Ie||Se)throw t;if(e.pendingDownload&&e.pendingDownloadInternal==e.pendingDownload)throw t;if(e.resolvedUrl&&-1!=e.resolvedUrl.indexOf("file://"))throw t;if(t&&404==t.status)throw t;e.pendingDownloadInternal=void 0,await Pe.allDownloadsQueued.promise;try{return Pe.diagnosticTracing&&b(`Retrying download '${e.name}'`),await ae(e)}catch(t){return e.pendingDownloadInternal=void 0,await new Promise((e=>globalThis.setTimeout(e,100))),Pe.diagnosticTracing&&b(`Retrying download (2) '${e.name}' after delay`),await ae(e)}}}async function ae(e){for(;L;)await L.promise;try{++N,N==Pe.maxParallelDownloads&&(Pe.diagnosticTracing&&b("Throttling further parallel downloads"),L=i());const t=await async function(e){if(e.pendingDownload&&(e.pendingDownloadInternal=e.pendingDownload),e.pendingDownloadInternal&&e.pendingDownloadInternal.response)return e.pendingDownloadInternal.response;if(e.buffer){const t=await e.buffer;return e.resolvedUrl||(e.resolvedUrl="undefined://"+e.name),e.pendingDownloadInternal={url:e.resolvedUrl,name:e.name,response:Promise.resolve({ok:!0,arrayBuffer:()=>t,json:()=>JSON.parse(new TextDecoder("utf-8").decode(t)),text:()=>{throw new Error("NotImplementedException")},headers:{get:()=>{}}})},e.pendingDownloadInternal.response}const t=e.loadRemote&&Pe.config.remoteSources?Pe.config.remoteSources:[""];let o;for(let n of t){n=n.trim(),"./"===n&&(n="");const t=le(e,n);e.name===t?Pe.diagnosticTracing&&b(`Attempting to download '${t}'`):Pe.diagnosticTracing&&b(`Attempting to download '${t}' for ${e.name}`);try{e.resolvedUrl=t;const n=fe(e);if(e.pendingDownloadInternal=n,o=await n.response,!o||!o.ok)continue;return o}catch(e){o||(o={ok:!1,url:t,status:0,statusText:""+e});continue}}const n=e.isOptional||e.name.match(/\.pdb$/)&&Pe.config.ignorePdbLoadErrors;if(o||Be(!1,`Response undefined ${e.name}`),!n){const t=new Error(`download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`);throw t.status=o.status,t}y(`optional download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`)}(e);return t?(J[e.behavior]||(e.buffer=await t.arrayBuffer(),++Pe.actual_downloaded_assets_count),e):e}finally{if(--N,L&&N==Pe.maxParallelDownloads-1){Pe.diagnosticTracing&&b("Resuming more parallel downloads");const e=L;L=void 0,e.promise_control.resolve()}}}function le(e,t){let o;return null==t&&Be(!1,`sourcePrefix must be provided for ${e.name}`),e.resolvedUrl?o=e.resolvedUrl:(o=""===t?"assembly"===e.behavior||"pdb"===e.behavior?e.name:"resource"===e.behavior&&e.culture&&""!==e.culture?`${e.culture}/${e.name}`:e.name:t+e.name,o=ce(Pe.locateFile(o),e.behavior)),o&&"string"==typeof o||Be(!1,"attemptUrl need to be path or url string"),o}function ce(e,t){return Pe.modulesUniqueQuery&&q[t]&&(e+=Pe.modulesUniqueQuery),e}let de=0;const ue=new Set;function fe(e){try{e.resolvedUrl||Be(!1,"Request's resolvedUrl must be set");const t=function(e){let t=e.resolvedUrl;if(Pe.loadBootResource){const o=ge(e);if(o instanceof Promise)return o;"string"==typeof o&&(t=o)}const o={};return e.cache?o.cache=e.cache:Pe.config.disableNoCacheFetch||(o.cache="no-cache"),e.useCredentials?o.credentials="include":!Pe.config.disableIntegrityCheck&&e.hash&&(o.integrity=e.hash),Pe.fetch_like(t,o)}(e),o={name:e.name,url:e.resolvedUrl,response:t};return ue.add(e.name),o.response.then((()=>{"assembly"==e.behavior&&Pe.loadedAssemblies.push(e.name),de++,Pe.onDownloadResourceProgress&&Pe.onDownloadResourceProgress(de,ue.size)})),o}catch(t){const o={ok:!1,url:e.resolvedUrl,status:500,statusText:"ERR29: "+t,arrayBuffer:()=>{throw t},json:()=>{throw t}};return{name:e.name,url:e.resolvedUrl,response:Promise.resolve(o)}}}const me={resource:"assembly",assembly:"assembly",pdb:"pdb",icu:"globalization",vfs:"configuration",manifest:"manifest",dotnetwasm:"dotnetwasm","js-module-dotnet":"dotnetjs","js-module-native":"dotnetjs","js-module-runtime":"dotnetjs","js-module-threads":"dotnetjs"};function ge(e){var t;if(Pe.loadBootResource){const o=null!==(t=e.hash)&&void 0!==t?t:"",n=e.resolvedUrl,r=me[e.behavior];if(r){const t=Pe.loadBootResource(r,e.name,n,o,e.behavior);return"string"==typeof t?I(t):t}}}function pe(e){e.pendingDownloadInternal=null,e.pendingDownload=null,e.buffer=null,e.moduleExports=null}function he(e){let t=e.lastIndexOf("/");return t>=0&&t++,e.substring(t)}async function we(e){e&&await Promise.all((null!=e?e:[]).map((e=>async function(e){try{const t=e.name;if(!e.moduleExports){const o=ce(Pe.locateFile(t),"js-module-library-initializer");Pe.diagnosticTracing&&b(`Attempting to import '${o}' for ${e}`),e.moduleExports=await import(/*! webpackIgnore: true */o)}Pe.libraryInitializers.push({scriptName:t,exports:e.moduleExports})}catch(t){E(`Failed to import library initializer '${e}': ${t}`)}}(e))))}async function be(e,t){if(!Pe.libraryInitializers)return;const o=[];for(let n=0;n<Pe.libraryInitializers.length;n++){const r=Pe.libraryInitializers[n];r.exports[e]&&o.push(ye(r.scriptName,e,(()=>r.exports[e](...t))))}await Promise.all(o)}async function ye(e,t,o){try{await o()}catch(o){throw E(`Failed to invoke '${t}' on library initializer '${e}': ${o}`),Xe(1,o),o}}function ve(e,t){if(e===t)return e;const o={...t};return void 0!==o.assets&&o.assets!==e.assets&&(o.assets=[...e.assets||[],...o.assets||[]]),void 0!==o.resources&&(o.resources=_e(e.resources||{assembly:[],jsModuleNative:[],jsModuleRuntime:[],wasmNative:[]},o.resources)),void 0!==o.environmentVariables&&(o.environmentVariables={...e.environmentVariables||{},...o.environmentVariables||{}}),void 0!==o.runtimeOptions&&o.runtimeOptions!==e.runtimeOptions&&(o.runtimeOptions=[...e.runtimeOptions||[],...o.runtimeOptions||[]]),Object.assign(e,o)}function Ee(e,t){if(e===t)return e;const o={...t};return o.config&&(e.config||(e.config={}),o.config=ve(e.config,o.config)),Object.assign(e,o)}function _e(e,t){if(e===t)return e;const o={...t};return void 0!==o.coreAssembly&&(o.coreAssembly=[...e.coreAssembly||[],...o.coreAssembly||[]]),void 0!==o.assembly&&(o.assembly=[...e.assembly||[],...o.assembly||[]]),void 0!==o.lazyAssembly&&(o.lazyAssembly=[...e.lazyAssembly||[],...o.lazyAssembly||[]]),void 0!==o.corePdb&&(o.corePdb=[...e.corePdb||[],...o.corePdb||[]]),void 0!==o.pdb&&(o.pdb=[...e.pdb||[],...o.pdb||[]]),void 0!==o.jsModuleWorker&&(o.jsModuleWorker=[...e.jsModuleWorker||[],...o.jsModuleWorker||[]]),void 0!==o.jsModuleNative&&(o.jsModuleNative=[...e.jsModuleNative||[],...o.jsModuleNative||[]]),void 0!==o.jsModuleDiagnostics&&(o.jsModuleDiagnostics=[...e.jsModuleDiagnostics||[],...o.jsModuleDiagnostics||[]]),void 0!==o.jsModuleRuntime&&(o.jsModuleRuntime=[...e.jsModuleRuntime||[],...o.jsModuleRuntime||[]]),void 0!==o.wasmSymbols&&(o.wasmSymbols=[...e.wasmSymbols||[],...o.wasmSymbols||[]]),void 0!==o.wasmNative&&(o.wasmNative=[...e.wasmNative||[],...o.wasmNative||[]]),void 0!==o.icu&&(o.icu=[...e.icu||[],...o.icu||[]]),void 0!==o.satelliteResources&&(o.satelliteResources=function(e,t){if(e===t)return e;for(const o in t)e[o]=[...e[o]||[],...t[o]||[]];return e}(e.satelliteResources||{},o.satelliteResources||{})),void 0!==o.modulesAfterConfigLoaded&&(o.modulesAfterConfigLoaded=[...e.modulesAfterConfigLoaded||[],...o.modulesAfterConfigLoaded||[]]),void 0!==o.modulesAfterRuntimeReady&&(o.modulesAfterRuntimeReady=[...e.modulesAfterRuntimeReady||[],...o.modulesAfterRuntimeReady||[]]),void 0!==o.extensions&&(o.extensions={...e.extensions||{},...o.extensions||{}}),void 0!==o.vfs&&(o.vfs=[...e.vfs||[],...o.vfs||[]]),Object.assign(e,o)}function xe(){const e=Pe.config;if(e.environmentVariables=e.environmentVariables||{},e.runtimeOptions=e.runtimeOptions||[],e.resources=e.resources||{assembly:[],jsModuleNative:[],jsModuleWorker:[],jsModuleRuntime:[],wasmNative:[],vfs:[],satelliteResources:{}},e.assets){Pe.diagnosticTracing&&b("config.assets is deprecated, use config.resources instead");for(const t of e.assets){const o={};switch(t.behavior){case"assembly":o.assembly=[t];break;case"pdb":o.pdb=[t];break;case"resource":o.satelliteResources={},o.satelliteResources[t.culture]=[t];break;case"icu":o.icu=[t];break;case"symbols":o.wasmSymbols=[t];break;case"vfs":o.vfs=[t];break;case"dotnetwasm":o.wasmNative=[t];break;case"js-module-threads":o.jsModuleWorker=[t];break;case"js-module-runtime":o.jsModuleRuntime=[t];break;case"js-module-native":o.jsModuleNative=[t];break;case"js-module-diagnostics":o.jsModuleDiagnostics=[t];break;case"js-module-dotnet":break;default:throw new Error(`Unexpected behavior ${t.behavior} of asset ${t.name}`)}_e(e.resources,o)}}e.debugLevel,e.applicationEnvironment||(e.applicationEnvironment="Production"),e.applicationCulture&&(e.environmentVariables.LANG=`${e.applicationCulture}.UTF-8`),Ue.diagnosticTracing=Pe.diagnosticTracing=!!e.diagnosticTracing,Ue.waitForDebugger=e.waitForDebugger,Pe.maxParallelDownloads=e.maxParallelDownloads||Pe.maxParallelDownloads,Pe.enableDownloadRetry=void 0!==e.enableDownloadRetry?e.enableDownloadRetry:Pe.enableDownloadRetry}let je=!1;async function Re(e){var t;if(je)return void await Pe.afterConfigLoaded.promise;let o;try{if(e.configSrc||Pe.config&&0!==Object.keys(Pe.config).length&&(Pe.config.assets||Pe.config.resources)||(e.configSrc="dotnet.boot.js"),o=e.configSrc,je=!0,o&&(Pe.diagnosticTracing&&b("mono_wasm_load_config"),await async function(e){const t=e.configSrc,o=Pe.locateFile(t);let n=null;void 0!==Pe.loadBootResource&&(n=Pe.loadBootResource("manifest",t,o,"","manifest"));let r,i=null;if(n)if("string"==typeof n)n.includes(".json")?(i=await s(I(n)),r=await Ae(i)):r=(await import(I(n))).config;else{const e=await n;"function"==typeof e.json?(i=e,r=await Ae(i)):r=e.config}else o.includes(".json")?(i=await s(ce(o,"manifest")),r=await Ae(i)):r=(await import(ce(o,"manifest"))).config;function s(e){return Pe.fetch_like(e,{method:"GET",credentials:"include",cache:"no-cache"})}Pe.config.applicationEnvironment&&(r.applicationEnvironment=Pe.config.applicationEnvironment),ve(Pe.config,r)}(e)),xe(),await we(null===(t=Pe.config.resources)||void 0===t?void 0:t.modulesAfterConfigLoaded),await be("onRuntimeConfigLoaded",[Pe.config]),e.onConfigLoaded)try{await e.onConfigLoaded(Pe.config,Le),xe()}catch(e){throw _("onConfigLoaded() failed",e),e}xe(),Pe.afterConfigLoaded.promise_control.resolve(Pe.config)}catch(t){const n=`Failed to load config file ${o} ${t} ${null==t?void 0:t.stack}`;throw Pe.config=e.config=Object.assign(Pe.config,{message:n,error:t,isError:!0}),Xe(1,new Error(n)),t}}function Te(){return!!globalThis.navigator&&(Pe.isChromium||Pe.isFirefox)}async function Ae(e){const t=Pe.config,o=await e.json();t.applicationEnvironment||o.applicationEnvironment||(o.applicationEnvironment=e.headers.get("Blazor-Environment")||e.headers.get("DotNet-Environment")||void 0),o.environmentVariables||(o.environmentVariables={});const n=e.headers.get("DOTNET-MODIFIABLE-ASSEMBLIES");n&&(o.environmentVariables.DOTNET_MODIFIABLE_ASSEMBLIES=n);const r=e.headers.get("ASPNETCORE-BROWSER-TOOLS");return r&&(o.environmentVariables.__ASPNETCORE_BROWSER_TOOLS=r),o}"function"!=typeof importScripts||globalThis.onmessage||(globalThis.dotnetSidecar=!0);const Se="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,De="function"==typeof importScripts,Oe=De&&"undefined"!=typeof dotnetSidecar,Ce=De&&!Oe,ke="object"==typeof window||De&&!Se,Ie=!ke&&!Se;let Ue={},Pe={},Me={},Le={},Ne={},$e=!1;const ze={},We={config:ze},Fe={mono:{},binding:{},internal:Ne,module:We,loaderHelpers:Pe,runtimeHelpers:Ue,diagnosticHelpers:Me,api:Le};function Be(e,t){if(e)return;const o="Assert failed: "+("function"==typeof t?t():t),n=new Error(o);_(o,n),Ue.nativeAbort(n)}function Ve(){return void 0!==Pe.exitCode}function qe(){return Ue.runtimeReady&&!Ve()}function He(){Ve()&&Be(!1,`.NET runtime already exited with ${Pe.exitCode} ${Pe.exitReason}. You can use runtime.runMain() which doesn't exit the runtime.`),Ue.runtimeReady||Be(!1,".NET runtime didn't start yet. Please call dotnet.create() first.")}function Je(){ke&&(globalThis.addEventListener("unhandledrejection",et),globalThis.addEventListener("error",tt))}let Ze,Qe;function Ge(e){Qe&&Qe(e),Xe(e,Pe.exitReason)}function Ke(e){Ze&&Ze(e||Pe.exitReason),Xe(1,e||Pe.exitReason)}function Xe(t,o){var n,r;const i=o&&"object"==typeof o;t=i&&"number"==typeof o.status?o.status:void 0===t?-1:t;const s=i&&"string"==typeof o.message?o.message:""+o;(o=i?o:Ue.ExitStatus?function(e,t){const o=new Ue.ExitStatus(e);return o.message=t,o.toString=()=>t,o}(t,s):new Error("Exit with code "+t+" "+s)).status=t,o.message||(o.message=s);const a=""+(o.stack||(new Error).stack);try{Object.defineProperty(o,"stack",{get:()=>a})}catch(e){}const l=!!o.silent;if(o.silent=!0,Ve())Pe.diagnosticTracing&&b("mono_exit called after exit");else{try{We.onAbort==Ke&&(We.onAbort=Ze),We.onExit==Ge&&(We.onExit=Qe),ke&&(globalThis.removeEventListener("unhandledrejection",et),globalThis.removeEventListener("error",tt)),Ue.runtimeReady?(Ue.jiterpreter_dump_stats&&Ue.jiterpreter_dump_stats(!1),0===t&&(null===(n=Pe.config)||void 0===n?void 0:n.interopCleanupOnExit)&&Ue.forceDisposeProxies(!0,!0),e&&0!==t&&(null===(r=Pe.config)||void 0===r||r.dumpThreadsOnNonZeroExit)):(Pe.diagnosticTracing&&b(`abort_startup, reason: ${o}`),function(e){Pe.allDownloadsQueued.promise_control.reject(e),Pe.allDownloadsFinished.promise_control.reject(e),Pe.afterConfigLoaded.promise_control.reject(e),Pe.wasmCompilePromise.promise_control.reject(e),Pe.runtimeModuleLoaded.promise_control.reject(e),Ue.dotnetReady&&(Ue.dotnetReady.promise_control.reject(e),Ue.afterInstantiateWasm.promise_control.reject(e),Ue.beforePreInit.promise_control.reject(e),Ue.afterPreInit.promise_control.reject(e),Ue.afterPreRun.promise_control.reject(e),Ue.beforeOnRuntimeInitialized.promise_control.reject(e),Ue.afterOnRuntimeInitialized.promise_control.reject(e),Ue.afterPostRun.promise_control.reject(e))}(o))}catch(e){E("mono_exit A failed",e)}try{l||(function(e,t){if(0!==e&&t){const e=Ue.ExitStatus&&t instanceof Ue.ExitStatus?b:_;"string"==typeof t?e(t):(void 0===t.stack&&(t.stack=(new Error).stack+""),t.message?e(Ue.stringify_as_error_with_stack?Ue.stringify_as_error_with_stack(t.message+"\n"+t.stack):t.message+"\n"+t.stack):e(JSON.stringify(t)))}!Ce&&Pe.config&&(Pe.config.logExitCode?Pe.config.forwardConsoleLogsToWS?R("WASM EXIT "+e):v("WASM EXIT "+e):Pe.config.forwardConsoleLogsToWS&&R())}(t,o),function(e){if(ke&&!Ce&&Pe.config&&Pe.config.appendElementOnExit&&document){const t=document.createElement("label");t.id="tests_done",0!==e&&(t.style.background="red"),t.innerHTML=""+e,document.body.appendChild(t)}}(t))}catch(e){E("mono_exit B failed",e)}Pe.exitCode=t,Pe.exitReason||(Pe.exitReason=o),!Ce&&Ue.runtimeReady&&We.runtimeKeepalivePop()}if(Pe.config&&Pe.config.asyncFlushOnExit&&0===t)throw(async()=>{try{await async function(){try{const e=await import(/*! webpackIgnore: true */"process"),t=e=>new Promise(((t,o)=>{e.on("error",o),e.end("","utf8",t)})),o=t(e.stderr),n=t(e.stdout);let r;const i=new Promise((e=>{r=setTimeout((()=>e("timeout")),1e3)}));await Promise.race([Promise.all([n,o]),i]),clearTimeout(r)}catch(e){_(`flushing std* streams failed: ${e}`)}}()}finally{Ye(t,o)}})(),o;Ye(t,o)}function Ye(e,t){if(Ue.runtimeReady&&Ue.nativeExit)try{Ue.nativeExit(e)}catch(e){!Ue.ExitStatus||e instanceof Ue.ExitStatus||E("set_exit_code_and_quit_now failed: "+e.toString())}if(0!==e||!ke)throw Se&&Ne.process?Ne.process.exit(e):Ue.quit&&Ue.quit(e,t),t}function et(e){ot(e,e.reason,"rejection")}function tt(e){ot(e,e.error,"error")}function ot(e,t,o){e.preventDefault();try{t||(t=new Error("Unhandled "+o)),void 0===t.stack&&(t.stack=(new Error).stack),t.stack=t.stack+"",t.silent||(_("Unhandled error:",t),Xe(1,t))}catch(e){}}!function(e){if($e)throw new Error("Loader module already loaded");$e=!0,Ue=e.runtimeHelpers,Pe=e.loaderHelpers,Me=e.diagnosticHelpers,Le=e.api,Ne=e.internal,Object.assign(Le,{INTERNAL:Ne,invokeLibraryInitializers:be}),Object.assign(e.module,{config:ve(ze,{environmentVariables:{}})});const r={mono_wasm_bindings_is_ready:!1,config:e.module.config,diagnosticTracing:!1,nativeAbort:e=>{throw e||new Error("abort")},nativeExit:e=>{throw new Error("exit:"+e)}},l={gitHash:"a612c2a1056fe3265387ae3ff7c94eba1505caf9",config:e.module.config,diagnosticTracing:!1,maxParallelDownloads:16,enableDownloadRetry:!0,_loaded_files:[],loadedFiles:[],loadedAssemblies:[],libraryInitializers:[],workerNextNumber:1,actual_downloaded_assets_count:0,actual_instantiated_assets_count:0,expected_downloaded_assets_count:0,expected_instantiated_assets_count:0,afterConfigLoaded:i(),allDownloadsQueued:i(),allDownloadsFinished:i(),wasmCompilePromise:i(),runtimeModuleLoaded:i(),loadingWorkers:i(),is_exited:Ve,is_runtime_running:qe,assert_runtime_running:He,mono_exit:Xe,createPromiseController:i,getPromiseController:s,assertIsControllablePromise:a,mono_download_assets:oe,resolve_single_asset_path:ee,setup_proxy_console:j,set_thread_prefix:w,installUnhandledErrorHandler:Je,retrieve_asset_download:ie,invokeLibraryInitializers:be,isDebuggingSupported:Te,exceptions:t,simd:n,relaxedSimd:o};Object.assign(Ue,r),Object.assign(Pe,l)}(Fe);let nt,rt,it,st=!1,at=!1;async function lt(e){if(!at){if(at=!0,ke&&Pe.config.forwardConsoleLogsToWS&&void 0!==globalThis.WebSocket&&j("main",globalThis.console,globalThis.location.origin),We||Be(!1,"Null moduleConfig"),Pe.config||Be(!1,"Null moduleConfig.config"),"function"==typeof e){const t=e(Fe.api);if(t.ready)throw new Error("Module.ready couldn't be redefined.");Object.assign(We,t),Ee(We,t)}else{if("object"!=typeof e)throw new Error("Can't use moduleFactory callback of createDotnetRuntime function.");Ee(We,e)}await async function(e){if(Se){const e=await import(/*! webpackIgnore: true */"process"),t=14;if(e.versions.node.split(".")[0]<t)throw new Error(`NodeJS at '${e.execPath}' has too low version '${e.versions.node}', please use at least ${t}. See also https://aka.ms/dotnet-wasm-features`)}const t=/*! webpackIgnore: true */import.meta.url,o=t.indexOf("?");var n;if(o>0&&(Pe.modulesUniqueQuery=t.substring(o)),Pe.scriptUrl=t.replace(/\\/g,"/").replace(/[?#].*/,""),Pe.scriptDirectory=(n=Pe.scriptUrl).slice(0,n.lastIndexOf("/"))+"/",Pe.locateFile=e=>"URL"in globalThis&&globalThis.URL!==C?new URL(e,Pe.scriptDirectory).toString():M(e)?e:Pe.scriptDirectory+e,Pe.fetch_like=k,Pe.out=console.log,Pe.err=console.error,Pe.onDownloadResourceProgress=e.onDownloadResourceProgress,ke&&globalThis.navigator){const e=globalThis.navigator,t=e.userAgentData&&e.userAgentData.brands;t&&t.length>0?Pe.isChromium=t.some((e=>"Google Chrome"===e.brand||"Microsoft Edge"===e.brand||"Chromium"===e.brand)):e.userAgent&&(Pe.isChromium=e.userAgent.includes("Chrome"),Pe.isFirefox=e.userAgent.includes("Firefox"))}Ne.require=Se?await import(/*! webpackIgnore: true */"module").then((e=>e.createRequire(/*! webpackIgnore: true */import.meta.url))):Promise.resolve((()=>{throw new Error("require not supported")})),void 0===globalThis.URL&&(globalThis.URL=C)}(We)}}async function ct(e){return await lt(e),Ze=We.onAbort,Qe=We.onExit,We.onAbort=Ke,We.onExit=Ge,We.ENVIRONMENT_IS_PTHREAD?async function(){(function(){const e=new MessageChannel,t=e.port1,o=e.port2;t.addEventListener("message",(e=>{var n,r;n=JSON.parse(e.data.config),r=JSON.parse(e.data.monoThreadInfo),st?Pe.diagnosticTracing&&b("mono config already received"):(ve(Pe.config,n),Ue.monoThreadInfo=r,xe(),Pe.diagnosticTracing&&b("mono config received"),st=!0,Pe.afterConfigLoaded.promise_control.resolve(Pe.config),ke&&n.forwardConsoleLogsToWS&&void 0!==globalThis.WebSocket&&Pe.setup_proxy_console("worker-idle",console,globalThis.location.origin)),t.close(),o.close()}),{once:!0}),t.start(),self.postMessage({[l]:{monoCmd:"preload",port:o}},[o])})(),await Pe.afterConfigLoaded.promise,function(){const e=Pe.config;e.assets||Be(!1,"config.assets must be defined");for(const t of e.assets)X(t),Q[t.behavior]&&z.push(t)}(),setTimeout((async()=>{try{await oe()}catch(e){Xe(1,e)}}),0);const e=dt(),t=await Promise.all(e);return await ut(t),We}():async function(){var e;await Re(We),re();const t=dt();(async function(){try{const e=ee("dotnetwasm");await se(e),e&&e.pendingDownloadInternal&&e.pendingDownloadInternal.response||Be(!1,"Can't load dotnet.native.wasm");const t=await e.pendingDownloadInternal.response,o=t.headers&&t.headers.get?t.headers.get("Content-Type"):void 0;let n;if("function"==typeof WebAssembly.compileStreaming&&"application/wasm"===o)n=await WebAssembly.compileStreaming(t);else{ke&&"application/wasm"!==o&&E('WebAssembly resource does not have the expected content type "application/wasm", so falling back to slower ArrayBuffer instantiation.');const e=await t.arrayBuffer();Pe.diagnosticTracing&&b("instantiate_wasm_module buffered"),n=Ie?await Promise.resolve(new WebAssembly.Module(e)):await WebAssembly.compile(e)}e.pendingDownloadInternal=null,e.pendingDownload=null,e.buffer=null,e.moduleExports=null,Pe.wasmCompilePromise.promise_control.resolve(n)}catch(e){Pe.wasmCompilePromise.promise_control.reject(e)}})(),setTimeout((async()=>{try{D(),await oe()}catch(e){Xe(1,e)}}),0);const o=await Promise.all(t);return await ut(o),await Ue.dotnetReady.promise,await we(null===(e=Pe.config.resources)||void 0===e?void 0:e.modulesAfterRuntimeReady),await be("onRuntimeReady",[Fe.api]),Le}()}function dt(){const e=ee("js-module-runtime"),t=ee("js-module-native");if(nt&&rt)return[nt,rt,it];"object"==typeof e.moduleExports?nt=e.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${e.resolvedUrl}' for ${e.name}`),nt=import(/*! webpackIgnore: true */e.resolvedUrl)),"object"==typeof t.moduleExports?rt=t.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${t.resolvedUrl}' for ${t.name}`),rt=import(/*! webpackIgnore: true */t.resolvedUrl));const o=Y("js-module-diagnostics");return o&&("object"==typeof o.moduleExports?it=o.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${o.resolvedUrl}' for ${o.name}`),it=import(/*! webpackIgnore: true */o.resolvedUrl))),[nt,rt,it]}async function ut(e){const{initializeExports:t,initializeReplacements:o,configureRuntimeStartup:n,configureEmscriptenStartup:r,configureWorkerStartup:i,setRuntimeGlobals:s,passEmscriptenInternals:a}=e[0],{default:l}=e[1],c=e[2];s(Fe),t(Fe),c&&c.setRuntimeGlobals(Fe),await n(We),Pe.runtimeModuleLoaded.promise_control.resolve(),l((e=>(Object.assign(We,{ready:e.ready,__dotnet_runtime:{initializeReplacements:o,configureEmscriptenStartup:r,configureWorkerStartup:i,passEmscriptenInternals:a}}),We))).catch((e=>{if(e.message&&e.message.toLowerCase().includes("out of memory"))throw new Error(".NET runtime has failed to start, because too much memory was requested. Please decrease the memory by adjusting EmccMaximumHeapSize. See also https://aka.ms/dotnet-wasm-features");throw e}))}const ft=new class{withModuleConfig(e){try{return Ee(We,e),this}catch(e){throw Xe(1,e),e}}withOnConfigLoaded(e){try{return Ee(We,{onConfigLoaded:e}),this}catch(e){throw Xe(1,e),e}}withConsoleForwarding(){try{return ve(ze,{forwardConsoleLogsToWS:!0}),this}catch(e){throw Xe(1,e),e}}withExitOnUnhandledError(){try{return ve(ze,{exitOnUnhandledError:!0}),Je(),this}catch(e){throw Xe(1,e),e}}withAsyncFlushOnExit(){try{return ve(ze,{asyncFlushOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withExitCodeLogging(){try{return ve(ze,{logExitCode:!0}),this}catch(e){throw Xe(1,e),e}}withElementOnExit(){try{return ve(ze,{appendElementOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withInteropCleanupOnExit(){try{return ve(ze,{interopCleanupOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withDumpThreadsOnNonZeroExit(){try{return ve(ze,{dumpThreadsOnNonZeroExit:!0}),this}catch(e){throw Xe(1,e),e}}withWaitingForDebugger(e){try{return ve(ze,{waitForDebugger:e}),this}catch(e){throw Xe(1,e),e}}withInterpreterPgo(e,t){try{return ve(ze,{interpreterPgo:e,interpreterPgoSaveDelay:t}),ze.runtimeOptions?ze.runtimeOptions.push("--interp-pgo-recording"):ze.runtimeOptions=["--interp-pgo-recording"],this}catch(e){throw Xe(1,e),e}}withConfig(e){try{return ve(ze,e),this}catch(e){throw Xe(1,e),e}}withConfigSrc(e){try{return e&&"string"==typeof e||Be(!1,"must be file path or URL"),Ee(We,{configSrc:e}),this}catch(e){throw Xe(1,e),e}}withVirtualWorkingDirectory(e){try{return e&&"string"==typeof e||Be(!1,"must be directory path"),ve(ze,{virtualWorkingDirectory:e}),this}catch(e){throw Xe(1,e),e}}withEnvironmentVariable(e,t){try{const o={};return o[e]=t,ve(ze,{environmentVariables:o}),this}catch(e){throw Xe(1,e),e}}withEnvironmentVariables(e){try{return e&&"object"==typeof e||Be(!1,"must be dictionary object"),ve(ze,{environmentVariables:e}),this}catch(e){throw Xe(1,e),e}}withDiagnosticTracing(e){try{return"boolean"!=typeof e&&Be(!1,"must be boolean"),ve(ze,{diagnosticTracing:e}),this}catch(e){throw Xe(1,e),e}}withDebugging(e){try{return null!=e&&"number"==typeof e||Be(!1,"must be number"),ve(ze,{debugLevel:e}),this}catch(e){throw Xe(1,e),e}}withApplicationArguments(...e){try{return e&&Array.isArray(e)||Be(!1,"must be array of strings"),ve(ze,{applicationArguments:e}),this}catch(e){throw Xe(1,e),e}}withRuntimeOptions(e){try{return e&&Array.isArray(e)||Be(!1,"must be array of strings"),ze.runtimeOptions?ze.runtimeOptions.push(...e):ze.runtimeOptions=e,this}catch(e){throw Xe(1,e),e}}withMainAssembly(e){try{return ve(ze,{mainAssemblyName:e}),this}catch(e){throw Xe(1,e),e}}withApplicationArgumentsFromQuery(){try{if(!globalThis.window)throw new Error("Missing window to the query parameters from");if(void 0===globalThis.URLSearchParams)throw new Error("URLSearchParams is supported");const e=new URLSearchParams(globalThis.window.location.search).getAll("arg");return this.withApplicationArguments(...e)}catch(e){throw Xe(1,e),e}}withApplicationEnvironment(e){try{return ve(ze,{applicationEnvironment:e}),this}catch(e){throw Xe(1,e),e}}withApplicationCulture(e){try{return ve(ze,{applicationCulture:e}),this}catch(e){throw Xe(1,e),e}}withResourceLoader(e){try{return Pe.loadBootResource=e,this}catch(e){throw Xe(1,e),e}}async download(){try{await async function(){lt(We),await Re(We),re(),D(),oe(),await Pe.allDownloadsFinished.promise}()}catch(e){throw Xe(1,e),e}}async create(){try{return this.instance||(this.instance=await async function(){return await ct(We),Fe.api}()),this.instance}catch(e){throw Xe(1,e),e}}async run(){try{return We.config||Be(!1,"Null moduleConfig.config"),this.instance||await this.create(),this.instance.runMainAndExit()}catch(e){throw Xe(1,e),e}}},mt=Xe,gt=ct;Ie||"function"==typeof globalThis.URL||Be(!1,"This browser/engine doesn't support URL API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"),"function"!=typeof globalThis.BigInt64Array&&Be(!1,"This browser/engine doesn't support BigInt64Array API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"),ft.withConfig(/*json-start*/{
  "mainAssemblyName": "WasmSharp.Core",
  "resources": {
    "hash": "sha256-1lZ9ZNsOTBhVyBD/DyYEF4RppbdfjlcIEvzgtAOV6zU=",
    "jsModuleNative": [
      {
        "name": "dotnet.native.js",
        "moduleExports": dotnet_native_js
      }
    ],
    "jsModuleRuntime": [
      {
        "name": "dotnet.runtime.js",
        "moduleExports": dotnet_runtime_js
      }
    ],
    "wasmNative": [
      {
        "name": "dotnet.native.wasm",
        "integrity": "sha256-Ebk+Km0uqtdo/srKe0YcuUOlFykCcKVkBt03gTWt0aU=",
        "resolvedUrl": dotnet_native_wasm
      }
    ],
    "icu": [
      {
        "virtualPath": "icudt_CJK.dat",
        "name": "icudt_CJK.dat",
        "integrity": "sha256-SZLtQnRc0JkwqHab0VUVP7T3uBPSeYzxzDnpxPpUnHk=",
        "resolvedUrl": icudt_CJK_dat
      },
      {
        "virtualPath": "icudt_EFIGS.dat",
        "name": "icudt_EFIGS.dat",
        "integrity": "sha256-8fItetYY8kQ0ww6oxwTLiT3oXlBwHKumbeP2pRF4yTc=",
        "resolvedUrl": icudt_EFIGS_dat
      },
      {
        "virtualPath": "icudt_no_CJK.dat",
        "name": "icudt_no_CJK.dat",
        "integrity": "sha256-L7sV7NEYP37/Qr2FPCePo5cJqRgTXRwGHuwF5Q+0Nfs=",
        "resolvedUrl": icudt_no_CJK_dat
      }
    ],
    "coreAssembly": [
      {
        "virtualPath": "System.Private.CoreLib.dll",
        "name": "System.Private.CoreLib.dll",
        "integrity": "sha256-qsWIBHfgemf80KYo1dUe0Zq4Ov742XXuQBKPsDp/moU=",
        "resolvedUrl": System_Private_CoreLib_dll
      },
      {
        "virtualPath": "System.Runtime.InteropServices.JavaScript.dll",
        "name": "System.Runtime.InteropServices.JavaScript.dll",
        "integrity": "sha256-3H6ZHaGLWCVV8FKDuO1okiN6wQhRJFrbchwyQ7XNdk4=",
        "resolvedUrl": System_Runtime_InteropServices_JavaScript_dll
      }
    ],
    "assembly": [
      {
        "virtualPath": "Humanizer.dll",
        "name": "Humanizer.dll",
        "integrity": "sha256-xFiKgaugTOK9ZFOghIsPYacbiF75AvPpSkUboknz28c=",
        "resolvedUrl": Humanizer_dll
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.dll",
        "name": "Microsoft.CodeAnalysis.CSharp.Features.dll",
        "integrity": "sha256-BWK4Rrvlnr+8jIaz3wrMwPf7gwrAOn4JSQCcKfrdlf4=",
        "resolvedUrl": Microsoft_CodeAnalysis_CSharp_Features_dll
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.dll",
        "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.dll",
        "integrity": "sha256-GF5ylWvr08SMx2/bIg9FsfWCTWE/V42Icodn/MrWfic=",
        "resolvedUrl": Microsoft_CodeAnalysis_CSharp_Workspaces_dll
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.CSharp.dll",
        "name": "Microsoft.CodeAnalysis.CSharp.dll",
        "integrity": "sha256-f84olMu4s551iFMvZjtzh2bwcnUU3j9t1PCxOIBOqHc=",
        "resolvedUrl": Microsoft_CodeAnalysis_CSharp_dll
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.Features.dll",
        "name": "Microsoft.CodeAnalysis.Features.dll",
        "integrity": "sha256-1CmlgikG4Lw8GO7kmubP1H5og3RsQrh4KploC0ddwwc=",
        "resolvedUrl": Microsoft_CodeAnalysis_Features_dll
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.Scripting.dll",
        "name": "Microsoft.CodeAnalysis.Scripting.dll",
        "integrity": "sha256-Xe18cE+HIrkm2PQ5EWoUZfJUVOIpn8M6v3COBi+JjCM=",
        "resolvedUrl": Microsoft_CodeAnalysis_Scripting_dll
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.Workspaces.dll",
        "name": "Microsoft.CodeAnalysis.Workspaces.dll",
        "integrity": "sha256-M+AEH5QeTxw7BgG3Kw93sY0xBbNfsMdSPTdPPsjdaDg=",
        "resolvedUrl": Microsoft_CodeAnalysis_Workspaces_dll
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.dll",
        "name": "Microsoft.CodeAnalysis.dll",
        "integrity": "sha256-ODBr/Aav8Zlz5Au7HYh/XrBShoCnu2lYOgXnuK9WwP0=",
        "resolvedUrl": Microsoft_CodeAnalysis_dll
      },
      {
        "virtualPath": "Microsoft.DiaSymReader.dll",
        "name": "Microsoft.DiaSymReader.dll",
        "integrity": "sha256-tVRsh7V7/rnTI+/9cbnla9LYALD83A+Ww2+4OBo4xwk=",
        "resolvedUrl": Microsoft_DiaSymReader_dll
      },
      {
        "virtualPath": "Microsoft.Extensions.DependencyInjection.Abstractions.dll",
        "name": "Microsoft.Extensions.DependencyInjection.Abstractions.dll",
        "integrity": "sha256-nmHk0pPM9W3u7CxvNGnym+YDesEM2NXQHRR5SxX7kjM=",
        "resolvedUrl": Microsoft_Extensions_DependencyInjection_Abstractions_dll
      },
      {
        "virtualPath": "Microsoft.Extensions.Logging.Abstractions.dll",
        "name": "Microsoft.Extensions.Logging.Abstractions.dll",
        "integrity": "sha256-xcfBpTEIOSHAK0MxY9OuHkM0IMsIyRsDZaocYDHmRc8=",
        "resolvedUrl": Microsoft_Extensions_Logging_Abstractions_dll
      },
      {
        "virtualPath": "System.Collections.Concurrent.dll",
        "name": "System.Collections.Concurrent.dll",
        "integrity": "sha256-eaEyXBuvufyiJ5bcjAAiDg/kjpN5bieL8OvZ3ivA3DQ=",
        "resolvedUrl": System_Collections_Concurrent_dll
      },
      {
        "virtualPath": "System.Collections.Immutable.dll",
        "name": "System.Collections.Immutable.dll",
        "integrity": "sha256-y2e9c7I2m60tXby1wDdMYDYNI+GLWXOsGsEoSE8ir1o=",
        "resolvedUrl": System_Collections_Immutable_dll
      },
      {
        "virtualPath": "System.Collections.NonGeneric.dll",
        "name": "System.Collections.NonGeneric.dll",
        "integrity": "sha256-ezA/ktgyS/7iMHsg/8H4kghDY4ANb5Je+WKNoEOM41Y=",
        "resolvedUrl": System_Collections_NonGeneric_dll
      },
      {
        "virtualPath": "System.Collections.Specialized.dll",
        "name": "System.Collections.Specialized.dll",
        "integrity": "sha256-RUE95i+0YtK4Bq5q+SO0jRjpi+5E5UQY3Wr1a4TJfmE=",
        "resolvedUrl": System_Collections_Specialized_dll
      },
      {
        "virtualPath": "System.Collections.dll",
        "name": "System.Collections.dll",
        "integrity": "sha256-+X1jbFLwfO8eiREFhCPsVb171p4TjF6wOeZb140QEWM=",
        "resolvedUrl": System_Collections_dll
      },
      {
        "virtualPath": "System.ComponentModel.Primitives.dll",
        "name": "System.ComponentModel.Primitives.dll",
        "integrity": "sha256-BzBdwEQ54yW5+a5MPZCXp60LiujRnStM/3SSUlPCo30=",
        "resolvedUrl": System_ComponentModel_Primitives_dll
      },
      {
        "virtualPath": "System.ComponentModel.TypeConverter.dll",
        "name": "System.ComponentModel.TypeConverter.dll",
        "integrity": "sha256-W2sdPMBHmyMa5gKn/+ErVVIAafc9Px6y8+Q7HZIwRIM=",
        "resolvedUrl": System_ComponentModel_TypeConverter_dll
      },
      {
        "virtualPath": "System.ComponentModel.dll",
        "name": "System.ComponentModel.dll",
        "integrity": "sha256-VddeAKaf9lLOKsPq5WDieq/xGsGXKmEoVb2rXL0OO/0=",
        "resolvedUrl": System_ComponentModel_dll
      },
      {
        "virtualPath": "System.Composition.AttributedModel.dll",
        "name": "System.Composition.AttributedModel.dll",
        "integrity": "sha256-95M36BTdI/0yIu2a2fxwLUo7KKdxqKkN6H/a719mKaU=",
        "resolvedUrl": System_Composition_AttributedModel_dll
      },
      {
        "virtualPath": "System.Composition.Hosting.dll",
        "name": "System.Composition.Hosting.dll",
        "integrity": "sha256-Y5+jgaILUinOZIMPTXTW4mu9lz89x03JdNojN0F6hxs=",
        "resolvedUrl": System_Composition_Hosting_dll
      },
      {
        "virtualPath": "System.Composition.Runtime.dll",
        "name": "System.Composition.Runtime.dll",
        "integrity": "sha256-3s/CtgZGV6lp78LUOVKWW0ZWy7TDYQD7HtIpx1/TjTQ=",
        "resolvedUrl": System_Composition_Runtime_dll
      },
      {
        "virtualPath": "System.Composition.TypedParts.dll",
        "name": "System.Composition.TypedParts.dll",
        "integrity": "sha256-yNKJGMnmI3hIGnRFhoAR1+dTRYUMG7OwibeAKdYy28M=",
        "resolvedUrl": System_Composition_TypedParts_dll
      },
      {
        "virtualPath": "System.Console.dll",
        "name": "System.Console.dll",
        "integrity": "sha256-u/1JNuHONa4C89rQ4KRqQd/y5UVK7QBa+eFXcnEU/iA=",
        "resolvedUrl": System_Console_dll
      },
      {
        "virtualPath": "System.Diagnostics.FileVersionInfo.dll",
        "name": "System.Diagnostics.FileVersionInfo.dll",
        "integrity": "sha256-vK6565qdz+ASx9nbqI+Q9Pyg/JpCU/7Iv8m8kyxGcuc=",
        "resolvedUrl": System_Diagnostics_FileVersionInfo_dll
      },
      {
        "virtualPath": "System.Diagnostics.Process.dll",
        "name": "System.Diagnostics.Process.dll",
        "integrity": "sha256-QBB15Iz4CTa+elzEuXEZqQ2xyOQW6r4+wWl26paft4I=",
        "resolvedUrl": System_Diagnostics_Process_dll
      },
      {
        "virtualPath": "System.Diagnostics.TraceSource.dll",
        "name": "System.Diagnostics.TraceSource.dll",
        "integrity": "sha256-D6QdCRliay1+HOojjIAcOdzWPgw794784sukYUyENe4=",
        "resolvedUrl": System_Diagnostics_TraceSource_dll
      },
      {
        "virtualPath": "System.Globalization.dll",
        "name": "System.Globalization.dll",
        "integrity": "sha256-wvAeoe8DNBYUhoUUjByPFAPLxRBr3pXDU5y7Njcm0J8=",
        "resolvedUrl": System_Globalization_dll
      },
      {
        "virtualPath": "System.IO.Compression.dll",
        "name": "System.IO.Compression.dll",
        "integrity": "sha256-UYl5YWG27en0myuk6jWJxaYJ4cieMJYIm6XERyeWGuY=",
        "resolvedUrl": System_IO_Compression_dll
      },
      {
        "virtualPath": "System.IO.MemoryMappedFiles.dll",
        "name": "System.IO.MemoryMappedFiles.dll",
        "integrity": "sha256-PB+DkHiisbFZpZOFSEVlWM4BachdzApSVbFkrVyKmks=",
        "resolvedUrl": System_IO_MemoryMappedFiles_dll
      },
      {
        "virtualPath": "System.IO.Pipelines.dll",
        "name": "System.IO.Pipelines.dll",
        "integrity": "sha256-9Ynnk5+k4IKM7gWX1AFhRJlVOr/8U8LpSSZvLsJpJ+I=",
        "resolvedUrl": System_IO_Pipelines_dll
      },
      {
        "virtualPath": "System.Linq.Expressions.dll",
        "name": "System.Linq.Expressions.dll",
        "integrity": "sha256-PzU9T2WMvi2wXTNJJZdQ4IXSt8PTVy42hZJy3LemP9k=",
        "resolvedUrl": System_Linq_Expressions_dll
      },
      {
        "virtualPath": "System.Linq.dll",
        "name": "System.Linq.dll",
        "integrity": "sha256-a/BIqoJfvMjn3YSDR2u6cCZJweixGj5zEl7cZFYsjEI=",
        "resolvedUrl": System_Linq_dll
      },
      {
        "virtualPath": "System.Memory.dll",
        "name": "System.Memory.dll",
        "integrity": "sha256-gtihmZHXE/m5CI0lx2nMK4i/YJ+FZeGmsQS113hqTHg=",
        "resolvedUrl": System_Memory_dll
      },
      {
        "virtualPath": "System.Net.Http.dll",
        "name": "System.Net.Http.dll",
        "integrity": "sha256-Wr8PS0muEOsNN9DppqA/hltMhvuhokmwSFxdtTy9pww=",
        "resolvedUrl": System_Net_Http_dll
      },
      {
        "virtualPath": "System.Net.Primitives.dll",
        "name": "System.Net.Primitives.dll",
        "integrity": "sha256-xpiP+1x4aiQOEPSi0sx8Eu2sVBM6ovI50Cb8HkeZI04=",
        "resolvedUrl": System_Net_Primitives_dll
      },
      {
        "virtualPath": "System.Numerics.Vectors.dll",
        "name": "System.Numerics.Vectors.dll",
        "integrity": "sha256-sbKUXtMZauwVM4SAt0xBsRU/9mnEvgTTB0O1NaGM/a4=",
        "resolvedUrl": System_Numerics_Vectors_dll
      },
      {
        "virtualPath": "System.ObjectModel.dll",
        "name": "System.ObjectModel.dll",
        "integrity": "sha256-ZfksFbEPKYrOStLtjQYA3pXR9hGwjzIrMZxAtoPOy7c=",
        "resolvedUrl": System_ObjectModel_dll
      },
      {
        "virtualPath": "System.Private.DataContractSerialization.dll",
        "name": "System.Private.DataContractSerialization.dll",
        "integrity": "sha256-DrLyXYzKQ8l79TRnVf4gc779mccNC/PgQvbAGuaQLao=",
        "resolvedUrl": System_Private_DataContractSerialization_dll
      },
      {
        "virtualPath": "System.Private.Uri.dll",
        "name": "System.Private.Uri.dll",
        "integrity": "sha256-E/DwRwVPvgtSJrU7X1wDyTcI5hr5smfwTwxQJFaBKT8=",
        "resolvedUrl": System_Private_Uri_dll
      },
      {
        "virtualPath": "System.Private.Xml.Linq.dll",
        "name": "System.Private.Xml.Linq.dll",
        "integrity": "sha256-y4tAJIbgr1F/5uvKXBIMLpu9Yccb5fk+Fhq7kfa/z5Q=",
        "resolvedUrl": System_Private_Xml_Linq_dll
      },
      {
        "virtualPath": "System.Private.Xml.dll",
        "name": "System.Private.Xml.dll",
        "integrity": "sha256-606fd6cHYo9My6roak3uAKXlL28of0zycX2DLGEDrqg=",
        "resolvedUrl": System_Private_Xml_dll
      },
      {
        "virtualPath": "System.Reflection.Metadata.dll",
        "name": "System.Reflection.Metadata.dll",
        "integrity": "sha256-PqOOg/BHQ3LgzmDBtIxRnQnlbLm8073N62A0xKqpY5c=",
        "resolvedUrl": System_Reflection_Metadata_dll
      },
      {
        "virtualPath": "System.Runtime.InteropServices.dll",
        "name": "System.Runtime.InteropServices.dll",
        "integrity": "sha256-nuGSG6wMJoJWgEr4Zbqi4H/r5NhpWBhdXBF99sToQWQ=",
        "resolvedUrl": System_Runtime_InteropServices_dll
      },
      {
        "virtualPath": "System.Runtime.Numerics.dll",
        "name": "System.Runtime.Numerics.dll",
        "integrity": "sha256-h7tA4eoGcEFFprKkn6BBfccHBoSIpS1WjoGNpPmHL5Q=",
        "resolvedUrl": System_Runtime_Numerics_dll
      },
      {
        "virtualPath": "System.Runtime.Serialization.Formatters.dll",
        "name": "System.Runtime.Serialization.Formatters.dll",
        "integrity": "sha256-27FwoDw1CfriKsK8KuL0OaF0E0Qpx0kx7xrg6z57WAM=",
        "resolvedUrl": System_Runtime_Serialization_Formatters_dll
      },
      {
        "virtualPath": "System.Runtime.Serialization.Primitives.dll",
        "name": "System.Runtime.Serialization.Primitives.dll",
        "integrity": "sha256-rEoQs69IbqpOqniL2xsac963mfo1ful/FKCvTne2vtI=",
        "resolvedUrl": System_Runtime_Serialization_Primitives_dll
      },
      {
        "virtualPath": "System.Runtime.dll",
        "name": "System.Runtime.dll",
        "integrity": "sha256-+DMnW2iIWrSPsD18wLpPhp68wLhClbAVVMfzqulsUC8=",
        "resolvedUrl": System_Runtime_dll
      },
      {
        "virtualPath": "System.Security.Cryptography.dll",
        "name": "System.Security.Cryptography.dll",
        "integrity": "sha256-gemIg54pj+gQ8DdCdhiy7DHBfABfXgyHWB0LqsYRB6w=",
        "resolvedUrl": System_Security_Cryptography_dll
      },
      {
        "virtualPath": "System.Text.Encoding.CodePages.dll",
        "name": "System.Text.Encoding.CodePages.dll",
        "integrity": "sha256-pyVS5+ZdfhhD9C5fk8/yFqL/d6lAfySoje3bOMvopeE=",
        "resolvedUrl": System_Text_Encoding_CodePages_dll
      },
      {
        "virtualPath": "System.Text.Encodings.Web.dll",
        "name": "System.Text.Encodings.Web.dll",
        "integrity": "sha256-Mh8YGAVVCtDXZwSwjerjndEXZq2cjg9341MeYgVcfsM=",
        "resolvedUrl": System_Text_Encodings_Web_dll
      },
      {
        "virtualPath": "System.Text.Json.dll",
        "name": "System.Text.Json.dll",
        "integrity": "sha256-l7TBDJodyBsxqM0N4SC/drOgZghXt5ba3O6HCmMzHiA=",
        "resolvedUrl": System_Text_Json_dll
      },
      {
        "virtualPath": "System.Text.RegularExpressions.dll",
        "name": "System.Text.RegularExpressions.dll",
        "integrity": "sha256-l0FsPu2FYgQFlY2f1auUitZTXcJZyOucQ2J9hFk8Ca8=",
        "resolvedUrl": System_Text_RegularExpressions_dll
      },
      {
        "virtualPath": "System.Threading.Channels.dll",
        "name": "System.Threading.Channels.dll",
        "integrity": "sha256-HJmXYH+NIFklfntPbWOS8LnPgIgTPIWOSe1qZT0Ds/k=",
        "resolvedUrl": System_Threading_Channels_dll
      },
      {
        "virtualPath": "System.Threading.Tasks.Parallel.dll",
        "name": "System.Threading.Tasks.Parallel.dll",
        "integrity": "sha256-5KWrA3VD5aEKN1tX08IkDkEsNWxp+E26IOHnXhkeBWw=",
        "resolvedUrl": System_Threading_Tasks_Parallel_dll
      },
      {
        "virtualPath": "System.Xml.Linq.dll",
        "name": "System.Xml.Linq.dll",
        "integrity": "sha256-SlJhuVE4GYrL1mTTtf6DeNCBVjbUyw97PqH1WX98ey4=",
        "resolvedUrl": System_Xml_Linq_dll
      },
      {
        "virtualPath": "System.dll",
        "name": "System.dll",
        "integrity": "sha256-EF6Jlc2uBoQSt3KHfe+O5yVOEeCwGKy7u8xF7N1O+fM=",
        "resolvedUrl": System_dll
      },
      {
        "virtualPath": "WasmSharp.Core.dll",
        "name": "WasmSharp.Core.dll",
        "integrity": "sha256-/3wzZbuzLP5EyfOc50n8oPLkFcJPuIs4LxrZQPtkQE0=",
        "resolvedUrl": WasmSharp_Core_dll
      }
    ],
    "satelliteResources": {
      "cs": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-MdvEYmNktDV1uFPbQhalV5oc89eetE5rb4PFx06DvRk=",
          "resolvedUrl": csMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-VQC8V9PRegrYIlmX85hoiDCEgn6n31E+QjxRyYo0WmE=",
          "resolvedUrl": csMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-9xnktF4G8gOhwtTnn6K0lvixb29jxCZYCYRN71OtQfM=",
          "resolvedUrl": csMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-gb6qDe+Qhf5S8LjtKdi9q/dR2ntg2YB8s6dWP0X8l38=",
          "resolvedUrl": csMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-ulBd8/q2UK87tAMnkWQsKhAWPkmqbqkD++LkSbntfwc=",
          "resolvedUrl": csMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-7Yy8qU2Thn8KB2VZFlokfQxeOM/Mrn01NVGt8It49x4=",
          "resolvedUrl": csMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-gY+EuV/YJz7A6XU/kK8qmIILsEkstTJo23CnQD6qoq8=",
          "resolvedUrl": csMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "de": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-XHeUWd+j+YtMVtSjIKZL0gyG5jnjOsFolRc7GkQP23k=",
          "resolvedUrl": deMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-Hb3eoBt5RSyEH6Kw3yzknkHVS5cKjuPgz3some109GM=",
          "resolvedUrl": deMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-2TbkB1r0frWjToQY5r8eqj5NPIbWtAq33/772Ob4tZQ=",
          "resolvedUrl": deMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-azxQfklTxJDU0Fh62x7aGkZPOSiTiPf1QkLeaohKfns=",
          "resolvedUrl": deMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-o+DmMH2J6tGFRp++eeipk9pyik9P4punFV7P1dvl0+M=",
          "resolvedUrl": deMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-H4gVApO2QaLxWdDu8frWD3elULh3NjBYwvWlsYAUE1Y=",
          "resolvedUrl": deMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-Gx2AVgiSnsAriswvuMCex6M1eXsRaGcZ7iES1b+7GPw=",
          "resolvedUrl": deMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "es": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-t6DDbCw6NJ8xGoYWAqAnvJm/NpyxhDOBH+JxQ1iWcWE=",
          "resolvedUrl": esMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-lPyHVvhsvcnKTpDwd9Ay3HkhyI9Yl6SuH3EezOELIhc=",
          "resolvedUrl": esMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-VZ+ipNNqgypeBfktq/9rpzfMBEP5WFBhHEhbIVkgRv4=",
          "resolvedUrl": esMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-65+MbSh4nLIG8808zYys4TjJ45VTLBGwkvNqy34+aWg=",
          "resolvedUrl": esMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-uc0Zr6ig6o5LgS4ub8Hxha0utBXZybVcfLmK8FekyfY=",
          "resolvedUrl": esMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-dI8WTBCDAHcsVfDJ/JAnVM6U2J0WesP6XRJr5Nj+x9s=",
          "resolvedUrl": esMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-TIP5wif6mpEiCcVFA4DvNOhNkYZ6/4IIMA6KrasmlFY=",
          "resolvedUrl": esMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "fr": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-8iod8VLHhwrVB4iaETL+DhUEVx8O+PVA9LVNOUzzXxg=",
          "resolvedUrl": frMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-Fpj3coQCzl6sR0q3qDFcxM6UxVaR2meJmh9wIraA9QE=",
          "resolvedUrl": frMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-xTjN244he8G5YxKVa3kjhV1vOS5GfXt8fOk0HZ2h8jw=",
          "resolvedUrl": frMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-4/xZmYPgj3sSCtcUvK3MyeiR7cxm8bpx4T1dQBUehTY=",
          "resolvedUrl": frMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-nK9YK22+YoU3pfC+bdUiHgZQHvWrYh9jk7LT9n5J/aU=",
          "resolvedUrl": frMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-jqflAqO6LpNN/7O2RaqP0qm/HQW4mIdhP+JVKbUTeME=",
          "resolvedUrl": frMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-qSdGx9jyQefSB6eZUAf1nWlKEOX4kDzq38WnPBlfY6A=",
          "resolvedUrl": frMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "it": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-gBlo8BrvvhgVZlUvnA8LG4Qk1hOH5tvJYQ7l66oC3rg=",
          "resolvedUrl": itMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-pWfXsLXvm3w1SHxF5FsjXHOxGQ889sc6JMc9f6SP4JQ=",
          "resolvedUrl": itMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-mVqGg0U2fhxoARYX2Lishd7PLdFfuF6pKiggXixqX7o=",
          "resolvedUrl": itMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-IXh35Wd90hD5i07wi86Qx8AoAmMl8QHkVPbI98eVzJ4=",
          "resolvedUrl": itMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-bR99afx46Bgg5tDqAu/CdvlviqSQvZ7BS/H5bVCKZ1Q=",
          "resolvedUrl": itMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-5XCR8gKNLkwymjiVt0rhNCsYHqKkZeObH3B7F59N2XI=",
          "resolvedUrl": itMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-lIlYTz1uxyO/0q3xoNG9ybr8rauFf6fEjRgVfiI6VUE=",
          "resolvedUrl": itMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "ja": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-qy2AQvC429FpT+wLmTft8eHZlMqlHg++t4yZzrjXp58=",
          "resolvedUrl": jaMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-m1s6BILo5kXzv4a85E/SFxteyV7BxgmG5uGN1svL00Y=",
          "resolvedUrl": jaMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-hm6rtfD1Hfgt4aK+kzxULfYGF9Az9GPnAQcZvcb1X6c=",
          "resolvedUrl": jaMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-8TSNMLjYAP+QsN9nD/bSh8reDIH1fK8Pa4lytDx+PI4=",
          "resolvedUrl": jaMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-6YJyPY4PLkieFdedX1Cm9v1q2HwcFkH+ts2I8PznDTg=",
          "resolvedUrl": jaMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-m5GiQe9OUtrZKblYFCM8rrMUWU2HZ3K3qxCECZ2+DbE=",
          "resolvedUrl": jaMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-mwvql5ZcBM6SXpKluFdbhmx1sYWol0EYX0sk9yGCoLs=",
          "resolvedUrl": jaMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "ko": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-mJW1K7slXc1OgkPadoQOaedogBYIe9WygXF441X+gKA=",
          "resolvedUrl": koMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-dusPsCZayZLORUxKBhRYPJrEYkKs27dqydwko//O1qE=",
          "resolvedUrl": koMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-+LmVyYjd7jOgLkH+RljWOu8y84Bniu9wpRZBQ6JcHuQ=",
          "resolvedUrl": koMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-M60Yk4VHCSLC24oscIxlIwF+AF4gUptdI0gEndwc8lc=",
          "resolvedUrl": koMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-uAoMyv0X0tVt/QSdDHxIBxTStiSJUD7LtGRWkwFBQq8=",
          "resolvedUrl": koMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-uayEY1pRPm3ETm133nK6SZBu6x9FvV+9UXJYLTxrIqc=",
          "resolvedUrl": koMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-LHmUk+ClAy7Q5kOlUNFJ3DJCENo6aTN6aK5kYPVrsuE=",
          "resolvedUrl": koMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "pl": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-qk5puN8toeWECIYmSXxjtUoKm9aEEqUbqTil2t8ZeQI=",
          "resolvedUrl": plMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-Lc0dbHEs/sHOukNQfmcOgqlYdkaG48WVsNuJLdsSr9c=",
          "resolvedUrl": plMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-v9C6RJGh4HLyQ7RZnQuf4fGJ7L70quawqkxjBgeXF98=",
          "resolvedUrl": plMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-85A9rl98H5ZFuAzPmLiAfvB/a35hnCv0YL4cEqfcbXI=",
          "resolvedUrl": plMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-2eeiP5J1BWAN/LN3UiXUblN1aT8uCMHqZeQ+p4rUED0=",
          "resolvedUrl": plMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-gwdkWDu1hzOMy7a7lzOCTmsZcTWhbE01mdY4LrGzrx8=",
          "resolvedUrl": plMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-pthVpJ57hn/xg3tbJNA3pnp7yXI6Vp696oXwxzyBRuI=",
          "resolvedUrl": plMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "pt-BR": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-u49N75pFpk1AIK8axW2YP3OGJRlgfg+6uVWKfXsWlj8=",
          "resolvedUrl": pt_BRMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-lxPiJ5wHjnlVywLrjtfflEn2U/djTcZGmeXUjI/aHaw=",
          "resolvedUrl": pt_BRMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-C7Zh4nDBtmdb8rBrBGXqiwtVHwdlmZ8xq5yuMI+D494=",
          "resolvedUrl": pt_BRMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-h4+osRr8eEiy7Ft+KC6lgcMIFjUBgZxs4Iy9My6dxiQ=",
          "resolvedUrl": pt_BRMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-yVjDoz0ePvSDafJ3XbcBQKDYQcGeGd+ccyggo26fpbk=",
          "resolvedUrl": pt_BRMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-+ysthUiX6qE1q5oaw6bR24nx+DlYHNOz7T3f1/yMXxA=",
          "resolvedUrl": pt_BRMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-QCWNLOdMT7cb17FF9tMwgfPXPhmv2iUFCDLd4+WM8z8=",
          "resolvedUrl": pt_BRMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "ru": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-3LtP4pHcxW+o98UEaxedN3elLzuDWegTSpEdWa1FidE=",
          "resolvedUrl": ruMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-aid0h4tuAtnd0SSDqfNKWbj7UR5WaGXLlgrC+Bv7QPQ=",
          "resolvedUrl": ruMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-aMDtASK9ThU3F7y9fYpT1S2QU1hZtiLfYBwn6rWM+zs=",
          "resolvedUrl": ruMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-XSx98gnyZQleK4vfjggLIUsC5u7BlqwynJYB10IdXj4=",
          "resolvedUrl": ruMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-VkKYjDf0phiDSuL9lhYVSLl5ghtTW6tb2VW1nNryojQ=",
          "resolvedUrl": ruMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-IGcXvDzb/DBaWhxaelRDySwfQQl8+JNQisuQUvk4HCg=",
          "resolvedUrl": ruMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-n2d4orbSFBOXuNMx/DhXeuKzmLYSDrNlTbdXW2LhsNQ=",
          "resolvedUrl": ruMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "tr": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-gt7NXwVBTWnSyhy+9XpC983xcit1Ugj3mvNV3b44fn8=",
          "resolvedUrl": trMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-JUc7yQcXJykw4gh/3cIJtg83Vp8BKPlK2dMS2W9FC+E=",
          "resolvedUrl": trMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-kyAihshRS/obHEtBNmbNEahKvWlJbnqo0vnVZb0tFaE=",
          "resolvedUrl": trMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-X3+D8R+WeU06f+dtnIwgRChq7QaQiByC5k33AN3sCYY=",
          "resolvedUrl": trMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-utIbjKrszb2eBf3+jNoTqRUTfuoNOir8lJJc4gcK+M0=",
          "resolvedUrl": trMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-BRs3oH0BiuIjbR2o9e3cqOWww+DKW606XegeyOn9uVA=",
          "resolvedUrl": trMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-avjo55Owce8d4gBim7VR3SvbzjgjN2s0eDairxU2elw=",
          "resolvedUrl": trMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "zh-Hans": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-rvKfznMMjwVkAJucOLitIFyxp+uJAjkZYSiCawTfgUI=",
          "resolvedUrl": zh_HansMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-89bxKTuAPVCj91wRNh35SU+O4SldcI0lT5kCZ3GgYOg=",
          "resolvedUrl": zh_HansMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-W4Gx1FN9RKNl/bSKok5RoLDD7jCN68wiXJM5JJ4Ki7M=",
          "resolvedUrl": zh_HansMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-uurNaDArlFtZfn/ZyYWQvn20AFwXLezYn4l8dUVe27M=",
          "resolvedUrl": zh_HansMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-/JWWzRBcxrS1iXADLN2B75NRLoM7MNglfth+cSakjEI=",
          "resolvedUrl": zh_HansMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-X26ySBGBivw96YyTHDGEGpYL6M7mK/4tyjM6/jI5oTA=",
          "resolvedUrl": zh_HansMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-pBtyVVoZQ+Nn6XFPszKUVNutQ2ZQDbCJlRn/tVigYMs=",
          "resolvedUrl": zh_HansMicrosoft_CodeAnalysis_resources_dll
        }
      ],
      "zh-Hant": [
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Features.resources.dll",
          "integrity": "sha256-ZM1SN01pYWqUdh9QVXwIekbraKJqwDX9D0XWGGLZhsI=",
          "resolvedUrl": zh_HantMicrosoft_CodeAnalysis_CSharp_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll",
          "integrity": "sha256-T1OfM4yWYVrTbzPi6TfrazdMJg4PILgGlx8UGL9t06Y=",
          "resolvedUrl": zh_HantMicrosoft_CodeAnalysis_CSharp_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dll",
          "integrity": "sha256-0ecWZStXBTc/tWAQXKJxD/K8C3BChbULCOyN+f0vgoc=",
          "resolvedUrl": zh_HantMicrosoft_CodeAnalysis_CSharp_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Features.resources.dll",
          "name": "Microsoft.CodeAnalysis.Features.resources.dll",
          "integrity": "sha256-elaPic0rZQkviLKRGmYsSkBvMc2VtX1bDvj0j0v06ao=",
          "resolvedUrl": zh_HantMicrosoft_CodeAnalysis_Features_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "name": "Microsoft.CodeAnalysis.Scripting.resources.dll",
          "integrity": "sha256-Dewr2y1DJKdTNlIp4TJfTl5GCD7g5buJ5nbZ2WDZ8wA=",
          "resolvedUrl": zh_HantMicrosoft_CodeAnalysis_Scripting_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.dll",
          "integrity": "sha256-P9wJ1qHHeewOP3Pu5usBXxLoeoKmzmzM+WI+Oyupubg=",
          "resolvedUrl": zh_HantMicrosoft_CodeAnalysis_Workspaces_resources_dll
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.dll",
          "name": "Microsoft.CodeAnalysis.resources.dll",
          "integrity": "sha256-C7QiVZolgt8aSfrtJaM3tgN+s4eKxO58EYtoNJyjErc=",
          "resolvedUrl": zh_HantMicrosoft_CodeAnalysis_resources_dll
        }
      ]
    }
  },
  "debugLevel": 0,
  "linkerEnabled": true,
  "globalizationMode": "sharded",
  "runtimeConfig": {
    "runtimeOptions": {
      "configProperties": {
        "Microsoft.Extensions.DependencyInjection.VerifyOpenGenericServiceTrimmability": true,
        "System.ComponentModel.DefaultValueAttribute.IsSupported": false,
        "System.ComponentModel.Design.IDesignerHost.IsSupported": false,
        "System.ComponentModel.TypeConverter.EnableUnsafeBinaryFormatterInDesigntimeLicenseContextSerialization": false,
        "System.ComponentModel.TypeDescriptor.IsComObjectDescriptorSupported": false,
        "System.Data.DataSet.XmlSerializationIsSupported": false,
        "System.Diagnostics.Debugger.IsSupported": false,
        "System.Diagnostics.Metrics.Meter.IsSupported": false,
        "System.Diagnostics.Tracing.EventSource.IsSupported": false,
        "System.Globalization.Invariant": false,
        "System.TimeZoneInfo.Invariant": false,
        "System.Linq.Enumerable.IsSizeOptimized": true,
        "System.Net.Http.EnableActivityPropagation": false,
        "System.Net.Http.UseNativeHttpHandler": true,
        "System.Net.Http.WasmEnableStreamingResponse": true,
        "System.Net.SocketsHttpHandler.Http3Support": false,
        "System.Reflection.Metadata.MetadataUpdater.IsSupported": false,
        "System.Resources.ResourceManager.AllowCustomResourceTypes": false,
        "System.Resources.UseSystemResourceKeys": true,
        "System.Runtime.CompilerServices.RuntimeFeature.IsDynamicCodeSupported": true,
        "System.Runtime.InteropServices.BuiltInComInterop.IsSupported": false,
        "System.Runtime.InteropServices.EnableConsumingManagedCodeFromNativeHosting": false,
        "System.Runtime.InteropServices.EnableCppCLIHostActivation": false,
        "System.Runtime.InteropServices.Marshalling.EnableGeneratedComInterfaceComImportInterop": false,
        "System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization": false,
        "System.StartupHookProvider.IsSupported": false,
        "System.Text.Encoding.EnableUnsafeUTF7Encoding": false,
        "System.Text.Json.JsonSerializer.IsReflectionEnabledByDefault": false,
        "System.Threading.Thread.EnableAutoreleasePool": false
      }
    }
  }
}/*json-end*/);export{gt as default,ft as dotnet,mt as exit};
