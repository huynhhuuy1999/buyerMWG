import { dataSortDropdownAll, EmptyProduct, ITabs, Pagination, Skeleton } from 'components';
import { useIsomorphicLayoutEffect, useProductSearch, useShopInfo } from 'hooks';
import {
	BannerTemplate,
	CategoryViewModel,
	ParamSearchProduct,
	SessionTemplate,
	ShopInterface,
} from 'models';
import { Category, ShopHeaderMobile } from 'modules';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getProductList, getShopTemplate, requestBlockProduct } from 'services';
import { generatePrettyParams } from 'utils/formatter';
interface Props {
	title?: string;
	data?: any;
}

enum TYPE_SESSION {
	BANNER = 1,
	PRODUCT_PROMOTION = 2,
	PRODUCT_FEATURED = 3,
	CATALOG_SHOP = 4,
	CATALOG_FEATURED = 5,
	PRODUCT_LIST = 2601,
}

interface SearchShop extends ParamSearchProduct {
	keyword?: string;
	pageIndex: number | string;
	session?: string | number;
	searchTypes?: number;
}

interface CategoryShop {
	categoryDetail: CategoryViewModel;
	categoryId: number;
	displayOrder: number;
	isActive: boolean;
	isDelete: boolean;
}
interface IProductProps {
	data?: Array<any>;
	keyword?: string;
	loading?: boolean;
	setShowFilter?: (value: boolean) => void;
	isFilterHeader?: boolean;
	isCustomTitle?: boolean;
	className?: string;
	tabs?: any;
	onChangeTabs?: any;
	sortToolBar?: React.ReactNode;
	filterProperty?: () => React.ReactNode;
	type?: string;
	shopName?: string;
	isMobile?: boolean;
}
interface IBannerComponent {
	data?: BannerTemplate[];
}

const BannerShop = dynamic(
	() => import('modules/shop-banner/banner.mobile'),
) as React.FC<IBannerComponent>;
const ProductListOverFlow = dynamic(
	() => import('modules/product-list/product-list-overflow'),
) as React.FC<IProductProps>;
const ProductList = dynamic(
	() => import('modules/product-list/product-list'),
) as React.FC<IProductProps>;

const DEFAULT_PAGESIZE = 20;

