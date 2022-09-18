import classNames from 'classnames';
import { CustomIframe, ImageCustom, Notification } from 'components';
import { useAppCart, useAppDispatch, useAppSelector } from 'hooks';
import {
	Actions,
	CartVariantItems,
	ICartFormProps,
	ICartPageProps,
	TypeActionShippingAddress,
} from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { updateInvoiceCart, updateShippingCart } from 'services';
import {
	handleChangeShippingType,
	handleMultiItemsPushBuyLater,
	handleSubmitCreateOrder,
	handleSubmitForCreateAddress,
	handleSubmitForEditAddress,
} from 'utils';
import { Icon, IconEnum } from 'vuivui-icons';

import { addressSelector } from '@/store/reducers/address';
import { deviceTypeSelector } from '@/store/reducers/appSlice';
import { currentUserSelector } from '@/store/reducers/authSlice';
import { cartActions } from '@/store/reducers/cartSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

import { CartMemo } from './common';
import { Drawer, Dropdown } from './components';
import { RenderButtonWithAction } from './components/ButtonBuyNow';
import { getConditionCart, useFormCart } from './hooks';
import { IframeProps, ProductOutofStockProps, VerifyOTPProps } from './types';

const DynamicCartShippingMobile = dynamic(
	() => import('./modules/cart-shipping/cart-shipping.mobile'),
	{
		loading: () => <>Loading...</>,
		ssr: false,
	},
);

