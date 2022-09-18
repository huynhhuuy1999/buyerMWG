import useSWR from 'swr';
import { PublicConfiguration } from 'swr/dist/types';

export function useProductList(options?: Partial<PublicConfiguration>) {
	const { data, error }: any = useSWR('/product/homeunique');

	return {
		data,
		error,
	};
}
