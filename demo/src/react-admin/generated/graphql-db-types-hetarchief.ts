import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _text: any;
  date: any;
  daterange: any;
  json: any;
  jsonb: any;
  time: any;
  timestamp: any;
  timestamptz: any;
  uuid: any;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "_text". All fields are combined with logical 'AND'. */
export type _Text_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['_text']>;
  _gt?: InputMaybe<Scalars['_text']>;
  _gte?: InputMaybe<Scalars['_text']>;
  _in?: InputMaybe<Array<Scalars['_text']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['_text']>;
  _lte?: InputMaybe<Scalars['_text']>;
  _neq?: InputMaybe<Scalars['_text']>;
  _nin?: InputMaybe<Array<Scalars['_text']>>;
};

/** Sitebrede variabelen zoals vertalingen */
export type App_Config = {
  __typename?: 'app_config';
  created_at: Scalars['timestamp'];
  name: Scalars['String'];
  updated_at: Scalars['timestamp'];
  value: Scalars['jsonb'];
};


/** Sitebrede variabelen zoals vertalingen */
export type App_ConfigValueArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "app.config" */
export type App_Config_Aggregate = {
  __typename?: 'app_config_aggregate';
  aggregate?: Maybe<App_Config_Aggregate_Fields>;
  nodes: Array<App_Config>;
};

/** aggregate fields of "app.config" */
export type App_Config_Aggregate_Fields = {
  __typename?: 'app_config_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<App_Config_Max_Fields>;
  min?: Maybe<App_Config_Min_Fields>;
};


/** aggregate fields of "app.config" */
export type App_Config_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_Config_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type App_Config_Append_Input = {
  value?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "app.config". All fields are combined with a logical 'AND'. */
export type App_Config_Bool_Exp = {
  _and?: InputMaybe<Array<App_Config_Bool_Exp>>;
  _not?: InputMaybe<App_Config_Bool_Exp>;
  _or?: InputMaybe<Array<App_Config_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  value?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "app.config" */
export enum App_Config_Constraint {
  /** unique or primary key constraint */
  SiteVariablesPkey = 'site_variables_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type App_Config_Delete_At_Path_Input = {
  value?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type App_Config_Delete_Elem_Input = {
  value?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type App_Config_Delete_Key_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "app.config" */
export type App_Config_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  value?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type App_Config_Max_Fields = {
  __typename?: 'app_config_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type App_Config_Min_Fields = {
  __typename?: 'app_config_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "app.config" */
export type App_Config_Mutation_Response = {
  __typename?: 'app_config_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<App_Config>;
};

/** on_conflict condition type for table "app.config" */
export type App_Config_On_Conflict = {
  constraint: App_Config_Constraint;
  update_columns?: Array<App_Config_Update_Column>;
  where?: InputMaybe<App_Config_Bool_Exp>;
};

/** Ordering options when selecting data from "app.config". */
export type App_Config_Order_By = {
  created_at?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: app_config */
export type App_Config_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type App_Config_Prepend_Input = {
  value?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "app.config" */
export enum App_Config_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "app.config" */
export type App_Config_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  value?: InputMaybe<Scalars['jsonb']>;
};

/** update columns of table "app.config" */
export enum App_Config_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/** information for the blocks out of which the content pages are build */
export type App_Content_Block = {
  __typename?: 'app_content_block';
  /** An object relationship */
  cms_content_block_type: Lookup_App_Content_Block_Type;
  /** An object relationship */
  content: App_Content_Page;
  content_block_type: Lookup_App_Content_Block_Type_Enum;
  content_id: Scalars['uuid'];
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  position: Scalars['Int'];
  updated_at: Scalars['timestamp'];
  variables?: Maybe<Scalars['jsonb']>;
};


/** information for the blocks out of which the content pages are build */
export type App_Content_BlockVariablesArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "app.content_block" */
export type App_Content_Block_Aggregate = {
  __typename?: 'app_content_block_aggregate';
  aggregate?: Maybe<App_Content_Block_Aggregate_Fields>;
  nodes: Array<App_Content_Block>;
};

/** aggregate fields of "app.content_block" */
export type App_Content_Block_Aggregate_Fields = {
  __typename?: 'app_content_block_aggregate_fields';
  avg?: Maybe<App_Content_Block_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<App_Content_Block_Max_Fields>;
  min?: Maybe<App_Content_Block_Min_Fields>;
  stddev?: Maybe<App_Content_Block_Stddev_Fields>;
  stddev_pop?: Maybe<App_Content_Block_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<App_Content_Block_Stddev_Samp_Fields>;
  sum?: Maybe<App_Content_Block_Sum_Fields>;
  var_pop?: Maybe<App_Content_Block_Var_Pop_Fields>;
  var_samp?: Maybe<App_Content_Block_Var_Samp_Fields>;
  variance?: Maybe<App_Content_Block_Variance_Fields>;
};


/** aggregate fields of "app.content_block" */
export type App_Content_Block_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_Content_Block_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "app.content_block" */
export type App_Content_Block_Aggregate_Order_By = {
  avg?: InputMaybe<App_Content_Block_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<App_Content_Block_Max_Order_By>;
  min?: InputMaybe<App_Content_Block_Min_Order_By>;
  stddev?: InputMaybe<App_Content_Block_Stddev_Order_By>;
  stddev_pop?: InputMaybe<App_Content_Block_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<App_Content_Block_Stddev_Samp_Order_By>;
  sum?: InputMaybe<App_Content_Block_Sum_Order_By>;
  var_pop?: InputMaybe<App_Content_Block_Var_Pop_Order_By>;
  var_samp?: InputMaybe<App_Content_Block_Var_Samp_Order_By>;
  variance?: InputMaybe<App_Content_Block_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type App_Content_Block_Append_Input = {
  variables?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "app.content_block" */
export type App_Content_Block_Arr_Rel_Insert_Input = {
  data: Array<App_Content_Block_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<App_Content_Block_On_Conflict>;
};

/** aggregate avg on columns */
export type App_Content_Block_Avg_Fields = {
  __typename?: 'app_content_block_avg_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "app.content_block" */
export type App_Content_Block_Avg_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "app.content_block". All fields are combined with a logical 'AND'. */
export type App_Content_Block_Bool_Exp = {
  _and?: InputMaybe<Array<App_Content_Block_Bool_Exp>>;
  _not?: InputMaybe<App_Content_Block_Bool_Exp>;
  _or?: InputMaybe<Array<App_Content_Block_Bool_Exp>>;
  cms_content_block_type?: InputMaybe<Lookup_App_Content_Block_Type_Bool_Exp>;
  content?: InputMaybe<App_Content_Page_Bool_Exp>;
  content_block_type?: InputMaybe<Lookup_App_Content_Block_Type_Enum_Comparison_Exp>;
  content_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  position?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  variables?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "app.content_block" */
export enum App_Content_Block_Constraint {
  /** unique or primary key constraint */
  ContentBlocksPkey = 'content_blocks_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type App_Content_Block_Delete_At_Path_Input = {
  variables?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type App_Content_Block_Delete_Elem_Input = {
  variables?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type App_Content_Block_Delete_Key_Input = {
  variables?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "app.content_block" */
export type App_Content_Block_Inc_Input = {
  position?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "app.content_block" */
export type App_Content_Block_Insert_Input = {
  cms_content_block_type?: InputMaybe<Lookup_App_Content_Block_Type_Obj_Rel_Insert_Input>;
  content?: InputMaybe<App_Content_Page_Obj_Rel_Insert_Input>;
  content_block_type?: InputMaybe<Lookup_App_Content_Block_Type_Enum>;
  content_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  position?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  variables?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type App_Content_Block_Max_Fields = {
  __typename?: 'app_content_block_max_fields';
  content_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  position?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "app.content_block" */
export type App_Content_Block_Max_Order_By = {
  content_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  position?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type App_Content_Block_Min_Fields = {
  __typename?: 'app_content_block_min_fields';
  content_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  position?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "app.content_block" */
export type App_Content_Block_Min_Order_By = {
  content_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  position?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "app.content_block" */
export type App_Content_Block_Mutation_Response = {
  __typename?: 'app_content_block_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<App_Content_Block>;
};

/** on_conflict condition type for table "app.content_block" */
export type App_Content_Block_On_Conflict = {
  constraint: App_Content_Block_Constraint;
  update_columns?: Array<App_Content_Block_Update_Column>;
  where?: InputMaybe<App_Content_Block_Bool_Exp>;
};

/** Ordering options when selecting data from "app.content_block". */
export type App_Content_Block_Order_By = {
  cms_content_block_type?: InputMaybe<Lookup_App_Content_Block_Type_Order_By>;
  content?: InputMaybe<App_Content_Page_Order_By>;
  content_block_type?: InputMaybe<Order_By>;
  content_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  position?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  variables?: InputMaybe<Order_By>;
};

/** primary key columns input for table: app_content_block */
export type App_Content_Block_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type App_Content_Block_Prepend_Input = {
  variables?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "app.content_block" */
export enum App_Content_Block_Select_Column {
  /** column name */
  ContentBlockType = 'content_block_type',
  /** column name */
  ContentId = 'content_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Position = 'position',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Variables = 'variables'
}

/** input type for updating data in table "app.content_block" */
export type App_Content_Block_Set_Input = {
  content_block_type?: InputMaybe<Lookup_App_Content_Block_Type_Enum>;
  content_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  position?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  variables?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate stddev on columns */
export type App_Content_Block_Stddev_Fields = {
  __typename?: 'app_content_block_stddev_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "app.content_block" */
export type App_Content_Block_Stddev_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type App_Content_Block_Stddev_Pop_Fields = {
  __typename?: 'app_content_block_stddev_pop_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "app.content_block" */
export type App_Content_Block_Stddev_Pop_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type App_Content_Block_Stddev_Samp_Fields = {
  __typename?: 'app_content_block_stddev_samp_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "app.content_block" */
export type App_Content_Block_Stddev_Samp_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type App_Content_Block_Sum_Fields = {
  __typename?: 'app_content_block_sum_fields';
  position?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "app.content_block" */
export type App_Content_Block_Sum_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** update columns of table "app.content_block" */
export enum App_Content_Block_Update_Column {
  /** column name */
  ContentBlockType = 'content_block_type',
  /** column name */
  ContentId = 'content_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Position = 'position',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Variables = 'variables'
}

/** aggregate var_pop on columns */
export type App_Content_Block_Var_Pop_Fields = {
  __typename?: 'app_content_block_var_pop_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "app.content_block" */
export type App_Content_Block_Var_Pop_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type App_Content_Block_Var_Samp_Fields = {
  __typename?: 'app_content_block_var_samp_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "app.content_block" */
export type App_Content_Block_Var_Samp_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type App_Content_Block_Variance_Fields = {
  __typename?: 'app_content_block_variance_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "app.content_block" */
export type App_Content_Block_Variance_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** labels to marks certain content pages and group them together */
export type App_Content_Label = {
  __typename?: 'app_content_label';
  /** An object relationship */
  cms_content_type: Lookup_App_Content_Type;
  /** An array relationship */
  content_content_labels: Array<App_Content_Page_Content_Label>;
  /** An aggregate relationship */
  content_content_labels_aggregate: App_Content_Page_Content_Label_Aggregate;
  content_type: Lookup_App_Content_Type_Enum;
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  label: Scalars['String'];
  link_to?: Maybe<Scalars['jsonb']>;
  updated_at: Scalars['timestamp'];
};


/** labels to marks certain content pages and group them together */
export type App_Content_LabelContent_Content_LabelsArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
};


/** labels to marks certain content pages and group them together */
export type App_Content_LabelContent_Content_Labels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
};


/** labels to marks certain content pages and group them together */
export type App_Content_LabelLink_ToArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "app.content_label" */
export type App_Content_Label_Aggregate = {
  __typename?: 'app_content_label_aggregate';
  aggregate?: Maybe<App_Content_Label_Aggregate_Fields>;
  nodes: Array<App_Content_Label>;
};

/** aggregate fields of "app.content_label" */
export type App_Content_Label_Aggregate_Fields = {
  __typename?: 'app_content_label_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<App_Content_Label_Max_Fields>;
  min?: Maybe<App_Content_Label_Min_Fields>;
};


/** aggregate fields of "app.content_label" */
export type App_Content_Label_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_Content_Label_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type App_Content_Label_Append_Input = {
  link_to?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "app.content_label". All fields are combined with a logical 'AND'. */
export type App_Content_Label_Bool_Exp = {
  _and?: InputMaybe<Array<App_Content_Label_Bool_Exp>>;
  _not?: InputMaybe<App_Content_Label_Bool_Exp>;
  _or?: InputMaybe<Array<App_Content_Label_Bool_Exp>>;
  cms_content_type?: InputMaybe<Lookup_App_Content_Type_Bool_Exp>;
  content_content_labels?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
  content_type?: InputMaybe<Lookup_App_Content_Type_Enum_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  link_to?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "app.content_label" */
export enum App_Content_Label_Constraint {
  /** unique or primary key constraint */
  ContentLabelsLabelContentTypeKey = 'content_labels_label_content_type_key',
  /** unique or primary key constraint */
  ContentLabelsPkey = 'content_labels_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type App_Content_Label_Delete_At_Path_Input = {
  link_to?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type App_Content_Label_Delete_Elem_Input = {
  link_to?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type App_Content_Label_Delete_Key_Input = {
  link_to?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "app.content_label" */
export type App_Content_Label_Insert_Input = {
  cms_content_type?: InputMaybe<Lookup_App_Content_Type_Obj_Rel_Insert_Input>;
  content_content_labels?: InputMaybe<App_Content_Page_Content_Label_Arr_Rel_Insert_Input>;
  content_type?: InputMaybe<Lookup_App_Content_Type_Enum>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  link_to?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type App_Content_Label_Max_Fields = {
  __typename?: 'app_content_label_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type App_Content_Label_Min_Fields = {
  __typename?: 'app_content_label_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "app.content_label" */
export type App_Content_Label_Mutation_Response = {
  __typename?: 'app_content_label_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<App_Content_Label>;
};

/** input type for inserting object relation for remote table "app.content_label" */
export type App_Content_Label_Obj_Rel_Insert_Input = {
  data: App_Content_Label_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<App_Content_Label_On_Conflict>;
};

/** on_conflict condition type for table "app.content_label" */
export type App_Content_Label_On_Conflict = {
  constraint: App_Content_Label_Constraint;
  update_columns?: Array<App_Content_Label_Update_Column>;
  where?: InputMaybe<App_Content_Label_Bool_Exp>;
};

/** Ordering options when selecting data from "app.content_label". */
export type App_Content_Label_Order_By = {
  cms_content_type?: InputMaybe<Lookup_App_Content_Type_Order_By>;
  content_content_labels_aggregate?: InputMaybe<App_Content_Page_Content_Label_Aggregate_Order_By>;
  content_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  link_to?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: app_content_label */
export type App_Content_Label_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type App_Content_Label_Prepend_Input = {
  link_to?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "app.content_label" */
export enum App_Content_Label_Select_Column {
  /** column name */
  ContentType = 'content_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  LinkTo = 'link_to',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "app.content_label" */
export type App_Content_Label_Set_Input = {
  content_type?: InputMaybe<Lookup_App_Content_Type_Enum>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  link_to?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "app.content_label" */
export enum App_Content_Label_Update_Column {
  /** column name */
  ContentType = 'content_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  LinkTo = 'link_to',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "app.content_page" */
export type App_Content_Page = {
  __typename?: 'app_content_page';
  /** An array relationship */
  content_blocks: Array<App_Content_Block>;
  /** An aggregate relationship */
  content_blocks_aggregate: App_Content_Block_Aggregate;
  /** An array relationship */
  content_content_labels: Array<App_Content_Page_Content_Label>;
  /** An aggregate relationship */
  content_content_labels_aggregate: App_Content_Page_Content_Label_Aggregate;
  content_type: Scalars['String'];
  content_width: Scalars['String'];
  created_at: Scalars['timestamp'];
  depublish_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  header_path?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  is_deleted: Scalars['Boolean'];
  is_protected: Scalars['Boolean'];
  is_public?: Maybe<Scalars['Boolean']>;
  meta_description?: Maybe<Scalars['String']>;
  /** An object relationship */
  owner_profile?: Maybe<Users_Profile>;
  /** slug van de pagina */
  path?: Maybe<Scalars['String']>;
  publish_at?: Maybe<Scalars['timestamp']>;
  published_at?: Maybe<Scalars['timestamp']>;
  seo_description?: Maybe<Scalars['String']>;
  seo_image_path?: Maybe<Scalars['String']>;
  seo_keywords?: Maybe<Scalars['String']>;
  seo_title?: Maybe<Scalars['String']>;
  thumbnail_path?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  updated_at?: Maybe<Scalars['timestamp']>;
  updated_by_profile_id?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  updater_profile?: Maybe<Users_Profile>;
  user_group_ids?: Maybe<Scalars['jsonb']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
};


/** columns and relationships of "app.content_page" */
export type App_Content_PageContent_BlocksArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Block_Order_By>>;
  where?: InputMaybe<App_Content_Block_Bool_Exp>;
};


/** columns and relationships of "app.content_page" */
export type App_Content_PageContent_Blocks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Block_Order_By>>;
  where?: InputMaybe<App_Content_Block_Bool_Exp>;
};


/** columns and relationships of "app.content_page" */
export type App_Content_PageContent_Content_LabelsArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
};


/** columns and relationships of "app.content_page" */
export type App_Content_PageContent_Content_Labels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
};


/** columns and relationships of "app.content_page" */
export type App_Content_PageUser_Group_IdsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "app.content_page" */
export type App_Content_Page_Aggregate = {
  __typename?: 'app_content_page_aggregate';
  aggregate?: Maybe<App_Content_Page_Aggregate_Fields>;
  nodes: Array<App_Content_Page>;
};

/** aggregate fields of "app.content_page" */
export type App_Content_Page_Aggregate_Fields = {
  __typename?: 'app_content_page_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<App_Content_Page_Max_Fields>;
  min?: Maybe<App_Content_Page_Min_Fields>;
};


/** aggregate fields of "app.content_page" */
export type App_Content_Page_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_Content_Page_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type App_Content_Page_Append_Input = {
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "app.content_page". All fields are combined with a logical 'AND'. */
export type App_Content_Page_Bool_Exp = {
  _and?: InputMaybe<Array<App_Content_Page_Bool_Exp>>;
  _not?: InputMaybe<App_Content_Page_Bool_Exp>;
  _or?: InputMaybe<Array<App_Content_Page_Bool_Exp>>;
  content_blocks?: InputMaybe<App_Content_Block_Bool_Exp>;
  content_content_labels?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
  content_type?: InputMaybe<String_Comparison_Exp>;
  content_width?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  depublish_at?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  header_path?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
  is_protected?: InputMaybe<Boolean_Comparison_Exp>;
  is_public?: InputMaybe<Boolean_Comparison_Exp>;
  meta_description?: InputMaybe<String_Comparison_Exp>;
  owner_profile?: InputMaybe<Users_Profile_Bool_Exp>;
  path?: InputMaybe<String_Comparison_Exp>;
  publish_at?: InputMaybe<Timestamp_Comparison_Exp>;
  published_at?: InputMaybe<Timestamp_Comparison_Exp>;
  seo_description?: InputMaybe<String_Comparison_Exp>;
  seo_image_path?: InputMaybe<String_Comparison_Exp>;
  seo_keywords?: InputMaybe<String_Comparison_Exp>;
  seo_title?: InputMaybe<String_Comparison_Exp>;
  thumbnail_path?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  updated_by_profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  updater_profile?: InputMaybe<Users_Profile_Bool_Exp>;
  user_group_ids?: InputMaybe<Jsonb_Comparison_Exp>;
  user_profile_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "app.content_page" */
export enum App_Content_Page_Constraint {
  /** unique or primary key constraint */
  ContentIdKey = 'content_id_key',
  /** unique or primary key constraint */
  ContentPathKey = 'content_path_key',
  /** unique or primary key constraint */
  ContentPkey = 'content_pkey'
}

/** linking table between content pages and the content_labels */
export type App_Content_Page_Content_Label = {
  __typename?: 'app_content_page_content_label';
  /** An object relationship */
  content: App_Content_Page;
  content_id: Scalars['uuid'];
  /** An object relationship */
  content_label: App_Content_Label;
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  label_id: Scalars['uuid'];
  updated_at: Scalars['timestamp'];
};

/** aggregated selection of "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Aggregate = {
  __typename?: 'app_content_page_content_label_aggregate';
  aggregate?: Maybe<App_Content_Page_Content_Label_Aggregate_Fields>;
  nodes: Array<App_Content_Page_Content_Label>;
};

/** aggregate fields of "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Aggregate_Fields = {
  __typename?: 'app_content_page_content_label_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<App_Content_Page_Content_Label_Max_Fields>;
  min?: Maybe<App_Content_Page_Content_Label_Min_Fields>;
};


/** aggregate fields of "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_Content_Page_Content_Label_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<App_Content_Page_Content_Label_Max_Order_By>;
  min?: InputMaybe<App_Content_Page_Content_Label_Min_Order_By>;
};

/** input type for inserting array relation for remote table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Arr_Rel_Insert_Input = {
  data: Array<App_Content_Page_Content_Label_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<App_Content_Page_Content_Label_On_Conflict>;
};

/** Boolean expression to filter rows from the table "app.content_page_content_label". All fields are combined with a logical 'AND'. */
export type App_Content_Page_Content_Label_Bool_Exp = {
  _and?: InputMaybe<Array<App_Content_Page_Content_Label_Bool_Exp>>;
  _not?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
  _or?: InputMaybe<Array<App_Content_Page_Content_Label_Bool_Exp>>;
  content?: InputMaybe<App_Content_Page_Bool_Exp>;
  content_id?: InputMaybe<Uuid_Comparison_Exp>;
  content_label?: InputMaybe<App_Content_Label_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  label_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "app.content_page_content_label" */
export enum App_Content_Page_Content_Label_Constraint {
  /** unique or primary key constraint */
  ContentContentLabelsPkey = 'content_content_labels_pkey'
}

/** input type for inserting data into table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Insert_Input = {
  content?: InputMaybe<App_Content_Page_Obj_Rel_Insert_Input>;
  content_id?: InputMaybe<Scalars['uuid']>;
  content_label?: InputMaybe<App_Content_Label_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  label_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type App_Content_Page_Content_Label_Max_Fields = {
  __typename?: 'app_content_page_content_label_max_fields';
  content_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  label_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Max_Order_By = {
  content_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type App_Content_Page_Content_Label_Min_Fields = {
  __typename?: 'app_content_page_content_label_min_fields';
  content_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  label_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Min_Order_By = {
  content_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Mutation_Response = {
  __typename?: 'app_content_page_content_label_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<App_Content_Page_Content_Label>;
};

/** on_conflict condition type for table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_On_Conflict = {
  constraint: App_Content_Page_Content_Label_Constraint;
  update_columns?: Array<App_Content_Page_Content_Label_Update_Column>;
  where?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
};

/** Ordering options when selecting data from "app.content_page_content_label". */
export type App_Content_Page_Content_Label_Order_By = {
  content?: InputMaybe<App_Content_Page_Order_By>;
  content_id?: InputMaybe<Order_By>;
  content_label?: InputMaybe<App_Content_Label_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: app_content_page_content_label */
export type App_Content_Page_Content_Label_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "app.content_page_content_label" */
export enum App_Content_Page_Content_Label_Select_Column {
  /** column name */
  ContentId = 'content_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  LabelId = 'label_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Set_Input = {
  content_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  label_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "app.content_page_content_label" */
export enum App_Content_Page_Content_Label_Update_Column {
  /** column name */
  ContentId = 'content_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  LabelId = 'label_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type App_Content_Page_Delete_At_Path_Input = {
  user_group_ids?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type App_Content_Page_Delete_Elem_Input = {
  user_group_ids?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type App_Content_Page_Delete_Key_Input = {
  user_group_ids?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "app.content_page" */
export type App_Content_Page_Insert_Input = {
  content_blocks?: InputMaybe<App_Content_Block_Arr_Rel_Insert_Input>;
  content_content_labels?: InputMaybe<App_Content_Page_Content_Label_Arr_Rel_Insert_Input>;
  content_type?: InputMaybe<Scalars['String']>;
  content_width?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  depublish_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  header_path?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_deleted?: InputMaybe<Scalars['Boolean']>;
  is_protected?: InputMaybe<Scalars['Boolean']>;
  is_public?: InputMaybe<Scalars['Boolean']>;
  meta_description?: InputMaybe<Scalars['String']>;
  owner_profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  /** slug van de pagina */
  path?: InputMaybe<Scalars['String']>;
  publish_at?: InputMaybe<Scalars['timestamp']>;
  published_at?: InputMaybe<Scalars['timestamp']>;
  seo_description?: InputMaybe<Scalars['String']>;
  seo_image_path?: InputMaybe<Scalars['String']>;
  seo_keywords?: InputMaybe<Scalars['String']>;
  seo_title?: InputMaybe<Scalars['String']>;
  thumbnail_path?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  updated_by_profile_id?: InputMaybe<Scalars['uuid']>;
  updater_profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type App_Content_Page_Max_Fields = {
  __typename?: 'app_content_page_max_fields';
  content_type?: Maybe<Scalars['String']>;
  content_width?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamp']>;
  depublish_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  header_path?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  meta_description?: Maybe<Scalars['String']>;
  /** slug van de pagina */
  path?: Maybe<Scalars['String']>;
  publish_at?: Maybe<Scalars['timestamp']>;
  published_at?: Maybe<Scalars['timestamp']>;
  seo_description?: Maybe<Scalars['String']>;
  seo_image_path?: Maybe<Scalars['String']>;
  seo_keywords?: Maybe<Scalars['String']>;
  seo_title?: Maybe<Scalars['String']>;
  thumbnail_path?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  updated_by_profile_id?: Maybe<Scalars['uuid']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type App_Content_Page_Min_Fields = {
  __typename?: 'app_content_page_min_fields';
  content_type?: Maybe<Scalars['String']>;
  content_width?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamp']>;
  depublish_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  header_path?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  meta_description?: Maybe<Scalars['String']>;
  /** slug van de pagina */
  path?: Maybe<Scalars['String']>;
  publish_at?: Maybe<Scalars['timestamp']>;
  published_at?: Maybe<Scalars['timestamp']>;
  seo_description?: Maybe<Scalars['String']>;
  seo_image_path?: Maybe<Scalars['String']>;
  seo_keywords?: Maybe<Scalars['String']>;
  seo_title?: Maybe<Scalars['String']>;
  thumbnail_path?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  updated_by_profile_id?: Maybe<Scalars['uuid']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "app.content_page" */
export type App_Content_Page_Mutation_Response = {
  __typename?: 'app_content_page_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<App_Content_Page>;
};

/** input type for inserting object relation for remote table "app.content_page" */
export type App_Content_Page_Obj_Rel_Insert_Input = {
  data: App_Content_Page_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<App_Content_Page_On_Conflict>;
};

/** on_conflict condition type for table "app.content_page" */
export type App_Content_Page_On_Conflict = {
  constraint: App_Content_Page_Constraint;
  update_columns?: Array<App_Content_Page_Update_Column>;
  where?: InputMaybe<App_Content_Page_Bool_Exp>;
};

/** Ordering options when selecting data from "app.content_page". */
export type App_Content_Page_Order_By = {
  content_blocks_aggregate?: InputMaybe<App_Content_Block_Aggregate_Order_By>;
  content_content_labels_aggregate?: InputMaybe<App_Content_Page_Content_Label_Aggregate_Order_By>;
  content_type?: InputMaybe<Order_By>;
  content_width?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  depublish_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  header_path?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_deleted?: InputMaybe<Order_By>;
  is_protected?: InputMaybe<Order_By>;
  is_public?: InputMaybe<Order_By>;
  meta_description?: InputMaybe<Order_By>;
  owner_profile?: InputMaybe<Users_Profile_Order_By>;
  path?: InputMaybe<Order_By>;
  publish_at?: InputMaybe<Order_By>;
  published_at?: InputMaybe<Order_By>;
  seo_description?: InputMaybe<Order_By>;
  seo_image_path?: InputMaybe<Order_By>;
  seo_keywords?: InputMaybe<Order_By>;
  seo_title?: InputMaybe<Order_By>;
  thumbnail_path?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by_profile_id?: InputMaybe<Order_By>;
  updater_profile?: InputMaybe<Users_Profile_Order_By>;
  user_group_ids?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: app_content_page */
export type App_Content_Page_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type App_Content_Page_Prepend_Input = {
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "app.content_page" */
export enum App_Content_Page_Select_Column {
  /** column name */
  ContentType = 'content_type',
  /** column name */
  ContentWidth = 'content_width',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DepublishAt = 'depublish_at',
  /** column name */
  Description = 'description',
  /** column name */
  HeaderPath = 'header_path',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsProtected = 'is_protected',
  /** column name */
  IsPublic = 'is_public',
  /** column name */
  MetaDescription = 'meta_description',
  /** column name */
  Path = 'path',
  /** column name */
  PublishAt = 'publish_at',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  SeoDescription = 'seo_description',
  /** column name */
  SeoImagePath = 'seo_image_path',
  /** column name */
  SeoKeywords = 'seo_keywords',
  /** column name */
  SeoTitle = 'seo_title',
  /** column name */
  ThumbnailPath = 'thumbnail_path',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedByProfileId = 'updated_by_profile_id',
  /** column name */
  UserGroupIds = 'user_group_ids',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** input type for updating data in table "app.content_page" */
export type App_Content_Page_Set_Input = {
  content_type?: InputMaybe<Scalars['String']>;
  content_width?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  depublish_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  header_path?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_deleted?: InputMaybe<Scalars['Boolean']>;
  is_protected?: InputMaybe<Scalars['Boolean']>;
  is_public?: InputMaybe<Scalars['Boolean']>;
  meta_description?: InputMaybe<Scalars['String']>;
  /** slug van de pagina */
  path?: InputMaybe<Scalars['String']>;
  publish_at?: InputMaybe<Scalars['timestamp']>;
  published_at?: InputMaybe<Scalars['timestamp']>;
  seo_description?: InputMaybe<Scalars['String']>;
  seo_image_path?: InputMaybe<Scalars['String']>;
  seo_keywords?: InputMaybe<Scalars['String']>;
  seo_title?: InputMaybe<Scalars['String']>;
  thumbnail_path?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  updated_by_profile_id?: InputMaybe<Scalars['uuid']>;
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "app.content_page" */
export enum App_Content_Page_Update_Column {
  /** column name */
  ContentType = 'content_type',
  /** column name */
  ContentWidth = 'content_width',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DepublishAt = 'depublish_at',
  /** column name */
  Description = 'description',
  /** column name */
  HeaderPath = 'header_path',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsProtected = 'is_protected',
  /** column name */
  IsPublic = 'is_public',
  /** column name */
  MetaDescription = 'meta_description',
  /** column name */
  Path = 'path',
  /** column name */
  PublishAt = 'publish_at',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  SeoDescription = 'seo_description',
  /** column name */
  SeoImagePath = 'seo_image_path',
  /** column name */
  SeoKeywords = 'seo_keywords',
  /** column name */
  SeoTitle = 'seo_title',
  /** column name */
  ThumbnailPath = 'thumbnail_path',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedByProfileId = 'updated_by_profile_id',
  /** column name */
  UserGroupIds = 'user_group_ids',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** columns and relationships of "app.navigation" */
export type App_Navigation = {
  __typename?: 'app_navigation';
  /** id van de gelinkte content block pagina */
  content_id?: Maybe<Scalars['uuid']>;
  content_path: Scalars['String'];
  content_type: Scalars['String'];
  created_at: Scalars['timestamptz'];
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: Maybe<Scalars['String']>;
  icon_name: Scalars['String'];
  id: Scalars['uuid'];
  label: Scalars['String'];
  /** open in new tab of in zelfde tab */
  link_target?: Maybe<Scalars['String']>;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement: Scalars['String'];
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position: Scalars['Int'];
  tooltip?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
  user_group_ids?: Maybe<Scalars['jsonb']>;
};


/** columns and relationships of "app.navigation" */
export type App_NavigationUser_Group_IdsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "app.navigation" */
export type App_Navigation_Aggregate = {
  __typename?: 'app_navigation_aggregate';
  aggregate?: Maybe<App_Navigation_Aggregate_Fields>;
  nodes: Array<App_Navigation>;
};

/** aggregate fields of "app.navigation" */
export type App_Navigation_Aggregate_Fields = {
  __typename?: 'app_navigation_aggregate_fields';
  avg?: Maybe<App_Navigation_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<App_Navigation_Max_Fields>;
  min?: Maybe<App_Navigation_Min_Fields>;
  stddev?: Maybe<App_Navigation_Stddev_Fields>;
  stddev_pop?: Maybe<App_Navigation_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<App_Navigation_Stddev_Samp_Fields>;
  sum?: Maybe<App_Navigation_Sum_Fields>;
  var_pop?: Maybe<App_Navigation_Var_Pop_Fields>;
  var_samp?: Maybe<App_Navigation_Var_Samp_Fields>;
  variance?: Maybe<App_Navigation_Variance_Fields>;
};


/** aggregate fields of "app.navigation" */
export type App_Navigation_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_Navigation_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type App_Navigation_Append_Input = {
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type App_Navigation_Avg_Fields = {
  __typename?: 'app_navigation_avg_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "app.navigation". All fields are combined with a logical 'AND'. */
export type App_Navigation_Bool_Exp = {
  _and?: InputMaybe<Array<App_Navigation_Bool_Exp>>;
  _not?: InputMaybe<App_Navigation_Bool_Exp>;
  _or?: InputMaybe<Array<App_Navigation_Bool_Exp>>;
  content_id?: InputMaybe<Uuid_Comparison_Exp>;
  content_path?: InputMaybe<String_Comparison_Exp>;
  content_type?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  icon_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  link_target?: InputMaybe<String_Comparison_Exp>;
  placement?: InputMaybe<String_Comparison_Exp>;
  position?: InputMaybe<Int_Comparison_Exp>;
  tooltip?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_group_ids?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "app.navigation" */
export enum App_Navigation_Constraint {
  /** unique or primary key constraint */
  NavigationElementPkey = 'navigation_element_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type App_Navigation_Delete_At_Path_Input = {
  user_group_ids?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type App_Navigation_Delete_Elem_Input = {
  user_group_ids?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type App_Navigation_Delete_Key_Input = {
  user_group_ids?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "app.navigation" */
export type App_Navigation_Inc_Input = {
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "app.navigation" */
export type App_Navigation_Insert_Input = {
  /** id van de gelinkte content block pagina */
  content_id?: InputMaybe<Scalars['uuid']>;
  content_path?: InputMaybe<Scalars['String']>;
  content_type?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: InputMaybe<Scalars['String']>;
  icon_name?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  /** open in new tab of in zelfde tab */
  link_target?: InputMaybe<Scalars['String']>;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement?: InputMaybe<Scalars['String']>;
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: InputMaybe<Scalars['Int']>;
  tooltip?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type App_Navigation_Max_Fields = {
  __typename?: 'app_navigation_max_fields';
  /** id van de gelinkte content block pagina */
  content_id?: Maybe<Scalars['uuid']>;
  content_path?: Maybe<Scalars['String']>;
  content_type?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: Maybe<Scalars['String']>;
  icon_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  /** open in new tab of in zelfde tab */
  link_target?: Maybe<Scalars['String']>;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement?: Maybe<Scalars['String']>;
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Int']>;
  tooltip?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type App_Navigation_Min_Fields = {
  __typename?: 'app_navigation_min_fields';
  /** id van de gelinkte content block pagina */
  content_id?: Maybe<Scalars['uuid']>;
  content_path?: Maybe<Scalars['String']>;
  content_type?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: Maybe<Scalars['String']>;
  icon_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  /** open in new tab of in zelfde tab */
  link_target?: Maybe<Scalars['String']>;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement?: Maybe<Scalars['String']>;
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Int']>;
  tooltip?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "app.navigation" */
export type App_Navigation_Mutation_Response = {
  __typename?: 'app_navigation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<App_Navigation>;
};

/** on_conflict condition type for table "app.navigation" */
export type App_Navigation_On_Conflict = {
  constraint: App_Navigation_Constraint;
  update_columns?: Array<App_Navigation_Update_Column>;
  where?: InputMaybe<App_Navigation_Bool_Exp>;
};

/** Ordering options when selecting data from "app.navigation". */
export type App_Navigation_Order_By = {
  content_id?: InputMaybe<Order_By>;
  content_path?: InputMaybe<Order_By>;
  content_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  icon_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  link_target?: InputMaybe<Order_By>;
  placement?: InputMaybe<Order_By>;
  position?: InputMaybe<Order_By>;
  tooltip?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_group_ids?: InputMaybe<Order_By>;
};

/** primary key columns input for table: app_navigation */
export type App_Navigation_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type App_Navigation_Prepend_Input = {
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "app.navigation" */
export enum App_Navigation_Select_Column {
  /** column name */
  ContentId = 'content_id',
  /** column name */
  ContentPath = 'content_path',
  /** column name */
  ContentType = 'content_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  IconName = 'icon_name',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  LinkTarget = 'link_target',
  /** column name */
  Placement = 'placement',
  /** column name */
  Position = 'position',
  /** column name */
  Tooltip = 'tooltip',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserGroupIds = 'user_group_ids'
}

/** input type for updating data in table "app.navigation" */
export type App_Navigation_Set_Input = {
  /** id van de gelinkte content block pagina */
  content_id?: InputMaybe<Scalars['uuid']>;
  content_path?: InputMaybe<Scalars['String']>;
  content_type?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: InputMaybe<Scalars['String']>;
  icon_name?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  /** open in new tab of in zelfde tab */
  link_target?: InputMaybe<Scalars['String']>;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement?: InputMaybe<Scalars['String']>;
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: InputMaybe<Scalars['Int']>;
  tooltip?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate stddev on columns */
export type App_Navigation_Stddev_Fields = {
  __typename?: 'app_navigation_stddev_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type App_Navigation_Stddev_Pop_Fields = {
  __typename?: 'app_navigation_stddev_pop_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type App_Navigation_Stddev_Samp_Fields = {
  __typename?: 'app_navigation_stddev_samp_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type App_Navigation_Sum_Fields = {
  __typename?: 'app_navigation_sum_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Int']>;
};

/** update columns of table "app.navigation" */
export enum App_Navigation_Update_Column {
  /** column name */
  ContentId = 'content_id',
  /** column name */
  ContentPath = 'content_path',
  /** column name */
  ContentType = 'content_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  IconName = 'icon_name',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  LinkTarget = 'link_target',
  /** column name */
  Placement = 'placement',
  /** column name */
  Position = 'position',
  /** column name */
  Tooltip = 'tooltip',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserGroupIds = 'user_group_ids'
}

/** aggregate var_pop on columns */
export type App_Navigation_Var_Pop_Fields = {
  __typename?: 'app_navigation_var_pop_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type App_Navigation_Var_Samp_Fields = {
  __typename?: 'app_navigation_var_samp_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type App_Navigation_Variance_Fields = {
  __typename?: 'app_navigation_variance_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** Meldingen voor eindgebruikers over bepaalde activiteit */
export type App_Notification = {
  __typename?: 'app_notification';
  created_at: Scalars['timestamptz'];
  description: Scalars['String'];
  id: Scalars['uuid'];
  /** Profile id van de bedoelde ontvanger */
  recipient: Scalars['uuid'];
  /** An object relationship */
  recipient_profile: Users_Profile;
  status: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['String'];
  updated_at: Scalars['timestamp'];
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  visitor_space_request?: Maybe<Maintainer_Visitor_Space_Request>;
};

/** aggregated selection of "app.notification" */
export type App_Notification_Aggregate = {
  __typename?: 'app_notification_aggregate';
  aggregate?: Maybe<App_Notification_Aggregate_Fields>;
  nodes: Array<App_Notification>;
};

/** aggregate fields of "app.notification" */
export type App_Notification_Aggregate_Fields = {
  __typename?: 'app_notification_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<App_Notification_Max_Fields>;
  min?: Maybe<App_Notification_Min_Fields>;
};


/** aggregate fields of "app.notification" */
export type App_Notification_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_Notification_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "app.notification" */
export type App_Notification_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<App_Notification_Max_Order_By>;
  min?: InputMaybe<App_Notification_Min_Order_By>;
};

/** input type for inserting array relation for remote table "app.notification" */
export type App_Notification_Arr_Rel_Insert_Input = {
  data: Array<App_Notification_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<App_Notification_On_Conflict>;
};

/** Boolean expression to filter rows from the table "app.notification". All fields are combined with a logical 'AND'. */
export type App_Notification_Bool_Exp = {
  _and?: InputMaybe<Array<App_Notification_Bool_Exp>>;
  _not?: InputMaybe<App_Notification_Bool_Exp>;
  _or?: InputMaybe<Array<App_Notification_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  recipient?: InputMaybe<Uuid_Comparison_Exp>;
  recipient_profile?: InputMaybe<Users_Profile_Bool_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  visit_id?: InputMaybe<Uuid_Comparison_Exp>;
  visitor_space_request?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};

/** unique or primary key constraints on table "app.notification" */
export enum App_Notification_Constraint {
  /** unique or primary key constraint */
  NotificationPkey = 'notification_pkey'
}

/** input type for inserting data into table "app.notification" */
export type App_Notification_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: InputMaybe<Scalars['uuid']>;
  recipient_profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  status?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: InputMaybe<Scalars['uuid']>;
  visitor_space_request?: InputMaybe<Maintainer_Visitor_Space_Request_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type App_Notification_Max_Fields = {
  __typename?: 'app_notification_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "app.notification" */
export type App_Notification_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type App_Notification_Min_Fields = {
  __typename?: 'app_notification_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "app.notification" */
export type App_Notification_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "app.notification" */
export type App_Notification_Mutation_Response = {
  __typename?: 'app_notification_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<App_Notification>;
};

/** on_conflict condition type for table "app.notification" */
export type App_Notification_On_Conflict = {
  constraint: App_Notification_Constraint;
  update_columns?: Array<App_Notification_Update_Column>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};

/** Ordering options when selecting data from "app.notification". */
export type App_Notification_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  recipient?: InputMaybe<Order_By>;
  recipient_profile?: InputMaybe<Users_Profile_Order_By>;
  status?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visit_id?: InputMaybe<Order_By>;
  visitor_space_request?: InputMaybe<Maintainer_Visitor_Space_Request_Order_By>;
};

/** primary key columns input for table: app_notification */
export type App_Notification_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "app.notification" */
export enum App_Notification_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Recipient = 'recipient',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VisitId = 'visit_id'
}

/** input type for updating data in table "app.notification" */
export type App_Notification_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: InputMaybe<Scalars['uuid']>;
  status?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "app.notification" */
export enum App_Notification_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Recipient = 'recipient',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VisitId = 'visit_id'
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']>;
  _gt?: InputMaybe<Scalars['date']>;
  _gte?: InputMaybe<Scalars['date']>;
  _in?: InputMaybe<Array<Scalars['date']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['date']>;
  _lte?: InputMaybe<Scalars['date']>;
  _neq?: InputMaybe<Scalars['date']>;
  _nin?: InputMaybe<Array<Scalars['date']>>;
};

/** Boolean expression to compare columns of type "daterange". All fields are combined with logical 'AND'. */
export type Daterange_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['daterange']>;
  _gt?: InputMaybe<Scalars['daterange']>;
  _gte?: InputMaybe<Scalars['daterange']>;
  _in?: InputMaybe<Array<Scalars['daterange']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['daterange']>;
  _lte?: InputMaybe<Scalars['daterange']>;
  _neq?: InputMaybe<Scalars['daterange']>;
  _nin?: InputMaybe<Array<Scalars['daterange']>>;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['json']>;
  _gt?: InputMaybe<Scalars['json']>;
  _gte?: InputMaybe<Scalars['json']>;
  _in?: InputMaybe<Array<Scalars['json']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['json']>;
  _lte?: InputMaybe<Scalars['json']>;
  _neq?: InputMaybe<Scalars['json']>;
  _nin?: InputMaybe<Array<Scalars['json']>>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** Graphql enum types for content blocks */
export type Lookup_App_Content_Block_Type = {
  __typename?: 'lookup_app_content_block_type';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_Aggregate = {
  __typename?: 'lookup_app_content_block_type_aggregate';
  aggregate?: Maybe<Lookup_App_Content_Block_Type_Aggregate_Fields>;
  nodes: Array<Lookup_App_Content_Block_Type>;
};

/** aggregate fields of "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_Aggregate_Fields = {
  __typename?: 'lookup_app_content_block_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lookup_App_Content_Block_Type_Max_Fields>;
  min?: Maybe<Lookup_App_Content_Block_Type_Min_Fields>;
};


/** aggregate fields of "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_App_Content_Block_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lookup.app_content_block_type". All fields are combined with a logical 'AND'. */
export type Lookup_App_Content_Block_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_App_Content_Block_Type_Bool_Exp>>;
  _not?: InputMaybe<Lookup_App_Content_Block_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_App_Content_Block_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.app_content_block_type" */
export enum Lookup_App_Content_Block_Type_Constraint {
  /** unique or primary key constraint */
  CmsContentBlockTypePkey = 'cms_content_block_type_pkey'
}

export enum Lookup_App_Content_Block_Type_Enum {
  Accordions = 'ACCORDIONS',
  AnchorLinks = 'ANCHOR_LINKS',
  Buttons = 'BUTTONS',
  ContentPageMeta = 'CONTENT_PAGE_META',
  Ctas = 'CTAS',
  Eventbrite = 'EVENTBRITE',
  Heading = 'HEADING',
  Hero = 'HERO',
  Iframe = 'IFRAME',
  Image = 'IMAGE',
  ImageGrid = 'IMAGE_GRID',
  Intro = 'INTRO',
  Klaar = 'KLAAR',
  Links = 'LINKS',
  LogoGrid = 'LOGO_GRID',
  MediaGrid = 'MEDIA_GRID',
  MediaPlayer = 'MEDIA_PLAYER',
  MediaPlayerTitleTextButton = 'MEDIA_PLAYER_TITLE_TEXT_BUTTON',
  PageOverview = 'PAGE_OVERVIEW',
  ProjectsSpotlight = 'PROJECTS_SPOTLIGHT',
  Quote = 'QUOTE',
  RichText = 'RICH_TEXT',
  RichTextTwoColumns = 'RICH_TEXT_TWO_COLUMNS',
  Search = 'SEARCH',
  Spotlight = 'SPOTLIGHT',
  Subtitle = 'SUBTITLE',
  Title = 'TITLE',
  TitleImageText = 'TITLE_IMAGE_TEXT',
  TitleImageTextButton = 'TITLE_IMAGE_TEXT_BUTTON',
  UspGrid = 'USP_GRID',
  Video = 'VIDEO',
  VideoTitleTextButton = 'VIDEO_TITLE_TEXT_BUTTON'
}

/** Boolean expression to compare columns of type "lookup_app_content_block_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Content_Block_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Lookup_App_Content_Block_Type_Enum>;
  _in?: InputMaybe<Array<Lookup_App_Content_Block_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Lookup_App_Content_Block_Type_Enum>;
  _nin?: InputMaybe<Array<Lookup_App_Content_Block_Type_Enum>>;
};

/** input type for inserting data into table "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_App_Content_Block_Type_Max_Fields = {
  __typename?: 'lookup_app_content_block_type_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_App_Content_Block_Type_Min_Fields = {
  __typename?: 'lookup_app_content_block_type_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_Mutation_Response = {
  __typename?: 'lookup_app_content_block_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_App_Content_Block_Type>;
};

/** input type for inserting object relation for remote table "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_Obj_Rel_Insert_Input = {
  data: Lookup_App_Content_Block_Type_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Lookup_App_Content_Block_Type_On_Conflict>;
};

/** on_conflict condition type for table "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_On_Conflict = {
  constraint: Lookup_App_Content_Block_Type_Constraint;
  update_columns?: Array<Lookup_App_Content_Block_Type_Update_Column>;
  where?: InputMaybe<Lookup_App_Content_Block_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.app_content_block_type". */
export type Lookup_App_Content_Block_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_app_content_block_type */
export type Lookup_App_Content_Block_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.app_content_block_type" */
export enum Lookup_App_Content_Block_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lookup.app_content_block_type" */
export enum Lookup_App_Content_Block_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** GraphQL enum type for content types, e.g. pages, news, projects. */
export type Lookup_App_Content_Type = {
  __typename?: 'lookup_app_content_type';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "lookup.app_content_type" */
export type Lookup_App_Content_Type_Aggregate = {
  __typename?: 'lookup_app_content_type_aggregate';
  aggregate?: Maybe<Lookup_App_Content_Type_Aggregate_Fields>;
  nodes: Array<Lookup_App_Content_Type>;
};

/** aggregate fields of "lookup.app_content_type" */
export type Lookup_App_Content_Type_Aggregate_Fields = {
  __typename?: 'lookup_app_content_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lookup_App_Content_Type_Max_Fields>;
  min?: Maybe<Lookup_App_Content_Type_Min_Fields>;
};


/** aggregate fields of "lookup.app_content_type" */
export type Lookup_App_Content_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_App_Content_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lookup.app_content_type". All fields are combined with a logical 'AND'. */
export type Lookup_App_Content_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_App_Content_Type_Bool_Exp>>;
  _not?: InputMaybe<Lookup_App_Content_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_App_Content_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.app_content_type" */
export enum Lookup_App_Content_Type_Constraint {
  /** unique or primary key constraint */
  CmsContentTypePkey = 'cms_content_type_pkey'
}

export enum Lookup_App_Content_Type_Enum {
  /** Frequently asked question item */
  FaqItem = 'FAQ_ITEM',
  /** Pagina */
  Pagina = 'PAGINA'
}

/** Boolean expression to compare columns of type "lookup_app_content_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Content_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Lookup_App_Content_Type_Enum>;
  _in?: InputMaybe<Array<Lookup_App_Content_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Lookup_App_Content_Type_Enum>;
  _nin?: InputMaybe<Array<Lookup_App_Content_Type_Enum>>;
};

/** input type for inserting data into table "lookup.app_content_type" */
export type Lookup_App_Content_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_App_Content_Type_Max_Fields = {
  __typename?: 'lookup_app_content_type_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_App_Content_Type_Min_Fields = {
  __typename?: 'lookup_app_content_type_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.app_content_type" */
export type Lookup_App_Content_Type_Mutation_Response = {
  __typename?: 'lookup_app_content_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_App_Content_Type>;
};

/** input type for inserting object relation for remote table "lookup.app_content_type" */
export type Lookup_App_Content_Type_Obj_Rel_Insert_Input = {
  data: Lookup_App_Content_Type_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Lookup_App_Content_Type_On_Conflict>;
};

/** on_conflict condition type for table "lookup.app_content_type" */
export type Lookup_App_Content_Type_On_Conflict = {
  constraint: Lookup_App_Content_Type_Constraint;
  update_columns?: Array<Lookup_App_Content_Type_Update_Column>;
  where?: InputMaybe<Lookup_App_Content_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.app_content_type". */
export type Lookup_App_Content_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_app_content_type */
export type Lookup_App_Content_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.app_content_type" */
export enum Lookup_App_Content_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.app_content_type" */
export type Lookup_App_Content_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lookup.app_content_type" */
export enum Lookup_App_Content_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** Types van notificaties aan eindgebruikers */
export type Lookup_App_Notification_Type = {
  __typename?: 'lookup_app_notification_type';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Aggregate = {
  __typename?: 'lookup_app_notification_type_aggregate';
  aggregate?: Maybe<Lookup_App_Notification_Type_Aggregate_Fields>;
  nodes: Array<Lookup_App_Notification_Type>;
};

/** aggregate fields of "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Aggregate_Fields = {
  __typename?: 'lookup_app_notification_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lookup_App_Notification_Type_Max_Fields>;
  min?: Maybe<Lookup_App_Notification_Type_Min_Fields>;
};


/** aggregate fields of "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_App_Notification_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lookup.app_notification_type". All fields are combined with a logical 'AND'. */
export type Lookup_App_Notification_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_App_Notification_Type_Bool_Exp>>;
  _not?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_App_Notification_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.app_notification_type" */
export enum Lookup_App_Notification_Type_Constraint {
  /** unique or primary key constraint */
  AppNotificationTypePkey = 'app_notification_type_pkey'
}

/** input type for inserting data into table "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_App_Notification_Type_Max_Fields = {
  __typename?: 'lookup_app_notification_type_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_App_Notification_Type_Min_Fields = {
  __typename?: 'lookup_app_notification_type_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Mutation_Response = {
  __typename?: 'lookup_app_notification_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_App_Notification_Type>;
};

/** on_conflict condition type for table "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_On_Conflict = {
  constraint: Lookup_App_Notification_Type_Constraint;
  update_columns?: Array<Lookup_App_Notification_Type_Update_Column>;
  where?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.app_notification_type". */
export type Lookup_App_Notification_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_app_notification_type */
export type Lookup_App_Notification_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.app_notification_type" */
export enum Lookup_App_Notification_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lookup.app_notification_type" */
export enum Lookup_App_Notification_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** de circle of life van een bezoek */
export type Lookup_Maintainer_Visitor_Space_Request_Status = {
  __typename?: 'lookup_maintainer_visitor_space_request_status';
  comment: Scalars['String'];
  sort_order: Scalars['Int'];
  value: Scalars['String'];
};

/** aggregated selection of "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Aggregate = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_aggregate';
  aggregate?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Aggregate_Fields>;
  nodes: Array<Lookup_Maintainer_Visitor_Space_Request_Status>;
};

/** aggregate fields of "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Aggregate_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_aggregate_fields';
  avg?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Max_Fields>;
  min?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Min_Fields>;
  stddev?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Stddev_Fields>;
  stddev_pop?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Stddev_Samp_Fields>;
  sum?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Sum_Fields>;
  var_pop?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Var_Pop_Fields>;
  var_samp?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Var_Samp_Fields>;
  variance?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Variance_Fields>;
};


/** aggregate fields of "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Avg_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_avg_fields';
  sort_order?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "lookup.maintainer_visitor_space_request_status". All fields are combined with a logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp>>;
  _not?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  sort_order?: InputMaybe<Int_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.maintainer_visitor_space_request_status" */
export enum Lookup_Maintainer_Visitor_Space_Request_Status_Constraint {
  /** unique or primary key constraint */
  CpVisitStatusPkey = 'cp_visit_status_pkey',
  /** unique or primary key constraint */
  MaintainerVisitorSpaceRequestStatusSortOrderKey = 'maintainer_visitor_space_request_status_sort_order_key'
}

/** input type for incrementing numeric columns in table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Inc_Input = {
  sort_order?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  sort_order?: InputMaybe<Scalars['Int']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Max_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_max_fields';
  comment?: Maybe<Scalars['String']>;
  sort_order?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Min_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_min_fields';
  comment?: Maybe<Scalars['String']>;
  sort_order?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Mutation_Response = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_Maintainer_Visitor_Space_Request_Status>;
};

/** input type for inserting object relation for remote table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Obj_Rel_Insert_Input = {
  data: Lookup_Maintainer_Visitor_Space_Request_Status_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_On_Conflict>;
};

/** on_conflict condition type for table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_On_Conflict = {
  constraint: Lookup_Maintainer_Visitor_Space_Request_Status_Constraint;
  update_columns?: Array<Lookup_Maintainer_Visitor_Space_Request_Status_Update_Column>;
  where?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.maintainer_visitor_space_request_status". */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Order_By = {
  comment?: InputMaybe<Order_By>;
  sort_order?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_maintainer_visitor_space_request_status */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.maintainer_visitor_space_request_status" */
export enum Lookup_Maintainer_Visitor_Space_Request_Status_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  sort_order?: InputMaybe<Scalars['Int']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Stddev_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_stddev_fields';
  sort_order?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Stddev_Pop_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_stddev_pop_fields';
  sort_order?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Stddev_Samp_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_stddev_samp_fields';
  sort_order?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Sum_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_sum_fields';
  sort_order?: Maybe<Scalars['Int']>;
};

/** update columns of table "lookup.maintainer_visitor_space_request_status" */
export enum Lookup_Maintainer_Visitor_Space_Request_Status_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Value = 'value'
}

/** aggregate var_pop on columns */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Var_Pop_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_var_pop_fields';
  sort_order?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Var_Samp_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_var_samp_fields';
  sort_order?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Variance_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_request_status_variance_fields';
  sort_order?: Maybe<Scalars['Float']>;
};

/** Enum waardes voor de status van een bezoekersruimte */
export type Lookup_Maintainer_Visitor_Space_Status = {
  __typename?: 'lookup_maintainer_visitor_space_status';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_Aggregate = {
  __typename?: 'lookup_maintainer_visitor_space_status_aggregate';
  aggregate?: Maybe<Lookup_Maintainer_Visitor_Space_Status_Aggregate_Fields>;
  nodes: Array<Lookup_Maintainer_Visitor_Space_Status>;
};

/** aggregate fields of "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_Aggregate_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lookup_Maintainer_Visitor_Space_Status_Max_Fields>;
  min?: Maybe<Lookup_Maintainer_Visitor_Space_Status_Min_Fields>;
};


/** aggregate fields of "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lookup.maintainer_visitor_space_status". All fields are combined with a logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp>>;
  _not?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.maintainer_visitor_space_status" */
export enum Lookup_Maintainer_Visitor_Space_Status_Constraint {
  /** unique or primary key constraint */
  MaintainerVisitorSpaceStatusPkey = 'maintainer_visitor_space_status_pkey'
}

export enum Lookup_Maintainer_Visitor_Space_Status_Enum {
  /** De bezoekersruimte is gepubliceerd en zichtbaar voor bezoekers */
  Active = 'ACTIVE',
  /** De bezoekersruimte is niet gepubliceerd en niet zichtbaar voor bezoekers */
  Inactive = 'INACTIVE',
  /** De bezoekersruimte is opgestart en vindbaar met rechtstreekse link, maar niet vindbaar zoekresultaten of de homepage */
  Requested = 'REQUESTED'
}

/** Boolean expression to compare columns of type "lookup_maintainer_visitor_space_status_enum". All fields are combined with logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Status_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Enum>;
  _in?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Enum>;
  _nin?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Enum>>;
};

/** input type for inserting data into table "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_Maintainer_Visitor_Space_Status_Max_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_status_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_Maintainer_Visitor_Space_Status_Min_Fields = {
  __typename?: 'lookup_maintainer_visitor_space_status_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_Mutation_Response = {
  __typename?: 'lookup_maintainer_visitor_space_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_Maintainer_Visitor_Space_Status>;
};

/** on_conflict condition type for table "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_On_Conflict = {
  constraint: Lookup_Maintainer_Visitor_Space_Status_Constraint;
  update_columns?: Array<Lookup_Maintainer_Visitor_Space_Status_Update_Column>;
  where?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.maintainer_visitor_space_status". */
export type Lookup_Maintainer_Visitor_Space_Status_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_maintainer_visitor_space_status */
export type Lookup_Maintainer_Visitor_Space_Status_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.maintainer_visitor_space_status" */
export enum Lookup_Maintainer_Visitor_Space_Status_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lookup.maintainer_visitor_space_status" */
export enum Lookup_Maintainer_Visitor_Space_Status_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** The target group associated with a given audience.. */
export type Lookup_Schema_Audience_Type = {
  __typename?: 'lookup_schema_audience_type';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Aggregate = {
  __typename?: 'lookup_schema_audience_type_aggregate';
  aggregate?: Maybe<Lookup_Schema_Audience_Type_Aggregate_Fields>;
  nodes: Array<Lookup_Schema_Audience_Type>;
};

/** aggregate fields of "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Aggregate_Fields = {
  __typename?: 'lookup_schema_audience_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lookup_Schema_Audience_Type_Max_Fields>;
  min?: Maybe<Lookup_Schema_Audience_Type_Min_Fields>;
};


/** aggregate fields of "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_Schema_Audience_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lookup.schema_audience_type". All fields are combined with a logical 'AND'. */
export type Lookup_Schema_Audience_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_Schema_Audience_Type_Bool_Exp>>;
  _not?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_Schema_Audience_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.schema_audience_type" */
export enum Lookup_Schema_Audience_Type_Constraint {
  /** unique or primary key constraint */
  SchemaAudienceTypePkey = 'schema_audience_type_pkey'
}

export enum Lookup_Schema_Audience_Type_Enum {
  /** The resource is restricted to private access or use. */
  Private = 'PRIVATE',
  /** The resource is intended for public access or use. */
  Public = 'PUBLIC'
}

/** Boolean expression to compare columns of type "lookup_schema_audience_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_Schema_Audience_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Lookup_Schema_Audience_Type_Enum>;
  _in?: InputMaybe<Array<Lookup_Schema_Audience_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Lookup_Schema_Audience_Type_Enum>;
  _nin?: InputMaybe<Array<Lookup_Schema_Audience_Type_Enum>>;
};

/** input type for inserting data into table "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_Schema_Audience_Type_Max_Fields = {
  __typename?: 'lookup_schema_audience_type_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_Schema_Audience_Type_Min_Fields = {
  __typename?: 'lookup_schema_audience_type_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Mutation_Response = {
  __typename?: 'lookup_schema_audience_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_Schema_Audience_Type>;
};

/** on_conflict condition type for table "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_On_Conflict = {
  constraint: Lookup_Schema_Audience_Type_Constraint;
  update_columns?: Array<Lookup_Schema_Audience_Type_Update_Column>;
  where?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.schema_audience_type". */
export type Lookup_Schema_Audience_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_schema_audience_type */
export type Lookup_Schema_Audience_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.schema_audience_type" */
export enum Lookup_Schema_Audience_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lookup.schema_audience_type" */
export enum Lookup_Schema_Audience_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** Informatie over de organisatie die content beheert en aanbiedt, aka CP */
export type Maintainer_Content_Partner = {
  __typename?: 'maintainer_content_partner';
  created_at: Scalars['timestamp'];
  /** An object relationship */
  index?: Maybe<Maintainer_Index>;
  /** An object relationship */
  information?: Maybe<Maintainer_Organisation>;
  /** An array relationship */
  maintainer_users_profiles: Array<Maintainer_Users_Profile>;
  /** An aggregate relationship */
  maintainer_users_profiles_aggregate: Maintainer_Users_Profile_Aggregate;
  schema_identifier: Scalars['String'];
  schema_name?: Maybe<Scalars['String']>;
  schema_name_lower?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamp'];
  /** An object relationship */
  visitor_space?: Maybe<Maintainer_Visitor_Space>;
};


/** Informatie over de organisatie die content beheert en aanbiedt, aka CP */
export type Maintainer_Content_PartnerMaintainer_Users_ProfilesArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
};


/** Informatie over de organisatie die content beheert en aanbiedt, aka CP */
export type Maintainer_Content_PartnerMaintainer_Users_Profiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
};

/** aggregated selection of "maintainer.content_partner" */
export type Maintainer_Content_Partner_Aggregate = {
  __typename?: 'maintainer_content_partner_aggregate';
  aggregate?: Maybe<Maintainer_Content_Partner_Aggregate_Fields>;
  nodes: Array<Maintainer_Content_Partner>;
};

/** aggregate fields of "maintainer.content_partner" */
export type Maintainer_Content_Partner_Aggregate_Fields = {
  __typename?: 'maintainer_content_partner_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Maintainer_Content_Partner_Max_Fields>;
  min?: Maybe<Maintainer_Content_Partner_Min_Fields>;
};


/** aggregate fields of "maintainer.content_partner" */
export type Maintainer_Content_Partner_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Maintainer_Content_Partner_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "maintainer.content_partner". All fields are combined with a logical 'AND'. */
export type Maintainer_Content_Partner_Bool_Exp = {
  _and?: InputMaybe<Array<Maintainer_Content_Partner_Bool_Exp>>;
  _not?: InputMaybe<Maintainer_Content_Partner_Bool_Exp>;
  _or?: InputMaybe<Array<Maintainer_Content_Partner_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  index?: InputMaybe<Maintainer_Index_Bool_Exp>;
  information?: InputMaybe<Maintainer_Organisation_Bool_Exp>;
  maintainer_users_profiles?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  schema_name_lower?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  visitor_space?: InputMaybe<Maintainer_Visitor_Space_Bool_Exp>;
};

/** unique or primary key constraints on table "maintainer.content_partner" */
export enum Maintainer_Content_Partner_Constraint {
  /** unique or primary key constraint */
  MaintainerPkey = 'maintainer_pkey'
}

/** input type for inserting data into table "maintainer.content_partner" */
export type Maintainer_Content_Partner_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  index?: InputMaybe<Maintainer_Index_Obj_Rel_Insert_Input>;
  information?: InputMaybe<Maintainer_Organisation_Obj_Rel_Insert_Input>;
  maintainer_users_profiles?: InputMaybe<Maintainer_Users_Profile_Arr_Rel_Insert_Input>;
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  visitor_space?: InputMaybe<Maintainer_Visitor_Space_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Maintainer_Content_Partner_Max_Fields = {
  __typename?: 'maintainer_content_partner_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  schema_identifier?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
  schema_name_lower?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Maintainer_Content_Partner_Min_Fields = {
  __typename?: 'maintainer_content_partner_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  schema_identifier?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
  schema_name_lower?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "maintainer.content_partner" */
export type Maintainer_Content_Partner_Mutation_Response = {
  __typename?: 'maintainer_content_partner_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Maintainer_Content_Partner>;
};

/** input type for inserting object relation for remote table "maintainer.content_partner" */
export type Maintainer_Content_Partner_Obj_Rel_Insert_Input = {
  data: Maintainer_Content_Partner_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Maintainer_Content_Partner_On_Conflict>;
};

/** on_conflict condition type for table "maintainer.content_partner" */
export type Maintainer_Content_Partner_On_Conflict = {
  constraint: Maintainer_Content_Partner_Constraint;
  update_columns?: Array<Maintainer_Content_Partner_Update_Column>;
  where?: InputMaybe<Maintainer_Content_Partner_Bool_Exp>;
};

/** Ordering options when selecting data from "maintainer.content_partner". */
export type Maintainer_Content_Partner_Order_By = {
  created_at?: InputMaybe<Order_By>;
  index?: InputMaybe<Maintainer_Index_Order_By>;
  information?: InputMaybe<Maintainer_Organisation_Order_By>;
  maintainer_users_profiles_aggregate?: InputMaybe<Maintainer_Users_Profile_Aggregate_Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  schema_name_lower?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visitor_space?: InputMaybe<Maintainer_Visitor_Space_Order_By>;
};

/** primary key columns input for table: maintainer_content_partner */
export type Maintainer_Content_Partner_Pk_Columns_Input = {
  schema_identifier: Scalars['String'];
};

/** select columns of table "maintainer.content_partner" */
export enum Maintainer_Content_Partner_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaNameLower = 'schema_name_lower',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "maintainer.content_partner" */
export type Maintainer_Content_Partner_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "maintainer.content_partner" */
export enum Maintainer_Content_Partner_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Informatie over de zoekindex per CP */
export type Maintainer_Index = {
  __typename?: 'maintainer_index';
  /** An object relationship */
  content_partner: Maintainer_Content_Partner;
  created_at: Scalars['timestamp'];
  schema_maintainer_id: Scalars['String'];
  schema_name?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamp'];
};

/** aggregated selection of "maintainer.index" */
export type Maintainer_Index_Aggregate = {
  __typename?: 'maintainer_index_aggregate';
  aggregate?: Maybe<Maintainer_Index_Aggregate_Fields>;
  nodes: Array<Maintainer_Index>;
};

/** aggregate fields of "maintainer.index" */
export type Maintainer_Index_Aggregate_Fields = {
  __typename?: 'maintainer_index_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Maintainer_Index_Max_Fields>;
  min?: Maybe<Maintainer_Index_Min_Fields>;
};


/** aggregate fields of "maintainer.index" */
export type Maintainer_Index_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Maintainer_Index_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "maintainer.index". All fields are combined with a logical 'AND'. */
export type Maintainer_Index_Bool_Exp = {
  _and?: InputMaybe<Array<Maintainer_Index_Bool_Exp>>;
  _not?: InputMaybe<Maintainer_Index_Bool_Exp>;
  _or?: InputMaybe<Array<Maintainer_Index_Bool_Exp>>;
  content_partner?: InputMaybe<Maintainer_Content_Partner_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "maintainer.index" */
export enum Maintainer_Index_Constraint {
  /** unique or primary key constraint */
  IndexPkey = 'index_pkey'
}

/** input type for inserting data into table "maintainer.index" */
export type Maintainer_Index_Insert_Input = {
  content_partner?: InputMaybe<Maintainer_Content_Partner_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Maintainer_Index_Max_Fields = {
  __typename?: 'maintainer_index_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Maintainer_Index_Min_Fields = {
  __typename?: 'maintainer_index_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "maintainer.index" */
export type Maintainer_Index_Mutation_Response = {
  __typename?: 'maintainer_index_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Maintainer_Index>;
};

/** input type for inserting object relation for remote table "maintainer.index" */
export type Maintainer_Index_Obj_Rel_Insert_Input = {
  data: Maintainer_Index_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Maintainer_Index_On_Conflict>;
};

/** on_conflict condition type for table "maintainer.index" */
export type Maintainer_Index_On_Conflict = {
  constraint: Maintainer_Index_Constraint;
  update_columns?: Array<Maintainer_Index_Update_Column>;
  where?: InputMaybe<Maintainer_Index_Bool_Exp>;
};

/** Ordering options when selecting data from "maintainer.index". */
export type Maintainer_Index_Order_By = {
  content_partner?: InputMaybe<Maintainer_Content_Partner_Order_By>;
  created_at?: InputMaybe<Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: maintainer_index */
export type Maintainer_Index_Pk_Columns_Input = {
  schema_maintainer_id: Scalars['String'];
};

/** select columns of table "maintainer.index" */
export enum Maintainer_Index_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "maintainer.index" */
export type Maintainer_Index_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "maintainer.index" */
export enum Maintainer_Index_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** contains the extra information for each content_partner as a cache from the organisations api v2 */
export type Maintainer_Organisation = {
  __typename?: 'maintainer_organisation';
  contact_point: Scalars['jsonb'];
  created_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  logo: Scalars['jsonb'];
  primary_site: Scalars['jsonb'];
  schema_identifier: Scalars['String'];
  schema_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};


/** contains the extra information for each content_partner as a cache from the organisations api v2 */
export type Maintainer_OrganisationContact_PointArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** contains the extra information for each content_partner as a cache from the organisations api v2 */
export type Maintainer_OrganisationLogoArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** contains the extra information for each content_partner as a cache from the organisations api v2 */
export type Maintainer_OrganisationPrimary_SiteArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "maintainer.organisation" */
export type Maintainer_Organisation_Aggregate = {
  __typename?: 'maintainer_organisation_aggregate';
  aggregate?: Maybe<Maintainer_Organisation_Aggregate_Fields>;
  nodes: Array<Maintainer_Organisation>;
};

/** aggregate fields of "maintainer.organisation" */
export type Maintainer_Organisation_Aggregate_Fields = {
  __typename?: 'maintainer_organisation_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Maintainer_Organisation_Max_Fields>;
  min?: Maybe<Maintainer_Organisation_Min_Fields>;
};


/** aggregate fields of "maintainer.organisation" */
export type Maintainer_Organisation_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Maintainer_Organisation_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Maintainer_Organisation_Append_Input = {
  contact_point?: InputMaybe<Scalars['jsonb']>;
  logo?: InputMaybe<Scalars['jsonb']>;
  primary_site?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "maintainer.organisation". All fields are combined with a logical 'AND'. */
export type Maintainer_Organisation_Bool_Exp = {
  _and?: InputMaybe<Array<Maintainer_Organisation_Bool_Exp>>;
  _not?: InputMaybe<Maintainer_Organisation_Bool_Exp>;
  _or?: InputMaybe<Array<Maintainer_Organisation_Bool_Exp>>;
  contact_point?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  logo?: InputMaybe<Jsonb_Comparison_Exp>;
  primary_site?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "maintainer.organisation" */
export enum Maintainer_Organisation_Constraint {
  /** unique or primary key constraint */
  OrganisationPkey = 'organisation_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Maintainer_Organisation_Delete_At_Path_Input = {
  contact_point?: InputMaybe<Array<Scalars['String']>>;
  logo?: InputMaybe<Array<Scalars['String']>>;
  primary_site?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Maintainer_Organisation_Delete_Elem_Input = {
  contact_point?: InputMaybe<Scalars['Int']>;
  logo?: InputMaybe<Scalars['Int']>;
  primary_site?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Maintainer_Organisation_Delete_Key_Input = {
  contact_point?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  primary_site?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "maintainer.organisation" */
export type Maintainer_Organisation_Insert_Input = {
  contact_point?: InputMaybe<Scalars['jsonb']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['jsonb']>;
  primary_site?: InputMaybe<Scalars['jsonb']>;
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Maintainer_Organisation_Max_Fields = {
  __typename?: 'maintainer_organisation_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  schema_identifier?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Maintainer_Organisation_Min_Fields = {
  __typename?: 'maintainer_organisation_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  schema_identifier?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "maintainer.organisation" */
export type Maintainer_Organisation_Mutation_Response = {
  __typename?: 'maintainer_organisation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Maintainer_Organisation>;
};

/** input type for inserting object relation for remote table "maintainer.organisation" */
export type Maintainer_Organisation_Obj_Rel_Insert_Input = {
  data: Maintainer_Organisation_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Maintainer_Organisation_On_Conflict>;
};

/** on_conflict condition type for table "maintainer.organisation" */
export type Maintainer_Organisation_On_Conflict = {
  constraint: Maintainer_Organisation_Constraint;
  update_columns?: Array<Maintainer_Organisation_Update_Column>;
  where?: InputMaybe<Maintainer_Organisation_Bool_Exp>;
};

/** Ordering options when selecting data from "maintainer.organisation". */
export type Maintainer_Organisation_Order_By = {
  contact_point?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  logo?: InputMaybe<Order_By>;
  primary_site?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: maintainer_organisation */
export type Maintainer_Organisation_Pk_Columns_Input = {
  schema_identifier: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Maintainer_Organisation_Prepend_Input = {
  contact_point?: InputMaybe<Scalars['jsonb']>;
  logo?: InputMaybe<Scalars['jsonb']>;
  primary_site?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "maintainer.organisation" */
export enum Maintainer_Organisation_Select_Column {
  /** column name */
  ContactPoint = 'contact_point',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Logo = 'logo',
  /** column name */
  PrimarySite = 'primary_site',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "maintainer.organisation" */
export type Maintainer_Organisation_Set_Input = {
  contact_point?: InputMaybe<Scalars['jsonb']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['jsonb']>;
  primary_site?: InputMaybe<Scalars['jsonb']>;
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "maintainer.organisation" */
export enum Maintainer_Organisation_Update_Column {
  /** column name */
  ContactPoint = 'contact_point',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Logo = 'logo',
  /** column name */
  PrimarySite = 'primary_site',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** The user profiles that will manage this reading room */
export type Maintainer_Users_Profile = {
  __typename?: 'maintainer_users_profile';
  id: Scalars['uuid'];
  /** An object relationship */
  maintainer: Maintainer_Content_Partner;
  maintainer_identifier: Scalars['String'];
  /** An object relationship */
  profile: Users_Profile;
  users_profile_id: Scalars['uuid'];
};

/** aggregated selection of "maintainer.users_profile" */
export type Maintainer_Users_Profile_Aggregate = {
  __typename?: 'maintainer_users_profile_aggregate';
  aggregate?: Maybe<Maintainer_Users_Profile_Aggregate_Fields>;
  nodes: Array<Maintainer_Users_Profile>;
};

/** aggregate fields of "maintainer.users_profile" */
export type Maintainer_Users_Profile_Aggregate_Fields = {
  __typename?: 'maintainer_users_profile_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Maintainer_Users_Profile_Max_Fields>;
  min?: Maybe<Maintainer_Users_Profile_Min_Fields>;
};


/** aggregate fields of "maintainer.users_profile" */
export type Maintainer_Users_Profile_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Maintainer_Users_Profile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "maintainer.users_profile" */
export type Maintainer_Users_Profile_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Maintainer_Users_Profile_Max_Order_By>;
  min?: InputMaybe<Maintainer_Users_Profile_Min_Order_By>;
};

/** input type for inserting array relation for remote table "maintainer.users_profile" */
export type Maintainer_Users_Profile_Arr_Rel_Insert_Input = {
  data: Array<Maintainer_Users_Profile_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Maintainer_Users_Profile_On_Conflict>;
};

/** Boolean expression to filter rows from the table "maintainer.users_profile". All fields are combined with a logical 'AND'. */
export type Maintainer_Users_Profile_Bool_Exp = {
  _and?: InputMaybe<Array<Maintainer_Users_Profile_Bool_Exp>>;
  _not?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
  _or?: InputMaybe<Array<Maintainer_Users_Profile_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  maintainer?: InputMaybe<Maintainer_Content_Partner_Bool_Exp>;
  maintainer_identifier?: InputMaybe<String_Comparison_Exp>;
  profile?: InputMaybe<Users_Profile_Bool_Exp>;
  users_profile_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "maintainer.users_profile" */
export enum Maintainer_Users_Profile_Constraint {
  /** unique or primary key constraint */
  MaintainerUsersProfileMaintainerIdentifierUsersProfilKey = 'maintainer_users_profile_maintainer_identifier_users_profil_key',
  /** unique or primary key constraint */
  MaintainerUsersProfilePkey = 'maintainer_users_profile_pkey'
}

/** input type for inserting data into table "maintainer.users_profile" */
export type Maintainer_Users_Profile_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  maintainer?: InputMaybe<Maintainer_Content_Partner_Obj_Rel_Insert_Input>;
  maintainer_identifier?: InputMaybe<Scalars['String']>;
  profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  users_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Maintainer_Users_Profile_Max_Fields = {
  __typename?: 'maintainer_users_profile_max_fields';
  id?: Maybe<Scalars['uuid']>;
  maintainer_identifier?: Maybe<Scalars['String']>;
  users_profile_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "maintainer.users_profile" */
export type Maintainer_Users_Profile_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  maintainer_identifier?: InputMaybe<Order_By>;
  users_profile_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Maintainer_Users_Profile_Min_Fields = {
  __typename?: 'maintainer_users_profile_min_fields';
  id?: Maybe<Scalars['uuid']>;
  maintainer_identifier?: Maybe<Scalars['String']>;
  users_profile_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "maintainer.users_profile" */
export type Maintainer_Users_Profile_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  maintainer_identifier?: InputMaybe<Order_By>;
  users_profile_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "maintainer.users_profile" */
export type Maintainer_Users_Profile_Mutation_Response = {
  __typename?: 'maintainer_users_profile_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Maintainer_Users_Profile>;
};

/** on_conflict condition type for table "maintainer.users_profile" */
export type Maintainer_Users_Profile_On_Conflict = {
  constraint: Maintainer_Users_Profile_Constraint;
  update_columns?: Array<Maintainer_Users_Profile_Update_Column>;
  where?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
};

/** Ordering options when selecting data from "maintainer.users_profile". */
export type Maintainer_Users_Profile_Order_By = {
  id?: InputMaybe<Order_By>;
  maintainer?: InputMaybe<Maintainer_Content_Partner_Order_By>;
  maintainer_identifier?: InputMaybe<Order_By>;
  profile?: InputMaybe<Users_Profile_Order_By>;
  users_profile_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: maintainer_users_profile */
export type Maintainer_Users_Profile_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "maintainer.users_profile" */
export enum Maintainer_Users_Profile_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MaintainerIdentifier = 'maintainer_identifier',
  /** column name */
  UsersProfileId = 'users_profile_id'
}

/** input type for updating data in table "maintainer.users_profile" */
export type Maintainer_Users_Profile_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  maintainer_identifier?: InputMaybe<Scalars['String']>;
  users_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "maintainer.users_profile" */
export enum Maintainer_Users_Profile_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MaintainerIdentifier = 'maintainer_identifier',
  /** column name */
  UsersProfileId = 'users_profile_id'
}

/** Bezoekersruimte aka leeszaal van een CP */
export type Maintainer_Visitor_Space = {
  __typename?: 'maintainer_visitor_space';
  /** An object relationship */
  content_partner: Maintainer_Content_Partner;
  created_at?: Maybe<Scalars['timestamp']>;
  id: Scalars['uuid'];
  published_at?: Maybe<Scalars['timestamp']>;
  schema_audience_type: Lookup_Schema_Audience_Type_Enum;
  schema_color?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_image?: Maybe<Scalars['String']>;
  schema_maintainer_id: Scalars['String'];
  schema_public_access?: Maybe<Scalars['Boolean']>;
  schema_service_description?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  status: Lookup_Maintainer_Visitor_Space_Status_Enum;
  updated_at?: Maybe<Scalars['timestamp']>;
  /** An array relationship */
  visitor_space_requests: Array<Maintainer_Visitor_Space_Request>;
  /** An aggregate relationship */
  visitor_space_requests_aggregate: Maintainer_Visitor_Space_Request_Aggregate;
};


/** Bezoekersruimte aka leeszaal van een CP */
export type Maintainer_Visitor_SpaceVisitor_Space_RequestsArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};


/** Bezoekersruimte aka leeszaal van een CP */
export type Maintainer_Visitor_SpaceVisitor_Space_Requests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};

/** aggregated selection of "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Aggregate = {
  __typename?: 'maintainer_visitor_space_aggregate';
  aggregate?: Maybe<Maintainer_Visitor_Space_Aggregate_Fields>;
  nodes: Array<Maintainer_Visitor_Space>;
};

/** aggregate fields of "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Aggregate_Fields = {
  __typename?: 'maintainer_visitor_space_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Maintainer_Visitor_Space_Max_Fields>;
  min?: Maybe<Maintainer_Visitor_Space_Min_Fields>;
};


/** aggregate fields of "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Maintainer_Visitor_Space_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "maintainer.visitor_space". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Bool_Exp = {
  _and?: InputMaybe<Array<Maintainer_Visitor_Space_Bool_Exp>>;
  _not?: InputMaybe<Maintainer_Visitor_Space_Bool_Exp>;
  _or?: InputMaybe<Array<Maintainer_Visitor_Space_Bool_Exp>>;
  content_partner?: InputMaybe<Maintainer_Content_Partner_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  published_at?: InputMaybe<Timestamp_Comparison_Exp>;
  schema_audience_type?: InputMaybe<Lookup_Schema_Audience_Type_Enum_Comparison_Exp>;
  schema_color?: InputMaybe<String_Comparison_Exp>;
  schema_description?: InputMaybe<String_Comparison_Exp>;
  schema_image?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_public_access?: InputMaybe<Boolean_Comparison_Exp>;
  schema_service_description?: InputMaybe<String_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Enum_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  visitor_space_requests?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};

/** unique or primary key constraints on table "maintainer.visitor_space" */
export enum Maintainer_Visitor_Space_Constraint {
  /** unique or primary key constraint */
  SpacePkey = 'space_pkey',
  /** unique or primary key constraint */
  SpaceSchemaMaintainerIdKey = 'space_schema_maintainer_id_key',
  /** unique or primary key constraint */
  VisitorSpaceSlugKey = 'visitor_space_slug_key'
}

/** input type for inserting data into table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Insert_Input = {
  content_partner?: InputMaybe<Maintainer_Content_Partner_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  published_at?: InputMaybe<Scalars['timestamp']>;
  schema_audience_type?: InputMaybe<Lookup_Schema_Audience_Type_Enum>;
  schema_color?: InputMaybe<Scalars['String']>;
  schema_description?: InputMaybe<Scalars['String']>;
  schema_image?: InputMaybe<Scalars['String']>;
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  schema_public_access?: InputMaybe<Scalars['Boolean']>;
  schema_service_description?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Enum>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  visitor_space_requests?: InputMaybe<Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Maintainer_Visitor_Space_Max_Fields = {
  __typename?: 'maintainer_visitor_space_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  schema_color?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_image?: Maybe<Scalars['String']>;
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_service_description?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Maintainer_Visitor_Space_Min_Fields = {
  __typename?: 'maintainer_visitor_space_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  schema_color?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_image?: Maybe<Scalars['String']>;
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_service_description?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Mutation_Response = {
  __typename?: 'maintainer_visitor_space_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Maintainer_Visitor_Space>;
};

/** input type for inserting object relation for remote table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Obj_Rel_Insert_Input = {
  data: Maintainer_Visitor_Space_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Maintainer_Visitor_Space_On_Conflict>;
};

/** on_conflict condition type for table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Update_Column>;
  where?: InputMaybe<Maintainer_Visitor_Space_Bool_Exp>;
};

/** Ordering options when selecting data from "maintainer.visitor_space". */
export type Maintainer_Visitor_Space_Order_By = {
  content_partner?: InputMaybe<Maintainer_Content_Partner_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  published_at?: InputMaybe<Order_By>;
  schema_audience_type?: InputMaybe<Order_By>;
  schema_color?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_image?: InputMaybe<Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_public_access?: InputMaybe<Order_By>;
  schema_service_description?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visitor_space_requests_aggregate?: InputMaybe<Maintainer_Visitor_Space_Request_Aggregate_Order_By>;
};

/** primary key columns input for table: maintainer_visitor_space */
export type Maintainer_Visitor_Space_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** Bezoekaanvragen van gebruikers */
export type Maintainer_Visitor_Space_Request = {
  __typename?: 'maintainer_visitor_space_request';
  cp_space_id: Scalars['uuid'];
  created_at: Scalars['timestamp'];
  end_date?: Maybe<Scalars['timestamp']>;
  id: Scalars['uuid'];
  /** An object relationship */
  last_updated_by?: Maybe<Users_Profile>;
  /** An array relationship */
  notifications: Array<App_Notification>;
  /** An aggregate relationship */
  notifications_aggregate: App_Notification_Aggregate;
  /** An object relationship */
  requested_by: Users_Profile;
  start_date?: Maybe<Scalars['timestamp']>;
  status: Scalars['String'];
  /** An object relationship */
  status_info: Lookup_Maintainer_Visitor_Space_Request_Status;
  updated_at: Scalars['timestamp'];
  updated_by?: Maybe<Scalars['uuid']>;
  user_accepted_tos?: Maybe<Scalars['Boolean']>;
  user_profile_id: Scalars['uuid'];
  user_reason?: Maybe<Scalars['String']>;
  user_timeframe?: Maybe<Scalars['String']>;
  /** An object relationship */
  visitor_space: Maintainer_Visitor_Space;
  /** An array relationship */
  visitor_space_request_notes: Array<Maintainer_Visitor_Space_Request_Note>;
  /** An aggregate relationship */
  visitor_space_request_notes_aggregate: Maintainer_Visitor_Space_Request_Note_Aggregate;
};


/** Bezoekaanvragen van gebruikers */
export type Maintainer_Visitor_Space_RequestNotificationsArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


/** Bezoekaanvragen van gebruikers */
export type Maintainer_Visitor_Space_RequestNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


/** Bezoekaanvragen van gebruikers */
export type Maintainer_Visitor_Space_RequestVisitor_Space_Request_NotesArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
};


/** Bezoekaanvragen van gebruikers */
export type Maintainer_Visitor_Space_RequestVisitor_Space_Request_Notes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
};

/** aggregated selection of "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Aggregate = {
  __typename?: 'maintainer_visitor_space_request_aggregate';
  aggregate?: Maybe<Maintainer_Visitor_Space_Request_Aggregate_Fields>;
  nodes: Array<Maintainer_Visitor_Space_Request>;
};

/** aggregate fields of "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Aggregate_Fields = {
  __typename?: 'maintainer_visitor_space_request_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Maintainer_Visitor_Space_Request_Max_Fields>;
  min?: Maybe<Maintainer_Visitor_Space_Request_Min_Fields>;
};


/** aggregate fields of "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Maintainer_Visitor_Space_Request_Max_Order_By>;
  min?: InputMaybe<Maintainer_Visitor_Space_Request_Min_Order_By>;
};

/** input type for inserting array relation for remote table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input = {
  data: Array<Maintainer_Visitor_Space_Request_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Maintainer_Visitor_Space_Request_On_Conflict>;
};

/** Boolean expression to filter rows from the table "maintainer.visitor_space_request". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Request_Bool_Exp = {
  _and?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Bool_Exp>>;
  _not?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
  _or?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Bool_Exp>>;
  cp_space_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  end_date?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  last_updated_by?: InputMaybe<Users_Profile_Bool_Exp>;
  notifications?: InputMaybe<App_Notification_Bool_Exp>;
  requested_by?: InputMaybe<Users_Profile_Bool_Exp>;
  start_date?: InputMaybe<Timestamp_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  status_info?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
  user_accepted_tos?: InputMaybe<Boolean_Comparison_Exp>;
  user_profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_reason?: InputMaybe<String_Comparison_Exp>;
  user_timeframe?: InputMaybe<String_Comparison_Exp>;
  visitor_space?: InputMaybe<Maintainer_Visitor_Space_Bool_Exp>;
  visitor_space_request_notes?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
};

/** unique or primary key constraints on table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Constraint {
  /** unique or primary key constraint */
  VisitPkey = 'visit_pkey'
}

/** input type for inserting data into table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Insert_Input = {
  cp_space_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  end_date?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  last_updated_by?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  notifications?: InputMaybe<App_Notification_Arr_Rel_Insert_Input>;
  requested_by?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  start_date?: InputMaybe<Scalars['timestamp']>;
  status?: InputMaybe<Scalars['String']>;
  status_info?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Obj_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  updated_by?: InputMaybe<Scalars['uuid']>;
  user_accepted_tos?: InputMaybe<Scalars['Boolean']>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
  user_reason?: InputMaybe<Scalars['String']>;
  user_timeframe?: InputMaybe<Scalars['String']>;
  visitor_space?: InputMaybe<Maintainer_Visitor_Space_Obj_Rel_Insert_Input>;
  visitor_space_request_notes?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Maintainer_Visitor_Space_Request_Max_Fields = {
  __typename?: 'maintainer_visitor_space_request_max_fields';
  cp_space_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  end_date?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  start_date?: Maybe<Scalars['timestamp']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  updated_by?: Maybe<Scalars['uuid']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
  user_reason?: Maybe<Scalars['String']>;
  user_timeframe?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Max_Order_By = {
  cp_space_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
  user_reason?: InputMaybe<Order_By>;
  user_timeframe?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Maintainer_Visitor_Space_Request_Min_Fields = {
  __typename?: 'maintainer_visitor_space_request_min_fields';
  cp_space_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  end_date?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  start_date?: Maybe<Scalars['timestamp']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  updated_by?: Maybe<Scalars['uuid']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
  user_reason?: Maybe<Scalars['String']>;
  user_timeframe?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Min_Order_By = {
  cp_space_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
  user_reason?: InputMaybe<Order_By>;
  user_timeframe?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Mutation_Response = {
  __typename?: 'maintainer_visitor_space_request_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Maintainer_Visitor_Space_Request>;
};

/** Notities en bemerkingen van een beheerder tijdens de levensduur van een bezoek, van aanvraag tot afronding */
export type Maintainer_Visitor_Space_Request_Note = {
  __typename?: 'maintainer_visitor_space_request_note';
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  note: Scalars['String'];
  /** An object relationship */
  profile?: Maybe<Users_Profile>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: Maybe<Scalars['uuid']>;
  updated_at: Scalars['timestamp'];
  /** An object relationship */
  visit: Maintainer_Visitor_Space_Request;
  visit_id: Scalars['uuid'];
};

/** aggregated selection of "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Aggregate = {
  __typename?: 'maintainer_visitor_space_request_note_aggregate';
  aggregate?: Maybe<Maintainer_Visitor_Space_Request_Note_Aggregate_Fields>;
  nodes: Array<Maintainer_Visitor_Space_Request_Note>;
};

/** aggregate fields of "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Aggregate_Fields = {
  __typename?: 'maintainer_visitor_space_request_note_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Maintainer_Visitor_Space_Request_Note_Max_Fields>;
  min?: Maybe<Maintainer_Visitor_Space_Request_Note_Min_Fields>;
};


/** aggregate fields of "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Max_Order_By>;
  min?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Min_Order_By>;
};

/** input type for inserting array relation for remote table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Arr_Rel_Insert_Input = {
  data: Array<Maintainer_Visitor_Space_Request_Note_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Maintainer_Visitor_Space_Request_Note_On_Conflict>;
};

/** Boolean expression to filter rows from the table "maintainer.visitor_space_request_note". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Request_Note_Bool_Exp = {
  _and?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Bool_Exp>>;
  _not?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
  _or?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  note?: InputMaybe<String_Comparison_Exp>;
  profile?: InputMaybe<Users_Profile_Bool_Exp>;
  profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  visit?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
  visit_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "maintainer.visitor_space_request_note" */
export enum Maintainer_Visitor_Space_Request_Note_Constraint {
  /** unique or primary key constraint */
  VisitNotePkey = 'visit_note_pkey'
}

/** input type for inserting data into table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  note?: InputMaybe<Scalars['String']>;
  profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  visit?: InputMaybe<Maintainer_Visitor_Space_Request_Obj_Rel_Insert_Input>;
  visit_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Maintainer_Visitor_Space_Request_Note_Max_Fields = {
  __typename?: 'maintainer_visitor_space_request_note_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  note?: Maybe<Scalars['String']>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  visit_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visit_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Maintainer_Visitor_Space_Request_Note_Min_Fields = {
  __typename?: 'maintainer_visitor_space_request_note_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  note?: Maybe<Scalars['String']>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  visit_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visit_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Mutation_Response = {
  __typename?: 'maintainer_visitor_space_request_note_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Maintainer_Visitor_Space_Request_Note>;
};

/** on_conflict condition type for table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Request_Note_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Request_Note_Update_Column>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
};

/** Ordering options when selecting data from "maintainer.visitor_space_request_note". */
export type Maintainer_Visitor_Space_Request_Note_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  profile?: InputMaybe<Users_Profile_Order_By>;
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visit?: InputMaybe<Maintainer_Visitor_Space_Request_Order_By>;
  visit_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: maintainer_visitor_space_request_note */
export type Maintainer_Visitor_Space_Request_Note_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "maintainer.visitor_space_request_note" */
export enum Maintainer_Visitor_Space_Request_Note_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Note = 'note',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VisitId = 'visit_id'
}

/** input type for updating data in table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  note?: InputMaybe<Scalars['String']>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  visit_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "maintainer.visitor_space_request_note" */
export enum Maintainer_Visitor_Space_Request_Note_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Note = 'note',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VisitId = 'visit_id'
}

/** input type for inserting object relation for remote table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Obj_Rel_Insert_Input = {
  data: Maintainer_Visitor_Space_Request_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Maintainer_Visitor_Space_Request_On_Conflict>;
};

/** on_conflict condition type for table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Request_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Request_Update_Column>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};

/** Ordering options when selecting data from "maintainer.visitor_space_request". */
export type Maintainer_Visitor_Space_Request_Order_By = {
  cp_space_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_updated_by?: InputMaybe<Users_Profile_Order_By>;
  notifications_aggregate?: InputMaybe<App_Notification_Aggregate_Order_By>;
  requested_by?: InputMaybe<Users_Profile_Order_By>;
  start_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  status_info?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  user_accepted_tos?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
  user_reason?: InputMaybe<Order_By>;
  user_timeframe?: InputMaybe<Order_By>;
  visitor_space?: InputMaybe<Maintainer_Visitor_Space_Order_By>;
  visitor_space_request_notes_aggregate?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Aggregate_Order_By>;
};

/** primary key columns input for table: maintainer_visitor_space_request */
export type Maintainer_Visitor_Space_Request_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Select_Column {
  /** column name */
  CpSpaceId = 'cp_space_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EndDate = 'end_date',
  /** column name */
  Id = 'id',
  /** column name */
  StartDate = 'start_date',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedBy = 'updated_by',
  /** column name */
  UserAcceptedTos = 'user_accepted_tos',
  /** column name */
  UserProfileId = 'user_profile_id',
  /** column name */
  UserReason = 'user_reason',
  /** column name */
  UserTimeframe = 'user_timeframe'
}

/** input type for updating data in table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Set_Input = {
  cp_space_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  end_date?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  start_date?: InputMaybe<Scalars['timestamp']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  updated_by?: InputMaybe<Scalars['uuid']>;
  user_accepted_tos?: InputMaybe<Scalars['Boolean']>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
  user_reason?: InputMaybe<Scalars['String']>;
  user_timeframe?: InputMaybe<Scalars['String']>;
};

/** update columns of table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Update_Column {
  /** column name */
  CpSpaceId = 'cp_space_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EndDate = 'end_date',
  /** column name */
  Id = 'id',
  /** column name */
  StartDate = 'start_date',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedBy = 'updated_by',
  /** column name */
  UserAcceptedTos = 'user_accepted_tos',
  /** column name */
  UserProfileId = 'user_profile_id',
  /** column name */
  UserReason = 'user_reason',
  /** column name */
  UserTimeframe = 'user_timeframe'
}

/** select columns of table "maintainer.visitor_space" */
export enum Maintainer_Visitor_Space_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  SchemaAudienceType = 'schema_audience_type',
  /** column name */
  SchemaColor = 'schema_color',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaImage = 'schema_image',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaPublicAccess = 'schema_public_access',
  /** column name */
  SchemaServiceDescription = 'schema_service_description',
  /** column name */
  Slug = 'slug',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  published_at?: InputMaybe<Scalars['timestamp']>;
  schema_audience_type?: InputMaybe<Lookup_Schema_Audience_Type_Enum>;
  schema_color?: InputMaybe<Scalars['String']>;
  schema_description?: InputMaybe<Scalars['String']>;
  schema_image?: InputMaybe<Scalars['String']>;
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  schema_public_access?: InputMaybe<Scalars['Boolean']>;
  schema_service_description?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Enum>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "maintainer.visitor_space" */
export enum Maintainer_Visitor_Space_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  SchemaAudienceType = 'schema_audience_type',
  /** column name */
  SchemaColor = 'schema_color',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaImage = 'schema_image',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaPublicAccess = 'schema_public_access',
  /** column name */
  SchemaServiceDescription = 'schema_service_description',
  /** column name */
  Slug = 'slug',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "app.config" */
  delete_app_config?: Maybe<App_Config_Mutation_Response>;
  /** delete single row from the table: "app.config" */
  delete_app_config_by_pk?: Maybe<App_Config>;
  /** delete data from the table: "app.content_block" */
  delete_app_content_block?: Maybe<App_Content_Block_Mutation_Response>;
  /** delete single row from the table: "app.content_block" */
  delete_app_content_block_by_pk?: Maybe<App_Content_Block>;
  /** delete data from the table: "app.content_label" */
  delete_app_content_label?: Maybe<App_Content_Label_Mutation_Response>;
  /** delete single row from the table: "app.content_label" */
  delete_app_content_label_by_pk?: Maybe<App_Content_Label>;
  /** delete data from the table: "app.content_page" */
  delete_app_content_page?: Maybe<App_Content_Page_Mutation_Response>;
  /** delete single row from the table: "app.content_page" */
  delete_app_content_page_by_pk?: Maybe<App_Content_Page>;
  /** delete data from the table: "app.content_page_content_label" */
  delete_app_content_page_content_label?: Maybe<App_Content_Page_Content_Label_Mutation_Response>;
  /** delete single row from the table: "app.content_page_content_label" */
  delete_app_content_page_content_label_by_pk?: Maybe<App_Content_Page_Content_Label>;
  /** delete data from the table: "app.navigation" */
  delete_app_navigation?: Maybe<App_Navigation_Mutation_Response>;
  /** delete single row from the table: "app.navigation" */
  delete_app_navigation_by_pk?: Maybe<App_Navigation>;
  /** delete data from the table: "app.notification" */
  delete_app_notification?: Maybe<App_Notification_Mutation_Response>;
  /** delete single row from the table: "app.notification" */
  delete_app_notification_by_pk?: Maybe<App_Notification>;
  /** delete data from the table: "lookup.app_content_block_type" */
  delete_lookup_app_content_block_type?: Maybe<Lookup_App_Content_Block_Type_Mutation_Response>;
  /** delete single row from the table: "lookup.app_content_block_type" */
  delete_lookup_app_content_block_type_by_pk?: Maybe<Lookup_App_Content_Block_Type>;
  /** delete data from the table: "lookup.app_content_type" */
  delete_lookup_app_content_type?: Maybe<Lookup_App_Content_Type_Mutation_Response>;
  /** delete single row from the table: "lookup.app_content_type" */
  delete_lookup_app_content_type_by_pk?: Maybe<Lookup_App_Content_Type>;
  /** delete data from the table: "lookup.app_notification_type" */
  delete_lookup_app_notification_type?: Maybe<Lookup_App_Notification_Type_Mutation_Response>;
  /** delete single row from the table: "lookup.app_notification_type" */
  delete_lookup_app_notification_type_by_pk?: Maybe<Lookup_App_Notification_Type>;
  /** delete data from the table: "lookup.maintainer_visitor_space_request_status" */
  delete_lookup_maintainer_visitor_space_request_status?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Mutation_Response>;
  /** delete single row from the table: "lookup.maintainer_visitor_space_request_status" */
  delete_lookup_maintainer_visitor_space_request_status_by_pk?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status>;
  /** delete data from the table: "lookup.maintainer_visitor_space_status" */
  delete_lookup_maintainer_visitor_space_status?: Maybe<Lookup_Maintainer_Visitor_Space_Status_Mutation_Response>;
  /** delete single row from the table: "lookup.maintainer_visitor_space_status" */
  delete_lookup_maintainer_visitor_space_status_by_pk?: Maybe<Lookup_Maintainer_Visitor_Space_Status>;
  /** delete data from the table: "lookup.schema_audience_type" */
  delete_lookup_schema_audience_type?: Maybe<Lookup_Schema_Audience_Type_Mutation_Response>;
  /** delete single row from the table: "lookup.schema_audience_type" */
  delete_lookup_schema_audience_type_by_pk?: Maybe<Lookup_Schema_Audience_Type>;
  /** delete data from the table: "maintainer.content_partner" */
  delete_maintainer_content_partner?: Maybe<Maintainer_Content_Partner_Mutation_Response>;
  /** delete single row from the table: "maintainer.content_partner" */
  delete_maintainer_content_partner_by_pk?: Maybe<Maintainer_Content_Partner>;
  /** delete data from the table: "maintainer.index" */
  delete_maintainer_index?: Maybe<Maintainer_Index_Mutation_Response>;
  /** delete single row from the table: "maintainer.index" */
  delete_maintainer_index_by_pk?: Maybe<Maintainer_Index>;
  /** delete data from the table: "maintainer.organisation" */
  delete_maintainer_organisation?: Maybe<Maintainer_Organisation_Mutation_Response>;
  /** delete single row from the table: "maintainer.organisation" */
  delete_maintainer_organisation_by_pk?: Maybe<Maintainer_Organisation>;
  /** delete data from the table: "maintainer.users_profile" */
  delete_maintainer_users_profile?: Maybe<Maintainer_Users_Profile_Mutation_Response>;
  /** delete single row from the table: "maintainer.users_profile" */
  delete_maintainer_users_profile_by_pk?: Maybe<Maintainer_Users_Profile>;
  /** delete data from the table: "maintainer.visitor_space" */
  delete_maintainer_visitor_space?: Maybe<Maintainer_Visitor_Space_Mutation_Response>;
  /** delete single row from the table: "maintainer.visitor_space" */
  delete_maintainer_visitor_space_by_pk?: Maybe<Maintainer_Visitor_Space>;
  /** delete data from the table: "maintainer.visitor_space_request" */
  delete_maintainer_visitor_space_request?: Maybe<Maintainer_Visitor_Space_Request_Mutation_Response>;
  /** delete single row from the table: "maintainer.visitor_space_request" */
  delete_maintainer_visitor_space_request_by_pk?: Maybe<Maintainer_Visitor_Space_Request>;
  /** delete data from the table: "maintainer.visitor_space_request_note" */
  delete_maintainer_visitor_space_request_note?: Maybe<Maintainer_Visitor_Space_Request_Note_Mutation_Response>;
  /** delete single row from the table: "maintainer.visitor_space_request_note" */
  delete_maintainer_visitor_space_request_note_by_pk?: Maybe<Maintainer_Visitor_Space_Request_Note>;
  /** delete data from the table: "object.file" */
  delete_object_file?: Maybe<Object_File_Mutation_Response>;
  /** delete single row from the table: "object.file" */
  delete_object_file_by_pk?: Maybe<Object_File>;
  /** delete data from the table: "object.ie" */
  delete_object_ie?: Maybe<Object_Ie_Mutation_Response>;
  /** delete single row from the table: "object.ie" */
  delete_object_ie_by_pk?: Maybe<Object_Ie>;
  /** delete data from the table: "object.representation" */
  delete_object_representation?: Maybe<Object_Representation_Mutation_Response>;
  /** delete single row from the table: "object.representation" */
  delete_object_representation_by_pk?: Maybe<Object_Representation>;
  /** delete data from the table: "sync.audio" */
  delete_sync_audio?: Maybe<Sync_Audio_Mutation_Response>;
  /** delete single row from the table: "sync.audio" */
  delete_sync_audio_by_pk?: Maybe<Sync_Audio>;
  /** delete data from the table: "sync.film" */
  delete_sync_film?: Maybe<Sync_Film_Mutation_Response>;
  /** delete single row from the table: "sync.film" */
  delete_sync_film_by_pk?: Maybe<Sync_Film>;
  /** delete data from the table: "sync.video" */
  delete_sync_video?: Maybe<Sync_Video_Mutation_Response>;
  /** delete single row from the table: "sync.video" */
  delete_sync_video_by_pk?: Maybe<Sync_Video>;
  /** delete data from the table: "users.folder" */
  delete_users_folder?: Maybe<Users_Folder_Mutation_Response>;
  /** delete single row from the table: "users.folder" */
  delete_users_folder_by_pk?: Maybe<Users_Folder>;
  /** delete data from the table: "users.folder_ie" */
  delete_users_folder_ie?: Maybe<Users_Folder_Ie_Mutation_Response>;
  /** delete single row from the table: "users.folder_ie" */
  delete_users_folder_ie_by_pk?: Maybe<Users_Folder_Ie>;
  /** delete data from the table: "users.group" */
  delete_users_group?: Maybe<Users_Group_Mutation_Response>;
  /** delete single row from the table: "users.group" */
  delete_users_group_by_pk?: Maybe<Users_Group>;
  /** delete data from the table: "users.group_permission" */
  delete_users_group_permission?: Maybe<Users_Group_Permission_Mutation_Response>;
  /** delete single row from the table: "users.group_permission" */
  delete_users_group_permission_by_pk?: Maybe<Users_Group_Permission>;
  /** delete data from the table: "users.identity" */
  delete_users_identity?: Maybe<Users_Identity_Mutation_Response>;
  /** delete single row from the table: "users.identity" */
  delete_users_identity_by_pk?: Maybe<Users_Identity>;
  /** delete data from the table: "users.identity_provider" */
  delete_users_identity_provider?: Maybe<Users_Identity_Provider_Mutation_Response>;
  /** delete single row from the table: "users.identity_provider" */
  delete_users_identity_provider_by_pk?: Maybe<Users_Identity_Provider>;
  /** delete data from the table: "users.permission" */
  delete_users_permission?: Maybe<Users_Permission_Mutation_Response>;
  /** delete single row from the table: "users.permission" */
  delete_users_permission_by_pk?: Maybe<Users_Permission>;
  /** delete data from the table: "users.profile" */
  delete_users_profile?: Maybe<Users_Profile_Mutation_Response>;
  /** delete single row from the table: "users.profile" */
  delete_users_profile_by_pk?: Maybe<Users_Profile>;
  /** insert data into the table: "app.config" */
  insert_app_config?: Maybe<App_Config_Mutation_Response>;
  /** insert a single row into the table: "app.config" */
  insert_app_config_one?: Maybe<App_Config>;
  /** insert data into the table: "app.content_block" */
  insert_app_content_block?: Maybe<App_Content_Block_Mutation_Response>;
  /** insert a single row into the table: "app.content_block" */
  insert_app_content_block_one?: Maybe<App_Content_Block>;
  /** insert data into the table: "app.content_label" */
  insert_app_content_label?: Maybe<App_Content_Label_Mutation_Response>;
  /** insert a single row into the table: "app.content_label" */
  insert_app_content_label_one?: Maybe<App_Content_Label>;
  /** insert data into the table: "app.content_page" */
  insert_app_content_page?: Maybe<App_Content_Page_Mutation_Response>;
  /** insert data into the table: "app.content_page_content_label" */
  insert_app_content_page_content_label?: Maybe<App_Content_Page_Content_Label_Mutation_Response>;
  /** insert a single row into the table: "app.content_page_content_label" */
  insert_app_content_page_content_label_one?: Maybe<App_Content_Page_Content_Label>;
  /** insert a single row into the table: "app.content_page" */
  insert_app_content_page_one?: Maybe<App_Content_Page>;
  /** insert data into the table: "app.navigation" */
  insert_app_navigation?: Maybe<App_Navigation_Mutation_Response>;
  /** insert a single row into the table: "app.navigation" */
  insert_app_navigation_one?: Maybe<App_Navigation>;
  /** insert data into the table: "app.notification" */
  insert_app_notification?: Maybe<App_Notification_Mutation_Response>;
  /** insert a single row into the table: "app.notification" */
  insert_app_notification_one?: Maybe<App_Notification>;
  /** insert data into the table: "lookup.app_content_block_type" */
  insert_lookup_app_content_block_type?: Maybe<Lookup_App_Content_Block_Type_Mutation_Response>;
  /** insert a single row into the table: "lookup.app_content_block_type" */
  insert_lookup_app_content_block_type_one?: Maybe<Lookup_App_Content_Block_Type>;
  /** insert data into the table: "lookup.app_content_type" */
  insert_lookup_app_content_type?: Maybe<Lookup_App_Content_Type_Mutation_Response>;
  /** insert a single row into the table: "lookup.app_content_type" */
  insert_lookup_app_content_type_one?: Maybe<Lookup_App_Content_Type>;
  /** insert data into the table: "lookup.app_notification_type" */
  insert_lookup_app_notification_type?: Maybe<Lookup_App_Notification_Type_Mutation_Response>;
  /** insert a single row into the table: "lookup.app_notification_type" */
  insert_lookup_app_notification_type_one?: Maybe<Lookup_App_Notification_Type>;
  /** insert data into the table: "lookup.maintainer_visitor_space_request_status" */
  insert_lookup_maintainer_visitor_space_request_status?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Mutation_Response>;
  /** insert a single row into the table: "lookup.maintainer_visitor_space_request_status" */
  insert_lookup_maintainer_visitor_space_request_status_one?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status>;
  /** insert data into the table: "lookup.maintainer_visitor_space_status" */
  insert_lookup_maintainer_visitor_space_status?: Maybe<Lookup_Maintainer_Visitor_Space_Status_Mutation_Response>;
  /** insert a single row into the table: "lookup.maintainer_visitor_space_status" */
  insert_lookup_maintainer_visitor_space_status_one?: Maybe<Lookup_Maintainer_Visitor_Space_Status>;
  /** insert data into the table: "lookup.schema_audience_type" */
  insert_lookup_schema_audience_type?: Maybe<Lookup_Schema_Audience_Type_Mutation_Response>;
  /** insert a single row into the table: "lookup.schema_audience_type" */
  insert_lookup_schema_audience_type_one?: Maybe<Lookup_Schema_Audience_Type>;
  /** insert data into the table: "maintainer.content_partner" */
  insert_maintainer_content_partner?: Maybe<Maintainer_Content_Partner_Mutation_Response>;
  /** insert a single row into the table: "maintainer.content_partner" */
  insert_maintainer_content_partner_one?: Maybe<Maintainer_Content_Partner>;
  /** insert data into the table: "maintainer.index" */
  insert_maintainer_index?: Maybe<Maintainer_Index_Mutation_Response>;
  /** insert a single row into the table: "maintainer.index" */
  insert_maintainer_index_one?: Maybe<Maintainer_Index>;
  /** insert data into the table: "maintainer.organisation" */
  insert_maintainer_organisation?: Maybe<Maintainer_Organisation_Mutation_Response>;
  /** insert a single row into the table: "maintainer.organisation" */
  insert_maintainer_organisation_one?: Maybe<Maintainer_Organisation>;
  /** insert data into the table: "maintainer.users_profile" */
  insert_maintainer_users_profile?: Maybe<Maintainer_Users_Profile_Mutation_Response>;
  /** insert a single row into the table: "maintainer.users_profile" */
  insert_maintainer_users_profile_one?: Maybe<Maintainer_Users_Profile>;
  /** insert data into the table: "maintainer.visitor_space" */
  insert_maintainer_visitor_space?: Maybe<Maintainer_Visitor_Space_Mutation_Response>;
  /** insert a single row into the table: "maintainer.visitor_space" */
  insert_maintainer_visitor_space_one?: Maybe<Maintainer_Visitor_Space>;
  /** insert data into the table: "maintainer.visitor_space_request" */
  insert_maintainer_visitor_space_request?: Maybe<Maintainer_Visitor_Space_Request_Mutation_Response>;
  /** insert data into the table: "maintainer.visitor_space_request_note" */
  insert_maintainer_visitor_space_request_note?: Maybe<Maintainer_Visitor_Space_Request_Note_Mutation_Response>;
  /** insert a single row into the table: "maintainer.visitor_space_request_note" */
  insert_maintainer_visitor_space_request_note_one?: Maybe<Maintainer_Visitor_Space_Request_Note>;
  /** insert a single row into the table: "maintainer.visitor_space_request" */
  insert_maintainer_visitor_space_request_one?: Maybe<Maintainer_Visitor_Space_Request>;
  /** insert data into the table: "object.file" */
  insert_object_file?: Maybe<Object_File_Mutation_Response>;
  /** insert a single row into the table: "object.file" */
  insert_object_file_one?: Maybe<Object_File>;
  /** insert data into the table: "object.ie" */
  insert_object_ie?: Maybe<Object_Ie_Mutation_Response>;
  /** insert a single row into the table: "object.ie" */
  insert_object_ie_one?: Maybe<Object_Ie>;
  /** insert data into the table: "object.representation" */
  insert_object_representation?: Maybe<Object_Representation_Mutation_Response>;
  /** insert a single row into the table: "object.representation" */
  insert_object_representation_one?: Maybe<Object_Representation>;
  /** insert data into the table: "sync.audio" */
  insert_sync_audio?: Maybe<Sync_Audio_Mutation_Response>;
  /** insert a single row into the table: "sync.audio" */
  insert_sync_audio_one?: Maybe<Sync_Audio>;
  /** insert data into the table: "sync.film" */
  insert_sync_film?: Maybe<Sync_Film_Mutation_Response>;
  /** insert a single row into the table: "sync.film" */
  insert_sync_film_one?: Maybe<Sync_Film>;
  /** insert data into the table: "sync.video" */
  insert_sync_video?: Maybe<Sync_Video_Mutation_Response>;
  /** insert a single row into the table: "sync.video" */
  insert_sync_video_one?: Maybe<Sync_Video>;
  /** insert data into the table: "users.folder" */
  insert_users_folder?: Maybe<Users_Folder_Mutation_Response>;
  /** insert data into the table: "users.folder_ie" */
  insert_users_folder_ie?: Maybe<Users_Folder_Ie_Mutation_Response>;
  /** insert a single row into the table: "users.folder_ie" */
  insert_users_folder_ie_one?: Maybe<Users_Folder_Ie>;
  /** insert a single row into the table: "users.folder" */
  insert_users_folder_one?: Maybe<Users_Folder>;
  /** insert data into the table: "users.group" */
  insert_users_group?: Maybe<Users_Group_Mutation_Response>;
  /** insert a single row into the table: "users.group" */
  insert_users_group_one?: Maybe<Users_Group>;
  /** insert data into the table: "users.group_permission" */
  insert_users_group_permission?: Maybe<Users_Group_Permission_Mutation_Response>;
  /** insert a single row into the table: "users.group_permission" */
  insert_users_group_permission_one?: Maybe<Users_Group_Permission>;
  /** insert data into the table: "users.identity" */
  insert_users_identity?: Maybe<Users_Identity_Mutation_Response>;
  /** insert a single row into the table: "users.identity" */
  insert_users_identity_one?: Maybe<Users_Identity>;
  /** insert data into the table: "users.identity_provider" */
  insert_users_identity_provider?: Maybe<Users_Identity_Provider_Mutation_Response>;
  /** insert a single row into the table: "users.identity_provider" */
  insert_users_identity_provider_one?: Maybe<Users_Identity_Provider>;
  /** insert data into the table: "users.permission" */
  insert_users_permission?: Maybe<Users_Permission_Mutation_Response>;
  /** insert a single row into the table: "users.permission" */
  insert_users_permission_one?: Maybe<Users_Permission>;
  /** insert data into the table: "users.profile" */
  insert_users_profile?: Maybe<Users_Profile_Mutation_Response>;
  /** insert a single row into the table: "users.profile" */
  insert_users_profile_one?: Maybe<Users_Profile>;
  /** update data of the table: "app.config" */
  update_app_config?: Maybe<App_Config_Mutation_Response>;
  /** update single row of the table: "app.config" */
  update_app_config_by_pk?: Maybe<App_Config>;
  /** update data of the table: "app.content_block" */
  update_app_content_block?: Maybe<App_Content_Block_Mutation_Response>;
  /** update single row of the table: "app.content_block" */
  update_app_content_block_by_pk?: Maybe<App_Content_Block>;
  /** update data of the table: "app.content_label" */
  update_app_content_label?: Maybe<App_Content_Label_Mutation_Response>;
  /** update single row of the table: "app.content_label" */
  update_app_content_label_by_pk?: Maybe<App_Content_Label>;
  /** update data of the table: "app.content_page" */
  update_app_content_page?: Maybe<App_Content_Page_Mutation_Response>;
  /** update single row of the table: "app.content_page" */
  update_app_content_page_by_pk?: Maybe<App_Content_Page>;
  /** update data of the table: "app.content_page_content_label" */
  update_app_content_page_content_label?: Maybe<App_Content_Page_Content_Label_Mutation_Response>;
  /** update single row of the table: "app.content_page_content_label" */
  update_app_content_page_content_label_by_pk?: Maybe<App_Content_Page_Content_Label>;
  /** update data of the table: "app.navigation" */
  update_app_navigation?: Maybe<App_Navigation_Mutation_Response>;
  /** update single row of the table: "app.navigation" */
  update_app_navigation_by_pk?: Maybe<App_Navigation>;
  /** update data of the table: "app.notification" */
  update_app_notification?: Maybe<App_Notification_Mutation_Response>;
  /** update single row of the table: "app.notification" */
  update_app_notification_by_pk?: Maybe<App_Notification>;
  /** update data of the table: "lookup.app_content_block_type" */
  update_lookup_app_content_block_type?: Maybe<Lookup_App_Content_Block_Type_Mutation_Response>;
  /** update single row of the table: "lookup.app_content_block_type" */
  update_lookup_app_content_block_type_by_pk?: Maybe<Lookup_App_Content_Block_Type>;
  /** update data of the table: "lookup.app_content_type" */
  update_lookup_app_content_type?: Maybe<Lookup_App_Content_Type_Mutation_Response>;
  /** update single row of the table: "lookup.app_content_type" */
  update_lookup_app_content_type_by_pk?: Maybe<Lookup_App_Content_Type>;
  /** update data of the table: "lookup.app_notification_type" */
  update_lookup_app_notification_type?: Maybe<Lookup_App_Notification_Type_Mutation_Response>;
  /** update single row of the table: "lookup.app_notification_type" */
  update_lookup_app_notification_type_by_pk?: Maybe<Lookup_App_Notification_Type>;
  /** update data of the table: "lookup.maintainer_visitor_space_request_status" */
  update_lookup_maintainer_visitor_space_request_status?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status_Mutation_Response>;
  /** update single row of the table: "lookup.maintainer_visitor_space_request_status" */
  update_lookup_maintainer_visitor_space_request_status_by_pk?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status>;
  /** update data of the table: "lookup.maintainer_visitor_space_status" */
  update_lookup_maintainer_visitor_space_status?: Maybe<Lookup_Maintainer_Visitor_Space_Status_Mutation_Response>;
  /** update single row of the table: "lookup.maintainer_visitor_space_status" */
  update_lookup_maintainer_visitor_space_status_by_pk?: Maybe<Lookup_Maintainer_Visitor_Space_Status>;
  /** update data of the table: "lookup.schema_audience_type" */
  update_lookup_schema_audience_type?: Maybe<Lookup_Schema_Audience_Type_Mutation_Response>;
  /** update single row of the table: "lookup.schema_audience_type" */
  update_lookup_schema_audience_type_by_pk?: Maybe<Lookup_Schema_Audience_Type>;
  /** update data of the table: "maintainer.content_partner" */
  update_maintainer_content_partner?: Maybe<Maintainer_Content_Partner_Mutation_Response>;
  /** update single row of the table: "maintainer.content_partner" */
  update_maintainer_content_partner_by_pk?: Maybe<Maintainer_Content_Partner>;
  /** update data of the table: "maintainer.index" */
  update_maintainer_index?: Maybe<Maintainer_Index_Mutation_Response>;
  /** update single row of the table: "maintainer.index" */
  update_maintainer_index_by_pk?: Maybe<Maintainer_Index>;
  /** update data of the table: "maintainer.organisation" */
  update_maintainer_organisation?: Maybe<Maintainer_Organisation_Mutation_Response>;
  /** update single row of the table: "maintainer.organisation" */
  update_maintainer_organisation_by_pk?: Maybe<Maintainer_Organisation>;
  /** update data of the table: "maintainer.users_profile" */
  update_maintainer_users_profile?: Maybe<Maintainer_Users_Profile_Mutation_Response>;
  /** update single row of the table: "maintainer.users_profile" */
  update_maintainer_users_profile_by_pk?: Maybe<Maintainer_Users_Profile>;
  /** update data of the table: "maintainer.visitor_space" */
  update_maintainer_visitor_space?: Maybe<Maintainer_Visitor_Space_Mutation_Response>;
  /** update single row of the table: "maintainer.visitor_space" */
  update_maintainer_visitor_space_by_pk?: Maybe<Maintainer_Visitor_Space>;
  /** update data of the table: "maintainer.visitor_space_request" */
  update_maintainer_visitor_space_request?: Maybe<Maintainer_Visitor_Space_Request_Mutation_Response>;
  /** update single row of the table: "maintainer.visitor_space_request" */
  update_maintainer_visitor_space_request_by_pk?: Maybe<Maintainer_Visitor_Space_Request>;
  /** update data of the table: "maintainer.visitor_space_request_note" */
  update_maintainer_visitor_space_request_note?: Maybe<Maintainer_Visitor_Space_Request_Note_Mutation_Response>;
  /** update single row of the table: "maintainer.visitor_space_request_note" */
  update_maintainer_visitor_space_request_note_by_pk?: Maybe<Maintainer_Visitor_Space_Request_Note>;
  /** update data of the table: "object.file" */
  update_object_file?: Maybe<Object_File_Mutation_Response>;
  /** update single row of the table: "object.file" */
  update_object_file_by_pk?: Maybe<Object_File>;
  /** update data of the table: "object.ie" */
  update_object_ie?: Maybe<Object_Ie_Mutation_Response>;
  /** update single row of the table: "object.ie" */
  update_object_ie_by_pk?: Maybe<Object_Ie>;
  /** update data of the table: "object.representation" */
  update_object_representation?: Maybe<Object_Representation_Mutation_Response>;
  /** update single row of the table: "object.representation" */
  update_object_representation_by_pk?: Maybe<Object_Representation>;
  /** update data of the table: "sync.audio" */
  update_sync_audio?: Maybe<Sync_Audio_Mutation_Response>;
  /** update single row of the table: "sync.audio" */
  update_sync_audio_by_pk?: Maybe<Sync_Audio>;
  /** update data of the table: "sync.film" */
  update_sync_film?: Maybe<Sync_Film_Mutation_Response>;
  /** update single row of the table: "sync.film" */
  update_sync_film_by_pk?: Maybe<Sync_Film>;
  /** update data of the table: "sync.video" */
  update_sync_video?: Maybe<Sync_Video_Mutation_Response>;
  /** update single row of the table: "sync.video" */
  update_sync_video_by_pk?: Maybe<Sync_Video>;
  /** update data of the table: "users.folder" */
  update_users_folder?: Maybe<Users_Folder_Mutation_Response>;
  /** update single row of the table: "users.folder" */
  update_users_folder_by_pk?: Maybe<Users_Folder>;
  /** update data of the table: "users.folder_ie" */
  update_users_folder_ie?: Maybe<Users_Folder_Ie_Mutation_Response>;
  /** update single row of the table: "users.folder_ie" */
  update_users_folder_ie_by_pk?: Maybe<Users_Folder_Ie>;
  /** update data of the table: "users.group" */
  update_users_group?: Maybe<Users_Group_Mutation_Response>;
  /** update single row of the table: "users.group" */
  update_users_group_by_pk?: Maybe<Users_Group>;
  /** update data of the table: "users.group_permission" */
  update_users_group_permission?: Maybe<Users_Group_Permission_Mutation_Response>;
  /** update single row of the table: "users.group_permission" */
  update_users_group_permission_by_pk?: Maybe<Users_Group_Permission>;
  /** update data of the table: "users.identity" */
  update_users_identity?: Maybe<Users_Identity_Mutation_Response>;
  /** update single row of the table: "users.identity" */
  update_users_identity_by_pk?: Maybe<Users_Identity>;
  /** update data of the table: "users.identity_provider" */
  update_users_identity_provider?: Maybe<Users_Identity_Provider_Mutation_Response>;
  /** update single row of the table: "users.identity_provider" */
  update_users_identity_provider_by_pk?: Maybe<Users_Identity_Provider>;
  /** update data of the table: "users.permission" */
  update_users_permission?: Maybe<Users_Permission_Mutation_Response>;
  /** update single row of the table: "users.permission" */
  update_users_permission_by_pk?: Maybe<Users_Permission>;
  /** update data of the table: "users.profile" */
  update_users_profile?: Maybe<Users_Profile_Mutation_Response>;
  /** update single row of the table: "users.profile" */
  update_users_profile_by_pk?: Maybe<Users_Profile>;
};


/** mutation root */
export type Mutation_RootDelete_App_ConfigArgs = {
  where: App_Config_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_App_Config_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_App_Content_BlockArgs = {
  where: App_Content_Block_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_App_Content_Block_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_App_Content_LabelArgs = {
  where: App_Content_Label_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_App_Content_Label_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_App_Content_PageArgs = {
  where: App_Content_Page_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_App_Content_Page_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_App_Content_Page_Content_LabelArgs = {
  where: App_Content_Page_Content_Label_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_App_Content_Page_Content_Label_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_App_NavigationArgs = {
  where: App_Navigation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_App_Navigation_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_App_NotificationArgs = {
  where: App_Notification_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_App_Notification_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_App_Content_Block_TypeArgs = {
  where: Lookup_App_Content_Block_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_App_Content_Block_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_App_Content_TypeArgs = {
  where: Lookup_App_Content_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_App_Content_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_App_Notification_TypeArgs = {
  where: Lookup_App_Notification_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_App_Notification_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Maintainer_Visitor_Space_Request_StatusArgs = {
  where: Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Maintainer_Visitor_Space_Request_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Maintainer_Visitor_Space_StatusArgs = {
  where: Lookup_Maintainer_Visitor_Space_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Maintainer_Visitor_Space_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Schema_Audience_TypeArgs = {
  where: Lookup_Schema_Audience_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Schema_Audience_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Content_PartnerArgs = {
  where: Maintainer_Content_Partner_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Content_Partner_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_IndexArgs = {
  where: Maintainer_Index_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Index_By_PkArgs = {
  schema_maintainer_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_OrganisationArgs = {
  where: Maintainer_Organisation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Organisation_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Users_ProfileArgs = {
  where: Maintainer_Users_Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Users_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Visitor_SpaceArgs = {
  where: Maintainer_Visitor_Space_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Visitor_Space_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Visitor_Space_RequestArgs = {
  where: Maintainer_Visitor_Space_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Visitor_Space_Request_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Visitor_Space_Request_NoteArgs = {
  where: Maintainer_Visitor_Space_Request_Note_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Maintainer_Visitor_Space_Request_Note_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Object_FileArgs = {
  where: Object_File_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Object_File_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Object_IeArgs = {
  where: Object_Ie_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Object_Ie_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Object_RepresentationArgs = {
  where: Object_Representation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Object_Representation_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Sync_AudioArgs = {
  where: Sync_Audio_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Sync_Audio_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Sync_FilmArgs = {
  where: Sync_Film_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Sync_Film_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Sync_VideoArgs = {
  where: Sync_Video_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Sync_Video_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Users_FolderArgs = {
  where: Users_Folder_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Folder_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_Folder_IeArgs = {
  where: Users_Folder_Ie_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Folder_Ie_By_PkArgs = {
  ie_schema_identifier: Scalars['String'];
  user_collection_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_GroupArgs = {
  where: Users_Group_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_Group_PermissionArgs = {
  where: Users_Group_Permission_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Group_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_IdentityArgs = {
  where: Users_Identity_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Identity_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_Identity_ProviderArgs = {
  where: Users_Identity_Provider_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Identity_Provider_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Users_PermissionArgs = {
  where: Users_Permission_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_ProfileArgs = {
  where: Users_Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_App_ConfigArgs = {
  objects: Array<App_Config_Insert_Input>;
  on_conflict?: InputMaybe<App_Config_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Config_OneArgs = {
  object: App_Config_Insert_Input;
  on_conflict?: InputMaybe<App_Config_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Content_BlockArgs = {
  objects: Array<App_Content_Block_Insert_Input>;
  on_conflict?: InputMaybe<App_Content_Block_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Content_Block_OneArgs = {
  object: App_Content_Block_Insert_Input;
  on_conflict?: InputMaybe<App_Content_Block_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Content_LabelArgs = {
  objects: Array<App_Content_Label_Insert_Input>;
  on_conflict?: InputMaybe<App_Content_Label_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Content_Label_OneArgs = {
  object: App_Content_Label_Insert_Input;
  on_conflict?: InputMaybe<App_Content_Label_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Content_PageArgs = {
  objects: Array<App_Content_Page_Insert_Input>;
  on_conflict?: InputMaybe<App_Content_Page_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Content_Page_Content_LabelArgs = {
  objects: Array<App_Content_Page_Content_Label_Insert_Input>;
  on_conflict?: InputMaybe<App_Content_Page_Content_Label_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Content_Page_Content_Label_OneArgs = {
  object: App_Content_Page_Content_Label_Insert_Input;
  on_conflict?: InputMaybe<App_Content_Page_Content_Label_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Content_Page_OneArgs = {
  object: App_Content_Page_Insert_Input;
  on_conflict?: InputMaybe<App_Content_Page_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_NavigationArgs = {
  objects: Array<App_Navigation_Insert_Input>;
  on_conflict?: InputMaybe<App_Navigation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Navigation_OneArgs = {
  object: App_Navigation_Insert_Input;
  on_conflict?: InputMaybe<App_Navigation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_NotificationArgs = {
  objects: Array<App_Notification_Insert_Input>;
  on_conflict?: InputMaybe<App_Notification_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Notification_OneArgs = {
  object: App_Notification_Insert_Input;
  on_conflict?: InputMaybe<App_Notification_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_App_Content_Block_TypeArgs = {
  objects: Array<Lookup_App_Content_Block_Type_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_App_Content_Block_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_App_Content_Block_Type_OneArgs = {
  object: Lookup_App_Content_Block_Type_Insert_Input;
  on_conflict?: InputMaybe<Lookup_App_Content_Block_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_App_Content_TypeArgs = {
  objects: Array<Lookup_App_Content_Type_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_App_Content_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_App_Content_Type_OneArgs = {
  object: Lookup_App_Content_Type_Insert_Input;
  on_conflict?: InputMaybe<Lookup_App_Content_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_App_Notification_TypeArgs = {
  objects: Array<Lookup_App_Notification_Type_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_App_Notification_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_App_Notification_Type_OneArgs = {
  object: Lookup_App_Notification_Type_Insert_Input;
  on_conflict?: InputMaybe<Lookup_App_Notification_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Maintainer_Visitor_Space_Request_StatusArgs = {
  objects: Array<Lookup_Maintainer_Visitor_Space_Request_Status_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Maintainer_Visitor_Space_Request_Status_OneArgs = {
  object: Lookup_Maintainer_Visitor_Space_Request_Status_Insert_Input;
  on_conflict?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Maintainer_Visitor_Space_StatusArgs = {
  objects: Array<Lookup_Maintainer_Visitor_Space_Status_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Maintainer_Visitor_Space_Status_OneArgs = {
  object: Lookup_Maintainer_Visitor_Space_Status_Insert_Input;
  on_conflict?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Schema_Audience_TypeArgs = {
  objects: Array<Lookup_Schema_Audience_Type_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_Schema_Audience_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Schema_Audience_Type_OneArgs = {
  object: Lookup_Schema_Audience_Type_Insert_Input;
  on_conflict?: InputMaybe<Lookup_Schema_Audience_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Content_PartnerArgs = {
  objects: Array<Maintainer_Content_Partner_Insert_Input>;
  on_conflict?: InputMaybe<Maintainer_Content_Partner_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Content_Partner_OneArgs = {
  object: Maintainer_Content_Partner_Insert_Input;
  on_conflict?: InputMaybe<Maintainer_Content_Partner_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_IndexArgs = {
  objects: Array<Maintainer_Index_Insert_Input>;
  on_conflict?: InputMaybe<Maintainer_Index_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Index_OneArgs = {
  object: Maintainer_Index_Insert_Input;
  on_conflict?: InputMaybe<Maintainer_Index_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_OrganisationArgs = {
  objects: Array<Maintainer_Organisation_Insert_Input>;
  on_conflict?: InputMaybe<Maintainer_Organisation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Organisation_OneArgs = {
  object: Maintainer_Organisation_Insert_Input;
  on_conflict?: InputMaybe<Maintainer_Organisation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Users_ProfileArgs = {
  objects: Array<Maintainer_Users_Profile_Insert_Input>;
  on_conflict?: InputMaybe<Maintainer_Users_Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Users_Profile_OneArgs = {
  object: Maintainer_Users_Profile_Insert_Input;
  on_conflict?: InputMaybe<Maintainer_Users_Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Visitor_SpaceArgs = {
  objects: Array<Maintainer_Visitor_Space_Insert_Input>;
  on_conflict?: InputMaybe<Maintainer_Visitor_Space_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Visitor_Space_OneArgs = {
  object: Maintainer_Visitor_Space_Insert_Input;
  on_conflict?: InputMaybe<Maintainer_Visitor_Space_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Visitor_Space_RequestArgs = {
  objects: Array<Maintainer_Visitor_Space_Request_Insert_Input>;
  on_conflict?: InputMaybe<Maintainer_Visitor_Space_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Visitor_Space_Request_NoteArgs = {
  objects: Array<Maintainer_Visitor_Space_Request_Note_Insert_Input>;
  on_conflict?: InputMaybe<Maintainer_Visitor_Space_Request_Note_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Visitor_Space_Request_Note_OneArgs = {
  object: Maintainer_Visitor_Space_Request_Note_Insert_Input;
  on_conflict?: InputMaybe<Maintainer_Visitor_Space_Request_Note_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Maintainer_Visitor_Space_Request_OneArgs = {
  object: Maintainer_Visitor_Space_Request_Insert_Input;
  on_conflict?: InputMaybe<Maintainer_Visitor_Space_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_FileArgs = {
  objects: Array<Object_File_Insert_Input>;
  on_conflict?: InputMaybe<Object_File_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_File_OneArgs = {
  object: Object_File_Insert_Input;
  on_conflict?: InputMaybe<Object_File_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_IeArgs = {
  objects: Array<Object_Ie_Insert_Input>;
  on_conflict?: InputMaybe<Object_Ie_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_Ie_OneArgs = {
  object: Object_Ie_Insert_Input;
  on_conflict?: InputMaybe<Object_Ie_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_RepresentationArgs = {
  objects: Array<Object_Representation_Insert_Input>;
  on_conflict?: InputMaybe<Object_Representation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_Representation_OneArgs = {
  object: Object_Representation_Insert_Input;
  on_conflict?: InputMaybe<Object_Representation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_AudioArgs = {
  objects: Array<Sync_Audio_Insert_Input>;
  on_conflict?: InputMaybe<Sync_Audio_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_Audio_OneArgs = {
  object: Sync_Audio_Insert_Input;
  on_conflict?: InputMaybe<Sync_Audio_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_FilmArgs = {
  objects: Array<Sync_Film_Insert_Input>;
  on_conflict?: InputMaybe<Sync_Film_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_Film_OneArgs = {
  object: Sync_Film_Insert_Input;
  on_conflict?: InputMaybe<Sync_Film_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_VideoArgs = {
  objects: Array<Sync_Video_Insert_Input>;
  on_conflict?: InputMaybe<Sync_Video_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_Video_OneArgs = {
  object: Sync_Video_Insert_Input;
  on_conflict?: InputMaybe<Sync_Video_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_FolderArgs = {
  objects: Array<Users_Folder_Insert_Input>;
  on_conflict?: InputMaybe<Users_Folder_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Folder_IeArgs = {
  objects: Array<Users_Folder_Ie_Insert_Input>;
  on_conflict?: InputMaybe<Users_Folder_Ie_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Folder_Ie_OneArgs = {
  object: Users_Folder_Ie_Insert_Input;
  on_conflict?: InputMaybe<Users_Folder_Ie_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Folder_OneArgs = {
  object: Users_Folder_Insert_Input;
  on_conflict?: InputMaybe<Users_Folder_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_GroupArgs = {
  objects: Array<Users_Group_Insert_Input>;
  on_conflict?: InputMaybe<Users_Group_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Group_OneArgs = {
  object: Users_Group_Insert_Input;
  on_conflict?: InputMaybe<Users_Group_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Group_PermissionArgs = {
  objects: Array<Users_Group_Permission_Insert_Input>;
  on_conflict?: InputMaybe<Users_Group_Permission_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Group_Permission_OneArgs = {
  object: Users_Group_Permission_Insert_Input;
  on_conflict?: InputMaybe<Users_Group_Permission_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_IdentityArgs = {
  objects: Array<Users_Identity_Insert_Input>;
  on_conflict?: InputMaybe<Users_Identity_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Identity_OneArgs = {
  object: Users_Identity_Insert_Input;
  on_conflict?: InputMaybe<Users_Identity_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Identity_ProviderArgs = {
  objects: Array<Users_Identity_Provider_Insert_Input>;
  on_conflict?: InputMaybe<Users_Identity_Provider_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Identity_Provider_OneArgs = {
  object: Users_Identity_Provider_Insert_Input;
  on_conflict?: InputMaybe<Users_Identity_Provider_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_PermissionArgs = {
  objects: Array<Users_Permission_Insert_Input>;
  on_conflict?: InputMaybe<Users_Permission_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Permission_OneArgs = {
  object: Users_Permission_Insert_Input;
  on_conflict?: InputMaybe<Users_Permission_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_ProfileArgs = {
  objects: Array<Users_Profile_Insert_Input>;
  on_conflict?: InputMaybe<Users_Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Profile_OneArgs = {
  object: Users_Profile_Insert_Input;
  on_conflict?: InputMaybe<Users_Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_App_ConfigArgs = {
  _append?: InputMaybe<App_Config_Append_Input>;
  _delete_at_path?: InputMaybe<App_Config_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Config_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Config_Delete_Key_Input>;
  _prepend?: InputMaybe<App_Config_Prepend_Input>;
  _set?: InputMaybe<App_Config_Set_Input>;
  where: App_Config_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_App_Config_By_PkArgs = {
  _append?: InputMaybe<App_Config_Append_Input>;
  _delete_at_path?: InputMaybe<App_Config_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Config_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Config_Delete_Key_Input>;
  _prepend?: InputMaybe<App_Config_Prepend_Input>;
  _set?: InputMaybe<App_Config_Set_Input>;
  pk_columns: App_Config_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_App_Content_BlockArgs = {
  _append?: InputMaybe<App_Content_Block_Append_Input>;
  _delete_at_path?: InputMaybe<App_Content_Block_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Content_Block_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Content_Block_Delete_Key_Input>;
  _inc?: InputMaybe<App_Content_Block_Inc_Input>;
  _prepend?: InputMaybe<App_Content_Block_Prepend_Input>;
  _set?: InputMaybe<App_Content_Block_Set_Input>;
  where: App_Content_Block_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_App_Content_Block_By_PkArgs = {
  _append?: InputMaybe<App_Content_Block_Append_Input>;
  _delete_at_path?: InputMaybe<App_Content_Block_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Content_Block_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Content_Block_Delete_Key_Input>;
  _inc?: InputMaybe<App_Content_Block_Inc_Input>;
  _prepend?: InputMaybe<App_Content_Block_Prepend_Input>;
  _set?: InputMaybe<App_Content_Block_Set_Input>;
  pk_columns: App_Content_Block_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_App_Content_LabelArgs = {
  _append?: InputMaybe<App_Content_Label_Append_Input>;
  _delete_at_path?: InputMaybe<App_Content_Label_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Content_Label_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Content_Label_Delete_Key_Input>;
  _prepend?: InputMaybe<App_Content_Label_Prepend_Input>;
  _set?: InputMaybe<App_Content_Label_Set_Input>;
  where: App_Content_Label_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_App_Content_Label_By_PkArgs = {
  _append?: InputMaybe<App_Content_Label_Append_Input>;
  _delete_at_path?: InputMaybe<App_Content_Label_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Content_Label_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Content_Label_Delete_Key_Input>;
  _prepend?: InputMaybe<App_Content_Label_Prepend_Input>;
  _set?: InputMaybe<App_Content_Label_Set_Input>;
  pk_columns: App_Content_Label_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_App_Content_PageArgs = {
  _append?: InputMaybe<App_Content_Page_Append_Input>;
  _delete_at_path?: InputMaybe<App_Content_Page_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Content_Page_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Content_Page_Delete_Key_Input>;
  _prepend?: InputMaybe<App_Content_Page_Prepend_Input>;
  _set?: InputMaybe<App_Content_Page_Set_Input>;
  where: App_Content_Page_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_App_Content_Page_By_PkArgs = {
  _append?: InputMaybe<App_Content_Page_Append_Input>;
  _delete_at_path?: InputMaybe<App_Content_Page_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Content_Page_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Content_Page_Delete_Key_Input>;
  _prepend?: InputMaybe<App_Content_Page_Prepend_Input>;
  _set?: InputMaybe<App_Content_Page_Set_Input>;
  pk_columns: App_Content_Page_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_App_Content_Page_Content_LabelArgs = {
  _set?: InputMaybe<App_Content_Page_Content_Label_Set_Input>;
  where: App_Content_Page_Content_Label_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_App_Content_Page_Content_Label_By_PkArgs = {
  _set?: InputMaybe<App_Content_Page_Content_Label_Set_Input>;
  pk_columns: App_Content_Page_Content_Label_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_App_NavigationArgs = {
  _append?: InputMaybe<App_Navigation_Append_Input>;
  _delete_at_path?: InputMaybe<App_Navigation_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Navigation_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Navigation_Delete_Key_Input>;
  _inc?: InputMaybe<App_Navigation_Inc_Input>;
  _prepend?: InputMaybe<App_Navigation_Prepend_Input>;
  _set?: InputMaybe<App_Navigation_Set_Input>;
  where: App_Navigation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_App_Navigation_By_PkArgs = {
  _append?: InputMaybe<App_Navigation_Append_Input>;
  _delete_at_path?: InputMaybe<App_Navigation_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<App_Navigation_Delete_Elem_Input>;
  _delete_key?: InputMaybe<App_Navigation_Delete_Key_Input>;
  _inc?: InputMaybe<App_Navigation_Inc_Input>;
  _prepend?: InputMaybe<App_Navigation_Prepend_Input>;
  _set?: InputMaybe<App_Navigation_Set_Input>;
  pk_columns: App_Navigation_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_App_NotificationArgs = {
  _set?: InputMaybe<App_Notification_Set_Input>;
  where: App_Notification_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_App_Notification_By_PkArgs = {
  _set?: InputMaybe<App_Notification_Set_Input>;
  pk_columns: App_Notification_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_App_Content_Block_TypeArgs = {
  _set?: InputMaybe<Lookup_App_Content_Block_Type_Set_Input>;
  where: Lookup_App_Content_Block_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_App_Content_Block_Type_By_PkArgs = {
  _set?: InputMaybe<Lookup_App_Content_Block_Type_Set_Input>;
  pk_columns: Lookup_App_Content_Block_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_App_Content_TypeArgs = {
  _set?: InputMaybe<Lookup_App_Content_Type_Set_Input>;
  where: Lookup_App_Content_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_App_Content_Type_By_PkArgs = {
  _set?: InputMaybe<Lookup_App_Content_Type_Set_Input>;
  pk_columns: Lookup_App_Content_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_App_Notification_TypeArgs = {
  _set?: InputMaybe<Lookup_App_Notification_Type_Set_Input>;
  where: Lookup_App_Notification_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_App_Notification_Type_By_PkArgs = {
  _set?: InputMaybe<Lookup_App_Notification_Type_Set_Input>;
  pk_columns: Lookup_App_Notification_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Maintainer_Visitor_Space_Request_StatusArgs = {
  _inc?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Inc_Input>;
  _set?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Set_Input>;
  where: Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Maintainer_Visitor_Space_Request_Status_By_PkArgs = {
  _inc?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Inc_Input>;
  _set?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Set_Input>;
  pk_columns: Lookup_Maintainer_Visitor_Space_Request_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Maintainer_Visitor_Space_StatusArgs = {
  _set?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Set_Input>;
  where: Lookup_Maintainer_Visitor_Space_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Maintainer_Visitor_Space_Status_By_PkArgs = {
  _set?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Set_Input>;
  pk_columns: Lookup_Maintainer_Visitor_Space_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Schema_Audience_TypeArgs = {
  _set?: InputMaybe<Lookup_Schema_Audience_Type_Set_Input>;
  where: Lookup_Schema_Audience_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Schema_Audience_Type_By_PkArgs = {
  _set?: InputMaybe<Lookup_Schema_Audience_Type_Set_Input>;
  pk_columns: Lookup_Schema_Audience_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Content_PartnerArgs = {
  _set?: InputMaybe<Maintainer_Content_Partner_Set_Input>;
  where: Maintainer_Content_Partner_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Content_Partner_By_PkArgs = {
  _set?: InputMaybe<Maintainer_Content_Partner_Set_Input>;
  pk_columns: Maintainer_Content_Partner_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_IndexArgs = {
  _set?: InputMaybe<Maintainer_Index_Set_Input>;
  where: Maintainer_Index_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Index_By_PkArgs = {
  _set?: InputMaybe<Maintainer_Index_Set_Input>;
  pk_columns: Maintainer_Index_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_OrganisationArgs = {
  _append?: InputMaybe<Maintainer_Organisation_Append_Input>;
  _delete_at_path?: InputMaybe<Maintainer_Organisation_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Maintainer_Organisation_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Maintainer_Organisation_Delete_Key_Input>;
  _prepend?: InputMaybe<Maintainer_Organisation_Prepend_Input>;
  _set?: InputMaybe<Maintainer_Organisation_Set_Input>;
  where: Maintainer_Organisation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Organisation_By_PkArgs = {
  _append?: InputMaybe<Maintainer_Organisation_Append_Input>;
  _delete_at_path?: InputMaybe<Maintainer_Organisation_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Maintainer_Organisation_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Maintainer_Organisation_Delete_Key_Input>;
  _prepend?: InputMaybe<Maintainer_Organisation_Prepend_Input>;
  _set?: InputMaybe<Maintainer_Organisation_Set_Input>;
  pk_columns: Maintainer_Organisation_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Users_ProfileArgs = {
  _set?: InputMaybe<Maintainer_Users_Profile_Set_Input>;
  where: Maintainer_Users_Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Users_Profile_By_PkArgs = {
  _set?: InputMaybe<Maintainer_Users_Profile_Set_Input>;
  pk_columns: Maintainer_Users_Profile_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Visitor_SpaceArgs = {
  _set?: InputMaybe<Maintainer_Visitor_Space_Set_Input>;
  where: Maintainer_Visitor_Space_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Visitor_Space_By_PkArgs = {
  _set?: InputMaybe<Maintainer_Visitor_Space_Set_Input>;
  pk_columns: Maintainer_Visitor_Space_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Visitor_Space_RequestArgs = {
  _set?: InputMaybe<Maintainer_Visitor_Space_Request_Set_Input>;
  where: Maintainer_Visitor_Space_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Visitor_Space_Request_By_PkArgs = {
  _set?: InputMaybe<Maintainer_Visitor_Space_Request_Set_Input>;
  pk_columns: Maintainer_Visitor_Space_Request_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Visitor_Space_Request_NoteArgs = {
  _set?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Set_Input>;
  where: Maintainer_Visitor_Space_Request_Note_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Maintainer_Visitor_Space_Request_Note_By_PkArgs = {
  _set?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Set_Input>;
  pk_columns: Maintainer_Visitor_Space_Request_Note_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Object_FileArgs = {
  _set?: InputMaybe<Object_File_Set_Input>;
  where: Object_File_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Object_File_By_PkArgs = {
  _set?: InputMaybe<Object_File_Set_Input>;
  pk_columns: Object_File_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Object_IeArgs = {
  _append?: InputMaybe<Object_Ie_Append_Input>;
  _delete_at_path?: InputMaybe<Object_Ie_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Object_Ie_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Object_Ie_Delete_Key_Input>;
  _inc?: InputMaybe<Object_Ie_Inc_Input>;
  _prepend?: InputMaybe<Object_Ie_Prepend_Input>;
  _set?: InputMaybe<Object_Ie_Set_Input>;
  where: Object_Ie_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Object_Ie_By_PkArgs = {
  _append?: InputMaybe<Object_Ie_Append_Input>;
  _delete_at_path?: InputMaybe<Object_Ie_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Object_Ie_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Object_Ie_Delete_Key_Input>;
  _inc?: InputMaybe<Object_Ie_Inc_Input>;
  _prepend?: InputMaybe<Object_Ie_Prepend_Input>;
  _set?: InputMaybe<Object_Ie_Set_Input>;
  pk_columns: Object_Ie_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Object_RepresentationArgs = {
  _set?: InputMaybe<Object_Representation_Set_Input>;
  where: Object_Representation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Object_Representation_By_PkArgs = {
  _set?: InputMaybe<Object_Representation_Set_Input>;
  pk_columns: Object_Representation_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_AudioArgs = {
  _append?: InputMaybe<Sync_Audio_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Audio_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Audio_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Audio_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Audio_Prepend_Input>;
  _set?: InputMaybe<Sync_Audio_Set_Input>;
  where: Sync_Audio_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_Audio_By_PkArgs = {
  _append?: InputMaybe<Sync_Audio_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Audio_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Audio_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Audio_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Audio_Prepend_Input>;
  _set?: InputMaybe<Sync_Audio_Set_Input>;
  pk_columns: Sync_Audio_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_FilmArgs = {
  _append?: InputMaybe<Sync_Film_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Film_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Film_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Film_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Film_Prepend_Input>;
  _set?: InputMaybe<Sync_Film_Set_Input>;
  where: Sync_Film_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_Film_By_PkArgs = {
  _append?: InputMaybe<Sync_Film_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Film_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Film_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Film_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Film_Prepend_Input>;
  _set?: InputMaybe<Sync_Film_Set_Input>;
  pk_columns: Sync_Film_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_VideoArgs = {
  _append?: InputMaybe<Sync_Video_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Video_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Video_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Video_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Video_Prepend_Input>;
  _set?: InputMaybe<Sync_Video_Set_Input>;
  where: Sync_Video_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_Video_By_PkArgs = {
  _append?: InputMaybe<Sync_Video_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Video_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Video_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Video_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Video_Prepend_Input>;
  _set?: InputMaybe<Sync_Video_Set_Input>;
  pk_columns: Sync_Video_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_FolderArgs = {
  _set?: InputMaybe<Users_Folder_Set_Input>;
  where: Users_Folder_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Folder_By_PkArgs = {
  _set?: InputMaybe<Users_Folder_Set_Input>;
  pk_columns: Users_Folder_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Folder_IeArgs = {
  _set?: InputMaybe<Users_Folder_Ie_Set_Input>;
  where: Users_Folder_Ie_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Folder_Ie_By_PkArgs = {
  _set?: InputMaybe<Users_Folder_Ie_Set_Input>;
  pk_columns: Users_Folder_Ie_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_GroupArgs = {
  _set?: InputMaybe<Users_Group_Set_Input>;
  where: Users_Group_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Group_By_PkArgs = {
  _set?: InputMaybe<Users_Group_Set_Input>;
  pk_columns: Users_Group_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Group_PermissionArgs = {
  _set?: InputMaybe<Users_Group_Permission_Set_Input>;
  where: Users_Group_Permission_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Group_Permission_By_PkArgs = {
  _set?: InputMaybe<Users_Group_Permission_Set_Input>;
  pk_columns: Users_Group_Permission_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_IdentityArgs = {
  _set?: InputMaybe<Users_Identity_Set_Input>;
  where: Users_Identity_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Identity_By_PkArgs = {
  _set?: InputMaybe<Users_Identity_Set_Input>;
  pk_columns: Users_Identity_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Identity_ProviderArgs = {
  _set?: InputMaybe<Users_Identity_Provider_Set_Input>;
  where: Users_Identity_Provider_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Identity_Provider_By_PkArgs = {
  _set?: InputMaybe<Users_Identity_Provider_Set_Input>;
  pk_columns: Users_Identity_Provider_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_PermissionArgs = {
  _set?: InputMaybe<Users_Permission_Set_Input>;
  where: Users_Permission_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Permission_By_PkArgs = {
  _set?: InputMaybe<Users_Permission_Set_Input>;
  pk_columns: Users_Permission_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_ProfileArgs = {
  _set?: InputMaybe<Users_Profile_Set_Input>;
  where: Users_Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Profile_By_PkArgs = {
  _set?: InputMaybe<Users_Profile_Set_Input>;
  pk_columns: Users_Profile_Pk_Columns_Input;
};

/** Bestanden die deel uitmaken van de representaties van ie's. */
export type Object_File = {
  __typename?: 'object_file';
  ebucore_is_media_fragment_of?: Maybe<Scalars['String']>;
  ebucore_media_type: Scalars['String'];
  /** An object relationship */
  premis_is_included_in: Object_Representation;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier: Scalars['String'];
  schema_alternate_name?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_embed_url?: Maybe<Scalars['String']>;
  /** de unieke identifier van de file */
  schema_identifier: Scalars['String'];
  schema_name?: Maybe<Scalars['String']>;
};

/** aggregated selection of "object.file" */
export type Object_File_Aggregate = {
  __typename?: 'object_file_aggregate';
  aggregate?: Maybe<Object_File_Aggregate_Fields>;
  nodes: Array<Object_File>;
};

/** aggregate fields of "object.file" */
export type Object_File_Aggregate_Fields = {
  __typename?: 'object_file_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Object_File_Max_Fields>;
  min?: Maybe<Object_File_Min_Fields>;
};


/** aggregate fields of "object.file" */
export type Object_File_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Object_File_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "object.file" */
export type Object_File_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Object_File_Max_Order_By>;
  min?: InputMaybe<Object_File_Min_Order_By>;
};

/** input type for inserting array relation for remote table "object.file" */
export type Object_File_Arr_Rel_Insert_Input = {
  data: Array<Object_File_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Object_File_On_Conflict>;
};

/** Boolean expression to filter rows from the table "object.file". All fields are combined with a logical 'AND'. */
export type Object_File_Bool_Exp = {
  _and?: InputMaybe<Array<Object_File_Bool_Exp>>;
  _not?: InputMaybe<Object_File_Bool_Exp>;
  _or?: InputMaybe<Array<Object_File_Bool_Exp>>;
  ebucore_is_media_fragment_of?: InputMaybe<String_Comparison_Exp>;
  ebucore_media_type?: InputMaybe<String_Comparison_Exp>;
  premis_is_included_in?: InputMaybe<Object_Representation_Bool_Exp>;
  representation_schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_alternate_name?: InputMaybe<String_Comparison_Exp>;
  schema_description?: InputMaybe<String_Comparison_Exp>;
  schema_embed_url?: InputMaybe<String_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "object.file" */
export enum Object_File_Constraint {
  /** unique or primary key constraint */
  FilePkey = 'file_pkey'
}

/** input type for inserting data into table "object.file" */
export type Object_File_Insert_Input = {
  ebucore_is_media_fragment_of?: InputMaybe<Scalars['String']>;
  ebucore_media_type?: InputMaybe<Scalars['String']>;
  premis_is_included_in?: InputMaybe<Object_Representation_Obj_Rel_Insert_Input>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: InputMaybe<Scalars['String']>;
  schema_alternate_name?: InputMaybe<Scalars['String']>;
  schema_description?: InputMaybe<Scalars['String']>;
  schema_embed_url?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de file */
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Object_File_Max_Fields = {
  __typename?: 'object_file_max_fields';
  ebucore_is_media_fragment_of?: Maybe<Scalars['String']>;
  ebucore_media_type?: Maybe<Scalars['String']>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: Maybe<Scalars['String']>;
  schema_alternate_name?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_embed_url?: Maybe<Scalars['String']>;
  /** de unieke identifier van de file */
  schema_identifier?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "object.file" */
export type Object_File_Max_Order_By = {
  ebucore_is_media_fragment_of?: InputMaybe<Order_By>;
  ebucore_media_type?: InputMaybe<Order_By>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: InputMaybe<Order_By>;
  schema_alternate_name?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_embed_url?: InputMaybe<Order_By>;
  /** de unieke identifier van de file */
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Object_File_Min_Fields = {
  __typename?: 'object_file_min_fields';
  ebucore_is_media_fragment_of?: Maybe<Scalars['String']>;
  ebucore_media_type?: Maybe<Scalars['String']>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: Maybe<Scalars['String']>;
  schema_alternate_name?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_embed_url?: Maybe<Scalars['String']>;
  /** de unieke identifier van de file */
  schema_identifier?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "object.file" */
export type Object_File_Min_Order_By = {
  ebucore_is_media_fragment_of?: InputMaybe<Order_By>;
  ebucore_media_type?: InputMaybe<Order_By>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: InputMaybe<Order_By>;
  schema_alternate_name?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_embed_url?: InputMaybe<Order_By>;
  /** de unieke identifier van de file */
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "object.file" */
export type Object_File_Mutation_Response = {
  __typename?: 'object_file_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Object_File>;
};

/** on_conflict condition type for table "object.file" */
export type Object_File_On_Conflict = {
  constraint: Object_File_Constraint;
  update_columns?: Array<Object_File_Update_Column>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};

/** Ordering options when selecting data from "object.file". */
export type Object_File_Order_By = {
  ebucore_is_media_fragment_of?: InputMaybe<Order_By>;
  ebucore_media_type?: InputMaybe<Order_By>;
  premis_is_included_in?: InputMaybe<Object_Representation_Order_By>;
  representation_schema_identifier?: InputMaybe<Order_By>;
  schema_alternate_name?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_embed_url?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: object_file */
export type Object_File_Pk_Columns_Input = {
  /** de unieke identifier van de file */
  schema_identifier: Scalars['String'];
};

/** select columns of table "object.file" */
export enum Object_File_Select_Column {
  /** column name */
  EbucoreIsMediaFragmentOf = 'ebucore_is_media_fragment_of',
  /** column name */
  EbucoreMediaType = 'ebucore_media_type',
  /** column name */
  RepresentationSchemaIdentifier = 'representation_schema_identifier',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaEmbedUrl = 'schema_embed_url',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name'
}

/** input type for updating data in table "object.file" */
export type Object_File_Set_Input = {
  ebucore_is_media_fragment_of?: InputMaybe<Scalars['String']>;
  ebucore_media_type?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: InputMaybe<Scalars['String']>;
  schema_alternate_name?: InputMaybe<Scalars['String']>;
  schema_description?: InputMaybe<Scalars['String']>;
  schema_embed_url?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de file */
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "object.file" */
export enum Object_File_Update_Column {
  /** column name */
  EbucoreIsMediaFragmentOf = 'ebucore_is_media_fragment_of',
  /** column name */
  EbucoreMediaType = 'ebucore_media_type',
  /** column name */
  RepresentationSchemaIdentifier = 'representation_schema_identifier',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaEmbedUrl = 'schema_embed_url',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name'
}

/** columns and relationships of "object.ie" */
export type Object_Ie = {
  __typename?: 'object_ie';
  /** An array relationship */
  _schema_is_part_of: Array<Object_Ie_Is_Part_Of>;
  /** An aggregate relationship */
  _schema_is_part_of_aggregate: Object_Ie_Is_Part_Of_Aggregate;
  /** Datum waarop de IE beschikbaar is gemaakt */
  dcterms_available?: Maybe<Scalars['timestamp']>;
  /** De datum waarop de IE werd gemaakt in edtf */
  dcterms_created?: Maybe<Scalars['String']>;
  /** Het mediatype: video, audio, beeld, document, ... */
  dcterms_format: Scalars['String'];
  /** De datum waarop de IE werd uitgebracht in edtf */
  dcterms_issued?: Maybe<Scalars['String']>;
  dcterms_medium?: Maybe<Scalars['String']>;
  ebucore_object_type?: Maybe<Scalars['String']>;
  /** An array relationship */
  ies: Array<Users_Folder_Ie>;
  /** An aggregate relationship */
  ies_aggregate: Users_Folder_Ie_Aggregate;
  /** An object relationship */
  maintainer?: Maybe<Maintainer_Content_Partner>;
  /** Beschrijving van de cast: de voornaamste acteurs/performers en hun respectievelijke rol. */
  meemoo_description_cast?: Maybe<Scalars['String']>;
  /** Beschrijving van het programma. */
  meemoo_description_programme?: Maybe<Scalars['String']>;
  /** De meemoo PID (external_id) voor een IE */
  meemoo_identifier: Scalars['String'];
  /** Hoofd lokale identifier van de CP. */
  meemoo_local_id?: Maybe<Scalars['String']>;
  meemoo_media_object_id?: Maybe<Scalars['String']>;
  /** Aka oorsprong. De naam van de beherende CP. */
  meemoo_original_cp?: Maybe<Scalars['String']>;
  meemoofilm_base?: Maybe<Scalars['String']>;
  meemoofilm_color?: Maybe<Scalars['Boolean']>;
  meemoofilm_contains_embedded_caption?: Maybe<Scalars['Boolean']>;
  meemoofilm_embeddedCaptionLanguage?: Maybe<Scalars['String']>;
  meemoofilm_image_or_sound?: Maybe<Scalars['String']>;
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: Maybe<Scalars['jsonb']>;
  /** De IE waarvan de record deel uitmaakt. */
  premis_is_part_of?: Maybe<Scalars['String']>;
  /** An array relationship */
  premis_is_represented_by: Array<Object_Representation>;
  /** An aggregate relationship */
  premis_is_represented_by_aggregate: Object_Representation_Aggregate;
  /** Is verwant aan een andere IE */
  premis_relationship?: Maybe<Scalars['jsonb']>;
  /** De inhoudelijke samenvatting van de IE */
  schema_abstract?: Maybe<Scalars['String']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: Maybe<Scalars['jsonb']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: Maybe<Scalars['jsonb']>;
  /** De naam of ID van de rechtenhoudende persoon of organisatie */
  schema_copyright_holder?: Maybe<Scalars['String']>;
  /** Opmerkingen bij rechten en hergebruik */
  schema_copyright_notice?: Maybe<Scalars['String']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: Maybe<Scalars['jsonb']>;
  /** Datum waarop de IE werd aangemaakt */
  schema_date_created?: Maybe<Scalars['daterange']>;
  schema_date_created_lower_bound?: Maybe<Scalars['date']>;
  /** Datum waarop de IE voor het eerst werd uitgegeven, uitgezonden of vertoond */
  schema_date_published?: Maybe<Scalars['date']>;
  /** Een korte omschrijving van de IE */
  schema_description?: Maybe<Scalars['String']>;
  schema_duration?: Maybe<Scalars['time']>;
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Int']>;
  schema_genre?: Maybe<Scalars['_text']>;
  /** de unieke fragmentid in mediahaven */
  schema_identifier: Scalars['String'];
  /** De taal of talen die in de IE gebruikt worden */
  schema_in_language?: Maybe<Scalars['_text']>;
  /** De samenhangende reeks waarvan de IE een deel uitmaakt (reeks serie, programma, etc.) */
  schema_is_part_of?: Maybe<Scalars['jsonb']>;
  /** Tags of sleutelwoorden die de IE omschrijven */
  schema_keywords?: Maybe<Scalars['_text']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: Maybe<Scalars['jsonb']>;
  /** De ID van de beherende instelling of aanbieder van de IE, aka de CP (tbv relatie met org API v2) */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_maintainer_id_lower?: Maybe<Scalars['String']>;
  schema_maintainer_name?: Maybe<Scalars['String']>;
  /** De primaire titel van de IE */
  schema_name: Scalars['String'];
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Int']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: Maybe<Scalars['jsonb']>;
  /** Plaatsen of locaties waarover de IE handelt of betrekking op heeft */
  schema_spatial_coverage?: Maybe<Scalars['_text']>;
  /** Datums, tijdstippen of periodes waarover de IE handelt of betrekking op heeft */
  schema_temporal_coverage?: Maybe<Scalars['_text']>;
  /** Een URL naar een thumbnail of placeholder voor de IE */
  schema_thumbnail_url?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};


/** columns and relationships of "object.ie" */
export type Object_Ie_Schema_Is_Part_OfArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Is_Part_Of_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Is_Part_Of_Order_By>>;
  where?: InputMaybe<Object_Ie_Is_Part_Of_Bool_Exp>;
};


/** columns and relationships of "object.ie" */
export type Object_Ie_Schema_Is_Part_Of_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Is_Part_Of_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Is_Part_Of_Order_By>>;
  where?: InputMaybe<Object_Ie_Is_Part_Of_Bool_Exp>;
};


/** columns and relationships of "object.ie" */
export type Object_IeIesArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Ie_Order_By>>;
  where?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
};


/** columns and relationships of "object.ie" */
export type Object_IeIes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Ie_Order_By>>;
  where?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
};


/** columns and relationships of "object.ie" */
export type Object_IePremis_IdentifierArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IePremis_Is_Represented_ByArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


/** columns and relationships of "object.ie" */
export type Object_IePremis_Is_Represented_By_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


/** columns and relationships of "object.ie" */
export type Object_IePremis_RelationshipArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_ActorArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_ContributorArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_CreatorArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_Is_Part_OfArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_LicenseArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_PublisherArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "object.ie" */
export type Object_Ie_Aggregate = {
  __typename?: 'object_ie_aggregate';
  aggregate?: Maybe<Object_Ie_Aggregate_Fields>;
  nodes: Array<Object_Ie>;
};

/** aggregate fields of "object.ie" */
export type Object_Ie_Aggregate_Fields = {
  __typename?: 'object_ie_aggregate_fields';
  avg?: Maybe<Object_Ie_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Object_Ie_Max_Fields>;
  min?: Maybe<Object_Ie_Min_Fields>;
  stddev?: Maybe<Object_Ie_Stddev_Fields>;
  stddev_pop?: Maybe<Object_Ie_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Object_Ie_Stddev_Samp_Fields>;
  sum?: Maybe<Object_Ie_Sum_Fields>;
  var_pop?: Maybe<Object_Ie_Var_Pop_Fields>;
  var_samp?: Maybe<Object_Ie_Var_Samp_Fields>;
  variance?: Maybe<Object_Ie_Variance_Fields>;
};


/** aggregate fields of "object.ie" */
export type Object_Ie_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Object_Ie_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Object_Ie_Append_Input = {
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['jsonb']>;
  /** Is verwant aan een andere IE */
  premis_relationship?: InputMaybe<Scalars['jsonb']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['jsonb']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['jsonb']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['jsonb']>;
  /** De samenhangende reeks waarvan de IE een deel uitmaakt (reeks serie, programma, etc.) */
  schema_is_part_of?: InputMaybe<Scalars['jsonb']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['jsonb']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type Object_Ie_Avg_Fields = {
  __typename?: 'object_ie_avg_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "object.ie". All fields are combined with a logical 'AND'. */
export type Object_Ie_Bool_Exp = {
  _and?: InputMaybe<Array<Object_Ie_Bool_Exp>>;
  _not?: InputMaybe<Object_Ie_Bool_Exp>;
  _or?: InputMaybe<Array<Object_Ie_Bool_Exp>>;
  _schema_is_part_of?: InputMaybe<Object_Ie_Is_Part_Of_Bool_Exp>;
  dcterms_available?: InputMaybe<Timestamp_Comparison_Exp>;
  dcterms_created?: InputMaybe<String_Comparison_Exp>;
  dcterms_format?: InputMaybe<String_Comparison_Exp>;
  dcterms_issued?: InputMaybe<String_Comparison_Exp>;
  dcterms_medium?: InputMaybe<String_Comparison_Exp>;
  ebucore_object_type?: InputMaybe<String_Comparison_Exp>;
  ies?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
  maintainer?: InputMaybe<Maintainer_Content_Partner_Bool_Exp>;
  meemoo_description_cast?: InputMaybe<String_Comparison_Exp>;
  meemoo_description_programme?: InputMaybe<String_Comparison_Exp>;
  meemoo_identifier?: InputMaybe<String_Comparison_Exp>;
  meemoo_local_id?: InputMaybe<String_Comparison_Exp>;
  meemoo_media_object_id?: InputMaybe<String_Comparison_Exp>;
  meemoo_original_cp?: InputMaybe<String_Comparison_Exp>;
  meemoofilm_base?: InputMaybe<String_Comparison_Exp>;
  meemoofilm_color?: InputMaybe<Boolean_Comparison_Exp>;
  meemoofilm_contains_embedded_caption?: InputMaybe<Boolean_Comparison_Exp>;
  meemoofilm_embeddedCaptionLanguage?: InputMaybe<String_Comparison_Exp>;
  meemoofilm_image_or_sound?: InputMaybe<String_Comparison_Exp>;
  premis_identifier?: InputMaybe<Jsonb_Comparison_Exp>;
  premis_is_part_of?: InputMaybe<String_Comparison_Exp>;
  premis_is_represented_by?: InputMaybe<Object_Representation_Bool_Exp>;
  premis_relationship?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_abstract?: InputMaybe<String_Comparison_Exp>;
  schema_actor?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_contributor?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_copyright_holder?: InputMaybe<String_Comparison_Exp>;
  schema_copyright_notice?: InputMaybe<String_Comparison_Exp>;
  schema_creator?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_date_created?: InputMaybe<Daterange_Comparison_Exp>;
  schema_date_created_lower_bound?: InputMaybe<Date_Comparison_Exp>;
  schema_date_published?: InputMaybe<Date_Comparison_Exp>;
  schema_description?: InputMaybe<String_Comparison_Exp>;
  schema_duration?: InputMaybe<Time_Comparison_Exp>;
  schema_duration_in_seconds?: InputMaybe<Int_Comparison_Exp>;
  schema_genre?: InputMaybe<_Text_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_in_language?: InputMaybe<_Text_Comparison_Exp>;
  schema_is_part_of?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_keywords?: InputMaybe<_Text_Comparison_Exp>;
  schema_license?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer_id_lower?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer_name?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  schema_number_of_pages?: InputMaybe<Int_Comparison_Exp>;
  schema_publisher?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_spatial_coverage?: InputMaybe<_Text_Comparison_Exp>;
  schema_temporal_coverage?: InputMaybe<_Text_Comparison_Exp>;
  schema_thumbnail_url?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "object.ie" */
export enum Object_Ie_Constraint {
  /** unique or primary key constraint */
  IeMeemooFragmentIdKey = 'ie_meemoo_fragment_id_key',
  /** unique or primary key constraint */
  IntellectualEntityPkey = 'intellectual_entity_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Object_Ie_Delete_At_Path_Input = {
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Array<Scalars['String']>>;
  /** Is verwant aan een andere IE */
  premis_relationship?: InputMaybe<Array<Scalars['String']>>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Array<Scalars['String']>>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Array<Scalars['String']>>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Array<Scalars['String']>>;
  /** De samenhangende reeks waarvan de IE een deel uitmaakt (reeks serie, programma, etc.) */
  schema_is_part_of?: InputMaybe<Array<Scalars['String']>>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Array<Scalars['String']>>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Object_Ie_Delete_Elem_Input = {
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['Int']>;
  /** Is verwant aan een andere IE */
  premis_relationship?: InputMaybe<Scalars['Int']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['Int']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['Int']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['Int']>;
  /** De samenhangende reeks waarvan de IE een deel uitmaakt (reeks serie, programma, etc.) */
  schema_is_part_of?: InputMaybe<Scalars['Int']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['Int']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Object_Ie_Delete_Key_Input = {
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['String']>;
  /** Is verwant aan een andere IE */
  premis_relationship?: InputMaybe<Scalars['String']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['String']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['String']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['String']>;
  /** De samenhangende reeks waarvan de IE een deel uitmaakt (reeks serie, programma, etc.) */
  schema_is_part_of?: InputMaybe<Scalars['String']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['String']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "object.ie" */
export type Object_Ie_Inc_Input = {
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: InputMaybe<Scalars['Int']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: InputMaybe<Scalars['Int']>;
};

/** columns and relationships of "object.ie_index" */
export type Object_Ie_Index = {
  __typename?: 'object_ie_index';
  document?: Maybe<Scalars['json']>;
  document_id?: Maybe<Scalars['String']>;
  index_id?: Maybe<Scalars['String']>;
};


/** columns and relationships of "object.ie_index" */
export type Object_Ie_IndexDocumentArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "object.ie_index" */
export type Object_Ie_Index_Aggregate = {
  __typename?: 'object_ie_index_aggregate';
  aggregate?: Maybe<Object_Ie_Index_Aggregate_Fields>;
  nodes: Array<Object_Ie_Index>;
};

/** aggregate fields of "object.ie_index" */
export type Object_Ie_Index_Aggregate_Fields = {
  __typename?: 'object_ie_index_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Object_Ie_Index_Max_Fields>;
  min?: Maybe<Object_Ie_Index_Min_Fields>;
};


/** aggregate fields of "object.ie_index" */
export type Object_Ie_Index_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Object_Ie_Index_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "object.ie_index". All fields are combined with a logical 'AND'. */
export type Object_Ie_Index_Bool_Exp = {
  _and?: InputMaybe<Array<Object_Ie_Index_Bool_Exp>>;
  _not?: InputMaybe<Object_Ie_Index_Bool_Exp>;
  _or?: InputMaybe<Array<Object_Ie_Index_Bool_Exp>>;
  document?: InputMaybe<Json_Comparison_Exp>;
  document_id?: InputMaybe<String_Comparison_Exp>;
  index_id?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Object_Ie_Index_Max_Fields = {
  __typename?: 'object_ie_index_max_fields';
  document_id?: Maybe<Scalars['String']>;
  index_id?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Object_Ie_Index_Min_Fields = {
  __typename?: 'object_ie_index_min_fields';
  document_id?: Maybe<Scalars['String']>;
  index_id?: Maybe<Scalars['String']>;
};

/** Ordering options when selecting data from "object.ie_index". */
export type Object_Ie_Index_Order_By = {
  document?: InputMaybe<Order_By>;
  document_id?: InputMaybe<Order_By>;
  index_id?: InputMaybe<Order_By>;
};

/** select columns of table "object.ie_index" */
export enum Object_Ie_Index_Select_Column {
  /** column name */
  Document = 'document',
  /** column name */
  DocumentId = 'document_id',
  /** column name */
  IndexId = 'index_id'
}

/** input type for inserting data into table "object.ie" */
export type Object_Ie_Insert_Input = {
  _schema_is_part_of?: InputMaybe<Object_Ie_Is_Part_Of_Arr_Rel_Insert_Input>;
  /** Datum waarop de IE beschikbaar is gemaakt */
  dcterms_available?: InputMaybe<Scalars['timestamp']>;
  /** De datum waarop de IE werd gemaakt in edtf */
  dcterms_created?: InputMaybe<Scalars['String']>;
  /** Het mediatype: video, audio, beeld, document, ... */
  dcterms_format?: InputMaybe<Scalars['String']>;
  /** De datum waarop de IE werd uitgebracht in edtf */
  dcterms_issued?: InputMaybe<Scalars['String']>;
  dcterms_medium?: InputMaybe<Scalars['String']>;
  ebucore_object_type?: InputMaybe<Scalars['String']>;
  ies?: InputMaybe<Users_Folder_Ie_Arr_Rel_Insert_Input>;
  maintainer?: InputMaybe<Maintainer_Content_Partner_Obj_Rel_Insert_Input>;
  /** Beschrijving van de cast: de voornaamste acteurs/performers en hun respectievelijke rol. */
  meemoo_description_cast?: InputMaybe<Scalars['String']>;
  /** Beschrijving van het programma. */
  meemoo_description_programme?: InputMaybe<Scalars['String']>;
  /** De meemoo PID (external_id) voor een IE */
  meemoo_identifier?: InputMaybe<Scalars['String']>;
  /** Hoofd lokale identifier van de CP. */
  meemoo_local_id?: InputMaybe<Scalars['String']>;
  meemoo_media_object_id?: InputMaybe<Scalars['String']>;
  /** Aka oorsprong. De naam van de beherende CP. */
  meemoo_original_cp?: InputMaybe<Scalars['String']>;
  meemoofilm_base?: InputMaybe<Scalars['String']>;
  meemoofilm_color?: InputMaybe<Scalars['Boolean']>;
  meemoofilm_contains_embedded_caption?: InputMaybe<Scalars['Boolean']>;
  meemoofilm_embeddedCaptionLanguage?: InputMaybe<Scalars['String']>;
  meemoofilm_image_or_sound?: InputMaybe<Scalars['String']>;
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['jsonb']>;
  /** De IE waarvan de record deel uitmaakt. */
  premis_is_part_of?: InputMaybe<Scalars['String']>;
  premis_is_represented_by?: InputMaybe<Object_Representation_Arr_Rel_Insert_Input>;
  /** Is verwant aan een andere IE */
  premis_relationship?: InputMaybe<Scalars['jsonb']>;
  /** De inhoudelijke samenvatting van de IE */
  schema_abstract?: InputMaybe<Scalars['String']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['jsonb']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['jsonb']>;
  /** De naam of ID van de rechtenhoudende persoon of organisatie */
  schema_copyright_holder?: InputMaybe<Scalars['String']>;
  /** Opmerkingen bij rechten en hergebruik */
  schema_copyright_notice?: InputMaybe<Scalars['String']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['jsonb']>;
  /** Datum waarop de IE werd aangemaakt */
  schema_date_created?: InputMaybe<Scalars['daterange']>;
  /** Datum waarop de IE voor het eerst werd uitgegeven, uitgezonden of vertoond */
  schema_date_published?: InputMaybe<Scalars['date']>;
  /** Een korte omschrijving van de IE */
  schema_description?: InputMaybe<Scalars['String']>;
  schema_duration?: InputMaybe<Scalars['time']>;
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: InputMaybe<Scalars['Int']>;
  schema_genre?: InputMaybe<Scalars['_text']>;
  /** de unieke fragmentid in mediahaven */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De taal of talen die in de IE gebruikt worden */
  schema_in_language?: InputMaybe<Scalars['_text']>;
  /** De samenhangende reeks waarvan de IE een deel uitmaakt (reeks serie, programma, etc.) */
  schema_is_part_of?: InputMaybe<Scalars['jsonb']>;
  /** Tags of sleutelwoorden die de IE omschrijven */
  schema_keywords?: InputMaybe<Scalars['_text']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['jsonb']>;
  /** De ID van de beherende instelling of aanbieder van de IE, aka de CP (tbv relatie met org API v2) */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  schema_maintainer_name?: InputMaybe<Scalars['String']>;
  /** De primaire titel van de IE */
  schema_name?: InputMaybe<Scalars['String']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: InputMaybe<Scalars['Int']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['jsonb']>;
  /** Plaatsen of locaties waarover de IE handelt of betrekking op heeft */
  schema_spatial_coverage?: InputMaybe<Scalars['_text']>;
  /** Datums, tijdstippen of periodes waarover de IE handelt of betrekking op heeft */
  schema_temporal_coverage?: InputMaybe<Scalars['_text']>;
  /** Een URL naar een thumbnail of placeholder voor de IE */
  schema_thumbnail_url?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** columns and relationships of "object.ie_is_part_of" */
export type Object_Ie_Is_Part_Of = {
  __typename?: 'object_ie_is_part_of';
  schema_identifier?: Maybe<Scalars['String']>;
  schema_is_part_of?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregated selection of "object.ie_is_part_of" */
export type Object_Ie_Is_Part_Of_Aggregate = {
  __typename?: 'object_ie_is_part_of_aggregate';
  aggregate?: Maybe<Object_Ie_Is_Part_Of_Aggregate_Fields>;
  nodes: Array<Object_Ie_Is_Part_Of>;
};

/** aggregate fields of "object.ie_is_part_of" */
export type Object_Ie_Is_Part_Of_Aggregate_Fields = {
  __typename?: 'object_ie_is_part_of_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Object_Ie_Is_Part_Of_Max_Fields>;
  min?: Maybe<Object_Ie_Is_Part_Of_Min_Fields>;
};


/** aggregate fields of "object.ie_is_part_of" */
export type Object_Ie_Is_Part_Of_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Object_Ie_Is_Part_Of_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "object.ie_is_part_of" */
export type Object_Ie_Is_Part_Of_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Object_Ie_Is_Part_Of_Max_Order_By>;
  min?: InputMaybe<Object_Ie_Is_Part_Of_Min_Order_By>;
};

/** input type for inserting array relation for remote table "object.ie_is_part_of" */
export type Object_Ie_Is_Part_Of_Arr_Rel_Insert_Input = {
  data: Array<Object_Ie_Is_Part_Of_Insert_Input>;
};

/** Boolean expression to filter rows from the table "object.ie_is_part_of". All fields are combined with a logical 'AND'. */
export type Object_Ie_Is_Part_Of_Bool_Exp = {
  _and?: InputMaybe<Array<Object_Ie_Is_Part_Of_Bool_Exp>>;
  _not?: InputMaybe<Object_Ie_Is_Part_Of_Bool_Exp>;
  _or?: InputMaybe<Array<Object_Ie_Is_Part_Of_Bool_Exp>>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_is_part_of?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "object.ie_is_part_of" */
export type Object_Ie_Is_Part_Of_Insert_Input = {
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_is_part_of?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Object_Ie_Is_Part_Of_Max_Fields = {
  __typename?: 'object_ie_is_part_of_max_fields';
  schema_identifier?: Maybe<Scalars['String']>;
  schema_is_part_of?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "object.ie_is_part_of" */
export type Object_Ie_Is_Part_Of_Max_Order_By = {
  schema_identifier?: InputMaybe<Order_By>;
  schema_is_part_of?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Object_Ie_Is_Part_Of_Min_Fields = {
  __typename?: 'object_ie_is_part_of_min_fields';
  schema_identifier?: Maybe<Scalars['String']>;
  schema_is_part_of?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "object.ie_is_part_of" */
export type Object_Ie_Is_Part_Of_Min_Order_By = {
  schema_identifier?: InputMaybe<Order_By>;
  schema_is_part_of?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "object.ie_is_part_of". */
export type Object_Ie_Is_Part_Of_Order_By = {
  schema_identifier?: InputMaybe<Order_By>;
  schema_is_part_of?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** select columns of table "object.ie_is_part_of" */
export enum Object_Ie_Is_Part_Of_Select_Column {
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  Value = 'value'
}

/** aggregate max on columns */
export type Object_Ie_Max_Fields = {
  __typename?: 'object_ie_max_fields';
  /** Datum waarop de IE beschikbaar is gemaakt */
  dcterms_available?: Maybe<Scalars['timestamp']>;
  /** De datum waarop de IE werd gemaakt in edtf */
  dcterms_created?: Maybe<Scalars['String']>;
  /** Het mediatype: video, audio, beeld, document, ... */
  dcterms_format?: Maybe<Scalars['String']>;
  /** De datum waarop de IE werd uitgebracht in edtf */
  dcterms_issued?: Maybe<Scalars['String']>;
  dcterms_medium?: Maybe<Scalars['String']>;
  ebucore_object_type?: Maybe<Scalars['String']>;
  /** Beschrijving van de cast: de voornaamste acteurs/performers en hun respectievelijke rol. */
  meemoo_description_cast?: Maybe<Scalars['String']>;
  /** Beschrijving van het programma. */
  meemoo_description_programme?: Maybe<Scalars['String']>;
  /** De meemoo PID (external_id) voor een IE */
  meemoo_identifier?: Maybe<Scalars['String']>;
  /** Hoofd lokale identifier van de CP. */
  meemoo_local_id?: Maybe<Scalars['String']>;
  meemoo_media_object_id?: Maybe<Scalars['String']>;
  /** Aka oorsprong. De naam van de beherende CP. */
  meemoo_original_cp?: Maybe<Scalars['String']>;
  meemoofilm_base?: Maybe<Scalars['String']>;
  meemoofilm_embeddedCaptionLanguage?: Maybe<Scalars['String']>;
  meemoofilm_image_or_sound?: Maybe<Scalars['String']>;
  /** De IE waarvan de record deel uitmaakt. */
  premis_is_part_of?: Maybe<Scalars['String']>;
  /** De inhoudelijke samenvatting van de IE */
  schema_abstract?: Maybe<Scalars['String']>;
  /** De naam of ID van de rechtenhoudende persoon of organisatie */
  schema_copyright_holder?: Maybe<Scalars['String']>;
  /** Opmerkingen bij rechten en hergebruik */
  schema_copyright_notice?: Maybe<Scalars['String']>;
  schema_date_created_lower_bound?: Maybe<Scalars['date']>;
  /** Datum waarop de IE voor het eerst werd uitgegeven, uitgezonden of vertoond */
  schema_date_published?: Maybe<Scalars['date']>;
  /** Een korte omschrijving van de IE */
  schema_description?: Maybe<Scalars['String']>;
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Int']>;
  /** de unieke fragmentid in mediahaven */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De ID van de beherende instelling of aanbieder van de IE, aka de CP (tbv relatie met org API v2) */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_maintainer_id_lower?: Maybe<Scalars['String']>;
  schema_maintainer_name?: Maybe<Scalars['String']>;
  /** De primaire titel van de IE */
  schema_name?: Maybe<Scalars['String']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Int']>;
  /** Een URL naar een thumbnail of placeholder voor de IE */
  schema_thumbnail_url?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Object_Ie_Min_Fields = {
  __typename?: 'object_ie_min_fields';
  /** Datum waarop de IE beschikbaar is gemaakt */
  dcterms_available?: Maybe<Scalars['timestamp']>;
  /** De datum waarop de IE werd gemaakt in edtf */
  dcterms_created?: Maybe<Scalars['String']>;
  /** Het mediatype: video, audio, beeld, document, ... */
  dcterms_format?: Maybe<Scalars['String']>;
  /** De datum waarop de IE werd uitgebracht in edtf */
  dcterms_issued?: Maybe<Scalars['String']>;
  dcterms_medium?: Maybe<Scalars['String']>;
  ebucore_object_type?: Maybe<Scalars['String']>;
  /** Beschrijving van de cast: de voornaamste acteurs/performers en hun respectievelijke rol. */
  meemoo_description_cast?: Maybe<Scalars['String']>;
  /** Beschrijving van het programma. */
  meemoo_description_programme?: Maybe<Scalars['String']>;
  /** De meemoo PID (external_id) voor een IE */
  meemoo_identifier?: Maybe<Scalars['String']>;
  /** Hoofd lokale identifier van de CP. */
  meemoo_local_id?: Maybe<Scalars['String']>;
  meemoo_media_object_id?: Maybe<Scalars['String']>;
  /** Aka oorsprong. De naam van de beherende CP. */
  meemoo_original_cp?: Maybe<Scalars['String']>;
  meemoofilm_base?: Maybe<Scalars['String']>;
  meemoofilm_embeddedCaptionLanguage?: Maybe<Scalars['String']>;
  meemoofilm_image_or_sound?: Maybe<Scalars['String']>;
  /** De IE waarvan de record deel uitmaakt. */
  premis_is_part_of?: Maybe<Scalars['String']>;
  /** De inhoudelijke samenvatting van de IE */
  schema_abstract?: Maybe<Scalars['String']>;
  /** De naam of ID van de rechtenhoudende persoon of organisatie */
  schema_copyright_holder?: Maybe<Scalars['String']>;
  /** Opmerkingen bij rechten en hergebruik */
  schema_copyright_notice?: Maybe<Scalars['String']>;
  schema_date_created_lower_bound?: Maybe<Scalars['date']>;
  /** Datum waarop de IE voor het eerst werd uitgegeven, uitgezonden of vertoond */
  schema_date_published?: Maybe<Scalars['date']>;
  /** Een korte omschrijving van de IE */
  schema_description?: Maybe<Scalars['String']>;
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Int']>;
  /** de unieke fragmentid in mediahaven */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De ID van de beherende instelling of aanbieder van de IE, aka de CP (tbv relatie met org API v2) */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_maintainer_id_lower?: Maybe<Scalars['String']>;
  schema_maintainer_name?: Maybe<Scalars['String']>;
  /** De primaire titel van de IE */
  schema_name?: Maybe<Scalars['String']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Int']>;
  /** Een URL naar een thumbnail of placeholder voor de IE */
  schema_thumbnail_url?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "object.ie" */
export type Object_Ie_Mutation_Response = {
  __typename?: 'object_ie_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Object_Ie>;
};

/** input type for inserting object relation for remote table "object.ie" */
export type Object_Ie_Obj_Rel_Insert_Input = {
  data: Object_Ie_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Object_Ie_On_Conflict>;
};

/** on_conflict condition type for table "object.ie" */
export type Object_Ie_On_Conflict = {
  constraint: Object_Ie_Constraint;
  update_columns?: Array<Object_Ie_Update_Column>;
  where?: InputMaybe<Object_Ie_Bool_Exp>;
};

/** Ordering options when selecting data from "object.ie". */
export type Object_Ie_Order_By = {
  _schema_is_part_of_aggregate?: InputMaybe<Object_Ie_Is_Part_Of_Aggregate_Order_By>;
  dcterms_available?: InputMaybe<Order_By>;
  dcterms_created?: InputMaybe<Order_By>;
  dcterms_format?: InputMaybe<Order_By>;
  dcterms_issued?: InputMaybe<Order_By>;
  dcterms_medium?: InputMaybe<Order_By>;
  ebucore_object_type?: InputMaybe<Order_By>;
  ies_aggregate?: InputMaybe<Users_Folder_Ie_Aggregate_Order_By>;
  maintainer?: InputMaybe<Maintainer_Content_Partner_Order_By>;
  meemoo_description_cast?: InputMaybe<Order_By>;
  meemoo_description_programme?: InputMaybe<Order_By>;
  meemoo_identifier?: InputMaybe<Order_By>;
  meemoo_local_id?: InputMaybe<Order_By>;
  meemoo_media_object_id?: InputMaybe<Order_By>;
  meemoo_original_cp?: InputMaybe<Order_By>;
  meemoofilm_base?: InputMaybe<Order_By>;
  meemoofilm_color?: InputMaybe<Order_By>;
  meemoofilm_contains_embedded_caption?: InputMaybe<Order_By>;
  meemoofilm_embeddedCaptionLanguage?: InputMaybe<Order_By>;
  meemoofilm_image_or_sound?: InputMaybe<Order_By>;
  premis_identifier?: InputMaybe<Order_By>;
  premis_is_part_of?: InputMaybe<Order_By>;
  premis_is_represented_by_aggregate?: InputMaybe<Object_Representation_Aggregate_Order_By>;
  premis_relationship?: InputMaybe<Order_By>;
  schema_abstract?: InputMaybe<Order_By>;
  schema_actor?: InputMaybe<Order_By>;
  schema_contributor?: InputMaybe<Order_By>;
  schema_copyright_holder?: InputMaybe<Order_By>;
  schema_copyright_notice?: InputMaybe<Order_By>;
  schema_creator?: InputMaybe<Order_By>;
  schema_date_created?: InputMaybe<Order_By>;
  schema_date_created_lower_bound?: InputMaybe<Order_By>;
  schema_date_published?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_duration?: InputMaybe<Order_By>;
  schema_duration_in_seconds?: InputMaybe<Order_By>;
  schema_genre?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_in_language?: InputMaybe<Order_By>;
  schema_is_part_of?: InputMaybe<Order_By>;
  schema_keywords?: InputMaybe<Order_By>;
  schema_license?: InputMaybe<Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_maintainer_id_lower?: InputMaybe<Order_By>;
  schema_maintainer_name?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  schema_number_of_pages?: InputMaybe<Order_By>;
  schema_publisher?: InputMaybe<Order_By>;
  schema_spatial_coverage?: InputMaybe<Order_By>;
  schema_temporal_coverage?: InputMaybe<Order_By>;
  schema_thumbnail_url?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: object_ie */
export type Object_Ie_Pk_Columns_Input = {
  /** de unieke fragmentid in mediahaven */
  schema_identifier: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Object_Ie_Prepend_Input = {
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['jsonb']>;
  /** Is verwant aan een andere IE */
  premis_relationship?: InputMaybe<Scalars['jsonb']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['jsonb']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['jsonb']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['jsonb']>;
  /** De samenhangende reeks waarvan de IE een deel uitmaakt (reeks serie, programma, etc.) */
  schema_is_part_of?: InputMaybe<Scalars['jsonb']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['jsonb']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "object.ie" */
export enum Object_Ie_Select_Column {
  /** column name */
  DctermsAvailable = 'dcterms_available',
  /** column name */
  DctermsCreated = 'dcterms_created',
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  DctermsIssued = 'dcterms_issued',
  /** column name */
  DctermsMedium = 'dcterms_medium',
  /** column name */
  EbucoreObjectType = 'ebucore_object_type',
  /** column name */
  MeemooDescriptionCast = 'meemoo_description_cast',
  /** column name */
  MeemooDescriptionProgramme = 'meemoo_description_programme',
  /** column name */
  MeemooIdentifier = 'meemoo_identifier',
  /** column name */
  MeemooLocalId = 'meemoo_local_id',
  /** column name */
  MeemooMediaObjectId = 'meemoo_media_object_id',
  /** column name */
  MeemooOriginalCp = 'meemoo_original_cp',
  /** column name */
  MeemoofilmBase = 'meemoofilm_base',
  /** column name */
  MeemoofilmColor = 'meemoofilm_color',
  /** column name */
  MeemoofilmContainsEmbeddedCaption = 'meemoofilm_contains_embedded_caption',
  /** column name */
  MeemoofilmEmbeddedCaptionLanguage = 'meemoofilm_embeddedCaptionLanguage',
  /** column name */
  MeemoofilmImageOrSound = 'meemoofilm_image_or_sound',
  /** column name */
  PremisIdentifier = 'premis_identifier',
  /** column name */
  PremisIsPartOf = 'premis_is_part_of',
  /** column name */
  PremisRelationship = 'premis_relationship',
  /** column name */
  SchemaAbstract = 'schema_abstract',
  /** column name */
  SchemaActor = 'schema_actor',
  /** column name */
  SchemaContributor = 'schema_contributor',
  /** column name */
  SchemaCopyrightHolder = 'schema_copyright_holder',
  /** column name */
  SchemaCopyrightNotice = 'schema_copyright_notice',
  /** column name */
  SchemaCreator = 'schema_creator',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDateCreatedLowerBound = 'schema_date_created_lower_bound',
  /** column name */
  SchemaDatePublished = 'schema_date_published',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaDuration = 'schema_duration',
  /** column name */
  SchemaDurationInSeconds = 'schema_duration_in_seconds',
  /** column name */
  SchemaGenre = 'schema_genre',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  SchemaKeywords = 'schema_keywords',
  /** column name */
  SchemaLicense = 'schema_license',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaMaintainerIdLower = 'schema_maintainer_id_lower',
  /** column name */
  SchemaMaintainerName = 'schema_maintainer_name',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaNumberOfPages = 'schema_number_of_pages',
  /** column name */
  SchemaPublisher = 'schema_publisher',
  /** column name */
  SchemaSpatialCoverage = 'schema_spatial_coverage',
  /** column name */
  SchemaTemporalCoverage = 'schema_temporal_coverage',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "object.ie" */
export type Object_Ie_Set_Input = {
  /** Datum waarop de IE beschikbaar is gemaakt */
  dcterms_available?: InputMaybe<Scalars['timestamp']>;
  /** De datum waarop de IE werd gemaakt in edtf */
  dcterms_created?: InputMaybe<Scalars['String']>;
  /** Het mediatype: video, audio, beeld, document, ... */
  dcterms_format?: InputMaybe<Scalars['String']>;
  /** De datum waarop de IE werd uitgebracht in edtf */
  dcterms_issued?: InputMaybe<Scalars['String']>;
  dcterms_medium?: InputMaybe<Scalars['String']>;
  ebucore_object_type?: InputMaybe<Scalars['String']>;
  /** Beschrijving van de cast: de voornaamste acteurs/performers en hun respectievelijke rol. */
  meemoo_description_cast?: InputMaybe<Scalars['String']>;
  /** Beschrijving van het programma. */
  meemoo_description_programme?: InputMaybe<Scalars['String']>;
  /** De meemoo PID (external_id) voor een IE */
  meemoo_identifier?: InputMaybe<Scalars['String']>;
  /** Hoofd lokale identifier van de CP. */
  meemoo_local_id?: InputMaybe<Scalars['String']>;
  meemoo_media_object_id?: InputMaybe<Scalars['String']>;
  /** Aka oorsprong. De naam van de beherende CP. */
  meemoo_original_cp?: InputMaybe<Scalars['String']>;
  meemoofilm_base?: InputMaybe<Scalars['String']>;
  meemoofilm_color?: InputMaybe<Scalars['Boolean']>;
  meemoofilm_contains_embedded_caption?: InputMaybe<Scalars['Boolean']>;
  meemoofilm_embeddedCaptionLanguage?: InputMaybe<Scalars['String']>;
  meemoofilm_image_or_sound?: InputMaybe<Scalars['String']>;
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['jsonb']>;
  /** De IE waarvan de record deel uitmaakt. */
  premis_is_part_of?: InputMaybe<Scalars['String']>;
  /** Is verwant aan een andere IE */
  premis_relationship?: InputMaybe<Scalars['jsonb']>;
  /** De inhoudelijke samenvatting van de IE */
  schema_abstract?: InputMaybe<Scalars['String']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['jsonb']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['jsonb']>;
  /** De naam of ID van de rechtenhoudende persoon of organisatie */
  schema_copyright_holder?: InputMaybe<Scalars['String']>;
  /** Opmerkingen bij rechten en hergebruik */
  schema_copyright_notice?: InputMaybe<Scalars['String']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['jsonb']>;
  /** Datum waarop de IE werd aangemaakt */
  schema_date_created?: InputMaybe<Scalars['daterange']>;
  /** Datum waarop de IE voor het eerst werd uitgegeven, uitgezonden of vertoond */
  schema_date_published?: InputMaybe<Scalars['date']>;
  /** Een korte omschrijving van de IE */
  schema_description?: InputMaybe<Scalars['String']>;
  schema_duration?: InputMaybe<Scalars['time']>;
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: InputMaybe<Scalars['Int']>;
  schema_genre?: InputMaybe<Scalars['_text']>;
  /** de unieke fragmentid in mediahaven */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De taal of talen die in de IE gebruikt worden */
  schema_in_language?: InputMaybe<Scalars['_text']>;
  /** De samenhangende reeks waarvan de IE een deel uitmaakt (reeks serie, programma, etc.) */
  schema_is_part_of?: InputMaybe<Scalars['jsonb']>;
  /** Tags of sleutelwoorden die de IE omschrijven */
  schema_keywords?: InputMaybe<Scalars['_text']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['jsonb']>;
  /** De ID van de beherende instelling of aanbieder van de IE, aka de CP (tbv relatie met org API v2) */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  schema_maintainer_name?: InputMaybe<Scalars['String']>;
  /** De primaire titel van de IE */
  schema_name?: InputMaybe<Scalars['String']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: InputMaybe<Scalars['Int']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['jsonb']>;
  /** Plaatsen of locaties waarover de IE handelt of betrekking op heeft */
  schema_spatial_coverage?: InputMaybe<Scalars['_text']>;
  /** Datums, tijdstippen of periodes waarover de IE handelt of betrekking op heeft */
  schema_temporal_coverage?: InputMaybe<Scalars['_text']>;
  /** Een URL naar een thumbnail of placeholder voor de IE */
  schema_thumbnail_url?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Object_Ie_Stddev_Fields = {
  __typename?: 'object_ie_stddev_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Object_Ie_Stddev_Pop_Fields = {
  __typename?: 'object_ie_stddev_pop_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Object_Ie_Stddev_Samp_Fields = {
  __typename?: 'object_ie_stddev_samp_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Object_Ie_Sum_Fields = {
  __typename?: 'object_ie_sum_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Int']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Int']>;
};

/** update columns of table "object.ie" */
export enum Object_Ie_Update_Column {
  /** column name */
  DctermsAvailable = 'dcterms_available',
  /** column name */
  DctermsCreated = 'dcterms_created',
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  DctermsIssued = 'dcterms_issued',
  /** column name */
  DctermsMedium = 'dcterms_medium',
  /** column name */
  EbucoreObjectType = 'ebucore_object_type',
  /** column name */
  MeemooDescriptionCast = 'meemoo_description_cast',
  /** column name */
  MeemooDescriptionProgramme = 'meemoo_description_programme',
  /** column name */
  MeemooIdentifier = 'meemoo_identifier',
  /** column name */
  MeemooLocalId = 'meemoo_local_id',
  /** column name */
  MeemooMediaObjectId = 'meemoo_media_object_id',
  /** column name */
  MeemooOriginalCp = 'meemoo_original_cp',
  /** column name */
  MeemoofilmBase = 'meemoofilm_base',
  /** column name */
  MeemoofilmColor = 'meemoofilm_color',
  /** column name */
  MeemoofilmContainsEmbeddedCaption = 'meemoofilm_contains_embedded_caption',
  /** column name */
  MeemoofilmEmbeddedCaptionLanguage = 'meemoofilm_embeddedCaptionLanguage',
  /** column name */
  MeemoofilmImageOrSound = 'meemoofilm_image_or_sound',
  /** column name */
  PremisIdentifier = 'premis_identifier',
  /** column name */
  PremisIsPartOf = 'premis_is_part_of',
  /** column name */
  PremisRelationship = 'premis_relationship',
  /** column name */
  SchemaAbstract = 'schema_abstract',
  /** column name */
  SchemaActor = 'schema_actor',
  /** column name */
  SchemaContributor = 'schema_contributor',
  /** column name */
  SchemaCopyrightHolder = 'schema_copyright_holder',
  /** column name */
  SchemaCopyrightNotice = 'schema_copyright_notice',
  /** column name */
  SchemaCreator = 'schema_creator',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDatePublished = 'schema_date_published',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaDuration = 'schema_duration',
  /** column name */
  SchemaDurationInSeconds = 'schema_duration_in_seconds',
  /** column name */
  SchemaGenre = 'schema_genre',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  SchemaKeywords = 'schema_keywords',
  /** column name */
  SchemaLicense = 'schema_license',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaMaintainerName = 'schema_maintainer_name',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaNumberOfPages = 'schema_number_of_pages',
  /** column name */
  SchemaPublisher = 'schema_publisher',
  /** column name */
  SchemaSpatialCoverage = 'schema_spatial_coverage',
  /** column name */
  SchemaTemporalCoverage = 'schema_temporal_coverage',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Object_Ie_Var_Pop_Fields = {
  __typename?: 'object_ie_var_pop_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Object_Ie_Var_Samp_Fields = {
  __typename?: 'object_ie_var_samp_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Object_Ie_Variance_Fields = {
  __typename?: 'object_ie_variance_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** de digitalRepresentation van de IE inclusief mediaResource */
export type Object_Representation = {
  __typename?: 'object_representation';
  /** het bestandstype van de represenatatie, container */
  dcterms_format: Scalars['String'];
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier: Scalars['String'];
  /** An array relationship */
  premis_includes: Array<Object_File>;
  /** An aggregate relationship */
  premis_includes_aggregate: Object_File_Aggregate;
  /** An object relationship */
  premis_represents: Object_Ie;
  /** label */
  schema_alternate_name?: Maybe<Scalars['String']>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: Maybe<Scalars['timestamp']>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: Maybe<Scalars['String']>;
  /** de unieke identifier van de representatie */
  schema_identifier: Scalars['String'];
  /** filename aka PathToVideo */
  schema_name: Scalars['String'];
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: Maybe<Scalars['String']>;
};


/** de digitalRepresentation van de IE inclusief mediaResource */
export type Object_RepresentationPremis_IncludesArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};


/** de digitalRepresentation van de IE inclusief mediaResource */
export type Object_RepresentationPremis_Includes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};

/** aggregated selection of "object.representation" */
export type Object_Representation_Aggregate = {
  __typename?: 'object_representation_aggregate';
  aggregate?: Maybe<Object_Representation_Aggregate_Fields>;
  nodes: Array<Object_Representation>;
};

/** aggregate fields of "object.representation" */
export type Object_Representation_Aggregate_Fields = {
  __typename?: 'object_representation_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Object_Representation_Max_Fields>;
  min?: Maybe<Object_Representation_Min_Fields>;
};


/** aggregate fields of "object.representation" */
export type Object_Representation_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Object_Representation_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "object.representation" */
export type Object_Representation_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Object_Representation_Max_Order_By>;
  min?: InputMaybe<Object_Representation_Min_Order_By>;
};

/** input type for inserting array relation for remote table "object.representation" */
export type Object_Representation_Arr_Rel_Insert_Input = {
  data: Array<Object_Representation_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Object_Representation_On_Conflict>;
};

/** Boolean expression to filter rows from the table "object.representation". All fields are combined with a logical 'AND'. */
export type Object_Representation_Bool_Exp = {
  _and?: InputMaybe<Array<Object_Representation_Bool_Exp>>;
  _not?: InputMaybe<Object_Representation_Bool_Exp>;
  _or?: InputMaybe<Array<Object_Representation_Bool_Exp>>;
  dcterms_format?: InputMaybe<String_Comparison_Exp>;
  ie_schema_identifier?: InputMaybe<String_Comparison_Exp>;
  premis_includes?: InputMaybe<Object_File_Bool_Exp>;
  premis_represents?: InputMaybe<Object_Ie_Bool_Exp>;
  schema_alternate_name?: InputMaybe<String_Comparison_Exp>;
  schema_date_created?: InputMaybe<Timestamp_Comparison_Exp>;
  schema_description?: InputMaybe<String_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  schema_transcript?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "object.representation" */
export enum Object_Representation_Constraint {
  /** unique or primary key constraint */
  RepresentationIdKey = 'representation_id_key',
  /** unique or primary key constraint */
  RepresentationPkey = 'representation_pkey'
}

/** input type for inserting data into table "object.representation" */
export type Object_Representation_Insert_Input = {
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: InputMaybe<Scalars['String']>;
  premis_includes?: InputMaybe<Object_File_Arr_Rel_Insert_Input>;
  premis_represents?: InputMaybe<Object_Ie_Obj_Rel_Insert_Input>;
  /** label */
  schema_alternate_name?: InputMaybe<Scalars['String']>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: InputMaybe<Scalars['timestamp']>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de representatie */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** filename aka PathToVideo */
  schema_name?: InputMaybe<Scalars['String']>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Object_Representation_Max_Fields = {
  __typename?: 'object_representation_max_fields';
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: Maybe<Scalars['String']>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: Maybe<Scalars['String']>;
  /** label */
  schema_alternate_name?: Maybe<Scalars['String']>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: Maybe<Scalars['timestamp']>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: Maybe<Scalars['String']>;
  /** de unieke identifier van de representatie */
  schema_identifier?: Maybe<Scalars['String']>;
  /** filename aka PathToVideo */
  schema_name?: Maybe<Scalars['String']>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "object.representation" */
export type Object_Representation_Max_Order_By = {
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: InputMaybe<Order_By>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: InputMaybe<Order_By>;
  /** label */
  schema_alternate_name?: InputMaybe<Order_By>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: InputMaybe<Order_By>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: InputMaybe<Order_By>;
  /** de unieke identifier van de representatie */
  schema_identifier?: InputMaybe<Order_By>;
  /** filename aka PathToVideo */
  schema_name?: InputMaybe<Order_By>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Object_Representation_Min_Fields = {
  __typename?: 'object_representation_min_fields';
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: Maybe<Scalars['String']>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: Maybe<Scalars['String']>;
  /** label */
  schema_alternate_name?: Maybe<Scalars['String']>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: Maybe<Scalars['timestamp']>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: Maybe<Scalars['String']>;
  /** de unieke identifier van de representatie */
  schema_identifier?: Maybe<Scalars['String']>;
  /** filename aka PathToVideo */
  schema_name?: Maybe<Scalars['String']>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "object.representation" */
export type Object_Representation_Min_Order_By = {
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: InputMaybe<Order_By>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: InputMaybe<Order_By>;
  /** label */
  schema_alternate_name?: InputMaybe<Order_By>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: InputMaybe<Order_By>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: InputMaybe<Order_By>;
  /** de unieke identifier van de representatie */
  schema_identifier?: InputMaybe<Order_By>;
  /** filename aka PathToVideo */
  schema_name?: InputMaybe<Order_By>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "object.representation" */
export type Object_Representation_Mutation_Response = {
  __typename?: 'object_representation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Object_Representation>;
};

/** input type for inserting object relation for remote table "object.representation" */
export type Object_Representation_Obj_Rel_Insert_Input = {
  data: Object_Representation_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Object_Representation_On_Conflict>;
};

/** on_conflict condition type for table "object.representation" */
export type Object_Representation_On_Conflict = {
  constraint: Object_Representation_Constraint;
  update_columns?: Array<Object_Representation_Update_Column>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};

/** Ordering options when selecting data from "object.representation". */
export type Object_Representation_Order_By = {
  dcterms_format?: InputMaybe<Order_By>;
  ie_schema_identifier?: InputMaybe<Order_By>;
  premis_includes_aggregate?: InputMaybe<Object_File_Aggregate_Order_By>;
  premis_represents?: InputMaybe<Object_Ie_Order_By>;
  schema_alternate_name?: InputMaybe<Order_By>;
  schema_date_created?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  schema_transcript?: InputMaybe<Order_By>;
};

/** primary key columns input for table: object_representation */
export type Object_Representation_Pk_Columns_Input = {
  /** de unieke identifier van de representatie */
  schema_identifier: Scalars['String'];
};

/** select columns of table "object.representation" */
export enum Object_Representation_Select_Column {
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  IeSchemaIdentifier = 'ie_schema_identifier',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaTranscript = 'schema_transcript'
}

/** input type for updating data in table "object.representation" */
export type Object_Representation_Set_Input = {
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: InputMaybe<Scalars['String']>;
  /** label */
  schema_alternate_name?: InputMaybe<Scalars['String']>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: InputMaybe<Scalars['timestamp']>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de representatie */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** filename aka PathToVideo */
  schema_name?: InputMaybe<Scalars['String']>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: InputMaybe<Scalars['String']>;
};

/** update columns of table "object.representation" */
export enum Object_Representation_Update_Column {
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  IeSchemaIdentifier = 'ie_schema_identifier',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaTranscript = 'schema_transcript'
}

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "app.config" */
  app_config: Array<App_Config>;
  /** fetch aggregated fields from the table: "app.config" */
  app_config_aggregate: App_Config_Aggregate;
  /** fetch data from the table: "app.config" using primary key columns */
  app_config_by_pk?: Maybe<App_Config>;
  /** fetch data from the table: "app.content_block" */
  app_content_block: Array<App_Content_Block>;
  /** fetch aggregated fields from the table: "app.content_block" */
  app_content_block_aggregate: App_Content_Block_Aggregate;
  /** fetch data from the table: "app.content_block" using primary key columns */
  app_content_block_by_pk?: Maybe<App_Content_Block>;
  /** fetch data from the table: "app.content_label" */
  app_content_label: Array<App_Content_Label>;
  /** fetch aggregated fields from the table: "app.content_label" */
  app_content_label_aggregate: App_Content_Label_Aggregate;
  /** fetch data from the table: "app.content_label" using primary key columns */
  app_content_label_by_pk?: Maybe<App_Content_Label>;
  /** fetch data from the table: "app.content_page" */
  app_content_page: Array<App_Content_Page>;
  /** fetch aggregated fields from the table: "app.content_page" */
  app_content_page_aggregate: App_Content_Page_Aggregate;
  /** fetch data from the table: "app.content_page" using primary key columns */
  app_content_page_by_pk?: Maybe<App_Content_Page>;
  /** fetch data from the table: "app.content_page_content_label" */
  app_content_page_content_label: Array<App_Content_Page_Content_Label>;
  /** fetch aggregated fields from the table: "app.content_page_content_label" */
  app_content_page_content_label_aggregate: App_Content_Page_Content_Label_Aggregate;
  /** fetch data from the table: "app.content_page_content_label" using primary key columns */
  app_content_page_content_label_by_pk?: Maybe<App_Content_Page_Content_Label>;
  /** fetch data from the table: "app.navigation" */
  app_navigation: Array<App_Navigation>;
  /** fetch aggregated fields from the table: "app.navigation" */
  app_navigation_aggregate: App_Navigation_Aggregate;
  /** fetch data from the table: "app.navigation" using primary key columns */
  app_navigation_by_pk?: Maybe<App_Navigation>;
  /** fetch data from the table: "app.notification" */
  app_notification: Array<App_Notification>;
  /** fetch aggregated fields from the table: "app.notification" */
  app_notification_aggregate: App_Notification_Aggregate;
  /** fetch data from the table: "app.notification" using primary key columns */
  app_notification_by_pk?: Maybe<App_Notification>;
  /** fetch data from the table: "lookup.app_content_block_type" */
  lookup_app_content_block_type: Array<Lookup_App_Content_Block_Type>;
  /** fetch aggregated fields from the table: "lookup.app_content_block_type" */
  lookup_app_content_block_type_aggregate: Lookup_App_Content_Block_Type_Aggregate;
  /** fetch data from the table: "lookup.app_content_block_type" using primary key columns */
  lookup_app_content_block_type_by_pk?: Maybe<Lookup_App_Content_Block_Type>;
  /** fetch data from the table: "lookup.app_content_type" */
  lookup_app_content_type: Array<Lookup_App_Content_Type>;
  /** fetch aggregated fields from the table: "lookup.app_content_type" */
  lookup_app_content_type_aggregate: Lookup_App_Content_Type_Aggregate;
  /** fetch data from the table: "lookup.app_content_type" using primary key columns */
  lookup_app_content_type_by_pk?: Maybe<Lookup_App_Content_Type>;
  /** fetch data from the table: "lookup.app_notification_type" */
  lookup_app_notification_type: Array<Lookup_App_Notification_Type>;
  /** fetch aggregated fields from the table: "lookup.app_notification_type" */
  lookup_app_notification_type_aggregate: Lookup_App_Notification_Type_Aggregate;
  /** fetch data from the table: "lookup.app_notification_type" using primary key columns */
  lookup_app_notification_type_by_pk?: Maybe<Lookup_App_Notification_Type>;
  /** fetch data from the table: "lookup.maintainer_visitor_space_request_status" */
  lookup_maintainer_visitor_space_request_status: Array<Lookup_Maintainer_Visitor_Space_Request_Status>;
  /** fetch aggregated fields from the table: "lookup.maintainer_visitor_space_request_status" */
  lookup_maintainer_visitor_space_request_status_aggregate: Lookup_Maintainer_Visitor_Space_Request_Status_Aggregate;
  /** fetch data from the table: "lookup.maintainer_visitor_space_request_status" using primary key columns */
  lookup_maintainer_visitor_space_request_status_by_pk?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status>;
  /** fetch data from the table: "lookup.maintainer_visitor_space_status" */
  lookup_maintainer_visitor_space_status: Array<Lookup_Maintainer_Visitor_Space_Status>;
  /** fetch aggregated fields from the table: "lookup.maintainer_visitor_space_status" */
  lookup_maintainer_visitor_space_status_aggregate: Lookup_Maintainer_Visitor_Space_Status_Aggregate;
  /** fetch data from the table: "lookup.maintainer_visitor_space_status" using primary key columns */
  lookup_maintainer_visitor_space_status_by_pk?: Maybe<Lookup_Maintainer_Visitor_Space_Status>;
  /** fetch data from the table: "lookup.schema_audience_type" */
  lookup_schema_audience_type: Array<Lookup_Schema_Audience_Type>;
  /** fetch aggregated fields from the table: "lookup.schema_audience_type" */
  lookup_schema_audience_type_aggregate: Lookup_Schema_Audience_Type_Aggregate;
  /** fetch data from the table: "lookup.schema_audience_type" using primary key columns */
  lookup_schema_audience_type_by_pk?: Maybe<Lookup_Schema_Audience_Type>;
  /** fetch data from the table: "maintainer.content_partner" */
  maintainer_content_partner: Array<Maintainer_Content_Partner>;
  /** fetch aggregated fields from the table: "maintainer.content_partner" */
  maintainer_content_partner_aggregate: Maintainer_Content_Partner_Aggregate;
  /** fetch data from the table: "maintainer.content_partner" using primary key columns */
  maintainer_content_partner_by_pk?: Maybe<Maintainer_Content_Partner>;
  /** fetch data from the table: "maintainer.index" */
  maintainer_index: Array<Maintainer_Index>;
  /** fetch aggregated fields from the table: "maintainer.index" */
  maintainer_index_aggregate: Maintainer_Index_Aggregate;
  /** fetch data from the table: "maintainer.index" using primary key columns */
  maintainer_index_by_pk?: Maybe<Maintainer_Index>;
  /** fetch data from the table: "maintainer.organisation" */
  maintainer_organisation: Array<Maintainer_Organisation>;
  /** fetch aggregated fields from the table: "maintainer.organisation" */
  maintainer_organisation_aggregate: Maintainer_Organisation_Aggregate;
  /** fetch data from the table: "maintainer.organisation" using primary key columns */
  maintainer_organisation_by_pk?: Maybe<Maintainer_Organisation>;
  /** fetch data from the table: "maintainer.users_profile" */
  maintainer_users_profile: Array<Maintainer_Users_Profile>;
  /** fetch aggregated fields from the table: "maintainer.users_profile" */
  maintainer_users_profile_aggregate: Maintainer_Users_Profile_Aggregate;
  /** fetch data from the table: "maintainer.users_profile" using primary key columns */
  maintainer_users_profile_by_pk?: Maybe<Maintainer_Users_Profile>;
  /** fetch data from the table: "maintainer.visitor_space" */
  maintainer_visitor_space: Array<Maintainer_Visitor_Space>;
  /** fetch aggregated fields from the table: "maintainer.visitor_space" */
  maintainer_visitor_space_aggregate: Maintainer_Visitor_Space_Aggregate;
  /** fetch data from the table: "maintainer.visitor_space" using primary key columns */
  maintainer_visitor_space_by_pk?: Maybe<Maintainer_Visitor_Space>;
  /** fetch data from the table: "maintainer.visitor_space_request" */
  maintainer_visitor_space_request: Array<Maintainer_Visitor_Space_Request>;
  /** fetch aggregated fields from the table: "maintainer.visitor_space_request" */
  maintainer_visitor_space_request_aggregate: Maintainer_Visitor_Space_Request_Aggregate;
  /** fetch data from the table: "maintainer.visitor_space_request" using primary key columns */
  maintainer_visitor_space_request_by_pk?: Maybe<Maintainer_Visitor_Space_Request>;
  /** fetch data from the table: "maintainer.visitor_space_request_note" */
  maintainer_visitor_space_request_note: Array<Maintainer_Visitor_Space_Request_Note>;
  /** fetch aggregated fields from the table: "maintainer.visitor_space_request_note" */
  maintainer_visitor_space_request_note_aggregate: Maintainer_Visitor_Space_Request_Note_Aggregate;
  /** fetch data from the table: "maintainer.visitor_space_request_note" using primary key columns */
  maintainer_visitor_space_request_note_by_pk?: Maybe<Maintainer_Visitor_Space_Request_Note>;
  /** fetch data from the table: "object.file" */
  object_file: Array<Object_File>;
  /** fetch aggregated fields from the table: "object.file" */
  object_file_aggregate: Object_File_Aggregate;
  /** fetch data from the table: "object.file" using primary key columns */
  object_file_by_pk?: Maybe<Object_File>;
  /** fetch data from the table: "object.ie" */
  object_ie: Array<Object_Ie>;
  /** fetch aggregated fields from the table: "object.ie" */
  object_ie_aggregate: Object_Ie_Aggregate;
  /** fetch data from the table: "object.ie" using primary key columns */
  object_ie_by_pk?: Maybe<Object_Ie>;
  /** fetch data from the table: "object.ie_index" */
  object_ie_index: Array<Object_Ie_Index>;
  /** fetch aggregated fields from the table: "object.ie_index" */
  object_ie_index_aggregate: Object_Ie_Index_Aggregate;
  /** fetch data from the table: "object.ie_is_part_of" */
  object_ie_is_part_of: Array<Object_Ie_Is_Part_Of>;
  /** fetch aggregated fields from the table: "object.ie_is_part_of" */
  object_ie_is_part_of_aggregate: Object_Ie_Is_Part_Of_Aggregate;
  /** fetch data from the table: "object.representation" */
  object_representation: Array<Object_Representation>;
  /** fetch aggregated fields from the table: "object.representation" */
  object_representation_aggregate: Object_Representation_Aggregate;
  /** fetch data from the table: "object.representation" using primary key columns */
  object_representation_by_pk?: Maybe<Object_Representation>;
  /** fetch data from the table: "sync.audio" */
  sync_audio: Array<Sync_Audio>;
  /** fetch aggregated fields from the table: "sync.audio" */
  sync_audio_aggregate: Sync_Audio_Aggregate;
  /** fetch data from the table: "sync.audio" using primary key columns */
  sync_audio_by_pk?: Maybe<Sync_Audio>;
  /** fetch data from the table: "sync.film" */
  sync_film: Array<Sync_Film>;
  /** fetch aggregated fields from the table: "sync.film" */
  sync_film_aggregate: Sync_Film_Aggregate;
  /** fetch data from the table: "sync.film" using primary key columns */
  sync_film_by_pk?: Maybe<Sync_Film>;
  /** fetch data from the table: "sync.video" */
  sync_video: Array<Sync_Video>;
  /** fetch aggregated fields from the table: "sync.video" */
  sync_video_aggregate: Sync_Video_Aggregate;
  /** fetch data from the table: "sync.video" using primary key columns */
  sync_video_by_pk?: Maybe<Sync_Video>;
  /** fetch data from the table: "users.folder" */
  users_folder: Array<Users_Folder>;
  /** fetch aggregated fields from the table: "users.folder" */
  users_folder_aggregate: Users_Folder_Aggregate;
  /** fetch data from the table: "users.folder" using primary key columns */
  users_folder_by_pk?: Maybe<Users_Folder>;
  /** fetch data from the table: "users.folder_ie" */
  users_folder_ie: Array<Users_Folder_Ie>;
  /** fetch aggregated fields from the table: "users.folder_ie" */
  users_folder_ie_aggregate: Users_Folder_Ie_Aggregate;
  /** fetch data from the table: "users.folder_ie" using primary key columns */
  users_folder_ie_by_pk?: Maybe<Users_Folder_Ie>;
  /** fetch data from the table: "users.group" */
  users_group: Array<Users_Group>;
  /** fetch aggregated fields from the table: "users.group" */
  users_group_aggregate: Users_Group_Aggregate;
  /** fetch data from the table: "users.group" using primary key columns */
  users_group_by_pk?: Maybe<Users_Group>;
  /** fetch data from the table: "users.group_permission" */
  users_group_permission: Array<Users_Group_Permission>;
  /** fetch aggregated fields from the table: "users.group_permission" */
  users_group_permission_aggregate: Users_Group_Permission_Aggregate;
  /** fetch data from the table: "users.group_permission" using primary key columns */
  users_group_permission_by_pk?: Maybe<Users_Group_Permission>;
  /** fetch data from the table: "users.identity" */
  users_identity: Array<Users_Identity>;
  /** fetch aggregated fields from the table: "users.identity" */
  users_identity_aggregate: Users_Identity_Aggregate;
  /** fetch data from the table: "users.identity" using primary key columns */
  users_identity_by_pk?: Maybe<Users_Identity>;
  /** fetch data from the table: "users.identity_provider" */
  users_identity_provider: Array<Users_Identity_Provider>;
  /** fetch aggregated fields from the table: "users.identity_provider" */
  users_identity_provider_aggregate: Users_Identity_Provider_Aggregate;
  /** fetch data from the table: "users.identity_provider" using primary key columns */
  users_identity_provider_by_pk?: Maybe<Users_Identity_Provider>;
  /** fetch data from the table: "users.permission" */
  users_permission: Array<Users_Permission>;
  /** fetch aggregated fields from the table: "users.permission" */
  users_permission_aggregate: Users_Permission_Aggregate;
  /** fetch data from the table: "users.permission" using primary key columns */
  users_permission_by_pk?: Maybe<Users_Permission>;
  /** fetch data from the table: "users.profile" */
  users_profile: Array<Users_Profile>;
  /** fetch aggregated fields from the table: "users.profile" */
  users_profile_aggregate: Users_Profile_Aggregate;
  /** fetch data from the table: "users.profile" using primary key columns */
  users_profile_by_pk?: Maybe<Users_Profile>;
};


export type Query_RootApp_ConfigArgs = {
  distinct_on?: InputMaybe<Array<App_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Config_Order_By>>;
  where?: InputMaybe<App_Config_Bool_Exp>;
};


export type Query_RootApp_Config_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Config_Order_By>>;
  where?: InputMaybe<App_Config_Bool_Exp>;
};


export type Query_RootApp_Config_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootApp_Content_BlockArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Block_Order_By>>;
  where?: InputMaybe<App_Content_Block_Bool_Exp>;
};


export type Query_RootApp_Content_Block_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Block_Order_By>>;
  where?: InputMaybe<App_Content_Block_Bool_Exp>;
};


export type Query_RootApp_Content_Block_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootApp_Content_LabelArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Label_Bool_Exp>;
};


export type Query_RootApp_Content_Label_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Label_Bool_Exp>;
};


export type Query_RootApp_Content_Label_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootApp_Content_PageArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Order_By>>;
  where?: InputMaybe<App_Content_Page_Bool_Exp>;
};


export type Query_RootApp_Content_Page_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Order_By>>;
  where?: InputMaybe<App_Content_Page_Bool_Exp>;
};


export type Query_RootApp_Content_Page_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootApp_Content_Page_Content_LabelArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
};


export type Query_RootApp_Content_Page_Content_Label_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
};


export type Query_RootApp_Content_Page_Content_Label_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootApp_NavigationArgs = {
  distinct_on?: InputMaybe<Array<App_Navigation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Navigation_Order_By>>;
  where?: InputMaybe<App_Navigation_Bool_Exp>;
};


export type Query_RootApp_Navigation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Navigation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Navigation_Order_By>>;
  where?: InputMaybe<App_Navigation_Bool_Exp>;
};


export type Query_RootApp_Navigation_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootApp_NotificationArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


export type Query_RootApp_Notification_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


export type Query_RootApp_Notification_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootLookup_App_Content_Block_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Content_Block_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Content_Block_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Content_Block_Type_Bool_Exp>;
};


export type Query_RootLookup_App_Content_Block_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Content_Block_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Content_Block_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Content_Block_Type_Bool_Exp>;
};


export type Query_RootLookup_App_Content_Block_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootLookup_App_Content_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Content_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Content_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Content_Type_Bool_Exp>;
};


export type Query_RootLookup_App_Content_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Content_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Content_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Content_Type_Bool_Exp>;
};


export type Query_RootLookup_App_Content_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootLookup_App_Notification_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Notification_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Notification_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
};


export type Query_RootLookup_App_Notification_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Notification_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Notification_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
};


export type Query_RootLookup_App_Notification_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootLookup_Maintainer_Visitor_Space_Request_StatusArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Order_By>>;
  where?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp>;
};


export type Query_RootLookup_Maintainer_Visitor_Space_Request_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Order_By>>;
  where?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp>;
};


export type Query_RootLookup_Maintainer_Visitor_Space_Request_Status_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootLookup_Maintainer_Visitor_Space_StatusArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Order_By>>;
  where?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp>;
};


export type Query_RootLookup_Maintainer_Visitor_Space_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Order_By>>;
  where?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp>;
};


export type Query_RootLookup_Maintainer_Visitor_Space_Status_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootLookup_Schema_Audience_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Schema_Audience_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Schema_Audience_Type_Order_By>>;
  where?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
};


export type Query_RootLookup_Schema_Audience_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Schema_Audience_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Schema_Audience_Type_Order_By>>;
  where?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
};


export type Query_RootLookup_Schema_Audience_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootMaintainer_Content_PartnerArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Content_Partner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Content_Partner_Order_By>>;
  where?: InputMaybe<Maintainer_Content_Partner_Bool_Exp>;
};


export type Query_RootMaintainer_Content_Partner_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Content_Partner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Content_Partner_Order_By>>;
  where?: InputMaybe<Maintainer_Content_Partner_Bool_Exp>;
};


export type Query_RootMaintainer_Content_Partner_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Query_RootMaintainer_IndexArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Index_Order_By>>;
  where?: InputMaybe<Maintainer_Index_Bool_Exp>;
};


export type Query_RootMaintainer_Index_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Index_Order_By>>;
  where?: InputMaybe<Maintainer_Index_Bool_Exp>;
};


export type Query_RootMaintainer_Index_By_PkArgs = {
  schema_maintainer_id: Scalars['String'];
};


export type Query_RootMaintainer_OrganisationArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Organisation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Organisation_Order_By>>;
  where?: InputMaybe<Maintainer_Organisation_Bool_Exp>;
};


export type Query_RootMaintainer_Organisation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Organisation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Organisation_Order_By>>;
  where?: InputMaybe<Maintainer_Organisation_Bool_Exp>;
};


export type Query_RootMaintainer_Organisation_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Query_RootMaintainer_Users_ProfileArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
};


export type Query_RootMaintainer_Users_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
};


export type Query_RootMaintainer_Users_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMaintainer_Visitor_SpaceArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Bool_Exp>;
};


export type Query_RootMaintainer_Visitor_Space_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Bool_Exp>;
};


export type Query_RootMaintainer_Visitor_Space_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMaintainer_Visitor_Space_RequestArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};


export type Query_RootMaintainer_Visitor_Space_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};


export type Query_RootMaintainer_Visitor_Space_Request_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootMaintainer_Visitor_Space_Request_NoteArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
};


export type Query_RootMaintainer_Visitor_Space_Request_Note_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
};


export type Query_RootMaintainer_Visitor_Space_Request_Note_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootObject_FileArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};


export type Query_RootObject_File_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};


export type Query_RootObject_File_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Query_RootObject_IeArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Order_By>>;
  where?: InputMaybe<Object_Ie_Bool_Exp>;
};


export type Query_RootObject_Ie_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Order_By>>;
  where?: InputMaybe<Object_Ie_Bool_Exp>;
};


export type Query_RootObject_Ie_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Query_RootObject_Ie_IndexArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Index_Order_By>>;
  where?: InputMaybe<Object_Ie_Index_Bool_Exp>;
};


export type Query_RootObject_Ie_Index_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Index_Order_By>>;
  where?: InputMaybe<Object_Ie_Index_Bool_Exp>;
};


export type Query_RootObject_Ie_Is_Part_OfArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Is_Part_Of_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Is_Part_Of_Order_By>>;
  where?: InputMaybe<Object_Ie_Is_Part_Of_Bool_Exp>;
};


export type Query_RootObject_Ie_Is_Part_Of_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Is_Part_Of_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Is_Part_Of_Order_By>>;
  where?: InputMaybe<Object_Ie_Is_Part_Of_Bool_Exp>;
};


export type Query_RootObject_RepresentationArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


export type Query_RootObject_Representation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


export type Query_RootObject_Representation_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Query_RootSync_AudioArgs = {
  distinct_on?: InputMaybe<Array<Sync_Audio_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Audio_Order_By>>;
  where?: InputMaybe<Sync_Audio_Bool_Exp>;
};


export type Query_RootSync_Audio_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Audio_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Audio_Order_By>>;
  where?: InputMaybe<Sync_Audio_Bool_Exp>;
};


export type Query_RootSync_Audio_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Query_RootSync_FilmArgs = {
  distinct_on?: InputMaybe<Array<Sync_Film_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Film_Order_By>>;
  where?: InputMaybe<Sync_Film_Bool_Exp>;
};


export type Query_RootSync_Film_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Film_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Film_Order_By>>;
  where?: InputMaybe<Sync_Film_Bool_Exp>;
};


export type Query_RootSync_Film_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Query_RootSync_VideoArgs = {
  distinct_on?: InputMaybe<Array<Sync_Video_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Video_Order_By>>;
  where?: InputMaybe<Sync_Video_Bool_Exp>;
};


export type Query_RootSync_Video_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Video_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Video_Order_By>>;
  where?: InputMaybe<Sync_Video_Bool_Exp>;
};


export type Query_RootSync_Video_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Query_RootUsers_FolderArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Order_By>>;
  where?: InputMaybe<Users_Folder_Bool_Exp>;
};


export type Query_RootUsers_Folder_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Order_By>>;
  where?: InputMaybe<Users_Folder_Bool_Exp>;
};


export type Query_RootUsers_Folder_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsers_Folder_IeArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Ie_Order_By>>;
  where?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
};


export type Query_RootUsers_Folder_Ie_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Ie_Order_By>>;
  where?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
};


export type Query_RootUsers_Folder_Ie_By_PkArgs = {
  ie_schema_identifier: Scalars['String'];
  user_collection_id: Scalars['uuid'];
};


export type Query_RootUsers_GroupArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Order_By>>;
  where?: InputMaybe<Users_Group_Bool_Exp>;
};


export type Query_RootUsers_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Order_By>>;
  where?: InputMaybe<Users_Group_Bool_Exp>;
};


export type Query_RootUsers_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsers_Group_PermissionArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


export type Query_RootUsers_Group_Permission_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


export type Query_RootUsers_Group_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsers_IdentityArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


export type Query_RootUsers_Identity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


export type Query_RootUsers_Identity_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsers_Identity_ProviderArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Provider_Order_By>>;
  where?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
};


export type Query_RootUsers_Identity_Provider_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Provider_Order_By>>;
  where?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
};


export type Query_RootUsers_Identity_Provider_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootUsers_PermissionArgs = {
  distinct_on?: InputMaybe<Array<Users_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Permission_Order_By>>;
  where?: InputMaybe<Users_Permission_Bool_Exp>;
};


export type Query_RootUsers_Permission_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Permission_Order_By>>;
  where?: InputMaybe<Users_Permission_Bool_Exp>;
};


export type Query_RootUsers_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsers_ProfileArgs = {
  distinct_on?: InputMaybe<Array<Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Profile_Order_By>>;
  where?: InputMaybe<Users_Profile_Bool_Exp>;
};


export type Query_RootUsers_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Profile_Order_By>>;
  where?: InputMaybe<Users_Profile_Bool_Exp>;
};


export type Query_RootUsers_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "app.config" */
  app_config: Array<App_Config>;
  /** fetch aggregated fields from the table: "app.config" */
  app_config_aggregate: App_Config_Aggregate;
  /** fetch data from the table: "app.config" using primary key columns */
  app_config_by_pk?: Maybe<App_Config>;
  /** fetch data from the table: "app.content_block" */
  app_content_block: Array<App_Content_Block>;
  /** fetch aggregated fields from the table: "app.content_block" */
  app_content_block_aggregate: App_Content_Block_Aggregate;
  /** fetch data from the table: "app.content_block" using primary key columns */
  app_content_block_by_pk?: Maybe<App_Content_Block>;
  /** fetch data from the table: "app.content_label" */
  app_content_label: Array<App_Content_Label>;
  /** fetch aggregated fields from the table: "app.content_label" */
  app_content_label_aggregate: App_Content_Label_Aggregate;
  /** fetch data from the table: "app.content_label" using primary key columns */
  app_content_label_by_pk?: Maybe<App_Content_Label>;
  /** fetch data from the table: "app.content_page" */
  app_content_page: Array<App_Content_Page>;
  /** fetch aggregated fields from the table: "app.content_page" */
  app_content_page_aggregate: App_Content_Page_Aggregate;
  /** fetch data from the table: "app.content_page" using primary key columns */
  app_content_page_by_pk?: Maybe<App_Content_Page>;
  /** fetch data from the table: "app.content_page_content_label" */
  app_content_page_content_label: Array<App_Content_Page_Content_Label>;
  /** fetch aggregated fields from the table: "app.content_page_content_label" */
  app_content_page_content_label_aggregate: App_Content_Page_Content_Label_Aggregate;
  /** fetch data from the table: "app.content_page_content_label" using primary key columns */
  app_content_page_content_label_by_pk?: Maybe<App_Content_Page_Content_Label>;
  /** fetch data from the table: "app.navigation" */
  app_navigation: Array<App_Navigation>;
  /** fetch aggregated fields from the table: "app.navigation" */
  app_navigation_aggregate: App_Navigation_Aggregate;
  /** fetch data from the table: "app.navigation" using primary key columns */
  app_navigation_by_pk?: Maybe<App_Navigation>;
  /** fetch data from the table: "app.notification" */
  app_notification: Array<App_Notification>;
  /** fetch aggregated fields from the table: "app.notification" */
  app_notification_aggregate: App_Notification_Aggregate;
  /** fetch data from the table: "app.notification" using primary key columns */
  app_notification_by_pk?: Maybe<App_Notification>;
  /** fetch data from the table: "lookup.app_content_block_type" */
  lookup_app_content_block_type: Array<Lookup_App_Content_Block_Type>;
  /** fetch aggregated fields from the table: "lookup.app_content_block_type" */
  lookup_app_content_block_type_aggregate: Lookup_App_Content_Block_Type_Aggregate;
  /** fetch data from the table: "lookup.app_content_block_type" using primary key columns */
  lookup_app_content_block_type_by_pk?: Maybe<Lookup_App_Content_Block_Type>;
  /** fetch data from the table: "lookup.app_content_type" */
  lookup_app_content_type: Array<Lookup_App_Content_Type>;
  /** fetch aggregated fields from the table: "lookup.app_content_type" */
  lookup_app_content_type_aggregate: Lookup_App_Content_Type_Aggregate;
  /** fetch data from the table: "lookup.app_content_type" using primary key columns */
  lookup_app_content_type_by_pk?: Maybe<Lookup_App_Content_Type>;
  /** fetch data from the table: "lookup.app_notification_type" */
  lookup_app_notification_type: Array<Lookup_App_Notification_Type>;
  /** fetch aggregated fields from the table: "lookup.app_notification_type" */
  lookup_app_notification_type_aggregate: Lookup_App_Notification_Type_Aggregate;
  /** fetch data from the table: "lookup.app_notification_type" using primary key columns */
  lookup_app_notification_type_by_pk?: Maybe<Lookup_App_Notification_Type>;
  /** fetch data from the table: "lookup.maintainer_visitor_space_request_status" */
  lookup_maintainer_visitor_space_request_status: Array<Lookup_Maintainer_Visitor_Space_Request_Status>;
  /** fetch aggregated fields from the table: "lookup.maintainer_visitor_space_request_status" */
  lookup_maintainer_visitor_space_request_status_aggregate: Lookup_Maintainer_Visitor_Space_Request_Status_Aggregate;
  /** fetch data from the table: "lookup.maintainer_visitor_space_request_status" using primary key columns */
  lookup_maintainer_visitor_space_request_status_by_pk?: Maybe<Lookup_Maintainer_Visitor_Space_Request_Status>;
  /** fetch data from the table: "lookup.maintainer_visitor_space_status" */
  lookup_maintainer_visitor_space_status: Array<Lookup_Maintainer_Visitor_Space_Status>;
  /** fetch aggregated fields from the table: "lookup.maintainer_visitor_space_status" */
  lookup_maintainer_visitor_space_status_aggregate: Lookup_Maintainer_Visitor_Space_Status_Aggregate;
  /** fetch data from the table: "lookup.maintainer_visitor_space_status" using primary key columns */
  lookup_maintainer_visitor_space_status_by_pk?: Maybe<Lookup_Maintainer_Visitor_Space_Status>;
  /** fetch data from the table: "lookup.schema_audience_type" */
  lookup_schema_audience_type: Array<Lookup_Schema_Audience_Type>;
  /** fetch aggregated fields from the table: "lookup.schema_audience_type" */
  lookup_schema_audience_type_aggregate: Lookup_Schema_Audience_Type_Aggregate;
  /** fetch data from the table: "lookup.schema_audience_type" using primary key columns */
  lookup_schema_audience_type_by_pk?: Maybe<Lookup_Schema_Audience_Type>;
  /** fetch data from the table: "maintainer.content_partner" */
  maintainer_content_partner: Array<Maintainer_Content_Partner>;
  /** fetch aggregated fields from the table: "maintainer.content_partner" */
  maintainer_content_partner_aggregate: Maintainer_Content_Partner_Aggregate;
  /** fetch data from the table: "maintainer.content_partner" using primary key columns */
  maintainer_content_partner_by_pk?: Maybe<Maintainer_Content_Partner>;
  /** fetch data from the table: "maintainer.index" */
  maintainer_index: Array<Maintainer_Index>;
  /** fetch aggregated fields from the table: "maintainer.index" */
  maintainer_index_aggregate: Maintainer_Index_Aggregate;
  /** fetch data from the table: "maintainer.index" using primary key columns */
  maintainer_index_by_pk?: Maybe<Maintainer_Index>;
  /** fetch data from the table: "maintainer.organisation" */
  maintainer_organisation: Array<Maintainer_Organisation>;
  /** fetch aggregated fields from the table: "maintainer.organisation" */
  maintainer_organisation_aggregate: Maintainer_Organisation_Aggregate;
  /** fetch data from the table: "maintainer.organisation" using primary key columns */
  maintainer_organisation_by_pk?: Maybe<Maintainer_Organisation>;
  /** fetch data from the table: "maintainer.users_profile" */
  maintainer_users_profile: Array<Maintainer_Users_Profile>;
  /** fetch aggregated fields from the table: "maintainer.users_profile" */
  maintainer_users_profile_aggregate: Maintainer_Users_Profile_Aggregate;
  /** fetch data from the table: "maintainer.users_profile" using primary key columns */
  maintainer_users_profile_by_pk?: Maybe<Maintainer_Users_Profile>;
  /** fetch data from the table: "maintainer.visitor_space" */
  maintainer_visitor_space: Array<Maintainer_Visitor_Space>;
  /** fetch aggregated fields from the table: "maintainer.visitor_space" */
  maintainer_visitor_space_aggregate: Maintainer_Visitor_Space_Aggregate;
  /** fetch data from the table: "maintainer.visitor_space" using primary key columns */
  maintainer_visitor_space_by_pk?: Maybe<Maintainer_Visitor_Space>;
  /** fetch data from the table: "maintainer.visitor_space_request" */
  maintainer_visitor_space_request: Array<Maintainer_Visitor_Space_Request>;
  /** fetch aggregated fields from the table: "maintainer.visitor_space_request" */
  maintainer_visitor_space_request_aggregate: Maintainer_Visitor_Space_Request_Aggregate;
  /** fetch data from the table: "maintainer.visitor_space_request" using primary key columns */
  maintainer_visitor_space_request_by_pk?: Maybe<Maintainer_Visitor_Space_Request>;
  /** fetch data from the table: "maintainer.visitor_space_request_note" */
  maintainer_visitor_space_request_note: Array<Maintainer_Visitor_Space_Request_Note>;
  /** fetch aggregated fields from the table: "maintainer.visitor_space_request_note" */
  maintainer_visitor_space_request_note_aggregate: Maintainer_Visitor_Space_Request_Note_Aggregate;
  /** fetch data from the table: "maintainer.visitor_space_request_note" using primary key columns */
  maintainer_visitor_space_request_note_by_pk?: Maybe<Maintainer_Visitor_Space_Request_Note>;
  /** fetch data from the table: "object.file" */
  object_file: Array<Object_File>;
  /** fetch aggregated fields from the table: "object.file" */
  object_file_aggregate: Object_File_Aggregate;
  /** fetch data from the table: "object.file" using primary key columns */
  object_file_by_pk?: Maybe<Object_File>;
  /** fetch data from the table: "object.ie" */
  object_ie: Array<Object_Ie>;
  /** fetch aggregated fields from the table: "object.ie" */
  object_ie_aggregate: Object_Ie_Aggregate;
  /** fetch data from the table: "object.ie" using primary key columns */
  object_ie_by_pk?: Maybe<Object_Ie>;
  /** fetch data from the table: "object.ie_index" */
  object_ie_index: Array<Object_Ie_Index>;
  /** fetch aggregated fields from the table: "object.ie_index" */
  object_ie_index_aggregate: Object_Ie_Index_Aggregate;
  /** fetch data from the table: "object.ie_is_part_of" */
  object_ie_is_part_of: Array<Object_Ie_Is_Part_Of>;
  /** fetch aggregated fields from the table: "object.ie_is_part_of" */
  object_ie_is_part_of_aggregate: Object_Ie_Is_Part_Of_Aggregate;
  /** fetch data from the table: "object.representation" */
  object_representation: Array<Object_Representation>;
  /** fetch aggregated fields from the table: "object.representation" */
  object_representation_aggregate: Object_Representation_Aggregate;
  /** fetch data from the table: "object.representation" using primary key columns */
  object_representation_by_pk?: Maybe<Object_Representation>;
  /** fetch data from the table: "sync.audio" */
  sync_audio: Array<Sync_Audio>;
  /** fetch aggregated fields from the table: "sync.audio" */
  sync_audio_aggregate: Sync_Audio_Aggregate;
  /** fetch data from the table: "sync.audio" using primary key columns */
  sync_audio_by_pk?: Maybe<Sync_Audio>;
  /** fetch data from the table: "sync.film" */
  sync_film: Array<Sync_Film>;
  /** fetch aggregated fields from the table: "sync.film" */
  sync_film_aggregate: Sync_Film_Aggregate;
  /** fetch data from the table: "sync.film" using primary key columns */
  sync_film_by_pk?: Maybe<Sync_Film>;
  /** fetch data from the table: "sync.video" */
  sync_video: Array<Sync_Video>;
  /** fetch aggregated fields from the table: "sync.video" */
  sync_video_aggregate: Sync_Video_Aggregate;
  /** fetch data from the table: "sync.video" using primary key columns */
  sync_video_by_pk?: Maybe<Sync_Video>;
  /** fetch data from the table: "users.folder" */
  users_folder: Array<Users_Folder>;
  /** fetch aggregated fields from the table: "users.folder" */
  users_folder_aggregate: Users_Folder_Aggregate;
  /** fetch data from the table: "users.folder" using primary key columns */
  users_folder_by_pk?: Maybe<Users_Folder>;
  /** fetch data from the table: "users.folder_ie" */
  users_folder_ie: Array<Users_Folder_Ie>;
  /** fetch aggregated fields from the table: "users.folder_ie" */
  users_folder_ie_aggregate: Users_Folder_Ie_Aggregate;
  /** fetch data from the table: "users.folder_ie" using primary key columns */
  users_folder_ie_by_pk?: Maybe<Users_Folder_Ie>;
  /** fetch data from the table: "users.group" */
  users_group: Array<Users_Group>;
  /** fetch aggregated fields from the table: "users.group" */
  users_group_aggregate: Users_Group_Aggregate;
  /** fetch data from the table: "users.group" using primary key columns */
  users_group_by_pk?: Maybe<Users_Group>;
  /** fetch data from the table: "users.group_permission" */
  users_group_permission: Array<Users_Group_Permission>;
  /** fetch aggregated fields from the table: "users.group_permission" */
  users_group_permission_aggregate: Users_Group_Permission_Aggregate;
  /** fetch data from the table: "users.group_permission" using primary key columns */
  users_group_permission_by_pk?: Maybe<Users_Group_Permission>;
  /** fetch data from the table: "users.identity" */
  users_identity: Array<Users_Identity>;
  /** fetch aggregated fields from the table: "users.identity" */
  users_identity_aggregate: Users_Identity_Aggregate;
  /** fetch data from the table: "users.identity" using primary key columns */
  users_identity_by_pk?: Maybe<Users_Identity>;
  /** fetch data from the table: "users.identity_provider" */
  users_identity_provider: Array<Users_Identity_Provider>;
  /** fetch aggregated fields from the table: "users.identity_provider" */
  users_identity_provider_aggregate: Users_Identity_Provider_Aggregate;
  /** fetch data from the table: "users.identity_provider" using primary key columns */
  users_identity_provider_by_pk?: Maybe<Users_Identity_Provider>;
  /** fetch data from the table: "users.permission" */
  users_permission: Array<Users_Permission>;
  /** fetch aggregated fields from the table: "users.permission" */
  users_permission_aggregate: Users_Permission_Aggregate;
  /** fetch data from the table: "users.permission" using primary key columns */
  users_permission_by_pk?: Maybe<Users_Permission>;
  /** fetch data from the table: "users.profile" */
  users_profile: Array<Users_Profile>;
  /** fetch aggregated fields from the table: "users.profile" */
  users_profile_aggregate: Users_Profile_Aggregate;
  /** fetch data from the table: "users.profile" using primary key columns */
  users_profile_by_pk?: Maybe<Users_Profile>;
};


export type Subscription_RootApp_ConfigArgs = {
  distinct_on?: InputMaybe<Array<App_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Config_Order_By>>;
  where?: InputMaybe<App_Config_Bool_Exp>;
};


export type Subscription_RootApp_Config_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Config_Order_By>>;
  where?: InputMaybe<App_Config_Bool_Exp>;
};


export type Subscription_RootApp_Config_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootApp_Content_BlockArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Block_Order_By>>;
  where?: InputMaybe<App_Content_Block_Bool_Exp>;
};


export type Subscription_RootApp_Content_Block_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Block_Order_By>>;
  where?: InputMaybe<App_Content_Block_Bool_Exp>;
};


export type Subscription_RootApp_Content_Block_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootApp_Content_LabelArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Label_Bool_Exp>;
};


export type Subscription_RootApp_Content_Label_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Label_Bool_Exp>;
};


export type Subscription_RootApp_Content_Label_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootApp_Content_PageArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Order_By>>;
  where?: InputMaybe<App_Content_Page_Bool_Exp>;
};


export type Subscription_RootApp_Content_Page_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Order_By>>;
  where?: InputMaybe<App_Content_Page_Bool_Exp>;
};


export type Subscription_RootApp_Content_Page_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootApp_Content_Page_Content_LabelArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
};


export type Subscription_RootApp_Content_Page_Content_Label_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Content_Page_Content_Label_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Content_Page_Content_Label_Order_By>>;
  where?: InputMaybe<App_Content_Page_Content_Label_Bool_Exp>;
};


export type Subscription_RootApp_Content_Page_Content_Label_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootApp_NavigationArgs = {
  distinct_on?: InputMaybe<Array<App_Navigation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Navigation_Order_By>>;
  where?: InputMaybe<App_Navigation_Bool_Exp>;
};


export type Subscription_RootApp_Navigation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Navigation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Navigation_Order_By>>;
  where?: InputMaybe<App_Navigation_Bool_Exp>;
};


export type Subscription_RootApp_Navigation_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootApp_NotificationArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


export type Subscription_RootApp_Notification_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


export type Subscription_RootApp_Notification_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootLookup_App_Content_Block_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Content_Block_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Content_Block_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Content_Block_Type_Bool_Exp>;
};


export type Subscription_RootLookup_App_Content_Block_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Content_Block_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Content_Block_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Content_Block_Type_Bool_Exp>;
};


export type Subscription_RootLookup_App_Content_Block_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootLookup_App_Content_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Content_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Content_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Content_Type_Bool_Exp>;
};


export type Subscription_RootLookup_App_Content_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Content_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Content_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Content_Type_Bool_Exp>;
};


export type Subscription_RootLookup_App_Content_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootLookup_App_Notification_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Notification_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Notification_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
};


export type Subscription_RootLookup_App_Notification_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Notification_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Notification_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
};


export type Subscription_RootLookup_App_Notification_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootLookup_Maintainer_Visitor_Space_Request_StatusArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Order_By>>;
  where?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp>;
};


export type Subscription_RootLookup_Maintainer_Visitor_Space_Request_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Request_Status_Order_By>>;
  where?: InputMaybe<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp>;
};


export type Subscription_RootLookup_Maintainer_Visitor_Space_Request_Status_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootLookup_Maintainer_Visitor_Space_StatusArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Order_By>>;
  where?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp>;
};


export type Subscription_RootLookup_Maintainer_Visitor_Space_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Maintainer_Visitor_Space_Status_Order_By>>;
  where?: InputMaybe<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp>;
};


export type Subscription_RootLookup_Maintainer_Visitor_Space_Status_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootLookup_Schema_Audience_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Schema_Audience_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Schema_Audience_Type_Order_By>>;
  where?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
};


export type Subscription_RootLookup_Schema_Audience_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Schema_Audience_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Schema_Audience_Type_Order_By>>;
  where?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
};


export type Subscription_RootLookup_Schema_Audience_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootMaintainer_Content_PartnerArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Content_Partner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Content_Partner_Order_By>>;
  where?: InputMaybe<Maintainer_Content_Partner_Bool_Exp>;
};


export type Subscription_RootMaintainer_Content_Partner_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Content_Partner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Content_Partner_Order_By>>;
  where?: InputMaybe<Maintainer_Content_Partner_Bool_Exp>;
};


export type Subscription_RootMaintainer_Content_Partner_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Subscription_RootMaintainer_IndexArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Index_Order_By>>;
  where?: InputMaybe<Maintainer_Index_Bool_Exp>;
};


export type Subscription_RootMaintainer_Index_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Index_Order_By>>;
  where?: InputMaybe<Maintainer_Index_Bool_Exp>;
};


export type Subscription_RootMaintainer_Index_By_PkArgs = {
  schema_maintainer_id: Scalars['String'];
};


export type Subscription_RootMaintainer_OrganisationArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Organisation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Organisation_Order_By>>;
  where?: InputMaybe<Maintainer_Organisation_Bool_Exp>;
};


export type Subscription_RootMaintainer_Organisation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Organisation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Organisation_Order_By>>;
  where?: InputMaybe<Maintainer_Organisation_Bool_Exp>;
};


export type Subscription_RootMaintainer_Organisation_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Subscription_RootMaintainer_Users_ProfileArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
};


export type Subscription_RootMaintainer_Users_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
};


export type Subscription_RootMaintainer_Users_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMaintainer_Visitor_SpaceArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Bool_Exp>;
};


export type Subscription_RootMaintainer_Visitor_Space_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Bool_Exp>;
};


export type Subscription_RootMaintainer_Visitor_Space_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMaintainer_Visitor_Space_RequestArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};


export type Subscription_RootMaintainer_Visitor_Space_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};


export type Subscription_RootMaintainer_Visitor_Space_Request_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootMaintainer_Visitor_Space_Request_NoteArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
};


export type Subscription_RootMaintainer_Visitor_Space_Request_Note_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
};


export type Subscription_RootMaintainer_Visitor_Space_Request_Note_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootObject_FileArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};


export type Subscription_RootObject_File_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};


export type Subscription_RootObject_File_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Subscription_RootObject_IeArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Order_By>>;
  where?: InputMaybe<Object_Ie_Bool_Exp>;
};


export type Subscription_RootObject_Ie_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Order_By>>;
  where?: InputMaybe<Object_Ie_Bool_Exp>;
};


export type Subscription_RootObject_Ie_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Subscription_RootObject_Ie_IndexArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Index_Order_By>>;
  where?: InputMaybe<Object_Ie_Index_Bool_Exp>;
};


export type Subscription_RootObject_Ie_Index_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Index_Order_By>>;
  where?: InputMaybe<Object_Ie_Index_Bool_Exp>;
};


export type Subscription_RootObject_Ie_Is_Part_OfArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Is_Part_Of_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Is_Part_Of_Order_By>>;
  where?: InputMaybe<Object_Ie_Is_Part_Of_Bool_Exp>;
};


export type Subscription_RootObject_Ie_Is_Part_Of_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Is_Part_Of_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Is_Part_Of_Order_By>>;
  where?: InputMaybe<Object_Ie_Is_Part_Of_Bool_Exp>;
};


export type Subscription_RootObject_RepresentationArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


export type Subscription_RootObject_Representation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


export type Subscription_RootObject_Representation_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Subscription_RootSync_AudioArgs = {
  distinct_on?: InputMaybe<Array<Sync_Audio_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Audio_Order_By>>;
  where?: InputMaybe<Sync_Audio_Bool_Exp>;
};


export type Subscription_RootSync_Audio_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Audio_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Audio_Order_By>>;
  where?: InputMaybe<Sync_Audio_Bool_Exp>;
};


export type Subscription_RootSync_Audio_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Subscription_RootSync_FilmArgs = {
  distinct_on?: InputMaybe<Array<Sync_Film_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Film_Order_By>>;
  where?: InputMaybe<Sync_Film_Bool_Exp>;
};


export type Subscription_RootSync_Film_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Film_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Film_Order_By>>;
  where?: InputMaybe<Sync_Film_Bool_Exp>;
};


export type Subscription_RootSync_Film_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Subscription_RootSync_VideoArgs = {
  distinct_on?: InputMaybe<Array<Sync_Video_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Video_Order_By>>;
  where?: InputMaybe<Sync_Video_Bool_Exp>;
};


export type Subscription_RootSync_Video_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Video_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Video_Order_By>>;
  where?: InputMaybe<Sync_Video_Bool_Exp>;
};


export type Subscription_RootSync_Video_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Subscription_RootUsers_FolderArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Order_By>>;
  where?: InputMaybe<Users_Folder_Bool_Exp>;
};


export type Subscription_RootUsers_Folder_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Order_By>>;
  where?: InputMaybe<Users_Folder_Bool_Exp>;
};


export type Subscription_RootUsers_Folder_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsers_Folder_IeArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Ie_Order_By>>;
  where?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
};


export type Subscription_RootUsers_Folder_Ie_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Ie_Order_By>>;
  where?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
};


export type Subscription_RootUsers_Folder_Ie_By_PkArgs = {
  ie_schema_identifier: Scalars['String'];
  user_collection_id: Scalars['uuid'];
};


export type Subscription_RootUsers_GroupArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Order_By>>;
  where?: InputMaybe<Users_Group_Bool_Exp>;
};


export type Subscription_RootUsers_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Order_By>>;
  where?: InputMaybe<Users_Group_Bool_Exp>;
};


export type Subscription_RootUsers_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsers_Group_PermissionArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


export type Subscription_RootUsers_Group_Permission_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


export type Subscription_RootUsers_Group_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsers_IdentityArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


export type Subscription_RootUsers_Identity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


export type Subscription_RootUsers_Identity_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsers_Identity_ProviderArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Provider_Order_By>>;
  where?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
};


export type Subscription_RootUsers_Identity_Provider_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Provider_Order_By>>;
  where?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
};


export type Subscription_RootUsers_Identity_Provider_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootUsers_PermissionArgs = {
  distinct_on?: InputMaybe<Array<Users_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Permission_Order_By>>;
  where?: InputMaybe<Users_Permission_Bool_Exp>;
};


export type Subscription_RootUsers_Permission_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Permission_Order_By>>;
  where?: InputMaybe<Users_Permission_Bool_Exp>;
};


export type Subscription_RootUsers_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsers_ProfileArgs = {
  distinct_on?: InputMaybe<Array<Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Profile_Order_By>>;
  where?: InputMaybe<Users_Profile_Bool_Exp>;
};


export type Subscription_RootUsers_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Profile_Order_By>>;
  where?: InputMaybe<Users_Profile_Bool_Exp>;
};


export type Subscription_RootUsers_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};

/** columns and relationships of "sync.audio" */
export type Sync_Audio = {
  __typename?: 'sync_audio';
  created_at: Scalars['timestamptz'];
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data: Scalars['jsonb'];
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
  /** De meemoo pid of external_id */
  schema_identifier: Scalars['String'];
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id: Scalars['String'];
  /** De human readable titel van het object */
  schema_name: Scalars['String'];
  status: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "sync.audio" */
export type Sync_AudioDataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "sync.audio" */
export type Sync_Audio_Aggregate = {
  __typename?: 'sync_audio_aggregate';
  aggregate?: Maybe<Sync_Audio_Aggregate_Fields>;
  nodes: Array<Sync_Audio>;
};

/** aggregate fields of "sync.audio" */
export type Sync_Audio_Aggregate_Fields = {
  __typename?: 'sync_audio_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Sync_Audio_Max_Fields>;
  min?: Maybe<Sync_Audio_Min_Fields>;
};


/** aggregate fields of "sync.audio" */
export type Sync_Audio_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sync_Audio_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Sync_Audio_Append_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "sync.audio". All fields are combined with a logical 'AND'. */
export type Sync_Audio_Bool_Exp = {
  _and?: InputMaybe<Array<Sync_Audio_Bool_Exp>>;
  _not?: InputMaybe<Sync_Audio_Bool_Exp>;
  _or?: InputMaybe<Array<Sync_Audio_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  meemoo_fragment_id?: InputMaybe<String_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "sync.audio" */
export enum Sync_Audio_Constraint {
  /** unique or primary key constraint */
  AudioPkey = 'audio_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Sync_Audio_Delete_At_Path_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Sync_Audio_Delete_Elem_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Sync_Audio_Delete_Key_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "sync.audio" */
export type Sync_Audio_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Sync_Audio_Max_Fields = {
  __typename?: 'sync_audio_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Sync_Audio_Min_Fields = {
  __typename?: 'sync_audio_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "sync.audio" */
export type Sync_Audio_Mutation_Response = {
  __typename?: 'sync_audio_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Sync_Audio>;
};

/** on_conflict condition type for table "sync.audio" */
export type Sync_Audio_On_Conflict = {
  constraint: Sync_Audio_Constraint;
  update_columns?: Array<Sync_Audio_Update_Column>;
  where?: InputMaybe<Sync_Audio_Bool_Exp>;
};

/** Ordering options when selecting data from "sync.audio". */
export type Sync_Audio_Order_By = {
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  meemoo_fragment_id?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sync_audio */
export type Sync_Audio_Pk_Columns_Input = {
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Sync_Audio_Prepend_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "sync.audio" */
export enum Sync_Audio_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "sync.audio" */
export type Sync_Audio_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "sync.audio" */
export enum Sync_Audio_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "sync.film" */
export type Sync_Film = {
  __typename?: 'sync_film';
  created_at: Scalars['timestamptz'];
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data: Scalars['jsonb'];
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
  /** De meemoo pid of external_id */
  schema_identifier: Scalars['String'];
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id: Scalars['String'];
  /** De human readable titel van het object */
  schema_name: Scalars['String'];
  status: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "sync.film" */
export type Sync_FilmDataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "sync.film" */
export type Sync_Film_Aggregate = {
  __typename?: 'sync_film_aggregate';
  aggregate?: Maybe<Sync_Film_Aggregate_Fields>;
  nodes: Array<Sync_Film>;
};

/** aggregate fields of "sync.film" */
export type Sync_Film_Aggregate_Fields = {
  __typename?: 'sync_film_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Sync_Film_Max_Fields>;
  min?: Maybe<Sync_Film_Min_Fields>;
};


/** aggregate fields of "sync.film" */
export type Sync_Film_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sync_Film_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Sync_Film_Append_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "sync.film". All fields are combined with a logical 'AND'. */
export type Sync_Film_Bool_Exp = {
  _and?: InputMaybe<Array<Sync_Film_Bool_Exp>>;
  _not?: InputMaybe<Sync_Film_Bool_Exp>;
  _or?: InputMaybe<Array<Sync_Film_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  meemoo_fragment_id?: InputMaybe<String_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "sync.film" */
export enum Sync_Film_Constraint {
  /** unique or primary key constraint */
  FilmComplexPkey = 'film_complex_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Sync_Film_Delete_At_Path_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Sync_Film_Delete_Elem_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Sync_Film_Delete_Key_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "sync.film" */
export type Sync_Film_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Sync_Film_Max_Fields = {
  __typename?: 'sync_film_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Sync_Film_Min_Fields = {
  __typename?: 'sync_film_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "sync.film" */
export type Sync_Film_Mutation_Response = {
  __typename?: 'sync_film_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Sync_Film>;
};

/** on_conflict condition type for table "sync.film" */
export type Sync_Film_On_Conflict = {
  constraint: Sync_Film_Constraint;
  update_columns?: Array<Sync_Film_Update_Column>;
  where?: InputMaybe<Sync_Film_Bool_Exp>;
};

/** Ordering options when selecting data from "sync.film". */
export type Sync_Film_Order_By = {
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  meemoo_fragment_id?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sync_film */
export type Sync_Film_Pk_Columns_Input = {
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Sync_Film_Prepend_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "sync.film" */
export enum Sync_Film_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "sync.film" */
export type Sync_Film_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "sync.film" */
export enum Sync_Film_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Sync table for video objects */
export type Sync_Video = {
  __typename?: 'sync_video';
  created_at: Scalars['timestamptz'];
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data: Scalars['jsonb'];
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
  /** De meemoo pid of external_id */
  schema_identifier: Scalars['String'];
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id: Scalars['String'];
  /** De human readable titel van het object */
  schema_name: Scalars['String'];
  status: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** Sync table for video objects */
export type Sync_VideoDataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "sync.video" */
export type Sync_Video_Aggregate = {
  __typename?: 'sync_video_aggregate';
  aggregate?: Maybe<Sync_Video_Aggregate_Fields>;
  nodes: Array<Sync_Video>;
};

/** aggregate fields of "sync.video" */
export type Sync_Video_Aggregate_Fields = {
  __typename?: 'sync_video_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Sync_Video_Max_Fields>;
  min?: Maybe<Sync_Video_Min_Fields>;
};


/** aggregate fields of "sync.video" */
export type Sync_Video_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sync_Video_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Sync_Video_Append_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "sync.video". All fields are combined with a logical 'AND'. */
export type Sync_Video_Bool_Exp = {
  _and?: InputMaybe<Array<Sync_Video_Bool_Exp>>;
  _not?: InputMaybe<Sync_Video_Bool_Exp>;
  _or?: InputMaybe<Array<Sync_Video_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  meemoo_fragment_id?: InputMaybe<String_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "sync.video" */
export enum Sync_Video_Constraint {
  /** unique or primary key constraint */
  VideoPkey = 'video_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Sync_Video_Delete_At_Path_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Sync_Video_Delete_Elem_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Sync_Video_Delete_Key_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "sync.video" */
export type Sync_Video_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Sync_Video_Max_Fields = {
  __typename?: 'sync_video_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Sync_Video_Min_Fields = {
  __typename?: 'sync_video_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "sync.video" */
export type Sync_Video_Mutation_Response = {
  __typename?: 'sync_video_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Sync_Video>;
};

/** on_conflict condition type for table "sync.video" */
export type Sync_Video_On_Conflict = {
  constraint: Sync_Video_Constraint;
  update_columns?: Array<Sync_Video_Update_Column>;
  where?: InputMaybe<Sync_Video_Bool_Exp>;
};

/** Ordering options when selecting data from "sync.video". */
export type Sync_Video_Order_By = {
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  meemoo_fragment_id?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sync_video */
export type Sync_Video_Pk_Columns_Input = {
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Sync_Video_Prepend_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "sync.video" */
export enum Sync_Video_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "sync.video" */
export type Sync_Video_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "sync.video" */
export enum Sync_Video_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "time". All fields are combined with logical 'AND'. */
export type Time_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['time']>;
  _gt?: InputMaybe<Scalars['time']>;
  _gte?: InputMaybe<Scalars['time']>;
  _in?: InputMaybe<Array<Scalars['time']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['time']>;
  _lte?: InputMaybe<Scalars['time']>;
  _neq?: InputMaybe<Scalars['time']>;
  _nin?: InputMaybe<Array<Scalars['time']>>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']>;
  _gt?: InputMaybe<Scalars['timestamp']>;
  _gte?: InputMaybe<Scalars['timestamp']>;
  _in?: InputMaybe<Array<Scalars['timestamp']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamp']>;
  _lte?: InputMaybe<Scalars['timestamp']>;
  _neq?: InputMaybe<Scalars['timestamp']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** Verzamelingen van items aangemaakt door gebruikers zoals favorieten */
export type Users_Folder = {
  __typename?: 'users_folder';
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  /** An array relationship */
  ies: Array<Users_Folder_Ie>;
  /** An aggregate relationship */
  ies_aggregate: Users_Folder_Ie_Aggregate;
  is_default?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  /** An object relationship */
  user_profile: Users_Profile;
  user_profile_id: Scalars['uuid'];
};


/** Verzamelingen van items aangemaakt door gebruikers zoals favorieten */
export type Users_FolderIesArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Ie_Order_By>>;
  where?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
};


/** Verzamelingen van items aangemaakt door gebruikers zoals favorieten */
export type Users_FolderIes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Ie_Order_By>>;
  where?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
};

/** aggregated selection of "users.folder" */
export type Users_Folder_Aggregate = {
  __typename?: 'users_folder_aggregate';
  aggregate?: Maybe<Users_Folder_Aggregate_Fields>;
  nodes: Array<Users_Folder>;
};

/** aggregate fields of "users.folder" */
export type Users_Folder_Aggregate_Fields = {
  __typename?: 'users_folder_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Folder_Max_Fields>;
  min?: Maybe<Users_Folder_Min_Fields>;
};


/** aggregate fields of "users.folder" */
export type Users_Folder_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Folder_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users.folder" */
export type Users_Folder_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Folder_Max_Order_By>;
  min?: InputMaybe<Users_Folder_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users.folder" */
export type Users_Folder_Arr_Rel_Insert_Input = {
  data: Array<Users_Folder_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Folder_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users.folder". All fields are combined with a logical 'AND'. */
export type Users_Folder_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Folder_Bool_Exp>>;
  _not?: InputMaybe<Users_Folder_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Folder_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  ies?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
  is_default?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  user_profile?: InputMaybe<Users_Profile_Bool_Exp>;
  user_profile_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.folder" */
export enum Users_Folder_Constraint {
  /** unique or primary key constraint */
  CollectionPkey = 'collection_pkey'
}

/** Koppeltabel tussen user collections en object ie */
export type Users_Folder_Ie = {
  __typename?: 'users_folder_ie';
  /** An object relationship */
  collection: Users_Folder;
  created_at: Scalars['timestamp'];
  /** An object relationship */
  ie: Object_Ie;
  /** de fragment id van de ie */
  ie_schema_identifier: Scalars['String'];
  updated_at: Scalars['timestamp'];
  user_collection_id: Scalars['uuid'];
};

/** aggregated selection of "users.folder_ie" */
export type Users_Folder_Ie_Aggregate = {
  __typename?: 'users_folder_ie_aggregate';
  aggregate?: Maybe<Users_Folder_Ie_Aggregate_Fields>;
  nodes: Array<Users_Folder_Ie>;
};

/** aggregate fields of "users.folder_ie" */
export type Users_Folder_Ie_Aggregate_Fields = {
  __typename?: 'users_folder_ie_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Folder_Ie_Max_Fields>;
  min?: Maybe<Users_Folder_Ie_Min_Fields>;
};


/** aggregate fields of "users.folder_ie" */
export type Users_Folder_Ie_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Folder_Ie_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users.folder_ie" */
export type Users_Folder_Ie_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Folder_Ie_Max_Order_By>;
  min?: InputMaybe<Users_Folder_Ie_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users.folder_ie" */
export type Users_Folder_Ie_Arr_Rel_Insert_Input = {
  data: Array<Users_Folder_Ie_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Folder_Ie_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users.folder_ie". All fields are combined with a logical 'AND'. */
export type Users_Folder_Ie_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Folder_Ie_Bool_Exp>>;
  _not?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Folder_Ie_Bool_Exp>>;
  collection?: InputMaybe<Users_Folder_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  ie?: InputMaybe<Object_Ie_Bool_Exp>;
  ie_schema_identifier?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  user_collection_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.folder_ie" */
export enum Users_Folder_Ie_Constraint {
  /** unique or primary key constraint */
  CollectionItemPkey = 'collection_item_pkey'
}

/** input type for inserting data into table "users.folder_ie" */
export type Users_Folder_Ie_Insert_Input = {
  collection?: InputMaybe<Users_Folder_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  ie?: InputMaybe<Object_Ie_Obj_Rel_Insert_Input>;
  /** de fragment id van de ie */
  ie_schema_identifier?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  user_collection_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Users_Folder_Ie_Max_Fields = {
  __typename?: 'users_folder_ie_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  /** de fragment id van de ie */
  ie_schema_identifier?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  user_collection_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "users.folder_ie" */
export type Users_Folder_Ie_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** de fragment id van de ie */
  ie_schema_identifier?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_collection_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Folder_Ie_Min_Fields = {
  __typename?: 'users_folder_ie_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  /** de fragment id van de ie */
  ie_schema_identifier?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  user_collection_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "users.folder_ie" */
export type Users_Folder_Ie_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** de fragment id van de ie */
  ie_schema_identifier?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_collection_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "users.folder_ie" */
export type Users_Folder_Ie_Mutation_Response = {
  __typename?: 'users_folder_ie_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Folder_Ie>;
};

/** on_conflict condition type for table "users.folder_ie" */
export type Users_Folder_Ie_On_Conflict = {
  constraint: Users_Folder_Ie_Constraint;
  update_columns?: Array<Users_Folder_Ie_Update_Column>;
  where?: InputMaybe<Users_Folder_Ie_Bool_Exp>;
};

/** Ordering options when selecting data from "users.folder_ie". */
export type Users_Folder_Ie_Order_By = {
  collection?: InputMaybe<Users_Folder_Order_By>;
  created_at?: InputMaybe<Order_By>;
  ie?: InputMaybe<Object_Ie_Order_By>;
  ie_schema_identifier?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_collection_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_folder_ie */
export type Users_Folder_Ie_Pk_Columns_Input = {
  /** de fragment id van de ie */
  ie_schema_identifier: Scalars['String'];
  user_collection_id: Scalars['uuid'];
};

/** select columns of table "users.folder_ie" */
export enum Users_Folder_Ie_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IeSchemaIdentifier = 'ie_schema_identifier',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserCollectionId = 'user_collection_id'
}

/** input type for updating data in table "users.folder_ie" */
export type Users_Folder_Ie_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  /** de fragment id van de ie */
  ie_schema_identifier?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  user_collection_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "users.folder_ie" */
export enum Users_Folder_Ie_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IeSchemaIdentifier = 'ie_schema_identifier',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserCollectionId = 'user_collection_id'
}

/** input type for inserting data into table "users.folder" */
export type Users_Folder_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  ies?: InputMaybe<Users_Folder_Ie_Arr_Rel_Insert_Input>;
  is_default?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  user_profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Users_Folder_Max_Fields = {
  __typename?: 'users_folder_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "users.folder" */
export type Users_Folder_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Folder_Min_Fields = {
  __typename?: 'users_folder_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "users.folder" */
export type Users_Folder_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "users.folder" */
export type Users_Folder_Mutation_Response = {
  __typename?: 'users_folder_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Folder>;
};

/** input type for inserting object relation for remote table "users.folder" */
export type Users_Folder_Obj_Rel_Insert_Input = {
  data: Users_Folder_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Folder_On_Conflict>;
};

/** on_conflict condition type for table "users.folder" */
export type Users_Folder_On_Conflict = {
  constraint: Users_Folder_Constraint;
  update_columns?: Array<Users_Folder_Update_Column>;
  where?: InputMaybe<Users_Folder_Bool_Exp>;
};

/** Ordering options when selecting data from "users.folder". */
export type Users_Folder_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ies_aggregate?: InputMaybe<Users_Folder_Ie_Aggregate_Order_By>;
  is_default?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_profile?: InputMaybe<Users_Profile_Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_folder */
export type Users_Folder_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users.folder" */
export enum Users_Folder_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** input type for updating data in table "users.folder" */
export type Users_Folder_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_default?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "users.folder" */
export enum Users_Folder_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** Gebruikersgroepen */
export type Users_Group = {
  __typename?: 'users_group';
  created_at: Scalars['timestamp'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  label: Scalars['String'];
  name: Scalars['String'];
  /** An array relationship */
  permissions: Array<Users_Group_Permission>;
  /** An aggregate relationship */
  permissions_aggregate: Users_Group_Permission_Aggregate;
  updated_at: Scalars['timestamp'];
};


/** Gebruikersgroepen */
export type Users_GroupPermissionsArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


/** Gebruikersgroepen */
export type Users_GroupPermissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};

/** aggregated selection of "users.group" */
export type Users_Group_Aggregate = {
  __typename?: 'users_group_aggregate';
  aggregate?: Maybe<Users_Group_Aggregate_Fields>;
  nodes: Array<Users_Group>;
};

/** aggregate fields of "users.group" */
export type Users_Group_Aggregate_Fields = {
  __typename?: 'users_group_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Group_Max_Fields>;
  min?: Maybe<Users_Group_Min_Fields>;
};


/** aggregate fields of "users.group" */
export type Users_Group_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Group_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users.group". All fields are combined with a logical 'AND'. */
export type Users_Group_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Group_Bool_Exp>>;
  _not?: InputMaybe<Users_Group_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Group_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  permissions?: InputMaybe<Users_Group_Permission_Bool_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.group" */
export enum Users_Group_Constraint {
  /** unique or primary key constraint */
  GroupPkey = 'group_pkey'
}

/** input type for inserting data into table "users.group" */
export type Users_Group_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  permissions?: InputMaybe<Users_Group_Permission_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Users_Group_Max_Fields = {
  __typename?: 'users_group_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Users_Group_Min_Fields = {
  __typename?: 'users_group_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "users.group" */
export type Users_Group_Mutation_Response = {
  __typename?: 'users_group_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Group>;
};

/** input type for inserting object relation for remote table "users.group" */
export type Users_Group_Obj_Rel_Insert_Input = {
  data: Users_Group_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Group_On_Conflict>;
};

/** on_conflict condition type for table "users.group" */
export type Users_Group_On_Conflict = {
  constraint: Users_Group_Constraint;
  update_columns?: Array<Users_Group_Update_Column>;
  where?: InputMaybe<Users_Group_Bool_Exp>;
};

/** Ordering options when selecting data from "users.group". */
export type Users_Group_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  permissions_aggregate?: InputMaybe<Users_Group_Permission_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Koppeltabel voor het koppelen van permissies aan gebruikersgroepen */
export type Users_Group_Permission = {
  __typename?: 'users_group_permission';
  /** An object relationship */
  group: Users_Group;
  group_id: Scalars['uuid'];
  id: Scalars['uuid'];
  /** An object relationship */
  permission: Users_Permission;
  permission_id: Scalars['uuid'];
};

/** aggregated selection of "users.group_permission" */
export type Users_Group_Permission_Aggregate = {
  __typename?: 'users_group_permission_aggregate';
  aggregate?: Maybe<Users_Group_Permission_Aggregate_Fields>;
  nodes: Array<Users_Group_Permission>;
};

/** aggregate fields of "users.group_permission" */
export type Users_Group_Permission_Aggregate_Fields = {
  __typename?: 'users_group_permission_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Group_Permission_Max_Fields>;
  min?: Maybe<Users_Group_Permission_Min_Fields>;
};


/** aggregate fields of "users.group_permission" */
export type Users_Group_Permission_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users.group_permission" */
export type Users_Group_Permission_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Group_Permission_Max_Order_By>;
  min?: InputMaybe<Users_Group_Permission_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users.group_permission" */
export type Users_Group_Permission_Arr_Rel_Insert_Input = {
  data: Array<Users_Group_Permission_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Group_Permission_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users.group_permission". All fields are combined with a logical 'AND'. */
export type Users_Group_Permission_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Group_Permission_Bool_Exp>>;
  _not?: InputMaybe<Users_Group_Permission_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Group_Permission_Bool_Exp>>;
  group?: InputMaybe<Users_Group_Bool_Exp>;
  group_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  permission?: InputMaybe<Users_Permission_Bool_Exp>;
  permission_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.group_permission" */
export enum Users_Group_Permission_Constraint {
  /** unique or primary key constraint */
  GroupPermissionGroupIdPermissionIdKey = 'group_permission_group_id_permission_id_key',
  /** unique or primary key constraint */
  GroupPermissionPkey = 'group_permission_pkey'
}

/** input type for inserting data into table "users.group_permission" */
export type Users_Group_Permission_Insert_Input = {
  group?: InputMaybe<Users_Group_Obj_Rel_Insert_Input>;
  group_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  permission?: InputMaybe<Users_Permission_Obj_Rel_Insert_Input>;
  permission_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Users_Group_Permission_Max_Fields = {
  __typename?: 'users_group_permission_max_fields';
  group_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  permission_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "users.group_permission" */
export type Users_Group_Permission_Max_Order_By = {
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  permission_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Group_Permission_Min_Fields = {
  __typename?: 'users_group_permission_min_fields';
  group_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  permission_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "users.group_permission" */
export type Users_Group_Permission_Min_Order_By = {
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  permission_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "users.group_permission" */
export type Users_Group_Permission_Mutation_Response = {
  __typename?: 'users_group_permission_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Group_Permission>;
};

/** on_conflict condition type for table "users.group_permission" */
export type Users_Group_Permission_On_Conflict = {
  constraint: Users_Group_Permission_Constraint;
  update_columns?: Array<Users_Group_Permission_Update_Column>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};

/** Ordering options when selecting data from "users.group_permission". */
export type Users_Group_Permission_Order_By = {
  group?: InputMaybe<Users_Group_Order_By>;
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  permission?: InputMaybe<Users_Permission_Order_By>;
  permission_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_group_permission */
export type Users_Group_Permission_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users.group_permission" */
export enum Users_Group_Permission_Select_Column {
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  PermissionId = 'permission_id'
}

/** input type for updating data in table "users.group_permission" */
export type Users_Group_Permission_Set_Input = {
  group_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  permission_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "users.group_permission" */
export enum Users_Group_Permission_Update_Column {
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  PermissionId = 'permission_id'
}

/** primary key columns input for table: users_group */
export type Users_Group_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users.group" */
export enum Users_Group_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "users.group" */
export type Users_Group_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "users.group" */
export enum Users_Group_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** List of user idps and id */
export type Users_Identity = {
  __typename?: 'users_identity';
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  identity_id: Scalars['String'];
  identity_provider_name: Scalars['String'];
  /** An object relationship */
  profile: Users_Profile;
  profile_id: Scalars['uuid'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "users.identity" */
export type Users_Identity_Aggregate = {
  __typename?: 'users_identity_aggregate';
  aggregate?: Maybe<Users_Identity_Aggregate_Fields>;
  nodes: Array<Users_Identity>;
};

/** aggregate fields of "users.identity" */
export type Users_Identity_Aggregate_Fields = {
  __typename?: 'users_identity_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Identity_Max_Fields>;
  min?: Maybe<Users_Identity_Min_Fields>;
};


/** aggregate fields of "users.identity" */
export type Users_Identity_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Identity_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users.identity" */
export type Users_Identity_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Identity_Max_Order_By>;
  min?: InputMaybe<Users_Identity_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users.identity" */
export type Users_Identity_Arr_Rel_Insert_Input = {
  data: Array<Users_Identity_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Identity_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users.identity". All fields are combined with a logical 'AND'. */
export type Users_Identity_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Identity_Bool_Exp>>;
  _not?: InputMaybe<Users_Identity_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Identity_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identity_id?: InputMaybe<String_Comparison_Exp>;
  identity_provider_name?: InputMaybe<String_Comparison_Exp>;
  profile?: InputMaybe<Users_Profile_Bool_Exp>;
  profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.identity" */
export enum Users_Identity_Constraint {
  /** unique or primary key constraint */
  IdentitiesPkey = 'identities_pkey',
  /** unique or primary key constraint */
  IdentitiesProfileIdIdentityProviderIdKey = 'identities_profile_id_identity_provider_id_key'
}

/** input type for inserting data into table "users.identity" */
export type Users_Identity_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  identity_id?: InputMaybe<Scalars['String']>;
  identity_provider_name?: InputMaybe<Scalars['String']>;
  profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Users_Identity_Max_Fields = {
  __typename?: 'users_identity_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  identity_id?: Maybe<Scalars['String']>;
  identity_provider_name?: Maybe<Scalars['String']>;
  profile_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "users.identity" */
export type Users_Identity_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identity_id?: InputMaybe<Order_By>;
  identity_provider_name?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Identity_Min_Fields = {
  __typename?: 'users_identity_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  identity_id?: Maybe<Scalars['String']>;
  identity_provider_name?: Maybe<Scalars['String']>;
  profile_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "users.identity" */
export type Users_Identity_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identity_id?: InputMaybe<Order_By>;
  identity_provider_name?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "users.identity" */
export type Users_Identity_Mutation_Response = {
  __typename?: 'users_identity_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Identity>;
};

/** on_conflict condition type for table "users.identity" */
export type Users_Identity_On_Conflict = {
  constraint: Users_Identity_Constraint;
  update_columns?: Array<Users_Identity_Update_Column>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};

/** Ordering options when selecting data from "users.identity". */
export type Users_Identity_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identity_id?: InputMaybe<Order_By>;
  identity_provider_name?: InputMaybe<Order_By>;
  profile?: InputMaybe<Users_Profile_Order_By>;
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_identity */
export type Users_Identity_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** columns and relationships of "users.identity_provider" */
export type Users_Identity_Provider = {
  __typename?: 'users_identity_provider';
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

/** aggregated selection of "users.identity_provider" */
export type Users_Identity_Provider_Aggregate = {
  __typename?: 'users_identity_provider_aggregate';
  aggregate?: Maybe<Users_Identity_Provider_Aggregate_Fields>;
  nodes: Array<Users_Identity_Provider>;
};

/** aggregate fields of "users.identity_provider" */
export type Users_Identity_Provider_Aggregate_Fields = {
  __typename?: 'users_identity_provider_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Identity_Provider_Max_Fields>;
  min?: Maybe<Users_Identity_Provider_Min_Fields>;
};


/** aggregate fields of "users.identity_provider" */
export type Users_Identity_Provider_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Identity_Provider_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users.identity_provider". All fields are combined with a logical 'AND'. */
export type Users_Identity_Provider_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Identity_Provider_Bool_Exp>>;
  _not?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Identity_Provider_Bool_Exp>>;
  description?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.identity_provider" */
export enum Users_Identity_Provider_Constraint {
  /** unique or primary key constraint */
  IdentityProvidersNameKey = 'identity_providers_name_key',
  /** unique or primary key constraint */
  IdentityProvidersPkey = 'identity_providers_pkey'
}

/** input type for inserting data into table "users.identity_provider" */
export type Users_Identity_Provider_Insert_Input = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Users_Identity_Provider_Max_Fields = {
  __typename?: 'users_identity_provider_max_fields';
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Users_Identity_Provider_Min_Fields = {
  __typename?: 'users_identity_provider_min_fields';
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "users.identity_provider" */
export type Users_Identity_Provider_Mutation_Response = {
  __typename?: 'users_identity_provider_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Identity_Provider>;
};

/** on_conflict condition type for table "users.identity_provider" */
export type Users_Identity_Provider_On_Conflict = {
  constraint: Users_Identity_Provider_Constraint;
  update_columns?: Array<Users_Identity_Provider_Update_Column>;
  where?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
};

/** Ordering options when selecting data from "users.identity_provider". */
export type Users_Identity_Provider_Order_By = {
  description?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_identity_provider */
export type Users_Identity_Provider_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "users.identity_provider" */
export enum Users_Identity_Provider_Select_Column {
  /** column name */
  Description = 'description',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "users.identity_provider" */
export type Users_Identity_Provider_Set_Input = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "users.identity_provider" */
export enum Users_Identity_Provider_Update_Column {
  /** column name */
  Description = 'description',
  /** column name */
  Name = 'name'
}

/** select columns of table "users.identity" */
export enum Users_Identity_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IdentityId = 'identity_id',
  /** column name */
  IdentityProviderName = 'identity_provider_name',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "users.identity" */
export type Users_Identity_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  identity_id?: InputMaybe<Scalars['String']>;
  identity_provider_name?: InputMaybe<Scalars['String']>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "users.identity" */
export enum Users_Identity_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IdentityId = 'identity_id',
  /** column name */
  IdentityProviderName = 'identity_provider_name',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Wat een gebruiker mag doen */
export type Users_Permission = {
  __typename?: 'users_permission';
  created_at: Scalars['timestamp'];
  description?: Maybe<Scalars['String']>;
  /** An array relationship */
  groups: Array<Users_Group_Permission>;
  /** An aggregate relationship */
  groups_aggregate: Users_Group_Permission_Aggregate;
  id: Scalars['uuid'];
  label: Scalars['String'];
  name: Scalars['String'];
  updated_at: Scalars['timestamp'];
};


/** Wat een gebruiker mag doen */
export type Users_PermissionGroupsArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


/** Wat een gebruiker mag doen */
export type Users_PermissionGroups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};

/** aggregated selection of "users.permission" */
export type Users_Permission_Aggregate = {
  __typename?: 'users_permission_aggregate';
  aggregate?: Maybe<Users_Permission_Aggregate_Fields>;
  nodes: Array<Users_Permission>;
};

/** aggregate fields of "users.permission" */
export type Users_Permission_Aggregate_Fields = {
  __typename?: 'users_permission_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Permission_Max_Fields>;
  min?: Maybe<Users_Permission_Min_Fields>;
};


/** aggregate fields of "users.permission" */
export type Users_Permission_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Permission_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users.permission". All fields are combined with a logical 'AND'. */
export type Users_Permission_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Permission_Bool_Exp>>;
  _not?: InputMaybe<Users_Permission_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Permission_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  groups?: InputMaybe<Users_Group_Permission_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.permission" */
export enum Users_Permission_Constraint {
  /** unique or primary key constraint */
  PermissionPkey = 'permission_pkey'
}

/** input type for inserting data into table "users.permission" */
export type Users_Permission_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  groups?: InputMaybe<Users_Group_Permission_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Users_Permission_Max_Fields = {
  __typename?: 'users_permission_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Users_Permission_Min_Fields = {
  __typename?: 'users_permission_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "users.permission" */
export type Users_Permission_Mutation_Response = {
  __typename?: 'users_permission_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Permission>;
};

/** input type for inserting object relation for remote table "users.permission" */
export type Users_Permission_Obj_Rel_Insert_Input = {
  data: Users_Permission_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Permission_On_Conflict>;
};

/** on_conflict condition type for table "users.permission" */
export type Users_Permission_On_Conflict = {
  constraint: Users_Permission_Constraint;
  update_columns?: Array<Users_Permission_Update_Column>;
  where?: InputMaybe<Users_Permission_Bool_Exp>;
};

/** Ordering options when selecting data from "users.permission". */
export type Users_Permission_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  groups_aggregate?: InputMaybe<Users_Group_Permission_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_permission */
export type Users_Permission_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users.permission" */
export enum Users_Permission_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "users.permission" */
export type Users_Permission_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "users.permission" */
export enum Users_Permission_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** A user his identifying attributes aka profile information */
export type Users_Profile = {
  __typename?: 'users_profile';
  accepted_tos_at?: Maybe<Scalars['timestamptz']>;
  /** An array relationship */
  collections: Array<Users_Folder>;
  /** An aggregate relationship */
  collections_aggregate: Users_Folder_Aggregate;
  created_at?: Maybe<Scalars['timestamp']>;
  first_name?: Maybe<Scalars['String']>;
  /** A computed field, executes function "users.user_profile_full_name" */
  full_name?: Maybe<Scalars['String']>;
  /** An object relationship */
  group?: Maybe<Users_Group>;
  group_id?: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
  /** An array relationship */
  identities: Array<Users_Identity>;
  /** An aggregate relationship */
  identities_aggregate: Users_Identity_Aggregate;
  last_access_at?: Maybe<Scalars['timestamptz']>;
  last_name?: Maybe<Scalars['String']>;
  mail?: Maybe<Scalars['String']>;
  /** An array relationship */
  maintainer_users_profiles: Array<Maintainer_Users_Profile>;
  /** An aggregate relationship */
  maintainer_users_profiles_aggregate: Maintainer_Users_Profile_Aggregate;
  /** An array relationship */
  notes: Array<Maintainer_Visitor_Space_Request_Note>;
  /** An aggregate relationship */
  notes_aggregate: Maintainer_Visitor_Space_Request_Note_Aggregate;
  /** An array relationship */
  notifications: Array<App_Notification>;
  /** An aggregate relationship */
  notifications_aggregate: App_Notification_Aggregate;
  updated_at?: Maybe<Scalars['timestamp']>;
  /** An array relationship */
  visitor_space_requests: Array<Maintainer_Visitor_Space_Request>;
  /** An aggregate relationship */
  visitor_space_requests_aggregate: Maintainer_Visitor_Space_Request_Aggregate;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileCollectionsArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Order_By>>;
  where?: InputMaybe<Users_Folder_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileCollections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Folder_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Folder_Order_By>>;
  where?: InputMaybe<Users_Folder_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileMaintainer_Users_ProfilesArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileMaintainer_Users_Profiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileNotesArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileNotes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Note_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileNotificationsArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileVisitor_Space_RequestsArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};


/** A user his identifying attributes aka profile information */
export type Users_ProfileVisitor_Space_Requests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Maintainer_Visitor_Space_Request_Order_By>>;
  where?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};

/** aggregated selection of "users.profile" */
export type Users_Profile_Aggregate = {
  __typename?: 'users_profile_aggregate';
  aggregate?: Maybe<Users_Profile_Aggregate_Fields>;
  nodes: Array<Users_Profile>;
};

/** aggregate fields of "users.profile" */
export type Users_Profile_Aggregate_Fields = {
  __typename?: 'users_profile_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Profile_Max_Fields>;
  min?: Maybe<Users_Profile_Min_Fields>;
};


/** aggregate fields of "users.profile" */
export type Users_Profile_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Profile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users.profile". All fields are combined with a logical 'AND'. */
export type Users_Profile_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Profile_Bool_Exp>>;
  _not?: InputMaybe<Users_Profile_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Profile_Bool_Exp>>;
  accepted_tos_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  collections?: InputMaybe<Users_Folder_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  full_name?: InputMaybe<String_Comparison_Exp>;
  group?: InputMaybe<Users_Group_Bool_Exp>;
  group_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identities?: InputMaybe<Users_Identity_Bool_Exp>;
  last_access_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  mail?: InputMaybe<String_Comparison_Exp>;
  maintainer_users_profiles?: InputMaybe<Maintainer_Users_Profile_Bool_Exp>;
  notes?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Bool_Exp>;
  notifications?: InputMaybe<App_Notification_Bool_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  visitor_space_requests?: InputMaybe<Maintainer_Visitor_Space_Request_Bool_Exp>;
};

/** unique or primary key constraints on table "users.profile" */
export enum Users_Profile_Constraint {
  /** unique or primary key constraint */
  ProfilesPkey = 'profiles_pkey'
}

/** input type for inserting data into table "users.profile" */
export type Users_Profile_Insert_Input = {
  accepted_tos_at?: InputMaybe<Scalars['timestamptz']>;
  collections?: InputMaybe<Users_Folder_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  first_name?: InputMaybe<Scalars['String']>;
  group?: InputMaybe<Users_Group_Obj_Rel_Insert_Input>;
  group_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  identities?: InputMaybe<Users_Identity_Arr_Rel_Insert_Input>;
  last_access_at?: InputMaybe<Scalars['timestamptz']>;
  last_name?: InputMaybe<Scalars['String']>;
  mail?: InputMaybe<Scalars['String']>;
  maintainer_users_profiles?: InputMaybe<Maintainer_Users_Profile_Arr_Rel_Insert_Input>;
  notes?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Arr_Rel_Insert_Input>;
  notifications?: InputMaybe<App_Notification_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  visitor_space_requests?: InputMaybe<Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Profile_Max_Fields = {
  __typename?: 'users_profile_max_fields';
  accepted_tos_at?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamp']>;
  first_name?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  last_access_at?: Maybe<Scalars['timestamptz']>;
  last_name?: Maybe<Scalars['String']>;
  mail?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Users_Profile_Min_Fields = {
  __typename?: 'users_profile_min_fields';
  accepted_tos_at?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamp']>;
  first_name?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  last_access_at?: Maybe<Scalars['timestamptz']>;
  last_name?: Maybe<Scalars['String']>;
  mail?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "users.profile" */
export type Users_Profile_Mutation_Response = {
  __typename?: 'users_profile_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Profile>;
};

/** input type for inserting object relation for remote table "users.profile" */
export type Users_Profile_Obj_Rel_Insert_Input = {
  data: Users_Profile_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Profile_On_Conflict>;
};

/** on_conflict condition type for table "users.profile" */
export type Users_Profile_On_Conflict = {
  constraint: Users_Profile_Constraint;
  update_columns?: Array<Users_Profile_Update_Column>;
  where?: InputMaybe<Users_Profile_Bool_Exp>;
};

/** Ordering options when selecting data from "users.profile". */
export type Users_Profile_Order_By = {
  accepted_tos_at?: InputMaybe<Order_By>;
  collections_aggregate?: InputMaybe<Users_Folder_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  full_name?: InputMaybe<Order_By>;
  group?: InputMaybe<Users_Group_Order_By>;
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identities_aggregate?: InputMaybe<Users_Identity_Aggregate_Order_By>;
  last_access_at?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  mail?: InputMaybe<Order_By>;
  maintainer_users_profiles_aggregate?: InputMaybe<Maintainer_Users_Profile_Aggregate_Order_By>;
  notes_aggregate?: InputMaybe<Maintainer_Visitor_Space_Request_Note_Aggregate_Order_By>;
  notifications_aggregate?: InputMaybe<App_Notification_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visitor_space_requests_aggregate?: InputMaybe<Maintainer_Visitor_Space_Request_Aggregate_Order_By>;
};

/** primary key columns input for table: users_profile */
export type Users_Profile_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users.profile" */
export enum Users_Profile_Select_Column {
  /** column name */
  AcceptedTosAt = 'accepted_tos_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  LastAccessAt = 'last_access_at',
  /** column name */
  LastName = 'last_name',
  /** column name */
  Mail = 'mail',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "users.profile" */
export type Users_Profile_Set_Input = {
  accepted_tos_at?: InputMaybe<Scalars['timestamptz']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  first_name?: InputMaybe<Scalars['String']>;
  group_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  last_access_at?: InputMaybe<Scalars['timestamptz']>;
  last_name?: InputMaybe<Scalars['String']>;
  mail?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "users.profile" */
export enum Users_Profile_Update_Column {
  /** column name */
  AcceptedTosAt = 'accepted_tos_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  LastAccessAt = 'last_access_at',
  /** column name */
  LastName = 'last_name',
  /** column name */
  Mail = 'mail',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type DeleteContentPageLabelByIdMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type DeleteContentPageLabelByIdMutation = { __typename?: 'mutation_root', delete_app_content_label?: { __typename?: 'app_content_label_mutation_response', affected_rows: number } | null };

export type GetContentPageLabelByIdQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetContentPageLabelByIdQuery = { __typename?: 'query_root', app_content_label: Array<{ __typename?: 'app_content_label', label: string, id: any, content_type: Lookup_App_Content_Type_Enum, link_to?: any | null, created_at: any, updated_at: any }> };

export type GetContentPageLabelsQueryVariables = Exact<{
  where: App_Content_Label_Bool_Exp;
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  orderBy: Array<App_Content_Label_Order_By> | App_Content_Label_Order_By;
}>;


export type GetContentPageLabelsQuery = { __typename?: 'query_root', app_content_label: Array<{ __typename?: 'app_content_label', label: string, content_type: Lookup_App_Content_Type_Enum, link_to?: any | null, created_at: any, updated_at: any, id: any }>, app_content_label_aggregate: { __typename?: 'app_content_label_aggregate', aggregate?: { __typename?: 'app_content_label_aggregate_fields', count: number } | null } };

export type InsertContentPageLabelMutationVariables = Exact<{
  contentPageLabel: App_Content_Label_Insert_Input;
}>;


export type InsertContentPageLabelMutation = { __typename?: 'mutation_root', insert_app_content_label?: { __typename?: 'app_content_label_mutation_response', returning: Array<{ __typename?: 'app_content_label', id: any }> } | null };

export type UpdateContentPageLabelMutationVariables = Exact<{
  contentPageLabel: App_Content_Label_Set_Input;
  contentPageLabelId: Scalars['uuid'];
}>;


export type UpdateContentPageLabelMutation = { __typename?: 'mutation_root', update_app_content_label?: { __typename?: 'app_content_label_mutation_response', affected_rows: number } | null };

export type DeleteContentBlockMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type DeleteContentBlockMutation = { __typename?: 'mutation_root', delete_app_content_block?: { __typename?: 'app_content_block_mutation_response', affected_rows: number } | null };

export type DeleteContentLabelLinksMutationVariables = Exact<{
  contentPageId: Scalars['uuid'];
  labelIds: Array<Scalars['uuid']> | Scalars['uuid'];
}>;


export type DeleteContentLabelLinksMutation = { __typename?: 'mutation_root', delete_app_content_page_content_label?: { __typename?: 'app_content_page_content_label_mutation_response', affected_rows: number } | null };

export type GetContentByIdQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetContentByIdQuery = { __typename?: 'query_root', app_content_page: Array<{ __typename?: 'app_content_page', content_type: string, content_width: string, created_at: any, depublish_at?: any | null, description?: string | null, seo_description?: string | null, meta_description?: string | null, id: any, thumbnail_path?: string | null, is_protected: boolean, is_public?: boolean | null, path?: string | null, user_profile_id?: any | null, publish_at?: any | null, published_at?: any | null, title: string, updated_at?: any | null, user_group_ids?: any | null, profile?: { __typename?: 'users_profile', id: any, full_name?: string | null, maintainer_users_profiles: Array<{ __typename?: 'maintainer_users_profile', maintainer: { __typename?: 'maintainer_content_partner', schema_identifier: string, schema_name?: string | null, information?: { __typename?: 'maintainer_organisation', logo: any } | null } }>, group?: { __typename?: 'users_group', id: any, name: string, label: string } | null } | null, content_content_labels: Array<{ __typename?: 'app_content_page_content_label', content_label: { __typename?: 'app_content_label', label: string, id: any, link_to?: any | null } }>, content_blocks: Array<{ __typename?: 'app_content_block', content_block_type: Lookup_App_Content_Block_Type_Enum, content_id: any, created_at: any, id: any, position: number, updated_at: any, variables?: any | null }> }> };

export type GetContentLabelsByContentTypeQueryVariables = Exact<{
  contentType: Lookup_App_Content_Type_Enum;
}>;


export type GetContentLabelsByContentTypeQuery = { __typename?: 'query_root', app_content_label: Array<{ __typename?: 'app_content_label', id: any, label: string, content_type: Lookup_App_Content_Type_Enum, link_to?: any | null }> };

export type GetContentPagesByIdsQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['uuid']> | Scalars['uuid']>;
}>;


export type GetContentPagesByIdsQuery = { __typename?: 'query_root', app_content_page: Array<{ __typename?: 'app_content_page', user_profile_id?: any | null }> };

export type GetContentPagesQueryVariables = Exact<{
  where?: InputMaybe<App_Content_Page_Bool_Exp>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<App_Content_Page_Order_By> | App_Content_Page_Order_By>;
}>;


export type GetContentPagesQuery = { __typename?: 'query_root', app_content_page: Array<{ __typename?: 'app_content_page', id: any, content_type: string, created_at: any, depublish_at?: any | null, description?: string | null, seo_description?: string | null, meta_description?: string | null, thumbnail_path?: string | null, is_protected: boolean, is_public?: boolean | null, path?: string | null, user_profile_id?: any | null, publish_at?: any | null, published_at?: any | null, title: string, updated_at?: any | null, user_group_ids?: any | null, profile?: { __typename?: 'users_profile', id: any, full_name?: string | null, maintainer_users_profiles: Array<{ __typename?: 'maintainer_users_profile', maintainer: { __typename?: 'maintainer_content_partner', schema_identifier: string, schema_name?: string | null, information?: { __typename?: 'maintainer_organisation', logo: any } | null } }>, group?: { __typename?: 'users_group', id: any, name: string, label: string } | null } | null, content_content_labels: Array<{ __typename?: 'app_content_page_content_label', content_label: { __typename?: 'app_content_label', id: any, label: string, link_to?: any | null } }> }>, app_content_page_aggregate: { __typename?: 'app_content_page_aggregate', aggregate?: { __typename?: 'app_content_page_aggregate_fields', count: number } | null } };

export type GetContentTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetContentTypesQuery = { __typename?: 'query_root', lookup_app_content_type: Array<{ __typename?: 'lookup_app_content_type', value: string, comment?: string | null }> };

export type GetPermissionsFromContentPageByPathQueryVariables = Exact<{
  path: Scalars['String'];
}>;


export type GetPermissionsFromContentPageByPathQuery = { __typename?: 'query_root', app_content_page: Array<{ __typename?: 'app_content_page', user_group_ids?: any | null }> };

export type GetPublicContentPagesByTitleQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<App_Content_Page_Order_By> | App_Content_Page_Order_By>;
  where?: InputMaybe<App_Content_Page_Bool_Exp>;
}>;


export type GetPublicContentPagesByTitleQuery = { __typename?: 'query_root', app_content_page: Array<{ __typename?: 'app_content_page', path?: string | null, title: string }> };

export type GetPublicProjectContentPagesByTitleQueryVariables = Exact<{
  title: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<App_Content_Page_Order_By> | App_Content_Page_Order_By>;
}>;


export type GetPublicProjectContentPagesByTitleQuery = { __typename?: 'query_root', app_content_page: Array<{ __typename?: 'app_content_page', path?: string | null, title: string }> };

export type GetPublicProjectContentPagesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<App_Content_Page_Order_By> | App_Content_Page_Order_By>;
}>;


export type GetPublicProjectContentPagesQuery = { __typename?: 'query_root', app_content_page: Array<{ __typename?: 'app_content_page', path?: string | null, title: string }> };

export type InsertContentBlocksMutationVariables = Exact<{
  contentBlocks: Array<App_Content_Block_Insert_Input> | App_Content_Block_Insert_Input;
}>;


export type InsertContentBlocksMutation = { __typename?: 'mutation_root', insert_app_content_block?: { __typename?: 'app_content_block_mutation_response', returning: Array<{ __typename?: 'app_content_block', id: any }> } | null };

export type InsertContentLabelLinksMutationVariables = Exact<{
  objects: Array<App_Content_Page_Content_Label_Insert_Input> | App_Content_Page_Content_Label_Insert_Input;
}>;


export type InsertContentLabelLinksMutation = { __typename?: 'mutation_root', insert_app_content_page_content_label?: { __typename?: 'app_content_page_content_label_mutation_response', affected_rows: number } | null };

export type InsertContentMutationVariables = Exact<{
  contentPage: App_Content_Page_Insert_Input;
}>;


export type InsertContentMutation = { __typename?: 'mutation_root', insert_app_content_page?: { __typename?: 'app_content_page_mutation_response', returning: Array<{ __typename?: 'app_content_page', id: any }> } | null };

export type SoftDeleteContentMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type SoftDeleteContentMutation = { __typename?: 'mutation_root', update_app_content_page?: { __typename?: 'app_content_page_mutation_response', affected_rows: number } | null };

export type UpdateContentBlockMutationVariables = Exact<{
  id: Scalars['uuid'];
  contentBlock: App_Content_Block_Set_Input;
}>;


export type UpdateContentBlockMutation = { __typename?: 'mutation_root', update_app_content_block?: { __typename?: 'app_content_block_mutation_response', affected_rows: number } | null };

export type UpdateContentByIdMutationVariables = Exact<{
  id: Scalars['uuid'];
  contentPage: App_Content_Page_Set_Input;
}>;


export type UpdateContentByIdMutation = { __typename?: 'mutation_root', update_app_content_page?: { __typename?: 'app_content_page_mutation_response', affected_rows: number } | null };

export type DeleteNavigationItemMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type DeleteNavigationItemMutation = { __typename?: 'mutation_root', delete_app_navigation?: { __typename?: 'app_navigation_mutation_response', affected_rows: number } | null };

export type GetNavigationElementsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNavigationElementsQuery = { __typename?: 'query_root', app_navigation: Array<{ __typename?: 'app_navigation', id: any, description?: string | null, placement: string, tooltip?: string | null }> };

export type GetNavigationItemByIdQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetNavigationItemByIdQuery = { __typename?: 'query_root', app_navigation: Array<{ __typename?: 'app_navigation', id: any, created_at: any, description?: string | null, user_group_ids?: any | null, icon_name: string, label: string, link_target?: string | null, placement: string, position: number, updated_at: any, content_type: string, content_path: string, tooltip?: string | null }> };

export type GetNavigationItemsByPlacementQueryVariables = Exact<{
  placement: Scalars['String'];
}>;


export type GetNavigationItemsByPlacementQuery = { __typename?: 'query_root', app_navigation: Array<{ __typename?: 'app_navigation', id: any, created_at: any, description?: string | null, user_group_ids?: any | null, icon_name: string, label: string, link_target?: string | null, placement: string, position: number, updated_at: any, content_type: string, content_path: string, tooltip?: string | null }> };

export type InsertNavigationItemMutationVariables = Exact<{
  navigationItem: App_Navigation_Insert_Input;
}>;


export type InsertNavigationItemMutation = { __typename?: 'mutation_root', insert_app_navigation?: { __typename?: 'app_navigation_mutation_response', returning: Array<{ __typename?: 'app_navigation', id: any }> } | null };

export type UpdateNavigationItemByIdMutationVariables = Exact<{
  id: Scalars['uuid'];
  navigationItem: App_Navigation_Set_Input;
}>;


export type UpdateNavigationItemByIdMutation = { __typename?: 'mutation_root', update_app_navigation?: { __typename?: 'app_navigation_mutation_response', affected_rows: number } | null };

export type GetOrganizationsWithUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationsWithUsersQuery = { __typename?: 'query_root', maintainer_users_profile: Array<{ __typename?: 'maintainer_users_profile', maintainer: { __typename?: 'maintainer_content_partner', schema_identifier: string, schema_name?: string | null } }> };

export type GetTranslationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTranslationsQuery = { __typename?: 'query_root', app_config: Array<{ __typename?: 'app_config', name: string, value: any }> };

export type UpdateTranslationsMutationVariables = Exact<{
  name: Scalars['String'];
  translations: App_Config_Set_Input;
}>;


export type UpdateTranslationsMutation = { __typename?: 'mutation_root', update_app_config?: { __typename?: 'app_config_mutation_response', affected_rows: number } | null };

export type DeleteUserGroupMutationVariables = Exact<{
  userGroupId: Scalars['uuid'];
}>;


export type DeleteUserGroupMutation = { __typename?: 'mutation_root', delete_users_group?: { __typename?: 'users_group_mutation_response', affected_rows: number } | null };

export type GetUserGroupByIdQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetUserGroupByIdQuery = { __typename?: 'query_root', users_group: Array<{ __typename?: 'users_group', label: string, id: any, description?: string | null, created_at: any, updated_at: any, permissions: Array<{ __typename?: 'users_group_permission', permission: { __typename?: 'users_permission', id: any, name: string, label: string, description?: string | null } }> }> };

export type GetUserGroupsWithFiltersQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  orderBy: Array<Users_Group_Order_By> | Users_Group_Order_By;
  where: Users_Group_Bool_Exp;
}>;


export type GetUserGroupsWithFiltersQuery = { __typename?: 'query_root', users_group: Array<{ __typename?: 'users_group', label: string, id: any, created_at: any, description?: string | null, updated_at: any }>, users_group_aggregate: { __typename?: 'users_group_aggregate', aggregate?: { __typename?: 'users_group_aggregate_fields', count: number } | null } };

export type InsertUserGroupMutationVariables = Exact<{
  userGroup: Users_Group_Insert_Input;
}>;


export type InsertUserGroupMutation = { __typename?: 'mutation_root', insert_users_group?: { __typename?: 'users_group_mutation_response', returning: Array<{ __typename?: 'users_group', id: any }> } | null };

export type UpdateUserGroupMutationVariables = Exact<{
  userGroup: Users_Group_Set_Input;
  userGroupId: Scalars['uuid'];
}>;


export type UpdateUserGroupMutation = { __typename?: 'mutation_root', update_users_group?: { __typename?: 'users_group_mutation_response', affected_rows: number } | null };

export type GetIdpsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIdpsQuery = { __typename?: 'query_root', users_identity_provider: Array<{ __typename?: 'users_identity_provider', name: string }> };

export type GetProfileIdsQueryVariables = Exact<{
  where: Users_Profile_Bool_Exp;
}>;


export type GetProfileIdsQuery = { __typename?: 'query_root', users_profile: Array<{ __typename?: 'users_profile', id: any }> };

export type GetProfileNamesQueryVariables = Exact<{
  profileIds: Array<Scalars['uuid']> | Scalars['uuid'];
}>;


export type GetProfileNamesQuery = { __typename?: 'query_root', users_profile: Array<{ __typename?: 'users_profile', id: any, full_name?: string | null, mail?: string | null }> };

export type GetUsersQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  orderBy: Array<Users_Profile_Order_By> | Users_Profile_Order_By;
  where: Users_Profile_Bool_Exp;
}>;


export type GetUsersQuery = { __typename?: 'query_root', users_profile: Array<{ __typename?: 'users_profile', id: any, full_name?: string | null, first_name?: string | null, last_name?: string | null, mail?: string | null, last_access_at?: any | null, group?: { __typename?: 'users_group', label: string, name: string, id: any } | null, identities: Array<{ __typename?: 'users_identity', identity_provider_name: string }>, maintainer_users_profiles: Array<{ __typename?: 'maintainer_users_profile', maintainer: { __typename?: 'maintainer_content_partner', schema_identifier: string, schema_name?: string | null, information?: { __typename?: 'maintainer_organisation', logo: any } | null } }> }>, users_profile_aggregate: { __typename?: 'users_profile_aggregate', aggregate?: { __typename?: 'users_profile_aggregate_fields', count: number } | null } };


export const DeleteContentPageLabelByIdDocument = `
    mutation deleteContentPageLabelById($id: uuid!) {
  delete_app_content_label(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
    `;
export const useDeleteContentPageLabelByIdMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<DeleteContentPageLabelByIdMutation, TError, DeleteContentPageLabelByIdMutationVariables, TContext>
    ) =>
    useMutation<DeleteContentPageLabelByIdMutation, TError, DeleteContentPageLabelByIdMutationVariables, TContext>(
      ['deleteContentPageLabelById'],
      (variables?: DeleteContentPageLabelByIdMutationVariables) => fetcher<DeleteContentPageLabelByIdMutation, DeleteContentPageLabelByIdMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DeleteContentPageLabelByIdDocument, variables)(),
      options
    );
export const GetContentPageLabelByIdDocument = `
    query getContentPageLabelById($id: uuid!) {
  app_content_label(where: {id: {_eq: $id}}) {
    label
    id
    content_type
    link_to
    created_at
    updated_at
  }
}
    `;
export const useGetContentPageLabelByIdQuery = <
      TData = GetContentPageLabelByIdQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetContentPageLabelByIdQueryVariables,
      options?: UseQueryOptions<GetContentPageLabelByIdQuery, TError, TData>
    ) =>
    useQuery<GetContentPageLabelByIdQuery, TError, TData>(
      ['getContentPageLabelById', variables],
      fetcher<GetContentPageLabelByIdQuery, GetContentPageLabelByIdQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetContentPageLabelByIdDocument, variables),
      options
    );
export const GetContentPageLabelsDocument = `
    query getContentPageLabels($where: app_content_label_bool_exp!, $offset: Int!, $limit: Int!, $orderBy: [app_content_label_order_by!]!) {
  app_content_label(
    offset: $offset
    limit: $limit
    order_by: $orderBy
    where: $where
  ) {
    label
    content_type
    link_to
    created_at
    updated_at
    id
  }
  app_content_label_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
    `;
export const useGetContentPageLabelsQuery = <
      TData = GetContentPageLabelsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetContentPageLabelsQueryVariables,
      options?: UseQueryOptions<GetContentPageLabelsQuery, TError, TData>
    ) =>
    useQuery<GetContentPageLabelsQuery, TError, TData>(
      ['getContentPageLabels', variables],
      fetcher<GetContentPageLabelsQuery, GetContentPageLabelsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetContentPageLabelsDocument, variables),
      options
    );
export const InsertContentPageLabelDocument = `
    mutation insertContentPageLabel($contentPageLabel: app_content_label_insert_input!) {
  insert_app_content_label(objects: [$contentPageLabel]) {
    returning {
      id
    }
  }
}
    `;
export const useInsertContentPageLabelMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<InsertContentPageLabelMutation, TError, InsertContentPageLabelMutationVariables, TContext>
    ) =>
    useMutation<InsertContentPageLabelMutation, TError, InsertContentPageLabelMutationVariables, TContext>(
      ['insertContentPageLabel'],
      (variables?: InsertContentPageLabelMutationVariables) => fetcher<InsertContentPageLabelMutation, InsertContentPageLabelMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, InsertContentPageLabelDocument, variables)(),
      options
    );
export const UpdateContentPageLabelDocument = `
    mutation updateContentPageLabel($contentPageLabel: app_content_label_set_input!, $contentPageLabelId: uuid!) {
  update_app_content_label(
    where: {id: {_eq: $contentPageLabelId}}
    _set: $contentPageLabel
  ) {
    affected_rows
  }
}
    `;
export const useUpdateContentPageLabelMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UpdateContentPageLabelMutation, TError, UpdateContentPageLabelMutationVariables, TContext>
    ) =>
    useMutation<UpdateContentPageLabelMutation, TError, UpdateContentPageLabelMutationVariables, TContext>(
      ['updateContentPageLabel'],
      (variables?: UpdateContentPageLabelMutationVariables) => fetcher<UpdateContentPageLabelMutation, UpdateContentPageLabelMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateContentPageLabelDocument, variables)(),
      options
    );
export const DeleteContentBlockDocument = `
    mutation deleteContentBlock($id: uuid!) {
  delete_app_content_block(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
    `;
export const useDeleteContentBlockMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<DeleteContentBlockMutation, TError, DeleteContentBlockMutationVariables, TContext>
    ) =>
    useMutation<DeleteContentBlockMutation, TError, DeleteContentBlockMutationVariables, TContext>(
      ['deleteContentBlock'],
      (variables?: DeleteContentBlockMutationVariables) => fetcher<DeleteContentBlockMutation, DeleteContentBlockMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DeleteContentBlockDocument, variables)(),
      options
    );
export const DeleteContentLabelLinksDocument = `
    mutation deleteContentLabelLinks($contentPageId: uuid!, $labelIds: [uuid!]!) {
  delete_app_content_page_content_label(
    where: {label_id: {_in: $labelIds}, content_id: {_eq: $contentPageId}}
  ) {
    affected_rows
  }
}
    `;
export const useDeleteContentLabelLinksMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<DeleteContentLabelLinksMutation, TError, DeleteContentLabelLinksMutationVariables, TContext>
    ) =>
    useMutation<DeleteContentLabelLinksMutation, TError, DeleteContentLabelLinksMutationVariables, TContext>(
      ['deleteContentLabelLinks'],
      (variables?: DeleteContentLabelLinksMutationVariables) => fetcher<DeleteContentLabelLinksMutation, DeleteContentLabelLinksMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DeleteContentLabelLinksDocument, variables)(),
      options
    );
export const GetContentByIdDocument = `
    query getContentById($id: uuid!) {
  app_content_page(where: {id: {_eq: $id}, is_deleted: {_eq: false}}) {
    content_type
    content_width
    created_at
    depublish_at
    description
    seo_description
    meta_description
    id
    thumbnail_path
    is_protected
    is_public
    path
    user_profile_id
    profile: owner_profile {
      id
      full_name
      maintainer_users_profiles {
        maintainer {
          schema_identifier
          schema_name
          information {
            logo
          }
        }
      }
      group {
        id
        name
        label
      }
    }
    publish_at
    published_at
    title
    updated_at
    user_group_ids
    user_profile_id
    content_content_labels {
      content_label {
        label
        id
        link_to
      }
    }
    content_blocks(order_by: {position: asc}) {
      content_block_type
      content_id
      created_at
      id
      position
      updated_at
      variables
      content_block_type
    }
  }
}
    `;
export const useGetContentByIdQuery = <
      TData = GetContentByIdQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetContentByIdQueryVariables,
      options?: UseQueryOptions<GetContentByIdQuery, TError, TData>
    ) =>
    useQuery<GetContentByIdQuery, TError, TData>(
      ['getContentById', variables],
      fetcher<GetContentByIdQuery, GetContentByIdQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetContentByIdDocument, variables),
      options
    );
export const GetContentLabelsByContentTypeDocument = `
    query getContentLabelsByContentType($contentType: lookup_app_content_type_enum!) {
  app_content_label(where: {content_type: {_eq: $contentType}}) {
    id
    label
    content_type
    link_to
  }
}
    `;
export const useGetContentLabelsByContentTypeQuery = <
      TData = GetContentLabelsByContentTypeQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetContentLabelsByContentTypeQueryVariables,
      options?: UseQueryOptions<GetContentLabelsByContentTypeQuery, TError, TData>
    ) =>
    useQuery<GetContentLabelsByContentTypeQuery, TError, TData>(
      ['getContentLabelsByContentType', variables],
      fetcher<GetContentLabelsByContentTypeQuery, GetContentLabelsByContentTypeQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetContentLabelsByContentTypeDocument, variables),
      options
    );
export const GetContentPagesByIdsDocument = `
    query getContentPagesByIds($ids: [uuid!]) {
  app_content_page(where: {id: {_in: $ids}, is_deleted: {_eq: false}}) {
    user_profile_id
  }
}
    `;
export const useGetContentPagesByIdsQuery = <
      TData = GetContentPagesByIdsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: GetContentPagesByIdsQueryVariables,
      options?: UseQueryOptions<GetContentPagesByIdsQuery, TError, TData>
    ) =>
    useQuery<GetContentPagesByIdsQuery, TError, TData>(
      variables === undefined ? ['getContentPagesByIds'] : ['getContentPagesByIds', variables],
      fetcher<GetContentPagesByIdsQuery, GetContentPagesByIdsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetContentPagesByIdsDocument, variables),
      options
    );
export const GetContentPagesDocument = `
    query getContentPages($where: app_content_page_bool_exp, $offset: Int = 0, $limit: Int = 10, $orderBy: [app_content_page_order_by!] = {}) {
  app_content_page(
    where: $where
    limit: $limit
    offset: $offset
    order_by: $orderBy
  ) {
    id
    content_type
    created_at
    depublish_at
    description
    seo_description
    meta_description
    thumbnail_path
    is_protected
    is_public
    path
    user_profile_id
    profile: owner_profile {
      id
      full_name
      maintainer_users_profiles {
        maintainer {
          schema_identifier
          schema_name
          information {
            logo
          }
        }
      }
      group {
        id
        name
        label
      }
    }
    publish_at
    published_at
    title
    updated_at
    user_group_ids
    user_profile_id
    content_content_labels {
      content_label {
        id
        label
        link_to
      }
    }
  }
  app_content_page_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
    `;
export const useGetContentPagesQuery = <
      TData = GetContentPagesQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: GetContentPagesQueryVariables,
      options?: UseQueryOptions<GetContentPagesQuery, TError, TData>
    ) =>
    useQuery<GetContentPagesQuery, TError, TData>(
      variables === undefined ? ['getContentPages'] : ['getContentPages', variables],
      fetcher<GetContentPagesQuery, GetContentPagesQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetContentPagesDocument, variables),
      options
    );
export const GetContentTypesDocument = `
    query getContentTypes {
  lookup_app_content_type {
    value
    comment
  }
}
    `;
export const useGetContentTypesQuery = <
      TData = GetContentTypesQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: GetContentTypesQueryVariables,
      options?: UseQueryOptions<GetContentTypesQuery, TError, TData>
    ) =>
    useQuery<GetContentTypesQuery, TError, TData>(
      variables === undefined ? ['getContentTypes'] : ['getContentTypes', variables],
      fetcher<GetContentTypesQuery, GetContentTypesQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetContentTypesDocument, variables),
      options
    );
export const GetPermissionsFromContentPageByPathDocument = `
    query GetPermissionsFromContentPageByPath($path: String!) {
  app_content_page(where: {path: {_eq: $path}, is_deleted: {_eq: false}}) {
    user_group_ids
  }
}
    `;
export const useGetPermissionsFromContentPageByPathQuery = <
      TData = GetPermissionsFromContentPageByPathQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetPermissionsFromContentPageByPathQueryVariables,
      options?: UseQueryOptions<GetPermissionsFromContentPageByPathQuery, TError, TData>
    ) =>
    useQuery<GetPermissionsFromContentPageByPathQuery, TError, TData>(
      ['GetPermissionsFromContentPageByPath', variables],
      fetcher<GetPermissionsFromContentPageByPathQuery, GetPermissionsFromContentPageByPathQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetPermissionsFromContentPageByPathDocument, variables),
      options
    );
export const GetPublicContentPagesByTitleDocument = `
    query getPublicContentPagesByTitle($limit: Int = 20, $orderBy: [app_content_page_order_by!] = {}, $where: app_content_page_bool_exp = {}) {
  app_content_page(where: $where, limit: $limit, order_by: $orderBy) {
    path
    title
  }
}
    `;
export const useGetPublicContentPagesByTitleQuery = <
      TData = GetPublicContentPagesByTitleQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: GetPublicContentPagesByTitleQueryVariables,
      options?: UseQueryOptions<GetPublicContentPagesByTitleQuery, TError, TData>
    ) =>
    useQuery<GetPublicContentPagesByTitleQuery, TError, TData>(
      variables === undefined ? ['getPublicContentPagesByTitle'] : ['getPublicContentPagesByTitle', variables],
      fetcher<GetPublicContentPagesByTitleQuery, GetPublicContentPagesByTitleQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetPublicContentPagesByTitleDocument, variables),
      options
    );
export const GetPublicProjectContentPagesByTitleDocument = `
    query getPublicProjectContentPagesByTitle($title: String!, $limit: Int = 20, $orderBy: [app_content_page_order_by!] = {}) {
  app_content_page(
    where: {title: {_ilike: $title}, content_type: {_eq: "PROJECT"}, is_public: {_eq: true}, is_deleted: {_eq: false}}
    limit: $limit
    order_by: $orderBy
  ) {
    path
    title
  }
}
    `;
export const useGetPublicProjectContentPagesByTitleQuery = <
      TData = GetPublicProjectContentPagesByTitleQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetPublicProjectContentPagesByTitleQueryVariables,
      options?: UseQueryOptions<GetPublicProjectContentPagesByTitleQuery, TError, TData>
    ) =>
    useQuery<GetPublicProjectContentPagesByTitleQuery, TError, TData>(
      ['getPublicProjectContentPagesByTitle', variables],
      fetcher<GetPublicProjectContentPagesByTitleQuery, GetPublicProjectContentPagesByTitleQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetPublicProjectContentPagesByTitleDocument, variables),
      options
    );
export const GetPublicProjectContentPagesDocument = `
    query getPublicProjectContentPages($limit: Int = 20, $orderBy: [app_content_page_order_by!] = {}) {
  app_content_page(
    limit: $limit
    order_by: $orderBy
    where: {content_type: {_eq: "PROJECT"}, is_public: {_eq: true}, is_deleted: {_eq: false}}
  ) {
    path
    title
  }
}
    `;
export const useGetPublicProjectContentPagesQuery = <
      TData = GetPublicProjectContentPagesQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: GetPublicProjectContentPagesQueryVariables,
      options?: UseQueryOptions<GetPublicProjectContentPagesQuery, TError, TData>
    ) =>
    useQuery<GetPublicProjectContentPagesQuery, TError, TData>(
      variables === undefined ? ['getPublicProjectContentPages'] : ['getPublicProjectContentPages', variables],
      fetcher<GetPublicProjectContentPagesQuery, GetPublicProjectContentPagesQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetPublicProjectContentPagesDocument, variables),
      options
    );
export const InsertContentBlocksDocument = `
    mutation insertContentBlocks($contentBlocks: [app_content_block_insert_input!]!) {
  insert_app_content_block(objects: $contentBlocks) {
    returning {
      id
    }
  }
}
    `;
export const useInsertContentBlocksMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<InsertContentBlocksMutation, TError, InsertContentBlocksMutationVariables, TContext>
    ) =>
    useMutation<InsertContentBlocksMutation, TError, InsertContentBlocksMutationVariables, TContext>(
      ['insertContentBlocks'],
      (variables?: InsertContentBlocksMutationVariables) => fetcher<InsertContentBlocksMutation, InsertContentBlocksMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, InsertContentBlocksDocument, variables)(),
      options
    );
export const InsertContentLabelLinksDocument = `
    mutation insertContentLabelLinks($objects: [app_content_page_content_label_insert_input!]!) {
  insert_app_content_page_content_label(objects: $objects) {
    affected_rows
  }
}
    `;
export const useInsertContentLabelLinksMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<InsertContentLabelLinksMutation, TError, InsertContentLabelLinksMutationVariables, TContext>
    ) =>
    useMutation<InsertContentLabelLinksMutation, TError, InsertContentLabelLinksMutationVariables, TContext>(
      ['insertContentLabelLinks'],
      (variables?: InsertContentLabelLinksMutationVariables) => fetcher<InsertContentLabelLinksMutation, InsertContentLabelLinksMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, InsertContentLabelLinksDocument, variables)(),
      options
    );
export const InsertContentDocument = `
    mutation insertContent($contentPage: app_content_page_insert_input!) {
  insert_app_content_page(objects: [$contentPage]) {
    returning {
      id
    }
  }
}
    `;
export const useInsertContentMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<InsertContentMutation, TError, InsertContentMutationVariables, TContext>
    ) =>
    useMutation<InsertContentMutation, TError, InsertContentMutationVariables, TContext>(
      ['insertContent'],
      (variables?: InsertContentMutationVariables) => fetcher<InsertContentMutation, InsertContentMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, InsertContentDocument, variables)(),
      options
    );
export const SoftDeleteContentDocument = `
    mutation softDeleteContent($id: uuid!) {
  update_app_content_page(where: {id: {_eq: $id}}, _set: {is_deleted: true}) {
    affected_rows
  }
}
    `;
export const useSoftDeleteContentMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<SoftDeleteContentMutation, TError, SoftDeleteContentMutationVariables, TContext>
    ) =>
    useMutation<SoftDeleteContentMutation, TError, SoftDeleteContentMutationVariables, TContext>(
      ['softDeleteContent'],
      (variables?: SoftDeleteContentMutationVariables) => fetcher<SoftDeleteContentMutation, SoftDeleteContentMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, SoftDeleteContentDocument, variables)(),
      options
    );
export const UpdateContentBlockDocument = `
    mutation updateContentBlock($id: uuid!, $contentBlock: app_content_block_set_input!) {
  update_app_content_block(where: {id: {_eq: $id}}, _set: $contentBlock) {
    affected_rows
  }
}
    `;
export const useUpdateContentBlockMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UpdateContentBlockMutation, TError, UpdateContentBlockMutationVariables, TContext>
    ) =>
    useMutation<UpdateContentBlockMutation, TError, UpdateContentBlockMutationVariables, TContext>(
      ['updateContentBlock'],
      (variables?: UpdateContentBlockMutationVariables) => fetcher<UpdateContentBlockMutation, UpdateContentBlockMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateContentBlockDocument, variables)(),
      options
    );
export const UpdateContentByIdDocument = `
    mutation updateContentById($id: uuid!, $contentPage: app_content_page_set_input!) {
  update_app_content_page(
    where: {id: {_eq: $id}, is_deleted: {_eq: false}}
    _set: $contentPage
  ) {
    affected_rows
  }
}
    `;
export const useUpdateContentByIdMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UpdateContentByIdMutation, TError, UpdateContentByIdMutationVariables, TContext>
    ) =>
    useMutation<UpdateContentByIdMutation, TError, UpdateContentByIdMutationVariables, TContext>(
      ['updateContentById'],
      (variables?: UpdateContentByIdMutationVariables) => fetcher<UpdateContentByIdMutation, UpdateContentByIdMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateContentByIdDocument, variables)(),
      options
    );
export const DeleteNavigationItemDocument = `
    mutation deleteNavigationItem($id: uuid!) {
  delete_app_navigation(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
    `;
export const useDeleteNavigationItemMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<DeleteNavigationItemMutation, TError, DeleteNavigationItemMutationVariables, TContext>
    ) =>
    useMutation<DeleteNavigationItemMutation, TError, DeleteNavigationItemMutationVariables, TContext>(
      ['deleteNavigationItem'],
      (variables?: DeleteNavigationItemMutationVariables) => fetcher<DeleteNavigationItemMutation, DeleteNavigationItemMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DeleteNavigationItemDocument, variables)(),
      options
    );
export const GetNavigationElementsDocument = `
    query getNavigationElements {
  app_navigation(distinct_on: placement, order_by: {placement: asc}) {
    id
    description
    placement
    tooltip
  }
}
    `;
export const useGetNavigationElementsQuery = <
      TData = GetNavigationElementsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: GetNavigationElementsQueryVariables,
      options?: UseQueryOptions<GetNavigationElementsQuery, TError, TData>
    ) =>
    useQuery<GetNavigationElementsQuery, TError, TData>(
      variables === undefined ? ['getNavigationElements'] : ['getNavigationElements', variables],
      fetcher<GetNavigationElementsQuery, GetNavigationElementsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetNavigationElementsDocument, variables),
      options
    );
export const GetNavigationItemByIdDocument = `
    query getNavigationItemById($id: uuid!) {
  app_navigation(where: {id: {_eq: $id}}) {
    id
    created_at
    description
    user_group_ids
    icon_name
    label
    link_target
    placement
    position
    updated_at
    content_type
    content_path
    tooltip
  }
}
    `;
export const useGetNavigationItemByIdQuery = <
      TData = GetNavigationItemByIdQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetNavigationItemByIdQueryVariables,
      options?: UseQueryOptions<GetNavigationItemByIdQuery, TError, TData>
    ) =>
    useQuery<GetNavigationItemByIdQuery, TError, TData>(
      ['getNavigationItemById', variables],
      fetcher<GetNavigationItemByIdQuery, GetNavigationItemByIdQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetNavigationItemByIdDocument, variables),
      options
    );
export const GetNavigationItemsByPlacementDocument = `
    query getNavigationItemsByPlacement($placement: String!) {
  app_navigation(order_by: {position: asc}, where: {placement: {_eq: $placement}}) {
    id
    created_at
    description
    user_group_ids
    icon_name
    label
    link_target
    placement
    position
    updated_at
    content_type
    content_path
    tooltip
  }
}
    `;
export const useGetNavigationItemsByPlacementQuery = <
      TData = GetNavigationItemsByPlacementQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetNavigationItemsByPlacementQueryVariables,
      options?: UseQueryOptions<GetNavigationItemsByPlacementQuery, TError, TData>
    ) =>
    useQuery<GetNavigationItemsByPlacementQuery, TError, TData>(
      ['getNavigationItemsByPlacement', variables],
      fetcher<GetNavigationItemsByPlacementQuery, GetNavigationItemsByPlacementQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetNavigationItemsByPlacementDocument, variables),
      options
    );
export const InsertNavigationItemDocument = `
    mutation insertNavigationItem($navigationItem: app_navigation_insert_input!) {
  insert_app_navigation(objects: [$navigationItem]) {
    returning {
      id
    }
  }
}
    `;
export const useInsertNavigationItemMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<InsertNavigationItemMutation, TError, InsertNavigationItemMutationVariables, TContext>
    ) =>
    useMutation<InsertNavigationItemMutation, TError, InsertNavigationItemMutationVariables, TContext>(
      ['insertNavigationItem'],
      (variables?: InsertNavigationItemMutationVariables) => fetcher<InsertNavigationItemMutation, InsertNavigationItemMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, InsertNavigationItemDocument, variables)(),
      options
    );
export const UpdateNavigationItemByIdDocument = `
    mutation updateNavigationItemById($id: uuid!, $navigationItem: app_navigation_set_input!) {
  update_app_navigation(where: {id: {_eq: $id}}, _set: $navigationItem) {
    affected_rows
  }
}
    `;
export const useUpdateNavigationItemByIdMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UpdateNavigationItemByIdMutation, TError, UpdateNavigationItemByIdMutationVariables, TContext>
    ) =>
    useMutation<UpdateNavigationItemByIdMutation, TError, UpdateNavigationItemByIdMutationVariables, TContext>(
      ['updateNavigationItemById'],
      (variables?: UpdateNavigationItemByIdMutationVariables) => fetcher<UpdateNavigationItemByIdMutation, UpdateNavigationItemByIdMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateNavigationItemByIdDocument, variables)(),
      options
    );
export const GetOrganizationsWithUsersDocument = `
    query getOrganizationsWithUsers {
  maintainer_users_profile(distinct_on: maintainer_identifier) {
    maintainer {
      schema_identifier
      schema_name
    }
  }
}
    `;
export const useGetOrganizationsWithUsersQuery = <
      TData = GetOrganizationsWithUsersQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: GetOrganizationsWithUsersQueryVariables,
      options?: UseQueryOptions<GetOrganizationsWithUsersQuery, TError, TData>
    ) =>
    useQuery<GetOrganizationsWithUsersQuery, TError, TData>(
      variables === undefined ? ['getOrganizationsWithUsers'] : ['getOrganizationsWithUsers', variables],
      fetcher<GetOrganizationsWithUsersQuery, GetOrganizationsWithUsersQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetOrganizationsWithUsersDocument, variables),
      options
    );
export const GetTranslationsDocument = `
    query getTranslations {
  app_config(where: {name: {_ilike: "translations_%"}}) {
    name
    value
  }
}
    `;
export const useGetTranslationsQuery = <
      TData = GetTranslationsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: GetTranslationsQueryVariables,
      options?: UseQueryOptions<GetTranslationsQuery, TError, TData>
    ) =>
    useQuery<GetTranslationsQuery, TError, TData>(
      variables === undefined ? ['getTranslations'] : ['getTranslations', variables],
      fetcher<GetTranslationsQuery, GetTranslationsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetTranslationsDocument, variables),
      options
    );
export const UpdateTranslationsDocument = `
    mutation updateTranslations($name: String!, $translations: app_config_set_input!) {
  update_app_config(where: {name: {_eq: $name}}, _set: $translations) {
    affected_rows
  }
}
    `;
export const useUpdateTranslationsMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UpdateTranslationsMutation, TError, UpdateTranslationsMutationVariables, TContext>
    ) =>
    useMutation<UpdateTranslationsMutation, TError, UpdateTranslationsMutationVariables, TContext>(
      ['updateTranslations'],
      (variables?: UpdateTranslationsMutationVariables) => fetcher<UpdateTranslationsMutation, UpdateTranslationsMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateTranslationsDocument, variables)(),
      options
    );
export const DeleteUserGroupDocument = `
    mutation deleteUserGroup($userGroupId: uuid!) {
  delete_users_group(where: {id: {_eq: $userGroupId}}) {
    affected_rows
  }
}
    `;
export const useDeleteUserGroupMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<DeleteUserGroupMutation, TError, DeleteUserGroupMutationVariables, TContext>
    ) =>
    useMutation<DeleteUserGroupMutation, TError, DeleteUserGroupMutationVariables, TContext>(
      ['deleteUserGroup'],
      (variables?: DeleteUserGroupMutationVariables) => fetcher<DeleteUserGroupMutation, DeleteUserGroupMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DeleteUserGroupDocument, variables)(),
      options
    );
export const GetUserGroupByIdDocument = `
    query getUserGroupById($id: uuid!) {
  users_group(where: {id: {_eq: $id}}) {
    label
    id
    description
    created_at
    updated_at
    permissions(order_by: {permission: {label: asc}}) {
      permission {
        id
        name
        label
        description
      }
    }
  }
}
    `;
export const useGetUserGroupByIdQuery = <
      TData = GetUserGroupByIdQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetUserGroupByIdQueryVariables,
      options?: UseQueryOptions<GetUserGroupByIdQuery, TError, TData>
    ) =>
    useQuery<GetUserGroupByIdQuery, TError, TData>(
      ['getUserGroupById', variables],
      fetcher<GetUserGroupByIdQuery, GetUserGroupByIdQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetUserGroupByIdDocument, variables),
      options
    );
export const GetUserGroupsWithFiltersDocument = `
    query getUserGroupsWithFilters($limit: Int!, $offset: Int!, $orderBy: [users_group_order_by!]!, $where: users_group_bool_exp!) {
  users_group(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    label
    id
    created_at
    description
    updated_at
  }
  users_group_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
    `;
export const useGetUserGroupsWithFiltersQuery = <
      TData = GetUserGroupsWithFiltersQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetUserGroupsWithFiltersQueryVariables,
      options?: UseQueryOptions<GetUserGroupsWithFiltersQuery, TError, TData>
    ) =>
    useQuery<GetUserGroupsWithFiltersQuery, TError, TData>(
      ['getUserGroupsWithFilters', variables],
      fetcher<GetUserGroupsWithFiltersQuery, GetUserGroupsWithFiltersQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetUserGroupsWithFiltersDocument, variables),
      options
    );
export const InsertUserGroupDocument = `
    mutation insertUserGroup($userGroup: users_group_insert_input!) {
  insert_users_group(objects: [$userGroup]) {
    returning {
      id
    }
  }
}
    `;
export const useInsertUserGroupMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<InsertUserGroupMutation, TError, InsertUserGroupMutationVariables, TContext>
    ) =>
    useMutation<InsertUserGroupMutation, TError, InsertUserGroupMutationVariables, TContext>(
      ['insertUserGroup'],
      (variables?: InsertUserGroupMutationVariables) => fetcher<InsertUserGroupMutation, InsertUserGroupMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, InsertUserGroupDocument, variables)(),
      options
    );
export const UpdateUserGroupDocument = `
    mutation updateUserGroup($userGroup: users_group_set_input!, $userGroupId: uuid!) {
  update_users_group(where: {id: {_eq: $userGroupId}}, _set: $userGroup) {
    affected_rows
  }
}
    `;
export const useUpdateUserGroupMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UpdateUserGroupMutation, TError, UpdateUserGroupMutationVariables, TContext>
    ) =>
    useMutation<UpdateUserGroupMutation, TError, UpdateUserGroupMutationVariables, TContext>(
      ['updateUserGroup'],
      (variables?: UpdateUserGroupMutationVariables) => fetcher<UpdateUserGroupMutation, UpdateUserGroupMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateUserGroupDocument, variables)(),
      options
    );
export const GetIdpsDocument = `
    query getIdps {
  users_identity_provider {
    name
  }
}
    `;
export const useGetIdpsQuery = <
      TData = GetIdpsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables?: GetIdpsQueryVariables,
      options?: UseQueryOptions<GetIdpsQuery, TError, TData>
    ) =>
    useQuery<GetIdpsQuery, TError, TData>(
      variables === undefined ? ['getIdps'] : ['getIdps', variables],
      fetcher<GetIdpsQuery, GetIdpsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetIdpsDocument, variables),
      options
    );
export const GetProfileIdsDocument = `
    query getProfileIds($where: users_profile_bool_exp!) {
  users_profile(where: $where) {
    id
  }
}
    `;
export const useGetProfileIdsQuery = <
      TData = GetProfileIdsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetProfileIdsQueryVariables,
      options?: UseQueryOptions<GetProfileIdsQuery, TError, TData>
    ) =>
    useQuery<GetProfileIdsQuery, TError, TData>(
      ['getProfileIds', variables],
      fetcher<GetProfileIdsQuery, GetProfileIdsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetProfileIdsDocument, variables),
      options
    );
export const GetProfileNamesDocument = `
    query getProfileNames($profileIds: [uuid!]!) {
  users_profile(where: {id: {_in: $profileIds}}) {
    id
    full_name
    mail
  }
}
    `;
export const useGetProfileNamesQuery = <
      TData = GetProfileNamesQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetProfileNamesQueryVariables,
      options?: UseQueryOptions<GetProfileNamesQuery, TError, TData>
    ) =>
    useQuery<GetProfileNamesQuery, TError, TData>(
      ['getProfileNames', variables],
      fetcher<GetProfileNamesQuery, GetProfileNamesQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetProfileNamesDocument, variables),
      options
    );
export const GetUsersDocument = `
    query getUsers($offset: Int!, $limit: Int!, $orderBy: [users_profile_order_by!]!, $where: users_profile_bool_exp!) {
  users_profile(offset: $offset, limit: $limit, order_by: $orderBy, where: $where) {
    id
    full_name
    first_name
    last_name
    mail
    last_access_at
    group {
      label
      name
      id
    }
    identities {
      identity_provider_name
    }
    maintainer_users_profiles {
      maintainer {
        schema_identifier
        schema_name
        information {
          logo
        }
      }
    }
  }
  users_profile_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
    `;
export const useGetUsersQuery = <
      TData = GetUsersQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetUsersQueryVariables,
      options?: UseQueryOptions<GetUsersQuery, TError, TData>
    ) =>
    useQuery<GetUsersQuery, TError, TData>(
      ['getUsers', variables],
      fetcher<GetUsersQuery, GetUsersQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetUsersDocument, variables),
      options
    );