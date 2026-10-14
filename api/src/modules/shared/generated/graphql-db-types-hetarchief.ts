/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: boolean | null | undefined;
  _gt?: boolean | null | undefined;
  _gte?: boolean | null | undefined;
  _in?: Array<boolean> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: boolean | null | undefined;
  _lte?: boolean | null | undefined;
  _neq?: boolean | null | undefined;
  _nin?: Array<boolean> | null | undefined;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: number | null | undefined;
  _gt?: number | null | undefined;
  _gte?: number | null | undefined;
  _in?: Array<number> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: number | null | undefined;
  _lte?: number | null | undefined;
  _neq?: number | null | undefined;
  _nin?: Array<number> | null | undefined;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: Array<string> | null | undefined;
  /** does the array contain the given value */
  _contains?: Array<string> | null | undefined;
  _eq?: Array<string> | null | undefined;
  _gt?: Array<string> | null | undefined;
  _gte?: Array<string> | null | undefined;
  _in?: Array<Array<string>> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: Array<string> | null | undefined;
  _lte?: Array<string> | null | undefined;
  _neq?: Array<string> | null | undefined;
  _nin?: Array<Array<string>> | null | undefined;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: string | null | undefined;
  _gt?: string | null | undefined;
  _gte?: string | null | undefined;
  /** does the column match the given case-insensitive pattern */
  _ilike?: string | null | undefined;
  _in?: Array<string> | null | undefined;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: string | null | undefined;
  _is_null?: boolean | null | undefined;
  /** does the column match the given pattern */
  _like?: string | null | undefined;
  _lt?: string | null | undefined;
  _lte?: string | null | undefined;
  _neq?: string | null | undefined;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: string | null | undefined;
  _nin?: Array<string> | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: string | null | undefined;
  /** does the column NOT match the given pattern */
  _nlike?: string | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: string | null | undefined;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: string | null | undefined;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: string | null | undefined;
  /** does the column match the given SQL regular expression */
  _similar?: string | null | undefined;
};

/** input type for updating data in table "app.config" */
export type App_Config_Set_Input = {
  created_at?: any;
  name?: string | null | undefined;
  updated_at?: any;
  value?: any;
};

/** input type for inserting data into table "app.content_assets" */
export type App_Content_Assets_Insert_Input = {
  content_asset_type_id?: string | null | undefined;
  created_at?: any;
  description?: string | null | undefined;
  id?: any;
  label?: string | null | undefined;
  owner_id?: string | null | undefined;
  path?: string | null | undefined;
  updated_at?: any;
};

/** input type for updating data in table "app.content_assets" */
export type App_Content_Assets_Set_Input = {
  content_asset_type_id?: string | null | undefined;
  created_at?: any;
  description?: string | null | undefined;
  id?: any;
  label?: string | null | undefined;
  owner_id?: string | null | undefined;
  path?: string | null | undefined;
  updated_at?: any;
};

