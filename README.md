## MayXcami (sitio estático)

Sitio estático simple (HTML/CSS/JS) pensado para publicar en **GitHub Pages**.

### Estructura

- `index.html`: página principal
- `fotitos/index.html`: mini dashboard
- `fotitos/francia.html`, `fotitos/italia.html`: páginas para fotos

### Ver en local

Desde esta carpeta:

```bash
python3 -m http.server 5173
```

Luego abre `http://localhost:5173`.

### Publicar en GitHub Pages

En GitHub:

- Settings → Pages
- **Build and deployment**: Deploy from a branch
- Branch: `main` / folder: `/ (root)`

