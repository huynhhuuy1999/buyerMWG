import { ProductCard, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useBestSeller } from 'hooks';
import { ProductViewES } from 'models';
import { useEffect, useMemo, useState } from 'react';
import { homeTracking } from 'services';
import { Icon, IconEnum } from 'vuivui-icons';

import { productActions, sessionIdSelector } from '@/store/reducers/productSlice';

const BestSellerMobile = (props: any) => {
	const dispatch = useAppDispatch();
	const [prod, setProd] = useState<any>([]);
	const [total, setTotal] = useState<number>(0);

	const sessionId_first = useAppSelector(sessionIdSelector).bestSeller_first;

	const { data, totalRemain } = useBestSeller(
		props.data,
		{ pageIndex: 0, pageSize: 16, sessionId: sessionId_first },
		prod?.length === 0,
	);

	const Skeletons = useMemo(() => {
		return (
			<div className='grid grid-cols-3 gap-2 bg-white'>
				{[...new Array(6)].map((_, index) => {
					return (
						<Skeleton.Skeleton
							key={index}
							cardType={Skeleton.CardType.square}
							type='card'
							width={128}
							height={214}
						/>
					);
				})}
			</div>
		);
	}, []);

	useEffect(() => {
		if (Array.isArray(data) && data?.length) {
			setProd(data);
			sessionId_first !== data[0]?.sessionId &&
				dispatch(productActions.setSessionId({ bestSeller: data[0]?.sessionId }));
		}
		if (totalRemain) setTotal(totalRemain);
	}, [data, sessionId_first, totalRemain]);

	return (
		<div className='my-[6px] bg-white py-4'>
			<div className='container'>
				<p className='mb-4 text-16 text-3E3E40'>Sản phẩm bán chạy trong 24h qua</p>
				<div className='hide-scrollbar overflow-x-auto'>
					{data?.length > 0 ? (
						<div className='flex w-[1130px] flex-wrap gap-2'>
							{Array.isArray(data) &&
								data?.map((item: ProductViewES, index: number) => (
									<ProductCard.ProductCard
										animation={false}
										onClick={() => {
											homeTracking(5);
										}}
										key={index}
										description={item?.title}
										image={
											item?.variations?.length && item?.variations[0]?.variationImage
												? item?.variations[0]?.variationImage
												: EmptyImage
										}
										isDealShock={true}
										price={
											item?.promotions?.length &&
											item?.promotions?.[0]?.promotionDealSock &&
											item?.promotions?.[0]?.promotionDealSock?.pricePromote
												? item?.promotions?.[0]?.promotionDealSock?.pricePromote
												: 0 || item?.price
										}
										priceDash={
											item?.promotions?.length && item?.promotions[0]?.moduleType !== 0
												? item.price
												: 0
										}
										percentDiscount={
											item?.promotions?.length
												? item?.promotions[0]?.promotionDealSock?.discountValue
												: 0
										}
										type={ProductCard.ProductType.bestSellerMobile}
										width='132px'
										height='132px'
										path={`/${item?.categoryUrlSlug}/${item?.urlSlug}`}
									/>
								))}
							{/* <div className='flex w-[132px] items-center flex-col justify-center rounded-md bg-[#E0EBFD] text-center'>
								<div className='bg-[#126BFB] rounded-full h-6 w-6'>
									<Icon type='icon-chevron-right' size={16} variant='light' className='mt-1 ml-1' />
								</div>
								<p className='mt-[14px] text-14 text-[#126BFB]'> Xem thêm</p>
							</div>{' '} */}
						</div>
					) : prod?.length > 0 ? (
						<div className='flex w-[1130px] flex-wrap gap-2'>
							{prod?.map((item: ProductViewES, index: number) => (
								<ProductCard.ProductCard
									animation={false}
									onClick={() => {
										homeTracking(5);
									}}
									key={index}
									description={item?.title}
									image={
										item?.variations?.length && item?.variations[0]?.variationImage
											? item?.variations[0]?.variationImage
											: EmptyImage
									}
									isDealShock={true}
									price={
										item?.promotions?.length &&
										item?.promotions?.[0]?.promotionDealSock &&
										item?.promotions?.[0]?.promotionDealSock?.pricePromote
											? item?.promotions?.[0]?.promotionDealSock?.pricePromote
											: 0 || item?.price
									}
									priceDash={
										item?.promotions?.length && item?.promotions[0]?.moduleType !== 0
											? item.price
											: 0
									}
									percentDiscount={
										item?.promotions?.length
											? item?.promotions[0]?.promotionDealSock?.discountValue
											: 0
									}
									type={ProductCard.ProductType.bestSellerMobile}
									width='132px'
									height='132px'
									path={`/${item?.categoryUrlSlug}/${item?.urlSlug}`}
								/>
							))}
						</div>
					) : (
						Skeletons
					)}
				</div>
			</div>
			{total > 0 && (
				<p className='mt-14px flex items-center justify-center text-14 text-009ADA'>
					Xem thêm ({total})
					{/* <Icon type='icon-chevron-right' size={10} variant='semi-secondary' className='-ml-2 mt-2px' /> */}
					<Icon name={IconEnum.CaretRight} size={10} color='#009ada' />
				</p>
			)}
		</div>
	);
};

export default BestSellerMobile;
