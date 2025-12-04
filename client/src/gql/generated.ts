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

export type Assessment = {
  __typename?: 'Assessment';
  active: Scalars['Boolean']['output'];
  calculation: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  customer: Customer;
  customerAggregate?: Maybe<AssessmentCustomerCustomerAggregationSelection>;
  customerConnection: AssessmentCustomerConnection;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  mode?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<User>;
  ownerAggregate?: Maybe<AssessmentUserOwnerAggregationSelection>;
  ownerConnection: AssessmentOwnerConnection;
  questions: Questionnaire;
  questionsAggregate?: Maybe<AssessmentQuestionnaireQuestionsAggregationSelection>;
  questionsConnection: AssessmentQuestionsConnection;
  questionsVersionId?: Maybe<Scalars['ID']['output']>;
  responses: Array<AssessmentResponse>;
  responsesAggregate?: Maybe<AssessmentAssessmentResponseResponsesAggregationSelection>;
  responsesConnection: AssessmentResponsesConnection;
  showResults?: Maybe<Scalars['Boolean']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  team: Array<User>;
  teamAggregate?: Maybe<AssessmentUserTeamAggregationSelection>;
  teamConnection: AssessmentTeamConnection;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type AssessmentCustomerArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<CustomerOptions>;
  where?: InputMaybe<CustomerWhere>;
};


export type AssessmentCustomerAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<CustomerWhere>;
};


export type AssessmentCustomerConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AssessmentCustomerConnectionSort>>;
  where?: InputMaybe<AssessmentCustomerConnectionWhere>;
};


export type AssessmentOwnerArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<UserOptions>;
  where?: InputMaybe<UserWhere>;
};


export type AssessmentOwnerAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<UserWhere>;
};


export type AssessmentOwnerConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AssessmentOwnerConnectionSort>>;
  where?: InputMaybe<AssessmentOwnerConnectionWhere>;
};


export type AssessmentQuestionsArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<QuestionnaireOptions>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type AssessmentQuestionsAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type AssessmentQuestionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AssessmentQuestionsConnectionSort>>;
  where?: InputMaybe<AssessmentQuestionsConnectionWhere>;
};


export type AssessmentResponsesArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<AssessmentResponseOptions>;
  where?: InputMaybe<AssessmentResponseWhere>;
};


export type AssessmentResponsesAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<AssessmentResponseWhere>;
};


export type AssessmentResponsesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AssessmentResponsesConnectionSort>>;
  where?: InputMaybe<AssessmentResponsesConnectionWhere>;
};


export type AssessmentTeamArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<UserOptions>;
  where?: InputMaybe<UserWhere>;
};


export type AssessmentTeamAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<UserWhere>;
};


export type AssessmentTeamConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AssessmentTeamConnectionSort>>;
  where?: InputMaybe<AssessmentTeamConnectionWhere>;
};

export type AssessmentAggregateSelection = {
  __typename?: 'AssessmentAggregateSelection';
  calculation: StringAggregateSelectionNonNullable;
  count: Scalars['Int']['output'];
  createdAt: DateTimeAggregateSelectionNullable;
  endDate: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  mode: StringAggregateSelectionNullable;
  questionsVersionId: IdAggregateSelectionNullable;
  startDate: DateTimeAggregateSelectionNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type AssessmentAssessmentResponseResponsesAggregationSelection = {
  __typename?: 'AssessmentAssessmentResponseResponsesAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<AssessmentAssessmentResponseResponsesNodeAggregateSelection>;
};

export type AssessmentAssessmentResponseResponsesNodeAggregateSelection = {
  __typename?: 'AssessmentAssessmentResponseResponsesNodeAggregateSelection';
  comment: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  response: StringAggregateSelectionNonNullable;
  token: StringAggregateSelectionNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type AssessmentConnectInput = {
  customer?: InputMaybe<AssessmentCustomerConnectFieldInput>;
  owner?: InputMaybe<AssessmentOwnerConnectFieldInput>;
  questions?: InputMaybe<AssessmentQuestionsConnectFieldInput>;
  responses?: InputMaybe<Array<AssessmentResponsesConnectFieldInput>>;
  team?: InputMaybe<Array<AssessmentTeamConnectFieldInput>>;
};

export type AssessmentConnectOrCreateInput = {
  customer?: InputMaybe<AssessmentCustomerConnectOrCreateFieldInput>;
  owner?: InputMaybe<AssessmentOwnerConnectOrCreateFieldInput>;
  questions?: InputMaybe<AssessmentQuestionsConnectOrCreateFieldInput>;
  responses?: InputMaybe<Array<AssessmentResponsesConnectOrCreateFieldInput>>;
  team?: InputMaybe<Array<AssessmentTeamConnectOrCreateFieldInput>>;
};

export type AssessmentConnectOrCreateWhere = {
  node: AssessmentUniqueWhere;
};

export type AssessmentConnectWhere = {
  node: AssessmentWhere;
};

export type AssessmentCreateInput = {
  active: Scalars['Boolean']['input'];
  calculation: Scalars['String']['input'];
  customer?: InputMaybe<AssessmentCustomerFieldInput>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<AssessmentOwnerFieldInput>;
  questions?: InputMaybe<AssessmentQuestionsFieldInput>;
  questionsVersionId?: InputMaybe<Scalars['ID']['input']>;
  responses?: InputMaybe<AssessmentResponsesFieldInput>;
  showResults?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  team?: InputMaybe<AssessmentTeamFieldInput>;
  title: Scalars['String']['input'];
};

export type AssessmentCustomerAggregateInput = {
  AND?: InputMaybe<Array<AssessmentCustomerAggregateInput>>;
  NOT?: InputMaybe<AssessmentCustomerAggregateInput>;
  OR?: InputMaybe<Array<AssessmentCustomerAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AssessmentCustomerNodeAggregationWhereInput>;
};

export type AssessmentCustomerConnectFieldInput = {
  connect?: InputMaybe<CustomerConnectInput>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<CustomerConnectWhere>;
};

export type AssessmentCustomerConnectOrCreateFieldInput = {
  onCreate: AssessmentCustomerConnectOrCreateFieldInputOnCreate;
  where: CustomerConnectOrCreateWhere;
};

export type AssessmentCustomerConnectOrCreateFieldInputOnCreate = {
  node: CustomerOnCreateInput;
};

export type AssessmentCustomerConnection = {
  __typename?: 'AssessmentCustomerConnection';
  edges: Array<AssessmentCustomerRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AssessmentCustomerConnectionSort = {
  node?: InputMaybe<CustomerSort>;
};

export type AssessmentCustomerConnectionWhere = {
  AND?: InputMaybe<Array<AssessmentCustomerConnectionWhere>>;
  NOT?: InputMaybe<AssessmentCustomerConnectionWhere>;
  OR?: InputMaybe<Array<AssessmentCustomerConnectionWhere>>;
  node?: InputMaybe<CustomerWhere>;
};

export type AssessmentCustomerCreateFieldInput = {
  node: CustomerCreateInput;
};

export type AssessmentCustomerCustomerAggregationSelection = {
  __typename?: 'AssessmentCustomerCustomerAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<AssessmentCustomerCustomerNodeAggregateSelection>;
};

export type AssessmentCustomerCustomerNodeAggregateSelection = {
  __typename?: 'AssessmentCustomerCustomerNodeAggregateSelection';
  contactEmail: StringAggregateSelectionNullable;
  contactName: StringAggregateSelectionNullable;
  contactPhone: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  industry: StringAggregateSelectionNullable;
  leadCountry: StringAggregateSelectionNullable;
  logo: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type AssessmentCustomerDeleteFieldInput = {
  delete?: InputMaybe<CustomerDeleteInput>;
  where?: InputMaybe<AssessmentCustomerConnectionWhere>;
};

export type AssessmentCustomerDisconnectFieldInput = {
  disconnect?: InputMaybe<CustomerDisconnectInput>;
  where?: InputMaybe<AssessmentCustomerConnectionWhere>;
};

export type AssessmentCustomerFieldInput = {
  connect?: InputMaybe<AssessmentCustomerConnectFieldInput>;
  connectOrCreate?: InputMaybe<AssessmentCustomerConnectOrCreateFieldInput>;
  create?: InputMaybe<AssessmentCustomerCreateFieldInput>;
};

export type AssessmentCustomerNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AssessmentCustomerNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AssessmentCustomerNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AssessmentCustomerNodeAggregationWhereInput>>;
  contactEmail_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  industry_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  industry_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  logo_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  logo_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  name_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AssessmentCustomerRelationship = {
  __typename?: 'AssessmentCustomerRelationship';
  cursor: Scalars['String']['output'];
  node: Customer;
};

export type AssessmentCustomerUpdateConnectionInput = {
  node?: InputMaybe<CustomerUpdateInput>;
};

export type AssessmentCustomerUpdateFieldInput = {
  connect?: InputMaybe<AssessmentCustomerConnectFieldInput>;
  connectOrCreate?: InputMaybe<AssessmentCustomerConnectOrCreateFieldInput>;
  create?: InputMaybe<AssessmentCustomerCreateFieldInput>;
  delete?: InputMaybe<AssessmentCustomerDeleteFieldInput>;
  disconnect?: InputMaybe<AssessmentCustomerDisconnectFieldInput>;
  update?: InputMaybe<AssessmentCustomerUpdateConnectionInput>;
  where?: InputMaybe<AssessmentCustomerConnectionWhere>;
};

export type AssessmentDeleteInput = {
  customer?: InputMaybe<AssessmentCustomerDeleteFieldInput>;
  owner?: InputMaybe<AssessmentOwnerDeleteFieldInput>;
  questions?: InputMaybe<AssessmentQuestionsDeleteFieldInput>;
  responses?: InputMaybe<Array<AssessmentResponsesDeleteFieldInput>>;
  team?: InputMaybe<Array<AssessmentTeamDeleteFieldInput>>;
};

export type AssessmentDisconnectInput = {
  customer?: InputMaybe<AssessmentCustomerDisconnectFieldInput>;
  owner?: InputMaybe<AssessmentOwnerDisconnectFieldInput>;
  questions?: InputMaybe<AssessmentQuestionsDisconnectFieldInput>;
  responses?: InputMaybe<Array<AssessmentResponsesDisconnectFieldInput>>;
  team?: InputMaybe<Array<AssessmentTeamDisconnectFieldInput>>;
};

export type AssessmentEdge = {
  __typename?: 'AssessmentEdge';
  cursor: Scalars['String']['output'];
  node: Assessment;
};

export type AssessmentOnCreateInput = {
  active: Scalars['Boolean']['input'];
  calculation: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  questionsVersionId?: InputMaybe<Scalars['ID']['input']>;
  showResults?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  title: Scalars['String']['input'];
};

export type AssessmentOptions = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Specify one or more AssessmentSort objects to sort Assessments by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<AssessmentSort>>;
};

export type AssessmentOwnerAggregateInput = {
  AND?: InputMaybe<Array<AssessmentOwnerAggregateInput>>;
  NOT?: InputMaybe<AssessmentOwnerAggregateInput>;
  OR?: InputMaybe<Array<AssessmentOwnerAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AssessmentOwnerNodeAggregationWhereInput>;
};

export type AssessmentOwnerConnectFieldInput = {
  connect?: InputMaybe<UserConnectInput>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<UserConnectWhere>;
};

export type AssessmentOwnerConnectOrCreateFieldInput = {
  onCreate: AssessmentOwnerConnectOrCreateFieldInputOnCreate;
  where: UserConnectOrCreateWhere;
};

export type AssessmentOwnerConnectOrCreateFieldInputOnCreate = {
  node: UserOnCreateInput;
};

export type AssessmentOwnerConnection = {
  __typename?: 'AssessmentOwnerConnection';
  edges: Array<AssessmentOwnerRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AssessmentOwnerConnectionSort = {
  node?: InputMaybe<UserSort>;
};

export type AssessmentOwnerConnectionWhere = {
  AND?: InputMaybe<Array<AssessmentOwnerConnectionWhere>>;
  NOT?: InputMaybe<AssessmentOwnerConnectionWhere>;
  OR?: InputMaybe<Array<AssessmentOwnerConnectionWhere>>;
  node?: InputMaybe<UserWhere>;
};

export type AssessmentOwnerCreateFieldInput = {
  node: UserCreateInput;
};

export type AssessmentOwnerDeleteFieldInput = {
  delete?: InputMaybe<UserDeleteInput>;
  where?: InputMaybe<AssessmentOwnerConnectionWhere>;
};

export type AssessmentOwnerDisconnectFieldInput = {
  disconnect?: InputMaybe<UserDisconnectInput>;
  where?: InputMaybe<AssessmentOwnerConnectionWhere>;
};

export type AssessmentOwnerFieldInput = {
  connect?: InputMaybe<AssessmentOwnerConnectFieldInput>;
  connectOrCreate?: InputMaybe<AssessmentOwnerConnectOrCreateFieldInput>;
  create?: InputMaybe<AssessmentOwnerCreateFieldInput>;
};

export type AssessmentOwnerNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AssessmentOwnerNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AssessmentOwnerNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AssessmentOwnerNodeAggregationWhereInput>>;
  assessmentFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  customerFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  email_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  name_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  picture_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  role_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AssessmentOwnerRelationship = {
  __typename?: 'AssessmentOwnerRelationship';
  cursor: Scalars['String']['output'];
  node: User;
};

export type AssessmentOwnerUpdateConnectionInput = {
  node?: InputMaybe<UserUpdateInput>;
};

export type AssessmentOwnerUpdateFieldInput = {
  connect?: InputMaybe<AssessmentOwnerConnectFieldInput>;
  connectOrCreate?: InputMaybe<AssessmentOwnerConnectOrCreateFieldInput>;
  create?: InputMaybe<AssessmentOwnerCreateFieldInput>;
  delete?: InputMaybe<AssessmentOwnerDeleteFieldInput>;
  disconnect?: InputMaybe<AssessmentOwnerDisconnectFieldInput>;
  update?: InputMaybe<AssessmentOwnerUpdateConnectionInput>;
  where?: InputMaybe<AssessmentOwnerConnectionWhere>;
};

export type AssessmentQuestionnaireQuestionsAggregationSelection = {
  __typename?: 'AssessmentQuestionnaireQuestionsAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<AssessmentQuestionnaireQuestionsNodeAggregateSelection>;
};

export type AssessmentQuestionnaireQuestionsNodeAggregateSelection = {
  __typename?: 'AssessmentQuestionnaireQuestionsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  questions: StringAggregateSelectionNonNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type AssessmentQuestionsAggregateInput = {
  AND?: InputMaybe<Array<AssessmentQuestionsAggregateInput>>;
  NOT?: InputMaybe<AssessmentQuestionsAggregateInput>;
  OR?: InputMaybe<Array<AssessmentQuestionsAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AssessmentQuestionsNodeAggregationWhereInput>;
};

export type AssessmentQuestionsConnectFieldInput = {
  connect?: InputMaybe<QuestionnaireConnectInput>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<QuestionnaireConnectWhere>;
};

export type AssessmentQuestionsConnectOrCreateFieldInput = {
  onCreate: AssessmentQuestionsConnectOrCreateFieldInputOnCreate;
  where: QuestionnaireConnectOrCreateWhere;
};

export type AssessmentQuestionsConnectOrCreateFieldInputOnCreate = {
  node: QuestionnaireOnCreateInput;
};

export type AssessmentQuestionsConnection = {
  __typename?: 'AssessmentQuestionsConnection';
  edges: Array<AssessmentQuestionsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AssessmentQuestionsConnectionSort = {
  node?: InputMaybe<QuestionnaireSort>;
};

export type AssessmentQuestionsConnectionWhere = {
  AND?: InputMaybe<Array<AssessmentQuestionsConnectionWhere>>;
  NOT?: InputMaybe<AssessmentQuestionsConnectionWhere>;
  OR?: InputMaybe<Array<AssessmentQuestionsConnectionWhere>>;
  node?: InputMaybe<QuestionnaireWhere>;
};

export type AssessmentQuestionsCreateFieldInput = {
  node: QuestionnaireCreateInput;
};

export type AssessmentQuestionsDeleteFieldInput = {
  delete?: InputMaybe<QuestionnaireDeleteInput>;
  where?: InputMaybe<AssessmentQuestionsConnectionWhere>;
};

export type AssessmentQuestionsDisconnectFieldInput = {
  disconnect?: InputMaybe<QuestionnaireDisconnectInput>;
  where?: InputMaybe<AssessmentQuestionsConnectionWhere>;
};

export type AssessmentQuestionsFieldInput = {
  connect?: InputMaybe<AssessmentQuestionsConnectFieldInput>;
  connectOrCreate?: InputMaybe<AssessmentQuestionsConnectOrCreateFieldInput>;
  create?: InputMaybe<AssessmentQuestionsCreateFieldInput>;
};

export type AssessmentQuestionsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AssessmentQuestionsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AssessmentQuestionsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AssessmentQuestionsNodeAggregationWhereInput>>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  questions_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questions_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  title_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AssessmentQuestionsRelationship = {
  __typename?: 'AssessmentQuestionsRelationship';
  cursor: Scalars['String']['output'];
  node: Questionnaire;
};

export type AssessmentQuestionsUpdateConnectionInput = {
  node?: InputMaybe<QuestionnaireUpdateInput>;
};

export type AssessmentQuestionsUpdateFieldInput = {
  connect?: InputMaybe<AssessmentQuestionsConnectFieldInput>;
  connectOrCreate?: InputMaybe<AssessmentQuestionsConnectOrCreateFieldInput>;
  create?: InputMaybe<AssessmentQuestionsCreateFieldInput>;
  delete?: InputMaybe<AssessmentQuestionsDeleteFieldInput>;
  disconnect?: InputMaybe<AssessmentQuestionsDisconnectFieldInput>;
  update?: InputMaybe<AssessmentQuestionsUpdateConnectionInput>;
  where?: InputMaybe<AssessmentQuestionsConnectionWhere>;
};

export type AssessmentRelationInput = {
  customer?: InputMaybe<AssessmentCustomerCreateFieldInput>;
  owner?: InputMaybe<AssessmentOwnerCreateFieldInput>;
  questions?: InputMaybe<AssessmentQuestionsCreateFieldInput>;
  responses?: InputMaybe<Array<AssessmentResponsesCreateFieldInput>>;
  team?: InputMaybe<Array<AssessmentTeamCreateFieldInput>>;
};

export type AssessmentResponse = {
  __typename?: 'AssessmentResponse';
  assessment: Assessment;
  assessmentAggregate?: Maybe<AssessmentResponseAssessmentAssessmentAggregationSelection>;
  assessmentConnection: AssessmentResponseAssessmentConnection;
  comment?: Maybe<Scalars['String']['output']>;
  completed?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  customer: Customer;
  customerAggregate?: Maybe<AssessmentResponseCustomerCustomerAggregationSelection>;
  customerConnection: AssessmentResponseCustomerConnection;
  date: Scalars['Date']['output'];
  expiration?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  response: Scalars['String']['output'];
  token?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type AssessmentResponseAssessmentArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<AssessmentOptions>;
  where?: InputMaybe<AssessmentWhere>;
};


export type AssessmentResponseAssessmentAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<AssessmentWhere>;
};


export type AssessmentResponseAssessmentConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AssessmentResponseAssessmentConnectionSort>>;
  where?: InputMaybe<AssessmentResponseAssessmentConnectionWhere>;
};


export type AssessmentResponseCustomerArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<CustomerOptions>;
  where?: InputMaybe<CustomerWhere>;
};


export type AssessmentResponseCustomerAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<CustomerWhere>;
};


export type AssessmentResponseCustomerConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AssessmentResponseCustomerConnectionSort>>;
  where?: InputMaybe<AssessmentResponseCustomerConnectionWhere>;
};

