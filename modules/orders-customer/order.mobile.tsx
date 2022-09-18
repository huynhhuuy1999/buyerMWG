import classNames from 'classnames';
import { CardMerchant, ProductCard, ProductType, ReviewCard, Skeleton, ViewList } from 'components';
import { DEFAULT_PARAMS_PAGINATION } from 'constants/';
import { getSelectorVariants } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { NavigatorBottomTabMobile } from '../navigator-bottom-tabs';
import OrderListItem from './order-list.mobile';
import { ordersPageProps } from './types';

interface IrenderBlockProps {
	children?: React.ReactNode;
	title?: string;
	subTitle?: string;
	viewPrefix?: string;
	className?: string;
	href: string;
}

const RenderBlockCard: React.FC<IrenderBlockProps> = ({
	children,
	title,
	viewPrefix,
	className,
	subTitle,
	href,
	...rest
}: IrenderBlockProps) => {
	return (
		<div
			className={classNames(['py-2 mb-2 mx-2 border-[#F6F6F6] bg-white rounded-xl', className])}
			{...rest}
		>
			<Link href={href}>
				{title || subTitle ? (
					<div className={classNames(['flex justify-between px-4 py-4 '])}>
						<div className='flex flex-col'>
							<div className='text-base font-medium leading-5 text-[#333333]'>{title}</div>
							<div className='text-13 text-[#999999]'>{subTitle}</div>
						</div>
						<span className='text-14 font-normal leading-5 text-[#999999]'>{viewPrefix}</span>
					</div>
				) : (
					''
				)}
			</Link>

			{children}
		</div>
	);
};

