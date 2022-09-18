import { IParamsBrands } from 'models';
import { getBrands } from 'services/brand';
import useSWR, { SWRConfiguration } from 'swr';

import { fetcher, useAppSWR } from './';

export function useBrand(propData: any) {
	const { data, error }: any =
		propData !== null && Array.isArray(propData)
			? // eslint-disable-next-line react-hooks/rules-of-hooks
			  useSWR('/brand/homepage', fetcher, {
					fallbackData: propData as any,
			  })
			: // eslint-disable-next-line react-hooks/rules-of-hooks
			  useAppSWR(
					{ url: '/brand/homepage', method: 'GET' },
					{
						fallbackData: propData,
					},
			  );

	return {
		data,
		error,
	};
}

export const useBrandSearch = (
	endpoint: string,
	queryParams?: IParamsBrands,
	option?: SWRConfiguration,
) => {
	const { data, error, mutate, isValidating } = useSWR([endpoint, queryParams], getBrands, option);
	return { data, error, mutate, isValidating };
};
