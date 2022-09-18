import { QueryParams } from 'models';

import { useAppSWR } from './';

export function useRecommendProduct(propData: any, params: QueryParams, shouldFetch?: boolean) {
	const { data, error }: any =
		propData !== null && Array.isArray(propData)
			? { data: propData }
			: propData === null &&
			  useAppSWR(
					{
						url: `/product/homesuggestion?pageIndex=${params.pageIndex}&pageSize=${
							params.pageSize
						}&sessionId=${params?.sessionId || ''}`,
						method: 'GET',
					},
					{
						fallbackData: propData,
						isPaused: () => !!!shouldFetch,
					},
			  );

	return {
		data,
		error,
	};
}
