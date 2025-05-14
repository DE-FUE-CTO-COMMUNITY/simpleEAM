'use client';

import { format } from 'date-fns';
import { FilterState } from './types';

// Formatiert das Datum für die Anzeige
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
  } catch (e) {
    return 'Unbekannt';
  }
};

// Liefert den Label für den Reifegrad
export const getLevelLabel = (level: number | null | undefined): string => {
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

// Berechnet die Anzahl der aktiven Filter
export const countActiveFilters = (filterState: FilterState): number => {
  const {
    statusFilter,
    maturityLevelFilter,
    businessValueRange,
    tagsFilter,
    descriptionFilter,
    ownerFilter,
    updatedDateRange,
  } = filterState;

  return (
    (statusFilter.length > 0 ? 1 : 0) +
    (maturityLevelFilter.length > 0 ? 1 : 0) +
    (businessValueRange[0] > 0 || businessValueRange[1] < 10 ? 1 : 0) +
    (tagsFilter.length > 0 ? 1 : 0) +
    (descriptionFilter ? 1 : 0) +
    (ownerFilter ? 1 : 0) +
    (updatedDateRange[0] || updatedDateRange[1] ? 1 : 0)
  );
};
