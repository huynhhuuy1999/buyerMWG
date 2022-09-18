// import { ParamSearchProduct } from 'models';
// import { FilterCate, ProductListMobile, ResponseFilterProperty } from 'modules';
import { ProductListMobile } from 'modules';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

// import { useProductSearch } from '@/hooks/useProductSearch';
import { useProductSearchInfinite } from '@/hooks/useProductSearchInfinite';

export interface IDealshockList {
	listPropertyFilter?: any;
	listProductSearch?: any;
}

// const MAX_PAGE_SIZE = 20;

const DealshockListMobile: React.FC<IDealshockList> = ({
	listPropertyFilter,
	listProductSearch,
}) => {
	const route = useRouter();

	const defaultParams = {
		pageIndex:
			parseInt(
				route?.query?.pageIndex && !isNaN(+route?.query?.pageIndex)
					? route?.query?.pageIndex.toString()
					: '1',
			) - 1,
		pageSize: 20,
		flashSaleStatus: 1,
	};

	const [filterParams] = useState({ ...defaultParams });

	const {
		data: listProductSearchSWR,
		isValidating,
		size,
		setSize,
	} = useProductSearchInfinite(
		'/product/search',
		{
			pageIndex: 0,
			flashSaleStatus: filterParams.flashSaleStatus,
			isFlashSale: true,
			pageSize: 20,
		},
		{ fallbackData: listProductSearch, revalidateFirstPage: false },
	);

	// const [tabs, setTabs] = useState<any>([
	// 	{
	// 		id: 1,
	// 		title: 'Đang bán',
	// 		active: true,
	// 	},
	// 	{
	// 		id: 2,
	// 		title: 'Sắp bán',
	// 		active: false,
	// 	},
	// ]);

	// const { data: listFilterSWR } = !listPropertyFilter?.data
	// 	? // eslint-disable-next-line react-hooks/rules-of-hooks
	// 	  useProductSearch(
	// 			'/product/searchaggregation',
	// 			route.query.key
	// 				? {
	// 						keyword: route?.query?.k ? `${route?.query?.k}` : '',
	// 				  }
	// 				: {
	// 						keyword: route?.query?.k ? `${route?.query?.k}` : '',
	// 						isValid: true,
	// 						// brandIds: route?.query?.brandIds,
	// 						// categoryId: route?.query?.categoryId,
	// 				  },
	// 			// { fallbackData: listPropertyFilter },
	// 	  )
	// 	: {
	// 			data: listPropertyFilter,
	// 	  };

	// const renderParamURL = (listFilter: ParamSearchProduct) => {
	// 	let ids = '';
	// 	const newParams: any = Object.assign({}, listFilter);

	// 	Object.keys(newParams).map((key) => {
	// 		if (Array.isArray(listFilter[key])) {
	// 			listFilter[key].forEach((item: any) => {
	// 				ids += `${key}=${encodeURIComponent(item)}&`;
	// 			});
	// 		} else {
	// 			ids += `${key}=${encodeURIComponent(newParams[key])}&`;
	// 		}
	// 	});

	// 	route.push(
	// 		`/tim-kiem?k=${
	// 			route?.query?.k ? decodeURIComponent(String(route?.query?.k)).replaceAll(' ', '+') : ''
	// 		}&${ids}`,
	// 		undefined,
	// 		{
	// 			shallow: true,
	// 		},
	// 	);
	// };

	return (
		<>
			{/* <FilterCate.FilterPropertyMobile
				listPropertyFilter={new ResponseFilterProperty(listFilterSWR?.data)}
				keyword={route?.query?.k ? `${route?.query?.k}` : ''}
				handleSearch={(value: any) => renderParamURL(value)}
				query={route?.query}
			/> */}
			<ProductListMobile
				data={listProductSearchSWR}
				setPage={() => setSize(size + 1)}
				loading={isValidating}
				pageIndex={size}
			/>
		</>
	);
};

export default DealshockListMobile;
