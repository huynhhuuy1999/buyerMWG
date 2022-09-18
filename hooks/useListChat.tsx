import useSWR, { SWRConfiguration } from 'swr';
import request from 'utils/request';

export const fetchConversation = (url: string) => {
	return request({
		baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_API_URL}${url}`,
		method: 'GET',
	})
		.then((res) => res.data)
		.catch((err) => err);
};
export const useConversation = (endpoint: string, option?: SWRConfiguration) => {
	const { data, error, mutate, isValidating } = useSWR([endpoint], fetchConversation, option);
	return { data, error, mutate, isValidating };
};
