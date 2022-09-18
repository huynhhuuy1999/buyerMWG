import classNames from 'classnames';
import { EmptyProduct, ImageCustom, Skeleton } from 'components';
import { getSelectorVariantCart, useAppDispatch } from 'hooks';
import { CartVariantItems, ICartPageProps } from 'models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { handleChangeShippingType } from 'utils';

import { cartActions } from '@/store/reducers/cartSlice';

import { CartProduct } from '../../common';
import { Dropdown } from '../../components';

const LoadingSkeleton = () => {
	return (
		<>
			{[...new Array(3)].map((_: any, i: number) => (
				<div className='mb-4 rounded-md bg-white p-3' key={i}>
					<div className='flex w-full gap-3'>
						<div className='flex'>
							<Skeleton.Skeleton
								cardType={Skeleton.CardType.square}
								type='card'
								width={110}
								height={110}
							/>
						</div>
						<Skeleton.Skeleton lines={2} type='comment' />
					</div>
				</div>
			))}
		</>
	);
};

const ListCartItemsDesktop: React.FC<ICartPageProps> = ({
	dataCart,
	dataCartBuyLater,
	onMutable,
	isLoading,
}) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const regexCartHasExistedBuyLater = Boolean(dataCartBuyLater?.products?.length);
	const regexCartHasExistedItems = Boolean(dataCart?.cartItems.length);
	return (
		<React.Fragment>
			<div className='w-full'>
				<div className='flex items-center space-x-3 pb-[9px]'>
					<img
						className='h-auto w-2'
						src='/static/svg/chevron-left-black.svg'
						alt='chevron vuivui'
					/>
					<span
						className='font-sfpro_bold text-[20px] font-bold uppercase not-italic leading-normal text-[#3E3E40]'
						onClick={() => router.back()}
						onKeyPress={() => router.back()}
						tabIndex={0}
						role={'button'}
					>
						Giỏ hàng
					</span>
				</div>
			</div>
			{regexCartHasExistedBuyLater && !regexCartHasExistedItems ? (
				<div className='mb-2'>
					<EmptyProduct
						title='Vui lòng mua thêm, hoặc chọn thanh toán lại sản phẩm !!'
						height='h-auto'
					/>
				</div>
			) : (
				<div className='relative'>
					<div>
						{isLoading?.cartBuyNow &&
						Number(
							dataCart?.cartItems?.reduce((prev: CartVariantItems[], curr) => {
								return (prev = curr.items);
							}, [])?.length,
						) > 1 ? (
							<LoadingSkeleton />
						) : (
							<>
								{dataCart?.cartItems
									?.filter((t) => t.items.length > 0)
									?.map((itemsInfo, i) => {
										const valueItems = itemsInfo.items;
										const valueMerchants = itemsInfo.merchant;
										const valuesBrand = itemsInfo.brand;
										return (
											<div className='mb-2 rounded-md bg-white border-[#E3E3E3] border p-3' key={i}>
												<div className='flex justify-between py-3 border-b'>
													{valuesBrand ? (
														<Link href={`/${valuesBrand?.urlSlug}`}>
															<a className='flex gap-[8px] cursor-pointer items-center justify-end space-x-2'>
																<div className='relative aspect-square border border-[#E0E0E0] h-[36px] w-full max-w-[36px] overflow-hidden rounded-full'>
																	<ImageCustom
																		layout='fill'
																		objectFit='cover'
																		src={valuesBrand?.logo}
																	/>
																</div>
																<div className='flex flex-col'>
																	<span className='flex w-auto justify-end text-ellipsis font-sfpro_semiBold text-[18px] font-medium uppercase not-italic leading-5 text-[#0E0E10] underline line-clamp-2'>
																		{valuesBrand?.name}
																	</span>
																	<span className='text-[#999999] text-[13px] line-clamp-2 text-ellipsis'>
																		Xử lý đơn hàng bởi {valueMerchants?.name}
																	</span>
																</div>
															</a>
														</Link>
													) : null}
												</div>
												{valueItems.map((item, i) => {
													const valuesCheckPromote = getSelectorVariantCart({
														arrayOriginal: item,
														arrayPromotion: item.itemPromotions,
													});

													return (
														<CartProduct
															key={i}
															mode='CART_BUY_NOW'
															onMutable={onMutable}
															forMerchant={valueMerchants}
															extraData={item}
															id={dataCart.cartId}
															defaultVariantProduct={item.variationId}
															originPrice={
																valuesCheckPromote?.data?.pricePromote
																	? valuesCheckPromote?.data?.price
																	: ''
															}
															limitStockPromotions={
																valuesCheckPromote?.data?.numberUsedEachCustomer
															}
															productPrice={
																valuesCheckPromote?.data?.pricePromote || item.productPrice
															}
														/>
													);
												})}
												<div
													className={classNames([
														'flex gap-[6px] pt-3',
														Boolean(itemsInfo?.shippings?.length > 0) ? 'auto' : 'justify-start',
													])}
												>
													<div className='w-[20px] h-[20px] relative'>
														<ImageCustom
															src={'/static/svg/icon-shippings-new.svg'}
															alt={''}
															layout={'fill'}
														/>
													</div>
													{Boolean(itemsInfo?.shippings?.length > 0) ? (
														<>
															<div className='flex items-center space-x-3'>
																{itemsInfo?.shippings?.length > 1 ? (
																	<Dropdown
																		onChange={(value, onFailed) => {
																			itemsInfo?.shippings?.find((ele) => ele?.isSelected)
																				?.deliveryTypeCode !== value &&
																				handleChangeShippingType(
																					String(value),
																					itemsInfo,
																					dataCart?.cartId,
																					(loading) => dispatch(cartActions.isLoading(loading)),
																					onMutable,
																					{
																						onFailed: onFailed,
																						idOld: itemsInfo?.shippings?.find(
																							(ele) => ele?.isSelected,
																						)?.deliveryTypeCode!,
																					},
																				);
																		}}
																		disabled={!Boolean(itemsInfo?.shippings?.length > 0)}
																		textDefaults={'Chọn hình thức vận chuyển'}
																		className='font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'
																		defaultValue={
																			Boolean(itemsInfo?.shippings?.length > 0)
																				? itemsInfo?.shippings.find((t) => t.isSelected)
																						?.deliveryTypeCode
																				: 'DEFAULT'
																		}
																		options={itemsInfo.shippings?.map((item) => {
																			return {
																				label: item.deliveryTypeName,
																				value: item.deliveryTypeCode,
																			};
																		})}
																		icon={
																			<img
																				className='ml-2 h-auto w-2'
																				src='/static/svg/arrow_drop_down.svg'
																				alt='vuivui arrow'
																			/>
																		}
																	/>
																) : (
																	<span className='block font-sfpro_bold font-bold text-[14px] not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'>
																		{
																			itemsInfo?.shippings?.find((t) => t?.isSelected)
																				?.deliveryTypeName
																		}
																	</span>
																)}
															</div>
															<div className='flex flex-auto justify-end items-center space-x-2'>
																<span className='!ml-0 font-sfpro text-[14px]  font-normal not-italic leading-normal text-[#999999]'>
																	{`${
																		itemsInfo?.shippings.find((t) => t.isSelected)?.timeCommitment
																	} - ${itemsInfo?.shippings
																		.find((t) => t.isSelected)
																		?.totalPay.toLocaleString('it-IT')}`}
																	<sup className='text-[#999999]'>đ</sup>
																</span>
															</div>
														</>
													) : (
														<span className='font-sfpro text-[14px] font-normal not-italic leading-normal text-[#999999]'>
															Vui lòng chọn địa chỉ để biết thêm thông tin
														</span>
													)}
												</div>
											</div>
										);
									})}
							</>
						)}
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default ListCartItemsDesktop;
