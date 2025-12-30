import type { RichEditorState } from '@meemoo/react-components';
import { AvoContentPageType, type AvoUserCommonUser } from '@viaa/avo2-types';
import { cloneDeep, isNil } from 'es-toolkit';
import type { Draft } from 'immer';
import { produce } from 'immer';
import type { Reducer } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { Locale } from '~modules/translations/translations.core.types';
import type { ValueOf } from '~shared/types';
import type {
	ContentBlockComponentState,
	ContentBlockComponentsConfig,
	ContentBlockConfig,
	ContentBlockErrors,
	RepeatedContentBlockComponentState,
	SingleContentBlockComponentState,
} from '../types/content-block.types';
import type { ContentPageInfo } from '../types/content-pages.types';
import { ContentEditActionType, ContentPageWidth } from '../types/content-pages.types';

interface SetContentPage {
	type: ContentEditActionType.SET_CONTENT_PAGE;
	payload: {
		contentPageInfo: ContentPageInfoEditOrCreate;
		replaceInitial: boolean;
	};
}

interface SetContentPageProp {
	type: ContentEditActionType.SET_CONTENT_PAGE_PROP;
	payload: {
		propName: keyof ContentPageInfo | 'description_state';
		propValue: ValueOf<ContentPageInfoEditOrCreate> | RichEditorState | string;
	};
}

interface AddContentBlockConfig {
	type: ContentEditActionType.ADD_CONTENT_BLOCK_CONFIG;
	payload: ContentBlockConfig;
}

interface RemoveContentBlockConfig {
	type: ContentEditActionType.REMOVE_CONTENT_BLOCK_CONFIG;
	payload: number;
}

interface ReorderContentBlockConfig {
	type: ContentEditActionType.REORDER_CONTENT_BLOCK_CONFIG;
	payload: { configIndex: number; indexUpdate: number };
}

interface AddComponentsState {
	type: ContentEditActionType.ADD_COMPONENTS_STATE;
	payload: {
		index: number;
		formGroupState: ContentBlockComponentState;
	};
}

interface SetComponentsState {
	type: ContentEditActionType.SET_COMPONENTS_STATE;
	payload: {
		index: number;
		formGroupState: SingleContentBlockComponentState | RepeatedContentBlockComponentState;
		stateIndex?: number;
	};
}

interface RemoveComponentsState {
	type: ContentEditActionType.REMOVE_COMPONENTS_STATE;
	payload: {
		index: number;
		stateIndex: number;
	};
}

interface SetBlockState {
	type: ContentEditActionType.SET_BLOCK_STATE;
	payload: {
		index: number;
		formGroupState: ContentBlockComponentState;
	};
}

interface SetContentBlockError {
	type: ContentEditActionType.SET_CONTENT_BLOCK_ERROR;
	payload: {
		configIndex: number;
		errors: ContentBlockErrors;
	};
}

export type ContentEditAction =
	| SetContentPage
	| SetContentPageProp
	| AddContentBlockConfig
	| RemoveContentBlockConfig
	| ReorderContentBlockConfig
	| AddComponentsState
	| SetComponentsState
	| RemoveComponentsState
	| SetBlockState
	| SetContentBlockError;

type ContentPageInfoEditOrCreate = Omit<ContentPageInfo, 'id'> & {
	id?: string | number;
};

export interface ContentPageEditState {
	currentContentPageInfo: ContentPageInfoEditOrCreate | null;
	initialContentPageInfo: ContentPageInfoEditOrCreate | null;
}

export const CONTENT_PAGE_INITIAL_STATE = (
	user: AvoUserCommonUser
): ContentPageInfoEditOrCreate => {
	return {
		thumbnailPath: null,
		title: '',
		description: '',
		description_state: undefined,
		seoTitle: '',
		seoDescription: '',
		seo_image_path: null,
		metaDescription: '',
		isProtected: false,
		path: '',
		contentType: AvoContentPageType.PROJECT,
		contentWidth:
			AdminConfigManager.getConfig()?.contentPage?.defaultPageWidth || ContentPageWidth.EXTRA_LARGE,
		publishAt: '',
		depublishAt: '',
		isPublic: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		publishedAt: null,
		publishedAtDisplay: null,
		depublishedAt: null,
		userProfileId: null,
		userGroupIds: [],
		labels: [],
		content_blocks: [] as ContentBlockConfig[],
		language: Locale.Nl,
		nlParentPageId: null,
		translatedPages: [],
		owner: {
			firstName: user.firstName || '-',
			lastName: user.lastName || '-',
			fullName: user.fullName || '-',
			groupId: user.userGroup?.id as string,
			id: user.profileId,
			groupName: user.userGroup?.label as string,
		},
	};
};

// Helpers
const repositionConfigs = (updatedConfigs: ContentBlockConfig[]) => {
	updatedConfigs.forEach((config, position) => {
		config.position = position;
	});
};

