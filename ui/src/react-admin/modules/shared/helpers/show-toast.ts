import { AdminConfigManager } from '~core/config/config.class';
import type { ToastInfo } from '~core/config/config.types';

// Alias for the show toast function in the admin core config
export const showToast = (toastInfo: ToastInfo): string =>
	AdminConfigManager.getConfig().services.toastService.showToast(toastInfo);
