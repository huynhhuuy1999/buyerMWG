import { Skeleton, Spin } from 'components';
import { IProductDetailProps } from 'models';
import React from 'react';

import { ProductAlsoViewMobile } from '../product-alsoview';
import { ProductBriefingMobile } from '../product-briefing/index';
import { ProductSimilarMobile } from '../product-similar';

const ProductDetailMobile = React.forwardRef(
	({ productDetails, ratingStar, options, infoMerchant, mode }: IProductDetailProps, ref: any) => {
		// const dispatch = useAppDispatch();
		const Skeletons = (
			<div className='flex flex-wrap items-center justify-between'>
				{[...new Array(2)].map((_, index) => {
					return (
						<div className='max-w-[50%] flex-[50%] px-1' key={index}>
							<Skeleton.Skeleton
								cardType={Skeleton.CardType.square}
								type='card'
								width={'100%'}
								height={300}
							/>
						</div>
					);
				})}
			</div>
		);

		return (
			<div className='w-full pb-4'>
				<ProductBriefingMobile
					productDetails={productDetails}
					ratingStar={ratingStar}
					options={options}
					mode={mode}
					infoMerchant={infoMerchant}
				/>

				<div className='mb-1 h-2.5 w-full bg-[#F2F2F2]'></div>
				<ProductSimilarMobile
					options={options?.params?.typeSimilar}
					viewMore={productDetails?.categoryName}
				/>
				<div className='mb-1 h-2.5 w-full bg-[#F2F2F2]'></div>
				{options?.params?.typeAlsoView?.length ? (
					<div className='mt-4'>
						<div className='px-2 pb-4 font-sfpro_semiBold text-16 font-semibold normal-case'>
							Người mua thường xem cùng
						</div>

						{options.params.typeAlsoView ? (
							<ProductAlsoViewMobile options={options.params.typeAlsoView} ref={ref} />
						) : (
							Skeletons
						)}
					</div>
				) : null}

				{Number(options?.totalRemainAlsoView) > 0 ? (
					<>
						{options?.isValidating ? (
							<div className='flex justify-center'>
								<Spin size={40} />
							</div>
						) : null}
					</>
				) : (
					<div className='px-4 pt-4 text-center'>Không còn sản phẩm</div>
				)}
			</div>
		);
	},
);

export default React.memo(ProductDetailMobile);
