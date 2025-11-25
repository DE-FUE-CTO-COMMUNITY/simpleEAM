'use client'

import { useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { FONT_FAMILY } from '@excalidraw/excalidraw'
import type { ExcalidrawFont } from '@/components/companies/types'
import { useThemeMode } from '@/contexts/ThemeContext'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { useThemeConfig } from '@/lib/runtime-config'

const ExcalidrawCanvas = dynamic(
  async () => {
    await import('@excalidraw/excalidraw/index.css')
    const { Excalidraw } = await import('@excalidraw/excalidraw')
    return Excalidraw
  },
  {
    ssr: false,
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Diagram Editor</div>,
  }
)

const COMPANY_FONT_TO_EXCALIDRAW: Record<ExcalidrawFont, number> = {
  'Comic Shanns': FONT_FAMILY['Comic Shanns'],
  Excalifont: FONT_FAMILY.Excalifont,
  'Lilita One': FONT_FAMILY['Lilita One'],
  Nunito: FONT_FAMILY.Nunito,
}

const FALLBACK_EXCALIDRAW_FONT = FONT_FAMILY.Excalifont

export default function DiagramEditor() {
  const { mode } = useThemeMode()
  const { selectedCompany } = useCompanyContext()
  const themeConfig = useThemeConfig()

  const branding = useMemo(
    () => ({
      primaryColor: selectedCompany?.primaryColor || undefined,
      secondaryColor: selectedCompany?.secondaryColor || undefined,
    }),
    [selectedCompany?.primaryColor, selectedCompany?.secondaryColor]
  )

  const companyFontFamily = useMemo(() => {
    const diagramFont = selectedCompany?.diagramFont as ExcalidrawFont | undefined
    if (diagramFont && COMPANY_FONT_TO_EXCALIDRAW[diagramFont]) {
      return COMPANY_FONT_TO_EXCALIDRAW[diagramFont]
    }
    return FALLBACK_EXCALIDRAW_FONT
  }, [selectedCompany?.diagramFont])

  useEffect(() => {
    let isMounted = true
    const updateTheme = async () => {
      const { injectExcalidrawThemeCSS } = await import('@/styles/excalidraw-dynamic-theme')
      if (isMounted) {
        injectExcalidrawThemeCSS(mode, branding, themeConfig)
      }
    }
    void updateTheme()

    return () => {
      isMounted = false
    }
  }, [mode, branding, themeConfig])

  const excalidrawTheme = mode === 'dark' ? 'dark' : 'light'

  const initialData = useMemo(
    () => ({
      elements: [],
      appState: {
        viewBackgroundColor: mode === 'dark' ? '#121212' : '#ffffff',
        currentItemFontFamily: companyFontFamily,
      },
    }),
    [mode, companyFontFamily]
  )

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ExcalidrawCanvas theme={excalidrawTheme} initialData={initialData} />
    </div>
  )
}
