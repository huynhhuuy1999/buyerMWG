import classNames from 'classnames';
import { Rating } from 'components';
import { MODE_RUNNER } from 'enums';
import { useComment } from 'hooks';
import { IProductDetailProps } from 'models';
import Link from 'next/link';
import { Fragment, memo, useEffect, useState } from 'react';

import ProductRatingHasBuy from '../product-rating-has-buy';

const ProductRatingMobile: React.FC<IProductDetailProps> = ({
	productDetails,
	ratingStar,
	mode,
}) => {
	const { checkCustomerHasBuyProduct } = useComment();

	const [isCheckProductHasBought, setIsCheckProductHasBought] = useState<boolean>(false);

	useEffect(() => {
		if (productDetails && productDetails.variations.length > 0) {
			const data = productDetails.variations.map((item: any) => {
				return { productId: productDetails.id, variationId: item.variationId };
			});

			checkCustomerHasBuyProduct(data).then((resp) => {
				if (resp.payload && resp.payload.length) {
					const newData = resp.payload.filter((item: any) => item.isBuy === true);
					newData.length && setIsCheckProductHasBought(true);
				}
			});
		}
	}, []);

	return (
		<Fragment>
			<div
				className={classNames([
					[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!) &&
						'pointer-events-none',
				])}
			>
				{isCheckProductHasBought && <ProductRatingHasBuy productDetails={productDetails} />}
			</div>

			<div
				className={classNames([
					'relative mb-4',
					[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!) &&
						'pointer-events-none',
				])}
			>
				<div className='flex items-center justify-between border-b border-b-[#EBEBEB]'>
					<div className='p-4 font-sfpro_semiBold text-16 font-semibold normal-case'>
						Tất cả đánh giá và hỏi đáp
					</div>
					<Link href='/'>
						<a className='mr-[14px] font-sfpro_semiBold text-[16px] text-[#126BFB]'>Xem tất cả</a>
					</Link>
				</div>

				<div className='px-2.5 pt-4 mb-4 border-b border-b-[#EBEBEB]'>
					<div className='pr-[6px]'>
						<div className='flex h-full items-center justify-start '>
							{productDetails.averageRating > 0 && (
								<span className='mr-[12px] font-sfpro_bold text-[24px] font-extrabold text-[#333333]'>
									{productDetails.averageRating}
								</span>
							)}

							<div className='flex items-center'>
								<Rating
									typeRating='multiple'
									className='mx-[3px] h-[18px] w-[18px]'
									value={productDetails.averageRating}
								/>
							</div>
						</div>

						<span className='ml-[3px] mb-[12px] mt-[13px] block text-[14px] text-[#999999]'>
							{ratingStar?.total || 0} Đánh giá
						</span>
					</div>
					{ratingStar?.total > 0 && (
						<div className='flex items-center border-b border-[#EBEBEB] pb-[17px]'>
							<div className='flex flex-auto flex-col '>
								{ratingStar
									? ratingStar?.detail
											.sort((a: any, b: any) => b.ratingStar - a.ratingStar)
											.map((rating: any, i: number) => (
												<div className='mb-[3px] flex items-center' key={i}>
													<Rating
														typeRating='multiple'
														className='mx-[1px] h-[10px] w-[10px]'
														value={rating.sumStar}
													/>
													<span className='relative ml-2 block h-[8px] flex-auto overflow-hidden rounded-full bg-[#F1F1F1] '>
														<span
															style={{
																width: `${(rating.sumStar / rating.total) * 100}%`,
															}}
															className={classNames(['absolute left-0 top-0 bg-666666 h-2'])}
														></span>
													</span>
													<span className='ml-[7px] text-[14px] text-[#999999]'>
														{rating.sumStar}
													</span>
												</div>
											))
									: ''}
							</div>
						</div>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default memo(ProductRatingMobile);
