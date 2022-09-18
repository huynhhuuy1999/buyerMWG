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

// export const useProductCategory = (
// 	endpoint: string,
// 	propData: any,
// 	queryParams?: ParamSearchProduct,
// ) => {
// 	const { data, error, mutate, isValidating } = useSWR([endpoint, queryParams], fetchSearch, {
// 		fallbackData: propData,
// 	});
// 	// !!!option?.fallbackData
// 	// 	? useSWR([endpoint, queryParams], fetchSearch, option)
// 	// 	: useAppSWR([endpoint, queryParams], option);

// 	return { data, error, mutate, isValidating };
// };

export const useProductCategory = (
	endpoint: string,
	queryParams?: ParamSearchProduct,
	option?: SWRConfiguration,
) => {
	const { data, error, mutate, isValidating } = useSWR(
		[endpoint, queryParams],
		fetchSearch,
		option,
	);

	// !!!option?.fallbackData
	// 	? useSWR([endpoint, queryParams], fetchSearch, option)
	// 	: useAppSWR([endpoint, queryParams], option);

	return { data, error, mutate, isValidating };
};
