import { Head } from 'components';
import { DeviceType } from 'enums';
import { DefaultLayoutMobile, HomeLayout } from 'layouts';
import { NextPageWithLayout } from 'models';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
	getHomeBanner,
	getHomeBrand,
	getHomeCategory,
	getHomeProductBestSell,
	getHomeProductDeal,
	getHomeProductFeature,
	getHomeProductNewestAPI,
	getHomeProductPromotion,
	getHomeProductSuggest,
	getHomeProductUnique,
	getHomeService,
} from 'services';
import { detectCrawler } from 'utils/crawlers-detect';

import { deviceTypeSelector } from '@/store/reducers/appSlice';

import { useAppSelector } from '../hooks';

let isMobile;
interface HomeProps {
	data: any;
	title: string;
}
const Home = dynamic(() => import('@/modules/home/home')) as React.FC<HomeProps>;
const HomeMobile = dynamic(() => import('@/modules/home/home.mobile')) as React.FC<HomeProps>;

// export const config = { amp: 'hybrid' };

const HomePage: NextPageWithLayout = ({ title, data, ...pageProps }: any) => {
	const deviceType = useAppSelector(deviceTypeSelector);
	const router = useRouter();
	isMobile = pageProps?.deviceType === DeviceType.MOBILE || deviceType === DeviceType.MOBILE;

	useEffect(() => {
		router.beforePopState(({ url, as, options }) => {
			return true;
		});
	}, []);

	return (
		<React.Fragment>
			<Head title={title} />
			{isMobile ? (
				<DefaultLayoutMobile>
					<HomeMobile data={data} title={title} />
				</DefaultLayoutMobile>
			) : (
				<HomeLayout>
					<Home title={title} data={data} />
				</HomeLayout>
			)}
		</React.Fragment>
	);
};

export default HomePage;

export const getServerSideProps: GetServerSideProps | any = async (context: any) => {
	const { req, res, query } = context;

	const isDetecting = detectCrawler(req?.headers?.['user-agent']);

	const seoBotHeaders = req.headers?.['seo-bot-request'];

	res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=300');

	if (seoBotHeaders || isDetecting || query?.bot_crawler) {
		try {
			const bestSeller =
				(await getHomeProductBestSell({ pageIndex: 0, pageSize: 16 }, req).catch((error) => {
					return { data: null };
				})) || {};
			const bestSeller_next =
				(await getHomeProductBestSell({ pageIndex: 1, pageSize: 16 }, req).catch((error) => {
					return { data: null };
				})) || {};
			const category =
				(await getHomeCategory(req).catch((error) => {
					return { data: null };
				})) || {};
			const dealShock =
				(await getHomeProductDeal({ pageIndex: 0, pageSize: 6 }, req).catch((error) => {
					return { data: null };
				})) || {};
			const interestDeal =
				(await getHomeProductPromotion({ pageIndex: 0, pageSize: 8 }, req).catch((error) => {
					return { data: null };
				})) || {};
			const uniqueProduct =
				(await getHomeProductUnique({ pageIndex: 0, pageSize: 6 }, req).catch((error) => {
					return { data: null };
				})) || {};
			const trendingProduct =
				(await getHomeProductFeature({ pageIndex: 0, pageSize: 12 }, req).catch((error) => {
					return { data: null };
				})) || {};
			const recommendProduct =
				(await getHomeProductSuggest({ pageIndex: 0, pageSize: 14 }, req).catch((error) => {
					return { data: null };
				})) || {};
			const newProduct =
				(await getHomeProductNewestAPI({ pageIndex: 0, pageSize: 8 }, req).catch((error) => {
					return { data: null };
				})) || {};
			const brand =
				(await getHomeBrand(req).catch((error) => {
					return { data: null };
				})) || {};
			const service =
				(await getHomeService(req).catch((error) => {
					return { data: null };
				})) || {};
			const banner =
				(await getHomeBanner(req).catch((error) => {
					return { data: null };
				})) || {};

			const [
				bestSellers,
				bestSellersNext,
				categories,
				dealShocks,
				interestDeals,
				uniqueProducts,
				trendingProducts,
				recommendProducts,
				newProducts,
				brands,
				services,
				banners,
			] = await Promise.all([
				bestSeller,
				bestSeller_next,
				category,
				dealShock,
				interestDeal,
				uniqueProduct,
				trendingProduct,
				recommendProduct,
				newProduct,
				brand,
				service,
				banner,
			]);

			return {
				props: {
					data: {
						categories: categories,
						recommendProducts: recommendProducts,
						newProducts: newProducts,
						trendingProducts: trendingProducts,
						bestSellers: bestSellers,
						bestSellersNext: bestSellersNext,
						interestDeals: interestDeals,
						dealShocks: dealShocks?.products || null,
						uniqueProducts: uniqueProducts,
						brands: brands?.data,
						services: services,
						banners: banners,
					},
					title: process.env.NEXT_PUBLIC_DOMAIN_TITLE,
				},
			};
		} catch (error) {
			// console.log(error);
		}
	} else
		return {
			props: {
				data: {
					categories: null,
					recommendProducts: null,
					newProducts: null,
					trendingProducts: null,
					bestSellers: null,
					bestSellersNext: null,
					interestDeals: null,
					dealShocks: null,
					uniqueProducts: null,
					brands: null,
					services: null,
					banners: { data: null },
				},
				title: process.env.NEXT_PUBLIC_DOMAIN_TITLE,
			},
		};
};
