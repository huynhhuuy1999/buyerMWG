import { TYPE_DISCOUNT } from 'enums';
import { ProductPromotionsES, ProductViewES } from 'models';

interface useSelectorVariants {
	// product: ProductViewES | IProductSearch;
	product?: ProductViewES;
	isSingleVariant?: boolean;
}

const getSelectorVariants = ({
	product,
}: useSelectorVariants): Partial<undefined | ProductPromotionsES> => {
	if (product?.promotions) {
		const checkTypeProduct = (arr: ProductPromotionsES[], type: TYPE_DISCOUNT) => {
			return arr?.some((k) => {
				return k.moduleType === type;
			});
		};
		const TYPE_PRODUCT = {
			flashSale: checkTypeProduct(product?.promotions, TYPE_DISCOUNT.FLASH_SALE),
			discount: checkTypeProduct(product?.promotions, TYPE_DISCOUNT.DISCOUNT),
			freeship: checkTypeProduct(product?.promotions, TYPE_DISCOUNT.FREESHIP),
			gift: checkTypeProduct(product?.promotions, TYPE_DISCOUNT.GIFT),
			extraDiscount: checkTypeProduct(product?.promotions, TYPE_DISCOUNT.EXTRA_DISCOUNT),
			invoice: checkTypeProduct(product?.promotions, TYPE_DISCOUNT.INVOICE),
		};

		const TYPE_PRIOTY_PRODUCT: number = Object.keys(TYPE_PRODUCT).findIndex(
			(t, _) => TYPE_PRODUCT[t],
		);
		const getData = product?.promotions?.find(
			(promo) => promo.moduleType === TYPE_PRIOTY_PRODUCT + 1,
		);
		if (getData) {
			switch (TYPE_PRIOTY_PRODUCT + 1) {
				case TYPE_DISCOUNT.FLASH_SALE:
				case TYPE_DISCOUNT.DISCOUNT:
				case TYPE_DISCOUNT.FREESHIP:
				case TYPE_DISCOUNT.EXTRA_DISCOUNT:
				case TYPE_DISCOUNT.GIFT:
				case TYPE_DISCOUNT.INVOICE:
					return getData;
			}
		}

		return product;
	}

	return product;
};

export default getSelectorVariants;
