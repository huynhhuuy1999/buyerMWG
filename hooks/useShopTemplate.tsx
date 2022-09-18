import { ParamSearchProduct } from 'models/';
import { fetchFilterSearchProduct } from 'services';
import useSWR, { SWRConfiguration } from 'swr';

export const fetcher = (url: string, params: ParamSearchProduct | Record<any, any>) => {
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

export const useShopTemplate = (id?: string, option?: SWRConfiguration) => {
	const { data, error, mutate, isValidating } = useSWR(
		[`shoptemplate/${id}/shopview`],
		fetcher,
		option,
	);

	return { data, error, mutate, isValidating };
};