const OrdersMobile: React.FC<ordersPageProps> = ({
	onMutate,
	dataOrderItems,
	dataProductViewed,
	dataLiked,
	dataBrandFavorite,
	dataWaitingReview,
}) => {
	const { push } = useRouter();

	const hrefList = {
		order: '/ca-nhan/don-hang',
		register: process.env.NEXT_SELLER_REGISTER_DOMAIN || '',
		rating: '/ca-nhan/danh-gia',
		viewed: '/ca-nhan/san-pham-da-xem',
		liked: '/ca-nhan/san-pham-yeu-thich',
		merchant: '/ca-nhan/nha-ban-yeu-thich',
	};

	const propsViewList = {
		setItem: (item: any) => {
			return <CardMerchant data={item} />;
		},
		setLoadingCard: () => {
			return (
				<>
					{[...new Array(6)].map((_, index) => {
						return (
							<Skeleton.Skeleton
								key={index}
								cardType={Skeleton.CardType.square}
								type='card'
								width={255}
								height={353}
								isDescription
							></Skeleton.Skeleton>
						);
					})}
				</>
			);
		},
	};
	const [isLoadingMoreOrders, setIsLoadingMoreOrders] = useState<boolean>(false);
	const handleScrollTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};
	return (
		<div className='mb-12 bg-[#F6F6F6] pb-16 pt-2'>
			{/* <div className='bg-white mx-2'> */}
			{/* render order item */}
			{/* <div className='flex items-center justify-between px-4 py-4'>
					<div className='text-base font-semibold leading-5'>Đơn hàng</div>
					<span className='text-14 font-semibold leading-5 text-[#999999]'>Xem thêm &#8250;</span>
				</div> */}
			<RenderBlockCard title='Đơn hàng' href={hrefList.order}>
				{dataOrderItems && dataOrderItems.totalRecord > 0 ? (
					<OrderListItem
						orderItems={dataOrderItems}
						onMutate={onMutate}
						isLoadingMore={isLoadingMoreOrders}
					/>
				) : (
					<div className='px-4 pb-4'>
						<button
							onClick={() => push('/')}
							className='w-full rounded border border-transparent bg-[#DADDE1] px-8 py-3 text-base  font-medium hover:bg-slate-300'
						>
							Tiếp tục mua sắm
						</button>
					</div>
				)}
				{Boolean(Number(dataOrderItems?.orderStatusCount?.allOrder) > 5) && (
					<div
						className='pb-7 pt-1'
						onClick={() => {
							if (!isLoadingMoreOrders) {
								setIsLoadingMoreOrders(!isLoadingMoreOrders);
							} else {
								handleScrollTop();
								setIsLoadingMoreOrders(!isLoadingMoreOrders);
							}
						}}
						onKeyPress={() => {
							if (!isLoadingMoreOrders) {
								setIsLoadingMoreOrders(!isLoadingMoreOrders);
							} else {
								handleScrollTop();
								setIsLoadingMoreOrders(!isLoadingMoreOrders);
							}
						}}
						tabIndex={0}
						role={'button'}
					>
						<button className='px-auto w-full rounded-6px border-y border-[#EBEBEB] py-4 text-center font-sfpro_semiBold text-14 font-semibold outline-none'>
							{!isLoadingMoreOrders
								? `Xem tất cả đơn hàng (${
										Number(dataOrderItems?.orderStatusCount?.allOrder) - 5
								  }) >`
								: 'Thu gọn'}
						</button>
					</div>
				)}
			</RenderBlockCard>

			{/* render product with any type */}
			{Boolean(dataProductViewed?.length) ? (
				<RenderBlockCard
					title='Sản phẩm đã xem gần đây'
					viewPrefix='Xem thêm &#8250;'
					href={hrefList.viewed}
				>
					{/* product card */}
					<div className='hide-scrollbar flex flex-nowrap gap-2 overflow-y-scroll px-4'>
						{dataProductViewed?.map((item, i: number) => (
							<div className='max-w-4/10 flex-4/10' key={i}>
								<ProductCard.ProductCard
									image={item.variations?.[0]?.variationImage}
									width={135}
									animation={false}
									height={135}
									type={ProductType.recommend}
									path={`/${item?.categoryUrlSlug}/${item?.urlSlug}`}
									isHeart={item?.isLike === 1}
								/>
							</div>
						))}
					</div>
				</RenderBlockCard>
			) : (
				<>
					<RenderBlockCard
						title='Sản phẩm đã xem gần đây'
						viewPrefix='Danh sách trống'
						href={hrefList.viewed}
					/>
				</>
			)}

			{/* render product waiting for review */}
			{Boolean(dataWaitingReview?.length) ? (
				<>
					<RenderBlockCard
						title='Sản phẩm chờ đánh giá'
						viewPrefix='Danh sách trống'
						href={hrefList.rating}
					>
						<div className='hide-scrollbar flex flex-nowrap gap-2 overflow-y-scroll px-4'>
							{dataWaitingReview?.map((item) => (
								<div className='text-center' key={item.waitingListId}>
									<ReviewCard
										merchantName={item.merchantInfo.name}
										logo={item.merchantInfo.pathImage}
										image={item.productInfo[0]?.variationImage}
										valueRating={0}
									/>
								</div>
							))}
						</div>
					</RenderBlockCard>
				</>
			) : (
				<>
					<RenderBlockCard
						title='Sản phẩm chờ đánh giá'
						viewPrefix='Danh sách trống'
						href={hrefList.rating}
					/>
				</>
			)}

			{/* render product favourites */}
			{Boolean(dataLiked?.length) ? (
				<RenderBlockCard
					title='Sản phẩm yêu thích'
					viewPrefix='Xem thêm &#8250;'
					href={hrefList.liked}
				>
					{/* product card */}
					<div className='hide-scrollbar flex flex-nowrap gap-2 overflow-y-scroll px-[1rem]'>
						{dataLiked?.map((item: any, i: number) => {
							let values = getSelectorVariants({
								product: item,
							});
							let percentDiscount = item?.promotions?.length
								? item?.promotions[0].discountValue
								: 0;
							return (
								<div className='max-w-4/10 flex-4/10 ' key={i}>
									<ProductCard.ProductCard
										type={ProductType.favoriteProduct}
										description={item?.title}
										price={values?.pricePromote || values?.price}
										image={item?.variations?.[0]?.variationImage}
										percentDiscount={percentDiscount}
										priceDash={values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0}
										isHeart={item?.isLike}
										path={`/${item?.categoryUrlSlug}/${item?.urlSlug}`}
									/>
								</div>
							);
						})}
					</div>
				</RenderBlockCard>
			) : (
				<>
					<RenderBlockCard
						title='Sản phẩm yêu thích'
						viewPrefix='Danh sách trống'
						href={hrefList.liked}
					/>
				</>
			)}

			{Boolean(dataBrandFavorite?.data?.length) ? (
				<RenderBlockCard
					title='Thương hiệu yêu thích'
					viewPrefix='Xem thêm &#8250;'
					subTitle={'1.242 thương hiệu đang có khuyến mãi'}
					href={hrefList.merchant}
				>
					{/* product card */}
					<div className='hide-scrollbar overflow-auto px-3'>
						<ViewList
							{...propsViewList}
							loading={Boolean(dataBrandFavorite?.isValid)}
							data={dataBrandFavorite?.data}
							pageSize={DEFAULT_PARAMS_PAGINATION.pageSize}
							page={DEFAULT_PARAMS_PAGINATION.page}
							totalObject={dataBrandFavorite?.data?.length}
							className={`gap-3`}
							isOverFlow
						/>
					</div>
				</RenderBlockCard>
			) : (
				<>
					<RenderBlockCard
						title='Thương hiệu yêu thích'
						viewPrefix='Danh sách trống'
						href={hrefList.merchant}
					/>
				</>
			)}

			<a href={hrefList.register} target='_blank' rel='noreferrer'>
				<button
					className={classNames(['w-full flex items-center justify-between px-4 py-4'])}
					// onClick={() =>
					// 	window.open(`${process.env.NEXT_PUBLIC_DOMAIN_URL_SELLER}/register`, '_blank')
					// }
				>
					<div className='flex w-full items-center'>
						<img src='/static/svg/store-icon.svg' alt='' className='mr-2' /> Đăng ký bán hàng
					</div>
					<img src='/static/svg/next.svg' alt='' />
				</button>
			</a>

			<NavigatorBottomTabMobile />
		</div>
	);
};

export default OrdersMobile;
