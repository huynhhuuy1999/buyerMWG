import { ParamSearchProduct } from 'models/';
import { fetchFilterSearchProduct } from 'services';
import { SWRConfiguration } from 'swr';

import { useAppSWR } from '.';

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

export const useShopInfo = (id?: string, option?: SWRConfiguration) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data, error, mutate, isValidating } = useAppSWR(
		{
			url: `merchant/info/${id}`,
			method: 'GET',
		},
		option,
	);

	return { data, error: !isValidating && data === null, mutate, isValidating };
};
