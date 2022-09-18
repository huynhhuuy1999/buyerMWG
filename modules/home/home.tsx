import dynamic from 'next/dynamic';
import React from 'react';
interface HomeSessionProps {
	data: any;
}
interface BrandProps extends HomeSessionProps {
	isNotFooter: boolean;
}
interface BannerProps extends HomeSessionProps {
	hasSubBanner: boolean;
}
const Category = dynamic(() => import('../category/category')) as React.FC<HomeSessionProps>;
const Banner = dynamic(() => import('../home-banner/banner')) as React.FC<BannerProps>;
const RecommendProduct = dynamic(
	() => import('../home-recommend-product/recommend-product'),
) as React.FC<HomeSessionProps>;
const DealShock = dynamic(() => import('../home-deal-shock/deal-shock'), {
	ssr: false,
}) as React.FC<HomeSessionProps>;
// const LiveStream = dynamic(() => import('../live-stream/live-stream')) as React.FC<HomeSessionProps>;
const BestSeller = dynamic(
	() => import('../home-best-seller/best-seller'),
) as React.FC<HomeSessionProps>;
const InterestDeal = dynamic(
	() => import('../home-interest-deal/interest-deal'),
) as React.FC<HomeSessionProps>;
const UniqueProduct = dynamic(
	() => import('../home-unique-product/unique-product'),
) as React.FC<HomeSessionProps>;
const TrendingProduct = dynamic(
	() => import('../home-trending-product/trending-product'),
) as React.FC<HomeSessionProps>;
// const Service = dynamic(() => import('../home-service/service')) as React.FC<HomeSessionProps>;
const Brand = dynamic(() => import('../home-brands/brand')) as React.FC<BrandProps>;
const NewProduct = dynamic(
	() => import('../home-new-product/new-product'),
) as React.FC<HomeSessionProps>;

const Home: React.FC | any = ({ data }: HomeSessionProps) => {
	return (
		<div className='hide-scrollbar overflow-x-auto bg-E5E5E5'>
			<Category
				data={{ data: data?.categories?.data?.categorySuggestion?.children[0]?.children }}
			/>
			<div className='bg-white'>
				<Banner data={data?.banners} hasSubBanner />
			</div>
			<RecommendProduct data={data?.recommendProducts} />
			<DealShock data={data?.dealShocks} />
			<BestSeller data={{ firstPage: data?.bestSellers, secondPage: data?.bestSellersNext }} />
			<InterestDeal data={data?.interestDeals} />
			<UniqueProduct data={data?.uniqueProducts} />
			<TrendingProduct data={data?.trendingProducts} />
			<Brand isNotFooter data={data?.brands} />
			<NewProduct data={data?.newProducts} />
		</div>
	);
};

export default Home;
