import { QueryParams } from 'models';

import { useAppSWR } from './';

export function useDealShock(propData: any, query: QueryParams, shouldFetch?: boolean) {
	const { data, error, response }: any =
		propData !== null && Array.isArray(propData)
			? { data: propData }
			: propData === null &&
			  useAppSWR(
					{
						url: `/product/homedeal?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&sessionId=${query?.sessionId}`,

						method: 'GET',
					},
					{
						fallbackData: propData,
						isPaused: () => !!!shouldFetch,
					},
			  );

	return {
		data: propData?.length ? propData : data?.products,
		error,
		totalRemain: response && response.totalRemain,
		loading: !response?.message,
	};
}
