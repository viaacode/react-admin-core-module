import { useMutation, UseMutationResult } from 'react-query';
import { ContentPageService } from '~modules/content-page/services/content-page.service';

export function useSoftDeleteContentPage(): UseMutationResult<void, unknown, number | string> {
	return useMutation((id: number | string) => ContentPageService.deleteContentPage(id));
}
