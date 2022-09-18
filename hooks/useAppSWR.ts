import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { QueryParams } from 'models';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import request from 'utils/request';

export type GetRequest = AxiosRequestConfig | null | undefined | any;

interface Return<Data, Error>
	extends Pick<
		SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
		'isValidating' | 'error' | 'mutate'
	> {
	data: Data | undefined;
	response: AxiosResponse<Data> | undefined;
}

// export interface Config<Data = unknown, Error = unknown>

export const fetcher = (requestParams: GetRequest, params: QueryParams, body: any) => {
	return request({
		url: requestParams?.url,
		method: requestParams?.method,
		params: params,
		data: body,
	})
		.then((data) => data)
		.catch((error) => error);
};

export const useAppSWR = <Data = unknown, Error = unknown>(
	requestParams: GetRequest,
	{ fallbackData, ...configs }: SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>> = {},
	queryParams?: any,
	body?: any,
): Return<Data, Error> => {
	const {
		data: response,
		error,
		isValidating,
		// revalidate,
		mutate,
	} = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
		requestParams || null,
		() => fetcher(requestParams, queryParams, body),
		configs,
	);

	return {
		data: response && response.data,
		response,
		error,
		isValidating,
		// revalidate,
		mutate,
	};
};
