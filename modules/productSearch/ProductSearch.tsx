import classNames from 'classnames';
import { dataSortDropdown, Dropdown, ImageCustom, Pagination } from 'components';
import { useIsomorphicLayoutEffect, useProductSearch } from 'hooks';
import { ParamSearchProduct } from 'models';
import { FilterCate, ResponseFilterProperty } from 'modules';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Icon, IconEnum } from 'vuivui-icons';

// import { FilterProperty } from '../filterProperty';
import { ProductList } from '../product-list';
import RecommendProductList from '../recommandProductList/recommend-productlist';
import { RecommendShop } from '../recommend-shop';

export interface IProductSearch {
	listPropertyFilter?: any;
	listProductSearch?: any;
	listProductSuggest?: any;
}

const MAX_PAGE_SIZE = 20;
const MAX_PRODUCT_WITHOUT_FIX_HEADER = 4;

const ProductSearch: React.FC<IProductSearch> = ({
	listPropertyFilter,
	listProductSearch,
	listProductSuggest,
}) => {
	const route = useRouter();
	const [listFilter, setListFilter] = useState({});
	const [pageIndex, setPageIndex] = useState(Number(route?.query?.page) || 0);

	useEffect(() => {
		if (route?.query?.page) {
			setPageIndex(Number(route?.query?.page));
		} else {
			setPageIndex(0);
		}
	}, [route?.query?.page]);

	const filterElement: any = useRef<HTMLDivElement>(null);

	const { data: listFilterSWR, error: errorListFilter } = !listPropertyFilter?.data
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
				error: listPropertyFilter.error,
		  };

	const { data: listProductSearchSWR, isValidating } = !listProductSearch?.data
		? // eslint-disable-next-line react-hooks/rules-of-hooks
		  useProductSearch(
				'/product/search',
				{
					keyword: route?.query?.k ? `${route?.query?.k}` : '',
					brandIds: route?.query?.brandIds,
					provinceId: route?.query?.provinceId ? Number(route?.query?.provinceId) : undefined,
					districtIds: route?.query?.districtIds,
					filters: route?.query?.filters,
					categoryId: route?.query?.categoryId,
					price: route?.query?.price,
					isValid: true,
					sortType: Number(route?.query?.sortType || 0),
					pageSize: MAX_PAGE_SIZE,
					pageIndex: Number(route?.query?.page) || 0,
					ratingTypes: route?.query?.ratingTypes,
				},
				// { fallbackData: listProductSearch },
		  )
		: {
				data: listProductSearch,
				isValidating: false,
		  };

	useIsomorphicLayoutEffect(() => {
		const handleScrollWindow = () => {
			const position: number = window.scrollY;
			if (listProductSearchSWR?.data?.length > MAX_PRODUCT_WITHOUT_FIX_HEADER) {
				const top = filterElement.current?.getBoundingClientRect().top;

				if (top <= 52 && position > 80) {
					filterElement.current?.classList?.add('sticky-filter');
				} else if (position <= 547) {
					filterElement.current?.classList?.remove(
						'sticky-filter',
						'shadow',
						'absolute',
						'top-[56px]',
						'left-0',
						'shadow',
						'py-2',
					);
				}
			}
		};
		listProductSearchSWR?.data && window.addEventListener('scroll', handleScrollWindow);
		return () => {
			window.removeEventListener('scroll', handleScrollWindow);
		};
	});

	const renderParamURL = (listFilter: ParamSearchProduct, pageIndex?: number) => {
		setListFilter(listFilter);
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
			if (pageIndex) ids += `page=${pageIndex}&`;
		});
		if (Object.keys(newParams).length === 0 || pageIndex === 0) ids += `page=${pageIndex}`;

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

	// useEffect(() => {
	// 	window.scrollTo(0, 0);
	// }, [listProductSearchSWR]);

	const fetchSearchProduct = async (params: ParamSearchProduct) => {
		renderParamURL(params, 0);
	};
	return (
		<>
			<div ref={filterElement} className={classNames(['z-[9] bg-white pt-1 duration-200 w-full '])}>
				<FilterCate.FilterProperty
					isShowFilter={true}
					listPropertyFilter={new ResponseFilterProperty(listFilterSWR?.data || null)}
					handleSearch={(value: any) => fetchSearchProduct(value)}
					keyword={route?.query?.k ? `${route?.query?.k}` : ''}
					query={route?.query}
					sortToolBar={() => (
						<Dropdown
							placeholder='Sắp xếp'
							classNameHeader='w-[200px] h-10'
							data={dataSortDropdown}
							classNameBody='w-[259px] right-0 rounded-3px mt-10px px-0'
							prefixIcon={<ImageCustom src={'/static/svg/Sort.svg'} width={24} height={24} />}
							classNameItem={`text-14 h-10 flex justify-between items-center px-6`}
							iconSelected={<Icon name={IconEnum.Check} size={15} />}
							labelHeaderFixBody='Sắp xếp'
							onChange={(value) => {
								fetchSearchProduct({ ...listFilter, sortType: value.id });
							}}
							// onChange={(value) => sortProduct(value)}
						/>
					)}
					page={pageIndex}
					pageSize={20}
				/>
			</div>

			<RecommendShop
				keyword={route?.query?.k ? `${route?.query?.k}` : ''}
				listMerchant={listFilterSWR?.data?.merchants}
				error={errorListFilter}
			/>

			{(listProductSearchSWR?.data && listProductSearchSWR?.data.length) || isValidating ? (
				<>
					<ProductList
						data={listProductSearchSWR?.data}
						keyword={route?.query?.k ? `${route?.query?.k}` : ''}
						className='!mt-7'
					/>
				</>
			) : listProductSearchSWR?.data?.length === 0 && listFilterSWR?.data?.maxPrice === 0 ? (
				<RecommendProductList
					keyword={route?.query?.k ? `${route?.query?.k}` : ''}
					data={listProductSuggest}
				/>
			) : (
				<div className='mt-3 text-center'>Không có sản phẩm phù hợp</div>
			)}

			{listProductSearchSWR?.data?.length !== 0 ? (
				<div className='container pb-5'>
					<Pagination
						pageSize={MAX_PAGE_SIZE}
						totalObject={listProductSearchSWR?.totalObject}
						page={pageIndex}
						onChange={(page) => {
							renderParamURL(listFilter, page);
						}}
					/>
				</div>
			) : null}
		</>
	);
};

export default ProductSearch;
