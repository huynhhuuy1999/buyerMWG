import { QueryParams } from '../models';
import { useAppSWR } from './';

export function useUniqueProduct(propData: any, query: QueryParams, shouldFetch?: boolean) {
	const { data, error, response }: any =
		propData !== null && Array.isArray(propData)
			? propData
			: propData === null &&
			  useAppSWR(
					{
						url: `/product/homeunique?pageIndex=${query.pageIndex}&pageSize=${
							query.pageSize
						}&sessionId=${query?.sessionId || ''}`,
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
		totalRemain: response ? response.totalRemain : 0,
		loading: response === undefined,
	};
}
