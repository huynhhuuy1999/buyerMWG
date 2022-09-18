import { QueryParams } from '../models';
import { useAppSWR } from './';

export function useNewProduct(propData: any, params: QueryParams) {
	const { data, error }: any =
		propData !== null && Array.isArray(propData)
			? { data: propData }
			: propData === null &&
			  useAppSWR({
					url: `/product/homenew?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
					method: 'GET',
			  });

	return {
		data,
		error,
	};
}