export type AssessmentResponseAggregateSelection = {
  __typename?: 'AssessmentResponseAggregateSelection';
  comment: StringAggregateSelectionNullable;
  count: Scalars['Int']['output'];
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  response: StringAggregateSelectionNonNullable;
  token: StringAggregateSelectionNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type AssessmentResponseAssessmentAggregateInput = {
  AND?: InputMaybe<Array<AssessmentResponseAssessmentAggregateInput>>;
  NOT?: InputMaybe<AssessmentResponseAssessmentAggregateInput>;
  OR?: InputMaybe<Array<AssessmentResponseAssessmentAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AssessmentResponseAssessmentNodeAggregationWhereInput>;
};

export type AssessmentResponseAssessmentAssessmentAggregationSelection = {
  __typename?: 'AssessmentResponseAssessmentAssessmentAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<AssessmentResponseAssessmentAssessmentNodeAggregateSelection>;
};

export type AssessmentResponseAssessmentAssessmentNodeAggregateSelection = {
  __typename?: 'AssessmentResponseAssessmentAssessmentNodeAggregateSelection';
  calculation: StringAggregateSelectionNonNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  endDate: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  mode: StringAggregateSelectionNullable;
  questionsVersionId: IdAggregateSelectionNullable;
  startDate: DateTimeAggregateSelectionNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type AssessmentResponseAssessmentConnectFieldInput = {
  connect?: InputMaybe<AssessmentConnectInput>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<AssessmentConnectWhere>;
};

export type AssessmentResponseAssessmentConnectOrCreateFieldInput = {
  onCreate: AssessmentResponseAssessmentConnectOrCreateFieldInputOnCreate;
  where: AssessmentConnectOrCreateWhere;
};

export type AssessmentResponseAssessmentConnectOrCreateFieldInputOnCreate = {
  node: AssessmentOnCreateInput;
};

export type AssessmentResponseAssessmentConnection = {
  __typename?: 'AssessmentResponseAssessmentConnection';
  edges: Array<AssessmentResponseAssessmentRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AssessmentResponseAssessmentConnectionSort = {
  node?: InputMaybe<AssessmentSort>;
};

export type AssessmentResponseAssessmentConnectionWhere = {
  AND?: InputMaybe<Array<AssessmentResponseAssessmentConnectionWhere>>;
  NOT?: InputMaybe<AssessmentResponseAssessmentConnectionWhere>;
  OR?: InputMaybe<Array<AssessmentResponseAssessmentConnectionWhere>>;
  node?: InputMaybe<AssessmentWhere>;
};

export type AssessmentResponseAssessmentCreateFieldInput = {
  node: AssessmentCreateInput;
};

export type AssessmentResponseAssessmentDeleteFieldInput = {
  delete?: InputMaybe<AssessmentDeleteInput>;
  where?: InputMaybe<AssessmentResponseAssessmentConnectionWhere>;
};

export type AssessmentResponseAssessmentDisconnectFieldInput = {
  disconnect?: InputMaybe<AssessmentDisconnectInput>;
  where?: InputMaybe<AssessmentResponseAssessmentConnectionWhere>;
};

export type AssessmentResponseAssessmentFieldInput = {
  connect?: InputMaybe<AssessmentResponseAssessmentConnectFieldInput>;
  connectOrCreate?: InputMaybe<AssessmentResponseAssessmentConnectOrCreateFieldInput>;
  create?: InputMaybe<AssessmentResponseAssessmentCreateFieldInput>;
};

export type AssessmentResponseAssessmentNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AssessmentResponseAssessmentNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AssessmentResponseAssessmentNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AssessmentResponseAssessmentNodeAggregationWhereInput>>;
  calculation_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  calculation_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  mode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  mode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  startDate_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  title_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  title_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AssessmentResponseAssessmentRelationship = {
  __typename?: 'AssessmentResponseAssessmentRelationship';
  cursor: Scalars['String']['output'];
  node: Assessment;
};

export type AssessmentResponseAssessmentUpdateConnectionInput = {
  node?: InputMaybe<AssessmentUpdateInput>;
};

export type AssessmentResponseAssessmentUpdateFieldInput = {
  connect?: InputMaybe<AssessmentResponseAssessmentConnectFieldInput>;
  connectOrCreate?: InputMaybe<AssessmentResponseAssessmentConnectOrCreateFieldInput>;
  create?: InputMaybe<AssessmentResponseAssessmentCreateFieldInput>;
  delete?: InputMaybe<AssessmentResponseAssessmentDeleteFieldInput>;
  disconnect?: InputMaybe<AssessmentResponseAssessmentDisconnectFieldInput>;
  update?: InputMaybe<AssessmentResponseAssessmentUpdateConnectionInput>;
  where?: InputMaybe<AssessmentResponseAssessmentConnectionWhere>;
};

export type AssessmentResponseConnectInput = {
  assessment?: InputMaybe<AssessmentResponseAssessmentConnectFieldInput>;
  customer?: InputMaybe<AssessmentResponseCustomerConnectFieldInput>;
};

export type AssessmentResponseConnectOrCreateInput = {
  assessment?: InputMaybe<AssessmentResponseAssessmentConnectOrCreateFieldInput>;
  customer?: InputMaybe<AssessmentResponseCustomerConnectOrCreateFieldInput>;
};

export type AssessmentResponseConnectOrCreateWhere = {
  node: AssessmentResponseUniqueWhere;
};

export type AssessmentResponseConnectWhere = {
  node: AssessmentResponseWhere;
};

export type AssessmentResponseCreateInput = {
  assessment?: InputMaybe<AssessmentResponseAssessmentFieldInput>;
  comment?: InputMaybe<Scalars['String']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  customer?: InputMaybe<AssessmentResponseCustomerFieldInput>;
  date: Scalars['Date']['input'];
  expiration?: InputMaybe<Scalars['Date']['input']>;
  response: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
};

export type AssessmentResponseCustomerAggregateInput = {
  AND?: InputMaybe<Array<AssessmentResponseCustomerAggregateInput>>;
  NOT?: InputMaybe<AssessmentResponseCustomerAggregateInput>;
  OR?: InputMaybe<Array<AssessmentResponseCustomerAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AssessmentResponseCustomerNodeAggregationWhereInput>;
};

export type AssessmentResponseCustomerConnectFieldInput = {
  connect?: InputMaybe<CustomerConnectInput>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<CustomerConnectWhere>;
};

export type AssessmentResponseCustomerConnectOrCreateFieldInput = {
  onCreate: AssessmentResponseCustomerConnectOrCreateFieldInputOnCreate;
  where: CustomerConnectOrCreateWhere;
};

export type AssessmentResponseCustomerConnectOrCreateFieldInputOnCreate = {
  node: CustomerOnCreateInput;
};

export type AssessmentResponseCustomerConnection = {
  __typename?: 'AssessmentResponseCustomerConnection';
  edges: Array<AssessmentResponseCustomerRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AssessmentResponseCustomerConnectionSort = {
  node?: InputMaybe<CustomerSort>;
};

export type AssessmentResponseCustomerConnectionWhere = {
  AND?: InputMaybe<Array<AssessmentResponseCustomerConnectionWhere>>;
  NOT?: InputMaybe<AssessmentResponseCustomerConnectionWhere>;
  OR?: InputMaybe<Array<AssessmentResponseCustomerConnectionWhere>>;
  node?: InputMaybe<CustomerWhere>;
};

export type AssessmentResponseCustomerCreateFieldInput = {
  node: CustomerCreateInput;
};

export type AssessmentResponseCustomerCustomerAggregationSelection = {
  __typename?: 'AssessmentResponseCustomerCustomerAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<AssessmentResponseCustomerCustomerNodeAggregateSelection>;
};

export type AssessmentResponseCustomerCustomerNodeAggregateSelection = {
  __typename?: 'AssessmentResponseCustomerCustomerNodeAggregateSelection';
  contactEmail: StringAggregateSelectionNullable;
  contactName: StringAggregateSelectionNullable;
  contactPhone: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  industry: StringAggregateSelectionNullable;
  leadCountry: StringAggregateSelectionNullable;
  logo: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type AssessmentResponseCustomerDeleteFieldInput = {
  delete?: InputMaybe<CustomerDeleteInput>;
  where?: InputMaybe<AssessmentResponseCustomerConnectionWhere>;
};

export type AssessmentResponseCustomerDisconnectFieldInput = {
  disconnect?: InputMaybe<CustomerDisconnectInput>;
  where?: InputMaybe<AssessmentResponseCustomerConnectionWhere>;
};

export type AssessmentResponseCustomerFieldInput = {
  connect?: InputMaybe<AssessmentResponseCustomerConnectFieldInput>;
  connectOrCreate?: InputMaybe<AssessmentResponseCustomerConnectOrCreateFieldInput>;
  create?: InputMaybe<AssessmentResponseCustomerCreateFieldInput>;
};

export type AssessmentResponseCustomerNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AssessmentResponseCustomerNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AssessmentResponseCustomerNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AssessmentResponseCustomerNodeAggregationWhereInput>>;
  contactEmail_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  industry_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  industry_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  logo_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  logo_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  name_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AssessmentResponseCustomerRelationship = {
  __typename?: 'AssessmentResponseCustomerRelationship';
  cursor: Scalars['String']['output'];
  node: Customer;
};

export type AssessmentResponseCustomerUpdateConnectionInput = {
  node?: InputMaybe<CustomerUpdateInput>;
};

export type AssessmentResponseCustomerUpdateFieldInput = {
  connect?: InputMaybe<AssessmentResponseCustomerConnectFieldInput>;
  connectOrCreate?: InputMaybe<AssessmentResponseCustomerConnectOrCreateFieldInput>;
  create?: InputMaybe<AssessmentResponseCustomerCreateFieldInput>;
  delete?: InputMaybe<AssessmentResponseCustomerDeleteFieldInput>;
  disconnect?: InputMaybe<AssessmentResponseCustomerDisconnectFieldInput>;
  update?: InputMaybe<AssessmentResponseCustomerUpdateConnectionInput>;
  where?: InputMaybe<AssessmentResponseCustomerConnectionWhere>;
};

export type AssessmentResponseDeleteInput = {
  assessment?: InputMaybe<AssessmentResponseAssessmentDeleteFieldInput>;
  customer?: InputMaybe<AssessmentResponseCustomerDeleteFieldInput>;
};

export type AssessmentResponseDisconnectInput = {
  assessment?: InputMaybe<AssessmentResponseAssessmentDisconnectFieldInput>;
  customer?: InputMaybe<AssessmentResponseCustomerDisconnectFieldInput>;
};

export type AssessmentResponseEdge = {
  __typename?: 'AssessmentResponseEdge';
  cursor: Scalars['String']['output'];
  node: AssessmentResponse;
};

export type AssessmentResponseOnCreateInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  date: Scalars['Date']['input'];
  expiration?: InputMaybe<Scalars['Date']['input']>;
  response: Scalars['String']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
};

export type AssessmentResponseOptions = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Specify one or more AssessmentResponseSort objects to sort AssessmentResponses by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<AssessmentResponseSort>>;
};

export type AssessmentResponseRelationInput = {
  assessment?: InputMaybe<AssessmentResponseAssessmentCreateFieldInput>;
  customer?: InputMaybe<AssessmentResponseCustomerCreateFieldInput>;
};

/** Fields to sort AssessmentResponses by. The order in which sorts are applied is not guaranteed when specifying many fields in one AssessmentResponseSort object. */
export type AssessmentResponseSort = {
  comment?: InputMaybe<SortDirection>;
  completed?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  date?: InputMaybe<SortDirection>;
  expiration?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  response?: InputMaybe<SortDirection>;
  token?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type AssessmentResponseUniqueWhere = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type AssessmentResponseUpdateInput = {
  assessment?: InputMaybe<AssessmentResponseAssessmentUpdateFieldInput>;
  comment?: InputMaybe<Scalars['String']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  customer?: InputMaybe<AssessmentResponseCustomerUpdateFieldInput>;
  date?: InputMaybe<Scalars['Date']['input']>;
  expiration?: InputMaybe<Scalars['Date']['input']>;
  response?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
};

export type AssessmentResponseWhere = {
  AND?: InputMaybe<Array<AssessmentResponseWhere>>;
  NOT?: InputMaybe<AssessmentResponseWhere>;
  OR?: InputMaybe<Array<AssessmentResponseWhere>>;
  assessment?: InputMaybe<AssessmentWhere>;
  assessmentAggregate?: InputMaybe<AssessmentResponseAssessmentAggregateInput>;
  assessmentConnection?: InputMaybe<AssessmentResponseAssessmentConnectionWhere>;
  assessmentConnection_NOT?: InputMaybe<AssessmentResponseAssessmentConnectionWhere>;
  assessment_NOT?: InputMaybe<AssessmentWhere>;
  comment?: InputMaybe<Scalars['String']['input']>;
  comment_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  comment_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  comment_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  comment_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  createdAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  customer?: InputMaybe<CustomerWhere>;
  customerAggregate?: InputMaybe<AssessmentResponseCustomerAggregateInput>;
  customerConnection?: InputMaybe<AssessmentResponseCustomerConnectionWhere>;
  customerConnection_NOT?: InputMaybe<AssessmentResponseCustomerConnectionWhere>;
  customer_NOT?: InputMaybe<CustomerWhere>;
  date?: InputMaybe<Scalars['Date']['input']>;
  date_GT?: InputMaybe<Scalars['Date']['input']>;
  date_GTE?: InputMaybe<Scalars['Date']['input']>;
  date_IN?: InputMaybe<Array<Scalars['Date']['input']>>;
  date_LT?: InputMaybe<Scalars['Date']['input']>;
  date_LTE?: InputMaybe<Scalars['Date']['input']>;
  expiration?: InputMaybe<Scalars['Date']['input']>;
  expiration_GT?: InputMaybe<Scalars['Date']['input']>;
  expiration_GTE?: InputMaybe<Scalars['Date']['input']>;
  expiration_IN?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  expiration_LT?: InputMaybe<Scalars['Date']['input']>;
  expiration_LTE?: InputMaybe<Scalars['Date']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_CONTAINS?: InputMaybe<Scalars['ID']['input']>;
  id_ENDS_WITH?: InputMaybe<Scalars['ID']['input']>;
  id_IN?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_STARTS_WITH?: InputMaybe<Scalars['ID']['input']>;
  response?: InputMaybe<Scalars['String']['input']>;
  response_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  response_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  response_IN?: InputMaybe<Array<Scalars['String']['input']>>;
  response_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  token_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  token_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  token_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  updatedAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AssessmentResponsesAggregateInput = {
  AND?: InputMaybe<Array<AssessmentResponsesAggregateInput>>;
  NOT?: InputMaybe<AssessmentResponsesAggregateInput>;
  OR?: InputMaybe<Array<AssessmentResponsesAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AssessmentResponsesNodeAggregationWhereInput>;
};

export type AssessmentResponsesConnectFieldInput = {
  connect?: InputMaybe<Array<AssessmentResponseConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<AssessmentResponseConnectWhere>;
};

export type AssessmentResponsesConnectOrCreateFieldInput = {
  onCreate: AssessmentResponsesConnectOrCreateFieldInputOnCreate;
  where: AssessmentResponseConnectOrCreateWhere;
};

export type AssessmentResponsesConnectOrCreateFieldInputOnCreate = {
  node: AssessmentResponseOnCreateInput;
};

export type AssessmentResponsesConnection = {
  __typename?: 'AssessmentResponsesConnection';
  edges: Array<AssessmentResponsesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AssessmentResponsesConnectionSort = {
  node?: InputMaybe<AssessmentResponseSort>;
};

export type AssessmentResponsesConnectionWhere = {
  AND?: InputMaybe<Array<AssessmentResponsesConnectionWhere>>;
  NOT?: InputMaybe<AssessmentResponsesConnectionWhere>;
  OR?: InputMaybe<Array<AssessmentResponsesConnectionWhere>>;
  node?: InputMaybe<AssessmentResponseWhere>;
};

export type AssessmentResponsesCreateFieldInput = {
  node: AssessmentResponseCreateInput;
};

export type AssessmentResponsesDeleteFieldInput = {
  delete?: InputMaybe<AssessmentResponseDeleteInput>;
  where?: InputMaybe<AssessmentResponsesConnectionWhere>;
};

export type AssessmentResponsesDisconnectFieldInput = {
  disconnect?: InputMaybe<AssessmentResponseDisconnectInput>;
  where?: InputMaybe<AssessmentResponsesConnectionWhere>;
};

export type AssessmentResponsesFieldInput = {
  connect?: InputMaybe<Array<AssessmentResponsesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<AssessmentResponsesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<AssessmentResponsesCreateFieldInput>>;
};

export type AssessmentResponsesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AssessmentResponsesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AssessmentResponsesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AssessmentResponsesNodeAggregationWhereInput>>;
  comment_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  comment_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  comment_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  comment_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  comment_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  comment_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  comment_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  comment_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  comment_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  comment_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  comment_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  comment_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  comment_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  comment_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  comment_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  response_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  response_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  response_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  response_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  response_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  response_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  response_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  response_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  response_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  response_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  response_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  response_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  response_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  response_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  response_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  token_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  token_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  token_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  token_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  token_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  token_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  token_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  token_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  token_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  token_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  token_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  token_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  token_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  token_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  token_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AssessmentResponsesRelationship = {
  __typename?: 'AssessmentResponsesRelationship';
  cursor: Scalars['String']['output'];
  node: AssessmentResponse;
};

export type AssessmentResponsesUpdateConnectionInput = {
  node?: InputMaybe<AssessmentResponseUpdateInput>;
};

export type AssessmentResponsesUpdateFieldInput = {
  connect?: InputMaybe<Array<AssessmentResponsesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<AssessmentResponsesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<AssessmentResponsesCreateFieldInput>>;
  delete?: InputMaybe<Array<AssessmentResponsesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AssessmentResponsesDisconnectFieldInput>>;
  update?: InputMaybe<AssessmentResponsesUpdateConnectionInput>;
  where?: InputMaybe<AssessmentResponsesConnectionWhere>;
};

/** Fields to sort Assessments by. The order in which sorts are applied is not guaranteed when specifying many fields in one AssessmentSort object. */
export type AssessmentSort = {
  active?: InputMaybe<SortDirection>;
  calculation?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  endDate?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  mode?: InputMaybe<SortDirection>;
  questionsVersionId?: InputMaybe<SortDirection>;
  showResults?: InputMaybe<SortDirection>;
  startDate?: InputMaybe<SortDirection>;
  title?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type AssessmentTeamAggregateInput = {
  AND?: InputMaybe<Array<AssessmentTeamAggregateInput>>;
  NOT?: InputMaybe<AssessmentTeamAggregateInput>;
  OR?: InputMaybe<Array<AssessmentTeamAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<AssessmentTeamNodeAggregationWhereInput>;
};

export type AssessmentTeamConnectFieldInput = {
  connect?: InputMaybe<Array<UserConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<UserConnectWhere>;
};

export type AssessmentTeamConnectOrCreateFieldInput = {
  onCreate: AssessmentTeamConnectOrCreateFieldInputOnCreate;
  where: UserConnectOrCreateWhere;
};

export type AssessmentTeamConnectOrCreateFieldInputOnCreate = {
  node: UserOnCreateInput;
};

export type AssessmentTeamConnection = {
  __typename?: 'AssessmentTeamConnection';
  edges: Array<AssessmentTeamRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AssessmentTeamConnectionSort = {
  node?: InputMaybe<UserSort>;
};

export type AssessmentTeamConnectionWhere = {
  AND?: InputMaybe<Array<AssessmentTeamConnectionWhere>>;
  NOT?: InputMaybe<AssessmentTeamConnectionWhere>;
  OR?: InputMaybe<Array<AssessmentTeamConnectionWhere>>;
  node?: InputMaybe<UserWhere>;
};

export type AssessmentTeamCreateFieldInput = {
  node: UserCreateInput;
};

export type AssessmentTeamDeleteFieldInput = {
  delete?: InputMaybe<UserDeleteInput>;
  where?: InputMaybe<AssessmentTeamConnectionWhere>;
};

export type AssessmentTeamDisconnectFieldInput = {
  disconnect?: InputMaybe<UserDisconnectInput>;
  where?: InputMaybe<AssessmentTeamConnectionWhere>;
};

export type AssessmentTeamFieldInput = {
  connect?: InputMaybe<Array<AssessmentTeamConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<AssessmentTeamConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<AssessmentTeamCreateFieldInput>>;
};

export type AssessmentTeamNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<AssessmentTeamNodeAggregationWhereInput>>;
  NOT?: InputMaybe<AssessmentTeamNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<AssessmentTeamNodeAggregationWhereInput>>;
  assessmentFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  customerFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  email_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  name_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  picture_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  role_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AssessmentTeamRelationship = {
  __typename?: 'AssessmentTeamRelationship';
  cursor: Scalars['String']['output'];
  node: User;
};

export type AssessmentTeamUpdateConnectionInput = {
  node?: InputMaybe<UserUpdateInput>;
};

export type AssessmentTeamUpdateFieldInput = {
  connect?: InputMaybe<Array<AssessmentTeamConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<AssessmentTeamConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<AssessmentTeamCreateFieldInput>>;
  delete?: InputMaybe<Array<AssessmentTeamDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<AssessmentTeamDisconnectFieldInput>>;
  update?: InputMaybe<AssessmentTeamUpdateConnectionInput>;
  where?: InputMaybe<AssessmentTeamConnectionWhere>;
};

export type AssessmentUniqueWhere = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type AssessmentUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  calculation?: InputMaybe<Scalars['String']['input']>;
  customer?: InputMaybe<AssessmentCustomerUpdateFieldInput>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<AssessmentOwnerUpdateFieldInput>;
  questions?: InputMaybe<AssessmentQuestionsUpdateFieldInput>;
  questionsVersionId?: InputMaybe<Scalars['ID']['input']>;
  responses?: InputMaybe<Array<AssessmentResponsesUpdateFieldInput>>;
  showResults?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  team?: InputMaybe<Array<AssessmentTeamUpdateFieldInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type AssessmentUserOwnerAggregationSelection = {
  __typename?: 'AssessmentUserOwnerAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<AssessmentUserOwnerNodeAggregateSelection>;
};

export type AssessmentUserOwnerNodeAggregateSelection = {
  __typename?: 'AssessmentUserOwnerNodeAggregateSelection';
  assessmentFilter: StringAggregateSelectionNullable;
  assessmentSort: StringAggregateSelectionNullable;
  colorMode: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  customerFilter: StringAggregateSelectionNullable;
  customerSort: StringAggregateSelectionNullable;
  email: StringAggregateSelectionNonNullable;
  firstName: StringAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  keycloakId: IdAggregateSelectionNullable;
  lastName: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNullable;
  picture: StringAggregateSelectionNullable;
  questionnaireSort: StringAggregateSelectionNullable;
  role: StringAggregateSelectionNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type AssessmentUserTeamAggregationSelection = {
  __typename?: 'AssessmentUserTeamAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<AssessmentUserTeamNodeAggregateSelection>;
};

export type AssessmentUserTeamNodeAggregateSelection = {
  __typename?: 'AssessmentUserTeamNodeAggregateSelection';
  assessmentFilter: StringAggregateSelectionNullable;
  assessmentSort: StringAggregateSelectionNullable;
  colorMode: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  customerFilter: StringAggregateSelectionNullable;
  customerSort: StringAggregateSelectionNullable;
  email: StringAggregateSelectionNonNullable;
  firstName: StringAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  keycloakId: IdAggregateSelectionNullable;
  lastName: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNullable;
  picture: StringAggregateSelectionNullable;
  questionnaireSort: StringAggregateSelectionNullable;
  role: StringAggregateSelectionNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type AssessmentWhere = {
  AND?: InputMaybe<Array<AssessmentWhere>>;
  NOT?: InputMaybe<AssessmentWhere>;
  OR?: InputMaybe<Array<AssessmentWhere>>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  calculation?: InputMaybe<Scalars['String']['input']>;
  calculation_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  calculation_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  calculation_IN?: InputMaybe<Array<Scalars['String']['input']>>;
  calculation_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  createdAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  customer?: InputMaybe<CustomerWhere>;
  customerAggregate?: InputMaybe<AssessmentCustomerAggregateInput>;
  customerConnection?: InputMaybe<AssessmentCustomerConnectionWhere>;
  customerConnection_NOT?: InputMaybe<AssessmentCustomerConnectionWhere>;
  customer_NOT?: InputMaybe<CustomerWhere>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  endDate_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_CONTAINS?: InputMaybe<Scalars['ID']['input']>;
  id_ENDS_WITH?: InputMaybe<Scalars['ID']['input']>;
  id_IN?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_STARTS_WITH?: InputMaybe<Scalars['ID']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  mode_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  mode_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  mode_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  mode_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<UserWhere>;
  ownerAggregate?: InputMaybe<AssessmentOwnerAggregateInput>;
  ownerConnection?: InputMaybe<AssessmentOwnerConnectionWhere>;
  ownerConnection_NOT?: InputMaybe<AssessmentOwnerConnectionWhere>;
  owner_NOT?: InputMaybe<UserWhere>;
  questions?: InputMaybe<QuestionnaireWhere>;
  questionsAggregate?: InputMaybe<AssessmentQuestionsAggregateInput>;
  questionsConnection?: InputMaybe<AssessmentQuestionsConnectionWhere>;
  questionsConnection_NOT?: InputMaybe<AssessmentQuestionsConnectionWhere>;
  questionsVersionId?: InputMaybe<Scalars['ID']['input']>;
  questionsVersionId_CONTAINS?: InputMaybe<Scalars['ID']['input']>;
  questionsVersionId_ENDS_WITH?: InputMaybe<Scalars['ID']['input']>;
  questionsVersionId_IN?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  questionsVersionId_STARTS_WITH?: InputMaybe<Scalars['ID']['input']>;
  questions_NOT?: InputMaybe<QuestionnaireWhere>;
  responsesAggregate?: InputMaybe<AssessmentResponsesAggregateInput>;
  /** Return Assessments where all of the related AssessmentResponsesConnections match this filter */
  responsesConnection_ALL?: InputMaybe<AssessmentResponsesConnectionWhere>;
  /** Return Assessments where none of the related AssessmentResponsesConnections match this filter */
  responsesConnection_NONE?: InputMaybe<AssessmentResponsesConnectionWhere>;
  /** Return Assessments where one of the related AssessmentResponsesConnections match this filter */
  responsesConnection_SINGLE?: InputMaybe<AssessmentResponsesConnectionWhere>;
  /** Return Assessments where some of the related AssessmentResponsesConnections match this filter */
  responsesConnection_SOME?: InputMaybe<AssessmentResponsesConnectionWhere>;
  /** Return Assessments where all of the related AssessmentResponses match this filter */
  responses_ALL?: InputMaybe<AssessmentResponseWhere>;
  /** Return Assessments where none of the related AssessmentResponses match this filter */
  responses_NONE?: InputMaybe<AssessmentResponseWhere>;
  /** Return Assessments where one of the related AssessmentResponses match this filter */
  responses_SINGLE?: InputMaybe<AssessmentResponseWhere>;
  /** Return Assessments where some of the related AssessmentResponses match this filter */
  responses_SOME?: InputMaybe<AssessmentResponseWhere>;
  showResults?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  startDate_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  teamAggregate?: InputMaybe<AssessmentTeamAggregateInput>;
  /** Return Assessments where all of the related AssessmentTeamConnections match this filter */
  teamConnection_ALL?: InputMaybe<AssessmentTeamConnectionWhere>;
  /** Return Assessments where none of the related AssessmentTeamConnections match this filter */
  teamConnection_NONE?: InputMaybe<AssessmentTeamConnectionWhere>;
  /** Return Assessments where one of the related AssessmentTeamConnections match this filter */
  teamConnection_SINGLE?: InputMaybe<AssessmentTeamConnectionWhere>;
  /** Return Assessments where some of the related AssessmentTeamConnections match this filter */
  teamConnection_SOME?: InputMaybe<AssessmentTeamConnectionWhere>;
  /** Return Assessments where all of the related Users match this filter */
  team_ALL?: InputMaybe<UserWhere>;
  /** Return Assessments where none of the related Users match this filter */
  team_NONE?: InputMaybe<UserWhere>;
  /** Return Assessments where one of the related Users match this filter */
  team_SINGLE?: InputMaybe<UserWhere>;
  /** Return Assessments where some of the related Users match this filter */
  team_SOME?: InputMaybe<UserWhere>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  title_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  title_IN?: InputMaybe<Array<Scalars['String']['input']>>;
  title_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  updatedAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AssessmentsConnection = {
  __typename?: 'AssessmentsConnection';
  edges: Array<AssessmentEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CreateAssessmentResponsesMutationResponse = {
  __typename?: 'CreateAssessmentResponsesMutationResponse';
  assessmentResponses: Array<AssessmentResponse>;
  info: CreateInfo;
};

export type CreateAssessmentsMutationResponse = {
  __typename?: 'CreateAssessmentsMutationResponse';
  assessments: Array<Assessment>;
  info: CreateInfo;
};

export type CreateCustomersMutationResponse = {
  __typename?: 'CreateCustomersMutationResponse';
  customers: Array<Customer>;
  info: CreateInfo;
};

export type CreateInfo = {
  __typename?: 'CreateInfo';
  bookmark?: Maybe<Scalars['String']['output']>;
  nodesCreated: Scalars['Int']['output'];
  relationshipsCreated: Scalars['Int']['output'];
};

export type CreateQuestionnaireVersionsMutationResponse = {
  __typename?: 'CreateQuestionnaireVersionsMutationResponse';
  info: CreateInfo;
  questionnaireVersions: Array<QuestionnaireVersion>;
};

export type CreateQuestionnairesMutationResponse = {
  __typename?: 'CreateQuestionnairesMutationResponse';
  info: CreateInfo;
  questionnaires: Array<Questionnaire>;
};

export type CreateUsersMutationResponse = {
  __typename?: 'CreateUsersMutationResponse';
  info: CreateInfo;
  users: Array<User>;
};

export type Customer = {
  __typename?: 'Customer';
  assessments: Array<Assessment>;
  assessmentsAggregate?: Maybe<CustomerAssessmentAssessmentsAggregationSelection>;
  assessmentsConnection: CustomerAssessmentsConnection;
  contactEmail?: Maybe<Scalars['String']['output']>;
  contactName?: Maybe<Scalars['String']['output']>;
  contactPhone?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  industry?: Maybe<Scalars['String']['output']>;
  leadCountry?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  organization?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  owner?: Maybe<User>;
  ownerAggregate?: Maybe<CustomerUserOwnerAggregationSelection>;
  ownerConnection: CustomerOwnerConnection;
  responses: Array<AssessmentResponse>;
  responsesAggregate?: Maybe<CustomerAssessmentResponseResponsesAggregationSelection>;
  responsesConnection: CustomerResponsesConnection;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  users: Array<User>;
  usersAggregate?: Maybe<CustomerUserUsersAggregationSelection>;
  usersConnection: CustomerUsersConnection;
};


export type CustomerAssessmentsArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<AssessmentOptions>;
  where?: InputMaybe<AssessmentWhere>;
};


export type CustomerAssessmentsAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<AssessmentWhere>;
};


export type CustomerAssessmentsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CustomerAssessmentsConnectionSort>>;
  where?: InputMaybe<CustomerAssessmentsConnectionWhere>;
};


export type CustomerOwnerArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<UserOptions>;
  where?: InputMaybe<UserWhere>;
};


export type CustomerOwnerAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<UserWhere>;
};


export type CustomerOwnerConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CustomerOwnerConnectionSort>>;
  where?: InputMaybe<CustomerOwnerConnectionWhere>;
};


export type CustomerResponsesArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<AssessmentResponseOptions>;
  where?: InputMaybe<AssessmentResponseWhere>;
};


export type CustomerResponsesAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<AssessmentResponseWhere>;
};


export type CustomerResponsesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CustomerResponsesConnectionSort>>;
  where?: InputMaybe<CustomerResponsesConnectionWhere>;
};


export type CustomerUsersArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<UserOptions>;
  where?: InputMaybe<UserWhere>;
};


export type CustomerUsersAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<UserWhere>;
};


export type CustomerUsersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CustomerUsersConnectionSort>>;
  where?: InputMaybe<CustomerUsersConnectionWhere>;
};

