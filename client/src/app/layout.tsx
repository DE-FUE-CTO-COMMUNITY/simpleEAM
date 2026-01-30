import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simple EAM',
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
