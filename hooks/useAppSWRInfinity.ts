import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { last } from 'lodash';
import { BaseResponse, QueryParams } from 'models';
import type { SWRInfiniteConfiguration, SWRInfiniteResponse } from 'swr/infinite';
import useSWRInfinite from 'swr/infinite';
import request from 'utils/request';

import { DEFAULT_PARAMS_PAGINATION } from '../constants';

export type GetRequest = AxiosRequestConfig;

export type Modify<T, R> = Omit<T, keyof R> & R;

export type Merge<X, Y> = {
	[K in keyof X | keyof Y]: (K extends keyof X ? X[K] : never) | (K extends keyof Y ? Y[K] : never);
};

export type AxiosWithModifyResponse<T> = Merge<AxiosResponse<T>, BaseResponse<T>>;

interface InfinityReturn<Data, Error>
	extends Pick<
		SWRInfiniteResponse<AxiosWithModifyResponse<Data>, AxiosError<Error>>,
		'isValidating' | 'mutate' | 'size' | 'setSize' | 'error'
	> {
	data: Data | undefined; // to be declar with every request axios
	response: AxiosWithModifyResponse<Data> | undefined; //declared with unique data | data[] type
}

export const fetcher = (requestParams: GetRequest, params: QueryParams) => {
	return request({ url: requestParams?.url, method: requestParams?.method, params: params }).then(
		(data) => data,
	);
};

export interface AppSWRInfinityProps {
	request: GetRequest;
	query?: object | null;
}

const getKeyQueryString = (query: object) => {
	return Object.keys(query)
		.map((key) => `${key}=${query[key]}`)
		.join('&');
};

export const useAppSWRInfinity = <Data = unknown, Error = unknown>(
	keyRequest: AppSWRInfinityProps | null,
	configs: SWRInfiniteConfiguration<AxiosWithModifyResponse<Data>, AxiosError<Error>> = {},
	customReponse?: any,
): InfinityReturn<Data, Error> => {
	const {
		data: response,
		error,
		isValidating,
		mutate,
		size,
		setSize,
	} = useSWRInfinite<AxiosWithModifyResponse<Data> | any, AxiosError<Error>>(
		(index: number) => {
			const isQuery = keyRequest?.query;

			return keyRequest?.request.url
				? {
						url: `${keyRequest?.request?.url}?${
							isQuery
								? getKeyQueryString(isQuery)
								: `${!customReponse ? 'pageIndex' : 'Page'}=${index}&pageSize=${
										DEFAULT_PARAMS_PAGINATION.pageSize
								  }`
						}`,
						method: keyRequest?.request?.method,
				  }
				: null;
		},
		fetcher,
		configs,
	);

	const dataCurrent = last(response);

	const mergeArr = !customReponse
		? response?.reduce((curr, prev) => {
				return [...curr, ...prev?.data];
		  }, [])
		: response?.reduce(
				(curr, prev) => {
					return {
						orderStatusCount: prev?.data?.orderStatusCount,
						orders: [...curr?.orders, ...prev?.data?.orders],
						...prev?.data,
					};
				},
				{ orderStatusCount: {}, orders: [] },
		  );

	return {
		data: mergeArr,
		response: dataCurrent,
		error,
		isValidating,
		mutate,
		size,
		setSize,
	};
};
