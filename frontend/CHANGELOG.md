# Changelog

## Version 0.9.12 - 11 mars 2025

* 17aba38 Bump version to 0.9.12, update build date, and remove unused width state management
* 0a4190b Bump version to 0.9.11, update build date, and enhance dimension update logging
* bfa9d79 Enhance canvas initialization and resize logging with detailed dimensions
* 2292f5e Bump version to 0.9.9, update build date, and enhance scrollbar drawing logs
* 4763df0 Bump version to 0.9.8, update viewport meta tag formatting, and add console logs for scrollbar drawing
* 3efffcd Update version to 0.9.7, add error handling for server issues, and implement ErrorScreen component
* d1f7fc6 Bump version to 0.9.6
* 253117f Merge pull request #34 from willahh/feature/ga4proxy
* 1e20ae2 Enhance analytics tracking: add console logs, update event tracking for menu interactions, and refactor page view tracking
* 4d61390 Refactor analytics event
* 945a928 Add Google Analytics 4 tracking module and update environment variables
* 358f882 Bump version to 0.9.5
* eb7c6f4 Refactor analytics tracking for book events and update event names for consistency
* 6025586 Bump version to 0.9.4
* b366a54 Enhance touch controls with zoom momentum and pinch handling
* b76e497 Bump version to 0.9.3 and update custom scrollbar styles across components
* 33d3b4a Bump version to 0.9.2 and update custom scrollbar styles in PagesPanel component
* c9c1dae Bump version to 0.9.1
* b07bbc4 Bump version to 0.9.0
* 8458b32 Merge pull request #33 from willahh/feature/image/svg2png-w-lazy
* 10b7b32 Add custom scrollbar styles and refactor layout in BookPageDesktop and SidePanel components
* f90d47c Add endpoint to retrieve raw SVG content and refactor SVG loading in frontend
* 6723828 Add SVG to PNG conversion module and integrate into image processing
* 469a02f Implement momentum-based panning in touch controls for improved user experience
* ee90238 Refactor touch controls to improve pinch handling and streamline momentum logic
* 26fefa0 Refactor touch controls to implement momentum-based panning and improve zoom handling
* 3b2d0f4 Enhance SpreadViewerCanvas with window resize handling and debounce for page focus
* da53afd Bump version to 0.8.6
* 4ae77e1 Integrate analytics middleware for tracking events
* ea28427 Bump version to 0.8.5
* 08929d8 Move CHANGELOG.md to /public
* 4a3fa60 Merge pull request #32 from willahh/feature/mobile
* 8a99cd6 Fix various warnings, cleanup
* e77e9f8 Update version and build date in package.json; enhance changelog generation script to filter existing commits and update CHANGELOG.md accordingly
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
