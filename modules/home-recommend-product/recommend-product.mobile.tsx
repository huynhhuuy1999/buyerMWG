import { ProductCard, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useRecommendProduct } from 'hooks';
import { HomeSessionProps, Product } from 'models';
import { useEffect, useMemo, useState } from 'react';
import { homeTracking } from 'services';
import { productActions, sessionIdSelector } from 'store/reducers/productSlice';

const RecommendProductMobile = (props: HomeSessionProps) => {
	const dispatch = useAppDispatch();
	const sessionId = useAppSelector(sessionIdSelector).recommend;

	const [prod, setProd] = useState<any>([]);
	const { data } = useRecommendProduct(
		props.data,
		{
			pageIndex: 0,
			pageSize: 9,
			sessionId: sessionId,
		},
		prod?.length === 0,
	);

	const Skeletons = useMemo(() => {
		return (
			<div className='grid grid-cols-3 gap-2 bg-white pb-9 pt-6'>
				{[...new Array(9)].map((_, index) => {
					return (
						<Skeleton.Skeleton
							center
							key={index}
							cardType={Skeleton.CardType.square}
							type='card'
							width={108}
							height={108}
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
		<div className='mb-[6px] bg-white py-4 '>
			<div className='container'>
				<h2 className='mb-4 text-16 text-3E3E40'>Có thể bạn quan tâm</h2>
				{Array.isArray(data) && data?.length ? (
					<div className='grid grid-cols-3 justify-items-center gap-2'>
						{data?.slice(0, 9).map((item: Product, index: number) => (
							<ProductCard.ProductCard
								animation={false}
								key={index}
								description={item?.description}
								price={item?.price}
								onClick={() => {
									homeTracking(3);
								}}
								image={item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage}
								type={ProductCard.ProductType.recommend}
								width='108px'
								height='108px'
								className='rounded-md'
								path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
								classNameImage='rounded-md'
								percentDiscount={item?.promotions && item?.promotions?.[0].discountValue}
							/>
						))}
					</div>
				) : prod?.length > 0 ? (
					<div className='grid grid-cols-3 justify-items-center gap-2'>
						{prod?.slice(0, 9).map((item: Product, index: number) => (
							<ProductCard.ProductCard
								animation={false}
								key={index}
								description={item?.description}
								onClick={() => {
									homeTracking(3);
								}}
								price={item?.price}
								image={item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage}
								type={ProductCard.ProductType.recommend}
								width='108px'
								height='108px'
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
			{/* {((Array.isArray(data) && data?.length > 0) || prod?.length > 0) && (
				<p className='mt-14px flex items-center justify-center text-14 text-009ADA'>
					Xem thêm{' '}
					<Icon type='icon-chevron-right' size={10} variant='semi-secondary' className='-ml-2 mt-2px' />
				</p>
			)} */}
		</div>
	);
};

export default RecommendProductMobile;
