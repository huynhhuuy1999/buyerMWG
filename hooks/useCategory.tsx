import { QueryParams } from 'models';

import { useAppSWR } from './index';

export function useCategory(propData: any, params?: QueryParams) {
	const { data, error }: any = useAppSWR(
		{ url: '/category', method: 'GET' },
		{
			fallbackData: propData,
		},
	);

	return {
		data,
		error,
	};
}
