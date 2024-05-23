import { AdminConfigManager, ToastInfo } from '~core/config';

// Alias for the show toast function in the admin core config
export const showToast = (toastInfo: ToastInfo): string =>
	AdminConfigManager.getConfig().services.toastService.showToast(toastInfo);
