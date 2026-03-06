import ReactDOM from "react-dom/client"
import { GestioApp } from "@/ui/shell/app"
import "./index.css"

// Enregistrer le Service Worker pour PWA
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
            (registration) => {
                console.log("[Gestio] SW enregistré:", registration.scope)
            },
            (error) => {
                console.error("[Gestio] Erreur SW:", error)
            }
        )
    })
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <GestioApp />
)
