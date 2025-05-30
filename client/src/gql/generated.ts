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

/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type Application = {
  __typename?: 'Application';
  costs?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  criticality: CriticalityLevel;
  description?: Maybe<Scalars['String']['output']>;
  endOfLifeDate?: Maybe<Scalars['Date']['output']>;
  hostingEnvironment?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interfacesToApplications: Array<ApplicationInterface>;
  interfacesToApplicationsConnection: ApplicationInterfacesToApplicationsConnection;
  introductionDate?: Maybe<Scalars['Date']['output']>;
  name: Scalars['String']['output'];
  owners: Array<Person>;
  ownersConnection: ApplicationOwnersConnection;
  partOfArchitectures: Array<Architecture>;
  partOfArchitecturesConnection: ApplicationPartOfArchitecturesConnection;
  status: ApplicationStatus;
  supportsCapabilities: Array<BusinessCapability>;
  supportsCapabilitiesConnection: ApplicationSupportsCapabilitiesConnection;
  technologyStack?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usesDataObjects: Array<DataObject>;
  usesDataObjectsConnection: ApplicationUsesDataObjectsConnection;
  vendor?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationInterfacesToApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfaceSort>>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


/** Application - repräsentiert eine Business-Applikation im Enterprise Architecture Management */
export type ApplicationInterfacesToApplicationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApplicationInterfacesToApplicationsConnectionSort>>;
  where?: InputMaybe<ApplicationInterfacesToApplicationsConnectionWhere>;
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

export type ApplicationApplicationInterfaceInterfacesToApplicationsAggregateSelection = {
  __typename?: 'ApplicationApplicationInterfaceInterfacesToApplicationsAggregateSelection';
  count: CountConnection;
  node?: Maybe<ApplicationApplicationInterfaceInterfacesToApplicationsNodeAggregateSelection>;
};

export type ApplicationApplicationInterfaceInterfacesToApplicationsNodeAggregateSelection = {
  __typename?: 'ApplicationApplicationInterfaceInterfacesToApplicationsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelection;
  description: StringAggregateSelection;
  name: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
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
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationConnectInput = {
  interfacesToApplications?: InputMaybe<Array<ApplicationInterfacesToApplicationsConnectFieldInput>>;
  owners?: InputMaybe<Array<ApplicationOwnersConnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationPartOfArchitecturesConnectFieldInput>>;
  supportsCapabilities?: InputMaybe<Array<ApplicationSupportsCapabilitiesConnectFieldInput>>;
  usesDataObjects?: InputMaybe<Array<ApplicationUsesDataObjectsConnectFieldInput>>;
};

export type ApplicationConnectWhere = {
  node: ApplicationWhere;
};

export type ApplicationCreateInput = {
  costs?: InputMaybe<Scalars['Float']['input']>;
  criticality: CriticalityLevel;
  description?: InputMaybe<Scalars['String']['input']>;
  endOfLifeDate?: InputMaybe<Scalars['Date']['input']>;
  hostingEnvironment?: InputMaybe<Scalars['String']['input']>;
  interfacesToApplications?: InputMaybe<ApplicationInterfacesToApplicationsFieldInput>;
  introductionDate?: InputMaybe<Scalars['Date']['input']>;
  name: Scalars['String']['input'];
  owners?: InputMaybe<ApplicationOwnersFieldInput>;
  partOfArchitectures?: InputMaybe<ApplicationPartOfArchitecturesFieldInput>;
  status: ApplicationStatus;
  supportsCapabilities?: InputMaybe<ApplicationSupportsCapabilitiesFieldInput>;
  technologyStack?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usesDataObjects?: InputMaybe<ApplicationUsesDataObjectsFieldInput>;
  vendor?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
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
  source: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ApplicationDeleteInput = {
  interfacesToApplications?: InputMaybe<Array<ApplicationInterfacesToApplicationsDeleteFieldInput>>;
  owners?: InputMaybe<Array<ApplicationOwnersDeleteFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationPartOfArchitecturesDeleteFieldInput>>;
  supportsCapabilities?: InputMaybe<Array<ApplicationSupportsCapabilitiesDeleteFieldInput>>;
  usesDataObjects?: InputMaybe<Array<ApplicationUsesDataObjectsDeleteFieldInput>>;
};

export type ApplicationDisconnectInput = {
  interfacesToApplications?: InputMaybe<Array<ApplicationInterfacesToApplicationsDisconnectFieldInput>>;
  owners?: InputMaybe<Array<ApplicationOwnersDisconnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationPartOfArchitecturesDisconnectFieldInput>>;
  supportsCapabilities?: InputMaybe<Array<ApplicationSupportsCapabilitiesDisconnectFieldInput>>;
  usesDataObjects?: InputMaybe<Array<ApplicationUsesDataObjectsDisconnectFieldInput>>;
};

export type ApplicationEdge = {
  __typename?: 'ApplicationEdge';
  cursor: Scalars['String']['output'];
  node: Application;
};

/** ApplicationInterface - repräsentiert eine Schnittstelle zwischen Applikationen */
export type ApplicationInterface = {
  __typename?: 'ApplicationInterface';
  createdAt: Scalars['DateTime']['output'];
  dataObjects: Array<DataObject>;
  dataObjectsConnection: ApplicationInterfaceDataObjectsConnection;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  interfaceType: InterfaceType;
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
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
};

export type ApplicationInterfaceConnectInput = {
  dataObjects?: InputMaybe<Array<ApplicationInterfaceDataObjectsConnectFieldInput>>;
};

export type ApplicationInterfaceConnectWhere = {
  node: ApplicationInterfaceWhere;
};

export type ApplicationInterfaceCreateInput = {
  dataObjects?: InputMaybe<ApplicationInterfaceDataObjectsFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  interfaceType: InterfaceType;
  name: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
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
  source: StringAggregateSelection;
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
  source?: InputMaybe<StringScalarAggregationFilters>;
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
  dataObjects?: InputMaybe<Array<ApplicationInterfaceDataObjectsDeleteFieldInput>>;
};

export type ApplicationInterfaceDisconnectInput = {
  dataObjects?: InputMaybe<Array<ApplicationInterfaceDataObjectsDisconnectFieldInput>>;
};

export type ApplicationInterfaceEdge = {
  __typename?: 'ApplicationInterfaceEdge';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
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
  id?: InputMaybe<SortDirection>;
  interfaceType?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type ApplicationInterfaceUpdateInput = {
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  dataObjects?: InputMaybe<Array<ApplicationInterfaceDataObjectsUpdateFieldInput>>;
  description?: InputMaybe<StringScalarMutations>;
  interfaceType?: InputMaybe<InterfaceTypeEnumScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
};

export type ApplicationInterfaceWhere = {
  AND?: InputMaybe<Array<ApplicationInterfaceWhere>>;
  NOT?: InputMaybe<ApplicationInterfaceWhere>;
  OR?: InputMaybe<Array<ApplicationInterfaceWhere>>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  dataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  dataObjectsConnection?: InputMaybe<ApplicationInterfaceDataObjectsConnectionFilters>;
  description?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  interfaceType?: InputMaybe<InterfaceTypeEnumScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
};

export type ApplicationInterfacesConnection = {
  __typename?: 'ApplicationInterfacesConnection';
  aggregate: ApplicationInterfaceAggregate;
  edges: Array<ApplicationInterfaceEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfacesToApplicationsAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfacesToApplicationsAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfacesToApplicationsAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfacesToApplicationsAggregateInput>>;
  count?: InputMaybe<IntScalarFilters>;
  count_EQ?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<ApplicationInterfacesToApplicationsNodeAggregationWhereInput>;
};

export type ApplicationInterfacesToApplicationsConnectFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfaceConnectInput>>;
  where?: InputMaybe<ApplicationInterfaceConnectWhere>;
};

export type ApplicationInterfacesToApplicationsConnection = {
  __typename?: 'ApplicationInterfacesToApplicationsConnection';
  aggregate: ApplicationApplicationInterfaceInterfacesToApplicationsAggregateSelection;
  edges: Array<ApplicationInterfacesToApplicationsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApplicationInterfacesToApplicationsConnectionAggregateInput = {
  AND?: InputMaybe<Array<ApplicationInterfacesToApplicationsConnectionAggregateInput>>;
  NOT?: InputMaybe<ApplicationInterfacesToApplicationsConnectionAggregateInput>;
  OR?: InputMaybe<Array<ApplicationInterfacesToApplicationsConnectionAggregateInput>>;
  count?: InputMaybe<ConnectionAggregationCountFilterInput>;
  node?: InputMaybe<ApplicationInterfacesToApplicationsNodeAggregationWhereInput>;
};

export type ApplicationInterfacesToApplicationsConnectionFilters = {
  /** Filter Applications by aggregating results on related ApplicationInterfacesToApplicationsConnections */
  aggregate?: InputMaybe<ApplicationInterfacesToApplicationsConnectionAggregateInput>;
  /** Return Applications where all of the related ApplicationInterfacesToApplicationsConnections match this filter */
  all?: InputMaybe<ApplicationInterfacesToApplicationsConnectionWhere>;
  /** Return Applications where none of the related ApplicationInterfacesToApplicationsConnections match this filter */
  none?: InputMaybe<ApplicationInterfacesToApplicationsConnectionWhere>;
  /** Return Applications where one of the related ApplicationInterfacesToApplicationsConnections match this filter */
  single?: InputMaybe<ApplicationInterfacesToApplicationsConnectionWhere>;
  /** Return Applications where some of the related ApplicationInterfacesToApplicationsConnections match this filter */
  some?: InputMaybe<ApplicationInterfacesToApplicationsConnectionWhere>;
};

export type ApplicationInterfacesToApplicationsConnectionSort = {
  node?: InputMaybe<ApplicationInterfaceSort>;
};

export type ApplicationInterfacesToApplicationsConnectionWhere = {
  AND?: InputMaybe<Array<ApplicationInterfacesToApplicationsConnectionWhere>>;
  NOT?: InputMaybe<ApplicationInterfacesToApplicationsConnectionWhere>;
  OR?: InputMaybe<Array<ApplicationInterfacesToApplicationsConnectionWhere>>;
  node?: InputMaybe<ApplicationInterfaceWhere>;
};

export type ApplicationInterfacesToApplicationsCreateFieldInput = {
  node: ApplicationInterfaceCreateInput;
};

export type ApplicationInterfacesToApplicationsDeleteFieldInput = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<ApplicationInterfacesToApplicationsConnectionWhere>;
};

export type ApplicationInterfacesToApplicationsDisconnectFieldInput = {
  disconnect?: InputMaybe<ApplicationInterfaceDisconnectInput>;
  where?: InputMaybe<ApplicationInterfacesToApplicationsConnectionWhere>;
};

export type ApplicationInterfacesToApplicationsFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfacesToApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfacesToApplicationsCreateFieldInput>>;
};

export type ApplicationInterfacesToApplicationsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ApplicationInterfacesToApplicationsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<ApplicationInterfacesToApplicationsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<ApplicationInterfacesToApplicationsNodeAggregationWhereInput>>;
  createdAt?: InputMaybe<DateTimeScalarAggregationFilters>;
  description?: InputMaybe<StringScalarAggregationFilters>;
  name?: InputMaybe<StringScalarAggregationFilters>;
  updatedAt?: InputMaybe<DateTimeScalarAggregationFilters>;
};

export type ApplicationInterfacesToApplicationsRelationship = {
  __typename?: 'ApplicationInterfacesToApplicationsRelationship';
  cursor: Scalars['String']['output'];
  node: ApplicationInterface;
};

export type ApplicationInterfacesToApplicationsUpdateConnectionInput = {
  node?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<ApplicationInterfacesToApplicationsConnectionWhere>;
};

export type ApplicationInterfacesToApplicationsUpdateFieldInput = {
  connect?: InputMaybe<Array<ApplicationInterfacesToApplicationsConnectFieldInput>>;
  create?: InputMaybe<Array<ApplicationInterfacesToApplicationsCreateFieldInput>>;
  delete?: InputMaybe<Array<ApplicationInterfacesToApplicationsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ApplicationInterfacesToApplicationsDisconnectFieldInput>>;
  update?: InputMaybe<ApplicationInterfacesToApplicationsUpdateConnectionInput>;
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
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
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
  hostingEnvironment?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  introductionDate?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  status?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
  vendor?: InputMaybe<SortDirection>;
  version?: InputMaybe<SortDirection>;
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

export type ApplicationUpdateInput = {
  costs?: InputMaybe<FloatScalarMutations>;
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  criticality?: InputMaybe<CriticalityLevelEnumScalarMutations>;
  description?: InputMaybe<StringScalarMutations>;
  endOfLifeDate?: InputMaybe<DateScalarMutations>;
  hostingEnvironment?: InputMaybe<StringScalarMutations>;
  interfacesToApplications?: InputMaybe<Array<ApplicationInterfacesToApplicationsUpdateFieldInput>>;
  introductionDate?: InputMaybe<DateScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<ApplicationOwnersUpdateFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<ApplicationPartOfArchitecturesUpdateFieldInput>>;
  status?: InputMaybe<ApplicationStatusEnumScalarMutations>;
  supportsCapabilities?: InputMaybe<Array<ApplicationSupportsCapabilitiesUpdateFieldInput>>;
  technologyStack?: InputMaybe<ListStringMutations>;
  usesDataObjects?: InputMaybe<Array<ApplicationUsesDataObjectsUpdateFieldInput>>;
  vendor?: InputMaybe<StringScalarMutations>;
  version?: InputMaybe<StringScalarMutations>;
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
  source?: InputMaybe<StringScalarAggregationFilters>;
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
  costs?: InputMaybe<FloatScalarFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  criticality?: InputMaybe<CriticalityLevelEnumScalarFilters>;
  description?: InputMaybe<StringScalarFilters>;
  endOfLifeDate?: InputMaybe<DateScalarFilters>;
  hostingEnvironment?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  interfacesToApplications?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  interfacesToApplicationsConnection?: InputMaybe<ApplicationInterfacesToApplicationsConnectionFilters>;
  introductionDate?: InputMaybe<DateScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  owners?: InputMaybe<PersonRelationshipFilters>;
  ownersConnection?: InputMaybe<ApplicationOwnersConnectionFilters>;
  partOfArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  partOfArchitecturesConnection?: InputMaybe<ApplicationPartOfArchitecturesConnectionFilters>;
  status?: InputMaybe<ApplicationStatusEnumScalarFilters>;
  supportsCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  supportsCapabilitiesConnection?: InputMaybe<ApplicationSupportsCapabilitiesConnectionFilters>;
  technologyStack?: InputMaybe<StringListFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
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
  childArchitectures: Array<Architecture>;
  childArchitecturesConnection: ArchitectureChildArchitecturesConnection;
  containsApplications: Array<Application>;
  containsApplicationsConnection: ArchitectureContainsApplicationsConnection;
  containsCapabilities: Array<BusinessCapability>;
  containsCapabilitiesConnection: ArchitectureContainsCapabilitiesConnection;
  containsDataObjects: Array<DataObject>;
  containsDataObjectsConnection: ArchitectureContainsDataObjectsConnection;
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
  childArchitectures?: InputMaybe<Array<ArchitectureChildArchitecturesConnectFieldInput>>;
  containsApplications?: InputMaybe<Array<ArchitectureContainsApplicationsConnectFieldInput>>;
  containsCapabilities?: InputMaybe<Array<ArchitectureContainsCapabilitiesConnectFieldInput>>;
  containsDataObjects?: InputMaybe<Array<ArchitectureContainsDataObjectsConnectFieldInput>>;
  diagrams?: InputMaybe<Array<ArchitectureDiagramsConnectFieldInput>>;
  owners?: InputMaybe<Array<ArchitectureOwnersConnectFieldInput>>;
  parentArchitecture?: InputMaybe<Array<ArchitectureParentArchitectureConnectFieldInput>>;
};

export type ArchitectureConnectWhere = {
  node: ArchitectureWhere;
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
  source?: InputMaybe<StringScalarAggregationFilters>;
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

export type ArchitectureCreateInput = {
  childArchitectures?: InputMaybe<ArchitectureChildArchitecturesFieldInput>;
  containsApplications?: InputMaybe<ArchitectureContainsApplicationsFieldInput>;
  containsCapabilities?: InputMaybe<ArchitectureContainsCapabilitiesFieldInput>;
  containsDataObjects?: InputMaybe<ArchitectureContainsDataObjectsFieldInput>;
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
  source: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type ArchitectureDeleteInput = {
  childArchitectures?: InputMaybe<Array<ArchitectureChildArchitecturesDeleteFieldInput>>;
  containsApplications?: InputMaybe<Array<ArchitectureContainsApplicationsDeleteFieldInput>>;
  containsCapabilities?: InputMaybe<Array<ArchitectureContainsCapabilitiesDeleteFieldInput>>;
  containsDataObjects?: InputMaybe<Array<ArchitectureContainsDataObjectsDeleteFieldInput>>;
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
  childArchitectures?: InputMaybe<Array<ArchitectureChildArchitecturesDisconnectFieldInput>>;
  containsApplications?: InputMaybe<Array<ArchitectureContainsApplicationsDisconnectFieldInput>>;
  containsCapabilities?: InputMaybe<Array<ArchitectureContainsCapabilitiesDisconnectFieldInput>>;
  containsDataObjects?: InputMaybe<Array<ArchitectureContainsDataObjectsDisconnectFieldInput>>;
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
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
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
  childArchitectures?: InputMaybe<Array<ArchitectureChildArchitecturesUpdateFieldInput>>;
  containsApplications?: InputMaybe<Array<ArchitectureContainsApplicationsUpdateFieldInput>>;
  containsCapabilities?: InputMaybe<Array<ArchitectureContainsCapabilitiesUpdateFieldInput>>;
  containsDataObjects?: InputMaybe<Array<ArchitectureContainsDataObjectsUpdateFieldInput>>;
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
  childArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  childArchitecturesConnection?: InputMaybe<ArchitectureChildArchitecturesConnectionFilters>;
  containsApplications?: InputMaybe<ApplicationRelationshipFilters>;
  containsApplicationsConnection?: InputMaybe<ArchitectureContainsApplicationsConnectionFilters>;
  containsCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  containsCapabilitiesConnection?: InputMaybe<ArchitectureContainsCapabilitiesConnectionFilters>;
  containsDataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  containsDataObjectsConnection?: InputMaybe<ArchitectureContainsDataObjectsConnectionFilters>;
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
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
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
  status: CapabilityStatus;
  supportedByApplications: Array<Application>;
  supportedByApplicationsConnection: BusinessCapabilitySupportedByApplicationsConnection;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
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

export type BusinessCapabilityConnectInput = {
  children?: InputMaybe<Array<BusinessCapabilityChildrenConnectFieldInput>>;
  owners?: InputMaybe<Array<BusinessCapabilityOwnersConnectFieldInput>>;
  parents?: InputMaybe<Array<BusinessCapabilityParentsConnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesConnectFieldInput>>;
  relatedDataObjects?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsConnectFieldInput>>;
  supportedByApplications?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsConnectFieldInput>>;
};

export type BusinessCapabilityConnectWhere = {
  node: BusinessCapabilityWhere;
};

export type BusinessCapabilityCreateInput = {
  businessValue?: InputMaybe<Scalars['Int']['input']>;
  children?: InputMaybe<BusinessCapabilityChildrenFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  maturityLevel?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  owners?: InputMaybe<BusinessCapabilityOwnersFieldInput>;
  parents?: InputMaybe<BusinessCapabilityParentsFieldInput>;
  partOfArchitectures?: InputMaybe<BusinessCapabilityPartOfArchitecturesFieldInput>;
  relatedDataObjects?: InputMaybe<BusinessCapabilityRelatedDataObjectsFieldInput>;
  status: CapabilityStatus;
  supportedByApplications?: InputMaybe<BusinessCapabilitySupportedByApplicationsFieldInput>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
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
  source: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type BusinessCapabilityDeleteInput = {
  children?: InputMaybe<Array<BusinessCapabilityChildrenDeleteFieldInput>>;
  owners?: InputMaybe<Array<BusinessCapabilityOwnersDeleteFieldInput>>;
  parents?: InputMaybe<Array<BusinessCapabilityParentsDeleteFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesDeleteFieldInput>>;
  relatedDataObjects?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsDeleteFieldInput>>;
  supportedByApplications?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsDeleteFieldInput>>;
};

export type BusinessCapabilityDisconnectInput = {
  children?: InputMaybe<Array<BusinessCapabilityChildrenDisconnectFieldInput>>;
  owners?: InputMaybe<Array<BusinessCapabilityOwnersDisconnectFieldInput>>;
  parents?: InputMaybe<Array<BusinessCapabilityParentsDisconnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesDisconnectFieldInput>>;
  relatedDataObjects?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsDisconnectFieldInput>>;
  supportedByApplications?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsDisconnectFieldInput>>;
};

export type BusinessCapabilityEdge = {
  __typename?: 'BusinessCapabilityEdge';
  cursor: Scalars['String']['output'];
  node: BusinessCapability;
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
  source?: InputMaybe<StringScalarAggregationFilters>;
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
  id?: InputMaybe<SortDirection>;
  maturityLevel?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  status?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
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
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  description?: InputMaybe<StringScalarMutations>;
  maturityLevel?: InputMaybe<IntScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<BusinessCapabilityOwnersUpdateFieldInput>>;
  parents?: InputMaybe<Array<BusinessCapabilityParentsUpdateFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<BusinessCapabilityPartOfArchitecturesUpdateFieldInput>>;
  relatedDataObjects?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsUpdateFieldInput>>;
  status?: InputMaybe<CapabilityStatusEnumScalarMutations>;
  supportedByApplications?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsUpdateFieldInput>>;
  tags?: InputMaybe<ListStringMutations>;
};

export type BusinessCapabilityWhere = {
  AND?: InputMaybe<Array<BusinessCapabilityWhere>>;
  NOT?: InputMaybe<BusinessCapabilityWhere>;
  OR?: InputMaybe<Array<BusinessCapabilityWhere>>;
  businessValue?: InputMaybe<IntScalarFilters>;
  children?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  childrenConnection?: InputMaybe<BusinessCapabilityChildrenConnectionFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  description?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
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
  status?: InputMaybe<CapabilityStatusEnumScalarFilters>;
  supportedByApplications?: InputMaybe<ApplicationRelationshipFilters>;
  supportedByApplicationsConnection?: InputMaybe<BusinessCapabilitySupportedByApplicationsConnectionFilters>;
  tags?: InputMaybe<StringListFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
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
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owners: Array<Person>;
  ownersConnection: DataObjectOwnersConnection;
  partOfArchitectures: Array<Architecture>;
  partOfArchitecturesConnection: DataObjectPartOfArchitecturesConnection;
  relatedToCapabilities: Array<BusinessCapability>;
  relatedToCapabilitiesConnection: DataObjectRelatedToCapabilitiesConnection;
  source?: Maybe<Scalars['String']['output']>;
  transferredInInterfaces: Array<ApplicationInterface>;
  transferredInInterfacesConnection: DataObjectTransferredInInterfacesConnection;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  usedByApplications: Array<Application>;
  usedByApplicationsConnection: DataObjectUsedByApplicationsConnection;
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
  source: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
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
  updatedAt: DateTimeAggregateSelection;
};

export type DataObjectConnectInput = {
  owners?: InputMaybe<Array<DataObjectOwnersConnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<DataObjectPartOfArchitecturesConnectFieldInput>>;
  relatedToCapabilities?: InputMaybe<Array<DataObjectRelatedToCapabilitiesConnectFieldInput>>;
  transferredInInterfaces?: InputMaybe<Array<DataObjectTransferredInInterfacesConnectFieldInput>>;
  usedByApplications?: InputMaybe<Array<DataObjectUsedByApplicationsConnectFieldInput>>;
};

export type DataObjectConnectWhere = {
  node: DataObjectWhere;
};

export type DataObjectCreateInput = {
  classification: DataClassification;
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  owners?: InputMaybe<DataObjectOwnersFieldInput>;
  partOfArchitectures?: InputMaybe<DataObjectPartOfArchitecturesFieldInput>;
  relatedToCapabilities?: InputMaybe<DataObjectRelatedToCapabilitiesFieldInput>;
  source?: InputMaybe<Scalars['String']['input']>;
  transferredInInterfaces?: InputMaybe<DataObjectTransferredInInterfacesFieldInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usedByApplications?: InputMaybe<DataObjectUsedByApplicationsFieldInput>;
};

export type DataObjectDeleteInput = {
  owners?: InputMaybe<Array<DataObjectOwnersDeleteFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<DataObjectPartOfArchitecturesDeleteFieldInput>>;
  relatedToCapabilities?: InputMaybe<Array<DataObjectRelatedToCapabilitiesDeleteFieldInput>>;
  transferredInInterfaces?: InputMaybe<Array<DataObjectTransferredInInterfacesDeleteFieldInput>>;
  usedByApplications?: InputMaybe<Array<DataObjectUsedByApplicationsDeleteFieldInput>>;
};

export type DataObjectDisconnectInput = {
  owners?: InputMaybe<Array<DataObjectOwnersDisconnectFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<DataObjectPartOfArchitecturesDisconnectFieldInput>>;
  relatedToCapabilities?: InputMaybe<Array<DataObjectRelatedToCapabilitiesDisconnectFieldInput>>;
  transferredInInterfaces?: InputMaybe<Array<DataObjectTransferredInInterfacesDisconnectFieldInput>>;
  usedByApplications?: InputMaybe<Array<DataObjectUsedByApplicationsDisconnectFieldInput>>;
};

export type DataObjectEdge = {
  __typename?: 'DataObjectEdge';
  cursor: Scalars['String']['output'];
  node: DataObject;
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
  format?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  source?: InputMaybe<SortDirection>;
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
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  description?: InputMaybe<StringScalarMutations>;
  format?: InputMaybe<StringScalarMutations>;
  name?: InputMaybe<StringScalarMutations>;
  owners?: InputMaybe<Array<DataObjectOwnersUpdateFieldInput>>;
  partOfArchitectures?: InputMaybe<Array<DataObjectPartOfArchitecturesUpdateFieldInput>>;
  relatedToCapabilities?: InputMaybe<Array<DataObjectRelatedToCapabilitiesUpdateFieldInput>>;
  source?: InputMaybe<StringScalarMutations>;
  transferredInInterfaces?: InputMaybe<Array<DataObjectTransferredInInterfacesUpdateFieldInput>>;
  usedByApplications?: InputMaybe<Array<DataObjectUsedByApplicationsUpdateFieldInput>>;
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

export type DataObjectWhere = {
  AND?: InputMaybe<Array<DataObjectWhere>>;
  NOT?: InputMaybe<DataObjectWhere>;
  OR?: InputMaybe<Array<DataObjectWhere>>;
  classification?: InputMaybe<DataClassificationEnumScalarFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  description?: InputMaybe<StringScalarFilters>;
  format?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  name?: InputMaybe<StringScalarFilters>;
  owners?: InputMaybe<PersonRelationshipFilters>;
  ownersConnection?: InputMaybe<DataObjectOwnersConnectionFilters>;
  partOfArchitectures?: InputMaybe<ArchitectureRelationshipFilters>;
  partOfArchitecturesConnection?: InputMaybe<DataObjectPartOfArchitecturesConnectionFilters>;
  relatedToCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  relatedToCapabilitiesConnection?: InputMaybe<DataObjectRelatedToCapabilitiesConnectionFilters>;
  source?: InputMaybe<StringScalarFilters>;
  transferredInInterfaces?: InputMaybe<ApplicationInterfaceRelationshipFilters>;
  transferredInInterfacesConnection?: InputMaybe<DataObjectTransferredInInterfacesConnectionFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
  usedByApplications?: InputMaybe<ApplicationRelationshipFilters>;
  usedByApplicationsConnection?: InputMaybe<DataObjectUsedByApplicationsConnectionFilters>;
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
  createdAt: Scalars['DateTime']['output'];
  creator: Array<Person>;
  creatorConnection: DiagramCreatorConnection;
  description?: Maybe<Scalars['String']['output']>;
  diagramJson: Scalars['String']['output'];
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
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
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

export type DiagramConnectInput = {
  architecture?: InputMaybe<Array<DiagramArchitectureConnectFieldInput>>;
  creator?: InputMaybe<Array<DiagramCreatorConnectFieldInput>>;
};

export type DiagramConnectWhere = {
  node: DiagramWhere;
};

export type DiagramCreateInput = {
  architecture?: InputMaybe<DiagramArchitectureFieldInput>;
  creator?: InputMaybe<DiagramCreatorFieldInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  diagramJson: Scalars['String']['input'];
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

export type DiagramDeleteInput = {
  architecture?: InputMaybe<Array<DiagramArchitectureDeleteFieldInput>>;
  creator?: InputMaybe<Array<DiagramCreatorDeleteFieldInput>>;
};

export type DiagramDisconnectInput = {
  architecture?: InputMaybe<Array<DiagramArchitectureDisconnectFieldInput>>;
  creator?: InputMaybe<Array<DiagramCreatorDisconnectFieldInput>>;
};

export type DiagramEdge = {
  __typename?: 'DiagramEdge';
  cursor: Scalars['String']['output'];
  node: Diagram;
};

export type DiagramPersonCreatorAggregateSelection = {
  __typename?: 'DiagramPersonCreatorAggregateSelection';
  count: CountConnection;
  node?: Maybe<DiagramPersonCreatorNodeAggregateSelection>;
};

export type DiagramPersonCreatorNodeAggregateSelection = {
  __typename?: 'DiagramPersonCreatorNodeAggregateSelection';
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
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  creator?: InputMaybe<Array<DiagramCreatorUpdateFieldInput>>;
  description?: InputMaybe<StringScalarMutations>;
  diagramJson?: InputMaybe<StringScalarMutations>;
  diagramType?: InputMaybe<DiagramTypeEnumScalarMutations>;
  title?: InputMaybe<StringScalarMutations>;
};

export type DiagramWhere = {
  AND?: InputMaybe<Array<DiagramWhere>>;
  NOT?: InputMaybe<DiagramWhere>;
  OR?: InputMaybe<Array<DiagramWhere>>;
  architecture?: InputMaybe<ArchitectureRelationshipFilters>;
  architectureConnection?: InputMaybe<DiagramArchitectureConnectionFilters>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  creator?: InputMaybe<PersonRelationshipFilters>;
  creatorConnection?: InputMaybe<DiagramCreatorConnectionFilters>;
  description?: InputMaybe<StringScalarFilters>;
  diagramJson?: InputMaybe<StringScalarFilters>;
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
  createApplicationInterfaces: CreateApplicationInterfacesMutationResponse;
  createApplications: CreateApplicationsMutationResponse;
  createArchitectures: CreateArchitecturesMutationResponse;
  createBusinessCapabilities: CreateBusinessCapabilitiesMutationResponse;
  createDataObjects: CreateDataObjectsMutationResponse;
  createDiagrams: CreateDiagramsMutationResponse;
  createPeople: CreatePeopleMutationResponse;
  deleteApplicationInterfaces: DeleteInfo;
  deleteApplications: DeleteInfo;
  deleteArchitectures: DeleteInfo;
  deleteBusinessCapabilities: DeleteInfo;
  deleteDataObjects: DeleteInfo;
  deleteDiagrams: DeleteInfo;
  deletePeople: DeleteInfo;
  updateApplicationInterfaces: UpdateApplicationInterfacesMutationResponse;
  updateApplications: UpdateApplicationsMutationResponse;
  updateArchitectures: UpdateArchitecturesMutationResponse;
  updateBusinessCapabilities: UpdateBusinessCapabilitiesMutationResponse;
  updateDataObjects: UpdateDataObjectsMutationResponse;
  updateDiagrams: UpdateDiagramsMutationResponse;
  updatePeople: UpdatePeopleMutationResponse;
};


export type MutationCreateApplicationInterfacesArgs = {
  input: Array<ApplicationInterfaceCreateInput>;
};


export type MutationCreateApplicationsArgs = {
  input: Array<ApplicationCreateInput>;
};


export type MutationCreateArchitecturesArgs = {
  input: Array<ArchitectureCreateInput>;
};


export type MutationCreateBusinessCapabilitiesArgs = {
  input: Array<BusinessCapabilityCreateInput>;
};


export type MutationCreateDataObjectsArgs = {
  input: Array<DataObjectCreateInput>;
};


export type MutationCreateDiagramsArgs = {
  input: Array<DiagramCreateInput>;
};


export type MutationCreatePeopleArgs = {
  input: Array<PersonCreateInput>;
};


export type MutationDeleteApplicationInterfacesArgs = {
  delete?: InputMaybe<ApplicationInterfaceDeleteInput>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


export type MutationDeleteApplicationsArgs = {
  delete?: InputMaybe<ApplicationDeleteInput>;
  where?: InputMaybe<ApplicationWhere>;
};


export type MutationDeleteArchitecturesArgs = {
  delete?: InputMaybe<ArchitectureDeleteInput>;
  where?: InputMaybe<ArchitectureWhere>;
};


export type MutationDeleteBusinessCapabilitiesArgs = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


export type MutationDeleteDataObjectsArgs = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<DataObjectWhere>;
};


export type MutationDeleteDiagramsArgs = {
  delete?: InputMaybe<DiagramDeleteInput>;
  where?: InputMaybe<DiagramWhere>;
};


export type MutationDeletePeopleArgs = {
  delete?: InputMaybe<PersonDeleteInput>;
  where?: InputMaybe<PersonWhere>;
};


export type MutationUpdateApplicationInterfacesArgs = {
  update?: InputMaybe<ApplicationInterfaceUpdateInput>;
  where?: InputMaybe<ApplicationInterfaceWhere>;
};


export type MutationUpdateApplicationsArgs = {
  update?: InputMaybe<ApplicationUpdateInput>;
  where?: InputMaybe<ApplicationWhere>;
};


export type MutationUpdateArchitecturesArgs = {
  update?: InputMaybe<ArchitectureUpdateInput>;
  where?: InputMaybe<ArchitectureWhere>;
};


export type MutationUpdateBusinessCapabilitiesArgs = {
  update?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


export type MutationUpdateDataObjectsArgs = {
  update?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<DataObjectWhere>;
};


export type MutationUpdateDiagramsArgs = {
  update?: InputMaybe<DiagramUpdateInput>;
  where?: InputMaybe<DiagramWhere>;
};


export type MutationUpdatePeopleArgs = {
  update?: InputMaybe<PersonUpdateInput>;
  where?: InputMaybe<PersonWhere>;
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
  createdAt: Scalars['DateTime']['output'];
  department?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
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
  phone?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
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

export type PersonAggregate = {
  __typename?: 'PersonAggregate';
  count: Count;
  node: PersonAggregateNode;
};

export type PersonAggregateNode = {
  __typename?: 'PersonAggregateNode';
  createdAt: DateTimeAggregateSelection;
  department: StringAggregateSelection;
  email: StringAggregateSelection;
  firstName: StringAggregateSelection;
  lastName: StringAggregateSelection;
  phone: StringAggregateSelection;
  role: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
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
  updatedAt: DateTimeAggregateSelection;
};

export type PersonConnectInput = {
  ownedApplications?: InputMaybe<Array<PersonOwnedApplicationsConnectFieldInput>>;
  ownedArchitectures?: InputMaybe<Array<PersonOwnedArchitecturesConnectFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesConnectFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsConnectFieldInput>>;
  ownedDiagrams?: InputMaybe<Array<PersonOwnedDiagramsConnectFieldInput>>;
};

export type PersonConnectWhere = {
  node: PersonWhere;
};

export type PersonCreateInput = {
  department?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  ownedApplications?: InputMaybe<PersonOwnedApplicationsFieldInput>;
  ownedArchitectures?: InputMaybe<PersonOwnedArchitecturesFieldInput>;
  ownedCapabilities?: InputMaybe<PersonOwnedCapabilitiesFieldInput>;
  ownedDataObjects?: InputMaybe<PersonOwnedDataObjectsFieldInput>;
  ownedDiagrams?: InputMaybe<PersonOwnedDiagramsFieldInput>;
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
  source: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type PersonDeleteInput = {
  ownedApplications?: InputMaybe<Array<PersonOwnedApplicationsDeleteFieldInput>>;
  ownedArchitectures?: InputMaybe<Array<PersonOwnedArchitecturesDeleteFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesDeleteFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsDeleteFieldInput>>;
  ownedDiagrams?: InputMaybe<Array<PersonOwnedDiagramsDeleteFieldInput>>;
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
  title: StringAggregateSelection;
  updatedAt: DateTimeAggregateSelection;
};

export type PersonDisconnectInput = {
  ownedApplications?: InputMaybe<Array<PersonOwnedApplicationsDisconnectFieldInput>>;
  ownedArchitectures?: InputMaybe<Array<PersonOwnedArchitecturesDisconnectFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesDisconnectFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsDisconnectFieldInput>>;
  ownedDiagrams?: InputMaybe<Array<PersonOwnedDiagramsDisconnectFieldInput>>;
};

export type PersonEdge = {
  __typename?: 'PersonEdge';
  cursor: Scalars['String']['output'];
  node: Person;
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
  source?: InputMaybe<StringScalarAggregationFilters>;
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
  createdAt?: InputMaybe<DateTimeScalarMutations>;
  department?: InputMaybe<StringScalarMutations>;
  email?: InputMaybe<StringScalarMutations>;
  firstName?: InputMaybe<StringScalarMutations>;
  lastName?: InputMaybe<StringScalarMutations>;
  ownedApplications?: InputMaybe<Array<PersonOwnedApplicationsUpdateFieldInput>>;
  ownedArchitectures?: InputMaybe<Array<PersonOwnedArchitecturesUpdateFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesUpdateFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsUpdateFieldInput>>;
  ownedDiagrams?: InputMaybe<Array<PersonOwnedDiagramsUpdateFieldInput>>;
  phone?: InputMaybe<StringScalarMutations>;
  role?: InputMaybe<StringScalarMutations>;
};

export type PersonWhere = {
  AND?: InputMaybe<Array<PersonWhere>>;
  NOT?: InputMaybe<PersonWhere>;
  OR?: InputMaybe<Array<PersonWhere>>;
  createdAt?: InputMaybe<DateTimeScalarFilters>;
  department?: InputMaybe<StringScalarFilters>;
  email?: InputMaybe<StringScalarFilters>;
  firstName?: InputMaybe<StringScalarFilters>;
  id?: InputMaybe<IdScalarFilters>;
  lastName?: InputMaybe<StringScalarFilters>;
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
  phone?: InputMaybe<StringScalarFilters>;
  role?: InputMaybe<StringScalarFilters>;
  updatedAt?: InputMaybe<DateTimeScalarFilters>;
};

export type Query = {
  __typename?: 'Query';
  applicationInterfaces: Array<ApplicationInterface>;
  applicationInterfacesConnection: ApplicationInterfacesConnection;
  applications: Array<Application>;
  applicationsConnection: ApplicationsConnection;
  architectures: Array<Architecture>;
  architecturesConnection: ArchitecturesConnection;
  businessCapabilities: Array<BusinessCapability>;
  businessCapabilitiesConnection: BusinessCapabilitiesConnection;
  dataObjects: Array<DataObject>;
  dataObjectsConnection: DataObjectsConnection;
  diagrams: Array<Diagram>;
  diagramsConnection: DiagramsConnection;
  people: Array<Person>;
  peopleConnection: PeopleConnection;
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

export type UpdatePeopleMutationResponse = {
  __typename?: 'UpdatePeopleMutationResponse';
  info: UpdateInfo;
  people: Array<Person>;
};
