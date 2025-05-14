export interface Capability {
  id: string;
  name: string;
  description: string;
  maturityLevel: number;
  status: string;
  businessValue: number;
  owner?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  children?: { id: string; name: string }[];
}

export interface FilterState {
  statusFilter: string[];
  maturityLevelFilter: number[];
  businessValueRange: [number, number];
  tagsFilter: string[];
  descriptionFilter: string;
  ownerFilter: string;
  updatedDateRange: [string, string];
}

export interface FilterProps {
  filterState: FilterState;
  availableStatuses: string[];
  availableTags: string[];
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onResetFilter: () => void;
  onClose: () => void;
  onApply: (activeCount: number) => void;
}
