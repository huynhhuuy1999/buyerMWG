import useSWR from 'swr';
import request from 'utils/request';
export const fetchCatalog = (url: string) =>
	request({
		baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_API_URL}${url}`,
		method: 'GET',
	})
		.then((res) => res)
		.catch((err) => err);

export const useCatalog = (endpoint: string) => {
	const { data, error } = useSWR([endpoint], fetchCatalog);

	return { catalogList: data, error };
};