const Shop: React.FC<Props> = () => {
	const { query, push, asPath } = useRouter();

	const defaultParams = {
		pageIndex: parseInt(query?.pageIndex ? query?.pageIndex.toString() : '1'),
		pageSize: 20,
		isFlashSale: false,
		isValid: true,
		categoryId: [],
	};

	const [loadingSession, setLoadingSession] = useState(true);

	const [clicked, setClicked] = useState(0);

	const [pageIndex, setPageIndex] = useState(0);

	const [pageSize] = useState(DEFAULT_PAGESIZE);

	const [querySearch, setQuerySearch] = useState<SearchShop>();

	const [activeTab, setActiveTab] = useState<number | any>(0);

	const [rerenderPagination, setRerenderPagination] = useState(false);

	const [shopMainTemplate, setShopMainTemplate] = useState<SessionTemplate[]>();

	const [response, setResponse] = useState<any>({});

	const [productBlock, setProductBlock] = useState<any>([]);

	const [filterParams, setFilterParams] = useState<SearchShop>({
		...defaultParams,
		pageSize,
	});
	const [shopDetail, setShopDetail] = useState<ShopInterface>();

	const [tabs, setTabs] = useState<ITabs[] | any>();

	const { data, error }: any = useShopInfo(query?.slug_extend?.toString());

	const [manualScroll, setManualScroll] = useState(true);

	// const [isShowFilter, setIsShowFilter] = useState<boolean>(false);

	const [sortList, setSortList] = useState(dataSortDropdownAll);

	const { data: responseProduct }: any = useProductSearch(
		'/product/search',
		{
			...querySearch,
			tabs: null,
			slug_extend: null,
			merchantId: shopDetail?.merchantId,
		},
		{
			fallbackData: [],
		},
	);

	function isInViewport(el: any) {
		const rect = el.getBoundingClientRect();
		let middle = (rect.top + rect.bottom) / 2;
		return middle;
	}

	const allProductBlock = useRef<NodeListOf<Element>>();

	useIsomorphicLayoutEffect(() => {
		allProductBlock.current = window.document
			?.getElementById('shop-all')
			?.querySelectorAll('.shop-detect');
	}, [shopMainTemplate, productBlock, query]);

	useIsomorphicLayoutEffect(() => {
		let arr = allProductBlock.current && [...allProductBlock.current];
		const handleScrollWindow = () => {
			arr?.length && setActiveTab(arr?.find((item: any) => isInViewport(item) > 0)?.id);
		};
		if (manualScroll) {
			window.addEventListener('scroll', handleScrollWindow);
		}
		// return window.removeEventListener('scroll', handleScrollWindow);
	}, [allProductBlock.current]);

	useEffect(() => {
		setRerenderPagination(false);
		if (responseProduct?.data?.length)
			setTimeout(() => {
				setRerenderPagination(true);
			}, 100);
	}, [responseProduct?.data?.length, asPath]);

	const getProducts = async (ids: number[], displayOrder: number) => {
		const res: any = await getProductList({ productIds: ids, pageIndex: 0, pageSize: 20 });
		setResponse((prev: any) => ({
			...prev,
			...{ displayOrder: displayOrder, products: res.data },
		}));
	};

	const getRequestAuto = async (url: string, displayOrder: number) => {
		const res: any = await requestBlockProduct(url + '&pageIndex=0&pageSize=12');
		setResponse((prev: any) => ({
			...prev,
			...{ displayOrder: displayOrder, products: res.data },
		}));
	};

	const getShopMainTemplate = async (id: string) => {
		let productSession: SessionTemplate = {
			apiConfig: 'string',
			auto: false,
			displayOrder: TYPE_SESSION.PRODUCT_LIST,
			name: 'Sản phẩm',
			productIds: [],
			typeSession: TYPE_SESSION.PRODUCT_LIST,
			sortProduct: undefined,
		};

		try {
			const { data, loading } = await getShopTemplate(id);

			if (data) setShopMainTemplate([...data?.sessions, productSession]);
			else setShopMainTemplate([]);
			setLoadingSession(loading);
		} catch (error) {
			push('/404');
		}
	};

	useEffect(() => {
		if (data) {
			setShopDetail(data);
			getShopMainTemplate(data?.merchantRef);
		}
	}, [data]);

	useEffect(() => {
		error && push('/404');
	}, [error]);

	useEffect(() => {
		if (shopMainTemplate) {
			!tabs?.length &&
				setTabs(
					shopMainTemplate
						?.filter((o) => o.typeSession !== TYPE_SESSION.BANNER)
						.map((item: SessionTemplate, index: number) => ({
							id: item.displayOrder,
							title: item.name,
							active: false,
							path: index,
						})),
				);

			for (const item of shopMainTemplate) {
				if (!item.apiConfig && !!!item.auto) return;
				else if (item.typeSession !== TYPE_SESSION.BANNER) {
					if (!!item.apiConfig && item.auto !== null && !!item.auto) {
						getProducts(item?.productIds, item.displayOrder);
					} else getRequestAuto(item.apiConfig, item.displayOrder);
				}
			}
		}
	}, [shopMainTemplate]);

	const onChangeTab = async (tab: number | string) => {
		await setTabs(
			tabs?.map((item: ITabs) => {
				if (item.id.toString() === tab.toString())
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
						if (
							newParams?.['pageIndex']?.toString() === '0' ||
							newParams?.['pageIndex']?.toString() === '1'
						)
							ids += '';
						else ids += `pageIndex=${newParams.pageIndex}&`;
					} else if (key === 'session') {
						ids += '';
					} else if (key === 'sortType') {
						if (newParams['sortType']?.toString() === '0') ids += '';
						else ids += `sortType=${newParams['sortType']}&`;
					} else if (newParams[key] === '') ids += '';
					else ids += `${key}=${encodeURIComponent(newParams[key])}&`;
				}
			}
		});

		push(`/${query.slug_extend}${generatePrettyParams(ids)}`, undefined, {
			shallow: true,
		});
		setPageIndex(filter.pageIndex > 1 ? filter.pageIndex - 1 : 0);

		setQuerySearch({ ...filter, pageIndex: filter.pageIndex > 1 ? filter.pageIndex - 1 : 0 });
	};

	useEffect(() => {
		if (Object.keys(query).length === 1) {
			setFilterParams(defaultParams);
		}
	}, [query?.slug_extend]);

	useEffect(() => {
		if (
			Boolean(
				filterParams?.pageIndex ||
					filterParams?.keyword ||
					filterParams?.filters?.length ||
					filterParams?.brandIds?.length ||
					filterParams?.price?.length ||
					filterParams?.provinceId,
			)
		)
			renderParamURL({ ...query, ...filterParams });
		else renderParamURL(defaultParams);
	}, [filterParams]);

	useEffect(() => {
		if (shopMainTemplate && productBlock?.length <= shopMainTemplate?.length)
			if (response?.products?.length) setProductBlock([...productBlock, response]);
	}, [response]);

	useEffect(() => {
		activeTab !== undefined && onChangeTab(activeTab);
	}, [activeTab, manualScroll]);

	useLayoutEffect(() => {
		window.scrollTo({
			// behavior: 'smooth',
			top: (document?.getElementById(clicked.toString())?.offsetTop || 0) - 80,
		});
		setTimeout(() => {
			setManualScroll(true);
		}, 50);
	}, [clicked, manualScroll]);

	const handleSearch = (e: any) => {
		e &&
			setTabs(
				tabs?.map((item: ITabs) => {
					return {
						...item,
						active: false,
					};
				}),
			);
		setFilterParams({ ...filterParams, keyword: e, pageIndex: 0, session: e ? 0 : activeTab });
		setActiveTab(tabs?.find((tab: ITabs) => tab.id === TYPE_SESSION.PRODUCT_LIST)?.id);
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

	useEffect(() => {
		onSelectSortType(
			parseInt(
				query?.['sortType'] && query?.['sortType']?.toString() !== '0'
					? query?.['sortType']?.toString()
					: '0',
			),
		);
	}, [query]);

	// const { data: listFilterSWR } = useProductSearch(
	// 	'/product/searchaggregation',

	// 	query.key
	// 		? {
	// 				keyword: query?.k ? `${query?.k}` : '',
	// 				merchantId: shopDetail?.merchantId,
	// 		  }
	// 		: {
	// 				keyword: query?.k ? `${query?.k}` : '',
	// 				isValid: true,
	// 				merchantId: shopDetail?.merchantId,
	// 				// brandIds: query?.brandIds,
	// 				// categoryId: route?.query?.categoryId,
	// 		  },
	// 	{ fallbackData: [] },
	// );

	const Skeletons = (
		<div className='container'>
			<div className='grid  grid-cols-2 gap-4  pb-10'>
				{[...new Array(8)].map((_, index) => {
					return (
						<Skeleton.Skeleton
							key={index}
							cardType={Skeleton.CardType.square}
							type='card'
							width={'100%'}
							height={200}
							isDescription
						></Skeleton.Skeleton>
					);
				})}
			</div>
		</div>
	);

	return (
		<div id='shop-all' className='min-h-[88vh] overflow-x-auto bg-E5E5E5'>
			<Head>
				<title>
					{shopDetail?.name
						? `${shopDetail?.name} | ${process.env.NEXT_PUBLIC_DOMAIN_TITLE} `
						: process.env.NEXT_PUBLIC_DOMAIN_TITLE}
				</title>
			</Head>

			<ShopHeaderMobile
				loading={!shopDetail}
				data={shopDetail}
				onChangeTabs={(e) => {
					setActiveTab(e);
					setClicked(e);
					setFilterParams({ ...filterParams, keyword: '' });
				}}
				tabs={tabs}
				onSearch={(e) => {
					handleSearch(e);
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}}
				keyword={querySearch?.keyword || ''}
			/>

			{shopMainTemplate?.length ? (
				<>
					{querySearch?.keyword ? (
						<div className=' bg-white'>
							<div className='relative'>
								<div className='container'>
									<ProductList
										isFilterHeader={true}
										data={responseProduct?.data}
										// setShowFilter={() => setShowFilter(!showFilter)}
										keyword={querySearch?.keyword}
										shopName={shopDetail?.name}
										isMobile
									/>

									{rerenderPagination && (
										<Pagination
											pageSize={20}
											totalObject={responseProduct?.totalObject}
											page={pageIndex}
											onChange={(pageIndex) => {
												setFilterParams({ ...filterParams, pageIndex: pageIndex });
												window?.scrollTo({
													top: 100,
													behavior: 'smooth',
												});
											}}
										/>
									)}
								</div>
							</div>
						</div>
					) : shopMainTemplate ? (
						shopMainTemplate.map((item, index) => {
							if (item.typeSession === TYPE_SESSION.BANNER)
								return (
									<div key={index} className='-mb-6'>
										<BannerShop
											data={shopMainTemplate
												?.find((item: SessionTemplate) => item?.typeSession === TYPE_SESSION.BANNER)
												?.bannerConfigs?.map((item: BannerTemplate, index: number) => ({
													description: 'banner homepage',
													displayOrder: item?.displayOrder,
													id: index,
													imageUrl: item?.urlBanner,
													objectId: index,
													objectType: 'string',
													type: item?.typeBanner,
												}))}
										/>
									</div>
								);
							else if (item.typeSession === TYPE_SESSION.CATALOG_SHOP)
								return (
									<div
										id={item.displayOrder.toString()}
										key={index}
										className='shop-detect my-[5px] overflow-auto bg-white'
									>
										<div className='container flex pt-3 pb-4'>
											<h2 className='font-sfpro_semiBold text-14 text-333333 '>{item.name}</h2>
										</div>
										<div key={index}>
											<Category
												data={
													productBlock?.find(
														(o: SessionTemplate) => o?.displayOrder === item?.displayOrder,
													)?.products ||
													shopMainTemplate
														?.find(
															(item: SessionTemplate) =>
																item?.typeSession === TYPE_SESSION.CATALOG_SHOP,
														)
														?.shopCatalogs?.map((item: CategoryShop) => ({
															...item.categoryDetail,
														}))
												}
												isHeader={false}
												isNotFetchApiHome={true}
											/>
										</div>
									</div>
								);
							else
								return (
									<div className='mb-[5px] bg-white '>
										<div className='container flex pt-3 pb-4'>
											<h2 className='font-sfpro_semiBold text-14 text-333333 '>{item.name}</h2>
										</div>
										<div
											id={item.displayOrder.toString()}
											key={index}
											className='shop-detect overflow-auto'
										>
											<ProductListOverFlow
												data={
													productBlock?.find(
														(o: SessionTemplate) => o?.displayOrder === item?.displayOrder,
													)?.products || []
												}
												isFilterHeader={false}
												isMobile
												type='shop'
												loading={Boolean(shopMainTemplate)}
											/>
										</div>
										{productBlock?.find(
											(o: SessionTemplate) => o?.displayOrder === item?.displayOrder,
										)?.products?.length > 0 && (
											<p className='flex items-center justify-center gap-1 pb-4 text-center text-14 text-[#126BFB]'>
												Xem thêm
												<img
													className='h-6 w-3'
													src='/static/svg/chevron-right-126bfb.svg'
													alt=''
												/>
											</p>
										)}
									</div>
								);
						})
					) : (
						<div className='my-4 bg-white'>{Skeletons}</div>
					)}
				</>
			) : loadingSession ? (
				<div className='my-4 bg-white'>{Skeletons}</div>
			) : (
				<EmptyProduct height={'20vh'} title={'Không có sản phẩm'} />
			)}
		</div>
	);
};

export default Shop;
