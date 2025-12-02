import { useLocation, useNavigate } from 'react-router';
import type { PartialLocation } from 'use-query-params';
import type { QueryParamAdapterComponent } from '~shared/helpers/use-query-params-ssr';

export const ReactRouter7Adapter: QueryParamAdapterComponent = ({
	children,
}: {
	children: any;
}) => {
	const navigate = useNavigate();
	const location = useLocation();

	return children({
		location,
		push: ({ search, state }: PartialLocation) => navigate({ search }, { state }),
		replace: ({ search, state }: PartialLocation) => navigate({ search }, { replace: true, state }),
	});
};
