import { ProductPromotions, ProductVariation } from 'models';
import React, { useState } from 'react';
import { formatTime } from 'utils/convertTime';

import timeConfig from '@/configs/timeConfig';

interface IDataPromotions {
	dataSelectVariantPromotions?: ProductVariation | ProductPromotions;
}

const ProductPromotionsMobile: React.FC<IDataPromotions> = ({ dataSelectVariantPromotions }) => {
	const [isFullText, setIsFullText] = useState<boolean>(false);

	return (
		<React.Fragment>
			{dataSelectVariantPromotions?.promotions &&
				dataSelectVariantPromotions.promotions?.length !== 0 && (
					<div className='my-4'>
						<div className='font-sfpro_bold text-16 font-semibold leading-6'>
							Khuyến Mãi (Đến{' '}
							{formatTime(
								dataSelectVariantPromotions.promotions[0].endDate,
								timeConfig.custom?.dayMonth,
							)}
							)
						</div>

						{dataSelectVariantPromotions.promotions
							.sort((a, b) => a.moduleType - b.moduleType)
							.map((promo, i: number) =>
								isFullText ? (
									<div key={i} className='mb-2 last-of-type:mb-0'>
										Nhập mã <span className='font-sfpro_semiBold uppercase'>{promo.title}</span>{' '}
										giảm đến {promo.discountValue}% tối đa{' '}
										{promo.pricePromote?.toLocaleString('it-IT')}đ khi thanh toán quét QRcode qua
										App của ngân hàng{' '}
										<span className='inline-block text-primary-009ADA'>(Bấm xem chi tiết)</span>
									</div>
								) : i + 1 === dataSelectVariantPromotions.promotions?.length ? (
									<div key={i} className='mb-2 last-of-type:mb-0'>
										Nhập mã <span className='font-sfpro_semiBold uppercase'>{promo.title}</span>{' '}
										giảm đến {promo.discountValue}% tối đa{' '}
										{promo.pricePromote?.toLocaleString('it-IT')}đ khi thanh toán quét QRcode qua
										App của ngân hàng{' '}
										<span className='inline-block text-primary-009ADA'>(Bấm xem chi tiết)</span>
									</div>
								) : (
									''
								),
							)}

						{dataSelectVariantPromotions.promotions?.length !== 0 &&
						dataSelectVariantPromotions.promotions?.length >= 2 ? (
							<div
								className='inline cursor-pointer py-2 text-1A94FF outline-none'
								onClick={() => setIsFullText(!isFullText)}
								onKeyPress={() => setIsFullText(!isFullText)}
								tabIndex={0}
								role='button'
							>
								{isFullText
									? 'Thu gọn'
									: `Xem thêm ${
											dataSelectVariantPromotions.promotions?.length - 1
									  } khuyến mãi \u003E`}
							</div>
						) : (
							''
						)}
					</div>
				)}
		</React.Fragment>
	);
};

export default ProductPromotionsMobile;
