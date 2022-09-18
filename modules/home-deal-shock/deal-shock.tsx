import { ProductCard, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useDealShock } from 'hooks';
import { ProductViewES } from 'models';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { homeTracking } from 'services';

import { productActions, sessionIdSelector } from '@/store/reducers/productSlice';

const DealShock = (props: any) => {
	const [prod, setProd] = useState<any>([]);
	const dispatch = useAppDispatch();

	const sessionId = useAppSelector(sessionIdSelector).dealShock;

	const { data, loading }: any = useDealShock(
		props.data,
		{
			pageIndex: 0,
			pageSize: 6,
			sessionId: sessionId,
		},
		prod?.length === 0,
	);

	const [date, setDate] = useState(new Date());

	useEffect(() => {
		var timerID = setInterval(() => setDate(new Date()), 1000);
		return function cleanup() {
			clearInterval(timerID);
		};
	});

	const Skeletons = useMemo(() => {
		return (
			<div className='grid grid-cols-6 gap-4 bg-white pb-9 pt-6'>
				{[...new Array(6)].map((_, index) => {
					return (
						<Skeleton.Skeleton
							key={index}
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

	useEffect(() => {
		if (Array.isArray(data)) {
			setProd(data);
			sessionId !== data[0]?.sessionId &&
				dispatch(productActions.setSessionId({ dealShock: data[0]?.sessionId }));
		}
	}, [data]);

	return !loading || (Array.isArray(data) && data?.length > 0) || prod?.length > 0 ? (
		(Array.isArray(data) && data?.length > 0) || prod?.length > 0 ? (
			<div className='mt-4 bg-white py-8'>
				<div className='container'>
					<div className={`flex ${data?.length > 0 || prod?.length > 0 ? 'justify-between' : ''}`}>
						<div className='flex items-center gap-1'>
							<h2 className='font-sfpro_semiBold text-20 font-semibold text-[#009908]'>GIẢM SỐC</h2>
							<p className='text-18 text-[#999999]'> kết thúc trong</p>
							<div className='flex'>
								{/* <div className='text-18 text-[#009908]'>00 giờ</div> */}
								<div className=' text-18 text-[#009908]'>
									{Math.ceil(59 - date.getMinutes()) > 9
										? `${Math.ceil(59 - date.getMinutes())} `
										: `0${Math.ceil(59 - date.getMinutes())} `}
									phút
								</div>
								<div className='ml-1 text-18 text-[#009908]'>
									{Math.ceil(59 - date.getSeconds()) > 9
										? `${Math.ceil(59 - date.getSeconds())} `
										: `0${Math.ceil(59 - date.getSeconds())} `}
									giây
								</div>
							</div>
						</div>
						{(data?.length > 0 || prod?.length > 0) && (
							<Link href={'/'}>
								<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
									Xem tất cả {`>`}
								</p>
							</Link>
						)}
					</div>
					<div className='min-w-screen hide-scrollbar overflow-auto'>
						{Array.isArray(data) && data?.length ? (
							<div className='grid min-w-container grid-cols-6 gap-4 bg-white pb-2 pt-6'>
								{Array.isArray(data) &&
									data?.map((item: ProductViewES, index: number) => {
										return (
											<ProductCard.ProductCard
												key={index}
												onClick={() => {
													homeTracking(4);
												}}
												description={item?.title}
												image={
													item?.variations?.length
														? item?.variations[0]?.variationImage
														: EmptyImage
												}
												isDealShock={true}
												percentDiscount={item?.promotions && item?.promotions?.[0].discountValue}
												type={ProductCard.ProductType.dealShock}
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
												width='171px'
												height='171px'
											/>
										);
									})}
							</div>
						) : prod?.length > 0 ? (
							<div className='grid min-w-container grid-cols-6 gap-4 bg-white pb-2 pt-6'>
								{prod?.map((item: ProductViewES, index: number) => {
									return (
										<ProductCard.ProductCard
											key={index}
											onClick={() => {
												homeTracking(4);
											}}
											description={item?.title}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											isDealShock={true}
											percentDiscount={item?.promotions && item?.promotions?.[0].discountValue}
											type={ProductCard.ProductType.dealShock}
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
											width='171px'
											height='171px'
										/>
									);
								})}
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		) : (
			<></>
		)
	) : (
		<div className='mt-4 bg-white py-8'>
			<div className='container'>
				<div className={`flex ${data?.length > 0 || prod?.length > 0 ? 'justify-between' : ''}`}>
					<div className='flex items-center gap-1'>
						<h2 className='font-sfpro_semiBold text-20 font-semibold text-[#009908]'>GIẢM SỐC</h2>
						<p className='text-18 text-[#999999]'> kết thúc trong</p>
						<div className='flex'>
							{/* <div className='text-18 text-[#009908]'>00 giờ</div> */}
							<div className=' text-18 text-[#009908]'>
								{Math.ceil(59 - date.getMinutes()) > 9
									? `${Math.ceil(59 - date.getMinutes())} `
									: `0${Math.ceil(59 - date.getMinutes())} `}
								phút
							</div>
							<div className='ml-1 text-18 text-[#009908]'>
								{Math.ceil(59 - date.getSeconds()) > 9
									? `${Math.ceil(59 - date.getSeconds())} `
									: `0${Math.ceil(59 - date.getSeconds())} `}
								giây
							</div>
						</div>
					</div>
					{(data?.length > 0 || prod?.length > 0) && (
						<Link href={'/'}>
							<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
								Xem tất cả {`>`}
							</p>
						</Link>
					)}
				</div>
				{Skeletons}
			</div>
		</div>
	);
};

export default DealShock;
