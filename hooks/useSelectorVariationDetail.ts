import { TYPE_DISCOUNT } from 'enums';
import { Product, ProductItemPromotion } from 'models';

interface IUserSelectorVariationDetail {
	arrayPromotion?: Product['firstVariationPromotions']['promotions'];
	arrayOriginal: Product;
}

export const getSelectorVariationDetail = ({
	arrayOriginal,
	arrayPromotion,
}: IUserSelectorVariationDetail): Partial<any | { data: ProductItemPromotion; prioty: number }> => {
	if (arrayPromotion) {
		const checkTypeProduct = (
			arr: Product['firstVariationPromotions']['promotions'],
			type: TYPE_DISCOUNT,
		) => {
			return arr?.some((k) => {
				return k.moduleType === type;
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

		const getData = arrayPromotion?.find((promo) => promo.moduleType === TYPE_PRIOTY_PRODUCT + 1);

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
};
