import { ProductVariation } from 'models';
import React from 'react';
import { getVariationsProductDetail } from 'services';

import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export const handleDataVariation = async (
	idProduct: number,
	idVariant: number,
	dataSelectVariants: ProductVariation | undefined,
	onSelectVariant: any,
	onLoading: (value: React.SetStateAction<boolean>) => void,
	onFailed?: () => void,
) => {
	if (
		(dataSelectVariants?.variationId &&
			dataSelectVariants?.variationId !== idVariant &&
			idVariant) ||
		idVariant
	) {
		onLoading(true);
		try {
			const res = await getVariationsProductDetail(idProduct, idVariant);
			onLoading(false);
			onSelectVariant(res.data);
		} catch (error) {
			onLoading(false);
			onFailed?.();
			getErrorMessageInstance(error);
		}
	}
	return false;
};