const DynamicCartInvoice = dynamic(() => import('./common/cart-invoice'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicCartPayment = dynamic(() => import('./common/cart-payment'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicListCartItemsMobile = dynamic(
	() => import('./modules/list-cart-items/list-cart-items.mobile'),
	{
		loading: () => <>Loading...</>,
		ssr: false,
	},
);

const DynamicCartBuyLaterMobile = dynamic(
	() => import('./modules/cart-buy-later/cart-buy-later.mobile'),
	{
		loading: () => <>Loading...</>,
		ssr: false,
	},
);

const DynamicCartVouchersMobile = dynamic(
	() => import('./modules/cart-vouchers/cart-vouchers.mobile'),
	{
		loading: () => <>Loading...</>,
		ssr: false,
	},
);

const DynamicModalVerifyUserMobile = dynamic(() => import('./components/ModalVerifyUserMobile'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicCartOutOfStockMobile = dynamic(
	() => import('./modules/cart-out-of-stock/cart-out-of-stock.mobile'),
	{
		loading: () => <>Loading...</>,
		ssr: false,
	},
);

const CartMobile: React.FC<ICartPageProps> = ({
	dataCart,
	dataCartBuyLater,
	paymentMethod,
	hasIsOutOfStock,
	dataProfiles,
	onMutable,
	isLoading,
}) => {
	const router = useRouter();
	const deviceType = useAppSelector(deviceTypeSelector);
	const dispatch = useAppDispatch();
	const addressState = useAppSelector(addressSelector);
	const authSelector = useAppSelector(currentUserSelector);
	const PHONE_NUMBER_HAS_CONFIRMED = Boolean(authSelector?.phoneNumberConfirmed);
	const { cartState } = useAppCart();
	const [isShowPageOrderDetail, setIsShowPageOrderDetail] = useState<boolean>(false);
	const [isShowPageChangeAddress, setIsShowPageChangeAddress] = useState<boolean>(false);
	const [hasOutOfStock, setHasOutOfStock] = useState<ProductOutofStockProps>({
		isActiveDrawer: false,
		isOutofStock: false,
		isConfirm: false,
		dataOutOfStock: [],
	});
	const [isShowVerifyInfo, setIsShowVerifyInfo] = useState<boolean>(false);
	const [isShowVerifyOTP, setIsShowVerifyOTP] = useState<VerifyOTPProps>({
		phoneNumber: '',
		gender: 0,
		contactName: '',
		isActive: false,
		verifyId: 0,
		type: '',
	});
	const [isFullAddress, setIsFullAddress] = useState<boolean>(false);
	const [isShowIframe, setShowIframe] = useState<IframeProps>({
		callbackUrl: '',
		isActive: false,
		title: '',
		orderId: '',
	});

	const [typeAction, setTypeAction] = useState<TypeActionShippingAddress>({
		action: 'RESELECT',
		isActionActive: false,
		isActiveOrder: false,
		id: null,
	});

	const {
		regexActionCurrentSubmit,
		regexCartItemNotExisted,
		regexEmptyCartWithItemBuyLater,
		regexHasChooseDelivery,
		regexHasPaymentMethodEnable,
		regexHasProfile,
		regexHasExistedItemBuyLater,
	} = getConditionCart(typeAction, dataCart, dataCartBuyLater, dataProfiles, paymentMethod);
	const { validCartForms, methods } = useFormCart(
		paymentMethod,
		typeAction,
		addressState?.typePickupAddress,
		dataCart,
	);

	const mountedTypeAction = useCallback(() => {
		setTypeAction((prev) => ({
			...prev,
			isActiveOrder:
				regexHasProfile &&
				regexActionCurrentSubmit &&
				regexHasChooseDelivery &&
				!regexEmptyCartWithItemBuyLater &&
				!hasIsOutOfStock,
		}));
		methods.setValue('paymentMethods', paymentMethod);
		dataCart?.cartItems
			?.reduce((prev: CartVariantItems[], curr) => {
				return (prev = curr.items);
			}, [])
			?.some((ele) => ele?.isOutOfStock) &&
			setHasOutOfStock((prev) => ({
				...prev,
				dataOutOfStock: dataCart?.cartItems
					?.reduce((prev: CartVariantItems[], curr) => {
						return (prev = curr.items);
					}, [])
					?.filter((ele) => ele.isOutOfStock),
				isOutofStock: true,
			}));
	}, [
		methods,
		regexHasProfile,
		regexActionCurrentSubmit,
		regexHasChooseDelivery,
		regexEmptyCartWithItemBuyLater,
		isShowPageOrderDetail,
		hasIsOutOfStock,
	]);

	useEffect(() => {
		mountedTypeAction();
	}, [mountedTypeAction]);

	//set default shippings
	useEffect(() => {
		(async () => {
			// check if cart not existed shipping for profile (default values)
			if (dataProfiles?.length && !dataCart?.cartShipping?.profileId && dataCart?.cartId) {
				try {
					await updateShippingCart(
						dataCart?.cartId,
						String(dataProfiles?.find((t) => t.isDefault)?.profileId),
					);
					await onMutable({
						method: 'GET',
						url: `/cart/${dataCart?.cartId}`,
					});
					Notification.Loading.remove();
				} catch (error) {
					getErrorMessageInstance(error);
				}
			}
			Notification.Loading.remove();
		})();
	}, [dataCart?.cartId]);

	const onSubmit = async (formData: ICartFormProps) => {
		const checkRulesSubmit = {
			forOrder:
				regexHasProfile &&
				regexActionCurrentSubmit &&
				!regexEmptyCartWithItemBuyLater &&
				regexHasChooseDelivery,
			forCreate:
				typeAction.action === 'CREATE' ||
				(typeAction.action === 'RESELECT' && !typeAction.isActiveOrder),
			forEdit: typeAction.action === 'EDIT',
		};
		const hasFalseKeys = Object.keys(checkRulesSubmit).filter((k) => checkRulesSubmit[k]);
		Notification.Loading.custom();

		switch (hasFalseKeys?.[0]) {
			case 'forOrder':
				const { companyAddress, companyName, companyTaxCode, isCompany } = formData;
				const values = { ...dataCart?.cartShipping };

				addressState?.typePickupAddress === 'homeDelivery'
					? delete values['pickupStoreId']
					: values;

				if (isCompany) {
					const paramsUpdateInvoice = await updateInvoiceCart(dataCart?.cartId!, {
						invoice: {
							companyName: companyName!,
							invoiceAddress: companyAddress!,
							taxCode: companyTaxCode!,
						},
						isInvoice: isCompany,
					});
					paramsUpdateInvoice?.data &&
						handleSubmitCreateOrder(dataCart?.cartId, deviceType, (value) =>
							setShowIframe((prev) => ({
								...prev,
								isActive: value.isActive,
								callbackUrl: value.callbackUrl,
								title: value.title,
								orderId: value.orderId,
							})),
						);
				} else {
					handleSubmitCreateOrder(dataCart?.cartId, deviceType, (value) =>
						setShowIframe((prev) => ({
							...prev,
							isActive: value.isActive,
							callbackUrl: value.callbackUrl,
							title: value.title,
							orderId: value.orderId,
						})),
					);
				}

				return;
			case 'forEdit':
				handleSubmitForEditAddress(
					formData,
					typeAction?.id ?? '',
					onMutable,
					setTypeAction,
					dataCart?.cartId,
					addressState?.typePickupAddress,
				);
				methods.setValue('paymentMethods', paymentMethod);
				setIsShowPageChangeAddress(false);
				return;
			case 'forCreate':
				handleSubmitForCreateAddress(
					formData,
					onMutable,
					setTypeAction,
					dataCart?.cartId,
					addressState?.typePickupAddress,
					() => {
						if (!PHONE_NUMBER_HAS_CONFIRMED) {
							setIsShowPageOrderDetail(!isShowPageOrderDetail);
							setIsShowPageChangeAddress(false);
						} else {
							setIsShowPageChangeAddress(false);
						}
					},
				);
				methods.setValue('paymentMethods', paymentMethod);
				return;
			default:
				return;
		}
	};

	const handleSubmitPhoneSuccess = (data: any) => {
		setIsShowVerifyOTP({
			...isShowVerifyOTP,
			contactName: data.contactName,
			gender: data.gender,
			isActive: true,
			phoneNumber: data.phoneNumber,
			verifyId: data.verifyId,
			type: authSelector?.mobilePhone ? 'CHANGE' : 'NEW',
		});
	};

	const handleClosePopup = () => {
		setIsShowVerifyInfo(false);
		setIsShowVerifyOTP({
			...isShowVerifyOTP,
			contactName: '',
			gender: 0,
			isActive: false,
			phoneNumber: '',
			verifyId: 0,
			type: '',
		});
		// setIsShowPageOrderDetail(true);
		// setIsShowPageChangeAddress(true);
	};

	return (
		<React.Fragment>
			<div
				className={classNames([
					!isShowPageOrderDetail && !isShowVerifyInfo
						? 'visible opacity-100 animation-300 z-0 relative'
						: 'invisible opacity-0 animation-300 z-0 relative',
					'bg-[#f6f6f6]',
				])}
			>
				<div
					className='top-0 z-[10] gap-[26px] flex items-center bg-white px-3 py-4'
					tabIndex={0}
					style={{ position: 'sticky' }}
					role='button'
					onClick={() => router.back()}
					onKeyPress={() => router.back()}
				>
					<Icon name={IconEnum.ArrowLeft} color={'#333333'} size={14} />
					<div className='font-sfpro text-base font-semibold text-[#333333]'>Giỏ hàng</div>
				</div>

				<div className='p-[6px]'>
					{!dataCart?.cartShipping?.profileId ? (
						<div
							className='flex w-full items-center justify-between px-3 py-2.5 bg-[#FFFFFF]'
							tabIndex={0}
							onClick={() => {
								if (hasOutOfStock?.isOutofStock && !hasOutOfStock?.isConfirm) {
									setHasOutOfStock((prev) => ({ ...prev, isActiveDrawer: true }));
								} else {
									setIsShowPageOrderDetail(true);
									setIsShowPageChangeAddress(true);
									setTypeAction((prev) => ({ ...prev, action: 'CREATE', isActiveOrder: false }));
								}
							}}
							onKeyPress={() => {
								if (hasOutOfStock?.isOutofStock && !hasOutOfStock?.isConfirm) {
									setHasOutOfStock((prev) => ({ ...prev, isActiveDrawer: true }));
								} else {
									setIsShowPageOrderDetail(true);
									setIsShowPageChangeAddress(true);
									setTypeAction((prev) => ({ ...prev, action: 'CREATE', isActiveOrder: false }));
								}
							}}
							role='button'
						>
							<div className='flex items-center'>
								<div className='relative mr-15px h-5 w-5'>
									<ImageCustom
										className='cursor-pointer '
										src='/static/svg/icon-map-address.svg'
										alt='search'
										layout='fill'
									/>
								</div>

								<div className='font-sfpro text-base font-semibold text-[#999999]'>
									<div className='flex flex-col'>
										<div className='text-14'>Giao đến</div>
										<div className='font-sfpro_semiBold font-semibold text-[#333333]'>
											Bấm để chọn vị trí nhận hàng
										</div>
									</div>
								</div>
							</div>

							<div className='relative h-5 w-5'>
								<ImageCustom
									className='cursor-pointer '
									src='/static/svg/chevron-down.svg'
									alt='search'
									layout='fill'
								/>
							</div>
						</div>
					) : (
						<div
							className='flex w-full items-center justify-between px-3 py-2.5 bg-[#FFFFFF]'
							tabIndex={0}
							onClick={() => {
								if (hasOutOfStock?.isOutofStock && !hasOutOfStock?.isConfirm) {
									setHasOutOfStock((prev) => ({ ...prev, isActiveDrawer: true }));
								} else {
									setIsShowPageOrderDetail(true);
									setIsShowPageChangeAddress(true);
									if (!dataProfiles?.length) {
										setTypeAction((prev) => ({ ...prev, action: 'CREATE', isActiveOrder: false }));
									} else {
										setIsFullAddress(true);
									}
								}
							}}
							onKeyPress={() => {
								if (hasOutOfStock?.isOutofStock && !hasOutOfStock?.isConfirm) {
									setHasOutOfStock((prev) => ({ ...prev, isActiveDrawer: true }));
								} else {
									setIsShowPageOrderDetail(true);
									setIsShowPageChangeAddress(true);
									if (!dataProfiles?.length) {
										setTypeAction((prev) => ({ ...prev, action: 'CREATE', isActiveOrder: false }));
									} else {
										setIsFullAddress(true);
									}
								}
							}}
							role='button'
						>
							<div className='flex items-center'>
								<div className='relative mr-15px h-5 w-5'>
									<ImageCustom
										className='cursor-pointer '
										src='/static/svg/icon-map-address.svg'
										alt='search'
										layout='fill'
									/>
								</div>

								<div className='font-sfpro text-base font-semibold text-[#999999]'>
									<div className='flex flex-col'>
										<div className='text-14'>Giao đến</div>
										<div className='text-ellipsis font-sfpro_semiBold font-semibold text-[#333333] line-clamp-1'>
											{dataCart?.cartShipping?.fullAddress
												?.split(', ')
												.filter((ele) => ele)
												.join(', ')}
										</div>
									</div>
								</div>
							</div>

							<div className='relative h-5 w-5'>
								<ImageCustom
									className='cursor-pointer '
									src='/static/svg/chevron-down.svg'
									alt='search'
									layout='fill'
								/>
							</div>
						</div>
					)}

					<div className='hide-scrollbar relative h-auto overflow-auto border-b-8 border-[#F6F6F6]'>
						<DynamicListCartItemsMobile
							dataCart={dataCart}
							onMutable={onMutable}
							dataCartBuyLater={dataCartBuyLater}
							isLoading={{ cartBuyNow: isLoading?.cartBuyNow }}
							forDevice={deviceType}
						/>

						{!isShowPageOrderDetail && !regexEmptyCartWithItemBuyLater && (
							<>
								<DynamicCartVouchersMobile
									dataCart={dataCart}
									onMutable={onMutable}
									dataVouchers={dataCart?.vouchers}
								/>
								<div className='relative h-auto w-full px-4'>
									<RenderButtonWithAction
										condition={{
											activeActionCurrentSubmit: regexActionCurrentSubmit,
											cartItemNotExisted: regexCartItemNotExisted,
											hasChooseDelivery: regexHasChooseDelivery,
											hasPaymentTypeEnable: regexHasPaymentMethodEnable,
											hasExistedBuyLater: regexHasExistedItemBuyLater,
											hasProfile: regexHasProfile,
										}}
										isLoading={cartState?.isLoading}
										suffixCurrencyTotal={dataCart?.cartPayment?.paymentTotal || 0}
										className={'bottom-0'}
										isAction={typeAction}
										isPreviewOrderDetail={true}
										onPreview={() => {
											if (hasOutOfStock?.isOutofStock && !hasOutOfStock?.isConfirm) {
												setHasOutOfStock((prev) => ({ ...prev, isActiveDrawer: true }));
											} else if (!PHONE_NUMBER_HAS_CONFIRMED) {
												setIsShowVerifyInfo(true);
											} else {
												setIsShowPageOrderDetail(!isShowPageOrderDetail);
											}
										}}
										isValidForms={validCartForms}
									/>
								</div>
							</>
						)}
					</div>

					{!isShowPageOrderDetail && Number(dataCartBuyLater?.products?.length) > 0 && (
						<DynamicCartBuyLaterMobile
							dataCart={dataCart}
							dataCartBuyLater={dataCartBuyLater}
							onMutable={onMutable}
							isLoading={{ cartBuyNow: isLoading?.cartBuyLater }}
						/>
					)}
				</div>
			</div>

			<Drawer
				isOpen={isShowPageOrderDetail}
				direction='RIGHT'
				height={classNames([
					isShowPageChangeAddress ? 'z-0' : 'hide-scrollbar overflow-auto',
					'z-[10]',
				])}
				setIsOpen={() => setIsShowPageOrderDetail(false)}
			>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<div
							className='top-0 z-[10] flex gap-[26px] items-center bg-white px-3 py-4'
							tabIndex={0}
							role='button'
							style={{ position: 'sticky' }}
							onClick={() => {
								setIsShowPageOrderDetail(!isShowPageOrderDetail);
							}}
							onKeyPress={() => {
								setIsShowPageOrderDetail(!isShowPageOrderDetail);
							}}
						>
							<Icon name={IconEnum.ArrowLeft} color={'#333333'} size={14} />

							<div className='font-sfpro text-base font-semibold'>
								Thông tin giao hàng và thanh toán
							</div>
						</div>
						<div className='h-auto p-[6px] bg-[#f6f6f6]'>
							<div className='mt-6 border-b-8 border-[rgb(246,246,246)] bg-white pb-3'>
								<div className='px-4 pt-2'>
									<DynamicCartShippingMobile
										dataCart={dataCart}
										dataProfiles={dataProfiles}
										typeAction={typeAction}
										onMutable={onMutable}
										forDevice={deviceType}
										isShowDrawer={isShowPageChangeAddress}
										isShowDrawerFullAddress={isFullAddress}
										onShowDrawer={setIsShowPageChangeAddress}
										onShowDrawerFullAddress={setIsFullAddress}
										onShowDashPageDetail={setIsShowPageOrderDetail}
										renderBtnSubmit={
											<div
												className='bottom-0 z-[40] mt-4 block bg-white'
												style={{ position: 'sticky' }}
											>
												<RenderButtonWithAction
													condition={{
														activeActionCurrentSubmit: regexActionCurrentSubmit,
														cartItemNotExisted: regexCartItemNotExisted,
														hasChooseDelivery: regexHasChooseDelivery,
														hasPaymentTypeEnable: regexHasPaymentMethodEnable,
														hasExistedBuyLater: regexHasExistedItemBuyLater,
														hasProfile: regexHasProfile,
													}}
													isLoading={cartState?.isLoading}
													suffixCurrencyTotal={dataCart?.cartPayment?.paymentTotal || 0}
													className={'bottom-0'}
													isAction={typeAction}
													isPreviewOrderDetail={false}
													isValidForms={validCartForms}
												/>
											</div>
										}
										onAction={(action: Actions, profileId?: string) => {
											action === 'EDIT' &&
												methods.reset(
													{
														...dataProfiles?.find((t) => t.profileId === profileId),
														pickupStoreId: dataProfiles?.find((t) => t.profileId === profileId)
															?.pickupStore?.pickupStoreId,
														typeShipping: dataProfiles?.find((t) => t.profileId === profileId)
															?.hourOffice
															? 1
															: 2,
													},
													{ keepDefaultValues: false },
												);

											action === 'CREATE' && methods.reset({ typeShipping: 1 });

											setTypeAction((prev) => ({
												...prev,
												action: action,
												id: action === 'EDIT' ? profileId : '',
												isActiveOrder: action === 'SUBMIT' || action === 'DELETE',
												isActionActive: action !== 'DELETE' && !typeAction.isActionActive,
											}));
										}}
									/>
								</div>
							</div>
							<div className='border-b-8 border-[#F6F6F6] py-4 bg-white'>
								<div className='border-b border-[#EBEBEB] px-4 pb-4 font-sfpro_semiBold text-16 font-semibold text-[#333333]'>
									Tóm tắt đơn hàng
								</div>
								<div className='px-4'>
									{dataCart?.cartItems?.map((item, i: number) => {
										return (
											<div className='flex items-center gap-3 py-3' key={i}>
												<div className='relative h-[40px] w-full max-w-[40px] border-[#E0E0E0] border overflow-hidden rounded-full'>
													<ImageCustom
														src={item?.brand?.logo}
														layout={'fill'}
														alt={'merchant image'}
													/>
												</div>
												<div className='w-full flex-auto flex-col'>
													<div className='text-ellipsis font-sfpro_semiBold text-16 font-semibold leading-5 text-[#333333] line-clamp-1'>
														{item?.brand?.name}
													</div>
													<Dropdown
														onChange={(value, onFailed) => {
															item?.shippings?.find((ele) => ele?.isSelected)?.deliveryTypeCode !==
																value &&
																handleChangeShippingType(
																	String(value),
																	item,
																	dataCart?.cartId,
																	(loading) => dispatch(cartActions.isLoading(loading)),
																	onMutable,
																	{
																		onFailed: onFailed,
																		idOld: item?.shippings?.find((ele) => ele?.isSelected)
																			?.deliveryTypeCode!,
																	},
																);
														}}
														disabled={!Boolean(item?.shippings?.length > 0)}
														textDefaults={'Chọn hình thức vận chuyển'}
														className='font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#3E3E40]'
														defaultValue={
															Boolean(item?.shippings?.length > 0)
																? item?.shippings.find((t) => t.isSelected)?.deliveryTypeCode
																: 'DEFAULT'
														}
														options={item.shippings?.map((item) => {
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
												</div>
												<div className='w-full max-w-[36%] flex-[36%] text-right'>
													<div className='flex flex-col'>
														<div className='text-14 text-[#666666]'>
															{item?.merchantPaymentTotal?.toLocaleString('it-IT')}
															<sup>đ</sup>
														</div>
														<div
															className='font-sfpro_semiBold text-14 font-semibold text-[#126BFB] whitespace-nowrap'
															onClick={() => {
																setIsShowPageOrderDetail(false);
															}}
															onKeyPress={() => {
																setIsShowPageOrderDetail(false);
															}}
															tabIndex={0}
															role={'button'}
														>
															Xem chi tiết
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
							<div className='border-b-8 border-[#F6F6F6] py-4 bg-white'>
								<div className='px-4'>
									<CartMemo />
								</div>
							</div>
							<div className='border-b-8 border-[#F6F6F6]'>
								<DynamicCartInvoice
									className='!bg-white'
									typeAction={typeAction}
									profileActive={dataCart?.cartShipping}
								/>
							</div>
							<div className='border-b-4 border-[#F6F6F6] bg-white pt-1'>
								<div className='px-4'>
									<DynamicCartPayment
										dataCart={dataCart}
										onMutable={onMutable}
										paymentMethod={paymentMethod}
									/>
								</div>
							</div>
						</div>

						<div className='relative bottom-0 z-[20] mx-auto h-auto w-full space-y-[10px] rounded-md bg-white px-3 pt-4 pb-6'>
							<div className='flex items-center justify-between'>
								<span className='font-sfpro_bold text-[14px] font-semibold not-italic leading-normal text-black'>
									Tạm tính:
								</span>
								<div className='flex items-center space-x-[3px]'>
									<span className='text-[14px] font-normal not-italic leading-snug text-[#3E3E40]'>
										{dataCart?.cartItems
											?.reduce((prev: any, curr: any) => {
												return (prev = [...prev, ...curr.items?.filter((k: any) => !k.isDelete)]);
											}, [])
											?.reduce((prevNew: any, currNew: any) => {
												return prevNew + currNew.productPrice * currNew.productQuantity;
											}, 0)
											.toLocaleString('it-IT')}
									</span>
									<span className='text-[14px] font-normal not-italic leading-snug text-[#3E3E40]'>
										đ
									</span>
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<span className='font-sfpro_bold text-[14px] font-semibold not-italic leading-normal text-black	'>
									Vận chuyển:
								</span>
								<div className='flex items-center space-x-[3px]'>
									<span className='text-[14px] font-normal not-italic leading-snug text-[#3E3E40]'>
										{dataCart?.cartPayment?.shippingFeeTotal?.toLocaleString('it-IT') ?? 0}
									</span>
									<span className='text-[14px] font-normal not-italic leading-snug text-[#3E3E40]'>
										đ
									</span>
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<span className='font-sfpro_bold text-[14px] font-semibold not-italic leading-normal text-black'>
									Tổng tiền giảm:
								</span>
								<div className='flex items-center space-x-[3px]'>
									<span className='text-[14px] font-normal not-italic leading-snug text-[#3E3E40]'>
										0
									</span>
									<span className='text-[14px] font-normal not-italic leading-snug text-[#3E3E40]'>
										đ
									</span>
								</div>
							</div>

							<div className='block bg-white'>
								<RenderButtonWithAction
									condition={{
										activeActionCurrentSubmit: regexActionCurrentSubmit,
										cartItemNotExisted: regexCartItemNotExisted,
										hasChooseDelivery: regexHasChooseDelivery,
										hasPaymentTypeEnable: regexHasPaymentMethodEnable,
										hasExistedBuyLater: regexHasExistedItemBuyLater,
										hasProfile: regexHasProfile,
									}}
									isLoading={cartState?.isLoading}
									suffixCurrencyTotal={dataCart?.cartPayment?.paymentTotal || 0}
									className={'bottom-0'}
									isAction={typeAction}
									isPreviewOrderDetail={false}
									isValidForms={validCartForms}
								/>
							</div>
						</div>
					</form>
				</FormProvider>
			</Drawer>

			{isShowVerifyInfo && (
				<DynamicModalVerifyUserMobile
					verifyOTP={isShowVerifyOTP}
					setVerifyOTP={setIsShowVerifyOTP}
					handleSubmitPhoneSuccess={handleSubmitPhoneSuccess}
					onMutable={onMutable}
					onActive={{
						isShowVerifyInfo: isShowVerifyInfo,
						isShowVerifyOTP: isShowVerifyOTP.isActive!,
					}}
					onAction={(action: Actions) => {
						if (action === 'CREATE') {
							methods.reset({
								typeShipping: 1,
								gender: isShowVerifyOTP.gender,
								mobileNumber: isShowVerifyOTP.phoneNumber,
								contactName: isShowVerifyOTP.contactName,
							});
							setIsShowVerifyInfo(false);
							setIsShowPageOrderDetail(true);
							setIsShowPageChangeAddress(true);
						}

						setTypeAction((prev) => ({
							...prev,
							action: action,
							isActiveOrder: action === 'SUBMIT' || action === 'DELETE',
							isActionActive: action !== 'DELETE' && !typeAction.isActionActive,
						}));
					}}
					onClose={handleClosePopup}
				/>
			)}

			<Drawer
				isOpen={isShowIframe.isActive}
				direction='RIGHT'
				className={'hide-scrollbar overflow-auto'}
				height={'h-[100vh]'}
				setIsOpen={() => {}}
			>
				<div className='h-[100vh]'>
					<CustomIframe title={isShowIframe.title} src={isShowIframe.callbackUrl} />
				</div>
			</Drawer>

			<DynamicCartOutOfStockMobile
				onCofirm={() => {
					const arrIsOutOfStock = dataCart?.cartItems
						?.reduce((prev: CartVariantItems[], curr) => {
							return (prev = curr.items);
						}, [])
						?.filter((ele) => ele?.isOutOfStock);
					handleMultiItemsPushBuyLater(
						arrIsOutOfStock?.map(
							({ brandId, merchantId, warehouseId, productId, reservationId, variationId }) => {
								return { brandId, merchantId, productId, reservationId, variationId, warehouseId };
							},
						) ?? [],
						dataCart?.cartId!,
						dispatch,
						onMutable,
						(onStatus) => {
							setHasOutOfStock((prev) => ({
								...prev,
								isActiveDrawer: onStatus && false,
								isConfirm: onStatus,
							}));
							// setIsShowPageOrderDetail(onStatus);
						},
					);
				}}
				isOutofStock={hasOutOfStock.isActiveDrawer}
				onClose={() => {
					setHasOutOfStock((prev) => ({ ...prev, isActiveDrawer: false }));
				}}
				dataOutOfStock={hasOutOfStock?.dataOutOfStock}
				totalItems={
					dataCart?.cartItems?.reduce((prev: CartVariantItems[], curr) => {
						return (prev = [...prev, ...curr?.items]);
					}, [])?.length
				}
			/>
		</React.Fragment>
	);
};

export default React.memo(CartMobile);
