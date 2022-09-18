import { MODE_RUNNER } from 'enums';
import { IProductDetailProps } from 'models';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import ProductSpecs from '../product-specs/product-specs';
import ProductVariants from '../product-variants/product-variants';
import ShippingAdress from '../shipping-address/shipping-adress';

const DynamicRatingProduct = dynamic(() => import('../product-rating/product-rating'), {
	loading: () => <div>Loading...</div>,
});
const DynamicCommentBox = dynamic(() => import('../comment-box/comment-box'), {
	loading: () => <div>Loading...</div>,
});
const DynamicSellerInformation = dynamic(() => import('../seller-information/seller-information'), {
	loading: () => <div>Loading...</div>,
});

const ProductBriefing: NextPage<IProductDetailProps> = ({
	productDetails,
	ratingStar,
	infoMerchant,
	mode,
}: IProductDetailProps) => {
	return (
		productDetails && (
			<div className='flex items-center pl-8 font-sfpro text-333333'>
				<div className='flex-column max-w-10/10 justify-center'>
					<ProductVariants productDetails={productDetails} mode={mode} />
					{mode === MODE_RUNNER.PREVIEWING ? null : (
						<>
							<ShippingAdress productDetails={productDetails} mode={mode} />
							<ProductSpecs productDetails={productDetails} />
						</>
					)}

					<DynamicRatingProduct
						productDetails={productDetails}
						ratingStar={ratingStar}
						mode={mode}
					/>
					<DynamicCommentBox productDetails={productDetails} mode={mode} />
					<span className='my-4 block h-2 w-full bg-[#DADDE1]'></span>
					<DynamicSellerInformation
						productDetails={productDetails}
						ratingStar={ratingStar}
						mode={mode}
						infoMerchant={infoMerchant}
					/>
				</div>
			</div>
		)
	);
};

export default ProductBriefing;
