import { type DragEvent } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export interface GroupedElementListItem {
  id: string
  title: string
  secondary?: string
  elementType: string
  disabled?: boolean
  draggable?: boolean
  onClick?: () => void
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void
}

export interface GroupedElementListSection {
  key: string
  title: string
  items: GroupedElementListItem[]
  emptyLabel: string
}

interface GroupedElementSectionsProps {
  sections: GroupedElementListSection[]
  expandedSections: Set<string>
  onExpandedSectionsChange: (sections: Set<string>) => void
  loading?: boolean
  getItemColor?: (item: GroupedElementListItem) => string
}

export default function GroupedElementSections({
  sections,
  expandedSections,
  onExpandedSectionsChange,
  loading = false,
  getItemColor,
}: GroupedElementSectionsProps) {
  return (
    <>
      {sections.map(section => (
        <Accordion
          key={section.key}
          disableGutters
          square
          expanded={expandedSections.has(section.key)}
          onChange={(_, isExpanded) => {
            const next = new Set(expandedSections)
            if (isExpanded) {
              next.add(section.key)
            } else {
              next.delete(section.key)
            }
            onExpandedSectionsChange(next)
          }}
          sx={{
            '&:before': { display: 'none' },
            boxShadow: 'none',
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />} sx={{ px: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                {section.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {section.items.length}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 1 }}>
            {loading && !section.items.length ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                <CircularProgress size={18} />
              </Box>
            ) : section.items.length ? (
              <List dense disablePadding>
                {section.items.map(item => (
                  <ListItemButton
                    key={item.id}
                    component="div"
                    disabled={item.disabled}
                    draggable={item.draggable}
                    onDragStart={item.onDragStart}
                    onClick={item.onClick}
                    sx={{
                      mb: 0.5,
                      borderRadius: 1,
                      alignItems: 'center',
                      border: theme => `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        bgcolor: theme => theme.palette.action.hover,
                      },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 6,
                        borderRadius: 1,
                        bgcolor: getItemColor?.(item) ?? 'transparent',
                        mr: 1,
                        alignSelf: 'stretch',
                      }}
                    />
                    <ListItemText
                      primary={item.title}
                      secondary={item.secondary}
                      primaryTypographyProps={{ noWrap: true }}
                      secondaryTypographyProps={{ noWrap: true }}
                      sx={{ mr: 1 }}
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {section.emptyLabel}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  )
}
