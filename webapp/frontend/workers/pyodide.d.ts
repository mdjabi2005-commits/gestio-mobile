// webapp/frontend/workers/pyodide.d.ts
// Déclaration de type pour l'import CDN de Pyodide dans les Web Workers

declare module "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.mjs" {
    export function loadPyodide(options?: {
        indexURL?: string
        packages?: string[]
    }): Promise<{
        runPythonAsync: (code: string) => Promise<any>
        loadPackagesFromImports: (code: string) => Promise<void>
        loadPackage: (packages: string | string[]) => Promise<void>
        globals: any
    }>
}
