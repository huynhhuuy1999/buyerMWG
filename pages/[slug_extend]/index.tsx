import { Head, LoadingCustom } from 'components';
import { TITLE } from 'constants/';
import { CATEGORY_LAYOUT_TYPE, DeviceType } from 'enums';
import { useAppSelector } from 'hooks';
import { DefaultLayout, DefaultLayoutMobile } from 'layouts';
import _ from 'lodash';
import { CategoryViewModel } from 'models';
import { CategoryPageTemplate } from 'modules/category-page/entities';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { fetchConfigLayoutCateGory, getAllCategoryApi, getCatalog } from 'services';
import { wrapper } from 'store';
import { categoriesSelector } from 'store/reducers/categorySlide';
import { SWRConfig } from 'swr';
import { CapitalizeText, detectCrawler, fetchingDataServer } from 'utils';
const CategoryPage = dynamic(() => import('@/modules/category-page/category-page'));
const CategoryPageMobile = dynamic(() => import('@/modules/category-page/category-page.mobile'));

const Shop = dynamic(() => import('@/modules/shop/shop'));
const ShopMobile = dynamic(() => import('@/modules/shop/shop.mobile'));

const DealShock = dynamic(() => import('@/modules/dealshock-list/dealshock-list'));
const DealShockMobile = dynamic(() => import('@/modules/dealshock-list/dealshock-list.mobile'));
// const Notification = dynamic(() => import('components/Notification'));

enum PageType {
	CATEGORY = 'category',
	SHOP = 'shop',
	DEAL_SHOCK = 'deal-shock',
}

// const NUMBER_NO_SKELETON = 3;

const DynamicPage = ({ fallback, query, deviceType }: any) => {
	const categories = useAppSelector(categoriesSelector);

	const { catalog, shortenAll } = fallback ? fallback : categories;

	const { query: queryRouter, asPath } = useRouter();

	const [colLayout, setColLayout] = useState<number>(0);

	const [pageType, setPageType] = useState<string>(
		asPath?.includes('bot_crawler') ? PageType.CATEGORY : '',
	);

	const [DataCategoryPage, setDataCategoryPage] = useState<Record<string, any>>(
		new CategoryPageTemplate(null),
	);

	useEffect(() => {
		if (shortenAll?.length) {
			setTimeout(() => {
				if (shortenAll?.find((t: any) => t.value === query?.slug_extend)) {
					setPageType(PageType.CATEGORY);
				} else if (asPath === '/deal-shock') {
					setPageType(PageType.DEAL_SHOCK);
				} else {
					setPageType(PageType.SHOP);
				}
			}, 100);
		} else {
			setPageType('');
		}
	}, [shortenAll, asPath, deviceType]);

	useEffect(() => {
		const initDataPage = async () => {
			if (fallback) {
				setDataCategoryPage(
					new CategoryPageTemplate({
						category: fallback.category,
						title: fallback.category.name,
					}),
				);
				deviceType === DeviceType.MOBILE && configLayout(fallback.category.id);
			} else {
				const newCate = findCategory(catalog, queryRouter?.slug_extend?.toString());

				if (newCate.id) {
					setDataCategoryPage(
						new CategoryPageTemplate({
							category: newCate,
							title: newCate.name,
						}),
					);
				}
				deviceType === DeviceType.MOBILE && configLayout(newCate.id);
			}
		};
		initDataPage();
	}, [queryRouter?.slug_extend, catalog, deviceType]);

	const configLayout = async (id: number) => {
		const resp = await fetchConfigLayoutCateGory(id);

		if (!resp.isError) {
			setColLayout(resp.data[0]?.configs?.displayColumn || CATEGORY_LAYOUT_TYPE.OPTION_TWO);
		}
	};

	const renderTitle = (
		value: string = '' + process.env.NEXT_PUBLIC_DOMAIN_TITLE,
		isPageCategory: boolean = true,
	) => {
		return `${
			isPageCategory ? TITLE.CATEGORY + ' ' + value : process.env.NEXT_PUBLIC_DOMAIN_TITLE
		} | ${process.env.NEXT_PUBLIC_DOMAIN_TITLE}`;
	};

	const title =
		pageType === PageType.CATEGORY
			? fallback
				? renderTitle(fallback?.category?.name)
				: renderTitle(DataCategoryPage.title)
			: renderTitle(process.env.NEXT_PUBLIC_DOMAIN_TITLE, false);

	const Loading =
		deviceType === DeviceType.DESKTOP ? (
			<DefaultLayout>
				<LoadingCustom />
			</DefaultLayout>
		) : (
			<DefaultLayoutMobile>
				<LoadingCustom />
			</DefaultLayoutMobile>
		);

	const isRenderPage = deviceType === DeviceType.MOBILE ? colLayout === 0 || !pageType : !pageType;

	return (
		<React.Fragment>
			<Head title={CapitalizeText(title)} />

			<SWRConfig value={fallback}>
				{isRenderPage ? (
					Loading
				) : pageType === PageType.CATEGORY ? (
					deviceType === DeviceType.DESKTOP ? (
						<DefaultLayout>
							<CategoryPage
								category={DataCategoryPage.category}
								categoryIds={DataCategoryPage.setCategoryIds()}
								products={fallback?.products}
								listPropertyFilter={fallback?.listPropertyFilter}
							/>
						</DefaultLayout>
					) : (
						<DefaultLayoutMobile>
							<CategoryPageMobile
								listPropertyFilter={fallback?.listPropertyFilter}
								categoryIds={DataCategoryPage.setCategoryIds()}
								category={DataCategoryPage.category}
								colLayout={colLayout}
								products={fallback?.products}
							/>
						</DefaultLayoutMobile>
					)
				) : pageType === PageType.SHOP ? (
					deviceType === DeviceType.DESKTOP ? (
						<DefaultLayout>
							<Shop />
						</DefaultLayout>
					) : (
						<ShopMobile />
					)
				) : pageType === PageType.DEAL_SHOCK ? (
					deviceType === DeviceType.DESKTOP ? (
						<DefaultLayout>
							<DealShock />
						</DefaultLayout>
					) : (
						<DefaultLayoutMobile>
							<DealShockMobile />
						</DefaultLayoutMobile>
					)
				) : (
					Loading
				)}
			</SWRConfig>
		</React.Fragment>
	);
};

