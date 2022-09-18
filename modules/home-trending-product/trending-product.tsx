import { ProductCard, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useTrendingProduct } from 'hooks';
import { ProductViewES } from 'models';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { homeTracking } from 'services';
import { productActions, sessionIdSelector } from 'store/reducers/productSlice';

const TrendingProduct = (props: any) => {
	const dispatch = useAppDispatch();
	const sessionId = useAppSelector(sessionIdSelector).trending;
	const [prod, setProd] = useState<any>([]);
	const { data } = useTrendingProduct(
		props.data,
		{
			pageIndex: 0,
			pageSize: 12,
			sessionId: sessionId,
		},
		prod?.length === 0,
	);

	const Skeletons = useMemo(
		() => (
			<div className='grid grid-cols-6 gap-4 bg-white pb-9 pt-6'>
				{[...new Array(6)].map((_, index) => {
					return (
						<Skeleton.Skeleton
							key={index}
							cardType={Skeleton.CardType.square}
							type='card'
							width={171}
							height={171}
						></Skeleton.Skeleton>
					);
				})}
			</div>
		),
		[],
	);

	useEffect(() => {
		if (Array.isArray(data) && data?.length) {
			setProd(data);
			sessionId !== data[0]?.sessionId &&
				dispatch(productActions.setSessionId({ trending: data[0]?.sessionId }));
		}
	}, [data]);

	return (
		<div className='mt-4 bg-white py-8'>
			<div className='container'>
				<div className={`flex ${data?.length ? 'justify-between' : ''}`}>
					<div className='flex items-center'>
						<img src='/static/svg/flame.svg' alt='' className='h-23px w-[23px]' />
						<h2 className='ml-3 font-sfpro_semiBold text-20 font-bold text-3E3E40'>
							Sản phẩm đang nổi
						</h2>
					</div>
					{Array.isArray(data) && data?.length > 0 && (
						<Link href={'/'}>
							<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
								Xem tất cả {`>`}
							</p>
						</Link>
					)}
				</div>
				{Array.isArray(data) && data?.length ? (
					<div className='min-w-screen hide-scrollbar overflow-auto'>
						<div className='grid min-w-container grid-cols-6 gap-4 bg-white pb-2 pt-6'>
							{data?.map((item: ProductViewES, index: number) => (
								<ProductCard.ProductCard
									key={index}
									description={item?.title}
									price={item?.price}
									image={
										item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
									}
									isDealShock={true}
									percentDiscount={item?.promotions && item?.promotions?.[0].discountValueUpTo}
									onClick={() => {
										homeTracking(8);
									}}
									type={ProductCard.ProductType.trendingProduct}
									width='171px'
									height='171px'
									path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
								/>
							))}
						</div>
					</div>
				) : prod?.length > 0 ? (
					<div className='min-w-screen hide-scrollbar overflow-auto'>
						<div className='grid min-w-container grid-cols-6 gap-4 bg-white pb-2 pt-6'>
							{prod?.map((item: ProductViewES, index: number) => (
								<ProductCard.ProductCard
									key={index}
									description={item?.title}
									price={item?.price}
									image={
										item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
									}
									isDealShock={true}
									onClick={() => {
										homeTracking(8);
									}}
									percentDiscount={item?.promotions && item?.promotions?.[0].discountValueUpTo}
									type={ProductCard.ProductType.trendingProduct}
									width='171px'
									height='171px'
									path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
								/>
							))}
						</div>{' '}
					</div>
				) : (
					Skeletons
				)}
			</div>
		</div>
	);
};

export default TrendingProduct;
