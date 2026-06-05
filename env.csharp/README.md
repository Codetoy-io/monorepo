/src/build is compiled from wasmsharp

the build is copied to the build dir via `OutputPath` in the csproj of wasmsharp
```xml
<Project Sdk="Microsoft.NET.Sdk.WebAssembly">
  <PropertyGroup>
    <OutputPath>$(SolutionDir)/../env.csharp/src/build</OutputPath>
```

