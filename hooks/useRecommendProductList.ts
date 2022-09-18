import { QueryParams } from 'models/';
import useSWR, { SWRConfiguration } from 'swr';

import { getSuggestProductFeature } from '../services';

const fetchGetList = (url: string, params: QueryParams) => {
	// return getProductSuggest(params);
	return getSuggestProductFeature(params);
};

export const useRecommendProductList = (
	endpoint: string,
	queryParams?: QueryParams,
	option?: SWRConfiguration,
) => {
	const { data, error, mutate, isValidating } = useSWR(
		[endpoint, queryParams],
		fetchGetList,
		option,
	);
	return { data, error, mutate, isValidating };
};
