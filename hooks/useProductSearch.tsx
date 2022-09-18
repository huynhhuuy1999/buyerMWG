import { ParamSearchProduct } from 'models/';
import { fetchFilterSearchProduct } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
// import useAppSWR from './useAppSWR';

export const fetchSearch = (url: string, params: ParamSearchProduct | Record<any, any>) => {
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

export const useProductSearch = (
	endpoint: string,
	queryParams?: ParamSearchProduct,
	option?: SWRConfiguration,
) => {
	const { data, error, mutate, isValidating } = useSWR(
		[endpoint, queryParams],
		fetchSearch,
		option,
	);
	return { data, error, mutate, isValidating };
};
