/// <reference lib="webworker" />
// webapp/frontend/workers/pyodide.worker.ts
// Web Worker qui charge Pyodide et exécute du Python

interface WorkerMessage {
    id: string
    type: "init" | "run"
    code?: string
}

interface WorkerResponse {
    id: string
    type: "status" | "result" | "error"
    status?: "loading" | "ready" | "error"
    data?: unknown
    error?: string
}

let pyodide: any = null

function postResponse(msg: WorkerResponse) {
    self.postMessage(msg)
}

async function initPyodide() {
    try {
        postResponse({ id: "init", type: "status", status: "loading" })

        // Charge Pyodide via CDN — utilise import() pour compatibilité ES module
        const pyodideModule = await import(
            /* @vite-ignore */
            "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.mjs"
        )

        pyodide = await pyodideModule.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
        })

        postResponse({ id: "init", type: "status", status: "ready" })
    } catch (err) {
        postResponse({
            id: "init",
            type: "error",
            error: `Pyodide init failed: ${err}`,
        })
        postResponse({ id: "init", type: "status", status: "error" })
    }
}

async function runPython(id: string, code: string) {
    if (!pyodide) {
        postResponse({ id, type: "error", error: "Pyodide not initialized" })
        return
    }
    try {
        const result = await pyodide.runPythonAsync(code)
        const jsResult = result?.toJs ? result.toJs({ dict_converter: Object.fromEntries }) : result
        postResponse({ id, type: "result", data: jsResult })
    } catch (err) {
        postResponse({ id, type: "error", error: `${err}` })
    }
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
    const { id, type, code } = event.data

    switch (type) {
        case "init":
            await initPyodide()
            break
        case "run":
            if (code) await runPython(id, code)
            break
        default:
            postResponse({ id, type: "error", error: `Unknown message type: ${type}` })
    }
}
