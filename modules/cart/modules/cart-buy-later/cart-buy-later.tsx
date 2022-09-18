import { Skeleton } from 'components';
import { getSelectorVariantCart } from 'hooks';
import { ICartPageProps } from 'models';
import React from 'react';

import { CartProduct } from '../../common';

const skeletons: JSX.Element = (
	<>
		{[...new Array(2)].map((_, i: number) => (
			<div className='mb-4 rounded-md bg-white p-3 first:rounded-t-none last-of-type:mb-0' key={i}>
				<div className='flex'>
					<div className='aspect-square max-w-[110px] flex-[110px]'>
						<Skeleton.Skeleton
							cardType={Skeleton.CardType.square}
							type='card'
							width={'100%'}
							height={'110px'}
						/>
					</div>
					<div className='flex-auto pl-3'>
						<Skeleton.Skeleton lines={2} type='comment' />
					</div>
				</div>
				<div className='pt-4'>
					<Skeleton.Skeleton type='text' />
				</div>
				<div className='pt-2'>
					<Skeleton.Skeleton type='text' />
				</div>
			</div>
		))}
	</>
);

const CartBuyLater: React.FC<ICartPageProps> = ({ onMutable, dataCart, dataCartBuyLater }) => {
	return (
		<div className='my-2 rounded-md bg-white border-[#E3E3E3] border p-3'>
			<span className='font-sfpro_bold text-16 font-semibold leading-6'>
				Sản phẩm lưu lại mua sau ({dataCartBuyLater?.products.length})
			</span>
			<div className='mt-4'>
				<span>
					{Boolean(dataCartBuyLater?.products.length)
						? (dataCartBuyLater?.products ?? [])?.map((itemBuyLater, i) => {
								// eslint-disable-next-line react-hooks/rules-of-hooks
								const valuesCheckPromote = getSelectorVariantCart({
									arrayOriginal: itemBuyLater,
									arrayPromotion: itemBuyLater.itemPromotions,
								});

								return (
									<React.Fragment key={i}>
										<CartProduct
											mode={'CART_BUY_LATER'}
											onMutable={onMutable}
											extraData={itemBuyLater}
											id={dataCart?.cartId ?? ''}
											defaultVariantProduct={itemBuyLater.variationId}
											originPrice={
												valuesCheckPromote?.data?.pricePromote
													? valuesCheckPromote?.data?.price
													: ''
											}
											productPrice={
												valuesCheckPromote?.data?.pricePromote || itemBuyLater.productPrice
											}
										/>
									</React.Fragment>
								);
						  })
						: skeletons}
				</span>
			</div>
		</div>
	);
};

export default CartBuyLater;
