import classNames from 'classnames';
import { DrawerVariant, ImageCustom, Notification } from 'components';
import { DeviceType } from 'enums';
import { useAppDispatch, useAppSelector, useAppSWR } from 'hooks';
import debounce from 'lodash/debounce';
import {
	CartVariantItems,
	MerchantModel,
	ProductMerchantModel,
	TypeModesCartProduct,
} from 'models';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { updateVariantCart } from 'services';
import {
	handleBuyLater,
	handleDeleteBuyLaterItemCart,
	handleDeleteItemCart,
	handlePushBuyLater,
	handleUpdateQuantityProduct,
} from 'utils';

import { cartActions, cartSelector } from '@/store/reducers/cartSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

import { Dropdown, InputNumber } from '../components';
import { OptionsProps } from '../components/Dropdown';
import { ItemUpdateQuantityProps, VariationConfigsAll } from '../types';
interface CartProductProps {
	mode?: TypeModesCartProduct;
	defaultVariantProduct?: number;
	originPrice?: number;
	productPrice: number;
	extraData: CartVariantItems;
	forMerchant?: MerchantModel | ProductMerchantModel;
	id: string;
	onMutable?: any;
	forDevice?: DeviceType;
	limitStockPromotions: number;
	productHasExisted?: number[];
}

