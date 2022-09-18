import useSWR from 'swr';
import { PublicConfiguration } from 'swr/dist/types';

export function useProfile(options?: Partial<PublicConfiguration>) {
	const { data: profile, error } = useSWR('/profile', {
		dedupingInterval: 3600000,
		revalidateOnFocus: false,
		...options,
	});

	return {
		profile,
		error,
	};
}
