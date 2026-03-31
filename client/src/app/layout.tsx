import './globals.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: process.env.BRAND_NAME_SHORT || 'NextGen EAM',
  description: 'Enterprise Architecture Management System',
}

// Root layout - minimal HTML structure
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
