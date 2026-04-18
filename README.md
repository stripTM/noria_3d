# Noria 3D - Proyecto Web TypeScript

Un proyecto web moderno desarrollado con **TypeScript**, **HTML** y **CSS**.

## 📁 Estructura del Proyecto

```text
noria_3d/
├── src/              # Código fuente TypeScript
│   └── main.ts       # Archivo principal de la aplicación
├── public/           # Archivos estáticos
│   ├── index.html    # Página principal HTML
│   └── styles.css    # Estilos CSS
├── dist/             # Archivos compilados (generados automáticamente)
├── .github/          # Configuración de GitHub
│   └── copilot-instructions.md
├── package.json      # Dependencias y scripts
├── tsconfig.json     # Configuración de TypeScript
└── README.md         # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 16 o superior)
- **npm** (incluido con Node.js)

### Instalación de Dependencias

```bash
npm install
```

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run build` | Compila el código TypeScript a JavaScript |
| `npm run dev` | Modo desarrollo con compilación automática (watch mode) |
| `npm start` | Inicia servidor local para servir la aplicación |
| `npm run clean` | Limpia el directorio `dist/` |

## 🛠️ Desarrollo

### 1. Compilar el proyecto

```bash
npm run build
```

### 2. Modo desarrollo (recomendado)

```bash
npm run dev
```

Este comando mantiene la compilación automática cuando guardas cambios.

### 3. Servir la aplicación

```bash
npm start
```

Abre tu navegador en `http://localhost:3000`

## 🌟 Características

- **TypeScript**: Tipado estático para mayor robustez
- **CSS Moderno**: Variables CSS, flexbox, grid y responsive design
- **Arquitectura Modular**: Clases y interfaces bien definidas
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Hot Reload**: Recarga automática durante el desarrollo

## 🎯 Funcionalidades Principales

- Aplicación interactiva con TypeScript
- Sistema de eventos y manejo del DOM
- Utilidades helper para funciones comunes
- Diseño responsive y moderno
- Animaciones CSS suaves

## 🔧 Configuración de TypeScript

El proyecto está configurado con:

- **Target**: ES2020
- **Modo estricto** habilitado
- **Source maps** para debugging
- **Declaraciones** automáticas

## 🎨 Estilos

- **CSS Variables** para temas consistentes
- **Flexbox y Grid** para layouts
- **Animaciones** suaves y transiciones
- **Mobile-first** responsive design

## 📚 Estructura del Código

### `src/main.ts`

- Clase principal `NoriaApp`
- Manejo de eventos del DOM
- Sistema de renderizado dinámico
- Utilidades helper

### `public/index.html`

- Estructura HTML semántica
- Meta tags para SEO y responsive
- Carga de estilos y scripts

### `public/styles.css`

- Reset CSS y variables
- Componentes estilizados
- Media queries responsive
- Animaciones y transiciones

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

---

¡Desarrollado con ❤️ usando TypeScript!
