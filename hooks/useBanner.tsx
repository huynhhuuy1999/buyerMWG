import { useAppSWR } from './';

export function useBanner(propData: any) {
	const { data, error }: any =
		propData?.data !== null && Array.isArray(propData?.data)
			? { data: propData }
			: propData?.data === null &&
			  useAppSWR(
					{ url: '/banner/getall', method: 'GET' },
					{
						fallbackData: propData?.data,
					},
			  );

	return {
		data,
		error,
		isLoading: data === undefined,
	};
}
