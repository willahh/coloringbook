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
    <a href="https://willahh.github.io/coloringbook/">Live Demo</a>
    ·
    <a href="https://github.com/willahh/coloringbook/issues">Report Bug</a>
    ·
    <a href="https://github.com/willahh/coloringbook/issues">Request Feature</a>
  </p>
</p>

## Features ✨
- Import images and convert them into outlines for coloring.
- Draw custom designs directly in the app.
- Organize pages into a book format, ready for printing.
- Simple and intuitive interface for all age groups.


## Usage 📖
Upload an image to convert it into a coloring outline.
Use the drawing tool to create custom designs.
Arrange pages in the desired order.
Download the final book as a PDF.

## Stack 🧰
This project is built with the following technologies and tools:

- **TypeScript**: For type-safe JavaScript development.  
- **React**: To build the user interface. Documentation referenced directly in the app - [React Documentation](https://react.dev/reference/react).  
  - **Server API**: For server-side rendering or data fetching.  
  - **Client API**: For client-side interactions and components.  
- **Vite**: A fast and modern build tool - [Learn more](https://vite.dev/).  
- **Tailwind CSS**: For utility-first styling with rapid development.  
- **GitHub Actions**: For automated deployment workflows.  
- **Supabase**: Open source Firebase alternative [Learn more](https://supabase.com/).
- **Supabase-js**: [Learn more](https://supabase.com/docs/reference/javascript/start).

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


## Acknowledgments 🙏
Inspired by the creative possibilities of coloring books.
Thanks to open-source libraries and the developer community!