// Reducer
export const contentEditReducer: Reducer<ContentPageEditState, ContentEditAction> = produce(
	(draft: Draft<ContentPageEditState>, action: ContentEditAction) => {
		// Because we use immer, we have to mutate the draft state in place for it to work properly
		// We don't have to return anything because our produce() will automagically do that for us

		let components: ContentBlockComponentsConfig;
		let componentsState: ContentBlockComponentState;
		switch (action.type) {
			case ContentEditActionType.SET_CONTENT_PAGE: {
				draft.currentContentPageInfo = action.payload.contentPageInfo;
				if (action.payload.replaceInitial) {
					draft.initialContentPageInfo = cloneDeep(action.payload.contentPageInfo);
				}
				return;
			}
			case ContentEditActionType.SET_CONTENT_PAGE_PROP: {
				// biome-ignore lint/suspicious/noExplicitAny: todo
				(draft.currentContentPageInfo as any)[action.payload.propName] = action.payload.propValue;
				return;
			}
			case ContentEditActionType.ADD_CONTENT_BLOCK_CONFIG: {
				draft.currentContentPageInfo?.content_blocks?.push(action.payload as ContentBlockConfig);
				return;
			}
			case ContentEditActionType.REMOVE_CONTENT_BLOCK_CONFIG: {
				(draft.currentContentPageInfo as ContentPageInfo).content_blocks.splice(
					action.payload as number,
					1
				);
				repositionConfigs(draft.currentContentPageInfo?.content_blocks || []);
				return;
			}
			case ContentEditActionType.REORDER_CONTENT_BLOCK_CONFIG: {
				const reorderContentBlockConfig = action as ReorderContentBlockConfig;
				const newIndex =
					reorderContentBlockConfig.payload.configIndex +
					reorderContentBlockConfig.payload.indexUpdate;
				// Get updated item and remove it from copy
				if (draft.currentContentPageInfo?.content_blocks) {
					const reorderedConfig = draft.currentContentPageInfo?.content_blocks.splice(
						reorderContentBlockConfig.payload.configIndex,
						1
					)[0];
					// Apply update object to config
					draft.currentContentPageInfo.content_blocks?.splice(newIndex, 0, reorderedConfig);
					// Reposition
					repositionConfigs(draft.currentContentPageInfo.content_blocks || []);
				}
				return;
			}
			case ContentEditActionType.ADD_COMPONENTS_STATE: {
				const addComponentsState = action as AddComponentsState;
				const config: ContentBlockConfig | undefined =
					draft.currentContentPageInfo?.content_blocks?.[addComponentsState.payload.index];
				if (config) {
					componentsState = config.components.state;
					(componentsState as RepeatedContentBlockComponentState[]).push(
						...(addComponentsState.payload.formGroupState as RepeatedContentBlockComponentState[])
					);
				}
				return;
			}
			case ContentEditActionType.REMOVE_COMPONENTS_STATE: {
				const removeComponentsState = action as RemoveComponentsState;
				const config: ContentBlockConfig | undefined =
					draft.currentContentPageInfo?.content_blocks?.[removeComponentsState.payload.index];
				if (config) {
					componentsState = config.components.state;
					(componentsState as RepeatedContentBlockComponentState[]).splice(
						removeComponentsState.payload.stateIndex,
						1
					);
				}
				return;
			}
			case ContentEditActionType.SET_COMPONENTS_STATE: {
				const setComponentsState = action as SetComponentsState;
				const config: ContentBlockConfig | undefined =
					draft.currentContentPageInfo?.content_blocks?.[setComponentsState.payload.index];
				if (!config) {
					return;
				}
				components = config.components as ContentBlockComponentsConfig;

				if (!isNil(action.payload.stateIndex)) {
					// Config component state is an array (repeatable)
					const repeatableState = components.state as RepeatedContentBlockComponentState[];
					repeatableState[action.payload.stateIndex] = {
						...repeatableState[action.payload.stateIndex],
						...(action.payload.formGroupState as RepeatedContentBlockComponentState),
					};
				} else {
					// Config component state is a single object (single)
					components.state = {
						...components.state,
						...(action.payload.formGroupState as SingleContentBlockComponentState),
					};
				}
				return;
			}
			case ContentEditActionType.SET_BLOCK_STATE: {
				const setBlockState = action as SetBlockState;
				const blockInfo =
					draft.currentContentPageInfo?.content_blocks?.[setBlockState.payload.index];
				if (!blockInfo) {
					return;
				}
				blockInfo.block.state = {
					...blockInfo.block.state,
					...setBlockState.payload.formGroupState,
				};
				return;
			}
			case ContentEditActionType.SET_CONTENT_BLOCK_ERROR: {
				const setContentBlockError = action as SetContentBlockError;
				if (
					draft.currentContentPageInfo &&
					JSON.stringify(action.payload.errors) !==
						JSON.stringify(
							draft.currentContentPageInfo?.content_blocks?.[
								setContentBlockError.payload.configIndex
							].errors
						)
				) {
					draft.currentContentPageInfo.content_blocks =
						draft.currentContentPageInfo.content_blocks || [];
					draft.currentContentPageInfo.content_blocks[
						setContentBlockError.payload.configIndex
					].errors = setContentBlockError.payload.errors;
				}
				return;
			}
			default:
				// We don't actually need the default case, produce() will simply return the
				// original state if nothing has changed in the draft
				return;
		}
	}
);
