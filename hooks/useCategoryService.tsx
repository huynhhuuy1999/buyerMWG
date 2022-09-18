import useSWR from 'swr';

import { fetcher, useAppSWR } from './';

export function useCategoryService(propData: any) {
	const { data, error }: any =
		propData !== null && Array.isArray(propData)
			? // eslint-disable-next-line react-hooks/rules-of-hooks
			  useSWR('/category/service', fetcher, { fallbackData: propData as any })
			: // eslint-disable-next-line react-hooks/rules-of-hooks
			  useAppSWR(
					{ url: '/category/service', method: 'GET' },
					{
						fallbackData: propData,
					},
			  );

	return {
		data,
		error,
	};
}
