import { useAppSWR } from './';

export function useCategoryHome(propData: any) {
	const { data, error }: any =
		propData.data !== null && Array.isArray(propData.data)
			? propData
			: (propData.data === null || propData?.data === undefined) &&
			  useAppSWR({ url: '/category/homesuggestion', method: 'GET' });

	return {
		data: data?.length ? data : data?.categorySuggestion?.children[0].children,
		error,
	};
}
