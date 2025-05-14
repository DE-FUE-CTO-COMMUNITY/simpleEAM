'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useForm } from '@tanstack/react-form';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  CircularProgress,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';
import { z } from 'zod';
import { useQuery } from '@apollo/client';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuth, login, isArchitect } from '@/lib/auth';
import RootLayout from '@/components/layout/RootLayout';
import { CREATE_CAPABILITY } from '@/graphql/capability';
import { GET_CAPABILITIES } from '@/graphql/capability';

// Schema für die Formularvalidierung
const capabilitySchema = z.object({
  name: z
    .string()
    .min(3, 'Der Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Der Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Die Beschreibung darf maximal 1000 Zeichen lang sein'),
  level: z
    .number()
    .int()
    .min(0, 'Level muss 0 oder höher sein')
    .max(3, 'Level darf maximal 3 sein'),
  parentCapabilityId: z.string().optional(),
});

// TypeScript Typen basierend auf dem Schema
type CapabilityFormValues = z.infer<typeof capabilitySchema>;

const CreateCapabilityPage = () => {
  const { authenticated } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login();
    } else if (authenticated && !isArchitect()) {
      enqueueSnackbar('Sie haben keine Berechtigung, Business Capabilities zu erstellen', {
        variant: 'error',
      });
      router.push('/capabilities');
    }
  }, [authenticated, router, enqueueSnackbar]);

  // Bestehende Capabilities für Dropdown-Auswahl laden
  const { data: capabilitiesData, loading: capabilitiesLoading } = useQuery(GET_CAPABILITIES, {
    skip: !authenticated,
    fetchPolicy: 'cache-and-network',
  });

  // Mutation zum Erstellen einer neuen Capability
  const [createCapability, { loading: submitting }] = useMutation(CREATE_CAPABILITY, {
    onCompleted: () => {
      enqueueSnackbar('Business Capability erfolgreich erstellt', { variant: 'success' });
      router.push('/capabilities');
    },
    onError: error => {
      enqueueSnackbar(`Fehler beim Erstellen der Business Capability: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  // TanStack Form konfigurieren
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      level: 0,
      parentCapabilityId: '',
    },
    // Eigene Implementierung eines Validators mit Zod
    validator: ({ value }) => {
      try {
        capabilitySchema.parse(value);
        return { valid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Fehler nach Feld gruppieren
          const fieldErrors: Record<string, string[]> = {};
          error.errors.forEach(err => {
            const field = err.path[0] as string;
            if (!fieldErrors[field]) {
              fieldErrors[field] = [];
            }
            fieldErrors[field].push(err.message);
          });
          return { valid: false, errors: fieldErrors };
        }
        return { valid: false };
      }
    },
    onSubmit: async ({ value }) => {
      if (!authenticated || !isArchitect()) {
        return;
      }

      const input = {
        ...value,
        parentCapabilityId: value.parentCapabilityId || null,
      };

      await createCapability({
        variables: { input },
      });
    },
  });

  // Zurück zur Übersicht
  const handleCancel = () => {
    router.push('/capabilities');
  };

  // Level-Label für die Anzeige
  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0:
        return 'Enterprise';
      case 1:
        return 'Geschäftsbereich';
      case 2:
        return 'Geschäftsfunktion';
      case 3:
        return 'Geschäftsprozess';
      default:
        return `Level ${level}`;
    }
  };

  // Filtert Capabilities basierend auf dem ausgewählten Level
  const getAvailableParentCapabilities = (selectedLevel: number) => {
    if (!capabilitiesData?.capabilities || selectedLevel === 0) {
      return [];
    }

    return capabilitiesData.capabilities.filter(
      (capability: any) => capability.level < selectedLevel
    );
  };

  return (
    <RootLayout>
      <Box sx={{ py: 2, px: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Neue Business Capability
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
          >
            Zurück zur Übersicht
          </Button>
        </Box>

        <Paper sx={{ p: 3, mb: 4 }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Allgemeine Informationen
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {/* Name */}
              <Grid item xs={12} md={6}>
                <form.Field
                  name="name"
                  render={({ state, handleBlur, handleChange }) => (
                    <FormControl fullWidth error={!!state.meta.errors.length}>
                      <FormLabel htmlFor="name" required>
                        Name
                      </FormLabel>
                      <TextField
                        id="name"
                        name="name"
                        value={state.value}
                        onChange={e => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        error={!!state.meta.errors.length}
                        placeholder="Name der Business Capability"
                        variant="outlined"
                        fullWidth
                        size="medium"
                      />
                      {state.meta.errors.length > 0 && (
                        <FormHelperText>{state.meta.errors.join(', ')}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Level */}
              <Grid item xs={12} md={6}>
                <form.Field
                  name="level"
                  render={({ state, handleBlur, handleChange }) => (
                    <FormControl fullWidth error={!!state.meta.errors.length}>
                      <FormLabel htmlFor="level" required>
                        Level
                      </FormLabel>
                      <TextField
                        id="level"
                        name="level"
                        select
                        value={state.value}
                        onChange={e => handleChange(Number(e.target.value))}
                        onBlur={handleBlur}
                        error={!!state.meta.errors.length}
                        variant="outlined"
                        fullWidth
                        size="medium"
                      >
                        {[0, 1, 2, 3].map(level => (
                          <MenuItem key={level} value={level}>
                            {level} - {getLevelLabel(level)}
                          </MenuItem>
                        ))}
                      </TextField>
                      {state.meta.errors.length > 0 && (
                        <FormHelperText>{state.meta.errors.join(', ')}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Übergeordnete Capability */}
              <Grid item xs={12} md={6}>
                <form.Field
                  name="parentCapabilityId"
                  render={({ state, handleBlur, handleChange }) => {
                    const level = form.getFieldValue('level');
                    const availableParents = getAvailableParentCapabilities(level);
                    const isDisabled = level === 0 || availableParents.length === 0;

                    return (
                      <FormControl fullWidth error={!!state.meta.errors.length}>
                        <FormLabel htmlFor="parentCapabilityId">Übergeordnete Capability</FormLabel>
                        <TextField
                          id="parentCapabilityId"
                          name="parentCapabilityId"
                          select
                          value={state.value}
                          onChange={e => handleChange(e.target.value)}
                          onBlur={handleBlur}
                          error={!!state.meta.errors.length}
                          variant="outlined"
                          fullWidth
                          size="medium"
                          disabled={isDisabled || capabilitiesLoading}
                          helperText={
                            level === 0 ? 'Enterprise-Level hat keine übergeordnete Capability' : ''
                          }
                        >
                          <MenuItem value="">
                            <em>Keine</em>
                          </MenuItem>
                          {availableParents.map((cap: any) => (
                            <MenuItem key={cap.id} value={cap.id}>
                              {cap.name} (Level {cap.level})
                            </MenuItem>
                          ))}
                        </TextField>
                        {state.meta.errors.length > 0 && (
                          <FormHelperText>{state.meta.errors.join(', ')}</FormHelperText>
                        )}
                      </FormControl>
                    );
                  }}
                />
              </Grid>

              {/* Beschreibung */}
              <Grid item xs={12}>
                <form.Field
                  name="description"
                  render={({ state, handleBlur, handleChange }) => (
                    <FormControl fullWidth error={!!state.meta.errors.length}>
                      <FormLabel htmlFor="description" required>
                        Beschreibung
                      </FormLabel>
                      <TextField
                        id="description"
                        name="description"
                        value={state.value}
                        onChange={e => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        error={!!state.meta.errors.length}
                        placeholder="Detaillierte Beschreibung der Business Capability"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        size="medium"
                      />
                      {state.meta.errors.length > 0 && (
                        <FormHelperText>{state.meta.errors.join(', ')}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button variant="outlined" color="inherit" onClick={handleCancel}>
                    Abbrechen
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={
                      submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
                    }
                    disabled={submitting || form.state.isSubmitting || !form.state.canSubmit}
                  >
                    {submitting ? 'Wird gespeichert...' : 'Speichern'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting, state.errors]}
          children={([canSubmit, isSubmitting, errors]) => (
            <Card sx={{ mb: 4, backgroundColor: theme.palette.background.neutral }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Form Status:
                </Typography>
                <Box component="pre" fontSize="small">
                  {JSON.stringify({ canSubmit, isSubmitting, errors }, null, 2)}
                </Box>
              </CardContent>
            </Card>
          )}
        />
      </Box>
    </RootLayout>
  );
};

export default CreateCapabilityPage;
