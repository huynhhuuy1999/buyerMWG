import { useProductSearch, useProductSearchInfinite } from 'hooks';
import { CategoryViewModel, IBrand, ParamSearchProduct, Product, SearchAggregation } from 'models';
import { FilterCate, ProductListMobile, ResponseFilterProperty } from 'modules';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { generatePrettyParams } from 'utils';

interface Props {
	category?: CategoryViewModel;
	brands?: IBrand[];
	products?: {
		data: Product[];
		totalObject: number;
	};
	listPropertyFilter?: any;
	colLayout: number;
	categoryIds: Array<number>;
}
const MAX_PAGE_SIZE = 20;

const CategoryPageMobile: React.FC<Props> = ({
	category,
	products,
	colLayout,
	listPropertyFilter,
	categoryIds,
}: Props) => {
	const { query } = useRouter();

	// const [params] = useState<ParamSearchProduct>({ ...defaultParams });

	const route = useRouter();
	const [responseFilterSearch, setResponseFilterSearch] = useState<SearchAggregation>(
		new ResponseFilterProperty(null),
	);

	const { data: filterSearch } = useProductSearch(
		'/product/searchaggregation',
		{
			keyword: query.k ?? '',
			categoryId: categoryIds,
		},
		{ fallbackData: products, isPaused: () => !categoryIds.length },
	);

	const {
		data: listProductSearchSWR,
		isValidating,
		size,
		setSize,
	} = useProductSearchInfinite(
		'/product/search',
		{
			keyword: route?.query?.k ?? '',
			brandIds: route?.query?.brandIds,
			provinceId: route?.query?.provinceId ? Number(route?.query?.provinceId) : undefined,
			districtIds: route?.query?.districtIds,
			filters: route?.query?.filters,
			categoryId: categoryIds,
			price: route?.query?.price,
			isValid: true,
			pageSize: MAX_PAGE_SIZE,
		},
		{
			fallbackData: listPropertyFilter?.data,
			revalidateFirstPage: false,
			isPaused: () => !(categoryIds.length && Object.keys(route.query).length > 0),
		},
	);

	useEffect(() => {
		if (filterSearch && !filterSearch.isError)
			setResponseFilterSearch(new ResponseFilterProperty(filterSearch.data));
	}, [filterSearch]);

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

		route.push(`/${query.slug_extend}${generatePrettyParams(ids)}`, undefined, {
			shallow: true,
		});
	};

	return (
		<div>
			{/* <CategoryMobile isNotFetchApiHome={true} isNotList={true} data={category?.children} />
			<BrandMobile data={brands} isNotFetchApiAll={true} /> */}
			<FilterCate.FilterPropertyMobile
				listPropertyFilter={responseFilterSearch}
				handleSearch={(value: any) => renderParamURL(value)}
				query={route?.query}
			/>
			<ProductListMobile
				colLayoutType={colLayout}
				data={listProductSearchSWR}
				setPage={(page) => setSize(page)}
				loading={isValidating && !!colLayout}
				pageIndex={size}
				className={'mr-[2px]'}
			/>
		</div>
	);
	``;
};

export default CategoryPageMobile;
