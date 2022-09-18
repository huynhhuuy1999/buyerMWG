import { ImageCustom, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { getSelectorVariantCart, useAppDispatch, useAppSelector } from 'hooks';
import { ICartPageProps } from 'models';
import React from 'react';
import { handleBuyLater, handleDeleteItemCart } from 'utils';

import { cartSelector } from '@/store/reducers/cartSlice';

const skeletons: JSX.Element = (
	<>
		{[...new Array(2)].map((_, i: number) => (
			<div className='mb-4 rounded-md bg-white p-3 first:rounded-t-none last-of-type:mb-0' key={i}>
				<div className='flex gap-3'>
					<div className='flex-auto'>
						<Skeleton.Skeleton lines={2} type='comment' />
					</div>
					<div className='aspect-square max-w-[110px] flex-[110px]'>
						<Skeleton.Skeleton
							cardType={Skeleton.CardType.square}
							type='card'
							width={'100%'}
							height={'110px'}
						/>
					</div>
				</div>
			</div>
		))}
	</>
);

const CartBuyLaterMobile: React.FC<ICartPageProps> = ({
	onMutable,
	dataCart,
	dataCartBuyLater,
}) => {
	const cartState = useAppSelector(cartSelector);
	const dispatch = useAppDispatch();
	return (
		<div className='my-2 rounded-md bg-white'>
			<span className='block px-3 pt-2 font-sfpro_bold text-16 font-semibold leading-6'>
				Sản phẩm lưu lại mua sau ({dataCartBuyLater?.products.length})
			</span>
			<div className='mt-4'>
				<span>
					{Boolean(dataCartBuyLater?.products.length)
						? (dataCartBuyLater?.products ?? [])?.map((itemBuyLater, i) => {
								// eslint-disable-next-line react-hooks/rules-of-hooks
								const valuesCheckPromote = getSelectorVariantCart({
									arrayOriginal: itemBuyLater,
									arrayPromotion: itemBuyLater.itemPromotions,
								});

								return (
									<div
										className='flex items-center justify-between border-y-2 border-t-[#F6F6F6] px-3'
										key={i}
									>
										<div className='flex items-center'>
											<div className='my-4 flex flex-col'>
												<div className='mb-3 flex flex-col'>
													<div className='text-14 font-medium'>{itemBuyLater.productName}</div>
													<span className='text-13 text-[#999999]'>
														{itemBuyLater?.propertyValueName1}
													</span>
												</div>

												<div className='inline-block w-auto pb-5'>
													<div className='my-auto flex items-center text-center'>
														<div className='font-sfpro_semiBold text-[14px] font-semibold not-italic leading-normal text-[#272728]'>
															{valuesCheckPromote?.data?.pricePromote.toLocaleString('it-IT') ||
																itemBuyLater.productPrice.toLocaleString('it-IT')}
															<sup>đ</sup>
														</div>
														{valuesCheckPromote?.data?.pricePromote &&
														valuesCheckPromote?.data?.discountPrice ? (
															<>
																<div className='pl-1 font-sfpro text-[12px] font-normal not-italic leading-normal tracking-[0.04px] text-[#6E6E70] line-through'>
																	{valuesCheckPromote?.data?.price.toLocaleString('it-IT')}
																</div>
																<span className='text-[12px] text-[#009908]'>
																	{' '}
																	-{valuesCheckPromote?.data?.discountPrice}%{' '}
																</span>
															</>
														) : null}
													</div>
												</div>

												<div className='flex space-x-3'>
													<button
														className='animation-300 flex items-center font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#3E3E40] hover:text-pink-F05A94'
														onClick={() =>
															handleBuyLater(
																itemBuyLater.productId,
																itemBuyLater.variationId,
																itemBuyLater.brandId,
																dispatch,
																onMutable,
																cartState,
																dataCart?.cartId ?? '',
															)
														}
													>
														<div className='relative mr-1 h-[15px] w-[15px]'>
															<ImageCustom src='/static/svg/icon-buy-later.svg' layout='fill' />
														</div>
														<span>Mua</span>
													</button>
													<button
														className='animation-300 flex items-center font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#3E3E40] hover:text-red-500'
														onClick={() =>
															handleDeleteItemCart(
																{
																	merchantId: itemBuyLater.merchantId,
																	reservationId: itemBuyLater.reservationId,
																	variationId: itemBuyLater.variationId,
																},
																onMutable,
																dataCart?.cartId ?? '',
																dispatch,
															)
														}
													>
														<div className='relative mr-1 h-[15px] w-[15px]'>
															<ImageCustom src='/static/svg/icon-delete-cart.svg' layout='fill' />
														</div>
														<span>Xóa</span>
													</button>
												</div>
											</div>
										</div>
										<div className='flex flex-col'>
											<div className='relative h-[98px] w-[98px]'>
												<ImageCustom
													src={itemBuyLater.variationImage || EmptyImage}
													alt='vuivui'
													layout='fill'
													objectFit='contain'
												/>
											</div>
											<div className='mx-auto mt-2 w-auto max-w-[80%] rounded border border-[#DADDE1] bg-[#F6F6F6] px-4 py-[6px] text-center'>
												{itemBuyLater.productQuantity}
											</div>
										</div>
									</div>
								);
						  })
						: skeletons}
				</span>
			</div>
		</div>
	);
};

export default CartBuyLaterMobile;
