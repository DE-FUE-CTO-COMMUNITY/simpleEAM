'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useMutation, useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'
import {
  CREATE_PRODUCT_FAMILY,
  DELETE_PRODUCT_FAMILY,
  GET_PRODUCT_FAMILIES,
  UPDATE_PRODUCT_FAMILY,
} from '@/graphql/productFamily'

type ProductFamilyType = 'HARDWARE' | 'SOFTWARE'

type ProductFamilyCategory =
  | 'COMPUTE_END_USER_DEVICES'
  | 'NETWORK_DEVICES'
  | 'STORAGE_DATA_INFRASTRUCTURE'
  | 'SECURITY_HARDWARE'
  | 'PERIPHERALS_OUTPUT_DEVICES'
  | 'DATA_CENTER_INFRASTRUCTURE'
  | 'OPERATING_PLATFORM_SOFTWARE'
  | 'INFRASTRUCTURE_PLATFORM_SOFTWARE'
  | 'CLOUD_PLATFORM_SERVICES'
  | 'SECURITY_SOFTWARE'
  | 'MANAGEMENT_OPERATIONS_SOFTWARE'
  | 'END_USER_COLLABORATION_SOFTWARE'
  | 'DEVELOPMENT_ENGINEERING_SOFTWARE'
  | 'BUSINESS_ENTERPRISE_APPLICATIONS'

interface ProductFamilyRecord {
  id: string
  name: string
  category: ProductFamilyCategory
  type: ProductFamilyType
  softwareProducts?: Array<{ id: string }>
  hardwareProducts?: Array<{ id: string }>
}

interface FormState {
  name: string
  category: ProductFamilyCategory
  type: ProductFamilyType
}

const HARDWARE_PRODUCT_FAMILY_CATEGORIES: ProductFamilyCategory[] = [
  'COMPUTE_END_USER_DEVICES',
  'NETWORK_DEVICES',
  'STORAGE_DATA_INFRASTRUCTURE',
  'SECURITY_HARDWARE',
  'PERIPHERALS_OUTPUT_DEVICES',
  'DATA_CENTER_INFRASTRUCTURE',
]

const SOFTWARE_PRODUCT_FAMILY_CATEGORIES: ProductFamilyCategory[] = [
  'OPERATING_PLATFORM_SOFTWARE',
  'INFRASTRUCTURE_PLATFORM_SOFTWARE',
  'CLOUD_PLATFORM_SERVICES',
  'SECURITY_SOFTWARE',
  'MANAGEMENT_OPERATIONS_SOFTWARE',
  'END_USER_COLLABORATION_SOFTWARE',
  'DEVELOPMENT_ENGINEERING_SOFTWARE',
  'BUSINESS_ENTERPRISE_APPLICATIONS',
]

