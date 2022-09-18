import { ParamSearchProduct } from '../models';
import { useAppSWR } from './useAppSWR';

export const renderParams = (params: ParamSearchProduct | Record<any, any>) => {
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

	return {
		url: ids,
		params: newParams,
	};
};

export function useSearchCount(params: any) {
	const { params: paramsApi, url } = renderParams(params);
	const { data, error, isValidating }: any = useAppSWR(
		{ url: `/product/searchresultcount?${url}`, method: 'GET' },
		{},
		paramsApi,
	);

	return {
		data,
		error,
		isValidating,
	};
}