export type App_Content_Block_Aggregate_Bool_Exp = {
  count?: App_Content_Block_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Content_Block_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Content_Block_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Content_Block_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.content_block" */
export type App_Content_Block_Aggregate_Order_By = {
  avg?: App_Content_Block_Avg_Order_By | null | undefined;
  count?: Order_By | null | undefined;
  max?: App_Content_Block_Max_Order_By | null | undefined;
  min?: App_Content_Block_Min_Order_By | null | undefined;
  stddev?: App_Content_Block_Stddev_Order_By | null | undefined;
  stddev_pop?: App_Content_Block_Stddev_Pop_Order_By | null | undefined;
  stddev_samp?: App_Content_Block_Stddev_Samp_Order_By | null | undefined;
  sum?: App_Content_Block_Sum_Order_By | null | undefined;
  var_pop?: App_Content_Block_Var_Pop_Order_By | null | undefined;
  var_samp?: App_Content_Block_Var_Samp_Order_By | null | undefined;
  variance?: App_Content_Block_Variance_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.content_block" */
export type App_Content_Block_Arr_Rel_Insert_Input = {
  data: Array<App_Content_Block_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Content_Block_On_Conflict | null | undefined;
};

/** order by avg() on columns of table "app.content_block" */
export type App_Content_Block_Avg_Order_By = {
  position?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "app.content_block". All fields are combined with a logical 'AND'. */
export type App_Content_Block_Bool_Exp = {
  _and?: Array<App_Content_Block_Bool_Exp> | null | undefined;
  _not?: App_Content_Block_Bool_Exp | null | undefined;
  _or?: Array<App_Content_Block_Bool_Exp> | null | undefined;
  cms_content_block_type?: Lookup_App_Content_Block_Type_Bool_Exp | null | undefined;
  content?: App_Content_Page_Bool_Exp | null | undefined;
  content_block_type?: Lookup_App_Content_Block_Type_Enum_Comparison_Exp | null | undefined;
  content_id?: Uuid_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  position?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  variables?: Jsonb_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.content_block" */
export enum App_Content_Block_Constraint {
  /** unique or primary key constraint on columns "id" */
  ContentBlocksPkey = 'content_blocks_pkey'
}

/** input type for inserting data into table "app.content_block" */
export type App_Content_Block_Insert_Input = {
  cms_content_block_type?: Lookup_App_Content_Block_Type_Obj_Rel_Insert_Input | null | undefined;
  content?: App_Content_Page_Obj_Rel_Insert_Input | null | undefined;
  content_block_type?: Lookup_App_Content_Block_Type_Enum | null | undefined;
  content_id?: any;
  created_at?: any;
  id?: any;
  position?: number | null | undefined;
  updated_at?: any;
  variables?: any;
};

/** order by max() on columns of table "app.content_block" */
export type App_Content_Block_Max_Order_By = {
  content_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  position?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.content_block" */
export type App_Content_Block_Min_Order_By = {
  content_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  position?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "app.content_block" */
export type App_Content_Block_On_Conflict = {
  constraint: App_Content_Block_Constraint;
  update_columns?: Array<App_Content_Block_Update_Column>;
  where?: App_Content_Block_Bool_Exp | null | undefined;
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
  content_block_type?: Lookup_App_Content_Block_Type_Enum | null | undefined;
  content_id?: any;
  created_at?: any;
  id?: any;
  position?: number | null | undefined;
  updated_at?: any;
  variables?: any;
};

/** order by stddev() on columns of table "app.content_block" */
export type App_Content_Block_Stddev_Order_By = {
  position?: Order_By | null | undefined;
};

/** order by stddev_pop() on columns of table "app.content_block" */
export type App_Content_Block_Stddev_Pop_Order_By = {
  position?: Order_By | null | undefined;
};

/** order by stddev_samp() on columns of table "app.content_block" */
export type App_Content_Block_Stddev_Samp_Order_By = {
  position?: Order_By | null | undefined;
};

/** order by sum() on columns of table "app.content_block" */
export type App_Content_Block_Sum_Order_By = {
  position?: Order_By | null | undefined;
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

/** order by var_pop() on columns of table "app.content_block" */
export type App_Content_Block_Var_Pop_Order_By = {
  position?: Order_By | null | undefined;
};

/** order by var_samp() on columns of table "app.content_block" */
export type App_Content_Block_Var_Samp_Order_By = {
  position?: Order_By | null | undefined;
};

/** order by variance() on columns of table "app.content_block" */
export type App_Content_Block_Variance_Order_By = {
  position?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "app.content_label". All fields are combined with a logical 'AND'. */
export type App_Content_Label_Bool_Exp = {
  _and?: Array<App_Content_Label_Bool_Exp> | null | undefined;
  _not?: App_Content_Label_Bool_Exp | null | undefined;
  _or?: Array<App_Content_Label_Bool_Exp> | null | undefined;
  cms_content_type?: Lookup_App_Content_Type_Bool_Exp | null | undefined;
  color?: String_Comparison_Exp | null | undefined;
  content_content_labels?: App_Content_Page_Content_Label_Bool_Exp | null | undefined;
  content_content_labels_aggregate?: App_Content_Page_Content_Label_Aggregate_Bool_Exp | null | undefined;
  content_type?: Lookup_App_Content_Type_Enum_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  label?: String_Comparison_Exp | null | undefined;
  language?: Lookup_Languages_Enum_Comparison_Exp | null | undefined;
  link_to?: Jsonb_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.content_label" */
export enum App_Content_Label_Constraint {
  /** unique or primary key constraint on columns "label", "content_type" */
  ContentLabelsLabelContentTypeKey = 'content_labels_label_content_type_key',
  /** unique or primary key constraint on columns "id" */
  ContentLabelsPkey = 'content_labels_pkey'
}

/** input type for inserting data into table "app.content_label" */
export type App_Content_Label_Insert_Input = {
  cms_content_type?: Lookup_App_Content_Type_Obj_Rel_Insert_Input | null | undefined;
  color?: string | null | undefined;
  content_content_labels?: App_Content_Page_Content_Label_Arr_Rel_Insert_Input | null | undefined;
  content_type?: Lookup_App_Content_Type_Enum | null | undefined;
  created_at?: any;
  id?: any;
  label?: string | null | undefined;
  language?: Lookup_Languages_Enum | null | undefined;
  link_to?: any;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "app.content_label" */
export type App_Content_Label_Obj_Rel_Insert_Input = {
  data: App_Content_Label_Insert_Input;
  /** upsert condition */
  on_conflict?: App_Content_Label_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "app.content_label" */
export type App_Content_Label_On_Conflict = {
  constraint: App_Content_Label_Constraint;
  update_columns?: Array<App_Content_Label_Update_Column>;
  where?: App_Content_Label_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "app.content_label". */
export type App_Content_Label_Order_By = {
  cms_content_type?: Lookup_App_Content_Type_Order_By | null | undefined;
  color?: Order_By | null | undefined;
  content_content_labels_aggregate?: App_Content_Page_Content_Label_Aggregate_Order_By | null | undefined;
  content_type?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  label?: Order_By | null | undefined;
  language?: Order_By | null | undefined;
  link_to?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** input type for updating data in table "app.content_label" */
export type App_Content_Label_Set_Input = {
  color?: string | null | undefined;
  content_type?: Lookup_App_Content_Type_Enum | null | undefined;
  created_at?: any;
  id?: any;
  label?: string | null | undefined;
  language?: Lookup_Languages_Enum | null | undefined;
  link_to?: any;
  updated_at?: any;
};

/** update columns of table "app.content_label" */
export enum App_Content_Label_Update_Column {
  /** column name */
  Color = 'color',
  /** column name */
  ContentType = 'content_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Language = 'language',
  /** column name */
  LinkTo = 'link_to',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type App_Content_Page_Aggregate_Bool_Exp = {
  bool_and?: App_Content_Page_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: App_Content_Page_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: App_Content_Page_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Content_Page_Aggregate_Bool_Exp_Bool_And = {
  arguments: App_Content_Page_Select_Column_App_Content_Page_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Content_Page_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type App_Content_Page_Aggregate_Bool_Exp_Bool_Or = {
  arguments: App_Content_Page_Select_Column_App_Content_Page_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Content_Page_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type App_Content_Page_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Content_Page_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Content_Page_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.content_page" */
export type App_Content_Page_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: App_Content_Page_Max_Order_By | null | undefined;
  min?: App_Content_Page_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.content_page" */
export type App_Content_Page_Arr_Rel_Insert_Input = {
  data: Array<App_Content_Page_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Content_Page_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.content_page". All fields are combined with a logical 'AND'. */
export type App_Content_Page_Bool_Exp = {
  _and?: Array<App_Content_Page_Bool_Exp> | null | undefined;
  _not?: App_Content_Page_Bool_Exp | null | undefined;
  _or?: Array<App_Content_Page_Bool_Exp> | null | undefined;
  content_blocks?: App_Content_Block_Bool_Exp | null | undefined;
  content_blocks_aggregate?: App_Content_Block_Aggregate_Bool_Exp | null | undefined;
  content_content_labels?: App_Content_Page_Content_Label_Bool_Exp | null | undefined;
  content_content_labels_aggregate?: App_Content_Page_Content_Label_Aggregate_Bool_Exp | null | undefined;
  content_type?: String_Comparison_Exp | null | undefined;
  content_width?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  depublish_at?: Timestamp_Comparison_Exp | null | undefined;
  depublished_at?: Timestamp_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  header_path?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  is_protected?: Boolean_Comparison_Exp | null | undefined;
  is_public?: Boolean_Comparison_Exp | null | undefined;
  language?: Lookup_Languages_Enum_Comparison_Exp | null | undefined;
  meta_description?: String_Comparison_Exp | null | undefined;
  nl_parent_page_id?: Uuid_Comparison_Exp | null | undefined;
  owner_profile?: Users_Profile_Bool_Exp | null | undefined;
  path?: String_Comparison_Exp | null | undefined;
  publish_at?: Timestamp_Comparison_Exp | null | undefined;
  published_at?: Timestamp_Comparison_Exp | null | undefined;
  published_at_display?: Timestamp_Comparison_Exp | null | undefined;
  seo_description?: String_Comparison_Exp | null | undefined;
  seo_image_path?: String_Comparison_Exp | null | undefined;
  seo_keywords?: String_Comparison_Exp | null | undefined;
  seo_title?: String_Comparison_Exp | null | undefined;
  thumbnail_path?: String_Comparison_Exp | null | undefined;
  title?: String_Comparison_Exp | null | undefined;
  translated_content_pages?: App_Content_Page_Bool_Exp | null | undefined;
  translated_content_pages_aggregate?: App_Content_Page_Aggregate_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  updated_by_profile_id?: Uuid_Comparison_Exp | null | undefined;
  updater_profile?: Users_Profile_Bool_Exp | null | undefined;
  user_group_ids?: Jsonb_Comparison_Exp | null | undefined;
  user_profile_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.content_page" */
export enum App_Content_Page_Constraint {
  /** unique or primary key constraint on columns "id" */
  ContentIdKey = 'content_id_key',
  /** unique or primary key constraint on columns "language", "path" */
  ContentPagePathLanguageKey = 'content_page_path_language_key',
  /** unique or primary key constraint on columns "id" */
  ContentPkey = 'content_pkey'
}

export type App_Content_Page_Content_Label_Aggregate_Bool_Exp = {
  count?: App_Content_Page_Content_Label_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Content_Page_Content_Label_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Content_Page_Content_Label_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Content_Page_Content_Label_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: App_Content_Page_Content_Label_Max_Order_By | null | undefined;
  min?: App_Content_Page_Content_Label_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Arr_Rel_Insert_Input = {
  data: Array<App_Content_Page_Content_Label_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Content_Page_Content_Label_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.content_page_content_label". All fields are combined with a logical 'AND'. */
export type App_Content_Page_Content_Label_Bool_Exp = {
  _and?: Array<App_Content_Page_Content_Label_Bool_Exp> | null | undefined;
  _not?: App_Content_Page_Content_Label_Bool_Exp | null | undefined;
  _or?: Array<App_Content_Page_Content_Label_Bool_Exp> | null | undefined;
  content?: App_Content_Page_Bool_Exp | null | undefined;
  content_id?: Uuid_Comparison_Exp | null | undefined;
  content_label?: App_Content_Label_Bool_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  label_id?: Uuid_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.content_page_content_label" */
export enum App_Content_Page_Content_Label_Constraint {
  /** unique or primary key constraint on columns "id" */
  ContentContentLabelsPkey = 'content_content_labels_pkey'
}

/** input type for inserting data into table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Insert_Input = {
  content?: App_Content_Page_Obj_Rel_Insert_Input | null | undefined;
  content_id?: any;
  content_label?: App_Content_Label_Obj_Rel_Insert_Input | null | undefined;
  created_at?: any;
  id?: any;
  label_id?: any;
  updated_at?: any;
};

/** order by max() on columns of table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Max_Order_By = {
  content_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  label_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_Min_Order_By = {
  content_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  label_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "app.content_page_content_label" */
export type App_Content_Page_Content_Label_On_Conflict = {
  constraint: App_Content_Page_Content_Label_Constraint;
  update_columns?: Array<App_Content_Page_Content_Label_Update_Column>;
  where?: App_Content_Page_Content_Label_Bool_Exp | null | undefined;
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

/** input type for inserting data into table "app.content_page" */
export type App_Content_Page_Insert_Input = {
  content_blocks?: App_Content_Block_Arr_Rel_Insert_Input | null | undefined;
  content_content_labels?: App_Content_Page_Content_Label_Arr_Rel_Insert_Input | null | undefined;
  content_type?: string | null | undefined;
  content_width?: string | null | undefined;
  created_at?: any;
  depublish_at?: any;
  depublished_at?: any;
  description?: string | null | undefined;
  header_path?: string | null | undefined;
  id?: any;
  is_deleted?: boolean | null | undefined;
  is_protected?: boolean | null | undefined;
  is_public?: boolean | null | undefined;
  language?: Lookup_Languages_Enum | null | undefined;
  meta_description?: string | null | undefined;
  nl_parent_page_id?: any;
  owner_profile?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  /** slug van de pagina */
  path?: string | null | undefined;
  publish_at?: any;
  published_at?: any;
  published_at_display?: any;
  seo_description?: string | null | undefined;
  seo_image_path?: string | null | undefined;
  seo_keywords?: string | null | undefined;
  seo_title?: string | null | undefined;
  thumbnail_path?: string | null | undefined;
  title?: string | null | undefined;
  translated_content_pages?: App_Content_Page_Arr_Rel_Insert_Input | null | undefined;
  updated_at?: any;
  updated_by_profile_id?: any;
  updater_profile?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  user_group_ids?: any;
  user_profile_id?: any;
};

/** order by max() on columns of table "app.content_page" */
export type App_Content_Page_Max_Order_By = {
  content_type?: Order_By | null | undefined;
  content_width?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  depublish_at?: Order_By | null | undefined;
  depublished_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  header_path?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  meta_description?: Order_By | null | undefined;
  nl_parent_page_id?: Order_By | null | undefined;
  /** slug van de pagina */
  path?: Order_By | null | undefined;
  publish_at?: Order_By | null | undefined;
  published_at?: Order_By | null | undefined;
  published_at_display?: Order_By | null | undefined;
  seo_description?: Order_By | null | undefined;
  seo_image_path?: Order_By | null | undefined;
  seo_keywords?: Order_By | null | undefined;
  seo_title?: Order_By | null | undefined;
  thumbnail_path?: Order_By | null | undefined;
  title?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  updated_by_profile_id?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.content_page" */
export type App_Content_Page_Min_Order_By = {
  content_type?: Order_By | null | undefined;
  content_width?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  depublish_at?: Order_By | null | undefined;
  depublished_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  header_path?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  meta_description?: Order_By | null | undefined;
  nl_parent_page_id?: Order_By | null | undefined;
  /** slug van de pagina */
  path?: Order_By | null | undefined;
  publish_at?: Order_By | null | undefined;
  published_at?: Order_By | null | undefined;
  published_at_display?: Order_By | null | undefined;
  seo_description?: Order_By | null | undefined;
  seo_image_path?: Order_By | null | undefined;
  seo_keywords?: Order_By | null | undefined;
  seo_title?: Order_By | null | undefined;
  thumbnail_path?: Order_By | null | undefined;
  title?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  updated_by_profile_id?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
};

/** input type for inserting object relation for remote table "app.content_page" */
export type App_Content_Page_Obj_Rel_Insert_Input = {
  data: App_Content_Page_Insert_Input;
  /** upsert condition */
  on_conflict?: App_Content_Page_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "app.content_page" */
export type App_Content_Page_On_Conflict = {
  constraint: App_Content_Page_Constraint;
  update_columns?: Array<App_Content_Page_Update_Column>;
  where?: App_Content_Page_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "app.content_page". */
export type App_Content_Page_Order_By = {
  content_blocks_aggregate?: App_Content_Block_Aggregate_Order_By | null | undefined;
  content_content_labels_aggregate?: App_Content_Page_Content_Label_Aggregate_Order_By | null | undefined;
  content_type?: Order_By | null | undefined;
  content_width?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  depublish_at?: Order_By | null | undefined;
  depublished_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  header_path?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  is_deleted?: Order_By | null | undefined;
  is_protected?: Order_By | null | undefined;
  is_public?: Order_By | null | undefined;
  language?: Order_By | null | undefined;
  meta_description?: Order_By | null | undefined;
  nl_parent_page_id?: Order_By | null | undefined;
  owner_profile?: Users_Profile_Order_By | null | undefined;
  path?: Order_By | null | undefined;
  publish_at?: Order_By | null | undefined;
  published_at?: Order_By | null | undefined;
  published_at_display?: Order_By | null | undefined;
  seo_description?: Order_By | null | undefined;
  seo_image_path?: Order_By | null | undefined;
  seo_keywords?: Order_By | null | undefined;
  seo_title?: Order_By | null | undefined;
  thumbnail_path?: Order_By | null | undefined;
  title?: Order_By | null | undefined;
  translated_content_pages_aggregate?: App_Content_Page_Aggregate_Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  updated_by_profile_id?: Order_By | null | undefined;
  updater_profile?: Users_Profile_Order_By | null | undefined;
  user_group_ids?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
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
  DepublishedAt = 'depublished_at',
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
  Language = 'language',
  /** column name */
  MetaDescription = 'meta_description',
  /** column name */
  NlParentPageId = 'nl_parent_page_id',
  /** column name */
  Path = 'path',
  /** column name */
  PublishAt = 'publish_at',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  PublishedAtDisplay = 'published_at_display',
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

/** select "app_content_page_aggregate_bool_exp_bool_and_arguments_columns" columns of table "app.content_page" */
export enum App_Content_Page_Select_Column_App_Content_Page_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsProtected = 'is_protected',
  /** column name */
  IsPublic = 'is_public'
}

/** select "app_content_page_aggregate_bool_exp_bool_or_arguments_columns" columns of table "app.content_page" */
export enum App_Content_Page_Select_Column_App_Content_Page_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsProtected = 'is_protected',
  /** column name */
  IsPublic = 'is_public'
}

/** input type for updating data in table "app.content_page" */
export type App_Content_Page_Set_Input = {
  content_type?: string | null | undefined;
  content_width?: string | null | undefined;
  created_at?: any;
  depublish_at?: any;
  depublished_at?: any;
  description?: string | null | undefined;
  header_path?: string | null | undefined;
  id?: any;
  is_deleted?: boolean | null | undefined;
  is_protected?: boolean | null | undefined;
  is_public?: boolean | null | undefined;
  language?: Lookup_Languages_Enum | null | undefined;
  meta_description?: string | null | undefined;
  nl_parent_page_id?: any;
  /** slug van de pagina */
  path?: string | null | undefined;
  publish_at?: any;
  published_at?: any;
  published_at_display?: any;
  seo_description?: string | null | undefined;
  seo_image_path?: string | null | undefined;
  seo_keywords?: string | null | undefined;
  seo_title?: string | null | undefined;
  thumbnail_path?: string | null | undefined;
  title?: string | null | undefined;
  updated_at?: any;
  updated_by_profile_id?: any;
  user_group_ids?: any;
  user_profile_id?: any;
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
  DepublishedAt = 'depublished_at',
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
  Language = 'language',
  /** column name */
  MetaDescription = 'meta_description',
  /** column name */
  NlParentPageId = 'nl_parent_page_id',
  /** column name */
  Path = 'path',
  /** column name */
  PublishAt = 'publish_at',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  PublishedAtDisplay = 'published_at_display',
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

/** Boolean expression to filter rows from the table "app.maintenance_alerts". All fields are combined with a logical 'AND'. */
export type App_Maintenance_Alerts_Bool_Exp = {
  _and?: Array<App_Maintenance_Alerts_Bool_Exp> | null | undefined;
  _not?: App_Maintenance_Alerts_Bool_Exp | null | undefined;
  _or?: Array<App_Maintenance_Alerts_Bool_Exp> | null | undefined;
  from_date?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  language?: Lookup_Languages_Enum_Comparison_Exp | null | undefined;
  message?: String_Comparison_Exp | null | undefined;
  title?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  until_date?: Timestamp_Comparison_Exp | null | undefined;
  user_groups?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "app.maintenance_alerts" */
export type App_Maintenance_Alerts_Insert_Input = {
  from_date?: any;
  id?: any;
  language?: Lookup_Languages_Enum | null | undefined;
  message?: string | null | undefined;
  title?: string | null | undefined;
  type?: string | null | undefined;
  until_date?: any;
  user_groups?: any;
};

/** Ordering options when selecting data from "app.maintenance_alerts". */
export type App_Maintenance_Alerts_Order_By = {
  from_date?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  language?: Order_By | null | undefined;
  message?: Order_By | null | undefined;
  title?: Order_By | null | undefined;
  type?: Order_By | null | undefined;
  until_date?: Order_By | null | undefined;
  user_groups?: Order_By | null | undefined;
};

/** input type for updating data in table "app.maintenance_alerts" */
export type App_Maintenance_Alerts_Set_Input = {
  from_date?: any;
  id?: any;
  language?: Lookup_Languages_Enum | null | undefined;
  message?: string | null | undefined;
  title?: string | null | undefined;
  type?: string | null | undefined;
  until_date?: any;
  user_groups?: any;
};

export type App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp = {
  bool_and?: App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_And = {
  arguments: App_Material_Request_Message_Unread_Status_Select_Column_App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_Or = {
  arguments: App_Material_Request_Message_Unread_Status_Select_Column_App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Material_Request_Message_Unread_Status_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "app.material_request_message_unread_status" */
export type App_Material_Request_Message_Unread_Status_Arr_Rel_Insert_Input = {
  data: Array<App_Material_Request_Message_Unread_Status_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Material_Request_Message_Unread_Status_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.material_request_message_unread_status". All fields are combined with a logical 'AND'. */
export type App_Material_Request_Message_Unread_Status_Bool_Exp = {
  _and?: Array<App_Material_Request_Message_Unread_Status_Bool_Exp> | null | undefined;
  _not?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
  _or?: Array<App_Material_Request_Message_Unread_Status_Bool_Exp> | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  is_unread?: Boolean_Comparison_Exp | null | undefined;
  material_request_id?: Uuid_Comparison_Exp | null | undefined;
  material_request_message_id?: Uuid_Comparison_Exp | null | undefined;
  receiver_profile_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.material_request_message_unread_status" */
export enum App_Material_Request_Message_Unread_Status_Constraint {
  /** unique or primary key constraint on columns "material_request_message_id", "receiver_profile_id" */
  MaterialRequestMessageUnreMaterialRequestMessageIdRKey = 'material_request_message_unre_material_request_message_id_r_key',
  /** unique or primary key constraint on columns "id" */
  MaterialRequestMessageUnreadStatusPkey = 'material_request_message_unread_status_pkey'
}

/** input type for inserting data into table "app.material_request_message_unread_status" */
export type App_Material_Request_Message_Unread_Status_Insert_Input = {
  id?: any;
  is_unread?: boolean | null | undefined;
  material_request_id?: any;
  material_request_message_id?: any;
  receiver_profile_id?: any;
};

/** on_conflict condition type for table "app.material_request_message_unread_status" */
export type App_Material_Request_Message_Unread_Status_On_Conflict = {
  constraint: App_Material_Request_Message_Unread_Status_Constraint;
  update_columns?: Array<App_Material_Request_Message_Unread_Status_Update_Column>;
  where?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
};

/** select columns of table "app.material_request_message_unread_status" */
export enum App_Material_Request_Message_Unread_Status_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IsUnread = 'is_unread',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  MaterialRequestMessageId = 'material_request_message_id',
  /** column name */
  ReceiverProfileId = 'receiver_profile_id'
}

/** select "app_material_request_message_unread_status_aggregate_bool_exp_bool_and_arguments_columns" columns of table "app.material_request_message_unread_status" */
export enum App_Material_Request_Message_Unread_Status_Select_Column_App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsUnread = 'is_unread'
}

/** select "app_material_request_message_unread_status_aggregate_bool_exp_bool_or_arguments_columns" columns of table "app.material_request_message_unread_status" */
export enum App_Material_Request_Message_Unread_Status_Select_Column_App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsUnread = 'is_unread'
}

/** update columns of table "app.material_request_message_unread_status" */
export enum App_Material_Request_Message_Unread_Status_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IsUnread = 'is_unread',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  MaterialRequestMessageId = 'material_request_message_id',
  /** column name */
  ReceiverProfileId = 'receiver_profile_id'
}

export type App_Material_Request_Messages_And_Events_Aggregate_Bool_Exp = {
  count?: App_Material_Request_Messages_And_Events_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Material_Request_Messages_And_Events_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Material_Request_Messages_And_Events_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Messages_And_Events_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_Arr_Rel_Insert_Input = {
  data: Array<App_Material_Request_Messages_And_Events_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Material_Request_Messages_And_Events_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.material_request_messages_and_events". All fields are combined with a logical 'AND'. */
export type App_Material_Request_Messages_And_Events_Bool_Exp = {
  _and?: Array<App_Material_Request_Messages_And_Events_Bool_Exp> | null | undefined;
  _not?: App_Material_Request_Messages_And_Events_Bool_Exp | null | undefined;
  _or?: Array<App_Material_Request_Messages_And_Events_Bool_Exp> | null | undefined;
  attachment_filename?: String_Comparison_Exp | null | undefined;
  attachment_url?: String_Comparison_Exp | null | undefined;
  attachments?: App_Material_Request_Messages_Attachments_Bool_Exp | null | undefined;
  attachments_aggregate?: App_Material_Request_Messages_Attachments_Aggregate_Bool_Exp | null | undefined;
  body?: Jsonb_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  material_request?: App_Material_Requests_Bool_Exp | null | undefined;
  material_request_id?: Uuid_Comparison_Exp | null | undefined;
  message_type?: Lookup_App_Material_Request_Message_Type_Enum_Comparison_Exp | null | undefined;
  sender?: Users_Profile_Bool_Exp | null | undefined;
  sender_profile_id?: Uuid_Comparison_Exp | null | undefined;
  unread_statuses?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
  unread_statuses_aggregate?: App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.material_request_messages_and_events" */
export enum App_Material_Request_Messages_And_Events_Constraint {
  /** unique or primary key constraint on columns "id" */
  MaterialRequestMessagesPkey = 'material_request_messages_pkey'
}

/** input type for inserting data into table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_Insert_Input = {
  attachment_filename?: string | null | undefined;
  attachment_url?: string | null | undefined;
  attachments?: App_Material_Request_Messages_Attachments_Arr_Rel_Insert_Input | null | undefined;
  body?: any;
  created_at?: any;
  id?: any;
  material_request?: App_Material_Requests_Obj_Rel_Insert_Input | null | undefined;
  material_request_id?: any;
  message_type?: Lookup_App_Material_Request_Message_Type_Enum | null | undefined;
  sender?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  sender_profile_id?: any;
  unread_statuses?: App_Material_Request_Message_Unread_Status_Arr_Rel_Insert_Input | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_Obj_Rel_Insert_Input = {
  data: App_Material_Request_Messages_And_Events_Insert_Input;
  /** upsert condition */
  on_conflict?: App_Material_Request_Messages_And_Events_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_On_Conflict = {
  constraint: App_Material_Request_Messages_And_Events_Constraint;
  update_columns?: Array<App_Material_Request_Messages_And_Events_Update_Column>;
  where?: App_Material_Request_Messages_And_Events_Bool_Exp | null | undefined;
};

/** select columns of table "app.material_request_messages_and_events" */
export enum App_Material_Request_Messages_And_Events_Select_Column {
  /** column name */
  AttachmentFilename = 'attachment_filename',
  /** column name */
  AttachmentUrl = 'attachment_url',
  /** column name */
  Body = 'body',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  MessageType = 'message_type',
  /** column name */
  SenderProfileId = 'sender_profile_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "app.material_request_messages_and_events" */
export enum App_Material_Request_Messages_And_Events_Update_Column {
  /** column name */
  AttachmentFilename = 'attachment_filename',
  /** column name */
  AttachmentUrl = 'attachment_url',
  /** column name */
  Body = 'body',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  MessageType = 'message_type',
  /** column name */
  SenderProfileId = 'sender_profile_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type App_Material_Request_Messages_Attachments_Aggregate_Bool_Exp = {
  count?: App_Material_Request_Messages_Attachments_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Material_Request_Messages_Attachments_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Material_Request_Messages_Attachments_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Messages_Attachments_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "app.material_request_messages_attachments" */
export type App_Material_Request_Messages_Attachments_Arr_Rel_Insert_Input = {
  data: Array<App_Material_Request_Messages_Attachments_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Material_Request_Messages_Attachments_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.material_request_messages_attachments". All fields are combined with a logical 'AND'. */
export type App_Material_Request_Messages_Attachments_Bool_Exp = {
  _and?: Array<App_Material_Request_Messages_Attachments_Bool_Exp> | null | undefined;
  _not?: App_Material_Request_Messages_Attachments_Bool_Exp | null | undefined;
  _or?: Array<App_Material_Request_Messages_Attachments_Bool_Exp> | null | undefined;
  attachment_filename?: String_Comparison_Exp | null | undefined;
  attachment_url?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  material_request_message_id?: Uuid_Comparison_Exp | null | undefined;
  messages_and_event?: App_Material_Request_Messages_And_Events_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.material_request_messages_attachments" */
export enum App_Material_Request_Messages_Attachments_Constraint {
  /** unique or primary key constraint on columns "material_request_message_id", "attachment_url" */
  MaterialRequestMessagesAttachmentsMaterialRequestMessage = 'material_request_messages_attachments_material_request_message_',
  /** unique or primary key constraint on columns "id" */
  MaterialRequestMessagesAttachmentsPkey = 'material_request_messages_attachments_pkey'
}

/** input type for inserting data into table "app.material_request_messages_attachments" */
export type App_Material_Request_Messages_Attachments_Insert_Input = {
  attachment_filename?: string | null | undefined;
  attachment_url?: string | null | undefined;
  created_at?: any;
  id?: any;
  material_request_message_id?: any;
  messages_and_event?: App_Material_Request_Messages_And_Events_Obj_Rel_Insert_Input | null | undefined;
};

/** on_conflict condition type for table "app.material_request_messages_attachments" */
export type App_Material_Request_Messages_Attachments_On_Conflict = {
  constraint: App_Material_Request_Messages_Attachments_Constraint;
  update_columns?: Array<App_Material_Request_Messages_Attachments_Update_Column>;
  where?: App_Material_Request_Messages_Attachments_Bool_Exp | null | undefined;
};

/** select columns of table "app.material_request_messages_attachments" */
export enum App_Material_Request_Messages_Attachments_Select_Column {
  /** column name */
  AttachmentFilename = 'attachment_filename',
  /** column name */
  AttachmentUrl = 'attachment_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MaterialRequestMessageId = 'material_request_message_id'
}

/** update columns of table "app.material_request_messages_attachments" */
export enum App_Material_Request_Messages_Attachments_Update_Column {
  /** column name */
  AttachmentFilename = 'attachment_filename',
  /** column name */
  AttachmentUrl = 'attachment_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MaterialRequestMessageId = 'material_request_message_id'
}

export type App_Material_Request_Reuse_Form_Values_Aggregate_Bool_Exp = {
  count?: App_Material_Request_Reuse_Form_Values_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Material_Request_Reuse_Form_Values_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Material_Request_Reuse_Form_Values_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Reuse_Form_Values_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "app.material_request_reuse_form_values" */
export type App_Material_Request_Reuse_Form_Values_Arr_Rel_Insert_Input = {
  data: Array<App_Material_Request_Reuse_Form_Values_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Material_Request_Reuse_Form_Values_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.material_request_reuse_form_values". All fields are combined with a logical 'AND'. */
export type App_Material_Request_Reuse_Form_Values_Bool_Exp = {
  _and?: Array<App_Material_Request_Reuse_Form_Values_Bool_Exp> | null | undefined;
  _not?: App_Material_Request_Reuse_Form_Values_Bool_Exp | null | undefined;
  _or?: Array<App_Material_Request_Reuse_Form_Values_Bool_Exp> | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  key?: String_Comparison_Exp | null | undefined;
  material_request_id?: Uuid_Comparison_Exp | null | undefined;
  value?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.material_request_reuse_form_values" */
export enum App_Material_Request_Reuse_Form_Values_Constraint {
  /** unique or primary key constraint on columns "id" */
  MaterialRequestReuseFormValuesPkey = 'material_request_reuse_form_values_pkey'
}

/** input type for inserting data into table "app.material_request_reuse_form_values" */
export type App_Material_Request_Reuse_Form_Values_Insert_Input = {
  id?: any;
  key?: string | null | undefined;
  material_request_id?: any;
  value?: string | null | undefined;
};

/** on_conflict condition type for table "app.material_request_reuse_form_values" */
export type App_Material_Request_Reuse_Form_Values_On_Conflict = {
  constraint: App_Material_Request_Reuse_Form_Values_Constraint;
  update_columns?: Array<App_Material_Request_Reuse_Form_Values_Update_Column>;
  where?: App_Material_Request_Reuse_Form_Values_Bool_Exp | null | undefined;
};

/** select columns of table "app.material_request_reuse_form_values" */
export enum App_Material_Request_Reuse_Form_Values_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Key = 'key',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  Value = 'value'
}

/** update columns of table "app.material_request_reuse_form_values" */
export enum App_Material_Request_Reuse_Form_Values_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Key = 'key',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  Value = 'value'
}

/** Boolean expression to filter rows from the table "app.material_requests". All fields are combined with a logical 'AND'. */
export type App_Material_Requests_Bool_Exp = {
  _and?: Array<App_Material_Requests_Bool_Exp> | null | undefined;
  _not?: App_Material_Requests_Bool_Exp | null | undefined;
  _or?: Array<App_Material_Requests_Bool_Exp> | null | undefined;
  approved_at?: Timestamp_Comparison_Exp | null | undefined;
  cancelled_at?: Timestamp_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  denied_at?: Timestamp_Comparison_Exp | null | undefined;
  download_available_at?: Timestamp_Comparison_Exp | null | undefined;
  download_expiry_warning_email_sent?: Boolean_Comparison_Exp | null | undefined;
  download_job_id?: String_Comparison_Exp | null | undefined;
  download_retries?: Int_Comparison_Exp | null | undefined;
  download_status?: Lookup_App_Material_Request_Download_Status_Enum_Comparison_Exp | null | undefined;
  download_url?: String_Comparison_Exp | null | undefined;
  group_id?: Uuid_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  ie_object_id?: String_Comparison_Exp | null | undefined;
  ie_object_representation_id?: String_Comparison_Exp | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  is_archived?: Boolean_Comparison_Exp | null | undefined;
  is_pending?: Boolean_Comparison_Exp | null | undefined;
  material_request_reuse_form_values?: App_Material_Request_Reuse_Form_Values_Bool_Exp | null | undefined;
  material_request_reuse_form_values_aggregate?: App_Material_Request_Reuse_Form_Values_Aggregate_Bool_Exp | null | undefined;
  messages_and_events?: App_Material_Request_Messages_And_Events_Bool_Exp | null | undefined;
  messages_and_events_aggregate?: App_Material_Request_Messages_And_Events_Aggregate_Bool_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  objectRepresentation?: Graph_Representation_Bool_Exp | null | undefined;
  organisation?: Graph_Organization_Bool_Exp | null | undefined;
  organisation_id?: String_Comparison_Exp | null | undefined;
  organisation_name?: String_Comparison_Exp | null | undefined;
  profile_id?: Uuid_Comparison_Exp | null | undefined;
  reason?: String_Comparison_Exp | null | undefined;
  requested_at?: Timestamp_Comparison_Exp | null | undefined;
  requested_by?: Users_Profile_Bool_Exp | null | undefined;
  requester_capacity?: Lookup_App_Material_Request_Requester_Capacity_Enum_Comparison_Exp | null | undefined;
  status?: Lookup_App_Material_Request_Status_Enum_Comparison_Exp | null | undefined;
  status_info?: Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp | null | undefined;
  status_motivation?: String_Comparison_Exp | null | undefined;
  type?: Lookup_App_Material_Request_Type_Enum_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.material_requests" */
export enum App_Material_Requests_Constraint {
  /** unique or primary key constraint on columns "id" */
  MaterialRequestsPkey = 'material_requests_pkey'
}

/** input type for inserting data into table "app.material_requests" */
export type App_Material_Requests_Insert_Input = {
  approved_at?: any;
  cancelled_at?: any;
  created_at?: any;
  denied_at?: any;
  download_available_at?: any;
  download_expiry_warning_email_sent?: boolean | null | undefined;
  download_job_id?: string | null | undefined;
  download_retries?: number | null | undefined;
  download_status?: Lookup_App_Material_Request_Download_Status_Enum | null | undefined;
  download_url?: string | null | undefined;
  group_id?: any;
  id?: any;
  ie_object_id?: string | null | undefined;
  ie_object_representation_id?: string | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  is_archived?: boolean | null | undefined;
  is_pending?: boolean | null | undefined;
  material_request_reuse_form_values?: App_Material_Request_Reuse_Form_Values_Arr_Rel_Insert_Input | null | undefined;
  messages_and_events?: App_Material_Request_Messages_And_Events_Arr_Rel_Insert_Input | null | undefined;
  name?: string | null | undefined;
  objectRepresentation?: Graph_Representation_Obj_Rel_Insert_Input | null | undefined;
  organisation?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  organisation_id?: string | null | undefined;
  organisation_name?: string | null | undefined;
  profile_id?: any;
  reason?: string | null | undefined;
  requested_at?: any;
  requested_by?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  requester_capacity?: Lookup_App_Material_Request_Requester_Capacity_Enum | null | undefined;
  status?: Lookup_App_Material_Request_Status_Enum | null | undefined;
  status_info?: Lookup_App_Material_Request_Status_Sort_Order_Obj_Rel_Insert_Input | null | undefined;
  status_motivation?: string | null | undefined;
  type?: Lookup_App_Material_Request_Type_Enum | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "app.material_requests" */
export type App_Material_Requests_Obj_Rel_Insert_Input = {
  data: App_Material_Requests_Insert_Input;
  /** upsert condition */
  on_conflict?: App_Material_Requests_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "app.material_requests" */
export type App_Material_Requests_On_Conflict = {
  constraint: App_Material_Requests_Constraint;
  update_columns?: Array<App_Material_Requests_Update_Column>;
  where?: App_Material_Requests_Bool_Exp | null | undefined;
};

/** update columns of table "app.material_requests" */
export enum App_Material_Requests_Update_Column {
  /** column name */
  ApprovedAt = 'approved_at',
  /** column name */
  CancelledAt = 'cancelled_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeniedAt = 'denied_at',
  /** column name */
  DownloadAvailableAt = 'download_available_at',
  /** column name */
  DownloadExpiryWarningEmailSent = 'download_expiry_warning_email_sent',
  /** column name */
  DownloadJobId = 'download_job_id',
  /** column name */
  DownloadRetries = 'download_retries',
  /** column name */
  DownloadStatus = 'download_status',
  /** column name */
  DownloadUrl = 'download_url',
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  IeObjectId = 'ie_object_id',
  /** column name */
  IeObjectRepresentationId = 'ie_object_representation_id',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  IsPending = 'is_pending',
  /** column name */
  Name = 'name',
  /** column name */
  OrganisationId = 'organisation_id',
  /** column name */
  OrganisationName = 'organisation_name',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  Reason = 'reason',
  /** column name */
  RequestedAt = 'requested_at',
  /** column name */
  RequesterCapacity = 'requester_capacity',
  /** column name */
  Status = 'status',
  /** column name */
  StatusMotivation = 'status_motivation',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for inserting data into table "app.navigation" */
export type App_Navigation_Insert_Input = {
  /** id van de gelinkte content block pagina */
  content_id?: any;
  content_path?: string | null | undefined;
  content_type?: string | null | undefined;
  created_at?: any;
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: string | null | undefined;
  icon_name?: string | null | undefined;
  id?: any;
  label?: string | null | undefined;
  language?: Lookup_Languages_Enum | null | undefined;
  /** open in new tab of in zelfde tab */
  link_target?: string | null | undefined;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement?: string | null | undefined;
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: number | null | undefined;
  tooltip?: string | null | undefined;
  updated_at?: any;
  user_group_ids?: any;
};

/** Ordering options when selecting data from "app.navigation". */
export type App_Navigation_Order_By = {
  content_id?: Order_By | null | undefined;
  content_path?: Order_By | null | undefined;
  content_type?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  icon_name?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  label?: Order_By | null | undefined;
  language?: Order_By | null | undefined;
  link_target?: Order_By | null | undefined;
  placement?: Order_By | null | undefined;
  position?: Order_By | null | undefined;
  tooltip?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  user_group_ids?: Order_By | null | undefined;
};

/** input type for updating data in table "app.navigation" */
export type App_Navigation_Set_Input = {
  /** id van de gelinkte content block pagina */
  content_id?: any;
  content_path?: string | null | undefined;
  content_type?: string | null | undefined;
  created_at?: any;
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: string | null | undefined;
  icon_name?: string | null | undefined;
  id?: any;
  label?: string | null | undefined;
  language?: Lookup_Languages_Enum | null | undefined;
  /** open in new tab of in zelfde tab */
  link_target?: string | null | undefined;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement?: string | null | undefined;
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: number | null | undefined;
  tooltip?: string | null | undefined;
  updated_at?: any;
  user_group_ids?: any;
};

export type App_Notification_Aggregate_Bool_Exp = {
  count?: App_Notification_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Notification_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Notification_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Notification_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.notification" */
export type App_Notification_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: App_Notification_Max_Order_By | null | undefined;
  min?: App_Notification_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.notification" */
export type App_Notification_Arr_Rel_Insert_Input = {
  data: Array<App_Notification_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Notification_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.notification". All fields are combined with a logical 'AND'. */
export type App_Notification_Bool_Exp = {
  _and?: Array<App_Notification_Bool_Exp> | null | undefined;
  _not?: App_Notification_Bool_Exp | null | undefined;
  _or?: Array<App_Notification_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  linked_entity_id?: Uuid_Comparison_Exp | null | undefined;
  material_request?: App_Material_Requests_Bool_Exp | null | undefined;
  recipient?: Uuid_Comparison_Exp | null | undefined;
  recipient_profile?: Users_Profile_Bool_Exp | null | undefined;
  status?: String_Comparison_Exp | null | undefined;
  title?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  visitor_space_request?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.notification" */
export enum App_Notification_Constraint {
  /** unique or primary key constraint on columns "id" */
  NotificationPkey = 'notification_pkey'
}

/** input type for inserting data into table "app.notification" */
export type App_Notification_Insert_Input = {
  created_at?: any;
  description?: string | null | undefined;
  id?: any;
  /** Indien de melding een entiteit (bezoekersaanvraag, materiaalaanvraag, ...) betreft */
  linked_entity_id?: any;
  material_request?: App_Material_Requests_Obj_Rel_Insert_Input | null | undefined;
  /** Profile id van de bedoelde ontvanger */
  recipient?: any;
  recipient_profile?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  status?: string | null | undefined;
  title?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: any;
  visitor_space_request?: Maintainer_Visitor_Space_Request_Obj_Rel_Insert_Input | null | undefined;
};

/** order by max() on columns of table "app.notification" */
export type App_Notification_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  /** Indien de melding een entiteit (bezoekersaanvraag, materiaalaanvraag, ...) betreft */
  linked_entity_id?: Order_By | null | undefined;
  /** Profile id van de bedoelde ontvanger */
  recipient?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  title?: Order_By | null | undefined;
  type?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.notification" */
export type App_Notification_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  /** Indien de melding een entiteit (bezoekersaanvraag, materiaalaanvraag, ...) betreft */
  linked_entity_id?: Order_By | null | undefined;
  /** Profile id van de bedoelde ontvanger */
  recipient?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  title?: Order_By | null | undefined;
  type?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "app.notification" */
export type App_Notification_On_Conflict = {
  constraint: App_Notification_Constraint;
  update_columns?: Array<App_Notification_Update_Column>;
  where?: App_Notification_Bool_Exp | null | undefined;
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
  LinkedEntityId = 'linked_entity_id',
  /** column name */
  Recipient = 'recipient',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "app.notification" */
export enum App_Notification_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  LinkedEntityId = 'linked_entity_id',
  /** column name */
  Recipient = 'recipient',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to compare columns of type "ebucore_annotation_source". All fields are combined with logical 'AND'. */
export type Ebucore_Annotation_Source_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to filter rows from the table "graph._dcterms_rights_statement". All fields are combined with a logical 'AND'. */
export type Graph__Dcterms_Rights_Statement_Bool_Exp = {
  _and?: Array<Graph__Dcterms_Rights_Statement_Bool_Exp> | null | undefined;
  _not?: Graph__Dcterms_Rights_Statement_Bool_Exp | null | undefined;
  _or?: Array<Graph__Dcterms_Rights_Statement_Bool_Exp> | null | undefined;
  dcterms_rights_statement?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._dcterms_rights_statement" */
export type Graph__Dcterms_Rights_Statement_Insert_Input = {
  dcterms_rights_statement?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
};

/** input type for inserting object relation for remote table "graph._dcterms_rights_statement" */
export type Graph__Dcterms_Rights_Statement_Obj_Rel_Insert_Input = {
  data: Graph__Dcterms_Rights_Statement_Insert_Input;
};

export type Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Aggregate_Bool_Exp = {
  count?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph._ebucore_annotation_is_annotated_media_resource" */
export type Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Arr_Rel_Insert_Input = {
  data: Array<Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Insert_Input>;
};

/** Boolean expression to filter rows from the table "graph._ebucore_annotation_is_annotated_media_resource". All fields are combined with a logical 'AND'. */
export type Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp = {
  _and?: Array<Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp> | null | undefined;
  _not?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp | null | undefined;
  _or?: Array<Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ebucore_annotation_id?: String_Comparison_Exp | null | undefined;
  end_offset?: Numeric_Comparison_Exp | null | undefined;
  height?: Int_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  start_offset?: Numeric_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  width?: Int_Comparison_Exp | null | undefined;
  x?: Int_Comparison_Exp | null | undefined;
  y?: Int_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._ebucore_annotation_is_annotated_media_resource" */
export type Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Insert_Input = {
  created_at?: any;
  ebucore_annotation_id?: string | null | undefined;
  end_offset?: any;
  height?: number | null | undefined;
  id?: string | null | undefined;
  start_offset?: any;
  updated_at?: any;
  width?: number | null | undefined;
  x?: number | null | undefined;
  y?: number | null | undefined;
};

/** select columns of table "graph._ebucore_annotation_is_annotated_media_resource" */
export enum Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EbucoreAnnotationId = 'ebucore_annotation_id',
  /** column name */
  EndOffset = 'end_offset',
  /** column name */
  Height = 'height',
  /** column name */
  Id = 'id',
  /** column name */
  StartOffset = 'start_offset',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Width = 'width',
  /** column name */
  X = 'x',
  /** column name */
  Y = 'y'
}

export type Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp = {
  bool_and?: Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_And = {
  arguments: Graph__File_Ebucore_Has_Captioning_Select_Column_Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Ebucore_Has_Captioning_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Graph__File_Ebucore_Has_Captioning_Select_Column_Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Ebucore_Has_Captioning_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__File_Ebucore_Has_Captioning_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Ebucore_Has_Captioning_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Arr_Rel_Insert_Input = {
  data: Array<Graph__File_Ebucore_Has_Captioning_Insert_Input>;
};

/** Boolean expression to filter rows from the table "graph._file_ebucore_has_captioning". All fields are combined with a logical 'AND'. */
export type Graph__File_Ebucore_Has_Captioning_Bool_Exp = {
  _and?: Array<Graph__File_Ebucore_Has_Captioning_Bool_Exp> | null | undefined;
  _not?: Graph__File_Ebucore_Has_Captioning_Bool_Exp | null | undefined;
  _or?: Array<Graph__File_Ebucore_Has_Captioning_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ebucore_has_mime_type?: String_Comparison_Exp | null | undefined;
  edm_is_next_in_sequence?: String_Comparison_Exp | null | undefined;
  file_id?: String_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  is_ai_generated?: Boolean_Comparison_Exp | null | undefined;
  mh_fragment_identifier?: String_Comparison_Exp | null | undefined;
  premis_original_name?: String_Comparison_Exp | null | undefined;
  premis_stored_at?: String_Comparison_Exp | null | undefined;
  schema_duration?: Numeric_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Insert_Input = {
  created_at?: any;
  ebucore_has_mime_type?: string | null | undefined;
  edm_is_next_in_sequence?: string | null | undefined;
  file_id?: string | null | undefined;
  id?: string | null | undefined;
  is_ai_generated?: boolean | null | undefined;
  mh_fragment_identifier?: string | null | undefined;
  premis_original_name?: string | null | undefined;
  premis_stored_at?: string | null | undefined;
  schema_duration?: any;
  schema_name?: string | null | undefined;
  schema_thumbnail_url?: string | null | undefined;
  updated_at?: any;
};

/** select columns of table "graph._file_ebucore_has_captioning" */
export enum Graph__File_Ebucore_Has_Captioning_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EbucoreHasMimeType = 'ebucore_has_mime_type',
  /** column name */
  EdmIsNextInSequence = 'edm_is_next_in_sequence',
  /** column name */
  FileId = 'file_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  MhFragmentIdentifier = 'mh_fragment_identifier',
  /** column name */
  PremisOriginalName = 'premis_original_name',
  /** column name */
  PremisStoredAt = 'premis_stored_at',
  /** column name */
  SchemaDuration = 'schema_duration',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "graph__file_ebucore_has_captioning_aggregate_bool_exp_bool_and_arguments_columns" columns of table "graph._file_ebucore_has_captioning" */
export enum Graph__File_Ebucore_Has_Captioning_Select_Column_Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** select "graph__file_ebucore_has_captioning_aggregate_bool_exp_bool_or_arguments_columns" columns of table "graph._file_ebucore_has_captioning" */
export enum Graph__File_Ebucore_Has_Captioning_Select_Column_Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

export type Graph__File_Has_Annotation_Aggregate_Bool_Exp = {
  bool_and?: Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Graph__File_Has_Annotation_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_And = {
  arguments: Graph__File_Has_Annotation_Select_Column_Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Has_Annotation_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Graph__File_Has_Annotation_Select_Column_Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Has_Annotation_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph__File_Has_Annotation_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__File_Has_Annotation_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Has_Annotation_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Arr_Rel_Insert_Input = {
  data: Array<Graph__File_Has_Annotation_Insert_Input>;
};

/** Boolean expression to filter rows from the table "graph._file_has_annotation". All fields are combined with a logical 'AND'. */
export type Graph__File_Has_Annotation_Bool_Exp = {
  _and?: Array<Graph__File_Has_Annotation_Bool_Exp> | null | undefined;
  _not?: Graph__File_Has_Annotation_Bool_Exp | null | undefined;
  _or?: Array<Graph__File_Has_Annotation_Bool_Exp> | null | undefined;
  annotation_confidence?: Numeric_Comparison_Exp | null | undefined;
  annotation_type?: String_Comparison_Exp | null | undefined;
  character_end_index?: Int_Comparison_Exp | null | undefined;
  character_start_index?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  file_id?: String_Comparison_Exp | null | undefined;
  has_annotation_related_artefact?: String_Comparison_Exp | null | undefined;
  has_annotation_related_artefact_thing?: Graph_Thing_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  is_ai_generated?: Boolean_Comparison_Exp | null | undefined;
  is_annotated_media_resource?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp | null | undefined;
  is_annotated_media_resource_aggregate?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Aggregate_Bool_Exp | null | undefined;
  source?: Ebucore_Annotation_Source_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Insert_Input = {
  annotation_confidence?: any;
  annotation_type?: string | null | undefined;
  character_end_index?: number | null | undefined;
  character_start_index?: number | null | undefined;
  created_at?: any;
  file_id?: string | null | undefined;
  has_annotation_related_artefact?: string | null | undefined;
  has_annotation_related_artefact_thing?: Graph_Thing_Obj_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  is_ai_generated?: boolean | null | undefined;
  is_annotated_media_resource?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Arr_Rel_Insert_Input | null | undefined;
  source?: any;
  updated_at?: any;
};

/** select columns of table "graph._file_has_annotation" */
export enum Graph__File_Has_Annotation_Select_Column {
  /** column name */
  AnnotationConfidence = 'annotation_confidence',
  /** column name */
  AnnotationType = 'annotation_type',
  /** column name */
  CharacterEndIndex = 'character_end_index',
  /** column name */
  CharacterStartIndex = 'character_start_index',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FileId = 'file_id',
  /** column name */
  HasAnnotationRelatedArtefact = 'has_annotation_related_artefact',
  /** column name */
  Id = 'id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  Source = 'source',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "graph__file_has_annotation_aggregate_bool_exp_bool_and_arguments_columns" columns of table "graph._file_has_annotation" */
export enum Graph__File_Has_Annotation_Select_Column_Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** select "graph__file_has_annotation_aggregate_bool_exp_bool_or_arguments_columns" columns of table "graph._file_has_annotation" */
export enum Graph__File_Has_Annotation_Select_Column_Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** Boolean expression to filter rows from the table "graph._film_has_audio". All fields are combined with a logical 'AND'. */
export type Graph__Film_Has_Audio_Bool_Exp = {
  _and?: Array<Graph__Film_Has_Audio_Bool_Exp> | null | undefined;
  _not?: Graph__Film_Has_Audio_Bool_Exp | null | undefined;
  _or?: Array<Graph__Film_Has_Audio_Bool_Exp> | null | undefined;
  audio?: Boolean_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._film_has_audio" */
export type Graph__Film_Has_Audio_Insert_Input = {
  audio?: boolean | null | undefined;
  intellectual_entity_id?: string | null | undefined;
};

/** input type for inserting object relation for remote table "graph._film_has_audio" */
export type Graph__Film_Has_Audio_Obj_Rel_Insert_Input = {
  data: Graph__Film_Has_Audio_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._ha_des_coloring_type". All fields are combined with a logical 'AND'. */
export type Graph__Ha_Des_Coloring_Type_Bool_Exp = {
  _and?: Array<Graph__Ha_Des_Coloring_Type_Bool_Exp> | null | undefined;
  _not?: Graph__Ha_Des_Coloring_Type_Bool_Exp | null | undefined;
  _or?: Array<Graph__Ha_Des_Coloring_Type_Bool_Exp> | null | undefined;
  ha_des_coloring_type?: Jsonb_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._ha_des_coloring_type" */
export type Graph__Ha_Des_Coloring_Type_Insert_Input = {
  ha_des_coloring_type?: any;
  intellectual_entity_id?: string | null | undefined;
};

/** input type for inserting object relation for remote table "graph._ha_des_coloring_type" */
export type Graph__Ha_Des_Coloring_Type_Obj_Rel_Insert_Input = {
  data: Graph__Ha_Des_Coloring_Type_Insert_Input;
};

export type Graph__Highlight_Aggregate_Bool_Exp = {
  count?: Graph__Highlight_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__Highlight_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__Highlight_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__Highlight_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph._highlight" */
export type Graph__Highlight_Arr_Rel_Insert_Input = {
  data: Array<Graph__Highlight_Insert_Input>;
};

/** Boolean expression to filter rows from the table "graph._highlight". All fields are combined with a logical 'AND'. */
export type Graph__Highlight_Bool_Exp = {
  _and?: Array<Graph__Highlight_Bool_Exp> | null | undefined;
  _not?: Graph__Highlight_Bool_Exp | null | undefined;
  _or?: Array<Graph__Highlight_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  height?: Int_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  schema_mentions_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  width?: Int_Comparison_Exp | null | undefined;
  x?: Int_Comparison_Exp | null | undefined;
  y?: Int_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._highlight" */
export type Graph__Highlight_Insert_Input = {
  created_at?: any;
  height?: number | null | undefined;
  id?: string | null | undefined;
  schema_mentions_id?: string | null | undefined;
  updated_at?: any;
  width?: number | null | undefined;
  x?: number | null | undefined;
  y?: number | null | undefined;
};

/** select columns of table "graph._highlight" */
export enum Graph__Highlight_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Height = 'height',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaMentionsId = 'schema_mentions_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Width = 'width',
  /** column name */
  X = 'x',
  /** column name */
  Y = 'y'
}

export type Graph__Intellectual_Entity_Aggregate_Bool_Exp = {
  count?: Graph__Intellectual_Entity_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__Intellectual_Entity_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__Intellectual_Entity_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__Intellectual_Entity_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph._intellectual_entity" */
export type Graph__Intellectual_Entity_Arr_Rel_Insert_Input = {
  data: Array<Graph__Intellectual_Entity_Insert_Input>;
};

/** Boolean expression to filter rows from the table "graph._intellectual_entity". All fields are combined with a logical 'AND'. */
export type Graph__Intellectual_Entity_Bool_Exp = {
  _and?: Array<Graph__Intellectual_Entity_Bool_Exp> | null | undefined;
  _not?: Graph__Intellectual_Entity_Bool_Exp | null | undefined;
  _or?: Array<Graph__Intellectual_Entity_Bool_Exp> | null | undefined;
  bibframe_edition?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  dctermsRightsStatement?: Graph__Dcterms_Rights_Statement_Bool_Exp | null | undefined;
  dcterms_available?: String_Comparison_Exp | null | undefined;
  dcterms_format?: String_Comparison_Exp | null | undefined;
  dcterms_medium?: Jsonb_Comparison_Exp | null | undefined;
  dcterms_rights?: String_Comparison_Exp | null | undefined;
  ebucoreSynopses?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  ebucoreSynopses_aggregate?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp | null | undefined;
  ebucore_has_cast_member?: String_Comparison_Exp | null | undefined;
  ebucore_has_object_type?: String_Comparison_Exp | null | undefined;
  ebucore_synopsis?: String_Comparison_Exp | null | undefined;
  folderIntellectualEntities?: Users_Folder_Ie_Bool_Exp | null | undefined;
  folderIntellectualEntities_aggregate?: Users_Folder_Ie_Aggregate_Bool_Exp | null | undefined;
  haDesColoringType?: Graph__Ha_Des_Coloring_Type_Bool_Exp | null | undefined;
  haDesLicenseDistributors?: Graph_Hades_License_Distributor_Bool_Exp | null | undefined;
  haDesLicenseDistributors_aggregate?: Graph_Hades_License_Distributor_Aggregate_Bool_Exp | null | undefined;
  hasAudio?: Graph__Film_Has_Audio_Bool_Exp | null | undefined;
  hasCarrier?: Graph_Carrier_Bool_Exp | null | undefined;
  hasPart?: Graph__Intellectual_Entity_Bool_Exp | null | undefined;
  hasPart_aggregate?: Graph__Intellectual_Entity_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  isPartOf?: Graph__Intellectual_Entity_Bool_Exp | null | undefined;
  isRepresentedBy?: Graph__Representation_Bool_Exp | null | undefined;
  isRepresentedBy_aggregate?: Graph__Representation_Aggregate_Bool_Exp | null | undefined;
  meemoo_identifier?: Jsonb_Comparison_Exp | null | undefined;
  meemoo_local_id?: Jsonb_Comparison_Exp | null | undefined;
  premisIdentifier?: Graph__Premis_Identifier_Bool_Exp | null | undefined;
  premis_is_part_of?: String_Comparison_Exp | null | undefined;
  rights?: Graph_Rights_Bool_Exp | null | undefined;
  schemaCopyrightHolder?: Graph_Schema_Copyright_Holder_Bool_Exp | null | undefined;
  schemaCopyrightHolder_aggregate?: Graph_Schema_Copyright_Holder_Aggregate_Bool_Exp | null | undefined;
  schemaGenre?: Graph__Schema_Genre_Bool_Exp | null | undefined;
  schemaInLanguage?: Graph__Schema_In_Language_Bool_Exp | null | undefined;
  schemaIsPartOf?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  schemaIsPartOf_aggregate?: Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp | null | undefined;
  schemaKeywords?: Graph__Schema_Keywords_Bool_Exp | null | undefined;
  schemaMaintainer?: Graph_Organization_Bool_Exp | null | undefined;
  schemaMentions?: Graph_Schema_Mentions_Bool_Exp | null | undefined;
  schemaMentions_aggregate?: Graph_Schema_Mentions_Aggregate_Bool_Exp | null | undefined;
  schemaNames?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  schemaNames_aggregate?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp | null | undefined;
  schemaPublisher?: Graph__Schema_Publisher_Bool_Exp | null | undefined;
  schemaSpatial?: Graph__Schema_Spatial_Bool_Exp | null | undefined;
  schemaTemporal?: Graph__Schema_Temporal_Bool_Exp | null | undefined;
  schemaTranscript?: Graph__Schema_Transcript_Bool_Exp | null | undefined;
  schema_abstract?: String_Comparison_Exp | null | undefined;
  schema_copyright_notice?: String_Comparison_Exp | null | undefined;
  schema_creator?: Jsonb_Comparison_Exp | null | undefined;
  schema_date_created?: String_Comparison_Exp | null | undefined;
  schema_date_published?: String_Comparison_Exp | null | undefined;
  schema_description?: String_Comparison_Exp | null | undefined;
  schema_duration?: Interval_Comparison_Exp | null | undefined;
  schema_identifier?: String_Comparison_Exp | null | undefined;
  schema_is_part_of?: Jsonb_Comparison_Exp | null | undefined;
  schema_license?: Jsonb_Comparison_Exp | null | undefined;
  schema_maintainer?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_number_of_pages?: Int_Comparison_Exp | null | undefined;
  schema_position?: Int_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: Jsonb_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._intellectual_entity" */
export type Graph__Intellectual_Entity_Insert_Input = {
  bibframe_edition?: string | null | undefined;
  created_at?: any;
  dctermsRightsStatement?: Graph__Dcterms_Rights_Statement_Obj_Rel_Insert_Input | null | undefined;
  dcterms_available?: string | null | undefined;
  dcterms_format?: string | null | undefined;
  dcterms_medium?: any;
  dcterms_rights?: string | null | undefined;
  ebucoreSynopses?: Graph_Intellectual_Entity_Ebucore_Synopsis_Arr_Rel_Insert_Input | null | undefined;
  ebucore_has_cast_member?: string | null | undefined;
  ebucore_has_object_type?: string | null | undefined;
  ebucore_synopsis?: string | null | undefined;
  folderIntellectualEntities?: Users_Folder_Ie_Arr_Rel_Insert_Input | null | undefined;
  haDesColoringType?: Graph__Ha_Des_Coloring_Type_Obj_Rel_Insert_Input | null | undefined;
  haDesLicenseDistributors?: Graph_Hades_License_Distributor_Arr_Rel_Insert_Input | null | undefined;
  hasAudio?: Graph__Film_Has_Audio_Obj_Rel_Insert_Input | null | undefined;
  hasCarrier?: Graph_Carrier_Obj_Rel_Insert_Input | null | undefined;
  hasPart?: Graph__Intellectual_Entity_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  isPartOf?: Graph__Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  isRepresentedBy?: Graph__Representation_Arr_Rel_Insert_Input | null | undefined;
  meemoo_identifier?: any;
  meemoo_local_id?: any;
  premisIdentifier?: Graph__Premis_Identifier_Obj_Rel_Insert_Input | null | undefined;
  premis_is_part_of?: string | null | undefined;
  rights?: Graph_Rights_Obj_Rel_Insert_Input | null | undefined;
  schemaCopyrightHolder?: Graph_Schema_Copyright_Holder_Arr_Rel_Insert_Input | null | undefined;
  schemaGenre?: Graph__Schema_Genre_Obj_Rel_Insert_Input | null | undefined;
  schemaInLanguage?: Graph__Schema_In_Language_Obj_Rel_Insert_Input | null | undefined;
  schemaIsPartOf?: Graph_Schema_Is_Part_Of_Arr_Rel_Insert_Input | null | undefined;
  schemaKeywords?: Graph__Schema_Keywords_Obj_Rel_Insert_Input | null | undefined;
  schemaMaintainer?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  schemaMentions?: Graph_Schema_Mentions_Arr_Rel_Insert_Input | null | undefined;
  schemaNames?: Graph_Intellectual_Entity_Schema_Name_Arr_Rel_Insert_Input | null | undefined;
  schemaPublisher?: Graph__Schema_Publisher_Obj_Rel_Insert_Input | null | undefined;
  schemaSpatial?: Graph__Schema_Spatial_Obj_Rel_Insert_Input | null | undefined;
  schemaTemporal?: Graph__Schema_Temporal_Obj_Rel_Insert_Input | null | undefined;
  schemaTranscript?: Graph__Schema_Transcript_Obj_Rel_Insert_Input | null | undefined;
  schema_abstract?: string | null | undefined;
  schema_copyright_notice?: string | null | undefined;
  schema_creator?: any;
  schema_date_created?: string | null | undefined;
  schema_date_published?: string | null | undefined;
  schema_description?: string | null | undefined;
  schema_duration?: any;
  schema_identifier?: string | null | undefined;
  schema_is_part_of?: any;
  schema_license?: any;
  schema_maintainer?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_number_of_pages?: number | null | undefined;
  schema_position?: number | null | undefined;
  schema_thumbnail_url?: any;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph._intellectual_entity" */
export type Graph__Intellectual_Entity_Obj_Rel_Insert_Input = {
  data: Graph__Intellectual_Entity_Insert_Input;
};

/** select columns of table "graph._intellectual_entity" */
export enum Graph__Intellectual_Entity_Select_Column {
  /** column name */
  BibframeEdition = 'bibframe_edition',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsAvailable = 'dcterms_available',
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  DctermsMedium = 'dcterms_medium',
  /** column name */
  DctermsRights = 'dcterms_rights',
  /** column name */
  EbucoreHasCastMember = 'ebucore_has_cast_member',
  /** column name */
  EbucoreHasObjectType = 'ebucore_has_object_type',
  /** column name */
  EbucoreSynopsis = 'ebucore_synopsis',
  /** column name */
  Id = 'id',
  /** column name */
  MeemooIdentifier = 'meemoo_identifier',
  /** column name */
  MeemooLocalId = 'meemoo_local_id',
  /** column name */
  PremisIsPartOf = 'premis_is_part_of',
  /** column name */
  SchemaAbstract = 'schema_abstract',
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
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  SchemaLicense = 'schema_license',
  /** column name */
  SchemaMaintainer = 'schema_maintainer',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaNumberOfPages = 'schema_number_of_pages',
  /** column name */
  SchemaPosition = 'schema_position',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph._premis_identifier". All fields are combined with a logical 'AND'. */
export type Graph__Premis_Identifier_Bool_Exp = {
  _and?: Array<Graph__Premis_Identifier_Bool_Exp> | null | undefined;
  _not?: Graph__Premis_Identifier_Bool_Exp | null | undefined;
  _or?: Array<Graph__Premis_Identifier_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  premis_identifier?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._premis_identifier" */
export type Graph__Premis_Identifier_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  premis_identifier?: any;
};

/** input type for inserting object relation for remote table "graph._premis_identifier" */
export type Graph__Premis_Identifier_Obj_Rel_Insert_Input = {
  data: Graph__Premis_Identifier_Insert_Input;
};

export type Graph__Representation_Aggregate_Bool_Exp = {
  count?: Graph__Representation_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__Representation_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__Representation_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__Representation_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph._representation" */
export type Graph__Representation_Arr_Rel_Insert_Input = {
  data: Array<Graph__Representation_Insert_Input>;
};

/** Boolean expression to filter rows from the table "graph._representation". All fields are combined with a logical 'AND'. */
export type Graph__Representation_Bool_Exp = {
  _and?: Array<Graph__Representation_Bool_Exp> | null | undefined;
  _not?: Graph__Representation_Bool_Exp | null | undefined;
  _or?: Array<Graph__Representation_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  edm_is_next_in_sequence?: String_Comparison_Exp | null | undefined;
  hasRoot?: Graph_File_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  includes?: Graph_Includes_Bool_Exp | null | undefined;
  includes_aggregate?: Graph_Includes_Aggregate_Bool_Exp | null | undefined;
  isMediaFragmentOf?: Graph_File_Bool_Exp | null | undefined;
  is_media_fragment_of?: String_Comparison_Exp | null | undefined;
  premis_represents?: String_Comparison_Exp | null | undefined;
  relation_has_root?: String_Comparison_Exp | null | undefined;
  relation_has_source?: String_Comparison_Exp | null | undefined;
  represents?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  schemaTranscriptUrls?: Graph_Schema_Transcript_Url_Bool_Exp | null | undefined;
  schema_caption?: String_Comparison_Exp | null | undefined;
  schema_end_time?: Time_Comparison_Exp | null | undefined;
  schema_in_language?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_start_time?: Time_Comparison_Exp | null | undefined;
  schema_transcript?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._representation" */
export type Graph__Representation_Insert_Input = {
  created_at?: any;
  edm_is_next_in_sequence?: string | null | undefined;
  hasRoot?: Graph_File_Obj_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  includes?: Graph_Includes_Arr_Rel_Insert_Input | null | undefined;
  isMediaFragmentOf?: Graph_File_Obj_Rel_Insert_Input | null | undefined;
  is_media_fragment_of?: string | null | undefined;
  premis_represents?: string | null | undefined;
  relation_has_root?: string | null | undefined;
  relation_has_source?: string | null | undefined;
  represents?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  schemaTranscriptUrls?: Graph_Schema_Transcript_Url_Obj_Rel_Insert_Input | null | undefined;
  schema_caption?: string | null | undefined;
  schema_end_time?: any;
  schema_in_language?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_start_time?: any;
  schema_transcript?: string | null | undefined;
  updated_at?: any;
};

/** select columns of table "graph._representation" */
export enum Graph__Representation_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EdmIsNextInSequence = 'edm_is_next_in_sequence',
  /** column name */
  Id = 'id',
  /** column name */
  IsMediaFragmentOf = 'is_media_fragment_of',
  /** column name */
  PremisRepresents = 'premis_represents',
  /** column name */
  RelationHasRoot = 'relation_has_root',
  /** column name */
  RelationHasSource = 'relation_has_source',
  /** column name */
  SchemaCaption = 'schema_caption',
  /** column name */
  SchemaEndTime = 'schema_end_time',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaStartTime = 'schema_start_time',
  /** column name */
  SchemaTranscript = 'schema_transcript',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph._schema_duration". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Duration_Bool_Exp = {
  _and?: Array<Graph__Schema_Duration_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Duration_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Duration_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_duration?: Interval_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_duration" */
export type Graph__Schema_Duration_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_duration?: any;
};

/** input type for inserting object relation for remote table "graph._schema_duration" */
export type Graph__Schema_Duration_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Duration_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_genre". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Genre_Bool_Exp = {
  _and?: Array<Graph__Schema_Genre_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Genre_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Genre_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_genre?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_genre" */
export type Graph__Schema_Genre_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_genre?: any;
};

/** input type for inserting object relation for remote table "graph._schema_genre" */
export type Graph__Schema_Genre_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Genre_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_in_language". All fields are combined with a logical 'AND'. */
export type Graph__Schema_In_Language_Bool_Exp = {
  _and?: Array<Graph__Schema_In_Language_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_In_Language_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_In_Language_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_in_language?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_in_language" */
export type Graph__Schema_In_Language_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_in_language?: any;
};

/** input type for inserting object relation for remote table "graph._schema_in_language" */
export type Graph__Schema_In_Language_Obj_Rel_Insert_Input = {
  data: Graph__Schema_In_Language_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_keywords". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Keywords_Bool_Exp = {
  _and?: Array<Graph__Schema_Keywords_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Keywords_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Keywords_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_keywords?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_keywords" */
export type Graph__Schema_Keywords_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_keywords?: any;
};

/** input type for inserting object relation for remote table "graph._schema_keywords" */
export type Graph__Schema_Keywords_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Keywords_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_license". All fields are combined with a logical 'AND'. */
export type Graph__Schema_License_Bool_Exp = {
  _and?: Array<Graph__Schema_License_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_License_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_License_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_license?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_license" */
export type Graph__Schema_License_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_license?: any;
};

/** input type for inserting object relation for remote table "graph._schema_license" */
export type Graph__Schema_License_Obj_Rel_Insert_Input = {
  data: Graph__Schema_License_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_publisher". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Publisher_Bool_Exp = {
  _and?: Array<Graph__Schema_Publisher_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Publisher_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Publisher_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_publisher_array?: String_Array_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_publisher" */
export type Graph__Schema_Publisher_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_publisher_array?: Array<string> | null | undefined;
};

/** input type for inserting object relation for remote table "graph._schema_publisher" */
export type Graph__Schema_Publisher_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Publisher_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_role". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Role_Bool_Exp = {
  _and?: Array<Graph__Schema_Role_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Role_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Role_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_contributor?: Jsonb_Comparison_Exp | null | undefined;
  schema_creator?: Jsonb_Comparison_Exp | null | undefined;
  schema_publisher?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_role" */
export type Graph__Schema_Role_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_contributor?: any;
  schema_creator?: any;
  schema_publisher?: any;
};

/** input type for inserting object relation for remote table "graph._schema_role" */
export type Graph__Schema_Role_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Role_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_spatial". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Spatial_Bool_Exp = {
  _and?: Array<Graph__Schema_Spatial_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Spatial_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Spatial_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_spatial?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_spatial" */
export type Graph__Schema_Spatial_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_spatial?: any;
};

/** input type for inserting object relation for remote table "graph._schema_spatial" */
export type Graph__Schema_Spatial_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Spatial_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_temporal". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Temporal_Bool_Exp = {
  _and?: Array<Graph__Schema_Temporal_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Temporal_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Temporal_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_temporal?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_temporal" */
export type Graph__Schema_Temporal_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_temporal?: any;
};

/** input type for inserting object relation for remote table "graph._schema_temporal" */
export type Graph__Schema_Temporal_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Temporal_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_thumbnail_url". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Thumbnail_Url_Bool_Exp = {
  _and?: Array<Graph__Schema_Thumbnail_Url_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Thumbnail_Url_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Thumbnail_Url_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  object_type?: Jsonb_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_thumbnail_url" */
export type Graph__Schema_Thumbnail_Url_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  object_type?: any;
  schema_thumbnail_url?: any;
};

/** input type for inserting object relation for remote table "graph._schema_thumbnail_url" */
export type Graph__Schema_Thumbnail_Url_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Thumbnail_Url_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_transcript". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Transcript_Bool_Exp = {
  _and?: Array<Graph__Schema_Transcript_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Transcript_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Transcript_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_transcript?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_transcript" */
export type Graph__Schema_Transcript_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_transcript?: string | null | undefined;
};

/** input type for inserting object relation for remote table "graph._schema_transcript" */
export type Graph__Schema_Transcript_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Transcript_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph.carrier". All fields are combined with a logical 'AND'. */
export type Graph_Carrier_Bool_Exp = {
  _and?: Array<Graph_Carrier_Bool_Exp> | null | undefined;
  _not?: Graph_Carrier_Bool_Exp | null | undefined;
  _or?: Array<Graph_Carrier_Bool_Exp> | null | undefined;
  bibframe_production_method?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  digitization_date?: Date_Comparison_Exp | null | undefined;
  ebucore_has_captioning?: Boolean_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  premis_medium?: String_Comparison_Exp | null | undefined;
  schema_height?: String_Comparison_Exp | null | undefined;
  schema_identifier?: String_Comparison_Exp | null | undefined;
  schema_material?: String_Comparison_Exp | null | undefined;
  schema_material_extent?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_width?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.carrier" */
export enum Graph_Carrier_Constraint {
  /** unique or primary key constraint on columns "id" */
  CarrierPkey = 'carrier_pkey'
}

/** input type for inserting data into table "graph.carrier" */
export type Graph_Carrier_Insert_Input = {
  bibframe_production_method?: string | null | undefined;
  created_at?: any;
  digitization_date?: any;
  ebucore_has_captioning?: boolean | null | undefined;
  id?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  premis_medium?: string | null | undefined;
  schema_height?: string | null | undefined;
  schema_identifier?: string | null | undefined;
  schema_material?: string | null | undefined;
  schema_material_extent?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_width?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.carrier" */
export type Graph_Carrier_Obj_Rel_Insert_Input = {
  data: Graph_Carrier_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Carrier_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.carrier" */
export type Graph_Carrier_On_Conflict = {
  constraint: Graph_Carrier_Constraint;
  update_columns?: Array<Graph_Carrier_Update_Column>;
  where?: Graph_Carrier_Bool_Exp | null | undefined;
};

/** update columns of table "graph.carrier" */
export enum Graph_Carrier_Update_Column {
  /** column name */
  BibframeProductionMethod = 'bibframe_production_method',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DigitizationDate = 'digitization_date',
  /** column name */
  EbucoreHasCaptioning = 'ebucore_has_captioning',
  /** column name */
  Id = 'id',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  PremisMedium = 'premis_medium',
  /** column name */
  SchemaHeight = 'schema_height',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaterial = 'schema_material',
  /** column name */
  SchemaMaterialExtent = 'schema_material_extent',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaWidth = 'schema_width',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Collection_Aggregate_Bool_Exp = {
  count?: Graph_Collection_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Collection_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Collection_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Collection_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.collection" */
export type Graph_Collection_Arr_Rel_Insert_Input = {
  data: Array<Graph_Collection_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Collection_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.collection". All fields are combined with a logical 'AND'. */
export type Graph_Collection_Bool_Exp = {
  _and?: Array<Graph_Collection_Bool_Exp> | null | undefined;
  _not?: Graph_Collection_Bool_Exp | null | undefined;
  _or?: Array<Graph_Collection_Bool_Exp> | null | undefined;
  bibframe_preceeded_by?: String_Comparison_Exp | null | undefined;
  bibframe_succeeded_by?: String_Comparison_Exp | null | undefined;
  bibframe_supplement_to?: String_Comparison_Exp | null | undefined;
  collection_type?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  hasPart?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  hasPart_aggregate?: Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  isPartOf?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  isPartOf_aggregate?: Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp | null | undefined;
  isPreceededBy?: Graph_Collection_Bool_Exp | null | undefined;
  isPreceededBy_aggregate?: Graph_Collection_Aggregate_Bool_Exp | null | undefined;
  isSucceededBy?: Graph_Collection_Bool_Exp | null | undefined;
  isSucceededBy_aggregate?: Graph_Collection_Aggregate_Bool_Exp | null | undefined;
  schemaAlternateName?: Graph_Newspaper_Schema_Alternate_Name_Bool_Exp | null | undefined;
  schemaAlternateName_aggregate?: Graph_Newspaper_Schema_Alternate_Name_Aggregate_Bool_Exp | null | undefined;
  schemaInLanguage?: Graph_Newspaper_Schema_In_Language_Bool_Exp | null | undefined;
  schemaInLanguage_aggregate?: Graph_Newspaper_Schema_In_Language_Aggregate_Bool_Exp | null | undefined;
  schema_alternate_name?: String_Comparison_Exp | null | undefined;
  schema_end_date?: String_Comparison_Exp | null | undefined;
  schema_identifier?: String_Comparison_Exp | null | undefined;
  schema_is_part_of?: String_Comparison_Exp | null | undefined;
  schema_location_created?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_publisher?: String_Comparison_Exp | null | undefined;
  schema_season_number?: String_Comparison_Exp | null | undefined;
  schema_start_date?: String_Comparison_Exp | null | undefined;
  supplements?: Graph_Collection_Bool_Exp | null | undefined;
  supplements_aggregate?: Graph_Collection_Aggregate_Bool_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.collection" */
export enum Graph_Collection_Constraint {
  /** unique or primary key constraint on columns "id" */
  NewspaperPkey = 'newspaper_pkey',
  /** unique or primary key constraint on columns "schema_identifier" */
  NewspaperSchemaIdentifierKey = 'newspaper_schema_identifier_key'
}

/** input type for inserting data into table "graph.collection" */
export type Graph_Collection_Insert_Input = {
  /** Titel die voorafging aan deze titel (newspaper.id) */
  bibframe_preceeded_by?: string | null | undefined;
  /** Titel die deze titel opvolgde (newspaper.id) */
  bibframe_succeeded_by?: string | null | undefined;
  /** Supplement of bijlage bij andere titel (newspaper.id) */
  bibframe_supplement_to?: string | null | undefined;
  collection_type?: string | null | undefined;
  created_at?: any;
  hasPart?: Graph_Schema_Is_Part_Of_Arr_Rel_Insert_Input | null | undefined;
  /** iri as id */
  id?: string | null | undefined;
  isPartOf?: Graph_Schema_Is_Part_Of_Arr_Rel_Insert_Input | null | undefined;
  isPreceededBy?: Graph_Collection_Arr_Rel_Insert_Input | null | undefined;
  isSucceededBy?: Graph_Collection_Arr_Rel_Insert_Input | null | undefined;
  schemaAlternateName?: Graph_Newspaper_Schema_Alternate_Name_Arr_Rel_Insert_Input | null | undefined;
  schemaInLanguage?: Graph_Newspaper_Schema_In_Language_Arr_Rel_Insert_Input | null | undefined;
  /** Alternatieve titel */
  schema_alternate_name?: string | null | undefined;
  /** Laatste jaar van uitgave in edtf (string) */
  schema_end_date?: string | null | undefined;
  schema_identifier?: string | null | undefined;
  schema_is_part_of?: string | null | undefined;
  /** Plaats van uitgave */
  schema_location_created?: string | null | undefined;
  /** Titel */
  schema_name?: string | null | undefined;
  /** Uitgever als Role */
  schema_publisher?: string | null | undefined;
  schema_season_number?: string | null | undefined;
  /** Eerste jaar van uitgave in edtf (string) */
  schema_start_date?: string | null | undefined;
  supplements?: Graph_Collection_Arr_Rel_Insert_Input | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.collection" */
export type Graph_Collection_Obj_Rel_Insert_Input = {
  data: Graph_Collection_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Collection_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.collection" */
export type Graph_Collection_On_Conflict = {
  constraint: Graph_Collection_Constraint;
  update_columns?: Array<Graph_Collection_Update_Column>;
  where?: Graph_Collection_Bool_Exp | null | undefined;
};

/** select columns of table "graph.collection" */
export enum Graph_Collection_Select_Column {
  /** column name */
  BibframePreceededBy = 'bibframe_preceeded_by',
  /** column name */
  BibframeSucceededBy = 'bibframe_succeeded_by',
  /** column name */
  BibframeSupplementTo = 'bibframe_supplement_to',
  /** column name */
  CollectionType = 'collection_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaEndDate = 'schema_end_date',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  SchemaLocationCreated = 'schema_location_created',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaPublisher = 'schema_publisher',
  /** column name */
  SchemaSeasonNumber = 'schema_season_number',
  /** column name */
  SchemaStartDate = 'schema_start_date',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.collection" */
export enum Graph_Collection_Update_Column {
  /** column name */
  BibframePreceededBy = 'bibframe_preceeded_by',
  /** column name */
  BibframeSucceededBy = 'bibframe_succeeded_by',
  /** column name */
  BibframeSupplementTo = 'bibframe_supplement_to',
  /** column name */
  CollectionType = 'collection_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaEndDate = 'schema_end_date',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  SchemaLocationCreated = 'schema_location_created',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaPublisher = 'schema_publisher',
  /** column name */
  SchemaSeasonNumber = 'schema_season_number',
  /** column name */
  SchemaStartDate = 'schema_start_date',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Dcterms_Format_Aggregate_Bool_Exp = {
  count?: Graph_Dcterms_Format_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Dcterms_Format_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Dcterms_Format_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Dcterms_Format_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.dcterms_format" */
export type Graph_Dcterms_Format_Arr_Rel_Insert_Input = {
  data: Array<Graph_Dcterms_Format_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Dcterms_Format_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.dcterms_format". All fields are combined with a logical 'AND'. */
export type Graph_Dcterms_Format_Bool_Exp = {
  _and?: Array<Graph_Dcterms_Format_Bool_Exp> | null | undefined;
  _not?: Graph_Dcterms_Format_Bool_Exp | null | undefined;
  _or?: Array<Graph_Dcterms_Format_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  dcterms_format?: String_Comparison_Exp | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.dcterms_format" */
export enum Graph_Dcterms_Format_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "dcterms_format" */
  DctFormatPkey = 'dct_format_pkey'
}

/** input type for inserting data into table "graph.dcterms_format" */
export type Graph_Dcterms_Format_Insert_Input = {
  created_at?: any;
  dcterms_format?: string | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.dcterms_format" */
export type Graph_Dcterms_Format_On_Conflict = {
  constraint: Graph_Dcterms_Format_Constraint;
  update_columns?: Array<Graph_Dcterms_Format_Update_Column>;
  where?: Graph_Dcterms_Format_Bool_Exp | null | undefined;
};

/** select columns of table "graph.dcterms_format" */
export enum Graph_Dcterms_Format_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.dcterms_format" */
export enum Graph_Dcterms_Format_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph.file". All fields are combined with a logical 'AND'. */
export type Graph_File_Bool_Exp = {
  _and?: Array<Graph_File_Bool_Exp> | null | undefined;
  _not?: Graph_File_Bool_Exp | null | undefined;
  _or?: Array<Graph_File_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ebucore_has_mime_type?: String_Comparison_Exp | null | undefined;
  edm_is_next_in_sequence?: String_Comparison_Exp | null | undefined;
  hasMediaFragment?: Graph_Representation_Bool_Exp | null | undefined;
  hasMediaFragment_aggregate?: Graph_Representation_Aggregate_Bool_Exp | null | undefined;
  has_annotations?: Graph__File_Has_Annotation_Bool_Exp | null | undefined;
  has_annotations_aggregate?: Graph__File_Has_Annotation_Aggregate_Bool_Exp | null | undefined;
  has_captionings?: Graph__File_Ebucore_Has_Captioning_Bool_Exp | null | undefined;
  has_captionings_aggregate?: Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  isRootOf?: Graph_Representation_Bool_Exp | null | undefined;
  isRootOf_aggregate?: Graph_Representation_Aggregate_Bool_Exp | null | undefined;
  is_ai_generated?: Boolean_Comparison_Exp | null | undefined;
  mh_fragment_identifier?: String_Comparison_Exp | null | undefined;
  premis_original_name?: String_Comparison_Exp | null | undefined;
  premis_stored_at?: String_Comparison_Exp | null | undefined;
  schema_duration?: Numeric_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.file" */
export enum Graph_File_Constraint {
  /** unique or primary key constraint on columns "id" */
  FilePkey = 'file_pkey'
}

/** input type for inserting data into table "graph.file" */
export type Graph_File_Insert_Input = {
  created_at?: any;
  ebucore_has_mime_type?: string | null | undefined;
  edm_is_next_in_sequence?: string | null | undefined;
  hasMediaFragment?: Graph_Representation_Arr_Rel_Insert_Input | null | undefined;
  has_annotations?: Graph__File_Has_Annotation_Arr_Rel_Insert_Input | null | undefined;
  has_captionings?: Graph__File_Ebucore_Has_Captioning_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  isRootOf?: Graph_Representation_Arr_Rel_Insert_Input | null | undefined;
  is_ai_generated?: boolean | null | undefined;
  mh_fragment_identifier?: string | null | undefined;
  premis_original_name?: string | null | undefined;
  premis_stored_at?: string | null | undefined;
  schema_duration?: any;
  schema_name?: string | null | undefined;
  schema_thumbnail_url?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.file" */
export type Graph_File_Obj_Rel_Insert_Input = {
  data: Graph_File_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_File_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.file" */
export type Graph_File_On_Conflict = {
  constraint: Graph_File_Constraint;
  update_columns?: Array<Graph_File_Update_Column>;
  where?: Graph_File_Bool_Exp | null | undefined;
};

/** update columns of table "graph.file" */
export enum Graph_File_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EbucoreHasMimeType = 'ebucore_has_mime_type',
  /** column name */
  EdmIsNextInSequence = 'edm_is_next_in_sequence',
  /** column name */
  Id = 'id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  MhFragmentIdentifier = 'mh_fragment_identifier',
  /** column name */
  PremisOriginalName = 'premis_original_name',
  /** column name */
  PremisStoredAt = 'premis_stored_at',
  /** column name */
  SchemaDuration = 'schema_duration',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Hades_License_Distributor_Aggregate_Bool_Exp = {
  count?: Graph_Hades_License_Distributor_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Hades_License_Distributor_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Hades_License_Distributor_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Hades_License_Distributor_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.hades_license_distributor" */
export type Graph_Hades_License_Distributor_Arr_Rel_Insert_Input = {
  data: Array<Graph_Hades_License_Distributor_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Hades_License_Distributor_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.hades_license_distributor". All fields are combined with a logical 'AND'. */
export type Graph_Hades_License_Distributor_Bool_Exp = {
  _and?: Array<Graph_Hades_License_Distributor_Bool_Exp> | null | undefined;
  _not?: Graph_Hades_License_Distributor_Bool_Exp | null | undefined;
  _or?: Array<Graph_Hades_License_Distributor_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  hades_license_distributor?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.hades_license_distributor" */
export enum Graph_Hades_License_Distributor_Constraint {
  /** unique or primary key constraint on columns "hades_license_distributor", "intellectual_entity_id" */
  HadesLicenseDistributorPkey = 'hades_license_distributor_pkey'
}

/** input type for inserting data into table "graph.hades_license_distributor" */
export type Graph_Hades_License_Distributor_Insert_Input = {
  created_at?: any;
  hades_license_distributor?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.hades_license_distributor" */
export type Graph_Hades_License_Distributor_On_Conflict = {
  constraint: Graph_Hades_License_Distributor_Constraint;
  update_columns?: Array<Graph_Hades_License_Distributor_Update_Column>;
  where?: Graph_Hades_License_Distributor_Bool_Exp | null | undefined;
};

/** select columns of table "graph.hades_license_distributor" */
export enum Graph_Hades_License_Distributor_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HadesLicenseDistributor = 'hades_license_distributor',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.hades_license_distributor" */
export enum Graph_Hades_License_Distributor_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HadesLicenseDistributor = 'hades_license_distributor',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Includes_Aggregate_Bool_Exp = {
  count?: Graph_Includes_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Includes_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Includes_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Includes_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.includes" */
export type Graph_Includes_Arr_Rel_Insert_Input = {
  data: Array<Graph_Includes_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Includes_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.includes". All fields are combined with a logical 'AND'. */
export type Graph_Includes_Bool_Exp = {
  _and?: Array<Graph_Includes_Bool_Exp> | null | undefined;
  _not?: Graph_Includes_Bool_Exp | null | undefined;
  _or?: Array<Graph_Includes_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  file?: Graph_File_Bool_Exp | null | undefined;
  file_id?: String_Comparison_Exp | null | undefined;
  representation?: Graph_Representation_Bool_Exp | null | undefined;
  representation_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.includes" */
export enum Graph_Includes_Constraint {
  /** unique or primary key constraint on columns "file_id", "representation_id" */
  IncludesPkey = 'includes_pkey'
}

/** input type for inserting data into table "graph.includes" */
export type Graph_Includes_Insert_Input = {
  created_at?: any;
  file?: Graph_File_Obj_Rel_Insert_Input | null | undefined;
  file_id?: string | null | undefined;
  representation?: Graph_Representation_Obj_Rel_Insert_Input | null | undefined;
  /** Identifier van de file */
  representation_id?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.includes" */
export type Graph_Includes_On_Conflict = {
  constraint: Graph_Includes_Constraint;
  update_columns?: Array<Graph_Includes_Update_Column>;
  where?: Graph_Includes_Bool_Exp | null | undefined;
};

/** select columns of table "graph.includes" */
export enum Graph_Includes_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FileId = 'file_id',
  /** column name */
  RepresentationId = 'representation_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.includes" */
export enum Graph_Includes_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FileId = 'file_id',
  /** column name */
  RepresentationId = 'representation_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Intellectual_Entity_Aggregate_Bool_Exp = {
  count?: Graph_Intellectual_Entity_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Intellectual_Entity_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Intellectual_Entity_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Arr_Rel_Insert_Input = {
  data: Array<Graph_Intellectual_Entity_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Intellectual_Entity_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.intellectual_entity". All fields are combined with a logical 'AND'. */
export type Graph_Intellectual_Entity_Bool_Exp = {
  _and?: Array<Graph_Intellectual_Entity_Bool_Exp> | null | undefined;
  _not?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  _or?: Array<Graph_Intellectual_Entity_Bool_Exp> | null | undefined;
  bibframe_edition?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  dctermsFormat?: Graph_Dcterms_Format_Bool_Exp | null | undefined;
  dctermsFormat_aggregate?: Graph_Dcterms_Format_Aggregate_Bool_Exp | null | undefined;
  dcterms_available?: String_Comparison_Exp | null | undefined;
  dcterms_rights?: String_Comparison_Exp | null | undefined;
  ebucoreSynopses?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  ebucoreSynopses_aggregate?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp | null | undefined;
  ebucore_has_cast_member?: String_Comparison_Exp | null | undefined;
  ebucore_has_object_type?: String_Comparison_Exp | null | undefined;
  ebucore_synopsis?: String_Comparison_Exp | null | undefined;
  haDesLicenseDistributors?: Graph_Hades_License_Distributor_Bool_Exp | null | undefined;
  haDesLicenseDistributors_aggregate?: Graph_Hades_License_Distributor_Aggregate_Bool_Exp | null | undefined;
  ha_des_max_date_created?: Date_Comparison_Exp | null | undefined;
  ha_des_max_date_published?: Date_Comparison_Exp | null | undefined;
  ha_des_min_date_created?: Date_Comparison_Exp | null | undefined;
  ha_des_min_date_published?: Date_Comparison_Exp | null | undefined;
  ha_des_number_of_pages?: Int_Comparison_Exp | null | undefined;
  hasCarrier?: Graph_Carrier_Bool_Exp | null | undefined;
  hasPart?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  hasPart_aggregate?: Graph_Intellectual_Entity_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  isPartOf?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  isRepresentedBy?: Graph_Representation_Bool_Exp | null | undefined;
  isRepresentedBy_aggregate?: Graph_Representation_Aggregate_Bool_Exp | null | undefined;
  mhFragmentIdentifier?: Graph_Mh_Fragment_Identifier_Bool_Exp | null | undefined;
  premisIdentifier?: Graph_Premis_Identifier_Bool_Exp | null | undefined;
  premisIdentifier_aggregate?: Graph_Premis_Identifier_Aggregate_Bool_Exp | null | undefined;
  relation_is_part_of?: String_Comparison_Exp | null | undefined;
  rights?: Graph_Rights_Bool_Exp | null | undefined;
  schemaAlternateName?: Graph_Schema_Alternate_Name_Bool_Exp | null | undefined;
  schemaAlternateName_aggregate?: Graph_Schema_Alternate_Name_Aggregate_Bool_Exp | null | undefined;
  schemaCopyrightHolder?: Graph_Schema_Copyright_Holder_Bool_Exp | null | undefined;
  schemaCopyrightHolder_aggregate?: Graph_Schema_Copyright_Holder_Aggregate_Bool_Exp | null | undefined;
  schemaDuration?: Graph__Schema_Duration_Bool_Exp | null | undefined;
  schemaGenre?: Graph_Schema_Genre_Bool_Exp | null | undefined;
  schemaGenre_aggregate?: Graph_Schema_Genre_Aggregate_Bool_Exp | null | undefined;
  schemaInLanguage?: Graph_Schema_In_Language_Bool_Exp | null | undefined;
  schemaInLanguage_aggregate?: Graph_Schema_In_Language_Aggregate_Bool_Exp | null | undefined;
  schemaIsPartOf?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  schemaIsPartOf_aggregate?: Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp | null | undefined;
  schemaKeywords?: Graph_Schema_Keywords_Bool_Exp | null | undefined;
  schemaKeywords_aggregate?: Graph_Schema_Keywords_Aggregate_Bool_Exp | null | undefined;
  schemaLicense?: Graph__Schema_License_Bool_Exp | null | undefined;
  schemaLicenses?: Graph_Schema_License_Bool_Exp | null | undefined;
  schemaLicenses_aggregate?: Graph_Schema_License_Aggregate_Bool_Exp | null | undefined;
  schemaMaintainer?: Graph_Organization_Bool_Exp | null | undefined;
  schemaMentions?: Graph_Schema_Mentions_Bool_Exp | null | undefined;
  schemaMentions_aggregate?: Graph_Schema_Mentions_Aggregate_Bool_Exp | null | undefined;
  schemaNames?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  schemaNames_aggregate?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp | null | undefined;
  schemaRole?: Graph__Schema_Role_Bool_Exp | null | undefined;
  schemaSpatial?: Graph_Schema_Spatial_Bool_Exp | null | undefined;
  schemaSpatial_aggregate?: Graph_Schema_Spatial_Aggregate_Bool_Exp | null | undefined;
  schemaTemporal?: Graph_Schema_Temporal_Bool_Exp | null | undefined;
  schemaTemporal_aggregate?: Graph_Schema_Temporal_Aggregate_Bool_Exp | null | undefined;
  schemaThumbnail?: Graph__Schema_Thumbnail_Url_Bool_Exp | null | undefined;
  schema_abstract?: String_Comparison_Exp | null | undefined;
  schema_copyright_notice?: String_Comparison_Exp | null | undefined;
  schema_copyright_year?: Date_Comparison_Exp | null | undefined;
  schema_credit_text?: String_Comparison_Exp | null | undefined;
  schema_date_created?: String_Comparison_Exp | null | undefined;
  schema_date_published?: String_Comparison_Exp | null | undefined;
  schema_description?: String_Comparison_Exp | null | undefined;
  schema_identifier?: String_Comparison_Exp | null | undefined;
  schema_issue_number?: String_Comparison_Exp | null | undefined;
  schema_maintainer?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_position?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.intellectual_entity" */
export enum Graph_Intellectual_Entity_Constraint {
  /** unique or primary key constraint on columns "id" */
  IntellectualEntityPkey = 'intellectual_entity_pkey'
}

export type Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp = {
  bool_and?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_And = {
  arguments: Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column_Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column_Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.intellectual_entity_ebucore_synopsis" */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_Arr_Rel_Insert_Input = {
  data: Array<Graph_Intellectual_Entity_Ebucore_Synopsis_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Intellectual_Entity_Ebucore_Synopsis_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.intellectual_entity_ebucore_synopsis". All fields are combined with a logical 'AND'. */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp = {
  _and?: Array<Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp> | null | undefined;
  _not?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  _or?: Array<Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ebucore_synopsis?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  is_ai_generated?: Boolean_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.intellectual_entity_ebucore_synopsis" */
export enum Graph_Intellectual_Entity_Ebucore_Synopsis_Constraint {
  /** unique or primary key constraint on columns "ebucore_synopsis", "intellectual_entity_id", "is_ai_generated" */
  IntellectualEntityEbucoreSynopsisPkey = 'intellectual_entity_ebucore_synopsis_pkey'
}

/** input type for inserting data into table "graph.intellectual_entity_ebucore_synopsis" */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_Insert_Input = {
  created_at?: any;
  ebucore_synopsis?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  is_ai_generated?: boolean | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.intellectual_entity_ebucore_synopsis" */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_On_Conflict = {
  constraint: Graph_Intellectual_Entity_Ebucore_Synopsis_Constraint;
  update_columns?: Array<Graph_Intellectual_Entity_Ebucore_Synopsis_Update_Column>;
  where?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
};

/** select columns of table "graph.intellectual_entity_ebucore_synopsis" */
export enum Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EbucoreSynopsis = 'ebucore_synopsis',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "graph_intellectual_entity_ebucore_synopsis_aggregate_bool_exp_bool_and_arguments_columns" columns of table "graph.intellectual_entity_ebucore_synopsis" */
export enum Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column_Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** select "graph_intellectual_entity_ebucore_synopsis_aggregate_bool_exp_bool_or_arguments_columns" columns of table "graph.intellectual_entity_ebucore_synopsis" */
export enum Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column_Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** update columns of table "graph.intellectual_entity_ebucore_synopsis" */
export enum Graph_Intellectual_Entity_Ebucore_Synopsis_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EbucoreSynopsis = 'ebucore_synopsis',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for inserting data into table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Insert_Input = {
  bibframe_edition?: string | null | undefined;
  created_at?: any;
  dctermsFormat?: Graph_Dcterms_Format_Arr_Rel_Insert_Input | null | undefined;
  dcterms_available?: string | null | undefined;
  dcterms_rights?: string | null | undefined;
  ebucoreSynopses?: Graph_Intellectual_Entity_Ebucore_Synopsis_Arr_Rel_Insert_Input | null | undefined;
  ebucore_has_cast_member?: string | null | undefined;
  ebucore_has_object_type?: string | null | undefined;
  ebucore_synopsis?: string | null | undefined;
  haDesLicenseDistributors?: Graph_Hades_License_Distributor_Arr_Rel_Insert_Input | null | undefined;
  ha_des_max_date_created?: any;
  ha_des_max_date_published?: any;
  ha_des_min_date_created?: any;
  ha_des_min_date_published?: any;
  ha_des_number_of_pages?: number | null | undefined;
  hasCarrier?: Graph_Carrier_Obj_Rel_Insert_Input | null | undefined;
  hasPart?: Graph_Intellectual_Entity_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  isPartOf?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  isRepresentedBy?: Graph_Representation_Arr_Rel_Insert_Input | null | undefined;
  mhFragmentIdentifier?: Graph_Mh_Fragment_Identifier_Obj_Rel_Insert_Input | null | undefined;
  premisIdentifier?: Graph_Premis_Identifier_Arr_Rel_Insert_Input | null | undefined;
  relation_is_part_of?: string | null | undefined;
  rights?: Graph_Rights_Obj_Rel_Insert_Input | null | undefined;
  schemaAlternateName?: Graph_Schema_Alternate_Name_Arr_Rel_Insert_Input | null | undefined;
  schemaCopyrightHolder?: Graph_Schema_Copyright_Holder_Arr_Rel_Insert_Input | null | undefined;
  schemaDuration?: Graph__Schema_Duration_Obj_Rel_Insert_Input | null | undefined;
  schemaGenre?: Graph_Schema_Genre_Arr_Rel_Insert_Input | null | undefined;
  schemaInLanguage?: Graph_Schema_In_Language_Arr_Rel_Insert_Input | null | undefined;
  schemaIsPartOf?: Graph_Schema_Is_Part_Of_Arr_Rel_Insert_Input | null | undefined;
  schemaKeywords?: Graph_Schema_Keywords_Arr_Rel_Insert_Input | null | undefined;
  schemaLicense?: Graph__Schema_License_Obj_Rel_Insert_Input | null | undefined;
  schemaLicenses?: Graph_Schema_License_Arr_Rel_Insert_Input | null | undefined;
  schemaMaintainer?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  schemaMentions?: Graph_Schema_Mentions_Arr_Rel_Insert_Input | null | undefined;
  schemaNames?: Graph_Intellectual_Entity_Schema_Name_Arr_Rel_Insert_Input | null | undefined;
  schemaRole?: Graph__Schema_Role_Obj_Rel_Insert_Input | null | undefined;
  schemaSpatial?: Graph_Schema_Spatial_Arr_Rel_Insert_Input | null | undefined;
  schemaTemporal?: Graph_Schema_Temporal_Arr_Rel_Insert_Input | null | undefined;
  schemaThumbnail?: Graph__Schema_Thumbnail_Url_Obj_Rel_Insert_Input | null | undefined;
  schema_abstract?: string | null | undefined;
  schema_copyright_notice?: string | null | undefined;
  schema_copyright_year?: any;
  schema_credit_text?: string | null | undefined;
  schema_date_created?: string | null | undefined;
  schema_date_published?: string | null | undefined;
  schema_description?: string | null | undefined;
  schema_identifier?: string | null | undefined;
  schema_issue_number?: string | null | undefined;
  schema_maintainer?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_position?: number | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Obj_Rel_Insert_Input = {
  data: Graph_Intellectual_Entity_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Intellectual_Entity_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_On_Conflict = {
  constraint: Graph_Intellectual_Entity_Constraint;
  update_columns?: Array<Graph_Intellectual_Entity_Update_Column>;
  where?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
};

export type Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp = {
  bool_and?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_And = {
  arguments: Graph_Intellectual_Entity_Schema_Name_Select_Column_Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Graph_Intellectual_Entity_Schema_Name_Select_Column_Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Intellectual_Entity_Schema_Name_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.intellectual_entity_schema_name" */
export type Graph_Intellectual_Entity_Schema_Name_Arr_Rel_Insert_Input = {
  data: Array<Graph_Intellectual_Entity_Schema_Name_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Intellectual_Entity_Schema_Name_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.intellectual_entity_schema_name". All fields are combined with a logical 'AND'. */
export type Graph_Intellectual_Entity_Schema_Name_Bool_Exp = {
  _and?: Array<Graph_Intellectual_Entity_Schema_Name_Bool_Exp> | null | undefined;
  _not?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  _or?: Array<Graph_Intellectual_Entity_Schema_Name_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  is_ai_generated?: Boolean_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.intellectual_entity_schema_name" */
export enum Graph_Intellectual_Entity_Schema_Name_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "schema_name", "is_ai_generated" */
  IntellectualEntitySchemaNamePkey = 'intellectual_entity_schema_name_pkey'
}

/** input type for inserting data into table "graph.intellectual_entity_schema_name" */
export type Graph_Intellectual_Entity_Schema_Name_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  is_ai_generated?: boolean | null | undefined;
  schema_name?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.intellectual_entity_schema_name" */
export type Graph_Intellectual_Entity_Schema_Name_On_Conflict = {
  constraint: Graph_Intellectual_Entity_Schema_Name_Constraint;
  update_columns?: Array<Graph_Intellectual_Entity_Schema_Name_Update_Column>;
  where?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
};

/** select columns of table "graph.intellectual_entity_schema_name" */
export enum Graph_Intellectual_Entity_Schema_Name_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "graph_intellectual_entity_schema_name_aggregate_bool_exp_bool_and_arguments_columns" columns of table "graph.intellectual_entity_schema_name" */
export enum Graph_Intellectual_Entity_Schema_Name_Select_Column_Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** select "graph_intellectual_entity_schema_name_aggregate_bool_exp_bool_or_arguments_columns" columns of table "graph.intellectual_entity_schema_name" */
export enum Graph_Intellectual_Entity_Schema_Name_Select_Column_Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** update columns of table "graph.intellectual_entity_schema_name" */
export enum Graph_Intellectual_Entity_Schema_Name_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select columns of table "graph.intellectual_entity" */
export enum Graph_Intellectual_Entity_Select_Column {
  /** column name */
  BibframeEdition = 'bibframe_edition',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsAvailable = 'dcterms_available',
  /** column name */
  DctermsRights = 'dcterms_rights',
  /** column name */
  EbucoreHasCastMember = 'ebucore_has_cast_member',
  /** column name */
  EbucoreHasObjectType = 'ebucore_has_object_type',
  /** column name */
  EbucoreSynopsis = 'ebucore_synopsis',
  /** column name */
  HaDesMaxDateCreated = 'ha_des_max_date_created',
  /** column name */
  HaDesMaxDatePublished = 'ha_des_max_date_published',
  /** column name */
  HaDesMinDateCreated = 'ha_des_min_date_created',
  /** column name */
  HaDesMinDatePublished = 'ha_des_min_date_published',
  /** column name */
  HaDesNumberOfPages = 'ha_des_number_of_pages',
  /** column name */
  Id = 'id',
  /** column name */
  RelationIsPartOf = 'relation_is_part_of',
  /** column name */
  SchemaAbstract = 'schema_abstract',
  /** column name */
  SchemaCopyrightNotice = 'schema_copyright_notice',
  /** column name */
  SchemaCopyrightYear = 'schema_copyright_year',
  /** column name */
  SchemaCreditText = 'schema_credit_text',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDatePublished = 'schema_date_published',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIssueNumber = 'schema_issue_number',
  /** column name */
  SchemaMaintainer = 'schema_maintainer',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaPosition = 'schema_position',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.intellectual_entity" */
export enum Graph_Intellectual_Entity_Update_Column {
  /** column name */
  BibframeEdition = 'bibframe_edition',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsAvailable = 'dcterms_available',
  /** column name */
  DctermsRights = 'dcterms_rights',
  /** column name */
  EbucoreHasCastMember = 'ebucore_has_cast_member',
  /** column name */
  EbucoreHasObjectType = 'ebucore_has_object_type',
  /** column name */
  EbucoreSynopsis = 'ebucore_synopsis',
  /** column name */
  HaDesMaxDateCreated = 'ha_des_max_date_created',
  /** column name */
  HaDesMaxDatePublished = 'ha_des_max_date_published',
  /** column name */
  HaDesMinDateCreated = 'ha_des_min_date_created',
  /** column name */
  HaDesMinDatePublished = 'ha_des_min_date_published',
  /** column name */
  HaDesNumberOfPages = 'ha_des_number_of_pages',
  /** column name */
  Id = 'id',
  /** column name */
  RelationIsPartOf = 'relation_is_part_of',
  /** column name */
  SchemaAbstract = 'schema_abstract',
  /** column name */
  SchemaCopyrightNotice = 'schema_copyright_notice',
  /** column name */
  SchemaCopyrightYear = 'schema_copyright_year',
  /** column name */
  SchemaCreditText = 'schema_credit_text',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDatePublished = 'schema_date_published',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIssueNumber = 'schema_issue_number',
  /** column name */
  SchemaMaintainer = 'schema_maintainer',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaPosition = 'schema_position',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph.mh_fragment_identifier". All fields are combined with a logical 'AND'. */
export type Graph_Mh_Fragment_Identifier_Bool_Exp = {
  _and?: Array<Graph_Mh_Fragment_Identifier_Bool_Exp> | null | undefined;
  _not?: Graph_Mh_Fragment_Identifier_Bool_Exp | null | undefined;
  _or?: Array<Graph_Mh_Fragment_Identifier_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  mh_fragment_identifier?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.mh_fragment_identifier" */
export enum Graph_Mh_Fragment_Identifier_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "mh_fragment_identifier" */
  MhFragmentIdentifierPkey = 'mh_fragment_identifier_pkey'
}

/** input type for inserting data into table "graph.mh_fragment_identifier" */
export type Graph_Mh_Fragment_Identifier_Insert_Input = {
  created_at?: any;
  intellectual_entity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  is_deleted?: boolean | null | undefined;
  mh_fragment_identifier?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.mh_fragment_identifier" */
export type Graph_Mh_Fragment_Identifier_Obj_Rel_Insert_Input = {
  data: Graph_Mh_Fragment_Identifier_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Mh_Fragment_Identifier_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.mh_fragment_identifier" */
export type Graph_Mh_Fragment_Identifier_On_Conflict = {
  constraint: Graph_Mh_Fragment_Identifier_Constraint;
  update_columns?: Array<Graph_Mh_Fragment_Identifier_Update_Column>;
  where?: Graph_Mh_Fragment_Identifier_Bool_Exp | null | undefined;
};

/** update columns of table "graph.mh_fragment_identifier" */
export enum Graph_Mh_Fragment_Identifier_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  MhFragmentIdentifier = 'mh_fragment_identifier',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Newspaper_Schema_Alternate_Name_Aggregate_Bool_Exp = {
  count?: Graph_Newspaper_Schema_Alternate_Name_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Newspaper_Schema_Alternate_Name_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Newspaper_Schema_Alternate_Name_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Newspaper_Schema_Alternate_Name_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.newspaper_schema_alternate_name" */
export type Graph_Newspaper_Schema_Alternate_Name_Arr_Rel_Insert_Input = {
  data: Array<Graph_Newspaper_Schema_Alternate_Name_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Newspaper_Schema_Alternate_Name_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.newspaper_schema_alternate_name". All fields are combined with a logical 'AND'. */
export type Graph_Newspaper_Schema_Alternate_Name_Bool_Exp = {
  _and?: Array<Graph_Newspaper_Schema_Alternate_Name_Bool_Exp> | null | undefined;
  _not?: Graph_Newspaper_Schema_Alternate_Name_Bool_Exp | null | undefined;
  _or?: Array<Graph_Newspaper_Schema_Alternate_Name_Bool_Exp> | null | undefined;
  collection_id?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  schema_alternate_name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.newspaper_schema_alternate_name" */
export enum Graph_Newspaper_Schema_Alternate_Name_Constraint {
  /** unique or primary key constraint on columns "schema_alternate_name", "collection_id" */
  NewspaperSchemaAlternateNamePkey = 'newspaper_schema_alternate_name_pkey'
}

/** input type for inserting data into table "graph.newspaper_schema_alternate_name" */
export type Graph_Newspaper_Schema_Alternate_Name_Insert_Input = {
  collection_id?: string | null | undefined;
  created_at?: any;
  schema_alternate_name?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.newspaper_schema_alternate_name" */
export type Graph_Newspaper_Schema_Alternate_Name_On_Conflict = {
  constraint: Graph_Newspaper_Schema_Alternate_Name_Constraint;
  update_columns?: Array<Graph_Newspaper_Schema_Alternate_Name_Update_Column>;
  where?: Graph_Newspaper_Schema_Alternate_Name_Bool_Exp | null | undefined;
};

/** select columns of table "graph.newspaper_schema_alternate_name" */
export enum Graph_Newspaper_Schema_Alternate_Name_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.newspaper_schema_alternate_name" */
export enum Graph_Newspaper_Schema_Alternate_Name_Update_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Newspaper_Schema_In_Language_Aggregate_Bool_Exp = {
  count?: Graph_Newspaper_Schema_In_Language_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Newspaper_Schema_In_Language_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Newspaper_Schema_In_Language_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Newspaper_Schema_In_Language_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.newspaper_schema_in_language" */
export type Graph_Newspaper_Schema_In_Language_Arr_Rel_Insert_Input = {
  data: Array<Graph_Newspaper_Schema_In_Language_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Newspaper_Schema_In_Language_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.newspaper_schema_in_language". All fields are combined with a logical 'AND'. */
export type Graph_Newspaper_Schema_In_Language_Bool_Exp = {
  _and?: Array<Graph_Newspaper_Schema_In_Language_Bool_Exp> | null | undefined;
  _not?: Graph_Newspaper_Schema_In_Language_Bool_Exp | null | undefined;
  _or?: Array<Graph_Newspaper_Schema_In_Language_Bool_Exp> | null | undefined;
  collection_id?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  schema_in_language?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.newspaper_schema_in_language" */
export enum Graph_Newspaper_Schema_In_Language_Constraint {
  /** unique or primary key constraint on columns "schema_in_language", "collection_id" */
  NewspaperSchemaInLanguagePkey = 'newspaper_schema_in_language_pkey'
}

/** input type for inserting data into table "graph.newspaper_schema_in_language" */
export type Graph_Newspaper_Schema_In_Language_Insert_Input = {
  /** Identifier van de krant als collection */
  collection_id?: string | null | undefined;
  created_at?: any;
  /** ISO afkorting voor taal */
  schema_in_language?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.newspaper_schema_in_language" */
export type Graph_Newspaper_Schema_In_Language_On_Conflict = {
  constraint: Graph_Newspaper_Schema_In_Language_Constraint;
  update_columns?: Array<Graph_Newspaper_Schema_In_Language_Update_Column>;
  where?: Graph_Newspaper_Schema_In_Language_Bool_Exp | null | undefined;
};

/** select columns of table "graph.newspaper_schema_in_language" */
export enum Graph_Newspaper_Schema_In_Language_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.newspaper_schema_in_language" */
export enum Graph_Newspaper_Schema_In_Language_Update_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph.organization". All fields are combined with a logical 'AND'. */
export type Graph_Organization_Bool_Exp = {
  _and?: Array<Graph_Organization_Bool_Exp> | null | undefined;
  _not?: Graph_Organization_Bool_Exp | null | undefined;
  _or?: Array<Graph_Organization_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  dcterms_description?: String_Comparison_Exp | null | undefined;
  foaf_homepage?: String_Comparison_Exp | null | undefined;
  ha_org_has_logo?: String_Comparison_Exp | null | undefined;
  ha_org_request_form?: String_Comparison_Exp | null | undefined;
  ha_org_sector?: String_Comparison_Exp | null | undefined;
  hasPreference?: Graph_Organization_Has_Preference_Bool_Exp | null | undefined;
  hasPreference_aggregate?: Graph_Organization_Has_Preference_Aggregate_Bool_Exp | null | undefined;
  hasSite?: Graph_Organization_Has_Postal_Address_Bool_Exp | null | undefined;
  hasSite_aggregate?: Graph_Organization_Has_Postal_Address_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  org_classification?: String_Comparison_Exp | null | undefined;
  org_identifier?: String_Comparison_Exp | null | undefined;
  organizationSlug?: Maintainer_Organization_Slug_Bool_Exp | null | undefined;
  schemaContactPoint?: Graph_Schema_Contact_Point_Bool_Exp | null | undefined;
  schemaContactPoint_aggregate?: Graph_Schema_Contact_Point_Aggregate_Bool_Exp | null | undefined;
  schema_vat_id?: String_Comparison_Exp | null | undefined;
  skos_pref_label?: String_Comparison_Exp | null | undefined;
  skos_pref_label_lowercase?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  users?: Users_Profile_Bool_Exp | null | undefined;
  visitorSpace?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.organization" */
export enum Graph_Organization_Constraint {
  /** unique or primary key constraint on columns "org_identifier" */
  OrganizationOrgIdentifierKey = 'organization_org_identifier_key',
  /** unique or primary key constraint on columns "id" */
  OrganizationPkey = 'organization_pkey'
}

export type Graph_Organization_Has_Postal_Address_Aggregate_Bool_Exp = {
  count?: Graph_Organization_Has_Postal_Address_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Organization_Has_Postal_Address_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Organization_Has_Postal_Address_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Organization_Has_Postal_Address_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Organization_Has_Postal_Address_Max_Order_By | null | undefined;
  min?: Graph_Organization_Has_Postal_Address_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_Arr_Rel_Insert_Input = {
  data: Array<Graph_Organization_Has_Postal_Address_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Organization_Has_Postal_Address_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.organization_has_postal_address". All fields are combined with a logical 'AND'. */
export type Graph_Organization_Has_Postal_Address_Bool_Exp = {
  _and?: Array<Graph_Organization_Has_Postal_Address_Bool_Exp> | null | undefined;
  _not?: Graph_Organization_Has_Postal_Address_Bool_Exp | null | undefined;
  _or?: Array<Graph_Organization_Has_Postal_Address_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  organization_id?: String_Comparison_Exp | null | undefined;
  postalAddress?: Graph_Schema_Postal_Address_Bool_Exp | null | undefined;
  postal_address_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.organization_has_postal_address" */
export enum Graph_Organization_Has_Postal_Address_Constraint {
  /** unique or primary key constraint on columns "postal_address_id", "organization_id" */
  OrganizationHasPostalAddressPkey = 'organization_has_postal_address_pkey'
}

/** input type for inserting data into table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_Insert_Input = {
  created_at?: any;
  organization_id?: string | null | undefined;
  postalAddress?: Graph_Schema_Postal_Address_Obj_Rel_Insert_Input | null | undefined;
  postal_address_id?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  postal_address_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  postal_address_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_On_Conflict = {
  constraint: Graph_Organization_Has_Postal_Address_Constraint;
  update_columns?: Array<Graph_Organization_Has_Postal_Address_Update_Column>;
  where?: Graph_Organization_Has_Postal_Address_Bool_Exp | null | undefined;
};

/** select columns of table "graph.organization_has_postal_address" */
export enum Graph_Organization_Has_Postal_Address_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  PostalAddressId = 'postal_address_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.organization_has_postal_address" */
export enum Graph_Organization_Has_Postal_Address_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  PostalAddressId = 'postal_address_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Organization_Has_Preference_Aggregate_Bool_Exp = {
  count?: Graph_Organization_Has_Preference_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Organization_Has_Preference_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Organization_Has_Preference_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Organization_Has_Preference_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Organization_Has_Preference_Max_Order_By | null | undefined;
  min?: Graph_Organization_Has_Preference_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_Arr_Rel_Insert_Input = {
  data: Array<Graph_Organization_Has_Preference_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Organization_Has_Preference_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.organization_has_preference". All fields are combined with a logical 'AND'. */
export type Graph_Organization_Has_Preference_Bool_Exp = {
  _and?: Array<Graph_Organization_Has_Preference_Bool_Exp> | null | undefined;
  _not?: Graph_Organization_Has_Preference_Bool_Exp | null | undefined;
  _or?: Array<Graph_Organization_Has_Preference_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ha_pref?: String_Comparison_Exp | null | undefined;
  organization_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.organization_has_preference" */
export enum Graph_Organization_Has_Preference_Constraint {
  /** unique or primary key constraint on columns "ha_pref", "organization_id" */
  OrganizationHasPreferencePkey = 'organization_has_preference_pkey'
}

/** input type for inserting data into table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_Insert_Input = {
  created_at?: any;
  ha_pref?: string | null | undefined;
  organization_id?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  ha_pref?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  ha_pref?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_On_Conflict = {
  constraint: Graph_Organization_Has_Preference_Constraint;
  update_columns?: Array<Graph_Organization_Has_Preference_Update_Column>;
  where?: Graph_Organization_Has_Preference_Bool_Exp | null | undefined;
};

/** select columns of table "graph.organization_has_preference" */
export enum Graph_Organization_Has_Preference_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HaPref = 'ha_pref',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.organization_has_preference" */
export enum Graph_Organization_Has_Preference_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HaPref = 'ha_pref',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for inserting data into table "graph.organization" */
export type Graph_Organization_Insert_Input = {
  created_at?: any;
  dcterms_description?: string | null | undefined;
  foaf_homepage?: string | null | undefined;
  ha_org_has_logo?: string | null | undefined;
  ha_org_request_form?: string | null | undefined;
  ha_org_sector?: string | null | undefined;
  hasPreference?: Graph_Organization_Has_Preference_Arr_Rel_Insert_Input | null | undefined;
  hasSite?: Graph_Organization_Has_Postal_Address_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  org_classification?: string | null | undefined;
  org_identifier?: string | null | undefined;
  organizationSlug?: Maintainer_Organization_Slug_Obj_Rel_Insert_Input | null | undefined;
  schemaContactPoint?: Graph_Schema_Contact_Point_Arr_Rel_Insert_Input | null | undefined;
  schema_vat_id?: string | null | undefined;
  skos_pref_label?: string | null | undefined;
  updated_at?: any;
  users?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  visitorSpace?: Maintainer_Visitor_Space_Obj_Rel_Insert_Input | null | undefined;
};

/** input type for inserting object relation for remote table "graph.organization" */
export type Graph_Organization_Obj_Rel_Insert_Input = {
  data: Graph_Organization_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Organization_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.organization" */
export type Graph_Organization_On_Conflict = {
  constraint: Graph_Organization_Constraint;
  update_columns?: Array<Graph_Organization_Update_Column>;
  where?: Graph_Organization_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "graph.organization". */
export type Graph_Organization_Order_By = {
  created_at?: Order_By | null | undefined;
  dcterms_description?: Order_By | null | undefined;
  foaf_homepage?: Order_By | null | undefined;
  ha_org_has_logo?: Order_By | null | undefined;
  ha_org_request_form?: Order_By | null | undefined;
  ha_org_sector?: Order_By | null | undefined;
  hasPreference_aggregate?: Graph_Organization_Has_Preference_Aggregate_Order_By | null | undefined;
  hasSite_aggregate?: Graph_Organization_Has_Postal_Address_Aggregate_Order_By | null | undefined;
  id?: Order_By | null | undefined;
  org_classification?: Order_By | null | undefined;
  org_identifier?: Order_By | null | undefined;
  organizationSlug?: Maintainer_Organization_Slug_Order_By | null | undefined;
  schemaContactPoint_aggregate?: Graph_Schema_Contact_Point_Aggregate_Order_By | null | undefined;
  schema_vat_id?: Order_By | null | undefined;
  skos_pref_label?: Order_By | null | undefined;
  skos_pref_label_lowercase?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  users?: Users_Profile_Order_By | null | undefined;
  visitorSpace?: Maintainer_Visitor_Space_Order_By | null | undefined;
};

/** update columns of table "graph.organization" */
export enum Graph_Organization_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsDescription = 'dcterms_description',
  /** column name */
  FoafHomepage = 'foaf_homepage',
  /** column name */
  HaOrgHasLogo = 'ha_org_has_logo',
  /** column name */
  HaOrgRequestForm = 'ha_org_request_form',
  /** column name */
  HaOrgSector = 'ha_org_sector',
  /** column name */
  Id = 'id',
  /** column name */
  OrgClassification = 'org_classification',
  /** column name */
  OrgIdentifier = 'org_identifier',
  /** column name */
  SchemaVatId = 'schema_vat_id',
  /** column name */
  SkosPrefLabel = 'skos_pref_label',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Premis_Identifier_Aggregate_Bool_Exp = {
  count?: Graph_Premis_Identifier_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Premis_Identifier_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Premis_Identifier_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Premis_Identifier_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.premis_identifier" */
export type Graph_Premis_Identifier_Arr_Rel_Insert_Input = {
  data: Array<Graph_Premis_Identifier_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Premis_Identifier_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.premis_identifier". All fields are combined with a logical 'AND'. */
export type Graph_Premis_Identifier_Bool_Exp = {
  _and?: Array<Graph_Premis_Identifier_Bool_Exp> | null | undefined;
  _not?: Graph_Premis_Identifier_Bool_Exp | null | undefined;
  _or?: Array<Graph_Premis_Identifier_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  value?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.premis_identifier" */
export enum Graph_Premis_Identifier_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "type", "value" */
  PremisIdentifierPkey = 'premis_identifier_pkey'
}

/** input type for inserting data into table "graph.premis_identifier" */
export type Graph_Premis_Identifier_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: any;
  value?: string | null | undefined;
};

/** on_conflict condition type for table "graph.premis_identifier" */
export type Graph_Premis_Identifier_On_Conflict = {
  constraint: Graph_Premis_Identifier_Constraint;
  update_columns?: Array<Graph_Premis_Identifier_Update_Column>;
  where?: Graph_Premis_Identifier_Bool_Exp | null | undefined;
};

/** select columns of table "graph.premis_identifier" */
export enum Graph_Premis_Identifier_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/** update columns of table "graph.premis_identifier" */
export enum Graph_Premis_Identifier_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

export type Graph_Representation_Aggregate_Bool_Exp = {
  count?: Graph_Representation_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Representation_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Representation_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Representation_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.representation" */
export type Graph_Representation_Arr_Rel_Insert_Input = {
  data: Array<Graph_Representation_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Representation_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.representation". All fields are combined with a logical 'AND'. */
export type Graph_Representation_Bool_Exp = {
  _and?: Array<Graph_Representation_Bool_Exp> | null | undefined;
  _not?: Graph_Representation_Bool_Exp | null | undefined;
  _or?: Array<Graph_Representation_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  edm_is_next_in_sequence?: String_Comparison_Exp | null | undefined;
  hasRoot?: Graph_File_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  includes?: Graph_Includes_Bool_Exp | null | undefined;
  includes_aggregate?: Graph_Includes_Aggregate_Bool_Exp | null | undefined;
  isMediaFragmentOf?: Graph_File_Bool_Exp | null | undefined;
  is_media_fragment_of?: String_Comparison_Exp | null | undefined;
  premis_represents?: String_Comparison_Exp | null | undefined;
  relation_has_root?: String_Comparison_Exp | null | undefined;
  relation_has_source?: String_Comparison_Exp | null | undefined;
  represents?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  schemaTranscriptUrls?: Graph_Schema_Transcript_Url_Bool_Exp | null | undefined;
  schemaTranscriptUrls_aggregate?: Graph_Schema_Transcript_Url_Aggregate_Bool_Exp | null | undefined;
  schema_caption?: String_Comparison_Exp | null | undefined;
  schema_end_time?: Time_Comparison_Exp | null | undefined;
  schema_in_language?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_start_time?: Time_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: String_Comparison_Exp | null | undefined;
  schema_transcript?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.representation" */
export enum Graph_Representation_Constraint {
  /** unique or primary key constraint on columns "id" */
  RepresentationPkey = 'representation_pkey'
}

/** input type for inserting data into table "graph.representation" */
export type Graph_Representation_Insert_Input = {
  created_at?: any;
  edm_is_next_in_sequence?: string | null | undefined;
  hasRoot?: Graph_File_Obj_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  includes?: Graph_Includes_Arr_Rel_Insert_Input | null | undefined;
  isMediaFragmentOf?: Graph_File_Obj_Rel_Insert_Input | null | undefined;
  is_media_fragment_of?: string | null | undefined;
  premis_represents?: string | null | undefined;
  relation_has_root?: string | null | undefined;
  relation_has_source?: string | null | undefined;
  represents?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  schemaTranscriptUrls?: Graph_Schema_Transcript_Url_Arr_Rel_Insert_Input | null | undefined;
  schema_caption?: string | null | undefined;
  schema_end_time?: any;
  schema_in_language?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_start_time?: any;
  schema_thumbnail_url?: string | null | undefined;
  schema_transcript?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.representation" */
export type Graph_Representation_Obj_Rel_Insert_Input = {
  data: Graph_Representation_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Representation_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.representation" */
export type Graph_Representation_On_Conflict = {
  constraint: Graph_Representation_Constraint;
  update_columns?: Array<Graph_Representation_Update_Column>;
  where?: Graph_Representation_Bool_Exp | null | undefined;
};

/** select columns of table "graph.representation" */
export enum Graph_Representation_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EdmIsNextInSequence = 'edm_is_next_in_sequence',
  /** column name */
  Id = 'id',
  /** column name */
  IsMediaFragmentOf = 'is_media_fragment_of',
  /** column name */
  PremisRepresents = 'premis_represents',
  /** column name */
  RelationHasRoot = 'relation_has_root',
  /** column name */
  RelationHasSource = 'relation_has_source',
  /** column name */
  SchemaCaption = 'schema_caption',
  /** column name */
  SchemaEndTime = 'schema_end_time',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaStartTime = 'schema_start_time',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  SchemaTranscript = 'schema_transcript',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.representation" */
export enum Graph_Representation_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EdmIsNextInSequence = 'edm_is_next_in_sequence',
  /** column name */
  Id = 'id',
  /** column name */
  IsMediaFragmentOf = 'is_media_fragment_of',
  /** column name */
  PremisRepresents = 'premis_represents',
  /** column name */
  RelationHasRoot = 'relation_has_root',
  /** column name */
  RelationHasSource = 'relation_has_source',
  /** column name */
  SchemaCaption = 'schema_caption',
  /** column name */
  SchemaEndTime = 'schema_end_time',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaStartTime = 'schema_start_time',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  SchemaTranscript = 'schema_transcript',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph.rights". All fields are combined with a logical 'AND'. */
export type Graph_Rights_Bool_Exp = {
  _and?: Array<Graph_Rights_Bool_Exp> | null | undefined;
  _not?: Graph_Rights_Bool_Exp | null | undefined;
  _or?: Array<Graph_Rights_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ha_des_license_distributor?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  reuse_category?: Lookup_Reuse_Category_Bool_Exp | null | undefined;
  reuse_category_id?: String_Comparison_Exp | null | undefined;
  reuse_label?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.rights" */
export enum Graph_Rights_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id" */
  RightsPkey = 'rights_pkey'
}

/** input type for inserting data into table "graph.rights" */
export type Graph_Rights_Insert_Input = {
  created_at?: any;
  ha_des_license_distributor?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  reuse_category?: Lookup_Reuse_Category_Obj_Rel_Insert_Input | null | undefined;
  reuse_category_id?: string | null | undefined;
  reuse_label?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.rights" */
export type Graph_Rights_Obj_Rel_Insert_Input = {
  data: Graph_Rights_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Rights_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.rights" */
export type Graph_Rights_On_Conflict = {
  constraint: Graph_Rights_Constraint;
  update_columns?: Array<Graph_Rights_Update_Column>;
  where?: Graph_Rights_Bool_Exp | null | undefined;
};

/** update columns of table "graph.rights" */
export enum Graph_Rights_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HaDesLicenseDistributor = 'ha_des_license_distributor',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  ReuseCategoryId = 'reuse_category_id',
  /** column name */
  ReuseLabel = 'reuse_label',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Alternate_Name_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Alternate_Name_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Alternate_Name_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Alternate_Name_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Alternate_Name_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_alternate_name" */
export type Graph_Schema_Alternate_Name_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Alternate_Name_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Alternate_Name_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_alternate_name". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Alternate_Name_Bool_Exp = {
  _and?: Array<Graph_Schema_Alternate_Name_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Alternate_Name_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Alternate_Name_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_alternate_name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_alternate_name" */
export enum Graph_Schema_Alternate_Name_Constraint {
  /** unique or primary key constraint on columns "schema_alternate_name", "intellectual_entity_id" */
  SchemaAlternateNamePkey = 'schema_alternate_name_pkey'
}

/** input type for inserting data into table "graph.schema_alternate_name" */
export type Graph_Schema_Alternate_Name_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_alternate_name?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.schema_alternate_name" */
export type Graph_Schema_Alternate_Name_On_Conflict = {
  constraint: Graph_Schema_Alternate_Name_Constraint;
  update_columns?: Array<Graph_Schema_Alternate_Name_Update_Column>;
  where?: Graph_Schema_Alternate_Name_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_alternate_name" */
export enum Graph_Schema_Alternate_Name_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_alternate_name" */
export enum Graph_Schema_Alternate_Name_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Contact_Point_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Contact_Point_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Contact_Point_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Contact_Point_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Contact_Point_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Contact_Point_Max_Order_By | null | undefined;
  min?: Graph_Schema_Contact_Point_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Contact_Point_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Contact_Point_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_contact_point". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Contact_Point_Bool_Exp = {
  _and?: Array<Graph_Schema_Contact_Point_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Contact_Point_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Contact_Point_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  organization?: Graph_Organization_Bool_Exp | null | undefined;
  organization_id?: String_Comparison_Exp | null | undefined;
  schema_contact_type?: String_Comparison_Exp | null | undefined;
  schema_email?: String_Comparison_Exp | null | undefined;
  schema_telephone?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_contact_point" */
export enum Graph_Schema_Contact_Point_Constraint {
  /** unique or primary key constraint on columns "id" */
  SchemaContactPointPkey = 'schema_contact_point_pkey'
}

/** input type for inserting data into table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_Insert_Input = {
  created_at?: any;
  id?: string | null | undefined;
  organization?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  organization_id?: string | null | undefined;
  schema_contact_type?: string | null | undefined;
  schema_email?: string | null | undefined;
  schema_telephone?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  schema_contact_type?: Order_By | null | undefined;
  schema_email?: Order_By | null | undefined;
  schema_telephone?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  schema_contact_type?: Order_By | null | undefined;
  schema_email?: Order_By | null | undefined;
  schema_telephone?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_On_Conflict = {
  constraint: Graph_Schema_Contact_Point_Constraint;
  update_columns?: Array<Graph_Schema_Contact_Point_Update_Column>;
  where?: Graph_Schema_Contact_Point_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_contact_point" */
export enum Graph_Schema_Contact_Point_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  SchemaContactType = 'schema_contact_type',
  /** column name */
  SchemaEmail = 'schema_email',
  /** column name */
  SchemaTelephone = 'schema_telephone',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_contact_point" */
export enum Graph_Schema_Contact_Point_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  SchemaContactType = 'schema_contact_type',
  /** column name */
  SchemaEmail = 'schema_email',
  /** column name */
  SchemaTelephone = 'schema_telephone',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Copyright_Holder_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Copyright_Holder_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Copyright_Holder_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Copyright_Holder_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Copyright_Holder_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_copyright_holder" */
export type Graph_Schema_Copyright_Holder_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Copyright_Holder_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Copyright_Holder_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_copyright_holder". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Copyright_Holder_Bool_Exp = {
  _and?: Array<Graph_Schema_Copyright_Holder_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Copyright_Holder_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Copyright_Holder_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_copyright_holder?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_copyright_holder" */
export enum Graph_Schema_Copyright_Holder_Constraint {
  /** unique or primary key constraint on columns "schema_copyright_holder", "intellectual_entity_id" */
  SchemaCopyrightHolderPkey = 'schema_copyright_holder_pkey'
}

/** input type for inserting data into table "graph.schema_copyright_holder" */
export type Graph_Schema_Copyright_Holder_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_copyright_holder?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.schema_copyright_holder" */
export type Graph_Schema_Copyright_Holder_On_Conflict = {
  constraint: Graph_Schema_Copyright_Holder_Constraint;
  update_columns?: Array<Graph_Schema_Copyright_Holder_Update_Column>;
  where?: Graph_Schema_Copyright_Holder_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_copyright_holder" */
export enum Graph_Schema_Copyright_Holder_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaCopyrightHolder = 'schema_copyright_holder',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_copyright_holder" */
export enum Graph_Schema_Copyright_Holder_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaCopyrightHolder = 'schema_copyright_holder',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Genre_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Genre_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Genre_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Genre_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Genre_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_genre" */
export type Graph_Schema_Genre_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Genre_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Genre_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_genre". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Genre_Bool_Exp = {
  _and?: Array<Graph_Schema_Genre_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Genre_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Genre_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_genre?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_genre" */
export enum Graph_Schema_Genre_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "schema_genre" */
  SchemaGenrePkey = 'schema_genre_pkey'
}

/** input type for inserting data into table "graph.schema_genre" */
export type Graph_Schema_Genre_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_genre?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.schema_genre" */
export type Graph_Schema_Genre_On_Conflict = {
  constraint: Graph_Schema_Genre_Constraint;
  update_columns?: Array<Graph_Schema_Genre_Update_Column>;
  where?: Graph_Schema_Genre_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_genre" */
export enum Graph_Schema_Genre_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaGenre = 'schema_genre',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_genre" */
export enum Graph_Schema_Genre_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaGenre = 'schema_genre',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_In_Language_Aggregate_Bool_Exp = {
  count?: Graph_Schema_In_Language_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_In_Language_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_In_Language_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_In_Language_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_in_language" */
export type Graph_Schema_In_Language_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_In_Language_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_In_Language_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_in_language". All fields are combined with a logical 'AND'. */
export type Graph_Schema_In_Language_Bool_Exp = {
  _and?: Array<Graph_Schema_In_Language_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_In_Language_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_In_Language_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_in_language?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_in_language" */
export enum Graph_Schema_In_Language_Constraint {
  /** unique or primary key constraint on columns "schema_in_language", "intellectual_entity_id" */
  SchemaInLanguagePkey = 'schema_in_language_pkey'
}

/** input type for inserting data into table "graph.schema_in_language" */
export type Graph_Schema_In_Language_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_in_language?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.schema_in_language" */
export type Graph_Schema_In_Language_On_Conflict = {
  constraint: Graph_Schema_In_Language_Constraint;
  update_columns?: Array<Graph_Schema_In_Language_Update_Column>;
  where?: Graph_Schema_In_Language_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_in_language" */
export enum Graph_Schema_In_Language_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_in_language" */
export enum Graph_Schema_In_Language_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Is_Part_Of_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_is_part_of" */
export type Graph_Schema_Is_Part_Of_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Is_Part_Of_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Is_Part_Of_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_is_part_of". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Is_Part_Of_Bool_Exp = {
  _and?: Array<Graph_Schema_Is_Part_Of_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Is_Part_Of_Bool_Exp> | null | undefined;
  collection?: Graph_Collection_Bool_Exp | null | undefined;
  collection_id?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectualEntity?: Graph__Intellectual_Entity_Bool_Exp | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_is_part_of" */
export enum Graph_Schema_Is_Part_Of_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "type", "collection_id" */
  SchemaIsPartOfPkey = 'schema_is_part_of_pkey'
}

/** input type for inserting data into table "graph.schema_is_part_of" */
export type Graph_Schema_Is_Part_Of_Insert_Input = {
  collection?: Graph_Collection_Obj_Rel_Insert_Input | null | undefined;
  /** Identifier van de Collection */
  collection_id?: string | null | undefined;
  created_at?: any;
  intellectualEntity?: Graph__Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  /** Identifier van de IE */
  intellectual_entity_id?: string | null | undefined;
  /** Type collectie (creativeWorkSeries, newspaper, etc.) */
  type?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.schema_is_part_of" */
export type Graph_Schema_Is_Part_Of_On_Conflict = {
  constraint: Graph_Schema_Is_Part_Of_Constraint;
  update_columns?: Array<Graph_Schema_Is_Part_Of_Update_Column>;
  where?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_is_part_of" */
export enum Graph_Schema_Is_Part_Of_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_is_part_of" */
export enum Graph_Schema_Is_Part_Of_Update_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Keywords_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Keywords_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Keywords_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Keywords_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Keywords_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_keywords" */
export type Graph_Schema_Keywords_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Keywords_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Keywords_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_keywords". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Keywords_Bool_Exp = {
  _and?: Array<Graph_Schema_Keywords_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Keywords_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Keywords_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_keywords?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_keywords" */
export enum Graph_Schema_Keywords_Constraint {
  /** unique or primary key constraint on columns "schema_keywords", "intellectual_entity_id" */
  SchemaKeywordsPkey = 'schema_keywords_pkey'
}

/** input type for inserting data into table "graph.schema_keywords" */
export type Graph_Schema_Keywords_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_keywords?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.schema_keywords" */
export type Graph_Schema_Keywords_On_Conflict = {
  constraint: Graph_Schema_Keywords_Constraint;
  update_columns?: Array<Graph_Schema_Keywords_Update_Column>;
  where?: Graph_Schema_Keywords_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_keywords" */
export enum Graph_Schema_Keywords_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaKeywords = 'schema_keywords',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_keywords" */
export enum Graph_Schema_Keywords_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaKeywords = 'schema_keywords',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_License_Aggregate_Bool_Exp = {
  count?: Graph_Schema_License_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_License_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_License_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_License_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_license" */
export type Graph_Schema_License_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_License_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_License_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_license". All fields are combined with a logical 'AND'. */
export type Graph_Schema_License_Bool_Exp = {
  _and?: Array<Graph_Schema_License_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_License_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_License_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_license?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_license" */
export enum Graph_Schema_License_Constraint {
  /** unique or primary key constraint on columns "schema_license", "intellectual_entity_id" */
  SchemaLicensePkey = 'schema_license_pkey'
}

/** input type for inserting data into table "graph.schema_license" */
export type Graph_Schema_License_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_license?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.schema_license" */
export type Graph_Schema_License_On_Conflict = {
  constraint: Graph_Schema_License_Constraint;
  update_columns?: Array<Graph_Schema_License_Update_Column>;
  where?: Graph_Schema_License_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_license" */
export enum Graph_Schema_License_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaLicense = 'schema_license',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_license" */
export enum Graph_Schema_License_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaLicense = 'schema_license',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Mentions_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Mentions_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Mentions_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Mentions_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Mentions_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Mentions_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Mentions_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_mentions". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Mentions_Bool_Exp = {
  _and?: Array<Graph_Schema_Mentions_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Mentions_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Mentions_Bool_Exp> | null | undefined;
  confidence?: Numeric_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  highlights?: Graph__Highlight_Bool_Exp | null | undefined;
  highlights_aggregate?: Graph__Highlight_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  thing?: Graph_Thing_Bool_Exp | null | undefined;
  thing_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_mentions" */
export enum Graph_Schema_Mentions_Constraint {
  /** unique or primary key constraint on columns "id" */
  SchemaMentionsPkey = 'schema_mentions_pkey'
}

/** input type for inserting data into table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Insert_Input = {
  confidence?: any;
  created_at?: any;
  highlights?: Graph__Highlight_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  thing?: Graph_Thing_Obj_Rel_Insert_Input | null | undefined;
  thing_id?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.schema_mentions" */
export type Graph_Schema_Mentions_On_Conflict = {
  constraint: Graph_Schema_Mentions_Constraint;
  update_columns?: Array<Graph_Schema_Mentions_Update_Column>;
  where?: Graph_Schema_Mentions_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_mentions" */
export enum Graph_Schema_Mentions_Select_Column {
  /** column name */
  Confidence = 'confidence',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  ThingId = 'thing_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_mentions" */
export enum Graph_Schema_Mentions_Update_Column {
  /** column name */
  Confidence = 'confidence',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  ThingId = 'thing_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph.schema_postal_address". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Postal_Address_Bool_Exp = {
  _and?: Array<Graph_Schema_Postal_Address_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Postal_Address_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Postal_Address_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  schema_address_country?: String_Comparison_Exp | null | undefined;
  schema_address_locality?: String_Comparison_Exp | null | undefined;
  schema_address_region?: String_Comparison_Exp | null | undefined;
  schema_contact_type?: String_Comparison_Exp | null | undefined;
  schema_postal_code?: String_Comparison_Exp | null | undefined;
  schema_street_address?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_postal_address" */
export enum Graph_Schema_Postal_Address_Constraint {
  /** unique or primary key constraint on columns "id" */
  SchemaPostalAddressPkey = 'schema_postal_address_pkey'
}

/** input type for inserting data into table "graph.schema_postal_address" */
export type Graph_Schema_Postal_Address_Insert_Input = {
  created_at?: any;
  id?: string | null | undefined;
  schema_address_country?: string | null | undefined;
  schema_address_locality?: string | null | undefined;
  schema_address_region?: string | null | undefined;
  schema_contact_type?: string | null | undefined;
  schema_postal_code?: string | null | undefined;
  schema_street_address?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.schema_postal_address" */
export type Graph_Schema_Postal_Address_Obj_Rel_Insert_Input = {
  data: Graph_Schema_Postal_Address_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Schema_Postal_Address_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.schema_postal_address" */
export type Graph_Schema_Postal_Address_On_Conflict = {
  constraint: Graph_Schema_Postal_Address_Constraint;
  update_columns?: Array<Graph_Schema_Postal_Address_Update_Column>;
  where?: Graph_Schema_Postal_Address_Bool_Exp | null | undefined;
};

/** update columns of table "graph.schema_postal_address" */
export enum Graph_Schema_Postal_Address_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaAddressCountry = 'schema_address_country',
  /** column name */
  SchemaAddressLocality = 'schema_address_locality',
  /** column name */
  SchemaAddressRegion = 'schema_address_region',
  /** column name */
  SchemaContactType = 'schema_contact_type',
  /** column name */
  SchemaPostalCode = 'schema_postal_code',
  /** column name */
  SchemaStreetAddress = 'schema_street_address',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Spatial_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Spatial_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Spatial_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Spatial_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Spatial_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_spatial" */
export type Graph_Schema_Spatial_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Spatial_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Spatial_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_spatial". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Spatial_Bool_Exp = {
  _and?: Array<Graph_Schema_Spatial_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Spatial_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Spatial_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_spatial?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_spatial" */
export enum Graph_Schema_Spatial_Constraint {
  /** unique or primary key constraint on columns "schema_spatial", "intellectual_entity_id" */
  SchemaSpatialPkey = 'schema_spatial_pkey'
}

/** input type for inserting data into table "graph.schema_spatial" */
export type Graph_Schema_Spatial_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_spatial?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.schema_spatial" */
export type Graph_Schema_Spatial_On_Conflict = {
  constraint: Graph_Schema_Spatial_Constraint;
  update_columns?: Array<Graph_Schema_Spatial_Update_Column>;
  where?: Graph_Schema_Spatial_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_spatial" */
export enum Graph_Schema_Spatial_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaSpatial = 'schema_spatial',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_spatial" */
export enum Graph_Schema_Spatial_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaSpatial = 'schema_spatial',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Temporal_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Temporal_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Temporal_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Temporal_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Temporal_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_temporal" */
export type Graph_Schema_Temporal_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Temporal_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Temporal_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_temporal". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Temporal_Bool_Exp = {
  _and?: Array<Graph_Schema_Temporal_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Temporal_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Temporal_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_temporal?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_temporal" */
export enum Graph_Schema_Temporal_Constraint {
  /** unique or primary key constraint on columns "schema_temporal", "intellectual_entity_id" */
  SchemaTemporalPkey = 'schema_temporal_pkey'
}

/** input type for inserting data into table "graph.schema_temporal" */
export type Graph_Schema_Temporal_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_temporal?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.schema_temporal" */
export type Graph_Schema_Temporal_On_Conflict = {
  constraint: Graph_Schema_Temporal_Constraint;
  update_columns?: Array<Graph_Schema_Temporal_Update_Column>;
  where?: Graph_Schema_Temporal_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_temporal" */
export enum Graph_Schema_Temporal_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaTemporal = 'schema_temporal',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_temporal" */
export enum Graph_Schema_Temporal_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaTemporal = 'schema_temporal',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Transcript_Url_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Transcript_Url_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Transcript_Url_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Transcript_Url_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Transcript_Url_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Transcript_Url_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Transcript_Url_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_transcript_url". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Transcript_Url_Bool_Exp = {
  _and?: Array<Graph_Schema_Transcript_Url_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Transcript_Url_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Transcript_Url_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  representation_id?: String_Comparison_Exp | null | undefined;
  schema_transcript?: String_Comparison_Exp | null | undefined;
  schema_transcript_url?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_transcript_url" */
export enum Graph_Schema_Transcript_Url_Constraint {
  /** unique or primary key constraint on columns "representation_id" */
  SchemaTranscriptUrlPkey = 'schema_transcript_url_pkey',
  /** unique or primary key constraint on columns "schema_transcript_url" */
  SchemaTranscriptUrlSchemaTranscriptUrlKey = 'schema_transcript_url_schema_transcript_url_key'
}

/** input type for inserting data into table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_Insert_Input = {
  created_at?: any;
  representation_id?: string | null | undefined;
  schema_transcript?: string | null | undefined;
  schema_transcript_url?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_Obj_Rel_Insert_Input = {
  data: Graph_Schema_Transcript_Url_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Schema_Transcript_Url_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_On_Conflict = {
  constraint: Graph_Schema_Transcript_Url_Constraint;
  update_columns?: Array<Graph_Schema_Transcript_Url_Update_Column>;
  where?: Graph_Schema_Transcript_Url_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_transcript_url" */
export enum Graph_Schema_Transcript_Url_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  RepresentationId = 'representation_id',
  /** column name */
  SchemaTranscript = 'schema_transcript',
  /** column name */
  SchemaTranscriptUrl = 'schema_transcript_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_transcript_url" */
export enum Graph_Schema_Transcript_Url_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  RepresentationId = 'representation_id',
  /** column name */
  SchemaTranscript = 'schema_transcript',
  /** column name */
  SchemaTranscriptUrl = 'schema_transcript_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph.thing". All fields are combined with a logical 'AND'. */
export type Graph_Thing_Bool_Exp = {
  _and?: Array<Graph_Thing_Bool_Exp> | null | undefined;
  _not?: Graph_Thing_Bool_Exp | null | undefined;
  _or?: Array<Graph_Thing_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  schema_birth_date?: Smallint_Comparison_Exp | null | undefined;
  schema_birth_place?: String_Comparison_Exp | null | undefined;
  schema_death_date?: Smallint_Comparison_Exp | null | undefined;
  schema_death_place?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  wiki_id?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.thing" */
export enum Graph_Thing_Constraint {
  /** unique or primary key constraint on columns "id" */
  ThingPkey = 'thing_pkey'
}

/** input type for inserting data into table "graph.thing" */
export type Graph_Thing_Insert_Input = {
  created_at?: any;
  id?: string | null | undefined;
  schema_birth_date?: any;
  schema_birth_place?: string | null | undefined;
  schema_death_date?: any;
  schema_death_place?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_thumbnail_url?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: any;
  wiki_id?: string | null | undefined;
};

/** input type for inserting object relation for remote table "graph.thing" */
export type Graph_Thing_Obj_Rel_Insert_Input = {
  data: Graph_Thing_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Thing_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.thing" */
export type Graph_Thing_On_Conflict = {
  constraint: Graph_Thing_Constraint;
  update_columns?: Array<Graph_Thing_Update_Column>;
  where?: Graph_Thing_Bool_Exp | null | undefined;
};

/** update columns of table "graph.thing" */
export enum Graph_Thing_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaBirthDate = 'schema_birth_date',
  /** column name */
  SchemaBirthPlace = 'schema_birth_place',
  /** column name */
  SchemaDeathDate = 'schema_death_date',
  /** column name */
  SchemaDeathPlace = 'schema_death_place',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WikiId = 'wiki_id'
}

/** Boolean expression to compare columns of type "interval". All fields are combined with logical 'AND'. */
export type Interval_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export type Jsonb_Cast_Exp = {
  String?: String_Comparison_Exp | null | undefined;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: Jsonb_Cast_Exp | null | undefined;
  /** is the column contained in the given json value */
  _contained_in?: any;
  /** does the column contain the given json value at the top level */
  _contains?: any;
  _eq?: any;
  _gt?: any;
  _gte?: any;
  /** does the string exist as a top-level key in the column */
  _has_key?: string | null | undefined;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Array<string> | null | undefined;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Array<string> | null | undefined;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to filter rows from the table "lookup.app_content_block_type". All fields are combined with a logical 'AND'. */
export type Lookup_App_Content_Block_Type_Bool_Exp = {
  _and?: Array<Lookup_App_Content_Block_Type_Bool_Exp> | null | undefined;
  _not?: Lookup_App_Content_Block_Type_Bool_Exp | null | undefined;
  _or?: Array<Lookup_App_Content_Block_Type_Bool_Exp> | null | undefined;
  comment?: String_Comparison_Exp | null | undefined;
  value?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.app_content_block_type" */
export enum Lookup_App_Content_Block_Type_Constraint {
  /** unique or primary key constraint on columns "value" */
  CmsContentBlockTypePkey = 'cms_content_block_type_pkey'
}

export enum Lookup_App_Content_Block_Type_Enum {
  AankeilerText = 'AANKEILER_TEXT',
  Accordions = 'ACCORDIONS',
  AnchorLinks = 'ANCHOR_LINKS',
  Attribution = 'ATTRIBUTION',
  Breadcrumbs = 'BREADCRUMBS',
  Buttons = 'BUTTONS',
  Cards = 'CARDS',
  CardsNoDescription = 'CARDS_NO_DESCRIPTION',
  ContentEncloseGrid = 'CONTENT_ENCLOSE_GRID',
  ContentPageMeta = 'CONTENT_PAGE_META',
  Ctas = 'CTAS',
  DoubleBanner = 'DOUBLE_BANNER',
  Eventbrite = 'EVENTBRITE',
  Heading = 'HEADING',
  Hero = 'HERO',
  HeroCarousel = 'HERO_CAROUSEL',
  HetarchiefHeader = 'HETARCHIEF_HEADER',
  HetarchiefQuote = 'HETARCHIEF_QUOTE',
  HetarchiefVideo = 'HETARCHIEF_VIDEO',
  HetarchiefHeaderSearch = 'HETARCHIEF__HEADER_SEARCH',
  HighlightText = 'HIGHLIGHT_TEXT',
  HomepageBanner = 'HOMEPAGE_BANNER',
  Iframe = 'IFRAME',
  Image = 'IMAGE',
  ImageCarousel = 'IMAGE_CAROUSEL',
  ImageGrid = 'IMAGE_GRID',
  ImageTextBackground = 'IMAGE_TEXT_BACKGROUND',
  Intro = 'INTRO',
  Klaar = 'KLAAR',
  Links = 'LINKS',
  LogoGrid = 'LOGO_GRID',
  MaintainersGrid = 'MAINTAINERS_GRID',
  MediaGrid = 'MEDIA_GRID',
  MediaPlayer = 'MEDIA_PLAYER',
  MediaPlayerTitleTextButton = 'MEDIA_PLAYER_TITLE_TEXT_BUTTON',
  ObjectsGrid = 'OBJECTS_GRID',
  OverviewNewspaperTitles = 'OVERVIEW_NEWSPAPER_TITLES',
  OverviewThemes = 'OVERVIEW_THEMES',
  OverviewWithCarousel = 'OVERVIEW_WITH_CAROUSEL',
  PageOverview = 'PAGE_OVERVIEW',
  ProjectsSpotlight = 'PROJECTS_SPOTLIGHT',
  Quote = 'QUOTE',
  RichText = 'RICH_TEXT',
  RichTextTwoColumns = 'RICH_TEXT_TWO_COLUMNS',
  Search = 'SEARCH',
  Spotlight = 'SPOTLIGHT',
  Subtitle = 'SUBTITLE',
  TagsWithLinks = 'TAGS_WITH_LINKS',
  TextInSpotlight = 'TEXT_IN_SPOTLIGHT',
  ThemeReels = 'THEME_REELS',
  ThreeChoicesPlayer = 'THREE_CHOICES_PLAYER',
  ThreeClickableTiles = 'THREE_CLICKABLE_TILES',
  Timeline = 'TIMELINE',
  Title = 'TITLE',
  TitleImageText = 'TITLE_IMAGE_TEXT',
  TitleImageTextButton = 'TITLE_IMAGE_TEXT_BUTTON',
  TitleWithParallax = 'TITLE_WITH_PARALLAX',
  UspGrid = 'USP_GRID',
  Video = 'VIDEO',
  VideoTitleTextButton = 'VIDEO_TITLE_TEXT_BUTTON'
}

/** Boolean expression to compare columns of type "lookup_app_content_block_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Content_Block_Type_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Content_Block_Type_Enum | null | undefined;
  _in?: Array<Lookup_App_Content_Block_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Content_Block_Type_Enum | null | undefined;
  _nin?: Array<Lookup_App_Content_Block_Type_Enum> | null | undefined;
};

/** input type for inserting data into table "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_Insert_Input = {
  comment?: string | null | undefined;
  value?: string | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_Obj_Rel_Insert_Input = {
  data: Lookup_App_Content_Block_Type_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_App_Content_Block_Type_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.app_content_block_type" */
export type Lookup_App_Content_Block_Type_On_Conflict = {
  constraint: Lookup_App_Content_Block_Type_Constraint;
  update_columns?: Array<Lookup_App_Content_Block_Type_Update_Column>;
  where?: Lookup_App_Content_Block_Type_Bool_Exp | null | undefined;
};

/** update columns of table "lookup.app_content_block_type" */
export enum Lookup_App_Content_Block_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** Boolean expression to filter rows from the table "lookup.app_content_type". All fields are combined with a logical 'AND'. */
export type Lookup_App_Content_Type_Bool_Exp = {
  _and?: Array<Lookup_App_Content_Type_Bool_Exp> | null | undefined;
  _not?: Lookup_App_Content_Type_Bool_Exp | null | undefined;
  _or?: Array<Lookup_App_Content_Type_Bool_Exp> | null | undefined;
  comment?: String_Comparison_Exp | null | undefined;
  value?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.app_content_type" */
export enum Lookup_App_Content_Type_Constraint {
  /** unique or primary key constraint on columns "value" */
  CmsContentTypePkey = 'cms_content_type_pkey'
}

export enum Lookup_App_Content_Type_Enum {
  /** Blogpost */
  BlogPost = 'BLOG_POST',
  /** Collection */
  Collection = 'COLLECTION',
  /** Frequently asked question item */
  FaqItem = 'FAQ_ITEM',
  /** Pagina */
  Pagina = 'PAGINA'
}

/** Boolean expression to compare columns of type "lookup_app_content_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Content_Type_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Content_Type_Enum | null | undefined;
  _in?: Array<Lookup_App_Content_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Content_Type_Enum | null | undefined;
  _nin?: Array<Lookup_App_Content_Type_Enum> | null | undefined;
};

/** input type for inserting data into table "lookup.app_content_type" */
export type Lookup_App_Content_Type_Insert_Input = {
  comment?: string | null | undefined;
  value?: string | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.app_content_type" */
export type Lookup_App_Content_Type_Obj_Rel_Insert_Input = {
  data: Lookup_App_Content_Type_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_App_Content_Type_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.app_content_type" */
export type Lookup_App_Content_Type_On_Conflict = {
  constraint: Lookup_App_Content_Type_Constraint;
  update_columns?: Array<Lookup_App_Content_Type_Update_Column>;
  where?: Lookup_App_Content_Type_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "lookup.app_content_type". */
export type Lookup_App_Content_Type_Order_By = {
  comment?: Order_By | null | undefined;
  value?: Order_By | null | undefined;
};

/** update columns of table "lookup.app_content_type" */
export enum Lookup_App_Content_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

export enum Lookup_App_Material_Request_Download_Status_Enum {
  /** download has expired */
  Expired = 'EXPIRED',
  /** download job failed */
  Failed = 'FAILED',
  /** download was triggered, but job has not been fetched yet */
  New = 'NEW',
  /** download was triggered, and mam export job is in progress */
  Pending = 'PENDING',
  /** download job succeeded, download_url filled in */
  Succeeded = 'SUCCEEDED'
}

/** Boolean expression to compare columns of type "lookup_app_material_request_download_status_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Material_Request_Download_Status_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Material_Request_Download_Status_Enum | null | undefined;
  _in?: Array<Lookup_App_Material_Request_Download_Status_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Material_Request_Download_Status_Enum | null | undefined;
  _nin?: Array<Lookup_App_Material_Request_Download_Status_Enum> | null | undefined;
};

export enum Lookup_App_Material_Request_Message_Type_Enum {
  /** additional conditions */
  AdditionalConditions = 'ADDITIONAL_CONDITIONS',
  /** requester accepted the additional conditions */
  AdditionalConditionsAccepted = 'ADDITIONAL_CONDITIONS_ACCEPTED',
  /** requester denied the additional conditions */
  AdditionalConditionsDenied = 'ADDITIONAL_CONDITIONS_DENIED',
  /** a reminder was sent to the requester to accept or deny the additional requirements after 30 days of no response */
  AdditionalConditionsReminder = 'ADDITIONAL_CONDITIONS_REMINDER',
  /** when a material request is approved by an evaluator at the cp */
  Approved = 'APPROVED',
  /** when a material request is cancelled by the requester */
  Cancelled = 'CANCELLED',
  /** when a material request is denied by an evaluator at the cp */
  Denied = 'DENIED',
  /** When a download is made available */
  DownloadAvailable = 'DOWNLOAD_AVAILABLE',
  /** When a download has expired */
  DownloadExpired = 'DOWNLOAD_EXPIRED',
  /** When a download job has started */
  DownloadRequested = 'DOWNLOAD_REQUESTED',
  /** pdf generated when the material request gets a final status. eg: APPROVED or DENIED or CANCELLED */
  FinalSummary = 'FINAL_SUMMARY',
  /** a regular message */
  Message = 'MESSAGE',
  /** pdf file generated when the requester sends the material request with reuse form to the evaluator */
  ReuseSummary = 'REUSE_SUMMARY'
}

/** Boolean expression to compare columns of type "lookup_app_material_request_message_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Material_Request_Message_Type_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Material_Request_Message_Type_Enum | null | undefined;
  _in?: Array<Lookup_App_Material_Request_Message_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Material_Request_Message_Type_Enum | null | undefined;
  _nin?: Array<Lookup_App_Material_Request_Message_Type_Enum> | null | undefined;
};

export enum Lookup_App_Material_Request_Requester_Capacity_Enum {
  Education = 'EDUCATION',
  Other = 'OTHER',
  PrivateResearch = 'PRIVATE_RESEARCH',
  Work = 'WORK'
}

/** Boolean expression to compare columns of type "lookup_app_material_request_requester_capacity_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Material_Request_Requester_Capacity_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Material_Request_Requester_Capacity_Enum | null | undefined;
  _in?: Array<Lookup_App_Material_Request_Requester_Capacity_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Material_Request_Requester_Capacity_Enum | null | undefined;
  _nin?: Array<Lookup_App_Material_Request_Requester_Capacity_Enum> | null | undefined;
};

export enum Lookup_App_Material_Request_Status_Enum {
  /** De materiaalaanvraag is goedgekeurd door de aanbieder. */
  Approved = 'APPROVED',
  /** De materiaalaanvraag was ingediend, maar door de aanvrager zelf geannuleerd. */
  Cancelled = 'CANCELLED',
  /** De materiaalaanvraag is afgekeurd door de aanbieder. */
  Denied = 'DENIED',
  /** De materiaalaanvraag is ingediend, maar nog niet bekeken door de aanbieder. */
  New = 'NEW',
  /** De materiaalaanvraag heeft geen status */
  None = 'NONE',
  /** De materiaalaanvraag is ingediend en bekeken door de aabieder, maar de aanbieder heeft nog geen beslissing genomen. */
  Pending = 'PENDING'
}

/** Boolean expression to compare columns of type "lookup_app_material_request_status_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Material_Request_Status_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Material_Request_Status_Enum | null | undefined;
  _in?: Array<Lookup_App_Material_Request_Status_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Material_Request_Status_Enum | null | undefined;
  _nin?: Array<Lookup_App_Material_Request_Status_Enum> | null | undefined;
};

/** Boolean expression to filter rows from the table "lookup.app_material_request_status_sort_order". All fields are combined with a logical 'AND'. */
export type Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp = {
  _and?: Array<Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp> | null | undefined;
  _not?: Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp | null | undefined;
  _or?: Array<Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp> | null | undefined;
  sort_order?: Int_Comparison_Exp | null | undefined;
  status?: Lookup_App_Material_Request_Status_Enum_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.app_material_request_status_sort_order" */
export enum Lookup_App_Material_Request_Status_Sort_Order_Constraint {
  /** unique or primary key constraint on columns "status" */
  AppMaterialRequestStatusSortOrderPkey = 'app_material_request_status_sort_order_pkey',
  /** unique or primary key constraint on columns "sort_order" */
  AppMaterialRequestStatusSortOrderSortOrderKey = 'app_material_request_status_sort_order_sort_order_key'
}

/** input type for inserting data into table "lookup.app_material_request_status_sort_order" */
export type Lookup_App_Material_Request_Status_Sort_Order_Insert_Input = {
  sort_order?: number | null | undefined;
  status?: Lookup_App_Material_Request_Status_Enum | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.app_material_request_status_sort_order" */
export type Lookup_App_Material_Request_Status_Sort_Order_Obj_Rel_Insert_Input = {
  data: Lookup_App_Material_Request_Status_Sort_Order_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_App_Material_Request_Status_Sort_Order_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.app_material_request_status_sort_order" */
export type Lookup_App_Material_Request_Status_Sort_Order_On_Conflict = {
  constraint: Lookup_App_Material_Request_Status_Sort_Order_Constraint;
  update_columns?: Array<Lookup_App_Material_Request_Status_Sort_Order_Update_Column>;
  where?: Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp | null | undefined;
};

/** update columns of table "lookup.app_material_request_status_sort_order" */
export enum Lookup_App_Material_Request_Status_Sort_Order_Update_Column {
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Status = 'status'
}

export enum Lookup_App_Material_Request_Type_Enum {
  /** Meer info van het materiaal */
  MoreInfo = 'MORE_INFO',
  /** Hergebruik van materiaal */
  Reuse = 'REUSE',
  /** Bekijken van het materiaal */
  View = 'VIEW'
}

/** Boolean expression to compare columns of type "lookup_app_material_request_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Material_Request_Type_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Material_Request_Type_Enum | null | undefined;
  _in?: Array<Lookup_App_Material_Request_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Material_Request_Type_Enum | null | undefined;
  _nin?: Array<Lookup_App_Material_Request_Type_Enum> | null | undefined;
};

export enum Lookup_Languages_Enum {
  /** English */
  En = 'en',
  /** Nederlands */
  Nl = 'nl'
}

/** Boolean expression to compare columns of type "lookup_languages_enum". All fields are combined with logical 'AND'. */
export type Lookup_Languages_Enum_Comparison_Exp = {
  _eq?: Lookup_Languages_Enum | null | undefined;
  _in?: Array<Lookup_Languages_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_Languages_Enum | null | undefined;
  _nin?: Array<Lookup_Languages_Enum> | null | undefined;
};

export enum Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum {
  /** Toegang tot specifieke folders van de bezoekersruimte */
  Folders = 'FOLDERS',
  /** Volledige toegang tot de bezoekersruimte */
  Full = 'FULL'
}

/** Boolean expression to compare columns of type "lookup_maintainer_visitor_space_request_access_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum_Comparison_Exp = {
  _eq?: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum | null | undefined;
  _in?: Array<Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum | null | undefined;
  _nin?: Array<Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum> | null | undefined;
};

/** Boolean expression to filter rows from the table "lookup.maintainer_visitor_space_request_status". All fields are combined with a logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp = {
  _and?: Array<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp> | null | undefined;
  _not?: Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp | null | undefined;
  _or?: Array<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp> | null | undefined;
  comment?: String_Comparison_Exp | null | undefined;
  sort_order?: Int_Comparison_Exp | null | undefined;
  value?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.maintainer_visitor_space_request_status" */
export enum Lookup_Maintainer_Visitor_Space_Request_Status_Constraint {
  /** unique or primary key constraint on columns "value" */
  CpVisitStatusPkey = 'cp_visit_status_pkey',
  /** unique or primary key constraint on columns "sort_order" */
  MaintainerVisitorSpaceRequestStatusSortOrderKey = 'maintainer_visitor_space_request_status_sort_order_key'
}

/** input type for inserting data into table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Insert_Input = {
  comment?: string | null | undefined;
  sort_order?: number | null | undefined;
  value?: string | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Obj_Rel_Insert_Input = {
  data: Lookup_Maintainer_Visitor_Space_Request_Status_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_Maintainer_Visitor_Space_Request_Status_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_On_Conflict = {
  constraint: Lookup_Maintainer_Visitor_Space_Request_Status_Constraint;
  update_columns?: Array<Lookup_Maintainer_Visitor_Space_Request_Status_Update_Column>;
  where?: Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp | null | undefined;
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

/** Boolean expression to filter rows from the table "lookup.maintainer_visitor_space_status". All fields are combined with a logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Status_Bool_Exp = {
  _and?: Array<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp> | null | undefined;
  _not?: Lookup_Maintainer_Visitor_Space_Status_Bool_Exp | null | undefined;
  _or?: Array<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp> | null | undefined;
  comment?: String_Comparison_Exp | null | undefined;
  sort_order?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp | null | undefined;
  value?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.maintainer_visitor_space_status" */
export enum Lookup_Maintainer_Visitor_Space_Status_Constraint {
  /** unique or primary key constraint on columns "value" */
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
  _eq?: Lookup_Maintainer_Visitor_Space_Status_Enum | null | undefined;
  _in?: Array<Lookup_Maintainer_Visitor_Space_Status_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_Maintainer_Visitor_Space_Status_Enum | null | undefined;
  _nin?: Array<Lookup_Maintainer_Visitor_Space_Status_Enum> | null | undefined;
};

/** input type for inserting data into table "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_Insert_Input = {
  comment?: string | null | undefined;
  sort_order?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Obj_Rel_Insert_Input | null | undefined;
  value?: string | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_Obj_Rel_Insert_Input = {
  data: Lookup_Maintainer_Visitor_Space_Status_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_Maintainer_Visitor_Space_Status_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_On_Conflict = {
  constraint: Lookup_Maintainer_Visitor_Space_Status_Constraint;
  update_columns?: Array<Lookup_Maintainer_Visitor_Space_Status_Update_Column>;
  where?: Lookup_Maintainer_Visitor_Space_Status_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "lookup.maintainer_visitor_space_status". */
export type Lookup_Maintainer_Visitor_Space_Status_Order_By = {
  comment?: Order_By | null | undefined;
  sort_order?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Order_By | null | undefined;
  value?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "lookup.maintainer_visitor_space_status_sort_order". All fields are combined with a logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp = {
  _and?: Array<Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp> | null | undefined;
  _not?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp | null | undefined;
  _or?: Array<Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp> | null | undefined;
  sort_order?: Int_Comparison_Exp | null | undefined;
  status?: Lookup_Maintainer_Visitor_Space_Status_Enum_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.maintainer_visitor_space_status_sort_order" */
export enum Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Constraint {
  /** unique or primary key constraint on columns "status" */
  MaintainerVisitorSpaceStatusSortOrderPkey = 'maintainer_visitor_space_status_sort_order_pkey',
  /** unique or primary key constraint on columns "sort_order" */
  MaintainerVisitorSpaceStatusSortOrderSortOrderKey = 'maintainer_visitor_space_status_sort_order_sort_order_key'
}

/** input type for inserting data into table "lookup.maintainer_visitor_space_status_sort_order" */
export type Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Insert_Input = {
  sort_order?: number | null | undefined;
  status?: Lookup_Maintainer_Visitor_Space_Status_Enum | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.maintainer_visitor_space_status_sort_order" */
export type Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Obj_Rel_Insert_Input = {
  data: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.maintainer_visitor_space_status_sort_order" */
export type Lookup_Maintainer_Visitor_Space_Status_Sort_Order_On_Conflict = {
  constraint: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Constraint;
  update_columns?: Array<Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Update_Column>;
  where?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "lookup.maintainer_visitor_space_status_sort_order". */
export type Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Order_By = {
  sort_order?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
};

/** update columns of table "lookup.maintainer_visitor_space_status_sort_order" */
export enum Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Update_Column {
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Status = 'status'
}

/** update columns of table "lookup.maintainer_visitor_space_status" */
export enum Lookup_Maintainer_Visitor_Space_Status_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** Boolean expression to filter rows from the table "lookup.reuse_category". All fields are combined with a logical 'AND'. */
export type Lookup_Reuse_Category_Bool_Exp = {
  _and?: Array<Lookup_Reuse_Category_Bool_Exp> | null | undefined;
  _not?: Lookup_Reuse_Category_Bool_Exp | null | undefined;
  _or?: Array<Lookup_Reuse_Category_Bool_Exp> | null | undefined;
  group?: String_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  label?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.reuse_category" */
export enum Lookup_Reuse_Category_Constraint {
  /** unique or primary key constraint on columns "id" */
  ReuseCategoryPkey = 'reuse_category_pkey'
}

/** input type for inserting data into table "lookup.reuse_category" */
export type Lookup_Reuse_Category_Insert_Input = {
  group?: string | null | undefined;
  id?: string | null | undefined;
  label?: string | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.reuse_category" */
export type Lookup_Reuse_Category_Obj_Rel_Insert_Input = {
  data: Lookup_Reuse_Category_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_Reuse_Category_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.reuse_category" */
export type Lookup_Reuse_Category_On_Conflict = {
  constraint: Lookup_Reuse_Category_Constraint;
  update_columns?: Array<Lookup_Reuse_Category_Update_Column>;
  where?: Lookup_Reuse_Category_Bool_Exp | null | undefined;
};

/** update columns of table "lookup.reuse_category" */
export enum Lookup_Reuse_Category_Update_Column {
  /** column name */
  Group = 'group',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label'
}

export enum Lookup_Schema_Audience_Type_Enum {
  /** The resource is restricted to private access or use. */
  Private = 'PRIVATE',
  /** The resource is intended for public access or use. */
  Public = 'PUBLIC'
}

/** Boolean expression to compare columns of type "lookup_schema_audience_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_Schema_Audience_Type_Enum_Comparison_Exp = {
  _eq?: Lookup_Schema_Audience_Type_Enum | null | undefined;
  _in?: Array<Lookup_Schema_Audience_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_Schema_Audience_Type_Enum | null | undefined;
  _nin?: Array<Lookup_Schema_Audience_Type_Enum> | null | undefined;
};

/** Boolean expression to filter rows from the table "maintainer.organization_slug". All fields are combined with a logical 'AND'. */
export type Maintainer_Organization_Slug_Bool_Exp = {
  _and?: Array<Maintainer_Organization_Slug_Bool_Exp> | null | undefined;
  _not?: Maintainer_Organization_Slug_Bool_Exp | null | undefined;
  _or?: Array<Maintainer_Organization_Slug_Bool_Exp> | null | undefined;
  org_identifier?: String_Comparison_Exp | null | undefined;
  organisation?: Graph_Organization_Bool_Exp | null | undefined;
  slug?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "maintainer.organization_slug" */
export enum Maintainer_Organization_Slug_Constraint {
  /** unique or primary key constraint on columns "org_identifier" */
  OrganizationSlugPkey = 'organization_slug_pkey',
  /** unique or primary key constraint on columns "slug" */
  OrganizationSlugSlugKey = 'organization_slug_slug_key'
}

/** input type for inserting data into table "maintainer.organization_slug" */
export type Maintainer_Organization_Slug_Insert_Input = {
  org_identifier?: string | null | undefined;
  organisation?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  slug?: string | null | undefined;
};

/** input type for inserting object relation for remote table "maintainer.organization_slug" */
export type Maintainer_Organization_Slug_Obj_Rel_Insert_Input = {
  data: Maintainer_Organization_Slug_Insert_Input;
  /** upsert condition */
  on_conflict?: Maintainer_Organization_Slug_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "maintainer.organization_slug" */
export type Maintainer_Organization_Slug_On_Conflict = {
  constraint: Maintainer_Organization_Slug_Constraint;
  update_columns?: Array<Maintainer_Organization_Slug_Update_Column>;
  where?: Maintainer_Organization_Slug_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "maintainer.organization_slug". */
export type Maintainer_Organization_Slug_Order_By = {
  org_identifier?: Order_By | null | undefined;
  organisation?: Graph_Organization_Order_By | null | undefined;
  slug?: Order_By | null | undefined;
};

/** update columns of table "maintainer.organization_slug" */
export enum Maintainer_Organization_Slug_Update_Column {
  /** column name */
  OrgIdentifier = 'org_identifier',
  /** column name */
  Slug = 'slug'
}

/** Boolean expression to filter rows from the table "maintainer.visitor_space". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Bool_Exp = {
  _and?: Array<Maintainer_Visitor_Space_Bool_Exp> | null | undefined;
  _not?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
  _or?: Array<Maintainer_Visitor_Space_Bool_Exp> | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  organisation?: Graph_Organization_Bool_Exp | null | undefined;
  profiles?: Users_Profile_Bool_Exp | null | undefined;
  profiles_aggregate?: Users_Profile_Aggregate_Bool_Exp | null | undefined;
  published_at?: Timestamp_Comparison_Exp | null | undefined;
  schema_audience_type?: Lookup_Schema_Audience_Type_Enum_Comparison_Exp | null | undefined;
  schema_color?: String_Comparison_Exp | null | undefined;
  schema_description_en?: String_Comparison_Exp | null | undefined;
  schema_description_nl?: String_Comparison_Exp | null | undefined;
  schema_image?: String_Comparison_Exp | null | undefined;
  schema_maintainer_id?: String_Comparison_Exp | null | undefined;
  schema_public_access?: Boolean_Comparison_Exp | null | undefined;
  schema_service_description_en?: String_Comparison_Exp | null | undefined;
  schema_service_description_nl?: String_Comparison_Exp | null | undefined;
  status?: Lookup_Maintainer_Visitor_Space_Status_Enum_Comparison_Exp | null | undefined;
  statusInfo?: Lookup_Maintainer_Visitor_Space_Status_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  visitor_space_requests?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  visitor_space_requests_aggregate?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "maintainer.visitor_space" */
export enum Maintainer_Visitor_Space_Constraint {
  /** unique or primary key constraint on columns "id" */
  SpacePkey = 'space_pkey',
  /** unique or primary key constraint on columns "schema_maintainer_id" */
  SpaceSchemaMaintainerIdKey = 'space_schema_maintainer_id_key'
}

/** input type for inserting data into table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Insert_Input = {
  created_at?: any;
  id?: any;
  organisation?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  profiles?: Users_Profile_Arr_Rel_Insert_Input | null | undefined;
  published_at?: any;
  schema_audience_type?: Lookup_Schema_Audience_Type_Enum | null | undefined;
  schema_color?: string | null | undefined;
  schema_description_en?: string | null | undefined;
  schema_description_nl?: string | null | undefined;
  schema_image?: string | null | undefined;
  schema_maintainer_id?: string | null | undefined;
  schema_public_access?: boolean | null | undefined;
  schema_service_description_en?: string | null | undefined;
  schema_service_description_nl?: string | null | undefined;
  status?: Lookup_Maintainer_Visitor_Space_Status_Enum | null | undefined;
  statusInfo?: Lookup_Maintainer_Visitor_Space_Status_Obj_Rel_Insert_Input | null | undefined;
  updated_at?: any;
  visitor_space_requests?: Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input | null | undefined;
};

/** input type for inserting object relation for remote table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Obj_Rel_Insert_Input = {
  data: Maintainer_Visitor_Space_Insert_Input;
  /** upsert condition */
  on_conflict?: Maintainer_Visitor_Space_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Update_Column>;
  where?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "maintainer.visitor_space". */
export type Maintainer_Visitor_Space_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  organisation?: Graph_Organization_Order_By | null | undefined;
  profiles_aggregate?: Users_Profile_Aggregate_Order_By | null | undefined;
  published_at?: Order_By | null | undefined;
  schema_audience_type?: Order_By | null | undefined;
  schema_color?: Order_By | null | undefined;
  schema_description_en?: Order_By | null | undefined;
  schema_description_nl?: Order_By | null | undefined;
  schema_image?: Order_By | null | undefined;
  schema_maintainer_id?: Order_By | null | undefined;
  schema_public_access?: Order_By | null | undefined;
  schema_service_description_en?: Order_By | null | undefined;
  schema_service_description_nl?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  statusInfo?: Lookup_Maintainer_Visitor_Space_Status_Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  visitor_space_requests_aggregate?: Maintainer_Visitor_Space_Request_Aggregate_Order_By | null | undefined;
};

export type Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp = {
  bool_and?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_And = {
  arguments: Maintainer_Visitor_Space_Request_Select_Column_Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Maintainer_Visitor_Space_Request_Select_Column_Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Maintainer_Visitor_Space_Request_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Maintainer_Visitor_Space_Request_Max_Order_By | null | undefined;
  min?: Maintainer_Visitor_Space_Request_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input = {
  data: Array<Maintainer_Visitor_Space_Request_Insert_Input>;
  /** upsert condition */
  on_conflict?: Maintainer_Visitor_Space_Request_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "maintainer.visitor_space_request". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Request_Bool_Exp = {
  _and?: Array<Maintainer_Visitor_Space_Request_Bool_Exp> | null | undefined;
  _not?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  _or?: Array<Maintainer_Visitor_Space_Request_Bool_Exp> | null | undefined;
  access_type?: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum_Comparison_Exp | null | undefined;
  accessible_folders?: Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp | null | undefined;
  accessible_folders_aggregate?: Maintainer_Visitor_Space_Request_Folder_Access_Aggregate_Bool_Exp | null | undefined;
  cp_space_id?: Uuid_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  end_date?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  last_updated_by?: Users_Profile_Bool_Exp | null | undefined;
  notifications?: App_Notification_Bool_Exp | null | undefined;
  notifications_aggregate?: App_Notification_Aggregate_Bool_Exp | null | undefined;
  requested_by?: Users_Profile_Bool_Exp | null | undefined;
  start_date?: Timestamp_Comparison_Exp | null | undefined;
  status?: String_Comparison_Exp | null | undefined;
  status_info?: Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  updated_by?: Uuid_Comparison_Exp | null | undefined;
  user_accepted_tos?: Boolean_Comparison_Exp | null | undefined;
  user_profile_id?: Uuid_Comparison_Exp | null | undefined;
  user_reason?: String_Comparison_Exp | null | undefined;
  user_timeframe?: String_Comparison_Exp | null | undefined;
  visitor_space?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
  visitor_space_request_notes?: Maintainer_Visitor_Space_Request_Note_Bool_Exp | null | undefined;
  visitor_space_request_notes_aggregate?: Maintainer_Visitor_Space_Request_Note_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Constraint {
  /** unique or primary key constraint on columns "id" */
  VisitPkey = 'visit_pkey'
}

export type Maintainer_Visitor_Space_Request_Folder_Access_Aggregate_Bool_Exp = {
  count?: Maintainer_Visitor_Space_Request_Folder_Access_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Maintainer_Visitor_Space_Request_Folder_Access_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Maintainer_Visitor_Space_Request_Folder_Access_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "maintainer.visitor_space_request_folder_access" */
export type Maintainer_Visitor_Space_Request_Folder_Access_Arr_Rel_Insert_Input = {
  data: Array<Maintainer_Visitor_Space_Request_Folder_Access_Insert_Input>;
  /** upsert condition */
  on_conflict?: Maintainer_Visitor_Space_Request_Folder_Access_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "maintainer.visitor_space_request_folder_access". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp = {
  _and?: Array<Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp> | null | undefined;
  _not?: Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp | null | undefined;
  _or?: Array<Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp> | null | undefined;
  folder?: Users_Folder_Bool_Exp | null | undefined;
  folder_id?: Uuid_Comparison_Exp | null | undefined;
  folder_space_visitor_requests?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  folder_space_visitor_requests_aggregate?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  visit_request_id?: Uuid_Comparison_Exp | null | undefined;
  visitor_space_request?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  visitor_space_request_folders?: Users_Folder_Bool_Exp | null | undefined;
  visitor_space_request_folders_aggregate?: Users_Folder_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "maintainer.visitor_space_request_folder_access" */
export enum Maintainer_Visitor_Space_Request_Folder_Access_Constraint {
  /** unique or primary key constraint on columns "id" */
  VisitorSpaceRequestFolderAccessPkey = 'visitor_space_request_folder_access_pkey'
}

/** input type for inserting data into table "maintainer.visitor_space_request_folder_access" */
export type Maintainer_Visitor_Space_Request_Folder_Access_Insert_Input = {
  folder?: Users_Folder_Obj_Rel_Insert_Input | null | undefined;
  folder_id?: any;
  folder_space_visitor_requests?: Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input | null | undefined;
  id?: any;
  visit_request_id?: any;
  visitor_space_request?: Maintainer_Visitor_Space_Request_Obj_Rel_Insert_Input | null | undefined;
  visitor_space_request_folders?: Users_Folder_Arr_Rel_Insert_Input | null | undefined;
};

/** on_conflict condition type for table "maintainer.visitor_space_request_folder_access" */
export type Maintainer_Visitor_Space_Request_Folder_Access_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Request_Folder_Access_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Request_Folder_Access_Update_Column>;
  where?: Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp | null | undefined;
};

/** select columns of table "maintainer.visitor_space_request_folder_access" */
export enum Maintainer_Visitor_Space_Request_Folder_Access_Select_Column {
  /** column name */
  FolderId = 'folder_id',
  /** column name */
  Id = 'id',
  /** column name */
  VisitRequestId = 'visit_request_id'
}

/** update columns of table "maintainer.visitor_space_request_folder_access" */
export enum Maintainer_Visitor_Space_Request_Folder_Access_Update_Column {
  /** column name */
  FolderId = 'folder_id',
  /** column name */
  Id = 'id',
  /** column name */
  VisitRequestId = 'visit_request_id'
}

/** input type for inserting data into table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Insert_Input = {
  access_type?: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum | null | undefined;
  accessible_folders?: Maintainer_Visitor_Space_Request_Folder_Access_Arr_Rel_Insert_Input | null | undefined;
  cp_space_id?: any;
  created_at?: any;
  end_date?: any;
  id?: any;
  last_updated_by?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  notifications?: App_Notification_Arr_Rel_Insert_Input | null | undefined;
  requested_by?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  start_date?: any;
  status?: string | null | undefined;
  status_info?: Lookup_Maintainer_Visitor_Space_Request_Status_Obj_Rel_Insert_Input | null | undefined;
  updated_at?: any;
  updated_by?: any;
  user_accepted_tos?: boolean | null | undefined;
  user_profile_id?: any;
  user_reason?: string | null | undefined;
  user_timeframe?: string | null | undefined;
  visitor_space?: Maintainer_Visitor_Space_Obj_Rel_Insert_Input | null | undefined;
  visitor_space_request_notes?: Maintainer_Visitor_Space_Request_Note_Arr_Rel_Insert_Input | null | undefined;
};

/** order by max() on columns of table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Max_Order_By = {
  cp_space_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  end_date?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  start_date?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  updated_by?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
  user_reason?: Order_By | null | undefined;
  user_timeframe?: Order_By | null | undefined;
};

/** order by min() on columns of table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Min_Order_By = {
  cp_space_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  end_date?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  start_date?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  updated_by?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
  user_reason?: Order_By | null | undefined;
  user_timeframe?: Order_By | null | undefined;
};

export type Maintainer_Visitor_Space_Request_Note_Aggregate_Bool_Exp = {
  count?: Maintainer_Visitor_Space_Request_Note_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Maintainer_Visitor_Space_Request_Note_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Maintainer_Visitor_Space_Request_Note_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Maintainer_Visitor_Space_Request_Note_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Maintainer_Visitor_Space_Request_Note_Max_Order_By | null | undefined;
  min?: Maintainer_Visitor_Space_Request_Note_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Arr_Rel_Insert_Input = {
  data: Array<Maintainer_Visitor_Space_Request_Note_Insert_Input>;
  /** upsert condition */
  on_conflict?: Maintainer_Visitor_Space_Request_Note_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "maintainer.visitor_space_request_note". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Request_Note_Bool_Exp = {
  _and?: Array<Maintainer_Visitor_Space_Request_Note_Bool_Exp> | null | undefined;
  _not?: Maintainer_Visitor_Space_Request_Note_Bool_Exp | null | undefined;
  _or?: Array<Maintainer_Visitor_Space_Request_Note_Bool_Exp> | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  note?: String_Comparison_Exp | null | undefined;
  profile?: Users_Profile_Bool_Exp | null | undefined;
  profile_id?: Uuid_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  visit?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  visit_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "maintainer.visitor_space_request_note" */
export enum Maintainer_Visitor_Space_Request_Note_Constraint {
  /** unique or primary key constraint on columns "id" */
  VisitNotePkey = 'visit_note_pkey'
}

/** input type for inserting data into table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Insert_Input = {
  created_at?: any;
  id?: any;
  note?: string | null | undefined;
  profile?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: any;
  updated_at?: any;
  visit?: Maintainer_Visitor_Space_Request_Obj_Rel_Insert_Input | null | undefined;
  visit_id?: any;
};

/** order by max() on columns of table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  note?: Order_By | null | undefined;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  visit_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  note?: Order_By | null | undefined;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  visit_id?: Order_By | null | undefined;
};

/** on_conflict condition type for table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Request_Note_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Request_Note_Update_Column>;
  where?: Maintainer_Visitor_Space_Request_Note_Bool_Exp | null | undefined;
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
  on_conflict?: Maintainer_Visitor_Space_Request_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Request_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Request_Update_Column>;
  where?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
};

/** select columns of table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Select_Column {
  /** column name */
  AccessType = 'access_type',
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

/** select "maintainer_visitor_space_request_aggregate_bool_exp_bool_and_arguments_columns" columns of table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Select_Column_Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  UserAcceptedTos = 'user_accepted_tos'
}

/** select "maintainer_visitor_space_request_aggregate_bool_exp_bool_or_arguments_columns" columns of table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Select_Column_Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  UserAcceptedTos = 'user_accepted_tos'
}

/** update columns of table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Update_Column {
  /** column name */
  AccessType = 'access_type',
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
  SchemaDescriptionEn = 'schema_description_en',
  /** column name */
  SchemaDescriptionNl = 'schema_description_nl',
  /** column name */
  SchemaImage = 'schema_image',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaPublicAccess = 'schema_public_access',
  /** column name */
  SchemaServiceDescriptionEn = 'schema_service_description_en',
  /** column name */
  SchemaServiceDescriptionNl = 'schema_service_description_nl',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

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

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to compare columns of type "time". All fields are combined with logical 'AND'. */
export type Time_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export type Users_Folder_Aggregate_Bool_Exp = {
  bool_and?: Users_Folder_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Users_Folder_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Users_Folder_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Folder_Aggregate_Bool_Exp_Bool_And = {
  arguments: Users_Folder_Select_Column_Users_Folder_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Users_Folder_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Folder_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Users_Folder_Select_Column_Users_Folder_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Users_Folder_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Folder_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Folder_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Folder_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "users.folder" */
export type Users_Folder_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Users_Folder_Max_Order_By | null | undefined;
  min?: Users_Folder_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "users.folder" */
export type Users_Folder_Arr_Rel_Insert_Input = {
  data: Array<Users_Folder_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_Folder_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "users.folder". All fields are combined with a logical 'AND'. */
export type Users_Folder_Bool_Exp = {
  _and?: Array<Users_Folder_Bool_Exp> | null | undefined;
  _not?: Users_Folder_Bool_Exp | null | undefined;
  _or?: Array<Users_Folder_Bool_Exp> | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  intellectualEntities?: Users_Folder_Ie_Bool_Exp | null | undefined;
  intellectualEntities_aggregate?: Users_Folder_Ie_Aggregate_Bool_Exp | null | undefined;
  is_default?: Boolean_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  user_profile?: Users_Profile_Bool_Exp | null | undefined;
  user_profile_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.folder" */
export enum Users_Folder_Constraint {
  /** unique or primary key constraint on columns "id" */
  CollectionPkey = 'collection_pkey'
}

export type Users_Folder_Ie_Aggregate_Bool_Exp = {
  count?: Users_Folder_Ie_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Folder_Ie_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Folder_Ie_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Folder_Ie_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "users.folder_ie" */
export type Users_Folder_Ie_Arr_Rel_Insert_Input = {
  data: Array<Users_Folder_Ie_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_Folder_Ie_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "users.folder_ie". All fields are combined with a logical 'AND'. */
export type Users_Folder_Ie_Bool_Exp = {
  _and?: Array<Users_Folder_Ie_Bool_Exp> | null | undefined;
  _not?: Users_Folder_Ie_Bool_Exp | null | undefined;
  _or?: Array<Users_Folder_Ie_Bool_Exp> | null | undefined;
  collection?: Users_Folder_Bool_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  ie_object_id?: String_Comparison_Exp | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  user_collection_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.folder_ie" */
export enum Users_Folder_Ie_Constraint {
  /** unique or primary key constraint on columns "ie_object_id", "user_collection_id" */
  CollectionItemPkey = 'collection_item_pkey'
}

/** input type for inserting data into table "users.folder_ie" */
export type Users_Folder_Ie_Insert_Input = {
  collection?: Users_Folder_Obj_Rel_Insert_Input | null | undefined;
  created_at?: any;
  /** de url id van de intellectual entity */
  ie_object_id?: string | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  updated_at?: any;
  user_collection_id?: any;
};

/** on_conflict condition type for table "users.folder_ie" */
export type Users_Folder_Ie_On_Conflict = {
  constraint: Users_Folder_Ie_Constraint;
  update_columns?: Array<Users_Folder_Ie_Update_Column>;
  where?: Users_Folder_Ie_Bool_Exp | null | undefined;
};

/** select columns of table "users.folder_ie" */
export enum Users_Folder_Ie_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IeObjectId = 'ie_object_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserCollectionId = 'user_collection_id'
}

/** update columns of table "users.folder_ie" */
export enum Users_Folder_Ie_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IeObjectId = 'ie_object_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserCollectionId = 'user_collection_id'
}

/** input type for inserting data into table "users.folder" */
export type Users_Folder_Insert_Input = {
  created_at?: any;
  description?: string | null | undefined;
  id?: any;
  intellectualEntities?: Users_Folder_Ie_Arr_Rel_Insert_Input | null | undefined;
  is_default?: boolean | null | undefined;
  is_deleted?: boolean | null | undefined;
  name?: string | null | undefined;
  updated_at?: any;
  user_profile?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  user_profile_id?: any;
};

/** order by max() on columns of table "users.folder" */
export type Users_Folder_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  name?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "users.folder" */
export type Users_Folder_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  name?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
};

/** input type for inserting object relation for remote table "users.folder" */
export type Users_Folder_Obj_Rel_Insert_Input = {
  data: Users_Folder_Insert_Input;
  /** upsert condition */
  on_conflict?: Users_Folder_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "users.folder" */
export type Users_Folder_On_Conflict = {
  constraint: Users_Folder_Constraint;
  update_columns?: Array<Users_Folder_Update_Column>;
  where?: Users_Folder_Bool_Exp | null | undefined;
};

/** select columns of table "users.folder" */
export enum Users_Folder_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** select "users_folder_aggregate_bool_exp_bool_and_arguments_columns" columns of table "users.folder" */
export enum Users_Folder_Select_Column_Users_Folder_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  IsDeleted = 'is_deleted'
}

/** select "users_folder_aggregate_bool_exp_bool_or_arguments_columns" columns of table "users.folder" */
export enum Users_Folder_Select_Column_Users_Folder_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  IsDeleted = 'is_deleted'
}

/** update columns of table "users.folder" */
export enum Users_Folder_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** Boolean expression to filter rows from the table "users.group". All fields are combined with a logical 'AND'. */
export type Users_Group_Bool_Exp = {
  _and?: Array<Users_Group_Bool_Exp> | null | undefined;
  _not?: Users_Group_Bool_Exp | null | undefined;
  _or?: Array<Users_Group_Bool_Exp> | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  label?: String_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  permissions?: Users_Group_Permission_Bool_Exp | null | undefined;
  permissions_aggregate?: Users_Group_Permission_Aggregate_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.group" */
export enum Users_Group_Constraint {
  /** unique or primary key constraint on columns "id" */
  GroupPkey = 'group_pkey'
}

/** input type for inserting data into table "users.group" */
export type Users_Group_Insert_Input = {
  created_at?: any;
  description?: string | null | undefined;
  id?: any;
  label?: string | null | undefined;
  name?: string | null | undefined;
  permissions?: Users_Group_Permission_Arr_Rel_Insert_Input | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "users.group" */
export type Users_Group_Obj_Rel_Insert_Input = {
  data: Users_Group_Insert_Input;
  /** upsert condition */
  on_conflict?: Users_Group_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "users.group" */
export type Users_Group_On_Conflict = {
  constraint: Users_Group_Constraint;
  update_columns?: Array<Users_Group_Update_Column>;
  where?: Users_Group_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "users.group". */
export type Users_Group_Order_By = {
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  label?: Order_By | null | undefined;
  name?: Order_By | null | undefined;
  permissions_aggregate?: Users_Group_Permission_Aggregate_Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

export type Users_Group_Permission_Aggregate_Bool_Exp = {
  count?: Users_Group_Permission_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Group_Permission_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Group_Permission_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Group_Permission_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "users.group_permission" */
export type Users_Group_Permission_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Users_Group_Permission_Max_Order_By | null | undefined;
  min?: Users_Group_Permission_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "users.group_permission" */
export type Users_Group_Permission_Arr_Rel_Insert_Input = {
  data: Array<Users_Group_Permission_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_Group_Permission_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "users.group_permission". All fields are combined with a logical 'AND'. */
export type Users_Group_Permission_Bool_Exp = {
  _and?: Array<Users_Group_Permission_Bool_Exp> | null | undefined;
  _not?: Users_Group_Permission_Bool_Exp | null | undefined;
  _or?: Array<Users_Group_Permission_Bool_Exp> | null | undefined;
  group?: Users_Group_Bool_Exp | null | undefined;
  group_id?: Uuid_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  permission?: Users_Permission_Bool_Exp | null | undefined;
  permission_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.group_permission" */
export enum Users_Group_Permission_Constraint {
  /** unique or primary key constraint on columns "permission_id", "group_id" */
  GroupPermissionGroupIdPermissionIdKey = 'group_permission_group_id_permission_id_key',
  /** unique or primary key constraint on columns "id" */
  GroupPermissionPkey = 'group_permission_pkey'
}

/** input type for inserting data into table "users.group_permission" */
export type Users_Group_Permission_Insert_Input = {
  group?: Users_Group_Obj_Rel_Insert_Input | null | undefined;
  group_id?: any;
  id?: any;
  permission?: Users_Permission_Obj_Rel_Insert_Input | null | undefined;
  permission_id?: any;
};

/** order by max() on columns of table "users.group_permission" */
export type Users_Group_Permission_Max_Order_By = {
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  permission_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "users.group_permission" */
export type Users_Group_Permission_Min_Order_By = {
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  permission_id?: Order_By | null | undefined;
};

/** on_conflict condition type for table "users.group_permission" */
export type Users_Group_Permission_On_Conflict = {
  constraint: Users_Group_Permission_Constraint;
  update_columns?: Array<Users_Group_Permission_Update_Column>;
  where?: Users_Group_Permission_Bool_Exp | null | undefined;
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

/** update columns of table "users.group_permission" */
export enum Users_Group_Permission_Update_Column {
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  PermissionId = 'permission_id'
}

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

export type Users_Identity_Aggregate_Bool_Exp = {
  count?: Users_Identity_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Identity_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Identity_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Identity_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "users.identity" */
export type Users_Identity_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Users_Identity_Max_Order_By | null | undefined;
  min?: Users_Identity_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "users.identity" */
export type Users_Identity_Arr_Rel_Insert_Input = {
  data: Array<Users_Identity_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_Identity_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "users.identity". All fields are combined with a logical 'AND'. */
export type Users_Identity_Bool_Exp = {
  _and?: Array<Users_Identity_Bool_Exp> | null | undefined;
  _not?: Users_Identity_Bool_Exp | null | undefined;
  _or?: Array<Users_Identity_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  identity_id?: String_Comparison_Exp | null | undefined;
  identity_provider_name?: String_Comparison_Exp | null | undefined;
  profile?: Users_Profile_Bool_Exp | null | undefined;
  profile_id?: Uuid_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.identity" */
export enum Users_Identity_Constraint {
  /** unique or primary key constraint on columns "id" */
  IdentitiesPkey = 'identities_pkey',
  /** unique or primary key constraint on columns "profile_id", "identity_provider_name" */
  IdentitiesProfileIdIdentityProviderIdKey = 'identities_profile_id_identity_provider_id_key'
}

/** input type for inserting data into table "users.identity" */
export type Users_Identity_Insert_Input = {
  created_at?: any;
  id?: any;
  identity_id?: string | null | undefined;
  identity_provider_name?: string | null | undefined;
  profile?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  profile_id?: any;
  updated_at?: any;
};

/** order by max() on columns of table "users.identity" */
export type Users_Identity_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  identity_id?: Order_By | null | undefined;
  identity_provider_name?: Order_By | null | undefined;
  profile_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "users.identity" */
export type Users_Identity_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  identity_id?: Order_By | null | undefined;
  identity_provider_name?: Order_By | null | undefined;
  profile_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "users.identity" */
export type Users_Identity_On_Conflict = {
  constraint: Users_Identity_Constraint;
  update_columns?: Array<Users_Identity_Update_Column>;
  where?: Users_Identity_Bool_Exp | null | undefined;
};

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

/** Boolean expression to filter rows from the table "users.permission". All fields are combined with a logical 'AND'. */
export type Users_Permission_Bool_Exp = {
  _and?: Array<Users_Permission_Bool_Exp> | null | undefined;
  _not?: Users_Permission_Bool_Exp | null | undefined;
  _or?: Array<Users_Permission_Bool_Exp> | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  groups?: Users_Group_Permission_Bool_Exp | null | undefined;
  groups_aggregate?: Users_Group_Permission_Aggregate_Bool_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  label?: String_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.permission" */
export enum Users_Permission_Constraint {
  /** unique or primary key constraint on columns "name" */
  PermissionNameKey = 'permission_name_key',
  /** unique or primary key constraint on columns "id" */
  PermissionPkey = 'permission_pkey'
}

/** input type for inserting data into table "users.permission" */
export type Users_Permission_Insert_Input = {
  created_at?: any;
  description?: string | null | undefined;
  groups?: Users_Group_Permission_Arr_Rel_Insert_Input | null | undefined;
  id?: any;
  label?: string | null | undefined;
  name?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "users.permission" */
export type Users_Permission_Obj_Rel_Insert_Input = {
  data: Users_Permission_Insert_Input;
  /** upsert condition */
  on_conflict?: Users_Permission_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "users.permission" */
export type Users_Permission_On_Conflict = {
  constraint: Users_Permission_Constraint;
  update_columns?: Array<Users_Permission_Update_Column>;
  where?: Users_Permission_Bool_Exp | null | undefined;
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

export type Users_Profile_Aggregate_Bool_Exp = {
  bool_and?: Users_Profile_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Users_Profile_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Users_Profile_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Profile_Aggregate_Bool_Exp_Bool_And = {
  arguments: Users_Profile_Select_Column_Users_Profile_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Users_Profile_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Profile_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Users_Profile_Select_Column_Users_Profile_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Users_Profile_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Profile_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Profile_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Profile_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "users.profile" */
export type Users_Profile_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Users_Profile_Max_Order_By | null | undefined;
  min?: Users_Profile_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "users.profile" */
export type Users_Profile_Arr_Rel_Insert_Input = {
  data: Array<Users_Profile_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_Profile_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "users.profile". All fields are combined with a logical 'AND'. */
export type Users_Profile_Bool_Exp = {
  _and?: Array<Users_Profile_Bool_Exp> | null | undefined;
  _not?: Users_Profile_Bool_Exp | null | undefined;
  _or?: Array<Users_Profile_Bool_Exp> | null | undefined;
  accepted_tos_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  first_name?: String_Comparison_Exp | null | undefined;
  folders?: Users_Folder_Bool_Exp | null | undefined;
  folders_aggregate?: Users_Folder_Aggregate_Bool_Exp | null | undefined;
  full_name?: String_Comparison_Exp | null | undefined;
  full_name_reversed?: String_Comparison_Exp | null | undefined;
  group?: Users_Group_Bool_Exp | null | undefined;
  group_id?: Uuid_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  identities?: Users_Identity_Bool_Exp | null | undefined;
  identities_aggregate?: Users_Identity_Aggregate_Bool_Exp | null | undefined;
  is_evaluator?: Boolean_Comparison_Exp | null | undefined;
  is_key_user?: Boolean_Comparison_Exp | null | undefined;
  language?: Lookup_Languages_Enum_Comparison_Exp | null | undefined;
  last_access_at?: Timestamptz_Comparison_Exp | null | undefined;
  last_name?: String_Comparison_Exp | null | undefined;
  mail?: String_Comparison_Exp | null | undefined;
  notes?: Maintainer_Visitor_Space_Request_Note_Bool_Exp | null | undefined;
  notes_aggregate?: Maintainer_Visitor_Space_Request_Note_Aggregate_Bool_Exp | null | undefined;
  notifications?: App_Notification_Bool_Exp | null | undefined;
  notifications_aggregate?: App_Notification_Aggregate_Bool_Exp | null | undefined;
  organisation?: Graph_Organization_Bool_Exp | null | undefined;
  organisation_schema_identifier?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  visitor_space?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
  visitor_space_requests?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  visitor_space_requests_aggregate?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.profile" */
export enum Users_Profile_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProfilesPkey = 'profiles_pkey'
}

/** input type for inserting data into table "users.profile" */
export type Users_Profile_Insert_Input = {
  accepted_tos_at?: any;
  created_at?: any;
  first_name?: string | null | undefined;
  folders?: Users_Folder_Arr_Rel_Insert_Input | null | undefined;
  group?: Users_Group_Obj_Rel_Insert_Input | null | undefined;
  group_id?: any;
  id?: any;
  identities?: Users_Identity_Arr_Rel_Insert_Input | null | undefined;
  is_evaluator?: boolean | null | undefined;
  is_key_user?: boolean | null | undefined;
  language?: Lookup_Languages_Enum | null | undefined;
  last_access_at?: any;
  last_name?: string | null | undefined;
  mail?: string | null | undefined;
  notes?: Maintainer_Visitor_Space_Request_Note_Arr_Rel_Insert_Input | null | undefined;
  notifications?: App_Notification_Arr_Rel_Insert_Input | null | undefined;
  organisation?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  organisation_schema_identifier?: string | null | undefined;
  updated_at?: any;
  visitor_space?: Maintainer_Visitor_Space_Obj_Rel_Insert_Input | null | undefined;
  visitor_space_requests?: Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input | null | undefined;
};

/** order by max() on columns of table "users.profile" */
export type Users_Profile_Max_Order_By = {
  accepted_tos_at?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  first_name?: Order_By | null | undefined;
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  last_access_at?: Order_By | null | undefined;
  last_name?: Order_By | null | undefined;
  mail?: Order_By | null | undefined;
  organisation_schema_identifier?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "users.profile" */
export type Users_Profile_Min_Order_By = {
  accepted_tos_at?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  first_name?: Order_By | null | undefined;
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  last_access_at?: Order_By | null | undefined;
  last_name?: Order_By | null | undefined;
  mail?: Order_By | null | undefined;
  organisation_schema_identifier?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** input type for inserting object relation for remote table "users.profile" */
export type Users_Profile_Obj_Rel_Insert_Input = {
  data: Users_Profile_Insert_Input;
  /** upsert condition */
  on_conflict?: Users_Profile_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "users.profile" */
export type Users_Profile_On_Conflict = {
  constraint: Users_Profile_Constraint;
  update_columns?: Array<Users_Profile_Update_Column>;
  where?: Users_Profile_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "users.profile". */
export type Users_Profile_Order_By = {
  accepted_tos_at?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  first_name?: Order_By | null | undefined;
  folders_aggregate?: Users_Folder_Aggregate_Order_By | null | undefined;
  full_name?: Order_By | null | undefined;
  full_name_reversed?: Order_By | null | undefined;
  group?: Users_Group_Order_By | null | undefined;
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  identities_aggregate?: Users_Identity_Aggregate_Order_By | null | undefined;
  is_evaluator?: Order_By | null | undefined;
  is_key_user?: Order_By | null | undefined;
  language?: Order_By | null | undefined;
  last_access_at?: Order_By | null | undefined;
  last_name?: Order_By | null | undefined;
  mail?: Order_By | null | undefined;
  notes_aggregate?: Maintainer_Visitor_Space_Request_Note_Aggregate_Order_By | null | undefined;
  notifications_aggregate?: App_Notification_Aggregate_Order_By | null | undefined;
  organisation?: Graph_Organization_Order_By | null | undefined;
  organisation_schema_identifier?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  visitor_space?: Maintainer_Visitor_Space_Order_By | null | undefined;
  visitor_space_requests_aggregate?: Maintainer_Visitor_Space_Request_Aggregate_Order_By | null | undefined;
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
  IsEvaluator = 'is_evaluator',
  /** column name */
  IsKeyUser = 'is_key_user',
  /** column name */
  Language = 'language',
  /** column name */
  LastAccessAt = 'last_access_at',
  /** column name */
  LastName = 'last_name',
  /** column name */
  Mail = 'mail',
  /** column name */
  OrganisationSchemaIdentifier = 'organisation_schema_identifier',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "users_profile_aggregate_bool_exp_bool_and_arguments_columns" columns of table "users.profile" */
export enum Users_Profile_Select_Column_Users_Profile_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsEvaluator = 'is_evaluator',
  /** column name */
  IsKeyUser = 'is_key_user'
}

/** select "users_profile_aggregate_bool_exp_bool_or_arguments_columns" columns of table "users.profile" */
export enum Users_Profile_Select_Column_Users_Profile_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsEvaluator = 'is_evaluator',
  /** column name */
  IsKeyUser = 'is_key_user'
}

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
  IsEvaluator = 'is_evaluator',
  /** column name */
  IsKeyUser = 'is_key_user',
  /** column name */
  Language = 'language',
  /** column name */
  LastAccessAt = 'last_access_at',
  /** column name */
  LastName = 'last_name',
  /** column name */
  Mail = 'mail',
  /** column name */
  OrganisationSchemaIdentifier = 'organisation_schema_identifier',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export type DeleteContentAssetMutationVariables = Exact<{
  url: string;
}>;


export type DeleteContentAssetMutation = { delete_app_content_assets: { affected_rows: number } | null };

export type GetContentAssetQueryVariables = Exact<{
  path: string;
}>;


export type GetContentAssetQuery = { app_content_assets: Array<{ path: string, id: any, content_asset_type_id: string, created_at: any, description: string | null, label: string | null, owner_id: string | null, updated_at: any }> };

export type GetContentAssetOwnerIdQueryVariables = Exact<{
  url: string;
}>;


export type GetContentAssetOwnerIdQuery = { app_content_assets: Array<{ owner_id: string | null, content_asset_type_id: string }> };

export type InsertContentAssetMutationVariables = Exact<{
  asset: App_Content_Assets_Insert_Input;
}>;


export type InsertContentAssetMutation = { insert_app_content_assets: { affected_rows: number } | null };

export type UpdateContentAssetMutationVariables = Exact<{
  path: string;
  asset: App_Content_Assets_Set_Input;
}>;


export type UpdateContentAssetMutation = { update_app_content_assets: { affected_rows: number } | null };

export type DeleteContentPageLabelByIdMutationVariables = Exact<{
  id: any;
}>;


export type DeleteContentPageLabelByIdMutation = { delete_app_content_label: { affected_rows: number } | null };

export type GetContentPageLabelByIdQueryVariables = Exact<{
  id: any;
}>;


export type GetContentPageLabelByIdQuery = { app_content_label: Array<{ label: string, id: any, content_type: Lookup_App_Content_Type_Enum, link_to: any, language: Lookup_Languages_Enum, color: string, created_at: any, updated_at: any }> };

export type GetContentPageLabelsQueryVariables = Exact<{
  where: App_Content_Label_Bool_Exp;
  offset: number;
  limit: number;
  orderBy: Array<App_Content_Label_Order_By> | App_Content_Label_Order_By;
}>;


export type GetContentPageLabelsQuery = { app_content_label: Array<{ label: string, content_type: Lookup_App_Content_Type_Enum, link_to: any, language: Lookup_Languages_Enum, color: string, created_at: any, updated_at: any, id: any }>, app_content_label_aggregate: { aggregate: { count: number } | null } };

export type GetContentPageLabelsByTypeAndIdsQueryVariables = Exact<{
  contentType: Lookup_App_Content_Type_Enum;
  labelIds: Array<any> | any;
}>;


export type GetContentPageLabelsByTypeAndIdsQuery = { app_content_label: Array<{ label: string, id: any }> };

export type GetContentPageLabelsByTypeAndLabelsQueryVariables = Exact<{
  contentType: Lookup_App_Content_Type_Enum;
  labels: Array<string> | string;
}>;


export type GetContentPageLabelsByTypeAndLabelsQuery = { app_content_label: Array<{ label: string, id: any }> };

export type InsertContentPageLabelMutationVariables = Exact<{
  contentPageLabels: Array<App_Content_Label_Insert_Input> | App_Content_Label_Insert_Input;
}>;


export type InsertContentPageLabelMutation = { insert_app_content_label: { returning: Array<{ label: string, id: any, content_type: Lookup_App_Content_Type_Enum, language: Lookup_Languages_Enum, link_to: any, color: string, created_at: any, updated_at: any }> } | null };

export type UpdateContentPageLabelMutationVariables = Exact<{
  contentPageLabel: App_Content_Label_Set_Input;
  contentPageLabelId: any;
}>;


export type UpdateContentPageLabelMutation = { update_app_content_label: { returning: Array<{ label: string, id: any, content_type: Lookup_App_Content_Type_Enum, link_to: any, language: Lookup_Languages_Enum, color: string, created_at: any, updated_at: any }> } | null };

export type DeleteContentBlockMutationVariables = Exact<{
  id: any;
}>;


export type DeleteContentBlockMutation = { delete_app_content_block: { affected_rows: number } | null };

export type DeleteContentLabelLinksMutationVariables = Exact<{
  contentPageId: any;
  labelIds: Array<any> | any;
}>;


export type DeleteContentLabelLinksMutation = { delete_app_content_page_content_label: { affected_rows: number } | null };

export type GetContentByIdQueryVariables = Exact<{
  id: any;
}>;


export type GetContentByIdQuery = { app_content_page: Array<{ content_type: string, content_width: string, created_at: any, depublish_at: any, depublished_at: any, description: string | null, seo_description: string | null, meta_description: string | null, id: any, thumbnail_path: string | null, seo_image_path: string | null, is_protected: boolean, is_public: boolean | null, path: string | null, user_profile_id: any, publish_at: any, published_at: any, published_at_display: any, title: string, language: Lookup_Languages_Enum, nl_parent_page_id: any, updated_at: any, user_group_ids: any, profile: { id: any, full_name: string | null, organisation: { id: string, org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null } | null, group: { id: any, name: string, label: string } | null } | null, translated_content_pages: Array<{ title: string, language: Lookup_Languages_Enum, path: string | null, id: any, is_public: boolean | null }>, content_content_labels: Array<{ content_label: { label: string, id: any, link_to: any, color: string } }>, content_blocks: Array<{ id: any, content_id: any, content_block_type: Lookup_App_Content_Block_Type_Enum, position: number, variables: any, created_at: any, updated_at: any }> }> };

export type GetContentByIdsQueryVariables = Exact<{
  ids: Array<any> | any;
}>;


export type GetContentByIdsQuery = { app_content_page: Array<{ content_type: string, content_width: string, created_at: any, depublish_at: any, depublished_at: any, description: string | null, seo_description: string | null, meta_description: string | null, id: any, thumbnail_path: string | null, seo_image_path: string | null, is_protected: boolean, is_public: boolean | null, path: string | null, publish_at: any, published_at: any, published_at_display: any, title: string, language: Lookup_Languages_Enum, nl_parent_page_id: any, updated_at: any, user_group_ids: any, user_profile_id: any, translated_content_pages: Array<{ title: string, language: Lookup_Languages_Enum, path: string | null, id: any, is_public: boolean | null }>, owner_profile: { id: any, full_name: string | null, mail: string | null, organisation: { id: string, org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null } | null, group: { label: string, id: any } | null } | null, content_content_labels: Array<{ content_label: { label: string, id: any, link_to: any, color: string } }>, content_blocks: Array<{ id: any, content_id: any, content_block_type: Lookup_App_Content_Block_Type_Enum, position: number, variables: any, created_at: any, updated_at: any }> }> };

export type GetContentLabelsByContentTypeQueryVariables = Exact<{
  contentType: Lookup_App_Content_Type_Enum;
}>;


export type GetContentLabelsByContentTypeQuery = { app_content_label: Array<{ id: any, label: string, content_type: Lookup_App_Content_Type_Enum, link_to: any }> };

export type GetContentPageBlockByIdQueryVariables = Exact<{
  id: any;
}>;


export type GetContentPageBlockByIdQuery = { app_content_block: Array<{ id: any, content_id: any, content_block_type: Lookup_App_Content_Block_Type_Enum, position: number, variables: any, created_at: any, updated_at: any }> };

export type GetContentPageByPathQueryVariables = Exact<{
  path: string;
  language: Lookup_Languages_Enum;
}>;


export type GetContentPageByPathQuery = { app_content_page: Array<{ content_type: string, content_width: string, created_at: any, depublish_at: any, depublished_at: any, description: string | null, seo_description: string | null, meta_description: string | null, id: any, thumbnail_path: string | null, seo_image_path: string | null, is_protected: boolean, is_public: boolean | null, path: string | null, user_profile_id: any, publish_at: any, published_at: any, published_at_display: any, title: string, language: Lookup_Languages_Enum, nl_parent_page_id: any, updated_at: any, user_group_ids: any, profile: { id: any, full_name: string | null, organisation: { id: string, org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null } | null, group: { id: any, name: string, label: string } | null } | null, translated_content_pages: Array<{ title: string, language: Lookup_Languages_Enum, path: string | null, id: any, is_public: boolean | null }>, content_content_labels: Array<{ content_label: { id: any, label: string, link_to: any, color: string } }>, content_blocks: Array<{ id: any, content_id: any, content_block_type: Lookup_App_Content_Block_Type_Enum, position: number, variables: any, created_at: any, updated_at: any }> }> };

export type GetContentPagesQueryVariables = Exact<{
  where?: App_Content_Page_Bool_Exp | null | undefined;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  orderBy?: Array<App_Content_Page_Order_By> | App_Content_Page_Order_By | null | undefined;
  labelIds?: Array<any> | any | null | undefined;
  orUserGroupIds?: Array<App_Content_Page_Content_Label_Bool_Exp> | App_Content_Page_Content_Label_Bool_Exp | null | undefined;
}>;


export type GetContentPagesQuery = { app_content_page: Array<{ id: any, content_type: string, created_at: any, depublish_at: any, depublished_at: any, description: string | null, seo_description: string | null, meta_description: string | null, thumbnail_path: string | null, seo_image_path: string | null, is_protected: boolean, is_public: boolean | null, path: string | null, user_profile_id: any, publish_at: any, published_at: any, published_at_display: any, title: string, language: Lookup_Languages_Enum, nl_parent_page_id: any, updated_at: any, user_group_ids: any, content_width: string, owner_profile: { first_name: string | null, last_name: string | null, group: { id: any, label: string } | null } | null, translated_content_pages: Array<{ title: string, language: Lookup_Languages_Enum, path: string | null, id: any, is_public: boolean | null }>, content_content_labels: Array<{ content_label: { id: any, label: string, link_to: any, color: string } }> }>, app_content_page_aggregate: { aggregate: { count: number } | null }, app_content_label: Array<{ id: any, content_content_labels_aggregate: { aggregate: { count: number } | null } }> };

export type GetContentPagesByIdsQueryVariables = Exact<{
  ids?: Array<any> | any | null | undefined;
}>;


export type GetContentPagesByIdsQuery = { app_content_page: Array<{ user_profile_id: any }> };

export type GetContentPagesToPublishQueryVariables = Exact<{
  now?: any;
  publishedAt?: any;
}>;


export type GetContentPagesToPublishQuery = { app_content_page: Array<{ id: any, publish_at: any, depublish_at: any, depublished_at: any, published_at: any, published_at_display: any }> };

export type GetContentPagesWithBlocksQueryVariables = Exact<{
  where?: App_Content_Page_Bool_Exp | null | undefined;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  orderBy?: Array<App_Content_Page_Order_By> | App_Content_Page_Order_By | null | undefined;
  labelIds?: Array<any> | any | null | undefined;
  orUserGroupIds?: Array<App_Content_Page_Content_Label_Bool_Exp> | App_Content_Page_Content_Label_Bool_Exp | null | undefined;
}>;


export type GetContentPagesWithBlocksQuery = { app_content_page: Array<{ content_type: string, created_at: any, depublish_at: any, depublished_at: any, description: string | null, seo_description: string | null, meta_description: string | null, id: any, thumbnail_path: string | null, seo_image_path: string | null, is_protected: boolean, is_public: boolean | null, path: string | null, user_profile_id: any, publish_at: any, published_at: any, published_at_display: any, title: string, language: Lookup_Languages_Enum, nl_parent_page_id: any, updated_at: any, content_width: string, user_group_ids: any, owner_profile: { first_name: string | null, last_name: string | null, group: { id: any, label: string } | null } | null, translated_content_pages: Array<{ title: string, language: Lookup_Languages_Enum, path: string | null, id: any, is_public: boolean | null }>, content_content_labels: Array<{ content_label: { id: any, label: string, link_to: any, color: string } }>, content_blocks: Array<{ id: any, content_id: any, content_block_type: Lookup_App_Content_Block_Type_Enum, position: number, variables: any, created_at: any, updated_at: any }> }>, app_content_page_aggregate: { aggregate: { count: number } | null }, app_content_label: Array<{ id: any, content_content_labels_aggregate: { aggregate: { count: number } | null } }> };

export type GetContentTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetContentTypesQuery = { lookup_app_content_type: Array<{ value: string, comment: string | null }> };

export type GetNlParentContentPagesQueryVariables = Exact<{
  limit: number;
}>;


export type GetNlParentContentPagesQuery = { app_content_page: Array<{ id: any, title: string, path: string | null }> };

export type GetNlParentContentPagesByTitleQueryVariables = Exact<{
  limit: number;
  title: string;
}>;


export type GetNlParentContentPagesByTitleQuery = { app_content_page: Array<{ id: any, title: string, path: string | null }> };

export type GetPermissionsFromContentPageByPathQueryVariables = Exact<{
  path: string;
}>;


export type GetPermissionsFromContentPageByPathQuery = { app_content_page: Array<{ user_group_ids: any }> };

export type GetPublicContentPagesQueryVariables = Exact<{
  where?: App_Content_Page_Bool_Exp | null | undefined;
}>;


export type GetPublicContentPagesQuery = { app_content_page: Array<{ path: string | null, updated_at: any }> };

export type GetPublicContentPagesByTitleQueryVariables = Exact<{
  limit?: number | null | undefined;
  orderBy?: Array<App_Content_Page_Order_By> | App_Content_Page_Order_By | null | undefined;
  where?: App_Content_Page_Bool_Exp | null | undefined;
}>;


export type GetPublicContentPagesByTitleQuery = { app_content_page: Array<{ path: string | null, title: string }> };

export type GetPublicProjectContentPagesQueryVariables = Exact<{
  limit?: number | null | undefined;
  orderBy?: Array<App_Content_Page_Order_By> | App_Content_Page_Order_By | null | undefined;
}>;


export type GetPublicProjectContentPagesQuery = { app_content_page: Array<{ path: string | null, title: string }> };

export type GetPublicProjectContentPagesByTitleQueryVariables = Exact<{
  title: string;
  limit?: number | null | undefined;
  orderBy?: Array<App_Content_Page_Order_By> | App_Content_Page_Order_By | null | undefined;
}>;


export type GetPublicProjectContentPagesByTitleQuery = { app_content_page: Array<{ path: string | null, title: string }> };

export type InsertContentMutationVariables = Exact<{
  contentPage: App_Content_Page_Insert_Input;
}>;


export type InsertContentMutation = { insert_app_content_page: { returning: Array<{ id: any }> } | null };

export type InsertContentBlocksMutationVariables = Exact<{
  contentBlocks: Array<App_Content_Block_Insert_Input> | App_Content_Block_Insert_Input;
}>;


export type InsertContentBlocksMutation = { insert_app_content_block: { returning: Array<{ id: any }> } | null };

export type InsertContentLabelLinksMutationVariables = Exact<{
  objects: Array<App_Content_Page_Content_Label_Insert_Input> | App_Content_Page_Content_Label_Insert_Input;
}>;


export type InsertContentLabelLinksMutation = { insert_app_content_page_content_label: { affected_rows: number } | null };

export type PublishContentPageMutationVariables = Exact<{
  id?: any;
  publishedAt?: any;
}>;


export type PublishContentPageMutation = { update_app_content_page: { affected_rows: number } | null };

export type SoftDeleteContentMutationVariables = Exact<{
  id: any;
  path?: string | null | undefined;
}>;


export type SoftDeleteContentMutation = { update_app_content_page: { affected_rows: number } | null };

export type UnpublishContentPageMutationVariables = Exact<{
  now?: any;
}>;


export type UnpublishContentPageMutation = { update_app_content_page: { affected_rows: number, returning: Array<{ id: any }> } | null };

export type UpdateContentBlockMutationVariables = Exact<{
  id: any;
  contentBlock: App_Content_Block_Set_Input;
}>;


export type UpdateContentBlockMutation = { update_app_content_block: { affected_rows: number } | null };

export type UpdateContentByIdMutationVariables = Exact<{
  id: any;
  contentPage: App_Content_Page_Set_Input;
}>;


export type UpdateContentByIdMutation = { update_app_content_page: { affected_rows: number } | null };

export type UpdateContentPageWithBlocksAndLabelsMutationVariables = Exact<{
  id: any;
  contentPage: App_Content_Page_Set_Input;
  contentBlocks: Array<App_Content_Block_Insert_Input> | App_Content_Block_Insert_Input;
  contentLabelLinks: Array<App_Content_Page_Content_Label_Insert_Input> | App_Content_Page_Content_Label_Insert_Input;
}>;


export type UpdateContentPageWithBlocksAndLabelsMutation = { update_app_content_page: { affected_rows: number } | null, delete_app_content_block: { affected_rows: number } | null, insert_app_content_block: { affected_rows: number } | null, delete_app_content_page_content_label: { affected_rows: number } | null, insert_app_content_page_content_label: { affected_rows: number } | null };

export type DeleteMaintenanceAlertMutationVariables = Exact<{
  maintenanceAlertId?: any;
}>;


export type DeleteMaintenanceAlertMutation = { delete_app_maintenance_alerts: { affected_rows: number } | null };

export type FindMaintenanceAlertByIdQueryVariables = Exact<{
  id: any;
}>;


export type FindMaintenanceAlertByIdQuery = { app_maintenance_alerts: Array<{ id: any, title: string, message: string, type: string | null, from_date: any, until_date: any, user_groups: any, language: Lookup_Languages_Enum }> };

export type FindMaintenanceAlertsQueryVariables = Exact<{
  where?: App_Maintenance_Alerts_Bool_Exp | null | undefined;
  offset: number;
  limit: number;
  orderBy?: App_Maintenance_Alerts_Order_By;
}>;


export type FindMaintenanceAlertsQuery = { app_maintenance_alerts: Array<{ id: any, title: string, message: string, type: string | null, from_date: any, until_date: any, user_groups: any, language: Lookup_Languages_Enum }>, app_maintenance_alerts_aggregate: { aggregate: { count: number } | null } };

export type InsertMaintenanceAlertMutationVariables = Exact<{
  newMaintenanceAlert: App_Maintenance_Alerts_Insert_Input;
}>;


export type InsertMaintenanceAlertMutation = { insert_app_maintenance_alerts_one: { id: any, title: string, message: string, type: string | null, user_groups: any, from_date: any, until_date: any, language: Lookup_Languages_Enum } | null };

export type UpdateMaintenanceAlertMutationVariables = Exact<{
  maintenanceAlertId?: any;
  updateMaintenanceAlert?: App_Maintenance_Alerts_Set_Input | null | undefined;
}>;


export type UpdateMaintenanceAlertMutation = { update_app_maintenance_alerts: { returning: Array<{ id: any, title: string, message: string, type: string | null, user_groups: any, from_date: any, until_date: any, language: Lookup_Languages_Enum }> } | null };

export type DeleteNavigationItemMutationVariables = Exact<{
  id: any;
}>;


export type DeleteNavigationItemMutation = { delete_app_navigation: { affected_rows: number } | null };

export type GetAllNavigationItemsQueryVariables = Exact<{
  languages: Array<Lookup_Languages_Enum> | Lookup_Languages_Enum;
}>;


export type GetAllNavigationItemsQuery = { app_navigation: Array<{ id: any, created_at: any, description: string | null, user_group_ids: any, icon_name: string, label: string | null, link_target: string | null, placement: string, position: number, updated_at: any, content_type: string, content_path: string, language: Lookup_Languages_Enum, tooltip: string | null }> };

export type GetNavigationBarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNavigationBarsQuery = { app_navigation: Array<{ id: any, description: string | null, placement: string, tooltip: string | null, user_group_ids: any }> };

export type GetNavigationItemByIdQueryVariables = Exact<{
  id: any;
}>;


export type GetNavigationItemByIdQuery = { app_navigation: Array<{ id: any, created_at: any, description: string | null, user_group_ids: any, icon_name: string, label: string | null, link_target: string | null, placement: string, position: number, updated_at: any, content_type: string, content_path: string, language: Lookup_Languages_Enum, tooltip: string | null }> };

export type GetNavigationItemsByPlacementQueryVariables = Exact<{
  placement: string;
  orderBy: Array<App_Navigation_Order_By> | App_Navigation_Order_By;
}>;


export type GetNavigationItemsByPlacementQuery = { app_navigation: Array<{ id: any, created_at: any, description: string | null, user_group_ids: any, icon_name: string, label: string | null, link_target: string | null, placement: string, position: number, updated_at: any, content_type: string, content_path: string, language: Lookup_Languages_Enum, tooltip: string | null }> };

export type GetNavigationItemsByPlacementAndLanguageQueryVariables = Exact<{
  placement: string;
  languages: Array<Lookup_Languages_Enum> | Lookup_Languages_Enum;
  orderBy: Array<App_Navigation_Order_By> | App_Navigation_Order_By;
}>;


export type GetNavigationItemsByPlacementAndLanguageQuery = { app_navigation: Array<{ id: any, created_at: any, description: string | null, user_group_ids: any, icon_name: string, label: string | null, link_target: string | null, placement: string, position: number, updated_at: any, content_type: string, content_path: string, language: Lookup_Languages_Enum, tooltip: string | null }> };

export type InsertNavigationItemMutationVariables = Exact<{
  navigationItem: App_Navigation_Insert_Input;
}>;


export type InsertNavigationItemMutation = { insert_app_navigation_one: { id: any, created_at: any, description: string | null, user_group_ids: any, icon_name: string, label: string | null, link_target: string | null, placement: string, position: number, updated_at: any, content_type: string, content_path: string, language: Lookup_Languages_Enum, tooltip: string | null } | null };

export type UpdateNavigationItemByIdMutationVariables = Exact<{
  id: any;
  navigationItem: App_Navigation_Set_Input;
}>;


export type UpdateNavigationItemByIdMutation = { update_app_navigation_by_pk: { id: any, created_at: any, description: string | null, user_group_ids: any, icon_name: string, label: string | null, link_target: string | null, placement: string, position: number, updated_at: any, content_type: string, content_path: string, language: Lookup_Languages_Enum, tooltip: string | null } | null };

export type GetOrganisationsQueryVariables = Exact<{
  ids?: Array<string> | string | null | undefined;
}>;


export type GetOrganisationsQuery = { graph_organization: Array<{ id: string, org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null }> };

export type GetOrganisationsForMaintainerGridQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganisationsForMaintainerGridQuery = { graph_organization: Array<{ id: string, org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, foaf_homepage: string | null }> };

export type GetOrganisationsWithUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganisationsWithUsersQuery = { graph_organization: Array<{ id: string, org_identifier: string, skos_pref_label: string | null }> };

export type GetPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPermissionsQuery = { users_permission: Array<{ id: any, label: string, name: string, description: string | null }> };

export type GetFileByByIdQueryVariables = Exact<{
  fileId?: string | null | undefined;
}>;


export type GetFileByByIdQuery = { graph_file: Array<{ premis_stored_at: string | null, isRootOf: Array<{ includes: Array<{ representation: { represents: { dctermsFormat: Array<{ dcterms_format: string }> } | null } }> }>, hasMediaFragment: Array<{ schema_start_time: any, schema_end_time: any }> }> };

export type GetThumbnailUrlByIdQueryVariables = Exact<{
  id: string;
}>;


export type GetThumbnailUrlByIdQuery = { graph__intellectual_entity: Array<{ schema_identifier: string | null, schema_thumbnail_url: any }> };

export type GetSiteVariableByNameQueryVariables = Exact<{
  name: string;
}>;


export type GetSiteVariableByNameQuery = { app_config_by_pk: { name: string, value: any } | null };

export type UpdateSiteVariableByNameMutationVariables = Exact<{
  name: string;
  data: App_Config_Set_Input;
}>;


export type UpdateSiteVariableByNameMutation = { update_app_config: { affected_rows: number } | null };

export type GetFirstObjectIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFirstObjectIdQuery = { graph__intellectual_entity: Array<{ schema_identifier: string | null }> };

export type GetAllLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLanguagesQuery = { lookup_languages: Array<{ value: string, comment: string }> };

export type GetTranslationByComponentLocationKeyQueryVariables = Exact<{
  component: string;
  location: string;
  key: string;
}>;


export type GetTranslationByComponentLocationKeyQuery = { app_translations: Array<{ component: string, location: string, key: string, language: Lookup_Languages_Enum, value: string, value_type: string }> };

export type GetTranslationsByComponentsQueryVariables = Exact<{
  components: Array<string> | string;
}>;


export type GetTranslationsByComponentsQuery = { app_translations: Array<{ component: string, key: string, language: Lookup_Languages_Enum, location: string, value: string, value_type: string }> };

export type GetTranslationsByComponentsAndLanguagesQueryVariables = Exact<{
  components: Array<string> | string;
  languageCodes: Array<Lookup_Languages_Enum> | Lookup_Languages_Enum;
}>;


export type GetTranslationsByComponentsAndLanguagesQuery = { app_translations: Array<{ component: string, key: string, language: Lookup_Languages_Enum, location: string, value: string, value_type: string }> };

export type InsertTranslationMutationVariables = Exact<{
  component: string;
  location: string;
  key: string;
  languageCode: Lookup_Languages_Enum;
  value: string;
  value_type: string;
}>;


export type InsertTranslationMutation = { insert_app_translations: { affected_rows: number } | null };

export type UpdateTranslationMutationVariables = Exact<{
  value: string;
  component: string;
  location: string;
  key: string;
  languageCode: Lookup_Languages_Enum;
}>;


export type UpdateTranslationMutation = { update_app_translations: { affected_rows: number } | null };

export type GetUserGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserGroupsQuery = { users_group: Array<{ id: any, label: string, name: string }> };

export type GetUserGroupsPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserGroupsPermissionsQuery = { users_group: Array<{ id: any, label: string, name: string, permissions: Array<{ permission: { id: any, label: string, name: string, description: string | null } }> }> };

export type UpdateUserGroupsPermissionsMutationVariables = Exact<{
  insertions: Array<Users_Group_Permission_Insert_Input> | Users_Group_Permission_Insert_Input;
  deletions: Users_Group_Permission_Bool_Exp;
}>;


export type UpdateUserGroupsPermissionsMutation = { delete_users_group_permission: { affected_rows: number } | null, insert_users_group_permission: { affected_rows: number } | null };

export type GetIdpsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIdpsQuery = { users_identity_provider: Array<{ name: string }> };

export type GetProfileIdsQueryVariables = Exact<{
  where: Users_Profile_Bool_Exp;
}>;


export type GetProfileIdsQuery = { users_profile: Array<{ id: any }> };

export type GetProfileNamesQueryVariables = Exact<{
  profileIds: Array<any> | any;
}>;


export type GetProfileNamesQuery = { users_profile: Array<{ id: any, full_name: string | null, mail: string | null }>, users_profile_aggregate: { aggregate: { count: number } | null } };

export type GetUsersQueryVariables = Exact<{
  offset: number;
  limit: number;
  orderBy: Array<Users_Profile_Order_By> | Users_Profile_Order_By;
  where: Users_Profile_Bool_Exp;
}>;


export type GetUsersQuery = { users_profile: Array<{ id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, last_access_at: any, language: Lookup_Languages_Enum, is_key_user: boolean, is_evaluator: boolean, group: { label: string, name: string, id: any } | null, identities: Array<{ identity_provider_name: string }>, organisation: { id: string, org_identifier: string, skos_pref_label: string | null, foaf_homepage: string | null, ha_org_has_logo: string | null } | null }>, users_profile_aggregate: { aggregate: { count: number } | null } };

export type SearchProfileNamesQueryVariables = Exact<{
  limit: number;
  where: Users_Profile_Bool_Exp;
}>;


export type SearchProfileNamesQuery = { users_profile: Array<{ id: any, full_name: string | null, mail: string | null }> };


export const DeleteContentAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteContentAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_content_assets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteContentAssetMutation, DeleteContentAssetMutationVariables>;
export const GetContentAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_assets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_asset_type_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"owner_id"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetContentAssetQuery, GetContentAssetQueryVariables>;
export const GetContentAssetOwnerIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentAssetOwnerId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_assets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner_id"}},{"kind":"Field","name":{"kind":"Name","value":"content_asset_type_id"}}]}}]}}]} as unknown as DocumentNode<GetContentAssetOwnerIdQuery, GetContentAssetOwnerIdQueryVariables>;
export const InsertContentAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertContentAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"asset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_assets_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_content_assets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"asset"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<InsertContentAssetMutation, InsertContentAssetMutationVariables>;
export const UpdateContentAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateContentAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"asset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_assets_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_content_assets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"asset"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateContentAssetMutation, UpdateContentAssetMutationVariables>;
export const DeleteContentPageLabelByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteContentPageLabelById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteContentPageLabelByIdMutation, DeleteContentPageLabelByIdMutationVariables>;
export const GetContentPageLabelByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPageLabelById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetContentPageLabelByIdQuery, GetContentPageLabelByIdQueryVariables>;
export const GetContentPageLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPageLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_label_bool_exp"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_label_order_by"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_content_label_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetContentPageLabelsQuery, GetContentPageLabelsQueryVariables>;
export const GetContentPageLabelsByTypeAndIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPageLabelsByTypeAndIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_app_content_type_enum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"content_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetContentPageLabelsByTypeAndIdsQuery, GetContentPageLabelsByTypeAndIdsQueryVariables>;
export const GetContentPageLabelsByTypeAndLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPageLabelsByTypeAndLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_app_content_type_enum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labels"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"label"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labels"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"content_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetContentPageLabelsByTypeAndLabelsQuery, GetContentPageLabelsByTypeAndLabelsQueryVariables>;
export const InsertContentPageLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertContentPageLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentPageLabels"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_label_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentPageLabels"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]} as unknown as DocumentNode<InsertContentPageLabelMutation, InsertContentPageLabelMutationVariables>;
export const UpdateContentPageLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateContentPageLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentPageLabel"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_label_set_input"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentPageLabelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentPageLabelId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentPageLabel"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateContentPageLabelMutation, UpdateContentPageLabelMutationVariables>;
export const DeleteContentBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteContentBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_content_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteContentBlockMutation, DeleteContentBlockMutationVariables>;
export const DeleteContentLabelLinksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteContentLabelLinks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentPageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_content_page_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"label_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"content_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentPageId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteContentLabelLinksMutation, DeleteContentLabelLinksMutationVariables>;
export const GetContentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_width"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublish_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublished_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"seo_description"}},{"kind":"Field","name":{"kind":"Name","value":"meta_description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_path"}},{"kind":"Field","name":{"kind":"Name","value":"seo_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"is_protected"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","alias":{"kind":"Name","value":"profile"},"name":{"kind":"Name","value":"owner_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at_display"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nl_parent_page_id"}},{"kind":"Field","name":{"kind":"Name","value":"translated_content_pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content_blocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"position"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_id"}},{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]} as unknown as DocumentNode<GetContentByIdQuery, GetContentByIdQueryVariables>;
export const GetContentByIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_width"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublish_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublished_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"seo_description"}},{"kind":"Field","name":{"kind":"Name","value":"meta_description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_path"}},{"kind":"Field","name":{"kind":"Name","value":"seo_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"is_protected"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"publish_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at_display"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nl_parent_page_id"}},{"kind":"Field","name":{"kind":"Name","value":"translated_content_pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"owner_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content_blocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"position"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_id"}},{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]} as unknown as DocumentNode<GetContentByIdsQuery, GetContentByIdsQueryVariables>;
export const GetContentLabelsByContentTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentLabelsByContentType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_app_content_type_enum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}}]}}]}}]} as unknown as DocumentNode<GetContentLabelsByContentTypeQuery, GetContentLabelsByContentTypeQueryVariables>;
export const GetContentPageBlockByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPageBlockById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_id"}},{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetContentPageBlockByIdQuery, GetContentPageBlockByIdQueryVariables>;
export const GetContentPageByPathDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPageByPath"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_languages_enum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_width"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublish_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublished_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"seo_description"}},{"kind":"Field","name":{"kind":"Name","value":"meta_description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_path"}},{"kind":"Field","name":{"kind":"Name","value":"seo_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"is_protected"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","alias":{"kind":"Name","value":"profile"},"name":{"kind":"Name","value":"owner_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at_display"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nl_parent_page_id"}},{"kind":"Field","name":{"kind":"Name","value":"translated_content_pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content_blocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"position"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_id"}},{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]} as unknown as DocumentNode<GetContentPageByPathQuery, GetContentPageByPathQueryVariables>;
export const GetContentPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_bool_exp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_order_by"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},"defaultValue":{"kind":"ListValue","values":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orUserGroupIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_content_label_bool_exp"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublish_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublished_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"seo_description"}},{"kind":"Field","name":{"kind":"Name","value":"meta_description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_path"}},{"kind":"Field","name":{"kind":"Name","value":"seo_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"is_protected"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"owner_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at_display"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nl_parent_page_id"}},{"kind":"Field","name":{"kind":"Name","value":"translated_content_pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"content_width"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_content_page_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orUserGroupIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetContentPagesQuery, GetContentPagesQueryVariables>;
export const GetContentPagesByIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPagesByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}}]}}]}}]} as unknown as DocumentNode<GetContentPagesByIdsQuery, GetContentPagesByIdsQueryVariables>;
export const GetContentPagesToPublishDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPagesToPublish"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publishedAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"publish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"depublish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"publish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"depublish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"publish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"published_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"published_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"publish_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublish_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublished_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at_display"}}]}}]}}]} as unknown as DocumentNode<GetContentPagesToPublishQuery, GetContentPagesToPublishQueryVariables>;
export const GetContentPagesWithBlocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPagesWithBlocks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_bool_exp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_order_by"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},"defaultValue":{"kind":"ListValue","values":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orUserGroupIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_content_label_bool_exp"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublish_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublished_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"seo_description"}},{"kind":"Field","name":{"kind":"Name","value":"meta_description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_path"}},{"kind":"Field","name":{"kind":"Name","value":"seo_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"is_protected"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"owner_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at_display"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nl_parent_page_id"}},{"kind":"Field","name":{"kind":"Name","value":"translated_content_pages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"content_width"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content_blocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"position"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_id"}},{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_content_page_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orUserGroupIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetContentPagesWithBlocksQuery, GetContentPagesWithBlocksQueryVariables>;
export const GetContentTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lookup_app_content_type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]}}]} as unknown as DocumentNode<GetContentTypesQuery, GetContentTypesQueryVariables>;
export const GetNlParentContentPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNlParentContentPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"nl"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<GetNlParentContentPagesQuery, GetNlParentContentPagesQueryVariables>;
export const GetNlParentContentPagesByTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNlParentContentPagesByTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"nl"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<GetNlParentContentPagesByTitleQuery, GetNlParentContentPagesByTitleQueryVariables>;
export const GetPermissionsFromContentPageByPathDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionsFromContentPageByPath"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}}]}}]}}]} as unknown as DocumentNode<GetPermissionsFromContentPageByPathQuery, GetPermissionsFromContentPageByPathQueryVariables>;
export const GetPublicContentPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPublicContentPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_bool_exp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetPublicContentPagesQuery, GetPublicContentPagesQueryVariables>;
export const GetPublicContentPagesByTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPublicContentPagesByTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_order_by"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_bool_exp"}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<GetPublicContentPagesByTitleQuery, GetPublicContentPagesByTitleQueryVariables>;
export const GetPublicProjectContentPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPublicProjectContentPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_order_by"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"PROJECT","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_public"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<GetPublicProjectContentPagesQuery, GetPublicProjectContentPagesQueryVariables>;
export const GetPublicProjectContentPagesByTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPublicProjectContentPagesByTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_order_by"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"content_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"PROJECT","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_public"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<GetPublicProjectContentPagesByTitleQuery, GetPublicProjectContentPagesByTitleQueryVariables>;
export const InsertContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentPage"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"contentPage"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<InsertContentMutation, InsertContentMutationVariables>;
export const InsertContentBlocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertContentBlocks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentBlocks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_block_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_content_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentBlocks"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<InsertContentBlocksMutation, InsertContentBlocksMutationVariables>;
export const InsertContentLabelLinksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertContentLabelLinks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objects"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_content_label_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_content_page_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objects"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<InsertContentLabelLinksMutation, InsertContentLabelLinksMutationVariables>;
export const PublishContentPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publishContentPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publishedAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"published_at"},"value":{"kind":"Variable","name":{"kind":"Name","value":"publishedAt"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_public"},"value":{"kind":"BooleanValue","value":true}},{"kind":"ObjectField","name":{"kind":"Name","value":"depublished_at"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<PublishContentPageMutation, PublishContentPageMutationVariables>;
export const SoftDeleteContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"softDeleteContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"BooleanValue","value":true}},{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<SoftDeleteContentMutation, SoftDeleteContentMutationVariables>;
export const UnpublishContentPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unpublishContentPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"depublish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_public"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_public"},"value":{"kind":"BooleanValue","value":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"depublished_at"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"published_at"},"value":{"kind":"NullValue"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}},{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UnpublishContentPageMutation, UnpublishContentPageMutationVariables>;
export const UpdateContentBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateContentBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentBlock"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_block_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_content_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentBlock"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateContentBlockMutation, UpdateContentBlockMutationVariables>;
export const UpdateContentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateContentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentPage"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentPage"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateContentByIdMutation, UpdateContentByIdMutationVariables>;
export const UpdateContentPageWithBlocksAndLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateContentPageWithBlocksAndLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentPage"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_set_input"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentBlocks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_block_insert_input"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentLabelLinks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_content_page_content_label_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_content_page"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentPage"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delete_app_content_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insert_app_content_block"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentBlocks"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delete_app_content_page_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insert_app_content_page_content_label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentLabelLinks"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateContentPageWithBlocksAndLabelsMutation, UpdateContentPageWithBlocksAndLabelsMutationVariables>;
export const DeleteMaintenanceAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMaintenanceAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maintenanceAlertId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_maintenance_alerts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maintenanceAlertId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteMaintenanceAlertMutation, DeleteMaintenanceAlertMutationVariables>;
export const FindMaintenanceAlertByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaintenanceAlertById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_maintenance_alerts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from_date"}},{"kind":"Field","name":{"kind":"Name","value":"until_date"}},{"kind":"Field","name":{"kind":"Name","value":"user_groups"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]} as unknown as DocumentNode<FindMaintenanceAlertByIdQuery, FindMaintenanceAlertByIdQueryVariables>;
export const FindMaintenanceAlertsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaintenanceAlerts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_maintenance_alerts_bool_exp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_maintenance_alerts_order_by"}}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_maintenance_alerts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from_date"}},{"kind":"Field","name":{"kind":"Name","value":"until_date"}},{"kind":"Field","name":{"kind":"Name","value":"user_groups"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_maintenance_alerts_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindMaintenanceAlertsQuery, FindMaintenanceAlertsQueryVariables>;
export const InsertMaintenanceAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertMaintenanceAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newMaintenanceAlert"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_maintenance_alerts_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_maintenance_alerts_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newMaintenanceAlert"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user_groups"}},{"kind":"Field","name":{"kind":"Name","value":"from_date"}},{"kind":"Field","name":{"kind":"Name","value":"until_date"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]} as unknown as DocumentNode<InsertMaintenanceAlertMutation, InsertMaintenanceAlertMutationVariables>;
export const UpdateMaintenanceAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMaintenanceAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maintenanceAlertId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateMaintenanceAlert"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_maintenance_alerts_set_input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_maintenance_alerts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maintenanceAlertId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateMaintenanceAlert"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user_groups"}},{"kind":"Field","name":{"kind":"Name","value":"from_date"}},{"kind":"Field","name":{"kind":"Name","value":"until_date"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateMaintenanceAlertMutation, UpdateMaintenanceAlertMutationVariables>;
export const DeleteNavigationItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteNavigationItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_navigation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteNavigationItemMutation, DeleteNavigationItemMutationVariables>;
export const GetAllNavigationItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllNavigationItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languages"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_languages_enum"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_navigation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"placement"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"ObjectField","name":{"kind":"Name","value":"position"},"value":{"kind":"EnumValue","value":"asc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languages"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"icon_name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_target"}},{"kind":"Field","name":{"kind":"Name","value":"placement"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_path"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}}]}}]} as unknown as DocumentNode<GetAllNavigationItemsQuery, GetAllNavigationItemsQueryVariables>;
export const GetNavigationBarsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNavigationBars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_navigation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"distinct_on"},"value":{"kind":"EnumValue","value":"placement"}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"placement"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"placement"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}}]}}]}}]} as unknown as DocumentNode<GetNavigationBarsQuery, GetNavigationBarsQueryVariables>;
export const GetNavigationItemByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNavigationItemById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_navigation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"icon_name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_target"}},{"kind":"Field","name":{"kind":"Name","value":"placement"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_path"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}}]}}]} as unknown as DocumentNode<GetNavigationItemByIdQuery, GetNavigationItemByIdQueryVariables>;
export const GetNavigationItemsByPlacementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNavigationItemsByPlacement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"placement"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_navigation_order_by"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_navigation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"placement"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"placement"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"icon_name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_target"}},{"kind":"Field","name":{"kind":"Name","value":"placement"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_path"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}}]}}]} as unknown as DocumentNode<GetNavigationItemsByPlacementQuery, GetNavigationItemsByPlacementQueryVariables>;
export const GetNavigationItemsByPlacementAndLanguageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNavigationItemsByPlacementAndLanguage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"placement"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languages"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_languages_enum"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_navigation_order_by"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_navigation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"placement"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"placement"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languages"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"icon_name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_target"}},{"kind":"Field","name":{"kind":"Name","value":"placement"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_path"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}}]}}]} as unknown as DocumentNode<GetNavigationItemsByPlacementAndLanguageQuery, GetNavigationItemsByPlacementAndLanguageQueryVariables>;
export const InsertNavigationItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertNavigationItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"navigationItem"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_navigation_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_navigation_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"navigationItem"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"icon_name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_target"}},{"kind":"Field","name":{"kind":"Name","value":"placement"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_path"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}}]}}]} as unknown as DocumentNode<InsertNavigationItemMutation, InsertNavigationItemMutationVariables>;
export const UpdateNavigationItemByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNavigationItemById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"navigationItem"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_navigation_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_navigation_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"navigationItem"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"icon_name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_target"}},{"kind":"Field","name":{"kind":"Name","value":"placement"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_path"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}}]}}]} as unknown as DocumentNode<UpdateNavigationItemByIdMutation, UpdateNavigationItemByIdMutationVariables>;
export const GetOrganisationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrganisations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"org_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}}]}}]}}]} as unknown as DocumentNode<GetOrganisationsQuery, GetOrganisationsQueryVariables>;
export const GetOrganisationsForMaintainerGridDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrganisationsForMaintainerGrid"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}}]}}]}}]} as unknown as DocumentNode<GetOrganisationsForMaintainerGridQuery, GetOrganisationsForMaintainerGridQueryVariables>;
export const GetOrganisationsWithUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrganisationsWithUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"distinct_on"},"value":{"kind":"EnumValue","value":"org_identifier"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"users"},"value":{"kind":"ObjectValue","fields":[]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]} as unknown as DocumentNode<GetOrganisationsWithUsersQuery, GetOrganisationsWithUsersQueryVariables>;
export const GetPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_permission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"label"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetPermissionsQuery, GetPermissionsQueryVariables>;
export const GetFileByByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFileByById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_file"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"isRootOf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"includes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"representation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"represents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}}]}}]}}]}}]} as unknown as DocumentNode<GetFileByByIdQuery, GetFileByByIdQueryVariables>;
export const GetThumbnailUrlByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getThumbnailUrlById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph__intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}}]}}]} as unknown as DocumentNode<GetThumbnailUrlByIdQuery, GetThumbnailUrlByIdQueryVariables>;
export const GetSiteVariableByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSiteVariableByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_config_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetSiteVariableByNameQuery, GetSiteVariableByNameQueryVariables>;
export const UpdateSiteVariableByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSiteVariableByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_config_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_config"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateSiteVariableByNameMutation, UpdateSiteVariableByNameMutationVariables>;
export const GetFirstObjectIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFirstObjectId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph__intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}}]}}]}}]} as unknown as DocumentNode<GetFirstObjectIdQuery, GetFirstObjectIdQueryVariables>;
export const GetAllLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lookup_languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]}}]} as unknown as DocumentNode<GetAllLanguagesQuery, GetAllLanguagesQueryVariables>;
export const GetTranslationByComponentLocationKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTranslationByComponentLocationKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"component"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"component"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"component"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"location"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"value_type"}}]}}]}}]} as unknown as DocumentNode<GetTranslationByComponentLocationKeyQuery, GetTranslationByComponentLocationKeyQueryVariables>;
export const GetTranslationsByComponentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTranslationsByComponents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"components"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"component"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"components"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"value_type"}}]}}]}}]} as unknown as DocumentNode<GetTranslationsByComponentsQuery, GetTranslationsByComponentsQueryVariables>;
export const GetTranslationsByComponentsAndLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTranslationsByComponentsAndLanguages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"components"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageCodes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_languages_enum"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"component"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"components"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageCodes"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"value_type"}}]}}]}}]} as unknown as DocumentNode<GetTranslationsByComponentsAndLanguagesQuery, GetTranslationsByComponentsAndLanguagesQueryVariables>;
export const InsertTranslationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertTranslation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"component"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_languages_enum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value_type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"component"},"value":{"kind":"Variable","name":{"kind":"Name","value":"component"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageCode"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"value_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value_type"}}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<InsertTranslationMutation, InsertTranslationMutationVariables>;
export const UpdateTranslationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTranslation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"component"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_languages_enum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"component"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"component"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"location"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageCode"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateTranslationMutation, UpdateTranslationMutationVariables>;
export const GetUserGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetUserGroupsQuery, GetUserGroupsQueryVariables>;
export const GetUserGroupsPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserGroupsPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserGroupsPermissionsQuery, GetUserGroupsPermissionsQueryVariables>;
export const UpdateUserGroupsPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserGroupsPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"insertions"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_group_permission_insert_input"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deletions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_group_permission_bool_exp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_users_group_permission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deletions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insert_users_group_permission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"insertions"}}},{"kind":"Argument","name":{"kind":"Name","value":"on_conflict"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"constraint"},"value":{"kind":"EnumValue","value":"group_permission_group_id_permission_id_key"}},{"kind":"ObjectField","name":{"kind":"Name","value":"update_columns"},"value":{"kind":"ListValue","values":[]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateUserGroupsPermissionsMutation, UpdateUserGroupsPermissionsMutationVariables>;
export const GetIdpsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getIdps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_identity_provider"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetIdpsQuery, GetIdpsQueryVariables>;
export const GetProfileIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getProfileIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_profile_bool_exp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetProfileIdsQuery, GetProfileIdsQueryVariables>;
export const GetProfileNamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getProfileNames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profileIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profileIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users_profile_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profileIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetProfileNamesQuery, GetProfileNamesQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_profile_order_by"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_profile_bool_exp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"last_access_at"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"is_key_user"}},{"kind":"Field","name":{"kind":"Name","value":"is_evaluator"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity_provider_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users_profile_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const SearchProfileNamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchProfileNames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_profile_bool_exp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"last_access_at"},"value":{"kind":"EnumValue","value":"desc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}}]}}]}}]} as unknown as DocumentNode<SearchProfileNamesQuery, SearchProfileNamesQueryVariables>;