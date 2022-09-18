import useSWR, { SWRConfiguration } from 'swr';
import request from 'utils/request';

import { QueryParams } from '../models';

export const fetchData = (url: string, params: QueryParams) => {
	return request({
		baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_API_URL}${url}`,
		method: 'GET',
		params,
	});
};
export const useViewedProduct = (params: QueryParams, option?: SWRConfiguration) => {
	const { data, error, mutate, isValidating } = useSWR(
		['/product/viewed', params],
		fetchData,
		option,
	);
	return { data, error, mutate, isValidating };
};
