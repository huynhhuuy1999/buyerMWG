import useSWR, { SWRConfiguration } from 'swr';
import request from 'utils/request';

export const fetchDataHistory = (url: string) => {
	const params = {
		pageIndex: 0,
		pageSize: 5,
	};
	return request({
		baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_API_URL}${url}`,
		method: 'GET',
		params,
	})
		.then((res) => res.data)
		.catch((err) => err);
};

export const fetchDataTrend = (url: string) => {
	const params = {
		pageIndex: 0,
		pageSize: 5,
	};

	return request({
		baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_API_URL}${url}`,
		method: 'GET',
		params,
	})
		.then((res) => res.data)
		.catch((err) => err);
};

export const useSearchHistory = (option?: SWRConfiguration) => {
	const { data, error, mutate, isValidating } = useSWR(
		['/track/keywords/history'],
		fetchDataHistory,
		{
			...option,
			refreshInterval: 360000000,
		},
	);
	return { data, error, mutate, isValidating };
};

export const useSearchTrend = (option?: SWRConfiguration) => {
	const { data, error, mutate, isValidating } = useSWR(['/track/keywords/trend'], fetchDataTrend, {
		...option,
		refreshInterval: 360000000,
	});
	return { data, error, mutate, isValidating };
};
