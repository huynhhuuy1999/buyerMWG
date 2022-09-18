import { QueryParams } from '../models';
import { useAppSWR } from './';

export function useBestSeller(propData: any, query: QueryParams, shouldFetch?: boolean) {
	const { data, error, response }: any =
		propData !== null && Array.isArray(propData)
			? { data: propData }
			: propData === null &&
			  useAppSWR(
					{
						url: `/product/homebestsell?pageIndex=${query.pageIndex}&pageSize=${
							query.pageSize
						}&sessionId=${query?.sessionId || ''}`,
						method: 'GET',
					},
					{
						fallbackData: propData?.data,
						isPaused: () => !!!shouldFetch,
					},
			  );

	return {
		data,
		error,
		totalRemain: response ? response.totalRemain : 0,
		loading: response === undefined,
	};
}
