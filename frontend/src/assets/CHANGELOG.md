# Changelog

## Version 0.8.4 - 10 mars 2025

* 34f88fd Add script to generate changelog and update package.json scripts
* 8ab895d Refactor LoadingScreen component to manage loading state with a delay; update Home and Book components to use isLoading state
* f68aa51 Add error boundary to SpreadViewerCanvas and enhance session storage hook; update CSS for responsive design
* 4bcc097 Refactor BookToolbar component and relocate to components directory
* 538a9c2 Update LICENSE.md to clarify copyright and usage restrictions
* b559833 Add LICENSE.md file to specify copyright and usage restrictions
* 10d65bb Add .DS_Store to .gitignore to prevent tracking of macOS system files
* 276fe92 Update GitHub Actions workflow to ping both frontend and backend Render services
* 1d0457b Add GitHub Actions workflow to keep Render Service alive with scheduled pings
* 4f78791 Comment out unused getBook and updateBook methods in BookService
* 62eed64 Add pages parameter to printPDF method and improve error logging in BookService
* a59be65 Bump version to 0.4.0 and update build date
* dada0c7 Remove isModified prop from UnsavedChangesToastProps interface
* 3ee38f2 Refactor SavePopOver component to enable saving functionality by uncommenting relevant imports and code
* 6894506 Add ExportQuality enum and update getPDF method to accept quality parameter
* 4fcc66d Add environment utility for production checks and update RouteTracker initialization
* f7a87ba Merge pull request #30 from willahh/feature/multipage
* 8088d4e Refactor canvas service and clean up unused imports; add utility functions for theme colors and update button styles in CSS
* 476bddc Add newsletter subscription component and auto-open dialog hook with styling updates
* baab6a8 Comment out production.env line in data-source.ts for safer migration script execution
* 3ce1c99 Add createdAt and updatedAt fields to Newsletter entity with migration
* e69647d Add newsletter subscription feature with validation and migration
* 0df6b18 Update pre-commit hook to use standard-version for patch versioning
* 11d2f91 Add husky pre-commit hook to run version patch and update package.json dependencies
* 725606c Refactor AboutDialog to extract getLastBuildText function for better readability and reuse
* b33fddf Add react-icons dependency and enhance About dialog with social links
* 70cbd67 Enhance About dialog with additional links and legal information, and improve formatting
* 730ec42 Enhance About dialog with improved accessibility and formatting updates
* 1ca303c Bump version to 0.3.7, add date-fns dependency, and enhance header component with About dialog
* d6d7888 Bump version to 0.3.6 and update versioning scripts to include git tagging
* a4adc24 Bump version to 0.3.5, update build date, and enhance header component to display formatted build date
* 319c1a1 Bump version to 0.3.2, add build date update script, and enhance header component with About section
* 2f72f6f Bump version to 0.2.3, display app version in header, and enhance unsaved changes notification with platform-specific keyboard shortcuts
* 9d8e05d Refactor CSS imports, remove unused font styles, and enhance unsaved changes notification component for improved clarity and user experience
* 0e9a45e Refactor unsaved changes notification component and update icon handling for improved clarity and user experience
* 92e3663 Refactor header component structure and add SavePopOver for unsaved changes notification
* b160f89 Remove unnecessary console logs and clean up code for better readability
* a921468 Refactor canvas component structure and implement navigation to the first page
* 4dcb4d7 Refactor viewport transformation handling and clean up unused console logs
* 609321b Refactor canvas viewport transformation handling for improved performance and clarity
* d924df4 Enhance canvas scrolling and zooming logic with vertical constraints and cumulative height calculation
* ff35982 Adjust canvas width calculation
* 898e94d Add 'Dessins' tab to side panel and adjust canvas service for improved page border restoration
* c1045ab Add new theme styles and refactor color handling for improved consistency
* d58ecda Add new themes and update color variables for improved styling consistency
* 21bec7e Refactor canvas service to improve page focus logic and enhance event handling
* aa6bcf4 Refactor header styles, update background gradient, and improve navigation key handling
* e396294 Refactor page auto-focus logic to improve navigation and disable focus animation
* 9cfdf75 Refactor canvas hooks to improve code clarity and add page auto-focus functionality
* ce7b9a3 Update canvas service to disable selection for specific elements
* 78a16b4 Refactor PagesNavigation component to replace arrow icons and improve layout
* df497df Add Google Analytics tracking
* ec6c473 Add personal website link in footer
* 7309817 Refactor canvas service to improve code clarity and remove unnecessary console logs
* 3fec38c Add watermark functionality and theme color utility to canvas service
* 8951094 Add useAddPage hook to PagesPanel
* c13cf5d Update PagesPanel and Book components for improved styling and layout consistency
* bb29a98 Refactor import paths for consistency, expose selectBookPages selector, and clean up console logs in useUpdatePageThumbnails
* 2ca32ea Refactor useUpdatePageThumbnails to remove console logs and enhance PagesPanel with automatic scrolling to target pages
* 31d03d0 Refactor UserBookItem to remove console log and apply aspect ratio directly in styles
* a2d06ef Add reselect for memoized selectors and update canvas hooks for improved element handling
* abe92c8 Refactor app structure by enabling StrictMode in RenderApp, updating canvas hooks for initialization, and modifying CSS gradient definitions for improved styling.
* a8cd177 Add canvas hooks for resizing, initialization, page focus, and thumbnail updates
* b112b49 Refactor app structure by commenting out StrictMode in RenderApp, initialize dimensions with client size in useDimensions, and update canvas service logging and method naming for clarity.
* 1adf120 WIP Refactor SpreadViewerCanvas to improve thumbnail updates and enhance page handling; rename getPage to getPageById in PageService
* 773d45c WIP Refactor SpreadViewerCanvas to improve thumbnail updates and enhance page handling; rename getPage to getPageById in PageService
* 214ad4f Add updatePageThumbImageData action and integrate thumbnail updates in SpreadViewerCanvas
* 0d480a1 Enhance Tooltip component with wrapperClassName prop and update ElementContent to ElementTabContent; add new dark theme styles and remove obsolete styles
* 8ae1eb6 Add dark theme styles and enhance Book component background for improved visual experience
* c5ff2b4 Enhance mouse wheel handling and scrolling state management for improved canvas navigation and user experience
* 2f7c6fe Refactor SpreadViewerCanvas to improve page navigation and add inline toolbar for element modifications
* 29cd9cc Refactor mouse wheel handling and viewport transformation for improved canvas interaction
* c954b3d Comment out needPageCenter state and related useEffect for potential optimization
* 2a42dd4 Refactor theme context and integrate appearance handling in canvas rendering for improved visual consistency
* cf15c7f Enhance PagesPanel layout and implement animated mouse wheel zooming for improved user experience
* 9b60aa2 Refactor canvas interfaces and improve focusOnPage functionality for better page management
* 15b741f Add IPageFabricObject interface and enhance canvas service methods for page management
* 6180a8d WIP on page displayed verticaly
* c864c00 Merge pull request #23 from willahh/feature/canvas/element-state
* c56b889 Refined mouse wheel zooming and drag behavior for better user interaction
* 9e35a51 Cleanup console.log
* 1de2ac4 Added zoom momentum feature and event handler enhancements
* f3c16e5 Pan movement implementation
* 438c91b WIP active object styling
* 9990ab7 Merge pull request #22 from willahh/feature/canvas/interactions
* 0b35330 Save the internal state of the canvas
* 95333bb Refactor canvas
* 713550d Cleaning up an unecessary hook
* 43358ef Refactor files
* 159cef9 Refactor Book module to remove direct context usage and improve type safety
* cbac008 Refactor SVG loading and update Element actions in Book module
* 724b3f4 Merge pull request #21 from willahh/feature/element-crud-in-canvas
* 3ab1260 Implement trackpad panning and scrollbars for zoomed canvas
* d33cbb3 Add updateElementByElementId action and integrate with CanvasService
* e128029 Refine SVG positioning and scaling
* c2afb28 Improve SVG scaling and error handling
* b1e4768 Refactor canvas element creation and improve SVG handling
* 5912767 Add @types/pako, update APIService to use pako for compressing book data
* 85cf714 Add pako
* 1158414 First implementation of addElementTopage
* cfafabb Refactor state
* 2ca42e8 Add website
* 099f11a Refactor Redux actions comments
* 36a3c56 Refactor module book files
* 4db5aad Refactor module book files
* 5adb132 Progress on debugging frontend deployment on render.com
* a1175d3 Progress on debugging frontend deployment on render.com
* 5ca7166 Progress on debugging frontend deployment on render.com
* cd78496 Fix filename case issue
* 6807335 Progress on debugging frontend deployment on render.com
* 66a9927 Progress on debugging frontend deployment on render.com
* 0fe15e5 Merge pull request #13 from willahh/feature/sidebar-refactoring
* 8ef2e17 Refactor module book files
* c41b98e Refactor module book files
* 5e73a54 Refactor module book files
* 8e5a1c3 Refactor module book files
* e3cde7d Progress on elements panel
* 84c78c9 Progress on elements panel
* 7bb5e03 Initial implementation of the elements panel
* 78e7e04 Add persistent state management with localStorage
* 0fced68 Update app layout
* 8b0956c Update app layout
* ddbda6e Update app layout
* 5acae00 Update app layout
* a53372a Remove console.log
* d2b87ce Fix PagesNavigation layout
* 0747dd8 Add PagesNavigation & Add keyboard handling to the PagesPanel component
* 387decf Fix PagesPanel layout
* 62b1ca1 Refactor the name of the theme switch composant
* 1e6186b Progress on PagePanel
* 634fdb6 Fix SpredViewerCanvas layout issues & add pagination
* becc2e6 Fix SpredViewerCanvas layout issues
* 41441d1 Fix SpredViewerCanvas layout issues
* b91eddc Use Redux for the PagesPanel component
* f5dd579 Fix layout issue when closing sidepanel
* 447da55 Fix layout issues
* e2913c5 Fix layout on book module & Fix a focus bug on the home button
* 6641c7a Progress on Sidepanel
* d25806e Progress on Sidepanel
* b749ee5 Progress on Sidepanel
* fd52e1e Bump Tailwind depdency to version 4
* e0be73a Progress on the new sidebar
* 5ffece5 Progress on the new sidebar
* 925749c Progress on the new sidebar
* b1555e4 File refactoring
* 5befc5b Cleanup console.log and comments
* 87bd8bd Merge pull request #12 from willahh/book-refacto-add-redux
* 672ecd4 Fix AddGraphicAssetToPageAction and header layout
* d3f15c6 Progress on Redux Refactor
* 4370c8b Enhance home page to only display a single button for adding page when there is no pages
* f819f6c Progress on Redux Refactor
* 47b2481 WIP on adding Redux
* d4994d9 WIP on adding Redux
* 48ffce5 Add redux
* 6bb7287 Refactor file names
* e89b139 Book refacto WIP
* 633cd12 Book refacto WIP
* 78092e1 Book refacto WIP
* 3c41174 Book refacto WIP
* 78a4da1 Book refacto WIP
* 2318975 Book refacto WIP
* 2072d56 Book refacto WIP
* 8f20155 Book refacto WIP
* 7b7f094 Book refacto WIP
* edf579d Book refacto WIP
* 94e4304 Update canvasRef useEffect dependencies
* 6080014 Refactor SpreadViewerCanvas
* 47e5149 Progress on GraphicPanel & fix homepage layout
* ce19cb1 Add library route, update navigation links, and enhance button functionality
* f903b48 Refactor UserBookItem component for improved accessibility and update class handling
* 4a53187 Add theme-based logo rendering in Header component and adjust height
* c18db6b Refactor Button component to support variant styles and improve props handling
* 8296775 Update BookCreationForm default page count, enhance CSS styles, and improve button accessibility in DescriptionSection
* 12b73d5 Update graphic resources
* 77284f5 Refactor UserBookItem component; change motion.div to motion.button for improved accessibility and update class handling
* 76ec983 Update serve commands in package.json to include configuration for production
* 8f6d869 Replace static.json with serve.json for routing; update build scripts to include CSS build step
* 2fbfe34 Refactor ElementService and Book components; improve error handling, update canvas border, and enhance CSS styles for better layout and responsiveness
* d65de23 Add additional frontend URLs for CORS configuration
* 66851ae Update media URL in environment config; add static.json for routing
* b5baf01 Enhance Book and GraphicsPanel components; update logging, modify layout, and introduce Image class for handling image objects
* 5b86c26 Update README with migration instructions; modify Book entity to allow nullable coverImage; add migration script for Book entity update
* d250efb Refactor GraphicsPanel and ImageConverter components; implement graphic asset click handler and update state management
* 342069e Rename convertImage method to uploadImage; remove unused imports and console log
* 5a399b6 Update media URL in environment config; enhance GraphicsPanel and ImageConverter components with new paths and tooltips
* ab0149f Refactor image service to integrate Supabase for file uploads; update directory creation logic and modify graphic asset DTO paths
* b95d7bf Update graphic asset entity and migration scripts; add fullPath and vectPath fields, and modify graphic asset type enum
* 2d9f3eb Add Image module for bitmap to vector conversion; implement ImageConverter component and update multer configuration
* 9b06a36 Update development server configuration and enhance CSS for font smoothing; adjust layout and rendering logic in Home and UserBooks components
* 624e4d8 Update CORS configuration to allow additional frontend origins
* 509508e Add axios for API requests and implement GraphicsPanel with asset fetching and addition functionality
* 84272c5 Add react-dnd and react-dnd-html5-backend dependencies to enable drag-and-drop functionality
* eea7a17 Add migration scripts for graphic assets and update book table; modify data source configuration
* c178f5a Add GraphicAssets module with CRUD functionality for graphic assets
* 34aee6e Improve error handling in BookPage component; display server message on save failure
* af4b26e Fix validation logic in update method to ensure book name is defined before checking length
* 62c93d3 Refactor Breadcrumb component to use content prop; add InlineEdit component for editable book name in BookHeader
* e22646c Add validation for book name in update method; ensure name is at least 3 characters long
* 2306008 Add KeyboardShortcut component; update ButtonLink and UnsavedChangesToast components for improved functionality and styling
* ae15929 Sort books by updated date in findAll method
* 0ff89d5 Enhance Breadcrumb and Tooltip components with optional descriptions; update Book page to utilize new description feature
* b2b8466 Refactor layout components to improve header handling; add Breadcrumb component for navigation; update Toast component to handle optional onClose prop
* 44a3375 Refactor BookService to include default page creation and improve aspect ratio handling; update Toast component structure and adjust Tailwind CSS colors
* 3cdbc88 Add ButtonLink component and useToast hook; update App default appearance to light
* e65d1d0 Make coverImage parameter optional and adjust file name generation
* 2419353 Fix deployement on render.com
* eeb2f10 Refactor import paths in Book module to use consistent casing
* 8be4d63 Refactor TypeScript configuration and update import paths for consistency
* 4373aa2 Update production environment variables and adjust TypeScript configuration for bundler mode
* e8a3c79 Refactor import paths in AppRoutes and SpreadViewerCanvas for consistency
* 756747e Refactor import paths in books module and services to use relative paths for consistency
* f5c0180 Remove unused fabric type declarations and update canvas type in SpreadViewerCanvas
* 4afd75e Cleanup
* 42c8c62 Remove unused className prop and commented-out image data in Tooltip and BookData components
* 5fab2de Remove console.log statements for cleaner code and improved performance
* 12d0e1b Add DynamicCSSLoader component for theme-based CSS loading and refactor theme context
* 28f101d Implement theme switching functionality and update Tailwind CSS build scripts
* 9c511f6 Refactor styles for improved dark mode support and update color classes across components
* b63fdd3 Add appearance menu
* a312d64 Upgrade Tailwind CSS to version 3.4.17
* d91f41f Add Tailwind CSS configuration import to main.css
* aa09e7b Add Tailwind CSS configuration import to main.css
* 13ec912 Add Tailwind CSS configuration import to main.css
* beb57c1 Refactor theme styles for improved dark mode support
* f8deefb Fix theme
* 43c3b79 Fix theme
* 7bf7e46 Fix theme
* 9bec543 Update theme colors
* 1da66e1 Add spread centering in viewport
* cc49d7a Refactor SpreadViewerCanvas, add mask
* c7b5908 Add thumbnail image data to Page interface and implement thumbnail update functionality
* 1096352 Refactor TypeScript configuration by consolidating tsconfig files and removing unused configurations; update production build script to streamline the build process.
* de51da4 Add path mapping in tsconfig for improved module resolution
* 5e21f79 Update production build script to include npm install for dependencies
* fd10d35 Refactor import paths to use absolute imports for improved readability and maintainability
* 2d4ec1f Refactor PageComponent styles for improved active state indication and hover effects
* 5636de7 Implement tooltip component and integrate it into the toolbar; add delete page functionality with confirmation prompt
* fa4c5aa Add tailwind-scrollbar plugin and refactor context usage in Book components
* 8b62896 Progress on page CRUD
* 0322a4e Refactor PagesPanel and SpreadViewerCanvas for improved layout and functionality; enhance page rendering with animations and dynamic sizing
* 2ba0e84 Enable selection in SpreadViewerCanvas and add selection event handlers; update Rectangle class to be selectable with controls
* 2313786 Refactor routing and data structure to support dynamic page IDs and improve spread page handling
* ec80d41 Refactor Pages component to improve layout rendering and enhance animation effects
* 31035be Refactor getObject methods to return promises and update PagesPanel to accept pages as props
* e20f9c7 Refactor SVG creation to accept dynamic content and improve object handling
* f53ac82 Refactor SVG handling and improve asynchronous group creation in SpreadViewCanvas
* c3af2f1 Refactor object attributes to use unified types and improve clarity in shape handling
* 4fd88a2 Implement DrawableObject interface and create object types for SVG, Text, Circle, Rectangle, and Triangle
* c20f99a Refactor import paths and enhance SVG object handling in the book module
* 82a5d7f Refactor element types and createObject function for improved clarity and structure
* ceb264f Add SVG support and refactor canvas event handling
* 753f362 Add default book format and name in UserBooks component
* e4900e6 Refactor SpreadViewerCanvas
* 0cba01f Refactoring InteractiveBook
* df491af Progress on zoom and pan
* 4936b58 Add zoom and pan
* f793d3f Progress on book canva
* c33d52b Progress on initializing book data structure
* 2743338 Fix BookService print to pdf
* 5e2233f Cleanup
* 102ab28 Refactor App and AppRoutes
* e2b6898 Progress on Download and Print PDF
* 093b711 Progress on Download and Print PDF
* 7cb3c23 Add jspdf
* 232ff34 Manage canvas resize
* 91d2e09 Add fabricJS and progress on main canvas in book page
* 87132d7 Refactor frontend components
* 18f2ace Refactor frontend components
* b467269 Progress on book page
* 69c0010 Progress on book page
* 2fb8737 Add radix-ui
* b9306b0 Progress on book page
* 07db23a Progress on book page
* cca8556 Minor layout fixes
* a12f088 Update README.md
* e8a4eed Update README.md
* ac7293e Update README.md
* 86fbacd Update README.md
* 347d3ac Handle loading of the cover image before displaying it
* 01cffbb Update default cover image path
* 58cc555 Add upload management to the supabase storage service
* 0dcd708 Add sharp dependency
* 6c1bd1d Progress on the integration of the supabase storage service
* ac4a70c Update env variables
* f006789 Cleanup
* 33cf3a8 progress on BookCreationForm
* 29162c6 progress on BookCreationForm
* 009ca89 Add static assets endpoint
* 37dd015 Add .vscode to .gitignore
* 952656e progress on BookCreationForm
* e22710e Add manage upload book cover image
* a9c75bd progress on BookCreationForm
* a13e5d9 progress on BookCreationForm
* d15d3f5 progress on BookCreationForm
* 462f0d6 progress on BookCreationForm
* bc4bef6 Update README.md
* ebd1fec Add autoClose props
* 6b3c748 Progress on BookCreationForm
* b4746e4 Toast component integration
* b2278c4 Add Toast component
* ca7cc7c Progress on BookCreationForm
* c35e9f5 Add react-hook-form, zod and @hookform/resolvers dependencies
* 6268efd Cleanup
* 62cb1be Fix empty visual layout on homepage
* bccf448 Added environment variable management
* e882d3a Cleanup
* cf0e244 Added environment variable management
* 2383917 Added environment variable management
* c16b74a Added environment variable management
* 0f61731 Progress on homepage
* 384f04c Update README.md
* 15d3c7f Add coverImage field
* b499175 Progress on book CRUD on homepage
* 756c923 Add a delay middleware
* 38361b9 Add FRONTEND_URL environment variable
* 3ff4952 Fix homepage errors
* 945d2e1 Add frontend .env files
* eac39a1 Progress on the book list on the homepage
* 95e8bb5 Update README.md
* a2380b9 Cleanup .env files
* b99f736 Remove the github workflows deploymen script
* 932ee47 Add es-toolkit
* 570b7ea Update README.md
* 0262274 Update README.md
* 3caf38a Fix layout in homepage
* 6122a44 Initialize book.ai
* 0c8d6d6 WIP frontend deploy configuration
* 703383a WIP frontend deploy configuration
* 399dd86 WIP frontend deploy configuration
* 2e5ed57 Add serve
* f925d8e Fix index.html
* 2cf56f0 Fix frontend build
* f8d440a Cleanup frontend
* 9ddf4fc Rename dev to frontend
* 7c4e9ef Update README.md
* 695c739 Configure deployment to Render
* 78e1e76 Update build dir
* c5e7a45 Fix vercel configuration
* d42b2f9 Add vercel configuration
* 4b080f3 Update build dir
* 22f064c Update build dir
* 6dcf48a Update README.md
* c37ff78 Setting up database prod settings on Neon
* 9df7519 Setting up migration scripts
* 97668a2 WIP database prod settings
* 80c48ff WIP database prod settings
* 47b831f Add vercel config
* 9e20aee Add vercel config
* 3fd4fba Cleanup
* 4012113 Fix book module
* 614107c Initialize book module
* cc9b4fb Add compodoc
* c49c61d Setup Swagger
* 12753d7 Setup TypeORM
* 4c24809 Setup TypeORM
* 9961de6 Update README.md
* 390ad95 Add coloringbook logo
* 2f9043c chore: update .gitignore to exclude infrastructure-specific files and folders
* 56e0030 Initialize infra
* c13e67f WIP backend
* 4dcce0f WIP backend
* baeb77e Refacto Home
* 302e837 Add users
* 4eb2ce7 Add dotenv
* 42d8915 Init backend
* e72fd1c Update README.md
* 2e1bbb8 Progress on the homepage
* 3352bc8 Add ref configuration
* a67cdbc Progress on the homepage
* f6083da Add autoFocus config to Button composant
* 5225969 Release 0.2.0
* 91bf68e Progress on the homepage
* ab57da5 Progress on the homepage
* e763e2f Update graphical resources
* 913df5f Add custom fontSize configurations
* d79e096 Progess on the homepage layout
* 1ac0ee4 Update graphical resources
* 7596c29 Update graph resources
* c4e68e5 Update README.md
* f3b22f0 Add react-popper
* d53884d Update Tooltip component
* a61f5c5 Update Switch component
* 24d7818 Add Tooltip component
* d135402 Update graphic and document resources
* 86f00bb Update README.md
* 4ecd611 Update asset export
* 15c10c2 Update versioning in package.json
* dd0b464 Testing Github Action CI/CD
* 9e9723b Undo semantic-release
* b6a9b58 Testing Github Action CI/CD
* a5ec6d5 Testing Github Action CI/CD
* a361ab8 Fix CI/CD workflows conf
* f4ae8f2 Setup CI/CD with Github Actions
* 3576a82 Update logo
* 66d8c43 Add wireframes
* 345b917 Update graph identity
* 0d822c7 Finalize logo and favicon
* 932a65e build
* e24f221 Finalization of the homepage
* 5f2c54f Update typography
* 69e017c Finalize Storybook integration
* d93b166 Add storybook
* f0222a7 Add Storybook
* 7568311 WIP home layout
* 6720e2c WIP
* 1773001 Home page WIP
* c6d9588 Build
* 0775281 Fix alias issue
* a91d26d Add motion and @types/node dependencies
* cbecb99 Add book covers for homepage
* dd2731c Update README.md
* c6b73a5 Update README.md
* 9160555 Update README.md
* 8b46a55 Fix gh page build
* b64661c New build
* 5e0d832 Update vite config
* 714fa0b Update README.md
* 1353bc3 Add github pages deploy folder
* af5dd55 Add dist files
* 8563d9e Refacto
* 52e4034 Refacto routes
* 808750c Add router
* 26d05e9 Refacto app
* 1bca6a9 Refacto Book
* 643add3 Update book page
* 46340bf Add motion dependencie
* 67638ad Update appearance
* 628d94f Update layout
* cdeab7a Cleanup
* c83b764 Update .gitignore
* e0b79b8 Update graphic files
* 91d54f1 Add graphic files
* 311184a Cleanup React.FC components
* 67ab288 Add @ config
* 931df5b WIP
* 368c99a Update .gitignore
* 21cf292 Update .gitignore
* 7dd7d3b Update index.html
* b92e6f2 Add .gitignore
* 882c22e Scaffolding project with vite
* effc963 Update figma mockup
* b9f45f4 Update README.md
* 2bc13b7 Update README.md
* a5a9142 Update README.md
* f667a6e Update README.md
* 5972e88 Initial commit