export default DynamicPage;

// const responseBrands = async (value: Array<interCategory> | number) => {
//  try {
//      const responseBrands = isArray(value)
//          ? await Promise.all(
//                  value?.map(async (item: interCategory) => await getBrandRange(item.id)),
//            ).then((values) => values)
//          : await getBrandRange(value);

//      return responseBrands?.reduce(
//          (total: Array<interBrand>, item: interBrand) => _.concat(total, item),
//          [],
//      );
//  } catch (error) {
//      return [];
//  }
// };

// const initBrands = async (data: CategoryViewModel) => {
//  let newBrands: Array<interBrand> = [];

//  if (data.level !== CATEGORY_LEVEL.LEVEL_1 && data.level !== CATEGORY_LEVEL.LEVEL_2) {
//      const response = await responseBrands(data.id);
//      newBrands = [...newBrands].concat(response);
//  } else if (data.children && data.children.length) {
//      for (const key of data.children) {
//          const response = await responseBrands(key.children);
//          newBrands = [...newBrands].concat(response).concat(await initBrands(key));
//      }
//  }

//  return newBrands;
// };

const findCategory = (data: Array<CategoryViewModel>, url?: string): CategoryViewModel => {
	let result: any = {};
	if (data && Array.isArray(data)) {
		for (const key of data) {
			if (url === key?.urlSlug) {
				return key;
			} else if (key?.children && key?.children?.length) {
				const data = findCategory(key.children, url);
				if (data.id) {
					return data;
				}
			}
		}
	}
	return result;
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
	(store) => async (context) => {
		const { req, res, query } = context;
		const deviceType = store?.getState()?.app?.device;
		const isDetecting = detectCrawler(req?.headers?.['user-agent'] || '');

		const seoBotHeaders = req.headers?.['seo-bot-request'];

		if (seoBotHeaders || isDetecting || query?.bot_crawler === 'true') {
			let filter = { ...query };
			delete filter?.bot_crawler;
			res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=300');

			const getAllCategory =
				(await getAllCategoryApi(req).catch(() => {
					return { data: [] };
				})) || {};

			const getAllCatalog =
				(await getCatalog(req).catch(() => {
					return { data: [] };
				})) || {};

			const [allCategory, catalog] = await Promise.all([getAllCategory, getAllCatalog]);

			const responseCategory = allCategory?.data.find(
				(t: any) => t.urlSlug === filter?.slug_extend,
			);

			delete filter?.slug_extend;
			const listFilterProperty =
				(await fetchingDataServer({
					method: 'GET',
					url: `/product/searchaggregation`,
					configs: {
						req,
						params: {
							isValid: true,
							categoryId: responseCategory?.id,
						},
					},
				}).catch((error) => {
					return { data: [] };
				})) || {};

			const productList =
				(await fetchingDataServer({
					method: 'GET',
					url: '/product/search',
					configs: {
						req,
						params: {
							categoryId: responseCategory?.id,
							isValid: true,
							brandIds: query?.brandIds,
							provinceId: query?.provinceId ? Number(query?.provinceId) : undefined,
							districtIds: query?.districtIds,
							filters: query?.filters,
						},
					},
				}).catch(() => {
					return { data: [] };
				})) || {};

			return {
				props: {
					fallback: {
						listAll: allCategory.data,
						catalog: catalog,
						products: productList,
						listPropertyFilter: listFilterProperty,
						shortenAll: allCategory.data?.map((item: CategoryViewModel) => ({
							id: item?.id,
							value: item?.urlSlug,
							name: item?.name,
						})),
						deviceType,
						category: responseCategory ?? null,
						loading: !responseCategory,
					},
					query: query,
				},
			};
		} else
			return {
				props: {
					deviceType,
					fallback: null,
					query: query,
				},
			};
	},
);
