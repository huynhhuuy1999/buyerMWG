import { TYPE_DISCOUNT } from 'enums';

import { CartPromotionItems, CartVariantItems } from '@/models/cart';

interface IUserSelectorVariationCart {
	arrayPromotion?: CartVariantItems['itemPromotions'];
	arrayOriginal: CartVariantItems;
}

type IOutputProps = Partial<{ data: CartPromotionItems; prioty: number } | any>;

export const getSelectorVariantCart = ({
	arrayOriginal,
	arrayPromotion,
}: IUserSelectorVariationCart): IOutputProps => {
	if (arrayPromotion?.length) {
		const checkTypeProduct = (arr: CartVariantItems['itemPromotions'], type: TYPE_DISCOUNT) => {
			return arr?.some((k) => {
				return k?.promotionType === type;
			});
		};
		const TYPE_PRODUCT = {
			flashSale: checkTypeProduct(arrayPromotion, TYPE_DISCOUNT.FLASH_SALE),
			discount: checkTypeProduct(arrayPromotion, TYPE_DISCOUNT.DISCOUNT),
			freeship: checkTypeProduct(arrayPromotion, TYPE_DISCOUNT.FREESHIP),
			gift: checkTypeProduct(arrayPromotion, TYPE_DISCOUNT.GIFT),
			extraDiscount: checkTypeProduct(arrayPromotion, TYPE_DISCOUNT.EXTRA_DISCOUNT),
			invoice: checkTypeProduct(arrayPromotion, TYPE_DISCOUNT.INVOICE),
		};

		const TYPE_PRIOTY_PRODUCT: number = Object.keys(TYPE_PRODUCT).findIndex(
			(t, _) => TYPE_PRODUCT[t],
		);
		const getData = arrayPromotion?.find(
			(promo) => promo.promotionType === TYPE_PRIOTY_PRODUCT + 1,
		);

		if (getData) {
			switch (TYPE_PRIOTY_PRODUCT + 1) {
				case TYPE_DISCOUNT.FLASH_SALE:
					return {
						data: getData,
						prioty: TYPE_PRIOTY_PRODUCT,
					};
				case TYPE_DISCOUNT.DISCOUNT:
					return {
						data: getData,
						prioty: TYPE_PRIOTY_PRODUCT,
					};
				case TYPE_DISCOUNT.FREESHIP:
					return {
						data: getData,
						prioty: TYPE_PRIOTY_PRODUCT,
					};
				case TYPE_DISCOUNT.EXTRA_DISCOUNT:
					return {
						data: getData,
						prioty: TYPE_PRIOTY_PRODUCT,
					};
				case TYPE_DISCOUNT.GIFT:
					return {
						data: getData,
						prioty: TYPE_PRIOTY_PRODUCT,
					};
				case TYPE_DISCOUNT.INVOICE:
					return {
						data: getData,
						prioty: TYPE_PRIOTY_PRODUCT,
					};
			}
		}
		return arrayOriginal;
	}
	return arrayOriginal;
};
