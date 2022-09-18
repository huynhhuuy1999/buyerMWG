import { useAmp } from 'next/amp';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import { NavigatorBottomTabMobile } from '../navigator-bottom-tabs';

interface HomeSessionProps {
	data: any;
}

const CategoryMobile = dynamic(
	() => import('../category/category.mobile'),
) as React.FC<HomeSessionProps>;
const BannerMobile = dynamic(
	() => import('../home-banner/banner.mobile'),
) as React.FC<HomeSessionProps>;
const RecommendProductMobile = dynamic(
	() => import('../home-recommend-product/recommend-product.mobile'),
) as React.FC<HomeSessionProps>;
const DealShockMobile = dynamic(() => import('../home-deal-shock/deal-shock.mobile'), {
	ssr: false,
}) as React.FC<HomeSessionProps>;
// const LiveStreamMobile = dynamic(() => import('../live-stream/live-stream.mobile')) as React.FC<HomeSessionProps>;
const BestSellerMobile = dynamic(
	() => import('../home-best-seller/best-seller.mobile'),
) as React.FC<HomeSessionProps>;
const InterestDealMobile = dynamic(
	() => import('../home-interest-deal/interest-deal.mobile'),
) as React.FC<HomeSessionProps>;
const UniqueProductMobile = dynamic(
	() => import('../home-unique-product/unique-product.mobile'),
) as React.FC<HomeSessionProps>;
const TrendingProductMobile = dynamic(
	() => import('../home-trending-product/trending-product.mobile'),
) as React.FC<HomeSessionProps>;
// const ServiceMobile = dynamic(() => import('../home-service/service.mobile')) as React.FC<HomeSessionProps>;
const BrandMobile = dynamic(
	() => import('../home-brands/brand.mobile'),
) as React.FC<HomeSessionProps>;
const NewProductMobile = dynamic(
	() => import('../home-new-product/new-product.mobile'),
) as React.FC<HomeSessionProps>;
const NewProductAMP = dynamic(
	() => import('../home-new-product/new-product.amp'),
) as React.FC<HomeSessionProps>;

const Home: React.FC | any = ({ data }: any) => {
	const isAmp = useAmp();
	return (
		<div className='relative bg-E5E5E5 pt-[64px]'>
			<Head>
				<title>{process.env.NEXT_PUBLIC_DOMAIN_TITLE}</title>
				<meta name='description' content='' />
			</Head>
			<div>
				<BannerMobile data={data?.banners} />
				<CategoryMobile
					data={{ data: data?.categories?.data?.categorySuggestion?.children[0]?.children }}
				/>
				<RecommendProductMobile data={data?.recommendProducts} />
				<DealShockMobile data={data?.dealShocks} />
				{/* <LiveStreamMobile data={data?.liveStreams} /> */}
				<BestSellerMobile data={data?.bestSellers} />
				<InterestDealMobile data={data?.interestDeals} />
				<UniqueProductMobile data={data?.uniqueProducts} />
				<TrendingProductMobile data={data?.trendingProducts} />
				{/* <ServiceMobile data={data?.services} /> */}
				<BrandMobile data={data?.brands} />

				{isAmp ? (
					<NewProductAMP data={data?.newProducts} />
				) : (
					<NewProductMobile data={data?.newProducts} />
				)}
			</div>
			<NavigatorBottomTabMobile />
		</div>
	);
};

export default Home;
