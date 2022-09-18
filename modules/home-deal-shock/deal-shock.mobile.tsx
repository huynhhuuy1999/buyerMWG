import { ProductCard, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useDealShock } from 'hooks';
import { HomeSessionProps, ProductViewES } from 'models';
import { useEffect, useMemo, useState } from 'react';
import { homeTracking } from 'services';
import { productActions, sessionIdSelector } from 'store/reducers/productSlice';
import { Icon, IconEnum } from 'vuivui-icons';

const DealShockMobile = (props: HomeSessionProps) => {
	const [prod, setProd] = useState<any>([]);
	const [total, setTotal] = useState<number>(0);
	const [date, setDate] = useState(new Date());
	const sessionId = useAppSelector(sessionIdSelector).dealShock;
	const dispatch = useAppDispatch();

	const { data, totalRemain, loading }: any = useDealShock(
		props.data,
		{
			pageIndex: 0,
			pageSize: 6,
			sessionId: sessionId,
		},
		prod?.length === 0,
	);

	useEffect(() => {
		var timerID = setInterval(() => setDate(new Date()), 1000);
		return function cleanup() {
			clearInterval(timerID);
		};
	});

	useEffect(() => {
		if (Array.isArray(data)) {
			setProd(data);
			sessionId !== data[0]?.sessionId &&
				dispatch(productActions.setSessionId({ dealShock: data[0]?.sessionId }));
		}
		if (totalRemain) setTotal(totalRemain);
	}, [data, totalRemain]);

	const Skeletons = useMemo(() => {
		return (
			<div className='grid grid-cols-2 gap-4 bg-white pb-9 pt-6 md:grid-cols-4'>
				{[...new Array(6)].map((_, index) => {
					return (
						<Skeleton.Skeleton
							key={index}
							center
							cardType={Skeleton.CardType.square}
							type='card'
							width={171}
							height={171}
							isDescription
						></Skeleton.Skeleton>
					);
				})}
			</div>
		);
	}, []);

	return !loading || (Array.isArray(data) && data?.length > 0) || prod?.length > 0 ? (
		(Array.isArray(data) && data?.length) || prod?.length ? (
			<div className='bg-white pt-6 pb-5'>
				<div className='flex items-center gap-1 border-b border-[#F6F6F6] px-2 pb-4'>
					<h2 className='font-sfpro_semiBold text-14 font-semibold text-[#009908]'>GIẢM SỐC</h2>
					<p className='text-12 text-[#999999]'> kết thúc trong</p>
					<div className='flex'>
						{/* <div className='text-14 text-[#009908]'>00 giờ</div> */}
						<div className='text-14 text-[#009908]'>
							{Math.ceil(59 - date.getMinutes()) > 9
								? Math.ceil(59 - date.getMinutes())
								: `0${Math.ceil(59 - date.getMinutes())}`}{' '}
							phút
						</div>
						<div className='ml-1 text-14 text-[#009908]'>
							{Math.ceil(59 - date.getSeconds()) > 9
								? Math.ceil(59 - date.getSeconds())
								: `0${Math.ceil(59 - date.getSeconds())} `}{' '}
							giây
						</div>
					</div>
				</div>
				<div className='flex flex-wrap justify-center'>
					{Array.isArray(data) && data?.length
						? data?.map((item: ProductViewES, index: number) => (
								<div className='border-inner max-w-[50%] flex-[50%]' key={index}>
									<ProductCard.ProductCard
										animation={false}
										onClick={() => {
											homeTracking(4);
										}}
										description={item?.title}
										image={
											item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
										}
										isDealShock={true}
										percentDiscount={item?.promotions && item?.promotions?.[0].discountValue}
										type={ProductCard.ProductType.dealShockMobile}
										classNameImage='rounded-md'
										className='mx-auto'
										classPercentDiscount='rounded-r-md'
										sold={item?.totalSold}
										left={
											item?.variations &&
											item?.variations[0]?.quantities &&
											item?.variations[0]?.quantities[0]?.quantity - (item?.totalSold ?? 0)
										}
										price={
											item?.promotions?.length > 0
												? item.promotions[0]?.pricePromote
													? item.promotions[0]?.pricePromote
													: item?.price
												: item?.price
										}
										priceDash={item?.promotions?.length > 0 ? item.promotions[0]?.price : ''}
										path={
											item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
										}
										width='167px'
										height='167px'
									/>
								</div>
						  ))
						: prod?.length > 0
						? prod?.map((item: ProductViewES, index: number) => (
								<div className='border-inner max-w-[50%] flex-[50%]' key={index}>
									<ProductCard.ProductCard
										animation={false}
										onClick={() => {
											homeTracking(4);
										}}
										description={item?.title}
										image={
											item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
										}
										isDealShock={true}
										percentDiscount={item?.promotions && item?.promotions?.[0].discountValue}
										type={ProductCard.ProductType.dealShockMobile}
										classNameImage='rounded-md'
										className='mx-auto'
										classPercentDiscount='rounded-r-md'
										sold={item?.totalSold}
										left={
											item?.variations &&
											item?.variations[0]?.quantities &&
											item?.variations[0]?.quantities[0]?.quantity - (item?.totalSold ?? 0)
										}
										price={
											item?.promotions?.length > 0
												? item.promotions[0]?.pricePromote
													? item.promotions[0]?.pricePromote
													: item?.price
												: item?.price
										}
										priceDash={item?.promotions?.length > 0 ? item.promotions[0]?.price : ''}
										path={
											item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
										}
										width='167px'
										height='167px'
									/>
								</div>
						  ))
						: Skeletons}
				</div>
				{total > 0 && (
					<p className='mt-14px flex items-center justify-center text-14 text-009ADA'>
						Xem thêm ({total})
						<Icon name={IconEnum.CaretRight} size={10} color='#009ada' />
					</p>
				)}
			</div>
		) : (
			<></>
		)
	) : (
		<div className='mt-4 bg-white py-8'>
			<div className='container'>
				<div className={`flex ${data?.length > 0 || prod?.length > 0 ? 'justify-between' : ''}`}>
					<div className='flex items-center gap-1 border-b border-[#F6F6F6] px-2 pb-4'>
						<h2 className='font-sfpro_semiBold text-14 font-semibold text-[#009908]'>GIẢM SỐC</h2>
						<p className='text-12 text-[#999999]'> kết thúc trong</p>
						<div className='flex'>
							{/* <div className='text-14 text-[#009908]'>00 giờ</div> */}
							<div className='text-14 text-[#009908]'>
								{Math.ceil(59 - date.getMinutes()) > 9
									? Math.ceil(59 - date.getMinutes())
									: `0${Math.ceil(59 - date.getMinutes())}`}{' '}
								phút
							</div>
							<div className='ml-1 text-14 text-[#009908]'>
								{Math.ceil(59 - date.getSeconds()) > 9
									? Math.ceil(59 - date.getSeconds())
									: `0${Math.ceil(59 - date.getSeconds())} `}{' '}
								giây
							</div>
						</div>
					</div>
				</div>
				{Skeletons}
			</div>
		</div>
	);
};

export default DealShockMobile;
