import { ProductCard, ProductType, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useInterestDeal } from 'hooks';
import { Product } from 'models';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { homeTracking } from 'services';
import { productActions, sessionIdSelector } from 'store/reducers/productSlice';

// import { useEffect, useState } from 'react';

interface IInterestDeal {
	data: Product;
	percentDiscount: number;
	productId: number;
}

const InterestDeal = (props: any) => {
	const [prod, setProd] = useState<any>([]);
	const sessionId = useAppSelector(sessionIdSelector).interest;
	const dispatch = useAppDispatch();

	const { data } = useInterestDeal(props.data, { pageIndex: 0, pageSize: 9 }, prod?.length === 0);
	const Skeletons = (
		<div className='grid grid-cols-4 gap-4 bg-white pb-9 pt-6'>
			{[...new Array(4)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						key={index}
						cardType={Skeleton.CardType.square}
						type='card'
						width={256}
						height={256}
						isDescription
					></Skeleton.Skeleton>
				);
			})}
		</div>
	);

	useEffect(() => {
		if (Array.isArray(data?.objectsGroupProducts)) {
			setProd(data?.objectsGroupProducts);
			sessionId !== data?.objectsGroupProducts[0]?.sessionId &&
				dispatch(
					productActions.setSessionId({ recommend: data?.objectsGroupProducts[0]?.sessionId }),
				);
		}
	}, [data?.objectsGroupProducts]);

	return prod?.length > 0 ||
		(Array.isArray(data?.objectsGroupProducts) && data?.objectsGroupProducts?.length > 0) ? (
		<div className='mt-4 bg-white py-8'>
			<div className='container'>
				<div className={`flex pb-6 ${data?.objectsGroupProducts?.length ? 'justify-between' : ''}`}>
					<h2 className='font-sfpro_semiBold text-20 font-bold text-3E3E40 '>Khuyến mãi thú vị</h2>
					{data?.objectsGroupProducts?.length > 0 && (
						<Link href={'/'}>
							<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
								Xem tất cả {`>`}
							</p>
						</Link>
					)}
				</div>
				{Array.isArray(data?.objectsGroupProducts) && data?.objectsGroupProducts?.length ? (
					<div className='grid grid-cols-3 justify-items-center gap-2'>
						{data?.objectsGroupProducts
							?.map((item: any) => item?.productDetails[0])
							?.filter((n: any) => n)
							?.map((item: IInterestDeal, index: number) => (
								<ProductCard.ProductCard
									onClick={() => {
										homeTracking(6);
									}}
									key={index}
									description={item?.data?.title}
									price={
										item?.data?.promotions
											? item?.data?.promotions[0].pricePromote
												? item?.data?.promotions[0].price
												: item?.data?.price
											: item?.data?.price
									}
									isDealShock={item?.data?.promotions && item?.data?.promotions[0].moduleType === 1}
									percentDiscount={item?.percentDiscount}
									image={
										item?.data?.variations?.length
											? item?.data?.variations?.[0]?.variationImage
											: EmptyImage
									}
									type={ProductType.interestDeal}
									path={
										item?.data?.categoryUrlSlug
											? `/${item?.data?.categoryUrlSlug}/${item?.data?.urlSlug}`
											: '#'
									}
									width='256px'
									height='256px'
									// classNameImage='rounded-tr-2xl'
								/>
							))}
					</div>
				) : prod?.length > 0 ? (
					<div className='grid grid-cols-3 justify-items-center gap-2'>
						{Array.isArray(prod) &&
							prod
								?.map((item: any) => item?.productDetails[0])
								?.filter((n: any) => n)
								?.map((item: IInterestDeal, index: number) => (
									<ProductCard.ProductCard
										onClick={() => {
											homeTracking(6);
										}}
										key={index}
										description={item?.data?.title}
										price={
											item?.data?.promotions
												? item?.data?.promotions[0].pricePromote
													? item?.data?.promotions[0].price
													: item?.data?.price
												: item?.data?.price
										}
										isDealShock={
											item?.data?.promotions && item?.data?.promotions[0].moduleType === 1
										}
										percentDiscount={item?.percentDiscount}
										image={
											item?.data?.variations?.length
												? item?.data?.variations?.[0]?.variationImage
												: EmptyImage
										}
										type={ProductType.interestDeal}
										path={
											item?.data?.categoryUrlSlug
												? `/${item?.data?.categoryUrlSlug}/${item?.data?.urlSlug}`
												: '#'
										}
										width='256px'
										height='256px'
										// classNameImage='rounded-tr-2xl'
									/>
								))}
					</div>
				) : (
					Skeletons
				)}
			</div>
		</div>
	) : (
		<></>
	);
};

export default InterestDeal;
