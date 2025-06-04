/* Typdeklaration für CSS-Module */
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

/* Spezifische Typdeklaration für Excalidraw CSS */
declare module '@simple-eam/excalidraw/index.css' {
  const content: any
  export default content
}
