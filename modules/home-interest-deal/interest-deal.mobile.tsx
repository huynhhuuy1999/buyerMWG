import { ProductCard, ProductType, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useInterestDeal } from 'hooks';
import { Product } from 'models';
import { useEffect, useState } from 'react';
import { homeTracking } from 'services';
import { productActions, sessionIdSelector } from 'store/reducers/productSlice';
import { Icon, IconEnum } from 'vuivui-icons';

// import { useEffect, useState } from 'react';

interface IInterestDeal {
	data: Product;
	percentDiscount: number;
	productId: number;
}
const InterestDealMobile = (props: any) => {
	const [prod, setProd] = useState<any>([]);
	const sessionId = useAppSelector(sessionIdSelector).interest;

	const dispatch = useAppDispatch();

	const [total, setTotal] = useState<number>(0);
	const { data, totalRemain } = useInterestDeal(
		props.data,
		{ pageIndex: 0, pageSize: 8 },
		prod?.length === 0,
	);

	const Skeletons = (
		<div className='grid grid-cols-2  gap-2 pb-9 pt-6 sm:grid-cols-2 md:grid-cols-2'>
			{[...new Array(4)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						center
						key={index}
						cardType={Skeleton.CardType.square}
						type='card'
						width={167}
						height={167}
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
		if (totalRemain) setTotal(totalRemain);
	}, [data]);

	return prod?.length > 0 ||
		(Array.isArray(data?.objectsGroupProducts) && data?.objectsGroupProducts?.length > 0) ? (
		<div className='container bg-[#FFDA99] py-6'>
			<h2 className='pb-4 text-16 text-3E3E40'>Khuyến mãi thú vị</h2>
			{Array.isArray(data?.objectsGroupProducts) && data?.objectsGroupProducts?.length ? (
				<div className='pt- grid grid-cols-2 justify-items-center gap-2'>
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
								type={ProductType.interestDealMobile}
								path={
									item?.data?.categoryUrlSlug
										? `/${item?.data?.categoryUrlSlug}/${item?.data?.urlSlug}`
										: '#'
								}
								width='184px'
								height='233px'
							/>
						))}
				</div>
			) : prod?.length > 0 ? (
				<div className='grid grid-cols-2 justify-items-center gap-2'>
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
									isDealShock={item?.data?.promotions && item?.data?.promotions[0].moduleType === 1}
									percentDiscount={item?.percentDiscount}
									image={
										item?.data?.variations?.length
											? item?.data?.variations?.[0]?.variationImage
											: EmptyImage
									}
									type={ProductType.interestDealMobile}
									path={
										item?.data?.categoryUrlSlug
											? `/${item?.data?.categoryUrlSlug}/${item?.data?.urlSlug}`
											: '#'
									}
									width='184px'
									height='233px'
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
	) : (
		<div></div>
	);
};

export default InterestDealMobile;
