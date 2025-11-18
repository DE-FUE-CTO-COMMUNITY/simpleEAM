/* Type declaration for CSS modules */
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

/* Specific type declaration for Excalidraw CSS */
declare module '@excalidraw/excalidraw/index.css' {
  const content: any
  export default content
}

/* Type declaration for our Excalidraw override styles */
declare module '@/styles/excalidraw-override.css' {
  const content: any
  export default content
}
