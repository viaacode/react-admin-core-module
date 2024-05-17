import { AdminConfigManager } from '~core/config';

// Alias for the show toast function in the admin core config
export const showToast = AdminConfigManager.getConfig().services.toastService.showToast;
