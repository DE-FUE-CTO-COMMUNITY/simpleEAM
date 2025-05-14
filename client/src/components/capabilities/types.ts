import { BusinessCapability, CapabilityStatus } from '../../gql/generated';

// Nutze den generierten Typ als Basis und passe ihn für unsere Komponenten an
export type Capability = Pick<
  BusinessCapability,
  | 'id'
  | 'name'
  | 'description'
  | 'maturityLevel'
  | 'status'
  | 'businessValue'
  | 'owner'
  | 'tags'
  | 'createdAt'
  | 'updatedAt'
  | 'children'
>;

export interface FilterState {
  statusFilter: CapabilityStatus[];
  maturityLevelFilter: number[];
  businessValueRange: [number, number];
  tagsFilter: string[];
  descriptionFilter: string;
  ownerFilter: string;
  updatedDateRange: [string, string];
}

export interface FilterProps {
  filterState: FilterState;
  availableStatuses: CapabilityStatus[];
  availableTags: string[];
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onResetFilter: () => void;
  onClose: () => void;
  onApply: (activeCount: number) => void;
}
