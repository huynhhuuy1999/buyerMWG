import { ParamSearchProduct } from 'models';
import { FilterCate, ProductListMobile, ResponseFilterProperty } from 'modules';
import { useRouter } from 'next/router';
import React from 'react';

import { useProductSearch } from '@/hooks/useProductSearch';
import { useProductSearchInfinite } from '@/hooks/useProductSearchInfinite';

export interface IProductSearchMobile {
	listPropertyFilter?: any;
	listProductSearch?: any;
}

const MAX_PAGE_SIZE = 20;

const ProductSearchMobile: React.FC<IProductSearchMobile> = ({
	listPropertyFilter,
	listProductSearch,
}) => {
	const route = useRouter();

	const {
		data: listProductSearchSWR,
		isValidating,
		size,
		setSize,
	} = useProductSearchInfinite(
		'/product/search',
		{
			keyword: route?.query?.k ? `${route?.query?.k}` : '',
			brandIds: route?.query?.brandIds,
			provinceId: route?.query?.provinceId ? Number(route?.query?.provinceId) : undefined,
			districtIds: route?.query?.districtIds,
			filters: route?.query?.filters,
			categoryId: route?.query?.categoryId,
			price: route?.query?.price,
			sortType: Number(route?.query?.sortType || 0),
			isValid: true,
			pageSize: MAX_PAGE_SIZE,
			ratingTypes: route?.query?.ratingTypes,
		},
		{ fallbackData: listProductSearch, revalidateFirstPage: false },
	);

	const { data: listFilterSWR } = !listPropertyFilter?.data
		? // eslint-disable-next-line react-hooks/rules-of-hooks
		  useProductSearch(
				'/product/searchaggregation',
				route.query.key
					? {
							keyword: route?.query?.k ? `${route?.query?.k}` : '',
					  }
					: {
							keyword: route?.query?.k ? `${route?.query?.k}` : '',
							isValid: true,
							// brandIds: route?.query?.brandIds,
							// categoryId: route?.query?.categoryId,
					  },
				// { fallbackData: listPropertyFilter },
		  )
		: {
				data: listPropertyFilter,
		  };

	const renderParamURL = (listFilter: ParamSearchProduct) => {
		let ids = '';
		const newParams: any = Object.assign({}, listFilter);

		Object.keys(newParams).map((key) => {
			if (Array.isArray(listFilter[key])) {
				listFilter[key].forEach((item: any) => {
					ids += `${key}=${encodeURIComponent(item)}&`;
				});
			} else {
				ids += `${key}=${encodeURIComponent(newParams[key])}&`;
			}
		});

		route.push(
			`/tim-kiem?k=${
				route?.query?.k ? decodeURIComponent(String(route?.query?.k)).replaceAll(' ', '+') : ''
			}&${ids}`,
			undefined,
			{
				shallow: true,
			},
		);
	};
	return (
		<>
			<FilterCate.FilterPropertyMobile
				listPropertyFilter={new ResponseFilterProperty(listFilterSWR?.data)}
				keyword={route?.query?.k ? `${route?.query?.k}` : ''}
				handleSearch={(value: any) => renderParamURL(value)}
				query={route?.query}
			/>
			<ProductListMobile
				data={listProductSearchSWR}
				setPage={() => setSize(size + 1)}
				loading={isValidating}
				pageIndex={size}
			/>
		</>
	);
};

export default ProductSearchMobile;
