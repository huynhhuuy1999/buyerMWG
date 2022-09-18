import { ImageCustom, ProductCard, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useTrendingProduct } from 'hooks';
import { ProductViewES } from 'models';
import { useEffect, useMemo, useState } from 'react';
import { homeTracking } from 'services';
import { productActions, sessionIdSelector } from 'store/reducers/productSlice';
import { Icon, IconEnum } from 'vuivui-icons';

const TrendingProductMobile = (props: any) => {
	const dispatch = useAppDispatch();
	const [prod, setProd] = useState<any>([]);
	const sessionId = useAppSelector(sessionIdSelector).recommend;
	const [total, setTotal] = useState<number>(0);

	const { data, totalRemain } = useTrendingProduct(
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
			<div className='grid grid-cols-3 gap-2 pb-9 pt-6'>
				{[...new Array(9)].map((_, index) => {
					return (
						<Skeleton.Skeleton
							key={index}
							center
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
				dispatch(productActions.setSessionId({ trending: data[0]?.sessionId }));
		}
		if (totalRemain) setTotal(totalRemain);
	}, [data]);

	return (
		<div className='mt-[6px]'>
			<div className='container bg-[#E0EBFD] pt-7 pb-6'>
				<div className='flex pb-4'>
					<ImageCustom src='/static/svg/flame.svg' alt='' width={13} height={16} />
					<h2 className='ml-6px text-16 text-3E3E40'>Sản phẩm đang nổi</h2>
				</div>
				{Array.isArray(data) && data?.length > 0 ? (
					<div className='grid grid-cols-3 justify-items-center gap-2'>
						{data?.slice(0, 12).map((item: ProductViewES, index: number) => (
							<ProductCard.ProductCard
								key={index}
								animation={false}
								onClick={() => {
									homeTracking(8);
								}}
								description={item?.title}
								price={item.price}
								image={item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage}
								isDealShock={true}
								percentDiscount={item?.promotions && item?.promotions?.[0].discountValueUpTo}
								type={ProductCard.ProductType.trendingProductMobile}
								width='108px'
								height='108px'
								path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
								classNameImage='w-full rounded-md'
							/>
						))}
					</div>
				) : prod?.length ? (
					<div className='grid grid-cols-3 justify-items-center gap-2'>
						{prod?.slice(0, 12).map((item: ProductViewES, index: number) => (
							<ProductCard.ProductCard
								key={index}
								onClick={() => {
									homeTracking(8);
								}}
								description={item?.title}
								price={item.price}
								image={item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage}
								animation={false}
								isDealShock={true}
								percentDiscount={item?.promotions && item?.promotions?.[0].discountValueUpTo}
								type={ProductCard.ProductType.trendingProductMobile}
								width='108px'
								height='108px'
								path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
								classNameImage='w-full rounded-md'
							/>
						))}
					</div>
				) : (
					Skeletons
				)}

				{total > 0 && (
					<p className='mt-14px flex items-center justify-center text-14 text-009ADA'>
						Xem thêm ({total})
						<Icon name={IconEnum.CaretRight} size={10} color='#009ada' />
					</p>
				)}
			</div>
		</div>
	);
};

export default TrendingProductMobile;
