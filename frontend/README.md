<br />
<p align="center">
<a href="documents/coloringbook_logo_wide.png">
    <img src="documents/coloringbook_logo_wide.png" alt="Coloring Book" width="400" >
  </a>

  <p align="center">
    A React application for creating personalized coloring books from imported or custom-created images.
    <br />
    <a href="https://github.com/willahh/coloringbook"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://coloringbook-frontend.onrender.com/">Live Demo</a>
    ·
    <a href="https://github.com/willahh/coloringbook/issues">Report Bug</a>
    ·
    <a href="https://github.com/willahh/coloringbook/issues">Request Feature</a>
  </p>
</p>

## Project Structure 📂
```
coloring-book-creator/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Application pages (e.g., Home, Editor)
│   ├── utils/            # Helper functions (e.g., image conversion)
│   ├── App.tsx           # Main App component
│   ├── index.tsx         # Application entry point
│   └── styles/           # Global and component-specific styles
├── package.json
└── README.md
```

## Installation 🛠️

1. Clone this repository:
   ```bash
   git clone https://github.com/willahh/coloringbook.git
   cd coloringbook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   # Open your browser and navigate to http://localhost:3000.
   ```

## Project setup
```sh
npm create vite@latest # Install Vite, Typescript is setup automatically (config files)
npm install -D tailwindcss postcss autoprefixer # Install tailwindcss, postcss and autoprefixer
npm install -D @types/node # Install node types (fix an issue with a specific vite.config.ts)
npm install vite-plugin-svgr --save-dev # To manage the import of svg icons
npm install es-toolkit # [es-toolkit](https://es-toolkit.slash.page/usage.html)
npm install react-hook-form # React form
npm zod # Data validation
npm @hookform/resolvers # React-hook-form resolvers for zod
npx tailwindcss init -p
npm install motion
npm install react-router-dom
npm install @types/react-router-dom
npx storybook@latest init
npm install @storybook/manager-api @storybook/theming --save-dev
npm install --save-dev storybook-dark-mode
npm install @heroicons/react # https://heroicons.com/
npm install @headlessui/react # https://headlessui.com/react/menu
npm install @popperjs/core # A JavaScript library to position floating elements and create interactions for them. - https://floating-ui.com/
npm install react-popper @popperjs/core # Floting-ui React wrapper - https://popper.js.org/react-popper/v2/ - 
npm install @radix-ui/themes
npm install @radix-ui/react-hover-card
```


### Theming
- https://uicolors.app/create - Tailwind CSS Color Generator


## Resources
- [Pixabay](https://pixabay.com/fr/) - Images libres de droits & gratuites à télécharger 



## Build css
```sh
cd dev
npm run dev
```

## Build for production
- frontend/readme.md#build
- backend/readme.md#build


## Deploy for production
- frontend/readme.md#deploy
- backend/readme.md#deploy



## Contact
- [@twitter](https://twitter.com/willahhravel)
- [Coloringbook repository](https://github.com/willahh/coloringbook)


## License
All Rights Reserved

Copyright (c) 2025 William Ravel
