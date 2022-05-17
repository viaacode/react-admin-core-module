import { TabProps } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';

import { FilterableColumn } from '../../shared/components/FilterTable/FilterTable';
import { ROUTE_PARTS } from '../../shared/consts/routes';
import { NULL_FILTER } from '../../shared/helpers/filters';
import { ContentOverviewTableCols, ContentWidth } from '../types/content-pages.types';

import { Config } from '~core/config';
import {
  CheckboxDropdownModalProps,
  CheckboxOption
} from '~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';

const ROOT = 'navigatie';
const DETAIL = ':navigationName';

export const CONTENT_PAGE_PATHS = {
  overview: `/${ROOT}`,
  detail: `/${ROOT}/${DETAIL}`,
  create: `/${ROOT}/${DETAIL}/aanmaken`,
  edit: `/${ROOT}/${DETAIL}/bewerken`
};

export const CONTENT_PAGE_CONFIG = {
  views: {
    overview: {
      meta: {
        title: 'Navigatie - beheer',
        description: 'Navigatie overzicht beheerpagina'
      },
      labels: {
        pageTitle: 'Navigatie: overzicht',
        createButton: 'Navigatie toevoegen',
        tableHeads: {
          name: 'Naam',
          description: 'Beschrijving',
          actions: ''
        },
        tableActions: {
          add: {
            title: 'Voeg een navigatie-item toe aan deze navigatiebalk.'
          },
          view: {
            title: 'Bekijk de navigatie-items voor deze navigatiebalk'
          }
        }
      },
      error: {}
    },
    detail: {
      labels: {}
    },
    edit: {
      labels: {}
    }
  }
};

export const RichEditorStateKey = 'RichEditorState';

export const GET_CONTENT_PAGE_OVERVIEW_COLUMNS: (
  contentTypeOptions: CheckboxOption[],
  userGroupOptions: CheckboxOption[],
  contentPageLabelOptions: CheckboxOption[]
) => FilterableColumn[] = (contentTypeOptions, userGroupOptions, contentPageLabelOptions) => {
  const i18n = Config.getConfig().services.i18n;
  return [
    {
      id: 'title',
      label: i18n.t('admin/content/content___titel'),
      sortable: true,
      visibleByDefault: true,
      dataType: 'string'
    },
    {
      id: 'content_type',
      label: i18n.t('admin/content/content___content-type'),
      sortable: true,
      visibleByDefault: true,
      filterType: 'CheckboxDropdownModal',
      filterProps: {
        options: contentTypeOptions
      } as CheckboxDropdownModalProps,
      dataType: 'string'
    },
    {
      id: 'user_profile_id',
      label: i18n.t('admin/content/content___auteur'),
      sortable: true,
      visibleByDefault: true,
      filterType: 'MultiUserSelectDropdown',
      dataType: 'string'
    },
    {
      id: 'author_user_group',
      label: i18n.t('admin/users/user___gebruikersgroep'),
      sortable: true,
      visibleByDefault: false,
      filterType: 'CheckboxDropdownModal',
      filterProps: {
        options: [
          ...userGroupOptions,
          {
            label: i18n.t('admin/content/content___leeg'),
            id: NULL_FILTER
          }
        ]
      } as CheckboxDropdownModalProps,
      dataType: 'string'
    },
    {
      id: 'created_at',
      label: i18n.t('admin/content/content___aangemaakt'),
      sortable: true,
      visibleByDefault: true,
      filterType: 'DateRangeDropdown',
      dataType: 'dateTime'
    },
    {
      id: 'updated_at',
      label: i18n.t('admin/content/content___laatst-bewerkt'),
      sortable: true,
      visibleByDefault: true,
      filterType: 'DateRangeDropdown',
      dataType: 'dateTime'
    },
    {
      id: 'is_public',
      label: i18n.t('admin/content/content___publiek'),
      sortable: true,
      visibleByDefault: false,
      filterType: 'BooleanCheckboxDropdown',
      dataType: 'boolean'
    },
    {
      id: 'published_at',
      label: i18n.t(
        'admin/content/views/content-overview___publicatie'
      ),
      sortable: true,
      visibleByDefault: true,
      filterType: 'DateRangeDropdown',
      dataType: 'dateTime'
    },
    {
      id: 'publish_at',
      label: i18n.t(
        'admin/content/views/content-overview___publiceer-op'
      ),
      sortable: true,
      visibleByDefault: true,
      filterType: 'DateRangeDropdown',
      dataType: 'dateTime'
    },
    {
      id: 'depublish_at',
      label: i18n.t(
        'admin/content/views/content-overview___depubliceer-op'
      ),
      sortable: true,
      visibleByDefault: true,
      filterType: 'DateRangeDropdown',
      dataType: 'dateTime'
    },
    {
      id: 'labels',
      label: i18n.t('admin/content/content___labels'),
      sortable: false,
      visibleByDefault: false,
      filterType: 'CheckboxDropdownModal',
      filterProps: {
        options: contentPageLabelOptions
      } as CheckboxDropdownModalProps
    },
    {
      id: 'user_group_ids',
      label: i18n.t('admin/content/content___zichtbaar-voor'),
      sortable: false,
      visibleByDefault: false
    },
    {
      id: 'actions',
      tooltip: i18n.t(
        'admin/content/views/content-overview___acties'
      ),
      visibleByDefault: true
    }
  ];
};

