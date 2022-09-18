import { Breadcrumb } from 'components';
import { IProductDetailProps } from 'models';
import dynamic from 'next/dynamic';
import React from 'react';

import Skeleton, { CardType } from '@/components/skeleton';

import ProductBriefing from '../product-briefing/product-briefing';
import { ProductMedia } from '../product-media';

const Skeletons = (
	<div className='flex items-center justify-between'>
		{[...new Array(4)].map((_, index) => {
			return (
				<div className='max-w-[25%] flex-[25%] px-2' key={index}>
					<Skeleton cardType={CardType.square} type='card' width={'100%'} height={400} />
				</div>
			);
		})}
	</div>
);

const DynamicProductSimilar = dynamic(() => import('../product-similar/product-similar'), {
	loading: () => Skeletons,
	ssr: false,
});
const DynamicProductAlsoView = dynamic(() => import('../product-alsoview/product-alsoview'), {
	loading: () => Skeletons,
	ssr: false,
});

const ProductDetailDesktop = React.forwardRef(
	({ productDetails, ratingStar, options, mode, infoMerchant }: IProductDetailProps, ref: any) => {
		return (
			<div className='container mx-auto pt-4'>
				<Breadcrumb />
				<div className='flex justify-between'>
					<div className='relative z-[2] max-w-[55%] flex-[55%]'>
						<ProductMedia productDetails={productDetails} mode={mode} infoMerchant={infoMerchant} />
					</div>
					<div className='max-w-[45%] flex-[45%]' ref={ref}>
						<ProductBriefing
							productDetails={productDetails}
							ratingStar={ratingStar}
							mode={mode}
							infoMerchant={infoMerchant}
						/>
					</div>
				</div>

				{/*  */}
				{options?.isActive && options?.params?.typeSimilar?.length ? (
					<div className='my-9'>
						<div className='h-full max-h-[400px] pb-6 font-sfpro_bold text-20 uppercase leading-8 text-black'>
							Sản phẩm tương tự
						</div>

						<div className='h-full w-full'>
							<DynamicProductSimilar options={options.params.typeSimilar} />
						</div>
					</div>
				) : (
					Skeletons
				)}

				<div className='mb-1 mt-5 h-[5px] w-full bg-[#F2F2F2]'></div>

				{options?.isActive && options?.params?.typeAlsoView?.length ? (
					<div className='mt-9'>
						<div className='pb-6 font-sfpro_bold text-20 uppercase leading-8 text-black'>
							Người mua thường xem cùng
						</div>
						<div className='h-full w-full'>
							<DynamicProductAlsoView options={options.params.typeAlsoView} />
						</div>
					</div>
				) : (
					Skeletons
				)}
			</div>
		);
	},
);

export default React.memo(ProductDetailDesktop);