const ProductFamilyManagement = () => {
  const t = useTranslations('admin.productFamilies')
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [selected, setSelected] = useState<ProductFamilyRecord | null>(null)
  const [formState, setFormState] = useState<FormState>({
    name: '',
    category: 'OPERATING_PLATFORM_SOFTWARE',
    type: 'SOFTWARE',
  })

  const categoryOptions = useMemo(
    () =>
      formState.type === 'HARDWARE'
        ? HARDWARE_PRODUCT_FAMILY_CATEGORIES
        : SOFTWARE_PRODUCT_FAMILY_CATEGORIES,
    [formState.type]
  )

  useEffect(() => {
    if (!categoryOptions.includes(formState.category)) {
      setFormState(prev => ({ ...prev, category: categoryOptions[0] }))
    }
  }, [categoryOptions, formState.category])

  const { data, loading, refetch } = useQuery(GET_PRODUCT_FAMILIES, {
    fetchPolicy: 'cache-and-network',
    onError: e => setErrorMessage(e.message),
  })

  const [createProductFamily, { loading: creating }] = useMutation(CREATE_PRODUCT_FAMILY, {
    onCompleted: () => {
      void refetch()
      handleCloseDialog()
    },
    onError: e => setErrorMessage(e.message),
  })

  const [updateProductFamily, { loading: updating }] = useMutation(UPDATE_PRODUCT_FAMILY, {
    onCompleted: () => {
      void refetch()
      handleCloseDialog()
    },
    onError: e => setErrorMessage(e.message),
  })

  const [deleteProductFamily, { loading: deleting }] = useMutation(DELETE_PRODUCT_FAMILY, {
    onCompleted: () => {
      void refetch()
    },
    onError: e => setErrorMessage(e.message),
  })

  const rows = (data?.productFamilies ?? []) as ProductFamilyRecord[]

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      return rows
    }

    return rows.filter(row => {
      const typeLabel = t(`types.${row.type}` as never).toLowerCase()
      const categoryLabel = t(`categories.${row.category}` as never).toLowerCase()
      return (
        row.name.toLowerCase().includes(term) ||
        typeLabel.includes(term) ||
        categoryLabel.includes(term)
      )
    })
  }, [rows, searchTerm, t])

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelected(null)
    setMode('create')
    setFormState({
      name: '',
      category: 'OPERATING_PLATFORM_SOFTWARE',
      type: 'SOFTWARE',
    })
  }

  const handleOpenCreate = () => {
    setMode('create')
    setSelected(null)
    setFormState({
      name: '',
      category: 'OPERATING_PLATFORM_SOFTWARE',
      type: 'SOFTWARE',
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (row: ProductFamilyRecord) => {
    setMode('edit')
    setSelected(row)
    setFormState({
      name: row.name,
      category: row.category,
      type: row.type,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formState.name.trim()) {
      setErrorMessage(t('validation.nameRequired'))
      return
    }

    if (mode === 'create') {
      await createProductFamily({
        variables: {
          input: [
            {
              name: formState.name.trim(),
              category: formState.category,
              type: formState.type,
            },
          ],
        },
      })
      return
    }

    if (selected) {
      await updateProductFamily({
        variables: {
          id: selected.id,
          input: {
            name: { set: formState.name.trim() },
            category: { set: formState.category },
            type: { set: formState.type },
          },
        },
      })
    }
  }

  const handleDelete = async (row: ProductFamilyRecord) => {
    await deleteProductFamily({ variables: { id: row.id } })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {t('title')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          {t('addNew')}
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('table.name')}</TableCell>
                  <TableCell>{t('table.category')}</TableCell>
                  <TableCell>{t('table.type')}</TableCell>
                  <TableCell>{t('table.usedBy')}</TableCell>
                  <TableCell align="right">{t('table.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{t(`categories.${row.category}` as never)}</TableCell>
                    <TableCell>
                      <Chip size="small" label={t(`types.${row.type}` as never)} />
                    </TableCell>
                    <TableCell>
                      {row.type === 'SOFTWARE'
                        ? `${row.softwareProducts?.length ?? 0} ${t('table.softwareProducts')}`
                        : `${row.hardwareProducts?.length ?? 0} ${t('table.hardwareProducts')}`}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('actions.edit')}>
                        <IconButton size="small" onClick={() => handleOpenEdit(row)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('actions.delete')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(row)}
                          disabled={deleting}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {t('noData')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{mode === 'create' ? t('createTitle') : t('editTitle')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('form.name')}
            fullWidth
            value={formState.name}
            onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
          />

          <TextField
            margin="dense"
            label={t('form.type')}
            select
            fullWidth
            value={formState.type}
            onChange={e =>
              setFormState(prev => ({ ...prev, type: e.target.value as ProductFamilyType }))
            }
          >
            <MenuItem value="SOFTWARE">{t('types.SOFTWARE')}</MenuItem>
            <MenuItem value="HARDWARE">{t('types.HARDWARE')}</MenuItem>
          </TextField>

          <TextField
            margin="dense"
            label={t('form.category')}
            select
            fullWidth
            value={formState.category}
            onChange={e =>
              setFormState(prev => ({ ...prev, category: e.target.value as ProductFamilyCategory }))
            }
          >
            {categoryOptions.map(category => (
              <MenuItem key={category} value={category}>
                {t(`categories.${category}` as never)}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('actions.cancel')}</Button>
          <Button onClick={handleSave} variant="contained" disabled={creating || updating}>
            {t('actions.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductFamilyManagement
