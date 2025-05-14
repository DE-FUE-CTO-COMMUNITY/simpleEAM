'use client';

import React, { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
// Die formatErrorMessage-Funktion wurde entfernt, da sie nicht verwendet wird.
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Grid } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon, Edit as EditIcon } from '@mui/icons-material';
import { BusinessCapability, CapabilityStatus } from '../../gql/generated';

// Schema für die Formularvalidierung
export const capabilitySchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  maturityLevel: z
    .number()
    .int()
    .min(0, 'Level muss 0 oder höher sein')
    .max(3, 'Level darf maximal 3 sein'),
  businessValue: z
    .number()
    .int()
    .min(0, 'Geschäftswert muss 0 oder höher sein')
    .max(10, 'Geschäftswert darf maximal 10 sein'),
  status: z.nativeEnum(CapabilityStatus),
  owner: z.string().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().optional(),
});

// TypeScript Typen basierend auf dem Schema
export type CapabilityFormValues = z.infer<typeof capabilitySchema>;

export interface CapabilityFormProps {
  capability?: BusinessCapability | null;
  availableCapabilities?: BusinessCapability[];
  availableTags?: string[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CapabilityFormValues) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  loading?: boolean;
}

const getLevelLabel = (level: number | null | undefined): string => {
  if (level === null || level === undefined) {
    return 'Nicht definiert';
  }

  switch (level) {
    case 0:
      return 'Niedrig';
    case 1:
      return 'Mittel';
    case 2:
      return 'Hoch';
    case 3:
      return 'Sehr Hoch';
    default:
      return `Level ${level}`;
  }
};

const getStatusLabel = (status: CapabilityStatus): string => {
  switch (status) {
    case CapabilityStatus.ACTIVE:
      return 'Aktiv';
    case CapabilityStatus.PLANNED:
      return 'Geplant';
    case CapabilityStatus.RETIRED:
      return 'Zurückgezogen';
    default:
      return status;
  }
};

const CapabilityForm: React.FC<CapabilityFormProps> = ({
  capability,
  availableCapabilities = [],
  availableTags = [],
  isOpen,
  onClose,
  onSubmit,
  mode,
  loading = false,
}) => {
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  // Formulardaten initialisieren
  // Formulardaten initialisieren
  const defaultValues: CapabilityFormValues = {
    name: capability?.name ?? '',
    description: capability?.description ?? '',
    maturityLevel: capability?.maturityLevel ?? 0,
    businessValue: capability?.businessValue ?? 0,
    status: capability?.status ?? CapabilityStatus.ACTIVE,
    owner: capability?.owner ?? '',
    tags: capability?.tags ?? [],
    parentId: capability?.children?.[0]?.id ?? '',
  };

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  // Dialog-Titel basierend auf dem Modus
  const getDialogTitle = () => {
    if (isCreateMode) return 'Neue Business Capability erstellen';
    if (isEditMode) return 'Business Capability bearbeiten';
    return 'Business Capability Details';
  };

  // Zurücksetzen des Formulars bei Schließen des Dialogs und Aktualisieren bei neuem Capability
  // Extrahiere stabile Werte aus capability, um die Abhängigkeiten zu stabilisieren
  const capabilityName = capability?.name;
  const capabilityDescription = capability?.description;
  const capabilityMaturityLevel = capability?.maturityLevel;
  const capabilityBusinessValue = capability?.businessValue;
  const capabilityStatus = capability?.status;
  const capabilityOwner = capability?.owner;
  const capabilityTags = capability?.tags;
  const capabilityParentId = capability?.children?.[0]?.id;

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    } else if (capability) {
      // Aktualisiere das Formular bei Änderungen am Capability-Objekt
      form.reset({
        name: capabilityName ?? '',
        description: capabilityDescription ?? '',
        maturityLevel: capabilityMaturityLevel ?? 0,
        businessValue: capabilityBusinessValue ?? 0,
        status: capabilityStatus ?? CapabilityStatus.ACTIVE,
        owner: capabilityOwner ?? '',
        tags: capabilityTags ?? [],
        parentId: capabilityParentId ?? '',
      });
    }
  }, [
    isOpen,
    form,
    capability,
    capabilityName,
    capabilityDescription,
    capabilityMaturityLevel,
    capabilityBusinessValue,
    capabilityStatus,
    capabilityOwner,
    capabilityTags,
    capabilityParentId,
  ]);

  return (
    <Dialog open={isOpen} onClose={isViewMode ? onClose : undefined} fullWidth maxWidth="md">
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <DialogContent>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="name"
                validators={{
                  onChange: capabilitySchema.shape.name,
                }}
              >
                {field => (
                  <FormControl fullWidth error={!!field.state.meta.errors}>
                    <FormLabel>Name *</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      error={!!field.state.meta.errors}
                    />
                    <FormHelperText>
                      {field.state.meta.errors
                        ? Array.isArray(field.state.meta.errors)
                          ? field.state.meta.errors.join(', ')
                          : String(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="status"
                validators={{
                  onChange: capabilitySchema.shape.status,
                }}
              >
                {field => (
                  <FormControl fullWidth error={!!field.state.meta.errors}>
                    <FormLabel>Status *</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => {
                        field.handleChange(e.target.value as CapabilityStatus);
                      }}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      select
                      error={!!field.state.meta.errors}
                    >
                      {Object.values(CapabilityStatus).map(status => (
                        <MenuItem key={status} value={status}>
                          {getStatusLabel(status)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <FormHelperText>
                      {field.state.meta.errors
                        ? Array.isArray(field.state.meta.errors)
                          ? field.state.meta.errors.join(', ')
                          : String(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>

            {/* Beschreibung */}
            <Grid size={{ xs: 12 }}>
              <form.Field
                name="description"
                validators={{
                  onChange: capabilitySchema.shape.description,
                }}
              >
                {field => (
                  <FormControl fullWidth error={!!field.state.meta.errors}>
                    <FormLabel>Beschreibung *</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      multiline
                      rows={4}
                      error={!!field.state.meta.errors}
                    />
                    <FormHelperText>
                      {field.state.meta.errors
                        ? Array.isArray(field.state.meta.errors)
                          ? field.state.meta.errors.join(', ')
                          : String(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>

            {/* Reifegrad */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="maturityLevel"
                validators={{
                  onChange: capabilitySchema.shape.maturityLevel,
                }}
              >
                {field => (
                  <FormControl fullWidth error={!!field.state.meta.errors}>
                    <FormLabel>Reifegrad *</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      select
                      error={!!field.state.meta.errors}
                    >
                      {[0, 1, 2, 3].map(level => (
                        <MenuItem key={level} value={level}>
                          {getLevelLabel(level)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <FormHelperText>
                      {field.state.meta.errors
                        ? Array.isArray(field.state.meta.errors)
                          ? field.state.meta.errors.join(', ')
                          : String(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>

            {/* Geschäftswert */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="businessValue"
                validators={{
                  onChange: capabilitySchema.shape.businessValue,
                }}
              >
                {field => (
                  <FormControl fullWidth error={!!field.state.meta.errors}>
                    <FormLabel>Geschäftswert *</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      inputProps={{ min: 0, max: 10 }}
                      error={!!field.state.meta.errors}
                      type="number"
                    />
                    <FormHelperText>
                      {field.state.meta.errors
                        ? Array.isArray(field.state.meta.errors)
                          ? field.state.meta.errors.join(', ')
                          : String(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>

            {/* Verantwortlicher */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="owner"
                validators={{
                  onChange: capabilitySchema.shape.owner,
                }}
              >
                {field => (
                  <FormControl fullWidth error={!!field.state.meta.errors}>
                    <FormLabel>Verantwortlicher</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      error={!!field.state.meta.errors}
                    />
                    <FormHelperText>
                      {field.state.meta.errors
                        ? Array.isArray(field.state.meta.errors)
                          ? field.state.meta.errors.join(', ')
                          : String(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>

            {/* Übergeordnete Capability */}
            <Grid size={{ xs: 12, md: 6 }}>
              <form.Field
                name="parentId"
                validators={{
                  onChange: capabilitySchema.shape.parentId,
                }}
              >
                {field => (
                  <FormControl fullWidth error={!!field.state.meta.errors}>
                    <FormLabel>Übergeordnete Capability</FormLabel>
                    <TextField
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isViewMode || loading}
                      select
                      error={!!field.state.meta.errors}
                    >
                      <MenuItem value="">Keine übergeordnete Capability</MenuItem>
                      {availableCapabilities
                        .filter(cap => cap.id !== capability?.id) // Verhindere Selbstreferenz
                        .map(cap => (
                          <MenuItem key={cap.id} value={cap.id}>
                            {cap.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    <FormHelperText>
                      {field.state.meta.errors
                        ? Array.isArray(field.state.meta.errors)
                          ? field.state.meta.errors.join(', ')
                          : String(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>

            {/* Tags */}
            <Grid size={{ xs: 12 }}>
              <form.Field
                name="tags"
                validators={{
                  onChange: capabilitySchema.shape.tags,
                }}
              >
                {field => (
                  <FormControl fullWidth error={!!field.state.meta.errors}>
                    <FormLabel>Tags</FormLabel>
                    {isViewMode ? (
                      <Box sx={{ mt: 1 }}>
                        {field.state.value && field.state.value.length > 0 ? (
                          field.state.value.map(tag => (
                            <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Keine Tags vorhanden
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Autocomplete
                        multiple
                        options={availableTags}
                        freeSolo
                        value={field.state.value || []}
                        onChange={(_, newValue) => {
                          field.handleChange(newValue as string[]);
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => {
                            const tagProps = getTagProps({ index });
                            // Key wird nicht in props weitergegeben, sondern als separates Prop
                            return (
                              <Chip
                                key={tagProps.key}
                                label={option}
                                disabled={loading}
                                onDelete={tagProps.onDelete}
                                data-tag-index={tagProps['data-tag-index']}
                                tabIndex={tagProps.tabIndex}
                                className={tagProps.className}
                              />
                            );
                          })
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={!!field.state.meta.errors}
                            disabled={loading}
                          />
                        )}
                      />
                    )}
                    <FormHelperText>
                      {field.state.meta.errors
                        ? Array.isArray(field.state.meta.errors)
                          ? field.state.meta.errors.join(', ')
                          : String(field.state.meta.errors)
                        : ''}
                    </FormHelperText>
                  </FormControl>
                )}
              </form.Field>
            </Grid>

            {/* Metadaten anzeigen im View-Modus */}
            {isViewMode && capability && (
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Erstellt am: {new Date(capability.createdAt).toLocaleString()}
                </Typography>
                {capability.updatedAt && (
                  <Typography variant="subtitle2">
                    Aktualisiert am: {new Date(capability.updatedAt).toLocaleString()}
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} startIcon={<CancelIcon />}>
            {isViewMode ? 'Schließen' : 'Abbrechen'}
          </Button>
          {!isViewMode && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!form.state.isValid || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {isCreateMode ? 'Erstellen' : 'Speichern'}
            </Button>
          )}
          {isViewMode && capability && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onClose();
                // Hier könnten wir zum Edit-Modus wechseln
              }}
              startIcon={<EditIcon />}
            >
              Bearbeiten
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CapabilityForm;
