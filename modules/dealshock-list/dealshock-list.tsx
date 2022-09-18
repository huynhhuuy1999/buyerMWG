// import classNames from 'classnames';
import { Pagination } from 'components';
// import { dataSortDropdown, Dropdown, ImageCustom, Pagination } from 'components';
import { useIsomorphicLayoutEffect, useProductSearch } from 'hooks';
import { ParamSearchProduct } from 'models';
// import { FilterCate, ResponseFilterProperty } from 'modules';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

// import { Icon, IconEnum } from 'vuivui-icons';
// import { FilterProperty } from '../filterProperty';
import { ProductList } from '../product-list';
import RecommendProductList from '../recommandProductList/recommend-productlist';

export interface IProductSearch {
	listPropertyFilter?: any;
	listProductSearch?: any;
	listProductSuggest?: any;
}

const MAX_PAGE_SIZE = 20;
const MAX_PRODUCT_WITHOUT_FIX_HEADER = 4;

const DealshockList: React.FC<IProductSearch> = ({
	listPropertyFilter,
	listProductSearch,
	listProductSuggest,
}) => {
	const { query, push } = useRouter();

	const [listFilter, setListFilter] = useState({});

	const [pageIndex, setPageIndex] = useState(Number(query?.page) || 0);

	const [tabs, setTabs] = useState<any>([
		{
			id: 1,
			title: 'Đang bán',
			active: true,
		},
		{
			id: 2,
			title: 'Sắp bán',
			active: false,
		},
	]);

	const defaultParams = {
		pageIndex:
			parseInt(query?.pageIndex && !isNaN(+query?.pageIndex) ? query?.pageIndex.toString() : '1') -
			1,
		pageSize: 20,
		flashSaleStatus: 1,
	};

	const [filterParams, setFilterParams] = useState<any>({
		...defaultParams,
	});

	useEffect(() => {
		if (query?.page) {
			setPageIndex(Number(query?.page));
		} else {
			setPageIndex(0);
		}
	}, [query?.page]);

	const filterElement: any = useRef<HTMLDivElement>(null);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: listFilterSWR, error: errorListFilter } = !listPropertyFilter?.data
		? // eslint-disable-next-line react-hooks/rules-of-hooks
		  useProductSearch(
				'/product/searchaggregation',
				query.key
					? {
							keyword: query?.k ? `${query?.k}` : '',
					  }
					: {
							keyword: query?.k ? `${query?.k}` : '',
							isValid: true,
					  },
		  )
		: {
				data: listPropertyFilter,
				error: listPropertyFilter.error,
		  };

	const { data: listProductSearchSWR, isValidating } = !listProductSearch?.data
		? // eslint-disable-next-line react-hooks/rules-of-hooks
		  useProductSearch('/product/search', {
				pageIndex: 0,
				flashSaleStatus: filterParams.flashSaleStatus,
				isFlashSale: true,
				pageSize: 20,
		  })
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
	}, []);

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

		push(
			`/tim-kiem?k=${
				query?.k ? decodeURIComponent(String(query?.k)).replaceAll(' ', '+') : ''
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

	// const fetchSearchProduct = async (params: ParamSearchProduct) => {
	// 	renderParamURL(params, 0);
	// };
	return (
		<>
			{/* <div ref={filterElement} className={classNames(['z-[9] bg-white pt-1 duration-200 w-full '])}>
				<FilterCate.FilterProperty
					isShowFilter={true}
					listPropertyFilter={new ResponseFilterProperty(listFilterSWR?.data || null)}
					handleSearch={(value: any) => fetchSearchProduct(value)}
					keyword={query?.k ? `${query?.k}` : ''}
					query={query}
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
						/>
					)}
					page={pageIndex}
					pageSize={20}
				/>
			</div> */}

			{(listProductSearchSWR?.data && listProductSearchSWR?.data.length) || isValidating ? (
				<>
					<ProductList
						data={listProductSearchSWR?.data}
						keyword={query?.k ? `${query?.k}` : ''}
						className='!mt-7'
						type='deal-shock'
						onChangeTabs={(e: any) => {
							setFilterParams({ ...filterParams, flashSaleStatus: e });
							setTabs(
								tabs.map((item: any) => {
									if (item.id === e) {
										return {
											...item,
											active: true,
										};
									} else
										return {
											...item,
											active: false,
										};
								}),
							);
						}}
						tabs={tabs}
					/>
				</>
			) : listProductSearchSWR?.data?.length === 0 && listFilterSWR?.data?.maxPrice === 0 ? (
				<RecommendProductList keyword={query?.k ? `${query?.k}` : ''} data={listProductSuggest} />
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

export default DealshockList;
