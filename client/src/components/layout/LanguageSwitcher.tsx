'use client'

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { MenuItem, ListItemIcon, ListItemText, Menu } from '@mui/material'

// Supported languages
const languages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const

interface LanguageSwitcherProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ anchorEl, open, onClose }) => {
  const t = useTranslations('language')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (langCode: 'de' | 'en') => {
    // next-intl Navigation verwendet automatisch die richtige URL-Struktur
    router.replace(pathname, { locale: langCode })
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
          selected={language.code === locale}
        >
          <ListItemIcon>
            <span style={{ fontSize: '1.2em' }}>{language.flag}</span>
          </ListItemIcon>
          <ListItemText>
            {language.code === 'de' ? t('german') : t('english')}
            {language.code === locale && ' ✓'}
          </ListItemText>
        </MenuItem>
      ))}
    </Menu>
  )
}

export default LanguageSwitcher
