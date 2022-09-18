import { QueryParams } from 'models';

import { useAppSWR } from './';

export function useTrendingProduct(propData: any, params: QueryParams, shouldFetch?: boolean) {
	const { data, error, response }: any =
		propData !== null && Array.isArray(propData)
			? { data: propData }
			: propData === null &&
			  useAppSWR(
					{
						url: `/product/homefeature?pageIndex=${params.pageIndex}&pageSize=${
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
		totalRemain: response && response?.totalRemain,
	};
}