export const CONTENT_RESULT_PATH: Record<string, [string, string]> = {
  COUNT: ['app_content_aggregate', 'app_content_page_aggregate'],
  GET: ['data.app_content', 'data.app_content_page'],
  INSERT: ['insert_app_content', 'insert_app_content_page'],
  UPDATE: ['update_app_content', 'update_app_content_page']
};

export const TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT: Partial<{
  [columnId in ContentOverviewTableCols]: (order: Avo.Search.OrderDirection) => any;
}> = {
  user_profile_id: (order: Avo.Search.OrderDirection) => ({
    profile: { usersByuserId: { first_name: order } }
  }),
  author_user_group: (order: Avo.Search.OrderDirection) => ({
    profile: { profile_user_group: { group: { label: order } } }
  })
};

export const CONTENT_PATH = {
  CONTENT_PAGE_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
  CONTENT_PAGE_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/${ROUTE_PARTS.create}`,
  CONTENT_PAGE_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id`,
  CONTENT_PAGE_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id/${ROUTE_PARTS.edit}`,
  PAGES: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=PAGINA`,
  NEWS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=NIEUWS_ITEM`,
  FAQS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=FAQ_ITEM`,
  SCREENCASTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=SCREENCAST`,
  PROJECTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=PROJECT`,
  OVERVIEWS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=OVERZICHT`
};

export const ITEMS_PER_PAGE = 10;

export const GET_CONTENT_DETAIL_TABS: () => TabProps[] = () => [
  {
    id: 'inhoud',
    label: Config.getConfig().services.i18n.t('admin/content/content___inhoud'),
    icon: 'layout'
  },
  {
    id: 'metadata',
    label: Config.getConfig().services.i18n.t('admin/content/content___metadata'),
    icon: 'file-text'
  }
];

export const GET_CONTENT_WIDTH_OPTIONS = () => [
  {
    label: Config.getConfig().services.i18n.t(
      'admin/content/content___kies-een-content-breedte'
    ),
    value: '',
    disabled: true
  },
  {
    label: Config.getConfig().services.i18n.t('admin/content/content___max-1300-px'),
    value: 'REGULAR'
  },
  {
    label: Config.getConfig().services.i18n.t('admin/content/content___breed-940-px'),
    value: 'LARGE'
  },
  {
    label: Config.getConfig().services.i18n.t('admin/content/content___medium-720-px'),
    value: 'MEDIUM'
  }
];

/* eslint-disable @typescript-eslint/no-unused-vars */
export const DEFAULT_PAGES_WIDTH: { [key in ContentWidth]: Avo.ContentPage.Type[] } = {
  [ContentWidth.REGULAR]: ['PROJECT'],
  [ContentWidth.LARGE]: [],
  [ContentWidth.MEDIUM]: ['NIEUWS_ITEM']
};
/* eslint-enable @typescript-eslint/no-unused-vars */
