import React from 'react';

import { InterParamsViewList } from '@/components/ViewList';
import { useSuggestMerchant } from '@/hooks/useSuggestMerchants';

import { BannerSuggestBrand } from '../bannerSuggestBrand';
import { FilterSuggestBrand } from '../filterSuggestBrand';
import { ListSuggestBrand } from '../list-suggest-brand';
import { ListCategorySuggestBrand } from '../listCategorySuggestBrand';

interface ISuggestBrandModule {
	data?: any;
}

const defaultParams: InterParamsViewList = {
	page: 0,
	pageSize: 10,
};

export const SuggestBrandModule: React.FC<ISuggestBrandModule> = ({ data }) => {
	const { data: responseMerchants } = !data.data
		? useSuggestMerchant(
				'/product/suggestedmerchants',
				{
					...defaultParams,
				},
				// { fallbackData: data },
		  )
		: {
				data: data,
		  };

	return (
		<>
			<BannerSuggestBrand />
			<ListCategorySuggestBrand />
			<FilterSuggestBrand totalMerchant={responseMerchants?.totalObject} />
			<ListSuggestBrand listSuggestBrand={responseMerchants?.data} />
		</>
	);
};