export type CustomerAggregateSelection = {
  __typename?: 'CustomerAggregateSelection';
  contactEmail: StringAggregateSelectionNullable;
  contactName: StringAggregateSelectionNullable;
  contactPhone: StringAggregateSelectionNullable;
  count: Scalars['Int']['output'];
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  industry: StringAggregateSelectionNullable;
  leadCountry: StringAggregateSelectionNullable;
  logo: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type CustomerAssessmentAssessmentsAggregationSelection = {
  __typename?: 'CustomerAssessmentAssessmentsAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<CustomerAssessmentAssessmentsNodeAggregateSelection>;
};

export type CustomerAssessmentAssessmentsNodeAggregateSelection = {
  __typename?: 'CustomerAssessmentAssessmentsNodeAggregateSelection';
  calculation: StringAggregateSelectionNonNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  endDate: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  mode: StringAggregateSelectionNullable;
  questionsVersionId: IdAggregateSelectionNullable;
  startDate: DateTimeAggregateSelectionNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type CustomerAssessmentResponseResponsesAggregationSelection = {
  __typename?: 'CustomerAssessmentResponseResponsesAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<CustomerAssessmentResponseResponsesNodeAggregateSelection>;
};

export type CustomerAssessmentResponseResponsesNodeAggregateSelection = {
  __typename?: 'CustomerAssessmentResponseResponsesNodeAggregateSelection';
  comment: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  response: StringAggregateSelectionNonNullable;
  token: StringAggregateSelectionNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type CustomerAssessmentsAggregateInput = {
  AND?: InputMaybe<Array<CustomerAssessmentsAggregateInput>>;
  NOT?: InputMaybe<CustomerAssessmentsAggregateInput>;
  OR?: InputMaybe<Array<CustomerAssessmentsAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CustomerAssessmentsNodeAggregationWhereInput>;
};

export type CustomerAssessmentsConnectFieldInput = {
  connect?: InputMaybe<Array<AssessmentConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<AssessmentConnectWhere>;
};

export type CustomerAssessmentsConnectOrCreateFieldInput = {
  onCreate: CustomerAssessmentsConnectOrCreateFieldInputOnCreate;
  where: AssessmentConnectOrCreateWhere;
};

export type CustomerAssessmentsConnectOrCreateFieldInputOnCreate = {
  node: AssessmentOnCreateInput;
};

export type CustomerAssessmentsConnection = {
  __typename?: 'CustomerAssessmentsConnection';
  edges: Array<CustomerAssessmentsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CustomerAssessmentsConnectionSort = {
  node?: InputMaybe<AssessmentSort>;
};

export type CustomerAssessmentsConnectionWhere = {
  AND?: InputMaybe<Array<CustomerAssessmentsConnectionWhere>>;
  NOT?: InputMaybe<CustomerAssessmentsConnectionWhere>;
  OR?: InputMaybe<Array<CustomerAssessmentsConnectionWhere>>;
  node?: InputMaybe<AssessmentWhere>;
};

export type CustomerAssessmentsCreateFieldInput = {
  node: AssessmentCreateInput;
};

export type CustomerAssessmentsDeleteFieldInput = {
  delete?: InputMaybe<AssessmentDeleteInput>;
  where?: InputMaybe<CustomerAssessmentsConnectionWhere>;
};

export type CustomerAssessmentsDisconnectFieldInput = {
  disconnect?: InputMaybe<AssessmentDisconnectInput>;
  where?: InputMaybe<CustomerAssessmentsConnectionWhere>;
};

export type CustomerAssessmentsFieldInput = {
  connect?: InputMaybe<Array<CustomerAssessmentsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<CustomerAssessmentsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<CustomerAssessmentsCreateFieldInput>>;
};

export type CustomerAssessmentsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CustomerAssessmentsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CustomerAssessmentsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CustomerAssessmentsNodeAggregationWhereInput>>;
  calculation_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  calculation_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  mode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  mode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  startDate_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  title_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  title_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CustomerAssessmentsRelationship = {
  __typename?: 'CustomerAssessmentsRelationship';
  cursor: Scalars['String']['output'];
  node: Assessment;
};

export type CustomerAssessmentsUpdateConnectionInput = {
  node?: InputMaybe<AssessmentUpdateInput>;
};

export type CustomerAssessmentsUpdateFieldInput = {
  connect?: InputMaybe<Array<CustomerAssessmentsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<CustomerAssessmentsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<CustomerAssessmentsCreateFieldInput>>;
  delete?: InputMaybe<Array<CustomerAssessmentsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<CustomerAssessmentsDisconnectFieldInput>>;
  update?: InputMaybe<CustomerAssessmentsUpdateConnectionInput>;
  where?: InputMaybe<CustomerAssessmentsConnectionWhere>;
};

export type CustomerConnectInput = {
  assessments?: InputMaybe<Array<CustomerAssessmentsConnectFieldInput>>;
  owner?: InputMaybe<CustomerOwnerConnectFieldInput>;
  responses?: InputMaybe<Array<CustomerResponsesConnectFieldInput>>;
  users?: InputMaybe<Array<CustomerUsersConnectFieldInput>>;
};

export type CustomerConnectOrCreateInput = {
  assessments?: InputMaybe<Array<CustomerAssessmentsConnectOrCreateFieldInput>>;
  owner?: InputMaybe<CustomerOwnerConnectOrCreateFieldInput>;
  responses?: InputMaybe<Array<CustomerResponsesConnectOrCreateFieldInput>>;
  users?: InputMaybe<Array<CustomerUsersConnectOrCreateFieldInput>>;
};

export type CustomerConnectOrCreateWhere = {
  node: CustomerUniqueWhere;
};

export type CustomerConnectWhere = {
  node: CustomerWhere;
};

export type CustomerCreateInput = {
  assessments?: InputMaybe<CustomerAssessmentsFieldInput>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactName?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  leadCountry?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organization?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  owner?: InputMaybe<CustomerOwnerFieldInput>;
  responses?: InputMaybe<CustomerResponsesFieldInput>;
  users?: InputMaybe<CustomerUsersFieldInput>;
};

export type CustomerDeleteInput = {
  assessments?: InputMaybe<Array<CustomerAssessmentsDeleteFieldInput>>;
  owner?: InputMaybe<CustomerOwnerDeleteFieldInput>;
  responses?: InputMaybe<Array<CustomerResponsesDeleteFieldInput>>;
  users?: InputMaybe<Array<CustomerUsersDeleteFieldInput>>;
};

export type CustomerDisconnectInput = {
  assessments?: InputMaybe<Array<CustomerAssessmentsDisconnectFieldInput>>;
  owner?: InputMaybe<CustomerOwnerDisconnectFieldInput>;
  responses?: InputMaybe<Array<CustomerResponsesDisconnectFieldInput>>;
  users?: InputMaybe<Array<CustomerUsersDisconnectFieldInput>>;
};

export type CustomerEdge = {
  __typename?: 'CustomerEdge';
  cursor: Scalars['String']['output'];
  node: Customer;
};

export type CustomerOnCreateInput = {
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactName?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  leadCountry?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organization?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type CustomerOptions = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Specify one or more CustomerSort objects to sort Customers by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<CustomerSort>>;
};

export type CustomerOwnerAggregateInput = {
  AND?: InputMaybe<Array<CustomerOwnerAggregateInput>>;
  NOT?: InputMaybe<CustomerOwnerAggregateInput>;
  OR?: InputMaybe<Array<CustomerOwnerAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CustomerOwnerNodeAggregationWhereInput>;
};

export type CustomerOwnerConnectFieldInput = {
  connect?: InputMaybe<UserConnectInput>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<UserConnectWhere>;
};

export type CustomerOwnerConnectOrCreateFieldInput = {
  onCreate: CustomerOwnerConnectOrCreateFieldInputOnCreate;
  where: UserConnectOrCreateWhere;
};

export type CustomerOwnerConnectOrCreateFieldInputOnCreate = {
  node: UserOnCreateInput;
};

export type CustomerOwnerConnection = {
  __typename?: 'CustomerOwnerConnection';
  edges: Array<CustomerOwnerRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CustomerOwnerConnectionSort = {
  node?: InputMaybe<UserSort>;
};

export type CustomerOwnerConnectionWhere = {
  AND?: InputMaybe<Array<CustomerOwnerConnectionWhere>>;
  NOT?: InputMaybe<CustomerOwnerConnectionWhere>;
  OR?: InputMaybe<Array<CustomerOwnerConnectionWhere>>;
  node?: InputMaybe<UserWhere>;
};

export type CustomerOwnerCreateFieldInput = {
  node: UserCreateInput;
};

export type CustomerOwnerDeleteFieldInput = {
  delete?: InputMaybe<UserDeleteInput>;
  where?: InputMaybe<CustomerOwnerConnectionWhere>;
};

export type CustomerOwnerDisconnectFieldInput = {
  disconnect?: InputMaybe<UserDisconnectInput>;
  where?: InputMaybe<CustomerOwnerConnectionWhere>;
};

export type CustomerOwnerFieldInput = {
  connect?: InputMaybe<CustomerOwnerConnectFieldInput>;
  connectOrCreate?: InputMaybe<CustomerOwnerConnectOrCreateFieldInput>;
  create?: InputMaybe<CustomerOwnerCreateFieldInput>;
};

export type CustomerOwnerNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CustomerOwnerNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CustomerOwnerNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CustomerOwnerNodeAggregationWhereInput>>;
  assessmentFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  customerFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  email_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  name_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  picture_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  role_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CustomerOwnerRelationship = {
  __typename?: 'CustomerOwnerRelationship';
  cursor: Scalars['String']['output'];
  node: User;
};

export type CustomerOwnerUpdateConnectionInput = {
  node?: InputMaybe<UserUpdateInput>;
};

export type CustomerOwnerUpdateFieldInput = {
  connect?: InputMaybe<CustomerOwnerConnectFieldInput>;
  connectOrCreate?: InputMaybe<CustomerOwnerConnectOrCreateFieldInput>;
  create?: InputMaybe<CustomerOwnerCreateFieldInput>;
  delete?: InputMaybe<CustomerOwnerDeleteFieldInput>;
  disconnect?: InputMaybe<CustomerOwnerDisconnectFieldInput>;
  update?: InputMaybe<CustomerOwnerUpdateConnectionInput>;
  where?: InputMaybe<CustomerOwnerConnectionWhere>;
};

export type CustomerRelationInput = {
  assessments?: InputMaybe<Array<CustomerAssessmentsCreateFieldInput>>;
  owner?: InputMaybe<CustomerOwnerCreateFieldInput>;
  responses?: InputMaybe<Array<CustomerResponsesCreateFieldInput>>;
  users?: InputMaybe<Array<CustomerUsersCreateFieldInput>>;
};

export type CustomerResponsesAggregateInput = {
  AND?: InputMaybe<Array<CustomerResponsesAggregateInput>>;
  NOT?: InputMaybe<CustomerResponsesAggregateInput>;
  OR?: InputMaybe<Array<CustomerResponsesAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CustomerResponsesNodeAggregationWhereInput>;
};

export type CustomerResponsesConnectFieldInput = {
  connect?: InputMaybe<Array<AssessmentResponseConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<AssessmentResponseConnectWhere>;
};

export type CustomerResponsesConnectOrCreateFieldInput = {
  onCreate: CustomerResponsesConnectOrCreateFieldInputOnCreate;
  where: AssessmentResponseConnectOrCreateWhere;
};

export type CustomerResponsesConnectOrCreateFieldInputOnCreate = {
  node: AssessmentResponseOnCreateInput;
};

export type CustomerResponsesConnection = {
  __typename?: 'CustomerResponsesConnection';
  edges: Array<CustomerResponsesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CustomerResponsesConnectionSort = {
  node?: InputMaybe<AssessmentResponseSort>;
};

export type CustomerResponsesConnectionWhere = {
  AND?: InputMaybe<Array<CustomerResponsesConnectionWhere>>;
  NOT?: InputMaybe<CustomerResponsesConnectionWhere>;
  OR?: InputMaybe<Array<CustomerResponsesConnectionWhere>>;
  node?: InputMaybe<AssessmentResponseWhere>;
};

export type CustomerResponsesCreateFieldInput = {
  node: AssessmentResponseCreateInput;
};

export type CustomerResponsesDeleteFieldInput = {
  delete?: InputMaybe<AssessmentResponseDeleteInput>;
  where?: InputMaybe<CustomerResponsesConnectionWhere>;
};

export type CustomerResponsesDisconnectFieldInput = {
  disconnect?: InputMaybe<AssessmentResponseDisconnectInput>;
  where?: InputMaybe<CustomerResponsesConnectionWhere>;
};

export type CustomerResponsesFieldInput = {
  connect?: InputMaybe<Array<CustomerResponsesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<CustomerResponsesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<CustomerResponsesCreateFieldInput>>;
};

export type CustomerResponsesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CustomerResponsesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CustomerResponsesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CustomerResponsesNodeAggregationWhereInput>>;
  comment_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  comment_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  comment_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  comment_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  comment_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  comment_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  comment_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  comment_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  comment_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  comment_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  comment_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  comment_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  comment_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  comment_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  comment_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  response_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  response_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  response_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  response_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  response_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  response_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  response_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  response_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  response_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  response_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  response_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  response_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  response_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  response_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  response_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  token_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  token_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  token_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  token_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  token_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  token_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  token_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  token_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  token_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  token_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  token_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  token_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  token_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  token_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  token_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CustomerResponsesRelationship = {
  __typename?: 'CustomerResponsesRelationship';
  cursor: Scalars['String']['output'];
  node: AssessmentResponse;
};

export type CustomerResponsesUpdateConnectionInput = {
  node?: InputMaybe<AssessmentResponseUpdateInput>;
};

export type CustomerResponsesUpdateFieldInput = {
  connect?: InputMaybe<Array<CustomerResponsesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<CustomerResponsesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<CustomerResponsesCreateFieldInput>>;
  delete?: InputMaybe<Array<CustomerResponsesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<CustomerResponsesDisconnectFieldInput>>;
  update?: InputMaybe<CustomerResponsesUpdateConnectionInput>;
  where?: InputMaybe<CustomerResponsesConnectionWhere>;
};

/** Fields to sort Customers by. The order in which sorts are applied is not guaranteed when specifying many fields in one CustomerSort object. */
export type CustomerSort = {
  contactEmail?: InputMaybe<SortDirection>;
  contactName?: InputMaybe<SortDirection>;
  contactPhone?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  industry?: InputMaybe<SortDirection>;
  leadCountry?: InputMaybe<SortDirection>;
  logo?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type CustomerUniqueWhere = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type CustomerUpdateInput = {
  assessments?: InputMaybe<Array<CustomerAssessmentsUpdateFieldInput>>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactName?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  leadCountry?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  organization_POP?: InputMaybe<Scalars['Int']['input']>;
  organization_PUSH?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  owner?: InputMaybe<CustomerOwnerUpdateFieldInput>;
  responses?: InputMaybe<Array<CustomerResponsesUpdateFieldInput>>;
  users?: InputMaybe<Array<CustomerUsersUpdateFieldInput>>;
};

export type CustomerUserOwnerAggregationSelection = {
  __typename?: 'CustomerUserOwnerAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<CustomerUserOwnerNodeAggregateSelection>;
};

export type CustomerUserOwnerNodeAggregateSelection = {
  __typename?: 'CustomerUserOwnerNodeAggregateSelection';
  assessmentFilter: StringAggregateSelectionNullable;
  assessmentSort: StringAggregateSelectionNullable;
  colorMode: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  customerFilter: StringAggregateSelectionNullable;
  customerSort: StringAggregateSelectionNullable;
  email: StringAggregateSelectionNonNullable;
  firstName: StringAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  keycloakId: IdAggregateSelectionNullable;
  lastName: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNullable;
  picture: StringAggregateSelectionNullable;
  questionnaireSort: StringAggregateSelectionNullable;
  role: StringAggregateSelectionNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type CustomerUserUsersAggregationSelection = {
  __typename?: 'CustomerUserUsersAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<CustomerUserUsersNodeAggregateSelection>;
};

export type CustomerUserUsersNodeAggregateSelection = {
  __typename?: 'CustomerUserUsersNodeAggregateSelection';
  assessmentFilter: StringAggregateSelectionNullable;
  assessmentSort: StringAggregateSelectionNullable;
  colorMode: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  customerFilter: StringAggregateSelectionNullable;
  customerSort: StringAggregateSelectionNullable;
  email: StringAggregateSelectionNonNullable;
  firstName: StringAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  keycloakId: IdAggregateSelectionNullable;
  lastName: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNullable;
  picture: StringAggregateSelectionNullable;
  questionnaireSort: StringAggregateSelectionNullable;
  role: StringAggregateSelectionNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type CustomerUsersAggregateInput = {
  AND?: InputMaybe<Array<CustomerUsersAggregateInput>>;
  NOT?: InputMaybe<CustomerUsersAggregateInput>;
  OR?: InputMaybe<Array<CustomerUsersAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<CustomerUsersNodeAggregationWhereInput>;
};

export type CustomerUsersConnectFieldInput = {
  connect?: InputMaybe<Array<UserConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<UserConnectWhere>;
};

export type CustomerUsersConnectOrCreateFieldInput = {
  onCreate: CustomerUsersConnectOrCreateFieldInputOnCreate;
  where: UserConnectOrCreateWhere;
};

export type CustomerUsersConnectOrCreateFieldInputOnCreate = {
  node: UserOnCreateInput;
};

export type CustomerUsersConnection = {
  __typename?: 'CustomerUsersConnection';
  edges: Array<CustomerUsersRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CustomerUsersConnectionSort = {
  node?: InputMaybe<UserSort>;
};

export type CustomerUsersConnectionWhere = {
  AND?: InputMaybe<Array<CustomerUsersConnectionWhere>>;
  NOT?: InputMaybe<CustomerUsersConnectionWhere>;
  OR?: InputMaybe<Array<CustomerUsersConnectionWhere>>;
  node?: InputMaybe<UserWhere>;
};

export type CustomerUsersCreateFieldInput = {
  node: UserCreateInput;
};

export type CustomerUsersDeleteFieldInput = {
  delete?: InputMaybe<UserDeleteInput>;
  where?: InputMaybe<CustomerUsersConnectionWhere>;
};

export type CustomerUsersDisconnectFieldInput = {
  disconnect?: InputMaybe<UserDisconnectInput>;
  where?: InputMaybe<CustomerUsersConnectionWhere>;
};

export type CustomerUsersFieldInput = {
  connect?: InputMaybe<Array<CustomerUsersConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<CustomerUsersConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<CustomerUsersCreateFieldInput>>;
};

export type CustomerUsersNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<CustomerUsersNodeAggregationWhereInput>>;
  NOT?: InputMaybe<CustomerUsersNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<CustomerUsersNodeAggregationWhereInput>>;
  assessmentFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  customerFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  email_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  name_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  picture_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  role_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CustomerUsersRelationship = {
  __typename?: 'CustomerUsersRelationship';
  cursor: Scalars['String']['output'];
  node: User;
};

export type CustomerUsersUpdateConnectionInput = {
  node?: InputMaybe<UserUpdateInput>;
};

export type CustomerUsersUpdateFieldInput = {
  connect?: InputMaybe<Array<CustomerUsersConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<CustomerUsersConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<CustomerUsersCreateFieldInput>>;
  delete?: InputMaybe<Array<CustomerUsersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<CustomerUsersDisconnectFieldInput>>;
  update?: InputMaybe<CustomerUsersUpdateConnectionInput>;
  where?: InputMaybe<CustomerUsersConnectionWhere>;
};

export type CustomerWhere = {
  AND?: InputMaybe<Array<CustomerWhere>>;
  NOT?: InputMaybe<CustomerWhere>;
  OR?: InputMaybe<Array<CustomerWhere>>;
  assessmentsAggregate?: InputMaybe<CustomerAssessmentsAggregateInput>;
  /** Return Customers where all of the related CustomerAssessmentsConnections match this filter */
  assessmentsConnection_ALL?: InputMaybe<CustomerAssessmentsConnectionWhere>;
  /** Return Customers where none of the related CustomerAssessmentsConnections match this filter */
  assessmentsConnection_NONE?: InputMaybe<CustomerAssessmentsConnectionWhere>;
  /** Return Customers where one of the related CustomerAssessmentsConnections match this filter */
  assessmentsConnection_SINGLE?: InputMaybe<CustomerAssessmentsConnectionWhere>;
  /** Return Customers where some of the related CustomerAssessmentsConnections match this filter */
  assessmentsConnection_SOME?: InputMaybe<CustomerAssessmentsConnectionWhere>;
  /** Return Customers where all of the related Assessments match this filter */
  assessments_ALL?: InputMaybe<AssessmentWhere>;
  /** Return Customers where none of the related Assessments match this filter */
  assessments_NONE?: InputMaybe<AssessmentWhere>;
  /** Return Customers where one of the related Assessments match this filter */
  assessments_SINGLE?: InputMaybe<AssessmentWhere>;
  /** Return Customers where some of the related Assessments match this filter */
  assessments_SOME?: InputMaybe<AssessmentWhere>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactEmail_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  contactEmail_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  contactEmail_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contactEmail_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  contactName?: InputMaybe<Scalars['String']['input']>;
  contactName_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  contactName_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  contactName_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contactName_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  contactPhone_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  contactPhone_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  contactPhone_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contactPhone_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  createdAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_CONTAINS?: InputMaybe<Scalars['ID']['input']>;
  id_ENDS_WITH?: InputMaybe<Scalars['ID']['input']>;
  id_IN?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_STARTS_WITH?: InputMaybe<Scalars['ID']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  industry_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  industry_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  industry_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  industry_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  leadCountry?: InputMaybe<Scalars['String']['input']>;
  leadCountry_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  leadCountry_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  leadCountry_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  leadCountry_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  logo_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  logo_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  logo_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  logo_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  name_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  name_IN?: InputMaybe<Array<Scalars['String']['input']>>;
  name_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  organization?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  organization_INCLUDES?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<UserWhere>;
  ownerAggregate?: InputMaybe<CustomerOwnerAggregateInput>;
  ownerConnection?: InputMaybe<CustomerOwnerConnectionWhere>;
  ownerConnection_NOT?: InputMaybe<CustomerOwnerConnectionWhere>;
  owner_NOT?: InputMaybe<UserWhere>;
  responsesAggregate?: InputMaybe<CustomerResponsesAggregateInput>;
  /** Return Customers where all of the related CustomerResponsesConnections match this filter */
  responsesConnection_ALL?: InputMaybe<CustomerResponsesConnectionWhere>;
  /** Return Customers where none of the related CustomerResponsesConnections match this filter */
  responsesConnection_NONE?: InputMaybe<CustomerResponsesConnectionWhere>;
  /** Return Customers where one of the related CustomerResponsesConnections match this filter */
  responsesConnection_SINGLE?: InputMaybe<CustomerResponsesConnectionWhere>;
  /** Return Customers where some of the related CustomerResponsesConnections match this filter */
  responsesConnection_SOME?: InputMaybe<CustomerResponsesConnectionWhere>;
  /** Return Customers where all of the related AssessmentResponses match this filter */
  responses_ALL?: InputMaybe<AssessmentResponseWhere>;
  /** Return Customers where none of the related AssessmentResponses match this filter */
  responses_NONE?: InputMaybe<AssessmentResponseWhere>;
  /** Return Customers where one of the related AssessmentResponses match this filter */
  responses_SINGLE?: InputMaybe<AssessmentResponseWhere>;
  /** Return Customers where some of the related AssessmentResponses match this filter */
  responses_SOME?: InputMaybe<AssessmentResponseWhere>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  updatedAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  usersAggregate?: InputMaybe<CustomerUsersAggregateInput>;
  /** Return Customers where all of the related CustomerUsersConnections match this filter */
  usersConnection_ALL?: InputMaybe<CustomerUsersConnectionWhere>;
  /** Return Customers where none of the related CustomerUsersConnections match this filter */
  usersConnection_NONE?: InputMaybe<CustomerUsersConnectionWhere>;
  /** Return Customers where one of the related CustomerUsersConnections match this filter */
  usersConnection_SINGLE?: InputMaybe<CustomerUsersConnectionWhere>;
  /** Return Customers where some of the related CustomerUsersConnections match this filter */
  usersConnection_SOME?: InputMaybe<CustomerUsersConnectionWhere>;
  /** Return Customers where all of the related Users match this filter */
  users_ALL?: InputMaybe<UserWhere>;
  /** Return Customers where none of the related Users match this filter */
  users_NONE?: InputMaybe<UserWhere>;
  /** Return Customers where one of the related Users match this filter */
  users_SINGLE?: InputMaybe<UserWhere>;
  /** Return Customers where some of the related Users match this filter */
  users_SOME?: InputMaybe<UserWhere>;
};

export type CustomersConnection = {
  __typename?: 'CustomersConnection';
  edges: Array<CustomerEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DateTimeAggregateSelectionNullable = {
  __typename?: 'DateTimeAggregateSelectionNullable';
  max?: Maybe<Scalars['DateTime']['output']>;
  min?: Maybe<Scalars['DateTime']['output']>;
};

export type DeleteInfo = {
  __typename?: 'DeleteInfo';
  bookmark?: Maybe<Scalars['String']['output']>;
  nodesDeleted: Scalars['Int']['output'];
  relationshipsDeleted: Scalars['Int']['output'];
};

export type IdAggregateSelectionNonNullable = {
  __typename?: 'IDAggregateSelectionNonNullable';
  longest: Scalars['ID']['output'];
  shortest: Scalars['ID']['output'];
};

export type IdAggregateSelectionNullable = {
  __typename?: 'IDAggregateSelectionNullable';
  longest?: Maybe<Scalars['ID']['output']>;
  shortest?: Maybe<Scalars['ID']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAssessmentResponses: CreateAssessmentResponsesMutationResponse;
  createAssessments: CreateAssessmentsMutationResponse;
  createCustomers: CreateCustomersMutationResponse;
  createQuestionnaireVersions: CreateQuestionnaireVersionsMutationResponse;
  createQuestionnaires: CreateQuestionnairesMutationResponse;
  createUsers: CreateUsersMutationResponse;
  deleteAssessmentResponses: DeleteInfo;
  deleteAssessments: DeleteInfo;
  deleteCustomers: DeleteInfo;
  deleteQuestionnaireVersions: DeleteInfo;
  deleteQuestionnaires: DeleteInfo;
  deleteUsers: DeleteInfo;
  updateAssessmentResponses: UpdateAssessmentResponsesMutationResponse;
  updateAssessments: UpdateAssessmentsMutationResponse;
  updateCustomers: UpdateCustomersMutationResponse;
  updateQuestionnaireVersions: UpdateQuestionnaireVersionsMutationResponse;
  updateQuestionnaires: UpdateQuestionnairesMutationResponse;
  updateUsers: UpdateUsersMutationResponse;
};


export type MutationCreateAssessmentResponsesArgs = {
  input: Array<AssessmentResponseCreateInput>;
};


export type MutationCreateAssessmentsArgs = {
  input: Array<AssessmentCreateInput>;
};


export type MutationCreateCustomersArgs = {
  input: Array<CustomerCreateInput>;
};


export type MutationCreateQuestionnaireVersionsArgs = {
  input: Array<QuestionnaireVersionCreateInput>;
};


export type MutationCreateQuestionnairesArgs = {
  input: Array<QuestionnaireCreateInput>;
};


export type MutationCreateUsersArgs = {
  input: Array<UserCreateInput>;
};


export type MutationDeleteAssessmentResponsesArgs = {
  delete?: InputMaybe<AssessmentResponseDeleteInput>;
  where?: InputMaybe<AssessmentResponseWhere>;
};


export type MutationDeleteAssessmentsArgs = {
  delete?: InputMaybe<AssessmentDeleteInput>;
  where?: InputMaybe<AssessmentWhere>;
};


export type MutationDeleteCustomersArgs = {
  delete?: InputMaybe<CustomerDeleteInput>;
  where?: InputMaybe<CustomerWhere>;
};


export type MutationDeleteQuestionnaireVersionsArgs = {
  delete?: InputMaybe<QuestionnaireVersionDeleteInput>;
  where?: InputMaybe<QuestionnaireVersionWhere>;
};


export type MutationDeleteQuestionnairesArgs = {
  delete?: InputMaybe<QuestionnaireDeleteInput>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type MutationDeleteUsersArgs = {
  delete?: InputMaybe<UserDeleteInput>;
  where?: InputMaybe<UserWhere>;
};


export type MutationUpdateAssessmentResponsesArgs = {
  connect?: InputMaybe<AssessmentResponseConnectInput>;
  connectOrCreate?: InputMaybe<AssessmentResponseConnectOrCreateInput>;
  create?: InputMaybe<AssessmentResponseRelationInput>;
  delete?: InputMaybe<AssessmentResponseDeleteInput>;
  disconnect?: InputMaybe<AssessmentResponseDisconnectInput>;
  update?: InputMaybe<AssessmentResponseUpdateInput>;
  where?: InputMaybe<AssessmentResponseWhere>;
};


export type MutationUpdateAssessmentsArgs = {
  connect?: InputMaybe<AssessmentConnectInput>;
  connectOrCreate?: InputMaybe<AssessmentConnectOrCreateInput>;
  create?: InputMaybe<AssessmentRelationInput>;
  delete?: InputMaybe<AssessmentDeleteInput>;
  disconnect?: InputMaybe<AssessmentDisconnectInput>;
  update?: InputMaybe<AssessmentUpdateInput>;
  where?: InputMaybe<AssessmentWhere>;
};


export type MutationUpdateCustomersArgs = {
  connect?: InputMaybe<CustomerConnectInput>;
  connectOrCreate?: InputMaybe<CustomerConnectOrCreateInput>;
  create?: InputMaybe<CustomerRelationInput>;
  delete?: InputMaybe<CustomerDeleteInput>;
  disconnect?: InputMaybe<CustomerDisconnectInput>;
  update?: InputMaybe<CustomerUpdateInput>;
  where?: InputMaybe<CustomerWhere>;
};


export type MutationUpdateQuestionnaireVersionsArgs = {
  connect?: InputMaybe<QuestionnaireVersionConnectInput>;
  connectOrCreate?: InputMaybe<QuestionnaireVersionConnectOrCreateInput>;
  create?: InputMaybe<QuestionnaireVersionRelationInput>;
  delete?: InputMaybe<QuestionnaireVersionDeleteInput>;
  disconnect?: InputMaybe<QuestionnaireVersionDisconnectInput>;
  update?: InputMaybe<QuestionnaireVersionUpdateInput>;
  where?: InputMaybe<QuestionnaireVersionWhere>;
};


export type MutationUpdateQuestionnairesArgs = {
  connect?: InputMaybe<QuestionnaireConnectInput>;
  connectOrCreate?: InputMaybe<QuestionnaireConnectOrCreateInput>;
  create?: InputMaybe<QuestionnaireRelationInput>;
  delete?: InputMaybe<QuestionnaireDeleteInput>;
  disconnect?: InputMaybe<QuestionnaireDisconnectInput>;
  update?: InputMaybe<QuestionnaireUpdateInput>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type MutationUpdateUsersArgs = {
  connect?: InputMaybe<UserConnectInput>;
  connectOrCreate?: InputMaybe<UserConnectOrCreateInput>;
  create?: InputMaybe<UserRelationInput>;
  delete?: InputMaybe<UserDeleteInput>;
  disconnect?: InputMaybe<UserDisconnectInput>;
  update?: InputMaybe<UserUpdateInput>;
  where?: InputMaybe<UserWhere>;
};

/** Pagination information (Relay) */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  assessmentResponses: Array<AssessmentResponse>;
  assessmentResponsesAggregate: AssessmentResponseAggregateSelection;
  assessmentResponsesConnection: AssessmentResponsesConnection;
  assessments: Array<Assessment>;
  assessmentsAggregate: AssessmentAggregateSelection;
  assessmentsConnection: AssessmentsConnection;
  customers: Array<Customer>;
  customersAggregate: CustomerAggregateSelection;
  customersConnection: CustomersConnection;
  questionnaireVersions: Array<QuestionnaireVersion>;
  questionnaireVersionsAggregate: QuestionnaireVersionAggregateSelection;
  questionnaireVersionsConnection: QuestionnaireVersionsConnection;
  questionnaires: Array<Questionnaire>;
  questionnairesAggregate: QuestionnaireAggregateSelection;
  questionnairesConnection: QuestionnairesConnection;
  users: Array<User>;
  usersAggregate: UserAggregateSelection;
  usersConnection: UsersConnection;
};


export type QueryAssessmentResponsesArgs = {
  options?: InputMaybe<AssessmentResponseOptions>;
  where?: InputMaybe<AssessmentResponseWhere>;
};


export type QueryAssessmentResponsesAggregateArgs = {
  where?: InputMaybe<AssessmentResponseWhere>;
};


export type QueryAssessmentResponsesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<AssessmentResponseSort>>>;
  where?: InputMaybe<AssessmentResponseWhere>;
};


export type QueryAssessmentsArgs = {
  options?: InputMaybe<AssessmentOptions>;
  where?: InputMaybe<AssessmentWhere>;
};


export type QueryAssessmentsAggregateArgs = {
  where?: InputMaybe<AssessmentWhere>;
};


export type QueryAssessmentsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<AssessmentSort>>>;
  where?: InputMaybe<AssessmentWhere>;
};


export type QueryCustomersArgs = {
  options?: InputMaybe<CustomerOptions>;
  where?: InputMaybe<CustomerWhere>;
};


export type QueryCustomersAggregateArgs = {
  where?: InputMaybe<CustomerWhere>;
};


export type QueryCustomersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<CustomerSort>>>;
  where?: InputMaybe<CustomerWhere>;
};


export type QueryQuestionnaireVersionsArgs = {
  options?: InputMaybe<QuestionnaireVersionOptions>;
  where?: InputMaybe<QuestionnaireVersionWhere>;
};


export type QueryQuestionnaireVersionsAggregateArgs = {
  where?: InputMaybe<QuestionnaireVersionWhere>;
};


export type QueryQuestionnaireVersionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<QuestionnaireVersionSort>>>;
  where?: InputMaybe<QuestionnaireVersionWhere>;
};


export type QueryQuestionnairesArgs = {
  options?: InputMaybe<QuestionnaireOptions>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type QueryQuestionnairesAggregateArgs = {
  where?: InputMaybe<QuestionnaireWhere>;
};


export type QueryQuestionnairesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<QuestionnaireSort>>>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type QueryUsersArgs = {
  options?: InputMaybe<UserOptions>;
  where?: InputMaybe<UserWhere>;
};


export type QueryUsersAggregateArgs = {
  where?: InputMaybe<UserWhere>;
};


export type QueryUsersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  where?: InputMaybe<UserWhere>;
};

export type Questionnaire = {
  __typename?: 'Questionnaire';
  assessments: Array<Assessment>;
  assessmentsAggregate?: Maybe<QuestionnaireAssessmentAssessmentsAggregationSelection>;
  assessmentsConnection: QuestionnaireAssessmentsConnection;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  owner?: Maybe<User>;
  ownerAggregate?: Maybe<QuestionnaireUserOwnerAggregationSelection>;
  ownerConnection: QuestionnaireOwnerConnection;
  questions: Scalars['String']['output'];
  team: Array<User>;
  teamAggregate?: Maybe<QuestionnaireUserTeamAggregationSelection>;
  teamConnection: QuestionnaireTeamConnection;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  useVersioning?: Maybe<Scalars['Boolean']['output']>;
  versions: Array<QuestionnaireVersion>;
  versionsAggregate?: Maybe<QuestionnaireQuestionnaireVersionVersionsAggregationSelection>;
  versionsConnection: QuestionnaireVersionsConnection;
};


export type QuestionnaireAssessmentsArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<AssessmentOptions>;
  where?: InputMaybe<AssessmentWhere>;
};


export type QuestionnaireAssessmentsAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<AssessmentWhere>;
};


export type QuestionnaireAssessmentsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<QuestionnaireAssessmentsConnectionSort>>;
  where?: InputMaybe<QuestionnaireAssessmentsConnectionWhere>;
};


export type QuestionnaireOwnerArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<UserOptions>;
  where?: InputMaybe<UserWhere>;
};


export type QuestionnaireOwnerAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<UserWhere>;
};


export type QuestionnaireOwnerConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<QuestionnaireOwnerConnectionSort>>;
  where?: InputMaybe<QuestionnaireOwnerConnectionWhere>;
};


export type QuestionnaireTeamArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<UserOptions>;
  where?: InputMaybe<UserWhere>;
};


export type QuestionnaireTeamAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<UserWhere>;
};


