import type { ToastInfo } from '~core/config';
import { AdminConfigManager } from '~core/config';

// Alias for the show toast function in the admin core config
export const showToast = (toastInfo: ToastInfo): string =>
	AdminConfigManager.getConfig().services.toastService.showToast(toastInfo);
