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
  supportsCapabilities?: InputMaybe<Array<ApplicationSupportsCapabilitiesDeleteFieldInput>>;
  usesDataObjects?: InputMaybe<Array<ApplicationUsesDataObjectsDeleteFieldInput>>;
};

export type ApplicationDisconnectInput = {
  interfacesToApplications?: InputMaybe<Array<ApplicationInterfacesToApplicationsDisconnectFieldInput>>;
  owners?: InputMaybe<Array<ApplicationOwnersDisconnectFieldInput>>;
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
  relatedDataObjects?: InputMaybe<Array<BusinessCapabilityRelatedDataObjectsDeleteFieldInput>>;
  supportedByApplications?: InputMaybe<Array<BusinessCapabilitySupportedByApplicationsDeleteFieldInput>>;
};

export type BusinessCapabilityDisconnectInput = {
  children?: InputMaybe<Array<BusinessCapabilityChildrenDisconnectFieldInput>>;
  owners?: InputMaybe<Array<BusinessCapabilityOwnersDisconnectFieldInput>>;
  parents?: InputMaybe<Array<BusinessCapabilityParentsDisconnectFieldInput>>;
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
  relatedToCapabilities?: InputMaybe<DataObjectRelatedToCapabilitiesFieldInput>;
  source?: InputMaybe<Scalars['String']['input']>;
  transferredInInterfaces?: InputMaybe<DataObjectTransferredInInterfacesFieldInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  usedByApplications?: InputMaybe<DataObjectUsedByApplicationsFieldInput>;
};

export type DataObjectDeleteInput = {
  owners?: InputMaybe<Array<DataObjectOwnersDeleteFieldInput>>;
  relatedToCapabilities?: InputMaybe<Array<DataObjectRelatedToCapabilitiesDeleteFieldInput>>;
  transferredInInterfaces?: InputMaybe<Array<DataObjectTransferredInInterfacesDeleteFieldInput>>;
  usedByApplications?: InputMaybe<Array<DataObjectUsedByApplicationsDeleteFieldInput>>;
};

export type DataObjectDisconnectInput = {
  owners?: InputMaybe<Array<DataObjectOwnersDisconnectFieldInput>>;
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
  createBusinessCapabilities: CreateBusinessCapabilitiesMutationResponse;
  createDataObjects: CreateDataObjectsMutationResponse;
  createPeople: CreatePeopleMutationResponse;
  deleteApplicationInterfaces: DeleteInfo;
  deleteApplications: DeleteInfo;
  deleteBusinessCapabilities: DeleteInfo;
  deleteDataObjects: DeleteInfo;
  deletePeople: DeleteInfo;
  updateApplicationInterfaces: UpdateApplicationInterfacesMutationResponse;
  updateApplications: UpdateApplicationsMutationResponse;
  updateBusinessCapabilities: UpdateBusinessCapabilitiesMutationResponse;
  updateDataObjects: UpdateDataObjectsMutationResponse;
  updatePeople: UpdatePeopleMutationResponse;
};


export type MutationCreateApplicationInterfacesArgs = {
  input: Array<ApplicationInterfaceCreateInput>;
};


export type MutationCreateApplicationsArgs = {
  input: Array<ApplicationCreateInput>;
};


export type MutationCreateBusinessCapabilitiesArgs = {
  input: Array<BusinessCapabilityCreateInput>;
};


export type MutationCreateDataObjectsArgs = {
  input: Array<DataObjectCreateInput>;
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


export type MutationDeleteBusinessCapabilitiesArgs = {
  delete?: InputMaybe<BusinessCapabilityDeleteInput>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


export type MutationDeleteDataObjectsArgs = {
  delete?: InputMaybe<DataObjectDeleteInput>;
  where?: InputMaybe<DataObjectWhere>;
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


export type MutationUpdateBusinessCapabilitiesArgs = {
  update?: InputMaybe<BusinessCapabilityUpdateInput>;
  where?: InputMaybe<BusinessCapabilityWhere>;
};


export type MutationUpdateDataObjectsArgs = {
  update?: InputMaybe<DataObjectUpdateInput>;
  where?: InputMaybe<DataObjectWhere>;
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
  ownedCapabilities: Array<BusinessCapability>;
  ownedCapabilitiesConnection: PersonOwnedCapabilitiesConnection;
  ownedDataObjects: Array<DataObject>;
  ownedDataObjectsConnection: PersonOwnedDataObjectsConnection;
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
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesConnectFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsConnectFieldInput>>;
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
  ownedCapabilities?: InputMaybe<PersonOwnedCapabilitiesFieldInput>;
  ownedDataObjects?: InputMaybe<PersonOwnedDataObjectsFieldInput>;
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
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesDeleteFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsDeleteFieldInput>>;
};

export type PersonDisconnectInput = {
  ownedApplications?: InputMaybe<Array<PersonOwnedApplicationsDisconnectFieldInput>>;
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesDisconnectFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsDisconnectFieldInput>>;
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
  ownedCapabilities?: InputMaybe<Array<PersonOwnedCapabilitiesUpdateFieldInput>>;
  ownedDataObjects?: InputMaybe<Array<PersonOwnedDataObjectsUpdateFieldInput>>;
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
  ownedCapabilities?: InputMaybe<BusinessCapabilityRelationshipFilters>;
  ownedCapabilitiesConnection?: InputMaybe<PersonOwnedCapabilitiesConnectionFilters>;
  ownedDataObjects?: InputMaybe<DataObjectRelationshipFilters>;
  ownedDataObjectsConnection?: InputMaybe<PersonOwnedDataObjectsConnectionFilters>;
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
  businessCapabilities: Array<BusinessCapability>;
  businessCapabilitiesConnection: BusinessCapabilitiesConnection;
  dataObjects: Array<DataObject>;
  dataObjectsConnection: DataObjectsConnection;
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
