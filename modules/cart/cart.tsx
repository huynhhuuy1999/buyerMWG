import classNames from 'classnames';
import { Notification } from 'components';
import { useAppCart, useAppDispatch, useAppSelector } from 'hooks';
import {
	Actions,
	CartVariantItems,
	ICartFormProps,
	ICartPageProps,
	TypeActionShippingAddress,
} from 'models';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { updateInvoiceCart, updateShippingCart } from 'services';
import {
	handleMultiItemsPushBuyLater,
	handleSubmitCreateOrder,
	handleSubmitForCreateAddress,
	handleSubmitForEditAddress,
} from 'utils';

import { addressSelector } from '@/store/reducers/address';
import { currentUserSelector } from '@/store/reducers/authSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

import { CartMemo } from './common';
import { ModalVerifyUser } from './components';
import AnimationLoadingBounce from './components/AnimationBounce';
import { RenderButtonWithAction } from './components/ButtonBuyNow';
import { getConditionCart, useFormCart } from './hooks';
import { ProductOutofStockProps, VerifyOTPProps } from './types';

const DynamicCartShipping = dynamic(() => import('./modules/cart-shipping/cart-shipping'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicCartInvoice = dynamic(() => import('./common/cart-invoice'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicCartPayment = dynamic(() => import('./common/cart-payment'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicListCartItems = dynamic(() => import('./modules/list-cart-items/list-cart-items'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicCartBuyLater = dynamic(() => import('./modules/cart-buy-later/cart-buy-later'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicCartVouchers = dynamic(() => import('./modules/cart-vouchers/cart-vouchers'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicCartOutOfStock = dynamic(
	() => import('./modules/cart-out-of-stock/cart-out-of-stock'),
	{
		loading: () => <>Loading...</>,
		ssr: false,
	},
);

const Cart: React.FC<ICartPageProps> = ({
	dataCart,
	dataCartBuyLater,
	paymentMethod,
	dataProfiles,
	onMutable,
	hasIsOutOfStock,
	isLoading,
}) => {
	const addressState = useAppSelector(addressSelector);
	const { cartState } = useAppCart();
	const dispatch = useAppDispatch();
	const [typeAction, setTypeAction] = useState<TypeActionShippingAddress>({
		action: 'RESELECT',
		isActionActive: false,
		isActiveOrder: false,
		id: null,
	});
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
		verifyId: 0,
		type: '',
	});
	const authSelector = useAppSelector(currentUserSelector);
	const PHONE_NUMBER_HAS_CONFIRMED = Boolean(authSelector?.phoneNumberConfirmed);

	//--scope rule active order
	const {
		regexActionCurrentSubmit,
		regexCartItemNotExisted,
		regexEmptyCartWithItemBuyLater,
		regexHasChooseDelivery,
		regexHasProfile,
		regexHasPaymentMethodEnable,
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
		regexHasProfile,
		regexActionCurrentSubmit,
		regexHasChooseDelivery,
		regexEmptyCartWithItemBuyLater,
		hasIsOutOfStock,
	]);

	useEffect(() => {
		mountedTypeAction();
	}, [mountedTypeAction]);

	useEffect(() => {
		paymentMethod?.length && methods.setValue('paymentMethods', paymentMethod);
	}, [paymentMethod]);

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
					paramsUpdateInvoice?.data && handleSubmitCreateOrder(dataCart?.cartId);
				} else {
					handleSubmitCreateOrder(dataCart?.cartId);
				}

				return;
			case 'forEdit':
				handleSubmitForEditAddress(
					formData,
					typeAction?.id ?? '',
					onMutable,
					setTypeAction,
					dataCart?.cartId,
					addressState.typePickupAddress,
				);
				methods.setValue('paymentMethods', paymentMethod);
				methods.setValue('typeShipping', 1);
				return;
			case 'forCreate':
				handleSubmitForCreateAddress(
					formData,
					onMutable,
					setTypeAction,
					dataCart?.cartId,
					addressState.typePickupAddress,
				);
				methods.setValue('paymentMethods', paymentMethod);
				methods.setValue('typeShipping', 1);
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
			phoneNumber: '',
			verifyId: 0,
			type: '',
		});
	};

	return (
		<FormProvider {...methods}>
			<div className='min-h-[88vh] overflow-hidden bg-[#f6f6f6]'>
				<div className='container mx-auto pb-8 pt-6'>
					<div className='relative flex space-x-4'>
						<div className='max-w-[65%] flex-[65%]'>
							<DynamicListCartItems
								dataCart={dataCart}
								onMutable={onMutable}
								dataCartBuyLater={dataCartBuyLater}
								isLoading={isLoading}
							/>

							<DynamicCartVouchers
								dataCart={dataCart}
								onMutable={onMutable}
								dataVouchers={dataCart?.vouchers}
							/>

							{dataCart?.cartItems?.length ? (
								<div
									className={classNames([
										'bottom-0 z-0 mx-auto relative h-auto w-full space-y-[10px] rounded-md bg-white border-[#E3E3E3] border px-3 py-4',
										cartState?.isLoading ? 'opacity-70' : '',
									])}
									// style={{ position: 'sticky' }}
								>
									{cartState?.isLoading ? (
										<div className='absolute inset-0 flex items-center justify-center bg-white/70'>
											<AnimationLoadingBounce color={'#000000'} />
										</div>
									) : null}

									<div className='flex items-center justify-between'>
										<span className='font-sfpro text-[14px] font-normal not-italic leading-snug text-[#4F4F4F]'>
											Tạm tính:
										</span>
										<div className='flex items-center space-x-[3px]'>
											<span className='font-sfpro_bold text-[14px] font-semibold not-italic leading-normal text-black'>
												{dataCart?.cartItems
													?.reduce((prev: any, curr: any) => {
														return (prev = [
															...prev,
															...curr.items?.filter((k: any) => !k.isDelete),
														]);
													}, [])
													?.reduce((prevNew: any, currNew: any) => {
														return prevNew + currNew.productPrice * currNew.productQuantity;
													}, 0)
													.toLocaleString('it-IT')}
											</span>
											<span className='font-sfpro_bold text-[12px] font-medium not-italic leading-normal text-black underline'>
												đ
											</span>
										</div>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-[14px] font-normal not-italic leading-snug text-[#4F4F4F]'>
											Vận chuyển:
										</span>
										<div className='flex items-center space-x-[3px] font-sfpro_bold'>
											<span className='text-[14px] font-semibold not-italic leading-normal text-black'>
												{dataCart?.cartPayment?.shippingFeeTotal?.toLocaleString('it-IT') ?? 0}
											</span>
											<span className='text-[12px] font-medium not-italic leading-normal text-black underline'>
												đ
											</span>
										</div>
									</div>
									<div className='flex items-center justify-between border-[#E3E3E3]'>
										<span className='text-[14px] font-normal not-italic leading-snug text-[#4F4F4F]'>
											Khuyến mãi:
										</span>
										<div className='flex items-center space-x-[3px] font-sfpro_bold'>
											<span className='text-[14px] font-semibold not-italic leading-normal text-black '>
												{dataCart?.cartPayment?.discountTotal?.toLocaleString('it-IT') ?? 0}
											</span>
											<span className='text-[12px] font-medium not-italic leading-normal text-black underline'>
												đ
											</span>
										</div>
									</div>
									<div className='flex items-center justify-between'>
										<span className='font-sfpro text-[14px] font-normal not-italic leading-snug text-[#4F4F4F]'>
											Tổng tiền:
										</span>
										<div className='flex items-center space-x-[3px] font-sfpro_bold'>
											<span className='text-[16px] font-semibold not-italic leading-normal text-black'>
												{(dataCart?.cartPayment?.paymentTotal ?? 0)?.toLocaleString('it-IT') || 0}
											</span>
											<span className='text-[12px] leading-normal text-black underline'>đ</span>
										</div>
									</div>
								</div>
							) : null}

							{Number(dataCartBuyLater?.products?.length) > 0 && (
								<DynamicCartBuyLater
									dataCart={dataCart}
									dataCartBuyLater={dataCartBuyLater}
									onMutable={onMutable}
									isLoading={{ cartBuyNow: isLoading?.cartBuyLater }}
								/>
							)}
						</div>

						<div className='max-w-[35%] flex-[35%] space-y-3'>
							<form onSubmit={methods.handleSubmit(onSubmit)}>
								<div className='top-[16px] pt-10' style={{ position: 'sticky' }}>
									<div
										tabIndex={0}
										role={'button'}
										onClick={() => {
											if (
												hasOutOfStock.isOutofStock &&
												!hasOutOfStock?.isConfirm &&
												(typeAction.action === 'SUBMIT' || typeAction.action === 'RESELECT')
											) {
												setHasOutOfStock((prev) => ({ ...prev, isActiveDrawer: true }));
											} else if (!PHONE_NUMBER_HAS_CONFIRMED && typeAction.isActiveOrder) {
												setIsShowVerifyInfo(true);
											}
										}}
										onKeyPress={() => {
											if (
												hasOutOfStock.isOutofStock &&
												!hasOutOfStock?.isConfirm &&
												(typeAction.action === 'SUBMIT' || typeAction.action === 'RESELECT')
											) {
												setHasOutOfStock((prev) => ({ ...prev, isActiveDrawer: true }));
											} else if (!PHONE_NUMBER_HAS_CONFIRMED && typeAction.isActiveOrder) {
												setIsShowVerifyInfo(true);
											}
										}}
									>
										<div
											className={classNames([
												(hasOutOfStock.isOutofStock &&
													!hasOutOfStock?.isConfirm &&
													(typeAction.action === 'SUBMIT' || typeAction.action === 'RESELECT')) ||
												!PHONE_NUMBER_HAS_CONFIRMED
													? 'pointer-events-none'
													: 'pointer-events-auto',
											])}
										>
											<RenderButtonWithAction
												isLoading={cartState?.isLoading}
												condition={{
													activeActionCurrentSubmit: regexActionCurrentSubmit,
													cartItemNotExisted: regexCartItemNotExisted,
													hasChooseDelivery: regexHasChooseDelivery,
													hasPaymentTypeEnable: regexHasPaymentMethodEnable,
													hasExistedBuyLater: regexHasExistedItemBuyLater,
													hasProfile: regexHasProfile,
												}}
												isAction={typeAction}
												isValidForms={validCartForms}
											/>
										</div>
									</div>
									<div className='bg-white border-[#E3E3E3] rounded-md border mb-4 p-3'>
										<DynamicCartShipping
											dataCart={dataCart}
											dataProfiles={dataProfiles}
											typeAction={typeAction}
											onMutable={onMutable}
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
										{typeAction.action === 'CREATE' || typeAction.action === 'EDIT' ? null : (
											<DynamicCartInvoice
												typeAction={typeAction}
												profileActive={dataCart?.cartShipping}
											/>
										)}

										{typeAction.action === 'CREATE' || typeAction.action === 'EDIT' ? null : (
											<DynamicCartPayment
												dataCart={dataCart}
												onMutable={onMutable}
												paymentMethod={paymentMethod}
											/>
										)}

										{typeAction.action === 'CREATE' || typeAction.action === 'EDIT' ? null : (
											<CartMemo />
										)}
									</div>
									<div
										tabIndex={0}
										role={'button'}
										onClick={() => {
											if (
												hasOutOfStock.isOutofStock &&
												!hasOutOfStock?.isConfirm &&
												(typeAction.action === 'SUBMIT' || typeAction.action === 'RESELECT')
											) {
												setHasOutOfStock((prev) => ({ ...prev, isActiveDrawer: true }));
											} else if (!PHONE_NUMBER_HAS_CONFIRMED && typeAction.isActiveOrder) {
												setIsShowVerifyInfo(true);
											}
										}}
										onKeyPress={() => {
											if (
												hasOutOfStock.isOutofStock &&
												!hasOutOfStock?.isConfirm &&
												(typeAction.action === 'SUBMIT' || typeAction.action === 'RESELECT')
											) {
												setHasOutOfStock((prev) => ({ ...prev, isActiveDrawer: true }));
											} else if (!PHONE_NUMBER_HAS_CONFIRMED && typeAction.isActiveOrder) {
												setIsShowVerifyInfo(true);
											}
										}}
									>
										<div
											className={classNames([
												(hasOutOfStock.isOutofStock &&
													!hasOutOfStock?.isConfirm &&
													(typeAction.action === 'SUBMIT' || typeAction.action === 'RESELECT')) ||
												!PHONE_NUMBER_HAS_CONFIRMED
													? 'pointer-events-none'
													: 'pointer-events-auto',
											])}
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
												isAction={typeAction}
												isValidForms={validCartForms}
											/>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{isShowVerifyInfo && (
				<ModalVerifyUser
					verifyOTP={isShowVerifyOTP}
					setVerifyOTP={setIsShowVerifyOTP}
					handleSubmitPhoneSuccess={handleSubmitPhoneSuccess}
					onMutable={onMutable}
					onAction={(action: Actions) => {
						if (action === 'CREATE') {
							methods.reset({
								typeShipping: 1,
								gender: isShowVerifyOTP.gender,
								mobileNumber: isShowVerifyOTP.phoneNumber,
								contactName: isShowVerifyOTP.contactName,
							});
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
			<DynamicCartOutOfStock
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
		</FormProvider>
	);
};

export default React.memo(Cart);
