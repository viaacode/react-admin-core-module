import { Config } from '~core/config';
import { default as AdminCore } from './core';
import {
	ConfigValue,
	EducationOrganisationService,
	FileConfig,
	FileService,
	History,
	I18n,
	IconComponentProps,
	IconConfig,
	LinkInfo,
	ToastInfo,
	ToastService,
	ToastType,
} from '~core/config';
import { AvoOrHetArchief } from '~modules/shared/types';

export { AdminCore, Config, AvoOrHetArchief };
export type {
	ToastInfo,
	LinkInfo,
	History,
	I18n,
	ToastService,
	ConfigValue,
	FileConfig,
	FileService,
	IconConfig,
	EducationOrganisationService,
	IconComponentProps,
	ToastType,
};
export * from './modules';
