import { TYPE_PRODUCT_VARIANT } from 'enums';
import { getSelectorVariationDetail } from 'hooks';
import { Product, ProductVariation } from 'models';
import React, { useMemo } from 'react';

export const useMemoTypeProduct = (
	dataProduct: Product,
	dataSelecting: ProductVariation | undefined,
) => {
	// check product has promotion
	const regexProductHasPromotion = Boolean(
		dataProduct?.firstVariationPromotions?.promotions?.length,
	);

	// check product has variant size
	const regexProductHasSize = dataProduct?.variationConfigs?.configs?.some(
		(config) => config.type === TYPE_PRODUCT_VARIANT.size,
	);

	//check product has property configs
	const regexProductHasVariantConfigs = Boolean(dataProduct?.variationConfigs.configs.length !== 0);
	const regexProductHasMultiVariantConfigs = Boolean(
		dataProduct?.variationConfigs.configs.length > 1,
	);

	//get values with type product
	const memoryTypeValuesProducts = React.useMemo(() => {
		return getSelectorVariationDetail({
			arrayOriginal: dataProduct,
			arrayPromotion:
				dataSelecting?.promotions ?? dataProduct?.firstVariationPromotions?.promotions,
		});
	}, [dataSelecting, dataProduct]);

	//select default values variant
	//  ---- only default color variant
	// has no exited dataSelecting;
	const conditionReturnDataFirst =
		(regexProductHasVariantConfigs && !regexProductHasSize) ||
		Boolean(
			!dataSelecting?.variationId &&
				memoryTypeValuesProducts?.data?.moduleType !== 0 &&
				!regexProductHasSize,
		) ||
		(regexProductHasPromotion && !regexProductHasSize);

	//check type of product

	// FLASH_SALE = 1,
	// DISCOUNT = 2,
	// FREESHIP = 3,
	// GIFT = 4,
	// EXTRA_DISCOUNT = 5, // mua kèm giảm thêm
	// INVOICE = 6,
	const memoryReturnTypeProduct = memoryTypeValuesProducts?.data?.moduleType ?? 0;

	const checkValuesForProperty: () => ProductVariation[] = () => {
		return regexProductHasVariantConfigs && !regexProductHasSize && conditionReturnDataFirst
			? dataProduct?.variations?.filter((ele, _) => {
					return (
						ele.variationId ===
						memoryTypeValuesProducts?.variations?.find(
							(t: any) => t?.isEnabled && t?.propertyValueId1,
						)?.variationId
					);
			  })
			: dataProduct?.variations?.filter((ele, _) => {
					return (
						ele.variationId ===
						(!regexProductHasSize
							? dataSelecting?.variationId ??
							  memoryTypeValuesProducts?.variations?.find((t: any) => t?.isEnabled)?.variationId
							: dataSelecting?.variationId)
					);
			  });
	};

	const valueBinding: ProductVariation[] = conditionReturnDataFirst
		? regexProductHasPromotion
			? dataProduct?.variations?.filter((ele, _) => {
					return ele.variationId === dataProduct?.firstVariationPromotions?.variationId;
			  })
			: dataProduct?.variations
		: checkValuesForProperty();

	const isOutOfStockThisProduct = useMemo(
		() =>
			Boolean(
				valueBinding?.[0]?.totalQuantity - valueBinding?.[0]?.quantitySold === 0 ||
					!dataProduct?.variations?.length ||
					(dataProduct?.variations?.length === 1 &&
						dataProduct?.variations?.[0]?.totalQuantity -
							dataProduct?.variations?.[0]?.quantitySold ===
							0) ||
					dataProduct?.variations?.every((ele) => ele?.totalQuantity - ele?.quantitySold === 0),
			),
		[valueBinding, dataProduct?.variations],
	);

	return {
		memoryTypeValuesProducts,
		memoryReturnTypeProduct,
		regexProductHasPromotion,
		valueBinding,
		regexProductHasMultiVariantConfigs,
		conditionReturnDataFirst,
		isOutOfStockThisProduct,
	};
};