## Version 0.7.4 - 8 mars 2025

* 8446431 Add Changelog component and update package.json for changelog generation
* e1fedca Refactor layout components for responsive design and improve styling consistency
* 80a1b25 Enhance touch controls by adding zoom state management and preventing page focus during zoom
* f89102b Remove debug logging from createElement method in ElementFactory
* 58aadd3 Enhance touch controls by adding pinch detection and improving tap handling logic
* 1462420 Refactor useAutoOpenDialog hook to simplify dialog opening logic and improve timer management
* e409595 Refactor components for improved layout and functionality; add className prop to BreadCrumb and enhance MobileSidebarMenu with route checks
* 50d5bcd Refactor desktop components for improved layout and responsiveness; add new color utility for primary color variants
* 7e3582b Add mobile responsiveness to canvas initialization and page focus hooks
* 4b038e3 Add mobile support for canvas movement constraints and page focus
* 4d504ed Enhance touch controls by adding page snapping functionality and improving viewport animations
* 61cfdaf Refactor mobile layout components and update footer integration
* 4372baa Add mobile footer components and implement footer tabs panel
* 7039504 Update footer components and remove header components
* 16926eb Refactor service imports
* 9fc980b Refactor services integration
* ed18490 Update build date and refactor PDF saving logic in BookService
* e0138d3 Update mobile configuration and dependencies; add privacy info and certificates
* f965466 Add initial mobile project files
* b8ef850 Add initial mobile project files
* 388bac3 Enhance touch controls with max bottom calculation and improve double-tap detection logic
* 6a80850 Add select-none class to prevent text selection on BookPageMobile
* 773e568 Enhance touch controls with double-tap detection and disable default touch actions on root and canvas elements
* 342298b Bump version to 0.7.4
* e683508 Enhance touch controls with pinch-to-zoom functionality and improve panning behavior for mobile devices
* d44dc30 Update viewport settings, enhance touch controls, and improve CSS styles for better mobile experience
* 074ad2e Update logo.ai
* cb38ffc Update VITE_API_URL to point to the local network address
* 9cb0a33 Bump version to 0.7.3 and update build date
* 3ab13ac Refactor canvas hooks to incorporate mobile detection and enhance scrollbar calculations
* 28b56e5 Enhance touch controls with momentum and velocity tracking for smoother canvas interactions
* 94eb0ce Bump version to 0.7.2
* f0385a9 Add touch controls for canvas interaction and refactor initialization hook
* bf89700 Update viewport settings, version numbers, and enhance analytics tracking in MobileSidebarMenu
* 9794b4c Refactor BookFooterMobile and SpreadViewerCanvas
* 7cfaab4 Enhance MobileSidebarMenu with animations using framer-motion
* 60b9844 Add custom hook useIsMobile
* 892efda Refactor book components: replace BookHeader with BookFooter, add footer button styles, and update styles for better responsiveness
* 13a9380 Add responsive BookPage and headers
* b6c974c Bump version to 0.7.0
* 00b6575 Add error handling for Axios responses and update Book interface with createdAt and updatedAt fields
* 3e31538 Add z-index to Tooltip component
* 2c4589a Bump version to 0.6.0
* e6768fa Add error handling to BookToolbar for import failures and clean up console logs
* b9c7e2c Add createdAt and updatedAt fields to Book interface and normalize book data in actions
* 4105abc Add export functionality to BookToolbar and implement file download in BookService
* 0505dc0 Bump version to 0.5.1
* e5aafc4 Refactor import statements to use consistent casing for action files and update build date in package.json
* b3f1e97 Update keep-alive workflow to ping services every 14 minutes and improve error handling
* 604e8ba Bump version to 0.5.0
