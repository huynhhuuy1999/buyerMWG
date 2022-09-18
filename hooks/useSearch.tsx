import { ParamSearchProduct } from 'models/';
import { fetchFilterSearchProduct } from 'services';
import useSWR, { SWRConfiguration } from 'swr';
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
	// return request({
	// 	baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}${url}?${ids}`,
	// 	method: 'GET',
	// 	params: newParams,
	// })
	// 	.then((res) => res)
	// 	.catch((err) => err);

	return fetchFilterSearchProduct(`${url}?${ids}`, newParams);
};

export const useSearch = (queryParams?: ParamSearchProduct, option?: SWRConfiguration) => {
	const { data, error, mutate, isValidating } = useSWR(
		['/product/searchsuggestion', queryParams],
		fetchSearch,
		option,
	);

	return { data, error, mutate, isValidating };
};
