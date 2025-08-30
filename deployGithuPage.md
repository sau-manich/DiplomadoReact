# Deploy en github pages

1. En routes reemplazar BrowserRouter por HashRouter de react-router-domm,esto evita errores 404 al recargar rutas en GitHub Pages. ejemplo:
    ```tsx
    import { HashRouter } from "react-router-dom"
    import App from "./App"

    createRoot(document.getElementById("root")!).render(
      <HashRouter>
        <App />
      </HashRouter>
    )
    ```
2. Configurar vite.config.ts
    ```tsx
    import { defineConfig } from "vite"
    import react from "@vitejs/plugin-react"

    export default defineConfig({
      plugins: [react()],
      base: "/<NOMBRE-REPORSITORIO>/", // <--- tu nombre de repo
    })

    ```
3. Configurar las variables de entorno con VITE_

4. Instalar gh-pages
    ```bash
    npm install gh-pages --save-dev
    ```
    >Permite subir automáticamente tu carpeta dist/ a la rama gh-pages.

5. Configurar scripts en package.json
    ```json
    "homepage": "https://<USUARIO>.github.io/<NOMBRE-REPORSITORIO>",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist"
    }
    ```
    > predeploy → genera la carpeta dist/

    > deploy → sube dist/ a la rama gh-page

6. hacer build y luego deploy
    ```bash
    npm run predeploy
    npm run deploy
    ```
7. Ir a tu repositorio de proyecto y en Configuración:
   1. Entrá a tu repositorio en GitHub.
   2. Andá a Settings → Pages.
   3. En Source:
      1. seleccioná la rama: gh-pages
      2. Carpeta: / (root)
      3. Guardá los cambios.