export type QuestionnaireTeamConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<QuestionnaireTeamConnectionSort>>;
  where?: InputMaybe<QuestionnaireTeamConnectionWhere>;
};


export type QuestionnaireVersionsArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<QuestionnaireVersionOptions>;
  where?: InputMaybe<QuestionnaireVersionWhere>;
};


export type QuestionnaireVersionsAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<QuestionnaireVersionWhere>;
};


export type QuestionnaireVersionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<QuestionnaireVersionsConnectionSort>>;
  where?: InputMaybe<QuestionnaireVersionsConnectionWhere>;
};

export type QuestionnaireAggregateSelection = {
  __typename?: 'QuestionnaireAggregateSelection';
  count: Scalars['Int']['output'];
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  questions: StringAggregateSelectionNonNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type QuestionnaireAssessmentAssessmentsAggregationSelection = {
  __typename?: 'QuestionnaireAssessmentAssessmentsAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<QuestionnaireAssessmentAssessmentsNodeAggregateSelection>;
};

export type QuestionnaireAssessmentAssessmentsNodeAggregateSelection = {
  __typename?: 'QuestionnaireAssessmentAssessmentsNodeAggregateSelection';
  calculation: StringAggregateSelectionNonNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  endDate: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  mode: StringAggregateSelectionNullable;
  questionsVersionId: IdAggregateSelectionNullable;
  startDate: DateTimeAggregateSelectionNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type QuestionnaireAssessmentsAggregateInput = {
  AND?: InputMaybe<Array<QuestionnaireAssessmentsAggregateInput>>;
  NOT?: InputMaybe<QuestionnaireAssessmentsAggregateInput>;
  OR?: InputMaybe<Array<QuestionnaireAssessmentsAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<QuestionnaireAssessmentsNodeAggregationWhereInput>;
};

export type QuestionnaireAssessmentsConnectFieldInput = {
  connect?: InputMaybe<Array<AssessmentConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<AssessmentConnectWhere>;
};

export type QuestionnaireAssessmentsConnectOrCreateFieldInput = {
  onCreate: QuestionnaireAssessmentsConnectOrCreateFieldInputOnCreate;
  where: AssessmentConnectOrCreateWhere;
};

export type QuestionnaireAssessmentsConnectOrCreateFieldInputOnCreate = {
  node: AssessmentOnCreateInput;
};

export type QuestionnaireAssessmentsConnection = {
  __typename?: 'QuestionnaireAssessmentsConnection';
  edges: Array<QuestionnaireAssessmentsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QuestionnaireAssessmentsConnectionSort = {
  node?: InputMaybe<AssessmentSort>;
};

export type QuestionnaireAssessmentsConnectionWhere = {
  AND?: InputMaybe<Array<QuestionnaireAssessmentsConnectionWhere>>;
  NOT?: InputMaybe<QuestionnaireAssessmentsConnectionWhere>;
  OR?: InputMaybe<Array<QuestionnaireAssessmentsConnectionWhere>>;
  node?: InputMaybe<AssessmentWhere>;
};

export type QuestionnaireAssessmentsCreateFieldInput = {
  node: AssessmentCreateInput;
};

export type QuestionnaireAssessmentsDeleteFieldInput = {
  delete?: InputMaybe<AssessmentDeleteInput>;
  where?: InputMaybe<QuestionnaireAssessmentsConnectionWhere>;
};

export type QuestionnaireAssessmentsDisconnectFieldInput = {
  disconnect?: InputMaybe<AssessmentDisconnectInput>;
  where?: InputMaybe<QuestionnaireAssessmentsConnectionWhere>;
};

export type QuestionnaireAssessmentsFieldInput = {
  connect?: InputMaybe<Array<QuestionnaireAssessmentsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<QuestionnaireAssessmentsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<QuestionnaireAssessmentsCreateFieldInput>>;
};

export type QuestionnaireAssessmentsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<QuestionnaireAssessmentsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<QuestionnaireAssessmentsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<QuestionnaireAssessmentsNodeAggregationWhereInput>>;
  calculation_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  calculation_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  mode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  mode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  startDate_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  title_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  title_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuestionnaireAssessmentsRelationship = {
  __typename?: 'QuestionnaireAssessmentsRelationship';
  cursor: Scalars['String']['output'];
  node: Assessment;
};

export type QuestionnaireAssessmentsUpdateConnectionInput = {
  node?: InputMaybe<AssessmentUpdateInput>;
};

export type QuestionnaireAssessmentsUpdateFieldInput = {
  connect?: InputMaybe<Array<QuestionnaireAssessmentsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<QuestionnaireAssessmentsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<QuestionnaireAssessmentsCreateFieldInput>>;
  delete?: InputMaybe<Array<QuestionnaireAssessmentsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<QuestionnaireAssessmentsDisconnectFieldInput>>;
  update?: InputMaybe<QuestionnaireAssessmentsUpdateConnectionInput>;
  where?: InputMaybe<QuestionnaireAssessmentsConnectionWhere>;
};

export type QuestionnaireConnectInput = {
  assessments?: InputMaybe<Array<QuestionnaireAssessmentsConnectFieldInput>>;
  owner?: InputMaybe<QuestionnaireOwnerConnectFieldInput>;
  team?: InputMaybe<Array<QuestionnaireTeamConnectFieldInput>>;
  versions?: InputMaybe<Array<QuestionnaireVersionsConnectFieldInput>>;
};

export type QuestionnaireConnectOrCreateInput = {
  assessments?: InputMaybe<Array<QuestionnaireAssessmentsConnectOrCreateFieldInput>>;
  owner?: InputMaybe<QuestionnaireOwnerConnectOrCreateFieldInput>;
  team?: InputMaybe<Array<QuestionnaireTeamConnectOrCreateFieldInput>>;
  versions?: InputMaybe<Array<QuestionnaireVersionsConnectOrCreateFieldInput>>;
};

export type QuestionnaireConnectOrCreateWhere = {
  node: QuestionnaireUniqueWhere;
};

export type QuestionnaireConnectWhere = {
  node: QuestionnaireWhere;
};

export type QuestionnaireCreateInput = {
  assessments?: InputMaybe<QuestionnaireAssessmentsFieldInput>;
  owner?: InputMaybe<QuestionnaireOwnerFieldInput>;
  questions: Scalars['String']['input'];
  team?: InputMaybe<QuestionnaireTeamFieldInput>;
  title: Scalars['String']['input'];
  useVersioning?: InputMaybe<Scalars['Boolean']['input']>;
  versions?: InputMaybe<QuestionnaireVersionsFieldInput>;
};

export type QuestionnaireDeleteInput = {
  assessments?: InputMaybe<Array<QuestionnaireAssessmentsDeleteFieldInput>>;
  owner?: InputMaybe<QuestionnaireOwnerDeleteFieldInput>;
  team?: InputMaybe<Array<QuestionnaireTeamDeleteFieldInput>>;
  versions?: InputMaybe<Array<QuestionnaireVersionsDeleteFieldInput>>;
};

export type QuestionnaireDisconnectInput = {
  assessments?: InputMaybe<Array<QuestionnaireAssessmentsDisconnectFieldInput>>;
  owner?: InputMaybe<QuestionnaireOwnerDisconnectFieldInput>;
  team?: InputMaybe<Array<QuestionnaireTeamDisconnectFieldInput>>;
  versions?: InputMaybe<Array<QuestionnaireVersionsDisconnectFieldInput>>;
};

export type QuestionnaireEdge = {
  __typename?: 'QuestionnaireEdge';
  cursor: Scalars['String']['output'];
  node: Questionnaire;
};

export type QuestionnaireOnCreateInput = {
  questions: Scalars['String']['input'];
  title: Scalars['String']['input'];
  useVersioning?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuestionnaireOptions = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Specify one or more QuestionnaireSort objects to sort Questionnaires by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<QuestionnaireSort>>;
};

export type QuestionnaireOwnerAggregateInput = {
  AND?: InputMaybe<Array<QuestionnaireOwnerAggregateInput>>;
  NOT?: InputMaybe<QuestionnaireOwnerAggregateInput>;
  OR?: InputMaybe<Array<QuestionnaireOwnerAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<QuestionnaireOwnerNodeAggregationWhereInput>;
};

export type QuestionnaireOwnerConnectFieldInput = {
  connect?: InputMaybe<UserConnectInput>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<UserConnectWhere>;
};

export type QuestionnaireOwnerConnectOrCreateFieldInput = {
  onCreate: QuestionnaireOwnerConnectOrCreateFieldInputOnCreate;
  where: UserConnectOrCreateWhere;
};

export type QuestionnaireOwnerConnectOrCreateFieldInputOnCreate = {
  node: UserOnCreateInput;
};

export type QuestionnaireOwnerConnection = {
  __typename?: 'QuestionnaireOwnerConnection';
  edges: Array<QuestionnaireOwnerRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QuestionnaireOwnerConnectionSort = {
  node?: InputMaybe<UserSort>;
};

export type QuestionnaireOwnerConnectionWhere = {
  AND?: InputMaybe<Array<QuestionnaireOwnerConnectionWhere>>;
  NOT?: InputMaybe<QuestionnaireOwnerConnectionWhere>;
  OR?: InputMaybe<Array<QuestionnaireOwnerConnectionWhere>>;
  node?: InputMaybe<UserWhere>;
};

export type QuestionnaireOwnerCreateFieldInput = {
  node: UserCreateInput;
};

export type QuestionnaireOwnerDeleteFieldInput = {
  delete?: InputMaybe<UserDeleteInput>;
  where?: InputMaybe<QuestionnaireOwnerConnectionWhere>;
};

export type QuestionnaireOwnerDisconnectFieldInput = {
  disconnect?: InputMaybe<UserDisconnectInput>;
  where?: InputMaybe<QuestionnaireOwnerConnectionWhere>;
};

export type QuestionnaireOwnerFieldInput = {
  connect?: InputMaybe<QuestionnaireOwnerConnectFieldInput>;
  connectOrCreate?: InputMaybe<QuestionnaireOwnerConnectOrCreateFieldInput>;
  create?: InputMaybe<QuestionnaireOwnerCreateFieldInput>;
};

export type QuestionnaireOwnerNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<QuestionnaireOwnerNodeAggregationWhereInput>>;
  NOT?: InputMaybe<QuestionnaireOwnerNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<QuestionnaireOwnerNodeAggregationWhereInput>>;
  assessmentFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  customerFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  email_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  name_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  picture_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  role_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuestionnaireOwnerRelationship = {
  __typename?: 'QuestionnaireOwnerRelationship';
  cursor: Scalars['String']['output'];
  node: User;
};

export type QuestionnaireOwnerUpdateConnectionInput = {
  node?: InputMaybe<UserUpdateInput>;
};

export type QuestionnaireOwnerUpdateFieldInput = {
  connect?: InputMaybe<QuestionnaireOwnerConnectFieldInput>;
  connectOrCreate?: InputMaybe<QuestionnaireOwnerConnectOrCreateFieldInput>;
  create?: InputMaybe<QuestionnaireOwnerCreateFieldInput>;
  delete?: InputMaybe<QuestionnaireOwnerDeleteFieldInput>;
  disconnect?: InputMaybe<QuestionnaireOwnerDisconnectFieldInput>;
  update?: InputMaybe<QuestionnaireOwnerUpdateConnectionInput>;
  where?: InputMaybe<QuestionnaireOwnerConnectionWhere>;
};

export type QuestionnaireQuestionnaireVersionVersionsAggregationSelection = {
  __typename?: 'QuestionnaireQuestionnaireVersionVersionsAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<QuestionnaireQuestionnaireVersionVersionsNodeAggregateSelection>;
};

export type QuestionnaireQuestionnaireVersionVersionsNodeAggregateSelection = {
  __typename?: 'QuestionnaireQuestionnaireVersionVersionsNodeAggregateSelection';
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  questions: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
  version: StringAggregateSelectionNonNullable;
};

export type QuestionnaireRelationInput = {
  assessments?: InputMaybe<Array<QuestionnaireAssessmentsCreateFieldInput>>;
  owner?: InputMaybe<QuestionnaireOwnerCreateFieldInput>;
  team?: InputMaybe<Array<QuestionnaireTeamCreateFieldInput>>;
  versions?: InputMaybe<Array<QuestionnaireVersionsCreateFieldInput>>;
};

/** Fields to sort Questionnaires by. The order in which sorts are applied is not guaranteed when specifying many fields in one QuestionnaireSort object. */
export type QuestionnaireSort = {
  createdAt?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  questions?: InputMaybe<SortDirection>;
  title?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
  useVersioning?: InputMaybe<SortDirection>;
};

export type QuestionnaireTeamAggregateInput = {
  AND?: InputMaybe<Array<QuestionnaireTeamAggregateInput>>;
  NOT?: InputMaybe<QuestionnaireTeamAggregateInput>;
  OR?: InputMaybe<Array<QuestionnaireTeamAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<QuestionnaireTeamNodeAggregationWhereInput>;
};

export type QuestionnaireTeamConnectFieldInput = {
  connect?: InputMaybe<Array<UserConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<UserConnectWhere>;
};

export type QuestionnaireTeamConnectOrCreateFieldInput = {
  onCreate: QuestionnaireTeamConnectOrCreateFieldInputOnCreate;
  where: UserConnectOrCreateWhere;
};

export type QuestionnaireTeamConnectOrCreateFieldInputOnCreate = {
  node: UserOnCreateInput;
};

export type QuestionnaireTeamConnection = {
  __typename?: 'QuestionnaireTeamConnection';
  edges: Array<QuestionnaireTeamRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QuestionnaireTeamConnectionSort = {
  node?: InputMaybe<UserSort>;
};

export type QuestionnaireTeamConnectionWhere = {
  AND?: InputMaybe<Array<QuestionnaireTeamConnectionWhere>>;
  NOT?: InputMaybe<QuestionnaireTeamConnectionWhere>;
  OR?: InputMaybe<Array<QuestionnaireTeamConnectionWhere>>;
  node?: InputMaybe<UserWhere>;
};

export type QuestionnaireTeamCreateFieldInput = {
  node: UserCreateInput;
};

export type QuestionnaireTeamDeleteFieldInput = {
  delete?: InputMaybe<UserDeleteInput>;
  where?: InputMaybe<QuestionnaireTeamConnectionWhere>;
};

export type QuestionnaireTeamDisconnectFieldInput = {
  disconnect?: InputMaybe<UserDisconnectInput>;
  where?: InputMaybe<QuestionnaireTeamConnectionWhere>;
};

export type QuestionnaireTeamFieldInput = {
  connect?: InputMaybe<Array<QuestionnaireTeamConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<QuestionnaireTeamConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<QuestionnaireTeamCreateFieldInput>>;
};

export type QuestionnaireTeamNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<QuestionnaireTeamNodeAggregationWhereInput>>;
  NOT?: InputMaybe<QuestionnaireTeamNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<QuestionnaireTeamNodeAggregationWhereInput>>;
  assessmentFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  assessmentSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  assessmentSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  colorMode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  colorMode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  colorMode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  customerFilter_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerFilter_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerFilter_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  customerSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  customerSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  customerSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  email_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  email_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  email_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  firstName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  firstName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  firstName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  lastName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  lastName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  lastName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  name_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  picture_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  picture_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  picture_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questionnaireSort_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questionnaireSort_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  role_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  role_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  role_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuestionnaireTeamRelationship = {
  __typename?: 'QuestionnaireTeamRelationship';
  cursor: Scalars['String']['output'];
  node: User;
};

export type QuestionnaireTeamUpdateConnectionInput = {
  node?: InputMaybe<UserUpdateInput>;
};

export type QuestionnaireTeamUpdateFieldInput = {
  connect?: InputMaybe<Array<QuestionnaireTeamConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<QuestionnaireTeamConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<QuestionnaireTeamCreateFieldInput>>;
  delete?: InputMaybe<Array<QuestionnaireTeamDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<QuestionnaireTeamDisconnectFieldInput>>;
  update?: InputMaybe<QuestionnaireTeamUpdateConnectionInput>;
  where?: InputMaybe<QuestionnaireTeamConnectionWhere>;
};

export type QuestionnaireUniqueWhere = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QuestionnaireUpdateInput = {
  assessments?: InputMaybe<Array<QuestionnaireAssessmentsUpdateFieldInput>>;
  owner?: InputMaybe<QuestionnaireOwnerUpdateFieldInput>;
  questions?: InputMaybe<Scalars['String']['input']>;
  team?: InputMaybe<Array<QuestionnaireTeamUpdateFieldInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
  useVersioning?: InputMaybe<Scalars['Boolean']['input']>;
  versions?: InputMaybe<Array<QuestionnaireVersionsUpdateFieldInput>>;
};

export type QuestionnaireUserOwnerAggregationSelection = {
  __typename?: 'QuestionnaireUserOwnerAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<QuestionnaireUserOwnerNodeAggregateSelection>;
};

export type QuestionnaireUserOwnerNodeAggregateSelection = {
  __typename?: 'QuestionnaireUserOwnerNodeAggregateSelection';
  assessmentFilter: StringAggregateSelectionNullable;
  assessmentSort: StringAggregateSelectionNullable;
  colorMode: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  customerFilter: StringAggregateSelectionNullable;
  customerSort: StringAggregateSelectionNullable;
  email: StringAggregateSelectionNonNullable;
  firstName: StringAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  keycloakId: IdAggregateSelectionNullable;
  lastName: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNullable;
  picture: StringAggregateSelectionNullable;
  questionnaireSort: StringAggregateSelectionNullable;
  role: StringAggregateSelectionNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type QuestionnaireUserTeamAggregationSelection = {
  __typename?: 'QuestionnaireUserTeamAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<QuestionnaireUserTeamNodeAggregateSelection>;
};

export type QuestionnaireUserTeamNodeAggregateSelection = {
  __typename?: 'QuestionnaireUserTeamNodeAggregateSelection';
  assessmentFilter: StringAggregateSelectionNullable;
  assessmentSort: StringAggregateSelectionNullable;
  colorMode: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  customerFilter: StringAggregateSelectionNullable;
  customerSort: StringAggregateSelectionNullable;
  email: StringAggregateSelectionNonNullable;
  firstName: StringAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  keycloakId: IdAggregateSelectionNullable;
  lastName: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNullable;
  picture: StringAggregateSelectionNullable;
  questionnaireSort: StringAggregateSelectionNullable;
  role: StringAggregateSelectionNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type QuestionnaireVersion = {
  __typename?: 'QuestionnaireVersion';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  questionnaire?: Maybe<Questionnaire>;
  questionnaireAggregate?: Maybe<QuestionnaireVersionQuestionnaireQuestionnaireAggregationSelection>;
  questionnaireConnection: QuestionnaireVersionQuestionnaireConnection;
  questions: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version: Scalars['String']['output'];
};


export type QuestionnaireVersionQuestionnaireArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<QuestionnaireOptions>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type QuestionnaireVersionQuestionnaireAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type QuestionnaireVersionQuestionnaireConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<QuestionnaireVersionQuestionnaireConnectionSort>>;
  where?: InputMaybe<QuestionnaireVersionQuestionnaireConnectionWhere>;
};

export type QuestionnaireVersionAggregateSelection = {
  __typename?: 'QuestionnaireVersionAggregateSelection';
  count: Scalars['Int']['output'];
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  questions: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
  version: StringAggregateSelectionNonNullable;
};

export type QuestionnaireVersionConnectInput = {
  questionnaire?: InputMaybe<QuestionnaireVersionQuestionnaireConnectFieldInput>;
};

export type QuestionnaireVersionConnectOrCreateInput = {
  questionnaire?: InputMaybe<QuestionnaireVersionQuestionnaireConnectOrCreateFieldInput>;
};

export type QuestionnaireVersionConnectOrCreateWhere = {
  node: QuestionnaireVersionUniqueWhere;
};

export type QuestionnaireVersionConnectWhere = {
  node: QuestionnaireVersionWhere;
};

export type QuestionnaireVersionCreateInput = {
  questionnaire?: InputMaybe<QuestionnaireVersionQuestionnaireFieldInput>;
  questions: Scalars['String']['input'];
  version: Scalars['String']['input'];
};

export type QuestionnaireVersionDeleteInput = {
  questionnaire?: InputMaybe<QuestionnaireVersionQuestionnaireDeleteFieldInput>;
};

export type QuestionnaireVersionDisconnectInput = {
  questionnaire?: InputMaybe<QuestionnaireVersionQuestionnaireDisconnectFieldInput>;
};

export type QuestionnaireVersionEdge = {
  __typename?: 'QuestionnaireVersionEdge';
  cursor: Scalars['String']['output'];
  node: QuestionnaireVersion;
};

export type QuestionnaireVersionOnCreateInput = {
  questions: Scalars['String']['input'];
  version: Scalars['String']['input'];
};

export type QuestionnaireVersionOptions = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Specify one or more QuestionnaireVersionSort objects to sort QuestionnaireVersions by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<QuestionnaireVersionSort>>;
};

export type QuestionnaireVersionQuestionnaireAggregateInput = {
  AND?: InputMaybe<Array<QuestionnaireVersionQuestionnaireAggregateInput>>;
  NOT?: InputMaybe<QuestionnaireVersionQuestionnaireAggregateInput>;
  OR?: InputMaybe<Array<QuestionnaireVersionQuestionnaireAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<QuestionnaireVersionQuestionnaireNodeAggregationWhereInput>;
};

export type QuestionnaireVersionQuestionnaireConnectFieldInput = {
  connect?: InputMaybe<QuestionnaireConnectInput>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<QuestionnaireConnectWhere>;
};

export type QuestionnaireVersionQuestionnaireConnectOrCreateFieldInput = {
  onCreate: QuestionnaireVersionQuestionnaireConnectOrCreateFieldInputOnCreate;
  where: QuestionnaireConnectOrCreateWhere;
};

export type QuestionnaireVersionQuestionnaireConnectOrCreateFieldInputOnCreate = {
  node: QuestionnaireOnCreateInput;
};

export type QuestionnaireVersionQuestionnaireConnection = {
  __typename?: 'QuestionnaireVersionQuestionnaireConnection';
  edges: Array<QuestionnaireVersionQuestionnaireRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QuestionnaireVersionQuestionnaireConnectionSort = {
  node?: InputMaybe<QuestionnaireSort>;
};

export type QuestionnaireVersionQuestionnaireConnectionWhere = {
  AND?: InputMaybe<Array<QuestionnaireVersionQuestionnaireConnectionWhere>>;
  NOT?: InputMaybe<QuestionnaireVersionQuestionnaireConnectionWhere>;
  OR?: InputMaybe<Array<QuestionnaireVersionQuestionnaireConnectionWhere>>;
  node?: InputMaybe<QuestionnaireWhere>;
};

export type QuestionnaireVersionQuestionnaireCreateFieldInput = {
  node: QuestionnaireCreateInput;
};

export type QuestionnaireVersionQuestionnaireDeleteFieldInput = {
  delete?: InputMaybe<QuestionnaireDeleteInput>;
  where?: InputMaybe<QuestionnaireVersionQuestionnaireConnectionWhere>;
};

export type QuestionnaireVersionQuestionnaireDisconnectFieldInput = {
  disconnect?: InputMaybe<QuestionnaireDisconnectInput>;
  where?: InputMaybe<QuestionnaireVersionQuestionnaireConnectionWhere>;
};

export type QuestionnaireVersionQuestionnaireFieldInput = {
  connect?: InputMaybe<QuestionnaireVersionQuestionnaireConnectFieldInput>;
  connectOrCreate?: InputMaybe<QuestionnaireVersionQuestionnaireConnectOrCreateFieldInput>;
  create?: InputMaybe<QuestionnaireVersionQuestionnaireCreateFieldInput>;
};

export type QuestionnaireVersionQuestionnaireNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<QuestionnaireVersionQuestionnaireNodeAggregationWhereInput>>;
  NOT?: InputMaybe<QuestionnaireVersionQuestionnaireNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<QuestionnaireVersionQuestionnaireNodeAggregationWhereInput>>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  questions_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questions_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  title_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type QuestionnaireVersionQuestionnaireQuestionnaireAggregationSelection = {
  __typename?: 'QuestionnaireVersionQuestionnaireQuestionnaireAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<QuestionnaireVersionQuestionnaireQuestionnaireNodeAggregateSelection>;
};

export type QuestionnaireVersionQuestionnaireQuestionnaireNodeAggregateSelection = {
  __typename?: 'QuestionnaireVersionQuestionnaireQuestionnaireNodeAggregateSelection';
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  questions: StringAggregateSelectionNonNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type QuestionnaireVersionQuestionnaireRelationship = {
  __typename?: 'QuestionnaireVersionQuestionnaireRelationship';
  cursor: Scalars['String']['output'];
  node: Questionnaire;
};

export type QuestionnaireVersionQuestionnaireUpdateConnectionInput = {
  node?: InputMaybe<QuestionnaireUpdateInput>;
};

export type QuestionnaireVersionQuestionnaireUpdateFieldInput = {
  connect?: InputMaybe<QuestionnaireVersionQuestionnaireConnectFieldInput>;
  connectOrCreate?: InputMaybe<QuestionnaireVersionQuestionnaireConnectOrCreateFieldInput>;
  create?: InputMaybe<QuestionnaireVersionQuestionnaireCreateFieldInput>;
  delete?: InputMaybe<QuestionnaireVersionQuestionnaireDeleteFieldInput>;
  disconnect?: InputMaybe<QuestionnaireVersionQuestionnaireDisconnectFieldInput>;
  update?: InputMaybe<QuestionnaireVersionQuestionnaireUpdateConnectionInput>;
  where?: InputMaybe<QuestionnaireVersionQuestionnaireConnectionWhere>;
};

export type QuestionnaireVersionRelationInput = {
  questionnaire?: InputMaybe<QuestionnaireVersionQuestionnaireCreateFieldInput>;
};

/** Fields to sort QuestionnaireVersions by. The order in which sorts are applied is not guaranteed when specifying many fields in one QuestionnaireVersionSort object. */
export type QuestionnaireVersionSort = {
  createdAt?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  questions?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
  version?: InputMaybe<SortDirection>;
};

export type QuestionnaireVersionUniqueWhere = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QuestionnaireVersionUpdateInput = {
  questionnaire?: InputMaybe<QuestionnaireVersionQuestionnaireUpdateFieldInput>;
  questions?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type QuestionnaireVersionWhere = {
  AND?: InputMaybe<Array<QuestionnaireVersionWhere>>;
  NOT?: InputMaybe<QuestionnaireVersionWhere>;
  OR?: InputMaybe<Array<QuestionnaireVersionWhere>>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  createdAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_CONTAINS?: InputMaybe<Scalars['ID']['input']>;
  id_ENDS_WITH?: InputMaybe<Scalars['ID']['input']>;
  id_IN?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_STARTS_WITH?: InputMaybe<Scalars['ID']['input']>;
  questionnaire?: InputMaybe<QuestionnaireWhere>;
  questionnaireAggregate?: InputMaybe<QuestionnaireVersionQuestionnaireAggregateInput>;
  questionnaireConnection?: InputMaybe<QuestionnaireVersionQuestionnaireConnectionWhere>;
  questionnaireConnection_NOT?: InputMaybe<QuestionnaireVersionQuestionnaireConnectionWhere>;
  questionnaire_NOT?: InputMaybe<QuestionnaireWhere>;
  questions?: InputMaybe<Scalars['String']['input']>;
  questions_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  questions_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  questions_IN?: InputMaybe<Array<Scalars['String']['input']>>;
  questions_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  updatedAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
  version_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  version_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  version_IN?: InputMaybe<Array<Scalars['String']['input']>>;
  version_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
};

export type QuestionnaireVersionsAggregateInput = {
  AND?: InputMaybe<Array<QuestionnaireVersionsAggregateInput>>;
  NOT?: InputMaybe<QuestionnaireVersionsAggregateInput>;
  OR?: InputMaybe<Array<QuestionnaireVersionsAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<QuestionnaireVersionsNodeAggregationWhereInput>;
};

export type QuestionnaireVersionsConnectFieldInput = {
  connect?: InputMaybe<Array<QuestionnaireVersionConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<QuestionnaireVersionConnectWhere>;
};

export type QuestionnaireVersionsConnectOrCreateFieldInput = {
  onCreate: QuestionnaireVersionsConnectOrCreateFieldInputOnCreate;
  where: QuestionnaireVersionConnectOrCreateWhere;
};

export type QuestionnaireVersionsConnectOrCreateFieldInputOnCreate = {
  node: QuestionnaireVersionOnCreateInput;
};

export type QuestionnaireVersionsConnection = {
  __typename?: 'QuestionnaireVersionsConnection';
  edges: Array<QuestionnaireVersionsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QuestionnaireVersionsConnectionSort = {
  node?: InputMaybe<QuestionnaireVersionSort>;
};

export type QuestionnaireVersionsConnectionWhere = {
  AND?: InputMaybe<Array<QuestionnaireVersionsConnectionWhere>>;
  NOT?: InputMaybe<QuestionnaireVersionsConnectionWhere>;
  OR?: InputMaybe<Array<QuestionnaireVersionsConnectionWhere>>;
  node?: InputMaybe<QuestionnaireVersionWhere>;
};

export type QuestionnaireVersionsCreateFieldInput = {
  node: QuestionnaireVersionCreateInput;
};

export type QuestionnaireVersionsDeleteFieldInput = {
  delete?: InputMaybe<QuestionnaireVersionDeleteInput>;
  where?: InputMaybe<QuestionnaireVersionsConnectionWhere>;
};

export type QuestionnaireVersionsDisconnectFieldInput = {
  disconnect?: InputMaybe<QuestionnaireVersionDisconnectInput>;
  where?: InputMaybe<QuestionnaireVersionsConnectionWhere>;
};

export type QuestionnaireVersionsFieldInput = {
  connect?: InputMaybe<Array<QuestionnaireVersionsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<QuestionnaireVersionsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<QuestionnaireVersionsCreateFieldInput>>;
};

export type QuestionnaireVersionsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<QuestionnaireVersionsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<QuestionnaireVersionsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<QuestionnaireVersionsNodeAggregationWhereInput>>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  questions_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questions_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  version_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  version_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  version_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  version_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  version_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  version_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  version_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  version_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  version_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  version_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  version_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  version_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  version_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  version_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  version_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
};

export type QuestionnaireVersionsRelationship = {
  __typename?: 'QuestionnaireVersionsRelationship';
  cursor: Scalars['String']['output'];
  node: QuestionnaireVersion;
};

export type QuestionnaireVersionsUpdateConnectionInput = {
  node?: InputMaybe<QuestionnaireVersionUpdateInput>;
};

export type QuestionnaireVersionsUpdateFieldInput = {
  connect?: InputMaybe<Array<QuestionnaireVersionsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<QuestionnaireVersionsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<QuestionnaireVersionsCreateFieldInput>>;
  delete?: InputMaybe<Array<QuestionnaireVersionsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<QuestionnaireVersionsDisconnectFieldInput>>;
  update?: InputMaybe<QuestionnaireVersionsUpdateConnectionInput>;
  where?: InputMaybe<QuestionnaireVersionsConnectionWhere>;
};

export type QuestionnaireWhere = {
  AND?: InputMaybe<Array<QuestionnaireWhere>>;
  NOT?: InputMaybe<QuestionnaireWhere>;
  OR?: InputMaybe<Array<QuestionnaireWhere>>;
  assessmentsAggregate?: InputMaybe<QuestionnaireAssessmentsAggregateInput>;
  /** Return Questionnaires where all of the related QuestionnaireAssessmentsConnections match this filter */
  assessmentsConnection_ALL?: InputMaybe<QuestionnaireAssessmentsConnectionWhere>;
  /** Return Questionnaires where none of the related QuestionnaireAssessmentsConnections match this filter */
  assessmentsConnection_NONE?: InputMaybe<QuestionnaireAssessmentsConnectionWhere>;
  /** Return Questionnaires where one of the related QuestionnaireAssessmentsConnections match this filter */
  assessmentsConnection_SINGLE?: InputMaybe<QuestionnaireAssessmentsConnectionWhere>;
  /** Return Questionnaires where some of the related QuestionnaireAssessmentsConnections match this filter */
  assessmentsConnection_SOME?: InputMaybe<QuestionnaireAssessmentsConnectionWhere>;
  /** Return Questionnaires where all of the related Assessments match this filter */
  assessments_ALL?: InputMaybe<AssessmentWhere>;
  /** Return Questionnaires where none of the related Assessments match this filter */
  assessments_NONE?: InputMaybe<AssessmentWhere>;
  /** Return Questionnaires where one of the related Assessments match this filter */
  assessments_SINGLE?: InputMaybe<AssessmentWhere>;
  /** Return Questionnaires where some of the related Assessments match this filter */
  assessments_SOME?: InputMaybe<AssessmentWhere>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  createdAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_CONTAINS?: InputMaybe<Scalars['ID']['input']>;
  id_ENDS_WITH?: InputMaybe<Scalars['ID']['input']>;
  id_IN?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_STARTS_WITH?: InputMaybe<Scalars['ID']['input']>;
  owner?: InputMaybe<UserWhere>;
  ownerAggregate?: InputMaybe<QuestionnaireOwnerAggregateInput>;
  ownerConnection?: InputMaybe<QuestionnaireOwnerConnectionWhere>;
  ownerConnection_NOT?: InputMaybe<QuestionnaireOwnerConnectionWhere>;
  owner_NOT?: InputMaybe<UserWhere>;
  questions?: InputMaybe<Scalars['String']['input']>;
  questions_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  questions_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  questions_IN?: InputMaybe<Array<Scalars['String']['input']>>;
  questions_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  teamAggregate?: InputMaybe<QuestionnaireTeamAggregateInput>;
  /** Return Questionnaires where all of the related QuestionnaireTeamConnections match this filter */
  teamConnection_ALL?: InputMaybe<QuestionnaireTeamConnectionWhere>;
  /** Return Questionnaires where none of the related QuestionnaireTeamConnections match this filter */
  teamConnection_NONE?: InputMaybe<QuestionnaireTeamConnectionWhere>;
  /** Return Questionnaires where one of the related QuestionnaireTeamConnections match this filter */
  teamConnection_SINGLE?: InputMaybe<QuestionnaireTeamConnectionWhere>;
  /** Return Questionnaires where some of the related QuestionnaireTeamConnections match this filter */
  teamConnection_SOME?: InputMaybe<QuestionnaireTeamConnectionWhere>;
  /** Return Questionnaires where all of the related Users match this filter */
  team_ALL?: InputMaybe<UserWhere>;
  /** Return Questionnaires where none of the related Users match this filter */
  team_NONE?: InputMaybe<UserWhere>;
  /** Return Questionnaires where one of the related Users match this filter */
  team_SINGLE?: InputMaybe<UserWhere>;
  /** Return Questionnaires where some of the related Users match this filter */
  team_SOME?: InputMaybe<UserWhere>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  title_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  title_IN?: InputMaybe<Array<Scalars['String']['input']>>;
  title_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  updatedAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  useVersioning?: InputMaybe<Scalars['Boolean']['input']>;
  versionsAggregate?: InputMaybe<QuestionnaireVersionsAggregateInput>;
  /** Return Questionnaires where all of the related QuestionnaireVersionsConnections match this filter */
  versionsConnection_ALL?: InputMaybe<QuestionnaireVersionsConnectionWhere>;
  /** Return Questionnaires where none of the related QuestionnaireVersionsConnections match this filter */
  versionsConnection_NONE?: InputMaybe<QuestionnaireVersionsConnectionWhere>;
  /** Return Questionnaires where one of the related QuestionnaireVersionsConnections match this filter */
  versionsConnection_SINGLE?: InputMaybe<QuestionnaireVersionsConnectionWhere>;
  /** Return Questionnaires where some of the related QuestionnaireVersionsConnections match this filter */
  versionsConnection_SOME?: InputMaybe<QuestionnaireVersionsConnectionWhere>;
  /** Return Questionnaires where all of the related QuestionnaireVersions match this filter */
  versions_ALL?: InputMaybe<QuestionnaireVersionWhere>;
  /** Return Questionnaires where none of the related QuestionnaireVersions match this filter */
  versions_NONE?: InputMaybe<QuestionnaireVersionWhere>;
  /** Return Questionnaires where one of the related QuestionnaireVersions match this filter */
  versions_SINGLE?: InputMaybe<QuestionnaireVersionWhere>;
  /** Return Questionnaires where some of the related QuestionnaireVersions match this filter */
  versions_SOME?: InputMaybe<QuestionnaireVersionWhere>;
};

export type QuestionnairesConnection = {
  __typename?: 'QuestionnairesConnection';
  edges: Array<QuestionnaireEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum SortDirection {
  /** Sort by field values in ascending order. */
  ASC = 'ASC',
  /** Sort by field values in descending order. */
  DESC = 'DESC'
}

export type StringAggregateSelectionNonNullable = {
  __typename?: 'StringAggregateSelectionNonNullable';
  longest: Scalars['String']['output'];
  shortest: Scalars['String']['output'];
};

export type StringAggregateSelectionNullable = {
  __typename?: 'StringAggregateSelectionNullable';
  longest?: Maybe<Scalars['String']['output']>;
  shortest?: Maybe<Scalars['String']['output']>;
};

export type UpdateAssessmentResponsesMutationResponse = {
  __typename?: 'UpdateAssessmentResponsesMutationResponse';
  assessmentResponses: Array<AssessmentResponse>;
  info: UpdateInfo;
};

export type UpdateAssessmentsMutationResponse = {
  __typename?: 'UpdateAssessmentsMutationResponse';
  assessments: Array<Assessment>;
  info: UpdateInfo;
};

export type UpdateCustomersMutationResponse = {
  __typename?: 'UpdateCustomersMutationResponse';
  customers: Array<Customer>;
  info: UpdateInfo;
};

export type UpdateInfo = {
  __typename?: 'UpdateInfo';
  bookmark?: Maybe<Scalars['String']['output']>;
  nodesCreated: Scalars['Int']['output'];
  nodesDeleted: Scalars['Int']['output'];
  relationshipsCreated: Scalars['Int']['output'];
  relationshipsDeleted: Scalars['Int']['output'];
};

export type UpdateQuestionnaireVersionsMutationResponse = {
  __typename?: 'UpdateQuestionnaireVersionsMutationResponse';
  info: UpdateInfo;
  questionnaireVersions: Array<QuestionnaireVersion>;
};

export type UpdateQuestionnairesMutationResponse = {
  __typename?: 'UpdateQuestionnairesMutationResponse';
  info: UpdateInfo;
  questionnaires: Array<Questionnaire>;
};

export type UpdateUsersMutationResponse = {
  __typename?: 'UpdateUsersMutationResponse';
  info: UpdateInfo;
  users: Array<User>;
};

export type User = {
  __typename?: 'User';
  assessmentFilter?: Maybe<Scalars['String']['output']>;
  assessmentSort?: Maybe<Scalars['String']['output']>;
  colorMode?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  customer?: Maybe<Customer>;
  customerAggregate?: Maybe<UserCustomerCustomerAggregationSelection>;
  customerConnection: UserCustomerConnection;
  customerFilter?: Maybe<Scalars['String']['output']>;
  customerSort?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  keycloakId?: Maybe<Scalars['ID']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  myAssessmentFlag?: Maybe<Scalars['Boolean']['output']>;
  myCustomerFlag?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  ownedAssessments: Array<Assessment>;
  ownedAssessmentsAggregate?: Maybe<UserAssessmentOwnedAssessmentsAggregationSelection>;
  ownedAssessmentsConnection: UserOwnedAssessmentsConnection;
  ownedCustomers: Array<Customer>;
  ownedCustomersAggregate?: Maybe<UserCustomerOwnedCustomersAggregationSelection>;
  ownedCustomersConnection: UserOwnedCustomersConnection;
  ownedQuestionnaires: Array<Questionnaire>;
  ownedQuestionnairesAggregate?: Maybe<UserQuestionnaireOwnedQuestionnairesAggregationSelection>;
  ownedQuestionnairesConnection: UserOwnedQuestionnairesConnection;
  picture?: Maybe<Scalars['String']['output']>;
  questionnaireSort?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  teamAssessments: Array<Assessment>;
  teamAssessmentsAggregate?: Maybe<UserAssessmentTeamAssessmentsAggregationSelection>;
  teamAssessmentsConnection: UserTeamAssessmentsConnection;
  teamQuestionnaires: Array<Questionnaire>;
  teamQuestionnairesAggregate?: Maybe<UserQuestionnaireTeamQuestionnairesAggregationSelection>;
  teamQuestionnairesConnection: UserTeamQuestionnairesConnection;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type UserCustomerArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<CustomerOptions>;
  where?: InputMaybe<CustomerWhere>;
};


export type UserCustomerAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<CustomerWhere>;
};


export type UserCustomerConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<UserCustomerConnectionSort>>;
  where?: InputMaybe<UserCustomerConnectionWhere>;
};


export type UserOwnedAssessmentsArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<AssessmentOptions>;
  where?: InputMaybe<AssessmentWhere>;
};


export type UserOwnedAssessmentsAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<AssessmentWhere>;
};


export type UserOwnedAssessmentsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<UserOwnedAssessmentsConnectionSort>>;
  where?: InputMaybe<UserOwnedAssessmentsConnectionWhere>;
};


export type UserOwnedCustomersArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<CustomerOptions>;
  where?: InputMaybe<CustomerWhere>;
};


export type UserOwnedCustomersAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<CustomerWhere>;
};


export type UserOwnedCustomersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<UserOwnedCustomersConnectionSort>>;
  where?: InputMaybe<UserOwnedCustomersConnectionWhere>;
};


export type UserOwnedQuestionnairesArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<QuestionnaireOptions>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type UserOwnedQuestionnairesAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type UserOwnedQuestionnairesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<UserOwnedQuestionnairesConnectionSort>>;
  where?: InputMaybe<UserOwnedQuestionnairesConnectionWhere>;
};


