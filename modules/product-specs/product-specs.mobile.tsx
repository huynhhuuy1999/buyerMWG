import classNames from 'classnames';
import { ImageCustom } from 'components';
import { IProductDetailProps, ProductProperties } from 'models';
import React, { useRef, useState } from 'react';

const ProductSpecsMobile: React.FC<IProductDetailProps> = ({ productDetails }) => {
	const [isFullText, SetIsFullText] = useState<boolean>(false);
	const [isToggle, setIsToggle] = useState<boolean>(true);
	const refDescription = useRef<any>(0);
	const refParents = useRef<any>();

	const handleFullText = (): void => {
		refDescription?.current &&
			window.scrollTo({
				behavior: 'smooth',
				top: refDescription.current.offsetTop - 200,
			});
		setTimeout(() => {
			SetIsFullText(!isFullText);
		}, 200);
	};

	return (
		<>
			{productDetails.properties.some((item) => item.displayOrder !== 0) ? (
				<div className='border-b border-b-[#EBEBEB] px-3 py-4 text-16 font-semibold font-sfpro_semiBold capitalize'>
					<div
						className='flex items-center justify-between outline-none'
						onClick={(): void => setIsToggle(!isToggle)}
						onKeyPress={(): void => setIsToggle(!isToggle)}
						tabIndex={0}
						role='button'
					>
						<div className='font-sfpro_semiBold font-semibold normal-case'>Thông tin sản phẩm</div>
						<div className='relative mr-4 h-2.5 w-5'>
							<ImageCustom
								layout='fill'
								src='/static/svg/chevron-down-333333.svg'
								alt='vuivui chevron down'
								objectFit='contain'
							/>
						</div>
					</div>
					<div
						ref={refParents}
						className={classNames([
							'animation-100 overflow-hidden',
							isToggle ? 'mt-0 opacity-0' : 'mt-4 opacity-100',
						])}
						style={{
							height: isToggle ? '0px' : `100%`,
							transition: 'linear 100ms all',
						}}
					>
						{productDetails.properties.find((item) => !item.isVariationConfig) ? (
							<div className='mb-6 border p-4'>
								{productDetails.properties
									.filter(
										(item) =>
											!item.isVariationConfig &&
											(item.propertyOriginalValue || item.propertyCustom),
									)
									.map((property: ProductProperties, index: number) => {
										return property.propertyOriginalValue ? (
											<div className='flex pb-4 normal-case last-of-type:pb-0' key={index}>
												<div className='max-w-5/10 flex-5/10 font-sfpro_semiBold font-medium'>
													{' '}
													{property.propertyName}
												</div>
												<div className='max-w-5/10 flex-5/10'>{property.propertyOriginalValue}</div>
											</div>
										) : (
											<div className='flex pb-4 normal-case last-of-type:pb-0' key={index}>
												<div className='max-w-5/10 flex-5/10 font-sfpro_semiBold font-medium'>
													{' '}
													{property.propertyCustom}
												</div>
												<div className='max-w-5/10 flex-5/10'>{property.propertyValueCustom}</div>
											</div>
										);
									})}
							</div>
						) : null}

						<div
							ref={refDescription}
							className={classNames([
								isFullText ? 'line-clamp-none' : 'line-clamp-5',
								'animation-300 normal-case',
								refDescription?.current?.clientHeight > 96 && !isFullText ? 'line-clamp-4' : '',
							])}
							dangerouslySetInnerHTML={{ __html: productDetails.content }}
						></div>
						{refDescription?.current && refDescription?.current?.clientHeight > 96 ? (
							<div
								className='inline-block cursor-pointer text-left text-primary-009ADA outline-none'
								onClick={handleFullText}
								onKeyPress={() => {}}
								tabIndex={0}
								role='button'
							>
								{isFullText ? 'Ẩn bớt nội dung' : 'Xem thêm nội dung'}
							</div>
						) : (
							''
						)}
					</div>
				</div>
			) : (
				''
			)}
		</>
	);
};

export default ProductSpecsMobile;
