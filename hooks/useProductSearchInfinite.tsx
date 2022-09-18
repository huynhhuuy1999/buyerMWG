import { ParamSearchProduct } from 'models/';
import { fetchFilterSearchProduct } from 'services';
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite';

export const fetchSearch = (url: string, params: ParamSearchProduct) => {
	let ids = '';
	const newParams: any = Object.assign({}, params);

	Object.keys(newParams).map((key) => {
		if (Array.isArray(params[key])) {
			params[key].forEach((item: any, index: number, array: any) => {
				ids += `${key}=${encodeURIComponent(item)}&`;
			});

			delete newParams[key];
		}
	});
	return fetchFilterSearchProduct(`${url}?${ids}`, newParams);
};

const getKey = (
	pageIndex: number,
	previousPageData: any,
	endpoint: string,
	queryparam?: ParamSearchProduct,
) => {
	if (previousPageData && !previousPageData.data.length) {
		return null;
	}

	// let ids = '';
	const newParams: any = Object.assign({}, queryparam);
	queryparam &&
		Object.keys(newParams).map((key) => {
			if (Array.isArray(queryparam[key])) {
				delete newParams[key];
			}
		});
	return [endpoint, { ...queryparam, pageIndex }];
};

export const useProductSearchInfinite = (
	endpoint: string,
	queryParams?: ParamSearchProduct,
	option?: SWRInfiniteConfiguration,
) => {
	const { data, error, mutate, isValidating, size, setSize } = useSWRInfinite(
		(...args) => getKey(...args, endpoint, queryParams),
		fetchSearch,
		option,
	);

	return { data, error, mutate, isValidating, size, setSize };
};
