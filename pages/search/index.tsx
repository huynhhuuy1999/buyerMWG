import { Head } from 'components';
import { DeviceType } from 'enums';
import { DefaultLayout, DefaultLayoutMobile } from 'layouts';
import moment from 'moment';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { wrapper } from 'store';
import { detectCrawler } from 'utils/crawlers-detect';
import { CapitalizeText } from 'utils/formatter';
import { fetchingDataServer } from 'utils/requestServer';

import { IProductSearch, IProductSearchMobile } from '@/modules/productSearch';

interface ISearch {
	deviceType?: DeviceType;
	data?: any;
}

const ProductSearch = dynamic(
	() => import('@/modules/productSearch/ProductSearch'),
) as React.FC<IProductSearch>;
const ProductSearchMobile = dynamic(
	() => import('@/modules/productSearch/ProductSearch.mobile'),
) as React.FC<IProductSearchMobile>;

const Search: NextPage<ISearch> = ({ deviceType, data }) => {
	const route = useRouter();

	return (
		<>
			<Head
				title={CapitalizeText(
					`${route?.query?.k} - Tháng ${moment().format('MM')}, ${moment().format('YYYY')} | ${
						process.env.NEXT_PUBLIC_DOMAIN_TITLE
					}`,
				)}
			/>
			{deviceType === DeviceType.MOBILE ? (
				<DefaultLayoutMobile>
					<ProductSearchMobile
						listProductSearch={data?.listProduct}
						listPropertyFilter={data?.listFilterProperty}
					/>
				</DefaultLayoutMobile>
			) : (
				<DefaultLayout>
					<ProductSearch
						listProductSearch={data?.listProduct}
						listPropertyFilter={data?.listFilterProperty}
						listProductSuggest={data?.listRecommentSuggestProduct}
					/>
				</DefaultLayout>
			)}
		</>
	);
};

export const getServerSideProps: GetServerSideProps<any, any> = wrapper.getServerSideProps(
	(store) => async (ctx: any) => {
		const { req, res, query } = ctx;
		const deviceType = store?.getState()?.app?.device;
		const isDetecting = detectCrawler(req?.headers?.['user-agent']);
		const seoBotHeaders = req?.headers?.['seo-bot-request'];

		if (seoBotHeaders || isDetecting || query?.bot_crawler === 'true') {
			try {
				res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
				const listProductSearch =
					(await fetchingDataServer({
						method: 'GET',
						url: `/product/search`,
						configs: {
							req,
							params: {
								keyword: query?.k,
								brandIds: query?.brandIds,
								provinceId: query?.provinceId ? Number(query?.provinceId) : undefined,
								districtIds: query?.districtIds,
								filters: query?.filters,
								categoryId: query?.categoryId,
								price: query?.price,
								isValid: true,
								pageIndex: Number(query?.page) || 0,
								pageSize: 20,
								sortType: Number(query?.sortType) || 0,
								ratingTypes: query?.ratingTypes,
								page: query?.page || 0,
							},
						},
					}).catch(() => {
						return { data: [] };
					})) || {};
				const listFilterProperty =
					(await fetchingDataServer({
						method: 'GET',
						url: `/product/searchaggregation`,
						configs: {
							req,
							params: query.k
								? {
										keyword: query?.k ? `${query?.k}` : '',
								  }
								: {
										keyword: query?.k ? `${query?.k}` : '',
										isValid: true,
								  },
						},
					}).catch(() => {
						return { data: [] };
					})) || {};
				let listRecommendSuggestProduct: any = {};
				if (listProductSearch.data && listProductSearch.data.length === 0) {
					listRecommendSuggestProduct =
						(await fetchingDataServer({
							method: 'GET',
							url: `/product/homesuggestion`,
							configs: {
								req,
								params: {
									pageIndex: 0,
									pageSize: 20,
								},
							},
						}).catch(() => {
							return { data: [] };
						})) || {};
				}
				// const [listProductSearchData, listFilterPropertyData] = await Promise.all([
				// 	listProductSearch,
				// 	listFilterProperty,
				// ]);
				return {
					props: {
						data: {
							listProduct: listProductSearch,
							listFilterProperty: listFilterProperty,
							listRecommentSuggestProduct: listRecommendSuggestProduct,
						},
						deviceType,
					},
				};
			} catch (error) {
				props: {
					data: {
					}
					deviceType;
				}
			}
		} else {
			return {
				props: {
					data: {
						listProduct: {},
						listFilterProperty: {},
						listRecommentSuggestProduct: {},
					},
					deviceType,
				},
			};
		}
	},
);
export default Search;