export type UserTeamAssessmentsArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<AssessmentOptions>;
  where?: InputMaybe<AssessmentWhere>;
};


export type UserTeamAssessmentsAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<AssessmentWhere>;
};


export type UserTeamAssessmentsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<UserTeamAssessmentsConnectionSort>>;
  where?: InputMaybe<UserTeamAssessmentsConnectionWhere>;
};


export type UserTeamQuestionnairesArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<QuestionnaireOptions>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type UserTeamQuestionnairesAggregateArgs = {
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  where?: InputMaybe<QuestionnaireWhere>;
};


export type UserTeamQuestionnairesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  directed?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<UserTeamQuestionnairesConnectionSort>>;
  where?: InputMaybe<UserTeamQuestionnairesConnectionWhere>;
};

export type UserAggregateSelection = {
  __typename?: 'UserAggregateSelection';
  assessmentFilter: StringAggregateSelectionNullable;
  assessmentSort: StringAggregateSelectionNullable;
  colorMode: StringAggregateSelectionNullable;
  count: Scalars['Int']['output'];
  createdAt: DateTimeAggregateSelectionNullable;
  customerFilter: StringAggregateSelectionNullable;
  customerSort: StringAggregateSelectionNullable;
  email: StringAggregateSelectionNonNullable;
  firstName: StringAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  keycloakId: IdAggregateSelectionNullable;
  lastName: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNullable;
  picture: StringAggregateSelectionNullable;
  questionnaireSort: StringAggregateSelectionNullable;
  role: StringAggregateSelectionNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type UserAssessmentOwnedAssessmentsAggregationSelection = {
  __typename?: 'UserAssessmentOwnedAssessmentsAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<UserAssessmentOwnedAssessmentsNodeAggregateSelection>;
};

export type UserAssessmentOwnedAssessmentsNodeAggregateSelection = {
  __typename?: 'UserAssessmentOwnedAssessmentsNodeAggregateSelection';
  calculation: StringAggregateSelectionNonNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  endDate: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  mode: StringAggregateSelectionNullable;
  questionsVersionId: IdAggregateSelectionNullable;
  startDate: DateTimeAggregateSelectionNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type UserAssessmentTeamAssessmentsAggregationSelection = {
  __typename?: 'UserAssessmentTeamAssessmentsAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<UserAssessmentTeamAssessmentsNodeAggregateSelection>;
};

export type UserAssessmentTeamAssessmentsNodeAggregateSelection = {
  __typename?: 'UserAssessmentTeamAssessmentsNodeAggregateSelection';
  calculation: StringAggregateSelectionNonNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  endDate: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  mode: StringAggregateSelectionNullable;
  questionsVersionId: IdAggregateSelectionNullable;
  startDate: DateTimeAggregateSelectionNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type UserConnectInput = {
  customer?: InputMaybe<UserCustomerConnectFieldInput>;
  ownedAssessments?: InputMaybe<Array<UserOwnedAssessmentsConnectFieldInput>>;
  ownedCustomers?: InputMaybe<Array<UserOwnedCustomersConnectFieldInput>>;
  ownedQuestionnaires?: InputMaybe<Array<UserOwnedQuestionnairesConnectFieldInput>>;
  teamAssessments?: InputMaybe<Array<UserTeamAssessmentsConnectFieldInput>>;
  teamQuestionnaires?: InputMaybe<Array<UserTeamQuestionnairesConnectFieldInput>>;
};

export type UserConnectOrCreateInput = {
  customer?: InputMaybe<UserCustomerConnectOrCreateFieldInput>;
  ownedAssessments?: InputMaybe<Array<UserOwnedAssessmentsConnectOrCreateFieldInput>>;
  ownedCustomers?: InputMaybe<Array<UserOwnedCustomersConnectOrCreateFieldInput>>;
  ownedQuestionnaires?: InputMaybe<Array<UserOwnedQuestionnairesConnectOrCreateFieldInput>>;
  teamAssessments?: InputMaybe<Array<UserTeamAssessmentsConnectOrCreateFieldInput>>;
  teamQuestionnaires?: InputMaybe<Array<UserTeamQuestionnairesConnectOrCreateFieldInput>>;
};

export type UserConnectOrCreateWhere = {
  node: UserUniqueWhere;
};

export type UserConnectWhere = {
  node: UserWhere;
};

export type UserCreateInput = {
  assessmentFilter?: InputMaybe<Scalars['String']['input']>;
  assessmentSort?: InputMaybe<Scalars['String']['input']>;
  colorMode?: InputMaybe<Scalars['String']['input']>;
  customer?: InputMaybe<UserCustomerFieldInput>;
  customerFilter?: InputMaybe<Scalars['String']['input']>;
  customerSort?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  keycloakId?: InputMaybe<Scalars['ID']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  myAssessmentFlag?: InputMaybe<Scalars['Boolean']['input']>;
  myCustomerFlag?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ownedAssessments?: InputMaybe<UserOwnedAssessmentsFieldInput>;
  ownedCustomers?: InputMaybe<UserOwnedCustomersFieldInput>;
  ownedQuestionnaires?: InputMaybe<UserOwnedQuestionnairesFieldInput>;
  picture?: InputMaybe<Scalars['String']['input']>;
  questionnaireSort?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  teamAssessments?: InputMaybe<UserTeamAssessmentsFieldInput>;
  teamQuestionnaires?: InputMaybe<UserTeamQuestionnairesFieldInput>;
};

export type UserCustomerAggregateInput = {
  AND?: InputMaybe<Array<UserCustomerAggregateInput>>;
  NOT?: InputMaybe<UserCustomerAggregateInput>;
  OR?: InputMaybe<Array<UserCustomerAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<UserCustomerNodeAggregationWhereInput>;
};

export type UserCustomerConnectFieldInput = {
  connect?: InputMaybe<CustomerConnectInput>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<CustomerConnectWhere>;
};

export type UserCustomerConnectOrCreateFieldInput = {
  onCreate: UserCustomerConnectOrCreateFieldInputOnCreate;
  where: CustomerConnectOrCreateWhere;
};

export type UserCustomerConnectOrCreateFieldInputOnCreate = {
  node: CustomerOnCreateInput;
};

export type UserCustomerConnection = {
  __typename?: 'UserCustomerConnection';
  edges: Array<UserCustomerRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserCustomerConnectionSort = {
  node?: InputMaybe<CustomerSort>;
};

export type UserCustomerConnectionWhere = {
  AND?: InputMaybe<Array<UserCustomerConnectionWhere>>;
  NOT?: InputMaybe<UserCustomerConnectionWhere>;
  OR?: InputMaybe<Array<UserCustomerConnectionWhere>>;
  node?: InputMaybe<CustomerWhere>;
};

export type UserCustomerCreateFieldInput = {
  node: CustomerCreateInput;
};

export type UserCustomerCustomerAggregationSelection = {
  __typename?: 'UserCustomerCustomerAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<UserCustomerCustomerNodeAggregateSelection>;
};

export type UserCustomerCustomerNodeAggregateSelection = {
  __typename?: 'UserCustomerCustomerNodeAggregateSelection';
  contactEmail: StringAggregateSelectionNullable;
  contactName: StringAggregateSelectionNullable;
  contactPhone: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  industry: StringAggregateSelectionNullable;
  leadCountry: StringAggregateSelectionNullable;
  logo: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type UserCustomerDeleteFieldInput = {
  delete?: InputMaybe<CustomerDeleteInput>;
  where?: InputMaybe<UserCustomerConnectionWhere>;
};

export type UserCustomerDisconnectFieldInput = {
  disconnect?: InputMaybe<CustomerDisconnectInput>;
  where?: InputMaybe<UserCustomerConnectionWhere>;
};

export type UserCustomerFieldInput = {
  connect?: InputMaybe<UserCustomerConnectFieldInput>;
  connectOrCreate?: InputMaybe<UserCustomerConnectOrCreateFieldInput>;
  create?: InputMaybe<UserCustomerCreateFieldInput>;
};

export type UserCustomerNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<UserCustomerNodeAggregationWhereInput>>;
  NOT?: InputMaybe<UserCustomerNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<UserCustomerNodeAggregationWhereInput>>;
  contactEmail_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  industry_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  industry_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  logo_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  logo_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  name_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserCustomerOwnedCustomersAggregationSelection = {
  __typename?: 'UserCustomerOwnedCustomersAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<UserCustomerOwnedCustomersNodeAggregateSelection>;
};

export type UserCustomerOwnedCustomersNodeAggregateSelection = {
  __typename?: 'UserCustomerOwnedCustomersNodeAggregateSelection';
  contactEmail: StringAggregateSelectionNullable;
  contactName: StringAggregateSelectionNullable;
  contactPhone: StringAggregateSelectionNullable;
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  industry: StringAggregateSelectionNullable;
  leadCountry: StringAggregateSelectionNullable;
  logo: StringAggregateSelectionNullable;
  name: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type UserCustomerRelationship = {
  __typename?: 'UserCustomerRelationship';
  cursor: Scalars['String']['output'];
  node: Customer;
};

export type UserCustomerUpdateConnectionInput = {
  node?: InputMaybe<CustomerUpdateInput>;
};

export type UserCustomerUpdateFieldInput = {
  connect?: InputMaybe<UserCustomerConnectFieldInput>;
  connectOrCreate?: InputMaybe<UserCustomerConnectOrCreateFieldInput>;
  create?: InputMaybe<UserCustomerCreateFieldInput>;
  delete?: InputMaybe<UserCustomerDeleteFieldInput>;
  disconnect?: InputMaybe<UserCustomerDisconnectFieldInput>;
  update?: InputMaybe<UserCustomerUpdateConnectionInput>;
  where?: InputMaybe<UserCustomerConnectionWhere>;
};

export type UserDeleteInput = {
  customer?: InputMaybe<UserCustomerDeleteFieldInput>;
  ownedAssessments?: InputMaybe<Array<UserOwnedAssessmentsDeleteFieldInput>>;
  ownedCustomers?: InputMaybe<Array<UserOwnedCustomersDeleteFieldInput>>;
  ownedQuestionnaires?: InputMaybe<Array<UserOwnedQuestionnairesDeleteFieldInput>>;
  teamAssessments?: InputMaybe<Array<UserTeamAssessmentsDeleteFieldInput>>;
  teamQuestionnaires?: InputMaybe<Array<UserTeamQuestionnairesDeleteFieldInput>>;
};

export type UserDisconnectInput = {
  customer?: InputMaybe<UserCustomerDisconnectFieldInput>;
  ownedAssessments?: InputMaybe<Array<UserOwnedAssessmentsDisconnectFieldInput>>;
  ownedCustomers?: InputMaybe<Array<UserOwnedCustomersDisconnectFieldInput>>;
  ownedQuestionnaires?: InputMaybe<Array<UserOwnedQuestionnairesDisconnectFieldInput>>;
  teamAssessments?: InputMaybe<Array<UserTeamAssessmentsDisconnectFieldInput>>;
  teamQuestionnaires?: InputMaybe<Array<UserTeamQuestionnairesDisconnectFieldInput>>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export type UserOnCreateInput = {
  assessmentFilter?: InputMaybe<Scalars['String']['input']>;
  assessmentSort?: InputMaybe<Scalars['String']['input']>;
  colorMode?: InputMaybe<Scalars['String']['input']>;
  customerFilter?: InputMaybe<Scalars['String']['input']>;
  customerSort?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  keycloakId?: InputMaybe<Scalars['ID']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  myAssessmentFlag?: InputMaybe<Scalars['Boolean']['input']>;
  myCustomerFlag?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  picture?: InputMaybe<Scalars['String']['input']>;
  questionnaireSort?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

export type UserOptions = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Specify one or more UserSort objects to sort Users by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<UserSort>>;
};

export type UserOwnedAssessmentsAggregateInput = {
  AND?: InputMaybe<Array<UserOwnedAssessmentsAggregateInput>>;
  NOT?: InputMaybe<UserOwnedAssessmentsAggregateInput>;
  OR?: InputMaybe<Array<UserOwnedAssessmentsAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<UserOwnedAssessmentsNodeAggregationWhereInput>;
};

export type UserOwnedAssessmentsConnectFieldInput = {
  connect?: InputMaybe<Array<AssessmentConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<AssessmentConnectWhere>;
};

export type UserOwnedAssessmentsConnectOrCreateFieldInput = {
  onCreate: UserOwnedAssessmentsConnectOrCreateFieldInputOnCreate;
  where: AssessmentConnectOrCreateWhere;
};

export type UserOwnedAssessmentsConnectOrCreateFieldInputOnCreate = {
  node: AssessmentOnCreateInput;
};

export type UserOwnedAssessmentsConnection = {
  __typename?: 'UserOwnedAssessmentsConnection';
  edges: Array<UserOwnedAssessmentsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserOwnedAssessmentsConnectionSort = {
  node?: InputMaybe<AssessmentSort>;
};

export type UserOwnedAssessmentsConnectionWhere = {
  AND?: InputMaybe<Array<UserOwnedAssessmentsConnectionWhere>>;
  NOT?: InputMaybe<UserOwnedAssessmentsConnectionWhere>;
  OR?: InputMaybe<Array<UserOwnedAssessmentsConnectionWhere>>;
  node?: InputMaybe<AssessmentWhere>;
};

export type UserOwnedAssessmentsCreateFieldInput = {
  node: AssessmentCreateInput;
};

export type UserOwnedAssessmentsDeleteFieldInput = {
  delete?: InputMaybe<AssessmentDeleteInput>;
  where?: InputMaybe<UserOwnedAssessmentsConnectionWhere>;
};

export type UserOwnedAssessmentsDisconnectFieldInput = {
  disconnect?: InputMaybe<AssessmentDisconnectInput>;
  where?: InputMaybe<UserOwnedAssessmentsConnectionWhere>;
};

export type UserOwnedAssessmentsFieldInput = {
  connect?: InputMaybe<Array<UserOwnedAssessmentsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<UserOwnedAssessmentsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<UserOwnedAssessmentsCreateFieldInput>>;
};

export type UserOwnedAssessmentsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<UserOwnedAssessmentsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<UserOwnedAssessmentsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<UserOwnedAssessmentsNodeAggregationWhereInput>>;
  calculation_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  calculation_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  mode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  mode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  startDate_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  title_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  title_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserOwnedAssessmentsRelationship = {
  __typename?: 'UserOwnedAssessmentsRelationship';
  cursor: Scalars['String']['output'];
  node: Assessment;
};

export type UserOwnedAssessmentsUpdateConnectionInput = {
  node?: InputMaybe<AssessmentUpdateInput>;
};

export type UserOwnedAssessmentsUpdateFieldInput = {
  connect?: InputMaybe<Array<UserOwnedAssessmentsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<UserOwnedAssessmentsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<UserOwnedAssessmentsCreateFieldInput>>;
  delete?: InputMaybe<Array<UserOwnedAssessmentsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<UserOwnedAssessmentsDisconnectFieldInput>>;
  update?: InputMaybe<UserOwnedAssessmentsUpdateConnectionInput>;
  where?: InputMaybe<UserOwnedAssessmentsConnectionWhere>;
};

export type UserOwnedCustomersAggregateInput = {
  AND?: InputMaybe<Array<UserOwnedCustomersAggregateInput>>;
  NOT?: InputMaybe<UserOwnedCustomersAggregateInput>;
  OR?: InputMaybe<Array<UserOwnedCustomersAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<UserOwnedCustomersNodeAggregationWhereInput>;
};

export type UserOwnedCustomersConnectFieldInput = {
  connect?: InputMaybe<Array<CustomerConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<CustomerConnectWhere>;
};

export type UserOwnedCustomersConnectOrCreateFieldInput = {
  onCreate: UserOwnedCustomersConnectOrCreateFieldInputOnCreate;
  where: CustomerConnectOrCreateWhere;
};

export type UserOwnedCustomersConnectOrCreateFieldInputOnCreate = {
  node: CustomerOnCreateInput;
};

export type UserOwnedCustomersConnection = {
  __typename?: 'UserOwnedCustomersConnection';
  edges: Array<UserOwnedCustomersRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserOwnedCustomersConnectionSort = {
  node?: InputMaybe<CustomerSort>;
};

export type UserOwnedCustomersConnectionWhere = {
  AND?: InputMaybe<Array<UserOwnedCustomersConnectionWhere>>;
  NOT?: InputMaybe<UserOwnedCustomersConnectionWhere>;
  OR?: InputMaybe<Array<UserOwnedCustomersConnectionWhere>>;
  node?: InputMaybe<CustomerWhere>;
};

export type UserOwnedCustomersCreateFieldInput = {
  node: CustomerCreateInput;
};

export type UserOwnedCustomersDeleteFieldInput = {
  delete?: InputMaybe<CustomerDeleteInput>;
  where?: InputMaybe<UserOwnedCustomersConnectionWhere>;
};

export type UserOwnedCustomersDisconnectFieldInput = {
  disconnect?: InputMaybe<CustomerDisconnectInput>;
  where?: InputMaybe<UserOwnedCustomersConnectionWhere>;
};

export type UserOwnedCustomersFieldInput = {
  connect?: InputMaybe<Array<UserOwnedCustomersConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<UserOwnedCustomersConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<UserOwnedCustomersCreateFieldInput>>;
};

export type UserOwnedCustomersNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<UserOwnedCustomersNodeAggregationWhereInput>>;
  NOT?: InputMaybe<UserOwnedCustomersNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<UserOwnedCustomersNodeAggregationWhereInput>>;
  contactEmail_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactEmail_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactEmail_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactName_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactName_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactName_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactName_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  contactPhone_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  contactPhone_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  industry_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  industry_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  industry_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  industry_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  industry_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  leadCountry_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  leadCountry_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  logo_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  logo_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  logo_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  logo_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  logo_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  name_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  name_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  name_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserOwnedCustomersRelationship = {
  __typename?: 'UserOwnedCustomersRelationship';
  cursor: Scalars['String']['output'];
  node: Customer;
};

export type UserOwnedCustomersUpdateConnectionInput = {
  node?: InputMaybe<CustomerUpdateInput>;
};

export type UserOwnedCustomersUpdateFieldInput = {
  connect?: InputMaybe<Array<UserOwnedCustomersConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<UserOwnedCustomersConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<UserOwnedCustomersCreateFieldInput>>;
  delete?: InputMaybe<Array<UserOwnedCustomersDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<UserOwnedCustomersDisconnectFieldInput>>;
  update?: InputMaybe<UserOwnedCustomersUpdateConnectionInput>;
  where?: InputMaybe<UserOwnedCustomersConnectionWhere>;
};

export type UserOwnedQuestionnairesAggregateInput = {
  AND?: InputMaybe<Array<UserOwnedQuestionnairesAggregateInput>>;
  NOT?: InputMaybe<UserOwnedQuestionnairesAggregateInput>;
  OR?: InputMaybe<Array<UserOwnedQuestionnairesAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<UserOwnedQuestionnairesNodeAggregationWhereInput>;
};

export type UserOwnedQuestionnairesConnectFieldInput = {
  connect?: InputMaybe<Array<QuestionnaireConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<QuestionnaireConnectWhere>;
};

export type UserOwnedQuestionnairesConnectOrCreateFieldInput = {
  onCreate: UserOwnedQuestionnairesConnectOrCreateFieldInputOnCreate;
  where: QuestionnaireConnectOrCreateWhere;
};

export type UserOwnedQuestionnairesConnectOrCreateFieldInputOnCreate = {
  node: QuestionnaireOnCreateInput;
};

export type UserOwnedQuestionnairesConnection = {
  __typename?: 'UserOwnedQuestionnairesConnection';
  edges: Array<UserOwnedQuestionnairesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserOwnedQuestionnairesConnectionSort = {
  node?: InputMaybe<QuestionnaireSort>;
};

export type UserOwnedQuestionnairesConnectionWhere = {
  AND?: InputMaybe<Array<UserOwnedQuestionnairesConnectionWhere>>;
  NOT?: InputMaybe<UserOwnedQuestionnairesConnectionWhere>;
  OR?: InputMaybe<Array<UserOwnedQuestionnairesConnectionWhere>>;
  node?: InputMaybe<QuestionnaireWhere>;
};

export type UserOwnedQuestionnairesCreateFieldInput = {
  node: QuestionnaireCreateInput;
};

export type UserOwnedQuestionnairesDeleteFieldInput = {
  delete?: InputMaybe<QuestionnaireDeleteInput>;
  where?: InputMaybe<UserOwnedQuestionnairesConnectionWhere>;
};

export type UserOwnedQuestionnairesDisconnectFieldInput = {
  disconnect?: InputMaybe<QuestionnaireDisconnectInput>;
  where?: InputMaybe<UserOwnedQuestionnairesConnectionWhere>;
};

export type UserOwnedQuestionnairesFieldInput = {
  connect?: InputMaybe<Array<UserOwnedQuestionnairesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<UserOwnedQuestionnairesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<UserOwnedQuestionnairesCreateFieldInput>>;
};

export type UserOwnedQuestionnairesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<UserOwnedQuestionnairesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<UserOwnedQuestionnairesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<UserOwnedQuestionnairesNodeAggregationWhereInput>>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  questions_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questions_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  title_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserOwnedQuestionnairesRelationship = {
  __typename?: 'UserOwnedQuestionnairesRelationship';
  cursor: Scalars['String']['output'];
  node: Questionnaire;
};

export type UserOwnedQuestionnairesUpdateConnectionInput = {
  node?: InputMaybe<QuestionnaireUpdateInput>;
};

export type UserOwnedQuestionnairesUpdateFieldInput = {
  connect?: InputMaybe<Array<UserOwnedQuestionnairesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<UserOwnedQuestionnairesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<UserOwnedQuestionnairesCreateFieldInput>>;
  delete?: InputMaybe<Array<UserOwnedQuestionnairesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<UserOwnedQuestionnairesDisconnectFieldInput>>;
  update?: InputMaybe<UserOwnedQuestionnairesUpdateConnectionInput>;
  where?: InputMaybe<UserOwnedQuestionnairesConnectionWhere>;
};

export type UserQuestionnaireOwnedQuestionnairesAggregationSelection = {
  __typename?: 'UserQuestionnaireOwnedQuestionnairesAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<UserQuestionnaireOwnedQuestionnairesNodeAggregateSelection>;
};

export type UserQuestionnaireOwnedQuestionnairesNodeAggregateSelection = {
  __typename?: 'UserQuestionnaireOwnedQuestionnairesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  questions: StringAggregateSelectionNonNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type UserQuestionnaireTeamQuestionnairesAggregationSelection = {
  __typename?: 'UserQuestionnaireTeamQuestionnairesAggregationSelection';
  count: Scalars['Int']['output'];
  node?: Maybe<UserQuestionnaireTeamQuestionnairesNodeAggregateSelection>;
};

export type UserQuestionnaireTeamQuestionnairesNodeAggregateSelection = {
  __typename?: 'UserQuestionnaireTeamQuestionnairesNodeAggregateSelection';
  createdAt: DateTimeAggregateSelectionNullable;
  id: IdAggregateSelectionNonNullable;
  questions: StringAggregateSelectionNonNullable;
  title: StringAggregateSelectionNonNullable;
  updatedAt: DateTimeAggregateSelectionNullable;
};

export type UserRelationInput = {
  customer?: InputMaybe<UserCustomerCreateFieldInput>;
  ownedAssessments?: InputMaybe<Array<UserOwnedAssessmentsCreateFieldInput>>;
  ownedCustomers?: InputMaybe<Array<UserOwnedCustomersCreateFieldInput>>;
  ownedQuestionnaires?: InputMaybe<Array<UserOwnedQuestionnairesCreateFieldInput>>;
  teamAssessments?: InputMaybe<Array<UserTeamAssessmentsCreateFieldInput>>;
  teamQuestionnaires?: InputMaybe<Array<UserTeamQuestionnairesCreateFieldInput>>;
};

/** Fields to sort Users by. The order in which sorts are applied is not guaranteed when specifying many fields in one UserSort object. */
export type UserSort = {
  assessmentFilter?: InputMaybe<SortDirection>;
  assessmentSort?: InputMaybe<SortDirection>;
  colorMode?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  customerFilter?: InputMaybe<SortDirection>;
  customerSort?: InputMaybe<SortDirection>;
  email?: InputMaybe<SortDirection>;
  firstName?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  keycloakId?: InputMaybe<SortDirection>;
  lastName?: InputMaybe<SortDirection>;
  myAssessmentFlag?: InputMaybe<SortDirection>;
  myCustomerFlag?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  picture?: InputMaybe<SortDirection>;
  questionnaireSort?: InputMaybe<SortDirection>;
  role?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type UserTeamAssessmentsAggregateInput = {
  AND?: InputMaybe<Array<UserTeamAssessmentsAggregateInput>>;
  NOT?: InputMaybe<UserTeamAssessmentsAggregateInput>;
  OR?: InputMaybe<Array<UserTeamAssessmentsAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<UserTeamAssessmentsNodeAggregationWhereInput>;
};

export type UserTeamAssessmentsConnectFieldInput = {
  connect?: InputMaybe<Array<AssessmentConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<AssessmentConnectWhere>;
};

export type UserTeamAssessmentsConnectOrCreateFieldInput = {
  onCreate: UserTeamAssessmentsConnectOrCreateFieldInputOnCreate;
  where: AssessmentConnectOrCreateWhere;
};

export type UserTeamAssessmentsConnectOrCreateFieldInputOnCreate = {
  node: AssessmentOnCreateInput;
};

export type UserTeamAssessmentsConnection = {
  __typename?: 'UserTeamAssessmentsConnection';
  edges: Array<UserTeamAssessmentsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserTeamAssessmentsConnectionSort = {
  node?: InputMaybe<AssessmentSort>;
};

export type UserTeamAssessmentsConnectionWhere = {
  AND?: InputMaybe<Array<UserTeamAssessmentsConnectionWhere>>;
  NOT?: InputMaybe<UserTeamAssessmentsConnectionWhere>;
  OR?: InputMaybe<Array<UserTeamAssessmentsConnectionWhere>>;
  node?: InputMaybe<AssessmentWhere>;
};

export type UserTeamAssessmentsCreateFieldInput = {
  node: AssessmentCreateInput;
};

export type UserTeamAssessmentsDeleteFieldInput = {
  delete?: InputMaybe<AssessmentDeleteInput>;
  where?: InputMaybe<UserTeamAssessmentsConnectionWhere>;
};

export type UserTeamAssessmentsDisconnectFieldInput = {
  disconnect?: InputMaybe<AssessmentDisconnectInput>;
  where?: InputMaybe<UserTeamAssessmentsConnectionWhere>;
};

export type UserTeamAssessmentsFieldInput = {
  connect?: InputMaybe<Array<UserTeamAssessmentsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<UserTeamAssessmentsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<UserTeamAssessmentsCreateFieldInput>>;
};

export type UserTeamAssessmentsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<UserTeamAssessmentsNodeAggregationWhereInput>>;
  NOT?: InputMaybe<UserTeamAssessmentsNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<UserTeamAssessmentsNodeAggregationWhereInput>>;
  calculation_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  calculation_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  calculation_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  calculation_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  calculation_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  endDate_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  mode_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  mode_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  mode_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  mode_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  mode_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  startDate_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  startDate_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  title_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  title_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserTeamAssessmentsRelationship = {
  __typename?: 'UserTeamAssessmentsRelationship';
  cursor: Scalars['String']['output'];
  node: Assessment;
};

export type UserTeamAssessmentsUpdateConnectionInput = {
  node?: InputMaybe<AssessmentUpdateInput>;
};

export type UserTeamAssessmentsUpdateFieldInput = {
  connect?: InputMaybe<Array<UserTeamAssessmentsConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<UserTeamAssessmentsConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<UserTeamAssessmentsCreateFieldInput>>;
  delete?: InputMaybe<Array<UserTeamAssessmentsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<UserTeamAssessmentsDisconnectFieldInput>>;
  update?: InputMaybe<UserTeamAssessmentsUpdateConnectionInput>;
  where?: InputMaybe<UserTeamAssessmentsConnectionWhere>;
};

export type UserTeamQuestionnairesAggregateInput = {
  AND?: InputMaybe<Array<UserTeamQuestionnairesAggregateInput>>;
  NOT?: InputMaybe<UserTeamQuestionnairesAggregateInput>;
  OR?: InputMaybe<Array<UserTeamQuestionnairesAggregateInput>>;
  count?: InputMaybe<Scalars['Int']['input']>;
  count_GT?: InputMaybe<Scalars['Int']['input']>;
  count_GTE?: InputMaybe<Scalars['Int']['input']>;
  count_LT?: InputMaybe<Scalars['Int']['input']>;
  count_LTE?: InputMaybe<Scalars['Int']['input']>;
  node?: InputMaybe<UserTeamQuestionnairesNodeAggregationWhereInput>;
};

export type UserTeamQuestionnairesConnectFieldInput = {
  connect?: InputMaybe<Array<QuestionnaireConnectInput>>;
  /** Whether or not to overwrite any matching relationship with the new properties. Will default to `false` in 4.0.0. */
  overwrite?: Scalars['Boolean']['input'];
  where?: InputMaybe<QuestionnaireConnectWhere>;
};

export type UserTeamQuestionnairesConnectOrCreateFieldInput = {
  onCreate: UserTeamQuestionnairesConnectOrCreateFieldInputOnCreate;
  where: QuestionnaireConnectOrCreateWhere;
};

export type UserTeamQuestionnairesConnectOrCreateFieldInputOnCreate = {
  node: QuestionnaireOnCreateInput;
};

export type UserTeamQuestionnairesConnection = {
  __typename?: 'UserTeamQuestionnairesConnection';
  edges: Array<UserTeamQuestionnairesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserTeamQuestionnairesConnectionSort = {
  node?: InputMaybe<QuestionnaireSort>;
};

export type UserTeamQuestionnairesConnectionWhere = {
  AND?: InputMaybe<Array<UserTeamQuestionnairesConnectionWhere>>;
  NOT?: InputMaybe<UserTeamQuestionnairesConnectionWhere>;
  OR?: InputMaybe<Array<UserTeamQuestionnairesConnectionWhere>>;
  node?: InputMaybe<QuestionnaireWhere>;
};

export type UserTeamQuestionnairesCreateFieldInput = {
  node: QuestionnaireCreateInput;
};

export type UserTeamQuestionnairesDeleteFieldInput = {
  delete?: InputMaybe<QuestionnaireDeleteInput>;
  where?: InputMaybe<UserTeamQuestionnairesConnectionWhere>;
};

export type UserTeamQuestionnairesDisconnectFieldInput = {
  disconnect?: InputMaybe<QuestionnaireDisconnectInput>;
  where?: InputMaybe<UserTeamQuestionnairesConnectionWhere>;
};

export type UserTeamQuestionnairesFieldInput = {
  connect?: InputMaybe<Array<UserTeamQuestionnairesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<UserTeamQuestionnairesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<UserTeamQuestionnairesCreateFieldInput>>;
};

export type UserTeamQuestionnairesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<UserTeamQuestionnairesNodeAggregationWhereInput>>;
  NOT?: InputMaybe<UserTeamQuestionnairesNodeAggregationWhereInput>;
  OR?: InputMaybe<Array<UserTeamQuestionnairesNodeAggregationWhereInput>>;
  createdAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  questions_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  questions_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  questions_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questions_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  questions_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_AVERAGE_LENGTH_EQUAL?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_GTE?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LT?: InputMaybe<Scalars['Float']['input']>;
  title_AVERAGE_LENGTH_LTE?: InputMaybe<Scalars['Float']['input']>;
  title_LONGEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_LONGEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_EQUAL?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_GTE?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LT?: InputMaybe<Scalars['Int']['input']>;
  title_SHORTEST_LENGTH_LTE?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_MAX_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MAX_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_EQUAL?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_MIN_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserTeamQuestionnairesRelationship = {
  __typename?: 'UserTeamQuestionnairesRelationship';
  cursor: Scalars['String']['output'];
  node: Questionnaire;
};

export type UserTeamQuestionnairesUpdateConnectionInput = {
  node?: InputMaybe<QuestionnaireUpdateInput>;
};

export type UserTeamQuestionnairesUpdateFieldInput = {
  connect?: InputMaybe<Array<UserTeamQuestionnairesConnectFieldInput>>;
  connectOrCreate?: InputMaybe<Array<UserTeamQuestionnairesConnectOrCreateFieldInput>>;
  create?: InputMaybe<Array<UserTeamQuestionnairesCreateFieldInput>>;
  delete?: InputMaybe<Array<UserTeamQuestionnairesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<UserTeamQuestionnairesDisconnectFieldInput>>;
  update?: InputMaybe<UserTeamQuestionnairesUpdateConnectionInput>;
  where?: InputMaybe<UserTeamQuestionnairesConnectionWhere>;
};

export type UserUniqueWhere = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type UserUpdateInput = {
  assessmentFilter?: InputMaybe<Scalars['String']['input']>;
  assessmentSort?: InputMaybe<Scalars['String']['input']>;
  colorMode?: InputMaybe<Scalars['String']['input']>;
  customer?: InputMaybe<UserCustomerUpdateFieldInput>;
  customerFilter?: InputMaybe<Scalars['String']['input']>;
  customerSort?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  keycloakId?: InputMaybe<Scalars['ID']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  myAssessmentFlag?: InputMaybe<Scalars['Boolean']['input']>;
  myCustomerFlag?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ownedAssessments?: InputMaybe<Array<UserOwnedAssessmentsUpdateFieldInput>>;
  ownedCustomers?: InputMaybe<Array<UserOwnedCustomersUpdateFieldInput>>;
  ownedQuestionnaires?: InputMaybe<Array<UserOwnedQuestionnairesUpdateFieldInput>>;
  picture?: InputMaybe<Scalars['String']['input']>;
  questionnaireSort?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  teamAssessments?: InputMaybe<Array<UserTeamAssessmentsUpdateFieldInput>>;
  teamQuestionnaires?: InputMaybe<Array<UserTeamQuestionnairesUpdateFieldInput>>;
};

export type UserWhere = {
  AND?: InputMaybe<Array<UserWhere>>;
  NOT?: InputMaybe<UserWhere>;
  OR?: InputMaybe<Array<UserWhere>>;
  assessmentFilter?: InputMaybe<Scalars['String']['input']>;
  assessmentFilter_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  assessmentFilter_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  assessmentFilter_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  assessmentFilter_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  assessmentSort?: InputMaybe<Scalars['String']['input']>;
  assessmentSort_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  assessmentSort_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  assessmentSort_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  assessmentSort_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  colorMode?: InputMaybe<Scalars['String']['input']>;
  colorMode_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  colorMode_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  colorMode_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  colorMode_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  createdAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
  customer?: InputMaybe<CustomerWhere>;
  customerAggregate?: InputMaybe<UserCustomerAggregateInput>;
  customerConnection?: InputMaybe<UserCustomerConnectionWhere>;
  customerConnection_NOT?: InputMaybe<UserCustomerConnectionWhere>;
  customerFilter?: InputMaybe<Scalars['String']['input']>;
  customerFilter_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  customerFilter_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  customerFilter_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  customerFilter_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  customerSort?: InputMaybe<Scalars['String']['input']>;
  customerSort_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  customerSort_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  customerSort_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  customerSort_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  customer_NOT?: InputMaybe<CustomerWhere>;
  email?: InputMaybe<Scalars['String']['input']>;
  email_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  email_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  email_IN?: InputMaybe<Array<Scalars['String']['input']>>;
  email_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  firstName_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  firstName_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  firstName_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  firstName_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_CONTAINS?: InputMaybe<Scalars['ID']['input']>;
  id_ENDS_WITH?: InputMaybe<Scalars['ID']['input']>;
  id_IN?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_STARTS_WITH?: InputMaybe<Scalars['ID']['input']>;
  keycloakId?: InputMaybe<Scalars['ID']['input']>;
  keycloakId_CONTAINS?: InputMaybe<Scalars['ID']['input']>;
  keycloakId_ENDS_WITH?: InputMaybe<Scalars['ID']['input']>;
  keycloakId_IN?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  keycloakId_STARTS_WITH?: InputMaybe<Scalars['ID']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  lastName_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  lastName_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  lastName_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lastName_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  myAssessmentFlag?: InputMaybe<Scalars['Boolean']['input']>;
  myCustomerFlag?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  name_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  name_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  ownedAssessmentsAggregate?: InputMaybe<UserOwnedAssessmentsAggregateInput>;
  /** Return Users where all of the related UserOwnedAssessmentsConnections match this filter */
  ownedAssessmentsConnection_ALL?: InputMaybe<UserOwnedAssessmentsConnectionWhere>;
  /** Return Users where none of the related UserOwnedAssessmentsConnections match this filter */
  ownedAssessmentsConnection_NONE?: InputMaybe<UserOwnedAssessmentsConnectionWhere>;
  /** Return Users where one of the related UserOwnedAssessmentsConnections match this filter */
  ownedAssessmentsConnection_SINGLE?: InputMaybe<UserOwnedAssessmentsConnectionWhere>;
  /** Return Users where some of the related UserOwnedAssessmentsConnections match this filter */
  ownedAssessmentsConnection_SOME?: InputMaybe<UserOwnedAssessmentsConnectionWhere>;
  /** Return Users where all of the related Assessments match this filter */
  ownedAssessments_ALL?: InputMaybe<AssessmentWhere>;
  /** Return Users where none of the related Assessments match this filter */
  ownedAssessments_NONE?: InputMaybe<AssessmentWhere>;
  /** Return Users where one of the related Assessments match this filter */
  ownedAssessments_SINGLE?: InputMaybe<AssessmentWhere>;
  /** Return Users where some of the related Assessments match this filter */
  ownedAssessments_SOME?: InputMaybe<AssessmentWhere>;
  ownedCustomersAggregate?: InputMaybe<UserOwnedCustomersAggregateInput>;
  /** Return Users where all of the related UserOwnedCustomersConnections match this filter */
  ownedCustomersConnection_ALL?: InputMaybe<UserOwnedCustomersConnectionWhere>;
  /** Return Users where none of the related UserOwnedCustomersConnections match this filter */
  ownedCustomersConnection_NONE?: InputMaybe<UserOwnedCustomersConnectionWhere>;
  /** Return Users where one of the related UserOwnedCustomersConnections match this filter */
  ownedCustomersConnection_SINGLE?: InputMaybe<UserOwnedCustomersConnectionWhere>;
  /** Return Users where some of the related UserOwnedCustomersConnections match this filter */
  ownedCustomersConnection_SOME?: InputMaybe<UserOwnedCustomersConnectionWhere>;
  /** Return Users where all of the related Customers match this filter */
  ownedCustomers_ALL?: InputMaybe<CustomerWhere>;
  /** Return Users where none of the related Customers match this filter */
  ownedCustomers_NONE?: InputMaybe<CustomerWhere>;
  /** Return Users where one of the related Customers match this filter */
  ownedCustomers_SINGLE?: InputMaybe<CustomerWhere>;
  /** Return Users where some of the related Customers match this filter */
  ownedCustomers_SOME?: InputMaybe<CustomerWhere>;
  ownedQuestionnairesAggregate?: InputMaybe<UserOwnedQuestionnairesAggregateInput>;
  /** Return Users where all of the related UserOwnedQuestionnairesConnections match this filter */
  ownedQuestionnairesConnection_ALL?: InputMaybe<UserOwnedQuestionnairesConnectionWhere>;
  /** Return Users where none of the related UserOwnedQuestionnairesConnections match this filter */
  ownedQuestionnairesConnection_NONE?: InputMaybe<UserOwnedQuestionnairesConnectionWhere>;
  /** Return Users where one of the related UserOwnedQuestionnairesConnections match this filter */
  ownedQuestionnairesConnection_SINGLE?: InputMaybe<UserOwnedQuestionnairesConnectionWhere>;
  /** Return Users where some of the related UserOwnedQuestionnairesConnections match this filter */
  ownedQuestionnairesConnection_SOME?: InputMaybe<UserOwnedQuestionnairesConnectionWhere>;
  /** Return Users where all of the related Questionnaires match this filter */
  ownedQuestionnaires_ALL?: InputMaybe<QuestionnaireWhere>;
  /** Return Users where none of the related Questionnaires match this filter */
  ownedQuestionnaires_NONE?: InputMaybe<QuestionnaireWhere>;
  /** Return Users where one of the related Questionnaires match this filter */
  ownedQuestionnaires_SINGLE?: InputMaybe<QuestionnaireWhere>;
  /** Return Users where some of the related Questionnaires match this filter */
  ownedQuestionnaires_SOME?: InputMaybe<QuestionnaireWhere>;
  picture?: InputMaybe<Scalars['String']['input']>;
  picture_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  picture_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  picture_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  picture_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  questionnaireSort?: InputMaybe<Scalars['String']['input']>;
  questionnaireSort_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  questionnaireSort_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  questionnaireSort_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  questionnaireSort_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  role_CONTAINS?: InputMaybe<Scalars['String']['input']>;
  role_ENDS_WITH?: InputMaybe<Scalars['String']['input']>;
  role_IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  role_STARTS_WITH?: InputMaybe<Scalars['String']['input']>;
  teamAssessmentsAggregate?: InputMaybe<UserTeamAssessmentsAggregateInput>;
  /** Return Users where all of the related UserTeamAssessmentsConnections match this filter */
  teamAssessmentsConnection_ALL?: InputMaybe<UserTeamAssessmentsConnectionWhere>;
  /** Return Users where none of the related UserTeamAssessmentsConnections match this filter */
  teamAssessmentsConnection_NONE?: InputMaybe<UserTeamAssessmentsConnectionWhere>;
  /** Return Users where one of the related UserTeamAssessmentsConnections match this filter */
  teamAssessmentsConnection_SINGLE?: InputMaybe<UserTeamAssessmentsConnectionWhere>;
  /** Return Users where some of the related UserTeamAssessmentsConnections match this filter */
  teamAssessmentsConnection_SOME?: InputMaybe<UserTeamAssessmentsConnectionWhere>;
  /** Return Users where all of the related Assessments match this filter */
  teamAssessments_ALL?: InputMaybe<AssessmentWhere>;
  /** Return Users where none of the related Assessments match this filter */
  teamAssessments_NONE?: InputMaybe<AssessmentWhere>;
  /** Return Users where one of the related Assessments match this filter */
  teamAssessments_SINGLE?: InputMaybe<AssessmentWhere>;
  /** Return Users where some of the related Assessments match this filter */
  teamAssessments_SOME?: InputMaybe<AssessmentWhere>;
  teamQuestionnairesAggregate?: InputMaybe<UserTeamQuestionnairesAggregateInput>;
  /** Return Users where all of the related UserTeamQuestionnairesConnections match this filter */
  teamQuestionnairesConnection_ALL?: InputMaybe<UserTeamQuestionnairesConnectionWhere>;
  /** Return Users where none of the related UserTeamQuestionnairesConnections match this filter */
  teamQuestionnairesConnection_NONE?: InputMaybe<UserTeamQuestionnairesConnectionWhere>;
  /** Return Users where one of the related UserTeamQuestionnairesConnections match this filter */
  teamQuestionnairesConnection_SINGLE?: InputMaybe<UserTeamQuestionnairesConnectionWhere>;
  /** Return Users where some of the related UserTeamQuestionnairesConnections match this filter */
  teamQuestionnairesConnection_SOME?: InputMaybe<UserTeamQuestionnairesConnectionWhere>;
  /** Return Users where all of the related Questionnaires match this filter */
  teamQuestionnaires_ALL?: InputMaybe<QuestionnaireWhere>;
  /** Return Users where none of the related Questionnaires match this filter */
  teamQuestionnaires_NONE?: InputMaybe<QuestionnaireWhere>;
  /** Return Users where one of the related Questionnaires match this filter */
  teamQuestionnaires_SINGLE?: InputMaybe<QuestionnaireWhere>;
  /** Return Users where some of the related Questionnaires match this filter */
  teamQuestionnaires_SOME?: InputMaybe<QuestionnaireWhere>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_GTE?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  updatedAt_LT?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_LTE?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UsersConnection = {
  __typename?: 'UsersConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};
