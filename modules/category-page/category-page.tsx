import classNames from 'classnames';
import {
	Breadcrumb,
	dataSortDropdown,
	dataSortDropdownAll,
	Dropdown,
	ImageCustom,
	ITabs,
	Pagination,
} from 'components';
import { OPTION_TYPE_FILTER_MODULE } from 'enums';
import { useIsomorphicLayoutEffect, useProductSearch } from 'hooks';
import { CategoryViewModel, IBrand, ParamSearchProduct, Product } from 'models';
import { Category, FilterCate, ProductList, ResponseFilterProperty } from 'modules';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { generatePrettyParams } from 'utils';
import { Icon, IconEnum } from 'vuivui-icons';

interface Props {
	category?: CategoryViewModel;

	brands?: Array<IBrand>;
	products?: {
		data: Product[];
		totalObject: number;
	};
	listPropertyFilter?: any;
	categoryIds: Array<number>;
}
const TAB_ENUM = {
	ALL: 0,
	PROMOTION: 1,
	SELLING: 2,
};

const DEFAULT_SORT_TYPE = 0;

const CategoryPage: React.FC<Props> = ({
	category,
	products,
	brands: propBrands,
	listPropertyFilter,
	categoryIds,
}: // queryFilter,

Props) => {
	const [sortList, setSortList] = useState(dataSortDropdownAll);

	const { query, push, asPath } = useRouter();

	const [isShowFilter, setIsShowFilter] = useState<boolean>(false);

	const [pageIndex, setPageIndex] = useState(0);

	const [checkScroll, setCheckScroll] = useState<number>(0);

	const [responseFilterSearch, setResponseFilterSearch] = useState(
		new ResponseFilterProperty(null),
	);

	const [tabs, setTabs] = useState<ITabs[]>([
		{
			id: TAB_ENUM.ALL,
			title: 'Tất cả',
			active: true,
			path: '',
		},
		{
			id: TAB_ENUM.PROMOTION,
			title: 'Có khuyến mãi',
			active: false,
			path: '',
		},
		{
			id: TAB_ENUM.SELLING,
			title: 'Bán chạy',
			active: false,
			path: '',
		},
	]);

	let timeOutSetState: null | NodeJS.Timeout = null;

	let defaultParams = {
		pageIndex:
			parseInt(query?.pageIndex && !isNaN(+query?.pageIndex) ? query?.pageIndex.toString() : '1') -
			1,
		pageSize: 20,
	};

	const [rerenderPagination, setRerenderPagination] = useState(true);

	const [params, setParams] = useState<ParamSearchProduct | any>({ ...defaultParams });

	const [filterParams, setFilterParams] = useState<any>({
		...defaultParams,
	});

	const filterElement: any = useRef(null);
	const filter_ref: any = useRef(null);
	// const TimeoutScroll: null | NodeJS.Timeout = null;

	useIsomorphicLayoutEffect(() => {
		const handleScrollWindow = () => {
			const position: number = window.scrollY;
			if (filterElement.current?.getBoundingClientRect().top < 52) {
				filterElement.current?.classList?.add(
					'absolute',
					'top-0',
					'left-0',
					'shadow',
					'pt-[11px]',
					'pb-2',
				);
				if (isShowFilter) filter_ref && filter_ref.current?.closeModalFilter();
			}

			if (filterElement.current?.getBoundingClientRect().top <= 52 && position > checkScroll) {
				filterElement.current?.classList?.add('sticky-filter');
				filterElement.current?.classList?.remove('absolute', 'top-0', 'left-0');
			} else if (position <= checkScroll) {
				filterElement.current?.classList?.remove(
					'sticky-filter',
					'absolute',
					'top-0',
					'left-0',
					'shadow',
					'pt-[11px]',
					'pb-2',
				);
			}
		};

		isShowFilter &&
			responseFilterSearch.maxPrice &&
			window.addEventListener('scroll', handleScrollWindow);

		return () => window.removeEventListener('scroll', handleScrollWindow);
	}, [checkScroll, isShowFilter]);

	const onChangeTab = (tab: number) => {
		setTabs(
			tabs.map((item) => {
				if (item.id === tab)
					return {
						...item,
						active: true,
					};
				return {
					...item,
					active: false,
				};
			}),
		);
	};

	const onSelectSortType = (id: number) => {
		setSortList(
			sortList?.map((item: any) => {
				if (item.id === id) {
					return {
						...item,
						selected: true,
					};
				}
				return {
					...item,
					selected: false,
				};
			}),
		);
	};

	const { data: filterSearch } = listPropertyFilter?.data
		? { data: listPropertyFilter }
		: // eslint-disable-next-line react-hooks/rules-of-hooks
		  useProductSearch(
				'/product/searchaggregation',
				{ keyword: query.k ?? '', categoryId: categoryIds },
				{ isPaused: () => !categoryIds.length },
		  );

	useEffect(() => {
		if (filterSearch && !filterSearch.isError) {
			setResponseFilterSearch(new ResponseFilterProperty(filterSearch.data));
		}
	}, [filterSearch]);

	const isFetchData: boolean = !!categoryIds.length && Object.keys(query).length > 0 && !!params;

	const { data: responseProduct, isValidating: isLoading }: any = products
		? { data: products }
		: // eslint-disable-next-line react-hooks/rules-of-hooks
		  useProductSearch(
				'/product/search',

				{
					...params,
					categoryId: categoryIds,
					brandIds: query?.brandIds,
					provinceId: query?.provinceId ? Number(query?.provinceId) : undefined,
					districtIds: query?.districtIds,
					filters: query?.filters,
					keyword: query?.k ?? '',
				},

				{
					isPaused: () => !isFetchData,
				},
		  );

	const renderParamURL = (filter: ParamSearchProduct | any) => {
		let ids = '';
		const newParams: ParamSearchProduct = Object.assign({}, filter);

		Object.keys(newParams).map((key) => {
			if (!['isValid', 'slug_extend', 'isFlashSale', 'pageSize'].includes(key)) {
				if (Array.isArray(filter[key])) {
					filter[key].forEach((item: any) => {
						ids += `${key}=${encodeURIComponent(item)}&`;
					});
				} else {
					if (key === 'pageIndex') {
						if (newParams?.['pageIndex'] == 1 || newParams?.['pageIndex'] == 0) ids += '';
						else ids += `pageIndex=${newParams.pageIndex}&`;
					} else if (key === 'searchTypes') {
						if (newParams['searchTypes'] === '0') ids += '';
						else ids += `searchTypes=${newParams['searchTypes']}&`;
					} else if (key === 'sortType') {
						if (newParams['sortType']?.toString() === '0') ids += '';
						else ids += `sortType=${newParams['sortType']}&`;
					} else ids += `${key}=${encodeURIComponent(newParams[key])}&`;
				}
			}
		});

		push(`/${query.slug_extend}${generatePrettyParams(ids)}`, undefined, {
			shallow: true,
		});

		if (timeOutSetState) clearTimeout(timeOutSetState);
		timeOutSetState = setTimeout(() => {
			setParams({
				...filter,
				pageIndex: parseInt(filter?.pageIndex ? filter?.pageIndex.toString() : '1') - 1,
			});
			setPageIndex(parseInt(filter?.pageIndex ? filter?.pageIndex.toString() : '1') - 1);
		}, 100);

		onChangeTab(
			parseInt(filterParams?.['searchTypes'] !== '0' ? filterParams?.['searchTypes'] : '0'),
		);

		onSelectSortType(
			parseInt(filterParams?.['sortType'] !== '0' ? filterParams?.['sortType'] : '0'),
		);
	};

	useEffect(() => {
		let newQuery = { ...query };
		newQuery.slug_extend && delete newQuery.slug_extend;
		if (filterParams) {
			renderParamURL({ ...newQuery, ...filterParams, pageIndex: filterParams?.pageIndex + 1 });
		} else renderParamURL(defaultParams);
	}, [filterParams]);

	useEffect(() => {
		onChangeTab(
			parseInt(
				query?.['searchTypes'] && query?.['searchTypes']?.toString() !== '0'
					? query?.['searchTypes']?.toString()
					: '0',
			),
		);
		onSelectSortType(
			parseInt(
				query?.['sortType'] && query?.['sortType']?.toString() !== '0'
					? query?.['sortType']?.toString()
					: '0',
			),
		);
	}, [query]);

	useEffect(() => {
		setRerenderPagination(false);
		if (responseProduct?.data?.length || products?.data?.length) {
			const Timeouts: NodeJS.Timeout = setTimeout(() => {
				setRerenderPagination(true);
			}, 100);
			return () => {
				Timeouts && clearTimeout(Timeouts);
			};
		}
	}, [responseProduct?.data?.length, products?.data?.length, asPath]);

	const scrollTopPage = useMemo(() => {
		let top = 500;
		if (propBrands) {
			if (!propBrands?.length) top -= 300;
		}
		if (category) {
			if (!category.children?.length) top -= 145;
		}

		return top;
	}, [propBrands, category]);

	useEffect(() => {
		if (propBrands?.length && category?.children?.length) {
			setCheckScroll(547);
		} else if (!propBrands?.length && category?.children?.length) {
			setCheckScroll(256);
		} else if (propBrands?.length && !category?.children?.length) {
			setCheckScroll(393);
		} else setCheckScroll(160);
	}, [category?.children, propBrands, query]);

	const filterProperty = () => {
		if (responseFilterSearch?.maxPrice)
			return (
				<div
					ref={filterElement}
					className={classNames([
						'z-[9] bg-white w-full duration-200 ',
						isShowFilter ? 'max-h-full  pt-1' : 'max-h-0',
					])}
				>
					<FilterCate.FilterProperty
						ref={filter_ref}
						isShowFilter={isShowFilter}
						listPropertyFilter={responseFilterSearch}
						query={query}
						option={OPTION_TYPE_FILTER_MODULE.MODAL}
						page={pageIndex}
						pageSize={20}
						handleSearch={(value: ParamSearchProduct) => {
							const BasePage = { pageIndex: 0, pageSize: 20 };
							if (Object.keys(value).length > 0) setFilterParams({ ...value, ...BasePage });
							else setFilterParams(null);
							window?.scrollTo({
								top: scrollTopPage,
								behavior: 'smooth',
							});
						}}
					/>
				</div>
			);
		return null;
	};

	return (
		<div className='relative mb-10'>
			<div className='container'>
				<Breadcrumb />
			</div>

			{category?.children?.length ? (
				<Category data={category?.children} isHeader={false} isNotFetchApiHome={true} />
			) : null}

			{/* {propBrands?.length ? (
				<Brand
					isNotFooter
					loading={isLoading}
					data={propBrands || []}
					isNotFetchApiAll
					isNotHeader={true}
					className='mt-0 bg-light-F2F2F2 pt-0'
				/>
			) : null} */}

			<div className=' bg-white'>
				<div className='relative'>
					<div className='container'>
						<ProductList
							filterProperty={filterProperty}
							isFilterHeader={true}
							data={responseProduct?.data || products?.data}
							setShowFilter={() => setIsShowFilter(!isShowFilter)}
							onChangeTabs={(e: any) => {
								setFilterParams({ ...filterParams, searchTypes: e });
							}}
							isLoading={isLoading}
							tabs={tabs}
							sortToolBar={
								<Dropdown
									placeholder='Sắp xếp'
									classNameHeader='w-[200px] h-10'
									data={dataSortDropdown}
									classNameBody='w-[259px] right-0 rounded-3px mt-10px px-0 z-10'
									prefixIcon={<ImageCustom src={'/static/svg/Sort.svg'} width={24} height={24} />}
									classNameItem={`text-14 h-10 flex justify-between items-center px-6`}
									iconSelected={<Icon name={IconEnum.Check} size={15} />}
									labelHeaderFixBody='Sắp xếp'
									defaultValue={params.sortType ?? DEFAULT_SORT_TYPE}
									onChange={(value) =>
										setFilterParams({
											...filterParams,
											pageIndex: 0,
											sortType: value.id,
											searchTypes: 0,
										})
									}
								/>
							}
						/>

						{rerenderPagination && (
							<Pagination
								pageSize={20}
								totalObject={responseProduct?.totalObject || products?.totalObject}
								page={pageIndex}
								onChange={(pageIndex) => {
									setFilterParams({ ...filterParams, pageIndex: pageIndex });
									window?.scrollTo({
										top: scrollTopPage,
										behavior: 'smooth',
									});
								}}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(CategoryPage);