const CartProduct: React.FC<CartProductProps> = ({
	id,
	mode,
	defaultVariantProduct,
	originPrice,
	productPrice,
	forMerchant,
	productHasExisted,
	extraData,
	limitStockPromotions,
	onMutable,
	forDevice,
}) => {
	const dispatch = useAppDispatch();
	const cartState = useAppSelector(cartSelector);
	const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false);
	const [isLoadingUpdateQuantity, setIsLoadingUpdateQuantity] = useState<boolean>(false);
	const {
		productId,
		variationId,
		isOutOfStock,
		propertyValueName2,
		brandId,
		propertyValueName1,
		productQuantity,
		warehouseId,
		variationImage,
		productName,

		merchantId,
		reservationId,
	} = extraData;

	const { data: dataVariantConfigs } = useAppSWR<VariationConfigsAll>(
		{
			url: `/product/${extraData?.productId}/variations`,
			method: 'GET',
		},
		{ isPaused: () => !id || mode === 'CART_BUY_LATER' },
	);

	const deBounceUpdateOnClickQuantity = useRef(
		debounce(
			(item: ItemUpdateQuantityProps, onFailed?: React.Dispatch<React.SetStateAction<any>>) => {
				handleUpdateQuantityProduct(
					item,
					onMutable,
					dispatch,
					() =>
						handleDeleteItemCart(
							{
								merchantId: item.merchantId,
								reservationId: item.reservationId!,
								variationId: item.variationId,
							},
							onMutable,
							id,
							dispatch,
						),
					(loading) => {
						setIsLoadingUpdateQuantity(loading);
						dispatch(cartActions.isLoading(loading));
					},
					() => onFailed?.(productQuantity),
				);
			},
			200,
		),
	).current;

	const handleChangeVariant = async (
		variantId: number,
		onFailed?: React.Dispatch<React.SetStateAction<OptionsProps>>,
	) => {
		Notification.Loading.custom();
		try {
			await updateVariantCart(id, {
				newVariationId: variantId,
				quantity: productQuantity,
				productId,
				merchantId,
				oldVariationId: variationId,
				oldReservationId: reservationId,
			});

			await onMutable({
				method: 'GET',
				url: `/cart/${id}`,
			});

			dispatch(
				cartActions.pushItems({
					quantity:
						cartState?.variationsActice?.find((ele) => ele?.variantId === variantId)?.quantity! +
						productQuantity,
					variantId: variantId,
				}),
			); // update variant new
			dispatch(cartActions.decrement()); // remove one items in cart
			dispatch(cartActions.pushItems({ quantity: 0, variantId: variationId })); //remove variant old

			Notification.Loading.remove(300);
		} catch (error) {
			const getVariantDefault = dataVariantConfigs?.variations?.find(
				(ele) => ele.variationId === defaultVariantProduct,
			);
			const hasTwoProperties =
				getVariantDefault?.hasOwnProperty('propertyValueName1') &&
				getVariantDefault?.hasOwnProperty('propertyValueName2');

			onFailed?.({
				label: hasTwoProperties
					? `${getVariantDefault?.propertyValueName1} - ${getVariantDefault?.propertyValueName2}`
					: getVariantDefault?.propertyValueName1,
				value: getVariantDefault?.variationId,
			});
			getErrorMessageInstance(error);
		}
	};

	return (
		<div className='border-b last-of-type:border-transparent border-solid border-[#F2F2F2] py-2'>
			<div className='flex flex-nowrap'>
				<div className='relative aspect-square w-[76px] lg:w-[110px] rounded-md'>
					<ImageCustom
						src={variationImage}
						alt='vuivui'
						className='aspect-square w-[76px] lg:w-[110px] object-cover'
					/>
				</div>
				<div className='h-fit w-full'>
					<div className='flex flex-col space-y-2 px-[16px]'>
						<Link href={`/${extraData.categoryUrlSlug}/${extraData.urlSlug}`}>
							<a className='inline-block h-full w-fit lg:hover:underline'>
								<div className='line-clamp-2 text-ellipsis font-sfpro text-[14px] normal-case font-normal not-italic leading-normal tracking-[0.04px] text-[#727272]'>
									{productName}
								</div>
							</a>
						</Link>

						{mode === 'CART_BUY_NOW' && (
							<>
								{forDevice !== DeviceType.MOBILE ? (
									<Dropdown
										onChange={(value, onFailed) =>
											dataVariantConfigs?.variations?.find(
												(ele) => ele.variationId === defaultVariantProduct,
											)?.variationId !== value && handleChangeVariant(Number(value), onFailed)
										}
										defaultValue={
											dataVariantConfigs?.variations?.find(
												(ele) => ele.variationId === defaultVariantProduct,
											)?.variationId
										}
										className='font-sfpro text-[14px] font-medium not-italic leading-normal tracking-[0.04px] text-[#333333]'
										underline={true}
										textDefaults={'Variants'}
										options={dataVariantConfigs?.variations?.map((variant) => {
											const hasTwoProperties =
												variant?.hasOwnProperty('propertyValueName1') &&
												variant?.hasOwnProperty('propertyValueName2');
											return {
												label: hasTwoProperties
													? `${variant?.propertyValueName1} . ${variant?.propertyValueName2}`
													: variant?.propertyValueName1,
												value: variant.variationId,
											};
										})}
										icon={
											<img
												className='h-auto w-3'
												src='/static/svg/chevron-down-3e3e40.svg'
												alt='vuivui chevron'
											/>
										}
									/>
								) : (
									<>
										{propertyValueName1 || propertyValueName2 ? (
											<div
												onClick={() => setIsShowDrawer(true)}
												onKeyPress={() => setIsShowDrawer(true)}
												tabIndex={0}
												role={'button'}
											>
												<div className='flex items-center'>
													<span className='font-sfpro text-[14px] font-medium not-italic leading-normal tracking-[0.04px] text-[#333333]'>
														{propertyValueName2
															? `${propertyValueName1} . ${propertyValueName2}`
															: propertyValueName1}
													</span>
													<img
														className='h-auto w-3'
														src='/static/svg/chevron-down-3e3e40.svg'
														alt='vuivui chevron'
													/>
												</div>
											</div>
										) : null}
									</>
								)}
							</>
						)}

						{mode === 'CART_BUY_LATER' && (
							<div className='text-14 underline'>
								{propertyValueName2 && propertyValueName2
									? `${propertyValueName1} . ${propertyValueName2}`
									: propertyValueName1}
							</div>
						)}

						{mode === 'CART_BUY_NOW' && forDevice !== DeviceType.MOBILE && (
							<div className='flex space-x-3'>
								<div className='flex items-center gap-3'>
									<button
										className='whitespace-nowrap animation-300 font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#999999
									] hover:text-red-500'
										onClick={() =>
											handlePushBuyLater(
												productId,
												variationId,
												brandId,
												forMerchant?.merchantId ?? 0,
												warehouseId,
												id,
												dispatch,
												reservationId,
												onMutable,
											)
										}
									>
										Mua sau
									</button>
									{isOutOfStock ? (
										<div className='flex-auto text-center whitespace-nowrap font-sfpro_semiBold text-14 text-[#EA001B]'>
											Vừa hết hàng
										</div>
									) : (
										<InputNumber
											mode={mode}
											defaultValue={productQuantity}
											isLoading={isLoadingUpdateQuantity}
											onChange={(value, onFailed) => {
												deBounceUpdateOnClickQuantity(
													{
														merchantId: forMerchant?.merchantId!,
														productId: productId,
														variationId: variationId,
														quantity: value,
														brandId,
														cartId: id,
														reservationId: reservationId,
													},
													onFailed,
												);
											}}
										/>
									)}
								</div>
								<div className='w-full flex justify-end'>
									<div className='my-auto text-center'>
										{originPrice && (
											<div className='font-sfpro text-[16px] font-normal not-italic leading-normal tracking-[0.04px] text-[#999999] line-through'>
												{originPrice.toLocaleString('it-IT')}
											</div>
										)}
										<div
											className={classNames([
												'font-sfpro_semiBold text-[18px] font-semibold not-italic leading-normal text-[#333333]',
												originPrice ? 'text-[#EA001B]' : 'text-[#333333]',
											])}
										>
											{productPrice.toLocaleString('it-IT')}
											<sup className='text-[#999999]'>đ</sup>
										</div>
									</div>
								</div>
							</div>
						)}

						{mode === 'CART_BUY_LATER' && (
							<div className='flex space-x-3'>
								<button
									className='animation-300 flex items-center font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#999999
									] hover:text-pink-F05A94'
									onClick={() =>
										handleBuyLater(
											productId,
											variationId,
											brandId,
											dispatch,
											onMutable,
											cartState,
											id,
										)
									}
								>
									<div className='relative mr-1 h-[15px] w-[15px]'>
										<ImageCustom src='/static/svg/icon-buy-later.svg' layout='fill' />
									</div>
									<span>Mua</span>
								</button>
								<button
									className='animation-300 flex items-center font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#999999
									] hover:text-red-500'
									onClick={() =>
										handleDeleteBuyLaterItemCart(productId, variationId, onMutable, id, dispatch)
									}
								>
									<div className='relative mr-1 h-[15px] w-[15px]'>
										<ImageCustom src='/static/svg/icon-delete-cart.svg' layout='fill' />
									</div>
									<span>Xóa</span>
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{forDevice === DeviceType.MOBILE && (
				<div className='mt-[18px] mb-3 overflow-hidden'>
					<div className='flex space-x-3 items-center'>
						<div className='w-[76px] flex items-center justify-center'>
							<button
								className='whitespace-nowrap animation-300 font-sfpro text-[14px] not-italic leading-normal tracking-[0.04px] text-[#33333] font-medium hover:text-red-500'
								onClick={() =>
									handlePushBuyLater(
										productId,
										variationId,
										brandId,
										forMerchant?.merchantId ?? 0,
										warehouseId,
										id,
										dispatch,
										reservationId,
										onMutable,
									)
								}
							>
								Mua sau
							</button>
						</div>
						<div className='flex-auto justify-center'>
							{isOutOfStock ? (
								<div className='flex-auto text-center whitespace-nowrap font-sfpro_semiBold text-14 text-[#EA001B]'>
									Vừa hết hàng
								</div>
							) : (
								<InputNumber
									mode={mode}
									defaultValue={productQuantity}
									isLoading={isLoadingUpdateQuantity}
									onChange={(value, onFailed) => {
										deBounceUpdateOnClickQuantity(
											{
												merchantId: forMerchant?.merchantId!,
												productId: productId,
												variationId: variationId,
												quantity: value,
												brandId,
												cartId: id,
												reservationId: reservationId,
											},
											onFailed,
										);
									}}
								/>
							)}
						</div>
						<div className='flex-col flex justify-end' style={{ wordBreak: 'break-word' }}>
							{originPrice && (
								<div className='font-sfpro text-[16px] text-right font-normal not-italic leading-normal tracking-[0.04px] break-w text-[#999999] line-through'>
									{originPrice.toLocaleString('it-IT')}
									<sup className='text-[#999999]'>đ</sup>
								</div>
							)}
							<div
								className={classNames([
									'font-sfpro_semiBold text-[18px] text-right font-semibold not-italic leading-normal',
									originPrice ? 'text-[#EA001B]' : 'text-[#333333]',
								])}
							>
								{productPrice.toLocaleString('it-IT')}
								<sup className='text-[#999999]'>đ</sup>
							</div>
						</div>
					</div>
					<DrawerVariant
						cartId={id}
						dataSource={{
							...dataVariantConfigs,
							itemOrigin: extraData,
							itemMerchant: forMerchant!,
						}}
						onMutable={onMutable}
						productIdsHasExisted={productHasExisted!}
						onLoadingUpdateQuantity={setIsLoadingUpdateQuantity}
						isOpen={isShowDrawer}
						onOpen={(value) => setIsShowDrawer(value)}
					/>
				</div>
			)}
		</div>
	);
};

export default React.memo(CartProduct);
