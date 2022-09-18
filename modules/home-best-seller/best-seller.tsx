import { ProductCard, ProductType } from 'components';
import Skeleton, { CardType } from 'components/skeleton';
import { EmptyImage } from 'constants/';
import { STATUS_PROMOTION } from 'enums';
import { useAppDispatch, useAppSelector, useBestSeller } from 'hooks';
import { ProductViewES } from 'models';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { homeTracking } from 'services';
import { productActions, sessionIdSelector } from 'store/reducers/productSlice';
import { Icon, IconEnum } from 'vuivui-icons';
import { Slider } from 'vuivui-slider';
const BestSeller = (props: any) => {
	const dispatch = useAppDispatch();
	const sessionId_first = useAppSelector(sessionIdSelector).bestSeller_first;
	const sessionId_second = useAppSelector(sessionIdSelector).bestSeller_second;

	const [page, setPage] = useState(0);
	const [prod, setProd] = useState<ProductViewES[]>([]);
	const [prodNext, setProdNext] = useState<ProductViewES[]>([]);

	const { data } = useBestSeller(
		props.data?.firstPage,
		{ pageIndex: 0, pageSize: 16, sessionId: sessionId_first },
		prod?.length === 0,
	);

	const { data: dataNextPage } = useBestSeller(
		props.data?.secondPage,
		{
			pageIndex: 1,
			pageSize: 16,
			sessionId: sessionId_second,
		},
		prodNext?.length === 0,
	);

	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: () => (
			<div className='absolute right-3 top-[calc(50%)] flex h-10 w-10 items-center justify-center rounded-full border border-E7E7E8 bg-white'>
				<Icon name={IconEnum.CaretRight} size={22} />
			</div>
		),
		prevArrow: () => (
			<div className='absolute left-0 top-[calc(50%)] flex h-10 w-10 items-center justify-center rounded-full border border-E7E7E8 bg-white'>
				<Icon name={IconEnum.CaretLeft} size={22} />
			</div>
		),
		classDivNext: '-right-3 top-[calc(50%_-_14px)] opacity-90 hover:opacity-100 transform:none',
		classDivPrev: '-left-2 top-[calc(50%_-_14px)] opacity-90 hover:opacity-100 transform:none',
		handleSlide: () => setPage(page == 0 ? page + 1 : page - 1),
		hiddenNext: page === 1,
		hiddenPrev: page === 0,
	};

	const Skeletons = useMemo(() => {
		return (
			<div className='grid grid-cols-8 gap-4 bg-white pb-9 pt-6'>
				{[...new Array(16)].map((_, index) => {
					return (
						<Skeleton
							key={index}
							cardType={CardType.square}
							type='card'
							width={128}
							height={162}
							isDescription
							lines={1}
							className='rounded-md'
							classNameImg='bg-[#f1f1f1]'
						></Skeleton>
					);
				})}
			</div>
		);
	}, []);

	useEffect(() => {
		if (Array.isArray(data) && data?.length) {
			setProd([...data]);
			sessionId_first !== data[0]?.sessionId &&
				dispatch(productActions.setSessionId({ bestSeller_first: data[0]?.sessionId }));
		}
	}, [data, sessionId_first]);

	useEffect(() => {
		if (Array.isArray(dataNextPage) && dataNextPage?.length) {
			setProdNext([...dataNextPage]);
			sessionId_second !== dataNextPage[0]?.sessionId &&
				dispatch(productActions.setSessionId({ bestSeller_second: dataNextPage[0]?.sessionId }));
		}
	}, [dataNextPage, sessionId_second]);

	const defaultProduct = (
		<div className='!grid min-w-container !grid-cols-8 gap-10px bg-white pb-3 pt-6'>
			{data?.length
				? data?.map((item: ProductViewES, idx: number) => (
						<ProductCard.ProductCard
							key={idx}
							onClick={() => {
								homeTracking(5);
							}}
							description={item?.title}
							price={
								item?.promotions?.length &&
								item?.promotions?.[0]?.promotionDealSock &&
								item?.promotions?.[0]?.promotionDealSock?.pricePromote
									? item?.promotions?.[0]?.promotionDealSock?.pricePromote
									: 0 || item?.price
							}
							priceDash={
								item?.promotions?.length && item?.promotions[0]?.moduleType !== 0 ? item.price : 0
							}
							percentDiscount={
								item?.promotions?.length ? item?.promotions[0]?.promotionDealSock?.discountValue : 0
							}
							image={
								item?.variations?.length && item?.variations[0]?.variationImage
									? item?.variations[0]?.variationImage
									: EmptyImage
							}
							isDealShock={!!(item?.promotions?.length && item?.promotions[0]?.promotionDealSock)}
							type={ProductType.bestSeller}
							width={128}
							height={128}
							path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
							isPromoteStarted={
								!!(
									item?.promotions?.length &&
									item?.promotions[0]?.promotionDealSock &&
									item?.promotions[0]?.status === STATUS_PROMOTION.RUNNING
								)
							}
						/>
				  ))
				: prod?.length
				? prod?.map((item: ProductViewES, idx: number) => (
						<ProductCard.ProductCard
							key={idx}
							onClick={() => {
								homeTracking(5);
							}}
							description={item?.title}
							price={
								item?.promotions?.length &&
								item?.promotions?.[0]?.promotionDealSock &&
								item?.promotions?.[0]?.promotionDealSock?.pricePromote
									? item?.promotions?.[0]?.promotionDealSock?.pricePromote
									: 0 || item?.price
							}
							priceDash={
								item?.promotions?.length && item?.promotions[0]?.moduleType !== 0 ? item.price : 0
							}
							percentDiscount={
								item?.promotions?.length ? item?.promotions[0]?.promotionDealSock?.discountValue : 0
							}
							image={
								item?.variations?.length && item?.variations[0]?.variationImage
									? item?.variations[0]?.variationImage
									: EmptyImage
							}
							isDealShock={!!(item?.promotions?.length && item?.promotions[0]?.promotionDealSock)}
							type={ProductType.bestSeller}
							width={128}
							height={128}
							path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
							isPromoteStarted={
								!!(
									item?.promotions?.length &&
									item?.promotions[0]?.promotionDealSock &&
									item?.promotions[0]?.status === STATUS_PROMOTION.RUNNING
								)
							}
						/>
				  ))
				: Skeletons}
		</div>
	);

	const secondPage = (
		<div className='!grid min-w-container !grid-cols-8 gap-10px bg-white pb-3 pt-6'>
			{dataNextPage?.length
				? dataNextPage?.map((item: ProductViewES, idx: number) => (
						<ProductCard.ProductCard
							key={idx}
							onClick={() => {
								homeTracking(5);
							}}
							description={item?.title}
							price={
								item?.promotions?.length &&
								item?.promotions?.[0]?.promotionDealSock &&
								item?.promotions?.[0]?.promotionDealSock?.pricePromote
									? item?.promotions?.[0]?.promotionDealSock?.pricePromote
									: 0 || item?.price
							}
							priceDash={
								item?.promotions?.length && item?.promotions[0]?.moduleType !== 0 ? item.price : 0
							}
							percentDiscount={
								item?.promotions?.length ? item?.promotions[0]?.promotionDealSock?.discountValue : 0
							}
							image={
								item?.variations?.length && item?.variations[0]?.variationImage
									? item?.variations[0]?.variationImage
									: EmptyImage
							}
							isDealShock={!!(item?.promotions?.length && item?.promotions[0]?.promotionDealSock)}
							type={ProductType.bestSeller}
							width={128}
							height={128}
							path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
							isPromoteStarted={
								!!(
									item?.promotions?.length &&
									item?.promotions[0]?.promotionDealSock &&
									item?.promotions[0]?.status === STATUS_PROMOTION.RUNNING
								)
							}
						/>
				  ))
				: prodNext?.length
				? prodNext?.map((item: ProductViewES, idx: number) => (
						<ProductCard.ProductCard
							key={idx}
							onClick={() => {
								homeTracking(5);
							}}
							description={item?.title}
							price={
								item?.promotions?.length &&
								item?.promotions?.[0]?.promotionDealSock &&
								item?.promotions?.[0]?.promotionDealSock?.pricePromote
									? item?.promotions?.[0]?.promotionDealSock?.pricePromote
									: 0 || item?.price
							}
							priceDash={
								item?.promotions?.length && item?.promotions[0]?.moduleType !== 0 ? item.price : 0
							}
							percentDiscount={
								item?.promotions?.length ? item?.promotions[0]?.promotionDealSock?.discountValue : 0
							}
							image={
								item?.variations?.length && item?.variations[0]?.variationImage
									? item?.variations[0]?.variationImage
									: EmptyImage
							}
							isDealShock={!!(item?.promotions?.length && item?.promotions[0]?.promotionDealSock)}
							type={ProductType.bestSeller}
							width={128}
							height={128}
							path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
							isPromoteStarted={
								!!(
									item?.promotions?.length &&
									item?.promotions[0]?.promotionDealSock &&
									item?.promotions[0]?.status === STATUS_PROMOTION.RUNNING
								)
							}
						/>
				  ))
				: Skeletons}
		</div>
	);

	return (
		<div id='best-seller' className='z-30 mt-4 bg-white pt-7'>
			<div id='content' className='container'>
				<div className={`flex ${data?.length ? 'justify-between' : ''}`}>
					<h2 className='font-sfpro_semiBold text-20 font-bold text-3E3E40 '>
						Sản phẩm bán chạy trong 24h qua
					</h2>
					{data?.length > 0 && (
						<Link href={'/'}>
							<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
								Xem tất cả {`>`}
							</p>
						</Link>
					)}
				</div>

				<div id='product' className='min-w-screen hide-scrollbar overflow-auto'>
					{(data?.length && dataNextPage?.length) || (prod?.length && prodNext?.length) > 0 ? (
						<Slider {...settings}>
							{(data?.length > 0 || prod?.length > 0) && defaultProduct}
							{(prodNext?.length > 0 || dataNextPage?.length) && secondPage}
						</Slider>
					) : (
						Skeletons
					)}
				</div>
			</div>
		</div>
	);
};

export default BestSeller;
