// Clear all diagram-related localStorage items
if (typeof window !== 'undefined') {
  console.log('Clearing diagram localStorage...')
  localStorage.removeItem('excalidraw-scene')
  localStorage.removeItem('excalidraw-current-diagram')
  localStorage.removeItem('excalidraw-last-saved-scene')
  console.log('Diagram localStorage cleared')
} else {
  console.log('This script must be run in a browser environment')
}
