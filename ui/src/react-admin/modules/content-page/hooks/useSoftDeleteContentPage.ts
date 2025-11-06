import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { ContentPageService } from '~modules/content-page/services/content-page.service.js';

export function useSoftDeleteContentPage(): UseMutationResult<void, unknown, number | string> {
	return useMutation((id: number | string) => ContentPageService.deleteContentPage(id));
}
