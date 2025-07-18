'use client'

import React from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { MenuItem, ListItemIcon, ListItemText, Menu } from '@mui/material'

// Unterstützte Sprachen
const languages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

interface LanguageSwitcherProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ anchorEl, open, onClose }) => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLang = params.lang as string

  const handleLanguageChange = (langCode: string) => {
    // Ersetze die aktuelle Sprache in der URL
    const segments = pathname.split('/')
    segments[1] = langCode // Ersetze die Sprache (z.B. /de/... -> /en/...)
    const newPath = segments.join('/')

    router.push(newPath)
    onClose()
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {languages.map(language => (
        <MenuItem
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          selected={language.code === currentLang}
        >
          <ListItemIcon>
            <span style={{ fontSize: '1.2em' }}>{language.flag}</span>
          </ListItemIcon>
          <ListItemText>
            {language.name}
            {language.code === currentLang && ' ✓'}
          </ListItemText>
        </MenuItem>
      ))}
    </Menu>
  )
}

export default LanguageSwitcher
