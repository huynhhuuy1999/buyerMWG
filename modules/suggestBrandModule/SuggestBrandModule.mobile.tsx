import React from 'react';

import { InterParamsViewList } from '@/components/ViewList';
import { useProductSearchInfinite } from '@/hooks/useProductSearchInfinite';

import { FilterSuggestBrandMobile } from '../filterSuggestBrand';
import { ListSuggestBrandMobile } from '../list-suggest-brand';

interface ISuggestBrandModuleMobile {
	data?: any;
}

const defaultParams: InterParamsViewList = {
	page: 0,
	pageSize: 10,
};

export const SuggestBrandModuleMobile: React.FC<ISuggestBrandModuleMobile> = ({ data }) => {
	const {
		data: responseMerchants,
		isValidating,
		size,
		setSize,
	} = useProductSearchInfinite(
		'/product/suggestedmerchants',
		{
			...defaultParams,
		},
		{ fallbackData: data, revalidateFirstPage: false },
	);

	return (
		<>
			<FilterSuggestBrandMobile />

			<ListSuggestBrandMobile
				data={responseMerchants}
				setPage={() => setSize(size + 1)}
				loading={isValidating}
				pageIndex={size}
			/>
		</>
	);
};
