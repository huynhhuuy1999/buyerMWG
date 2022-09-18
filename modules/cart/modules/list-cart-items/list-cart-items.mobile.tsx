import { EmptyProduct, ImageCustom } from 'components';
import { getSelectorVariantCart, useAppDispatch } from 'hooks';
import { ICartPageProps } from 'models';
import Link from 'next/link';
import React from 'react';
import { handleChangeShippingType } from 'utils';

import { cartActions } from '@/store/reducers/cartSlice';

import { CartProduct } from '../../common';
import { Dropdown } from '../../components';

const ListCartItemsMobile: React.FC<ICartPageProps> = ({
	dataCart,
	dataCartBuyLater,
	onMutable,
	forDevice,
}) => {
	const dispatch = useAppDispatch();
	const regexCartHasExistedBuyLater = Boolean(dataCartBuyLater?.products?.length);
	const regexCartHasExistedItems = Boolean(dataCart?.cartItems.length);

	return (
		<>
			{regexCartHasExistedBuyLater && !regexCartHasExistedItems ? (
				<div className='mb-2 border-t-8 border-[#F6F6F6]'>
					<EmptyProduct
						title='Vui lòng mua thêm, hoặc chọn thanh toán lại sản phẩm !!'
						height='!h-auto'
					/>
				</div>
			) : (
				<>
					{dataCart?.cartItems
						?.filter((t) => t.items.length > 0)
						?.map((itemsInfo, i) => {
							const valueItems = itemsInfo.items;
							const valueMerchants = itemsInfo.merchant;
							const valuesBrand = itemsInfo.brand;
							return (
								<div className='mb-2 rounded-md border-t-8 border-[#F6F6F6] bg-white p-3' key={i}>
									<div className='flex items-center justify-between border-b border-solid border-[#F2F2F2] pb-3'>
										{valuesBrand ? (
											<Link href={`/${valuesBrand?.urlSlug}`}>
												<a className='flex gap-[8px] cursor-pointer items-center justify-end space-x-2'>
													<div className='relative aspect-square border border-[#E0E0E0] h-[36px] w-full max-w-[36px] overflow-hidden rounded-full'>
														<ImageCustom layout='fill' objectFit='cover' src={valuesBrand?.logo} />
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
										// eslint-disable-next-line react-hooks/rules-of-hooks
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
												productHasExisted={valueItems?.map((ele) => ele?.variationId)}
												defaultVariantProduct={item?.variationId}
												forDevice={forDevice}
												originPrice={
													valuesCheckPromote?.data?.pricePromote
														? valuesCheckPromote?.data?.price
														: ''
												}
												limitStockPromotions={valuesCheckPromote?.data?.numberUsedEachCustomer}
												productPrice={valuesCheckPromote?.data?.pricePromote || item.productPrice}
											/>
										);
									})}

									<div className='flex items-center justify-between space-x-3 pt-3'>
										<Dropdown
											onChange={(value, onFailed) => {
												itemsInfo?.shippings?.find((ele) => ele?.isSelected)?.deliveryTypeCode !==
													value &&
													handleChangeShippingType(
														String(value),
														itemsInfo,
														dataCart?.cartId,
														(loading) => dispatch(cartActions.isLoading(loading)),
														onMutable,
														{
															onFailed: onFailed,
															idOld: itemsInfo?.shippings?.find((ele) => ele?.isSelected)
																?.deliveryTypeCode!,
														},
													);
											}}
											disabled={!Boolean(itemsInfo?.shippings?.length > 0)}
											textDefaults={'Chọn hình thức vận chuyển'}
											className='font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'
											defaultValue={
												Boolean(itemsInfo?.shippings?.length > 0)
													? itemsInfo?.shippings.find((t) => t.isSelected)?.deliveryTypeCode
													: 'DEFAULT'
											}
											options={itemsInfo.shippings?.map((item) => {
												return { label: item.timeCommitment, value: item.deliveryTypeCode };
											})}
											icon={
												<img
													className='ml-2 h-auto w-2'
													src='/static/svg/arrow_drop_down.svg'
													alt='vuivui arrow'
												/>
											}
										/>
										<span className='font-sfpro text-[14px] font-normal not-italic leading-normal text-[#6E6E70]'>
											{Boolean(itemsInfo?.shippings?.length > 0)
												? `${itemsInfo?.shippings
														.find((t) => t.isSelected)
														?.totalPay.toLocaleString('it-IT')}đ`
												: 'Vui lòng chọn địa chỉ'}
										</span>
									</div>
								</div>
							);
						})}
				</>
			)}
		</>
	);
};

export default ListCartItemsMobile;
