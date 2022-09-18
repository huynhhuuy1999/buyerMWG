import { TYPE_PRODUCT_VARIANT } from 'enums';
import { Product, ProductVariation } from 'models';

export const getConditionPoductDetail = (
	productDetails: Product,
	dataSelecting: ProductVariation | undefined,
	productDetailHasConvertType: any,
) => {
	// check product has promotion
	const regexProductHasPromotion =
		productDetails?.hasPromotionRunning && productDetails?.hasDiscountRunning;

	// check product has variant size
	const regexProductHasSize = productDetails?.variationConfigs?.configs?.some(
		(config) => config.type === TYPE_PRODUCT_VARIANT.size,
	);

	//select default values variant
	//  ---- only default color variant
	// has no exited dataSelecting;
	const conditionReturnDataFirst =
		regexProductHasSize &&
		Boolean(!dataSelecting?.variationId && productDetailHasConvertType?.data?.moduleType !== 0);

	return { regexProductHasPromotion, regexProductHasSize, conditionReturnDataFirst };
};
