import { Drawer, ImageCustom } from 'components';
import { PROMOTION_STATUS_SHOW, TYPE_PROPERTY } from 'enums';
import { getSelectorVariantCart, useAppDispatch } from 'hooks';
import debounce from 'lodash/debounce';
import { CartVariantItems, MerchantModel, ProductMerchantModel, ProductPromotionsES } from 'models';
import { useRouter } from 'next/router';
import React, { useMemo, useRef } from 'react';
import { ScopedMutator } from 'swr/dist/types';
import { handleDeleteItemCart, handleUpdateQuantityProduct } from 'utils';

import { ItemUpdateQuantityProps, VariationConfigsAll } from '@/modules/cart/types';
import { handleAddItemCart } from '@/modules/product-variants/utils';

import { CardVariantProduct } from '../Card/CardVariantProduct';

interface DrawerVariantProps {
	isOpen: boolean;
	onOpen: React.Dispatch<React.SetStateAction<boolean>>;
	dataSource: Partial<VariationConfigsAll> & {
		itemOrigin: CartVariantItems;
		promotions?: ProductPromotionsES[];
		itemMerchant: MerchantModel | ProductMerchantModel;
	};
	onMutable: ScopedMutator<any>;
	onLoadingUpdateQuantity: (value: React.SetStateAction<boolean>) => void;
	cartId: string;
	productIdsHasExisted: number[];
}

const DrawerVariant: React.FC<DrawerVariantProps> = ({
	isOpen,
	onOpen,
	dataSource,
	cartId,
	onMutable,
	onLoadingUpdateQuantity,
	productIdsHasExisted,
}) => {
	const getListColor = useMemo(() => {
		if (dataSource?.variationConfigs?.configs && dataSource?.variationConfigs?.configs.length) {
			const getPropertyColor = dataSource?.variationConfigs?.configs.filter(
				(item) => item.type === TYPE_PROPERTY.COLOR,
			);
			if (getPropertyColor.length) {
				return getPropertyColor[0]?.propertyValues?.length;
			}
			return 0;
		}
		return 0;
	}, [dataSource?.variationConfigs]);

	const valuesCheckPromote = getSelectorVariantCart({
		arrayOriginal: dataSource?.itemOrigin,
		arrayPromotion: dataSource?.itemOrigin?.itemPromotions,
	});

	const dispatch = useAppDispatch();
	const router = useRouter();

	const deBounceUpdateOnClickQuantity = useRef(
		debounce((item: ItemUpdateQuantityProps) => {
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
						cartId,
						dispatch,
					),
				(loading) => onLoadingUpdateQuantity(loading),
			);
		}, 200),
	).current;

	return (
		<Drawer isOpen={isOpen} setIsOpen={(value) => onOpen(value)}>
			<div className='flex items-start justify-between bg-[#F1F1F1] p-[10px]'>
				<div className='flex flex-col'>
					<span className='font-sfpro_semiBold text-333333'>
						Xem {getListColor} màu của sản phẩm
					</span>
					<span className='text-666666'>{dataSource?.itemOrigin?.productName}</span>
				</div>
				<ImageCustom
					src={'/static/svg/Close.svg'}
					width={30}
					height={30}
					role='button'
					onClick={() => onOpen(false)}
				/>
			</div>
			<div className='max-h-[70vh] overflow-y-auto py-[20px] overflow-x-hidden'>
				{dataSource?.variations?.length
					? dataSource?.variations?.map((item, i) => {
							const hasTwoProperties =
								item?.hasOwnProperty('propertyValueName1') &&
								item?.hasOwnProperty('propertyValueName2');

							const itemHasPromotion = dataSource?.promotions?.find(
								(ele) => ele?.variationId === item?.variationId,
							);
							const itemVariantConvert =
								dataSource?.itemOrigin?.variationId === item?.variationId
									? dataSource?.itemOrigin
									: null;

							return (
								<CardVariantProduct
									image={item.variationImage}
									key={i}
									percentDiscount={
										itemHasPromotion?.status === PROMOTION_STATUS_SHOW.RUNNING
											? Math.round(
													(valuesCheckPromote?.data?.pricePromote /
														valuesCheckPromote?.data?.price) *
														100,
											  )
											: 0
									}
									isInCart={productIdsHasExisted?.includes(item?.variationId)}
									price={
										itemHasPromotion?.status === PROMOTION_STATUS_SHOW.RUNNING
											? valuesCheckPromote?.data?.price
											: ''
									}
									priceDiscount={
										itemHasPromotion?.status === PROMOTION_STATUS_SHOW.RUNNING
											? valuesCheckPromote?.data?.pricePromote
											: item?.price
									}
									text={
										hasTwoProperties
											? `${item?.propertyValueName1} - ${item?.propertyValueName2}`
											: item?.propertyValueName1
									}
									className='mb-[19px] border-b-[2px] border-b-[#F6F6F6] pb-1'
									handleUpdateQuantityCart={(quantity) => {
										deBounceUpdateOnClickQuantity({
											merchantId: dataSource?.itemMerchant?.merchantId,
											productId: dataSource?.itemOrigin?.productId,
											variationId: item.variationId,
											quantity: quantity,
											brandId: dataSource?.itemOrigin?.brandId,
											cartId: cartId,
											reservationId: dataSource?.itemOrigin?.reservationId,
										});
									}}
									handleAddCard={() => {
										handleAddItemCart(router, dispatch, {
											cartId,
											isBuyNow: true,
											itemPromotionIds: item.promotions,
											merchantId: dataSource?.itemMerchant?.merchantId,
											productId: dataSource?.id!,
											brandId: dataSource.itemOrigin?.brandId!,
											variationId: item.variationId,
										});
									}}
									defaultQuantity={itemVariantConvert?.productQuantity}
									quantityOrigin={item?.quantities?.[0]?.quantity}
								/>
							);
					  })
					: null}
			</div>
		</Drawer>
	);
};
export default DrawerVariant;
