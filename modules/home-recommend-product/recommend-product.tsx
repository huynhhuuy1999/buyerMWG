import { ProductCard, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useRecommendProduct } from 'hooks';
import { Product } from 'models';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { homeTracking } from 'services';

import { productActions, sessionIdSelector } from '@/store/reducers/productSlice';

const RecommendProduct = (props: any) => {
	const dispatch = useAppDispatch();
	const sessionId = useAppSelector(sessionIdSelector).recommend;

	const [prod, setProd] = useState<any>([]);
	const { data } = useRecommendProduct(
		props.data,
		{
			pageIndex: 0,
			pageSize: 14,
			sessionId: sessionId,
		},
		prod?.length === 0,
	);

	const Skeletons = useMemo(() => {
		return (
			<div className='grid grid-cols-7 gap-4 bg-white pb-2 pt-6'>
				{[...new Array(14)].map((_, index) => {
					return (
						<Skeleton.Skeleton
							key={index}
							cardType={Skeleton.CardType.square}
							type='card'
							width={144}
							height={144}
						></Skeleton.Skeleton>
					);
				})}
			</div>
		);
	}, []);

	useEffect(() => {
		if (Array.isArray(data) && data?.length) {
			setProd(data);
			sessionId !== data[0]?.sessionId &&
				dispatch(productActions.setSessionId({ recommend: data[0]?.sessionId }));
		}
	}, [data]);

	return (
		<div className='mt-4 bg-white py-7'>
			<div className='container'>
				<div className={`flex ${data?.length ? 'justify-between' : ''} mb-4`}>
					<h2 className='font-sfpro_semiBold text-20 font-bold text-3E3E40 '>
						Có thể bạn quan tâm
					</h2>
					{data?.length > 0 && (
						<Link href={'/'}>
							<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
								Xem tất cả {`>`}
							</p>
						</Link>
					)}
				</div>
				<div className='min-w-screen hide-scrollbar overflow-auto'>
					{Array.isArray(data) ? (
						<div className='mt-4 grid min-w-container grid-cols-7 gap-x-4 gap-y-6'>
							{data?.map((item: Product, index: number) => (
								<ProductCard.ProductCard
									key={index}
									description={item?.title}
									onClick={() => {
										homeTracking(3);
									}}
									price={item?.price}
									image={
										item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
									}
									type={ProductCard.ProductType.recommend}
									width='138px'
									height='142px'
									className='rounded-md'
									path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
									classNameImage='rounded-md'
									percentDiscount={item?.promotions && item?.promotions?.[0].discountValue}
								/>
							))}
						</div>
					) : prod?.length > 0 ? (
						<div className='mt-4 grid min-w-container grid-cols-7 gap-x-4 gap-y-6'>
							{prod?.map((item: Product, index: number) => (
								<ProductCard.ProductCard
									onClick={() => {
										homeTracking(3);
									}}
									key={index}
									description={item?.title}
									price={item?.price}
									image={
										item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
									}
									type={ProductCard.ProductType.recommend}
									width='138px'
									height='142px'
									className='rounded-md'
									path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
									classNameImage='rounded-md'
									percentDiscount={item?.promotions && item?.promotions?.[0].discountValue}
								/>
							))}
						</div>
					) : (
						Skeletons
					)}
				</div>
			</div>
		</div>
	);
};

export default RecommendProduct;
