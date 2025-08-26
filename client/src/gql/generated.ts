export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
};

/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAsset = {
  __typename?: 'AIAsset';
  accuracy?: Maybe<Scalars['Float']['output']>;
  aiType: AiAssetType;
  company: Array<Company>;
  companyConnection: AiAssetCompanyConnection;
  costs?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  depictedInDiagrams: Array<Diagram>;
  depictedInDiagramsConnection: AiAssetDepictedInDiagramsConnection;
  description?: Maybe<Scalars['String']['output']>;
  hostedOn: Array<Infrastructure>;
  hostedOnConnection: AiAssetHostedOnConnection;
  id: Scalars['ID']['output'];
  implementsPrinciples: Array<ArchitecturePrinciple>;
  implementsPrinciplesConnection: AiAssetImplementsPrinciplesConnection;
  lastUpdated?: Maybe<Scalars['Date']['output']>;
  license?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  owners: Array<Person>;
  ownersConnection: AiAssetOwnersConnection;
  partOfArchitectures: Array<Architecture>;
  partOfArchitecturesConnection: AiAssetPartOfArchitecturesConnection;
  provider?: Maybe<Scalars['String']['output']>;
  status: AiAssetStatus;
  supportsCapabilities: Array<BusinessCapability>;
  supportsCapabilitiesConnection: AiAssetSupportsCapabilitiesConnection;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  trainedWithDataObjects: Array<DataObject>;
  trainedWithDataObjectsConnection: AiAssetTrainedWithDataObjectsConnection;
  trainingDate?: Maybe<Scalars['Date']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usedByApplications: Array<Application>;
  usedByApplicationsConnection: AiAssetUsedByApplicationsConnection;
  usedByOrganisations: Array<Organisation>;
  usedByOrganisationsConnection: AiAssetUsedByOrganisationsConnection;
  version?: Maybe<Scalars['String']['output']>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetCompanyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanySort>>;
  where?: InputMaybe<CompanyWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetCompanyConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetCompanyConnectionSort>>;
  where?: InputMaybe<AiAssetCompanyConnectionWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetDepictedInDiagramsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramSort>>;
  where?: InputMaybe<DiagramWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetDepictedInDiagramsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetDepictedInDiagramsConnectionSort>>;
  where?: InputMaybe<AiAssetDepictedInDiagramsConnectionWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetHostedOnArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetHostedOnConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetHostedOnConnectionSort>>;
  where?: InputMaybe<AiAssetHostedOnConnectionWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetImplementsPrinciplesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitecturePrincipleSort>>;
  where?: InputMaybe<ArchitecturePrincipleWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetImplementsPrinciplesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetImplementsPrinciplesConnectionSort>>;
  where?: InputMaybe<AiAssetImplementsPrinciplesConnectionWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetOwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetOwnersConnectionSort>>;
  where?: InputMaybe<AiAssetOwnersConnectionWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetPartOfArchitecturesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetPartOfArchitecturesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetPartOfArchitecturesConnectionSort>>;
  where?: InputMaybe<AiAssetPartOfArchitecturesConnectionWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetSupportsCapabilitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetSupportsCapabilitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSupportsCapabilitiesConnectionSort>>;
  where?: InputMaybe<AiAssetSupportsCapabilitiesConnectionWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetTrainedWithDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetTrainedWithDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetTrainedWithDataObjectsConnectionSort>>;
  where?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetUsedByApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetUsedByApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetUsedByApplicationsConnectionSort>>;
  where?: InputMaybe<AiAssetUsedByApplicationsConnectionWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetUsedByOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


/** AIAsset - repräsentiert ein KI-Asset im Enterprise Architecture Management */
export type AiAssetUsedByOrganisationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetUsedByOrganisationsConnectionSort>>;
  where?: InputMaybe<AiAssetUsedByOrganisationsConnectionWhere>;
};

export type AiAssetAggregate = {
  __typename?: 'AIAssetAggregate';
  count: Count;
  node: AiAssetAggregateNode;
};

export type AiAssetAggregateNode = {
  __typename?: 'AIAssetAggregateNode';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type AiAssetApplicationUsedByApplicationsAggregateSelection = {
  __typename?: 'AIAssetApplicationUsedByApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<AiAssetApplicationUsedByApplicationsNodeAggregateSelection>;
};

export type AiAssetApplicationUsedByApplicationsNodeAggregateSelection = {
  __typename?: 'AIAssetApplicationUsedByApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type AiAssetArchitecturePartOfArchitecturesAggregateSelection = {
  __typename?: 'AIAssetArchitecturePartOfArchitecturesAggregateSelection';
  count: CountConnection;
  node?: Maybe<AiAssetArchitecturePartOfArchitecturesNodeAggregateSelection>;
};

export type AiAssetArchitecturePartOfArchitecturesNodeAggregateSelection = {
  __typename?: 'AIAssetArchitecturePartOfArchitecturesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type AiAssetArchitecturePrincipleImplementsPrinciplesAggregateSelection = {
  __typename?: 'AIAssetArchitecturePrincipleImplementsPrinciplesAggregateSelection';
  count: CountConnection;
  node?: Maybe<AiAssetArchitecturePrincipleImplementsPrinciplesNodeAggregateSelection>;
};

export type AiAssetArchitecturePrincipleImplementsPrinciplesNodeAggregateSelection = {
  __typename?: 'AIAssetArchitecturePrincipleImplementsPrinciplesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  implications: StringAggregateSelection;
  name: StringAggregateSelection;
  rationale: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type AiAssetBusinessCapabilitySupportsCapabilitiesAggregateSelection = {
  __typename?: 'AIAssetBusinessCapabilitySupportsCapabilitiesAggregateSelection';
  count: CountConnection;
  node?: Maybe<AiAssetBusinessCapabilitySupportsCapabilitiesNodeAggregateSelection>;
};

export type AiAssetBusinessCapabilitySupportsCapabilitiesNodeAggregateSelection = {
  __typename?: 'AIAssetBusinessCapabilitySupportsCapabilitiesNodeAggregateSelection';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type AiAssetCompanyAggregateInput = {
  AND?: InputMaybe<Array<AiAssetCompanyAggregateInput>>;
  NOT?: InputMaybe<AiAssetCompanyAggregateInput>;
  OR?: InputMaybe<Array<AiAssetCompanyAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AiAssetCompanyNodeAggregationWhereInput>;
};

export type AiAssetCompanyCompanyAggregateSelection = {
  __typename?: 'AIAssetCompanyCompanyAggregateSelection';
  count: CountConnection;
  node?: Maybe<AiAssetCompanyCompanyNodeAggregateSelection>;
};

export type AiAssetCompanyCompanyNodeAggregateSelection = {
  __typename?: 'AIAssetCompanyCompanyNodeAggregateSelection';
  address: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  industry: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  website: StringAggregateSelection;
};

export type AiAssetCompanyConnectFieldInput = {
  connect?: InputMaybe<Array<CompanyConnectInput>>;
  where?: InputMaybe<CompanyConnectWhere>;
};

export type AiAssetCompanyConnection = {
  __typename?: 'AIAssetCompanyConnection';
  aggregate: AiAssetCompanyCompanyAggregateSelection;
  edges: Array<AiAssetCompanyRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AiAssetCompanyConnectionAggregateInput = {
  AND?: InputMaybe<Array<AiAssetCompanyConnectionAggregateInput>>;
  NOT?: InputMaybe<AiAssetCompanyConnectionAggregateInput>;
  OR?: InputMaybe<Array<AiAssetCompanyConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<AiAssetCompanyNodeAggregationWhereInput>;
};

export type AiAssetCompanyConnectionFilters = {
  /** Filter AIAssets by aggregating results on related AIAssetCompanyConnections */
  aggregate?: InputMaybe<AiAssetCompanyConnectionAggregateInput>;
  /** Return AIAssets where all of the related AIAssetCompanyConnections match this filter */
  all?: InputMaybe<AiAssetCompanyConnectionWhere>;
  /** Return AIAssets where none of the related AIAssetCompanyConnections match this filter */
  none?: InputMaybe<AiAssetCompanyConnectionWhere>;
  /** Return AIAssets where one of the related AIAssetCompanyConnections match this filter */
  single?: InputMaybe<AiAssetCompanyConnectionWhere>;
  /** Return AIAssets where some of the related AIAssetCompanyConnections match this filter */
  some?: InputMaybe<AiAssetCompanyConnectionWhere>;
};

export type AiAssetCompanyConnectionSort = {
  node?: InputMaybe<CompanySort>;
};

export type AiAssetCompanyConnectionWhere = {
  AND?: InputMaybe<Array<AiAssetCompanyConnectionWhere>>;
  NOT?: InputMaybe<AiAssetCompanyConnectionWhere>;
  OR?: InputMaybe<Array<AiAssetCompanyConnectionWhere>>;
  node?: InputMaybe<CompanyWhere>;
};

export type AiAssetCompanyCreateFieldInput = {
  node: CompanyCreateInput;
};

export type AiAssetCompanyDeleteFieldInput = {
  delete?: InputMaybe<CompanyDeleteInput>;
  where?: InputMaybe<AiAssetCompanyConnectionWhere>;
};

export type AiAssetCompanyDisconnectFieldInput = {
  disconnect?: InputMaybe<CompanyDisconnectInput>;
  where?: InputMaybe<AiAssetCompanyConnectionWhere>;
};

export type AiAssetCompanyFieldInput = {
  connect?: InputMaybe<Array<AiAssetCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetCompanyCreateFieldInput>>;
};

export type AiAssetCompanyNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AiAssetCompanyNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AiAssetCompanyNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AiAssetCompanyNodeAggregationWhereInput>>;
  address?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  industry?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  website?: InputMaybe<StringScalarAggregationFilters>;
};

export type AiAssetCompanyRelationship = {
  __typename?: 'AIAssetCompanyRelationship';
  cursor: Scalars['String']['output'];
  node: Company;
};

export type AiAssetCompanyUpdateConnectionInput = {
  node?: InputMaybe<CompanyUpdateInput>;
  where?: InputMaybe<AiAssetCompanyConnectionWhere>;
};

export type AiAssetCompanyUpdateFieldInput = {
  connect?: InputMaybe<Array<AiAssetCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetCompanyCreateFieldInput>>;
  delete?: InputMaybe<Array<AiAssetCompanyDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AiAssetCompanyDisconnectFieldInput>>;
  update?: InputMaybe<AiAssetCompanyUpdateConnectionInput>;
};

export type AiAssetConnectInput = {
  company?: InputMaybe<Array<AiAssetCompanyConnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<AiAssetDepictedInDiagramsConnectFieldInput>>;
  hostedOn?: InputMaybe<Array<AiAssetHostedOnConnectFieldInput>>;
  implementsPrinciples?: InputMaybe<Array<AiAssetImplementsPrinciplesConnectFieldInput>>;
  owners?: InputMaybe<Array<AiAssetOwnersConnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<AiAssetPartOfArchitecturesConnectFieldInput>>;
  supportsCapabilities?: InputMaybe<Array<AiAssetSupportsCapabilitiesConnectFieldInput>>;
  trainedWithDataObjects?: InputMaybe<Array<AiAssetTrainedWithDataObjectsConnectFieldInput>>;
  usedByApplications?: InputMaybe<Array<AiAssetUsedByApplicationsConnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<AiAssetUsedByOrganisationsConnectFieldInput>>;
};

export type AiAssetConnectWhere = {
  node: AiAssetWhere;
};

export type AiAssetCreateInput = {
  accuracy?: InputMaybe<Scalars['Float']['input']>;
  aiType: AiAssetType;
  company?: InputMaybe<AiAssetCompanyFieldInput>;
  costs?: InputMaybe<Scalars['Float']['input']>;
  depictedInDiagrams?: InputMaybe<AiAssetDepictedInDiagramsFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  hostedOn?: InputMaybe<AiAssetHostedOnFieldInput>;
  implementsPrinciples?: InputMaybe<AiAssetImplementsPrinciplesFieldInput>;
  lastUpdated?: InputMaybe<Scalars['Date']['input']>;
  license?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  owners?: InputMaybe<AiAssetOwnersFieldInput>;
  partOfArchitectures?: InputMaybe<AiAssetPartOfArchitecturesFieldInput>;
  provider?: InputMaybe<Scalars['String']['input']>;
  status: AiAssetStatus;
  supportsCapabilities?: InputMaybe<AiAssetSupportsCapabilitiesFieldInput>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  trainedWithDataObjects?: InputMaybe<AiAssetTrainedWithDataObjectsFieldInput>;
  trainingDate?: InputMaybe<Scalars['Date']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usedByApplications?: InputMaybe<AiAssetUsedByApplicationsFieldInput>;
  usedByOrganisations?: InputMaybe<AiAssetUsedByOrganisationsFieldInput>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type AiAssetDataObjectTrainedWithDataObjectsAggregateSelection = {
  __typename?: 'AIAssetDataObjectTrainedWithDataObjectsAggregateSelection';
  count: CountConnection;
  node?: Maybe<AiAssetDataObjectTrainedWithDataObjectsNodeAggregateSelection>;
};

export type AiAssetDataObjectTrainedWithDataObjectsNodeAggregateSelection = {
  __typename?: 'AIAssetDataObjectTrainedWithDataObjectsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type AiAssetDeleteInput = {
  company?: InputMaybe<Array<AiAssetCompanyDeleteFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<AiAssetDepictedInDiagramsDeleteFieldInput>>;
  hostedOn?: InputMaybe<Array<AiAssetHostedOnDeleteFieldInput>>;
  implementsPrinciples?: InputMaybe<Array<AiAssetImplementsPrinciplesDeleteFieldInput>>;
  owners?: InputMaybe<Array<AiAssetOwnersDeleteFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<AiAssetPartOfArchitecturesDeleteFieldInput>>;
  supportsCapabilities?: InputMaybe<Array<AiAssetSupportsCapabilitiesDeleteFieldInput>>;
  trainedWithDataObjects?: InputMaybe<Array<AiAssetTrainedWithDataObjectsDeleteFieldInput>>;
  usedByApplications?: InputMaybe<Array<AiAssetUsedByApplicationsDeleteFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<AiAssetUsedByOrganisationsDeleteFieldInput>>;
};

export type AiAssetDepictedInDiagramsAggregateInput = {
  AND?: InputMaybe<Array<AiAssetDepictedInDiagramsAggregateInput>>;
  NOT?: InputMaybe<AiAssetDepictedInDiagramsAggregateInput>;
  OR?: InputMaybe<Array<AiAssetDepictedInDiagramsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AiAssetDepictedInDiagramsNodeAggregationWhereInput>;
};

export type AiAssetDepictedInDiagramsConnectFieldInput = {
  connect?: InputMaybe<Array<DiagramConnectInput>>;
  where?: InputMaybe<DiagramConnectWhere>;
};

export type AiAssetDepictedInDiagramsConnection = {
  __typename?: 'AIAssetDepictedInDiagramsConnection';
  aggregate: AiAssetDiagramDepictedInDiagramsAggregateSelection;
  edges: Array<AiAssetDepictedInDiagramsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AiAssetDepictedInDiagramsConnectionAggregateInput = {
  AND?: InputMaybe<Array<AiAssetDepictedInDiagramsConnectionAggregateInput>>;
  NOT?: InputMaybe<AiAssetDepictedInDiagramsConnectionAggregateInput>;
  OR?: InputMaybe<Array<AiAssetDepictedInDiagramsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<AiAssetDepictedInDiagramsNodeAggregationWhereInput>;
};

export type AiAssetDepictedInDiagramsConnectionFilters = {
  /** Filter AIAssets by aggregating results on related AIAssetDepictedInDiagramsConnections */
  aggregate?: InputMaybe<AiAssetDepictedInDiagramsConnectionAggregateInput>;
  /** Return AIAssets where all of the related AIAssetDepictedInDiagramsConnections match this filter */
  all?: InputMaybe<AiAssetDepictedInDiagramsConnectionWhere>;
  /** Return AIAssets where none of the related AIAssetDepictedInDiagramsConnections match this filter */
  none?: InputMaybe<AiAssetDepictedInDiagramsConnectionWhere>;
  /** Return AIAssets where one of the related AIAssetDepictedInDiagramsConnections match this filter */
  single?: InputMaybe<AiAssetDepictedInDiagramsConnectionWhere>;
  /** Return AIAssets where some of the related AIAssetDepictedInDiagramsConnections match this filter */
  some?: InputMaybe<AiAssetDepictedInDiagramsConnectionWhere>;
};

export type AiAssetDepictedInDiagramsConnectionSort = {
  node?: InputMaybe<DiagramSort>;
};

export type AiAssetDepictedInDiagramsConnectionWhere = {
  AND?: InputMaybe<Array<AiAssetDepictedInDiagramsConnectionWhere>>;
  NOT?: InputMaybe<AiAssetDepictedInDiagramsConnectionWhere>;
  OR?: InputMaybe<Array<AiAssetDepictedInDiagramsConnectionWhere>>;
  node?: InputMaybe<DiagramWhere>;
};

export type AiAssetDepictedInDiagramsCreateFieldInput = {
  node: DiagramCreateInput;
};

export type AiAssetDepictedInDiagramsDeleteFieldInput = {
  delete?: InputMaybe<DiagramDeleteInput>;
  where?: InputMaybe<AiAssetDepictedInDiagramsConnectionWhere>;
};

export type AiAssetDepictedInDiagramsDisconnectFieldInput = {
  disconnect?: InputMaybe<DiagramDisconnectInput>;
  where?: InputMaybe<AiAssetDepictedInDiagramsConnectionWhere>;
};

export type AiAssetDepictedInDiagramsFieldInput = {
  connect?: InputMaybe<Array<AiAssetDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetDepictedInDiagramsCreateFieldInput>>;
};

export type AiAssetDepictedInDiagramsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AiAssetDepictedInDiagramsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AiAssetDepictedInDiagramsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AiAssetDepictedInDiagramsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  diagramJson?: InputMaybe<StringScalarAggregationFilters>;
  diagramPng?: InputMaybe<StringScalarAggregationFilters>;
  title?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type AiAssetDepictedInDiagramsRelationship = {
  __typename?: 'AIAssetDepictedInDiagramsRelationship';
  cursor: Scalars['String']['output'];
  node: Diagram;
};

export type AiAssetDepictedInDiagramsUpdateConnectionInput = {
  node?: InputMaybe<DiagramUpdateInput>;
  where?: InputMaybe<AiAssetDepictedInDiagramsConnectionWhere>;
};

export type AiAssetDepictedInDiagramsUpdateFieldInput = {
  connect?: InputMaybe<Array<AiAssetDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetDepictedInDiagramsCreateFieldInput>>;
  delete?: InputMaybe<Array<AiAssetDepictedInDiagramsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AiAssetDepictedInDiagramsDisconnectFieldInput>>;
  update?: InputMaybe<AiAssetDepictedInDiagramsUpdateConnectionInput>;
};

export type AiAssetDiagramDepictedInDiagramsAggregateSelection = {
  __typename?: 'AIAssetDiagramDepictedInDiagramsAggregateSelection';
  count: CountConnection;
  node?: Maybe<AiAssetDiagramDepictedInDiagramsNodeAggregateSelection>;
};

export type AiAssetDiagramDepictedInDiagramsNodeAggregateSelection = {
  __typename?: 'AIAssetDiagramDepictedInDiagramsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  diagramJson: StringAggregateSelection;
  diagramPng: StringAggregateSelection;
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type AiAssetDisconnectInput = {
  company?: InputMaybe<Array<AiAssetCompanyDisconnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<AiAssetDepictedInDiagramsDisconnectFieldInput>>;
  hostedOn?: InputMaybe<Array<AiAssetHostedOnDisconnectFieldInput>>;
  implementsPrinciples?: InputMaybe<Array<AiAssetImplementsPrinciplesDisconnectFieldInput>>;
  owners?: InputMaybe<Array<AiAssetOwnersDisconnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<AiAssetPartOfArchitecturesDisconnectFieldInput>>;
  supportsCapabilities?: InputMaybe<Array<AiAssetSupportsCapabilitiesDisconnectFieldInput>>;
  trainedWithDataObjects?: InputMaybe<Array<AiAssetTrainedWithDataObjectsDisconnectFieldInput>>;
  usedByApplications?: InputMaybe<Array<AiAssetUsedByApplicationsDisconnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<AiAssetUsedByOrganisationsDisconnectFieldInput>>;
};

export type AiAssetEdge = {
  __typename?: 'AIAssetEdge';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type AiAssetHostedOnAggregateInput = {
  AND?: InputMaybe<Array<AiAssetHostedOnAggregateInput>>;
  NOT?: InputMaybe<AiAssetHostedOnAggregateInput>;
  OR?: InputMaybe<Array<AiAssetHostedOnAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AiAssetHostedOnNodeAggregationWhereInput>;
};

export type AiAssetHostedOnConnectFieldInput = {
  connect?: InputMaybe<Array<InfrastructureConnectInput>>;
  where?: InputMaybe<InfrastructureConnectWhere>;
};

export type AiAssetHostedOnConnection = {
  __typename?: 'AIAssetHostedOnConnection';
  aggregate: AiAssetInfrastructureHostedOnAggregateSelection;
  edges: Array<AiAssetHostedOnRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AiAssetHostedOnConnectionAggregateInput = {
  AND?: InputMaybe<Array<AiAssetHostedOnConnectionAggregateInput>>;
  NOT?: InputMaybe<AiAssetHostedOnConnectionAggregateInput>;
  OR?: InputMaybe<Array<AiAssetHostedOnConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<AiAssetHostedOnNodeAggregationWhereInput>;
};

export type AiAssetHostedOnConnectionFilters = {
  /** Filter AIAssets by aggregating results on related AIAssetHostedOnConnections */
  aggregate?: InputMaybe<AiAssetHostedOnConnectionAggregateInput>;
  /** Return AIAssets where all of the related AIAssetHostedOnConnections match this filter */
  all?: InputMaybe<AiAssetHostedOnConnectionWhere>;
  /** Return AIAssets where none of the related AIAssetHostedOnConnections match this filter */
  none?: InputMaybe<AiAssetHostedOnConnectionWhere>;
  /** Return AIAssets where one of the related AIAssetHostedOnConnections match this filter */
  single?: InputMaybe<AiAssetHostedOnConnectionWhere>;
  /** Return AIAssets where some of the related AIAssetHostedOnConnections match this filter */
  some?: InputMaybe<AiAssetHostedOnConnectionWhere>;
};

export type AiAssetHostedOnConnectionSort = {
  node?: InputMaybe<InfrastructureSort>;
};

export type AiAssetHostedOnConnectionWhere = {
  AND?: InputMaybe<Array<AiAssetHostedOnConnectionWhere>>;
  NOT?: InputMaybe<AiAssetHostedOnConnectionWhere>;
  OR?: InputMaybe<Array<AiAssetHostedOnConnectionWhere>>;
  node?: InputMaybe<InfrastructureWhere>;
};

export type AiAssetHostedOnCreateFieldInput = {
  node: InfrastructureCreateInput;
};

export type AiAssetHostedOnDeleteFieldInput = {
  delete?: InputMaybe<InfrastructureDeleteInput>;
  where?: InputMaybe<AiAssetHostedOnConnectionWhere>;
};

export type AiAssetHostedOnDisconnectFieldInput = {
  disconnect?: InputMaybe<InfrastructureDisconnectInput>;
  where?: InputMaybe<AiAssetHostedOnConnectionWhere>;
};

export type AiAssetHostedOnFieldInput = {
  connect?: InputMaybe<Array<AiAssetHostedOnConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetHostedOnCreateFieldInput>>;
};

export type AiAssetHostedOnNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AiAssetHostedOnNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AiAssetHostedOnNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AiAssetHostedOnNodeAggregationWhereInput>>;
  capacity?: InputMaybe<StringScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  ipAddress?: InputMaybe<StringScalarAggregationFilters>;
  location?: InputMaybe<StringScalarAggregationFilters>;
  maintenanceWindow?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  operatingSystem?: InputMaybe<StringScalarAggregationFilters>;
  specifications?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type AiAssetHostedOnRelationship = {
  __typename?: 'AIAssetHostedOnRelationship';
  cursor: Scalars['String']['output'];
  node: Infrastructure;
};

export type AiAssetHostedOnUpdateConnectionInput = {
  node?: InputMaybe<InfrastructureUpdateInput>;
  where?: InputMaybe<AiAssetHostedOnConnectionWhere>;
};

export type AiAssetHostedOnUpdateFieldInput = {
  connect?: InputMaybe<Array<AiAssetHostedOnConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetHostedOnCreateFieldInput>>;
  delete?: InputMaybe<Array<AiAssetHostedOnDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AiAssetHostedOnDisconnectFieldInput>>;
  update?: InputMaybe<AiAssetHostedOnUpdateConnectionInput>;
};

export type AiAssetImplementsPrinciplesAggregateInput = {
  AND?: InputMaybe<Array<AiAssetImplementsPrinciplesAggregateInput>>;
  NOT?: InputMaybe<AiAssetImplementsPrinciplesAggregateInput>;
  OR?: InputMaybe<Array<AiAssetImplementsPrinciplesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AiAssetImplementsPrinciplesNodeAggregationWhereInput>;
};

export type AiAssetImplementsPrinciplesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleConnectInput>>;
  where?: InputMaybe<ArchitecturePrincipleConnectWhere>;
};

export type AiAssetImplementsPrinciplesConnection = {
  __typename?: 'AIAssetImplementsPrinciplesConnection';
  aggregate: AiAssetArchitecturePrincipleImplementsPrinciplesAggregateSelection;
  edges: Array<AiAssetImplementsPrinciplesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AiAssetImplementsPrinciplesConnectionAggregateInput = {
  AND?: InputMaybe<Array<AiAssetImplementsPrinciplesConnectionAggregateInput>>;
  NOT?: InputMaybe<AiAssetImplementsPrinciplesConnectionAggregateInput>;
  OR?: InputMaybe<Array<AiAssetImplementsPrinciplesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<AiAssetImplementsPrinciplesNodeAggregationWhereInput>;
};

export type AiAssetImplementsPrinciplesConnectionFilters = {
  /** Filter AIAssets by aggregating results on related AIAssetImplementsPrinciplesConnections */
  aggregate?: InputMaybe<AiAssetImplementsPrinciplesConnectionAggregateInput>;
  /** Return AIAssets where all of the related AIAssetImplementsPrinciplesConnections match this filter */
  all?: InputMaybe<AiAssetImplementsPrinciplesConnectionWhere>;
  /** Return AIAssets where none of the related AIAssetImplementsPrinciplesConnections match this filter */
  none?: InputMaybe<AiAssetImplementsPrinciplesConnectionWhere>;
  /** Return AIAssets where one of the related AIAssetImplementsPrinciplesConnections match this filter */
  single?: InputMaybe<AiAssetImplementsPrinciplesConnectionWhere>;
  /** Return AIAssets where some of the related AIAssetImplementsPrinciplesConnections match this filter */
  some?: InputMaybe<AiAssetImplementsPrinciplesConnectionWhere>;
};

export type AiAssetImplementsPrinciplesConnectionSort = {
  node?: InputMaybe<ArchitecturePrincipleSort>;
};

export type AiAssetImplementsPrinciplesConnectionWhere = {
  AND?: InputMaybe<Array<AiAssetImplementsPrinciplesConnectionWhere>>;
  NOT?: InputMaybe<AiAssetImplementsPrinciplesConnectionWhere>;
  OR?: InputMaybe<Array<AiAssetImplementsPrinciplesConnectionWhere>>;
  node?: InputMaybe<ArchitecturePrincipleWhere>;
};

export type AiAssetImplementsPrinciplesCreateFieldInput = {
  node: ArchitecturePrincipleCreateInput;
};

export type AiAssetImplementsPrinciplesDeleteFieldInput = {
  delete?: InputMaybe<ArchitecturePrincipleDeleteInput>;
  where?: InputMaybe<AiAssetImplementsPrinciplesConnectionWhere>;
};

export type AiAssetImplementsPrinciplesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitecturePrincipleDisconnectInput>;
  where?: InputMaybe<AiAssetImplementsPrinciplesConnectionWhere>;
};

export type AiAssetImplementsPrinciplesFieldInput = {
  connect?: InputMaybe<Array<AiAssetImplementsPrinciplesConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetImplementsPrinciplesCreateFieldInput>>;
};

export type AiAssetImplementsPrinciplesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AiAssetImplementsPrinciplesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AiAssetImplementsPrinciplesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AiAssetImplementsPrinciplesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  implications?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  rationale?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type AiAssetImplementsPrinciplesRelationship = {
  __typename?: 'AIAssetImplementsPrinciplesRelationship';
  cursor: Scalars['String']['output'];
  node: ArchitecturePrinciple;
};

export type AiAssetImplementsPrinciplesUpdateConnectionInput = {
  node?: InputMaybe<ArchitecturePrincipleUpdateInput>;
  where?: InputMaybe<AiAssetImplementsPrinciplesConnectionWhere>;
};

export type AiAssetImplementsPrinciplesUpdateFieldInput = {
  connect?: InputMaybe<Array<AiAssetImplementsPrinciplesConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetImplementsPrinciplesCreateFieldInput>>;
  delete?: InputMaybe<Array<AiAssetImplementsPrinciplesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AiAssetImplementsPrinciplesDisconnectFieldInput>>;
  update?: InputMaybe<AiAssetImplementsPrinciplesUpdateConnectionInput>;
};

export type AiAssetInfrastructureHostedOnAggregateSelection = {
  __typename?: 'AIAssetInfrastructureHostedOnAggregateSelection';
  count: CountConnection;
  node?: Maybe<AiAssetInfrastructureHostedOnNodeAggregateSelection>;
};

export type AiAssetInfrastructureHostedOnNodeAggregateSelection = {
  __typename?: 'AIAssetInfrastructureHostedOnNodeAggregateSelection';
  capacity: StringAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  ipAddress: StringAggregateSelection;
  location: StringAggregateSelection;
  maintenanceWindow: StringAggregateSelection;
  name: StringAggregateSelection;
  operatingSystem: StringAggregateSelection;
  specifications: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type AiAssetOrganisationUsedByOrganisationsAggregateSelection = {
  __typename?: 'AIAssetOrganisationUsedByOrganisationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<AiAssetOrganisationUsedByOrganisationsNodeAggregateSelection>;
};

export type AiAssetOrganisationUsedByOrganisationsNodeAggregateSelection = {
  __typename?: 'AIAssetOrganisationUsedByOrganisationsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  level: IntAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type AiAssetOwnersAggregateInput = {
  AND?: InputMaybe<Array<AiAssetOwnersAggregateInput>>;
  NOT?: InputMaybe<AiAssetOwnersAggregateInput>;
  OR?: InputMaybe<Array<AiAssetOwnersAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AiAssetOwnersNodeAggregationWhereInput>;
};

export type AiAssetOwnersConnectFieldInput = {
  connect?: InputMaybe<Array<PersonConnectInput>>;
  where?: InputMaybe<PersonConnectWhere>;
};

export type AiAssetOwnersConnection = {
  __typename?: 'AIAssetOwnersConnection';
  aggregate: AiAssetPersonOwnersAggregateSelection;
  edges: Array<AiAssetOwnersRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AiAssetOwnersConnectionAggregateInput = {
  AND?: InputMaybe<Array<AiAssetOwnersConnectionAggregateInput>>;
  NOT?: InputMaybe<AiAssetOwnersConnectionAggregateInput>;
  OR?: InputMaybe<Array<AiAssetOwnersConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<AiAssetOwnersNodeAggregationWhereInput>;
};

export type AiAssetOwnersConnectionFilters = {
  /** Filter AIAssets by aggregating results on related AIAssetOwnersConnections */
  aggregate?: InputMaybe<AiAssetOwnersConnectionAggregateInput>;
  /** Return AIAssets where all of the related AIAssetOwnersConnections match this filter */
  all?: InputMaybe<AiAssetOwnersConnectionWhere>;
  /** Return AIAssets where none of the related AIAssetOwnersConnections match this filter */
  none?: InputMaybe<AiAssetOwnersConnectionWhere>;
  /** Return AIAssets where one of the related AIAssetOwnersConnections match this filter */
  single?: InputMaybe<AiAssetOwnersConnectionWhere>;
  /** Return AIAssets where some of the related AIAssetOwnersConnections match this filter */
  some?: InputMaybe<AiAssetOwnersConnectionWhere>;
};

export type AiAssetOwnersConnectionSort = {
  node?: InputMaybe<PersonSort>;
};

export type AiAssetOwnersConnectionWhere = {
  AND?: InputMaybe<Array<AiAssetOwnersConnectionWhere>>;
  NOT?: InputMaybe<AiAssetOwnersConnectionWhere>;
  OR?: InputMaybe<Array<AiAssetOwnersConnectionWhere>>;
  node?: InputMaybe<PersonWhere>;
};

export type AiAssetOwnersCreateFieldInput = {
  node: PersonCreateInput;
};

export type AiAssetOwnersDeleteFieldInput = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<AiAssetOwnersConnectionWhere>;
};

export type AiAssetOwnersDisconnectFieldInput = {
  disconnect?: InputMaybe<PersonDisconnectInput>;
  where?: InputMaybe<AiAssetOwnersConnectionWhere>;
};

export type AiAssetOwnersFieldInput = {
  connect?: InputMaybe<Array<AiAssetOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetOwnersCreateFieldInput>>;
};

export type AiAssetOwnersNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AiAssetOwnersNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AiAssetOwnersNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AiAssetOwnersNodeAggregationWhereInput>>;
  avatarUrl?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  department?: InputMaybe<StringScalarAggregationFilters>;
  email?: InputMaybe<StringScalarAggregationFilters>;
  firstName?: InputMaybe<StringScalarAggregationFilters>;
  lastName?: InputMaybe<StringScalarAggregationFilters>;
  phone?: InputMaybe<StringScalarAggregationFilters>;
  role?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type AiAssetOwnersRelationship = {
  __typename?: 'AIAssetOwnersRelationship';
  cursor: Scalars['String']['output'];
  node: Person;
};

export type AiAssetOwnersUpdateConnectionInput = {
  node?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<AiAssetOwnersConnectionWhere>;
};

export type AiAssetOwnersUpdateFieldInput = {
  connect?: InputMaybe<Array<AiAssetOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetOwnersCreateFieldInput>>;
  delete?: InputMaybe<Array<AiAssetOwnersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AiAssetOwnersDisconnectFieldInput>>;
  update?: InputMaybe<AiAssetOwnersUpdateConnectionInput>;
};

export type AiAssetPartOfArchitecturesAggregateInput = {
  AND?: InputMaybe<Array<AiAssetPartOfArchitecturesAggregateInput>>;
  NOT?: InputMaybe<AiAssetPartOfArchitecturesAggregateInput>;
  OR?: InputMaybe<Array<AiAssetPartOfArchitecturesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AiAssetPartOfArchitecturesNodeAggregationWhereInput>;
};

export type AiAssetPartOfArchitecturesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type AiAssetPartOfArchitecturesConnection = {
  __typename?: 'AIAssetPartOfArchitecturesConnection';
  aggregate: AiAssetArchitecturePartOfArchitecturesAggregateSelection;
  edges: Array<AiAssetPartOfArchitecturesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AiAssetPartOfArchitecturesConnectionAggregateInput = {
  AND?: InputMaybe<Array<AiAssetPartOfArchitecturesConnectionAggregateInput>>;
  NOT?: InputMaybe<AiAssetPartOfArchitecturesConnectionAggregateInput>;
  OR?: InputMaybe<Array<AiAssetPartOfArchitecturesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<AiAssetPartOfArchitecturesNodeAggregationWhereInput>;
};

export type AiAssetPartOfArchitecturesConnectionFilters = {
  /** Filter AIAssets by aggregating results on related AIAssetPartOfArchitecturesConnections */
  aggregate?: InputMaybe<AiAssetPartOfArchitecturesConnectionAggregateInput>;
  /** Return AIAssets where all of the related AIAssetPartOfArchitecturesConnections match this filter */
  all?: InputMaybe<AiAssetPartOfArchitecturesConnectionWhere>;
  /** Return AIAssets where none of the related AIAssetPartOfArchitecturesConnections match this filter */
  none?: InputMaybe<AiAssetPartOfArchitecturesConnectionWhere>;
  /** Return AIAssets where one of the related AIAssetPartOfArchitecturesConnections match this filter */
  single?: InputMaybe<AiAssetPartOfArchitecturesConnectionWhere>;
  /** Return AIAssets where some of the related AIAssetPartOfArchitecturesConnections match this filter */
  some?: InputMaybe<AiAssetPartOfArchitecturesConnectionWhere>;
};

export type AiAssetPartOfArchitecturesConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type AiAssetPartOfArchitecturesConnectionWhere = {
  AND?: InputMaybe<Array<AiAssetPartOfArchitecturesConnectionWhere>>;
  NOT?: InputMaybe<AiAssetPartOfArchitecturesConnectionWhere>;
  OR?: InputMaybe<Array<AiAssetPartOfArchitecturesConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type AiAssetPartOfArchitecturesCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type AiAssetPartOfArchitecturesDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<AiAssetPartOfArchitecturesConnectionWhere>;
};

export type AiAssetPartOfArchitecturesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<AiAssetPartOfArchitecturesConnectionWhere>;
};

export type AiAssetPartOfArchitecturesFieldInput = {
  connect?: InputMaybe<Array<AiAssetPartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetPartOfArchitecturesCreateFieldInput>>;
};

export type AiAssetPartOfArchitecturesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AiAssetPartOfArchitecturesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AiAssetPartOfArchitecturesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AiAssetPartOfArchitecturesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type AiAssetPartOfArchitecturesRelationship = {
  __typename?: 'AIAssetPartOfArchitecturesRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type AiAssetPartOfArchitecturesUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<AiAssetPartOfArchitecturesConnectionWhere>;
};

export type AiAssetPartOfArchitecturesUpdateFieldInput = {
  connect?: InputMaybe<Array<AiAssetPartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetPartOfArchitecturesCreateFieldInput>>;
  delete?: InputMaybe<Array<AiAssetPartOfArchitecturesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AiAssetPartOfArchitecturesDisconnectFieldInput>>;
  update?: InputMaybe<AiAssetPartOfArchitecturesUpdateConnectionInput>;
};

export type AiAssetPersonOwnersAggregateSelection = {
  __typename?: 'AIAssetPersonOwnersAggregateSelection';
  count: CountConnection;
  node?: Maybe<AiAssetPersonOwnersNodeAggregateSelection>;
};

export type AiAssetPersonOwnersNodeAggregateSelection = {
  __typename?: 'AIAssetPersonOwnersNodeAggregateSelection';
  avatarUrl: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type AiAssetRelationshipFilters = {
  /** Filter type where all of the related AIAssets match this filter */
  all?: InputMaybe<AiAssetWhere>;
  /** Filter type where none of the related AIAssets match this filter */
  none?: InputMaybe<AiAssetWhere>;
  /** Filter type where one of the related AIAssets match this filter */
  single?: InputMaybe<AiAssetWhere>;
  /** Filter type where some of the related AIAssets match this filter */
  some?: InputMaybe<AiAssetWhere>;
};

/** Fields to sort AiAssets by. The order in which sorts are applied is not guaranteed when specifying many fields in one AIAssetSort object. */
export type AiAssetSort = {
  accuracy?: InputMaybe<SortDirection>;
  aiType?: InputMaybe<SortDirection>;
  costs?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  lastUpdated?: InputMaybe<SortDirection>;
  license?: InputMaybe<SortDirection>;
  model?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  provider?: InputMaybe<SortDirection>;
  status?: InputMaybe<SortDirection>;
  trainingDate?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
  version?: InputMaybe<SortDirection>;
};

/** Status-Werte für KI-Assets */
export enum AiAssetStatus {
  ACTIVE = 'ACTIVE',
  DEPLOYED = 'DEPLOYED',
  DEPRECATED = 'DEPRECATED',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  RETIRED = 'RETIRED',
  TESTING = 'TESTING',
  TRAINING = 'TRAINING'
}

/** AIAssetStatus filters */
export type AiAssetStatusEnumScalarFilters = {
  eq?: InputMaybe<AiAssetStatus>;
  in?: InputMaybe<Array<AiAssetStatus>>;
};

/** AIAssetStatus mutations */
export type AiAssetStatusEnumScalarMutations = {
  set?: InputMaybe<AiAssetStatus>;
};

export type AiAssetSupportsCapabilitiesAggregateInput = {
  AND?: InputMaybe<Array<AiAssetSupportsCapabilitiesAggregateInput>>;
  NOT?: InputMaybe<AiAssetSupportsCapabilitiesAggregateInput>;
  OR?: InputMaybe<Array<AiAssetSupportsCapabilitiesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AiAssetSupportsCapabilitiesNodeAggregationWhereInput>;
};

export type AiAssetSupportsCapabilitiesConnectFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityConnectInput>>;
  where?: InputMaybe<BusinessCapabilityConnectWhere>;
};

export type AiAssetSupportsCapabilitiesConnection = {
  __typename?: 'AIAssetSupportsCapabilitiesConnection';
  aggregate: AiAssetBusinessCapabilitySupportsCapabilitiesAggregateSelection;
  edges: Array<AiAssetSupportsCapabilitiesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AiAssetSupportsCapabilitiesConnectionAggregateInput = {
  AND?: InputMaybe<Array<AiAssetSupportsCapabilitiesConnectionAggregateInput>>;
  NOT?: InputMaybe<AiAssetSupportsCapabilitiesConnectionAggregateInput>;
  OR?: InputMaybe<Array<AiAssetSupportsCapabilitiesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<AiAssetSupportsCapabilitiesNodeAggregationWhereInput>;
};

export type AiAssetSupportsCapabilitiesConnectionFilters = {
  /** Filter AIAssets by aggregating results on related AIAssetSupportsCapabilitiesConnections */
  aggregate?: InputMaybe<AiAssetSupportsCapabilitiesConnectionAggregateInput>;
  /** Return AIAssets where all of the related AIAssetSupportsCapabilitiesConnections match this filter */
  all?: InputMaybe<AiAssetSupportsCapabilitiesConnectionWhere>;
  /** Return AIAssets where none of the related AIAssetSupportsCapabilitiesConnections match this filter */
  none?: InputMaybe<AiAssetSupportsCapabilitiesConnectionWhere>;
  /** Return AIAssets where one of the related AIAssetSupportsCapabilitiesConnections match this filter */
  single?: InputMaybe<AiAssetSupportsCapabilitiesConnectionWhere>;
  /** Return AIAssets where some of the related AIAssetSupportsCapabilitiesConnections match this filter */
  some?: InputMaybe<AiAssetSupportsCapabilitiesConnectionWhere>;
};

export type AiAssetSupportsCapabilitiesConnectionSort = {
  node?: InputMaybe<BusinessCapabilitySort>;
};

export type AiAssetSupportsCapabilitiesConnectionWhere = {
  AND?: InputMaybe<Array<AiAssetSupportsCapabilitiesConnectionWhere>>;
  NOT?: InputMaybe<AiAssetSupportsCapabilitiesConnectionWhere>;
  OR?: InputMaybe<Array<AiAssetSupportsCapabilitiesConnectionWhere>>;
  node?: InputMaybe<BusinessCapabilityWhere>;
};

export type AiAssetSupportsCapabilitiesCreateFieldInput = {
  node: BusinessCapabilityCreateInput;
};

export type AiAssetSupportsCapabilitiesDeleteFieldInput = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<AiAssetSupportsCapabilitiesConnectionWhere>;
};

export type AiAssetSupportsCapabilitiesDisconnectFieldInput = {
  disconnect?: InputMaybe<BusinessCapabilityDisconnectInput>;
  where?: InputMaybe<AiAssetSupportsCapabilitiesConnectionWhere>;
};

export type AiAssetSupportsCapabilitiesFieldInput = {
  connect?: InputMaybe<Array<AiAssetSupportsCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetSupportsCapabilitiesCreateFieldInput>>;
};

export type AiAssetSupportsCapabilitiesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AiAssetSupportsCapabilitiesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AiAssetSupportsCapabilitiesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AiAssetSupportsCapabilitiesNodeAggregationWhereInput>>;
  businessValue?: InputMaybe<IntScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  maturityLevel?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  sequenceNumber?: InputMaybe<IntScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type AiAssetSupportsCapabilitiesRelationship = {
  __typename?: 'AIAssetSupportsCapabilitiesRelationship';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type AiAssetSupportsCapabilitiesUpdateConnectionInput = {
  node?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<AiAssetSupportsCapabilitiesConnectionWhere>;
};

export type AiAssetSupportsCapabilitiesUpdateFieldInput = {
  connect?: InputMaybe<Array<AiAssetSupportsCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetSupportsCapabilitiesCreateFieldInput>>;
  delete?: InputMaybe<Array<AiAssetSupportsCapabilitiesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AiAssetSupportsCapabilitiesDisconnectFieldInput>>;
  update?: InputMaybe<AiAssetSupportsCapabilitiesUpdateConnectionInput>;
};

export type AiAssetTrainedWithDataObjectsAggregateInput = {
  AND?: InputMaybe<Array<AiAssetTrainedWithDataObjectsAggregateInput>>;
  NOT?: InputMaybe<AiAssetTrainedWithDataObjectsAggregateInput>;
  OR?: InputMaybe<Array<AiAssetTrainedWithDataObjectsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AiAssetTrainedWithDataObjectsNodeAggregationWhereInput>;
};

export type AiAssetTrainedWithDataObjectsConnectFieldInput = {
  connect?: InputMaybe<Array<DataObjectConnectInput>>;
  where?: InputMaybe<DataObjectConnectWhere>;
};

export type AiAssetTrainedWithDataObjectsConnection = {
  __typename?: 'AIAssetTrainedWithDataObjectsConnection';
  aggregate: AiAssetDataObjectTrainedWithDataObjectsAggregateSelection;
  edges: Array<AiAssetTrainedWithDataObjectsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AiAssetTrainedWithDataObjectsConnectionAggregateInput = {
  AND?: InputMaybe<Array<AiAssetTrainedWithDataObjectsConnectionAggregateInput>>;
  NOT?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionAggregateInput>;
  OR?: InputMaybe<Array<AiAssetTrainedWithDataObjectsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<AiAssetTrainedWithDataObjectsNodeAggregationWhereInput>;
};

export type AiAssetTrainedWithDataObjectsConnectionFilters = {
  /** Filter AIAssets by aggregating results on related AIAssetTrainedWithDataObjectsConnections */
  aggregate?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionAggregateInput>;
  /** Return AIAssets where all of the related AIAssetTrainedWithDataObjectsConnections match this filter */
  all?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionWhere>;
  /** Return AIAssets where none of the related AIAssetTrainedWithDataObjectsConnections match this filter */
  none?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionWhere>;
  /** Return AIAssets where one of the related AIAssetTrainedWithDataObjectsConnections match this filter */
  single?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionWhere>;
  /** Return AIAssets where some of the related AIAssetTrainedWithDataObjectsConnections match this filter */
  some?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionWhere>;
};

export type AiAssetTrainedWithDataObjectsConnectionSort = {
  node?: InputMaybe<DataObjectSort>;
};

export type AiAssetTrainedWithDataObjectsConnectionWhere = {
  AND?: InputMaybe<Array<AiAssetTrainedWithDataObjectsConnectionWhere>>;
  NOT?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionWhere>;
  OR?: InputMaybe<Array<AiAssetTrainedWithDataObjectsConnectionWhere>>;
  node?: InputMaybe<DataObjectWhere>;
};

export type AiAssetTrainedWithDataObjectsCreateFieldInput = {
  node: DataObjectCreateInput;
};

export type AiAssetTrainedWithDataObjectsDeleteFieldInput = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionWhere>;
};

export type AiAssetTrainedWithDataObjectsDisconnectFieldInput = {
  disconnect?: InputMaybe<DataObjectDisconnectInput>;
  where?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionWhere>;
};

export type AiAssetTrainedWithDataObjectsFieldInput = {
  connect?: InputMaybe<Array<AiAssetTrainedWithDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetTrainedWithDataObjectsCreateFieldInput>>;
};

export type AiAssetTrainedWithDataObjectsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AiAssetTrainedWithDataObjectsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AiAssetTrainedWithDataObjectsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AiAssetTrainedWithDataObjectsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  format?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type AiAssetTrainedWithDataObjectsRelationship = {
  __typename?: 'AIAssetTrainedWithDataObjectsRelationship';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type AiAssetTrainedWithDataObjectsUpdateConnectionInput = {
  node?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionWhere>;
};

export type AiAssetTrainedWithDataObjectsUpdateFieldInput = {
  connect?: InputMaybe<Array<AiAssetTrainedWithDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetTrainedWithDataObjectsCreateFieldInput>>;
  delete?: InputMaybe<Array<AiAssetTrainedWithDataObjectsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AiAssetTrainedWithDataObjectsDisconnectFieldInput>>;
  update?: InputMaybe<AiAssetTrainedWithDataObjectsUpdateConnectionInput>;
};

/** KI-Asset Typen */
export enum AiAssetType {
  AGENTIC_AI = 'AGENTIC_AI',
  AUTOMATION_ENGINE = 'AUTOMATION_ENGINE',
  CHATBOT = 'CHATBOT',
  COMPUTER_VISION = 'COMPUTER_VISION',
  DECISION_SUPPORT_SYSTEM = 'DECISION_SUPPORT_SYSTEM',
  DEEP_LEARNING_MODEL = 'DEEP_LEARNING_MODEL',
  GENERATIVE_AI = 'GENERATIVE_AI',
  MACHINE_LEARNING_MODEL = 'MACHINE_LEARNING_MODEL',
  NATURAL_LANGUAGE_PROCESSING = 'NATURAL_LANGUAGE_PROCESSING',
  OTHER = 'OTHER',
  PREDICTIVE_ANALYTICS = 'PREDICTIVE_ANALYTICS',
  RAG = 'RAG',
  RECOMMENDATION_ENGINE = 'RECOMMENDATION_ENGINE',
  VOICE_ASSISTANT = 'VOICE_ASSISTANT'
}

/** AIAssetType filters */
export type AiAssetTypeEnumScalarFilters = {
  eq?: InputMaybe<AiAssetType>;
  in?: InputMaybe<Array<AiAssetType>>;
};

/** AIAssetType mutations */
export type AiAssetTypeEnumScalarMutations = {
  set?: InputMaybe<AiAssetType>;
};

export type AiAssetUpdateInput = {
  accuracy?: InputMaybe<FloatScalarMutations>;
  aiType?: InputMaybe<AiAssetTypeEnumScalarMutations>;
  company?: InputMaybe<Array<AiAssetCompanyUpdateFieldInput>>;
  costs?: InputMaybe<FloatScalarMutations>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  depictedInDiagrams?: InputMaybe<Array<AiAssetDepictedInDiagramsUpdateFieldInput>>;
  description?: InputMaybe<StringScalarMutations>;
  hostedOn?: InputMaybe<Array<AiAssetHostedOnUpdateFieldInput>>;
  implementsPrinciples?: InputMaybe<Array<AiAssetImplementsPrinciplesUpdateFieldInput>>;
  lastUpdated?: InputMaybe<DateScalarMutations>;
  license?: InputMaybe<StringScalarMutations>;
  model?: InputMaybe<StringScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<AiAssetOwnersUpdateFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<AiAssetPartOfArchitecturesUpdateFieldInput>>;
  provider?: InputMaybe<StringScalarMutations>;
  status?: InputMaybe<AiAssetStatusEnumScalarMutations>;
  supportsCapabilities?: InputMaybe<Array<AiAssetSupportsCapabilitiesUpdateFieldInput>>;
  tags?: InputMaybe<ListStringMutations>;
  trainedWithDataObjects?: InputMaybe<Array<AiAssetTrainedWithDataObjectsUpdateFieldInput>>;
  trainingDate?: InputMaybe<DateScalarMutations>;
  usedByApplications?: InputMaybe<Array<AiAssetUsedByApplicationsUpdateFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<AiAssetUsedByOrganisationsUpdateFieldInput>>;
  version?: InputMaybe<StringScalarMutations>;
};

export type AiAssetUsedByApplicationsAggregateInput = {
  AND?: InputMaybe<Array<AiAssetUsedByApplicationsAggregateInput>>;
  NOT?: InputMaybe<AiAssetUsedByApplicationsAggregateInput>;
  OR?: InputMaybe<Array<AiAssetUsedByApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AiAssetUsedByApplicationsNodeAggregationWhereInput>;
};

export type AiAssetUsedByApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type AiAssetUsedByApplicationsConnection = {
  __typename?: 'AIAssetUsedByApplicationsConnection';
  aggregate: AiAssetApplicationUsedByApplicationsAggregateSelection;
  edges: Array<AiAssetUsedByApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AiAssetUsedByApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<AiAssetUsedByApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<AiAssetUsedByApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<AiAssetUsedByApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<AiAssetUsedByApplicationsNodeAggregationWhereInput>;
};

export type AiAssetUsedByApplicationsConnectionFilters = {
  /** Filter AIAssets by aggregating results on related AIAssetUsedByApplicationsConnections */
  aggregate?: InputMaybe<AiAssetUsedByApplicationsConnectionAggregateInput>;
  /** Return AIAssets where all of the related AIAssetUsedByApplicationsConnections match this filter */
  all?: InputMaybe<AiAssetUsedByApplicationsConnectionWhere>;
  /** Return AIAssets where none of the related AIAssetUsedByApplicationsConnections match this filter */
  none?: InputMaybe<AiAssetUsedByApplicationsConnectionWhere>;
  /** Return AIAssets where one of the related AIAssetUsedByApplicationsConnections match this filter */
  single?: InputMaybe<AiAssetUsedByApplicationsConnectionWhere>;
  /** Return AIAssets where some of the related AIAssetUsedByApplicationsConnections match this filter */
  some?: InputMaybe<AiAssetUsedByApplicationsConnectionWhere>;
};

export type AiAssetUsedByApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type AiAssetUsedByApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<AiAssetUsedByApplicationsConnectionWhere>>;
  NOT?: InputMaybe<AiAssetUsedByApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<AiAssetUsedByApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type AiAssetUsedByApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type AiAssetUsedByApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<AiAssetUsedByApplicationsConnectionWhere>;
};

export type AiAssetUsedByApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<AiAssetUsedByApplicationsConnectionWhere>;
};

export type AiAssetUsedByApplicationsFieldInput = {
  connect?: InputMaybe<Array<AiAssetUsedByApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetUsedByApplicationsCreateFieldInput>>;
};

export type AiAssetUsedByApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AiAssetUsedByApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AiAssetUsedByApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AiAssetUsedByApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type AiAssetUsedByApplicationsRelationship = {
  __typename?: 'AIAssetUsedByApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type AiAssetUsedByApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<AiAssetUsedByApplicationsConnectionWhere>;
};

export type AiAssetUsedByApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<AiAssetUsedByApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetUsedByApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<AiAssetUsedByApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AiAssetUsedByApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<AiAssetUsedByApplicationsUpdateConnectionInput>;
};

export type AiAssetUsedByOrganisationsAggregateInput = {
  AND?: InputMaybe<Array<AiAssetUsedByOrganisationsAggregateInput>>;
  NOT?: InputMaybe<AiAssetUsedByOrganisationsAggregateInput>;
  OR?: InputMaybe<Array<AiAssetUsedByOrganisationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AiAssetUsedByOrganisationsNodeAggregationWhereInput>;
};

export type AiAssetUsedByOrganisationsConnectFieldInput = {
  connect?: InputMaybe<Array<OrganisationConnectInput>>;
  where?: InputMaybe<OrganisationConnectWhere>;
};

export type AiAssetUsedByOrganisationsConnection = {
  __typename?: 'AIAssetUsedByOrganisationsConnection';
  aggregate: AiAssetOrganisationUsedByOrganisationsAggregateSelection;
  edges: Array<AiAssetUsedByOrganisationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AiAssetUsedByOrganisationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<AiAssetUsedByOrganisationsConnectionAggregateInput>>;
  NOT?: InputMaybe<AiAssetUsedByOrganisationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<AiAssetUsedByOrganisationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<AiAssetUsedByOrganisationsNodeAggregationWhereInput>;
};

export type AiAssetUsedByOrganisationsConnectionFilters = {
  /** Filter AIAssets by aggregating results on related AIAssetUsedByOrganisationsConnections */
  aggregate?: InputMaybe<AiAssetUsedByOrganisationsConnectionAggregateInput>;
  /** Return AIAssets where all of the related AIAssetUsedByOrganisationsConnections match this filter */
  all?: InputMaybe<AiAssetUsedByOrganisationsConnectionWhere>;
  /** Return AIAssets where none of the related AIAssetUsedByOrganisationsConnections match this filter */
  none?: InputMaybe<AiAssetUsedByOrganisationsConnectionWhere>;
  /** Return AIAssets where one of the related AIAssetUsedByOrganisationsConnections match this filter */
  single?: InputMaybe<AiAssetUsedByOrganisationsConnectionWhere>;
  /** Return AIAssets where some of the related AIAssetUsedByOrganisationsConnections match this filter */
  some?: InputMaybe<AiAssetUsedByOrganisationsConnectionWhere>;
};

export type AiAssetUsedByOrganisationsConnectionSort = {
  node?: InputMaybe<OrganisationSort>;
};

export type AiAssetUsedByOrganisationsConnectionWhere = {
  AND?: InputMaybe<Array<AiAssetUsedByOrganisationsConnectionWhere>>;
  NOT?: InputMaybe<AiAssetUsedByOrganisationsConnectionWhere>;
  OR?: InputMaybe<Array<AiAssetUsedByOrganisationsConnectionWhere>>;
  node?: InputMaybe<OrganisationWhere>;
};

export type AiAssetUsedByOrganisationsCreateFieldInput = {
  node: OrganisationCreateInput;
};

export type AiAssetUsedByOrganisationsDeleteFieldInput = {
  delete?: InputMaybe<OrganisationDeleteInput>;
  where?: InputMaybe<AiAssetUsedByOrganisationsConnectionWhere>;
};

export type AiAssetUsedByOrganisationsDisconnectFieldInput = {
  disconnect?: InputMaybe<OrganisationDisconnectInput>;
  where?: InputMaybe<AiAssetUsedByOrganisationsConnectionWhere>;
};

export type AiAssetUsedByOrganisationsFieldInput = {
  connect?: InputMaybe<Array<AiAssetUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetUsedByOrganisationsCreateFieldInput>>;
};

export type AiAssetUsedByOrganisationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AiAssetUsedByOrganisationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AiAssetUsedByOrganisationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AiAssetUsedByOrganisationsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  level?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type AiAssetUsedByOrganisationsRelationship = {
  __typename?: 'AIAssetUsedByOrganisationsRelationship';
  cursor: Scalars['String']['output'];
  node: Organisation;
};

export type AiAssetUsedByOrganisationsUpdateConnectionInput = {
  node?: InputMaybe<OrganisationUpdateInput>;
  where?: InputMaybe<AiAssetUsedByOrganisationsConnectionWhere>;
};

export type AiAssetUsedByOrganisationsUpdateFieldInput = {
  connect?: InputMaybe<Array<AiAssetUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<AiAssetUsedByOrganisationsCreateFieldInput>>;
  delete?: InputMaybe<Array<AiAssetUsedByOrganisationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AiAssetUsedByOrganisationsDisconnectFieldInput>>;
  update?: InputMaybe<AiAssetUsedByOrganisationsUpdateConnectionInput>;
};

export type AiAssetWhere = {
  AND?: InputMaybe<Array<AiAssetWhere>>;
  NOT?: InputMaybe<AiAssetWhere>;
  OR?: InputMaybe<Array<AiAssetWhere>>;
  accuracy?: InputMaybe<FloatScalarFilters>;
  aiType?: InputMaybe<AiAssetTypeEnumScalarFilters>;
  company?: InputMaybe<CompanyRelationshipFilters>;
  companyConnection?: InputMaybe<AiAssetCompanyConnectionFilters>;
  costs?: InputMaybe<FloatScalarFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  depictedInDiagrams?: InputMaybe<DiagramRelationshipFilters>;
  depictedInDiagramsConnection?: InputMaybe<AiAssetDepictedInDiagramsConnectionFilters>;
  description?: InputMaybe<StringScalarFilters>;
  hostedOn?: InputMaybe<InfrastructureRelationshipFilters>;
  hostedOnConnection?: InputMaybe<AiAssetHostedOnConnectionFilters>;
  id?: InputMaybe<IdScalarFilters>;
  implementsPrinciples?: InputMaybe<ArchitecturePrincipleRelationshipFilters>;
  implementsPrinciplesConnection?: InputMaybe<AiAssetImplementsPrinciplesConnectionFilters>;
  lastUpdated?: InputMaybe<DateScalarFilters>;
  license?: InputMaybe<StringScalarFilters>;
  model?: InputMaybe<StringScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  owners?: InputMaybe<PersonRelationshipFilters>;
  ownersConnection?: InputMaybe<AiAssetOwnersConnectionFilters>;
  partOfArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  partOfArchitecturesConnection?: InputMaybe<AiAssetPartOfArchitecturesConnectionFilters>;
  provider?: InputMaybe<StringScalarFilters>;
  status?: InputMaybe<AiAssetStatusEnumScalarFilters>;
  supportsCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  supportsCapabilitiesConnection?: InputMaybe<AiAssetSupportsCapabilitiesConnectionFilters>;
  tags?: InputMaybe<StringListFilters>;
  trainedWithDataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  trainedWithDataObjectsConnection?: InputMaybe<AiAssetTrainedWithDataObjectsConnectionFilters>;
  trainingDate?: InputMaybe<DateScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
  usedByApplications?: InputMaybe<ApplicationRelationshipFilters>;
  usedByApplicationsConnection?: InputMaybe<AiAssetUsedByApplicationsConnectionFilters>;
  usedByOrganisations?: InputMaybe<OrganisationRelationshipFilters>;
  usedByOrganisationsConnection?: InputMaybe<AiAssetUsedByOrganisationsConnectionFilters>;
  version?: InputMaybe<StringScalarFilters>;
};

export type AiAssetsConnection = {
  __typename?: 'AiAssetsConnection';
  aggregate: AiAssetAggregate;
  edges: Array<AiAssetEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type Application = {
  __typename?: 'Application';
  company: Array<Company>;
  companyConnection: ApplicationCompanyConnection;
  components: Array<Application>;
  componentsConnection: ApplicationComponentsConnection;
  costs?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  criticality: CriticalityLevel;
  depictedInDiagrams: Array<Diagram>;
  depictedInDiagramsConnection: ApplicationDepictedInDiagramsConnection;
  description?: Maybe<Scalars['String']['output']>;
  endOfLifeDate?: Maybe<Scalars['Date']['output']>;
  endOfUseDate?: Maybe<Scalars['Date']['output']>;
  hostedOn: Array<Infrastructure>;
  hostedOnConnection: ApplicationHostedOnConnection;
  hostingEnvironment?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  implementsPrinciples: Array<ArchitecturePrinciple>;
  implementsPrinciplesConnection: ApplicationImplementsPrinciplesConnection;
  introductionDate?: Maybe<Scalars['Date']['output']>;
  isDataSourceFor: Array<DataObject>;
  isDataSourceForConnection: ApplicationIsDataSourceForConnection;
  name: Scalars['String']['output'];
  owners: Array<Person>;
  ownersConnection: ApplicationOwnersConnection;
  parents: Array<Application>;
  parentsConnection: ApplicationParentsConnection;
  partOfArchitectures: Array<Architecture>;
  partOfArchitecturesConnection: ApplicationPartOfArchitecturesConnection;
  planningDate?: Maybe<Scalars['Date']['output']>;
  predecessors: Array<Application>;
  predecessorsConnection: ApplicationPredecessorsConnection;
  sevenRStrategy?: Maybe<SevenRStrategy>;
  sourceOfInterfaces: Array<ApplicationInterface>;
  sourceOfInterfacesConnection: ApplicationSourceOfInterfacesConnection;
  status: ApplicationStatus;
  successors: Array<Application>;
  successorsConnection: ApplicationSuccessorsConnection;
  supportsCapabilities: Array<BusinessCapability>;
  supportsCapabilitiesConnection: ApplicationSupportsCapabilitiesConnection;
  targetOfInterfaces: Array<ApplicationInterface>;
  targetOfInterfacesConnection: ApplicationTargetOfInterfacesConnection;
  technologyStack?: Maybe<Array<Scalars['String']['output']>>;
  timeCategory?: Maybe<TimeCategory>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usedByOrganisations: Array<Organisation>;
  usedByOrganisationsConnection: ApplicationUsedByOrganisationsConnection;
  usesAIAssets: Array<AiAsset>;
  usesAIAssetsConnection: ApplicationUsesAiAssetsConnection;
  usesDataObjects: Array<DataObject>;
  usesDataObjectsConnection: ApplicationUsesDataObjectsConnection;
  vendor?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationCompanyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanySort>>;
  where?: InputMaybe<CompanyWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationCompanyConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationCompanyConnectionSort>>;
  where?: InputMaybe<ApplicationCompanyConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationComponentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationComponentsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationComponentsConnectionSort>>;
  where?: InputMaybe<ApplicationComponentsConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationDepictedInDiagramsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramSort>>;
  where?: InputMaybe<DiagramWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationDepictedInDiagramsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationDepictedInDiagramsConnectionSort>>;
  where?: InputMaybe<ApplicationDepictedInDiagramsConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationHostedOnArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationHostedOnConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationHostedOnConnectionSort>>;
  where?: InputMaybe<ApplicationHostedOnConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationImplementsPrinciplesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitecturePrincipleSort>>;
  where?: InputMaybe<ArchitecturePrincipleWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationImplementsPrinciplesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationImplementsPrinciplesConnectionSort>>;
  where?: InputMaybe<ApplicationImplementsPrinciplesConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationIsDataSourceForArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationIsDataSourceForConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationIsDataSourceForConnectionSort>>;
  where?: InputMaybe<ApplicationIsDataSourceForConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationOwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationOwnersConnectionSort>>;
  where?: InputMaybe<ApplicationOwnersConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationParentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationParentsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationParentsConnectionSort>>;
  where?: InputMaybe<ApplicationParentsConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationPartOfArchitecturesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationPartOfArchitecturesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationPartOfArchitecturesConnectionSort>>;
  where?: InputMaybe<ApplicationPartOfArchitecturesConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationPredecessorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationPredecessorsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationPredecessorsConnectionSort>>;
  where?: InputMaybe<ApplicationPredecessorsConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationSourceOfInterfacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationSourceOfInterfacesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSourceOfInterfacesConnectionSort>>;
  where?: InputMaybe<ApplicationSourceOfInterfacesConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationSuccessorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationSuccessorsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSuccessorsConnectionSort>>;
  where?: InputMaybe<ApplicationSuccessorsConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationSupportsCapabilitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationSupportsCapabilitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSupportsCapabilitiesConnectionSort>>;
  where?: InputMaybe<ApplicationSupportsCapabilitiesConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationTargetOfInterfacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationTargetOfInterfacesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationTargetOfInterfacesConnectionSort>>;
  where?: InputMaybe<ApplicationTargetOfInterfacesConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationUsedByOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationUsedByOrganisationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationUsedByOrganisationsConnectionSort>>;
  where?: InputMaybe<ApplicationUsedByOrganisationsConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationUsesAiAssetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationUsesAiAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationUsesAiAssetsConnectionSort>>;
  where?: InputMaybe<ApplicationUsesAiAssetsConnectionWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationUsesDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationUsesDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationUsesDataObjectsConnectionSort>>;
  where?: InputMaybe<ApplicationUsesDataObjectsConnectionWhere>;
};

export type ApplicationAiAssetUsesAiAssetsAggregateSelection = {
  __typename?: 'ApplicationAIAssetUsesAIAssetsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationAiAssetUsesAiAssetsNodeAggregateSelection>;
};

export type ApplicationAiAssetUsesAiAssetsNodeAggregateSelection = {
  __typename?: 'ApplicationAIAssetUsesAIAssetsNodeAggregateSelection';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationAggregate = {
  __typename?: 'ApplicationAggregate';
  count: Count;
  node: ApplicationAggregateNode;
};

export type ApplicationAggregateNode = {
  __typename?: 'ApplicationAggregateNode';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationApplicationComponentsAggregateSelection = {
  __typename?: 'ApplicationApplicationComponentsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationApplicationComponentsNodeAggregateSelection>;
};

export type ApplicationApplicationComponentsNodeAggregateSelection = {
  __typename?: 'ApplicationApplicationComponentsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationApplicationInterfaceSourceOfInterfacesAggregateSelection = {
  __typename?: 'ApplicationApplicationInterfaceSourceOfInterfacesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationApplicationInterfaceSourceOfInterfacesNodeAggregateSelection>;
};

export type ApplicationApplicationInterfaceSourceOfInterfacesNodeAggregateSelection = {
  __typename?: 'ApplicationApplicationInterfaceSourceOfInterfacesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationApplicationInterfaceTargetOfInterfacesAggregateSelection = {
  __typename?: 'ApplicationApplicationInterfaceTargetOfInterfacesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationApplicationInterfaceTargetOfInterfacesNodeAggregateSelection>;
};

export type ApplicationApplicationInterfaceTargetOfInterfacesNodeAggregateSelection = {
  __typename?: 'ApplicationApplicationInterfaceTargetOfInterfacesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationApplicationParentsAggregateSelection = {
  __typename?: 'ApplicationApplicationParentsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationApplicationParentsNodeAggregateSelection>;
};

export type ApplicationApplicationParentsNodeAggregateSelection = {
  __typename?: 'ApplicationApplicationParentsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationApplicationPredecessorsAggregateSelection = {
  __typename?: 'ApplicationApplicationPredecessorsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationApplicationPredecessorsNodeAggregateSelection>;
};

export type ApplicationApplicationPredecessorsNodeAggregateSelection = {
  __typename?: 'ApplicationApplicationPredecessorsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationApplicationSuccessorsAggregateSelection = {
  __typename?: 'ApplicationApplicationSuccessorsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationApplicationSuccessorsNodeAggregateSelection>;
};

export type ApplicationApplicationSuccessorsNodeAggregateSelection = {
  __typename?: 'ApplicationApplicationSuccessorsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationArchitecturePartOfArchitecturesAggregateSelection = {
  __typename?: 'ApplicationArchitecturePartOfArchitecturesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationArchitecturePartOfArchitecturesNodeAggregateSelection>;
};

export type ApplicationArchitecturePartOfArchitecturesNodeAggregateSelection = {
  __typename?: 'ApplicationArchitecturePartOfArchitecturesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationArchitecturePrincipleImplementsPrinciplesAggregateSelection = {
  __typename?: 'ApplicationArchitecturePrincipleImplementsPrinciplesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationArchitecturePrincipleImplementsPrinciplesNodeAggregateSelection>;
};

export type ApplicationArchitecturePrincipleImplementsPrinciplesNodeAggregateSelection = {
  __typename?: 'ApplicationArchitecturePrincipleImplementsPrinciplesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  implications: StringAggregateSelection;
  name: StringAggregateSelection;
  rationale: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationBusinessCapabilitySupportsCapabilitiesAggregateSelection = {
  __typename?: 'ApplicationBusinessCapabilitySupportsCapabilitiesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationBusinessCapabilitySupportsCapabilitiesNodeAggregateSelection>;
};

export type ApplicationBusinessCapabilitySupportsCapabilitiesNodeAggregateSelection = {
  __typename?: 'ApplicationBusinessCapabilitySupportsCapabilitiesNodeAggregateSelection';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationCompanyAggregateInput = {
  AND?: InputMaybe<Array<ApplicationCompanyAggregateInput>>;
  NOT?: InputMaybe<ApplicationCompanyAggregateInput>;
  OR?: InputMaybe<Array<ApplicationCompanyAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationCompanyNodeAggregationWhereInput>;
};

export type ApplicationCompanyCompanyAggregateSelection = {
  __typename?: 'ApplicationCompanyCompanyAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationCompanyCompanyNodeAggregateSelection>;
};

export type ApplicationCompanyCompanyNodeAggregateSelection = {
  __typename?: 'ApplicationCompanyCompanyNodeAggregateSelection';
  address: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  industry: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  website: StringAggregateSelection;
};

export type ApplicationCompanyConnectFieldInput = {
  connect?: InputMaybe<Array<CompanyConnectInput>>;
  where?: InputMaybe<CompanyConnectWhere>;
};

export type ApplicationCompanyConnection = {
  __typename?: 'ApplicationCompanyConnection';
  aggregate: ApplicationCompanyCompanyAggregateSelection;
  edges: Array<ApplicationCompanyRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationCompanyConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationCompanyConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationCompanyConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationCompanyConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationCompanyNodeAggregationWhereInput>;
};

export type ApplicationCompanyConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationCompanyConnections */
  aggregate?: InputMaybe<ApplicationCompanyConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationCompanyConnections match this filter */
  all?: InputMaybe<ApplicationCompanyConnectionWhere>;
  /** Return Applications where none of the related ApplicationCompanyConnections match this filter */
  none?: InputMaybe<ApplicationCompanyConnectionWhere>;
  /** Return Applications where one of the related ApplicationCompanyConnections match this filter */
  single?: InputMaybe<ApplicationCompanyConnectionWhere>;
  /** Return Applications where some of the related ApplicationCompanyConnections match this filter */
  some?: InputMaybe<ApplicationCompanyConnectionWhere>;
};

export type ApplicationCompanyConnectionSort = {
  node?: InputMaybe<CompanySort>;
};

export type ApplicationCompanyConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationCompanyConnectionWhere>>;
  NOT?: InputMaybe<ApplicationCompanyConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationCompanyConnectionWhere>>;
  node?: InputMaybe<CompanyWhere>;
};

export type ApplicationCompanyCreateFieldInput = {
  node: CompanyCreateInput;
};

export type ApplicationCompanyDeleteFieldInput = {
  delete?: InputMaybe<CompanyDeleteInput>;
  where?: InputMaybe<ApplicationCompanyConnectionWhere>;
};

export type ApplicationCompanyDisconnectFieldInput = {
  disconnect?: InputMaybe<CompanyDisconnectInput>;
  where?: InputMaybe<ApplicationCompanyConnectionWhere>;
};

export type ApplicationCompanyFieldInput = {
  connect?: InputMaybe<Array<ApplicationCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationCompanyCreateFieldInput>>;
};

export type ApplicationCompanyNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationCompanyNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationCompanyNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationCompanyNodeAggregationWhereInput>>;
  address?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  industry?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  website?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationCompanyRelationship = {
  __typename?: 'ApplicationCompanyRelationship';
  cursor: Scalars['String']['output'];
  node: Company;
};

export type ApplicationCompanyUpdateConnectionInput = {
  node?: InputMaybe<CompanyUpdateInput>;
  where?: InputMaybe<ApplicationCompanyConnectionWhere>;
};

export type ApplicationCompanyUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationCompanyCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationCompanyDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationCompanyDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationCompanyUpdateConnectionInput>;
};

export type ApplicationComponentsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationComponentsAggregateInput>>;
  NOT?: InputMaybe<ApplicationComponentsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationComponentsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationComponentsNodeAggregationWhereInput>;
};

export type ApplicationComponentsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type ApplicationComponentsConnection = {
  __typename?: 'ApplicationComponentsConnection';
  aggregate: ApplicationApplicationComponentsAggregateSelection;
  edges: Array<ApplicationComponentsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationComponentsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationComponentsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationComponentsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationComponentsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationComponentsNodeAggregationWhereInput>;
};

export type ApplicationComponentsConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationComponentsConnections */
  aggregate?: InputMaybe<ApplicationComponentsConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationComponentsConnections match this filter */
  all?: InputMaybe<ApplicationComponentsConnectionWhere>;
  /** Return Applications where none of the related ApplicationComponentsConnections match this filter */
  none?: InputMaybe<ApplicationComponentsConnectionWhere>;
  /** Return Applications where one of the related ApplicationComponentsConnections match this filter */
  single?: InputMaybe<ApplicationComponentsConnectionWhere>;
  /** Return Applications where some of the related ApplicationComponentsConnections match this filter */
  some?: InputMaybe<ApplicationComponentsConnectionWhere>;
};

export type ApplicationComponentsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type ApplicationComponentsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationComponentsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationComponentsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationComponentsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type ApplicationComponentsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type ApplicationComponentsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<ApplicationComponentsConnectionWhere>;
};

export type ApplicationComponentsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<ApplicationComponentsConnectionWhere>;
};

export type ApplicationComponentsFieldInput = {
  connect?: InputMaybe<Array<ApplicationComponentsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationComponentsCreateFieldInput>>;
};

export type ApplicationComponentsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationComponentsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationComponentsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationComponentsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationComponentsRelationship = {
  __typename?: 'ApplicationComponentsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type ApplicationComponentsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<ApplicationComponentsConnectionWhere>;
};

export type ApplicationComponentsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationComponentsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationComponentsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationComponentsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationComponentsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationComponentsUpdateConnectionInput>;
};

export type ApplicationConnectInput = {
  company?: InputMaybe<Array<ApplicationCompanyConnectFieldInput>>;
  components?: InputMaybe<Array<ApplicationComponentsConnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<ApplicationDepictedInDiagramsConnectFieldInput>>;
  hostedOn?: InputMaybe<Array<ApplicationHostedOnConnectFieldInput>>;
  implementsPrinciples?: InputMaybe<Array<ApplicationImplementsPrinciplesConnectFieldInput>>;
  isDataSourceFor?: InputMaybe<Array<ApplicationIsDataSourceForConnectFieldInput>>;
  owners?: InputMaybe<Array<ApplicationOwnersConnectFieldInput>>;
  parents?: InputMaybe<Array<ApplicationParentsConnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationPartOfArchitecturesConnectFieldInput>>;
  predecessors?: InputMaybe<Array<ApplicationPredecessorsConnectFieldInput>>;
  sourceOfInterfaces?: InputMaybe<Array<ApplicationSourceOfInterfacesConnectFieldInput>>;
  successors?: InputMaybe<Array<ApplicationSuccessorsConnectFieldInput>>;
  supportsCapabilities?: InputMaybe<Array<ApplicationSupportsCapabilitiesConnectFieldInput>>;
  targetOfInterfaces?: InputMaybe<Array<ApplicationTargetOfInterfacesConnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<ApplicationUsedByOrganisationsConnectFieldInput>>;
  usesAIAssets?: InputMaybe<Array<ApplicationUsesAiAssetsConnectFieldInput>>;
  usesDataObjects?: InputMaybe<Array<ApplicationUsesDataObjectsConnectFieldInput>>;
};

export type ApplicationConnectWhere = {
  node: ApplicationWhere;
};

export type ApplicationCreateInput = {
  company?: InputMaybe<ApplicationCompanyFieldInput>;
  components?: InputMaybe<ApplicationComponentsFieldInput>;
  costs?: InputMaybe<Scalars['Float']['input']>;
  criticality: CriticalityLevel;
  depictedInDiagrams?: InputMaybe<ApplicationDepictedInDiagramsFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  endOfLifeDate?: InputMaybe<Scalars['Date']['input']>;
  endOfUseDate?: InputMaybe<Scalars['Date']['input']>;
  hostedOn?: InputMaybe<ApplicationHostedOnFieldInput>;
  hostingEnvironment?: InputMaybe<Scalars['String']['input']>;
  implementsPrinciples?: InputMaybe<ApplicationImplementsPrinciplesFieldInput>;
  introductionDate?: InputMaybe<Scalars['Date']['input']>;
  isDataSourceFor?: InputMaybe<ApplicationIsDataSourceForFieldInput>;
  name: Scalars['String']['input'];
  owners?: InputMaybe<ApplicationOwnersFieldInput>;
  parents?: InputMaybe<ApplicationParentsFieldInput>;
  partOfArchitectures?: InputMaybe<ApplicationPartOfArchitecturesFieldInput>;
  planningDate?: InputMaybe<Scalars['Date']['input']>;
  predecessors?: InputMaybe<ApplicationPredecessorsFieldInput>;
  sevenRStrategy?: InputMaybe<SevenRStrategy>;
  sourceOfInterfaces?: InputMaybe<ApplicationSourceOfInterfacesFieldInput>;
  status: ApplicationStatus;
  successors?: InputMaybe<ApplicationSuccessorsFieldInput>;
  supportsCapabilities?: InputMaybe<ApplicationSupportsCapabilitiesFieldInput>;
  targetOfInterfaces?: InputMaybe<ApplicationTargetOfInterfacesFieldInput>;
  technologyStack?: InputMaybe<Array<Scalars['String']['input']>>;
  timeCategory?: InputMaybe<TimeCategory>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usedByOrganisations?: InputMaybe<ApplicationUsedByOrganisationsFieldInput>;
  usesAIAssets?: InputMaybe<ApplicationUsesAiAssetsFieldInput>;
  usesDataObjects?: InputMaybe<ApplicationUsesDataObjectsFieldInput>;
  vendor?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type ApplicationDataObjectIsDataSourceForAggregateSelection = {
  __typename?: 'ApplicationDataObjectIsDataSourceForAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationDataObjectIsDataSourceForNodeAggregateSelection>;
};

export type ApplicationDataObjectIsDataSourceForNodeAggregateSelection = {
  __typename?: 'ApplicationDataObjectIsDataSourceForNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationDataObjectUsesDataObjectsAggregateSelection = {
  __typename?: 'ApplicationDataObjectUsesDataObjectsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationDataObjectUsesDataObjectsNodeAggregateSelection>;
};

export type ApplicationDataObjectUsesDataObjectsNodeAggregateSelection = {
  __typename?: 'ApplicationDataObjectUsesDataObjectsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationDeleteInput = {
  company?: InputMaybe<Array<ApplicationCompanyDeleteFieldInput>>;
  components?: InputMaybe<Array<ApplicationComponentsDeleteFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<ApplicationDepictedInDiagramsDeleteFieldInput>>;
  hostedOn?: InputMaybe<Array<ApplicationHostedOnDeleteFieldInput>>;
  implementsPrinciples?: InputMaybe<Array<ApplicationImplementsPrinciplesDeleteFieldInput>>;
  isDataSourceFor?: InputMaybe<Array<ApplicationIsDataSourceForDeleteFieldInput>>;
  owners?: InputMaybe<Array<ApplicationOwnersDeleteFieldInput>>;
  parents?: InputMaybe<Array<ApplicationParentsDeleteFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationPartOfArchitecturesDeleteFieldInput>>;
  predecessors?: InputMaybe<Array<ApplicationPredecessorsDeleteFieldInput>>;
  sourceOfInterfaces?: InputMaybe<Array<ApplicationSourceOfInterfacesDeleteFieldInput>>;
  successors?: InputMaybe<Array<ApplicationSuccessorsDeleteFieldInput>>;
  supportsCapabilities?: InputMaybe<Array<ApplicationSupportsCapabilitiesDeleteFieldInput>>;
  targetOfInterfaces?: InputMaybe<Array<ApplicationTargetOfInterfacesDeleteFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<ApplicationUsedByOrganisationsDeleteFieldInput>>;
  usesAIAssets?: InputMaybe<Array<ApplicationUsesAiAssetsDeleteFieldInput>>;
  usesDataObjects?: InputMaybe<Array<ApplicationUsesDataObjectsDeleteFieldInput>>;
};

export type ApplicationDepictedInDiagramsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationDepictedInDiagramsAggregateInput>>;
  NOT?: InputMaybe<ApplicationDepictedInDiagramsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationDepictedInDiagramsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationDepictedInDiagramsNodeAggregationWhereInput>;
};

export type ApplicationDepictedInDiagramsConnectFieldInput = {
  connect?: InputMaybe<Array<DiagramConnectInput>>;
  where?: InputMaybe<DiagramConnectWhere>;
};

export type ApplicationDepictedInDiagramsConnection = {
  __typename?: 'ApplicationDepictedInDiagramsConnection';
  aggregate: ApplicationDiagramDepictedInDiagramsAggregateSelection;
  edges: Array<ApplicationDepictedInDiagramsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationDepictedInDiagramsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationDepictedInDiagramsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationDepictedInDiagramsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationDepictedInDiagramsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationDepictedInDiagramsNodeAggregationWhereInput>;
};

export type ApplicationDepictedInDiagramsConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationDepictedInDiagramsConnections */
  aggregate?: InputMaybe<ApplicationDepictedInDiagramsConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationDepictedInDiagramsConnections match this filter */
  all?: InputMaybe<ApplicationDepictedInDiagramsConnectionWhere>;
  /** Return Applications where none of the related ApplicationDepictedInDiagramsConnections match this filter */
  none?: InputMaybe<ApplicationDepictedInDiagramsConnectionWhere>;
  /** Return Applications where one of the related ApplicationDepictedInDiagramsConnections match this filter */
  single?: InputMaybe<ApplicationDepictedInDiagramsConnectionWhere>;
  /** Return Applications where some of the related ApplicationDepictedInDiagramsConnections match this filter */
  some?: InputMaybe<ApplicationDepictedInDiagramsConnectionWhere>;
};

export type ApplicationDepictedInDiagramsConnectionSort = {
  node?: InputMaybe<DiagramSort>;
};

export type ApplicationDepictedInDiagramsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationDepictedInDiagramsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationDepictedInDiagramsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationDepictedInDiagramsConnectionWhere>>;
  node?: InputMaybe<DiagramWhere>;
};

export type ApplicationDepictedInDiagramsCreateFieldInput = {
  node: DiagramCreateInput;
};

export type ApplicationDepictedInDiagramsDeleteFieldInput = {
  delete?: InputMaybe<DiagramDeleteInput>;
  where?: InputMaybe<ApplicationDepictedInDiagramsConnectionWhere>;
};

export type ApplicationDepictedInDiagramsDisconnectFieldInput = {
  disconnect?: InputMaybe<DiagramDisconnectInput>;
  where?: InputMaybe<ApplicationDepictedInDiagramsConnectionWhere>;
};

export type ApplicationDepictedInDiagramsFieldInput = {
  connect?: InputMaybe<Array<ApplicationDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationDepictedInDiagramsCreateFieldInput>>;
};

export type ApplicationDepictedInDiagramsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationDepictedInDiagramsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationDepictedInDiagramsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationDepictedInDiagramsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  diagramJson?: InputMaybe<StringScalarAggregationFilters>;
  diagramPng?: InputMaybe<StringScalarAggregationFilters>;
  title?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationDepictedInDiagramsRelationship = {
  __typename?: 'ApplicationDepictedInDiagramsRelationship';
  cursor: Scalars['String']['output'];
  node: Diagram;
};

export type ApplicationDepictedInDiagramsUpdateConnectionInput = {
  node?: InputMaybe<DiagramUpdateInput>;
  where?: InputMaybe<ApplicationDepictedInDiagramsConnectionWhere>;
};

export type ApplicationDepictedInDiagramsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationDepictedInDiagramsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationDepictedInDiagramsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationDepictedInDiagramsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationDepictedInDiagramsUpdateConnectionInput>;
};

export type ApplicationDiagramDepictedInDiagramsAggregateSelection = {
  __typename?: 'ApplicationDiagramDepictedInDiagramsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationDiagramDepictedInDiagramsNodeAggregateSelection>;
};

export type ApplicationDiagramDepictedInDiagramsNodeAggregateSelection = {
  __typename?: 'ApplicationDiagramDepictedInDiagramsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  diagramJson: StringAggregateSelection;
  diagramPng: StringAggregateSelection;
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationDisconnectInput = {
  company?: InputMaybe<Array<ApplicationCompanyDisconnectFieldInput>>;
  components?: InputMaybe<Array<ApplicationComponentsDisconnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<ApplicationDepictedInDiagramsDisconnectFieldInput>>;
  hostedOn?: InputMaybe<Array<ApplicationHostedOnDisconnectFieldInput>>;
  implementsPrinciples?: InputMaybe<Array<ApplicationImplementsPrinciplesDisconnectFieldInput>>;
  isDataSourceFor?: InputMaybe<Array<ApplicationIsDataSourceForDisconnectFieldInput>>;
  owners?: InputMaybe<Array<ApplicationOwnersDisconnectFieldInput>>;
  parents?: InputMaybe<Array<ApplicationParentsDisconnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationPartOfArchitecturesDisconnectFieldInput>>;
  predecessors?: InputMaybe<Array<ApplicationPredecessorsDisconnectFieldInput>>;
  sourceOfInterfaces?: InputMaybe<Array<ApplicationSourceOfInterfacesDisconnectFieldInput>>;
  successors?: InputMaybe<Array<ApplicationSuccessorsDisconnectFieldInput>>;
  supportsCapabilities?: InputMaybe<Array<ApplicationSupportsCapabilitiesDisconnectFieldInput>>;
  targetOfInterfaces?: InputMaybe<Array<ApplicationTargetOfInterfacesDisconnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<ApplicationUsedByOrganisationsDisconnectFieldInput>>;
  usesAIAssets?: InputMaybe<Array<ApplicationUsesAiAssetsDisconnectFieldInput>>;
  usesDataObjects?: InputMaybe<Array<ApplicationUsesDataObjectsDisconnectFieldInput>>;
};

export type ApplicationEdge = {
  __typename?: 'ApplicationEdge';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type ApplicationHostedOnAggregateInput = {
  AND?: InputMaybe<Array<ApplicationHostedOnAggregateInput>>;
  NOT?: InputMaybe<ApplicationHostedOnAggregateInput>;
  OR?: InputMaybe<Array<ApplicationHostedOnAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationHostedOnNodeAggregationWhereInput>;
};

export type ApplicationHostedOnConnectFieldInput = {
  connect?: InputMaybe<Array<InfrastructureConnectInput>>;
  where?: InputMaybe<InfrastructureConnectWhere>;
};

export type ApplicationHostedOnConnection = {
  __typename?: 'ApplicationHostedOnConnection';
  aggregate: ApplicationInfrastructureHostedOnAggregateSelection;
  edges: Array<ApplicationHostedOnRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationHostedOnConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationHostedOnConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationHostedOnConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationHostedOnConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationHostedOnNodeAggregationWhereInput>;
};

export type ApplicationHostedOnConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationHostedOnConnections */
  aggregate?: InputMaybe<ApplicationHostedOnConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationHostedOnConnections match this filter */
  all?: InputMaybe<ApplicationHostedOnConnectionWhere>;
  /** Return Applications where none of the related ApplicationHostedOnConnections match this filter */
  none?: InputMaybe<ApplicationHostedOnConnectionWhere>;
  /** Return Applications where one of the related ApplicationHostedOnConnections match this filter */
  single?: InputMaybe<ApplicationHostedOnConnectionWhere>;
  /** Return Applications where some of the related ApplicationHostedOnConnections match this filter */
  some?: InputMaybe<ApplicationHostedOnConnectionWhere>;
};

export type ApplicationHostedOnConnectionSort = {
  node?: InputMaybe<InfrastructureSort>;
};

export type ApplicationHostedOnConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationHostedOnConnectionWhere>>;
  NOT?: InputMaybe<ApplicationHostedOnConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationHostedOnConnectionWhere>>;
  node?: InputMaybe<InfrastructureWhere>;
};

export type ApplicationHostedOnCreateFieldInput = {
  node: InfrastructureCreateInput;
};

export type ApplicationHostedOnDeleteFieldInput = {
  delete?: InputMaybe<InfrastructureDeleteInput>;
  where?: InputMaybe<ApplicationHostedOnConnectionWhere>;
};

export type ApplicationHostedOnDisconnectFieldInput = {
  disconnect?: InputMaybe<InfrastructureDisconnectInput>;
  where?: InputMaybe<ApplicationHostedOnConnectionWhere>;
};

export type ApplicationHostedOnFieldInput = {
  connect?: InputMaybe<Array<ApplicationHostedOnConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationHostedOnCreateFieldInput>>;
};

export type ApplicationHostedOnNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationHostedOnNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationHostedOnNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationHostedOnNodeAggregationWhereInput>>;
  capacity?: InputMaybe<StringScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  ipAddress?: InputMaybe<StringScalarAggregationFilters>;
  location?: InputMaybe<StringScalarAggregationFilters>;
  maintenanceWindow?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  operatingSystem?: InputMaybe<StringScalarAggregationFilters>;
  specifications?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationHostedOnRelationship = {
  __typename?: 'ApplicationHostedOnRelationship';
  cursor: Scalars['String']['output'];
  node: Infrastructure;
};

export type ApplicationHostedOnUpdateConnectionInput = {
  node?: InputMaybe<InfrastructureUpdateInput>;
  where?: InputMaybe<ApplicationHostedOnConnectionWhere>;
};

export type ApplicationHostedOnUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationHostedOnConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationHostedOnCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationHostedOnDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationHostedOnDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationHostedOnUpdateConnectionInput>;
};

export type ApplicationImplementsPrinciplesAggregateInput = {
  AND?: InputMaybe<Array<ApplicationImplementsPrinciplesAggregateInput>>;
  NOT?: InputMaybe<ApplicationImplementsPrinciplesAggregateInput>;
  OR?: InputMaybe<Array<ApplicationImplementsPrinciplesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationImplementsPrinciplesNodeAggregationWhereInput>;
};

export type ApplicationImplementsPrinciplesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleConnectInput>>;
  where?: InputMaybe<ArchitecturePrincipleConnectWhere>;
};

export type ApplicationImplementsPrinciplesConnection = {
  __typename?: 'ApplicationImplementsPrinciplesConnection';
  aggregate: ApplicationArchitecturePrincipleImplementsPrinciplesAggregateSelection;
  edges: Array<ApplicationImplementsPrinciplesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationImplementsPrinciplesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationImplementsPrinciplesConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationImplementsPrinciplesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationImplementsPrinciplesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationImplementsPrinciplesNodeAggregationWhereInput>;
};

export type ApplicationImplementsPrinciplesConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationImplementsPrinciplesConnections */
  aggregate?: InputMaybe<ApplicationImplementsPrinciplesConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationImplementsPrinciplesConnections match this filter */
  all?: InputMaybe<ApplicationImplementsPrinciplesConnectionWhere>;
  /** Return Applications where none of the related ApplicationImplementsPrinciplesConnections match this filter */
  none?: InputMaybe<ApplicationImplementsPrinciplesConnectionWhere>;
  /** Return Applications where one of the related ApplicationImplementsPrinciplesConnections match this filter */
  single?: InputMaybe<ApplicationImplementsPrinciplesConnectionWhere>;
  /** Return Applications where some of the related ApplicationImplementsPrinciplesConnections match this filter */
  some?: InputMaybe<ApplicationImplementsPrinciplesConnectionWhere>;
};

export type ApplicationImplementsPrinciplesConnectionSort = {
  node?: InputMaybe<ArchitecturePrincipleSort>;
};

export type ApplicationImplementsPrinciplesConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationImplementsPrinciplesConnectionWhere>>;
  NOT?: InputMaybe<ApplicationImplementsPrinciplesConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationImplementsPrinciplesConnectionWhere>>;
  node?: InputMaybe<ArchitecturePrincipleWhere>;
};

export type ApplicationImplementsPrinciplesCreateFieldInput = {
  node: ArchitecturePrincipleCreateInput;
};

export type ApplicationImplementsPrinciplesDeleteFieldInput = {
  delete?: InputMaybe<ArchitecturePrincipleDeleteInput>;
  where?: InputMaybe<ApplicationImplementsPrinciplesConnectionWhere>;
};

export type ApplicationImplementsPrinciplesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitecturePrincipleDisconnectInput>;
  where?: InputMaybe<ApplicationImplementsPrinciplesConnectionWhere>;
};

export type ApplicationImplementsPrinciplesFieldInput = {
  connect?: InputMaybe<Array<ApplicationImplementsPrinciplesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationImplementsPrinciplesCreateFieldInput>>;
};

export type ApplicationImplementsPrinciplesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationImplementsPrinciplesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationImplementsPrinciplesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationImplementsPrinciplesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  implications?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  rationale?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationImplementsPrinciplesRelationship = {
  __typename?: 'ApplicationImplementsPrinciplesRelationship';
  cursor: Scalars['String']['output'];
  node: ArchitecturePrinciple;
};

export type ApplicationImplementsPrinciplesUpdateConnectionInput = {
  node?: InputMaybe<ArchitecturePrincipleUpdateInput>;
  where?: InputMaybe<ApplicationImplementsPrinciplesConnectionWhere>;
};

export type ApplicationImplementsPrinciplesUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationImplementsPrinciplesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationImplementsPrinciplesCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationImplementsPrinciplesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationImplementsPrinciplesDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationImplementsPrinciplesUpdateConnectionInput>;
};

export type ApplicationInfrastructureHostedOnAggregateSelection = {
  __typename?: 'ApplicationInfrastructureHostedOnAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInfrastructureHostedOnNodeAggregateSelection>;
};

export type ApplicationInfrastructureHostedOnNodeAggregateSelection = {
  __typename?: 'ApplicationInfrastructureHostedOnNodeAggregateSelection';
  capacity: StringAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  ipAddress: StringAggregateSelection;
  location: StringAggregateSelection;
  maintenanceWindow: StringAggregateSelection;
  name: StringAggregateSelection;
  operatingSystem: StringAggregateSelection;
  specifications: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterface = {
  __typename?: 'ApplicationInterface';
  company: Array<Company>;
  companyConnection: ApplicationInterfaceCompanyConnection;
  createdAt: Scalars['DateTime']['output'];
  dataObjects: Array<DataObject>;
  dataObjectsConnection: ApplicationInterfaceDataObjectsConnection;
  depictedInDiagrams: Array<Diagram>;
  depictedInDiagramsConnection: ApplicationInterfaceDepictedInDiagramsConnection;
  description?: Maybe<Scalars['String']['output']>;
  endOfLifeDate?: Maybe<Scalars['Date']['output']>;
  endOfUseDate?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  interfaceType: InterfaceType;
  introductionDate?: Maybe<Scalars['Date']['output']>;
  name: Scalars['String']['output'];
  owners: Array<Person>;
  ownersConnection: ApplicationInterfaceOwnersConnection;
  partOfArchitectures: Array<Architecture>;
  partOfArchitecturesConnection: ApplicationInterfacePartOfArchitecturesConnection;
  planningDate?: Maybe<Scalars['Date']['output']>;
  predecessors: Array<ApplicationInterface>;
  predecessorsConnection: ApplicationInterfacePredecessorsConnection;
  protocol?: Maybe<InterfaceProtocol>;
  sourceApplications: Array<Application>;
  sourceApplicationsConnection: ApplicationInterfaceSourceApplicationsConnection;
  status: InterfaceStatus;
  successors: Array<ApplicationInterface>;
  successorsConnection: ApplicationInterfaceSuccessorsConnection;
  targetApplications: Array<Application>;
  targetApplicationsConnection: ApplicationInterfaceTargetApplicationsConnection;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usedByOrganisations: Array<Organisation>;
  usedByOrganisationsConnection: ApplicationInterfaceUsedByOrganisationsConnection;
  version?: Maybe<Scalars['String']['output']>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceCompanyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanySort>>;
  where?: InputMaybe<CompanyWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceCompanyConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceCompanyConnectionSort>>;
  where?: InputMaybe<ApplicationInterfaceCompanyConnectionWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceDataObjectsConnectionSort>>;
  where?: InputMaybe<ApplicationInterfaceDataObjectsConnectionWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceDepictedInDiagramsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramSort>>;
  where?: InputMaybe<DiagramWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceDepictedInDiagramsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsConnectionSort>>;
  where?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceOwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceOwnersConnectionSort>>;
  where?: InputMaybe<ApplicationInterfaceOwnersConnectionWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfacePartOfArchitecturesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfacePartOfArchitecturesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesConnectionSort>>;
  where?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfacePredecessorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfacePredecessorsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfacePredecessorsConnectionSort>>;
  where?: InputMaybe<ApplicationInterfacePredecessorsConnectionWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceSourceApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceSourceApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsConnectionSort>>;
  where?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceSuccessorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceSuccessorsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSuccessorsConnectionSort>>;
  where?: InputMaybe<ApplicationInterfaceSuccessorsConnectionWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceTargetApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceTargetApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsConnectionSort>>;
  where?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceUsedByOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterfaceUsedByOrganisationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsConnectionSort>>;
  where?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionWhere>;
};

export type ApplicationInterfaceAggregate = {
  __typename?: 'ApplicationInterfaceAggregate';
  count: Count;
  node: ApplicationInterfaceAggregateNode;
};

export type ApplicationInterfaceAggregateNode = {
  __typename?: 'ApplicationInterfaceAggregateNode';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationInterfaceApplicationInterfacePredecessorsAggregateSelection = {
  __typename?: 'ApplicationInterfaceApplicationInterfacePredecessorsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInterfaceApplicationInterfacePredecessorsNodeAggregateSelection>;
};

export type ApplicationInterfaceApplicationInterfacePredecessorsNodeAggregateSelection = {
  __typename?: 'ApplicationInterfaceApplicationInterfacePredecessorsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationInterfaceApplicationInterfaceSuccessorsAggregateSelection = {
  __typename?: 'ApplicationInterfaceApplicationInterfaceSuccessorsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInterfaceApplicationInterfaceSuccessorsNodeAggregateSelection>;
};

export type ApplicationInterfaceApplicationInterfaceSuccessorsNodeAggregateSelection = {
  __typename?: 'ApplicationInterfaceApplicationInterfaceSuccessorsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationInterfaceApplicationSourceApplicationsAggregateSelection = {
  __typename?: 'ApplicationInterfaceApplicationSourceApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInterfaceApplicationSourceApplicationsNodeAggregateSelection>;
};

export type ApplicationInterfaceApplicationSourceApplicationsNodeAggregateSelection = {
  __typename?: 'ApplicationInterfaceApplicationSourceApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationInterfaceApplicationTargetApplicationsAggregateSelection = {
  __typename?: 'ApplicationInterfaceApplicationTargetApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInterfaceApplicationTargetApplicationsNodeAggregateSelection>;
};

export type ApplicationInterfaceApplicationTargetApplicationsNodeAggregateSelection = {
  __typename?: 'ApplicationInterfaceApplicationTargetApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type ApplicationInterfaceArchitecturePartOfArchitecturesAggregateSelection = {
  __typename?: 'ApplicationInterfaceArchitecturePartOfArchitecturesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInterfaceArchitecturePartOfArchitecturesNodeAggregateSelection>;
};

export type ApplicationInterfaceArchitecturePartOfArchitecturesNodeAggregateSelection = {
  __typename?: 'ApplicationInterfaceArchitecturePartOfArchitecturesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationInterfaceCompanyAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceCompanyAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceCompanyAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceCompanyAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfaceCompanyNodeAggregationWhereInput>;
};

export type ApplicationInterfaceCompanyCompanyAggregateSelection = {
  __typename?: 'ApplicationInterfaceCompanyCompanyAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInterfaceCompanyCompanyNodeAggregateSelection>;
};

export type ApplicationInterfaceCompanyCompanyNodeAggregateSelection = {
  __typename?: 'ApplicationInterfaceCompanyCompanyNodeAggregateSelection';
  address: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  industry: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  website: StringAggregateSelection;
};

export type ApplicationInterfaceCompanyConnectFieldInput = {
  connect?: InputMaybe<Array<CompanyConnectInput>>;
  where?: InputMaybe<CompanyConnectWhere>;
};

export type ApplicationInterfaceCompanyConnection = {
  __typename?: 'ApplicationInterfaceCompanyConnection';
  aggregate: ApplicationInterfaceCompanyCompanyAggregateSelection;
  edges: Array<ApplicationInterfaceCompanyRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfaceCompanyConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceCompanyConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceCompanyConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceCompanyConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfaceCompanyNodeAggregationWhereInput>;
};

export type ApplicationInterfaceCompanyConnectionFilters = {
  /** Filter ApplicationInterfaces by aggregating results on related ApplicationInterfaceCompanyConnections */
  aggregate?: InputMaybe<ApplicationInterfaceCompanyConnectionAggregateInput>;
  /** Return ApplicationInterfaces where all of the related ApplicationInterfaceCompanyConnections match this filter */
  all?: InputMaybe<ApplicationInterfaceCompanyConnectionWhere>;
  /** Return ApplicationInterfaces where none of the related ApplicationInterfaceCompanyConnections match this filter */
  none?: InputMaybe<ApplicationInterfaceCompanyConnectionWhere>;
  /** Return ApplicationInterfaces where one of the related ApplicationInterfaceCompanyConnections match this filter */
  single?: InputMaybe<ApplicationInterfaceCompanyConnectionWhere>;
  /** Return ApplicationInterfaces where some of the related ApplicationInterfaceCompanyConnections match this filter */
  some?: InputMaybe<ApplicationInterfaceCompanyConnectionWhere>;
};

export type ApplicationInterfaceCompanyConnectionSort = {
  node?: InputMaybe<CompanySort>;
};

export type ApplicationInterfaceCompanyConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfaceCompanyConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfaceCompanyConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfaceCompanyConnectionWhere>>;
  node?: InputMaybe<CompanyWhere>;
};

export type ApplicationInterfaceCompanyCreateFieldInput = {
  node: CompanyCreateInput;
};

export type ApplicationInterfaceCompanyDeleteFieldInput = {
  delete?: InputMaybe<CompanyDeleteInput>;
  where?: InputMaybe<ApplicationInterfaceCompanyConnectionWhere>;
};

export type ApplicationInterfaceCompanyDisconnectFieldInput = {
  disconnect?: InputMaybe<CompanyDisconnectInput>;
  where?: InputMaybe<ApplicationInterfaceCompanyConnectionWhere>;
};

export type ApplicationInterfaceCompanyFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceCompanyCreateFieldInput>>;
};

export type ApplicationInterfaceCompanyNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceCompanyNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfaceCompanyNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceCompanyNodeAggregationWhereInput>>;
  address?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  industry?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  website?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationInterfaceCompanyRelationship = {
  __typename?: 'ApplicationInterfaceCompanyRelationship';
  cursor: Scalars['String']['output'];
  node: Company;
};

export type ApplicationInterfaceCompanyUpdateConnectionInput = {
  node?: InputMaybe<CompanyUpdateInput>;
  where?: InputMaybe<ApplicationInterfaceCompanyConnectionWhere>;
};

export type ApplicationInterfaceCompanyUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceCompanyCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfaceCompanyDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfaceCompanyDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfaceCompanyUpdateConnectionInput>;
};

export type ApplicationInterfaceConnectInput = {
  company?: InputMaybe<Array<ApplicationInterfaceCompanyConnectFieldInput>>;
  dataObjects?: InputMaybe<Array<ApplicationInterfaceDataObjectsConnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsConnectFieldInput>>;
  owners?: InputMaybe<Array<ApplicationInterfaceOwnersConnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesConnectFieldInput>>;
  predecessors?: InputMaybe<Array<ApplicationInterfacePredecessorsConnectFieldInput>>;
  sourceApplications?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsConnectFieldInput>>;
  successors?: InputMaybe<Array<ApplicationInterfaceSuccessorsConnectFieldInput>>;
  targetApplications?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsConnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsConnectFieldInput>>;
};

export type ApplicationInterfaceConnectWhere = {
  node: ApplicationInterfaceWhere;
};

export type ApplicationInterfaceCreateInput = {
  company?: InputMaybe<ApplicationInterfaceCompanyFieldInput>;
  dataObjects?: InputMaybe<ApplicationInterfaceDataObjectsFieldInput>;
  depictedInDiagrams?: InputMaybe<ApplicationInterfaceDepictedInDiagramsFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  endOfLifeDate?: InputMaybe<Scalars['Date']['input']>;
  endOfUseDate?: InputMaybe<Scalars['Date']['input']>;
  interfaceType: InterfaceType;
  introductionDate?: InputMaybe<Scalars['Date']['input']>;
  name: Scalars['String']['input'];
  owners?: InputMaybe<ApplicationInterfaceOwnersFieldInput>;
  partOfArchitectures?: InputMaybe<ApplicationInterfacePartOfArchitecturesFieldInput>;
  planningDate?: InputMaybe<Scalars['Date']['input']>;
  predecessors?: InputMaybe<ApplicationInterfacePredecessorsFieldInput>;
  protocol?: InputMaybe<InterfaceProtocol>;
  sourceApplications?: InputMaybe<ApplicationInterfaceSourceApplicationsFieldInput>;
  status: InterfaceStatus;
  successors?: InputMaybe<ApplicationInterfaceSuccessorsFieldInput>;
  targetApplications?: InputMaybe<ApplicationInterfaceTargetApplicationsFieldInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usedByOrganisations?: InputMaybe<ApplicationInterfaceUsedByOrganisationsFieldInput>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type ApplicationInterfaceDataObjectDataObjectsAggregateSelection = {
  __typename?: 'ApplicationInterfaceDataObjectDataObjectsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInterfaceDataObjectDataObjectsNodeAggregateSelection>;
};

export type ApplicationInterfaceDataObjectDataObjectsNodeAggregateSelection = {
  __typename?: 'ApplicationInterfaceDataObjectDataObjectsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationInterfaceDataObjectsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceDataObjectsAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceDataObjectsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceDataObjectsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfaceDataObjectsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceDataObjectsConnectFieldInput = {
  connect?: InputMaybe<Array<DataObjectConnectInput>>;
  where?: InputMaybe<DataObjectConnectWhere>;
};

export type ApplicationInterfaceDataObjectsConnection = {
  __typename?: 'ApplicationInterfaceDataObjectsConnection';
  aggregate: ApplicationInterfaceDataObjectDataObjectsAggregateSelection;
  edges: Array<ApplicationInterfaceDataObjectsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfaceDataObjectsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceDataObjectsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceDataObjectsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceDataObjectsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfaceDataObjectsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceDataObjectsConnectionFilters = {
  /** Filter ApplicationInterfaces by aggregating results on related ApplicationInterfaceDataObjectsConnections */
  aggregate?: InputMaybe<ApplicationInterfaceDataObjectsConnectionAggregateInput>;
  /** Return ApplicationInterfaces where all of the related ApplicationInterfaceDataObjectsConnections match this filter */
  all?: InputMaybe<ApplicationInterfaceDataObjectsConnectionWhere>;
  /** Return ApplicationInterfaces where none of the related ApplicationInterfaceDataObjectsConnections match this filter */
  none?: InputMaybe<ApplicationInterfaceDataObjectsConnectionWhere>;
  /** Return ApplicationInterfaces where one of the related ApplicationInterfaceDataObjectsConnections match this filter */
  single?: InputMaybe<ApplicationInterfaceDataObjectsConnectionWhere>;
  /** Return ApplicationInterfaces where some of the related ApplicationInterfaceDataObjectsConnections match this filter */
  some?: InputMaybe<ApplicationInterfaceDataObjectsConnectionWhere>;
};

export type ApplicationInterfaceDataObjectsConnectionSort = {
  node?: InputMaybe<DataObjectSort>;
};

export type ApplicationInterfaceDataObjectsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfaceDataObjectsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfaceDataObjectsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfaceDataObjectsConnectionWhere>>;
  node?: InputMaybe<DataObjectWhere>;
};

export type ApplicationInterfaceDataObjectsCreateFieldInput = {
  node: DataObjectCreateInput;
};

export type ApplicationInterfaceDataObjectsDeleteFieldInput = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<ApplicationInterfaceDataObjectsConnectionWhere>;
};

export type ApplicationInterfaceDataObjectsDisconnectFieldInput = {
  disconnect?: InputMaybe<DataObjectDisconnectInput>;
  where?: InputMaybe<ApplicationInterfaceDataObjectsConnectionWhere>;
};

export type ApplicationInterfaceDataObjectsFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceDataObjectsCreateFieldInput>>;
};

export type ApplicationInterfaceDataObjectsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceDataObjectsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfaceDataObjectsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceDataObjectsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  format?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationInterfaceDataObjectsRelationship = {
  __typename?: 'ApplicationInterfaceDataObjectsRelationship';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type ApplicationInterfaceDataObjectsUpdateConnectionInput = {
  node?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<ApplicationInterfaceDataObjectsConnectionWhere>;
};

export type ApplicationInterfaceDataObjectsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceDataObjectsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfaceDataObjectsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfaceDataObjectsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfaceDataObjectsUpdateConnectionInput>;
};

export type ApplicationInterfaceDeleteInput = {
  company?: InputMaybe<Array<ApplicationInterfaceCompanyDeleteFieldInput>>;
  dataObjects?: InputMaybe<Array<ApplicationInterfaceDataObjectsDeleteFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsDeleteFieldInput>>;
  owners?: InputMaybe<Array<ApplicationInterfaceOwnersDeleteFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesDeleteFieldInput>>;
  predecessors?: InputMaybe<Array<ApplicationInterfacePredecessorsDeleteFieldInput>>;
  sourceApplications?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsDeleteFieldInput>>;
  successors?: InputMaybe<Array<ApplicationInterfaceSuccessorsDeleteFieldInput>>;
  targetApplications?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsDeleteFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsDeleteFieldInput>>;
};

export type ApplicationInterfaceDepictedInDiagramsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceDepictedInDiagramsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfaceDepictedInDiagramsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceDepictedInDiagramsConnectFieldInput = {
  connect?: InputMaybe<Array<DiagramConnectInput>>;
  where?: InputMaybe<DiagramConnectWhere>;
};

export type ApplicationInterfaceDepictedInDiagramsConnection = {
  __typename?: 'ApplicationInterfaceDepictedInDiagramsConnection';
  aggregate: ApplicationInterfaceDiagramDepictedInDiagramsAggregateSelection;
  edges: Array<ApplicationInterfaceDepictedInDiagramsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfaceDepictedInDiagramsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfaceDepictedInDiagramsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceDepictedInDiagramsConnectionFilters = {
  /** Filter ApplicationInterfaces by aggregating results on related ApplicationInterfaceDepictedInDiagramsConnections */
  aggregate?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionAggregateInput>;
  /** Return ApplicationInterfaces where all of the related ApplicationInterfaceDepictedInDiagramsConnections match this filter */
  all?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionWhere>;
  /** Return ApplicationInterfaces where none of the related ApplicationInterfaceDepictedInDiagramsConnections match this filter */
  none?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionWhere>;
  /** Return ApplicationInterfaces where one of the related ApplicationInterfaceDepictedInDiagramsConnections match this filter */
  single?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionWhere>;
  /** Return ApplicationInterfaces where some of the related ApplicationInterfaceDepictedInDiagramsConnections match this filter */
  some?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionWhere>;
};

export type ApplicationInterfaceDepictedInDiagramsConnectionSort = {
  node?: InputMaybe<DiagramSort>;
};

export type ApplicationInterfaceDepictedInDiagramsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsConnectionWhere>>;
  node?: InputMaybe<DiagramWhere>;
};

export type ApplicationInterfaceDepictedInDiagramsCreateFieldInput = {
  node: DiagramCreateInput;
};

export type ApplicationInterfaceDepictedInDiagramsDeleteFieldInput = {
  delete?: InputMaybe<DiagramDeleteInput>;
  where?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionWhere>;
};

export type ApplicationInterfaceDepictedInDiagramsDisconnectFieldInput = {
  disconnect?: InputMaybe<DiagramDisconnectInput>;
  where?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionWhere>;
};

export type ApplicationInterfaceDepictedInDiagramsFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsCreateFieldInput>>;
};

export type ApplicationInterfaceDepictedInDiagramsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfaceDepictedInDiagramsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  diagramJson?: InputMaybe<StringScalarAggregationFilters>;
  diagramPng?: InputMaybe<StringScalarAggregationFilters>;
  title?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationInterfaceDepictedInDiagramsRelationship = {
  __typename?: 'ApplicationInterfaceDepictedInDiagramsRelationship';
  cursor: Scalars['String']['output'];
  node: Diagram;
};

export type ApplicationInterfaceDepictedInDiagramsUpdateConnectionInput = {
  node?: InputMaybe<DiagramUpdateInput>;
  where?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionWhere>;
};

export type ApplicationInterfaceDepictedInDiagramsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfaceDepictedInDiagramsUpdateConnectionInput>;
};

export type ApplicationInterfaceDiagramDepictedInDiagramsAggregateSelection = {
  __typename?: 'ApplicationInterfaceDiagramDepictedInDiagramsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInterfaceDiagramDepictedInDiagramsNodeAggregateSelection>;
};

export type ApplicationInterfaceDiagramDepictedInDiagramsNodeAggregateSelection = {
  __typename?: 'ApplicationInterfaceDiagramDepictedInDiagramsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  diagramJson: StringAggregateSelection;
  diagramPng: StringAggregateSelection;
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationInterfaceDisconnectInput = {
  company?: InputMaybe<Array<ApplicationInterfaceCompanyDisconnectFieldInput>>;
  dataObjects?: InputMaybe<Array<ApplicationInterfaceDataObjectsDisconnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsDisconnectFieldInput>>;
  owners?: InputMaybe<Array<ApplicationInterfaceOwnersDisconnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesDisconnectFieldInput>>;
  predecessors?: InputMaybe<Array<ApplicationInterfacePredecessorsDisconnectFieldInput>>;
  sourceApplications?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsDisconnectFieldInput>>;
  successors?: InputMaybe<Array<ApplicationInterfaceSuccessorsDisconnectFieldInput>>;
  targetApplications?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsDisconnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsDisconnectFieldInput>>;
};

export type ApplicationInterfaceEdge = {
  __typename?: 'ApplicationInterfaceEdge';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type ApplicationInterfaceOrganisationUsedByOrganisationsAggregateSelection = {
  __typename?: 'ApplicationInterfaceOrganisationUsedByOrganisationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInterfaceOrganisationUsedByOrganisationsNodeAggregateSelection>;
};

export type ApplicationInterfaceOrganisationUsedByOrganisationsNodeAggregateSelection = {
  __typename?: 'ApplicationInterfaceOrganisationUsedByOrganisationsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  level: IntAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationInterfaceOwnersAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceOwnersAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceOwnersAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceOwnersAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfaceOwnersNodeAggregationWhereInput>;
};

export type ApplicationInterfaceOwnersConnectFieldInput = {
  connect?: InputMaybe<Array<PersonConnectInput>>;
  where?: InputMaybe<PersonConnectWhere>;
};

export type ApplicationInterfaceOwnersConnection = {
  __typename?: 'ApplicationInterfaceOwnersConnection';
  aggregate: ApplicationInterfacePersonOwnersAggregateSelection;
  edges: Array<ApplicationInterfaceOwnersRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfaceOwnersConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceOwnersConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceOwnersConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceOwnersConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfaceOwnersNodeAggregationWhereInput>;
};

export type ApplicationInterfaceOwnersConnectionFilters = {
  /** Filter ApplicationInterfaces by aggregating results on related ApplicationInterfaceOwnersConnections */
  aggregate?: InputMaybe<ApplicationInterfaceOwnersConnectionAggregateInput>;
  /** Return ApplicationInterfaces where all of the related ApplicationInterfaceOwnersConnections match this filter */
  all?: InputMaybe<ApplicationInterfaceOwnersConnectionWhere>;
  /** Return ApplicationInterfaces where none of the related ApplicationInterfaceOwnersConnections match this filter */
  none?: InputMaybe<ApplicationInterfaceOwnersConnectionWhere>;
  /** Return ApplicationInterfaces where one of the related ApplicationInterfaceOwnersConnections match this filter */
  single?: InputMaybe<ApplicationInterfaceOwnersConnectionWhere>;
  /** Return ApplicationInterfaces where some of the related ApplicationInterfaceOwnersConnections match this filter */
  some?: InputMaybe<ApplicationInterfaceOwnersConnectionWhere>;
};

export type ApplicationInterfaceOwnersConnectionSort = {
  node?: InputMaybe<PersonSort>;
};

export type ApplicationInterfaceOwnersConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfaceOwnersConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfaceOwnersConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfaceOwnersConnectionWhere>>;
  node?: InputMaybe<PersonWhere>;
};

export type ApplicationInterfaceOwnersCreateFieldInput = {
  node: PersonCreateInput;
};

export type ApplicationInterfaceOwnersDeleteFieldInput = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<ApplicationInterfaceOwnersConnectionWhere>;
};

export type ApplicationInterfaceOwnersDisconnectFieldInput = {
  disconnect?: InputMaybe<PersonDisconnectInput>;
  where?: InputMaybe<ApplicationInterfaceOwnersConnectionWhere>;
};

export type ApplicationInterfaceOwnersFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceOwnersCreateFieldInput>>;
};

export type ApplicationInterfaceOwnersNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceOwnersNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfaceOwnersNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceOwnersNodeAggregationWhereInput>>;
  avatarUrl?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  department?: InputMaybe<StringScalarAggregationFilters>;
  email?: InputMaybe<StringScalarAggregationFilters>;
  firstName?: InputMaybe<StringScalarAggregationFilters>;
  lastName?: InputMaybe<StringScalarAggregationFilters>;
  phone?: InputMaybe<StringScalarAggregationFilters>;
  role?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationInterfaceOwnersRelationship = {
  __typename?: 'ApplicationInterfaceOwnersRelationship';
  cursor: Scalars['String']['output'];
  node: Person;
};

export type ApplicationInterfaceOwnersUpdateConnectionInput = {
  node?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<ApplicationInterfaceOwnersConnectionWhere>;
};

export type ApplicationInterfaceOwnersUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceOwnersCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfaceOwnersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfaceOwnersDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfaceOwnersUpdateConnectionInput>;
};

export type ApplicationInterfacePartOfArchitecturesAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfacePartOfArchitecturesAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfacePartOfArchitecturesNodeAggregationWhereInput>;
};

export type ApplicationInterfacePartOfArchitecturesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type ApplicationInterfacePartOfArchitecturesConnection = {
  __typename?: 'ApplicationInterfacePartOfArchitecturesConnection';
  aggregate: ApplicationInterfaceArchitecturePartOfArchitecturesAggregateSelection;
  edges: Array<ApplicationInterfacePartOfArchitecturesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfacePartOfArchitecturesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfacePartOfArchitecturesNodeAggregationWhereInput>;
};

export type ApplicationInterfacePartOfArchitecturesConnectionFilters = {
  /** Filter ApplicationInterfaces by aggregating results on related ApplicationInterfacePartOfArchitecturesConnections */
  aggregate?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionAggregateInput>;
  /** Return ApplicationInterfaces where all of the related ApplicationInterfacePartOfArchitecturesConnections match this filter */
  all?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionWhere>;
  /** Return ApplicationInterfaces where none of the related ApplicationInterfacePartOfArchitecturesConnections match this filter */
  none?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionWhere>;
  /** Return ApplicationInterfaces where one of the related ApplicationInterfacePartOfArchitecturesConnections match this filter */
  single?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionWhere>;
  /** Return ApplicationInterfaces where some of the related ApplicationInterfacePartOfArchitecturesConnections match this filter */
  some?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionWhere>;
};

export type ApplicationInterfacePartOfArchitecturesConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type ApplicationInterfacePartOfArchitecturesConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type ApplicationInterfacePartOfArchitecturesCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type ApplicationInterfacePartOfArchitecturesDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionWhere>;
};

export type ApplicationInterfacePartOfArchitecturesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionWhere>;
};

export type ApplicationInterfacePartOfArchitecturesFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesCreateFieldInput>>;
};

export type ApplicationInterfacePartOfArchitecturesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfacePartOfArchitecturesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationInterfacePartOfArchitecturesRelationship = {
  __typename?: 'ApplicationInterfacePartOfArchitecturesRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type ApplicationInterfacePartOfArchitecturesUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionWhere>;
};

export type ApplicationInterfacePartOfArchitecturesUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfacePartOfArchitecturesUpdateConnectionInput>;
};

export type ApplicationInterfacePersonOwnersAggregateSelection = {
  __typename?: 'ApplicationInterfacePersonOwnersAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationInterfacePersonOwnersNodeAggregateSelection>;
};

export type ApplicationInterfacePersonOwnersNodeAggregateSelection = {
  __typename?: 'ApplicationInterfacePersonOwnersNodeAggregateSelection';
  avatarUrl: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationInterfacePredecessorsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfacePredecessorsAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfacePredecessorsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfacePredecessorsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfacePredecessorsNodeAggregationWhereInput>;
};

export type ApplicationInterfacePredecessorsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type ApplicationInterfacePredecessorsConnection = {
  __typename?: 'ApplicationInterfacePredecessorsConnection';
  aggregate: ApplicationInterfaceApplicationInterfacePredecessorsAggregateSelection;
  edges: Array<ApplicationInterfacePredecessorsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfacePredecessorsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfacePredecessorsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfacePredecessorsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfacePredecessorsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfacePredecessorsNodeAggregationWhereInput>;
};

export type ApplicationInterfacePredecessorsConnectionFilters = {
  /** Filter ApplicationInterfaces by aggregating results on related ApplicationInterfacePredecessorsConnections */
  aggregate?: InputMaybe<ApplicationInterfacePredecessorsConnectionAggregateInput>;
  /** Return ApplicationInterfaces where all of the related ApplicationInterfacePredecessorsConnections match this filter */
  all?: InputMaybe<ApplicationInterfacePredecessorsConnectionWhere>;
  /** Return ApplicationInterfaces where none of the related ApplicationInterfacePredecessorsConnections match this filter */
  none?: InputMaybe<ApplicationInterfacePredecessorsConnectionWhere>;
  /** Return ApplicationInterfaces where one of the related ApplicationInterfacePredecessorsConnections match this filter */
  single?: InputMaybe<ApplicationInterfacePredecessorsConnectionWhere>;
  /** Return ApplicationInterfaces where some of the related ApplicationInterfacePredecessorsConnections match this filter */
  some?: InputMaybe<ApplicationInterfacePredecessorsConnectionWhere>;
};

export type ApplicationInterfacePredecessorsConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type ApplicationInterfacePredecessorsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfacePredecessorsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfacePredecessorsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfacePredecessorsConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type ApplicationInterfacePredecessorsCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type ApplicationInterfacePredecessorsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<ApplicationInterfacePredecessorsConnectionWhere>;
};

export type ApplicationInterfacePredecessorsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<ApplicationInterfacePredecessorsConnectionWhere>;
};

export type ApplicationInterfacePredecessorsFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfacePredecessorsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfacePredecessorsCreateFieldInput>>;
};

export type ApplicationInterfacePredecessorsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfacePredecessorsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfacePredecessorsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfacePredecessorsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationInterfacePredecessorsRelationship = {
  __typename?: 'ApplicationInterfacePredecessorsRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type ApplicationInterfacePredecessorsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<ApplicationInterfacePredecessorsConnectionWhere>;
};

export type ApplicationInterfacePredecessorsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfacePredecessorsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfacePredecessorsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfacePredecessorsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfacePredecessorsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfacePredecessorsUpdateConnectionInput>;
};

export type ApplicationInterfaceRelationshipFilters = {
  /** Filter type where all of the related ApplicationInterfaces match this filter */
  all?: InputMaybe<ApplicationInterfaceWhere>;
  /** Filter type where none of the related ApplicationInterfaces match this filter */
  none?: InputMaybe<ApplicationInterfaceWhere>;
  /** Filter type where one of the related ApplicationInterfaces match this filter */
  single?: InputMaybe<ApplicationInterfaceWhere>;
  /** Filter type where some of the related ApplicationInterfaces match this filter */
  some?: InputMaybe<ApplicationInterfaceWhere>;
};

/** Fields to sort ApplicationInterfaces by. The order in which sorts are applied is not guaranteed when specifying many fields in one ApplicationInterfaceSort object. */
export type ApplicationInterfaceSort = {
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  endOfLifeDate?: InputMaybe<SortDirection>;
  endOfUseDate?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  interfaceType?: InputMaybe<SortDirection>;
  introductionDate?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  planningDate?: InputMaybe<SortDirection>;
  protocol?: InputMaybe<SortDirection>;
  status?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
  version?: InputMaybe<SortDirection>;
};

export type ApplicationInterfaceSourceApplicationsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceSourceApplicationsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfaceSourceApplicationsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceSourceApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type ApplicationInterfaceSourceApplicationsConnection = {
  __typename?: 'ApplicationInterfaceSourceApplicationsConnection';
  aggregate: ApplicationInterfaceApplicationSourceApplicationsAggregateSelection;
  edges: Array<ApplicationInterfaceSourceApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfaceSourceApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfaceSourceApplicationsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceSourceApplicationsConnectionFilters = {
  /** Filter ApplicationInterfaces by aggregating results on related ApplicationInterfaceSourceApplicationsConnections */
  aggregate?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionAggregateInput>;
  /** Return ApplicationInterfaces where all of the related ApplicationInterfaceSourceApplicationsConnections match this filter */
  all?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionWhere>;
  /** Return ApplicationInterfaces where none of the related ApplicationInterfaceSourceApplicationsConnections match this filter */
  none?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionWhere>;
  /** Return ApplicationInterfaces where one of the related ApplicationInterfaceSourceApplicationsConnections match this filter */
  single?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionWhere>;
  /** Return ApplicationInterfaces where some of the related ApplicationInterfaceSourceApplicationsConnections match this filter */
  some?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionWhere>;
};

export type ApplicationInterfaceSourceApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type ApplicationInterfaceSourceApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type ApplicationInterfaceSourceApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type ApplicationInterfaceSourceApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionWhere>;
};

export type ApplicationInterfaceSourceApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionWhere>;
};

export type ApplicationInterfaceSourceApplicationsFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsCreateFieldInput>>;
};

export type ApplicationInterfaceSourceApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfaceSourceApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationInterfaceSourceApplicationsRelationship = {
  __typename?: 'ApplicationInterfaceSourceApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type ApplicationInterfaceSourceApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionWhere>;
};

export type ApplicationInterfaceSourceApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfaceSourceApplicationsUpdateConnectionInput>;
};

export type ApplicationInterfaceSuccessorsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceSuccessorsAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceSuccessorsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceSuccessorsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfaceSuccessorsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceSuccessorsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type ApplicationInterfaceSuccessorsConnection = {
  __typename?: 'ApplicationInterfaceSuccessorsConnection';
  aggregate: ApplicationInterfaceApplicationInterfaceSuccessorsAggregateSelection;
  edges: Array<ApplicationInterfaceSuccessorsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfaceSuccessorsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceSuccessorsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceSuccessorsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceSuccessorsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfaceSuccessorsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceSuccessorsConnectionFilters = {
  /** Filter ApplicationInterfaces by aggregating results on related ApplicationInterfaceSuccessorsConnections */
  aggregate?: InputMaybe<ApplicationInterfaceSuccessorsConnectionAggregateInput>;
  /** Return ApplicationInterfaces where all of the related ApplicationInterfaceSuccessorsConnections match this filter */
  all?: InputMaybe<ApplicationInterfaceSuccessorsConnectionWhere>;
  /** Return ApplicationInterfaces where none of the related ApplicationInterfaceSuccessorsConnections match this filter */
  none?: InputMaybe<ApplicationInterfaceSuccessorsConnectionWhere>;
  /** Return ApplicationInterfaces where one of the related ApplicationInterfaceSuccessorsConnections match this filter */
  single?: InputMaybe<ApplicationInterfaceSuccessorsConnectionWhere>;
  /** Return ApplicationInterfaces where some of the related ApplicationInterfaceSuccessorsConnections match this filter */
  some?: InputMaybe<ApplicationInterfaceSuccessorsConnectionWhere>;
};

export type ApplicationInterfaceSuccessorsConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type ApplicationInterfaceSuccessorsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfaceSuccessorsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfaceSuccessorsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfaceSuccessorsConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type ApplicationInterfaceSuccessorsCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type ApplicationInterfaceSuccessorsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<ApplicationInterfaceSuccessorsConnectionWhere>;
};

export type ApplicationInterfaceSuccessorsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<ApplicationInterfaceSuccessorsConnectionWhere>;
};

export type ApplicationInterfaceSuccessorsFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceSuccessorsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceSuccessorsCreateFieldInput>>;
};

export type ApplicationInterfaceSuccessorsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceSuccessorsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfaceSuccessorsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceSuccessorsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationInterfaceSuccessorsRelationship = {
  __typename?: 'ApplicationInterfaceSuccessorsRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type ApplicationInterfaceSuccessorsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<ApplicationInterfaceSuccessorsConnectionWhere>;
};

export type ApplicationInterfaceSuccessorsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceSuccessorsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceSuccessorsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfaceSuccessorsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfaceSuccessorsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfaceSuccessorsUpdateConnectionInput>;
};

export type ApplicationInterfaceTargetApplicationsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceTargetApplicationsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfaceTargetApplicationsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceTargetApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type ApplicationInterfaceTargetApplicationsConnection = {
  __typename?: 'ApplicationInterfaceTargetApplicationsConnection';
  aggregate: ApplicationInterfaceApplicationTargetApplicationsAggregateSelection;
  edges: Array<ApplicationInterfaceTargetApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfaceTargetApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfaceTargetApplicationsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceTargetApplicationsConnectionFilters = {
  /** Filter ApplicationInterfaces by aggregating results on related ApplicationInterfaceTargetApplicationsConnections */
  aggregate?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionAggregateInput>;
  /** Return ApplicationInterfaces where all of the related ApplicationInterfaceTargetApplicationsConnections match this filter */
  all?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionWhere>;
  /** Return ApplicationInterfaces where none of the related ApplicationInterfaceTargetApplicationsConnections match this filter */
  none?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionWhere>;
  /** Return ApplicationInterfaces where one of the related ApplicationInterfaceTargetApplicationsConnections match this filter */
  single?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionWhere>;
  /** Return ApplicationInterfaces where some of the related ApplicationInterfaceTargetApplicationsConnections match this filter */
  some?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionWhere>;
};

export type ApplicationInterfaceTargetApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type ApplicationInterfaceTargetApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type ApplicationInterfaceTargetApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type ApplicationInterfaceTargetApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionWhere>;
};

export type ApplicationInterfaceTargetApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionWhere>;
};

export type ApplicationInterfaceTargetApplicationsFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsCreateFieldInput>>;
};

export type ApplicationInterfaceTargetApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfaceTargetApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationInterfaceTargetApplicationsRelationship = {
  __typename?: 'ApplicationInterfaceTargetApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type ApplicationInterfaceTargetApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionWhere>;
};

export type ApplicationInterfaceTargetApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfaceTargetApplicationsUpdateConnectionInput>;
};

export type ApplicationInterfaceUpdateInput = {
  company?: InputMaybe<Array<ApplicationInterfaceCompanyUpdateFieldInput>>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  dataObjects?: InputMaybe<Array<ApplicationInterfaceDataObjectsUpdateFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<ApplicationInterfaceDepictedInDiagramsUpdateFieldInput>>;
  description?: InputMaybe<StringScalarMutations>;
  endOfLifeDate?: InputMaybe<DateScalarMutations>;
  endOfUseDate?: InputMaybe<DateScalarMutations>;
  interfaceType?: InputMaybe<InterfaceTypeEnumScalarMutations>;
  introductionDate?: InputMaybe<DateScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<ApplicationInterfaceOwnersUpdateFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationInterfacePartOfArchitecturesUpdateFieldInput>>;
  planningDate?: InputMaybe<DateScalarMutations>;
  predecessors?: InputMaybe<Array<ApplicationInterfacePredecessorsUpdateFieldInput>>;
  protocol?: InputMaybe<InterfaceProtocolEnumScalarMutations>;
  sourceApplications?: InputMaybe<Array<ApplicationInterfaceSourceApplicationsUpdateFieldInput>>;
  status?: InputMaybe<InterfaceStatusEnumScalarMutations>;
  successors?: InputMaybe<Array<ApplicationInterfaceSuccessorsUpdateFieldInput>>;
  targetApplications?: InputMaybe<Array<ApplicationInterfaceTargetApplicationsUpdateFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsUpdateFieldInput>>;
  version?: InputMaybe<StringScalarMutations>;
};

export type ApplicationInterfaceUsedByOrganisationsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceUsedByOrganisationsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfaceUsedByOrganisationsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceUsedByOrganisationsConnectFieldInput = {
  connect?: InputMaybe<Array<OrganisationConnectInput>>;
  where?: InputMaybe<OrganisationConnectWhere>;
};

export type ApplicationInterfaceUsedByOrganisationsConnection = {
  __typename?: 'ApplicationInterfaceUsedByOrganisationsConnection';
  aggregate: ApplicationInterfaceOrganisationUsedByOrganisationsAggregateSelection;
  edges: Array<ApplicationInterfaceUsedByOrganisationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfaceUsedByOrganisationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfaceUsedByOrganisationsNodeAggregationWhereInput>;
};

export type ApplicationInterfaceUsedByOrganisationsConnectionFilters = {
  /** Filter ApplicationInterfaces by aggregating results on related ApplicationInterfaceUsedByOrganisationsConnections */
  aggregate?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionAggregateInput>;
  /** Return ApplicationInterfaces where all of the related ApplicationInterfaceUsedByOrganisationsConnections match this filter */
  all?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionWhere>;
  /** Return ApplicationInterfaces where none of the related ApplicationInterfaceUsedByOrganisationsConnections match this filter */
  none?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionWhere>;
  /** Return ApplicationInterfaces where one of the related ApplicationInterfaceUsedByOrganisationsConnections match this filter */
  single?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionWhere>;
  /** Return ApplicationInterfaces where some of the related ApplicationInterfaceUsedByOrganisationsConnections match this filter */
  some?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionWhere>;
};

export type ApplicationInterfaceUsedByOrganisationsConnectionSort = {
  node?: InputMaybe<OrganisationSort>;
};

export type ApplicationInterfaceUsedByOrganisationsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsConnectionWhere>>;
  node?: InputMaybe<OrganisationWhere>;
};

export type ApplicationInterfaceUsedByOrganisationsCreateFieldInput = {
  node: OrganisationCreateInput;
};

export type ApplicationInterfaceUsedByOrganisationsDeleteFieldInput = {
  delete?: InputMaybe<OrganisationDeleteInput>;
  where?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionWhere>;
};

export type ApplicationInterfaceUsedByOrganisationsDisconnectFieldInput = {
  disconnect?: InputMaybe<OrganisationDisconnectInput>;
  where?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionWhere>;
};

export type ApplicationInterfaceUsedByOrganisationsFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsCreateFieldInput>>;
};

export type ApplicationInterfaceUsedByOrganisationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfaceUsedByOrganisationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  level?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationInterfaceUsedByOrganisationsRelationship = {
  __typename?: 'ApplicationInterfaceUsedByOrganisationsRelationship';
  cursor: Scalars['String']['output'];
  node: Organisation;
};

export type ApplicationInterfaceUsedByOrganisationsUpdateConnectionInput = {
  node?: InputMaybe<OrganisationUpdateInput>;
  where?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionWhere>;
};

export type ApplicationInterfaceUsedByOrganisationsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfaceUsedByOrganisationsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfaceUsedByOrganisationsUpdateConnectionInput>;
};

export type ApplicationInterfaceWhere = {
  AND?: InputMaybe<Array<ApplicationInterfaceWhere>>;
  NOT?: InputMaybe<ApplicationInterfaceWhere>;
  OR?: InputMaybe<Array<ApplicationInterfaceWhere>>;
  company?: InputMaybe<CompanyRelationshipFilters>;
  companyConnection?: InputMaybe<ApplicationInterfaceCompanyConnectionFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  dataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  dataObjectsConnection?: InputMaybe<ApplicationInterfaceDataObjectsConnectionFilters>;
  depictedInDiagrams?: InputMaybe<DiagramRelationshipFilters>;
  depictedInDiagramsConnection?: InputMaybe<ApplicationInterfaceDepictedInDiagramsConnectionFilters>;
  description?: InputMaybe<StringScalarFilters>;
  endOfLifeDate?: InputMaybe<DateScalarFilters>;
  endOfUseDate?: InputMaybe<DateScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  interfaceType?: InputMaybe<InterfaceTypeEnumScalarFilters>;
  introductionDate?: InputMaybe<DateScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  owners?: InputMaybe<PersonRelationshipFilters>;
  ownersConnection?: InputMaybe<ApplicationInterfaceOwnersConnectionFilters>;
  partOfArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  partOfArchitecturesConnection?: InputMaybe<ApplicationInterfacePartOfArchitecturesConnectionFilters>;
  planningDate?: InputMaybe<DateScalarFilters>;
  predecessors?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  predecessorsConnection?: InputMaybe<ApplicationInterfacePredecessorsConnectionFilters>;
  protocol?: InputMaybe<InterfaceProtocolEnumScalarFilters>;
  sourceApplications?: InputMaybe<ApplicationRelationshipFilters>;
  sourceApplicationsConnection?: InputMaybe<ApplicationInterfaceSourceApplicationsConnectionFilters>;
  status?: InputMaybe<InterfaceStatusEnumScalarFilters>;
  successors?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  successorsConnection?: InputMaybe<ApplicationInterfaceSuccessorsConnectionFilters>;
  targetApplications?: InputMaybe<ApplicationRelationshipFilters>;
  targetApplicationsConnection?: InputMaybe<ApplicationInterfaceTargetApplicationsConnectionFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
  usedByOrganisations?: InputMaybe<OrganisationRelationshipFilters>;
  usedByOrganisationsConnection?: InputMaybe<ApplicationInterfaceUsedByOrganisationsConnectionFilters>;
  version?: InputMaybe<StringScalarFilters>;
};

export type ApplicationInterfacesConnection = {
  __typename?: 'ApplicationInterfacesConnection';
  aggregate: ApplicationInterfaceAggregate;
  edges: Array<ApplicationInterfaceEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationIsDataSourceForAggregateInput = {
  AND?: InputMaybe<Array<ApplicationIsDataSourceForAggregateInput>>;
  NOT?: InputMaybe<ApplicationIsDataSourceForAggregateInput>;
  OR?: InputMaybe<Array<ApplicationIsDataSourceForAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationIsDataSourceForNodeAggregationWhereInput>;
};

export type ApplicationIsDataSourceForConnectFieldInput = {
  connect?: InputMaybe<Array<DataObjectConnectInput>>;
  where?: InputMaybe<DataObjectConnectWhere>;
};

export type ApplicationIsDataSourceForConnection = {
  __typename?: 'ApplicationIsDataSourceForConnection';
  aggregate: ApplicationDataObjectIsDataSourceForAggregateSelection;
  edges: Array<ApplicationIsDataSourceForRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationIsDataSourceForConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationIsDataSourceForConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationIsDataSourceForConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationIsDataSourceForConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationIsDataSourceForNodeAggregationWhereInput>;
};

export type ApplicationIsDataSourceForConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationIsDataSourceForConnections */
  aggregate?: InputMaybe<ApplicationIsDataSourceForConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationIsDataSourceForConnections match this filter */
  all?: InputMaybe<ApplicationIsDataSourceForConnectionWhere>;
  /** Return Applications where none of the related ApplicationIsDataSourceForConnections match this filter */
  none?: InputMaybe<ApplicationIsDataSourceForConnectionWhere>;
  /** Return Applications where one of the related ApplicationIsDataSourceForConnections match this filter */
  single?: InputMaybe<ApplicationIsDataSourceForConnectionWhere>;
  /** Return Applications where some of the related ApplicationIsDataSourceForConnections match this filter */
  some?: InputMaybe<ApplicationIsDataSourceForConnectionWhere>;
};

export type ApplicationIsDataSourceForConnectionSort = {
  node?: InputMaybe<DataObjectSort>;
};

export type ApplicationIsDataSourceForConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationIsDataSourceForConnectionWhere>>;
  NOT?: InputMaybe<ApplicationIsDataSourceForConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationIsDataSourceForConnectionWhere>>;
  node?: InputMaybe<DataObjectWhere>;
};

export type ApplicationIsDataSourceForCreateFieldInput = {
  node: DataObjectCreateInput;
};

export type ApplicationIsDataSourceForDeleteFieldInput = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<ApplicationIsDataSourceForConnectionWhere>;
};

export type ApplicationIsDataSourceForDisconnectFieldInput = {
  disconnect?: InputMaybe<DataObjectDisconnectInput>;
  where?: InputMaybe<ApplicationIsDataSourceForConnectionWhere>;
};

export type ApplicationIsDataSourceForFieldInput = {
  connect?: InputMaybe<Array<ApplicationIsDataSourceForConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationIsDataSourceForCreateFieldInput>>;
};

export type ApplicationIsDataSourceForNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationIsDataSourceForNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationIsDataSourceForNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationIsDataSourceForNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  format?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationIsDataSourceForRelationship = {
  __typename?: 'ApplicationIsDataSourceForRelationship';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type ApplicationIsDataSourceForUpdateConnectionInput = {
  node?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<ApplicationIsDataSourceForConnectionWhere>;
};

export type ApplicationIsDataSourceForUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationIsDataSourceForConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationIsDataSourceForCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationIsDataSourceForDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationIsDataSourceForDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationIsDataSourceForUpdateConnectionInput>;
};

export type ApplicationOrganisationUsedByOrganisationsAggregateSelection = {
  __typename?: 'ApplicationOrganisationUsedByOrganisationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationOrganisationUsedByOrganisationsNodeAggregateSelection>;
};

export type ApplicationOrganisationUsedByOrganisationsNodeAggregateSelection = {
  __typename?: 'ApplicationOrganisationUsedByOrganisationsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  level: IntAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationOwnersAggregateInput = {
  AND?: InputMaybe<Array<ApplicationOwnersAggregateInput>>;
  NOT?: InputMaybe<ApplicationOwnersAggregateInput>;
  OR?: InputMaybe<Array<ApplicationOwnersAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationOwnersNodeAggregationWhereInput>;
};

export type ApplicationOwnersConnectFieldInput = {
  connect?: InputMaybe<Array<PersonConnectInput>>;
  where?: InputMaybe<PersonConnectWhere>;
};

export type ApplicationOwnersConnection = {
  __typename?: 'ApplicationOwnersConnection';
  aggregate: ApplicationPersonOwnersAggregateSelection;
  edges: Array<ApplicationOwnersRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationOwnersConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationOwnersConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationOwnersConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationOwnersConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationOwnersNodeAggregationWhereInput>;
};

export type ApplicationOwnersConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationOwnersConnections */
  aggregate?: InputMaybe<ApplicationOwnersConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationOwnersConnections match this filter */
  all?: InputMaybe<ApplicationOwnersConnectionWhere>;
  /** Return Applications where none of the related ApplicationOwnersConnections match this filter */
  none?: InputMaybe<ApplicationOwnersConnectionWhere>;
  /** Return Applications where one of the related ApplicationOwnersConnections match this filter */
  single?: InputMaybe<ApplicationOwnersConnectionWhere>;
  /** Return Applications where some of the related ApplicationOwnersConnections match this filter */
  some?: InputMaybe<ApplicationOwnersConnectionWhere>;
};

export type ApplicationOwnersConnectionSort = {
  node?: InputMaybe<PersonSort>;
};

export type ApplicationOwnersConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationOwnersConnectionWhere>>;
  NOT?: InputMaybe<ApplicationOwnersConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationOwnersConnectionWhere>>;
  node?: InputMaybe<PersonWhere>;
};

export type ApplicationOwnersCreateFieldInput = {
  node: PersonCreateInput;
};

export type ApplicationOwnersDeleteFieldInput = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<ApplicationOwnersConnectionWhere>;
};

export type ApplicationOwnersDisconnectFieldInput = {
  disconnect?: InputMaybe<PersonDisconnectInput>;
  where?: InputMaybe<ApplicationOwnersConnectionWhere>;
};

export type ApplicationOwnersFieldInput = {
  connect?: InputMaybe<Array<ApplicationOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationOwnersCreateFieldInput>>;
};

export type ApplicationOwnersNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationOwnersNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationOwnersNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationOwnersNodeAggregationWhereInput>>;
  avatarUrl?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  department?: InputMaybe<StringScalarAggregationFilters>;
  email?: InputMaybe<StringScalarAggregationFilters>;
  firstName?: InputMaybe<StringScalarAggregationFilters>;
  lastName?: InputMaybe<StringScalarAggregationFilters>;
  phone?: InputMaybe<StringScalarAggregationFilters>;
  role?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationOwnersRelationship = {
  __typename?: 'ApplicationOwnersRelationship';
  cursor: Scalars['String']['output'];
  node: Person;
};

export type ApplicationOwnersUpdateConnectionInput = {
  node?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<ApplicationOwnersConnectionWhere>;
};

export type ApplicationOwnersUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationOwnersCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationOwnersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationOwnersDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationOwnersUpdateConnectionInput>;
};

export type ApplicationParentsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationParentsAggregateInput>>;
  NOT?: InputMaybe<ApplicationParentsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationParentsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationParentsNodeAggregationWhereInput>;
};

export type ApplicationParentsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type ApplicationParentsConnection = {
  __typename?: 'ApplicationParentsConnection';
  aggregate: ApplicationApplicationParentsAggregateSelection;
  edges: Array<ApplicationParentsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationParentsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationParentsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationParentsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationParentsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationParentsNodeAggregationWhereInput>;
};

export type ApplicationParentsConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationParentsConnections */
  aggregate?: InputMaybe<ApplicationParentsConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationParentsConnections match this filter */
  all?: InputMaybe<ApplicationParentsConnectionWhere>;
  /** Return Applications where none of the related ApplicationParentsConnections match this filter */
  none?: InputMaybe<ApplicationParentsConnectionWhere>;
  /** Return Applications where one of the related ApplicationParentsConnections match this filter */
  single?: InputMaybe<ApplicationParentsConnectionWhere>;
  /** Return Applications where some of the related ApplicationParentsConnections match this filter */
  some?: InputMaybe<ApplicationParentsConnectionWhere>;
};

export type ApplicationParentsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type ApplicationParentsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationParentsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationParentsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationParentsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type ApplicationParentsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type ApplicationParentsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<ApplicationParentsConnectionWhere>;
};

export type ApplicationParentsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<ApplicationParentsConnectionWhere>;
};

export type ApplicationParentsFieldInput = {
  connect?: InputMaybe<Array<ApplicationParentsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationParentsCreateFieldInput>>;
};

export type ApplicationParentsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationParentsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationParentsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationParentsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationParentsRelationship = {
  __typename?: 'ApplicationParentsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type ApplicationParentsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<ApplicationParentsConnectionWhere>;
};

export type ApplicationParentsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationParentsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationParentsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationParentsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationParentsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationParentsUpdateConnectionInput>;
};

export type ApplicationPartOfArchitecturesAggregateInput = {
  AND?: InputMaybe<Array<ApplicationPartOfArchitecturesAggregateInput>>;
  NOT?: InputMaybe<ApplicationPartOfArchitecturesAggregateInput>;
  OR?: InputMaybe<Array<ApplicationPartOfArchitecturesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationPartOfArchitecturesNodeAggregationWhereInput>;
};

export type ApplicationPartOfArchitecturesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type ApplicationPartOfArchitecturesConnection = {
  __typename?: 'ApplicationPartOfArchitecturesConnection';
  aggregate: ApplicationArchitecturePartOfArchitecturesAggregateSelection;
  edges: Array<ApplicationPartOfArchitecturesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationPartOfArchitecturesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationPartOfArchitecturesConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationPartOfArchitecturesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationPartOfArchitecturesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationPartOfArchitecturesNodeAggregationWhereInput>;
};

export type ApplicationPartOfArchitecturesConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationPartOfArchitecturesConnections */
  aggregate?: InputMaybe<ApplicationPartOfArchitecturesConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationPartOfArchitecturesConnections match this filter */
  all?: InputMaybe<ApplicationPartOfArchitecturesConnectionWhere>;
  /** Return Applications where none of the related ApplicationPartOfArchitecturesConnections match this filter */
  none?: InputMaybe<ApplicationPartOfArchitecturesConnectionWhere>;
  /** Return Applications where one of the related ApplicationPartOfArchitecturesConnections match this filter */
  single?: InputMaybe<ApplicationPartOfArchitecturesConnectionWhere>;
  /** Return Applications where some of the related ApplicationPartOfArchitecturesConnections match this filter */
  some?: InputMaybe<ApplicationPartOfArchitecturesConnectionWhere>;
};

export type ApplicationPartOfArchitecturesConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type ApplicationPartOfArchitecturesConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationPartOfArchitecturesConnectionWhere>>;
  NOT?: InputMaybe<ApplicationPartOfArchitecturesConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationPartOfArchitecturesConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type ApplicationPartOfArchitecturesCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type ApplicationPartOfArchitecturesDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<ApplicationPartOfArchitecturesConnectionWhere>;
};

export type ApplicationPartOfArchitecturesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<ApplicationPartOfArchitecturesConnectionWhere>;
};

export type ApplicationPartOfArchitecturesFieldInput = {
  connect?: InputMaybe<Array<ApplicationPartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationPartOfArchitecturesCreateFieldInput>>;
};

export type ApplicationPartOfArchitecturesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationPartOfArchitecturesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationPartOfArchitecturesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationPartOfArchitecturesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationPartOfArchitecturesRelationship = {
  __typename?: 'ApplicationPartOfArchitecturesRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type ApplicationPartOfArchitecturesUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<ApplicationPartOfArchitecturesConnectionWhere>;
};

export type ApplicationPartOfArchitecturesUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationPartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationPartOfArchitecturesCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationPartOfArchitecturesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationPartOfArchitecturesDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationPartOfArchitecturesUpdateConnectionInput>;
};

export type ApplicationPersonOwnersAggregateSelection = {
  __typename?: 'ApplicationPersonOwnersAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationPersonOwnersNodeAggregateSelection>;
};

export type ApplicationPersonOwnersNodeAggregateSelection = {
  __typename?: 'ApplicationPersonOwnersNodeAggregateSelection';
  avatarUrl: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationPredecessorsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationPredecessorsAggregateInput>>;
  NOT?: InputMaybe<ApplicationPredecessorsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationPredecessorsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationPredecessorsNodeAggregationWhereInput>;
};

export type ApplicationPredecessorsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type ApplicationPredecessorsConnection = {
  __typename?: 'ApplicationPredecessorsConnection';
  aggregate: ApplicationApplicationPredecessorsAggregateSelection;
  edges: Array<ApplicationPredecessorsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationPredecessorsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationPredecessorsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationPredecessorsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationPredecessorsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationPredecessorsNodeAggregationWhereInput>;
};

export type ApplicationPredecessorsConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationPredecessorsConnections */
  aggregate?: InputMaybe<ApplicationPredecessorsConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationPredecessorsConnections match this filter */
  all?: InputMaybe<ApplicationPredecessorsConnectionWhere>;
  /** Return Applications where none of the related ApplicationPredecessorsConnections match this filter */
  none?: InputMaybe<ApplicationPredecessorsConnectionWhere>;
  /** Return Applications where one of the related ApplicationPredecessorsConnections match this filter */
  single?: InputMaybe<ApplicationPredecessorsConnectionWhere>;
  /** Return Applications where some of the related ApplicationPredecessorsConnections match this filter */
  some?: InputMaybe<ApplicationPredecessorsConnectionWhere>;
};

export type ApplicationPredecessorsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type ApplicationPredecessorsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationPredecessorsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationPredecessorsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationPredecessorsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type ApplicationPredecessorsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type ApplicationPredecessorsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<ApplicationPredecessorsConnectionWhere>;
};

export type ApplicationPredecessorsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<ApplicationPredecessorsConnectionWhere>;
};

export type ApplicationPredecessorsFieldInput = {
  connect?: InputMaybe<Array<ApplicationPredecessorsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationPredecessorsCreateFieldInput>>;
};

export type ApplicationPredecessorsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationPredecessorsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationPredecessorsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationPredecessorsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationPredecessorsRelationship = {
  __typename?: 'ApplicationPredecessorsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type ApplicationPredecessorsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<ApplicationPredecessorsConnectionWhere>;
};

export type ApplicationPredecessorsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationPredecessorsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationPredecessorsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationPredecessorsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationPredecessorsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationPredecessorsUpdateConnectionInput>;
};

export type ApplicationRelationshipFilters = {
  /** Filter type where all of the related Applications match this filter */
  all?: InputMaybe<ApplicationWhere>;
  /** Filter type where none of the related Applications match this filter */
  none?: InputMaybe<ApplicationWhere>;
  /** Filter type where one of the related Applications match this filter */
  single?: InputMaybe<ApplicationWhere>;
  /** Filter type where some of the related Applications match this filter */
  some?: InputMaybe<ApplicationWhere>;
};

/** Fields to sort Applications by. The order in which sorts are applied is not guaranteed when specifying many fields in one ApplicationSort object. */
export type ApplicationSort = {
  costs?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  criticality?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  endOfLifeDate?: InputMaybe<SortDirection>;
  endOfUseDate?: InputMaybe<SortDirection>;
  hostingEnvironment?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  introductionDate?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  planningDate?: InputMaybe<SortDirection>;
  sevenRStrategy?: InputMaybe<SortDirection>;
  status?: InputMaybe<SortDirection>;
  timeCategory?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
  vendor?: InputMaybe<SortDirection>;
  version?: InputMaybe<SortDirection>;
};

export type ApplicationSourceOfInterfacesAggregateInput = {
  AND?: InputMaybe<Array<ApplicationSourceOfInterfacesAggregateInput>>;
  NOT?: InputMaybe<ApplicationSourceOfInterfacesAggregateInput>;
  OR?: InputMaybe<Array<ApplicationSourceOfInterfacesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationSourceOfInterfacesNodeAggregationWhereInput>;
};

export type ApplicationSourceOfInterfacesConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type ApplicationSourceOfInterfacesConnection = {
  __typename?: 'ApplicationSourceOfInterfacesConnection';
  aggregate: ApplicationApplicationInterfaceSourceOfInterfacesAggregateSelection;
  edges: Array<ApplicationSourceOfInterfacesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationSourceOfInterfacesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationSourceOfInterfacesConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationSourceOfInterfacesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationSourceOfInterfacesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationSourceOfInterfacesNodeAggregationWhereInput>;
};

export type ApplicationSourceOfInterfacesConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationSourceOfInterfacesConnections */
  aggregate?: InputMaybe<ApplicationSourceOfInterfacesConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationSourceOfInterfacesConnections match this filter */
  all?: InputMaybe<ApplicationSourceOfInterfacesConnectionWhere>;
  /** Return Applications where none of the related ApplicationSourceOfInterfacesConnections match this filter */
  none?: InputMaybe<ApplicationSourceOfInterfacesConnectionWhere>;
  /** Return Applications where one of the related ApplicationSourceOfInterfacesConnections match this filter */
  single?: InputMaybe<ApplicationSourceOfInterfacesConnectionWhere>;
  /** Return Applications where some of the related ApplicationSourceOfInterfacesConnections match this filter */
  some?: InputMaybe<ApplicationSourceOfInterfacesConnectionWhere>;
};

export type ApplicationSourceOfInterfacesConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type ApplicationSourceOfInterfacesConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationSourceOfInterfacesConnectionWhere>>;
  NOT?: InputMaybe<ApplicationSourceOfInterfacesConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationSourceOfInterfacesConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type ApplicationSourceOfInterfacesCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type ApplicationSourceOfInterfacesDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<ApplicationSourceOfInterfacesConnectionWhere>;
};

export type ApplicationSourceOfInterfacesDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<ApplicationSourceOfInterfacesConnectionWhere>;
};

export type ApplicationSourceOfInterfacesFieldInput = {
  connect?: InputMaybe<Array<ApplicationSourceOfInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationSourceOfInterfacesCreateFieldInput>>;
};

export type ApplicationSourceOfInterfacesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationSourceOfInterfacesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationSourceOfInterfacesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationSourceOfInterfacesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationSourceOfInterfacesRelationship = {
  __typename?: 'ApplicationSourceOfInterfacesRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type ApplicationSourceOfInterfacesUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<ApplicationSourceOfInterfacesConnectionWhere>;
};

export type ApplicationSourceOfInterfacesUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationSourceOfInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationSourceOfInterfacesCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationSourceOfInterfacesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationSourceOfInterfacesDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationSourceOfInterfacesUpdateConnectionInput>;
};

/** Mögliche Status-Werte für eine Applikation */
export enum ApplicationStatus {
  ACTIVE = 'ACTIVE',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  RETIRED = 'RETIRED'
}

/** ApplicationStatus filters */
export type ApplicationStatusEnumScalarFilters = {
  eq?: InputMaybe<ApplicationStatus>;
  in?: InputMaybe<Array<ApplicationStatus>>;
};

/** ApplicationStatus mutations */
export type ApplicationStatusEnumScalarMutations = {
  set?: InputMaybe<ApplicationStatus>;
};

export type ApplicationSuccessorsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationSuccessorsAggregateInput>>;
  NOT?: InputMaybe<ApplicationSuccessorsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationSuccessorsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationSuccessorsNodeAggregationWhereInput>;
};

export type ApplicationSuccessorsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type ApplicationSuccessorsConnection = {
  __typename?: 'ApplicationSuccessorsConnection';
  aggregate: ApplicationApplicationSuccessorsAggregateSelection;
  edges: Array<ApplicationSuccessorsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationSuccessorsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationSuccessorsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationSuccessorsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationSuccessorsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationSuccessorsNodeAggregationWhereInput>;
};

export type ApplicationSuccessorsConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationSuccessorsConnections */
  aggregate?: InputMaybe<ApplicationSuccessorsConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationSuccessorsConnections match this filter */
  all?: InputMaybe<ApplicationSuccessorsConnectionWhere>;
  /** Return Applications where none of the related ApplicationSuccessorsConnections match this filter */
  none?: InputMaybe<ApplicationSuccessorsConnectionWhere>;
  /** Return Applications where one of the related ApplicationSuccessorsConnections match this filter */
  single?: InputMaybe<ApplicationSuccessorsConnectionWhere>;
  /** Return Applications where some of the related ApplicationSuccessorsConnections match this filter */
  some?: InputMaybe<ApplicationSuccessorsConnectionWhere>;
};

export type ApplicationSuccessorsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type ApplicationSuccessorsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationSuccessorsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationSuccessorsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationSuccessorsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type ApplicationSuccessorsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type ApplicationSuccessorsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<ApplicationSuccessorsConnectionWhere>;
};

export type ApplicationSuccessorsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<ApplicationSuccessorsConnectionWhere>;
};

export type ApplicationSuccessorsFieldInput = {
  connect?: InputMaybe<Array<ApplicationSuccessorsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationSuccessorsCreateFieldInput>>;
};

export type ApplicationSuccessorsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationSuccessorsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationSuccessorsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationSuccessorsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationSuccessorsRelationship = {
  __typename?: 'ApplicationSuccessorsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type ApplicationSuccessorsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<ApplicationSuccessorsConnectionWhere>;
};

export type ApplicationSuccessorsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationSuccessorsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationSuccessorsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationSuccessorsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationSuccessorsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationSuccessorsUpdateConnectionInput>;
};

export type ApplicationSupportsCapabilitiesAggregateInput = {
  AND?: InputMaybe<Array<ApplicationSupportsCapabilitiesAggregateInput>>;
  NOT?: InputMaybe<ApplicationSupportsCapabilitiesAggregateInput>;
  OR?: InputMaybe<Array<ApplicationSupportsCapabilitiesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationSupportsCapabilitiesNodeAggregationWhereInput>;
};

export type ApplicationSupportsCapabilitiesConnectFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityConnectInput>>;
  where?: InputMaybe<BusinessCapabilityConnectWhere>;
};

export type ApplicationSupportsCapabilitiesConnection = {
  __typename?: 'ApplicationSupportsCapabilitiesConnection';
  aggregate: ApplicationBusinessCapabilitySupportsCapabilitiesAggregateSelection;
  edges: Array<ApplicationSupportsCapabilitiesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationSupportsCapabilitiesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationSupportsCapabilitiesConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationSupportsCapabilitiesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationSupportsCapabilitiesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationSupportsCapabilitiesNodeAggregationWhereInput>;
};

export type ApplicationSupportsCapabilitiesConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationSupportsCapabilitiesConnections */
  aggregate?: InputMaybe<ApplicationSupportsCapabilitiesConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationSupportsCapabilitiesConnections match this filter */
  all?: InputMaybe<ApplicationSupportsCapabilitiesConnectionWhere>;
  /** Return Applications where none of the related ApplicationSupportsCapabilitiesConnections match this filter */
  none?: InputMaybe<ApplicationSupportsCapabilitiesConnectionWhere>;
  /** Return Applications where one of the related ApplicationSupportsCapabilitiesConnections match this filter */
  single?: InputMaybe<ApplicationSupportsCapabilitiesConnectionWhere>;
  /** Return Applications where some of the related ApplicationSupportsCapabilitiesConnections match this filter */
  some?: InputMaybe<ApplicationSupportsCapabilitiesConnectionWhere>;
};

export type ApplicationSupportsCapabilitiesConnectionSort = {
  node?: InputMaybe<BusinessCapabilitySort>;
};

export type ApplicationSupportsCapabilitiesConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationSupportsCapabilitiesConnectionWhere>>;
  NOT?: InputMaybe<ApplicationSupportsCapabilitiesConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationSupportsCapabilitiesConnectionWhere>>;
  node?: InputMaybe<BusinessCapabilityWhere>;
};

export type ApplicationSupportsCapabilitiesCreateFieldInput = {
  node: BusinessCapabilityCreateInput;
};

export type ApplicationSupportsCapabilitiesDeleteFieldInput = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<ApplicationSupportsCapabilitiesConnectionWhere>;
};

export type ApplicationSupportsCapabilitiesDisconnectFieldInput = {
  disconnect?: InputMaybe<BusinessCapabilityDisconnectInput>;
  where?: InputMaybe<ApplicationSupportsCapabilitiesConnectionWhere>;
};

export type ApplicationSupportsCapabilitiesFieldInput = {
  connect?: InputMaybe<Array<ApplicationSupportsCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationSupportsCapabilitiesCreateFieldInput>>;
};

export type ApplicationSupportsCapabilitiesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationSupportsCapabilitiesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationSupportsCapabilitiesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationSupportsCapabilitiesNodeAggregationWhereInput>>;
  businessValue?: InputMaybe<IntScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  maturityLevel?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  sequenceNumber?: InputMaybe<IntScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationSupportsCapabilitiesRelationship = {
  __typename?: 'ApplicationSupportsCapabilitiesRelationship';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type ApplicationSupportsCapabilitiesUpdateConnectionInput = {
  node?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<ApplicationSupportsCapabilitiesConnectionWhere>;
};

export type ApplicationSupportsCapabilitiesUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationSupportsCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationSupportsCapabilitiesCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationSupportsCapabilitiesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationSupportsCapabilitiesDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationSupportsCapabilitiesUpdateConnectionInput>;
};

export type ApplicationTargetOfInterfacesAggregateInput = {
  AND?: InputMaybe<Array<ApplicationTargetOfInterfacesAggregateInput>>;
  NOT?: InputMaybe<ApplicationTargetOfInterfacesAggregateInput>;
  OR?: InputMaybe<Array<ApplicationTargetOfInterfacesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationTargetOfInterfacesNodeAggregationWhereInput>;
};

export type ApplicationTargetOfInterfacesConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type ApplicationTargetOfInterfacesConnection = {
  __typename?: 'ApplicationTargetOfInterfacesConnection';
  aggregate: ApplicationApplicationInterfaceTargetOfInterfacesAggregateSelection;
  edges: Array<ApplicationTargetOfInterfacesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationTargetOfInterfacesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationTargetOfInterfacesConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationTargetOfInterfacesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationTargetOfInterfacesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationTargetOfInterfacesNodeAggregationWhereInput>;
};

export type ApplicationTargetOfInterfacesConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationTargetOfInterfacesConnections */
  aggregate?: InputMaybe<ApplicationTargetOfInterfacesConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationTargetOfInterfacesConnections match this filter */
  all?: InputMaybe<ApplicationTargetOfInterfacesConnectionWhere>;
  /** Return Applications where none of the related ApplicationTargetOfInterfacesConnections match this filter */
  none?: InputMaybe<ApplicationTargetOfInterfacesConnectionWhere>;
  /** Return Applications where one of the related ApplicationTargetOfInterfacesConnections match this filter */
  single?: InputMaybe<ApplicationTargetOfInterfacesConnectionWhere>;
  /** Return Applications where some of the related ApplicationTargetOfInterfacesConnections match this filter */
  some?: InputMaybe<ApplicationTargetOfInterfacesConnectionWhere>;
};

export type ApplicationTargetOfInterfacesConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type ApplicationTargetOfInterfacesConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationTargetOfInterfacesConnectionWhere>>;
  NOT?: InputMaybe<ApplicationTargetOfInterfacesConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationTargetOfInterfacesConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type ApplicationTargetOfInterfacesCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type ApplicationTargetOfInterfacesDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<ApplicationTargetOfInterfacesConnectionWhere>;
};

export type ApplicationTargetOfInterfacesDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<ApplicationTargetOfInterfacesConnectionWhere>;
};

export type ApplicationTargetOfInterfacesFieldInput = {
  connect?: InputMaybe<Array<ApplicationTargetOfInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationTargetOfInterfacesCreateFieldInput>>;
};

export type ApplicationTargetOfInterfacesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationTargetOfInterfacesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationTargetOfInterfacesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationTargetOfInterfacesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationTargetOfInterfacesRelationship = {
  __typename?: 'ApplicationTargetOfInterfacesRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type ApplicationTargetOfInterfacesUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<ApplicationTargetOfInterfacesConnectionWhere>;
};

export type ApplicationTargetOfInterfacesUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationTargetOfInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationTargetOfInterfacesCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationTargetOfInterfacesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationTargetOfInterfacesDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationTargetOfInterfacesUpdateConnectionInput>;
};

export type ApplicationUpdateInput = {
  company?: InputMaybe<Array<ApplicationCompanyUpdateFieldInput>>;
  components?: InputMaybe<Array<ApplicationComponentsUpdateFieldInput>>;
  costs?: InputMaybe<FloatScalarMutations>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  criticality?: InputMaybe<CriticalityLevelEnumScalarMutations>;
  depictedInDiagrams?: InputMaybe<Array<ApplicationDepictedInDiagramsUpdateFieldInput>>;
  description?: InputMaybe<StringScalarMutations>;
  endOfLifeDate?: InputMaybe<DateScalarMutations>;
  endOfUseDate?: InputMaybe<DateScalarMutations>;
  hostedOn?: InputMaybe<Array<ApplicationHostedOnUpdateFieldInput>>;
  hostingEnvironment?: InputMaybe<StringScalarMutations>;
  implementsPrinciples?: InputMaybe<Array<ApplicationImplementsPrinciplesUpdateFieldInput>>;
  introductionDate?: InputMaybe<DateScalarMutations>;
  isDataSourceFor?: InputMaybe<Array<ApplicationIsDataSourceForUpdateFieldInput>>;
  name?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<ApplicationOwnersUpdateFieldInput>>;
  parents?: InputMaybe<Array<ApplicationParentsUpdateFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationPartOfArchitecturesUpdateFieldInput>>;
  planningDate?: InputMaybe<DateScalarMutations>;
  predecessors?: InputMaybe<Array<ApplicationPredecessorsUpdateFieldInput>>;
  sevenRStrategy?: InputMaybe<SevenRStrategyEnumScalarMutations>;
  sourceOfInterfaces?: InputMaybe<Array<ApplicationSourceOfInterfacesUpdateFieldInput>>;
  status?: InputMaybe<ApplicationStatusEnumScalarMutations>;
  successors?: InputMaybe<Array<ApplicationSuccessorsUpdateFieldInput>>;
  supportsCapabilities?: InputMaybe<Array<ApplicationSupportsCapabilitiesUpdateFieldInput>>;
  targetOfInterfaces?: InputMaybe<Array<ApplicationTargetOfInterfacesUpdateFieldInput>>;
  technologyStack?: InputMaybe<ListStringMutations>;
  timeCategory?: InputMaybe<TimeCategoryEnumScalarMutations>;
  usedByOrganisations?: InputMaybe<Array<ApplicationUsedByOrganisationsUpdateFieldInput>>;
  usesAIAssets?: InputMaybe<Array<ApplicationUsesAiAssetsUpdateFieldInput>>;
  usesDataObjects?: InputMaybe<Array<ApplicationUsesDataObjectsUpdateFieldInput>>;
  vendor?: InputMaybe<StringScalarMutations>;
  version?: InputMaybe<StringScalarMutations>;
};

export type ApplicationUsedByOrganisationsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationUsedByOrganisationsAggregateInput>>;
  NOT?: InputMaybe<ApplicationUsedByOrganisationsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationUsedByOrganisationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationUsedByOrganisationsNodeAggregationWhereInput>;
};

export type ApplicationUsedByOrganisationsConnectFieldInput = {
  connect?: InputMaybe<Array<OrganisationConnectInput>>;
  where?: InputMaybe<OrganisationConnectWhere>;
};

export type ApplicationUsedByOrganisationsConnection = {
  __typename?: 'ApplicationUsedByOrganisationsConnection';
  aggregate: ApplicationOrganisationUsedByOrganisationsAggregateSelection;
  edges: Array<ApplicationUsedByOrganisationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationUsedByOrganisationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationUsedByOrganisationsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationUsedByOrganisationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationUsedByOrganisationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationUsedByOrganisationsNodeAggregationWhereInput>;
};

export type ApplicationUsedByOrganisationsConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationUsedByOrganisationsConnections */
  aggregate?: InputMaybe<ApplicationUsedByOrganisationsConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationUsedByOrganisationsConnections match this filter */
  all?: InputMaybe<ApplicationUsedByOrganisationsConnectionWhere>;
  /** Return Applications where none of the related ApplicationUsedByOrganisationsConnections match this filter */
  none?: InputMaybe<ApplicationUsedByOrganisationsConnectionWhere>;
  /** Return Applications where one of the related ApplicationUsedByOrganisationsConnections match this filter */
  single?: InputMaybe<ApplicationUsedByOrganisationsConnectionWhere>;
  /** Return Applications where some of the related ApplicationUsedByOrganisationsConnections match this filter */
  some?: InputMaybe<ApplicationUsedByOrganisationsConnectionWhere>;
};

export type ApplicationUsedByOrganisationsConnectionSort = {
  node?: InputMaybe<OrganisationSort>;
};

export type ApplicationUsedByOrganisationsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationUsedByOrganisationsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationUsedByOrganisationsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationUsedByOrganisationsConnectionWhere>>;
  node?: InputMaybe<OrganisationWhere>;
};

export type ApplicationUsedByOrganisationsCreateFieldInput = {
  node: OrganisationCreateInput;
};

export type ApplicationUsedByOrganisationsDeleteFieldInput = {
  delete?: InputMaybe<OrganisationDeleteInput>;
  where?: InputMaybe<ApplicationUsedByOrganisationsConnectionWhere>;
};

export type ApplicationUsedByOrganisationsDisconnectFieldInput = {
  disconnect?: InputMaybe<OrganisationDisconnectInput>;
  where?: InputMaybe<ApplicationUsedByOrganisationsConnectionWhere>;
};

export type ApplicationUsedByOrganisationsFieldInput = {
  connect?: InputMaybe<Array<ApplicationUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationUsedByOrganisationsCreateFieldInput>>;
};

export type ApplicationUsedByOrganisationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationUsedByOrganisationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationUsedByOrganisationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationUsedByOrganisationsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  level?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationUsedByOrganisationsRelationship = {
  __typename?: 'ApplicationUsedByOrganisationsRelationship';
  cursor: Scalars['String']['output'];
  node: Organisation;
};

export type ApplicationUsedByOrganisationsUpdateConnectionInput = {
  node?: InputMaybe<OrganisationUpdateInput>;
  where?: InputMaybe<ApplicationUsedByOrganisationsConnectionWhere>;
};

export type ApplicationUsedByOrganisationsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationUsedByOrganisationsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationUsedByOrganisationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationUsedByOrganisationsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationUsedByOrganisationsUpdateConnectionInput>;
};

export type ApplicationUsesAiAssetsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationUsesAiAssetsAggregateInput>>;
  NOT?: InputMaybe<ApplicationUsesAiAssetsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationUsesAiAssetsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationUsesAiAssetsNodeAggregationWhereInput>;
};

export type ApplicationUsesAiAssetsConnectFieldInput = {
  connect?: InputMaybe<Array<AiAssetConnectInput>>;
  where?: InputMaybe<AiAssetConnectWhere>;
};

export type ApplicationUsesAiAssetsConnection = {
  __typename?: 'ApplicationUsesAIAssetsConnection';
  aggregate: ApplicationAiAssetUsesAiAssetsAggregateSelection;
  edges: Array<ApplicationUsesAiAssetsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationUsesAiAssetsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationUsesAiAssetsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationUsesAiAssetsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationUsesAiAssetsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationUsesAiAssetsNodeAggregationWhereInput>;
};

export type ApplicationUsesAiAssetsConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationUsesAIAssetsConnections */
  aggregate?: InputMaybe<ApplicationUsesAiAssetsConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationUsesAIAssetsConnections match this filter */
  all?: InputMaybe<ApplicationUsesAiAssetsConnectionWhere>;
  /** Return Applications where none of the related ApplicationUsesAIAssetsConnections match this filter */
  none?: InputMaybe<ApplicationUsesAiAssetsConnectionWhere>;
  /** Return Applications where one of the related ApplicationUsesAIAssetsConnections match this filter */
  single?: InputMaybe<ApplicationUsesAiAssetsConnectionWhere>;
  /** Return Applications where some of the related ApplicationUsesAIAssetsConnections match this filter */
  some?: InputMaybe<ApplicationUsesAiAssetsConnectionWhere>;
};

export type ApplicationUsesAiAssetsConnectionSort = {
  node?: InputMaybe<AiAssetSort>;
};

export type ApplicationUsesAiAssetsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationUsesAiAssetsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationUsesAiAssetsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationUsesAiAssetsConnectionWhere>>;
  node?: InputMaybe<AiAssetWhere>;
};

export type ApplicationUsesAiAssetsCreateFieldInput = {
  node: AiAssetCreateInput;
};

export type ApplicationUsesAiAssetsDeleteFieldInput = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<ApplicationUsesAiAssetsConnectionWhere>;
};

export type ApplicationUsesAiAssetsDisconnectFieldInput = {
  disconnect?: InputMaybe<AiAssetDisconnectInput>;
  where?: InputMaybe<ApplicationUsesAiAssetsConnectionWhere>;
};

export type ApplicationUsesAiAssetsFieldInput = {
  connect?: InputMaybe<Array<ApplicationUsesAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationUsesAiAssetsCreateFieldInput>>;
};

export type ApplicationUsesAiAssetsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationUsesAiAssetsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationUsesAiAssetsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationUsesAiAssetsNodeAggregationWhereInput>>;
  accuracy?: InputMaybe<FloatScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  license?: InputMaybe<StringScalarAggregationFilters>;
  model?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  provider?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ApplicationUsesAiAssetsRelationship = {
  __typename?: 'ApplicationUsesAIAssetsRelationship';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type ApplicationUsesAiAssetsUpdateConnectionInput = {
  node?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<ApplicationUsesAiAssetsConnectionWhere>;
};

export type ApplicationUsesAiAssetsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationUsesAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationUsesAiAssetsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationUsesAiAssetsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationUsesAiAssetsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationUsesAiAssetsUpdateConnectionInput>;
};

export type ApplicationUsesDataObjectsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationUsesDataObjectsAggregateInput>>;
  NOT?: InputMaybe<ApplicationUsesDataObjectsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationUsesDataObjectsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationUsesDataObjectsNodeAggregationWhereInput>;
};

export type ApplicationUsesDataObjectsConnectFieldInput = {
  connect?: InputMaybe<Array<DataObjectConnectInput>>;
  where?: InputMaybe<DataObjectConnectWhere>;
};

export type ApplicationUsesDataObjectsConnection = {
  __typename?: 'ApplicationUsesDataObjectsConnection';
  aggregate: ApplicationDataObjectUsesDataObjectsAggregateSelection;
  edges: Array<ApplicationUsesDataObjectsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationUsesDataObjectsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationUsesDataObjectsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationUsesDataObjectsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationUsesDataObjectsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationUsesDataObjectsNodeAggregationWhereInput>;
};

export type ApplicationUsesDataObjectsConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationUsesDataObjectsConnections */
  aggregate?: InputMaybe<ApplicationUsesDataObjectsConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationUsesDataObjectsConnections match this filter */
  all?: InputMaybe<ApplicationUsesDataObjectsConnectionWhere>;
  /** Return Applications where none of the related ApplicationUsesDataObjectsConnections match this filter */
  none?: InputMaybe<ApplicationUsesDataObjectsConnectionWhere>;
  /** Return Applications where one of the related ApplicationUsesDataObjectsConnections match this filter */
  single?: InputMaybe<ApplicationUsesDataObjectsConnectionWhere>;
  /** Return Applications where some of the related ApplicationUsesDataObjectsConnections match this filter */
  some?: InputMaybe<ApplicationUsesDataObjectsConnectionWhere>;
};

export type ApplicationUsesDataObjectsConnectionSort = {
  node?: InputMaybe<DataObjectSort>;
};

export type ApplicationUsesDataObjectsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationUsesDataObjectsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationUsesDataObjectsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationUsesDataObjectsConnectionWhere>>;
  node?: InputMaybe<DataObjectWhere>;
};

export type ApplicationUsesDataObjectsCreateFieldInput = {
  node: DataObjectCreateInput;
};

export type ApplicationUsesDataObjectsDeleteFieldInput = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<ApplicationUsesDataObjectsConnectionWhere>;
};

export type ApplicationUsesDataObjectsDisconnectFieldInput = {
  disconnect?: InputMaybe<DataObjectDisconnectInput>;
  where?: InputMaybe<ApplicationUsesDataObjectsConnectionWhere>;
};

export type ApplicationUsesDataObjectsFieldInput = {
  connect?: InputMaybe<Array<ApplicationUsesDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationUsesDataObjectsCreateFieldInput>>;
};

export type ApplicationUsesDataObjectsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationUsesDataObjectsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationUsesDataObjectsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationUsesDataObjectsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  format?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationUsesDataObjectsRelationship = {
  __typename?: 'ApplicationUsesDataObjectsRelationship';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type ApplicationUsesDataObjectsUpdateConnectionInput = {
  node?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<ApplicationUsesDataObjectsConnectionWhere>;
};

export type ApplicationUsesDataObjectsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationUsesDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationUsesDataObjectsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationUsesDataObjectsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationUsesDataObjectsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationUsesDataObjectsUpdateConnectionInput>;
};

export type ApplicationWhere = {
  AND?: InputMaybe<Array<ApplicationWhere>>;
  NOT?: InputMaybe<ApplicationWhere>;
  OR?: InputMaybe<Array<ApplicationWhere>>;
  company?: InputMaybe<CompanyRelationshipFilters>;
  companyConnection?: InputMaybe<ApplicationCompanyConnectionFilters>;
  components?: InputMaybe<ApplicationRelationshipFilters>;
  componentsConnection?: InputMaybe<ApplicationComponentsConnectionFilters>;
  costs?: InputMaybe<FloatScalarFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  criticality?: InputMaybe<CriticalityLevelEnumScalarFilters>;
  depictedInDiagrams?: InputMaybe<DiagramRelationshipFilters>;
  depictedInDiagramsConnection?: InputMaybe<ApplicationDepictedInDiagramsConnectionFilters>;
  description?: InputMaybe<StringScalarFilters>;
  endOfLifeDate?: InputMaybe<DateScalarFilters>;
  endOfUseDate?: InputMaybe<DateScalarFilters>;
  hostedOn?: InputMaybe<InfrastructureRelationshipFilters>;
  hostedOnConnection?: InputMaybe<ApplicationHostedOnConnectionFilters>;
  hostingEnvironment?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  implementsPrinciples?: InputMaybe<ArchitecturePrincipleRelationshipFilters>;
  implementsPrinciplesConnection?: InputMaybe<ApplicationImplementsPrinciplesConnectionFilters>;
  introductionDate?: InputMaybe<DateScalarFilters>;
  isDataSourceFor?: InputMaybe<DataObjectRelationshipFilters>;
  isDataSourceForConnection?: InputMaybe<ApplicationIsDataSourceForConnectionFilters>;
  name?: InputMaybe<StringScalarFilters>;
  owners?: InputMaybe<PersonRelationshipFilters>;
  ownersConnection?: InputMaybe<ApplicationOwnersConnectionFilters>;
  parents?: InputMaybe<ApplicationRelationshipFilters>;
  parentsConnection?: InputMaybe<ApplicationParentsConnectionFilters>;
  partOfArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  partOfArchitecturesConnection?: InputMaybe<ApplicationPartOfArchitecturesConnectionFilters>;
  planningDate?: InputMaybe<DateScalarFilters>;
  predecessors?: InputMaybe<ApplicationRelationshipFilters>;
  predecessorsConnection?: InputMaybe<ApplicationPredecessorsConnectionFilters>;
  sevenRStrategy?: InputMaybe<SevenRStrategyEnumScalarFilters>;
  sourceOfInterfaces?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  sourceOfInterfacesConnection?: InputMaybe<ApplicationSourceOfInterfacesConnectionFilters>;
  status?: InputMaybe<ApplicationStatusEnumScalarFilters>;
  successors?: InputMaybe<ApplicationRelationshipFilters>;
  successorsConnection?: InputMaybe<ApplicationSuccessorsConnectionFilters>;
  supportsCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  supportsCapabilitiesConnection?: InputMaybe<ApplicationSupportsCapabilitiesConnectionFilters>;
  targetOfInterfaces?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  targetOfInterfacesConnection?: InputMaybe<ApplicationTargetOfInterfacesConnectionFilters>;
  technologyStack?: InputMaybe<StringListFilters>;
  timeCategory?: InputMaybe<TimeCategoryEnumScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
  usedByOrganisations?: InputMaybe<OrganisationRelationshipFilters>;
  usedByOrganisationsConnection?: InputMaybe<ApplicationUsedByOrganisationsConnectionFilters>;
  usesAIAssets?: InputMaybe<AiAssetRelationshipFilters>;
  usesAIAssetsConnection?: InputMaybe<ApplicationUsesAiAssetsConnectionFilters>;
  usesDataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  usesDataObjectsConnection?: InputMaybe<ApplicationUsesDataObjectsConnectionFilters>;
  vendor?: InputMaybe<StringScalarFilters>;
  version?: InputMaybe<StringScalarFilters>;
};

export type ApplicationsConnection = {
  __typename?: 'ApplicationsConnection';
  aggregate: ApplicationAggregate;
  edges: Array<ApplicationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type Architecture = {
  __typename?: 'Architecture';
  appliedPrinciples: Array<ArchitecturePrinciple>;
  appliedPrinciplesConnection: ArchitectureAppliedPrinciplesConnection;
  childArchitectures: Array<Architecture>;
  childArchitecturesConnection: ArchitectureChildArchitecturesConnection;
  containsAIAssets: Array<AiAsset>;
  containsAIAssetsConnection: ArchitectureContainsAiAssetsConnection;
  containsApplications: Array<Application>;
  containsApplicationsConnection: ArchitectureContainsApplicationsConnection;
  containsCapabilities: Array<BusinessCapability>;
  containsCapabilitiesConnection: ArchitectureContainsCapabilitiesConnection;
  containsDataObjects: Array<DataObject>;
  containsDataObjectsConnection: ArchitectureContainsDataObjectsConnection;
  containsInfrastructure: Array<Infrastructure>;
  containsInfrastructureConnection: ArchitectureContainsInfrastructureConnection;
  containsInterfaces: Array<ApplicationInterface>;
  containsInterfacesConnection: ArchitectureContainsInterfacesConnection;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  diagrams: Array<Diagram>;
  diagramsConnection: ArchitectureDiagramsConnection;
  domain: ArchitectureDomain;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owners: Array<Person>;
  ownersConnection: ArchitectureOwnersConnection;
  parentArchitecture: Array<Architecture>;
  parentArchitectureConnection: ArchitectureParentArchitectureConnection;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  timestamp: Scalars['DateTime']['output'];
  type: ArchitectureType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureAppliedPrinciplesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitecturePrincipleSort>>;
  where?: InputMaybe<ArchitecturePrincipleWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureAppliedPrinciplesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureAppliedPrinciplesConnectionSort>>;
  where?: InputMaybe<ArchitectureAppliedPrinciplesConnectionWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureChildArchitecturesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureChildArchitecturesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureChildArchitecturesConnectionSort>>;
  where?: InputMaybe<ArchitectureChildArchitecturesConnectionWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsAiAssetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsAiAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureContainsAiAssetsConnectionSort>>;
  where?: InputMaybe<ArchitectureContainsAiAssetsConnectionWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureContainsApplicationsConnectionSort>>;
  where?: InputMaybe<ArchitectureContainsApplicationsConnectionWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsCapabilitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsCapabilitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureContainsCapabilitiesConnectionSort>>;
  where?: InputMaybe<ArchitectureContainsCapabilitiesConnectionWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureContainsDataObjectsConnectionSort>>;
  where?: InputMaybe<ArchitectureContainsDataObjectsConnectionWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsInfrastructureArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsInfrastructureConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureContainsInfrastructureConnectionSort>>;
  where?: InputMaybe<ArchitectureContainsInfrastructureConnectionWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsInterfacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureContainsInterfacesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureContainsInterfacesConnectionSort>>;
  where?: InputMaybe<ArchitectureContainsInterfacesConnectionWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureDiagramsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramSort>>;
  where?: InputMaybe<DiagramWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureDiagramsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureDiagramsConnectionSort>>;
  where?: InputMaybe<ArchitectureDiagramsConnectionWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureOwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureOwnersConnectionSort>>;
  where?: InputMaybe<ArchitectureOwnersConnectionWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureParentArchitectureArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** Architecture - repräsentiert eine Architektur im Enterprise Architecture Management */
export type ArchitectureParentArchitectureConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureParentArchitectureConnectionSort>>;
  where?: InputMaybe<ArchitectureParentArchitectureConnectionWhere>;
};

export type ArchitectureAiAssetContainsAiAssetsAggregateSelection = {
  __typename?: 'ArchitectureAIAssetContainsAIAssetsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitectureAiAssetContainsAiAssetsNodeAggregateSelection>;
};

export type ArchitectureAiAssetContainsAiAssetsNodeAggregateSelection = {
  __typename?: 'ArchitectureAIAssetContainsAIAssetsNodeAggregateSelection';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type ArchitectureAggregate = {
  __typename?: 'ArchitectureAggregate';
  count: Count;
  node: ArchitectureAggregateNode;
};

export type ArchitectureAggregateNode = {
  __typename?: 'ArchitectureAggregateNode';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitectureApplicationContainsApplicationsAggregateSelection = {
  __typename?: 'ArchitectureApplicationContainsApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitectureApplicationContainsApplicationsNodeAggregateSelection>;
};

export type ArchitectureApplicationContainsApplicationsNodeAggregateSelection = {
  __typename?: 'ArchitectureApplicationContainsApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type ArchitectureApplicationInterfaceContainsInterfacesAggregateSelection = {
  __typename?: 'ArchitectureApplicationInterfaceContainsInterfacesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitectureApplicationInterfaceContainsInterfacesNodeAggregateSelection>;
};

export type ArchitectureApplicationInterfaceContainsInterfacesNodeAggregateSelection = {
  __typename?: 'ArchitectureApplicationInterfaceContainsInterfacesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type ArchitectureAppliedPrinciplesAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureAppliedPrinciplesAggregateInput>>;
  NOT?: InputMaybe<ArchitectureAppliedPrinciplesAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureAppliedPrinciplesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureAppliedPrinciplesNodeAggregationWhereInput>;
};

export type ArchitectureAppliedPrinciplesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleConnectInput>>;
  where?: InputMaybe<ArchitecturePrincipleConnectWhere>;
};

export type ArchitectureAppliedPrinciplesConnection = {
  __typename?: 'ArchitectureAppliedPrinciplesConnection';
  aggregate: ArchitectureArchitecturePrincipleAppliedPrinciplesAggregateSelection;
  edges: Array<ArchitectureAppliedPrinciplesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureAppliedPrinciplesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureAppliedPrinciplesConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureAppliedPrinciplesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureAppliedPrinciplesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureAppliedPrinciplesNodeAggregationWhereInput>;
};

export type ArchitectureAppliedPrinciplesConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureAppliedPrinciplesConnections */
  aggregate?: InputMaybe<ArchitectureAppliedPrinciplesConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureAppliedPrinciplesConnections match this filter */
  all?: InputMaybe<ArchitectureAppliedPrinciplesConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureAppliedPrinciplesConnections match this filter */
  none?: InputMaybe<ArchitectureAppliedPrinciplesConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureAppliedPrinciplesConnections match this filter */
  single?: InputMaybe<ArchitectureAppliedPrinciplesConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureAppliedPrinciplesConnections match this filter */
  some?: InputMaybe<ArchitectureAppliedPrinciplesConnectionWhere>;
};

export type ArchitectureAppliedPrinciplesConnectionSort = {
  node?: InputMaybe<ArchitecturePrincipleSort>;
};

export type ArchitectureAppliedPrinciplesConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureAppliedPrinciplesConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureAppliedPrinciplesConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureAppliedPrinciplesConnectionWhere>>;
  node?: InputMaybe<ArchitecturePrincipleWhere>;
};

export type ArchitectureAppliedPrinciplesCreateFieldInput = {
  node: ArchitecturePrincipleCreateInput;
};

export type ArchitectureAppliedPrinciplesDeleteFieldInput = {
  delete?: InputMaybe<ArchitecturePrincipleDeleteInput>;
  where?: InputMaybe<ArchitectureAppliedPrinciplesConnectionWhere>;
};

export type ArchitectureAppliedPrinciplesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitecturePrincipleDisconnectInput>;
  where?: InputMaybe<ArchitectureAppliedPrinciplesConnectionWhere>;
};

export type ArchitectureAppliedPrinciplesFieldInput = {
  connect?: InputMaybe<Array<ArchitectureAppliedPrinciplesConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureAppliedPrinciplesCreateFieldInput>>;
};

export type ArchitectureAppliedPrinciplesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureAppliedPrinciplesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureAppliedPrinciplesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureAppliedPrinciplesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  implications?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  rationale?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ArchitectureAppliedPrinciplesRelationship = {
  __typename?: 'ArchitectureAppliedPrinciplesRelationship';
  cursor: Scalars['String']['output'];
  node: ArchitecturePrinciple;
};

export type ArchitectureAppliedPrinciplesUpdateConnectionInput = {
  node?: InputMaybe<ArchitecturePrincipleUpdateInput>;
  where?: InputMaybe<ArchitectureAppliedPrinciplesConnectionWhere>;
};

export type ArchitectureAppliedPrinciplesUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureAppliedPrinciplesConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureAppliedPrinciplesCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureAppliedPrinciplesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureAppliedPrinciplesDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureAppliedPrinciplesUpdateConnectionInput>;
};

export type ArchitectureArchitectureChildArchitecturesAggregateSelection = {
  __typename?: 'ArchitectureArchitectureChildArchitecturesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitectureArchitectureChildArchitecturesNodeAggregateSelection>;
};

export type ArchitectureArchitectureChildArchitecturesNodeAggregateSelection = {
  __typename?: 'ArchitectureArchitectureChildArchitecturesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitectureArchitectureParentArchitectureAggregateSelection = {
  __typename?: 'ArchitectureArchitectureParentArchitectureAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitectureArchitectureParentArchitectureNodeAggregateSelection>;
};

export type ArchitectureArchitectureParentArchitectureNodeAggregateSelection = {
  __typename?: 'ArchitectureArchitectureParentArchitectureNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitectureArchitecturePrincipleAppliedPrinciplesAggregateSelection = {
  __typename?: 'ArchitectureArchitecturePrincipleAppliedPrinciplesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitectureArchitecturePrincipleAppliedPrinciplesNodeAggregateSelection>;
};

export type ArchitectureArchitecturePrincipleAppliedPrinciplesNodeAggregateSelection = {
  __typename?: 'ArchitectureArchitecturePrincipleAppliedPrinciplesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  implications: StringAggregateSelection;
  name: StringAggregateSelection;
  rationale: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitectureBusinessCapabilityContainsCapabilitiesAggregateSelection = {
  __typename?: 'ArchitectureBusinessCapabilityContainsCapabilitiesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitectureBusinessCapabilityContainsCapabilitiesNodeAggregateSelection>;
};

export type ArchitectureBusinessCapabilityContainsCapabilitiesNodeAggregateSelection = {
  __typename?: 'ArchitectureBusinessCapabilityContainsCapabilitiesNodeAggregateSelection';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitectureChildArchitecturesAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureChildArchitecturesAggregateInput>>;
  NOT?: InputMaybe<ArchitectureChildArchitecturesAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureChildArchitecturesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureChildArchitecturesNodeAggregationWhereInput>;
};

export type ArchitectureChildArchitecturesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type ArchitectureChildArchitecturesConnection = {
  __typename?: 'ArchitectureChildArchitecturesConnection';
  aggregate: ArchitectureArchitectureChildArchitecturesAggregateSelection;
  edges: Array<ArchitectureChildArchitecturesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureChildArchitecturesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureChildArchitecturesConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureChildArchitecturesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureChildArchitecturesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureChildArchitecturesNodeAggregationWhereInput>;
};

export type ArchitectureChildArchitecturesConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureChildArchitecturesConnections */
  aggregate?: InputMaybe<ArchitectureChildArchitecturesConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureChildArchitecturesConnections match this filter */
  all?: InputMaybe<ArchitectureChildArchitecturesConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureChildArchitecturesConnections match this filter */
  none?: InputMaybe<ArchitectureChildArchitecturesConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureChildArchitecturesConnections match this filter */
  single?: InputMaybe<ArchitectureChildArchitecturesConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureChildArchitecturesConnections match this filter */
  some?: InputMaybe<ArchitectureChildArchitecturesConnectionWhere>;
};

export type ArchitectureChildArchitecturesConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type ArchitectureChildArchitecturesConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureChildArchitecturesConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureChildArchitecturesConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureChildArchitecturesConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type ArchitectureChildArchitecturesCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type ArchitectureChildArchitecturesDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<ArchitectureChildArchitecturesConnectionWhere>;
};

export type ArchitectureChildArchitecturesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<ArchitectureChildArchitecturesConnectionWhere>;
};

export type ArchitectureChildArchitecturesFieldInput = {
  connect?: InputMaybe<Array<ArchitectureChildArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureChildArchitecturesCreateFieldInput>>;
};

export type ArchitectureChildArchitecturesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureChildArchitecturesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureChildArchitecturesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureChildArchitecturesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ArchitectureChildArchitecturesRelationship = {
  __typename?: 'ArchitectureChildArchitecturesRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type ArchitectureChildArchitecturesUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<ArchitectureChildArchitecturesConnectionWhere>;
};

export type ArchitectureChildArchitecturesUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureChildArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureChildArchitecturesCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureChildArchitecturesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureChildArchitecturesDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureChildArchitecturesUpdateConnectionInput>;
};

export type ArchitectureConnectInput = {
  appliedPrinciples?: InputMaybe<Array<ArchitectureAppliedPrinciplesConnectFieldInput>>;
  childArchitectures?: InputMaybe<Array<ArchitectureChildArchitecturesConnectFieldInput>>;
  containsAIAssets?: InputMaybe<Array<ArchitectureContainsAiAssetsConnectFieldInput>>;
  containsApplications?: InputMaybe<Array<ArchitectureContainsApplicationsConnectFieldInput>>;
  containsCapabilities?: InputMaybe<Array<ArchitectureContainsCapabilitiesConnectFieldInput>>;
  containsDataObjects?: InputMaybe<Array<ArchitectureContainsDataObjectsConnectFieldInput>>;
  containsInfrastructure?: InputMaybe<Array<ArchitectureContainsInfrastructureConnectFieldInput>>;
  containsInterfaces?: InputMaybe<Array<ArchitectureContainsInterfacesConnectFieldInput>>;
  diagrams?: InputMaybe<Array<ArchitectureDiagramsConnectFieldInput>>;
  owners?: InputMaybe<Array<ArchitectureOwnersConnectFieldInput>>;
  parentArchitecture?: InputMaybe<Array<ArchitectureParentArchitectureConnectFieldInput>>;
};

export type ArchitectureConnectWhere = {
  node: ArchitectureWhere;
};

export type ArchitectureContainsAiAssetsAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsAiAssetsAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsAiAssetsAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsAiAssetsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureContainsAiAssetsNodeAggregationWhereInput>;
};

export type ArchitectureContainsAiAssetsConnectFieldInput = {
  connect?: InputMaybe<Array<AiAssetConnectInput>>;
  where?: InputMaybe<AiAssetConnectWhere>;
};

export type ArchitectureContainsAiAssetsConnection = {
  __typename?: 'ArchitectureContainsAIAssetsConnection';
  aggregate: ArchitectureAiAssetContainsAiAssetsAggregateSelection;
  edges: Array<ArchitectureContainsAiAssetsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureContainsAiAssetsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsAiAssetsConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsAiAssetsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsAiAssetsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureContainsAiAssetsNodeAggregationWhereInput>;
};

export type ArchitectureContainsAiAssetsConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureContainsAIAssetsConnections */
  aggregate?: InputMaybe<ArchitectureContainsAiAssetsConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureContainsAIAssetsConnections match this filter */
  all?: InputMaybe<ArchitectureContainsAiAssetsConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureContainsAIAssetsConnections match this filter */
  none?: InputMaybe<ArchitectureContainsAiAssetsConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureContainsAIAssetsConnections match this filter */
  single?: InputMaybe<ArchitectureContainsAiAssetsConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureContainsAIAssetsConnections match this filter */
  some?: InputMaybe<ArchitectureContainsAiAssetsConnectionWhere>;
};

export type ArchitectureContainsAiAssetsConnectionSort = {
  node?: InputMaybe<AiAssetSort>;
};

export type ArchitectureContainsAiAssetsConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureContainsAiAssetsConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureContainsAiAssetsConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureContainsAiAssetsConnectionWhere>>;
  node?: InputMaybe<AiAssetWhere>;
};

export type ArchitectureContainsAiAssetsCreateFieldInput = {
  node: AiAssetCreateInput;
};

export type ArchitectureContainsAiAssetsDeleteFieldInput = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<ArchitectureContainsAiAssetsConnectionWhere>;
};

export type ArchitectureContainsAiAssetsDisconnectFieldInput = {
  disconnect?: InputMaybe<AiAssetDisconnectInput>;
  where?: InputMaybe<ArchitectureContainsAiAssetsConnectionWhere>;
};

export type ArchitectureContainsAiAssetsFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsAiAssetsCreateFieldInput>>;
};

export type ArchitectureContainsAiAssetsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureContainsAiAssetsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureContainsAiAssetsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureContainsAiAssetsNodeAggregationWhereInput>>;
  accuracy?: InputMaybe<FloatScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  license?: InputMaybe<StringScalarAggregationFilters>;
  model?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  provider?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ArchitectureContainsAiAssetsRelationship = {
  __typename?: 'ArchitectureContainsAIAssetsRelationship';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type ArchitectureContainsAiAssetsUpdateConnectionInput = {
  node?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<ArchitectureContainsAiAssetsConnectionWhere>;
};

export type ArchitectureContainsAiAssetsUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsAiAssetsCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureContainsAiAssetsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureContainsAiAssetsDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureContainsAiAssetsUpdateConnectionInput>;
};

export type ArchitectureContainsApplicationsAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsApplicationsAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsApplicationsAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureContainsApplicationsNodeAggregationWhereInput>;
};

export type ArchitectureContainsApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type ArchitectureContainsApplicationsConnection = {
  __typename?: 'ArchitectureContainsApplicationsConnection';
  aggregate: ArchitectureApplicationContainsApplicationsAggregateSelection;
  edges: Array<ArchitectureContainsApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureContainsApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureContainsApplicationsNodeAggregationWhereInput>;
};

export type ArchitectureContainsApplicationsConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureContainsApplicationsConnections */
  aggregate?: InputMaybe<ArchitectureContainsApplicationsConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureContainsApplicationsConnections match this filter */
  all?: InputMaybe<ArchitectureContainsApplicationsConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureContainsApplicationsConnections match this filter */
  none?: InputMaybe<ArchitectureContainsApplicationsConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureContainsApplicationsConnections match this filter */
  single?: InputMaybe<ArchitectureContainsApplicationsConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureContainsApplicationsConnections match this filter */
  some?: InputMaybe<ArchitectureContainsApplicationsConnectionWhere>;
};

export type ArchitectureContainsApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type ArchitectureContainsApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureContainsApplicationsConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureContainsApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureContainsApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type ArchitectureContainsApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type ArchitectureContainsApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<ArchitectureContainsApplicationsConnectionWhere>;
};

export type ArchitectureContainsApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<ArchitectureContainsApplicationsConnectionWhere>;
};

export type ArchitectureContainsApplicationsFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsApplicationsCreateFieldInput>>;
};

export type ArchitectureContainsApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureContainsApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureContainsApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureContainsApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ArchitectureContainsApplicationsRelationship = {
  __typename?: 'ArchitectureContainsApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type ArchitectureContainsApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<ArchitectureContainsApplicationsConnectionWhere>;
};

export type ArchitectureContainsApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureContainsApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureContainsApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureContainsApplicationsUpdateConnectionInput>;
};

export type ArchitectureContainsCapabilitiesAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsCapabilitiesAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsCapabilitiesAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsCapabilitiesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureContainsCapabilitiesNodeAggregationWhereInput>;
};

export type ArchitectureContainsCapabilitiesConnectFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityConnectInput>>;
  where?: InputMaybe<BusinessCapabilityConnectWhere>;
};

export type ArchitectureContainsCapabilitiesConnection = {
  __typename?: 'ArchitectureContainsCapabilitiesConnection';
  aggregate: ArchitectureBusinessCapabilityContainsCapabilitiesAggregateSelection;
  edges: Array<ArchitectureContainsCapabilitiesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureContainsCapabilitiesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsCapabilitiesConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsCapabilitiesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsCapabilitiesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureContainsCapabilitiesNodeAggregationWhereInput>;
};

export type ArchitectureContainsCapabilitiesConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureContainsCapabilitiesConnections */
  aggregate?: InputMaybe<ArchitectureContainsCapabilitiesConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureContainsCapabilitiesConnections match this filter */
  all?: InputMaybe<ArchitectureContainsCapabilitiesConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureContainsCapabilitiesConnections match this filter */
  none?: InputMaybe<ArchitectureContainsCapabilitiesConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureContainsCapabilitiesConnections match this filter */
  single?: InputMaybe<ArchitectureContainsCapabilitiesConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureContainsCapabilitiesConnections match this filter */
  some?: InputMaybe<ArchitectureContainsCapabilitiesConnectionWhere>;
};

export type ArchitectureContainsCapabilitiesConnectionSort = {
  node?: InputMaybe<BusinessCapabilitySort>;
};

export type ArchitectureContainsCapabilitiesConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureContainsCapabilitiesConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureContainsCapabilitiesConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureContainsCapabilitiesConnectionWhere>>;
  node?: InputMaybe<BusinessCapabilityWhere>;
};

export type ArchitectureContainsCapabilitiesCreateFieldInput = {
  node: BusinessCapabilityCreateInput;
};

export type ArchitectureContainsCapabilitiesDeleteFieldInput = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<ArchitectureContainsCapabilitiesConnectionWhere>;
};

export type ArchitectureContainsCapabilitiesDisconnectFieldInput = {
  disconnect?: InputMaybe<BusinessCapabilityDisconnectInput>;
  where?: InputMaybe<ArchitectureContainsCapabilitiesConnectionWhere>;
};

export type ArchitectureContainsCapabilitiesFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsCapabilitiesCreateFieldInput>>;
};

export type ArchitectureContainsCapabilitiesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureContainsCapabilitiesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureContainsCapabilitiesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureContainsCapabilitiesNodeAggregationWhereInput>>;
  businessValue?: InputMaybe<IntScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  maturityLevel?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  sequenceNumber?: InputMaybe<IntScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ArchitectureContainsCapabilitiesRelationship = {
  __typename?: 'ArchitectureContainsCapabilitiesRelationship';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type ArchitectureContainsCapabilitiesUpdateConnectionInput = {
  node?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<ArchitectureContainsCapabilitiesConnectionWhere>;
};

export type ArchitectureContainsCapabilitiesUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsCapabilitiesCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureContainsCapabilitiesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureContainsCapabilitiesDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureContainsCapabilitiesUpdateConnectionInput>;
};

export type ArchitectureContainsDataObjectsAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsDataObjectsAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsDataObjectsAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsDataObjectsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureContainsDataObjectsNodeAggregationWhereInput>;
};

export type ArchitectureContainsDataObjectsConnectFieldInput = {
  connect?: InputMaybe<Array<DataObjectConnectInput>>;
  where?: InputMaybe<DataObjectConnectWhere>;
};

export type ArchitectureContainsDataObjectsConnection = {
  __typename?: 'ArchitectureContainsDataObjectsConnection';
  aggregate: ArchitectureDataObjectContainsDataObjectsAggregateSelection;
  edges: Array<ArchitectureContainsDataObjectsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureContainsDataObjectsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsDataObjectsConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsDataObjectsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsDataObjectsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureContainsDataObjectsNodeAggregationWhereInput>;
};

export type ArchitectureContainsDataObjectsConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureContainsDataObjectsConnections */
  aggregate?: InputMaybe<ArchitectureContainsDataObjectsConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureContainsDataObjectsConnections match this filter */
  all?: InputMaybe<ArchitectureContainsDataObjectsConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureContainsDataObjectsConnections match this filter */
  none?: InputMaybe<ArchitectureContainsDataObjectsConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureContainsDataObjectsConnections match this filter */
  single?: InputMaybe<ArchitectureContainsDataObjectsConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureContainsDataObjectsConnections match this filter */
  some?: InputMaybe<ArchitectureContainsDataObjectsConnectionWhere>;
};

export type ArchitectureContainsDataObjectsConnectionSort = {
  node?: InputMaybe<DataObjectSort>;
};

export type ArchitectureContainsDataObjectsConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureContainsDataObjectsConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureContainsDataObjectsConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureContainsDataObjectsConnectionWhere>>;
  node?: InputMaybe<DataObjectWhere>;
};

export type ArchitectureContainsDataObjectsCreateFieldInput = {
  node: DataObjectCreateInput;
};

export type ArchitectureContainsDataObjectsDeleteFieldInput = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<ArchitectureContainsDataObjectsConnectionWhere>;
};

export type ArchitectureContainsDataObjectsDisconnectFieldInput = {
  disconnect?: InputMaybe<DataObjectDisconnectInput>;
  where?: InputMaybe<ArchitectureContainsDataObjectsConnectionWhere>;
};

export type ArchitectureContainsDataObjectsFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsDataObjectsCreateFieldInput>>;
};

export type ArchitectureContainsDataObjectsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureContainsDataObjectsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureContainsDataObjectsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureContainsDataObjectsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  format?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ArchitectureContainsDataObjectsRelationship = {
  __typename?: 'ArchitectureContainsDataObjectsRelationship';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type ArchitectureContainsDataObjectsUpdateConnectionInput = {
  node?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<ArchitectureContainsDataObjectsConnectionWhere>;
};

export type ArchitectureContainsDataObjectsUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsDataObjectsCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureContainsDataObjectsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureContainsDataObjectsDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureContainsDataObjectsUpdateConnectionInput>;
};

export type ArchitectureContainsInfrastructureAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsInfrastructureAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsInfrastructureAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsInfrastructureAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureContainsInfrastructureNodeAggregationWhereInput>;
};

export type ArchitectureContainsInfrastructureConnectFieldInput = {
  connect?: InputMaybe<Array<InfrastructureConnectInput>>;
  where?: InputMaybe<InfrastructureConnectWhere>;
};

export type ArchitectureContainsInfrastructureConnection = {
  __typename?: 'ArchitectureContainsInfrastructureConnection';
  aggregate: ArchitectureInfrastructureContainsInfrastructureAggregateSelection;
  edges: Array<ArchitectureContainsInfrastructureRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureContainsInfrastructureConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsInfrastructureConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsInfrastructureConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsInfrastructureConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureContainsInfrastructureNodeAggregationWhereInput>;
};

export type ArchitectureContainsInfrastructureConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureContainsInfrastructureConnections */
  aggregate?: InputMaybe<ArchitectureContainsInfrastructureConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureContainsInfrastructureConnections match this filter */
  all?: InputMaybe<ArchitectureContainsInfrastructureConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureContainsInfrastructureConnections match this filter */
  none?: InputMaybe<ArchitectureContainsInfrastructureConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureContainsInfrastructureConnections match this filter */
  single?: InputMaybe<ArchitectureContainsInfrastructureConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureContainsInfrastructureConnections match this filter */
  some?: InputMaybe<ArchitectureContainsInfrastructureConnectionWhere>;
};

export type ArchitectureContainsInfrastructureConnectionSort = {
  node?: InputMaybe<InfrastructureSort>;
};

export type ArchitectureContainsInfrastructureConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureContainsInfrastructureConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureContainsInfrastructureConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureContainsInfrastructureConnectionWhere>>;
  node?: InputMaybe<InfrastructureWhere>;
};

export type ArchitectureContainsInfrastructureCreateFieldInput = {
  node: InfrastructureCreateInput;
};

export type ArchitectureContainsInfrastructureDeleteFieldInput = {
  delete?: InputMaybe<InfrastructureDeleteInput>;
  where?: InputMaybe<ArchitectureContainsInfrastructureConnectionWhere>;
};

export type ArchitectureContainsInfrastructureDisconnectFieldInput = {
  disconnect?: InputMaybe<InfrastructureDisconnectInput>;
  where?: InputMaybe<ArchitectureContainsInfrastructureConnectionWhere>;
};

export type ArchitectureContainsInfrastructureFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsInfrastructureCreateFieldInput>>;
};

export type ArchitectureContainsInfrastructureNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureContainsInfrastructureNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureContainsInfrastructureNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureContainsInfrastructureNodeAggregationWhereInput>>;
  capacity?: InputMaybe<StringScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  ipAddress?: InputMaybe<StringScalarAggregationFilters>;
  location?: InputMaybe<StringScalarAggregationFilters>;
  maintenanceWindow?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  operatingSystem?: InputMaybe<StringScalarAggregationFilters>;
  specifications?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ArchitectureContainsInfrastructureRelationship = {
  __typename?: 'ArchitectureContainsInfrastructureRelationship';
  cursor: Scalars['String']['output'];
  node: Infrastructure;
};

export type ArchitectureContainsInfrastructureUpdateConnectionInput = {
  node?: InputMaybe<InfrastructureUpdateInput>;
  where?: InputMaybe<ArchitectureContainsInfrastructureConnectionWhere>;
};

export type ArchitectureContainsInfrastructureUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsInfrastructureCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureContainsInfrastructureDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureContainsInfrastructureDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureContainsInfrastructureUpdateConnectionInput>;
};

export type ArchitectureContainsInterfacesAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsInterfacesAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsInterfacesAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsInterfacesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureContainsInterfacesNodeAggregationWhereInput>;
};

export type ArchitectureContainsInterfacesConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type ArchitectureContainsInterfacesConnection = {
  __typename?: 'ArchitectureContainsInterfacesConnection';
  aggregate: ArchitectureApplicationInterfaceContainsInterfacesAggregateSelection;
  edges: Array<ArchitectureContainsInterfacesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureContainsInterfacesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureContainsInterfacesConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureContainsInterfacesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureContainsInterfacesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureContainsInterfacesNodeAggregationWhereInput>;
};

export type ArchitectureContainsInterfacesConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureContainsInterfacesConnections */
  aggregate?: InputMaybe<ArchitectureContainsInterfacesConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureContainsInterfacesConnections match this filter */
  all?: InputMaybe<ArchitectureContainsInterfacesConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureContainsInterfacesConnections match this filter */
  none?: InputMaybe<ArchitectureContainsInterfacesConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureContainsInterfacesConnections match this filter */
  single?: InputMaybe<ArchitectureContainsInterfacesConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureContainsInterfacesConnections match this filter */
  some?: InputMaybe<ArchitectureContainsInterfacesConnectionWhere>;
};

export type ArchitectureContainsInterfacesConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type ArchitectureContainsInterfacesConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureContainsInterfacesConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureContainsInterfacesConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureContainsInterfacesConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type ArchitectureContainsInterfacesCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type ArchitectureContainsInterfacesDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<ArchitectureContainsInterfacesConnectionWhere>;
};

export type ArchitectureContainsInterfacesDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<ArchitectureContainsInterfacesConnectionWhere>;
};

export type ArchitectureContainsInterfacesFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsInterfacesCreateFieldInput>>;
};

export type ArchitectureContainsInterfacesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureContainsInterfacesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureContainsInterfacesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureContainsInterfacesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ArchitectureContainsInterfacesRelationship = {
  __typename?: 'ArchitectureContainsInterfacesRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type ArchitectureContainsInterfacesUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<ArchitectureContainsInterfacesConnectionWhere>;
};

export type ArchitectureContainsInterfacesUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureContainsInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureContainsInterfacesCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureContainsInterfacesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureContainsInterfacesDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureContainsInterfacesUpdateConnectionInput>;
};

export type ArchitectureCreateInput = {
  appliedPrinciples?: InputMaybe<ArchitectureAppliedPrinciplesFieldInput>;
  childArchitectures?: InputMaybe<ArchitectureChildArchitecturesFieldInput>;
  containsAIAssets?: InputMaybe<ArchitectureContainsAiAssetsFieldInput>;
  containsApplications?: InputMaybe<ArchitectureContainsApplicationsFieldInput>;
  containsCapabilities?: InputMaybe<ArchitectureContainsCapabilitiesFieldInput>;
  containsDataObjects?: InputMaybe<ArchitectureContainsDataObjectsFieldInput>;
  containsInfrastructure?: InputMaybe<ArchitectureContainsInfrastructureFieldInput>;
  containsInterfaces?: InputMaybe<ArchitectureContainsInterfacesFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  diagrams?: InputMaybe<ArchitectureDiagramsFieldInput>;
  domain: ArchitectureDomain;
  name: Scalars['String']['input'];
  owners?: InputMaybe<ArchitectureOwnersFieldInput>;
  parentArchitecture?: InputMaybe<ArchitectureParentArchitectureFieldInput>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  timestamp: Scalars['DateTime']['input'];
  type: ArchitectureType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ArchitectureDataObjectContainsDataObjectsAggregateSelection = {
  __typename?: 'ArchitectureDataObjectContainsDataObjectsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitectureDataObjectContainsDataObjectsNodeAggregateSelection>;
};

export type ArchitectureDataObjectContainsDataObjectsNodeAggregateSelection = {
  __typename?: 'ArchitectureDataObjectContainsDataObjectsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitectureDeleteInput = {
  appliedPrinciples?: InputMaybe<Array<ArchitectureAppliedPrinciplesDeleteFieldInput>>;
  childArchitectures?: InputMaybe<Array<ArchitectureChildArchitecturesDeleteFieldInput>>;
  containsAIAssets?: InputMaybe<Array<ArchitectureContainsAiAssetsDeleteFieldInput>>;
  containsApplications?: InputMaybe<Array<ArchitectureContainsApplicationsDeleteFieldInput>>;
  containsCapabilities?: InputMaybe<Array<ArchitectureContainsCapabilitiesDeleteFieldInput>>;
  containsDataObjects?: InputMaybe<Array<ArchitectureContainsDataObjectsDeleteFieldInput>>;
  containsInfrastructure?: InputMaybe<Array<ArchitectureContainsInfrastructureDeleteFieldInput>>;
  containsInterfaces?: InputMaybe<Array<ArchitectureContainsInterfacesDeleteFieldInput>>;
  diagrams?: InputMaybe<Array<ArchitectureDiagramsDeleteFieldInput>>;
  owners?: InputMaybe<Array<ArchitectureOwnersDeleteFieldInput>>;
  parentArchitecture?: InputMaybe<Array<ArchitectureParentArchitectureDeleteFieldInput>>;
};

export type ArchitectureDiagramDiagramsAggregateSelection = {
  __typename?: 'ArchitectureDiagramDiagramsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitectureDiagramDiagramsNodeAggregateSelection>;
};

export type ArchitectureDiagramDiagramsNodeAggregateSelection = {
  __typename?: 'ArchitectureDiagramDiagramsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  diagramJson: StringAggregateSelection;
  diagramPng: StringAggregateSelection;
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitectureDiagramsAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureDiagramsAggregateInput>>;
  NOT?: InputMaybe<ArchitectureDiagramsAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureDiagramsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureDiagramsNodeAggregationWhereInput>;
};

export type ArchitectureDiagramsConnectFieldInput = {
  connect?: InputMaybe<Array<DiagramConnectInput>>;
  where?: InputMaybe<DiagramConnectWhere>;
};

export type ArchitectureDiagramsConnection = {
  __typename?: 'ArchitectureDiagramsConnection';
  aggregate: ArchitectureDiagramDiagramsAggregateSelection;
  edges: Array<ArchitectureDiagramsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureDiagramsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureDiagramsConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureDiagramsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureDiagramsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureDiagramsNodeAggregationWhereInput>;
};

export type ArchitectureDiagramsConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureDiagramsConnections */
  aggregate?: InputMaybe<ArchitectureDiagramsConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureDiagramsConnections match this filter */
  all?: InputMaybe<ArchitectureDiagramsConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureDiagramsConnections match this filter */
  none?: InputMaybe<ArchitectureDiagramsConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureDiagramsConnections match this filter */
  single?: InputMaybe<ArchitectureDiagramsConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureDiagramsConnections match this filter */
  some?: InputMaybe<ArchitectureDiagramsConnectionWhere>;
};

export type ArchitectureDiagramsConnectionSort = {
  node?: InputMaybe<DiagramSort>;
};

export type ArchitectureDiagramsConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureDiagramsConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureDiagramsConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureDiagramsConnectionWhere>>;
  node?: InputMaybe<DiagramWhere>;
};

export type ArchitectureDiagramsCreateFieldInput = {
  node: DiagramCreateInput;
};

export type ArchitectureDiagramsDeleteFieldInput = {
  delete?: InputMaybe<DiagramDeleteInput>;
  where?: InputMaybe<ArchitectureDiagramsConnectionWhere>;
};

export type ArchitectureDiagramsDisconnectFieldInput = {
  disconnect?: InputMaybe<DiagramDisconnectInput>;
  where?: InputMaybe<ArchitectureDiagramsConnectionWhere>;
};

export type ArchitectureDiagramsFieldInput = {
  connect?: InputMaybe<Array<ArchitectureDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureDiagramsCreateFieldInput>>;
};

export type ArchitectureDiagramsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureDiagramsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureDiagramsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureDiagramsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  diagramJson?: InputMaybe<StringScalarAggregationFilters>;
  diagramPng?: InputMaybe<StringScalarAggregationFilters>;
  title?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ArchitectureDiagramsRelationship = {
  __typename?: 'ArchitectureDiagramsRelationship';
  cursor: Scalars['String']['output'];
  node: Diagram;
};

export type ArchitectureDiagramsUpdateConnectionInput = {
  node?: InputMaybe<DiagramUpdateInput>;
  where?: InputMaybe<ArchitectureDiagramsConnectionWhere>;
};

export type ArchitectureDiagramsUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureDiagramsCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureDiagramsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureDiagramsDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureDiagramsUpdateConnectionInput>;
};

export type ArchitectureDisconnectInput = {
  appliedPrinciples?: InputMaybe<Array<ArchitectureAppliedPrinciplesDisconnectFieldInput>>;
  childArchitectures?: InputMaybe<Array<ArchitectureChildArchitecturesDisconnectFieldInput>>;
  containsAIAssets?: InputMaybe<Array<ArchitectureContainsAiAssetsDisconnectFieldInput>>;
  containsApplications?: InputMaybe<Array<ArchitectureContainsApplicationsDisconnectFieldInput>>;
  containsCapabilities?: InputMaybe<Array<ArchitectureContainsCapabilitiesDisconnectFieldInput>>;
  containsDataObjects?: InputMaybe<Array<ArchitectureContainsDataObjectsDisconnectFieldInput>>;
  containsInfrastructure?: InputMaybe<Array<ArchitectureContainsInfrastructureDisconnectFieldInput>>;
  containsInterfaces?: InputMaybe<Array<ArchitectureContainsInterfacesDisconnectFieldInput>>;
  diagrams?: InputMaybe<Array<ArchitectureDiagramsDisconnectFieldInput>>;
  owners?: InputMaybe<Array<ArchitectureOwnersDisconnectFieldInput>>;
  parentArchitecture?: InputMaybe<Array<ArchitectureParentArchitectureDisconnectFieldInput>>;
};

/** Architektur-Domänen */
export enum ArchitectureDomain {
  APPLICATION = 'APPLICATION',
  BUSINESS = 'BUSINESS',
  DATA = 'DATA',
  ENTERPRISE = 'ENTERPRISE',
  INTEGRATION = 'INTEGRATION',
  SECURITY = 'SECURITY',
  TECHNOLOGY = 'TECHNOLOGY'
}

/** ArchitectureDomain filters */
export type ArchitectureDomainEnumScalarFilters = {
  eq?: InputMaybe<ArchitectureDomain>;
  in?: InputMaybe<Array<ArchitectureDomain>>;
};

/** ArchitectureDomain mutations */
export type ArchitectureDomainEnumScalarMutations = {
  set?: InputMaybe<ArchitectureDomain>;
};

export type ArchitectureEdge = {
  __typename?: 'ArchitectureEdge';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type ArchitectureInfrastructureContainsInfrastructureAggregateSelection = {
  __typename?: 'ArchitectureInfrastructureContainsInfrastructureAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitectureInfrastructureContainsInfrastructureNodeAggregateSelection>;
};

export type ArchitectureInfrastructureContainsInfrastructureNodeAggregateSelection = {
  __typename?: 'ArchitectureInfrastructureContainsInfrastructureNodeAggregateSelection';
  capacity: StringAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  ipAddress: StringAggregateSelection;
  location: StringAggregateSelection;
  maintenanceWindow: StringAggregateSelection;
  name: StringAggregateSelection;
  operatingSystem: StringAggregateSelection;
  specifications: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type ArchitectureOwnersAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureOwnersAggregateInput>>;
  NOT?: InputMaybe<ArchitectureOwnersAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureOwnersAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureOwnersNodeAggregationWhereInput>;
};

export type ArchitectureOwnersConnectFieldInput = {
  connect?: InputMaybe<Array<PersonConnectInput>>;
  where?: InputMaybe<PersonConnectWhere>;
};

export type ArchitectureOwnersConnection = {
  __typename?: 'ArchitectureOwnersConnection';
  aggregate: ArchitecturePersonOwnersAggregateSelection;
  edges: Array<ArchitectureOwnersRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureOwnersConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureOwnersConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureOwnersConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureOwnersConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureOwnersNodeAggregationWhereInput>;
};

export type ArchitectureOwnersConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureOwnersConnections */
  aggregate?: InputMaybe<ArchitectureOwnersConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureOwnersConnections match this filter */
  all?: InputMaybe<ArchitectureOwnersConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureOwnersConnections match this filter */
  none?: InputMaybe<ArchitectureOwnersConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureOwnersConnections match this filter */
  single?: InputMaybe<ArchitectureOwnersConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureOwnersConnections match this filter */
  some?: InputMaybe<ArchitectureOwnersConnectionWhere>;
};

export type ArchitectureOwnersConnectionSort = {
  node?: InputMaybe<PersonSort>;
};

export type ArchitectureOwnersConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureOwnersConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureOwnersConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureOwnersConnectionWhere>>;
  node?: InputMaybe<PersonWhere>;
};

export type ArchitectureOwnersCreateFieldInput = {
  node: PersonCreateInput;
};

export type ArchitectureOwnersDeleteFieldInput = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<ArchitectureOwnersConnectionWhere>;
};

export type ArchitectureOwnersDisconnectFieldInput = {
  disconnect?: InputMaybe<PersonDisconnectInput>;
  where?: InputMaybe<ArchitectureOwnersConnectionWhere>;
};

export type ArchitectureOwnersFieldInput = {
  connect?: InputMaybe<Array<ArchitectureOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureOwnersCreateFieldInput>>;
};

export type ArchitectureOwnersNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureOwnersNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureOwnersNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureOwnersNodeAggregationWhereInput>>;
  avatarUrl?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  department?: InputMaybe<StringScalarAggregationFilters>;
  email?: InputMaybe<StringScalarAggregationFilters>;
  firstName?: InputMaybe<StringScalarAggregationFilters>;
  lastName?: InputMaybe<StringScalarAggregationFilters>;
  phone?: InputMaybe<StringScalarAggregationFilters>;
  role?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ArchitectureOwnersRelationship = {
  __typename?: 'ArchitectureOwnersRelationship';
  cursor: Scalars['String']['output'];
  node: Person;
};

export type ArchitectureOwnersUpdateConnectionInput = {
  node?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<ArchitectureOwnersConnectionWhere>;
};

export type ArchitectureOwnersUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureOwnersCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureOwnersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureOwnersDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureOwnersUpdateConnectionInput>;
};

export type ArchitectureParentArchitectureAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureParentArchitectureAggregateInput>>;
  NOT?: InputMaybe<ArchitectureParentArchitectureAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureParentArchitectureAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitectureParentArchitectureNodeAggregationWhereInput>;
};

export type ArchitectureParentArchitectureConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type ArchitectureParentArchitectureConnection = {
  __typename?: 'ArchitectureParentArchitectureConnection';
  aggregate: ArchitectureArchitectureParentArchitectureAggregateSelection;
  edges: Array<ArchitectureParentArchitectureRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureParentArchitectureConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitectureParentArchitectureConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitectureParentArchitectureConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitectureParentArchitectureConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitectureParentArchitectureNodeAggregationWhereInput>;
};

export type ArchitectureParentArchitectureConnectionFilters = {
  /** Filter Architectures by aggregating results on related ArchitectureParentArchitectureConnections */
  aggregate?: InputMaybe<ArchitectureParentArchitectureConnectionAggregateInput>;
  /** Return Architectures where all of the related ArchitectureParentArchitectureConnections match this filter */
  all?: InputMaybe<ArchitectureParentArchitectureConnectionWhere>;
  /** Return Architectures where none of the related ArchitectureParentArchitectureConnections match this filter */
  none?: InputMaybe<ArchitectureParentArchitectureConnectionWhere>;
  /** Return Architectures where one of the related ArchitectureParentArchitectureConnections match this filter */
  single?: InputMaybe<ArchitectureParentArchitectureConnectionWhere>;
  /** Return Architectures where some of the related ArchitectureParentArchitectureConnections match this filter */
  some?: InputMaybe<ArchitectureParentArchitectureConnectionWhere>;
};

export type ArchitectureParentArchitectureConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type ArchitectureParentArchitectureConnectionWhere = {
  AND?: InputMaybe<Array<ArchitectureParentArchitectureConnectionWhere>>;
  NOT?: InputMaybe<ArchitectureParentArchitectureConnectionWhere>;
  OR?: InputMaybe<Array<ArchitectureParentArchitectureConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type ArchitectureParentArchitectureCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type ArchitectureParentArchitectureDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<ArchitectureParentArchitectureConnectionWhere>;
};

export type ArchitectureParentArchitectureDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<ArchitectureParentArchitectureConnectionWhere>;
};

export type ArchitectureParentArchitectureFieldInput = {
  connect?: InputMaybe<Array<ArchitectureParentArchitectureConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureParentArchitectureCreateFieldInput>>;
};

export type ArchitectureParentArchitectureNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitectureParentArchitectureNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitectureParentArchitectureNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitectureParentArchitectureNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ArchitectureParentArchitectureRelationship = {
  __typename?: 'ArchitectureParentArchitectureRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type ArchitectureParentArchitectureUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<ArchitectureParentArchitectureConnectionWhere>;
};

export type ArchitectureParentArchitectureUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitectureParentArchitectureConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitectureParentArchitectureCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitectureParentArchitectureDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitectureParentArchitectureDisconnectFieldInput>>;
  update?: InputMaybe<ArchitectureParentArchitectureUpdateConnectionInput>;
};

export type ArchitecturePersonOwnersAggregateSelection = {
  __typename?: 'ArchitecturePersonOwnersAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitecturePersonOwnersNodeAggregateSelection>;
};

export type ArchitecturePersonOwnersNodeAggregateSelection = {
  __typename?: 'ArchitecturePersonOwnersNodeAggregateSelection';
  avatarUrl: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

/** ArchitecturePrinciple - repräsentiert ein Architektur-Prinzip im Enterprise Architecture Management */
export type ArchitecturePrinciple = {
  __typename?: 'ArchitecturePrinciple';
  appliedInArchitectures: Array<Architecture>;
  appliedInArchitecturesConnection: ArchitecturePrincipleAppliedInArchitecturesConnection;
  category: PrincipleCategory;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  implementedByAIAssets: Array<AiAsset>;
  implementedByAIAssetsConnection: ArchitecturePrincipleImplementedByAiAssetsConnection;
  implementedByApplications: Array<Application>;
  implementedByApplicationsConnection: ArchitecturePrincipleImplementedByApplicationsConnection;
  implications?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  owners: Array<Person>;
  ownersConnection: ArchitecturePrincipleOwnersConnection;
  priority: PrinciplePriority;
  rationale?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


/** ArchitecturePrinciple - repräsentiert ein Architektur-Prinzip im Enterprise Architecture Management */
export type ArchitecturePrincipleAppliedInArchitecturesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** ArchitecturePrinciple - repräsentiert ein Architektur-Prinzip im Enterprise Architecture Management */
export type ArchitecturePrincipleAppliedInArchitecturesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesConnectionSort>>;
  where?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>;
};


/** ArchitecturePrinciple - repräsentiert ein Architektur-Prinzip im Enterprise Architecture Management */
export type ArchitecturePrincipleImplementedByAiAssetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


/** ArchitecturePrinciple - repräsentiert ein Architektur-Prinzip im Enterprise Architecture Management */
export type ArchitecturePrincipleImplementedByAiAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsConnectionSort>>;
  where?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>;
};


/** ArchitecturePrinciple - repräsentiert ein Architektur-Prinzip im Enterprise Architecture Management */
export type ArchitecturePrincipleImplementedByApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** ArchitecturePrinciple - repräsentiert ein Architektur-Prinzip im Enterprise Architecture Management */
export type ArchitecturePrincipleImplementedByApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsConnectionSort>>;
  where?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>;
};


/** ArchitecturePrinciple - repräsentiert ein Architektur-Prinzip im Enterprise Architecture Management */
export type ArchitecturePrincipleOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};


/** ArchitecturePrinciple - repräsentiert ein Architektur-Prinzip im Enterprise Architecture Management */
export type ArchitecturePrincipleOwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitecturePrincipleOwnersConnectionSort>>;
  where?: InputMaybe<ArchitecturePrincipleOwnersConnectionWhere>;
};

export type ArchitecturePrincipleAiAssetImplementedByAiAssetsAggregateSelection = {
  __typename?: 'ArchitecturePrincipleAIAssetImplementedByAIAssetsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitecturePrincipleAiAssetImplementedByAiAssetsNodeAggregateSelection>;
};

export type ArchitecturePrincipleAiAssetImplementedByAiAssetsNodeAggregateSelection = {
  __typename?: 'ArchitecturePrincipleAIAssetImplementedByAIAssetsNodeAggregateSelection';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type ArchitecturePrincipleAggregate = {
  __typename?: 'ArchitecturePrincipleAggregate';
  count: Count;
  node: ArchitecturePrincipleAggregateNode;
};

export type ArchitecturePrincipleAggregateNode = {
  __typename?: 'ArchitecturePrincipleAggregateNode';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  implications: StringAggregateSelection;
  name: StringAggregateSelection;
  rationale: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitecturePrincipleApplicationImplementedByApplicationsAggregateSelection = {
  __typename?: 'ArchitecturePrincipleApplicationImplementedByApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitecturePrincipleApplicationImplementedByApplicationsNodeAggregateSelection>;
};

export type ArchitecturePrincipleApplicationImplementedByApplicationsNodeAggregateSelection = {
  __typename?: 'ArchitecturePrincipleApplicationImplementedByApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type ArchitecturePrincipleAppliedInArchitecturesAggregateInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesAggregateInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesAggregateInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesNodeAggregationWhereInput>;
};

export type ArchitecturePrincipleAppliedInArchitecturesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type ArchitecturePrincipleAppliedInArchitecturesConnection = {
  __typename?: 'ArchitecturePrincipleAppliedInArchitecturesConnection';
  aggregate: ArchitecturePrincipleArchitectureAppliedInArchitecturesAggregateSelection;
  edges: Array<ArchitecturePrincipleAppliedInArchitecturesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitecturePrincipleAppliedInArchitecturesConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesNodeAggregationWhereInput>;
};

export type ArchitecturePrincipleAppliedInArchitecturesConnectionFilters = {
  /** Filter ArchitecturePrinciples by aggregating results on related ArchitecturePrincipleAppliedInArchitecturesConnections */
  aggregate?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionAggregateInput>;
  /** Return ArchitecturePrinciples where all of the related ArchitecturePrincipleAppliedInArchitecturesConnections match this filter */
  all?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>;
  /** Return ArchitecturePrinciples where none of the related ArchitecturePrincipleAppliedInArchitecturesConnections match this filter */
  none?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>;
  /** Return ArchitecturePrinciples where one of the related ArchitecturePrincipleAppliedInArchitecturesConnections match this filter */
  single?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>;
  /** Return ArchitecturePrinciples where some of the related ArchitecturePrincipleAppliedInArchitecturesConnections match this filter */
  some?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>;
};

export type ArchitecturePrincipleAppliedInArchitecturesConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type ArchitecturePrincipleAppliedInArchitecturesConnectionWhere = {
  AND?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>>;
  NOT?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>;
  OR?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type ArchitecturePrincipleAppliedInArchitecturesCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type ArchitecturePrincipleAppliedInArchitecturesDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>;
};

export type ArchitecturePrincipleAppliedInArchitecturesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>;
};

export type ArchitecturePrincipleAppliedInArchitecturesFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesCreateFieldInput>>;
};

export type ArchitecturePrincipleAppliedInArchitecturesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ArchitecturePrincipleAppliedInArchitecturesRelationship = {
  __typename?: 'ArchitecturePrincipleAppliedInArchitecturesRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type ArchitecturePrincipleAppliedInArchitecturesUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionWhere>;
};

export type ArchitecturePrincipleAppliedInArchitecturesUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesDisconnectFieldInput>>;
  update?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesUpdateConnectionInput>;
};

export type ArchitecturePrincipleArchitectureAppliedInArchitecturesAggregateSelection = {
  __typename?: 'ArchitecturePrincipleArchitectureAppliedInArchitecturesAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitecturePrincipleArchitectureAppliedInArchitecturesNodeAggregateSelection>;
};

export type ArchitecturePrincipleArchitectureAppliedInArchitecturesNodeAggregateSelection = {
  __typename?: 'ArchitecturePrincipleArchitectureAppliedInArchitecturesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitecturePrincipleConnectInput = {
  appliedInArchitectures?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesConnectFieldInput>>;
  implementedByAIAssets?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsConnectFieldInput>>;
  implementedByApplications?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsConnectFieldInput>>;
  owners?: InputMaybe<Array<ArchitecturePrincipleOwnersConnectFieldInput>>;
};

export type ArchitecturePrincipleConnectWhere = {
  node: ArchitecturePrincipleWhere;
};

export type ArchitecturePrincipleCreateInput = {
  appliedInArchitectures?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesFieldInput>;
  category: PrincipleCategory;
  description?: InputMaybe<Scalars['String']['input']>;
  implementedByAIAssets?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsFieldInput>;
  implementedByApplications?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsFieldInput>;
  implications?: InputMaybe<Scalars['String']['input']>;
  isActive: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  owners?: InputMaybe<ArchitecturePrincipleOwnersFieldInput>;
  priority: PrinciplePriority;
  rationale?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ArchitecturePrincipleDeleteInput = {
  appliedInArchitectures?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesDeleteFieldInput>>;
  implementedByAIAssets?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsDeleteFieldInput>>;
  implementedByApplications?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsDeleteFieldInput>>;
  owners?: InputMaybe<Array<ArchitecturePrincipleOwnersDeleteFieldInput>>;
};

export type ArchitecturePrincipleDisconnectInput = {
  appliedInArchitectures?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesDisconnectFieldInput>>;
  implementedByAIAssets?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsDisconnectFieldInput>>;
  implementedByApplications?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsDisconnectFieldInput>>;
  owners?: InputMaybe<Array<ArchitecturePrincipleOwnersDisconnectFieldInput>>;
};

export type ArchitecturePrincipleEdge = {
  __typename?: 'ArchitecturePrincipleEdge';
  cursor: Scalars['String']['output'];
  node: ArchitecturePrinciple;
};

export type ArchitecturePrincipleImplementedByAiAssetsAggregateInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsAggregateInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsAggregateInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsNodeAggregationWhereInput>;
};

export type ArchitecturePrincipleImplementedByAiAssetsConnectFieldInput = {
  connect?: InputMaybe<Array<AiAssetConnectInput>>;
  where?: InputMaybe<AiAssetConnectWhere>;
};

export type ArchitecturePrincipleImplementedByAiAssetsConnection = {
  __typename?: 'ArchitecturePrincipleImplementedByAIAssetsConnection';
  aggregate: ArchitecturePrincipleAiAssetImplementedByAiAssetsAggregateSelection;
  edges: Array<ArchitecturePrincipleImplementedByAiAssetsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitecturePrincipleImplementedByAiAssetsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsNodeAggregationWhereInput>;
};

export type ArchitecturePrincipleImplementedByAiAssetsConnectionFilters = {
  /** Filter ArchitecturePrinciples by aggregating results on related ArchitecturePrincipleImplementedByAIAssetsConnections */
  aggregate?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionAggregateInput>;
  /** Return ArchitecturePrinciples where all of the related ArchitecturePrincipleImplementedByAIAssetsConnections match this filter */
  all?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>;
  /** Return ArchitecturePrinciples where none of the related ArchitecturePrincipleImplementedByAIAssetsConnections match this filter */
  none?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>;
  /** Return ArchitecturePrinciples where one of the related ArchitecturePrincipleImplementedByAIAssetsConnections match this filter */
  single?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>;
  /** Return ArchitecturePrinciples where some of the related ArchitecturePrincipleImplementedByAIAssetsConnections match this filter */
  some?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>;
};

export type ArchitecturePrincipleImplementedByAiAssetsConnectionSort = {
  node?: InputMaybe<AiAssetSort>;
};

export type ArchitecturePrincipleImplementedByAiAssetsConnectionWhere = {
  AND?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>>;
  NOT?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>;
  OR?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>>;
  node?: InputMaybe<AiAssetWhere>;
};

export type ArchitecturePrincipleImplementedByAiAssetsCreateFieldInput = {
  node: AiAssetCreateInput;
};

export type ArchitecturePrincipleImplementedByAiAssetsDeleteFieldInput = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>;
};

export type ArchitecturePrincipleImplementedByAiAssetsDisconnectFieldInput = {
  disconnect?: InputMaybe<AiAssetDisconnectInput>;
  where?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>;
};

export type ArchitecturePrincipleImplementedByAiAssetsFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsCreateFieldInput>>;
};

export type ArchitecturePrincipleImplementedByAiAssetsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsNodeAggregationWhereInput>>;
  accuracy?: InputMaybe<FloatScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  license?: InputMaybe<StringScalarAggregationFilters>;
  model?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  provider?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ArchitecturePrincipleImplementedByAiAssetsRelationship = {
  __typename?: 'ArchitecturePrincipleImplementedByAIAssetsRelationship';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type ArchitecturePrincipleImplementedByAiAssetsUpdateConnectionInput = {
  node?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionWhere>;
};

export type ArchitecturePrincipleImplementedByAiAssetsUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsDisconnectFieldInput>>;
  update?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsUpdateConnectionInput>;
};

export type ArchitecturePrincipleImplementedByApplicationsAggregateInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsAggregateInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsAggregateInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsNodeAggregationWhereInput>;
};

export type ArchitecturePrincipleImplementedByApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type ArchitecturePrincipleImplementedByApplicationsConnection = {
  __typename?: 'ArchitecturePrincipleImplementedByApplicationsConnection';
  aggregate: ArchitecturePrincipleApplicationImplementedByApplicationsAggregateSelection;
  edges: Array<ArchitecturePrincipleImplementedByApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitecturePrincipleImplementedByApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsNodeAggregationWhereInput>;
};

export type ArchitecturePrincipleImplementedByApplicationsConnectionFilters = {
  /** Filter ArchitecturePrinciples by aggregating results on related ArchitecturePrincipleImplementedByApplicationsConnections */
  aggregate?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionAggregateInput>;
  /** Return ArchitecturePrinciples where all of the related ArchitecturePrincipleImplementedByApplicationsConnections match this filter */
  all?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>;
  /** Return ArchitecturePrinciples where none of the related ArchitecturePrincipleImplementedByApplicationsConnections match this filter */
  none?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>;
  /** Return ArchitecturePrinciples where one of the related ArchitecturePrincipleImplementedByApplicationsConnections match this filter */
  single?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>;
  /** Return ArchitecturePrinciples where some of the related ArchitecturePrincipleImplementedByApplicationsConnections match this filter */
  some?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>;
};

export type ArchitecturePrincipleImplementedByApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type ArchitecturePrincipleImplementedByApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>>;
  NOT?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type ArchitecturePrincipleImplementedByApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type ArchitecturePrincipleImplementedByApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>;
};

export type ArchitecturePrincipleImplementedByApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>;
};

export type ArchitecturePrincipleImplementedByApplicationsFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsCreateFieldInput>>;
};

export type ArchitecturePrincipleImplementedByApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type ArchitecturePrincipleImplementedByApplicationsRelationship = {
  __typename?: 'ArchitecturePrincipleImplementedByApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type ArchitecturePrincipleImplementedByApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionWhere>;
};

export type ArchitecturePrincipleImplementedByApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsUpdateConnectionInput>;
};

export type ArchitecturePrincipleOwnersAggregateInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleOwnersAggregateInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleOwnersAggregateInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleOwnersAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ArchitecturePrincipleOwnersNodeAggregationWhereInput>;
};

export type ArchitecturePrincipleOwnersConnectFieldInput = {
  connect?: InputMaybe<Array<PersonConnectInput>>;
  where?: InputMaybe<PersonConnectWhere>;
};

export type ArchitecturePrincipleOwnersConnection = {
  __typename?: 'ArchitecturePrincipleOwnersConnection';
  aggregate: ArchitecturePrinciplePersonOwnersAggregateSelection;
  edges: Array<ArchitecturePrincipleOwnersRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitecturePrincipleOwnersConnectionAggregateInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleOwnersConnectionAggregateInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleOwnersConnectionAggregateInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleOwnersConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ArchitecturePrincipleOwnersNodeAggregationWhereInput>;
};

export type ArchitecturePrincipleOwnersConnectionFilters = {
  /** Filter ArchitecturePrinciples by aggregating results on related ArchitecturePrincipleOwnersConnections */
  aggregate?: InputMaybe<ArchitecturePrincipleOwnersConnectionAggregateInput>;
  /** Return ArchitecturePrinciples where all of the related ArchitecturePrincipleOwnersConnections match this filter */
  all?: InputMaybe<ArchitecturePrincipleOwnersConnectionWhere>;
  /** Return ArchitecturePrinciples where none of the related ArchitecturePrincipleOwnersConnections match this filter */
  none?: InputMaybe<ArchitecturePrincipleOwnersConnectionWhere>;
  /** Return ArchitecturePrinciples where one of the related ArchitecturePrincipleOwnersConnections match this filter */
  single?: InputMaybe<ArchitecturePrincipleOwnersConnectionWhere>;
  /** Return ArchitecturePrinciples where some of the related ArchitecturePrincipleOwnersConnections match this filter */
  some?: InputMaybe<ArchitecturePrincipleOwnersConnectionWhere>;
};

export type ArchitecturePrincipleOwnersConnectionSort = {
  node?: InputMaybe<PersonSort>;
};

export type ArchitecturePrincipleOwnersConnectionWhere = {
  AND?: InputMaybe<Array<ArchitecturePrincipleOwnersConnectionWhere>>;
  NOT?: InputMaybe<ArchitecturePrincipleOwnersConnectionWhere>;
  OR?: InputMaybe<Array<ArchitecturePrincipleOwnersConnectionWhere>>;
  node?: InputMaybe<PersonWhere>;
};

export type ArchitecturePrincipleOwnersCreateFieldInput = {
  node: PersonCreateInput;
};

export type ArchitecturePrincipleOwnersDeleteFieldInput = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<ArchitecturePrincipleOwnersConnectionWhere>;
};

export type ArchitecturePrincipleOwnersDisconnectFieldInput = {
  disconnect?: InputMaybe<PersonDisconnectInput>;
  where?: InputMaybe<ArchitecturePrincipleOwnersConnectionWhere>;
};

export type ArchitecturePrincipleOwnersFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitecturePrincipleOwnersCreateFieldInput>>;
};

export type ArchitecturePrincipleOwnersNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ArchitecturePrincipleOwnersNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ArchitecturePrincipleOwnersNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ArchitecturePrincipleOwnersNodeAggregationWhereInput>>;
  avatarUrl?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  department?: InputMaybe<StringScalarAggregationFilters>;
  email?: InputMaybe<StringScalarAggregationFilters>;
  firstName?: InputMaybe<StringScalarAggregationFilters>;
  lastName?: InputMaybe<StringScalarAggregationFilters>;
  phone?: InputMaybe<StringScalarAggregationFilters>;
  role?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ArchitecturePrincipleOwnersRelationship = {
  __typename?: 'ArchitecturePrincipleOwnersRelationship';
  cursor: Scalars['String']['output'];
  node: Person;
};

export type ArchitecturePrincipleOwnersUpdateConnectionInput = {
  node?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<ArchitecturePrincipleOwnersConnectionWhere>;
};

export type ArchitecturePrincipleOwnersUpdateFieldInput = {
  connect?: InputMaybe<Array<ArchitecturePrincipleOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<ArchitecturePrincipleOwnersCreateFieldInput>>;
  delete?: InputMaybe<Array<ArchitecturePrincipleOwnersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ArchitecturePrincipleOwnersDisconnectFieldInput>>;
  update?: InputMaybe<ArchitecturePrincipleOwnersUpdateConnectionInput>;
};

export type ArchitecturePrinciplePersonOwnersAggregateSelection = {
  __typename?: 'ArchitecturePrinciplePersonOwnersAggregateSelection';
  count: CountConnection;
  node?: Maybe<ArchitecturePrinciplePersonOwnersNodeAggregateSelection>;
};

export type ArchitecturePrinciplePersonOwnersNodeAggregateSelection = {
  __typename?: 'ArchitecturePrinciplePersonOwnersNodeAggregateSelection';
  avatarUrl: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitecturePrincipleRelationshipFilters = {
  /** Filter type where all of the related ArchitecturePrinciples match this filter */
  all?: InputMaybe<ArchitecturePrincipleWhere>;
  /** Filter type where none of the related ArchitecturePrinciples match this filter */
  none?: InputMaybe<ArchitecturePrincipleWhere>;
  /** Filter type where one of the related ArchitecturePrinciples match this filter */
  single?: InputMaybe<ArchitecturePrincipleWhere>;
  /** Filter type where some of the related ArchitecturePrinciples match this filter */
  some?: InputMaybe<ArchitecturePrincipleWhere>;
};

/** Fields to sort ArchitecturePrinciples by. The order in which sorts are applied is not guaranteed when specifying many fields in one ArchitecturePrincipleSort object. */
export type ArchitecturePrincipleSort = {
  category?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  implications?: InputMaybe<SortDirection>;
  isActive?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  priority?: InputMaybe<SortDirection>;
  rationale?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type ArchitecturePrincipleUpdateInput = {
  appliedInArchitectures?: InputMaybe<Array<ArchitecturePrincipleAppliedInArchitecturesUpdateFieldInput>>;
  category?: InputMaybe<PrincipleCategoryEnumScalarMutations>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  description?: InputMaybe<StringScalarMutations>;
  implementedByAIAssets?: InputMaybe<Array<ArchitecturePrincipleImplementedByAiAssetsUpdateFieldInput>>;
  implementedByApplications?: InputMaybe<Array<ArchitecturePrincipleImplementedByApplicationsUpdateFieldInput>>;
  implications?: InputMaybe<StringScalarMutations>;
  isActive?: InputMaybe<BooleanScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<ArchitecturePrincipleOwnersUpdateFieldInput>>;
  priority?: InputMaybe<PrinciplePriorityEnumScalarMutations>;
  rationale?: InputMaybe<StringScalarMutations>;
  tags?: InputMaybe<ListStringMutations>;
};

export type ArchitecturePrincipleWhere = {
  AND?: InputMaybe<Array<ArchitecturePrincipleWhere>>;
  NOT?: InputMaybe<ArchitecturePrincipleWhere>;
  OR?: InputMaybe<Array<ArchitecturePrincipleWhere>>;
  appliedInArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  appliedInArchitecturesConnection?: InputMaybe<ArchitecturePrincipleAppliedInArchitecturesConnectionFilters>;
  category?: InputMaybe<PrincipleCategoryEnumScalarFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  description?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  implementedByAIAssets?: InputMaybe<AiAssetRelationshipFilters>;
  implementedByAIAssetsConnection?: InputMaybe<ArchitecturePrincipleImplementedByAiAssetsConnectionFilters>;
  implementedByApplications?: InputMaybe<ApplicationRelationshipFilters>;
  implementedByApplicationsConnection?: InputMaybe<ArchitecturePrincipleImplementedByApplicationsConnectionFilters>;
  implications?: InputMaybe<StringScalarFilters>;
  isActive?: InputMaybe<BooleanScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  owners?: InputMaybe<PersonRelationshipFilters>;
  ownersConnection?: InputMaybe<ArchitecturePrincipleOwnersConnectionFilters>;
  priority?: InputMaybe<PrinciplePriorityEnumScalarFilters>;
  rationale?: InputMaybe<StringScalarFilters>;
  tags?: InputMaybe<StringListFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
};

export type ArchitecturePrinciplesConnection = {
  __typename?: 'ArchitecturePrinciplesConnection';
  aggregate: ArchitecturePrincipleAggregate;
  edges: Array<ArchitecturePrincipleEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArchitectureRelationshipFilters = {
  /** Filter type where all of the related Architectures match this filter */
  all?: InputMaybe<ArchitectureWhere>;
  /** Filter type where none of the related Architectures match this filter */
  none?: InputMaybe<ArchitectureWhere>;
  /** Filter type where one of the related Architectures match this filter */
  single?: InputMaybe<ArchitectureWhere>;
  /** Filter type where some of the related Architectures match this filter */
  some?: InputMaybe<ArchitectureWhere>;
};

/** Fields to sort Architectures by. The order in which sorts are applied is not guaranteed when specifying many fields in one ArchitectureSort object. */
export type ArchitectureSort = {
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  domain?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  timestamp?: InputMaybe<SortDirection>;
  type?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

/** Architektur-Typen */
export enum ArchitectureType {
  CONCEPTUAL = 'CONCEPTUAL',
  CURRENT_STATE = 'CURRENT_STATE',
  FUTURE_STATE = 'FUTURE_STATE',
  TRANSITION = 'TRANSITION'
}

/** ArchitectureType filters */
export type ArchitectureTypeEnumScalarFilters = {
  eq?: InputMaybe<ArchitectureType>;
  in?: InputMaybe<Array<ArchitectureType>>;
};

/** ArchitectureType mutations */
export type ArchitectureTypeEnumScalarMutations = {
  set?: InputMaybe<ArchitectureType>;
};

export type ArchitectureUpdateInput = {
  appliedPrinciples?: InputMaybe<Array<ArchitectureAppliedPrinciplesUpdateFieldInput>>;
  childArchitectures?: InputMaybe<Array<ArchitectureChildArchitecturesUpdateFieldInput>>;
  containsAIAssets?: InputMaybe<Array<ArchitectureContainsAiAssetsUpdateFieldInput>>;
  containsApplications?: InputMaybe<Array<ArchitectureContainsApplicationsUpdateFieldInput>>;
  containsCapabilities?: InputMaybe<Array<ArchitectureContainsCapabilitiesUpdateFieldInput>>;
  containsDataObjects?: InputMaybe<Array<ArchitectureContainsDataObjectsUpdateFieldInput>>;
  containsInfrastructure?: InputMaybe<Array<ArchitectureContainsInfrastructureUpdateFieldInput>>;
  containsInterfaces?: InputMaybe<Array<ArchitectureContainsInterfacesUpdateFieldInput>>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  description?: InputMaybe<StringScalarMutations>;
  diagrams?: InputMaybe<Array<ArchitectureDiagramsUpdateFieldInput>>;
  domain?: InputMaybe<ArchitectureDomainEnumScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<ArchitectureOwnersUpdateFieldInput>>;
  parentArchitecture?: InputMaybe<Array<ArchitectureParentArchitectureUpdateFieldInput>>;
  tags?: InputMaybe<ListStringMutations>;
  timestamp?: InputMaybe<DateTimeScalarMutations>;
  type?: InputMaybe<ArchitectureTypeEnumScalarMutations>;
};

export type ArchitectureWhere = {
  AND?: InputMaybe<Array<ArchitectureWhere>>;
  NOT?: InputMaybe<ArchitectureWhere>;
  OR?: InputMaybe<Array<ArchitectureWhere>>;
  appliedPrinciples?: InputMaybe<ArchitecturePrincipleRelationshipFilters>;
  appliedPrinciplesConnection?: InputMaybe<ArchitectureAppliedPrinciplesConnectionFilters>;
  childArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  childArchitecturesConnection?: InputMaybe<ArchitectureChildArchitecturesConnectionFilters>;
  containsAIAssets?: InputMaybe<AiAssetRelationshipFilters>;
  containsAIAssetsConnection?: InputMaybe<ArchitectureContainsAiAssetsConnectionFilters>;
  containsApplications?: InputMaybe<ApplicationRelationshipFilters>;
  containsApplicationsConnection?: InputMaybe<ArchitectureContainsApplicationsConnectionFilters>;
  containsCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  containsCapabilitiesConnection?: InputMaybe<ArchitectureContainsCapabilitiesConnectionFilters>;
  containsDataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  containsDataObjectsConnection?: InputMaybe<ArchitectureContainsDataObjectsConnectionFilters>;
  containsInfrastructure?: InputMaybe<InfrastructureRelationshipFilters>;
  containsInfrastructureConnection?: InputMaybe<ArchitectureContainsInfrastructureConnectionFilters>;
  containsInterfaces?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  containsInterfacesConnection?: InputMaybe<ArchitectureContainsInterfacesConnectionFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  description?: InputMaybe<StringScalarFilters>;
  diagrams?: InputMaybe<DiagramRelationshipFilters>;
  diagramsConnection?: InputMaybe<ArchitectureDiagramsConnectionFilters>;
  domain?: InputMaybe<ArchitectureDomainEnumScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  owners?: InputMaybe<PersonRelationshipFilters>;
  ownersConnection?: InputMaybe<ArchitectureOwnersConnectionFilters>;
  parentArchitecture?: InputMaybe<ArchitectureRelationshipFilters>;
  parentArchitectureConnection?: InputMaybe<ArchitectureParentArchitectureConnectionFilters>;
  tags?: InputMaybe<StringListFilters>;
  timestamp?: InputMaybe<DateTimeScalarFilters>;
  type?: InputMaybe<ArchitectureTypeEnumScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
};

export type ArchitecturesConnection = {
  __typename?: 'ArchitecturesConnection';
  aggregate: ArchitectureAggregate;
  edges: Array<ArchitectureEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Boolean filters */
export type BooleanScalarFilters = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean mutations */
export type BooleanScalarMutations = {
  set?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BusinessCapabilitiesConnection = {
  __typename?: 'BusinessCapabilitiesConnection';
  aggregate: BusinessCapabilityAggregate;
  edges: Array<BusinessCapabilityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapability = {
  __typename?: 'BusinessCapability';
  businessValue?: Maybe<Scalars['Int']['output']>;
  children: Array<BusinessCapability>;
  childrenConnection: BusinessCapabilityChildrenConnection;
  company: Array<Company>;
  companyConnection: BusinessCapabilityCompanyConnection;
  createdAt: Scalars['DateTime']['output'];
  depictedInDiagrams: Array<Diagram>;
  depictedInDiagramsConnection: BusinessCapabilityDepictedInDiagramsConnection;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  introductionDate?: Maybe<Scalars['Date']['output']>;
  maturityLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  owners: Array<Person>;
  ownersConnection: BusinessCapabilityOwnersConnection;
  parents: Array<BusinessCapability>;
  parentsConnection: BusinessCapabilityParentsConnection;
  partOfArchitectures: Array<Architecture>;
  partOfArchitecturesConnection: BusinessCapabilityPartOfArchitecturesConnection;
  relatedDataObjects: Array<DataObject>;
  relatedDataObjectsConnection: BusinessCapabilityRelatedDataObjectsConnection;
  sequenceNumber?: Maybe<Scalars['Int']['output']>;
  status: CapabilityStatus;
  supportedByAIAssets: Array<AiAsset>;
  supportedByAIAssetsConnection: BusinessCapabilitySupportedByAiAssetsConnection;
  supportedByApplications: Array<Application>;
  supportedByApplicationsConnection: BusinessCapabilitySupportedByApplicationsConnection;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  type?: Maybe<CapabilityType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usedByOrganisations: Array<Organisation>;
  usedByOrganisationsConnection: BusinessCapabilityUsedByOrganisationsConnection;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityChildrenArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityChildrenConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilityChildrenConnectionSort>>;
  where?: InputMaybe<BusinessCapabilityChildrenConnectionWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityCompanyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanySort>>;
  where?: InputMaybe<CompanyWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityCompanyConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilityCompanyConnectionSort>>;
  where?: InputMaybe<BusinessCapabilityCompanyConnectionWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityDepictedInDiagramsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramSort>>;
  where?: InputMaybe<DiagramWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityDepictedInDiagramsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsConnectionSort>>;
  where?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityOwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilityOwnersConnectionSort>>;
  where?: InputMaybe<BusinessCapabilityOwnersConnectionWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityParentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityParentsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilityParentsConnectionSort>>;
  where?: InputMaybe<BusinessCapabilityParentsConnectionWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityPartOfArchitecturesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityPartOfArchitecturesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesConnectionSort>>;
  where?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityRelatedDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityRelatedDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsConnectionSort>>;
  where?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilitySupportedByAiAssetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilitySupportedByAiAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsConnectionSort>>;
  where?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilitySupportedByApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilitySupportedByApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsConnectionSort>>;
  where?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityUsedByOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


/** Business Capability - repräsentiert eine Geschäftsfähigkeit im Enterprise Architecture Management */
export type BusinessCapabilityUsedByOrganisationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsConnectionSort>>;
  where?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionWhere>;
};

export type BusinessCapabilityAiAssetSupportedByAiAssetsAggregateSelection = {
  __typename?: 'BusinessCapabilityAIAssetSupportedByAIAssetsAggregateSelection';
  count: CountConnection;
  node?: Maybe<BusinessCapabilityAiAssetSupportedByAiAssetsNodeAggregateSelection>;
};

export type BusinessCapabilityAiAssetSupportedByAiAssetsNodeAggregateSelection = {
  __typename?: 'BusinessCapabilityAIAssetSupportedByAIAssetsNodeAggregateSelection';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type BusinessCapabilityAggregate = {
  __typename?: 'BusinessCapabilityAggregate';
  count: Count;
  node: BusinessCapabilityAggregateNode;
};

export type BusinessCapabilityAggregateNode = {
  __typename?: 'BusinessCapabilityAggregateNode';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type BusinessCapabilityApplicationSupportedByApplicationsAggregateSelection = {
  __typename?: 'BusinessCapabilityApplicationSupportedByApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<BusinessCapabilityApplicationSupportedByApplicationsNodeAggregateSelection>;
};

export type BusinessCapabilityApplicationSupportedByApplicationsNodeAggregateSelection = {
  __typename?: 'BusinessCapabilityApplicationSupportedByApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type BusinessCapabilityArchitecturePartOfArchitecturesAggregateSelection = {
  __typename?: 'BusinessCapabilityArchitecturePartOfArchitecturesAggregateSelection';
  count: CountConnection;
  node?: Maybe<BusinessCapabilityArchitecturePartOfArchitecturesNodeAggregateSelection>;
};

export type BusinessCapabilityArchitecturePartOfArchitecturesNodeAggregateSelection = {
  __typename?: 'BusinessCapabilityArchitecturePartOfArchitecturesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type BusinessCapabilityBusinessCapabilityChildrenAggregateSelection = {
  __typename?: 'BusinessCapabilityBusinessCapabilityChildrenAggregateSelection';
  count: CountConnection;
  node?: Maybe<BusinessCapabilityBusinessCapabilityChildrenNodeAggregateSelection>;
};

export type BusinessCapabilityBusinessCapabilityChildrenNodeAggregateSelection = {
  __typename?: 'BusinessCapabilityBusinessCapabilityChildrenNodeAggregateSelection';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type BusinessCapabilityBusinessCapabilityParentsAggregateSelection = {
  __typename?: 'BusinessCapabilityBusinessCapabilityParentsAggregateSelection';
  count: CountConnection;
  node?: Maybe<BusinessCapabilityBusinessCapabilityParentsNodeAggregateSelection>;
};

export type BusinessCapabilityBusinessCapabilityParentsNodeAggregateSelection = {
  __typename?: 'BusinessCapabilityBusinessCapabilityParentsNodeAggregateSelection';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type BusinessCapabilityChildrenAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityChildrenAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityChildrenAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityChildrenAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<BusinessCapabilityChildrenNodeAggregationWhereInput>;
};

export type BusinessCapabilityChildrenConnectFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityConnectInput>>;
  where?: InputMaybe<BusinessCapabilityConnectWhere>;
};

export type BusinessCapabilityChildrenConnection = {
  __typename?: 'BusinessCapabilityChildrenConnection';
  aggregate: BusinessCapabilityBusinessCapabilityChildrenAggregateSelection;
  edges: Array<BusinessCapabilityChildrenRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BusinessCapabilityChildrenConnectionAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityChildrenConnectionAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityChildrenConnectionAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityChildrenConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<BusinessCapabilityChildrenNodeAggregationWhereInput>;
};

export type BusinessCapabilityChildrenConnectionFilters = {
  /** Filter BusinessCapabilities by aggregating results on related BusinessCapabilityChildrenConnections */
  aggregate?: InputMaybe<BusinessCapabilityChildrenConnectionAggregateInput>;
  /** Return BusinessCapabilities where all of the related BusinessCapabilityChildrenConnections match this filter */
  all?: InputMaybe<BusinessCapabilityChildrenConnectionWhere>;
  /** Return BusinessCapabilities where none of the related BusinessCapabilityChildrenConnections match this filter */
  none?: InputMaybe<BusinessCapabilityChildrenConnectionWhere>;
  /** Return BusinessCapabilities where one of the related BusinessCapabilityChildrenConnections match this filter */
  single?: InputMaybe<BusinessCapabilityChildrenConnectionWhere>;
  /** Return BusinessCapabilities where some of the related BusinessCapabilityChildrenConnections match this filter */
  some?: InputMaybe<BusinessCapabilityChildrenConnectionWhere>;
};

export type BusinessCapabilityChildrenConnectionSort = {
  node?: InputMaybe<BusinessCapabilitySort>;
};

export type BusinessCapabilityChildrenConnectionWhere = {
  AND?: InputMaybe<Array<BusinessCapabilityChildrenConnectionWhere>>;
  NOT?: InputMaybe<BusinessCapabilityChildrenConnectionWhere>;
  OR?: InputMaybe<Array<BusinessCapabilityChildrenConnectionWhere>>;
  node?: InputMaybe<BusinessCapabilityWhere>;
};

export type BusinessCapabilityChildrenCreateFieldInput = {
  node: BusinessCapabilityCreateInput;
};

export type BusinessCapabilityChildrenDeleteFieldInput = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<BusinessCapabilityChildrenConnectionWhere>;
};

export type BusinessCapabilityChildrenDisconnectFieldInput = {
  disconnect?: InputMaybe<BusinessCapabilityDisconnectInput>;
  where?: InputMaybe<BusinessCapabilityChildrenConnectionWhere>;
};

export type BusinessCapabilityChildrenFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityChildrenConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityChildrenCreateFieldInput>>;
};

export type BusinessCapabilityChildrenNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<BusinessCapabilityChildrenNodeAggregationWhereInput>>;
  NOT?: InputMaybe<BusinessCapabilityChildrenNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<BusinessCapabilityChildrenNodeAggregationWhereInput>>;
  businessValue?: InputMaybe<IntScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  maturityLevel?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  sequenceNumber?: InputMaybe<IntScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type BusinessCapabilityChildrenRelationship = {
  __typename?: 'BusinessCapabilityChildrenRelationship';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type BusinessCapabilityChildrenUpdateConnectionInput = {
  node?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<BusinessCapabilityChildrenConnectionWhere>;
};

export type BusinessCapabilityChildrenUpdateFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityChildrenConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityChildrenCreateFieldInput>>;
  delete?: InputMaybe<Array<BusinessCapabilityChildrenDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<BusinessCapabilityChildrenDisconnectFieldInput>>;
  update?: InputMaybe<BusinessCapabilityChildrenUpdateConnectionInput>;
};

export type BusinessCapabilityCompanyAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityCompanyAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityCompanyAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityCompanyAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<BusinessCapabilityCompanyNodeAggregationWhereInput>;
};

export type BusinessCapabilityCompanyCompanyAggregateSelection = {
  __typename?: 'BusinessCapabilityCompanyCompanyAggregateSelection';
  count: CountConnection;
  node?: Maybe<BusinessCapabilityCompanyCompanyNodeAggregateSelection>;
};

export type BusinessCapabilityCompanyCompanyNodeAggregateSelection = {
  __typename?: 'BusinessCapabilityCompanyCompanyNodeAggregateSelection';
  address: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  industry: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  website: StringAggregateSelection;
};

export type BusinessCapabilityCompanyConnectFieldInput = {
  connect?: InputMaybe<Array<CompanyConnectInput>>;
  where?: InputMaybe<CompanyConnectWhere>;
};

export type BusinessCapabilityCompanyConnection = {
  __typename?: 'BusinessCapabilityCompanyConnection';
  aggregate: BusinessCapabilityCompanyCompanyAggregateSelection;
  edges: Array<BusinessCapabilityCompanyRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BusinessCapabilityCompanyConnectionAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityCompanyConnectionAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityCompanyConnectionAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityCompanyConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<BusinessCapabilityCompanyNodeAggregationWhereInput>;
};

export type BusinessCapabilityCompanyConnectionFilters = {
  /** Filter BusinessCapabilities by aggregating results on related BusinessCapabilityCompanyConnections */
  aggregate?: InputMaybe<BusinessCapabilityCompanyConnectionAggregateInput>;
  /** Return BusinessCapabilities where all of the related BusinessCapabilityCompanyConnections match this filter */
  all?: InputMaybe<BusinessCapabilityCompanyConnectionWhere>;
  /** Return BusinessCapabilities where none of the related BusinessCapabilityCompanyConnections match this filter */
  none?: InputMaybe<BusinessCapabilityCompanyConnectionWhere>;
  /** Return BusinessCapabilities where one of the related BusinessCapabilityCompanyConnections match this filter */
  single?: InputMaybe<BusinessCapabilityCompanyConnectionWhere>;
  /** Return BusinessCapabilities where some of the related BusinessCapabilityCompanyConnections match this filter */
  some?: InputMaybe<BusinessCapabilityCompanyConnectionWhere>;
};

export type BusinessCapabilityCompanyConnectionSort = {
  node?: InputMaybe<CompanySort>;
};

export type BusinessCapabilityCompanyConnectionWhere = {
  AND?: InputMaybe<Array<BusinessCapabilityCompanyConnectionWhere>>;
  NOT?: InputMaybe<BusinessCapabilityCompanyConnectionWhere>;
  OR?: InputMaybe<Array<BusinessCapabilityCompanyConnectionWhere>>;
  node?: InputMaybe<CompanyWhere>;
};

export type BusinessCapabilityCompanyCreateFieldInput = {
  node: CompanyCreateInput;
};

export type BusinessCapabilityCompanyDeleteFieldInput = {
  delete?: InputMaybe<CompanyDeleteInput>;
  where?: InputMaybe<BusinessCapabilityCompanyConnectionWhere>;
};

export type BusinessCapabilityCompanyDisconnectFieldInput = {
  disconnect?: InputMaybe<CompanyDisconnectInput>;
  where?: InputMaybe<BusinessCapabilityCompanyConnectionWhere>;
};

export type BusinessCapabilityCompanyFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityCompanyCreateFieldInput>>;
};

export type BusinessCapabilityCompanyNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<BusinessCapabilityCompanyNodeAggregationWhereInput>>;
  NOT?: InputMaybe<BusinessCapabilityCompanyNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<BusinessCapabilityCompanyNodeAggregationWhereInput>>;
  address?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  industry?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  website?: InputMaybe<StringScalarAggregationFilters>;
};

export type BusinessCapabilityCompanyRelationship = {
  __typename?: 'BusinessCapabilityCompanyRelationship';
  cursor: Scalars['String']['output'];
  node: Company;
};

export type BusinessCapabilityCompanyUpdateConnectionInput = {
  node?: InputMaybe<CompanyUpdateInput>;
  where?: InputMaybe<BusinessCapabilityCompanyConnectionWhere>;
};

export type BusinessCapabilityCompanyUpdateFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityCompanyCreateFieldInput>>;
  delete?: InputMaybe<Array<BusinessCapabilityCompanyDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<BusinessCapabilityCompanyDisconnectFieldInput>>;
  update?: InputMaybe<BusinessCapabilityCompanyUpdateConnectionInput>;
};

export type BusinessCapabilityConnectInput = {
  children?: InputMaybe<Array<BusinessCapabilityChildrenConnectFieldInput>>;
  company?: InputMaybe<Array<BusinessCapabilityCompanyConnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsConnectFieldInput>>;
  owners?: InputMaybe<Array<BusinessCapabilityOwnersConnectFieldInput>>;
  parents?: InputMaybe<Array<BusinessCapabilityParentsConnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesConnectFieldInput>>;
  relatedDataObjects?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsConnectFieldInput>>;
  supportedByAIAssets?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsConnectFieldInput>>;
  supportedByApplications?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsConnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsConnectFieldInput>>;
};

export type BusinessCapabilityConnectWhere = {
  node: BusinessCapabilityWhere;
};

export type BusinessCapabilityCreateInput = {
  businessValue?: InputMaybe<Scalars['Int']['input']>;
  children?: InputMaybe<BusinessCapabilityChildrenFieldInput>;
  company?: InputMaybe<BusinessCapabilityCompanyFieldInput>;
  depictedInDiagrams?: InputMaybe<BusinessCapabilityDepictedInDiagramsFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  introductionDate?: InputMaybe<Scalars['Date']['input']>;
  maturityLevel?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  owners?: InputMaybe<BusinessCapabilityOwnersFieldInput>;
  parents?: InputMaybe<BusinessCapabilityParentsFieldInput>;
  partOfArchitectures?: InputMaybe<BusinessCapabilityPartOfArchitecturesFieldInput>;
  relatedDataObjects?: InputMaybe<BusinessCapabilityRelatedDataObjectsFieldInput>;
  sequenceNumber?: InputMaybe<Scalars['Int']['input']>;
  status: CapabilityStatus;
  supportedByAIAssets?: InputMaybe<BusinessCapabilitySupportedByAiAssetsFieldInput>;
  supportedByApplications?: InputMaybe<BusinessCapabilitySupportedByApplicationsFieldInput>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<CapabilityType>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usedByOrganisations?: InputMaybe<BusinessCapabilityUsedByOrganisationsFieldInput>;
};

export type BusinessCapabilityDataObjectRelatedDataObjectsAggregateSelection = {
  __typename?: 'BusinessCapabilityDataObjectRelatedDataObjectsAggregateSelection';
  count: CountConnection;
  node?: Maybe<BusinessCapabilityDataObjectRelatedDataObjectsNodeAggregateSelection>;
};

export type BusinessCapabilityDataObjectRelatedDataObjectsNodeAggregateSelection = {
  __typename?: 'BusinessCapabilityDataObjectRelatedDataObjectsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type BusinessCapabilityDeleteInput = {
  children?: InputMaybe<Array<BusinessCapabilityChildrenDeleteFieldInput>>;
  company?: InputMaybe<Array<BusinessCapabilityCompanyDeleteFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsDeleteFieldInput>>;
  owners?: InputMaybe<Array<BusinessCapabilityOwnersDeleteFieldInput>>;
  parents?: InputMaybe<Array<BusinessCapabilityParentsDeleteFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesDeleteFieldInput>>;
  relatedDataObjects?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsDeleteFieldInput>>;
  supportedByAIAssets?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsDeleteFieldInput>>;
  supportedByApplications?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsDeleteFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsDeleteFieldInput>>;
};

export type BusinessCapabilityDepictedInDiagramsAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityDepictedInDiagramsAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<BusinessCapabilityDepictedInDiagramsNodeAggregationWhereInput>;
};

export type BusinessCapabilityDepictedInDiagramsConnectFieldInput = {
  connect?: InputMaybe<Array<DiagramConnectInput>>;
  where?: InputMaybe<DiagramConnectWhere>;
};

export type BusinessCapabilityDepictedInDiagramsConnection = {
  __typename?: 'BusinessCapabilityDepictedInDiagramsConnection';
  aggregate: BusinessCapabilityDiagramDepictedInDiagramsAggregateSelection;
  edges: Array<BusinessCapabilityDepictedInDiagramsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BusinessCapabilityDepictedInDiagramsConnectionAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsConnectionAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<BusinessCapabilityDepictedInDiagramsNodeAggregationWhereInput>;
};

export type BusinessCapabilityDepictedInDiagramsConnectionFilters = {
  /** Filter BusinessCapabilities by aggregating results on related BusinessCapabilityDepictedInDiagramsConnections */
  aggregate?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionAggregateInput>;
  /** Return BusinessCapabilities where all of the related BusinessCapabilityDepictedInDiagramsConnections match this filter */
  all?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionWhere>;
  /** Return BusinessCapabilities where none of the related BusinessCapabilityDepictedInDiagramsConnections match this filter */
  none?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionWhere>;
  /** Return BusinessCapabilities where one of the related BusinessCapabilityDepictedInDiagramsConnections match this filter */
  single?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionWhere>;
  /** Return BusinessCapabilities where some of the related BusinessCapabilityDepictedInDiagramsConnections match this filter */
  some?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionWhere>;
};

export type BusinessCapabilityDepictedInDiagramsConnectionSort = {
  node?: InputMaybe<DiagramSort>;
};

export type BusinessCapabilityDepictedInDiagramsConnectionWhere = {
  AND?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsConnectionWhere>>;
  NOT?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionWhere>;
  OR?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsConnectionWhere>>;
  node?: InputMaybe<DiagramWhere>;
};

export type BusinessCapabilityDepictedInDiagramsCreateFieldInput = {
  node: DiagramCreateInput;
};

export type BusinessCapabilityDepictedInDiagramsDeleteFieldInput = {
  delete?: InputMaybe<DiagramDeleteInput>;
  where?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionWhere>;
};

export type BusinessCapabilityDepictedInDiagramsDisconnectFieldInput = {
  disconnect?: InputMaybe<DiagramDisconnectInput>;
  where?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionWhere>;
};

export type BusinessCapabilityDepictedInDiagramsFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsCreateFieldInput>>;
};

export type BusinessCapabilityDepictedInDiagramsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<BusinessCapabilityDepictedInDiagramsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  diagramJson?: InputMaybe<StringScalarAggregationFilters>;
  diagramPng?: InputMaybe<StringScalarAggregationFilters>;
  title?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type BusinessCapabilityDepictedInDiagramsRelationship = {
  __typename?: 'BusinessCapabilityDepictedInDiagramsRelationship';
  cursor: Scalars['String']['output'];
  node: Diagram;
};

export type BusinessCapabilityDepictedInDiagramsUpdateConnectionInput = {
  node?: InputMaybe<DiagramUpdateInput>;
  where?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionWhere>;
};

export type BusinessCapabilityDepictedInDiagramsUpdateFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsCreateFieldInput>>;
  delete?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsDisconnectFieldInput>>;
  update?: InputMaybe<BusinessCapabilityDepictedInDiagramsUpdateConnectionInput>;
};

export type BusinessCapabilityDiagramDepictedInDiagramsAggregateSelection = {
  __typename?: 'BusinessCapabilityDiagramDepictedInDiagramsAggregateSelection';
  count: CountConnection;
  node?: Maybe<BusinessCapabilityDiagramDepictedInDiagramsNodeAggregateSelection>;
};

export type BusinessCapabilityDiagramDepictedInDiagramsNodeAggregateSelection = {
  __typename?: 'BusinessCapabilityDiagramDepictedInDiagramsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  diagramJson: StringAggregateSelection;
  diagramPng: StringAggregateSelection;
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type BusinessCapabilityDisconnectInput = {
  children?: InputMaybe<Array<BusinessCapabilityChildrenDisconnectFieldInput>>;
  company?: InputMaybe<Array<BusinessCapabilityCompanyDisconnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsDisconnectFieldInput>>;
  owners?: InputMaybe<Array<BusinessCapabilityOwnersDisconnectFieldInput>>;
  parents?: InputMaybe<Array<BusinessCapabilityParentsDisconnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesDisconnectFieldInput>>;
  relatedDataObjects?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsDisconnectFieldInput>>;
  supportedByAIAssets?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsDisconnectFieldInput>>;
  supportedByApplications?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsDisconnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsDisconnectFieldInput>>;
};

export type BusinessCapabilityEdge = {
  __typename?: 'BusinessCapabilityEdge';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type BusinessCapabilityOrganisationUsedByOrganisationsAggregateSelection = {
  __typename?: 'BusinessCapabilityOrganisationUsedByOrganisationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<BusinessCapabilityOrganisationUsedByOrganisationsNodeAggregateSelection>;
};

export type BusinessCapabilityOrganisationUsedByOrganisationsNodeAggregateSelection = {
  __typename?: 'BusinessCapabilityOrganisationUsedByOrganisationsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  level: IntAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type BusinessCapabilityOwnersAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityOwnersAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityOwnersAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityOwnersAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<BusinessCapabilityOwnersNodeAggregationWhereInput>;
};

export type BusinessCapabilityOwnersConnectFieldInput = {
  connect?: InputMaybe<Array<PersonConnectInput>>;
  where?: InputMaybe<PersonConnectWhere>;
};

export type BusinessCapabilityOwnersConnection = {
  __typename?: 'BusinessCapabilityOwnersConnection';
  aggregate: BusinessCapabilityPersonOwnersAggregateSelection;
  edges: Array<BusinessCapabilityOwnersRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BusinessCapabilityOwnersConnectionAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityOwnersConnectionAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityOwnersConnectionAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityOwnersConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<BusinessCapabilityOwnersNodeAggregationWhereInput>;
};

export type BusinessCapabilityOwnersConnectionFilters = {
  /** Filter BusinessCapabilities by aggregating results on related BusinessCapabilityOwnersConnections */
  aggregate?: InputMaybe<BusinessCapabilityOwnersConnectionAggregateInput>;
  /** Return BusinessCapabilities where all of the related BusinessCapabilityOwnersConnections match this filter */
  all?: InputMaybe<BusinessCapabilityOwnersConnectionWhere>;
  /** Return BusinessCapabilities where none of the related BusinessCapabilityOwnersConnections match this filter */
  none?: InputMaybe<BusinessCapabilityOwnersConnectionWhere>;
  /** Return BusinessCapabilities where one of the related BusinessCapabilityOwnersConnections match this filter */
  single?: InputMaybe<BusinessCapabilityOwnersConnectionWhere>;
  /** Return BusinessCapabilities where some of the related BusinessCapabilityOwnersConnections match this filter */
  some?: InputMaybe<BusinessCapabilityOwnersConnectionWhere>;
};

export type BusinessCapabilityOwnersConnectionSort = {
  node?: InputMaybe<PersonSort>;
};

export type BusinessCapabilityOwnersConnectionWhere = {
  AND?: InputMaybe<Array<BusinessCapabilityOwnersConnectionWhere>>;
  NOT?: InputMaybe<BusinessCapabilityOwnersConnectionWhere>;
  OR?: InputMaybe<Array<BusinessCapabilityOwnersConnectionWhere>>;
  node?: InputMaybe<PersonWhere>;
};

export type BusinessCapabilityOwnersCreateFieldInput = {
  node: PersonCreateInput;
};

export type BusinessCapabilityOwnersDeleteFieldInput = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<BusinessCapabilityOwnersConnectionWhere>;
};

export type BusinessCapabilityOwnersDisconnectFieldInput = {
  disconnect?: InputMaybe<PersonDisconnectInput>;
  where?: InputMaybe<BusinessCapabilityOwnersConnectionWhere>;
};

export type BusinessCapabilityOwnersFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityOwnersCreateFieldInput>>;
};

export type BusinessCapabilityOwnersNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<BusinessCapabilityOwnersNodeAggregationWhereInput>>;
  NOT?: InputMaybe<BusinessCapabilityOwnersNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<BusinessCapabilityOwnersNodeAggregationWhereInput>>;
  avatarUrl?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  department?: InputMaybe<StringScalarAggregationFilters>;
  email?: InputMaybe<StringScalarAggregationFilters>;
  firstName?: InputMaybe<StringScalarAggregationFilters>;
  lastName?: InputMaybe<StringScalarAggregationFilters>;
  phone?: InputMaybe<StringScalarAggregationFilters>;
  role?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type BusinessCapabilityOwnersRelationship = {
  __typename?: 'BusinessCapabilityOwnersRelationship';
  cursor: Scalars['String']['output'];
  node: Person;
};

export type BusinessCapabilityOwnersUpdateConnectionInput = {
  node?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<BusinessCapabilityOwnersConnectionWhere>;
};

export type BusinessCapabilityOwnersUpdateFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityOwnersCreateFieldInput>>;
  delete?: InputMaybe<Array<BusinessCapabilityOwnersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<BusinessCapabilityOwnersDisconnectFieldInput>>;
  update?: InputMaybe<BusinessCapabilityOwnersUpdateConnectionInput>;
};

export type BusinessCapabilityParentsAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityParentsAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityParentsAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityParentsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<BusinessCapabilityParentsNodeAggregationWhereInput>;
};

export type BusinessCapabilityParentsConnectFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityConnectInput>>;
  where?: InputMaybe<BusinessCapabilityConnectWhere>;
};

export type BusinessCapabilityParentsConnection = {
  __typename?: 'BusinessCapabilityParentsConnection';
  aggregate: BusinessCapabilityBusinessCapabilityParentsAggregateSelection;
  edges: Array<BusinessCapabilityParentsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BusinessCapabilityParentsConnectionAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityParentsConnectionAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityParentsConnectionAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityParentsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<BusinessCapabilityParentsNodeAggregationWhereInput>;
};

export type BusinessCapabilityParentsConnectionFilters = {
  /** Filter BusinessCapabilities by aggregating results on related BusinessCapabilityParentsConnections */
  aggregate?: InputMaybe<BusinessCapabilityParentsConnectionAggregateInput>;
  /** Return BusinessCapabilities where all of the related BusinessCapabilityParentsConnections match this filter */
  all?: InputMaybe<BusinessCapabilityParentsConnectionWhere>;
  /** Return BusinessCapabilities where none of the related BusinessCapabilityParentsConnections match this filter */
  none?: InputMaybe<BusinessCapabilityParentsConnectionWhere>;
  /** Return BusinessCapabilities where one of the related BusinessCapabilityParentsConnections match this filter */
  single?: InputMaybe<BusinessCapabilityParentsConnectionWhere>;
  /** Return BusinessCapabilities where some of the related BusinessCapabilityParentsConnections match this filter */
  some?: InputMaybe<BusinessCapabilityParentsConnectionWhere>;
};

export type BusinessCapabilityParentsConnectionSort = {
  node?: InputMaybe<BusinessCapabilitySort>;
};

export type BusinessCapabilityParentsConnectionWhere = {
  AND?: InputMaybe<Array<BusinessCapabilityParentsConnectionWhere>>;
  NOT?: InputMaybe<BusinessCapabilityParentsConnectionWhere>;
  OR?: InputMaybe<Array<BusinessCapabilityParentsConnectionWhere>>;
  node?: InputMaybe<BusinessCapabilityWhere>;
};

export type BusinessCapabilityParentsCreateFieldInput = {
  node: BusinessCapabilityCreateInput;
};

export type BusinessCapabilityParentsDeleteFieldInput = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<BusinessCapabilityParentsConnectionWhere>;
};

export type BusinessCapabilityParentsDisconnectFieldInput = {
  disconnect?: InputMaybe<BusinessCapabilityDisconnectInput>;
  where?: InputMaybe<BusinessCapabilityParentsConnectionWhere>;
};

export type BusinessCapabilityParentsFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityParentsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityParentsCreateFieldInput>>;
};

export type BusinessCapabilityParentsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<BusinessCapabilityParentsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<BusinessCapabilityParentsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<BusinessCapabilityParentsNodeAggregationWhereInput>>;
  businessValue?: InputMaybe<IntScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  maturityLevel?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  sequenceNumber?: InputMaybe<IntScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type BusinessCapabilityParentsRelationship = {
  __typename?: 'BusinessCapabilityParentsRelationship';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type BusinessCapabilityParentsUpdateConnectionInput = {
  node?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<BusinessCapabilityParentsConnectionWhere>;
};

export type BusinessCapabilityParentsUpdateFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityParentsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityParentsCreateFieldInput>>;
  delete?: InputMaybe<Array<BusinessCapabilityParentsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<BusinessCapabilityParentsDisconnectFieldInput>>;
  update?: InputMaybe<BusinessCapabilityParentsUpdateConnectionInput>;
};

export type BusinessCapabilityPartOfArchitecturesAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityPartOfArchitecturesAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<BusinessCapabilityPartOfArchitecturesNodeAggregationWhereInput>;
};

export type BusinessCapabilityPartOfArchitecturesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type BusinessCapabilityPartOfArchitecturesConnection = {
  __typename?: 'BusinessCapabilityPartOfArchitecturesConnection';
  aggregate: BusinessCapabilityArchitecturePartOfArchitecturesAggregateSelection;
  edges: Array<BusinessCapabilityPartOfArchitecturesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BusinessCapabilityPartOfArchitecturesConnectionAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesConnectionAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<BusinessCapabilityPartOfArchitecturesNodeAggregationWhereInput>;
};

export type BusinessCapabilityPartOfArchitecturesConnectionFilters = {
  /** Filter BusinessCapabilities by aggregating results on related BusinessCapabilityPartOfArchitecturesConnections */
  aggregate?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionAggregateInput>;
  /** Return BusinessCapabilities where all of the related BusinessCapabilityPartOfArchitecturesConnections match this filter */
  all?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionWhere>;
  /** Return BusinessCapabilities where none of the related BusinessCapabilityPartOfArchitecturesConnections match this filter */
  none?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionWhere>;
  /** Return BusinessCapabilities where one of the related BusinessCapabilityPartOfArchitecturesConnections match this filter */
  single?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionWhere>;
  /** Return BusinessCapabilities where some of the related BusinessCapabilityPartOfArchitecturesConnections match this filter */
  some?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionWhere>;
};

export type BusinessCapabilityPartOfArchitecturesConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type BusinessCapabilityPartOfArchitecturesConnectionWhere = {
  AND?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesConnectionWhere>>;
  NOT?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionWhere>;
  OR?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type BusinessCapabilityPartOfArchitecturesCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type BusinessCapabilityPartOfArchitecturesDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionWhere>;
};

export type BusinessCapabilityPartOfArchitecturesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionWhere>;
};

export type BusinessCapabilityPartOfArchitecturesFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesCreateFieldInput>>;
};

export type BusinessCapabilityPartOfArchitecturesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<BusinessCapabilityPartOfArchitecturesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type BusinessCapabilityPartOfArchitecturesRelationship = {
  __typename?: 'BusinessCapabilityPartOfArchitecturesRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type BusinessCapabilityPartOfArchitecturesUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionWhere>;
};

export type BusinessCapabilityPartOfArchitecturesUpdateFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesCreateFieldInput>>;
  delete?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesDisconnectFieldInput>>;
  update?: InputMaybe<BusinessCapabilityPartOfArchitecturesUpdateConnectionInput>;
};

export type BusinessCapabilityPersonOwnersAggregateSelection = {
  __typename?: 'BusinessCapabilityPersonOwnersAggregateSelection';
  count: CountConnection;
  node?: Maybe<BusinessCapabilityPersonOwnersNodeAggregateSelection>;
};

export type BusinessCapabilityPersonOwnersNodeAggregateSelection = {
  __typename?: 'BusinessCapabilityPersonOwnersNodeAggregateSelection';
  avatarUrl: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type BusinessCapabilityRelatedDataObjectsAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityRelatedDataObjectsAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<BusinessCapabilityRelatedDataObjectsNodeAggregationWhereInput>;
};

export type BusinessCapabilityRelatedDataObjectsConnectFieldInput = {
  connect?: InputMaybe<Array<DataObjectConnectInput>>;
  where?: InputMaybe<DataObjectConnectWhere>;
};

export type BusinessCapabilityRelatedDataObjectsConnection = {
  __typename?: 'BusinessCapabilityRelatedDataObjectsConnection';
  aggregate: BusinessCapabilityDataObjectRelatedDataObjectsAggregateSelection;
  edges: Array<BusinessCapabilityRelatedDataObjectsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BusinessCapabilityRelatedDataObjectsConnectionAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsConnectionAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<BusinessCapabilityRelatedDataObjectsNodeAggregationWhereInput>;
};

export type BusinessCapabilityRelatedDataObjectsConnectionFilters = {
  /** Filter BusinessCapabilities by aggregating results on related BusinessCapabilityRelatedDataObjectsConnections */
  aggregate?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionAggregateInput>;
  /** Return BusinessCapabilities where all of the related BusinessCapabilityRelatedDataObjectsConnections match this filter */
  all?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionWhere>;
  /** Return BusinessCapabilities where none of the related BusinessCapabilityRelatedDataObjectsConnections match this filter */
  none?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionWhere>;
  /** Return BusinessCapabilities where one of the related BusinessCapabilityRelatedDataObjectsConnections match this filter */
  single?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionWhere>;
  /** Return BusinessCapabilities where some of the related BusinessCapabilityRelatedDataObjectsConnections match this filter */
  some?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionWhere>;
};

export type BusinessCapabilityRelatedDataObjectsConnectionSort = {
  node?: InputMaybe<DataObjectSort>;
};

export type BusinessCapabilityRelatedDataObjectsConnectionWhere = {
  AND?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsConnectionWhere>>;
  NOT?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionWhere>;
  OR?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsConnectionWhere>>;
  node?: InputMaybe<DataObjectWhere>;
};

export type BusinessCapabilityRelatedDataObjectsCreateFieldInput = {
  node: DataObjectCreateInput;
};

export type BusinessCapabilityRelatedDataObjectsDeleteFieldInput = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionWhere>;
};

export type BusinessCapabilityRelatedDataObjectsDisconnectFieldInput = {
  disconnect?: InputMaybe<DataObjectDisconnectInput>;
  where?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionWhere>;
};

export type BusinessCapabilityRelatedDataObjectsFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsCreateFieldInput>>;
};

export type BusinessCapabilityRelatedDataObjectsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<BusinessCapabilityRelatedDataObjectsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  format?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type BusinessCapabilityRelatedDataObjectsRelationship = {
  __typename?: 'BusinessCapabilityRelatedDataObjectsRelationship';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type BusinessCapabilityRelatedDataObjectsUpdateConnectionInput = {
  node?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionWhere>;
};

export type BusinessCapabilityRelatedDataObjectsUpdateFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsCreateFieldInput>>;
  delete?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsDisconnectFieldInput>>;
  update?: InputMaybe<BusinessCapabilityRelatedDataObjectsUpdateConnectionInput>;
};

export type BusinessCapabilityRelationshipFilters = {
  /** Filter type where all of the related BusinessCapabilities match this filter */
  all?: InputMaybe<BusinessCapabilityWhere>;
  /** Filter type where none of the related BusinessCapabilities match this filter */
  none?: InputMaybe<BusinessCapabilityWhere>;
  /** Filter type where one of the related BusinessCapabilities match this filter */
  single?: InputMaybe<BusinessCapabilityWhere>;
  /** Filter type where some of the related BusinessCapabilities match this filter */
  some?: InputMaybe<BusinessCapabilityWhere>;
};

/** Fields to sort BusinessCapabilities by. The order in which sorts are applied is not guaranteed when specifying many fields in one BusinessCapabilitySort object. */
export type BusinessCapabilitySort = {
  businessValue?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  endDate?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  introductionDate?: InputMaybe<SortDirection>;
  maturityLevel?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  sequenceNumber?: InputMaybe<SortDirection>;
  status?: InputMaybe<SortDirection>;
  type?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type BusinessCapabilitySupportedByAiAssetsAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilitySupportedByAiAssetsAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<BusinessCapabilitySupportedByAiAssetsNodeAggregationWhereInput>;
};

export type BusinessCapabilitySupportedByAiAssetsConnectFieldInput = {
  connect?: InputMaybe<Array<AiAssetConnectInput>>;
  where?: InputMaybe<AiAssetConnectWhere>;
};

export type BusinessCapabilitySupportedByAiAssetsConnection = {
  __typename?: 'BusinessCapabilitySupportedByAIAssetsConnection';
  aggregate: BusinessCapabilityAiAssetSupportedByAiAssetsAggregateSelection;
  edges: Array<BusinessCapabilitySupportedByAiAssetsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BusinessCapabilitySupportedByAiAssetsConnectionAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsConnectionAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<BusinessCapabilitySupportedByAiAssetsNodeAggregationWhereInput>;
};

export type BusinessCapabilitySupportedByAiAssetsConnectionFilters = {
  /** Filter BusinessCapabilities by aggregating results on related BusinessCapabilitySupportedByAIAssetsConnections */
  aggregate?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionAggregateInput>;
  /** Return BusinessCapabilities where all of the related BusinessCapabilitySupportedByAIAssetsConnections match this filter */
  all?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionWhere>;
  /** Return BusinessCapabilities where none of the related BusinessCapabilitySupportedByAIAssetsConnections match this filter */
  none?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionWhere>;
  /** Return BusinessCapabilities where one of the related BusinessCapabilitySupportedByAIAssetsConnections match this filter */
  single?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionWhere>;
  /** Return BusinessCapabilities where some of the related BusinessCapabilitySupportedByAIAssetsConnections match this filter */
  some?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionWhere>;
};

export type BusinessCapabilitySupportedByAiAssetsConnectionSort = {
  node?: InputMaybe<AiAssetSort>;
};

export type BusinessCapabilitySupportedByAiAssetsConnectionWhere = {
  AND?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsConnectionWhere>>;
  NOT?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionWhere>;
  OR?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsConnectionWhere>>;
  node?: InputMaybe<AiAssetWhere>;
};

export type BusinessCapabilitySupportedByAiAssetsCreateFieldInput = {
  node: AiAssetCreateInput;
};

export type BusinessCapabilitySupportedByAiAssetsDeleteFieldInput = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionWhere>;
};

export type BusinessCapabilitySupportedByAiAssetsDisconnectFieldInput = {
  disconnect?: InputMaybe<AiAssetDisconnectInput>;
  where?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionWhere>;
};

export type BusinessCapabilitySupportedByAiAssetsFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsCreateFieldInput>>;
};

export type BusinessCapabilitySupportedByAiAssetsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<BusinessCapabilitySupportedByAiAssetsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsNodeAggregationWhereInput>>;
  accuracy?: InputMaybe<FloatScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  license?: InputMaybe<StringScalarAggregationFilters>;
  model?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  provider?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type BusinessCapabilitySupportedByAiAssetsRelationship = {
  __typename?: 'BusinessCapabilitySupportedByAIAssetsRelationship';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type BusinessCapabilitySupportedByAiAssetsUpdateConnectionInput = {
  node?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionWhere>;
};

export type BusinessCapabilitySupportedByAiAssetsUpdateFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsCreateFieldInput>>;
  delete?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsDisconnectFieldInput>>;
  update?: InputMaybe<BusinessCapabilitySupportedByAiAssetsUpdateConnectionInput>;
};

export type BusinessCapabilitySupportedByApplicationsAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilitySupportedByApplicationsAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<BusinessCapabilitySupportedByApplicationsNodeAggregationWhereInput>;
};

export type BusinessCapabilitySupportedByApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type BusinessCapabilitySupportedByApplicationsConnection = {
  __typename?: 'BusinessCapabilitySupportedByApplicationsConnection';
  aggregate: BusinessCapabilityApplicationSupportedByApplicationsAggregateSelection;
  edges: Array<BusinessCapabilitySupportedByApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BusinessCapabilitySupportedByApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<BusinessCapabilitySupportedByApplicationsNodeAggregationWhereInput>;
};

export type BusinessCapabilitySupportedByApplicationsConnectionFilters = {
  /** Filter BusinessCapabilities by aggregating results on related BusinessCapabilitySupportedByApplicationsConnections */
  aggregate?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionAggregateInput>;
  /** Return BusinessCapabilities where all of the related BusinessCapabilitySupportedByApplicationsConnections match this filter */
  all?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionWhere>;
  /** Return BusinessCapabilities where none of the related BusinessCapabilitySupportedByApplicationsConnections match this filter */
  none?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionWhere>;
  /** Return BusinessCapabilities where one of the related BusinessCapabilitySupportedByApplicationsConnections match this filter */
  single?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionWhere>;
  /** Return BusinessCapabilities where some of the related BusinessCapabilitySupportedByApplicationsConnections match this filter */
  some?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionWhere>;
};

export type BusinessCapabilitySupportedByApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type BusinessCapabilitySupportedByApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsConnectionWhere>>;
  NOT?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type BusinessCapabilitySupportedByApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type BusinessCapabilitySupportedByApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionWhere>;
};

export type BusinessCapabilitySupportedByApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionWhere>;
};

export type BusinessCapabilitySupportedByApplicationsFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsCreateFieldInput>>;
};

export type BusinessCapabilitySupportedByApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<BusinessCapabilitySupportedByApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type BusinessCapabilitySupportedByApplicationsRelationship = {
  __typename?: 'BusinessCapabilitySupportedByApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type BusinessCapabilitySupportedByApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionWhere>;
};

export type BusinessCapabilitySupportedByApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<BusinessCapabilitySupportedByApplicationsUpdateConnectionInput>;
};

export type BusinessCapabilityUpdateInput = {
  businessValue?: InputMaybe<IntScalarMutations>;
  children?: InputMaybe<Array<BusinessCapabilityChildrenUpdateFieldInput>>;
  company?: InputMaybe<Array<BusinessCapabilityCompanyUpdateFieldInput>>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  depictedInDiagrams?: InputMaybe<Array<BusinessCapabilityDepictedInDiagramsUpdateFieldInput>>;
  description?: InputMaybe<StringScalarMutations>;
  endDate?: InputMaybe<DateScalarMutations>;
  introductionDate?: InputMaybe<DateScalarMutations>;
  maturityLevel?: InputMaybe<IntScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<BusinessCapabilityOwnersUpdateFieldInput>>;
  parents?: InputMaybe<Array<BusinessCapabilityParentsUpdateFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesUpdateFieldInput>>;
  relatedDataObjects?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsUpdateFieldInput>>;
  sequenceNumber?: InputMaybe<IntScalarMutations>;
  status?: InputMaybe<CapabilityStatusEnumScalarMutations>;
  supportedByAIAssets?: InputMaybe<Array<BusinessCapabilitySupportedByAiAssetsUpdateFieldInput>>;
  supportedByApplications?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsUpdateFieldInput>>;
  tags?: InputMaybe<ListStringMutations>;
  type?: InputMaybe<CapabilityTypeEnumScalarMutations>;
  usedByOrganisations?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsUpdateFieldInput>>;
};

export type BusinessCapabilityUsedByOrganisationsAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityUsedByOrganisationsAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<BusinessCapabilityUsedByOrganisationsNodeAggregationWhereInput>;
};

export type BusinessCapabilityUsedByOrganisationsConnectFieldInput = {
  connect?: InputMaybe<Array<OrganisationConnectInput>>;
  where?: InputMaybe<OrganisationConnectWhere>;
};

export type BusinessCapabilityUsedByOrganisationsConnection = {
  __typename?: 'BusinessCapabilityUsedByOrganisationsConnection';
  aggregate: BusinessCapabilityOrganisationUsedByOrganisationsAggregateSelection;
  edges: Array<BusinessCapabilityUsedByOrganisationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BusinessCapabilityUsedByOrganisationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsConnectionAggregateInput>>;
  NOT?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<BusinessCapabilityUsedByOrganisationsNodeAggregationWhereInput>;
};

export type BusinessCapabilityUsedByOrganisationsConnectionFilters = {
  /** Filter BusinessCapabilities by aggregating results on related BusinessCapabilityUsedByOrganisationsConnections */
  aggregate?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionAggregateInput>;
  /** Return BusinessCapabilities where all of the related BusinessCapabilityUsedByOrganisationsConnections match this filter */
  all?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionWhere>;
  /** Return BusinessCapabilities where none of the related BusinessCapabilityUsedByOrganisationsConnections match this filter */
  none?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionWhere>;
  /** Return BusinessCapabilities where one of the related BusinessCapabilityUsedByOrganisationsConnections match this filter */
  single?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionWhere>;
  /** Return BusinessCapabilities where some of the related BusinessCapabilityUsedByOrganisationsConnections match this filter */
  some?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionWhere>;
};

export type BusinessCapabilityUsedByOrganisationsConnectionSort = {
  node?: InputMaybe<OrganisationSort>;
};

export type BusinessCapabilityUsedByOrganisationsConnectionWhere = {
  AND?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsConnectionWhere>>;
  NOT?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionWhere>;
  OR?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsConnectionWhere>>;
  node?: InputMaybe<OrganisationWhere>;
};

export type BusinessCapabilityUsedByOrganisationsCreateFieldInput = {
  node: OrganisationCreateInput;
};

export type BusinessCapabilityUsedByOrganisationsDeleteFieldInput = {
  delete?: InputMaybe<OrganisationDeleteInput>;
  where?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionWhere>;
};

export type BusinessCapabilityUsedByOrganisationsDisconnectFieldInput = {
  disconnect?: InputMaybe<OrganisationDisconnectInput>;
  where?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionWhere>;
};

export type BusinessCapabilityUsedByOrganisationsFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsCreateFieldInput>>;
};

export type BusinessCapabilityUsedByOrganisationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<BusinessCapabilityUsedByOrganisationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  level?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type BusinessCapabilityUsedByOrganisationsRelationship = {
  __typename?: 'BusinessCapabilityUsedByOrganisationsRelationship';
  cursor: Scalars['String']['output'];
  node: Organisation;
};

export type BusinessCapabilityUsedByOrganisationsUpdateConnectionInput = {
  node?: InputMaybe<OrganisationUpdateInput>;
  where?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionWhere>;
};

export type BusinessCapabilityUsedByOrganisationsUpdateFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsCreateFieldInput>>;
  delete?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<BusinessCapabilityUsedByOrganisationsDisconnectFieldInput>>;
  update?: InputMaybe<BusinessCapabilityUsedByOrganisationsUpdateConnectionInput>;
};

export type BusinessCapabilityWhere = {
  AND?: InputMaybe<Array<BusinessCapabilityWhere>>;
  NOT?: InputMaybe<BusinessCapabilityWhere>;
  OR?: InputMaybe<Array<BusinessCapabilityWhere>>;
  businessValue?: InputMaybe<IntScalarFilters>;
  children?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  childrenConnection?: InputMaybe<BusinessCapabilityChildrenConnectionFilters>;
  company?: InputMaybe<CompanyRelationshipFilters>;
  companyConnection?: InputMaybe<BusinessCapabilityCompanyConnectionFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  depictedInDiagrams?: InputMaybe<DiagramRelationshipFilters>;
  depictedInDiagramsConnection?: InputMaybe<BusinessCapabilityDepictedInDiagramsConnectionFilters>;
  description?: InputMaybe<StringScalarFilters>;
  endDate?: InputMaybe<DateScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  introductionDate?: InputMaybe<DateScalarFilters>;
  maturityLevel?: InputMaybe<IntScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  owners?: InputMaybe<PersonRelationshipFilters>;
  ownersConnection?: InputMaybe<BusinessCapabilityOwnersConnectionFilters>;
  parents?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  parentsConnection?: InputMaybe<BusinessCapabilityParentsConnectionFilters>;
  partOfArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  partOfArchitecturesConnection?: InputMaybe<BusinessCapabilityPartOfArchitecturesConnectionFilters>;
  relatedDataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  relatedDataObjectsConnection?: InputMaybe<BusinessCapabilityRelatedDataObjectsConnectionFilters>;
  sequenceNumber?: InputMaybe<IntScalarFilters>;
  status?: InputMaybe<CapabilityStatusEnumScalarFilters>;
  supportedByAIAssets?: InputMaybe<AiAssetRelationshipFilters>;
  supportedByAIAssetsConnection?: InputMaybe<BusinessCapabilitySupportedByAiAssetsConnectionFilters>;
  supportedByApplications?: InputMaybe<ApplicationRelationshipFilters>;
  supportedByApplicationsConnection?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionFilters>;
  tags?: InputMaybe<StringListFilters>;
  type?: InputMaybe<CapabilityTypeEnumScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
  usedByOrganisations?: InputMaybe<OrganisationRelationshipFilters>;
  usedByOrganisationsConnection?: InputMaybe<BusinessCapabilityUsedByOrganisationsConnectionFilters>;
};

/** Mögliche Status-Werte für eine Business Capability */
export enum CapabilityStatus {
  ACTIVE = 'ACTIVE',
  PLANNED = 'PLANNED',
  RETIRED = 'RETIRED'
}

/** CapabilityStatus filters */
export type CapabilityStatusEnumScalarFilters = {
  eq?: InputMaybe<CapabilityStatus>;
  in?: InputMaybe<Array<CapabilityStatus>>;
};

/** CapabilityStatus mutations */
export type CapabilityStatusEnumScalarMutations = {
  set?: InputMaybe<CapabilityStatus>;
};

/** Typen für Business Capabilities */
export enum CapabilityType {
  OPERATIONAL = 'OPERATIONAL',
  STRATEGIC = 'STRATEGIC',
  SUPPORT = 'SUPPORT'
}

/** CapabilityType filters */
export type CapabilityTypeEnumScalarFilters = {
  eq?: InputMaybe<CapabilityType>;
  in?: InputMaybe<Array<CapabilityType>>;
};

/** CapabilityType mutations */
export type CapabilityTypeEnumScalarMutations = {
  set?: InputMaybe<CapabilityType>;
};

export type CompaniesConnection = {
  __typename?: 'CompaniesConnection';
  aggregate: CompanyAggregate;
  edges: Array<CompanyEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type Company = {
  __typename?: 'Company';
  address?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  industry?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  organisations: Array<Organisation>;
  organisationsConnection: CompanyOrganisationsConnection;
  ownedAIAssets: Array<AiAsset>;
  ownedAIAssetsConnection: CompanyOwnedAiAssetsConnection;
  ownedApplications: Array<Application>;
  ownedApplicationsConnection: CompanyOwnedApplicationsConnection;
  ownedCapabilities: Array<BusinessCapability>;
  ownedCapabilitiesConnection: CompanyOwnedCapabilitiesConnection;
  ownedDataObjects: Array<DataObject>;
  ownedDataObjectsConnection: CompanyOwnedDataObjectsConnection;
  ownedInfrastructure: Array<Infrastructure>;
  ownedInfrastructureConnection: CompanyOwnedInfrastructureConnection;
  ownedInterfaces: Array<ApplicationInterface>;
  ownedInterfacesConnection: CompanyOwnedInterfacesConnection;
  size?: Maybe<CompanySize>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOrganisationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanyOrganisationsConnectionSort>>;
  where?: InputMaybe<CompanyOrganisationsConnectionWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedAiAssetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedAiAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanyOwnedAiAssetsConnectionSort>>;
  where?: InputMaybe<CompanyOwnedAiAssetsConnectionWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanyOwnedApplicationsConnectionSort>>;
  where?: InputMaybe<CompanyOwnedApplicationsConnectionWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedCapabilitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedCapabilitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanyOwnedCapabilitiesConnectionSort>>;
  where?: InputMaybe<CompanyOwnedCapabilitiesConnectionWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanyOwnedDataObjectsConnectionSort>>;
  where?: InputMaybe<CompanyOwnedDataObjectsConnectionWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedInfrastructureArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedInfrastructureConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanyOwnedInfrastructureConnectionSort>>;
  where?: InputMaybe<CompanyOwnedInfrastructureConnectionWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedInterfacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** Company - repräsentiert ein Unternehmen im Enterprise Architecture Management */
export type CompanyOwnedInterfacesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanyOwnedInterfacesConnectionSort>>;
  where?: InputMaybe<CompanyOwnedInterfacesConnectionWhere>;
};

export type CompanyAiAssetOwnedAiAssetsAggregateSelection = {
  __typename?: 'CompanyAIAssetOwnedAIAssetsAggregateSelection';
  count: CountConnection;
  node?: Maybe<CompanyAiAssetOwnedAiAssetsNodeAggregateSelection>;
};

export type CompanyAiAssetOwnedAiAssetsNodeAggregateSelection = {
  __typename?: 'CompanyAIAssetOwnedAIAssetsNodeAggregateSelection';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type CompanyAggregate = {
  __typename?: 'CompanyAggregate';
  count: Count;
  node: CompanyAggregateNode;
};

export type CompanyAggregateNode = {
  __typename?: 'CompanyAggregateNode';
  address: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  industry: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  website: StringAggregateSelection;
};

export type CompanyApplicationInterfaceOwnedInterfacesAggregateSelection = {
  __typename?: 'CompanyApplicationInterfaceOwnedInterfacesAggregateSelection';
  count: CountConnection;
  node?: Maybe<CompanyApplicationInterfaceOwnedInterfacesNodeAggregateSelection>;
};

export type CompanyApplicationInterfaceOwnedInterfacesNodeAggregateSelection = {
  __typename?: 'CompanyApplicationInterfaceOwnedInterfacesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type CompanyApplicationOwnedApplicationsAggregateSelection = {
  __typename?: 'CompanyApplicationOwnedApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<CompanyApplicationOwnedApplicationsNodeAggregateSelection>;
};

export type CompanyApplicationOwnedApplicationsNodeAggregateSelection = {
  __typename?: 'CompanyApplicationOwnedApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type CompanyBusinessCapabilityOwnedCapabilitiesAggregateSelection = {
  __typename?: 'CompanyBusinessCapabilityOwnedCapabilitiesAggregateSelection';
  count: CountConnection;
  node?: Maybe<CompanyBusinessCapabilityOwnedCapabilitiesNodeAggregateSelection>;
};

export type CompanyBusinessCapabilityOwnedCapabilitiesNodeAggregateSelection = {
  __typename?: 'CompanyBusinessCapabilityOwnedCapabilitiesNodeAggregateSelection';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type CompanyConnectInput = {
  organisations?: InputMaybe<Array<CompanyOrganisationsConnectFieldInput>>;
  ownedAIAssets?: InputMaybe<Array<CompanyOwnedAiAssetsConnectFieldInput>>;
  ownedApplications?: InputMaybe<Array<CompanyOwnedApplicationsConnectFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<CompanyOwnedCapabilitiesConnectFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<CompanyOwnedDataObjectsConnectFieldInput>>;
  ownedInfrastructure?: InputMaybe<Array<CompanyOwnedInfrastructureConnectFieldInput>>;
  ownedInterfaces?: InputMaybe<Array<CompanyOwnedInterfacesConnectFieldInput>>;
};

export type CompanyConnectWhere = {
  node: CompanyWhere;
};

export type CompanyCreateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organisations?: InputMaybe<CompanyOrganisationsFieldInput>;
  ownedAIAssets?: InputMaybe<CompanyOwnedAiAssetsFieldInput>;
  ownedApplications?: InputMaybe<CompanyOwnedApplicationsFieldInput>;
  ownedCapabilities?: InputMaybe<CompanyOwnedCapabilitiesFieldInput>;
  ownedDataObjects?: InputMaybe<CompanyOwnedDataObjectsFieldInput>;
  ownedInfrastructure?: InputMaybe<CompanyOwnedInfrastructureFieldInput>;
  ownedInterfaces?: InputMaybe<CompanyOwnedInterfacesFieldInput>;
  size?: InputMaybe<CompanySize>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CompanyDataObjectOwnedDataObjectsAggregateSelection = {
  __typename?: 'CompanyDataObjectOwnedDataObjectsAggregateSelection';
  count: CountConnection;
  node?: Maybe<CompanyDataObjectOwnedDataObjectsNodeAggregateSelection>;
};

export type CompanyDataObjectOwnedDataObjectsNodeAggregateSelection = {
  __typename?: 'CompanyDataObjectOwnedDataObjectsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type CompanyDeleteInput = {
  organisations?: InputMaybe<Array<CompanyOrganisationsDeleteFieldInput>>;
  ownedAIAssets?: InputMaybe<Array<CompanyOwnedAiAssetsDeleteFieldInput>>;
  ownedApplications?: InputMaybe<Array<CompanyOwnedApplicationsDeleteFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<CompanyOwnedCapabilitiesDeleteFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<CompanyOwnedDataObjectsDeleteFieldInput>>;
  ownedInfrastructure?: InputMaybe<Array<CompanyOwnedInfrastructureDeleteFieldInput>>;
  ownedInterfaces?: InputMaybe<Array<CompanyOwnedInterfacesDeleteFieldInput>>;
};

export type CompanyDisconnectInput = {
  organisations?: InputMaybe<Array<CompanyOrganisationsDisconnectFieldInput>>;
  ownedAIAssets?: InputMaybe<Array<CompanyOwnedAiAssetsDisconnectFieldInput>>;
  ownedApplications?: InputMaybe<Array<CompanyOwnedApplicationsDisconnectFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<CompanyOwnedCapabilitiesDisconnectFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<CompanyOwnedDataObjectsDisconnectFieldInput>>;
  ownedInfrastructure?: InputMaybe<Array<CompanyOwnedInfrastructureDisconnectFieldInput>>;
  ownedInterfaces?: InputMaybe<Array<CompanyOwnedInterfacesDisconnectFieldInput>>;
};

export type CompanyEdge = {
  __typename?: 'CompanyEdge';
  cursor: Scalars['String']['output'];
  node: Company;
};

export type CompanyInfrastructureOwnedInfrastructureAggregateSelection = {
  __typename?: 'CompanyInfrastructureOwnedInfrastructureAggregateSelection';
  count: CountConnection;
  node?: Maybe<CompanyInfrastructureOwnedInfrastructureNodeAggregateSelection>;
};

export type CompanyInfrastructureOwnedInfrastructureNodeAggregateSelection = {
  __typename?: 'CompanyInfrastructureOwnedInfrastructureNodeAggregateSelection';
  capacity: StringAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  ipAddress: StringAggregateSelection;
  location: StringAggregateSelection;
  maintenanceWindow: StringAggregateSelection;
  name: StringAggregateSelection;
  operatingSystem: StringAggregateSelection;
  specifications: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type CompanyOrganisationOrganisationsAggregateSelection = {
  __typename?: 'CompanyOrganisationOrganisationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<CompanyOrganisationOrganisationsNodeAggregateSelection>;
};

export type CompanyOrganisationOrganisationsNodeAggregateSelection = {
  __typename?: 'CompanyOrganisationOrganisationsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  level: IntAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type CompanyOrganisationsAggregateInput = {
  AND?: InputMaybe<Array<CompanyOrganisationsAggregateInput>>;
  NOT?: InputMaybe<CompanyOrganisationsAggregateInput>;
  OR?: InputMaybe<Array<CompanyOrganisationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CompanyOrganisationsNodeAggregationWhereInput>;
};

export type CompanyOrganisationsConnectFieldInput = {
  connect?: InputMaybe<Array<OrganisationConnectInput>>;
  where?: InputMaybe<OrganisationConnectWhere>;
};

export type CompanyOrganisationsConnection = {
  __typename?: 'CompanyOrganisationsConnection';
  aggregate: CompanyOrganisationOrganisationsAggregateSelection;
  edges: Array<CompanyOrganisationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CompanyOrganisationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<CompanyOrganisationsConnectionAggregateInput>>;
  NOT?: InputMaybe<CompanyOrganisationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<CompanyOrganisationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<CompanyOrganisationsNodeAggregationWhereInput>;
};

export type CompanyOrganisationsConnectionFilters = {
  /** Filter Companies by aggregating results on related CompanyOrganisationsConnections */
  aggregate?: InputMaybe<CompanyOrganisationsConnectionAggregateInput>;
  /** Return Companies where all of the related CompanyOrganisationsConnections match this filter */
  all?: InputMaybe<CompanyOrganisationsConnectionWhere>;
  /** Return Companies where none of the related CompanyOrganisationsConnections match this filter */
  none?: InputMaybe<CompanyOrganisationsConnectionWhere>;
  /** Return Companies where one of the related CompanyOrganisationsConnections match this filter */
  single?: InputMaybe<CompanyOrganisationsConnectionWhere>;
  /** Return Companies where some of the related CompanyOrganisationsConnections match this filter */
  some?: InputMaybe<CompanyOrganisationsConnectionWhere>;
};

export type CompanyOrganisationsConnectionSort = {
  node?: InputMaybe<OrganisationSort>;
};

export type CompanyOrganisationsConnectionWhere = {
  AND?: InputMaybe<Array<CompanyOrganisationsConnectionWhere>>;
  NOT?: InputMaybe<CompanyOrganisationsConnectionWhere>;
  OR?: InputMaybe<Array<CompanyOrganisationsConnectionWhere>>;
  node?: InputMaybe<OrganisationWhere>;
};

export type CompanyOrganisationsCreateFieldInput = {
  node: OrganisationCreateInput;
};

export type CompanyOrganisationsDeleteFieldInput = {
  delete?: InputMaybe<OrganisationDeleteInput>;
  where?: InputMaybe<CompanyOrganisationsConnectionWhere>;
};

export type CompanyOrganisationsDisconnectFieldInput = {
  disconnect?: InputMaybe<OrganisationDisconnectInput>;
  where?: InputMaybe<CompanyOrganisationsConnectionWhere>;
};

export type CompanyOrganisationsFieldInput = {
  connect?: InputMaybe<Array<CompanyOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOrganisationsCreateFieldInput>>;
};

export type CompanyOrganisationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CompanyOrganisationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CompanyOrganisationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CompanyOrganisationsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  level?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type CompanyOrganisationsRelationship = {
  __typename?: 'CompanyOrganisationsRelationship';
  cursor: Scalars['String']['output'];
  node: Organisation;
};

export type CompanyOrganisationsUpdateConnectionInput = {
  node?: InputMaybe<OrganisationUpdateInput>;
  where?: InputMaybe<CompanyOrganisationsConnectionWhere>;
};

export type CompanyOrganisationsUpdateFieldInput = {
  connect?: InputMaybe<Array<CompanyOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOrganisationsCreateFieldInput>>;
  delete?: InputMaybe<Array<CompanyOrganisationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<CompanyOrganisationsDisconnectFieldInput>>;
  update?: InputMaybe<CompanyOrganisationsUpdateConnectionInput>;
};

export type CompanyOwnedAiAssetsAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedAiAssetsAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedAiAssetsAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedAiAssetsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CompanyOwnedAiAssetsNodeAggregationWhereInput>;
};

export type CompanyOwnedAiAssetsConnectFieldInput = {
  connect?: InputMaybe<Array<AiAssetConnectInput>>;
  where?: InputMaybe<AiAssetConnectWhere>;
};

export type CompanyOwnedAiAssetsConnection = {
  __typename?: 'CompanyOwnedAIAssetsConnection';
  aggregate: CompanyAiAssetOwnedAiAssetsAggregateSelection;
  edges: Array<CompanyOwnedAiAssetsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CompanyOwnedAiAssetsConnectionAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedAiAssetsConnectionAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedAiAssetsConnectionAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedAiAssetsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<CompanyOwnedAiAssetsNodeAggregationWhereInput>;
};

export type CompanyOwnedAiAssetsConnectionFilters = {
  /** Filter Companies by aggregating results on related CompanyOwnedAIAssetsConnections */
  aggregate?: InputMaybe<CompanyOwnedAiAssetsConnectionAggregateInput>;
  /** Return Companies where all of the related CompanyOwnedAIAssetsConnections match this filter */
  all?: InputMaybe<CompanyOwnedAiAssetsConnectionWhere>;
  /** Return Companies where none of the related CompanyOwnedAIAssetsConnections match this filter */
  none?: InputMaybe<CompanyOwnedAiAssetsConnectionWhere>;
  /** Return Companies where one of the related CompanyOwnedAIAssetsConnections match this filter */
  single?: InputMaybe<CompanyOwnedAiAssetsConnectionWhere>;
  /** Return Companies where some of the related CompanyOwnedAIAssetsConnections match this filter */
  some?: InputMaybe<CompanyOwnedAiAssetsConnectionWhere>;
};

export type CompanyOwnedAiAssetsConnectionSort = {
  node?: InputMaybe<AiAssetSort>;
};

export type CompanyOwnedAiAssetsConnectionWhere = {
  AND?: InputMaybe<Array<CompanyOwnedAiAssetsConnectionWhere>>;
  NOT?: InputMaybe<CompanyOwnedAiAssetsConnectionWhere>;
  OR?: InputMaybe<Array<CompanyOwnedAiAssetsConnectionWhere>>;
  node?: InputMaybe<AiAssetWhere>;
};

export type CompanyOwnedAiAssetsCreateFieldInput = {
  node: AiAssetCreateInput;
};

export type CompanyOwnedAiAssetsDeleteFieldInput = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<CompanyOwnedAiAssetsConnectionWhere>;
};

export type CompanyOwnedAiAssetsDisconnectFieldInput = {
  disconnect?: InputMaybe<AiAssetDisconnectInput>;
  where?: InputMaybe<CompanyOwnedAiAssetsConnectionWhere>;
};

export type CompanyOwnedAiAssetsFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedAiAssetsCreateFieldInput>>;
};

export type CompanyOwnedAiAssetsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CompanyOwnedAiAssetsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CompanyOwnedAiAssetsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CompanyOwnedAiAssetsNodeAggregationWhereInput>>;
  accuracy?: InputMaybe<FloatScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  license?: InputMaybe<StringScalarAggregationFilters>;
  model?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  provider?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type CompanyOwnedAiAssetsRelationship = {
  __typename?: 'CompanyOwnedAIAssetsRelationship';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type CompanyOwnedAiAssetsUpdateConnectionInput = {
  node?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<CompanyOwnedAiAssetsConnectionWhere>;
};

export type CompanyOwnedAiAssetsUpdateFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedAiAssetsCreateFieldInput>>;
  delete?: InputMaybe<Array<CompanyOwnedAiAssetsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<CompanyOwnedAiAssetsDisconnectFieldInput>>;
  update?: InputMaybe<CompanyOwnedAiAssetsUpdateConnectionInput>;
};

export type CompanyOwnedApplicationsAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedApplicationsAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedApplicationsAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CompanyOwnedApplicationsNodeAggregationWhereInput>;
};

export type CompanyOwnedApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type CompanyOwnedApplicationsConnection = {
  __typename?: 'CompanyOwnedApplicationsConnection';
  aggregate: CompanyApplicationOwnedApplicationsAggregateSelection;
  edges: Array<CompanyOwnedApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CompanyOwnedApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<CompanyOwnedApplicationsNodeAggregationWhereInput>;
};

export type CompanyOwnedApplicationsConnectionFilters = {
  /** Filter Companies by aggregating results on related CompanyOwnedApplicationsConnections */
  aggregate?: InputMaybe<CompanyOwnedApplicationsConnectionAggregateInput>;
  /** Return Companies where all of the related CompanyOwnedApplicationsConnections match this filter */
  all?: InputMaybe<CompanyOwnedApplicationsConnectionWhere>;
  /** Return Companies where none of the related CompanyOwnedApplicationsConnections match this filter */
  none?: InputMaybe<CompanyOwnedApplicationsConnectionWhere>;
  /** Return Companies where one of the related CompanyOwnedApplicationsConnections match this filter */
  single?: InputMaybe<CompanyOwnedApplicationsConnectionWhere>;
  /** Return Companies where some of the related CompanyOwnedApplicationsConnections match this filter */
  some?: InputMaybe<CompanyOwnedApplicationsConnectionWhere>;
};

export type CompanyOwnedApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type CompanyOwnedApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<CompanyOwnedApplicationsConnectionWhere>>;
  NOT?: InputMaybe<CompanyOwnedApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<CompanyOwnedApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type CompanyOwnedApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type CompanyOwnedApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<CompanyOwnedApplicationsConnectionWhere>;
};

export type CompanyOwnedApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<CompanyOwnedApplicationsConnectionWhere>;
};

export type CompanyOwnedApplicationsFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedApplicationsCreateFieldInput>>;
};

export type CompanyOwnedApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CompanyOwnedApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CompanyOwnedApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CompanyOwnedApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type CompanyOwnedApplicationsRelationship = {
  __typename?: 'CompanyOwnedApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type CompanyOwnedApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<CompanyOwnedApplicationsConnectionWhere>;
};

export type CompanyOwnedApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<CompanyOwnedApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<CompanyOwnedApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<CompanyOwnedApplicationsUpdateConnectionInput>;
};

export type CompanyOwnedCapabilitiesAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedCapabilitiesAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedCapabilitiesAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedCapabilitiesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CompanyOwnedCapabilitiesNodeAggregationWhereInput>;
};

export type CompanyOwnedCapabilitiesConnectFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityConnectInput>>;
  where?: InputMaybe<BusinessCapabilityConnectWhere>;
};

export type CompanyOwnedCapabilitiesConnection = {
  __typename?: 'CompanyOwnedCapabilitiesConnection';
  aggregate: CompanyBusinessCapabilityOwnedCapabilitiesAggregateSelection;
  edges: Array<CompanyOwnedCapabilitiesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CompanyOwnedCapabilitiesConnectionAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedCapabilitiesConnectionAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedCapabilitiesConnectionAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedCapabilitiesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<CompanyOwnedCapabilitiesNodeAggregationWhereInput>;
};

export type CompanyOwnedCapabilitiesConnectionFilters = {
  /** Filter Companies by aggregating results on related CompanyOwnedCapabilitiesConnections */
  aggregate?: InputMaybe<CompanyOwnedCapabilitiesConnectionAggregateInput>;
  /** Return Companies where all of the related CompanyOwnedCapabilitiesConnections match this filter */
  all?: InputMaybe<CompanyOwnedCapabilitiesConnectionWhere>;
  /** Return Companies where none of the related CompanyOwnedCapabilitiesConnections match this filter */
  none?: InputMaybe<CompanyOwnedCapabilitiesConnectionWhere>;
  /** Return Companies where one of the related CompanyOwnedCapabilitiesConnections match this filter */
  single?: InputMaybe<CompanyOwnedCapabilitiesConnectionWhere>;
  /** Return Companies where some of the related CompanyOwnedCapabilitiesConnections match this filter */
  some?: InputMaybe<CompanyOwnedCapabilitiesConnectionWhere>;
};

export type CompanyOwnedCapabilitiesConnectionSort = {
  node?: InputMaybe<BusinessCapabilitySort>;
};

export type CompanyOwnedCapabilitiesConnectionWhere = {
  AND?: InputMaybe<Array<CompanyOwnedCapabilitiesConnectionWhere>>;
  NOT?: InputMaybe<CompanyOwnedCapabilitiesConnectionWhere>;
  OR?: InputMaybe<Array<CompanyOwnedCapabilitiesConnectionWhere>>;
  node?: InputMaybe<BusinessCapabilityWhere>;
};

export type CompanyOwnedCapabilitiesCreateFieldInput = {
  node: BusinessCapabilityCreateInput;
};

export type CompanyOwnedCapabilitiesDeleteFieldInput = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<CompanyOwnedCapabilitiesConnectionWhere>;
};

export type CompanyOwnedCapabilitiesDisconnectFieldInput = {
  disconnect?: InputMaybe<BusinessCapabilityDisconnectInput>;
  where?: InputMaybe<CompanyOwnedCapabilitiesConnectionWhere>;
};

export type CompanyOwnedCapabilitiesFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedCapabilitiesCreateFieldInput>>;
};

export type CompanyOwnedCapabilitiesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CompanyOwnedCapabilitiesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CompanyOwnedCapabilitiesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CompanyOwnedCapabilitiesNodeAggregationWhereInput>>;
  businessValue?: InputMaybe<IntScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  maturityLevel?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  sequenceNumber?: InputMaybe<IntScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type CompanyOwnedCapabilitiesRelationship = {
  __typename?: 'CompanyOwnedCapabilitiesRelationship';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type CompanyOwnedCapabilitiesUpdateConnectionInput = {
  node?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<CompanyOwnedCapabilitiesConnectionWhere>;
};

export type CompanyOwnedCapabilitiesUpdateFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedCapabilitiesCreateFieldInput>>;
  delete?: InputMaybe<Array<CompanyOwnedCapabilitiesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<CompanyOwnedCapabilitiesDisconnectFieldInput>>;
  update?: InputMaybe<CompanyOwnedCapabilitiesUpdateConnectionInput>;
};

export type CompanyOwnedDataObjectsAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedDataObjectsAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedDataObjectsAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedDataObjectsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CompanyOwnedDataObjectsNodeAggregationWhereInput>;
};

export type CompanyOwnedDataObjectsConnectFieldInput = {
  connect?: InputMaybe<Array<DataObjectConnectInput>>;
  where?: InputMaybe<DataObjectConnectWhere>;
};

export type CompanyOwnedDataObjectsConnection = {
  __typename?: 'CompanyOwnedDataObjectsConnection';
  aggregate: CompanyDataObjectOwnedDataObjectsAggregateSelection;
  edges: Array<CompanyOwnedDataObjectsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CompanyOwnedDataObjectsConnectionAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedDataObjectsConnectionAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedDataObjectsConnectionAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedDataObjectsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<CompanyOwnedDataObjectsNodeAggregationWhereInput>;
};

export type CompanyOwnedDataObjectsConnectionFilters = {
  /** Filter Companies by aggregating results on related CompanyOwnedDataObjectsConnections */
  aggregate?: InputMaybe<CompanyOwnedDataObjectsConnectionAggregateInput>;
  /** Return Companies where all of the related CompanyOwnedDataObjectsConnections match this filter */
  all?: InputMaybe<CompanyOwnedDataObjectsConnectionWhere>;
  /** Return Companies where none of the related CompanyOwnedDataObjectsConnections match this filter */
  none?: InputMaybe<CompanyOwnedDataObjectsConnectionWhere>;
  /** Return Companies where one of the related CompanyOwnedDataObjectsConnections match this filter */
  single?: InputMaybe<CompanyOwnedDataObjectsConnectionWhere>;
  /** Return Companies where some of the related CompanyOwnedDataObjectsConnections match this filter */
  some?: InputMaybe<CompanyOwnedDataObjectsConnectionWhere>;
};

export type CompanyOwnedDataObjectsConnectionSort = {
  node?: InputMaybe<DataObjectSort>;
};

export type CompanyOwnedDataObjectsConnectionWhere = {
  AND?: InputMaybe<Array<CompanyOwnedDataObjectsConnectionWhere>>;
  NOT?: InputMaybe<CompanyOwnedDataObjectsConnectionWhere>;
  OR?: InputMaybe<Array<CompanyOwnedDataObjectsConnectionWhere>>;
  node?: InputMaybe<DataObjectWhere>;
};

export type CompanyOwnedDataObjectsCreateFieldInput = {
  node: DataObjectCreateInput;
};

export type CompanyOwnedDataObjectsDeleteFieldInput = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<CompanyOwnedDataObjectsConnectionWhere>;
};

export type CompanyOwnedDataObjectsDisconnectFieldInput = {
  disconnect?: InputMaybe<DataObjectDisconnectInput>;
  where?: InputMaybe<CompanyOwnedDataObjectsConnectionWhere>;
};

export type CompanyOwnedDataObjectsFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedDataObjectsCreateFieldInput>>;
};

export type CompanyOwnedDataObjectsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CompanyOwnedDataObjectsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CompanyOwnedDataObjectsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CompanyOwnedDataObjectsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  format?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type CompanyOwnedDataObjectsRelationship = {
  __typename?: 'CompanyOwnedDataObjectsRelationship';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type CompanyOwnedDataObjectsUpdateConnectionInput = {
  node?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<CompanyOwnedDataObjectsConnectionWhere>;
};

export type CompanyOwnedDataObjectsUpdateFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedDataObjectsCreateFieldInput>>;
  delete?: InputMaybe<Array<CompanyOwnedDataObjectsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<CompanyOwnedDataObjectsDisconnectFieldInput>>;
  update?: InputMaybe<CompanyOwnedDataObjectsUpdateConnectionInput>;
};

export type CompanyOwnedInfrastructureAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedInfrastructureAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedInfrastructureAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedInfrastructureAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CompanyOwnedInfrastructureNodeAggregationWhereInput>;
};

export type CompanyOwnedInfrastructureConnectFieldInput = {
  connect?: InputMaybe<Array<InfrastructureConnectInput>>;
  where?: InputMaybe<InfrastructureConnectWhere>;
};

export type CompanyOwnedInfrastructureConnection = {
  __typename?: 'CompanyOwnedInfrastructureConnection';
  aggregate: CompanyInfrastructureOwnedInfrastructureAggregateSelection;
  edges: Array<CompanyOwnedInfrastructureRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CompanyOwnedInfrastructureConnectionAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedInfrastructureConnectionAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedInfrastructureConnectionAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedInfrastructureConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<CompanyOwnedInfrastructureNodeAggregationWhereInput>;
};

export type CompanyOwnedInfrastructureConnectionFilters = {
  /** Filter Companies by aggregating results on related CompanyOwnedInfrastructureConnections */
  aggregate?: InputMaybe<CompanyOwnedInfrastructureConnectionAggregateInput>;
  /** Return Companies where all of the related CompanyOwnedInfrastructureConnections match this filter */
  all?: InputMaybe<CompanyOwnedInfrastructureConnectionWhere>;
  /** Return Companies where none of the related CompanyOwnedInfrastructureConnections match this filter */
  none?: InputMaybe<CompanyOwnedInfrastructureConnectionWhere>;
  /** Return Companies where one of the related CompanyOwnedInfrastructureConnections match this filter */
  single?: InputMaybe<CompanyOwnedInfrastructureConnectionWhere>;
  /** Return Companies where some of the related CompanyOwnedInfrastructureConnections match this filter */
  some?: InputMaybe<CompanyOwnedInfrastructureConnectionWhere>;
};

export type CompanyOwnedInfrastructureConnectionSort = {
  node?: InputMaybe<InfrastructureSort>;
};

export type CompanyOwnedInfrastructureConnectionWhere = {
  AND?: InputMaybe<Array<CompanyOwnedInfrastructureConnectionWhere>>;
  NOT?: InputMaybe<CompanyOwnedInfrastructureConnectionWhere>;
  OR?: InputMaybe<Array<CompanyOwnedInfrastructureConnectionWhere>>;
  node?: InputMaybe<InfrastructureWhere>;
};

export type CompanyOwnedInfrastructureCreateFieldInput = {
  node: InfrastructureCreateInput;
};

export type CompanyOwnedInfrastructureDeleteFieldInput = {
  delete?: InputMaybe<InfrastructureDeleteInput>;
  where?: InputMaybe<CompanyOwnedInfrastructureConnectionWhere>;
};

export type CompanyOwnedInfrastructureDisconnectFieldInput = {
  disconnect?: InputMaybe<InfrastructureDisconnectInput>;
  where?: InputMaybe<CompanyOwnedInfrastructureConnectionWhere>;
};

export type CompanyOwnedInfrastructureFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedInfrastructureCreateFieldInput>>;
};

export type CompanyOwnedInfrastructureNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CompanyOwnedInfrastructureNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CompanyOwnedInfrastructureNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CompanyOwnedInfrastructureNodeAggregationWhereInput>>;
  capacity?: InputMaybe<StringScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  ipAddress?: InputMaybe<StringScalarAggregationFilters>;
  location?: InputMaybe<StringScalarAggregationFilters>;
  maintenanceWindow?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  operatingSystem?: InputMaybe<StringScalarAggregationFilters>;
  specifications?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type CompanyOwnedInfrastructureRelationship = {
  __typename?: 'CompanyOwnedInfrastructureRelationship';
  cursor: Scalars['String']['output'];
  node: Infrastructure;
};

export type CompanyOwnedInfrastructureUpdateConnectionInput = {
  node?: InputMaybe<InfrastructureUpdateInput>;
  where?: InputMaybe<CompanyOwnedInfrastructureConnectionWhere>;
};

export type CompanyOwnedInfrastructureUpdateFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedInfrastructureCreateFieldInput>>;
  delete?: InputMaybe<Array<CompanyOwnedInfrastructureDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<CompanyOwnedInfrastructureDisconnectFieldInput>>;
  update?: InputMaybe<CompanyOwnedInfrastructureUpdateConnectionInput>;
};

export type CompanyOwnedInterfacesAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedInterfacesAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedInterfacesAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedInterfacesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CompanyOwnedInterfacesNodeAggregationWhereInput>;
};

export type CompanyOwnedInterfacesConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type CompanyOwnedInterfacesConnection = {
  __typename?: 'CompanyOwnedInterfacesConnection';
  aggregate: CompanyApplicationInterfaceOwnedInterfacesAggregateSelection;
  edges: Array<CompanyOwnedInterfacesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CompanyOwnedInterfacesConnectionAggregateInput = {
  AND?: InputMaybe<Array<CompanyOwnedInterfacesConnectionAggregateInput>>;
  NOT?: InputMaybe<CompanyOwnedInterfacesConnectionAggregateInput>;
  OR?: InputMaybe<Array<CompanyOwnedInterfacesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<CompanyOwnedInterfacesNodeAggregationWhereInput>;
};

export type CompanyOwnedInterfacesConnectionFilters = {
  /** Filter Companies by aggregating results on related CompanyOwnedInterfacesConnections */
  aggregate?: InputMaybe<CompanyOwnedInterfacesConnectionAggregateInput>;
  /** Return Companies where all of the related CompanyOwnedInterfacesConnections match this filter */
  all?: InputMaybe<CompanyOwnedInterfacesConnectionWhere>;
  /** Return Companies where none of the related CompanyOwnedInterfacesConnections match this filter */
  none?: InputMaybe<CompanyOwnedInterfacesConnectionWhere>;
  /** Return Companies where one of the related CompanyOwnedInterfacesConnections match this filter */
  single?: InputMaybe<CompanyOwnedInterfacesConnectionWhere>;
  /** Return Companies where some of the related CompanyOwnedInterfacesConnections match this filter */
  some?: InputMaybe<CompanyOwnedInterfacesConnectionWhere>;
};

export type CompanyOwnedInterfacesConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type CompanyOwnedInterfacesConnectionWhere = {
  AND?: InputMaybe<Array<CompanyOwnedInterfacesConnectionWhere>>;
  NOT?: InputMaybe<CompanyOwnedInterfacesConnectionWhere>;
  OR?: InputMaybe<Array<CompanyOwnedInterfacesConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type CompanyOwnedInterfacesCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type CompanyOwnedInterfacesDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<CompanyOwnedInterfacesConnectionWhere>;
};

export type CompanyOwnedInterfacesDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<CompanyOwnedInterfacesConnectionWhere>;
};

export type CompanyOwnedInterfacesFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedInterfacesCreateFieldInput>>;
};

export type CompanyOwnedInterfacesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CompanyOwnedInterfacesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CompanyOwnedInterfacesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CompanyOwnedInterfacesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type CompanyOwnedInterfacesRelationship = {
  __typename?: 'CompanyOwnedInterfacesRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type CompanyOwnedInterfacesUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<CompanyOwnedInterfacesConnectionWhere>;
};

export type CompanyOwnedInterfacesUpdateFieldInput = {
  connect?: InputMaybe<Array<CompanyOwnedInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<CompanyOwnedInterfacesCreateFieldInput>>;
  delete?: InputMaybe<Array<CompanyOwnedInterfacesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<CompanyOwnedInterfacesDisconnectFieldInput>>;
  update?: InputMaybe<CompanyOwnedInterfacesUpdateConnectionInput>;
};

export type CompanyRelationshipFilters = {
  /** Filter type where all of the related Companies match this filter */
  all?: InputMaybe<CompanyWhere>;
  /** Filter type where none of the related Companies match this filter */
  none?: InputMaybe<CompanyWhere>;
  /** Filter type where one of the related Companies match this filter */
  single?: InputMaybe<CompanyWhere>;
  /** Filter type where some of the related Companies match this filter */
  some?: InputMaybe<CompanyWhere>;
};

/** Unternehmensgrößen */
export enum CompanySize {
  ENTERPRISE = 'ENTERPRISE',
  LARGE = 'LARGE',
  MEDIUM = 'MEDIUM',
  MULTINATIONAL = 'MULTINATIONAL',
  SMALL = 'SMALL',
  STARTUP = 'STARTUP'
}

/** CompanySize filters */
export type CompanySizeEnumScalarFilters = {
  eq?: InputMaybe<CompanySize>;
  in?: InputMaybe<Array<CompanySize>>;
};

/** CompanySize mutations */
export type CompanySizeEnumScalarMutations = {
  set?: InputMaybe<CompanySize>;
};

/** Fields to sort Companies by. The order in which sorts are applied is not guaranteed when specifying many fields in one CompanySort object. */
export type CompanySort = {
  address?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  industry?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  size?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
  website?: InputMaybe<SortDirection>;
};

export type CompanyUpdateInput = {
  address?: InputMaybe<StringScalarMutations>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  description?: InputMaybe<StringScalarMutations>;
  industry?: InputMaybe<StringScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  organisations?: InputMaybe<Array<CompanyOrganisationsUpdateFieldInput>>;
  ownedAIAssets?: InputMaybe<Array<CompanyOwnedAiAssetsUpdateFieldInput>>;
  ownedApplications?: InputMaybe<Array<CompanyOwnedApplicationsUpdateFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<CompanyOwnedCapabilitiesUpdateFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<CompanyOwnedDataObjectsUpdateFieldInput>>;
  ownedInfrastructure?: InputMaybe<Array<CompanyOwnedInfrastructureUpdateFieldInput>>;
  ownedInterfaces?: InputMaybe<Array<CompanyOwnedInterfacesUpdateFieldInput>>;
  size?: InputMaybe<CompanySizeEnumScalarMutations>;
  website?: InputMaybe<StringScalarMutations>;
};

export type CompanyWhere = {
  AND?: InputMaybe<Array<CompanyWhere>>;
  NOT?: InputMaybe<CompanyWhere>;
  OR?: InputMaybe<Array<CompanyWhere>>;
  address?: InputMaybe<StringScalarFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  description?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  industry?: InputMaybe<StringScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  organisations?: InputMaybe<OrganisationRelationshipFilters>;
  organisationsConnection?: InputMaybe<CompanyOrganisationsConnectionFilters>;
  ownedAIAssets?: InputMaybe<AiAssetRelationshipFilters>;
  ownedAIAssetsConnection?: InputMaybe<CompanyOwnedAiAssetsConnectionFilters>;
  ownedApplications?: InputMaybe<ApplicationRelationshipFilters>;
  ownedApplicationsConnection?: InputMaybe<CompanyOwnedApplicationsConnectionFilters>;
  ownedCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  ownedCapabilitiesConnection?: InputMaybe<CompanyOwnedCapabilitiesConnectionFilters>;
  ownedDataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  ownedDataObjectsConnection?: InputMaybe<CompanyOwnedDataObjectsConnectionFilters>;
  ownedInfrastructure?: InputMaybe<InfrastructureRelationshipFilters>;
  ownedInfrastructureConnection?: InputMaybe<CompanyOwnedInfrastructureConnectionFilters>;
  ownedInterfaces?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  ownedInterfacesConnection?: InputMaybe<CompanyOwnedInterfacesConnectionFilters>;
  size?: InputMaybe<CompanySizeEnumScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
  website?: InputMaybe<StringScalarFilters>;
};

export type ConnectionAggregationCountFilterInput = {
  edges?: InputMaybe<IntScalarFilters>;
  nodes?: InputMaybe<IntScalarFilters>;
};

export type Count = {
  __typename?: 'Count';
  nodes: Scalars['Int']['output'];
};

export type CountConnection = {
  __typename?: 'CountConnection';
  edges: Scalars['Int']['output'];
  nodes: Scalars['Int']['output'];
};

export type CreateAiAssetsMutationResponse = {
  __typename?: 'CreateAiAssetsMutationResponse';
  aiAssets: Array<AiAsset>;
  info: CreateInfo;
};

export type CreateApplicationInterfacesMutationResponse = {
  __typename?: 'CreateApplicationInterfacesMutationResponse';
  applicationInterfaces: Array<ApplicationInterface>;
  info: CreateInfo;
};

export type CreateApplicationsMutationResponse = {
  __typename?: 'CreateApplicationsMutationResponse';
  applications: Array<Application>;
  info: CreateInfo;
};

export type CreateArchitecturePrinciplesMutationResponse = {
  __typename?: 'CreateArchitecturePrinciplesMutationResponse';
  architecturePrinciples: Array<ArchitecturePrinciple>;
  info: CreateInfo;
};

export type CreateArchitecturesMutationResponse = {
  __typename?: 'CreateArchitecturesMutationResponse';
  architectures: Array<Architecture>;
  info: CreateInfo;
};

export type CreateBusinessCapabilitiesMutationResponse = {
  __typename?: 'CreateBusinessCapabilitiesMutationResponse';
  businessCapabilities: Array<BusinessCapability>;
  info: CreateInfo;
};

export type CreateCompaniesMutationResponse = {
  __typename?: 'CreateCompaniesMutationResponse';
  companies: Array<Company>;
  info: CreateInfo;
};

export type CreateDataObjectsMutationResponse = {
  __typename?: 'CreateDataObjectsMutationResponse';
  dataObjects: Array<DataObject>;
  info: CreateInfo;
};

export type CreateDiagramsMutationResponse = {
  __typename?: 'CreateDiagramsMutationResponse';
  diagrams: Array<Diagram>;
  info: CreateInfo;
};

/** Information about the number of nodes and relationships created during a create mutation */
export type CreateInfo = {
  __typename?: 'CreateInfo';
  nodesCreated: Scalars['Int']['output'];
  relationshipsCreated: Scalars['Int']['output'];
};

export type CreateInfrastructuresMutationResponse = {
  __typename?: 'CreateInfrastructuresMutationResponse';
  info: CreateInfo;
  infrastructures: Array<Infrastructure>;
};

export type CreateOrganisationsMutationResponse = {
  __typename?: 'CreateOrganisationsMutationResponse';
  info: CreateInfo;
  organisations: Array<Organisation>;
};

export type CreatePeopleMutationResponse = {
  __typename?: 'CreatePeopleMutationResponse';
  info: CreateInfo;
  people: Array<Person>;
};

/** Kritikalitätsstufen für Applikationen */
export enum CriticalityLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM'
}

/** CriticalityLevel filters */
export type CriticalityLevelEnumScalarFilters = {
  eq?: InputMaybe<CriticalityLevel>;
  in?: InputMaybe<Array<CriticalityLevel>>;
};

/** CriticalityLevel mutations */
export type CriticalityLevelEnumScalarMutations = {
  set?: InputMaybe<CriticalityLevel>;
};

/** Datenklassifikation für Business-Datenobjekte */
export enum DataClassification {
  CONFIDENTIAL = 'CONFIDENTIAL',
  INTERNAL = 'INTERNAL',
  PUBLIC = 'PUBLIC',
  STRICTLY_CONFIDENTIAL = 'STRICTLY_CONFIDENTIAL'
}

/** DataClassification filters */
export type DataClassificationEnumScalarFilters = {
  eq?: InputMaybe<DataClassification>;
  in?: InputMaybe<Array<DataClassification>>;
};

/** DataClassification mutations */
export type DataClassificationEnumScalarMutations = {
  set?: InputMaybe<DataClassification>;
};

/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObject = {
  __typename?: 'DataObject';
  classification: DataClassification;
  company: Array<Company>;
  companyConnection: DataObjectCompanyConnection;
  createdAt: Scalars['DateTime']['output'];
  dataSources: Array<Application>;
  dataSourcesConnection: DataObjectDataSourcesConnection;
  depictedInDiagrams: Array<Diagram>;
  depictedInDiagramsConnection: DataObjectDepictedInDiagramsConnection;
  description?: Maybe<Scalars['String']['output']>;
  endOfLifeDate?: Maybe<Scalars['Date']['output']>;
  endOfUseDate?: Maybe<Scalars['Date']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  introductionDate?: Maybe<Scalars['Date']['output']>;
  name: Scalars['String']['output'];
  owners: Array<Person>;
  ownersConnection: DataObjectOwnersConnection;
  partOfArchitectures: Array<Architecture>;
  partOfArchitecturesConnection: DataObjectPartOfArchitecturesConnection;
  planningDate?: Maybe<Scalars['Date']['output']>;
  relatedToCapabilities: Array<BusinessCapability>;
  relatedToCapabilitiesConnection: DataObjectRelatedToCapabilitiesConnection;
  transferredInInterfaces: Array<ApplicationInterface>;
  transferredInInterfacesConnection: DataObjectTransferredInInterfacesConnection;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usedByApplications: Array<Application>;
  usedByApplicationsConnection: DataObjectUsedByApplicationsConnection;
  usedByOrganisations: Array<Organisation>;
  usedByOrganisationsConnection: DataObjectUsedByOrganisationsConnection;
  usedForTrainingAI: Array<AiAsset>;
  usedForTrainingAIConnection: DataObjectUsedForTrainingAiConnection;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectCompanyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanySort>>;
  where?: InputMaybe<CompanyWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectCompanyConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectCompanyConnectionSort>>;
  where?: InputMaybe<DataObjectCompanyConnectionWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectDataSourcesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectDataSourcesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectDataSourcesConnectionSort>>;
  where?: InputMaybe<DataObjectDataSourcesConnectionWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectDepictedInDiagramsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramSort>>;
  where?: InputMaybe<DiagramWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectDepictedInDiagramsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectDepictedInDiagramsConnectionSort>>;
  where?: InputMaybe<DataObjectDepictedInDiagramsConnectionWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectOwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectOwnersConnectionSort>>;
  where?: InputMaybe<DataObjectOwnersConnectionWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectPartOfArchitecturesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectPartOfArchitecturesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectPartOfArchitecturesConnectionSort>>;
  where?: InputMaybe<DataObjectPartOfArchitecturesConnectionWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectRelatedToCapabilitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectRelatedToCapabilitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectRelatedToCapabilitiesConnectionSort>>;
  where?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectTransferredInInterfacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectTransferredInInterfacesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectTransferredInInterfacesConnectionSort>>;
  where?: InputMaybe<DataObjectTransferredInInterfacesConnectionWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectUsedByApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectUsedByApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectUsedByApplicationsConnectionSort>>;
  where?: InputMaybe<DataObjectUsedByApplicationsConnectionWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectUsedByOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectUsedByOrganisationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectUsedByOrganisationsConnectionSort>>;
  where?: InputMaybe<DataObjectUsedByOrganisationsConnectionWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectUsedForTrainingAiArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


/** DataObject - repräsentiert ein Business-Datenobjekt im Enterprise Architecture Management */
export type DataObjectUsedForTrainingAiConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectUsedForTrainingAiConnectionSort>>;
  where?: InputMaybe<DataObjectUsedForTrainingAiConnectionWhere>;
};

export type DataObjectAiAssetUsedForTrainingAiAggregateSelection = {
  __typename?: 'DataObjectAIAssetUsedForTrainingAIAggregateSelection';
  count: CountConnection;
  node?: Maybe<DataObjectAiAssetUsedForTrainingAiNodeAggregateSelection>;
};

export type DataObjectAiAssetUsedForTrainingAiNodeAggregateSelection = {
  __typename?: 'DataObjectAIAssetUsedForTrainingAINodeAggregateSelection';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type DataObjectAggregate = {
  __typename?: 'DataObjectAggregate';
  count: Count;
  node: DataObjectAggregateNode;
};

export type DataObjectAggregateNode = {
  __typename?: 'DataObjectAggregateNode';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DataObjectApplicationDataSourcesAggregateSelection = {
  __typename?: 'DataObjectApplicationDataSourcesAggregateSelection';
  count: CountConnection;
  node?: Maybe<DataObjectApplicationDataSourcesNodeAggregateSelection>;
};

export type DataObjectApplicationDataSourcesNodeAggregateSelection = {
  __typename?: 'DataObjectApplicationDataSourcesNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type DataObjectApplicationInterfaceTransferredInInterfacesAggregateSelection = {
  __typename?: 'DataObjectApplicationInterfaceTransferredInInterfacesAggregateSelection';
  count: CountConnection;
  node?: Maybe<DataObjectApplicationInterfaceTransferredInInterfacesNodeAggregateSelection>;
};

export type DataObjectApplicationInterfaceTransferredInInterfacesNodeAggregateSelection = {
  __typename?: 'DataObjectApplicationInterfaceTransferredInInterfacesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type DataObjectApplicationUsedByApplicationsAggregateSelection = {
  __typename?: 'DataObjectApplicationUsedByApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<DataObjectApplicationUsedByApplicationsNodeAggregateSelection>;
};

export type DataObjectApplicationUsedByApplicationsNodeAggregateSelection = {
  __typename?: 'DataObjectApplicationUsedByApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type DataObjectArchitecturePartOfArchitecturesAggregateSelection = {
  __typename?: 'DataObjectArchitecturePartOfArchitecturesAggregateSelection';
  count: CountConnection;
  node?: Maybe<DataObjectArchitecturePartOfArchitecturesNodeAggregateSelection>;
};

export type DataObjectArchitecturePartOfArchitecturesNodeAggregateSelection = {
  __typename?: 'DataObjectArchitecturePartOfArchitecturesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DataObjectBusinessCapabilityRelatedToCapabilitiesAggregateSelection = {
  __typename?: 'DataObjectBusinessCapabilityRelatedToCapabilitiesAggregateSelection';
  count: CountConnection;
  node?: Maybe<DataObjectBusinessCapabilityRelatedToCapabilitiesNodeAggregateSelection>;
};

export type DataObjectBusinessCapabilityRelatedToCapabilitiesNodeAggregateSelection = {
  __typename?: 'DataObjectBusinessCapabilityRelatedToCapabilitiesNodeAggregateSelection';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DataObjectCompanyAggregateInput = {
  AND?: InputMaybe<Array<DataObjectCompanyAggregateInput>>;
  NOT?: InputMaybe<DataObjectCompanyAggregateInput>;
  OR?: InputMaybe<Array<DataObjectCompanyAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DataObjectCompanyNodeAggregationWhereInput>;
};

export type DataObjectCompanyCompanyAggregateSelection = {
  __typename?: 'DataObjectCompanyCompanyAggregateSelection';
  count: CountConnection;
  node?: Maybe<DataObjectCompanyCompanyNodeAggregateSelection>;
};

export type DataObjectCompanyCompanyNodeAggregateSelection = {
  __typename?: 'DataObjectCompanyCompanyNodeAggregateSelection';
  address: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  industry: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  website: StringAggregateSelection;
};

export type DataObjectCompanyConnectFieldInput = {
  connect?: InputMaybe<Array<CompanyConnectInput>>;
  where?: InputMaybe<CompanyConnectWhere>;
};

export type DataObjectCompanyConnection = {
  __typename?: 'DataObjectCompanyConnection';
  aggregate: DataObjectCompanyCompanyAggregateSelection;
  edges: Array<DataObjectCompanyRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DataObjectCompanyConnectionAggregateInput = {
  AND?: InputMaybe<Array<DataObjectCompanyConnectionAggregateInput>>;
  NOT?: InputMaybe<DataObjectCompanyConnectionAggregateInput>;
  OR?: InputMaybe<Array<DataObjectCompanyConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DataObjectCompanyNodeAggregationWhereInput>;
};

export type DataObjectCompanyConnectionFilters = {
  /** Filter DataObjects by aggregating results on related DataObjectCompanyConnections */
  aggregate?: InputMaybe<DataObjectCompanyConnectionAggregateInput>;
  /** Return DataObjects where all of the related DataObjectCompanyConnections match this filter */
  all?: InputMaybe<DataObjectCompanyConnectionWhere>;
  /** Return DataObjects where none of the related DataObjectCompanyConnections match this filter */
  none?: InputMaybe<DataObjectCompanyConnectionWhere>;
  /** Return DataObjects where one of the related DataObjectCompanyConnections match this filter */
  single?: InputMaybe<DataObjectCompanyConnectionWhere>;
  /** Return DataObjects where some of the related DataObjectCompanyConnections match this filter */
  some?: InputMaybe<DataObjectCompanyConnectionWhere>;
};

export type DataObjectCompanyConnectionSort = {
  node?: InputMaybe<CompanySort>;
};

export type DataObjectCompanyConnectionWhere = {
  AND?: InputMaybe<Array<DataObjectCompanyConnectionWhere>>;
  NOT?: InputMaybe<DataObjectCompanyConnectionWhere>;
  OR?: InputMaybe<Array<DataObjectCompanyConnectionWhere>>;
  node?: InputMaybe<CompanyWhere>;
};

export type DataObjectCompanyCreateFieldInput = {
  node: CompanyCreateInput;
};

export type DataObjectCompanyDeleteFieldInput = {
  delete?: InputMaybe<CompanyDeleteInput>;
  where?: InputMaybe<DataObjectCompanyConnectionWhere>;
};

export type DataObjectCompanyDisconnectFieldInput = {
  disconnect?: InputMaybe<CompanyDisconnectInput>;
  where?: InputMaybe<DataObjectCompanyConnectionWhere>;
};

export type DataObjectCompanyFieldInput = {
  connect?: InputMaybe<Array<DataObjectCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectCompanyCreateFieldInput>>;
};

export type DataObjectCompanyNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DataObjectCompanyNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DataObjectCompanyNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DataObjectCompanyNodeAggregationWhereInput>>;
  address?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  industry?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  website?: InputMaybe<StringScalarAggregationFilters>;
};

export type DataObjectCompanyRelationship = {
  __typename?: 'DataObjectCompanyRelationship';
  cursor: Scalars['String']['output'];
  node: Company;
};

export type DataObjectCompanyUpdateConnectionInput = {
  node?: InputMaybe<CompanyUpdateInput>;
  where?: InputMaybe<DataObjectCompanyConnectionWhere>;
};

export type DataObjectCompanyUpdateFieldInput = {
  connect?: InputMaybe<Array<DataObjectCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectCompanyCreateFieldInput>>;
  delete?: InputMaybe<Array<DataObjectCompanyDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DataObjectCompanyDisconnectFieldInput>>;
  update?: InputMaybe<DataObjectCompanyUpdateConnectionInput>;
};

export type DataObjectConnectInput = {
  company?: InputMaybe<Array<DataObjectCompanyConnectFieldInput>>;
  dataSources?: InputMaybe<Array<DataObjectDataSourcesConnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<DataObjectDepictedInDiagramsConnectFieldInput>>;
  owners?: InputMaybe<Array<DataObjectOwnersConnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<DataObjectPartOfArchitecturesConnectFieldInput>>;
  relatedToCapabilities?: InputMaybe<Array<DataObjectRelatedToCapabilitiesConnectFieldInput>>;
  transferredInInterfaces?: InputMaybe<Array<DataObjectTransferredInInterfacesConnectFieldInput>>;
  usedByApplications?: InputMaybe<Array<DataObjectUsedByApplicationsConnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<DataObjectUsedByOrganisationsConnectFieldInput>>;
  usedForTrainingAI?: InputMaybe<Array<DataObjectUsedForTrainingAiConnectFieldInput>>;
};

export type DataObjectConnectWhere = {
  node: DataObjectWhere;
};

export type DataObjectCreateInput = {
  classification: DataClassification;
  company?: InputMaybe<DataObjectCompanyFieldInput>;
  dataSources?: InputMaybe<DataObjectDataSourcesFieldInput>;
  depictedInDiagrams?: InputMaybe<DataObjectDepictedInDiagramsFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  endOfLifeDate?: InputMaybe<Scalars['Date']['input']>;
  endOfUseDate?: InputMaybe<Scalars['Date']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  introductionDate?: InputMaybe<Scalars['Date']['input']>;
  name: Scalars['String']['input'];
  owners?: InputMaybe<DataObjectOwnersFieldInput>;
  partOfArchitectures?: InputMaybe<DataObjectPartOfArchitecturesFieldInput>;
  planningDate?: InputMaybe<Scalars['Date']['input']>;
  relatedToCapabilities?: InputMaybe<DataObjectRelatedToCapabilitiesFieldInput>;
  transferredInInterfaces?: InputMaybe<DataObjectTransferredInInterfacesFieldInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usedByApplications?: InputMaybe<DataObjectUsedByApplicationsFieldInput>;
  usedByOrganisations?: InputMaybe<DataObjectUsedByOrganisationsFieldInput>;
  usedForTrainingAI?: InputMaybe<DataObjectUsedForTrainingAiFieldInput>;
};

export type DataObjectDataSourcesAggregateInput = {
  AND?: InputMaybe<Array<DataObjectDataSourcesAggregateInput>>;
  NOT?: InputMaybe<DataObjectDataSourcesAggregateInput>;
  OR?: InputMaybe<Array<DataObjectDataSourcesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DataObjectDataSourcesNodeAggregationWhereInput>;
};

export type DataObjectDataSourcesConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type DataObjectDataSourcesConnection = {
  __typename?: 'DataObjectDataSourcesConnection';
  aggregate: DataObjectApplicationDataSourcesAggregateSelection;
  edges: Array<DataObjectDataSourcesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DataObjectDataSourcesConnectionAggregateInput = {
  AND?: InputMaybe<Array<DataObjectDataSourcesConnectionAggregateInput>>;
  NOT?: InputMaybe<DataObjectDataSourcesConnectionAggregateInput>;
  OR?: InputMaybe<Array<DataObjectDataSourcesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DataObjectDataSourcesNodeAggregationWhereInput>;
};

export type DataObjectDataSourcesConnectionFilters = {
  /** Filter DataObjects by aggregating results on related DataObjectDataSourcesConnections */
  aggregate?: InputMaybe<DataObjectDataSourcesConnectionAggregateInput>;
  /** Return DataObjects where all of the related DataObjectDataSourcesConnections match this filter */
  all?: InputMaybe<DataObjectDataSourcesConnectionWhere>;
  /** Return DataObjects where none of the related DataObjectDataSourcesConnections match this filter */
  none?: InputMaybe<DataObjectDataSourcesConnectionWhere>;
  /** Return DataObjects where one of the related DataObjectDataSourcesConnections match this filter */
  single?: InputMaybe<DataObjectDataSourcesConnectionWhere>;
  /** Return DataObjects where some of the related DataObjectDataSourcesConnections match this filter */
  some?: InputMaybe<DataObjectDataSourcesConnectionWhere>;
};

export type DataObjectDataSourcesConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type DataObjectDataSourcesConnectionWhere = {
  AND?: InputMaybe<Array<DataObjectDataSourcesConnectionWhere>>;
  NOT?: InputMaybe<DataObjectDataSourcesConnectionWhere>;
  OR?: InputMaybe<Array<DataObjectDataSourcesConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type DataObjectDataSourcesCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type DataObjectDataSourcesDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<DataObjectDataSourcesConnectionWhere>;
};

export type DataObjectDataSourcesDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<DataObjectDataSourcesConnectionWhere>;
};

export type DataObjectDataSourcesFieldInput = {
  connect?: InputMaybe<Array<DataObjectDataSourcesConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectDataSourcesCreateFieldInput>>;
};

export type DataObjectDataSourcesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DataObjectDataSourcesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DataObjectDataSourcesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DataObjectDataSourcesNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type DataObjectDataSourcesRelationship = {
  __typename?: 'DataObjectDataSourcesRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type DataObjectDataSourcesUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<DataObjectDataSourcesConnectionWhere>;
};

export type DataObjectDataSourcesUpdateFieldInput = {
  connect?: InputMaybe<Array<DataObjectDataSourcesConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectDataSourcesCreateFieldInput>>;
  delete?: InputMaybe<Array<DataObjectDataSourcesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DataObjectDataSourcesDisconnectFieldInput>>;
  update?: InputMaybe<DataObjectDataSourcesUpdateConnectionInput>;
};

export type DataObjectDeleteInput = {
  company?: InputMaybe<Array<DataObjectCompanyDeleteFieldInput>>;
  dataSources?: InputMaybe<Array<DataObjectDataSourcesDeleteFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<DataObjectDepictedInDiagramsDeleteFieldInput>>;
  owners?: InputMaybe<Array<DataObjectOwnersDeleteFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<DataObjectPartOfArchitecturesDeleteFieldInput>>;
  relatedToCapabilities?: InputMaybe<Array<DataObjectRelatedToCapabilitiesDeleteFieldInput>>;
  transferredInInterfaces?: InputMaybe<Array<DataObjectTransferredInInterfacesDeleteFieldInput>>;
  usedByApplications?: InputMaybe<Array<DataObjectUsedByApplicationsDeleteFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<DataObjectUsedByOrganisationsDeleteFieldInput>>;
  usedForTrainingAI?: InputMaybe<Array<DataObjectUsedForTrainingAiDeleteFieldInput>>;
};

export type DataObjectDepictedInDiagramsAggregateInput = {
  AND?: InputMaybe<Array<DataObjectDepictedInDiagramsAggregateInput>>;
  NOT?: InputMaybe<DataObjectDepictedInDiagramsAggregateInput>;
  OR?: InputMaybe<Array<DataObjectDepictedInDiagramsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DataObjectDepictedInDiagramsNodeAggregationWhereInput>;
};

export type DataObjectDepictedInDiagramsConnectFieldInput = {
  connect?: InputMaybe<Array<DiagramConnectInput>>;
  where?: InputMaybe<DiagramConnectWhere>;
};

export type DataObjectDepictedInDiagramsConnection = {
  __typename?: 'DataObjectDepictedInDiagramsConnection';
  aggregate: DataObjectDiagramDepictedInDiagramsAggregateSelection;
  edges: Array<DataObjectDepictedInDiagramsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DataObjectDepictedInDiagramsConnectionAggregateInput = {
  AND?: InputMaybe<Array<DataObjectDepictedInDiagramsConnectionAggregateInput>>;
  NOT?: InputMaybe<DataObjectDepictedInDiagramsConnectionAggregateInput>;
  OR?: InputMaybe<Array<DataObjectDepictedInDiagramsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DataObjectDepictedInDiagramsNodeAggregationWhereInput>;
};

export type DataObjectDepictedInDiagramsConnectionFilters = {
  /** Filter DataObjects by aggregating results on related DataObjectDepictedInDiagramsConnections */
  aggregate?: InputMaybe<DataObjectDepictedInDiagramsConnectionAggregateInput>;
  /** Return DataObjects where all of the related DataObjectDepictedInDiagramsConnections match this filter */
  all?: InputMaybe<DataObjectDepictedInDiagramsConnectionWhere>;
  /** Return DataObjects where none of the related DataObjectDepictedInDiagramsConnections match this filter */
  none?: InputMaybe<DataObjectDepictedInDiagramsConnectionWhere>;
  /** Return DataObjects where one of the related DataObjectDepictedInDiagramsConnections match this filter */
  single?: InputMaybe<DataObjectDepictedInDiagramsConnectionWhere>;
  /** Return DataObjects where some of the related DataObjectDepictedInDiagramsConnections match this filter */
  some?: InputMaybe<DataObjectDepictedInDiagramsConnectionWhere>;
};

export type DataObjectDepictedInDiagramsConnectionSort = {
  node?: InputMaybe<DiagramSort>;
};

export type DataObjectDepictedInDiagramsConnectionWhere = {
  AND?: InputMaybe<Array<DataObjectDepictedInDiagramsConnectionWhere>>;
  NOT?: InputMaybe<DataObjectDepictedInDiagramsConnectionWhere>;
  OR?: InputMaybe<Array<DataObjectDepictedInDiagramsConnectionWhere>>;
  node?: InputMaybe<DiagramWhere>;
};

export type DataObjectDepictedInDiagramsCreateFieldInput = {
  node: DiagramCreateInput;
};

export type DataObjectDepictedInDiagramsDeleteFieldInput = {
  delete?: InputMaybe<DiagramDeleteInput>;
  where?: InputMaybe<DataObjectDepictedInDiagramsConnectionWhere>;
};

export type DataObjectDepictedInDiagramsDisconnectFieldInput = {
  disconnect?: InputMaybe<DiagramDisconnectInput>;
  where?: InputMaybe<DataObjectDepictedInDiagramsConnectionWhere>;
};

export type DataObjectDepictedInDiagramsFieldInput = {
  connect?: InputMaybe<Array<DataObjectDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectDepictedInDiagramsCreateFieldInput>>;
};

export type DataObjectDepictedInDiagramsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DataObjectDepictedInDiagramsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DataObjectDepictedInDiagramsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DataObjectDepictedInDiagramsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  diagramJson?: InputMaybe<StringScalarAggregationFilters>;
  diagramPng?: InputMaybe<StringScalarAggregationFilters>;
  title?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type DataObjectDepictedInDiagramsRelationship = {
  __typename?: 'DataObjectDepictedInDiagramsRelationship';
  cursor: Scalars['String']['output'];
  node: Diagram;
};

export type DataObjectDepictedInDiagramsUpdateConnectionInput = {
  node?: InputMaybe<DiagramUpdateInput>;
  where?: InputMaybe<DataObjectDepictedInDiagramsConnectionWhere>;
};

export type DataObjectDepictedInDiagramsUpdateFieldInput = {
  connect?: InputMaybe<Array<DataObjectDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectDepictedInDiagramsCreateFieldInput>>;
  delete?: InputMaybe<Array<DataObjectDepictedInDiagramsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DataObjectDepictedInDiagramsDisconnectFieldInput>>;
  update?: InputMaybe<DataObjectDepictedInDiagramsUpdateConnectionInput>;
};

export type DataObjectDiagramDepictedInDiagramsAggregateSelection = {
  __typename?: 'DataObjectDiagramDepictedInDiagramsAggregateSelection';
  count: CountConnection;
  node?: Maybe<DataObjectDiagramDepictedInDiagramsNodeAggregateSelection>;
};

export type DataObjectDiagramDepictedInDiagramsNodeAggregateSelection = {
  __typename?: 'DataObjectDiagramDepictedInDiagramsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  diagramJson: StringAggregateSelection;
  diagramPng: StringAggregateSelection;
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DataObjectDisconnectInput = {
  company?: InputMaybe<Array<DataObjectCompanyDisconnectFieldInput>>;
  dataSources?: InputMaybe<Array<DataObjectDataSourcesDisconnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<DataObjectDepictedInDiagramsDisconnectFieldInput>>;
  owners?: InputMaybe<Array<DataObjectOwnersDisconnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<DataObjectPartOfArchitecturesDisconnectFieldInput>>;
  relatedToCapabilities?: InputMaybe<Array<DataObjectRelatedToCapabilitiesDisconnectFieldInput>>;
  transferredInInterfaces?: InputMaybe<Array<DataObjectTransferredInInterfacesDisconnectFieldInput>>;
  usedByApplications?: InputMaybe<Array<DataObjectUsedByApplicationsDisconnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<DataObjectUsedByOrganisationsDisconnectFieldInput>>;
  usedForTrainingAI?: InputMaybe<Array<DataObjectUsedForTrainingAiDisconnectFieldInput>>;
};

export type DataObjectEdge = {
  __typename?: 'DataObjectEdge';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type DataObjectOrganisationUsedByOrganisationsAggregateSelection = {
  __typename?: 'DataObjectOrganisationUsedByOrganisationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<DataObjectOrganisationUsedByOrganisationsNodeAggregateSelection>;
};

export type DataObjectOrganisationUsedByOrganisationsNodeAggregateSelection = {
  __typename?: 'DataObjectOrganisationUsedByOrganisationsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  level: IntAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DataObjectOwnersAggregateInput = {
  AND?: InputMaybe<Array<DataObjectOwnersAggregateInput>>;
  NOT?: InputMaybe<DataObjectOwnersAggregateInput>;
  OR?: InputMaybe<Array<DataObjectOwnersAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DataObjectOwnersNodeAggregationWhereInput>;
};

export type DataObjectOwnersConnectFieldInput = {
  connect?: InputMaybe<Array<PersonConnectInput>>;
  where?: InputMaybe<PersonConnectWhere>;
};

export type DataObjectOwnersConnection = {
  __typename?: 'DataObjectOwnersConnection';
  aggregate: DataObjectPersonOwnersAggregateSelection;
  edges: Array<DataObjectOwnersRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DataObjectOwnersConnectionAggregateInput = {
  AND?: InputMaybe<Array<DataObjectOwnersConnectionAggregateInput>>;
  NOT?: InputMaybe<DataObjectOwnersConnectionAggregateInput>;
  OR?: InputMaybe<Array<DataObjectOwnersConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DataObjectOwnersNodeAggregationWhereInput>;
};

export type DataObjectOwnersConnectionFilters = {
  /** Filter DataObjects by aggregating results on related DataObjectOwnersConnections */
  aggregate?: InputMaybe<DataObjectOwnersConnectionAggregateInput>;
  /** Return DataObjects where all of the related DataObjectOwnersConnections match this filter */
  all?: InputMaybe<DataObjectOwnersConnectionWhere>;
  /** Return DataObjects where none of the related DataObjectOwnersConnections match this filter */
  none?: InputMaybe<DataObjectOwnersConnectionWhere>;
  /** Return DataObjects where one of the related DataObjectOwnersConnections match this filter */
  single?: InputMaybe<DataObjectOwnersConnectionWhere>;
  /** Return DataObjects where some of the related DataObjectOwnersConnections match this filter */
  some?: InputMaybe<DataObjectOwnersConnectionWhere>;
};

export type DataObjectOwnersConnectionSort = {
  node?: InputMaybe<PersonSort>;
};

export type DataObjectOwnersConnectionWhere = {
  AND?: InputMaybe<Array<DataObjectOwnersConnectionWhere>>;
  NOT?: InputMaybe<DataObjectOwnersConnectionWhere>;
  OR?: InputMaybe<Array<DataObjectOwnersConnectionWhere>>;
  node?: InputMaybe<PersonWhere>;
};

export type DataObjectOwnersCreateFieldInput = {
  node: PersonCreateInput;
};

export type DataObjectOwnersDeleteFieldInput = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<DataObjectOwnersConnectionWhere>;
};

export type DataObjectOwnersDisconnectFieldInput = {
  disconnect?: InputMaybe<PersonDisconnectInput>;
  where?: InputMaybe<DataObjectOwnersConnectionWhere>;
};

export type DataObjectOwnersFieldInput = {
  connect?: InputMaybe<Array<DataObjectOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectOwnersCreateFieldInput>>;
};

export type DataObjectOwnersNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DataObjectOwnersNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DataObjectOwnersNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DataObjectOwnersNodeAggregationWhereInput>>;
  avatarUrl?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  department?: InputMaybe<StringScalarAggregationFilters>;
  email?: InputMaybe<StringScalarAggregationFilters>;
  firstName?: InputMaybe<StringScalarAggregationFilters>;
  lastName?: InputMaybe<StringScalarAggregationFilters>;
  phone?: InputMaybe<StringScalarAggregationFilters>;
  role?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type DataObjectOwnersRelationship = {
  __typename?: 'DataObjectOwnersRelationship';
  cursor: Scalars['String']['output'];
  node: Person;
};

export type DataObjectOwnersUpdateConnectionInput = {
  node?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<DataObjectOwnersConnectionWhere>;
};

export type DataObjectOwnersUpdateFieldInput = {
  connect?: InputMaybe<Array<DataObjectOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectOwnersCreateFieldInput>>;
  delete?: InputMaybe<Array<DataObjectOwnersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DataObjectOwnersDisconnectFieldInput>>;
  update?: InputMaybe<DataObjectOwnersUpdateConnectionInput>;
};

export type DataObjectPartOfArchitecturesAggregateInput = {
  AND?: InputMaybe<Array<DataObjectPartOfArchitecturesAggregateInput>>;
  NOT?: InputMaybe<DataObjectPartOfArchitecturesAggregateInput>;
  OR?: InputMaybe<Array<DataObjectPartOfArchitecturesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DataObjectPartOfArchitecturesNodeAggregationWhereInput>;
};

export type DataObjectPartOfArchitecturesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type DataObjectPartOfArchitecturesConnection = {
  __typename?: 'DataObjectPartOfArchitecturesConnection';
  aggregate: DataObjectArchitecturePartOfArchitecturesAggregateSelection;
  edges: Array<DataObjectPartOfArchitecturesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DataObjectPartOfArchitecturesConnectionAggregateInput = {
  AND?: InputMaybe<Array<DataObjectPartOfArchitecturesConnectionAggregateInput>>;
  NOT?: InputMaybe<DataObjectPartOfArchitecturesConnectionAggregateInput>;
  OR?: InputMaybe<Array<DataObjectPartOfArchitecturesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DataObjectPartOfArchitecturesNodeAggregationWhereInput>;
};

export type DataObjectPartOfArchitecturesConnectionFilters = {
  /** Filter DataObjects by aggregating results on related DataObjectPartOfArchitecturesConnections */
  aggregate?: InputMaybe<DataObjectPartOfArchitecturesConnectionAggregateInput>;
  /** Return DataObjects where all of the related DataObjectPartOfArchitecturesConnections match this filter */
  all?: InputMaybe<DataObjectPartOfArchitecturesConnectionWhere>;
  /** Return DataObjects where none of the related DataObjectPartOfArchitecturesConnections match this filter */
  none?: InputMaybe<DataObjectPartOfArchitecturesConnectionWhere>;
  /** Return DataObjects where one of the related DataObjectPartOfArchitecturesConnections match this filter */
  single?: InputMaybe<DataObjectPartOfArchitecturesConnectionWhere>;
  /** Return DataObjects where some of the related DataObjectPartOfArchitecturesConnections match this filter */
  some?: InputMaybe<DataObjectPartOfArchitecturesConnectionWhere>;
};

export type DataObjectPartOfArchitecturesConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type DataObjectPartOfArchitecturesConnectionWhere = {
  AND?: InputMaybe<Array<DataObjectPartOfArchitecturesConnectionWhere>>;
  NOT?: InputMaybe<DataObjectPartOfArchitecturesConnectionWhere>;
  OR?: InputMaybe<Array<DataObjectPartOfArchitecturesConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type DataObjectPartOfArchitecturesCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type DataObjectPartOfArchitecturesDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<DataObjectPartOfArchitecturesConnectionWhere>;
};

export type DataObjectPartOfArchitecturesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<DataObjectPartOfArchitecturesConnectionWhere>;
};

export type DataObjectPartOfArchitecturesFieldInput = {
  connect?: InputMaybe<Array<DataObjectPartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectPartOfArchitecturesCreateFieldInput>>;
};

export type DataObjectPartOfArchitecturesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DataObjectPartOfArchitecturesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DataObjectPartOfArchitecturesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DataObjectPartOfArchitecturesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type DataObjectPartOfArchitecturesRelationship = {
  __typename?: 'DataObjectPartOfArchitecturesRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type DataObjectPartOfArchitecturesUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<DataObjectPartOfArchitecturesConnectionWhere>;
};

export type DataObjectPartOfArchitecturesUpdateFieldInput = {
  connect?: InputMaybe<Array<DataObjectPartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectPartOfArchitecturesCreateFieldInput>>;
  delete?: InputMaybe<Array<DataObjectPartOfArchitecturesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DataObjectPartOfArchitecturesDisconnectFieldInput>>;
  update?: InputMaybe<DataObjectPartOfArchitecturesUpdateConnectionInput>;
};

export type DataObjectPersonOwnersAggregateSelection = {
  __typename?: 'DataObjectPersonOwnersAggregateSelection';
  count: CountConnection;
  node?: Maybe<DataObjectPersonOwnersNodeAggregateSelection>;
};

export type DataObjectPersonOwnersNodeAggregateSelection = {
  __typename?: 'DataObjectPersonOwnersNodeAggregateSelection';
  avatarUrl: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DataObjectRelatedToCapabilitiesAggregateInput = {
  AND?: InputMaybe<Array<DataObjectRelatedToCapabilitiesAggregateInput>>;
  NOT?: InputMaybe<DataObjectRelatedToCapabilitiesAggregateInput>;
  OR?: InputMaybe<Array<DataObjectRelatedToCapabilitiesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DataObjectRelatedToCapabilitiesNodeAggregationWhereInput>;
};

export type DataObjectRelatedToCapabilitiesConnectFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityConnectInput>>;
  where?: InputMaybe<BusinessCapabilityConnectWhere>;
};

export type DataObjectRelatedToCapabilitiesConnection = {
  __typename?: 'DataObjectRelatedToCapabilitiesConnection';
  aggregate: DataObjectBusinessCapabilityRelatedToCapabilitiesAggregateSelection;
  edges: Array<DataObjectRelatedToCapabilitiesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DataObjectRelatedToCapabilitiesConnectionAggregateInput = {
  AND?: InputMaybe<Array<DataObjectRelatedToCapabilitiesConnectionAggregateInput>>;
  NOT?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionAggregateInput>;
  OR?: InputMaybe<Array<DataObjectRelatedToCapabilitiesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DataObjectRelatedToCapabilitiesNodeAggregationWhereInput>;
};

export type DataObjectRelatedToCapabilitiesConnectionFilters = {
  /** Filter DataObjects by aggregating results on related DataObjectRelatedToCapabilitiesConnections */
  aggregate?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionAggregateInput>;
  /** Return DataObjects where all of the related DataObjectRelatedToCapabilitiesConnections match this filter */
  all?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionWhere>;
  /** Return DataObjects where none of the related DataObjectRelatedToCapabilitiesConnections match this filter */
  none?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionWhere>;
  /** Return DataObjects where one of the related DataObjectRelatedToCapabilitiesConnections match this filter */
  single?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionWhere>;
  /** Return DataObjects where some of the related DataObjectRelatedToCapabilitiesConnections match this filter */
  some?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionWhere>;
};

export type DataObjectRelatedToCapabilitiesConnectionSort = {
  node?: InputMaybe<BusinessCapabilitySort>;
};

export type DataObjectRelatedToCapabilitiesConnectionWhere = {
  AND?: InputMaybe<Array<DataObjectRelatedToCapabilitiesConnectionWhere>>;
  NOT?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionWhere>;
  OR?: InputMaybe<Array<DataObjectRelatedToCapabilitiesConnectionWhere>>;
  node?: InputMaybe<BusinessCapabilityWhere>;
};

export type DataObjectRelatedToCapabilitiesCreateFieldInput = {
  node: BusinessCapabilityCreateInput;
};

export type DataObjectRelatedToCapabilitiesDeleteFieldInput = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionWhere>;
};

export type DataObjectRelatedToCapabilitiesDisconnectFieldInput = {
  disconnect?: InputMaybe<BusinessCapabilityDisconnectInput>;
  where?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionWhere>;
};

export type DataObjectRelatedToCapabilitiesFieldInput = {
  connect?: InputMaybe<Array<DataObjectRelatedToCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectRelatedToCapabilitiesCreateFieldInput>>;
};

export type DataObjectRelatedToCapabilitiesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DataObjectRelatedToCapabilitiesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DataObjectRelatedToCapabilitiesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DataObjectRelatedToCapabilitiesNodeAggregationWhereInput>>;
  businessValue?: InputMaybe<IntScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  maturityLevel?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  sequenceNumber?: InputMaybe<IntScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type DataObjectRelatedToCapabilitiesRelationship = {
  __typename?: 'DataObjectRelatedToCapabilitiesRelationship';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type DataObjectRelatedToCapabilitiesUpdateConnectionInput = {
  node?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionWhere>;
};

export type DataObjectRelatedToCapabilitiesUpdateFieldInput = {
  connect?: InputMaybe<Array<DataObjectRelatedToCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectRelatedToCapabilitiesCreateFieldInput>>;
  delete?: InputMaybe<Array<DataObjectRelatedToCapabilitiesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DataObjectRelatedToCapabilitiesDisconnectFieldInput>>;
  update?: InputMaybe<DataObjectRelatedToCapabilitiesUpdateConnectionInput>;
};

export type DataObjectRelationshipFilters = {
  /** Filter type where all of the related DataObjects match this filter */
  all?: InputMaybe<DataObjectWhere>;
  /** Filter type where none of the related DataObjects match this filter */
  none?: InputMaybe<DataObjectWhere>;
  /** Filter type where one of the related DataObjects match this filter */
  single?: InputMaybe<DataObjectWhere>;
  /** Filter type where some of the related DataObjects match this filter */
  some?: InputMaybe<DataObjectWhere>;
};

/** Fields to sort DataObjects by. The order in which sorts are applied is not guaranteed when specifying many fields in one DataObjectSort object. */
export type DataObjectSort = {
  classification?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  endOfLifeDate?: InputMaybe<SortDirection>;
  endOfUseDate?: InputMaybe<SortDirection>;
  format?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  introductionDate?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  planningDate?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type DataObjectTransferredInInterfacesAggregateInput = {
  AND?: InputMaybe<Array<DataObjectTransferredInInterfacesAggregateInput>>;
  NOT?: InputMaybe<DataObjectTransferredInInterfacesAggregateInput>;
  OR?: InputMaybe<Array<DataObjectTransferredInInterfacesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DataObjectTransferredInInterfacesNodeAggregationWhereInput>;
};

export type DataObjectTransferredInInterfacesConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type DataObjectTransferredInInterfacesConnection = {
  __typename?: 'DataObjectTransferredInInterfacesConnection';
  aggregate: DataObjectApplicationInterfaceTransferredInInterfacesAggregateSelection;
  edges: Array<DataObjectTransferredInInterfacesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DataObjectTransferredInInterfacesConnectionAggregateInput = {
  AND?: InputMaybe<Array<DataObjectTransferredInInterfacesConnectionAggregateInput>>;
  NOT?: InputMaybe<DataObjectTransferredInInterfacesConnectionAggregateInput>;
  OR?: InputMaybe<Array<DataObjectTransferredInInterfacesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DataObjectTransferredInInterfacesNodeAggregationWhereInput>;
};

export type DataObjectTransferredInInterfacesConnectionFilters = {
  /** Filter DataObjects by aggregating results on related DataObjectTransferredInInterfacesConnections */
  aggregate?: InputMaybe<DataObjectTransferredInInterfacesConnectionAggregateInput>;
  /** Return DataObjects where all of the related DataObjectTransferredInInterfacesConnections match this filter */
  all?: InputMaybe<DataObjectTransferredInInterfacesConnectionWhere>;
  /** Return DataObjects where none of the related DataObjectTransferredInInterfacesConnections match this filter */
  none?: InputMaybe<DataObjectTransferredInInterfacesConnectionWhere>;
  /** Return DataObjects where one of the related DataObjectTransferredInInterfacesConnections match this filter */
  single?: InputMaybe<DataObjectTransferredInInterfacesConnectionWhere>;
  /** Return DataObjects where some of the related DataObjectTransferredInInterfacesConnections match this filter */
  some?: InputMaybe<DataObjectTransferredInInterfacesConnectionWhere>;
};

export type DataObjectTransferredInInterfacesConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type DataObjectTransferredInInterfacesConnectionWhere = {
  AND?: InputMaybe<Array<DataObjectTransferredInInterfacesConnectionWhere>>;
  NOT?: InputMaybe<DataObjectTransferredInInterfacesConnectionWhere>;
  OR?: InputMaybe<Array<DataObjectTransferredInInterfacesConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type DataObjectTransferredInInterfacesCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type DataObjectTransferredInInterfacesDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<DataObjectTransferredInInterfacesConnectionWhere>;
};

export type DataObjectTransferredInInterfacesDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<DataObjectTransferredInInterfacesConnectionWhere>;
};

export type DataObjectTransferredInInterfacesFieldInput = {
  connect?: InputMaybe<Array<DataObjectTransferredInInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectTransferredInInterfacesCreateFieldInput>>;
};

export type DataObjectTransferredInInterfacesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DataObjectTransferredInInterfacesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DataObjectTransferredInInterfacesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DataObjectTransferredInInterfacesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type DataObjectTransferredInInterfacesRelationship = {
  __typename?: 'DataObjectTransferredInInterfacesRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type DataObjectTransferredInInterfacesUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<DataObjectTransferredInInterfacesConnectionWhere>;
};

export type DataObjectTransferredInInterfacesUpdateFieldInput = {
  connect?: InputMaybe<Array<DataObjectTransferredInInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectTransferredInInterfacesCreateFieldInput>>;
  delete?: InputMaybe<Array<DataObjectTransferredInInterfacesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DataObjectTransferredInInterfacesDisconnectFieldInput>>;
  update?: InputMaybe<DataObjectTransferredInInterfacesUpdateConnectionInput>;
};

export type DataObjectUpdateInput = {
  classification?: InputMaybe<DataClassificationEnumScalarMutations>;
  company?: InputMaybe<Array<DataObjectCompanyUpdateFieldInput>>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  dataSources?: InputMaybe<Array<DataObjectDataSourcesUpdateFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<DataObjectDepictedInDiagramsUpdateFieldInput>>;
  description?: InputMaybe<StringScalarMutations>;
  endOfLifeDate?: InputMaybe<DateScalarMutations>;
  endOfUseDate?: InputMaybe<DateScalarMutations>;
  format?: InputMaybe<StringScalarMutations>;
  introductionDate?: InputMaybe<DateScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<DataObjectOwnersUpdateFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<DataObjectPartOfArchitecturesUpdateFieldInput>>;
  planningDate?: InputMaybe<DateScalarMutations>;
  relatedToCapabilities?: InputMaybe<Array<DataObjectRelatedToCapabilitiesUpdateFieldInput>>;
  transferredInInterfaces?: InputMaybe<Array<DataObjectTransferredInInterfacesUpdateFieldInput>>;
  usedByApplications?: InputMaybe<Array<DataObjectUsedByApplicationsUpdateFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<DataObjectUsedByOrganisationsUpdateFieldInput>>;
  usedForTrainingAI?: InputMaybe<Array<DataObjectUsedForTrainingAiUpdateFieldInput>>;
};

export type DataObjectUsedByApplicationsAggregateInput = {
  AND?: InputMaybe<Array<DataObjectUsedByApplicationsAggregateInput>>;
  NOT?: InputMaybe<DataObjectUsedByApplicationsAggregateInput>;
  OR?: InputMaybe<Array<DataObjectUsedByApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DataObjectUsedByApplicationsNodeAggregationWhereInput>;
};

export type DataObjectUsedByApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type DataObjectUsedByApplicationsConnection = {
  __typename?: 'DataObjectUsedByApplicationsConnection';
  aggregate: DataObjectApplicationUsedByApplicationsAggregateSelection;
  edges: Array<DataObjectUsedByApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DataObjectUsedByApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<DataObjectUsedByApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<DataObjectUsedByApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<DataObjectUsedByApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DataObjectUsedByApplicationsNodeAggregationWhereInput>;
};

export type DataObjectUsedByApplicationsConnectionFilters = {
  /** Filter DataObjects by aggregating results on related DataObjectUsedByApplicationsConnections */
  aggregate?: InputMaybe<DataObjectUsedByApplicationsConnectionAggregateInput>;
  /** Return DataObjects where all of the related DataObjectUsedByApplicationsConnections match this filter */
  all?: InputMaybe<DataObjectUsedByApplicationsConnectionWhere>;
  /** Return DataObjects where none of the related DataObjectUsedByApplicationsConnections match this filter */
  none?: InputMaybe<DataObjectUsedByApplicationsConnectionWhere>;
  /** Return DataObjects where one of the related DataObjectUsedByApplicationsConnections match this filter */
  single?: InputMaybe<DataObjectUsedByApplicationsConnectionWhere>;
  /** Return DataObjects where some of the related DataObjectUsedByApplicationsConnections match this filter */
  some?: InputMaybe<DataObjectUsedByApplicationsConnectionWhere>;
};

export type DataObjectUsedByApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type DataObjectUsedByApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<DataObjectUsedByApplicationsConnectionWhere>>;
  NOT?: InputMaybe<DataObjectUsedByApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<DataObjectUsedByApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type DataObjectUsedByApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type DataObjectUsedByApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<DataObjectUsedByApplicationsConnectionWhere>;
};

export type DataObjectUsedByApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<DataObjectUsedByApplicationsConnectionWhere>;
};

export type DataObjectUsedByApplicationsFieldInput = {
  connect?: InputMaybe<Array<DataObjectUsedByApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectUsedByApplicationsCreateFieldInput>>;
};

export type DataObjectUsedByApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DataObjectUsedByApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DataObjectUsedByApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DataObjectUsedByApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type DataObjectUsedByApplicationsRelationship = {
  __typename?: 'DataObjectUsedByApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type DataObjectUsedByApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<DataObjectUsedByApplicationsConnectionWhere>;
};

export type DataObjectUsedByApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<DataObjectUsedByApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectUsedByApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<DataObjectUsedByApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DataObjectUsedByApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<DataObjectUsedByApplicationsUpdateConnectionInput>;
};

export type DataObjectUsedByOrganisationsAggregateInput = {
  AND?: InputMaybe<Array<DataObjectUsedByOrganisationsAggregateInput>>;
  NOT?: InputMaybe<DataObjectUsedByOrganisationsAggregateInput>;
  OR?: InputMaybe<Array<DataObjectUsedByOrganisationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DataObjectUsedByOrganisationsNodeAggregationWhereInput>;
};

export type DataObjectUsedByOrganisationsConnectFieldInput = {
  connect?: InputMaybe<Array<OrganisationConnectInput>>;
  where?: InputMaybe<OrganisationConnectWhere>;
};

export type DataObjectUsedByOrganisationsConnection = {
  __typename?: 'DataObjectUsedByOrganisationsConnection';
  aggregate: DataObjectOrganisationUsedByOrganisationsAggregateSelection;
  edges: Array<DataObjectUsedByOrganisationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DataObjectUsedByOrganisationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<DataObjectUsedByOrganisationsConnectionAggregateInput>>;
  NOT?: InputMaybe<DataObjectUsedByOrganisationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<DataObjectUsedByOrganisationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DataObjectUsedByOrganisationsNodeAggregationWhereInput>;
};

export type DataObjectUsedByOrganisationsConnectionFilters = {
  /** Filter DataObjects by aggregating results on related DataObjectUsedByOrganisationsConnections */
  aggregate?: InputMaybe<DataObjectUsedByOrganisationsConnectionAggregateInput>;
  /** Return DataObjects where all of the related DataObjectUsedByOrganisationsConnections match this filter */
  all?: InputMaybe<DataObjectUsedByOrganisationsConnectionWhere>;
  /** Return DataObjects where none of the related DataObjectUsedByOrganisationsConnections match this filter */
  none?: InputMaybe<DataObjectUsedByOrganisationsConnectionWhere>;
  /** Return DataObjects where one of the related DataObjectUsedByOrganisationsConnections match this filter */
  single?: InputMaybe<DataObjectUsedByOrganisationsConnectionWhere>;
  /** Return DataObjects where some of the related DataObjectUsedByOrganisationsConnections match this filter */
  some?: InputMaybe<DataObjectUsedByOrganisationsConnectionWhere>;
};

export type DataObjectUsedByOrganisationsConnectionSort = {
  node?: InputMaybe<OrganisationSort>;
};

export type DataObjectUsedByOrganisationsConnectionWhere = {
  AND?: InputMaybe<Array<DataObjectUsedByOrganisationsConnectionWhere>>;
  NOT?: InputMaybe<DataObjectUsedByOrganisationsConnectionWhere>;
  OR?: InputMaybe<Array<DataObjectUsedByOrganisationsConnectionWhere>>;
  node?: InputMaybe<OrganisationWhere>;
};

export type DataObjectUsedByOrganisationsCreateFieldInput = {
  node: OrganisationCreateInput;
};

export type DataObjectUsedByOrganisationsDeleteFieldInput = {
  delete?: InputMaybe<OrganisationDeleteInput>;
  where?: InputMaybe<DataObjectUsedByOrganisationsConnectionWhere>;
};

export type DataObjectUsedByOrganisationsDisconnectFieldInput = {
  disconnect?: InputMaybe<OrganisationDisconnectInput>;
  where?: InputMaybe<DataObjectUsedByOrganisationsConnectionWhere>;
};

export type DataObjectUsedByOrganisationsFieldInput = {
  connect?: InputMaybe<Array<DataObjectUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectUsedByOrganisationsCreateFieldInput>>;
};

export type DataObjectUsedByOrganisationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DataObjectUsedByOrganisationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DataObjectUsedByOrganisationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DataObjectUsedByOrganisationsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  level?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type DataObjectUsedByOrganisationsRelationship = {
  __typename?: 'DataObjectUsedByOrganisationsRelationship';
  cursor: Scalars['String']['output'];
  node: Organisation;
};

export type DataObjectUsedByOrganisationsUpdateConnectionInput = {
  node?: InputMaybe<OrganisationUpdateInput>;
  where?: InputMaybe<DataObjectUsedByOrganisationsConnectionWhere>;
};

export type DataObjectUsedByOrganisationsUpdateFieldInput = {
  connect?: InputMaybe<Array<DataObjectUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectUsedByOrganisationsCreateFieldInput>>;
  delete?: InputMaybe<Array<DataObjectUsedByOrganisationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DataObjectUsedByOrganisationsDisconnectFieldInput>>;
  update?: InputMaybe<DataObjectUsedByOrganisationsUpdateConnectionInput>;
};

export type DataObjectUsedForTrainingAiAggregateInput = {
  AND?: InputMaybe<Array<DataObjectUsedForTrainingAiAggregateInput>>;
  NOT?: InputMaybe<DataObjectUsedForTrainingAiAggregateInput>;
  OR?: InputMaybe<Array<DataObjectUsedForTrainingAiAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DataObjectUsedForTrainingAiNodeAggregationWhereInput>;
};

export type DataObjectUsedForTrainingAiConnectFieldInput = {
  connect?: InputMaybe<Array<AiAssetConnectInput>>;
  where?: InputMaybe<AiAssetConnectWhere>;
};

export type DataObjectUsedForTrainingAiConnection = {
  __typename?: 'DataObjectUsedForTrainingAIConnection';
  aggregate: DataObjectAiAssetUsedForTrainingAiAggregateSelection;
  edges: Array<DataObjectUsedForTrainingAiRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DataObjectUsedForTrainingAiConnectionAggregateInput = {
  AND?: InputMaybe<Array<DataObjectUsedForTrainingAiConnectionAggregateInput>>;
  NOT?: InputMaybe<DataObjectUsedForTrainingAiConnectionAggregateInput>;
  OR?: InputMaybe<Array<DataObjectUsedForTrainingAiConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DataObjectUsedForTrainingAiNodeAggregationWhereInput>;
};

export type DataObjectUsedForTrainingAiConnectionFilters = {
  /** Filter DataObjects by aggregating results on related DataObjectUsedForTrainingAIConnections */
  aggregate?: InputMaybe<DataObjectUsedForTrainingAiConnectionAggregateInput>;
  /** Return DataObjects where all of the related DataObjectUsedForTrainingAIConnections match this filter */
  all?: InputMaybe<DataObjectUsedForTrainingAiConnectionWhere>;
  /** Return DataObjects where none of the related DataObjectUsedForTrainingAIConnections match this filter */
  none?: InputMaybe<DataObjectUsedForTrainingAiConnectionWhere>;
  /** Return DataObjects where one of the related DataObjectUsedForTrainingAIConnections match this filter */
  single?: InputMaybe<DataObjectUsedForTrainingAiConnectionWhere>;
  /** Return DataObjects where some of the related DataObjectUsedForTrainingAIConnections match this filter */
  some?: InputMaybe<DataObjectUsedForTrainingAiConnectionWhere>;
};

export type DataObjectUsedForTrainingAiConnectionSort = {
  node?: InputMaybe<AiAssetSort>;
};

export type DataObjectUsedForTrainingAiConnectionWhere = {
  AND?: InputMaybe<Array<DataObjectUsedForTrainingAiConnectionWhere>>;
  NOT?: InputMaybe<DataObjectUsedForTrainingAiConnectionWhere>;
  OR?: InputMaybe<Array<DataObjectUsedForTrainingAiConnectionWhere>>;
  node?: InputMaybe<AiAssetWhere>;
};

export type DataObjectUsedForTrainingAiCreateFieldInput = {
  node: AiAssetCreateInput;
};

export type DataObjectUsedForTrainingAiDeleteFieldInput = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<DataObjectUsedForTrainingAiConnectionWhere>;
};

export type DataObjectUsedForTrainingAiDisconnectFieldInput = {
  disconnect?: InputMaybe<AiAssetDisconnectInput>;
  where?: InputMaybe<DataObjectUsedForTrainingAiConnectionWhere>;
};

export type DataObjectUsedForTrainingAiFieldInput = {
  connect?: InputMaybe<Array<DataObjectUsedForTrainingAiConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectUsedForTrainingAiCreateFieldInput>>;
};

export type DataObjectUsedForTrainingAiNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DataObjectUsedForTrainingAiNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DataObjectUsedForTrainingAiNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DataObjectUsedForTrainingAiNodeAggregationWhereInput>>;
  accuracy?: InputMaybe<FloatScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  license?: InputMaybe<StringScalarAggregationFilters>;
  model?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  provider?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type DataObjectUsedForTrainingAiRelationship = {
  __typename?: 'DataObjectUsedForTrainingAIRelationship';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type DataObjectUsedForTrainingAiUpdateConnectionInput = {
  node?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<DataObjectUsedForTrainingAiConnectionWhere>;
};

export type DataObjectUsedForTrainingAiUpdateFieldInput = {
  connect?: InputMaybe<Array<DataObjectUsedForTrainingAiConnectFieldInput>>;
  create?: InputMaybe<Array<DataObjectUsedForTrainingAiCreateFieldInput>>;
  delete?: InputMaybe<Array<DataObjectUsedForTrainingAiDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DataObjectUsedForTrainingAiDisconnectFieldInput>>;
  update?: InputMaybe<DataObjectUsedForTrainingAiUpdateConnectionInput>;
};

export type DataObjectWhere = {
  AND?: InputMaybe<Array<DataObjectWhere>>;
  NOT?: InputMaybe<DataObjectWhere>;
  OR?: InputMaybe<Array<DataObjectWhere>>;
  classification?: InputMaybe<DataClassificationEnumScalarFilters>;
  company?: InputMaybe<CompanyRelationshipFilters>;
  companyConnection?: InputMaybe<DataObjectCompanyConnectionFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  dataSources?: InputMaybe<ApplicationRelationshipFilters>;
  dataSourcesConnection?: InputMaybe<DataObjectDataSourcesConnectionFilters>;
  depictedInDiagrams?: InputMaybe<DiagramRelationshipFilters>;
  depictedInDiagramsConnection?: InputMaybe<DataObjectDepictedInDiagramsConnectionFilters>;
  description?: InputMaybe<StringScalarFilters>;
  endOfLifeDate?: InputMaybe<DateScalarFilters>;
  endOfUseDate?: InputMaybe<DateScalarFilters>;
  format?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  introductionDate?: InputMaybe<DateScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  owners?: InputMaybe<PersonRelationshipFilters>;
  ownersConnection?: InputMaybe<DataObjectOwnersConnectionFilters>;
  partOfArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  partOfArchitecturesConnection?: InputMaybe<DataObjectPartOfArchitecturesConnectionFilters>;
  planningDate?: InputMaybe<DateScalarFilters>;
  relatedToCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  relatedToCapabilitiesConnection?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionFilters>;
  transferredInInterfaces?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  transferredInInterfacesConnection?: InputMaybe<DataObjectTransferredInInterfacesConnectionFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
  usedByApplications?: InputMaybe<ApplicationRelationshipFilters>;
  usedByApplicationsConnection?: InputMaybe<DataObjectUsedByApplicationsConnectionFilters>;
  usedByOrganisations?: InputMaybe<OrganisationRelationshipFilters>;
  usedByOrganisationsConnection?: InputMaybe<DataObjectUsedByOrganisationsConnectionFilters>;
  usedForTrainingAI?: InputMaybe<AiAssetRelationshipFilters>;
  usedForTrainingAIConnection?: InputMaybe<DataObjectUsedForTrainingAiConnectionFilters>;
};

export type DataObjectsConnection = {
  __typename?: 'DataObjectsConnection';
  aggregate: DataObjectAggregate;
  edges: Array<DataObjectEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Date filters */
export type DateScalarFilters = {
  eq?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<Scalars['Date']['input']>>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
};

/** Date mutations */
export type DateScalarMutations = {
  set?: InputMaybe<Scalars['Date']['input']>;
};

export type DateTimeAggregateSelection = {
  __typename?: 'DateTimeAggregateSelection';
  max?: Maybe<Scalars['DateTime']['output']>;
  min?: Maybe<Scalars['DateTime']['output']>;
};

/** Filters for an aggregation of an DateTime input field */
export type DateTimeScalarAggregationFilters = {
  max?: InputMaybe<DateTimeScalarFilters>;
  min?: InputMaybe<DateTimeScalarFilters>;
};

/** DateTime filters */
export type DateTimeScalarFilters = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
};

/** DateTime mutations */
export type DateTimeScalarMutations = {
  set?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Information about the number of nodes and relationships deleted during a delete mutation */
export type DeleteInfo = {
  __typename?: 'DeleteInfo';
  nodesDeleted: Scalars['Int']['output'];
  relationshipsDeleted: Scalars['Int']['output'];
};

/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type Diagram = {
  __typename?: 'Diagram';
  architecture: Array<Architecture>;
  architectureConnection: DiagramArchitectureConnection;
  containsAIAssets: Array<AiAsset>;
  containsAIAssetsConnection: DiagramContainsAiAssetsConnection;
  containsApplications: Array<Application>;
  containsApplicationsConnection: DiagramContainsApplicationsConnection;
  containsCapabilities: Array<BusinessCapability>;
  containsCapabilitiesConnection: DiagramContainsCapabilitiesConnection;
  containsDataObjects: Array<DataObject>;
  containsDataObjectsConnection: DiagramContainsDataObjectsConnection;
  containsInfrastructure: Array<Infrastructure>;
  containsInfrastructureConnection: DiagramContainsInfrastructureConnection;
  containsInterfaces: Array<ApplicationInterface>;
  containsInterfacesConnection: DiagramContainsInterfacesConnection;
  createdAt: Scalars['DateTime']['output'];
  creator: Array<Person>;
  creatorConnection: DiagramCreatorConnection;
  description?: Maybe<Scalars['String']['output']>;
  diagramJson: Scalars['String']['output'];
  diagramPng?: Maybe<Scalars['String']['output']>;
  diagramType?: Maybe<DiagramType>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramArchitectureArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramArchitectureConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramArchitectureConnectionSort>>;
  where?: InputMaybe<DiagramArchitectureConnectionWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsAiAssetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsAiAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramContainsAiAssetsConnectionSort>>;
  where?: InputMaybe<DiagramContainsAiAssetsConnectionWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramContainsApplicationsConnectionSort>>;
  where?: InputMaybe<DiagramContainsApplicationsConnectionWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsCapabilitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsCapabilitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramContainsCapabilitiesConnectionSort>>;
  where?: InputMaybe<DiagramContainsCapabilitiesConnectionWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramContainsDataObjectsConnectionSort>>;
  where?: InputMaybe<DiagramContainsDataObjectsConnectionWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsInfrastructureArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsInfrastructureConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramContainsInfrastructureConnectionSort>>;
  where?: InputMaybe<DiagramContainsInfrastructureConnectionWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsInterfacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramContainsInterfacesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramContainsInterfacesConnectionSort>>;
  where?: InputMaybe<DiagramContainsInterfacesConnectionWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramCreatorArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};


/** Diagram - repräsentiert ein Excalidraw-Diagramm */
export type DiagramCreatorConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramCreatorConnectionSort>>;
  where?: InputMaybe<DiagramCreatorConnectionWhere>;
};

export type DiagramAiAssetContainsAiAssetsAggregateSelection = {
  __typename?: 'DiagramAIAssetContainsAIAssetsAggregateSelection';
  count: CountConnection;
  node?: Maybe<DiagramAiAssetContainsAiAssetsNodeAggregateSelection>;
};

export type DiagramAiAssetContainsAiAssetsNodeAggregateSelection = {
  __typename?: 'DiagramAIAssetContainsAIAssetsNodeAggregateSelection';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type DiagramAggregate = {
  __typename?: 'DiagramAggregate';
  count: Count;
  node: DiagramAggregateNode;
};

export type DiagramAggregateNode = {
  __typename?: 'DiagramAggregateNode';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  diagramJson: StringAggregateSelection;
  diagramPng: StringAggregateSelection;
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DiagramApplicationContainsApplicationsAggregateSelection = {
  __typename?: 'DiagramApplicationContainsApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<DiagramApplicationContainsApplicationsNodeAggregateSelection>;
};

export type DiagramApplicationContainsApplicationsNodeAggregateSelection = {
  __typename?: 'DiagramApplicationContainsApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type DiagramApplicationInterfaceContainsInterfacesAggregateSelection = {
  __typename?: 'DiagramApplicationInterfaceContainsInterfacesAggregateSelection';
  count: CountConnection;
  node?: Maybe<DiagramApplicationInterfaceContainsInterfacesNodeAggregateSelection>;
};

export type DiagramApplicationInterfaceContainsInterfacesNodeAggregateSelection = {
  __typename?: 'DiagramApplicationInterfaceContainsInterfacesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type DiagramArchitectureAggregateInput = {
  AND?: InputMaybe<Array<DiagramArchitectureAggregateInput>>;
  NOT?: InputMaybe<DiagramArchitectureAggregateInput>;
  OR?: InputMaybe<Array<DiagramArchitectureAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DiagramArchitectureNodeAggregationWhereInput>;
};

export type DiagramArchitectureArchitectureAggregateSelection = {
  __typename?: 'DiagramArchitectureArchitectureAggregateSelection';
  count: CountConnection;
  node?: Maybe<DiagramArchitectureArchitectureNodeAggregateSelection>;
};

export type DiagramArchitectureArchitectureNodeAggregateSelection = {
  __typename?: 'DiagramArchitectureArchitectureNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DiagramArchitectureConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type DiagramArchitectureConnection = {
  __typename?: 'DiagramArchitectureConnection';
  aggregate: DiagramArchitectureArchitectureAggregateSelection;
  edges: Array<DiagramArchitectureRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DiagramArchitectureConnectionAggregateInput = {
  AND?: InputMaybe<Array<DiagramArchitectureConnectionAggregateInput>>;
  NOT?: InputMaybe<DiagramArchitectureConnectionAggregateInput>;
  OR?: InputMaybe<Array<DiagramArchitectureConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DiagramArchitectureNodeAggregationWhereInput>;
};

export type DiagramArchitectureConnectionFilters = {
  /** Filter Diagrams by aggregating results on related DiagramArchitectureConnections */
  aggregate?: InputMaybe<DiagramArchitectureConnectionAggregateInput>;
  /** Return Diagrams where all of the related DiagramArchitectureConnections match this filter */
  all?: InputMaybe<DiagramArchitectureConnectionWhere>;
  /** Return Diagrams where none of the related DiagramArchitectureConnections match this filter */
  none?: InputMaybe<DiagramArchitectureConnectionWhere>;
  /** Return Diagrams where one of the related DiagramArchitectureConnections match this filter */
  single?: InputMaybe<DiagramArchitectureConnectionWhere>;
  /** Return Diagrams where some of the related DiagramArchitectureConnections match this filter */
  some?: InputMaybe<DiagramArchitectureConnectionWhere>;
};

export type DiagramArchitectureConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type DiagramArchitectureConnectionWhere = {
  AND?: InputMaybe<Array<DiagramArchitectureConnectionWhere>>;
  NOT?: InputMaybe<DiagramArchitectureConnectionWhere>;
  OR?: InputMaybe<Array<DiagramArchitectureConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type DiagramArchitectureCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type DiagramArchitectureDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<DiagramArchitectureConnectionWhere>;
};

export type DiagramArchitectureDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<DiagramArchitectureConnectionWhere>;
};

export type DiagramArchitectureFieldInput = {
  connect?: InputMaybe<Array<DiagramArchitectureConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramArchitectureCreateFieldInput>>;
};

export type DiagramArchitectureNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DiagramArchitectureNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DiagramArchitectureNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DiagramArchitectureNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type DiagramArchitectureRelationship = {
  __typename?: 'DiagramArchitectureRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type DiagramArchitectureUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<DiagramArchitectureConnectionWhere>;
};

export type DiagramArchitectureUpdateFieldInput = {
  connect?: InputMaybe<Array<DiagramArchitectureConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramArchitectureCreateFieldInput>>;
  delete?: InputMaybe<Array<DiagramArchitectureDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DiagramArchitectureDisconnectFieldInput>>;
  update?: InputMaybe<DiagramArchitectureUpdateConnectionInput>;
};

export type DiagramBusinessCapabilityContainsCapabilitiesAggregateSelection = {
  __typename?: 'DiagramBusinessCapabilityContainsCapabilitiesAggregateSelection';
  count: CountConnection;
  node?: Maybe<DiagramBusinessCapabilityContainsCapabilitiesNodeAggregateSelection>;
};

export type DiagramBusinessCapabilityContainsCapabilitiesNodeAggregateSelection = {
  __typename?: 'DiagramBusinessCapabilityContainsCapabilitiesNodeAggregateSelection';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DiagramConnectInput = {
  architecture?: InputMaybe<Array<DiagramArchitectureConnectFieldInput>>;
  containsAIAssets?: InputMaybe<Array<DiagramContainsAiAssetsConnectFieldInput>>;
  containsApplications?: InputMaybe<Array<DiagramContainsApplicationsConnectFieldInput>>;
  containsCapabilities?: InputMaybe<Array<DiagramContainsCapabilitiesConnectFieldInput>>;
  containsDataObjects?: InputMaybe<Array<DiagramContainsDataObjectsConnectFieldInput>>;
  containsInfrastructure?: InputMaybe<Array<DiagramContainsInfrastructureConnectFieldInput>>;
  containsInterfaces?: InputMaybe<Array<DiagramContainsInterfacesConnectFieldInput>>;
  creator?: InputMaybe<Array<DiagramCreatorConnectFieldInput>>;
};

export type DiagramConnectWhere = {
  node: DiagramWhere;
};

export type DiagramContainsAiAssetsAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsAiAssetsAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsAiAssetsAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsAiAssetsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DiagramContainsAiAssetsNodeAggregationWhereInput>;
};

export type DiagramContainsAiAssetsConnectFieldInput = {
  connect?: InputMaybe<Array<AiAssetConnectInput>>;
  where?: InputMaybe<AiAssetConnectWhere>;
};

export type DiagramContainsAiAssetsConnection = {
  __typename?: 'DiagramContainsAIAssetsConnection';
  aggregate: DiagramAiAssetContainsAiAssetsAggregateSelection;
  edges: Array<DiagramContainsAiAssetsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DiagramContainsAiAssetsConnectionAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsAiAssetsConnectionAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsAiAssetsConnectionAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsAiAssetsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DiagramContainsAiAssetsNodeAggregationWhereInput>;
};

export type DiagramContainsAiAssetsConnectionFilters = {
  /** Filter Diagrams by aggregating results on related DiagramContainsAIAssetsConnections */
  aggregate?: InputMaybe<DiagramContainsAiAssetsConnectionAggregateInput>;
  /** Return Diagrams where all of the related DiagramContainsAIAssetsConnections match this filter */
  all?: InputMaybe<DiagramContainsAiAssetsConnectionWhere>;
  /** Return Diagrams where none of the related DiagramContainsAIAssetsConnections match this filter */
  none?: InputMaybe<DiagramContainsAiAssetsConnectionWhere>;
  /** Return Diagrams where one of the related DiagramContainsAIAssetsConnections match this filter */
  single?: InputMaybe<DiagramContainsAiAssetsConnectionWhere>;
  /** Return Diagrams where some of the related DiagramContainsAIAssetsConnections match this filter */
  some?: InputMaybe<DiagramContainsAiAssetsConnectionWhere>;
};

export type DiagramContainsAiAssetsConnectionSort = {
  node?: InputMaybe<AiAssetSort>;
};

export type DiagramContainsAiAssetsConnectionWhere = {
  AND?: InputMaybe<Array<DiagramContainsAiAssetsConnectionWhere>>;
  NOT?: InputMaybe<DiagramContainsAiAssetsConnectionWhere>;
  OR?: InputMaybe<Array<DiagramContainsAiAssetsConnectionWhere>>;
  node?: InputMaybe<AiAssetWhere>;
};

export type DiagramContainsAiAssetsCreateFieldInput = {
  node: AiAssetCreateInput;
};

export type DiagramContainsAiAssetsDeleteFieldInput = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<DiagramContainsAiAssetsConnectionWhere>;
};

export type DiagramContainsAiAssetsDisconnectFieldInput = {
  disconnect?: InputMaybe<AiAssetDisconnectInput>;
  where?: InputMaybe<DiagramContainsAiAssetsConnectionWhere>;
};

export type DiagramContainsAiAssetsFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsAiAssetsCreateFieldInput>>;
};

export type DiagramContainsAiAssetsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DiagramContainsAiAssetsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DiagramContainsAiAssetsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DiagramContainsAiAssetsNodeAggregationWhereInput>>;
  accuracy?: InputMaybe<FloatScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  license?: InputMaybe<StringScalarAggregationFilters>;
  model?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  provider?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type DiagramContainsAiAssetsRelationship = {
  __typename?: 'DiagramContainsAIAssetsRelationship';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type DiagramContainsAiAssetsUpdateConnectionInput = {
  node?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<DiagramContainsAiAssetsConnectionWhere>;
};

export type DiagramContainsAiAssetsUpdateFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsAiAssetsCreateFieldInput>>;
  delete?: InputMaybe<Array<DiagramContainsAiAssetsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DiagramContainsAiAssetsDisconnectFieldInput>>;
  update?: InputMaybe<DiagramContainsAiAssetsUpdateConnectionInput>;
};

export type DiagramContainsApplicationsAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsApplicationsAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsApplicationsAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DiagramContainsApplicationsNodeAggregationWhereInput>;
};

export type DiagramContainsApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type DiagramContainsApplicationsConnection = {
  __typename?: 'DiagramContainsApplicationsConnection';
  aggregate: DiagramApplicationContainsApplicationsAggregateSelection;
  edges: Array<DiagramContainsApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DiagramContainsApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DiagramContainsApplicationsNodeAggregationWhereInput>;
};

export type DiagramContainsApplicationsConnectionFilters = {
  /** Filter Diagrams by aggregating results on related DiagramContainsApplicationsConnections */
  aggregate?: InputMaybe<DiagramContainsApplicationsConnectionAggregateInput>;
  /** Return Diagrams where all of the related DiagramContainsApplicationsConnections match this filter */
  all?: InputMaybe<DiagramContainsApplicationsConnectionWhere>;
  /** Return Diagrams where none of the related DiagramContainsApplicationsConnections match this filter */
  none?: InputMaybe<DiagramContainsApplicationsConnectionWhere>;
  /** Return Diagrams where one of the related DiagramContainsApplicationsConnections match this filter */
  single?: InputMaybe<DiagramContainsApplicationsConnectionWhere>;
  /** Return Diagrams where some of the related DiagramContainsApplicationsConnections match this filter */
  some?: InputMaybe<DiagramContainsApplicationsConnectionWhere>;
};

export type DiagramContainsApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type DiagramContainsApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<DiagramContainsApplicationsConnectionWhere>>;
  NOT?: InputMaybe<DiagramContainsApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<DiagramContainsApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type DiagramContainsApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type DiagramContainsApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<DiagramContainsApplicationsConnectionWhere>;
};

export type DiagramContainsApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<DiagramContainsApplicationsConnectionWhere>;
};

export type DiagramContainsApplicationsFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsApplicationsCreateFieldInput>>;
};

export type DiagramContainsApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DiagramContainsApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DiagramContainsApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DiagramContainsApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type DiagramContainsApplicationsRelationship = {
  __typename?: 'DiagramContainsApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type DiagramContainsApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<DiagramContainsApplicationsConnectionWhere>;
};

export type DiagramContainsApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<DiagramContainsApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DiagramContainsApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<DiagramContainsApplicationsUpdateConnectionInput>;
};

export type DiagramContainsCapabilitiesAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsCapabilitiesAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsCapabilitiesAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsCapabilitiesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DiagramContainsCapabilitiesNodeAggregationWhereInput>;
};

export type DiagramContainsCapabilitiesConnectFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityConnectInput>>;
  where?: InputMaybe<BusinessCapabilityConnectWhere>;
};

export type DiagramContainsCapabilitiesConnection = {
  __typename?: 'DiagramContainsCapabilitiesConnection';
  aggregate: DiagramBusinessCapabilityContainsCapabilitiesAggregateSelection;
  edges: Array<DiagramContainsCapabilitiesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DiagramContainsCapabilitiesConnectionAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsCapabilitiesConnectionAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsCapabilitiesConnectionAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsCapabilitiesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DiagramContainsCapabilitiesNodeAggregationWhereInput>;
};

export type DiagramContainsCapabilitiesConnectionFilters = {
  /** Filter Diagrams by aggregating results on related DiagramContainsCapabilitiesConnections */
  aggregate?: InputMaybe<DiagramContainsCapabilitiesConnectionAggregateInput>;
  /** Return Diagrams where all of the related DiagramContainsCapabilitiesConnections match this filter */
  all?: InputMaybe<DiagramContainsCapabilitiesConnectionWhere>;
  /** Return Diagrams where none of the related DiagramContainsCapabilitiesConnections match this filter */
  none?: InputMaybe<DiagramContainsCapabilitiesConnectionWhere>;
  /** Return Diagrams where one of the related DiagramContainsCapabilitiesConnections match this filter */
  single?: InputMaybe<DiagramContainsCapabilitiesConnectionWhere>;
  /** Return Diagrams where some of the related DiagramContainsCapabilitiesConnections match this filter */
  some?: InputMaybe<DiagramContainsCapabilitiesConnectionWhere>;
};

export type DiagramContainsCapabilitiesConnectionSort = {
  node?: InputMaybe<BusinessCapabilitySort>;
};

export type DiagramContainsCapabilitiesConnectionWhere = {
  AND?: InputMaybe<Array<DiagramContainsCapabilitiesConnectionWhere>>;
  NOT?: InputMaybe<DiagramContainsCapabilitiesConnectionWhere>;
  OR?: InputMaybe<Array<DiagramContainsCapabilitiesConnectionWhere>>;
  node?: InputMaybe<BusinessCapabilityWhere>;
};

export type DiagramContainsCapabilitiesCreateFieldInput = {
  node: BusinessCapabilityCreateInput;
};

export type DiagramContainsCapabilitiesDeleteFieldInput = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<DiagramContainsCapabilitiesConnectionWhere>;
};

export type DiagramContainsCapabilitiesDisconnectFieldInput = {
  disconnect?: InputMaybe<BusinessCapabilityDisconnectInput>;
  where?: InputMaybe<DiagramContainsCapabilitiesConnectionWhere>;
};

export type DiagramContainsCapabilitiesFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsCapabilitiesCreateFieldInput>>;
};

export type DiagramContainsCapabilitiesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DiagramContainsCapabilitiesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DiagramContainsCapabilitiesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DiagramContainsCapabilitiesNodeAggregationWhereInput>>;
  businessValue?: InputMaybe<IntScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  maturityLevel?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  sequenceNumber?: InputMaybe<IntScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type DiagramContainsCapabilitiesRelationship = {
  __typename?: 'DiagramContainsCapabilitiesRelationship';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type DiagramContainsCapabilitiesUpdateConnectionInput = {
  node?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<DiagramContainsCapabilitiesConnectionWhere>;
};

export type DiagramContainsCapabilitiesUpdateFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsCapabilitiesCreateFieldInput>>;
  delete?: InputMaybe<Array<DiagramContainsCapabilitiesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DiagramContainsCapabilitiesDisconnectFieldInput>>;
  update?: InputMaybe<DiagramContainsCapabilitiesUpdateConnectionInput>;
};

export type DiagramContainsDataObjectsAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsDataObjectsAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsDataObjectsAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsDataObjectsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DiagramContainsDataObjectsNodeAggregationWhereInput>;
};

export type DiagramContainsDataObjectsConnectFieldInput = {
  connect?: InputMaybe<Array<DataObjectConnectInput>>;
  where?: InputMaybe<DataObjectConnectWhere>;
};

export type DiagramContainsDataObjectsConnection = {
  __typename?: 'DiagramContainsDataObjectsConnection';
  aggregate: DiagramDataObjectContainsDataObjectsAggregateSelection;
  edges: Array<DiagramContainsDataObjectsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DiagramContainsDataObjectsConnectionAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsDataObjectsConnectionAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsDataObjectsConnectionAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsDataObjectsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DiagramContainsDataObjectsNodeAggregationWhereInput>;
};

export type DiagramContainsDataObjectsConnectionFilters = {
  /** Filter Diagrams by aggregating results on related DiagramContainsDataObjectsConnections */
  aggregate?: InputMaybe<DiagramContainsDataObjectsConnectionAggregateInput>;
  /** Return Diagrams where all of the related DiagramContainsDataObjectsConnections match this filter */
  all?: InputMaybe<DiagramContainsDataObjectsConnectionWhere>;
  /** Return Diagrams where none of the related DiagramContainsDataObjectsConnections match this filter */
  none?: InputMaybe<DiagramContainsDataObjectsConnectionWhere>;
  /** Return Diagrams where one of the related DiagramContainsDataObjectsConnections match this filter */
  single?: InputMaybe<DiagramContainsDataObjectsConnectionWhere>;
  /** Return Diagrams where some of the related DiagramContainsDataObjectsConnections match this filter */
  some?: InputMaybe<DiagramContainsDataObjectsConnectionWhere>;
};

export type DiagramContainsDataObjectsConnectionSort = {
  node?: InputMaybe<DataObjectSort>;
};

export type DiagramContainsDataObjectsConnectionWhere = {
  AND?: InputMaybe<Array<DiagramContainsDataObjectsConnectionWhere>>;
  NOT?: InputMaybe<DiagramContainsDataObjectsConnectionWhere>;
  OR?: InputMaybe<Array<DiagramContainsDataObjectsConnectionWhere>>;
  node?: InputMaybe<DataObjectWhere>;
};

export type DiagramContainsDataObjectsCreateFieldInput = {
  node: DataObjectCreateInput;
};

export type DiagramContainsDataObjectsDeleteFieldInput = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<DiagramContainsDataObjectsConnectionWhere>;
};

export type DiagramContainsDataObjectsDisconnectFieldInput = {
  disconnect?: InputMaybe<DataObjectDisconnectInput>;
  where?: InputMaybe<DiagramContainsDataObjectsConnectionWhere>;
};

export type DiagramContainsDataObjectsFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsDataObjectsCreateFieldInput>>;
};

export type DiagramContainsDataObjectsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DiagramContainsDataObjectsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DiagramContainsDataObjectsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DiagramContainsDataObjectsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  format?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type DiagramContainsDataObjectsRelationship = {
  __typename?: 'DiagramContainsDataObjectsRelationship';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type DiagramContainsDataObjectsUpdateConnectionInput = {
  node?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<DiagramContainsDataObjectsConnectionWhere>;
};

export type DiagramContainsDataObjectsUpdateFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsDataObjectsCreateFieldInput>>;
  delete?: InputMaybe<Array<DiagramContainsDataObjectsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DiagramContainsDataObjectsDisconnectFieldInput>>;
  update?: InputMaybe<DiagramContainsDataObjectsUpdateConnectionInput>;
};

export type DiagramContainsInfrastructureAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsInfrastructureAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsInfrastructureAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsInfrastructureAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DiagramContainsInfrastructureNodeAggregationWhereInput>;
};

export type DiagramContainsInfrastructureConnectFieldInput = {
  connect?: InputMaybe<Array<InfrastructureConnectInput>>;
  where?: InputMaybe<InfrastructureConnectWhere>;
};

export type DiagramContainsInfrastructureConnection = {
  __typename?: 'DiagramContainsInfrastructureConnection';
  aggregate: DiagramInfrastructureContainsInfrastructureAggregateSelection;
  edges: Array<DiagramContainsInfrastructureRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DiagramContainsInfrastructureConnectionAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsInfrastructureConnectionAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsInfrastructureConnectionAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsInfrastructureConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DiagramContainsInfrastructureNodeAggregationWhereInput>;
};

export type DiagramContainsInfrastructureConnectionFilters = {
  /** Filter Diagrams by aggregating results on related DiagramContainsInfrastructureConnections */
  aggregate?: InputMaybe<DiagramContainsInfrastructureConnectionAggregateInput>;
  /** Return Diagrams where all of the related DiagramContainsInfrastructureConnections match this filter */
  all?: InputMaybe<DiagramContainsInfrastructureConnectionWhere>;
  /** Return Diagrams where none of the related DiagramContainsInfrastructureConnections match this filter */
  none?: InputMaybe<DiagramContainsInfrastructureConnectionWhere>;
  /** Return Diagrams where one of the related DiagramContainsInfrastructureConnections match this filter */
  single?: InputMaybe<DiagramContainsInfrastructureConnectionWhere>;
  /** Return Diagrams where some of the related DiagramContainsInfrastructureConnections match this filter */
  some?: InputMaybe<DiagramContainsInfrastructureConnectionWhere>;
};

export type DiagramContainsInfrastructureConnectionSort = {
  node?: InputMaybe<InfrastructureSort>;
};

export type DiagramContainsInfrastructureConnectionWhere = {
  AND?: InputMaybe<Array<DiagramContainsInfrastructureConnectionWhere>>;
  NOT?: InputMaybe<DiagramContainsInfrastructureConnectionWhere>;
  OR?: InputMaybe<Array<DiagramContainsInfrastructureConnectionWhere>>;
  node?: InputMaybe<InfrastructureWhere>;
};

export type DiagramContainsInfrastructureCreateFieldInput = {
  node: InfrastructureCreateInput;
};

export type DiagramContainsInfrastructureDeleteFieldInput = {
  delete?: InputMaybe<InfrastructureDeleteInput>;
  where?: InputMaybe<DiagramContainsInfrastructureConnectionWhere>;
};

export type DiagramContainsInfrastructureDisconnectFieldInput = {
  disconnect?: InputMaybe<InfrastructureDisconnectInput>;
  where?: InputMaybe<DiagramContainsInfrastructureConnectionWhere>;
};

export type DiagramContainsInfrastructureFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsInfrastructureCreateFieldInput>>;
};

export type DiagramContainsInfrastructureNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DiagramContainsInfrastructureNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DiagramContainsInfrastructureNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DiagramContainsInfrastructureNodeAggregationWhereInput>>;
  capacity?: InputMaybe<StringScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  ipAddress?: InputMaybe<StringScalarAggregationFilters>;
  location?: InputMaybe<StringScalarAggregationFilters>;
  maintenanceWindow?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  operatingSystem?: InputMaybe<StringScalarAggregationFilters>;
  specifications?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type DiagramContainsInfrastructureRelationship = {
  __typename?: 'DiagramContainsInfrastructureRelationship';
  cursor: Scalars['String']['output'];
  node: Infrastructure;
};

export type DiagramContainsInfrastructureUpdateConnectionInput = {
  node?: InputMaybe<InfrastructureUpdateInput>;
  where?: InputMaybe<DiagramContainsInfrastructureConnectionWhere>;
};

export type DiagramContainsInfrastructureUpdateFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsInfrastructureCreateFieldInput>>;
  delete?: InputMaybe<Array<DiagramContainsInfrastructureDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DiagramContainsInfrastructureDisconnectFieldInput>>;
  update?: InputMaybe<DiagramContainsInfrastructureUpdateConnectionInput>;
};

export type DiagramContainsInterfacesAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsInterfacesAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsInterfacesAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsInterfacesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DiagramContainsInterfacesNodeAggregationWhereInput>;
};

export type DiagramContainsInterfacesConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type DiagramContainsInterfacesConnection = {
  __typename?: 'DiagramContainsInterfacesConnection';
  aggregate: DiagramApplicationInterfaceContainsInterfacesAggregateSelection;
  edges: Array<DiagramContainsInterfacesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DiagramContainsInterfacesConnectionAggregateInput = {
  AND?: InputMaybe<Array<DiagramContainsInterfacesConnectionAggregateInput>>;
  NOT?: InputMaybe<DiagramContainsInterfacesConnectionAggregateInput>;
  OR?: InputMaybe<Array<DiagramContainsInterfacesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DiagramContainsInterfacesNodeAggregationWhereInput>;
};

export type DiagramContainsInterfacesConnectionFilters = {
  /** Filter Diagrams by aggregating results on related DiagramContainsInterfacesConnections */
  aggregate?: InputMaybe<DiagramContainsInterfacesConnectionAggregateInput>;
  /** Return Diagrams where all of the related DiagramContainsInterfacesConnections match this filter */
  all?: InputMaybe<DiagramContainsInterfacesConnectionWhere>;
  /** Return Diagrams where none of the related DiagramContainsInterfacesConnections match this filter */
  none?: InputMaybe<DiagramContainsInterfacesConnectionWhere>;
  /** Return Diagrams where one of the related DiagramContainsInterfacesConnections match this filter */
  single?: InputMaybe<DiagramContainsInterfacesConnectionWhere>;
  /** Return Diagrams where some of the related DiagramContainsInterfacesConnections match this filter */
  some?: InputMaybe<DiagramContainsInterfacesConnectionWhere>;
};

export type DiagramContainsInterfacesConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type DiagramContainsInterfacesConnectionWhere = {
  AND?: InputMaybe<Array<DiagramContainsInterfacesConnectionWhere>>;
  NOT?: InputMaybe<DiagramContainsInterfacesConnectionWhere>;
  OR?: InputMaybe<Array<DiagramContainsInterfacesConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type DiagramContainsInterfacesCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type DiagramContainsInterfacesDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<DiagramContainsInterfacesConnectionWhere>;
};

export type DiagramContainsInterfacesDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<DiagramContainsInterfacesConnectionWhere>;
};

export type DiagramContainsInterfacesFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsInterfacesCreateFieldInput>>;
};

export type DiagramContainsInterfacesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DiagramContainsInterfacesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DiagramContainsInterfacesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DiagramContainsInterfacesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type DiagramContainsInterfacesRelationship = {
  __typename?: 'DiagramContainsInterfacesRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type DiagramContainsInterfacesUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<DiagramContainsInterfacesConnectionWhere>;
};

export type DiagramContainsInterfacesUpdateFieldInput = {
  connect?: InputMaybe<Array<DiagramContainsInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramContainsInterfacesCreateFieldInput>>;
  delete?: InputMaybe<Array<DiagramContainsInterfacesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DiagramContainsInterfacesDisconnectFieldInput>>;
  update?: InputMaybe<DiagramContainsInterfacesUpdateConnectionInput>;
};

export type DiagramCreateInput = {
  architecture?: InputMaybe<DiagramArchitectureFieldInput>;
  containsAIAssets?: InputMaybe<DiagramContainsAiAssetsFieldInput>;
  containsApplications?: InputMaybe<DiagramContainsApplicationsFieldInput>;
  containsCapabilities?: InputMaybe<DiagramContainsCapabilitiesFieldInput>;
  containsDataObjects?: InputMaybe<DiagramContainsDataObjectsFieldInput>;
  containsInfrastructure?: InputMaybe<DiagramContainsInfrastructureFieldInput>;
  containsInterfaces?: InputMaybe<DiagramContainsInterfacesFieldInput>;
  creator?: InputMaybe<DiagramCreatorFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  diagramJson: Scalars['String']['input'];
  diagramPng?: InputMaybe<Scalars['String']['input']>;
  diagramType?: InputMaybe<DiagramType>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DiagramCreatorAggregateInput = {
  AND?: InputMaybe<Array<DiagramCreatorAggregateInput>>;
  NOT?: InputMaybe<DiagramCreatorAggregateInput>;
  OR?: InputMaybe<Array<DiagramCreatorAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<DiagramCreatorNodeAggregationWhereInput>;
};

export type DiagramCreatorConnectFieldInput = {
  connect?: InputMaybe<Array<PersonConnectInput>>;
  where?: InputMaybe<PersonConnectWhere>;
};

export type DiagramCreatorConnection = {
  __typename?: 'DiagramCreatorConnection';
  aggregate: DiagramPersonCreatorAggregateSelection;
  edges: Array<DiagramCreatorRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DiagramCreatorConnectionAggregateInput = {
  AND?: InputMaybe<Array<DiagramCreatorConnectionAggregateInput>>;
  NOT?: InputMaybe<DiagramCreatorConnectionAggregateInput>;
  OR?: InputMaybe<Array<DiagramCreatorConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<DiagramCreatorNodeAggregationWhereInput>;
};

export type DiagramCreatorConnectionFilters = {
  /** Filter Diagrams by aggregating results on related DiagramCreatorConnections */
  aggregate?: InputMaybe<DiagramCreatorConnectionAggregateInput>;
  /** Return Diagrams where all of the related DiagramCreatorConnections match this filter */
  all?: InputMaybe<DiagramCreatorConnectionWhere>;
  /** Return Diagrams where none of the related DiagramCreatorConnections match this filter */
  none?: InputMaybe<DiagramCreatorConnectionWhere>;
  /** Return Diagrams where one of the related DiagramCreatorConnections match this filter */
  single?: InputMaybe<DiagramCreatorConnectionWhere>;
  /** Return Diagrams where some of the related DiagramCreatorConnections match this filter */
  some?: InputMaybe<DiagramCreatorConnectionWhere>;
};

export type DiagramCreatorConnectionSort = {
  node?: InputMaybe<PersonSort>;
};

export type DiagramCreatorConnectionWhere = {
  AND?: InputMaybe<Array<DiagramCreatorConnectionWhere>>;
  NOT?: InputMaybe<DiagramCreatorConnectionWhere>;
  OR?: InputMaybe<Array<DiagramCreatorConnectionWhere>>;
  node?: InputMaybe<PersonWhere>;
};

export type DiagramCreatorCreateFieldInput = {
  node: PersonCreateInput;
};

export type DiagramCreatorDeleteFieldInput = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<DiagramCreatorConnectionWhere>;
};

export type DiagramCreatorDisconnectFieldInput = {
  disconnect?: InputMaybe<PersonDisconnectInput>;
  where?: InputMaybe<DiagramCreatorConnectionWhere>;
};

export type DiagramCreatorFieldInput = {
  connect?: InputMaybe<Array<DiagramCreatorConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramCreatorCreateFieldInput>>;
};

export type DiagramCreatorNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<DiagramCreatorNodeAggregationWhereInput>>;
  NOT?: InputMaybe<DiagramCreatorNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<DiagramCreatorNodeAggregationWhereInput>>;
  avatarUrl?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  department?: InputMaybe<StringScalarAggregationFilters>;
  email?: InputMaybe<StringScalarAggregationFilters>;
  firstName?: InputMaybe<StringScalarAggregationFilters>;
  lastName?: InputMaybe<StringScalarAggregationFilters>;
  phone?: InputMaybe<StringScalarAggregationFilters>;
  role?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type DiagramCreatorRelationship = {
  __typename?: 'DiagramCreatorRelationship';
  cursor: Scalars['String']['output'];
  node: Person;
};

export type DiagramCreatorUpdateConnectionInput = {
  node?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<DiagramCreatorConnectionWhere>;
};

export type DiagramCreatorUpdateFieldInput = {
  connect?: InputMaybe<Array<DiagramCreatorConnectFieldInput>>;
  create?: InputMaybe<Array<DiagramCreatorCreateFieldInput>>;
  delete?: InputMaybe<Array<DiagramCreatorDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<DiagramCreatorDisconnectFieldInput>>;
  update?: InputMaybe<DiagramCreatorUpdateConnectionInput>;
};

export type DiagramDataObjectContainsDataObjectsAggregateSelection = {
  __typename?: 'DiagramDataObjectContainsDataObjectsAggregateSelection';
  count: CountConnection;
  node?: Maybe<DiagramDataObjectContainsDataObjectsNodeAggregateSelection>;
};

export type DiagramDataObjectContainsDataObjectsNodeAggregateSelection = {
  __typename?: 'DiagramDataObjectContainsDataObjectsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DiagramDeleteInput = {
  architecture?: InputMaybe<Array<DiagramArchitectureDeleteFieldInput>>;
  containsAIAssets?: InputMaybe<Array<DiagramContainsAiAssetsDeleteFieldInput>>;
  containsApplications?: InputMaybe<Array<DiagramContainsApplicationsDeleteFieldInput>>;
  containsCapabilities?: InputMaybe<Array<DiagramContainsCapabilitiesDeleteFieldInput>>;
  containsDataObjects?: InputMaybe<Array<DiagramContainsDataObjectsDeleteFieldInput>>;
  containsInfrastructure?: InputMaybe<Array<DiagramContainsInfrastructureDeleteFieldInput>>;
  containsInterfaces?: InputMaybe<Array<DiagramContainsInterfacesDeleteFieldInput>>;
  creator?: InputMaybe<Array<DiagramCreatorDeleteFieldInput>>;
};

export type DiagramDisconnectInput = {
  architecture?: InputMaybe<Array<DiagramArchitectureDisconnectFieldInput>>;
  containsAIAssets?: InputMaybe<Array<DiagramContainsAiAssetsDisconnectFieldInput>>;
  containsApplications?: InputMaybe<Array<DiagramContainsApplicationsDisconnectFieldInput>>;
  containsCapabilities?: InputMaybe<Array<DiagramContainsCapabilitiesDisconnectFieldInput>>;
  containsDataObjects?: InputMaybe<Array<DiagramContainsDataObjectsDisconnectFieldInput>>;
  containsInfrastructure?: InputMaybe<Array<DiagramContainsInfrastructureDisconnectFieldInput>>;
  containsInterfaces?: InputMaybe<Array<DiagramContainsInterfacesDisconnectFieldInput>>;
  creator?: InputMaybe<Array<DiagramCreatorDisconnectFieldInput>>;
};

export type DiagramEdge = {
  __typename?: 'DiagramEdge';
  cursor: Scalars['String']['output'];
  node: Diagram;
};

export type DiagramInfrastructureContainsInfrastructureAggregateSelection = {
  __typename?: 'DiagramInfrastructureContainsInfrastructureAggregateSelection';
  count: CountConnection;
  node?: Maybe<DiagramInfrastructureContainsInfrastructureNodeAggregateSelection>;
};

export type DiagramInfrastructureContainsInfrastructureNodeAggregateSelection = {
  __typename?: 'DiagramInfrastructureContainsInfrastructureNodeAggregateSelection';
  capacity: StringAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  ipAddress: StringAggregateSelection;
  location: StringAggregateSelection;
  maintenanceWindow: StringAggregateSelection;
  name: StringAggregateSelection;
  operatingSystem: StringAggregateSelection;
  specifications: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type DiagramPersonCreatorAggregateSelection = {
  __typename?: 'DiagramPersonCreatorAggregateSelection';
  count: CountConnection;
  node?: Maybe<DiagramPersonCreatorNodeAggregateSelection>;
};

export type DiagramPersonCreatorNodeAggregateSelection = {
  __typename?: 'DiagramPersonCreatorNodeAggregateSelection';
  avatarUrl: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type DiagramRelationshipFilters = {
  /** Filter type where all of the related Diagrams match this filter */
  all?: InputMaybe<DiagramWhere>;
  /** Filter type where none of the related Diagrams match this filter */
  none?: InputMaybe<DiagramWhere>;
  /** Filter type where one of the related Diagrams match this filter */
  single?: InputMaybe<DiagramWhere>;
  /** Filter type where some of the related Diagrams match this filter */
  some?: InputMaybe<DiagramWhere>;
};

/** Fields to sort Diagrams by. The order in which sorts are applied is not guaranteed when specifying many fields in one DiagramSort object. */
export type DiagramSort = {
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  diagramJson?: InputMaybe<SortDirection>;
  diagramPng?: InputMaybe<SortDirection>;
  diagramType?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  title?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

/** Diagramm-Typen für Excalidraw-Diagramme */
export enum DiagramType {
  APPLICATION_LANDSCAPE = 'APPLICATION_LANDSCAPE',
  ARCHITECTURE = 'ARCHITECTURE',
  CAPABILITY_MAP = 'CAPABILITY_MAP',
  CONCEPTUAL = 'CONCEPTUAL',
  DATA_FLOW = 'DATA_FLOW',
  INTEGRATION_ARCHITECTURE = 'INTEGRATION_ARCHITECTURE',
  NETWORK = 'NETWORK',
  OTHER = 'OTHER',
  PROCESS = 'PROCESS',
  SECURITY_ARCHITECTURE = 'SECURITY_ARCHITECTURE'
}

/** DiagramType filters */
export type DiagramTypeEnumScalarFilters = {
  eq?: InputMaybe<DiagramType>;
  in?: InputMaybe<Array<DiagramType>>;
};

/** DiagramType mutations */
export type DiagramTypeEnumScalarMutations = {
  set?: InputMaybe<DiagramType>;
};

export type DiagramUpdateInput = {
  architecture?: InputMaybe<Array<DiagramArchitectureUpdateFieldInput>>;
  containsAIAssets?: InputMaybe<Array<DiagramContainsAiAssetsUpdateFieldInput>>;
  containsApplications?: InputMaybe<Array<DiagramContainsApplicationsUpdateFieldInput>>;
  containsCapabilities?: InputMaybe<Array<DiagramContainsCapabilitiesUpdateFieldInput>>;
  containsDataObjects?: InputMaybe<Array<DiagramContainsDataObjectsUpdateFieldInput>>;
  containsInfrastructure?: InputMaybe<Array<DiagramContainsInfrastructureUpdateFieldInput>>;
  containsInterfaces?: InputMaybe<Array<DiagramContainsInterfacesUpdateFieldInput>>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  creator?: InputMaybe<Array<DiagramCreatorUpdateFieldInput>>;
  description?: InputMaybe<StringScalarMutations>;
  diagramJson?: InputMaybe<StringScalarMutations>;
  diagramPng?: InputMaybe<StringScalarMutations>;
  diagramType?: InputMaybe<DiagramTypeEnumScalarMutations>;
  title?: InputMaybe<StringScalarMutations>;
};

export type DiagramWhere = {
  AND?: InputMaybe<Array<DiagramWhere>>;
  NOT?: InputMaybe<DiagramWhere>;
  OR?: InputMaybe<Array<DiagramWhere>>;
  architecture?: InputMaybe<ArchitectureRelationshipFilters>;
  architectureConnection?: InputMaybe<DiagramArchitectureConnectionFilters>;
  containsAIAssets?: InputMaybe<AiAssetRelationshipFilters>;
  containsAIAssetsConnection?: InputMaybe<DiagramContainsAiAssetsConnectionFilters>;
  containsApplications?: InputMaybe<ApplicationRelationshipFilters>;
  containsApplicationsConnection?: InputMaybe<DiagramContainsApplicationsConnectionFilters>;
  containsCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  containsCapabilitiesConnection?: InputMaybe<DiagramContainsCapabilitiesConnectionFilters>;
  containsDataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  containsDataObjectsConnection?: InputMaybe<DiagramContainsDataObjectsConnectionFilters>;
  containsInfrastructure?: InputMaybe<InfrastructureRelationshipFilters>;
  containsInfrastructureConnection?: InputMaybe<DiagramContainsInfrastructureConnectionFilters>;
  containsInterfaces?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  containsInterfacesConnection?: InputMaybe<DiagramContainsInterfacesConnectionFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  creator?: InputMaybe<PersonRelationshipFilters>;
  creatorConnection?: InputMaybe<DiagramCreatorConnectionFilters>;
  description?: InputMaybe<StringScalarFilters>;
  diagramJson?: InputMaybe<StringScalarFilters>;
  diagramPng?: InputMaybe<StringScalarFilters>;
  diagramType?: InputMaybe<DiagramTypeEnumScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  title?: InputMaybe<StringScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
};

export type DiagramsConnection = {
  __typename?: 'DiagramsConnection';
  aggregate: DiagramAggregate;
  edges: Array<DiagramEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FloatAggregateSelection = {
  __typename?: 'FloatAggregateSelection';
  average?: Maybe<Scalars['Float']['output']>;
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  sum?: Maybe<Scalars['Float']['output']>;
};

/** Filters for an aggregation of a float field */
export type FloatScalarAggregationFilters = {
  average?: InputMaybe<FloatScalarFilters>;
  max?: InputMaybe<FloatScalarFilters>;
  min?: InputMaybe<FloatScalarFilters>;
  sum?: InputMaybe<FloatScalarFilters>;
};

/** Float filters */
export type FloatScalarFilters = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
};

/** Float mutations */
export type FloatScalarMutations = {
  add?: InputMaybe<Scalars['Float']['input']>;
  divide?: InputMaybe<Scalars['Float']['input']>;
  multiply?: InputMaybe<Scalars['Float']['input']>;
  set?: InputMaybe<Scalars['Float']['input']>;
  subtract?: InputMaybe<Scalars['Float']['input']>;
};

/** ID filters */
export type IdScalarFilters = {
  contains?: InputMaybe<Scalars['ID']['input']>;
  endsWith?: InputMaybe<Scalars['ID']['input']>;
  eq?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<Scalars['ID']['input']>>;
  startsWith?: InputMaybe<Scalars['ID']['input']>;
};

/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type Infrastructure = {
  __typename?: 'Infrastructure';
  capacity?: Maybe<Scalars['String']['output']>;
  childInfrastructures: Array<Infrastructure>;
  childInfrastructuresConnection: InfrastructureChildInfrastructuresConnection;
  company: Array<Company>;
  companyConnection: InfrastructureCompanyConnection;
  costs?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  depictedInDiagrams: Array<Diagram>;
  depictedInDiagramsConnection: InfrastructureDepictedInDiagramsConnection;
  description?: Maybe<Scalars['String']['output']>;
  endOfLifeDate?: Maybe<Scalars['Date']['output']>;
  endOfUseDate?: Maybe<Scalars['Date']['output']>;
  hostsAIAssets: Array<AiAsset>;
  hostsAIAssetsConnection: InfrastructureHostsAiAssetsConnection;
  hostsApplications: Array<Application>;
  hostsApplicationsConnection: InfrastructureHostsApplicationsConnection;
  id: Scalars['ID']['output'];
  infrastructureType: InfrastructureType;
  introductionDate?: Maybe<Scalars['Date']['output']>;
  ipAddress?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  maintenanceWindow?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  operatingSystem?: Maybe<Scalars['String']['output']>;
  owners: Array<Person>;
  ownersConnection: InfrastructureOwnersConnection;
  parentInfrastructure: Array<Infrastructure>;
  parentInfrastructureConnection: InfrastructureParentInfrastructureConnection;
  partOfArchitectures: Array<Architecture>;
  partOfArchitecturesConnection: InfrastructurePartOfArchitecturesConnection;
  planningDate?: Maybe<Scalars['Date']['output']>;
  specifications?: Maybe<Scalars['String']['output']>;
  status: InfrastructureStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usedByOrganisations: Array<Organisation>;
  usedByOrganisationsConnection: InfrastructureUsedByOrganisationsConnection;
  vendor?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureChildInfrastructuresArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureChildInfrastructuresConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureChildInfrastructuresConnectionSort>>;
  where?: InputMaybe<InfrastructureChildInfrastructuresConnectionWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureCompanyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanySort>>;
  where?: InputMaybe<CompanyWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureCompanyConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureCompanyConnectionSort>>;
  where?: InputMaybe<InfrastructureCompanyConnectionWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureDepictedInDiagramsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramSort>>;
  where?: InputMaybe<DiagramWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureDepictedInDiagramsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureDepictedInDiagramsConnectionSort>>;
  where?: InputMaybe<InfrastructureDepictedInDiagramsConnectionWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureHostsAiAssetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureHostsAiAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureHostsAiAssetsConnectionSort>>;
  where?: InputMaybe<InfrastructureHostsAiAssetsConnectionWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureHostsApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureHostsApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureHostsApplicationsConnectionSort>>;
  where?: InputMaybe<InfrastructureHostsApplicationsConnectionWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureOwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureOwnersConnectionSort>>;
  where?: InputMaybe<InfrastructureOwnersConnectionWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureParentInfrastructureArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureParentInfrastructureConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureParentInfrastructureConnectionSort>>;
  where?: InputMaybe<InfrastructureParentInfrastructureConnectionWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructurePartOfArchitecturesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructurePartOfArchitecturesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructurePartOfArchitecturesConnectionSort>>;
  where?: InputMaybe<InfrastructurePartOfArchitecturesConnectionWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureUsedByOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


/** Infrastructure - repräsentiert eine Infrastruktur-Komponente im Enterprise Architecture Management */
export type InfrastructureUsedByOrganisationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureUsedByOrganisationsConnectionSort>>;
  where?: InputMaybe<InfrastructureUsedByOrganisationsConnectionWhere>;
};

export type InfrastructureAiAssetHostsAiAssetsAggregateSelection = {
  __typename?: 'InfrastructureAIAssetHostsAIAssetsAggregateSelection';
  count: CountConnection;
  node?: Maybe<InfrastructureAiAssetHostsAiAssetsNodeAggregateSelection>;
};

export type InfrastructureAiAssetHostsAiAssetsNodeAggregateSelection = {
  __typename?: 'InfrastructureAIAssetHostsAIAssetsNodeAggregateSelection';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type InfrastructureAggregate = {
  __typename?: 'InfrastructureAggregate';
  count: Count;
  node: InfrastructureAggregateNode;
};

export type InfrastructureAggregateNode = {
  __typename?: 'InfrastructureAggregateNode';
  capacity: StringAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  ipAddress: StringAggregateSelection;
  location: StringAggregateSelection;
  maintenanceWindow: StringAggregateSelection;
  name: StringAggregateSelection;
  operatingSystem: StringAggregateSelection;
  specifications: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type InfrastructureApplicationHostsApplicationsAggregateSelection = {
  __typename?: 'InfrastructureApplicationHostsApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<InfrastructureApplicationHostsApplicationsNodeAggregateSelection>;
};

export type InfrastructureApplicationHostsApplicationsNodeAggregateSelection = {
  __typename?: 'InfrastructureApplicationHostsApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type InfrastructureArchitecturePartOfArchitecturesAggregateSelection = {
  __typename?: 'InfrastructureArchitecturePartOfArchitecturesAggregateSelection';
  count: CountConnection;
  node?: Maybe<InfrastructureArchitecturePartOfArchitecturesNodeAggregateSelection>;
};

export type InfrastructureArchitecturePartOfArchitecturesNodeAggregateSelection = {
  __typename?: 'InfrastructureArchitecturePartOfArchitecturesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type InfrastructureChildInfrastructuresAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureChildInfrastructuresAggregateInput>>;
  NOT?: InputMaybe<InfrastructureChildInfrastructuresAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureChildInfrastructuresAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<InfrastructureChildInfrastructuresNodeAggregationWhereInput>;
};

export type InfrastructureChildInfrastructuresConnectFieldInput = {
  connect?: InputMaybe<Array<InfrastructureConnectInput>>;
  where?: InputMaybe<InfrastructureConnectWhere>;
};

export type InfrastructureChildInfrastructuresConnection = {
  __typename?: 'InfrastructureChildInfrastructuresConnection';
  aggregate: InfrastructureInfrastructureChildInfrastructuresAggregateSelection;
  edges: Array<InfrastructureChildInfrastructuresRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InfrastructureChildInfrastructuresConnectionAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureChildInfrastructuresConnectionAggregateInput>>;
  NOT?: InputMaybe<InfrastructureChildInfrastructuresConnectionAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureChildInfrastructuresConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<InfrastructureChildInfrastructuresNodeAggregationWhereInput>;
};

export type InfrastructureChildInfrastructuresConnectionFilters = {
  /** Filter Infrastructures by aggregating results on related InfrastructureChildInfrastructuresConnections */
  aggregate?: InputMaybe<InfrastructureChildInfrastructuresConnectionAggregateInput>;
  /** Return Infrastructures where all of the related InfrastructureChildInfrastructuresConnections match this filter */
  all?: InputMaybe<InfrastructureChildInfrastructuresConnectionWhere>;
  /** Return Infrastructures where none of the related InfrastructureChildInfrastructuresConnections match this filter */
  none?: InputMaybe<InfrastructureChildInfrastructuresConnectionWhere>;
  /** Return Infrastructures where one of the related InfrastructureChildInfrastructuresConnections match this filter */
  single?: InputMaybe<InfrastructureChildInfrastructuresConnectionWhere>;
  /** Return Infrastructures where some of the related InfrastructureChildInfrastructuresConnections match this filter */
  some?: InputMaybe<InfrastructureChildInfrastructuresConnectionWhere>;
};

export type InfrastructureChildInfrastructuresConnectionSort = {
  node?: InputMaybe<InfrastructureSort>;
};

export type InfrastructureChildInfrastructuresConnectionWhere = {
  AND?: InputMaybe<Array<InfrastructureChildInfrastructuresConnectionWhere>>;
  NOT?: InputMaybe<InfrastructureChildInfrastructuresConnectionWhere>;
  OR?: InputMaybe<Array<InfrastructureChildInfrastructuresConnectionWhere>>;
  node?: InputMaybe<InfrastructureWhere>;
};

export type InfrastructureChildInfrastructuresCreateFieldInput = {
  node: InfrastructureCreateInput;
};

export type InfrastructureChildInfrastructuresDeleteFieldInput = {
  delete?: InputMaybe<InfrastructureDeleteInput>;
  where?: InputMaybe<InfrastructureChildInfrastructuresConnectionWhere>;
};

export type InfrastructureChildInfrastructuresDisconnectFieldInput = {
  disconnect?: InputMaybe<InfrastructureDisconnectInput>;
  where?: InputMaybe<InfrastructureChildInfrastructuresConnectionWhere>;
};

export type InfrastructureChildInfrastructuresFieldInput = {
  connect?: InputMaybe<Array<InfrastructureChildInfrastructuresConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureChildInfrastructuresCreateFieldInput>>;
};

export type InfrastructureChildInfrastructuresNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<InfrastructureChildInfrastructuresNodeAggregationWhereInput>>;
  NOT?: InputMaybe<InfrastructureChildInfrastructuresNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<InfrastructureChildInfrastructuresNodeAggregationWhereInput>>;
  capacity?: InputMaybe<StringScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  ipAddress?: InputMaybe<StringScalarAggregationFilters>;
  location?: InputMaybe<StringScalarAggregationFilters>;
  maintenanceWindow?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  operatingSystem?: InputMaybe<StringScalarAggregationFilters>;
  specifications?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type InfrastructureChildInfrastructuresRelationship = {
  __typename?: 'InfrastructureChildInfrastructuresRelationship';
  cursor: Scalars['String']['output'];
  node: Infrastructure;
};

export type InfrastructureChildInfrastructuresUpdateConnectionInput = {
  node?: InputMaybe<InfrastructureUpdateInput>;
  where?: InputMaybe<InfrastructureChildInfrastructuresConnectionWhere>;
};

export type InfrastructureChildInfrastructuresUpdateFieldInput = {
  connect?: InputMaybe<Array<InfrastructureChildInfrastructuresConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureChildInfrastructuresCreateFieldInput>>;
  delete?: InputMaybe<Array<InfrastructureChildInfrastructuresDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<InfrastructureChildInfrastructuresDisconnectFieldInput>>;
  update?: InputMaybe<InfrastructureChildInfrastructuresUpdateConnectionInput>;
};

export type InfrastructureCompanyAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureCompanyAggregateInput>>;
  NOT?: InputMaybe<InfrastructureCompanyAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureCompanyAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<InfrastructureCompanyNodeAggregationWhereInput>;
};

export type InfrastructureCompanyCompanyAggregateSelection = {
  __typename?: 'InfrastructureCompanyCompanyAggregateSelection';
  count: CountConnection;
  node?: Maybe<InfrastructureCompanyCompanyNodeAggregateSelection>;
};

export type InfrastructureCompanyCompanyNodeAggregateSelection = {
  __typename?: 'InfrastructureCompanyCompanyNodeAggregateSelection';
  address: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  industry: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  website: StringAggregateSelection;
};

export type InfrastructureCompanyConnectFieldInput = {
  connect?: InputMaybe<Array<CompanyConnectInput>>;
  where?: InputMaybe<CompanyConnectWhere>;
};

export type InfrastructureCompanyConnection = {
  __typename?: 'InfrastructureCompanyConnection';
  aggregate: InfrastructureCompanyCompanyAggregateSelection;
  edges: Array<InfrastructureCompanyRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InfrastructureCompanyConnectionAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureCompanyConnectionAggregateInput>>;
  NOT?: InputMaybe<InfrastructureCompanyConnectionAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureCompanyConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<InfrastructureCompanyNodeAggregationWhereInput>;
};

export type InfrastructureCompanyConnectionFilters = {
  /** Filter Infrastructures by aggregating results on related InfrastructureCompanyConnections */
  aggregate?: InputMaybe<InfrastructureCompanyConnectionAggregateInput>;
  /** Return Infrastructures where all of the related InfrastructureCompanyConnections match this filter */
  all?: InputMaybe<InfrastructureCompanyConnectionWhere>;
  /** Return Infrastructures where none of the related InfrastructureCompanyConnections match this filter */
  none?: InputMaybe<InfrastructureCompanyConnectionWhere>;
  /** Return Infrastructures where one of the related InfrastructureCompanyConnections match this filter */
  single?: InputMaybe<InfrastructureCompanyConnectionWhere>;
  /** Return Infrastructures where some of the related InfrastructureCompanyConnections match this filter */
  some?: InputMaybe<InfrastructureCompanyConnectionWhere>;
};

export type InfrastructureCompanyConnectionSort = {
  node?: InputMaybe<CompanySort>;
};

export type InfrastructureCompanyConnectionWhere = {
  AND?: InputMaybe<Array<InfrastructureCompanyConnectionWhere>>;
  NOT?: InputMaybe<InfrastructureCompanyConnectionWhere>;
  OR?: InputMaybe<Array<InfrastructureCompanyConnectionWhere>>;
  node?: InputMaybe<CompanyWhere>;
};

export type InfrastructureCompanyCreateFieldInput = {
  node: CompanyCreateInput;
};

export type InfrastructureCompanyDeleteFieldInput = {
  delete?: InputMaybe<CompanyDeleteInput>;
  where?: InputMaybe<InfrastructureCompanyConnectionWhere>;
};

export type InfrastructureCompanyDisconnectFieldInput = {
  disconnect?: InputMaybe<CompanyDisconnectInput>;
  where?: InputMaybe<InfrastructureCompanyConnectionWhere>;
};

export type InfrastructureCompanyFieldInput = {
  connect?: InputMaybe<Array<InfrastructureCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureCompanyCreateFieldInput>>;
};

export type InfrastructureCompanyNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<InfrastructureCompanyNodeAggregationWhereInput>>;
  NOT?: InputMaybe<InfrastructureCompanyNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<InfrastructureCompanyNodeAggregationWhereInput>>;
  address?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  industry?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  website?: InputMaybe<StringScalarAggregationFilters>;
};

export type InfrastructureCompanyRelationship = {
  __typename?: 'InfrastructureCompanyRelationship';
  cursor: Scalars['String']['output'];
  node: Company;
};

export type InfrastructureCompanyUpdateConnectionInput = {
  node?: InputMaybe<CompanyUpdateInput>;
  where?: InputMaybe<InfrastructureCompanyConnectionWhere>;
};

export type InfrastructureCompanyUpdateFieldInput = {
  connect?: InputMaybe<Array<InfrastructureCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureCompanyCreateFieldInput>>;
  delete?: InputMaybe<Array<InfrastructureCompanyDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<InfrastructureCompanyDisconnectFieldInput>>;
  update?: InputMaybe<InfrastructureCompanyUpdateConnectionInput>;
};

export type InfrastructureConnectInput = {
  childInfrastructures?: InputMaybe<Array<InfrastructureChildInfrastructuresConnectFieldInput>>;
  company?: InputMaybe<Array<InfrastructureCompanyConnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<InfrastructureDepictedInDiagramsConnectFieldInput>>;
  hostsAIAssets?: InputMaybe<Array<InfrastructureHostsAiAssetsConnectFieldInput>>;
  hostsApplications?: InputMaybe<Array<InfrastructureHostsApplicationsConnectFieldInput>>;
  owners?: InputMaybe<Array<InfrastructureOwnersConnectFieldInput>>;
  parentInfrastructure?: InputMaybe<Array<InfrastructureParentInfrastructureConnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<InfrastructurePartOfArchitecturesConnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<InfrastructureUsedByOrganisationsConnectFieldInput>>;
};

export type InfrastructureConnectWhere = {
  node: InfrastructureWhere;
};

export type InfrastructureCreateInput = {
  capacity?: InputMaybe<Scalars['String']['input']>;
  childInfrastructures?: InputMaybe<InfrastructureChildInfrastructuresFieldInput>;
  company?: InputMaybe<InfrastructureCompanyFieldInput>;
  costs?: InputMaybe<Scalars['Float']['input']>;
  depictedInDiagrams?: InputMaybe<InfrastructureDepictedInDiagramsFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  endOfLifeDate?: InputMaybe<Scalars['Date']['input']>;
  endOfUseDate?: InputMaybe<Scalars['Date']['input']>;
  hostsAIAssets?: InputMaybe<InfrastructureHostsAiAssetsFieldInput>;
  hostsApplications?: InputMaybe<InfrastructureHostsApplicationsFieldInput>;
  infrastructureType: InfrastructureType;
  introductionDate?: InputMaybe<Scalars['Date']['input']>;
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  maintenanceWindow?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  operatingSystem?: InputMaybe<Scalars['String']['input']>;
  owners?: InputMaybe<InfrastructureOwnersFieldInput>;
  parentInfrastructure?: InputMaybe<InfrastructureParentInfrastructureFieldInput>;
  partOfArchitectures?: InputMaybe<InfrastructurePartOfArchitecturesFieldInput>;
  planningDate?: InputMaybe<Scalars['Date']['input']>;
  specifications?: InputMaybe<Scalars['String']['input']>;
  status: InfrastructureStatus;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usedByOrganisations?: InputMaybe<InfrastructureUsedByOrganisationsFieldInput>;
  vendor?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type InfrastructureDeleteInput = {
  childInfrastructures?: InputMaybe<Array<InfrastructureChildInfrastructuresDeleteFieldInput>>;
  company?: InputMaybe<Array<InfrastructureCompanyDeleteFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<InfrastructureDepictedInDiagramsDeleteFieldInput>>;
  hostsAIAssets?: InputMaybe<Array<InfrastructureHostsAiAssetsDeleteFieldInput>>;
  hostsApplications?: InputMaybe<Array<InfrastructureHostsApplicationsDeleteFieldInput>>;
  owners?: InputMaybe<Array<InfrastructureOwnersDeleteFieldInput>>;
  parentInfrastructure?: InputMaybe<Array<InfrastructureParentInfrastructureDeleteFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<InfrastructurePartOfArchitecturesDeleteFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<InfrastructureUsedByOrganisationsDeleteFieldInput>>;
};

export type InfrastructureDepictedInDiagramsAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureDepictedInDiagramsAggregateInput>>;
  NOT?: InputMaybe<InfrastructureDepictedInDiagramsAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureDepictedInDiagramsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<InfrastructureDepictedInDiagramsNodeAggregationWhereInput>;
};

export type InfrastructureDepictedInDiagramsConnectFieldInput = {
  connect?: InputMaybe<Array<DiagramConnectInput>>;
  where?: InputMaybe<DiagramConnectWhere>;
};

export type InfrastructureDepictedInDiagramsConnection = {
  __typename?: 'InfrastructureDepictedInDiagramsConnection';
  aggregate: InfrastructureDiagramDepictedInDiagramsAggregateSelection;
  edges: Array<InfrastructureDepictedInDiagramsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InfrastructureDepictedInDiagramsConnectionAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureDepictedInDiagramsConnectionAggregateInput>>;
  NOT?: InputMaybe<InfrastructureDepictedInDiagramsConnectionAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureDepictedInDiagramsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<InfrastructureDepictedInDiagramsNodeAggregationWhereInput>;
};

export type InfrastructureDepictedInDiagramsConnectionFilters = {
  /** Filter Infrastructures by aggregating results on related InfrastructureDepictedInDiagramsConnections */
  aggregate?: InputMaybe<InfrastructureDepictedInDiagramsConnectionAggregateInput>;
  /** Return Infrastructures where all of the related InfrastructureDepictedInDiagramsConnections match this filter */
  all?: InputMaybe<InfrastructureDepictedInDiagramsConnectionWhere>;
  /** Return Infrastructures where none of the related InfrastructureDepictedInDiagramsConnections match this filter */
  none?: InputMaybe<InfrastructureDepictedInDiagramsConnectionWhere>;
  /** Return Infrastructures where one of the related InfrastructureDepictedInDiagramsConnections match this filter */
  single?: InputMaybe<InfrastructureDepictedInDiagramsConnectionWhere>;
  /** Return Infrastructures where some of the related InfrastructureDepictedInDiagramsConnections match this filter */
  some?: InputMaybe<InfrastructureDepictedInDiagramsConnectionWhere>;
};

export type InfrastructureDepictedInDiagramsConnectionSort = {
  node?: InputMaybe<DiagramSort>;
};

export type InfrastructureDepictedInDiagramsConnectionWhere = {
  AND?: InputMaybe<Array<InfrastructureDepictedInDiagramsConnectionWhere>>;
  NOT?: InputMaybe<InfrastructureDepictedInDiagramsConnectionWhere>;
  OR?: InputMaybe<Array<InfrastructureDepictedInDiagramsConnectionWhere>>;
  node?: InputMaybe<DiagramWhere>;
};

export type InfrastructureDepictedInDiagramsCreateFieldInput = {
  node: DiagramCreateInput;
};

export type InfrastructureDepictedInDiagramsDeleteFieldInput = {
  delete?: InputMaybe<DiagramDeleteInput>;
  where?: InputMaybe<InfrastructureDepictedInDiagramsConnectionWhere>;
};

export type InfrastructureDepictedInDiagramsDisconnectFieldInput = {
  disconnect?: InputMaybe<DiagramDisconnectInput>;
  where?: InputMaybe<InfrastructureDepictedInDiagramsConnectionWhere>;
};

export type InfrastructureDepictedInDiagramsFieldInput = {
  connect?: InputMaybe<Array<InfrastructureDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureDepictedInDiagramsCreateFieldInput>>;
};

export type InfrastructureDepictedInDiagramsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<InfrastructureDepictedInDiagramsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<InfrastructureDepictedInDiagramsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<InfrastructureDepictedInDiagramsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  diagramJson?: InputMaybe<StringScalarAggregationFilters>;
  diagramPng?: InputMaybe<StringScalarAggregationFilters>;
  title?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type InfrastructureDepictedInDiagramsRelationship = {
  __typename?: 'InfrastructureDepictedInDiagramsRelationship';
  cursor: Scalars['String']['output'];
  node: Diagram;
};

export type InfrastructureDepictedInDiagramsUpdateConnectionInput = {
  node?: InputMaybe<DiagramUpdateInput>;
  where?: InputMaybe<InfrastructureDepictedInDiagramsConnectionWhere>;
};

export type InfrastructureDepictedInDiagramsUpdateFieldInput = {
  connect?: InputMaybe<Array<InfrastructureDepictedInDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureDepictedInDiagramsCreateFieldInput>>;
  delete?: InputMaybe<Array<InfrastructureDepictedInDiagramsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<InfrastructureDepictedInDiagramsDisconnectFieldInput>>;
  update?: InputMaybe<InfrastructureDepictedInDiagramsUpdateConnectionInput>;
};

export type InfrastructureDiagramDepictedInDiagramsAggregateSelection = {
  __typename?: 'InfrastructureDiagramDepictedInDiagramsAggregateSelection';
  count: CountConnection;
  node?: Maybe<InfrastructureDiagramDepictedInDiagramsNodeAggregateSelection>;
};

export type InfrastructureDiagramDepictedInDiagramsNodeAggregateSelection = {
  __typename?: 'InfrastructureDiagramDepictedInDiagramsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  diagramJson: StringAggregateSelection;
  diagramPng: StringAggregateSelection;
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type InfrastructureDisconnectInput = {
  childInfrastructures?: InputMaybe<Array<InfrastructureChildInfrastructuresDisconnectFieldInput>>;
  company?: InputMaybe<Array<InfrastructureCompanyDisconnectFieldInput>>;
  depictedInDiagrams?: InputMaybe<Array<InfrastructureDepictedInDiagramsDisconnectFieldInput>>;
  hostsAIAssets?: InputMaybe<Array<InfrastructureHostsAiAssetsDisconnectFieldInput>>;
  hostsApplications?: InputMaybe<Array<InfrastructureHostsApplicationsDisconnectFieldInput>>;
  owners?: InputMaybe<Array<InfrastructureOwnersDisconnectFieldInput>>;
  parentInfrastructure?: InputMaybe<Array<InfrastructureParentInfrastructureDisconnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<InfrastructurePartOfArchitecturesDisconnectFieldInput>>;
  usedByOrganisations?: InputMaybe<Array<InfrastructureUsedByOrganisationsDisconnectFieldInput>>;
};

export type InfrastructureEdge = {
  __typename?: 'InfrastructureEdge';
  cursor: Scalars['String']['output'];
  node: Infrastructure;
};

export type InfrastructureHostsAiAssetsAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureHostsAiAssetsAggregateInput>>;
  NOT?: InputMaybe<InfrastructureHostsAiAssetsAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureHostsAiAssetsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<InfrastructureHostsAiAssetsNodeAggregationWhereInput>;
};

export type InfrastructureHostsAiAssetsConnectFieldInput = {
  connect?: InputMaybe<Array<AiAssetConnectInput>>;
  where?: InputMaybe<AiAssetConnectWhere>;
};

export type InfrastructureHostsAiAssetsConnection = {
  __typename?: 'InfrastructureHostsAIAssetsConnection';
  aggregate: InfrastructureAiAssetHostsAiAssetsAggregateSelection;
  edges: Array<InfrastructureHostsAiAssetsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InfrastructureHostsAiAssetsConnectionAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureHostsAiAssetsConnectionAggregateInput>>;
  NOT?: InputMaybe<InfrastructureHostsAiAssetsConnectionAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureHostsAiAssetsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<InfrastructureHostsAiAssetsNodeAggregationWhereInput>;
};

export type InfrastructureHostsAiAssetsConnectionFilters = {
  /** Filter Infrastructures by aggregating results on related InfrastructureHostsAIAssetsConnections */
  aggregate?: InputMaybe<InfrastructureHostsAiAssetsConnectionAggregateInput>;
  /** Return Infrastructures where all of the related InfrastructureHostsAIAssetsConnections match this filter */
  all?: InputMaybe<InfrastructureHostsAiAssetsConnectionWhere>;
  /** Return Infrastructures where none of the related InfrastructureHostsAIAssetsConnections match this filter */
  none?: InputMaybe<InfrastructureHostsAiAssetsConnectionWhere>;
  /** Return Infrastructures where one of the related InfrastructureHostsAIAssetsConnections match this filter */
  single?: InputMaybe<InfrastructureHostsAiAssetsConnectionWhere>;
  /** Return Infrastructures where some of the related InfrastructureHostsAIAssetsConnections match this filter */
  some?: InputMaybe<InfrastructureHostsAiAssetsConnectionWhere>;
};

export type InfrastructureHostsAiAssetsConnectionSort = {
  node?: InputMaybe<AiAssetSort>;
};

export type InfrastructureHostsAiAssetsConnectionWhere = {
  AND?: InputMaybe<Array<InfrastructureHostsAiAssetsConnectionWhere>>;
  NOT?: InputMaybe<InfrastructureHostsAiAssetsConnectionWhere>;
  OR?: InputMaybe<Array<InfrastructureHostsAiAssetsConnectionWhere>>;
  node?: InputMaybe<AiAssetWhere>;
};

export type InfrastructureHostsAiAssetsCreateFieldInput = {
  node: AiAssetCreateInput;
};

export type InfrastructureHostsAiAssetsDeleteFieldInput = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<InfrastructureHostsAiAssetsConnectionWhere>;
};

export type InfrastructureHostsAiAssetsDisconnectFieldInput = {
  disconnect?: InputMaybe<AiAssetDisconnectInput>;
  where?: InputMaybe<InfrastructureHostsAiAssetsConnectionWhere>;
};

export type InfrastructureHostsAiAssetsFieldInput = {
  connect?: InputMaybe<Array<InfrastructureHostsAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureHostsAiAssetsCreateFieldInput>>;
};

export type InfrastructureHostsAiAssetsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<InfrastructureHostsAiAssetsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<InfrastructureHostsAiAssetsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<InfrastructureHostsAiAssetsNodeAggregationWhereInput>>;
  accuracy?: InputMaybe<FloatScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  license?: InputMaybe<StringScalarAggregationFilters>;
  model?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  provider?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type InfrastructureHostsAiAssetsRelationship = {
  __typename?: 'InfrastructureHostsAIAssetsRelationship';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type InfrastructureHostsAiAssetsUpdateConnectionInput = {
  node?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<InfrastructureHostsAiAssetsConnectionWhere>;
};

export type InfrastructureHostsAiAssetsUpdateFieldInput = {
  connect?: InputMaybe<Array<InfrastructureHostsAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureHostsAiAssetsCreateFieldInput>>;
  delete?: InputMaybe<Array<InfrastructureHostsAiAssetsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<InfrastructureHostsAiAssetsDisconnectFieldInput>>;
  update?: InputMaybe<InfrastructureHostsAiAssetsUpdateConnectionInput>;
};

export type InfrastructureHostsApplicationsAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureHostsApplicationsAggregateInput>>;
  NOT?: InputMaybe<InfrastructureHostsApplicationsAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureHostsApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<InfrastructureHostsApplicationsNodeAggregationWhereInput>;
};

export type InfrastructureHostsApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type InfrastructureHostsApplicationsConnection = {
  __typename?: 'InfrastructureHostsApplicationsConnection';
  aggregate: InfrastructureApplicationHostsApplicationsAggregateSelection;
  edges: Array<InfrastructureHostsApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InfrastructureHostsApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureHostsApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<InfrastructureHostsApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureHostsApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<InfrastructureHostsApplicationsNodeAggregationWhereInput>;
};

export type InfrastructureHostsApplicationsConnectionFilters = {
  /** Filter Infrastructures by aggregating results on related InfrastructureHostsApplicationsConnections */
  aggregate?: InputMaybe<InfrastructureHostsApplicationsConnectionAggregateInput>;
  /** Return Infrastructures where all of the related InfrastructureHostsApplicationsConnections match this filter */
  all?: InputMaybe<InfrastructureHostsApplicationsConnectionWhere>;
  /** Return Infrastructures where none of the related InfrastructureHostsApplicationsConnections match this filter */
  none?: InputMaybe<InfrastructureHostsApplicationsConnectionWhere>;
  /** Return Infrastructures where one of the related InfrastructureHostsApplicationsConnections match this filter */
  single?: InputMaybe<InfrastructureHostsApplicationsConnectionWhere>;
  /** Return Infrastructures where some of the related InfrastructureHostsApplicationsConnections match this filter */
  some?: InputMaybe<InfrastructureHostsApplicationsConnectionWhere>;
};

export type InfrastructureHostsApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type InfrastructureHostsApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<InfrastructureHostsApplicationsConnectionWhere>>;
  NOT?: InputMaybe<InfrastructureHostsApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<InfrastructureHostsApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type InfrastructureHostsApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type InfrastructureHostsApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<InfrastructureHostsApplicationsConnectionWhere>;
};

export type InfrastructureHostsApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<InfrastructureHostsApplicationsConnectionWhere>;
};

export type InfrastructureHostsApplicationsFieldInput = {
  connect?: InputMaybe<Array<InfrastructureHostsApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureHostsApplicationsCreateFieldInput>>;
};

export type InfrastructureHostsApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<InfrastructureHostsApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<InfrastructureHostsApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<InfrastructureHostsApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type InfrastructureHostsApplicationsRelationship = {
  __typename?: 'InfrastructureHostsApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type InfrastructureHostsApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<InfrastructureHostsApplicationsConnectionWhere>;
};

export type InfrastructureHostsApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<InfrastructureHostsApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureHostsApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<InfrastructureHostsApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<InfrastructureHostsApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<InfrastructureHostsApplicationsUpdateConnectionInput>;
};

export type InfrastructureInfrastructureChildInfrastructuresAggregateSelection = {
  __typename?: 'InfrastructureInfrastructureChildInfrastructuresAggregateSelection';
  count: CountConnection;
  node?: Maybe<InfrastructureInfrastructureChildInfrastructuresNodeAggregateSelection>;
};

export type InfrastructureInfrastructureChildInfrastructuresNodeAggregateSelection = {
  __typename?: 'InfrastructureInfrastructureChildInfrastructuresNodeAggregateSelection';
  capacity: StringAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  ipAddress: StringAggregateSelection;
  location: StringAggregateSelection;
  maintenanceWindow: StringAggregateSelection;
  name: StringAggregateSelection;
  operatingSystem: StringAggregateSelection;
  specifications: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type InfrastructureInfrastructureParentInfrastructureAggregateSelection = {
  __typename?: 'InfrastructureInfrastructureParentInfrastructureAggregateSelection';
  count: CountConnection;
  node?: Maybe<InfrastructureInfrastructureParentInfrastructureNodeAggregateSelection>;
};

export type InfrastructureInfrastructureParentInfrastructureNodeAggregateSelection = {
  __typename?: 'InfrastructureInfrastructureParentInfrastructureNodeAggregateSelection';
  capacity: StringAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  ipAddress: StringAggregateSelection;
  location: StringAggregateSelection;
  maintenanceWindow: StringAggregateSelection;
  name: StringAggregateSelection;
  operatingSystem: StringAggregateSelection;
  specifications: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type InfrastructureOrganisationUsedByOrganisationsAggregateSelection = {
  __typename?: 'InfrastructureOrganisationUsedByOrganisationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<InfrastructureOrganisationUsedByOrganisationsNodeAggregateSelection>;
};

export type InfrastructureOrganisationUsedByOrganisationsNodeAggregateSelection = {
  __typename?: 'InfrastructureOrganisationUsedByOrganisationsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  level: IntAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type InfrastructureOwnersAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureOwnersAggregateInput>>;
  NOT?: InputMaybe<InfrastructureOwnersAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureOwnersAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<InfrastructureOwnersNodeAggregationWhereInput>;
};

export type InfrastructureOwnersConnectFieldInput = {
  connect?: InputMaybe<Array<PersonConnectInput>>;
  where?: InputMaybe<PersonConnectWhere>;
};

export type InfrastructureOwnersConnection = {
  __typename?: 'InfrastructureOwnersConnection';
  aggregate: InfrastructurePersonOwnersAggregateSelection;
  edges: Array<InfrastructureOwnersRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InfrastructureOwnersConnectionAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureOwnersConnectionAggregateInput>>;
  NOT?: InputMaybe<InfrastructureOwnersConnectionAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureOwnersConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<InfrastructureOwnersNodeAggregationWhereInput>;
};

export type InfrastructureOwnersConnectionFilters = {
  /** Filter Infrastructures by aggregating results on related InfrastructureOwnersConnections */
  aggregate?: InputMaybe<InfrastructureOwnersConnectionAggregateInput>;
  /** Return Infrastructures where all of the related InfrastructureOwnersConnections match this filter */
  all?: InputMaybe<InfrastructureOwnersConnectionWhere>;
  /** Return Infrastructures where none of the related InfrastructureOwnersConnections match this filter */
  none?: InputMaybe<InfrastructureOwnersConnectionWhere>;
  /** Return Infrastructures where one of the related InfrastructureOwnersConnections match this filter */
  single?: InputMaybe<InfrastructureOwnersConnectionWhere>;
  /** Return Infrastructures where some of the related InfrastructureOwnersConnections match this filter */
  some?: InputMaybe<InfrastructureOwnersConnectionWhere>;
};

export type InfrastructureOwnersConnectionSort = {
  node?: InputMaybe<PersonSort>;
};

export type InfrastructureOwnersConnectionWhere = {
  AND?: InputMaybe<Array<InfrastructureOwnersConnectionWhere>>;
  NOT?: InputMaybe<InfrastructureOwnersConnectionWhere>;
  OR?: InputMaybe<Array<InfrastructureOwnersConnectionWhere>>;
  node?: InputMaybe<PersonWhere>;
};

export type InfrastructureOwnersCreateFieldInput = {
  node: PersonCreateInput;
};

export type InfrastructureOwnersDeleteFieldInput = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<InfrastructureOwnersConnectionWhere>;
};

export type InfrastructureOwnersDisconnectFieldInput = {
  disconnect?: InputMaybe<PersonDisconnectInput>;
  where?: InputMaybe<InfrastructureOwnersConnectionWhere>;
};

export type InfrastructureOwnersFieldInput = {
  connect?: InputMaybe<Array<InfrastructureOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureOwnersCreateFieldInput>>;
};

export type InfrastructureOwnersNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<InfrastructureOwnersNodeAggregationWhereInput>>;
  NOT?: InputMaybe<InfrastructureOwnersNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<InfrastructureOwnersNodeAggregationWhereInput>>;
  avatarUrl?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  department?: InputMaybe<StringScalarAggregationFilters>;
  email?: InputMaybe<StringScalarAggregationFilters>;
  firstName?: InputMaybe<StringScalarAggregationFilters>;
  lastName?: InputMaybe<StringScalarAggregationFilters>;
  phone?: InputMaybe<StringScalarAggregationFilters>;
  role?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type InfrastructureOwnersRelationship = {
  __typename?: 'InfrastructureOwnersRelationship';
  cursor: Scalars['String']['output'];
  node: Person;
};

export type InfrastructureOwnersUpdateConnectionInput = {
  node?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<InfrastructureOwnersConnectionWhere>;
};

export type InfrastructureOwnersUpdateFieldInput = {
  connect?: InputMaybe<Array<InfrastructureOwnersConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureOwnersCreateFieldInput>>;
  delete?: InputMaybe<Array<InfrastructureOwnersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<InfrastructureOwnersDisconnectFieldInput>>;
  update?: InputMaybe<InfrastructureOwnersUpdateConnectionInput>;
};

export type InfrastructureParentInfrastructureAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureParentInfrastructureAggregateInput>>;
  NOT?: InputMaybe<InfrastructureParentInfrastructureAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureParentInfrastructureAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<InfrastructureParentInfrastructureNodeAggregationWhereInput>;
};

export type InfrastructureParentInfrastructureConnectFieldInput = {
  connect?: InputMaybe<Array<InfrastructureConnectInput>>;
  where?: InputMaybe<InfrastructureConnectWhere>;
};

export type InfrastructureParentInfrastructureConnection = {
  __typename?: 'InfrastructureParentInfrastructureConnection';
  aggregate: InfrastructureInfrastructureParentInfrastructureAggregateSelection;
  edges: Array<InfrastructureParentInfrastructureRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InfrastructureParentInfrastructureConnectionAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureParentInfrastructureConnectionAggregateInput>>;
  NOT?: InputMaybe<InfrastructureParentInfrastructureConnectionAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureParentInfrastructureConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<InfrastructureParentInfrastructureNodeAggregationWhereInput>;
};

export type InfrastructureParentInfrastructureConnectionFilters = {
  /** Filter Infrastructures by aggregating results on related InfrastructureParentInfrastructureConnections */
  aggregate?: InputMaybe<InfrastructureParentInfrastructureConnectionAggregateInput>;
  /** Return Infrastructures where all of the related InfrastructureParentInfrastructureConnections match this filter */
  all?: InputMaybe<InfrastructureParentInfrastructureConnectionWhere>;
  /** Return Infrastructures where none of the related InfrastructureParentInfrastructureConnections match this filter */
  none?: InputMaybe<InfrastructureParentInfrastructureConnectionWhere>;
  /** Return Infrastructures where one of the related InfrastructureParentInfrastructureConnections match this filter */
  single?: InputMaybe<InfrastructureParentInfrastructureConnectionWhere>;
  /** Return Infrastructures where some of the related InfrastructureParentInfrastructureConnections match this filter */
  some?: InputMaybe<InfrastructureParentInfrastructureConnectionWhere>;
};

export type InfrastructureParentInfrastructureConnectionSort = {
  node?: InputMaybe<InfrastructureSort>;
};

export type InfrastructureParentInfrastructureConnectionWhere = {
  AND?: InputMaybe<Array<InfrastructureParentInfrastructureConnectionWhere>>;
  NOT?: InputMaybe<InfrastructureParentInfrastructureConnectionWhere>;
  OR?: InputMaybe<Array<InfrastructureParentInfrastructureConnectionWhere>>;
  node?: InputMaybe<InfrastructureWhere>;
};

export type InfrastructureParentInfrastructureCreateFieldInput = {
  node: InfrastructureCreateInput;
};

export type InfrastructureParentInfrastructureDeleteFieldInput = {
  delete?: InputMaybe<InfrastructureDeleteInput>;
  where?: InputMaybe<InfrastructureParentInfrastructureConnectionWhere>;
};

export type InfrastructureParentInfrastructureDisconnectFieldInput = {
  disconnect?: InputMaybe<InfrastructureDisconnectInput>;
  where?: InputMaybe<InfrastructureParentInfrastructureConnectionWhere>;
};

export type InfrastructureParentInfrastructureFieldInput = {
  connect?: InputMaybe<Array<InfrastructureParentInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureParentInfrastructureCreateFieldInput>>;
};

export type InfrastructureParentInfrastructureNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<InfrastructureParentInfrastructureNodeAggregationWhereInput>>;
  NOT?: InputMaybe<InfrastructureParentInfrastructureNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<InfrastructureParentInfrastructureNodeAggregationWhereInput>>;
  capacity?: InputMaybe<StringScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  ipAddress?: InputMaybe<StringScalarAggregationFilters>;
  location?: InputMaybe<StringScalarAggregationFilters>;
  maintenanceWindow?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  operatingSystem?: InputMaybe<StringScalarAggregationFilters>;
  specifications?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type InfrastructureParentInfrastructureRelationship = {
  __typename?: 'InfrastructureParentInfrastructureRelationship';
  cursor: Scalars['String']['output'];
  node: Infrastructure;
};

export type InfrastructureParentInfrastructureUpdateConnectionInput = {
  node?: InputMaybe<InfrastructureUpdateInput>;
  where?: InputMaybe<InfrastructureParentInfrastructureConnectionWhere>;
};

export type InfrastructureParentInfrastructureUpdateFieldInput = {
  connect?: InputMaybe<Array<InfrastructureParentInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureParentInfrastructureCreateFieldInput>>;
  delete?: InputMaybe<Array<InfrastructureParentInfrastructureDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<InfrastructureParentInfrastructureDisconnectFieldInput>>;
  update?: InputMaybe<InfrastructureParentInfrastructureUpdateConnectionInput>;
};

export type InfrastructurePartOfArchitecturesAggregateInput = {
  AND?: InputMaybe<Array<InfrastructurePartOfArchitecturesAggregateInput>>;
  NOT?: InputMaybe<InfrastructurePartOfArchitecturesAggregateInput>;
  OR?: InputMaybe<Array<InfrastructurePartOfArchitecturesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<InfrastructurePartOfArchitecturesNodeAggregationWhereInput>;
};

export type InfrastructurePartOfArchitecturesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type InfrastructurePartOfArchitecturesConnection = {
  __typename?: 'InfrastructurePartOfArchitecturesConnection';
  aggregate: InfrastructureArchitecturePartOfArchitecturesAggregateSelection;
  edges: Array<InfrastructurePartOfArchitecturesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InfrastructurePartOfArchitecturesConnectionAggregateInput = {
  AND?: InputMaybe<Array<InfrastructurePartOfArchitecturesConnectionAggregateInput>>;
  NOT?: InputMaybe<InfrastructurePartOfArchitecturesConnectionAggregateInput>;
  OR?: InputMaybe<Array<InfrastructurePartOfArchitecturesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<InfrastructurePartOfArchitecturesNodeAggregationWhereInput>;
};

export type InfrastructurePartOfArchitecturesConnectionFilters = {
  /** Filter Infrastructures by aggregating results on related InfrastructurePartOfArchitecturesConnections */
  aggregate?: InputMaybe<InfrastructurePartOfArchitecturesConnectionAggregateInput>;
  /** Return Infrastructures where all of the related InfrastructurePartOfArchitecturesConnections match this filter */
  all?: InputMaybe<InfrastructurePartOfArchitecturesConnectionWhere>;
  /** Return Infrastructures where none of the related InfrastructurePartOfArchitecturesConnections match this filter */
  none?: InputMaybe<InfrastructurePartOfArchitecturesConnectionWhere>;
  /** Return Infrastructures where one of the related InfrastructurePartOfArchitecturesConnections match this filter */
  single?: InputMaybe<InfrastructurePartOfArchitecturesConnectionWhere>;
  /** Return Infrastructures where some of the related InfrastructurePartOfArchitecturesConnections match this filter */
  some?: InputMaybe<InfrastructurePartOfArchitecturesConnectionWhere>;
};

export type InfrastructurePartOfArchitecturesConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type InfrastructurePartOfArchitecturesConnectionWhere = {
  AND?: InputMaybe<Array<InfrastructurePartOfArchitecturesConnectionWhere>>;
  NOT?: InputMaybe<InfrastructurePartOfArchitecturesConnectionWhere>;
  OR?: InputMaybe<Array<InfrastructurePartOfArchitecturesConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type InfrastructurePartOfArchitecturesCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type InfrastructurePartOfArchitecturesDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<InfrastructurePartOfArchitecturesConnectionWhere>;
};

export type InfrastructurePartOfArchitecturesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<InfrastructurePartOfArchitecturesConnectionWhere>;
};

export type InfrastructurePartOfArchitecturesFieldInput = {
  connect?: InputMaybe<Array<InfrastructurePartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructurePartOfArchitecturesCreateFieldInput>>;
};

export type InfrastructurePartOfArchitecturesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<InfrastructurePartOfArchitecturesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<InfrastructurePartOfArchitecturesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<InfrastructurePartOfArchitecturesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type InfrastructurePartOfArchitecturesRelationship = {
  __typename?: 'InfrastructurePartOfArchitecturesRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type InfrastructurePartOfArchitecturesUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<InfrastructurePartOfArchitecturesConnectionWhere>;
};

export type InfrastructurePartOfArchitecturesUpdateFieldInput = {
  connect?: InputMaybe<Array<InfrastructurePartOfArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructurePartOfArchitecturesCreateFieldInput>>;
  delete?: InputMaybe<Array<InfrastructurePartOfArchitecturesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<InfrastructurePartOfArchitecturesDisconnectFieldInput>>;
  update?: InputMaybe<InfrastructurePartOfArchitecturesUpdateConnectionInput>;
};

export type InfrastructurePersonOwnersAggregateSelection = {
  __typename?: 'InfrastructurePersonOwnersAggregateSelection';
  count: CountConnection;
  node?: Maybe<InfrastructurePersonOwnersNodeAggregateSelection>;
};

export type InfrastructurePersonOwnersNodeAggregateSelection = {
  __typename?: 'InfrastructurePersonOwnersNodeAggregateSelection';
  avatarUrl: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type InfrastructureRelationshipFilters = {
  /** Filter type where all of the related Infrastructures match this filter */
  all?: InputMaybe<InfrastructureWhere>;
  /** Filter type where none of the related Infrastructures match this filter */
  none?: InputMaybe<InfrastructureWhere>;
  /** Filter type where one of the related Infrastructures match this filter */
  single?: InputMaybe<InfrastructureWhere>;
  /** Filter type where some of the related Infrastructures match this filter */
  some?: InputMaybe<InfrastructureWhere>;
};

/** Fields to sort Infrastructures by. The order in which sorts are applied is not guaranteed when specifying many fields in one InfrastructureSort object. */
export type InfrastructureSort = {
  capacity?: InputMaybe<SortDirection>;
  costs?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  endOfLifeDate?: InputMaybe<SortDirection>;
  endOfUseDate?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  infrastructureType?: InputMaybe<SortDirection>;
  introductionDate?: InputMaybe<SortDirection>;
  ipAddress?: InputMaybe<SortDirection>;
  location?: InputMaybe<SortDirection>;
  maintenanceWindow?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  operatingSystem?: InputMaybe<SortDirection>;
  planningDate?: InputMaybe<SortDirection>;
  specifications?: InputMaybe<SortDirection>;
  status?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
  vendor?: InputMaybe<SortDirection>;
  version?: InputMaybe<SortDirection>;
};

/** Status-Werte für Infrastruktur-Komponenten */
export enum InfrastructureStatus {
  ACTIVE = 'ACTIVE',
  DECOMMISSIONED = 'DECOMMISSIONED',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  PLANNED = 'PLANNED',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION'
}

/** InfrastructureStatus filters */
export type InfrastructureStatusEnumScalarFilters = {
  eq?: InputMaybe<InfrastructureStatus>;
  in?: InputMaybe<Array<InfrastructureStatus>>;
};

/** InfrastructureStatus mutations */
export type InfrastructureStatusEnumScalarMutations = {
  set?: InputMaybe<InfrastructureStatus>;
};

/** Infrastruktur-Typen */
export enum InfrastructureType {
  CLOUD_DATACENTER = 'CLOUD_DATACENTER',
  CONTAINER_HOST = 'CONTAINER_HOST',
  KUBERNETES_CLUSTER = 'KUBERNETES_CLUSTER',
  ON_PREMISE_DATACENTER = 'ON_PREMISE_DATACENTER',
  PHYSICAL_SERVER = 'PHYSICAL_SERVER',
  VIRTUALIZATION_CLUSTER = 'VIRTUALIZATION_CLUSTER',
  VIRTUAL_MACHINE = 'VIRTUAL_MACHINE'
}

/** InfrastructureType filters */
export type InfrastructureTypeEnumScalarFilters = {
  eq?: InputMaybe<InfrastructureType>;
  in?: InputMaybe<Array<InfrastructureType>>;
};

/** InfrastructureType mutations */
export type InfrastructureTypeEnumScalarMutations = {
  set?: InputMaybe<InfrastructureType>;
};

export type InfrastructureUpdateInput = {
  capacity?: InputMaybe<StringScalarMutations>;
  childInfrastructures?: InputMaybe<Array<InfrastructureChildInfrastructuresUpdateFieldInput>>;
  company?: InputMaybe<Array<InfrastructureCompanyUpdateFieldInput>>;
  costs?: InputMaybe<FloatScalarMutations>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  depictedInDiagrams?: InputMaybe<Array<InfrastructureDepictedInDiagramsUpdateFieldInput>>;
  description?: InputMaybe<StringScalarMutations>;
  endOfLifeDate?: InputMaybe<DateScalarMutations>;
  endOfUseDate?: InputMaybe<DateScalarMutations>;
  hostsAIAssets?: InputMaybe<Array<InfrastructureHostsAiAssetsUpdateFieldInput>>;
  hostsApplications?: InputMaybe<Array<InfrastructureHostsApplicationsUpdateFieldInput>>;
  infrastructureType?: InputMaybe<InfrastructureTypeEnumScalarMutations>;
  introductionDate?: InputMaybe<DateScalarMutations>;
  ipAddress?: InputMaybe<StringScalarMutations>;
  location?: InputMaybe<StringScalarMutations>;
  maintenanceWindow?: InputMaybe<StringScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  operatingSystem?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<InfrastructureOwnersUpdateFieldInput>>;
  parentInfrastructure?: InputMaybe<Array<InfrastructureParentInfrastructureUpdateFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<InfrastructurePartOfArchitecturesUpdateFieldInput>>;
  planningDate?: InputMaybe<DateScalarMutations>;
  specifications?: InputMaybe<StringScalarMutations>;
  status?: InputMaybe<InfrastructureStatusEnumScalarMutations>;
  usedByOrganisations?: InputMaybe<Array<InfrastructureUsedByOrganisationsUpdateFieldInput>>;
  vendor?: InputMaybe<StringScalarMutations>;
  version?: InputMaybe<StringScalarMutations>;
};

export type InfrastructureUsedByOrganisationsAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureUsedByOrganisationsAggregateInput>>;
  NOT?: InputMaybe<InfrastructureUsedByOrganisationsAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureUsedByOrganisationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<InfrastructureUsedByOrganisationsNodeAggregationWhereInput>;
};

export type InfrastructureUsedByOrganisationsConnectFieldInput = {
  connect?: InputMaybe<Array<OrganisationConnectInput>>;
  where?: InputMaybe<OrganisationConnectWhere>;
};

export type InfrastructureUsedByOrganisationsConnection = {
  __typename?: 'InfrastructureUsedByOrganisationsConnection';
  aggregate: InfrastructureOrganisationUsedByOrganisationsAggregateSelection;
  edges: Array<InfrastructureUsedByOrganisationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InfrastructureUsedByOrganisationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<InfrastructureUsedByOrganisationsConnectionAggregateInput>>;
  NOT?: InputMaybe<InfrastructureUsedByOrganisationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<InfrastructureUsedByOrganisationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<InfrastructureUsedByOrganisationsNodeAggregationWhereInput>;
};

export type InfrastructureUsedByOrganisationsConnectionFilters = {
  /** Filter Infrastructures by aggregating results on related InfrastructureUsedByOrganisationsConnections */
  aggregate?: InputMaybe<InfrastructureUsedByOrganisationsConnectionAggregateInput>;
  /** Return Infrastructures where all of the related InfrastructureUsedByOrganisationsConnections match this filter */
  all?: InputMaybe<InfrastructureUsedByOrganisationsConnectionWhere>;
  /** Return Infrastructures where none of the related InfrastructureUsedByOrganisationsConnections match this filter */
  none?: InputMaybe<InfrastructureUsedByOrganisationsConnectionWhere>;
  /** Return Infrastructures where one of the related InfrastructureUsedByOrganisationsConnections match this filter */
  single?: InputMaybe<InfrastructureUsedByOrganisationsConnectionWhere>;
  /** Return Infrastructures where some of the related InfrastructureUsedByOrganisationsConnections match this filter */
  some?: InputMaybe<InfrastructureUsedByOrganisationsConnectionWhere>;
};

export type InfrastructureUsedByOrganisationsConnectionSort = {
  node?: InputMaybe<OrganisationSort>;
};

export type InfrastructureUsedByOrganisationsConnectionWhere = {
  AND?: InputMaybe<Array<InfrastructureUsedByOrganisationsConnectionWhere>>;
  NOT?: InputMaybe<InfrastructureUsedByOrganisationsConnectionWhere>;
  OR?: InputMaybe<Array<InfrastructureUsedByOrganisationsConnectionWhere>>;
  node?: InputMaybe<OrganisationWhere>;
};

export type InfrastructureUsedByOrganisationsCreateFieldInput = {
  node: OrganisationCreateInput;
};

export type InfrastructureUsedByOrganisationsDeleteFieldInput = {
  delete?: InputMaybe<OrganisationDeleteInput>;
  where?: InputMaybe<InfrastructureUsedByOrganisationsConnectionWhere>;
};

export type InfrastructureUsedByOrganisationsDisconnectFieldInput = {
  disconnect?: InputMaybe<OrganisationDisconnectInput>;
  where?: InputMaybe<InfrastructureUsedByOrganisationsConnectionWhere>;
};

export type InfrastructureUsedByOrganisationsFieldInput = {
  connect?: InputMaybe<Array<InfrastructureUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureUsedByOrganisationsCreateFieldInput>>;
};

export type InfrastructureUsedByOrganisationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<InfrastructureUsedByOrganisationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<InfrastructureUsedByOrganisationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<InfrastructureUsedByOrganisationsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  level?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type InfrastructureUsedByOrganisationsRelationship = {
  __typename?: 'InfrastructureUsedByOrganisationsRelationship';
  cursor: Scalars['String']['output'];
  node: Organisation;
};

export type InfrastructureUsedByOrganisationsUpdateConnectionInput = {
  node?: InputMaybe<OrganisationUpdateInput>;
  where?: InputMaybe<InfrastructureUsedByOrganisationsConnectionWhere>;
};

export type InfrastructureUsedByOrganisationsUpdateFieldInput = {
  connect?: InputMaybe<Array<InfrastructureUsedByOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<InfrastructureUsedByOrganisationsCreateFieldInput>>;
  delete?: InputMaybe<Array<InfrastructureUsedByOrganisationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<InfrastructureUsedByOrganisationsDisconnectFieldInput>>;
  update?: InputMaybe<InfrastructureUsedByOrganisationsUpdateConnectionInput>;
};

export type InfrastructureWhere = {
  AND?: InputMaybe<Array<InfrastructureWhere>>;
  NOT?: InputMaybe<InfrastructureWhere>;
  OR?: InputMaybe<Array<InfrastructureWhere>>;
  capacity?: InputMaybe<StringScalarFilters>;
  childInfrastructures?: InputMaybe<InfrastructureRelationshipFilters>;
  childInfrastructuresConnection?: InputMaybe<InfrastructureChildInfrastructuresConnectionFilters>;
  company?: InputMaybe<CompanyRelationshipFilters>;
  companyConnection?: InputMaybe<InfrastructureCompanyConnectionFilters>;
  costs?: InputMaybe<FloatScalarFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  depictedInDiagrams?: InputMaybe<DiagramRelationshipFilters>;
  depictedInDiagramsConnection?: InputMaybe<InfrastructureDepictedInDiagramsConnectionFilters>;
  description?: InputMaybe<StringScalarFilters>;
  endOfLifeDate?: InputMaybe<DateScalarFilters>;
  endOfUseDate?: InputMaybe<DateScalarFilters>;
  hostsAIAssets?: InputMaybe<AiAssetRelationshipFilters>;
  hostsAIAssetsConnection?: InputMaybe<InfrastructureHostsAiAssetsConnectionFilters>;
  hostsApplications?: InputMaybe<ApplicationRelationshipFilters>;
  hostsApplicationsConnection?: InputMaybe<InfrastructureHostsApplicationsConnectionFilters>;
  id?: InputMaybe<IdScalarFilters>;
  infrastructureType?: InputMaybe<InfrastructureTypeEnumScalarFilters>;
  introductionDate?: InputMaybe<DateScalarFilters>;
  ipAddress?: InputMaybe<StringScalarFilters>;
  location?: InputMaybe<StringScalarFilters>;
  maintenanceWindow?: InputMaybe<StringScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  operatingSystem?: InputMaybe<StringScalarFilters>;
  owners?: InputMaybe<PersonRelationshipFilters>;
  ownersConnection?: InputMaybe<InfrastructureOwnersConnectionFilters>;
  parentInfrastructure?: InputMaybe<InfrastructureRelationshipFilters>;
  parentInfrastructureConnection?: InputMaybe<InfrastructureParentInfrastructureConnectionFilters>;
  partOfArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  partOfArchitecturesConnection?: InputMaybe<InfrastructurePartOfArchitecturesConnectionFilters>;
  planningDate?: InputMaybe<DateScalarFilters>;
  specifications?: InputMaybe<StringScalarFilters>;
  status?: InputMaybe<InfrastructureStatusEnumScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
  usedByOrganisations?: InputMaybe<OrganisationRelationshipFilters>;
  usedByOrganisationsConnection?: InputMaybe<InfrastructureUsedByOrganisationsConnectionFilters>;
  vendor?: InputMaybe<StringScalarFilters>;
  version?: InputMaybe<StringScalarFilters>;
};

export type InfrastructuresConnection = {
  __typename?: 'InfrastructuresConnection';
  aggregate: InfrastructureAggregate;
  edges: Array<InfrastructureEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IntAggregateSelection = {
  __typename?: 'IntAggregateSelection';
  average?: Maybe<Scalars['Float']['output']>;
  max?: Maybe<Scalars['Int']['output']>;
  min?: Maybe<Scalars['Int']['output']>;
  sum?: Maybe<Scalars['Int']['output']>;
};

/** Filters for an aggregation of an int field */
export type IntScalarAggregationFilters = {
  average?: InputMaybe<FloatScalarFilters>;
  max?: InputMaybe<IntScalarFilters>;
  min?: InputMaybe<IntScalarFilters>;
  sum?: InputMaybe<IntScalarFilters>;
};

/** Int filters */
export type IntScalarFilters = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
};

/** Int mutations */
export type IntScalarMutations = {
  add?: InputMaybe<Scalars['Int']['input']>;
  set?: InputMaybe<Scalars['Int']['input']>;
  subtract?: InputMaybe<Scalars['Int']['input']>;
};

/** Protokolle für Applikationsschnittstellen */
export enum InterfaceProtocol {
  FTP = 'FTP',
  GRAPHQL = 'GRAPHQL',
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  JDBC = 'JDBC',
  LDAP = 'LDAP',
  ODBC = 'ODBC',
  ORACLE = 'ORACLE',
  OTHER = 'OTHER',
  REST = 'REST',
  SFTP = 'SFTP',
  SMTP = 'SMTP',
  SOAP = 'SOAP',
  TCP = 'TCP',
  UDP = 'UDP'
}

/** InterfaceProtocol filters */
export type InterfaceProtocolEnumScalarFilters = {
  eq?: InputMaybe<InterfaceProtocol>;
  in?: InputMaybe<Array<InterfaceProtocol>>;
};

/** InterfaceProtocol mutations */
export type InterfaceProtocolEnumScalarMutations = {
  set?: InputMaybe<InterfaceProtocol>;
};

/** Status für Applikationsschnittstellen */
export enum InterfaceStatus {
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  PLANNED = 'PLANNED'
}

/** InterfaceStatus filters */
export type InterfaceStatusEnumScalarFilters = {
  eq?: InputMaybe<InterfaceStatus>;
  in?: InputMaybe<Array<InterfaceStatus>>;
};

/** InterfaceStatus mutations */
export type InterfaceStatusEnumScalarMutations = {
  set?: InputMaybe<InterfaceStatus>;
};

/** Schnittstellentypen für Applikationsschnittstellen */
export enum InterfaceType {
  API = 'API',
  DATABASE = 'DATABASE',
  FILE = 'FILE',
  MESSAGE_QUEUE = 'MESSAGE_QUEUE',
  OTHER = 'OTHER'
}

/** InterfaceType filters */
export type InterfaceTypeEnumScalarFilters = {
  eq?: InputMaybe<InterfaceType>;
  in?: InputMaybe<Array<InterfaceType>>;
};

/** InterfaceType mutations */
export type InterfaceTypeEnumScalarMutations = {
  set?: InputMaybe<InterfaceType>;
};

/** Mutations for a list for String */
export type ListStringMutations = {
  pop?: InputMaybe<Scalars['Int']['input']>;
  push?: InputMaybe<Array<Scalars['String']['input']>>;
  set?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAiAssets: CreateAiAssetsMutationResponse;
  createApplicationInterfaces: CreateApplicationInterfacesMutationResponse;
  createApplications: CreateApplicationsMutationResponse;
  createArchitecturePrinciples: CreateArchitecturePrinciplesMutationResponse;
  createArchitectures: CreateArchitecturesMutationResponse;
  createBusinessCapabilities: CreateBusinessCapabilitiesMutationResponse;
  createCompanies: CreateCompaniesMutationResponse;
  createDataObjects: CreateDataObjectsMutationResponse;
  createDiagrams: CreateDiagramsMutationResponse;
  createInfrastructures: CreateInfrastructuresMutationResponse;
  createOrganisations: CreateOrganisationsMutationResponse;
  createPeople: CreatePeopleMutationResponse;
  deleteAiAssets: DeleteInfo;
  deleteApplicationInterfaces: DeleteInfo;
  deleteApplications: DeleteInfo;
  deleteArchitecturePrinciples: DeleteInfo;
  deleteArchitectures: DeleteInfo;
  deleteBusinessCapabilities: DeleteInfo;
  deleteCompanies: DeleteInfo;
  deleteDataObjects: DeleteInfo;
  deleteDiagrams: DeleteInfo;
  deleteInfrastructures: DeleteInfo;
  deleteOrganisations: DeleteInfo;
  deletePeople: DeleteInfo;
  updateAiAssets: UpdateAiAssetsMutationResponse;
  updateApplicationInterfaces: UpdateApplicationInterfacesMutationResponse;
  updateApplications: UpdateApplicationsMutationResponse;
  updateArchitecturePrinciples: UpdateArchitecturePrinciplesMutationResponse;
  updateArchitectures: UpdateArchitecturesMutationResponse;
  updateBusinessCapabilities: UpdateBusinessCapabilitiesMutationResponse;
  updateCompanies: UpdateCompaniesMutationResponse;
  updateDataObjects: UpdateDataObjectsMutationResponse;
  updateDiagrams: UpdateDiagramsMutationResponse;
  updateInfrastructures: UpdateInfrastructuresMutationResponse;
  updateOrganisations: UpdateOrganisationsMutationResponse;
  updatePeople: UpdatePeopleMutationResponse;
};


export type MutationCreateAiAssetsArgs = {
  input: Array<AiAssetCreateInput>;
};


export type MutationCreateApplicationInterfacesArgs = {
  input: Array<ApplicationInterfaceCreateInput>;
};


export type MutationCreateApplicationsArgs = {
  input: Array<ApplicationCreateInput>;
};


export type MutationCreateArchitecturePrinciplesArgs = {
  input: Array<ArchitecturePrincipleCreateInput>;
};


export type MutationCreateArchitecturesArgs = {
  input: Array<ArchitectureCreateInput>;
};


export type MutationCreateBusinessCapabilitiesArgs = {
  input: Array<BusinessCapabilityCreateInput>;
};


export type MutationCreateCompaniesArgs = {
  input: Array<CompanyCreateInput>;
};


export type MutationCreateDataObjectsArgs = {
  input: Array<DataObjectCreateInput>;
};


export type MutationCreateDiagramsArgs = {
  input: Array<DiagramCreateInput>;
};


export type MutationCreateInfrastructuresArgs = {
  input: Array<InfrastructureCreateInput>;
};


export type MutationCreateOrganisationsArgs = {
  input: Array<OrganisationCreateInput>;
};


export type MutationCreatePeopleArgs = {
  input: Array<PersonCreateInput>;
};


export type MutationDeleteAiAssetsArgs = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<AiAssetWhere>;
};


export type MutationDeleteApplicationInterfacesArgs = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


export type MutationDeleteApplicationsArgs = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<ApplicationWhere>;
};


export type MutationDeleteArchitecturePrinciplesArgs = {
  delete?: InputMaybe<ArchitecturePrincipleDeleteInput>;
  where?: InputMaybe<ArchitecturePrincipleWhere>;
};


export type MutationDeleteArchitecturesArgs = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<ArchitectureWhere>;
};


export type MutationDeleteBusinessCapabilitiesArgs = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


export type MutationDeleteCompaniesArgs = {
  delete?: InputMaybe<CompanyDeleteInput>;
  where?: InputMaybe<CompanyWhere>;
};


export type MutationDeleteDataObjectsArgs = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<DataObjectWhere>;
};


export type MutationDeleteDiagramsArgs = {
  delete?: InputMaybe<DiagramDeleteInput>;
  where?: InputMaybe<DiagramWhere>;
};


export type MutationDeleteInfrastructuresArgs = {
  delete?: InputMaybe<InfrastructureDeleteInput>;
  where?: InputMaybe<InfrastructureWhere>;
};


export type MutationDeleteOrganisationsArgs = {
  delete?: InputMaybe<OrganisationDeleteInput>;
  where?: InputMaybe<OrganisationWhere>;
};


export type MutationDeletePeopleArgs = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<PersonWhere>;
};


export type MutationUpdateAiAssetsArgs = {
  update?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<AiAssetWhere>;
};


export type MutationUpdateApplicationInterfacesArgs = {
  update?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


export type MutationUpdateApplicationsArgs = {
  update?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<ApplicationWhere>;
};


export type MutationUpdateArchitecturePrinciplesArgs = {
  update?: InputMaybe<ArchitecturePrincipleUpdateInput>;
  where?: InputMaybe<ArchitecturePrincipleWhere>;
};


export type MutationUpdateArchitecturesArgs = {
  update?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<ArchitectureWhere>;
};


export type MutationUpdateBusinessCapabilitiesArgs = {
  update?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


export type MutationUpdateCompaniesArgs = {
  update?: InputMaybe<CompanyUpdateInput>;
  where?: InputMaybe<CompanyWhere>;
};


export type MutationUpdateDataObjectsArgs = {
  update?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<DataObjectWhere>;
};


export type MutationUpdateDiagramsArgs = {
  update?: InputMaybe<DiagramUpdateInput>;
  where?: InputMaybe<DiagramWhere>;
};


export type MutationUpdateInfrastructuresArgs = {
  update?: InputMaybe<InfrastructureUpdateInput>;
  where?: InputMaybe<InfrastructureWhere>;
};


export type MutationUpdateOrganisationsArgs = {
  update?: InputMaybe<OrganisationUpdateInput>;
  where?: InputMaybe<OrganisationWhere>;
};


export type MutationUpdatePeopleArgs = {
  update?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<PersonWhere>;
};

/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type Organisation = {
  __typename?: 'Organisation';
  childOrganisations: Array<Organisation>;
  childOrganisationsConnection: OrganisationChildOrganisationsConnection;
  company: Array<Company>;
  companyConnection: OrganisationCompanyConnection;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  level?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  parentOrganisation: Array<Organisation>;
  parentOrganisationConnection: OrganisationParentOrganisationConnection;
  type: OrganisationType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usedAIAssets: Array<AiAsset>;
  usedAIAssetsConnection: OrganisationUsedAiAssetsConnection;
  usedApplications: Array<Application>;
  usedApplicationsConnection: OrganisationUsedApplicationsConnection;
  usedCapabilities: Array<BusinessCapability>;
  usedCapabilitiesConnection: OrganisationUsedCapabilitiesConnection;
  usedDataObjects: Array<DataObject>;
  usedDataObjectsConnection: OrganisationUsedDataObjectsConnection;
  usedInfrastructure: Array<Infrastructure>;
  usedInfrastructureConnection: OrganisationUsedInfrastructureConnection;
  usedInterfaces: Array<ApplicationInterface>;
  usedInterfacesConnection: OrganisationUsedInterfacesConnection;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationChildOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationChildOrganisationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationChildOrganisationsConnectionSort>>;
  where?: InputMaybe<OrganisationChildOrganisationsConnectionWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationCompanyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanySort>>;
  where?: InputMaybe<CompanyWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationCompanyConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationCompanyConnectionSort>>;
  where?: InputMaybe<OrganisationCompanyConnectionWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationParentOrganisationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationParentOrganisationConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationParentOrganisationConnectionSort>>;
  where?: InputMaybe<OrganisationParentOrganisationConnectionWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedAiAssetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedAiAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationUsedAiAssetsConnectionSort>>;
  where?: InputMaybe<OrganisationUsedAiAssetsConnectionWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationUsedApplicationsConnectionSort>>;
  where?: InputMaybe<OrganisationUsedApplicationsConnectionWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedCapabilitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedCapabilitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationUsedCapabilitiesConnectionSort>>;
  where?: InputMaybe<OrganisationUsedCapabilitiesConnectionWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationUsedDataObjectsConnectionSort>>;
  where?: InputMaybe<OrganisationUsedDataObjectsConnectionWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedInfrastructureArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedInfrastructureConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationUsedInfrastructureConnectionSort>>;
  where?: InputMaybe<OrganisationUsedInfrastructureConnectionWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedInterfacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** Organisation - repräsentiert eine organisatorische Einheit im Unternehmen */
export type OrganisationUsedInterfacesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationUsedInterfacesConnectionSort>>;
  where?: InputMaybe<OrganisationUsedInterfacesConnectionWhere>;
};

export type OrganisationAiAssetUsedAiAssetsAggregateSelection = {
  __typename?: 'OrganisationAIAssetUsedAIAssetsAggregateSelection';
  count: CountConnection;
  node?: Maybe<OrganisationAiAssetUsedAiAssetsNodeAggregateSelection>;
};

export type OrganisationAiAssetUsedAiAssetsNodeAggregateSelection = {
  __typename?: 'OrganisationAIAssetUsedAIAssetsNodeAggregateSelection';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type OrganisationAggregate = {
  __typename?: 'OrganisationAggregate';
  count: Count;
  node: OrganisationAggregateNode;
};

export type OrganisationAggregateNode = {
  __typename?: 'OrganisationAggregateNode';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  level: IntAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type OrganisationApplicationInterfaceUsedInterfacesAggregateSelection = {
  __typename?: 'OrganisationApplicationInterfaceUsedInterfacesAggregateSelection';
  count: CountConnection;
  node?: Maybe<OrganisationApplicationInterfaceUsedInterfacesNodeAggregateSelection>;
};

export type OrganisationApplicationInterfaceUsedInterfacesNodeAggregateSelection = {
  __typename?: 'OrganisationApplicationInterfaceUsedInterfacesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type OrganisationApplicationUsedApplicationsAggregateSelection = {
  __typename?: 'OrganisationApplicationUsedApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<OrganisationApplicationUsedApplicationsNodeAggregateSelection>;
};

export type OrganisationApplicationUsedApplicationsNodeAggregateSelection = {
  __typename?: 'OrganisationApplicationUsedApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type OrganisationBusinessCapabilityUsedCapabilitiesAggregateSelection = {
  __typename?: 'OrganisationBusinessCapabilityUsedCapabilitiesAggregateSelection';
  count: CountConnection;
  node?: Maybe<OrganisationBusinessCapabilityUsedCapabilitiesNodeAggregateSelection>;
};

export type OrganisationBusinessCapabilityUsedCapabilitiesNodeAggregateSelection = {
  __typename?: 'OrganisationBusinessCapabilityUsedCapabilitiesNodeAggregateSelection';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type OrganisationChildOrganisationsAggregateInput = {
  AND?: InputMaybe<Array<OrganisationChildOrganisationsAggregateInput>>;
  NOT?: InputMaybe<OrganisationChildOrganisationsAggregateInput>;
  OR?: InputMaybe<Array<OrganisationChildOrganisationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<OrganisationChildOrganisationsNodeAggregationWhereInput>;
};

export type OrganisationChildOrganisationsConnectFieldInput = {
  connect?: InputMaybe<Array<OrganisationConnectInput>>;
  where?: InputMaybe<OrganisationConnectWhere>;
};

export type OrganisationChildOrganisationsConnection = {
  __typename?: 'OrganisationChildOrganisationsConnection';
  aggregate: OrganisationOrganisationChildOrganisationsAggregateSelection;
  edges: Array<OrganisationChildOrganisationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type OrganisationChildOrganisationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<OrganisationChildOrganisationsConnectionAggregateInput>>;
  NOT?: InputMaybe<OrganisationChildOrganisationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<OrganisationChildOrganisationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<OrganisationChildOrganisationsNodeAggregationWhereInput>;
};

export type OrganisationChildOrganisationsConnectionFilters = {
  /** Filter Organisations by aggregating results on related OrganisationChildOrganisationsConnections */
  aggregate?: InputMaybe<OrganisationChildOrganisationsConnectionAggregateInput>;
  /** Return Organisations where all of the related OrganisationChildOrganisationsConnections match this filter */
  all?: InputMaybe<OrganisationChildOrganisationsConnectionWhere>;
  /** Return Organisations where none of the related OrganisationChildOrganisationsConnections match this filter */
  none?: InputMaybe<OrganisationChildOrganisationsConnectionWhere>;
  /** Return Organisations where one of the related OrganisationChildOrganisationsConnections match this filter */
  single?: InputMaybe<OrganisationChildOrganisationsConnectionWhere>;
  /** Return Organisations where some of the related OrganisationChildOrganisationsConnections match this filter */
  some?: InputMaybe<OrganisationChildOrganisationsConnectionWhere>;
};

export type OrganisationChildOrganisationsConnectionSort = {
  node?: InputMaybe<OrganisationSort>;
};

export type OrganisationChildOrganisationsConnectionWhere = {
  AND?: InputMaybe<Array<OrganisationChildOrganisationsConnectionWhere>>;
  NOT?: InputMaybe<OrganisationChildOrganisationsConnectionWhere>;
  OR?: InputMaybe<Array<OrganisationChildOrganisationsConnectionWhere>>;
  node?: InputMaybe<OrganisationWhere>;
};

export type OrganisationChildOrganisationsCreateFieldInput = {
  node: OrganisationCreateInput;
};

export type OrganisationChildOrganisationsDeleteFieldInput = {
  delete?: InputMaybe<OrganisationDeleteInput>;
  where?: InputMaybe<OrganisationChildOrganisationsConnectionWhere>;
};

export type OrganisationChildOrganisationsDisconnectFieldInput = {
  disconnect?: InputMaybe<OrganisationDisconnectInput>;
  where?: InputMaybe<OrganisationChildOrganisationsConnectionWhere>;
};

export type OrganisationChildOrganisationsFieldInput = {
  connect?: InputMaybe<Array<OrganisationChildOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationChildOrganisationsCreateFieldInput>>;
};

export type OrganisationChildOrganisationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<OrganisationChildOrganisationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<OrganisationChildOrganisationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<OrganisationChildOrganisationsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  level?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type OrganisationChildOrganisationsRelationship = {
  __typename?: 'OrganisationChildOrganisationsRelationship';
  cursor: Scalars['String']['output'];
  node: Organisation;
};

export type OrganisationChildOrganisationsUpdateConnectionInput = {
  node?: InputMaybe<OrganisationUpdateInput>;
  where?: InputMaybe<OrganisationChildOrganisationsConnectionWhere>;
};

export type OrganisationChildOrganisationsUpdateFieldInput = {
  connect?: InputMaybe<Array<OrganisationChildOrganisationsConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationChildOrganisationsCreateFieldInput>>;
  delete?: InputMaybe<Array<OrganisationChildOrganisationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<OrganisationChildOrganisationsDisconnectFieldInput>>;
  update?: InputMaybe<OrganisationChildOrganisationsUpdateConnectionInput>;
};

export type OrganisationCompanyAggregateInput = {
  AND?: InputMaybe<Array<OrganisationCompanyAggregateInput>>;
  NOT?: InputMaybe<OrganisationCompanyAggregateInput>;
  OR?: InputMaybe<Array<OrganisationCompanyAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<OrganisationCompanyNodeAggregationWhereInput>;
};

export type OrganisationCompanyCompanyAggregateSelection = {
  __typename?: 'OrganisationCompanyCompanyAggregateSelection';
  count: CountConnection;
  node?: Maybe<OrganisationCompanyCompanyNodeAggregateSelection>;
};

export type OrganisationCompanyCompanyNodeAggregateSelection = {
  __typename?: 'OrganisationCompanyCompanyNodeAggregateSelection';
  address: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  industry: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  website: StringAggregateSelection;
};

export type OrganisationCompanyConnectFieldInput = {
  connect?: InputMaybe<Array<CompanyConnectInput>>;
  where?: InputMaybe<CompanyConnectWhere>;
};

export type OrganisationCompanyConnection = {
  __typename?: 'OrganisationCompanyConnection';
  aggregate: OrganisationCompanyCompanyAggregateSelection;
  edges: Array<OrganisationCompanyRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type OrganisationCompanyConnectionAggregateInput = {
  AND?: InputMaybe<Array<OrganisationCompanyConnectionAggregateInput>>;
  NOT?: InputMaybe<OrganisationCompanyConnectionAggregateInput>;
  OR?: InputMaybe<Array<OrganisationCompanyConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<OrganisationCompanyNodeAggregationWhereInput>;
};

export type OrganisationCompanyConnectionFilters = {
  /** Filter Organisations by aggregating results on related OrganisationCompanyConnections */
  aggregate?: InputMaybe<OrganisationCompanyConnectionAggregateInput>;
  /** Return Organisations where all of the related OrganisationCompanyConnections match this filter */
  all?: InputMaybe<OrganisationCompanyConnectionWhere>;
  /** Return Organisations where none of the related OrganisationCompanyConnections match this filter */
  none?: InputMaybe<OrganisationCompanyConnectionWhere>;
  /** Return Organisations where one of the related OrganisationCompanyConnections match this filter */
  single?: InputMaybe<OrganisationCompanyConnectionWhere>;
  /** Return Organisations where some of the related OrganisationCompanyConnections match this filter */
  some?: InputMaybe<OrganisationCompanyConnectionWhere>;
};

export type OrganisationCompanyConnectionSort = {
  node?: InputMaybe<CompanySort>;
};

export type OrganisationCompanyConnectionWhere = {
  AND?: InputMaybe<Array<OrganisationCompanyConnectionWhere>>;
  NOT?: InputMaybe<OrganisationCompanyConnectionWhere>;
  OR?: InputMaybe<Array<OrganisationCompanyConnectionWhere>>;
  node?: InputMaybe<CompanyWhere>;
};

export type OrganisationCompanyCreateFieldInput = {
  node: CompanyCreateInput;
};

export type OrganisationCompanyDeleteFieldInput = {
  delete?: InputMaybe<CompanyDeleteInput>;
  where?: InputMaybe<OrganisationCompanyConnectionWhere>;
};

export type OrganisationCompanyDisconnectFieldInput = {
  disconnect?: InputMaybe<CompanyDisconnectInput>;
  where?: InputMaybe<OrganisationCompanyConnectionWhere>;
};

export type OrganisationCompanyFieldInput = {
  connect?: InputMaybe<Array<OrganisationCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationCompanyCreateFieldInput>>;
};

export type OrganisationCompanyNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<OrganisationCompanyNodeAggregationWhereInput>>;
  NOT?: InputMaybe<OrganisationCompanyNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<OrganisationCompanyNodeAggregationWhereInput>>;
  address?: InputMaybe<StringScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  industry?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  website?: InputMaybe<StringScalarAggregationFilters>;
};

export type OrganisationCompanyRelationship = {
  __typename?: 'OrganisationCompanyRelationship';
  cursor: Scalars['String']['output'];
  node: Company;
};

export type OrganisationCompanyUpdateConnectionInput = {
  node?: InputMaybe<CompanyUpdateInput>;
  where?: InputMaybe<OrganisationCompanyConnectionWhere>;
};

export type OrganisationCompanyUpdateFieldInput = {
  connect?: InputMaybe<Array<OrganisationCompanyConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationCompanyCreateFieldInput>>;
  delete?: InputMaybe<Array<OrganisationCompanyDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<OrganisationCompanyDisconnectFieldInput>>;
  update?: InputMaybe<OrganisationCompanyUpdateConnectionInput>;
};

export type OrganisationConnectInput = {
  childOrganisations?: InputMaybe<Array<OrganisationChildOrganisationsConnectFieldInput>>;
  company?: InputMaybe<Array<OrganisationCompanyConnectFieldInput>>;
  parentOrganisation?: InputMaybe<Array<OrganisationParentOrganisationConnectFieldInput>>;
  usedAIAssets?: InputMaybe<Array<OrganisationUsedAiAssetsConnectFieldInput>>;
  usedApplications?: InputMaybe<Array<OrganisationUsedApplicationsConnectFieldInput>>;
  usedCapabilities?: InputMaybe<Array<OrganisationUsedCapabilitiesConnectFieldInput>>;
  usedDataObjects?: InputMaybe<Array<OrganisationUsedDataObjectsConnectFieldInput>>;
  usedInfrastructure?: InputMaybe<Array<OrganisationUsedInfrastructureConnectFieldInput>>;
  usedInterfaces?: InputMaybe<Array<OrganisationUsedInterfacesConnectFieldInput>>;
};

export type OrganisationConnectWhere = {
  node: OrganisationWhere;
};

export type OrganisationCreateInput = {
  childOrganisations?: InputMaybe<OrganisationChildOrganisationsFieldInput>;
  company?: InputMaybe<OrganisationCompanyFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  parentOrganisation?: InputMaybe<OrganisationParentOrganisationFieldInput>;
  type: OrganisationType;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usedAIAssets?: InputMaybe<OrganisationUsedAiAssetsFieldInput>;
  usedApplications?: InputMaybe<OrganisationUsedApplicationsFieldInput>;
  usedCapabilities?: InputMaybe<OrganisationUsedCapabilitiesFieldInput>;
  usedDataObjects?: InputMaybe<OrganisationUsedDataObjectsFieldInput>;
  usedInfrastructure?: InputMaybe<OrganisationUsedInfrastructureFieldInput>;
  usedInterfaces?: InputMaybe<OrganisationUsedInterfacesFieldInput>;
};

export type OrganisationDataObjectUsedDataObjectsAggregateSelection = {
  __typename?: 'OrganisationDataObjectUsedDataObjectsAggregateSelection';
  count: CountConnection;
  node?: Maybe<OrganisationDataObjectUsedDataObjectsNodeAggregateSelection>;
};

export type OrganisationDataObjectUsedDataObjectsNodeAggregateSelection = {
  __typename?: 'OrganisationDataObjectUsedDataObjectsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type OrganisationDeleteInput = {
  childOrganisations?: InputMaybe<Array<OrganisationChildOrganisationsDeleteFieldInput>>;
  company?: InputMaybe<Array<OrganisationCompanyDeleteFieldInput>>;
  parentOrganisation?: InputMaybe<Array<OrganisationParentOrganisationDeleteFieldInput>>;
  usedAIAssets?: InputMaybe<Array<OrganisationUsedAiAssetsDeleteFieldInput>>;
  usedApplications?: InputMaybe<Array<OrganisationUsedApplicationsDeleteFieldInput>>;
  usedCapabilities?: InputMaybe<Array<OrganisationUsedCapabilitiesDeleteFieldInput>>;
  usedDataObjects?: InputMaybe<Array<OrganisationUsedDataObjectsDeleteFieldInput>>;
  usedInfrastructure?: InputMaybe<Array<OrganisationUsedInfrastructureDeleteFieldInput>>;
  usedInterfaces?: InputMaybe<Array<OrganisationUsedInterfacesDeleteFieldInput>>;
};

export type OrganisationDisconnectInput = {
  childOrganisations?: InputMaybe<Array<OrganisationChildOrganisationsDisconnectFieldInput>>;
  company?: InputMaybe<Array<OrganisationCompanyDisconnectFieldInput>>;
  parentOrganisation?: InputMaybe<Array<OrganisationParentOrganisationDisconnectFieldInput>>;
  usedAIAssets?: InputMaybe<Array<OrganisationUsedAiAssetsDisconnectFieldInput>>;
  usedApplications?: InputMaybe<Array<OrganisationUsedApplicationsDisconnectFieldInput>>;
  usedCapabilities?: InputMaybe<Array<OrganisationUsedCapabilitiesDisconnectFieldInput>>;
  usedDataObjects?: InputMaybe<Array<OrganisationUsedDataObjectsDisconnectFieldInput>>;
  usedInfrastructure?: InputMaybe<Array<OrganisationUsedInfrastructureDisconnectFieldInput>>;
  usedInterfaces?: InputMaybe<Array<OrganisationUsedInterfacesDisconnectFieldInput>>;
};

export type OrganisationEdge = {
  __typename?: 'OrganisationEdge';
  cursor: Scalars['String']['output'];
  node: Organisation;
};

export type OrganisationInfrastructureUsedInfrastructureAggregateSelection = {
  __typename?: 'OrganisationInfrastructureUsedInfrastructureAggregateSelection';
  count: CountConnection;
  node?: Maybe<OrganisationInfrastructureUsedInfrastructureNodeAggregateSelection>;
};

export type OrganisationInfrastructureUsedInfrastructureNodeAggregateSelection = {
  __typename?: 'OrganisationInfrastructureUsedInfrastructureNodeAggregateSelection';
  capacity: StringAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  ipAddress: StringAggregateSelection;
  location: StringAggregateSelection;
  maintenanceWindow: StringAggregateSelection;
  name: StringAggregateSelection;
  operatingSystem: StringAggregateSelection;
  specifications: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type OrganisationOrganisationChildOrganisationsAggregateSelection = {
  __typename?: 'OrganisationOrganisationChildOrganisationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<OrganisationOrganisationChildOrganisationsNodeAggregateSelection>;
};

export type OrganisationOrganisationChildOrganisationsNodeAggregateSelection = {
  __typename?: 'OrganisationOrganisationChildOrganisationsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  level: IntAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type OrganisationOrganisationParentOrganisationAggregateSelection = {
  __typename?: 'OrganisationOrganisationParentOrganisationAggregateSelection';
  count: CountConnection;
  node?: Maybe<OrganisationOrganisationParentOrganisationNodeAggregateSelection>;
};

export type OrganisationOrganisationParentOrganisationNodeAggregateSelection = {
  __typename?: 'OrganisationOrganisationParentOrganisationNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  level: IntAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type OrganisationParentOrganisationAggregateInput = {
  AND?: InputMaybe<Array<OrganisationParentOrganisationAggregateInput>>;
  NOT?: InputMaybe<OrganisationParentOrganisationAggregateInput>;
  OR?: InputMaybe<Array<OrganisationParentOrganisationAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<OrganisationParentOrganisationNodeAggregationWhereInput>;
};

export type OrganisationParentOrganisationConnectFieldInput = {
  connect?: InputMaybe<Array<OrganisationConnectInput>>;
  where?: InputMaybe<OrganisationConnectWhere>;
};

export type OrganisationParentOrganisationConnection = {
  __typename?: 'OrganisationParentOrganisationConnection';
  aggregate: OrganisationOrganisationParentOrganisationAggregateSelection;
  edges: Array<OrganisationParentOrganisationRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type OrganisationParentOrganisationConnectionAggregateInput = {
  AND?: InputMaybe<Array<OrganisationParentOrganisationConnectionAggregateInput>>;
  NOT?: InputMaybe<OrganisationParentOrganisationConnectionAggregateInput>;
  OR?: InputMaybe<Array<OrganisationParentOrganisationConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<OrganisationParentOrganisationNodeAggregationWhereInput>;
};

export type OrganisationParentOrganisationConnectionFilters = {
  /** Filter Organisations by aggregating results on related OrganisationParentOrganisationConnections */
  aggregate?: InputMaybe<OrganisationParentOrganisationConnectionAggregateInput>;
  /** Return Organisations where all of the related OrganisationParentOrganisationConnections match this filter */
  all?: InputMaybe<OrganisationParentOrganisationConnectionWhere>;
  /** Return Organisations where none of the related OrganisationParentOrganisationConnections match this filter */
  none?: InputMaybe<OrganisationParentOrganisationConnectionWhere>;
  /** Return Organisations where one of the related OrganisationParentOrganisationConnections match this filter */
  single?: InputMaybe<OrganisationParentOrganisationConnectionWhere>;
  /** Return Organisations where some of the related OrganisationParentOrganisationConnections match this filter */
  some?: InputMaybe<OrganisationParentOrganisationConnectionWhere>;
};

export type OrganisationParentOrganisationConnectionSort = {
  node?: InputMaybe<OrganisationSort>;
};

export type OrganisationParentOrganisationConnectionWhere = {
  AND?: InputMaybe<Array<OrganisationParentOrganisationConnectionWhere>>;
  NOT?: InputMaybe<OrganisationParentOrganisationConnectionWhere>;
  OR?: InputMaybe<Array<OrganisationParentOrganisationConnectionWhere>>;
  node?: InputMaybe<OrganisationWhere>;
};

export type OrganisationParentOrganisationCreateFieldInput = {
  node: OrganisationCreateInput;
};

export type OrganisationParentOrganisationDeleteFieldInput = {
  delete?: InputMaybe<OrganisationDeleteInput>;
  where?: InputMaybe<OrganisationParentOrganisationConnectionWhere>;
};

export type OrganisationParentOrganisationDisconnectFieldInput = {
  disconnect?: InputMaybe<OrganisationDisconnectInput>;
  where?: InputMaybe<OrganisationParentOrganisationConnectionWhere>;
};

export type OrganisationParentOrganisationFieldInput = {
  connect?: InputMaybe<Array<OrganisationParentOrganisationConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationParentOrganisationCreateFieldInput>>;
};

export type OrganisationParentOrganisationNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<OrganisationParentOrganisationNodeAggregationWhereInput>>;
  NOT?: InputMaybe<OrganisationParentOrganisationNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<OrganisationParentOrganisationNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  level?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type OrganisationParentOrganisationRelationship = {
  __typename?: 'OrganisationParentOrganisationRelationship';
  cursor: Scalars['String']['output'];
  node: Organisation;
};

export type OrganisationParentOrganisationUpdateConnectionInput = {
  node?: InputMaybe<OrganisationUpdateInput>;
  where?: InputMaybe<OrganisationParentOrganisationConnectionWhere>;
};

export type OrganisationParentOrganisationUpdateFieldInput = {
  connect?: InputMaybe<Array<OrganisationParentOrganisationConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationParentOrganisationCreateFieldInput>>;
  delete?: InputMaybe<Array<OrganisationParentOrganisationDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<OrganisationParentOrganisationDisconnectFieldInput>>;
  update?: InputMaybe<OrganisationParentOrganisationUpdateConnectionInput>;
};

export type OrganisationRelationshipFilters = {
  /** Filter type where all of the related Organisations match this filter */
  all?: InputMaybe<OrganisationWhere>;
  /** Filter type where none of the related Organisations match this filter */
  none?: InputMaybe<OrganisationWhere>;
  /** Filter type where one of the related Organisations match this filter */
  single?: InputMaybe<OrganisationWhere>;
  /** Filter type where some of the related Organisations match this filter */
  some?: InputMaybe<OrganisationWhere>;
};

/** Fields to sort Organisations by. The order in which sorts are applied is not guaranteed when specifying many fields in one OrganisationSort object. */
export type OrganisationSort = {
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  level?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  type?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

/** Organisationstypen */
export enum OrganisationType {
  BRANCH = 'BRANCH',
  DEPARTMENT = 'DEPARTMENT',
  DIVISION = 'DIVISION',
  FUNCTION = 'FUNCTION',
  PROJECT = 'PROJECT',
  SUBSIDIARY = 'SUBSIDIARY',
  TEAM = 'TEAM',
  UNIT = 'UNIT'
}

/** OrganisationType filters */
export type OrganisationTypeEnumScalarFilters = {
  eq?: InputMaybe<OrganisationType>;
  in?: InputMaybe<Array<OrganisationType>>;
};

/** OrganisationType mutations */
export type OrganisationTypeEnumScalarMutations = {
  set?: InputMaybe<OrganisationType>;
};

export type OrganisationUpdateInput = {
  childOrganisations?: InputMaybe<Array<OrganisationChildOrganisationsUpdateFieldInput>>;
  company?: InputMaybe<Array<OrganisationCompanyUpdateFieldInput>>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  description?: InputMaybe<StringScalarMutations>;
  level?: InputMaybe<IntScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  parentOrganisation?: InputMaybe<Array<OrganisationParentOrganisationUpdateFieldInput>>;
  type?: InputMaybe<OrganisationTypeEnumScalarMutations>;
  usedAIAssets?: InputMaybe<Array<OrganisationUsedAiAssetsUpdateFieldInput>>;
  usedApplications?: InputMaybe<Array<OrganisationUsedApplicationsUpdateFieldInput>>;
  usedCapabilities?: InputMaybe<Array<OrganisationUsedCapabilitiesUpdateFieldInput>>;
  usedDataObjects?: InputMaybe<Array<OrganisationUsedDataObjectsUpdateFieldInput>>;
  usedInfrastructure?: InputMaybe<Array<OrganisationUsedInfrastructureUpdateFieldInput>>;
  usedInterfaces?: InputMaybe<Array<OrganisationUsedInterfacesUpdateFieldInput>>;
};

export type OrganisationUsedAiAssetsAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedAiAssetsAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedAiAssetsAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedAiAssetsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<OrganisationUsedAiAssetsNodeAggregationWhereInput>;
};

export type OrganisationUsedAiAssetsConnectFieldInput = {
  connect?: InputMaybe<Array<AiAssetConnectInput>>;
  where?: InputMaybe<AiAssetConnectWhere>;
};

export type OrganisationUsedAiAssetsConnection = {
  __typename?: 'OrganisationUsedAIAssetsConnection';
  aggregate: OrganisationAiAssetUsedAiAssetsAggregateSelection;
  edges: Array<OrganisationUsedAiAssetsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type OrganisationUsedAiAssetsConnectionAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedAiAssetsConnectionAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedAiAssetsConnectionAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedAiAssetsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<OrganisationUsedAiAssetsNodeAggregationWhereInput>;
};

export type OrganisationUsedAiAssetsConnectionFilters = {
  /** Filter Organisations by aggregating results on related OrganisationUsedAIAssetsConnections */
  aggregate?: InputMaybe<OrganisationUsedAiAssetsConnectionAggregateInput>;
  /** Return Organisations where all of the related OrganisationUsedAIAssetsConnections match this filter */
  all?: InputMaybe<OrganisationUsedAiAssetsConnectionWhere>;
  /** Return Organisations where none of the related OrganisationUsedAIAssetsConnections match this filter */
  none?: InputMaybe<OrganisationUsedAiAssetsConnectionWhere>;
  /** Return Organisations where one of the related OrganisationUsedAIAssetsConnections match this filter */
  single?: InputMaybe<OrganisationUsedAiAssetsConnectionWhere>;
  /** Return Organisations where some of the related OrganisationUsedAIAssetsConnections match this filter */
  some?: InputMaybe<OrganisationUsedAiAssetsConnectionWhere>;
};

export type OrganisationUsedAiAssetsConnectionSort = {
  node?: InputMaybe<AiAssetSort>;
};

export type OrganisationUsedAiAssetsConnectionWhere = {
  AND?: InputMaybe<Array<OrganisationUsedAiAssetsConnectionWhere>>;
  NOT?: InputMaybe<OrganisationUsedAiAssetsConnectionWhere>;
  OR?: InputMaybe<Array<OrganisationUsedAiAssetsConnectionWhere>>;
  node?: InputMaybe<AiAssetWhere>;
};

export type OrganisationUsedAiAssetsCreateFieldInput = {
  node: AiAssetCreateInput;
};

export type OrganisationUsedAiAssetsDeleteFieldInput = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<OrganisationUsedAiAssetsConnectionWhere>;
};

export type OrganisationUsedAiAssetsDisconnectFieldInput = {
  disconnect?: InputMaybe<AiAssetDisconnectInput>;
  where?: InputMaybe<OrganisationUsedAiAssetsConnectionWhere>;
};

export type OrganisationUsedAiAssetsFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedAiAssetsCreateFieldInput>>;
};

export type OrganisationUsedAiAssetsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<OrganisationUsedAiAssetsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<OrganisationUsedAiAssetsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<OrganisationUsedAiAssetsNodeAggregationWhereInput>>;
  accuracy?: InputMaybe<FloatScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  license?: InputMaybe<StringScalarAggregationFilters>;
  model?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  provider?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type OrganisationUsedAiAssetsRelationship = {
  __typename?: 'OrganisationUsedAIAssetsRelationship';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type OrganisationUsedAiAssetsUpdateConnectionInput = {
  node?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<OrganisationUsedAiAssetsConnectionWhere>;
};

export type OrganisationUsedAiAssetsUpdateFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedAiAssetsCreateFieldInput>>;
  delete?: InputMaybe<Array<OrganisationUsedAiAssetsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<OrganisationUsedAiAssetsDisconnectFieldInput>>;
  update?: InputMaybe<OrganisationUsedAiAssetsUpdateConnectionInput>;
};

export type OrganisationUsedApplicationsAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedApplicationsAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedApplicationsAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<OrganisationUsedApplicationsNodeAggregationWhereInput>;
};

export type OrganisationUsedApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type OrganisationUsedApplicationsConnection = {
  __typename?: 'OrganisationUsedApplicationsConnection';
  aggregate: OrganisationApplicationUsedApplicationsAggregateSelection;
  edges: Array<OrganisationUsedApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type OrganisationUsedApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<OrganisationUsedApplicationsNodeAggregationWhereInput>;
};

export type OrganisationUsedApplicationsConnectionFilters = {
  /** Filter Organisations by aggregating results on related OrganisationUsedApplicationsConnections */
  aggregate?: InputMaybe<OrganisationUsedApplicationsConnectionAggregateInput>;
  /** Return Organisations where all of the related OrganisationUsedApplicationsConnections match this filter */
  all?: InputMaybe<OrganisationUsedApplicationsConnectionWhere>;
  /** Return Organisations where none of the related OrganisationUsedApplicationsConnections match this filter */
  none?: InputMaybe<OrganisationUsedApplicationsConnectionWhere>;
  /** Return Organisations where one of the related OrganisationUsedApplicationsConnections match this filter */
  single?: InputMaybe<OrganisationUsedApplicationsConnectionWhere>;
  /** Return Organisations where some of the related OrganisationUsedApplicationsConnections match this filter */
  some?: InputMaybe<OrganisationUsedApplicationsConnectionWhere>;
};

export type OrganisationUsedApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type OrganisationUsedApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<OrganisationUsedApplicationsConnectionWhere>>;
  NOT?: InputMaybe<OrganisationUsedApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<OrganisationUsedApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type OrganisationUsedApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type OrganisationUsedApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<OrganisationUsedApplicationsConnectionWhere>;
};

export type OrganisationUsedApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<OrganisationUsedApplicationsConnectionWhere>;
};

export type OrganisationUsedApplicationsFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedApplicationsCreateFieldInput>>;
};

export type OrganisationUsedApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<OrganisationUsedApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<OrganisationUsedApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<OrganisationUsedApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type OrganisationUsedApplicationsRelationship = {
  __typename?: 'OrganisationUsedApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type OrganisationUsedApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<OrganisationUsedApplicationsConnectionWhere>;
};

export type OrganisationUsedApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<OrganisationUsedApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<OrganisationUsedApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<OrganisationUsedApplicationsUpdateConnectionInput>;
};

export type OrganisationUsedCapabilitiesAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedCapabilitiesAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedCapabilitiesAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedCapabilitiesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<OrganisationUsedCapabilitiesNodeAggregationWhereInput>;
};

export type OrganisationUsedCapabilitiesConnectFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityConnectInput>>;
  where?: InputMaybe<BusinessCapabilityConnectWhere>;
};

export type OrganisationUsedCapabilitiesConnection = {
  __typename?: 'OrganisationUsedCapabilitiesConnection';
  aggregate: OrganisationBusinessCapabilityUsedCapabilitiesAggregateSelection;
  edges: Array<OrganisationUsedCapabilitiesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type OrganisationUsedCapabilitiesConnectionAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedCapabilitiesConnectionAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedCapabilitiesConnectionAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedCapabilitiesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<OrganisationUsedCapabilitiesNodeAggregationWhereInput>;
};

export type OrganisationUsedCapabilitiesConnectionFilters = {
  /** Filter Organisations by aggregating results on related OrganisationUsedCapabilitiesConnections */
  aggregate?: InputMaybe<OrganisationUsedCapabilitiesConnectionAggregateInput>;
  /** Return Organisations where all of the related OrganisationUsedCapabilitiesConnections match this filter */
  all?: InputMaybe<OrganisationUsedCapabilitiesConnectionWhere>;
  /** Return Organisations where none of the related OrganisationUsedCapabilitiesConnections match this filter */
  none?: InputMaybe<OrganisationUsedCapabilitiesConnectionWhere>;
  /** Return Organisations where one of the related OrganisationUsedCapabilitiesConnections match this filter */
  single?: InputMaybe<OrganisationUsedCapabilitiesConnectionWhere>;
  /** Return Organisations where some of the related OrganisationUsedCapabilitiesConnections match this filter */
  some?: InputMaybe<OrganisationUsedCapabilitiesConnectionWhere>;
};

export type OrganisationUsedCapabilitiesConnectionSort = {
  node?: InputMaybe<BusinessCapabilitySort>;
};

export type OrganisationUsedCapabilitiesConnectionWhere = {
  AND?: InputMaybe<Array<OrganisationUsedCapabilitiesConnectionWhere>>;
  NOT?: InputMaybe<OrganisationUsedCapabilitiesConnectionWhere>;
  OR?: InputMaybe<Array<OrganisationUsedCapabilitiesConnectionWhere>>;
  node?: InputMaybe<BusinessCapabilityWhere>;
};

export type OrganisationUsedCapabilitiesCreateFieldInput = {
  node: BusinessCapabilityCreateInput;
};

export type OrganisationUsedCapabilitiesDeleteFieldInput = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<OrganisationUsedCapabilitiesConnectionWhere>;
};

export type OrganisationUsedCapabilitiesDisconnectFieldInput = {
  disconnect?: InputMaybe<BusinessCapabilityDisconnectInput>;
  where?: InputMaybe<OrganisationUsedCapabilitiesConnectionWhere>;
};

export type OrganisationUsedCapabilitiesFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedCapabilitiesCreateFieldInput>>;
};

export type OrganisationUsedCapabilitiesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<OrganisationUsedCapabilitiesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<OrganisationUsedCapabilitiesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<OrganisationUsedCapabilitiesNodeAggregationWhereInput>>;
  businessValue?: InputMaybe<IntScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  maturityLevel?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  sequenceNumber?: InputMaybe<IntScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type OrganisationUsedCapabilitiesRelationship = {
  __typename?: 'OrganisationUsedCapabilitiesRelationship';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type OrganisationUsedCapabilitiesUpdateConnectionInput = {
  node?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<OrganisationUsedCapabilitiesConnectionWhere>;
};

export type OrganisationUsedCapabilitiesUpdateFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedCapabilitiesCreateFieldInput>>;
  delete?: InputMaybe<Array<OrganisationUsedCapabilitiesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<OrganisationUsedCapabilitiesDisconnectFieldInput>>;
  update?: InputMaybe<OrganisationUsedCapabilitiesUpdateConnectionInput>;
};

export type OrganisationUsedDataObjectsAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedDataObjectsAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedDataObjectsAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedDataObjectsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<OrganisationUsedDataObjectsNodeAggregationWhereInput>;
};

export type OrganisationUsedDataObjectsConnectFieldInput = {
  connect?: InputMaybe<Array<DataObjectConnectInput>>;
  where?: InputMaybe<DataObjectConnectWhere>;
};

export type OrganisationUsedDataObjectsConnection = {
  __typename?: 'OrganisationUsedDataObjectsConnection';
  aggregate: OrganisationDataObjectUsedDataObjectsAggregateSelection;
  edges: Array<OrganisationUsedDataObjectsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type OrganisationUsedDataObjectsConnectionAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedDataObjectsConnectionAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedDataObjectsConnectionAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedDataObjectsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<OrganisationUsedDataObjectsNodeAggregationWhereInput>;
};

export type OrganisationUsedDataObjectsConnectionFilters = {
  /** Filter Organisations by aggregating results on related OrganisationUsedDataObjectsConnections */
  aggregate?: InputMaybe<OrganisationUsedDataObjectsConnectionAggregateInput>;
  /** Return Organisations where all of the related OrganisationUsedDataObjectsConnections match this filter */
  all?: InputMaybe<OrganisationUsedDataObjectsConnectionWhere>;
  /** Return Organisations where none of the related OrganisationUsedDataObjectsConnections match this filter */
  none?: InputMaybe<OrganisationUsedDataObjectsConnectionWhere>;
  /** Return Organisations where one of the related OrganisationUsedDataObjectsConnections match this filter */
  single?: InputMaybe<OrganisationUsedDataObjectsConnectionWhere>;
  /** Return Organisations where some of the related OrganisationUsedDataObjectsConnections match this filter */
  some?: InputMaybe<OrganisationUsedDataObjectsConnectionWhere>;
};

export type OrganisationUsedDataObjectsConnectionSort = {
  node?: InputMaybe<DataObjectSort>;
};

export type OrganisationUsedDataObjectsConnectionWhere = {
  AND?: InputMaybe<Array<OrganisationUsedDataObjectsConnectionWhere>>;
  NOT?: InputMaybe<OrganisationUsedDataObjectsConnectionWhere>;
  OR?: InputMaybe<Array<OrganisationUsedDataObjectsConnectionWhere>>;
  node?: InputMaybe<DataObjectWhere>;
};

export type OrganisationUsedDataObjectsCreateFieldInput = {
  node: DataObjectCreateInput;
};

export type OrganisationUsedDataObjectsDeleteFieldInput = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<OrganisationUsedDataObjectsConnectionWhere>;
};

export type OrganisationUsedDataObjectsDisconnectFieldInput = {
  disconnect?: InputMaybe<DataObjectDisconnectInput>;
  where?: InputMaybe<OrganisationUsedDataObjectsConnectionWhere>;
};

export type OrganisationUsedDataObjectsFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedDataObjectsCreateFieldInput>>;
};

export type OrganisationUsedDataObjectsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<OrganisationUsedDataObjectsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<OrganisationUsedDataObjectsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<OrganisationUsedDataObjectsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  format?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type OrganisationUsedDataObjectsRelationship = {
  __typename?: 'OrganisationUsedDataObjectsRelationship';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type OrganisationUsedDataObjectsUpdateConnectionInput = {
  node?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<OrganisationUsedDataObjectsConnectionWhere>;
};

export type OrganisationUsedDataObjectsUpdateFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedDataObjectsCreateFieldInput>>;
  delete?: InputMaybe<Array<OrganisationUsedDataObjectsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<OrganisationUsedDataObjectsDisconnectFieldInput>>;
  update?: InputMaybe<OrganisationUsedDataObjectsUpdateConnectionInput>;
};

export type OrganisationUsedInfrastructureAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedInfrastructureAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedInfrastructureAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedInfrastructureAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<OrganisationUsedInfrastructureNodeAggregationWhereInput>;
};

export type OrganisationUsedInfrastructureConnectFieldInput = {
  connect?: InputMaybe<Array<InfrastructureConnectInput>>;
  where?: InputMaybe<InfrastructureConnectWhere>;
};

export type OrganisationUsedInfrastructureConnection = {
  __typename?: 'OrganisationUsedInfrastructureConnection';
  aggregate: OrganisationInfrastructureUsedInfrastructureAggregateSelection;
  edges: Array<OrganisationUsedInfrastructureRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type OrganisationUsedInfrastructureConnectionAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedInfrastructureConnectionAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedInfrastructureConnectionAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedInfrastructureConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<OrganisationUsedInfrastructureNodeAggregationWhereInput>;
};

export type OrganisationUsedInfrastructureConnectionFilters = {
  /** Filter Organisations by aggregating results on related OrganisationUsedInfrastructureConnections */
  aggregate?: InputMaybe<OrganisationUsedInfrastructureConnectionAggregateInput>;
  /** Return Organisations where all of the related OrganisationUsedInfrastructureConnections match this filter */
  all?: InputMaybe<OrganisationUsedInfrastructureConnectionWhere>;
  /** Return Organisations where none of the related OrganisationUsedInfrastructureConnections match this filter */
  none?: InputMaybe<OrganisationUsedInfrastructureConnectionWhere>;
  /** Return Organisations where one of the related OrganisationUsedInfrastructureConnections match this filter */
  single?: InputMaybe<OrganisationUsedInfrastructureConnectionWhere>;
  /** Return Organisations where some of the related OrganisationUsedInfrastructureConnections match this filter */
  some?: InputMaybe<OrganisationUsedInfrastructureConnectionWhere>;
};

export type OrganisationUsedInfrastructureConnectionSort = {
  node?: InputMaybe<InfrastructureSort>;
};

export type OrganisationUsedInfrastructureConnectionWhere = {
  AND?: InputMaybe<Array<OrganisationUsedInfrastructureConnectionWhere>>;
  NOT?: InputMaybe<OrganisationUsedInfrastructureConnectionWhere>;
  OR?: InputMaybe<Array<OrganisationUsedInfrastructureConnectionWhere>>;
  node?: InputMaybe<InfrastructureWhere>;
};

export type OrganisationUsedInfrastructureCreateFieldInput = {
  node: InfrastructureCreateInput;
};

export type OrganisationUsedInfrastructureDeleteFieldInput = {
  delete?: InputMaybe<InfrastructureDeleteInput>;
  where?: InputMaybe<OrganisationUsedInfrastructureConnectionWhere>;
};

export type OrganisationUsedInfrastructureDisconnectFieldInput = {
  disconnect?: InputMaybe<InfrastructureDisconnectInput>;
  where?: InputMaybe<OrganisationUsedInfrastructureConnectionWhere>;
};

export type OrganisationUsedInfrastructureFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedInfrastructureCreateFieldInput>>;
};

export type OrganisationUsedInfrastructureNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<OrganisationUsedInfrastructureNodeAggregationWhereInput>>;
  NOT?: InputMaybe<OrganisationUsedInfrastructureNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<OrganisationUsedInfrastructureNodeAggregationWhereInput>>;
  capacity?: InputMaybe<StringScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  ipAddress?: InputMaybe<StringScalarAggregationFilters>;
  location?: InputMaybe<StringScalarAggregationFilters>;
  maintenanceWindow?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  operatingSystem?: InputMaybe<StringScalarAggregationFilters>;
  specifications?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type OrganisationUsedInfrastructureRelationship = {
  __typename?: 'OrganisationUsedInfrastructureRelationship';
  cursor: Scalars['String']['output'];
  node: Infrastructure;
};

export type OrganisationUsedInfrastructureUpdateConnectionInput = {
  node?: InputMaybe<InfrastructureUpdateInput>;
  where?: InputMaybe<OrganisationUsedInfrastructureConnectionWhere>;
};

export type OrganisationUsedInfrastructureUpdateFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedInfrastructureCreateFieldInput>>;
  delete?: InputMaybe<Array<OrganisationUsedInfrastructureDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<OrganisationUsedInfrastructureDisconnectFieldInput>>;
  update?: InputMaybe<OrganisationUsedInfrastructureUpdateConnectionInput>;
};

export type OrganisationUsedInterfacesAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedInterfacesAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedInterfacesAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedInterfacesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<OrganisationUsedInterfacesNodeAggregationWhereInput>;
};

export type OrganisationUsedInterfacesConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type OrganisationUsedInterfacesConnection = {
  __typename?: 'OrganisationUsedInterfacesConnection';
  aggregate: OrganisationApplicationInterfaceUsedInterfacesAggregateSelection;
  edges: Array<OrganisationUsedInterfacesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type OrganisationUsedInterfacesConnectionAggregateInput = {
  AND?: InputMaybe<Array<OrganisationUsedInterfacesConnectionAggregateInput>>;
  NOT?: InputMaybe<OrganisationUsedInterfacesConnectionAggregateInput>;
  OR?: InputMaybe<Array<OrganisationUsedInterfacesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<OrganisationUsedInterfacesNodeAggregationWhereInput>;
};

export type OrganisationUsedInterfacesConnectionFilters = {
  /** Filter Organisations by aggregating results on related OrganisationUsedInterfacesConnections */
  aggregate?: InputMaybe<OrganisationUsedInterfacesConnectionAggregateInput>;
  /** Return Organisations where all of the related OrganisationUsedInterfacesConnections match this filter */
  all?: InputMaybe<OrganisationUsedInterfacesConnectionWhere>;
  /** Return Organisations where none of the related OrganisationUsedInterfacesConnections match this filter */
  none?: InputMaybe<OrganisationUsedInterfacesConnectionWhere>;
  /** Return Organisations where one of the related OrganisationUsedInterfacesConnections match this filter */
  single?: InputMaybe<OrganisationUsedInterfacesConnectionWhere>;
  /** Return Organisations where some of the related OrganisationUsedInterfacesConnections match this filter */
  some?: InputMaybe<OrganisationUsedInterfacesConnectionWhere>;
};

export type OrganisationUsedInterfacesConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type OrganisationUsedInterfacesConnectionWhere = {
  AND?: InputMaybe<Array<OrganisationUsedInterfacesConnectionWhere>>;
  NOT?: InputMaybe<OrganisationUsedInterfacesConnectionWhere>;
  OR?: InputMaybe<Array<OrganisationUsedInterfacesConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type OrganisationUsedInterfacesCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type OrganisationUsedInterfacesDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<OrganisationUsedInterfacesConnectionWhere>;
};

export type OrganisationUsedInterfacesDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<OrganisationUsedInterfacesConnectionWhere>;
};

export type OrganisationUsedInterfacesFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedInterfacesCreateFieldInput>>;
};

export type OrganisationUsedInterfacesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<OrganisationUsedInterfacesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<OrganisationUsedInterfacesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<OrganisationUsedInterfacesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type OrganisationUsedInterfacesRelationship = {
  __typename?: 'OrganisationUsedInterfacesRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type OrganisationUsedInterfacesUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<OrganisationUsedInterfacesConnectionWhere>;
};

export type OrganisationUsedInterfacesUpdateFieldInput = {
  connect?: InputMaybe<Array<OrganisationUsedInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<OrganisationUsedInterfacesCreateFieldInput>>;
  delete?: InputMaybe<Array<OrganisationUsedInterfacesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<OrganisationUsedInterfacesDisconnectFieldInput>>;
  update?: InputMaybe<OrganisationUsedInterfacesUpdateConnectionInput>;
};

export type OrganisationWhere = {
  AND?: InputMaybe<Array<OrganisationWhere>>;
  NOT?: InputMaybe<OrganisationWhere>;
  OR?: InputMaybe<Array<OrganisationWhere>>;
  childOrganisations?: InputMaybe<OrganisationRelationshipFilters>;
  childOrganisationsConnection?: InputMaybe<OrganisationChildOrganisationsConnectionFilters>;
  company?: InputMaybe<CompanyRelationshipFilters>;
  companyConnection?: InputMaybe<OrganisationCompanyConnectionFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  description?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  level?: InputMaybe<IntScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  parentOrganisation?: InputMaybe<OrganisationRelationshipFilters>;
  parentOrganisationConnection?: InputMaybe<OrganisationParentOrganisationConnectionFilters>;
  type?: InputMaybe<OrganisationTypeEnumScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
  usedAIAssets?: InputMaybe<AiAssetRelationshipFilters>;
  usedAIAssetsConnection?: InputMaybe<OrganisationUsedAiAssetsConnectionFilters>;
  usedApplications?: InputMaybe<ApplicationRelationshipFilters>;
  usedApplicationsConnection?: InputMaybe<OrganisationUsedApplicationsConnectionFilters>;
  usedCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  usedCapabilitiesConnection?: InputMaybe<OrganisationUsedCapabilitiesConnectionFilters>;
  usedDataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  usedDataObjectsConnection?: InputMaybe<OrganisationUsedDataObjectsConnectionFilters>;
  usedInfrastructure?: InputMaybe<InfrastructureRelationshipFilters>;
  usedInfrastructureConnection?: InputMaybe<OrganisationUsedInfrastructureConnectionFilters>;
  usedInterfaces?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  usedInterfacesConnection?: InputMaybe<OrganisationUsedInterfacesConnectionFilters>;
};

export type OrganisationsConnection = {
  __typename?: 'OrganisationsConnection';
  aggregate: OrganisationAggregate;
  edges: Array<OrganisationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Pagination information (Relay) */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PeopleConnection = {
  __typename?: 'PeopleConnection';
  aggregate: PersonAggregate;
  edges: Array<PersonEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Person - repräsentiert eine Person im Unternehmen */
export type Person = {
  __typename?: 'Person';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  department?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  ownedAIAssets: Array<AiAsset>;
  ownedAIAssetsConnection: PersonOwnedAiAssetsConnection;
  ownedApplications: Array<Application>;
  ownedApplicationsConnection: PersonOwnedApplicationsConnection;
  ownedArchitectures: Array<Architecture>;
  ownedArchitecturesConnection: PersonOwnedArchitecturesConnection;
  ownedCapabilities: Array<BusinessCapability>;
  ownedCapabilitiesConnection: PersonOwnedCapabilitiesConnection;
  ownedDataObjects: Array<DataObject>;
  ownedDataObjectsConnection: PersonOwnedDataObjectsConnection;
  ownedDiagrams: Array<Diagram>;
  ownedDiagramsConnection: PersonOwnedDiagramsConnection;
  ownedInfrastructure: Array<Infrastructure>;
  ownedInfrastructureConnection: PersonOwnedInfrastructureConnection;
  ownedInterfaces: Array<ApplicationInterface>;
  ownedInterfacesConnection: PersonOwnedInterfacesConnection;
  phone?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedAiAssetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedAiAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonOwnedAiAssetsConnectionSort>>;
  where?: InputMaybe<PersonOwnedAiAssetsConnectionWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonOwnedApplicationsConnectionSort>>;
  where?: InputMaybe<PersonOwnedApplicationsConnectionWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedArchitecturesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedArchitecturesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonOwnedArchitecturesConnectionSort>>;
  where?: InputMaybe<PersonOwnedArchitecturesConnectionWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedCapabilitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedCapabilitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonOwnedCapabilitiesConnectionSort>>;
  where?: InputMaybe<PersonOwnedCapabilitiesConnectionWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonOwnedDataObjectsConnectionSort>>;
  where?: InputMaybe<PersonOwnedDataObjectsConnectionWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedDiagramsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramSort>>;
  where?: InputMaybe<DiagramWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedDiagramsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonOwnedDiagramsConnectionSort>>;
  where?: InputMaybe<PersonOwnedDiagramsConnectionWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedInfrastructureArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedInfrastructureConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonOwnedInfrastructureConnectionSort>>;
  where?: InputMaybe<PersonOwnedInfrastructureConnectionWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedInterfacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** Person - repräsentiert eine Person im Unternehmen */
export type PersonOwnedInterfacesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonOwnedInterfacesConnectionSort>>;
  where?: InputMaybe<PersonOwnedInterfacesConnectionWhere>;
};

export type PersonAiAssetOwnedAiAssetsAggregateSelection = {
  __typename?: 'PersonAIAssetOwnedAIAssetsAggregateSelection';
  count: CountConnection;
  node?: Maybe<PersonAiAssetOwnedAiAssetsNodeAggregateSelection>;
};

export type PersonAiAssetOwnedAiAssetsNodeAggregateSelection = {
  __typename?: 'PersonAIAssetOwnedAIAssetsNodeAggregateSelection';
  accuracy: FloatAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  license: StringAggregateSelection;
  model: StringAggregateSelection;
  name: StringAggregateSelection;
  provider: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type PersonAggregate = {
  __typename?: 'PersonAggregate';
  count: Count;
  node: PersonAggregateNode;
};

export type PersonAggregateNode = {
  __typename?: 'PersonAggregateNode';
  avatarUrl: StringAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type PersonApplicationInterfaceOwnedInterfacesAggregateSelection = {
  __typename?: 'PersonApplicationInterfaceOwnedInterfacesAggregateSelection';
  count: CountConnection;
  node?: Maybe<PersonApplicationInterfaceOwnedInterfacesNodeAggregateSelection>;
};

export type PersonApplicationInterfaceOwnedInterfacesNodeAggregateSelection = {
  __typename?: 'PersonApplicationInterfaceOwnedInterfacesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  version: StringAggregateSelection;
};

export type PersonApplicationOwnedApplicationsAggregateSelection = {
  __typename?: 'PersonApplicationOwnedApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<PersonApplicationOwnedApplicationsNodeAggregateSelection>;
};

export type PersonApplicationOwnedApplicationsNodeAggregateSelection = {
  __typename?: 'PersonApplicationOwnedApplicationsNodeAggregateSelection';
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  hostingEnvironment: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type PersonArchitectureOwnedArchitecturesAggregateSelection = {
  __typename?: 'PersonArchitectureOwnedArchitecturesAggregateSelection';
  count: CountConnection;
  node?: Maybe<PersonArchitectureOwnedArchitecturesNodeAggregateSelection>;
};

export type PersonArchitectureOwnedArchitecturesNodeAggregateSelection = {
  __typename?: 'PersonArchitectureOwnedArchitecturesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  timestamp: DateTimeAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type PersonBusinessCapabilityOwnedCapabilitiesAggregateSelection = {
  __typename?: 'PersonBusinessCapabilityOwnedCapabilitiesAggregateSelection';
  count: CountConnection;
  node?: Maybe<PersonBusinessCapabilityOwnedCapabilitiesNodeAggregateSelection>;
};

export type PersonBusinessCapabilityOwnedCapabilitiesNodeAggregateSelection = {
  __typename?: 'PersonBusinessCapabilityOwnedCapabilitiesNodeAggregateSelection';
  businessValue: IntAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  maturityLevel: IntAggregateSelection;
  name: StringAggregateSelection;
  sequenceNumber: IntAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type PersonConnectInput = {
  ownedAIAssets?: InputMaybe<Array<PersonOwnedAiAssetsConnectFieldInput>>;
  ownedApplications?: InputMaybe<Array<PersonOwnedApplicationsConnectFieldInput>>;
  ownedArchitectures?: InputMaybe<Array<PersonOwnedArchitecturesConnectFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesConnectFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsConnectFieldInput>>;
  ownedDiagrams?: InputMaybe<Array<PersonOwnedDiagramsConnectFieldInput>>;
  ownedInfrastructure?: InputMaybe<Array<PersonOwnedInfrastructureConnectFieldInput>>;
  ownedInterfaces?: InputMaybe<Array<PersonOwnedInterfacesConnectFieldInput>>;
};

export type PersonConnectWhere = {
  node: PersonWhere;
};

export type PersonCreateInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  ownedAIAssets?: InputMaybe<PersonOwnedAiAssetsFieldInput>;
  ownedApplications?: InputMaybe<PersonOwnedApplicationsFieldInput>;
  ownedArchitectures?: InputMaybe<PersonOwnedArchitecturesFieldInput>;
  ownedCapabilities?: InputMaybe<PersonOwnedCapabilitiesFieldInput>;
  ownedDataObjects?: InputMaybe<PersonOwnedDataObjectsFieldInput>;
  ownedDiagrams?: InputMaybe<PersonOwnedDiagramsFieldInput>;
  ownedInfrastructure?: InputMaybe<PersonOwnedInfrastructureFieldInput>;
  ownedInterfaces?: InputMaybe<PersonOwnedInterfacesFieldInput>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type PersonDataObjectOwnedDataObjectsAggregateSelection = {
  __typename?: 'PersonDataObjectOwnedDataObjectsAggregateSelection';
  count: CountConnection;
  node?: Maybe<PersonDataObjectOwnedDataObjectsNodeAggregateSelection>;
};

export type PersonDataObjectOwnedDataObjectsNodeAggregateSelection = {
  __typename?: 'PersonDataObjectOwnedDataObjectsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  format: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type PersonDeleteInput = {
  ownedAIAssets?: InputMaybe<Array<PersonOwnedAiAssetsDeleteFieldInput>>;
  ownedApplications?: InputMaybe<Array<PersonOwnedApplicationsDeleteFieldInput>>;
  ownedArchitectures?: InputMaybe<Array<PersonOwnedArchitecturesDeleteFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesDeleteFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsDeleteFieldInput>>;
  ownedDiagrams?: InputMaybe<Array<PersonOwnedDiagramsDeleteFieldInput>>;
  ownedInfrastructure?: InputMaybe<Array<PersonOwnedInfrastructureDeleteFieldInput>>;
  ownedInterfaces?: InputMaybe<Array<PersonOwnedInterfacesDeleteFieldInput>>;
};

export type PersonDiagramOwnedDiagramsAggregateSelection = {
  __typename?: 'PersonDiagramOwnedDiagramsAggregateSelection';
  count: CountConnection;
  node?: Maybe<PersonDiagramOwnedDiagramsNodeAggregateSelection>;
};

export type PersonDiagramOwnedDiagramsNodeAggregateSelection = {
  __typename?: 'PersonDiagramOwnedDiagramsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  diagramJson: StringAggregateSelection;
  diagramPng: StringAggregateSelection;
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type PersonDisconnectInput = {
  ownedAIAssets?: InputMaybe<Array<PersonOwnedAiAssetsDisconnectFieldInput>>;
  ownedApplications?: InputMaybe<Array<PersonOwnedApplicationsDisconnectFieldInput>>;
  ownedArchitectures?: InputMaybe<Array<PersonOwnedArchitecturesDisconnectFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesDisconnectFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsDisconnectFieldInput>>;
  ownedDiagrams?: InputMaybe<Array<PersonOwnedDiagramsDisconnectFieldInput>>;
  ownedInfrastructure?: InputMaybe<Array<PersonOwnedInfrastructureDisconnectFieldInput>>;
  ownedInterfaces?: InputMaybe<Array<PersonOwnedInterfacesDisconnectFieldInput>>;
};

export type PersonEdge = {
  __typename?: 'PersonEdge';
  cursor: Scalars['String']['output'];
  node: Person;
};

export type PersonInfrastructureOwnedInfrastructureAggregateSelection = {
  __typename?: 'PersonInfrastructureOwnedInfrastructureAggregateSelection';
  count: CountConnection;
  node?: Maybe<PersonInfrastructureOwnedInfrastructureNodeAggregateSelection>;
};

export type PersonInfrastructureOwnedInfrastructureNodeAggregateSelection = {
  __typename?: 'PersonInfrastructureOwnedInfrastructureNodeAggregateSelection';
  capacity: StringAggregateSelection;
  costs: FloatAggregateSelection;
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  ipAddress: StringAggregateSelection;
  location: StringAggregateSelection;
  maintenanceWindow: StringAggregateSelection;
  name: StringAggregateSelection;
  operatingSystem: StringAggregateSelection;
  specifications: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
  vendor: StringAggregateSelection;
  version: StringAggregateSelection;
};

export type PersonOwnedAiAssetsAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedAiAssetsAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedAiAssetsAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedAiAssetsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<PersonOwnedAiAssetsNodeAggregationWhereInput>;
};

export type PersonOwnedAiAssetsConnectFieldInput = {
  connect?: InputMaybe<Array<AiAssetConnectInput>>;
  where?: InputMaybe<AiAssetConnectWhere>;
};

export type PersonOwnedAiAssetsConnection = {
  __typename?: 'PersonOwnedAIAssetsConnection';
  aggregate: PersonAiAssetOwnedAiAssetsAggregateSelection;
  edges: Array<PersonOwnedAiAssetsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PersonOwnedAiAssetsConnectionAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedAiAssetsConnectionAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedAiAssetsConnectionAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedAiAssetsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<PersonOwnedAiAssetsNodeAggregationWhereInput>;
};

export type PersonOwnedAiAssetsConnectionFilters = {
  /** Filter People by aggregating results on related PersonOwnedAIAssetsConnections */
  aggregate?: InputMaybe<PersonOwnedAiAssetsConnectionAggregateInput>;
  /** Return People where all of the related PersonOwnedAIAssetsConnections match this filter */
  all?: InputMaybe<PersonOwnedAiAssetsConnectionWhere>;
  /** Return People where none of the related PersonOwnedAIAssetsConnections match this filter */
  none?: InputMaybe<PersonOwnedAiAssetsConnectionWhere>;
  /** Return People where one of the related PersonOwnedAIAssetsConnections match this filter */
  single?: InputMaybe<PersonOwnedAiAssetsConnectionWhere>;
  /** Return People where some of the related PersonOwnedAIAssetsConnections match this filter */
  some?: InputMaybe<PersonOwnedAiAssetsConnectionWhere>;
};

export type PersonOwnedAiAssetsConnectionSort = {
  node?: InputMaybe<AiAssetSort>;
};

export type PersonOwnedAiAssetsConnectionWhere = {
  AND?: InputMaybe<Array<PersonOwnedAiAssetsConnectionWhere>>;
  NOT?: InputMaybe<PersonOwnedAiAssetsConnectionWhere>;
  OR?: InputMaybe<Array<PersonOwnedAiAssetsConnectionWhere>>;
  node?: InputMaybe<AiAssetWhere>;
};

export type PersonOwnedAiAssetsCreateFieldInput = {
  node: AiAssetCreateInput;
};

export type PersonOwnedAiAssetsDeleteFieldInput = {
  delete?: InputMaybe<AiAssetDeleteInput>;
  where?: InputMaybe<PersonOwnedAiAssetsConnectionWhere>;
};

export type PersonOwnedAiAssetsDisconnectFieldInput = {
  disconnect?: InputMaybe<AiAssetDisconnectInput>;
  where?: InputMaybe<PersonOwnedAiAssetsConnectionWhere>;
};

export type PersonOwnedAiAssetsFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedAiAssetsCreateFieldInput>>;
};

export type PersonOwnedAiAssetsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<PersonOwnedAiAssetsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<PersonOwnedAiAssetsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<PersonOwnedAiAssetsNodeAggregationWhereInput>>;
  accuracy?: InputMaybe<FloatScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  license?: InputMaybe<StringScalarAggregationFilters>;
  model?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  provider?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type PersonOwnedAiAssetsRelationship = {
  __typename?: 'PersonOwnedAIAssetsRelationship';
  cursor: Scalars['String']['output'];
  node: AiAsset;
};

export type PersonOwnedAiAssetsUpdateConnectionInput = {
  node?: InputMaybe<AiAssetUpdateInput>;
  where?: InputMaybe<PersonOwnedAiAssetsConnectionWhere>;
};

export type PersonOwnedAiAssetsUpdateFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedAiAssetsConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedAiAssetsCreateFieldInput>>;
  delete?: InputMaybe<Array<PersonOwnedAiAssetsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<PersonOwnedAiAssetsDisconnectFieldInput>>;
  update?: InputMaybe<PersonOwnedAiAssetsUpdateConnectionInput>;
};

export type PersonOwnedApplicationsAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedApplicationsAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedApplicationsAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<PersonOwnedApplicationsNodeAggregationWhereInput>;
};

export type PersonOwnedApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationConnectInput>>;
  where?: InputMaybe<ApplicationConnectWhere>;
};

export type PersonOwnedApplicationsConnection = {
  __typename?: 'PersonOwnedApplicationsConnection';
  aggregate: PersonApplicationOwnedApplicationsAggregateSelection;
  edges: Array<PersonOwnedApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PersonOwnedApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<PersonOwnedApplicationsNodeAggregationWhereInput>;
};

export type PersonOwnedApplicationsConnectionFilters = {
  /** Filter People by aggregating results on related PersonOwnedApplicationsConnections */
  aggregate?: InputMaybe<PersonOwnedApplicationsConnectionAggregateInput>;
  /** Return People where all of the related PersonOwnedApplicationsConnections match this filter */
  all?: InputMaybe<PersonOwnedApplicationsConnectionWhere>;
  /** Return People where none of the related PersonOwnedApplicationsConnections match this filter */
  none?: InputMaybe<PersonOwnedApplicationsConnectionWhere>;
  /** Return People where one of the related PersonOwnedApplicationsConnections match this filter */
  single?: InputMaybe<PersonOwnedApplicationsConnectionWhere>;
  /** Return People where some of the related PersonOwnedApplicationsConnections match this filter */
  some?: InputMaybe<PersonOwnedApplicationsConnectionWhere>;
};

export type PersonOwnedApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationSort>;
};

export type PersonOwnedApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<PersonOwnedApplicationsConnectionWhere>>;
  NOT?: InputMaybe<PersonOwnedApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<PersonOwnedApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationWhere>;
};

export type PersonOwnedApplicationsCreateFieldInput = {
  node: ApplicationCreateInput;
};

export type PersonOwnedApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<PersonOwnedApplicationsConnectionWhere>;
};

export type PersonOwnedApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationDisconnectInput>;
  where?: InputMaybe<PersonOwnedApplicationsConnectionWhere>;
};

export type PersonOwnedApplicationsFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedApplicationsCreateFieldInput>>;
};

export type PersonOwnedApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<PersonOwnedApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<PersonOwnedApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<PersonOwnedApplicationsNodeAggregationWhereInput>>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  hostingEnvironment?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type PersonOwnedApplicationsRelationship = {
  __typename?: 'PersonOwnedApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: Application;
};

export type PersonOwnedApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<PersonOwnedApplicationsConnectionWhere>;
};

export type PersonOwnedApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<PersonOwnedApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<PersonOwnedApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<PersonOwnedApplicationsUpdateConnectionInput>;
};

export type PersonOwnedArchitecturesAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedArchitecturesAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedArchitecturesAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedArchitecturesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<PersonOwnedArchitecturesNodeAggregationWhereInput>;
};

export type PersonOwnedArchitecturesConnectFieldInput = {
  connect?: InputMaybe<Array<ArchitectureConnectInput>>;
  where?: InputMaybe<ArchitectureConnectWhere>;
};

export type PersonOwnedArchitecturesConnection = {
  __typename?: 'PersonOwnedArchitecturesConnection';
  aggregate: PersonArchitectureOwnedArchitecturesAggregateSelection;
  edges: Array<PersonOwnedArchitecturesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PersonOwnedArchitecturesConnectionAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedArchitecturesConnectionAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedArchitecturesConnectionAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedArchitecturesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<PersonOwnedArchitecturesNodeAggregationWhereInput>;
};

export type PersonOwnedArchitecturesConnectionFilters = {
  /** Filter People by aggregating results on related PersonOwnedArchitecturesConnections */
  aggregate?: InputMaybe<PersonOwnedArchitecturesConnectionAggregateInput>;
  /** Return People where all of the related PersonOwnedArchitecturesConnections match this filter */
  all?: InputMaybe<PersonOwnedArchitecturesConnectionWhere>;
  /** Return People where none of the related PersonOwnedArchitecturesConnections match this filter */
  none?: InputMaybe<PersonOwnedArchitecturesConnectionWhere>;
  /** Return People where one of the related PersonOwnedArchitecturesConnections match this filter */
  single?: InputMaybe<PersonOwnedArchitecturesConnectionWhere>;
  /** Return People where some of the related PersonOwnedArchitecturesConnections match this filter */
  some?: InputMaybe<PersonOwnedArchitecturesConnectionWhere>;
};

export type PersonOwnedArchitecturesConnectionSort = {
  node?: InputMaybe<ArchitectureSort>;
};

export type PersonOwnedArchitecturesConnectionWhere = {
  AND?: InputMaybe<Array<PersonOwnedArchitecturesConnectionWhere>>;
  NOT?: InputMaybe<PersonOwnedArchitecturesConnectionWhere>;
  OR?: InputMaybe<Array<PersonOwnedArchitecturesConnectionWhere>>;
  node?: InputMaybe<ArchitectureWhere>;
};

export type PersonOwnedArchitecturesCreateFieldInput = {
  node: ArchitectureCreateInput;
};

export type PersonOwnedArchitecturesDeleteFieldInput = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<PersonOwnedArchitecturesConnectionWhere>;
};

export type PersonOwnedArchitecturesDisconnectFieldInput = {
  disconnect?: InputMaybe<ArchitectureDisconnectInput>;
  where?: InputMaybe<PersonOwnedArchitecturesConnectionWhere>;
};

export type PersonOwnedArchitecturesFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedArchitecturesCreateFieldInput>>;
};

export type PersonOwnedArchitecturesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<PersonOwnedArchitecturesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<PersonOwnedArchitecturesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<PersonOwnedArchitecturesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  timestamp?: InputMaybe<DateTimeScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type PersonOwnedArchitecturesRelationship = {
  __typename?: 'PersonOwnedArchitecturesRelationship';
  cursor: Scalars['String']['output'];
  node: Architecture;
};

export type PersonOwnedArchitecturesUpdateConnectionInput = {
  node?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<PersonOwnedArchitecturesConnectionWhere>;
};

export type PersonOwnedArchitecturesUpdateFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedArchitecturesConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedArchitecturesCreateFieldInput>>;
  delete?: InputMaybe<Array<PersonOwnedArchitecturesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<PersonOwnedArchitecturesDisconnectFieldInput>>;
  update?: InputMaybe<PersonOwnedArchitecturesUpdateConnectionInput>;
};

export type PersonOwnedCapabilitiesAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedCapabilitiesAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedCapabilitiesAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedCapabilitiesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<PersonOwnedCapabilitiesNodeAggregationWhereInput>;
};

export type PersonOwnedCapabilitiesConnectFieldInput = {
  connect?: InputMaybe<Array<BusinessCapabilityConnectInput>>;
  where?: InputMaybe<BusinessCapabilityConnectWhere>;
};

export type PersonOwnedCapabilitiesConnection = {
  __typename?: 'PersonOwnedCapabilitiesConnection';
  aggregate: PersonBusinessCapabilityOwnedCapabilitiesAggregateSelection;
  edges: Array<PersonOwnedCapabilitiesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PersonOwnedCapabilitiesConnectionAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedCapabilitiesConnectionAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedCapabilitiesConnectionAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedCapabilitiesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<PersonOwnedCapabilitiesNodeAggregationWhereInput>;
};

export type PersonOwnedCapabilitiesConnectionFilters = {
  /** Filter People by aggregating results on related PersonOwnedCapabilitiesConnections */
  aggregate?: InputMaybe<PersonOwnedCapabilitiesConnectionAggregateInput>;
  /** Return People where all of the related PersonOwnedCapabilitiesConnections match this filter */
  all?: InputMaybe<PersonOwnedCapabilitiesConnectionWhere>;
  /** Return People where none of the related PersonOwnedCapabilitiesConnections match this filter */
  none?: InputMaybe<PersonOwnedCapabilitiesConnectionWhere>;
  /** Return People where one of the related PersonOwnedCapabilitiesConnections match this filter */
  single?: InputMaybe<PersonOwnedCapabilitiesConnectionWhere>;
  /** Return People where some of the related PersonOwnedCapabilitiesConnections match this filter */
  some?: InputMaybe<PersonOwnedCapabilitiesConnectionWhere>;
};

export type PersonOwnedCapabilitiesConnectionSort = {
  node?: InputMaybe<BusinessCapabilitySort>;
};

export type PersonOwnedCapabilitiesConnectionWhere = {
  AND?: InputMaybe<Array<PersonOwnedCapabilitiesConnectionWhere>>;
  NOT?: InputMaybe<PersonOwnedCapabilitiesConnectionWhere>;
  OR?: InputMaybe<Array<PersonOwnedCapabilitiesConnectionWhere>>;
  node?: InputMaybe<BusinessCapabilityWhere>;
};

export type PersonOwnedCapabilitiesCreateFieldInput = {
  node: BusinessCapabilityCreateInput;
};

export type PersonOwnedCapabilitiesDeleteFieldInput = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<PersonOwnedCapabilitiesConnectionWhere>;
};

export type PersonOwnedCapabilitiesDisconnectFieldInput = {
  disconnect?: InputMaybe<BusinessCapabilityDisconnectInput>;
  where?: InputMaybe<PersonOwnedCapabilitiesConnectionWhere>;
};

export type PersonOwnedCapabilitiesFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedCapabilitiesCreateFieldInput>>;
};

export type PersonOwnedCapabilitiesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<PersonOwnedCapabilitiesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<PersonOwnedCapabilitiesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<PersonOwnedCapabilitiesNodeAggregationWhereInput>>;
  businessValue?: InputMaybe<IntScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  maturityLevel?: InputMaybe<IntScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  sequenceNumber?: InputMaybe<IntScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type PersonOwnedCapabilitiesRelationship = {
  __typename?: 'PersonOwnedCapabilitiesRelationship';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
};

export type PersonOwnedCapabilitiesUpdateConnectionInput = {
  node?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<PersonOwnedCapabilitiesConnectionWhere>;
};

export type PersonOwnedCapabilitiesUpdateFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedCapabilitiesConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedCapabilitiesCreateFieldInput>>;
  delete?: InputMaybe<Array<PersonOwnedCapabilitiesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<PersonOwnedCapabilitiesDisconnectFieldInput>>;
  update?: InputMaybe<PersonOwnedCapabilitiesUpdateConnectionInput>;
};

export type PersonOwnedDataObjectsAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedDataObjectsAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedDataObjectsAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedDataObjectsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<PersonOwnedDataObjectsNodeAggregationWhereInput>;
};

export type PersonOwnedDataObjectsConnectFieldInput = {
  connect?: InputMaybe<Array<DataObjectConnectInput>>;
  where?: InputMaybe<DataObjectConnectWhere>;
};

export type PersonOwnedDataObjectsConnection = {
  __typename?: 'PersonOwnedDataObjectsConnection';
  aggregate: PersonDataObjectOwnedDataObjectsAggregateSelection;
  edges: Array<PersonOwnedDataObjectsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PersonOwnedDataObjectsConnectionAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedDataObjectsConnectionAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedDataObjectsConnectionAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedDataObjectsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<PersonOwnedDataObjectsNodeAggregationWhereInput>;
};

export type PersonOwnedDataObjectsConnectionFilters = {
  /** Filter People by aggregating results on related PersonOwnedDataObjectsConnections */
  aggregate?: InputMaybe<PersonOwnedDataObjectsConnectionAggregateInput>;
  /** Return People where all of the related PersonOwnedDataObjectsConnections match this filter */
  all?: InputMaybe<PersonOwnedDataObjectsConnectionWhere>;
  /** Return People where none of the related PersonOwnedDataObjectsConnections match this filter */
  none?: InputMaybe<PersonOwnedDataObjectsConnectionWhere>;
  /** Return People where one of the related PersonOwnedDataObjectsConnections match this filter */
  single?: InputMaybe<PersonOwnedDataObjectsConnectionWhere>;
  /** Return People where some of the related PersonOwnedDataObjectsConnections match this filter */
  some?: InputMaybe<PersonOwnedDataObjectsConnectionWhere>;
};

export type PersonOwnedDataObjectsConnectionSort = {
  node?: InputMaybe<DataObjectSort>;
};

export type PersonOwnedDataObjectsConnectionWhere = {
  AND?: InputMaybe<Array<PersonOwnedDataObjectsConnectionWhere>>;
  NOT?: InputMaybe<PersonOwnedDataObjectsConnectionWhere>;
  OR?: InputMaybe<Array<PersonOwnedDataObjectsConnectionWhere>>;
  node?: InputMaybe<DataObjectWhere>;
};

export type PersonOwnedDataObjectsCreateFieldInput = {
  node: DataObjectCreateInput;
};

export type PersonOwnedDataObjectsDeleteFieldInput = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<PersonOwnedDataObjectsConnectionWhere>;
};

export type PersonOwnedDataObjectsDisconnectFieldInput = {
  disconnect?: InputMaybe<DataObjectDisconnectInput>;
  where?: InputMaybe<PersonOwnedDataObjectsConnectionWhere>;
};

export type PersonOwnedDataObjectsFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedDataObjectsCreateFieldInput>>;
};

export type PersonOwnedDataObjectsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<PersonOwnedDataObjectsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<PersonOwnedDataObjectsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<PersonOwnedDataObjectsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  format?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type PersonOwnedDataObjectsRelationship = {
  __typename?: 'PersonOwnedDataObjectsRelationship';
  cursor: Scalars['String']['output'];
  node: DataObject;
};

export type PersonOwnedDataObjectsUpdateConnectionInput = {
  node?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<PersonOwnedDataObjectsConnectionWhere>;
};

export type PersonOwnedDataObjectsUpdateFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedDataObjectsConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedDataObjectsCreateFieldInput>>;
  delete?: InputMaybe<Array<PersonOwnedDataObjectsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<PersonOwnedDataObjectsDisconnectFieldInput>>;
  update?: InputMaybe<PersonOwnedDataObjectsUpdateConnectionInput>;
};

export type PersonOwnedDiagramsAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedDiagramsAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedDiagramsAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedDiagramsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<PersonOwnedDiagramsNodeAggregationWhereInput>;
};

export type PersonOwnedDiagramsConnectFieldInput = {
  connect?: InputMaybe<Array<DiagramConnectInput>>;
  where?: InputMaybe<DiagramConnectWhere>;
};

export type PersonOwnedDiagramsConnection = {
  __typename?: 'PersonOwnedDiagramsConnection';
  aggregate: PersonDiagramOwnedDiagramsAggregateSelection;
  edges: Array<PersonOwnedDiagramsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PersonOwnedDiagramsConnectionAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedDiagramsConnectionAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedDiagramsConnectionAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedDiagramsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<PersonOwnedDiagramsNodeAggregationWhereInput>;
};

export type PersonOwnedDiagramsConnectionFilters = {
  /** Filter People by aggregating results on related PersonOwnedDiagramsConnections */
  aggregate?: InputMaybe<PersonOwnedDiagramsConnectionAggregateInput>;
  /** Return People where all of the related PersonOwnedDiagramsConnections match this filter */
  all?: InputMaybe<PersonOwnedDiagramsConnectionWhere>;
  /** Return People where none of the related PersonOwnedDiagramsConnections match this filter */
  none?: InputMaybe<PersonOwnedDiagramsConnectionWhere>;
  /** Return People where one of the related PersonOwnedDiagramsConnections match this filter */
  single?: InputMaybe<PersonOwnedDiagramsConnectionWhere>;
  /** Return People where some of the related PersonOwnedDiagramsConnections match this filter */
  some?: InputMaybe<PersonOwnedDiagramsConnectionWhere>;
};

export type PersonOwnedDiagramsConnectionSort = {
  node?: InputMaybe<DiagramSort>;
};

export type PersonOwnedDiagramsConnectionWhere = {
  AND?: InputMaybe<Array<PersonOwnedDiagramsConnectionWhere>>;
  NOT?: InputMaybe<PersonOwnedDiagramsConnectionWhere>;
  OR?: InputMaybe<Array<PersonOwnedDiagramsConnectionWhere>>;
  node?: InputMaybe<DiagramWhere>;
};

export type PersonOwnedDiagramsCreateFieldInput = {
  node: DiagramCreateInput;
};

export type PersonOwnedDiagramsDeleteFieldInput = {
  delete?: InputMaybe<DiagramDeleteInput>;
  where?: InputMaybe<PersonOwnedDiagramsConnectionWhere>;
};

export type PersonOwnedDiagramsDisconnectFieldInput = {
  disconnect?: InputMaybe<DiagramDisconnectInput>;
  where?: InputMaybe<PersonOwnedDiagramsConnectionWhere>;
};

export type PersonOwnedDiagramsFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedDiagramsCreateFieldInput>>;
};

export type PersonOwnedDiagramsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<PersonOwnedDiagramsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<PersonOwnedDiagramsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<PersonOwnedDiagramsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  diagramJson?: InputMaybe<StringScalarAggregationFilters>;
  diagramPng?: InputMaybe<StringScalarAggregationFilters>;
  title?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type PersonOwnedDiagramsRelationship = {
  __typename?: 'PersonOwnedDiagramsRelationship';
  cursor: Scalars['String']['output'];
  node: Diagram;
};

export type PersonOwnedDiagramsUpdateConnectionInput = {
  node?: InputMaybe<DiagramUpdateInput>;
  where?: InputMaybe<PersonOwnedDiagramsConnectionWhere>;
};

export type PersonOwnedDiagramsUpdateFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedDiagramsConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedDiagramsCreateFieldInput>>;
  delete?: InputMaybe<Array<PersonOwnedDiagramsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<PersonOwnedDiagramsDisconnectFieldInput>>;
  update?: InputMaybe<PersonOwnedDiagramsUpdateConnectionInput>;
};

export type PersonOwnedInfrastructureAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedInfrastructureAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedInfrastructureAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedInfrastructureAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<PersonOwnedInfrastructureNodeAggregationWhereInput>;
};

export type PersonOwnedInfrastructureConnectFieldInput = {
  connect?: InputMaybe<Array<InfrastructureConnectInput>>;
  where?: InputMaybe<InfrastructureConnectWhere>;
};

export type PersonOwnedInfrastructureConnection = {
  __typename?: 'PersonOwnedInfrastructureConnection';
  aggregate: PersonInfrastructureOwnedInfrastructureAggregateSelection;
  edges: Array<PersonOwnedInfrastructureRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PersonOwnedInfrastructureConnectionAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedInfrastructureConnectionAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedInfrastructureConnectionAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedInfrastructureConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<PersonOwnedInfrastructureNodeAggregationWhereInput>;
};

export type PersonOwnedInfrastructureConnectionFilters = {
  /** Filter People by aggregating results on related PersonOwnedInfrastructureConnections */
  aggregate?: InputMaybe<PersonOwnedInfrastructureConnectionAggregateInput>;
  /** Return People where all of the related PersonOwnedInfrastructureConnections match this filter */
  all?: InputMaybe<PersonOwnedInfrastructureConnectionWhere>;
  /** Return People where none of the related PersonOwnedInfrastructureConnections match this filter */
  none?: InputMaybe<PersonOwnedInfrastructureConnectionWhere>;
  /** Return People where one of the related PersonOwnedInfrastructureConnections match this filter */
  single?: InputMaybe<PersonOwnedInfrastructureConnectionWhere>;
  /** Return People where some of the related PersonOwnedInfrastructureConnections match this filter */
  some?: InputMaybe<PersonOwnedInfrastructureConnectionWhere>;
};

export type PersonOwnedInfrastructureConnectionSort = {
  node?: InputMaybe<InfrastructureSort>;
};

export type PersonOwnedInfrastructureConnectionWhere = {
  AND?: InputMaybe<Array<PersonOwnedInfrastructureConnectionWhere>>;
  NOT?: InputMaybe<PersonOwnedInfrastructureConnectionWhere>;
  OR?: InputMaybe<Array<PersonOwnedInfrastructureConnectionWhere>>;
  node?: InputMaybe<InfrastructureWhere>;
};

export type PersonOwnedInfrastructureCreateFieldInput = {
  node: InfrastructureCreateInput;
};

export type PersonOwnedInfrastructureDeleteFieldInput = {
  delete?: InputMaybe<InfrastructureDeleteInput>;
  where?: InputMaybe<PersonOwnedInfrastructureConnectionWhere>;
};

export type PersonOwnedInfrastructureDisconnectFieldInput = {
  disconnect?: InputMaybe<InfrastructureDisconnectInput>;
  where?: InputMaybe<PersonOwnedInfrastructureConnectionWhere>;
};

export type PersonOwnedInfrastructureFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedInfrastructureCreateFieldInput>>;
};

export type PersonOwnedInfrastructureNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<PersonOwnedInfrastructureNodeAggregationWhereInput>>;
  NOT?: InputMaybe<PersonOwnedInfrastructureNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<PersonOwnedInfrastructureNodeAggregationWhereInput>>;
  capacity?: InputMaybe<StringScalarAggregationFilters>;
  costs?: InputMaybe<FloatScalarAggregationFilters>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  ipAddress?: InputMaybe<StringScalarAggregationFilters>;
  location?: InputMaybe<StringScalarAggregationFilters>;
  maintenanceWindow?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  operatingSystem?: InputMaybe<StringScalarAggregationFilters>;
  specifications?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  vendor?: InputMaybe<StringScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type PersonOwnedInfrastructureRelationship = {
  __typename?: 'PersonOwnedInfrastructureRelationship';
  cursor: Scalars['String']['output'];
  node: Infrastructure;
};

export type PersonOwnedInfrastructureUpdateConnectionInput = {
  node?: InputMaybe<InfrastructureUpdateInput>;
  where?: InputMaybe<PersonOwnedInfrastructureConnectionWhere>;
};

export type PersonOwnedInfrastructureUpdateFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedInfrastructureConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedInfrastructureCreateFieldInput>>;
  delete?: InputMaybe<Array<PersonOwnedInfrastructureDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<PersonOwnedInfrastructureDisconnectFieldInput>>;
  update?: InputMaybe<PersonOwnedInfrastructureUpdateConnectionInput>;
};

export type PersonOwnedInterfacesAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedInterfacesAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedInterfacesAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedInterfacesAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<PersonOwnedInterfacesNodeAggregationWhereInput>;
};

export type PersonOwnedInterfacesConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type PersonOwnedInterfacesConnection = {
  __typename?: 'PersonOwnedInterfacesConnection';
  aggregate: PersonApplicationInterfaceOwnedInterfacesAggregateSelection;
  edges: Array<PersonOwnedInterfacesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PersonOwnedInterfacesConnectionAggregateInput = {
  AND?: InputMaybe<Array<PersonOwnedInterfacesConnectionAggregateInput>>;
  NOT?: InputMaybe<PersonOwnedInterfacesConnectionAggregateInput>;
  OR?: InputMaybe<Array<PersonOwnedInterfacesConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<PersonOwnedInterfacesNodeAggregationWhereInput>;
};

export type PersonOwnedInterfacesConnectionFilters = {
  /** Filter People by aggregating results on related PersonOwnedInterfacesConnections */
  aggregate?: InputMaybe<PersonOwnedInterfacesConnectionAggregateInput>;
  /** Return People where all of the related PersonOwnedInterfacesConnections match this filter */
  all?: InputMaybe<PersonOwnedInterfacesConnectionWhere>;
  /** Return People where none of the related PersonOwnedInterfacesConnections match this filter */
  none?: InputMaybe<PersonOwnedInterfacesConnectionWhere>;
  /** Return People where one of the related PersonOwnedInterfacesConnections match this filter */
  single?: InputMaybe<PersonOwnedInterfacesConnectionWhere>;
  /** Return People where some of the related PersonOwnedInterfacesConnections match this filter */
  some?: InputMaybe<PersonOwnedInterfacesConnectionWhere>;
};

export type PersonOwnedInterfacesConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type PersonOwnedInterfacesConnectionWhere = {
  AND?: InputMaybe<Array<PersonOwnedInterfacesConnectionWhere>>;
  NOT?: InputMaybe<PersonOwnedInterfacesConnectionWhere>;
  OR?: InputMaybe<Array<PersonOwnedInterfacesConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type PersonOwnedInterfacesCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type PersonOwnedInterfacesDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<PersonOwnedInterfacesConnectionWhere>;
};

export type PersonOwnedInterfacesDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<PersonOwnedInterfacesConnectionWhere>;
};

export type PersonOwnedInterfacesFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedInterfacesCreateFieldInput>>;
};

export type PersonOwnedInterfacesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<PersonOwnedInterfacesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<PersonOwnedInterfacesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<PersonOwnedInterfacesNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  version?: InputMaybe<StringScalarAggregationFilters>;
};

export type PersonOwnedInterfacesRelationship = {
  __typename?: 'PersonOwnedInterfacesRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type PersonOwnedInterfacesUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<PersonOwnedInterfacesConnectionWhere>;
};

export type PersonOwnedInterfacesUpdateFieldInput = {
  connect?: InputMaybe<Array<PersonOwnedInterfacesConnectFieldInput>>;
  create?: InputMaybe<Array<PersonOwnedInterfacesCreateFieldInput>>;
  delete?: InputMaybe<Array<PersonOwnedInterfacesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<PersonOwnedInterfacesDisconnectFieldInput>>;
  update?: InputMaybe<PersonOwnedInterfacesUpdateConnectionInput>;
};

export type PersonRelationshipFilters = {
  /** Filter type where all of the related People match this filter */
  all?: InputMaybe<PersonWhere>;
  /** Filter type where none of the related People match this filter */
  none?: InputMaybe<PersonWhere>;
  /** Filter type where one of the related People match this filter */
  single?: InputMaybe<PersonWhere>;
  /** Filter type where some of the related People match this filter */
  some?: InputMaybe<PersonWhere>;
};

/** Fields to sort People by. The order in which sorts are applied is not guaranteed when specifying many fields in one PersonSort object. */
export type PersonSort = {
  avatarUrl?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  department?: InputMaybe<SortDirection>;
  email?: InputMaybe<SortDirection>;
  firstName?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  lastName?: InputMaybe<SortDirection>;
  phone?: InputMaybe<SortDirection>;
  role?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type PersonUpdateInput = {
  avatarUrl?: InputMaybe<StringScalarMutations>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  department?: InputMaybe<StringScalarMutations>;
  email?: InputMaybe<StringScalarMutations>;
  firstName?: InputMaybe<StringScalarMutations>;
  lastName?: InputMaybe<StringScalarMutations>;
  ownedAIAssets?: InputMaybe<Array<PersonOwnedAiAssetsUpdateFieldInput>>;
  ownedApplications?: InputMaybe<Array<PersonOwnedApplicationsUpdateFieldInput>>;
  ownedArchitectures?: InputMaybe<Array<PersonOwnedArchitecturesUpdateFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesUpdateFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsUpdateFieldInput>>;
  ownedDiagrams?: InputMaybe<Array<PersonOwnedDiagramsUpdateFieldInput>>;
  ownedInfrastructure?: InputMaybe<Array<PersonOwnedInfrastructureUpdateFieldInput>>;
  ownedInterfaces?: InputMaybe<Array<PersonOwnedInterfacesUpdateFieldInput>>;
  phone?: InputMaybe<StringScalarMutations>;
  role?: InputMaybe<StringScalarMutations>;
};

export type PersonWhere = {
  AND?: InputMaybe<Array<PersonWhere>>;
  NOT?: InputMaybe<PersonWhere>;
  OR?: InputMaybe<Array<PersonWhere>>;
  avatarUrl?: InputMaybe<StringScalarFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  department?: InputMaybe<StringScalarFilters>;
  email?: InputMaybe<StringScalarFilters>;
  firstName?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  lastName?: InputMaybe<StringScalarFilters>;
  ownedAIAssets?: InputMaybe<AiAssetRelationshipFilters>;
  ownedAIAssetsConnection?: InputMaybe<PersonOwnedAiAssetsConnectionFilters>;
  ownedApplications?: InputMaybe<ApplicationRelationshipFilters>;
  ownedApplicationsConnection?: InputMaybe<PersonOwnedApplicationsConnectionFilters>;
  ownedArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  ownedArchitecturesConnection?: InputMaybe<PersonOwnedArchitecturesConnectionFilters>;
  ownedCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  ownedCapabilitiesConnection?: InputMaybe<PersonOwnedCapabilitiesConnectionFilters>;
  ownedDataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  ownedDataObjectsConnection?: InputMaybe<PersonOwnedDataObjectsConnectionFilters>;
  ownedDiagrams?: InputMaybe<DiagramRelationshipFilters>;
  ownedDiagramsConnection?: InputMaybe<PersonOwnedDiagramsConnectionFilters>;
  ownedInfrastructure?: InputMaybe<InfrastructureRelationshipFilters>;
  ownedInfrastructureConnection?: InputMaybe<PersonOwnedInfrastructureConnectionFilters>;
  ownedInterfaces?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  ownedInterfacesConnection?: InputMaybe<PersonOwnedInterfacesConnectionFilters>;
  phone?: InputMaybe<StringScalarFilters>;
  role?: InputMaybe<StringScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
};

/** Kategorien für Architektur-Prinzipien */
export enum PrincipleCategory {
  APPLICATION = 'APPLICATION',
  BUSINESS = 'BUSINESS',
  COMPLIANCE = 'COMPLIANCE',
  COST_OPTIMIZATION = 'COST_OPTIMIZATION',
  DATA = 'DATA',
  FLEXIBILITY = 'FLEXIBILITY',
  GOVERNANCE = 'GOVERNANCE',
  INTEGRATION = 'INTEGRATION',
  INTEROPERABILITY = 'INTEROPERABILITY',
  MAINTAINABILITY = 'MAINTAINABILITY',
  PERFORMANCE = 'PERFORMANCE',
  RELIABILITY = 'RELIABILITY',
  REUSABILITY = 'REUSABILITY',
  SCALABILITY = 'SCALABILITY',
  SECURITY = 'SECURITY',
  TECHNOLOGY = 'TECHNOLOGY'
}

/** PrincipleCategory filters */
export type PrincipleCategoryEnumScalarFilters = {
  eq?: InputMaybe<PrincipleCategory>;
  in?: InputMaybe<Array<PrincipleCategory>>;
};

/** PrincipleCategory mutations */
export type PrincipleCategoryEnumScalarMutations = {
  set?: InputMaybe<PrincipleCategory>;
};

/** Prioritätsstufen für Architektur-Prinzipien */
export enum PrinciplePriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM'
}

/** PrinciplePriority filters */
export type PrinciplePriorityEnumScalarFilters = {
  eq?: InputMaybe<PrinciplePriority>;
  in?: InputMaybe<Array<PrinciplePriority>>;
};

/** PrinciplePriority mutations */
export type PrinciplePriorityEnumScalarMutations = {
  set?: InputMaybe<PrinciplePriority>;
};

export type Query = {
  __typename?: 'Query';
  aiAssets: Array<AiAsset>;
  aiAssetsConnection: AiAssetsConnection;
  applicationInterfaces: Array<ApplicationInterface>;
  applicationInterfacesConnection: ApplicationInterfacesConnection;
  applications: Array<Application>;
  applicationsConnection: ApplicationsConnection;
  architecturePrinciples: Array<ArchitecturePrinciple>;
  architecturePrinciplesConnection: ArchitecturePrinciplesConnection;
  architectures: Array<Architecture>;
  architecturesConnection: ArchitecturesConnection;
  businessCapabilities: Array<BusinessCapability>;
  businessCapabilitiesConnection: BusinessCapabilitiesConnection;
  companies: Array<Company>;
  companiesConnection: CompaniesConnection;
  dataObjects: Array<DataObject>;
  dataObjectsConnection: DataObjectsConnection;
  diagrams: Array<Diagram>;
  diagramsConnection: DiagramsConnection;
  infrastructures: Array<Infrastructure>;
  infrastructuresConnection: InfrastructuresConnection;
  organisations: Array<Organisation>;
  organisationsConnection: OrganisationsConnection;
  people: Array<Person>;
  peopleConnection: PeopleConnection;
};


export type QueryAiAssetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


export type QueryAiAssetsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiAssetSort>>;
  where?: InputMaybe<AiAssetWhere>;
};


export type QueryApplicationInterfacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


export type QueryApplicationInterfacesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


export type QueryApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


export type QueryApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationSort>>;
  where?: InputMaybe<ApplicationWhere>;
};


export type QueryArchitecturePrinciplesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitecturePrincipleSort>>;
  where?: InputMaybe<ArchitecturePrincipleWhere>;
};


export type QueryArchitecturePrinciplesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitecturePrincipleSort>>;
  where?: InputMaybe<ArchitecturePrincipleWhere>;
};


export type QueryArchitecturesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


export type QueryArchitecturesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ArchitectureSort>>;
  where?: InputMaybe<ArchitectureWhere>;
};


export type QueryBusinessCapabilitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


export type QueryBusinessCapabilitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BusinessCapabilitySort>>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


export type QueryCompaniesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanySort>>;
  where?: InputMaybe<CompanyWhere>;
};


export type QueryCompaniesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CompanySort>>;
  where?: InputMaybe<CompanyWhere>;
};


export type QueryDataObjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


export type QueryDataObjectsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DataObjectSort>>;
  where?: InputMaybe<DataObjectWhere>;
};


export type QueryDiagramsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramSort>>;
  where?: InputMaybe<DiagramWhere>;
};


export type QueryDiagramsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DiagramSort>>;
  where?: InputMaybe<DiagramWhere>;
};


export type QueryInfrastructuresArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


export type QueryInfrastructuresConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InfrastructureSort>>;
  where?: InputMaybe<InfrastructureWhere>;
};


export type QueryOrganisationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


export type QueryOrganisationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<OrganisationSort>>;
  where?: InputMaybe<OrganisationWhere>;
};


export type QueryPeopleArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};


export type QueryPeopleConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PersonSort>>;
  where?: InputMaybe<PersonWhere>;
};

/** 7R-Strategien für Cloud-Migration und Applikationsportfolio-Management */
export enum SevenRStrategy {
  REARCHITECT = 'REARCHITECT',
  REFACTOR = 'REFACTOR',
  REHOST = 'REHOST',
  REPLACE = 'REPLACE',
  REPLATFORM = 'REPLATFORM',
  RETAIN = 'RETAIN',
  RETIRE = 'RETIRE'
}

/** SevenRStrategy filters */
export type SevenRStrategyEnumScalarFilters = {
  eq?: InputMaybe<SevenRStrategy>;
  in?: InputMaybe<Array<SevenRStrategy>>;
};

/** SevenRStrategy mutations */
export type SevenRStrategyEnumScalarMutations = {
  set?: InputMaybe<SevenRStrategy>;
};

/** An enum for sorting in either ascending or descending order. */
export enum SortDirection {
  /** Sort by field values in ascending order. */
  ASC = 'ASC',
  /** Sort by field values in descending order. */
  DESC = 'DESC'
}

export type StringAggregateSelection = {
  __typename?: 'StringAggregateSelection';
  longest?: Maybe<Scalars['String']['output']>;
  shortest?: Maybe<Scalars['String']['output']>;
};

/** String list filters */
export type StringListFilters = {
  eq?: InputMaybe<Array<Scalars['String']['input']>>;
  includes?: InputMaybe<Scalars['String']['input']>;
};

/** Filters for an aggregation of a string field */
export type StringScalarAggregationFilters = {
  averageLength?: InputMaybe<FloatScalarFilters>;
  longestLength?: InputMaybe<IntScalarFilters>;
  shortestLength?: InputMaybe<IntScalarFilters>;
};

/** String filters */
export type StringScalarFilters = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

/** String mutations */
export type StringScalarMutations = {
  set?: InputMaybe<Scalars['String']['input']>;
};

/** TIME-Kategorien für Applikationen zur strategischen Klassifizierung */
export enum TimeCategory {
  ELIMINATE = 'ELIMINATE',
  INVEST = 'INVEST',
  MIGRATE = 'MIGRATE',
  TOLERATE = 'TOLERATE'
}

/** TimeCategory filters */
export type TimeCategoryEnumScalarFilters = {
  eq?: InputMaybe<TimeCategory>;
  in?: InputMaybe<Array<TimeCategory>>;
};

/** TimeCategory mutations */
export type TimeCategoryEnumScalarMutations = {
  set?: InputMaybe<TimeCategory>;
};

export type UpdateAiAssetsMutationResponse = {
  __typename?: 'UpdateAiAssetsMutationResponse';
  aiAssets: Array<AiAsset>;
  info: UpdateInfo;
};

export type UpdateApplicationInterfacesMutationResponse = {
  __typename?: 'UpdateApplicationInterfacesMutationResponse';
  applicationInterfaces: Array<ApplicationInterface>;
  info: UpdateInfo;
};

export type UpdateApplicationsMutationResponse = {
  __typename?: 'UpdateApplicationsMutationResponse';
  applications: Array<Application>;
  info: UpdateInfo;
};

export type UpdateArchitecturePrinciplesMutationResponse = {
  __typename?: 'UpdateArchitecturePrinciplesMutationResponse';
  architecturePrinciples: Array<ArchitecturePrinciple>;
  info: UpdateInfo;
};

export type UpdateArchitecturesMutationResponse = {
  __typename?: 'UpdateArchitecturesMutationResponse';
  architectures: Array<Architecture>;
  info: UpdateInfo;
};

export type UpdateBusinessCapabilitiesMutationResponse = {
  __typename?: 'UpdateBusinessCapabilitiesMutationResponse';
  businessCapabilities: Array<BusinessCapability>;
  info: UpdateInfo;
};

export type UpdateCompaniesMutationResponse = {
  __typename?: 'UpdateCompaniesMutationResponse';
  companies: Array<Company>;
  info: UpdateInfo;
};

export type UpdateDataObjectsMutationResponse = {
  __typename?: 'UpdateDataObjectsMutationResponse';
  dataObjects: Array<DataObject>;
  info: UpdateInfo;
};

export type UpdateDiagramsMutationResponse = {
  __typename?: 'UpdateDiagramsMutationResponse';
  diagrams: Array<Diagram>;
  info: UpdateInfo;
};

/** Information about the number of nodes and relationships created and deleted during an update mutation */
export type UpdateInfo = {
  __typename?: 'UpdateInfo';
  nodesCreated: Scalars['Int']['output'];
  nodesDeleted: Scalars['Int']['output'];
  relationshipsCreated: Scalars['Int']['output'];
  relationshipsDeleted: Scalars['Int']['output'];
};

export type UpdateInfrastructuresMutationResponse = {
  __typename?: 'UpdateInfrastructuresMutationResponse';
  info: UpdateInfo;
  infrastructures: Array<Infrastructure>;
};

export type UpdateOrganisationsMutationResponse = {
  __typename?: 'UpdateOrganisationsMutationResponse';
  info: UpdateInfo;
  organisations: Array<Organisation>;
};

export type UpdatePeopleMutationResponse = {
  __typename?: 'UpdatePeopleMutationResponse';
  info: UpdateInfo;
  people: Array<Person>;
};
