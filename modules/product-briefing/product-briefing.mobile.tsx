import { IProductDetailProps } from 'models';
import { NextPage } from 'next';

import { ProductVariantsMobile } from '../product-variants';

const ProductBriefingMobile: NextPage<IProductDetailProps> = ({
	productDetails,
	ratingStar,
	options,
	mode,
	infoMerchant,
}: IProductDetailProps) => {
	return (
		productDetails && (
			<div className='font-sfpro text-14 text-333333'>
				<ProductVariantsMobile
					productDetails={productDetails}
					ratingStar={ratingStar}
					options={options}
					mode={mode}
					infoMerchant={infoMerchant}
				/>
			</div>
		)
	);
};
export default ProductBriefingMobile;
