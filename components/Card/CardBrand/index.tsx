import { ImageCustom } from 'components';
import { IProductSearch } from 'models';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Icon, IconEnum } from 'vuivui-icons';
import { Slider } from 'vuivui-slider';

interface ICardBrand {
	image?: Array<string>;
	className?: string;
	nameBrand?: string;
	totalProduct?: number;
	isLiked?: boolean;
	avatar?: string;
	listProduct?: IProductSearch[];
}

const CardBrand: React.FC<ICardBrand> = ({
	className,
	avatar,
	isLiked,
	nameBrand,
	totalProduct,
	listProduct,
}) => {
	const [screenWidth, setScreenWidth] = useState<number>(0);

	useEffect(() => {
		if (document.body) setScreenWidth(document?.body?.clientWidth);
		return () => {
			setScreenWidth(0);
		};
	}, []);

	const settings = {
		dots: false,
		infinite: false,
		slidesToShow: 3,
		slidesToScroll: 3,
		arrows: true,
		autoplay: false,
		nextArrow: () => (
			<div className='absolute right-5 top-[-30px] flex h-[35px] w-[35px] items-center justify-center rounded-full border border-E7E7E8 bg-white'>
				<Icon name={IconEnum.CaretRight} size={22} />
			</div>
		),
		prevArrow: () => (
			<div className='absolute left-5 top-[-30px] flex h-[35px] w-[35px] items-center justify-center rounded-full border border-E7E7E8 bg-white'>
				<Icon name={IconEnum.CaretLeft} size={22} />
			</div>
		),
	};
	const transformListProduct = listProduct?.map((product) => {
		return {
			image: product.variations?.[0].variationImage,
			title: product.title,
			categoryUrlSlug: product.categoryUrlSlug,
			urlSlug: product.urlSlug,
		};
	});

	const renderBlockImage = () => {
		switch (transformListProduct?.length) {
			case 1:
				return (
					<div className='relative aspect-square h-full w-full'>
						<ImageCustom
							src={transformListProduct[0].image || '/static/images/empty-img.png'}
							layout='fill'
							priority
						/>
					</div>
				);

			case 4:
				return (
					<div className={`${className || ''}`}>
						<div className='relative h-[363px] w-full'>
							<ImageCustom
								objectFit='contain'
								src={transformListProduct[0].image || '/static/images/empty-img.png'}
								layout='fill'
								priority
							/>
						</div>
						<div className='mt-1px flex'>
							{transformListProduct.slice(1).map((item, index) => {
								return (
									<Link
										key={index}
										href={`${
											item.categoryUrlSlug
												? item.categoryUrlSlug + '/' + item?.urlSlug
												: 'coming-soon'
										}`}
										passHref
									>
										<a title={item.title} aria-disabled style={{ width: screenWidth / 3 - 2 }}>
											<div className='mr-1px cursor-pointer' key={index}>
												<div className='relative'>
													<ImageCustom
														objectFit='contain'
														src={item.image || '/static/images/empty-img.png'}
														priority
														width={screenWidth / 3 - 2}
														height={screenWidth / 3 - 2}
													/>
												</div>
												<div className='flex flex-col justify-end'>
													<span className='text-ellipsis line-clamp-2'>{item.title}</span>
													<span className='cursor-pointer text-009ADA'>Mua ngay</span>
												</div>
											</div>
										</a>
									</Link>
								);
							})}
						</div>
					</div>
				);
			default:
				if (transformListProduct && transformListProduct?.length > 4) {
					return (
						<div className={`${className || ''}`}>
							<div className='relative h-[363px] w-full'>
								<ImageCustom
									objectFit='contain'
									src={transformListProduct[0].image || '/static/images/empty-img.png'}
									layout='fill'
									priority
								/>
							</div>
							<div className='mt-[1px]'>
								<Slider {...settings}>
									{transformListProduct.slice(1).map((item, index) => {
										return (
											<Link
												key={index}
												href={`${
													item.categoryUrlSlug
														? item.categoryUrlSlug + '/' + item?.urlSlug
														: 'coming-soon'
												}`}
												passHref
											>
												<a title={item.title} aria-disabled style={{ width: screenWidth / 3 - 2 }}>
													<div className='cursor-pointer'>
														<div className='relative'>
															<ImageCustom
																objectFit='contain'
																src={item.image || '/static/images/empty-img.png'}
																width={screenWidth / 3 - 2}
																height={screenWidth / 3 - 2}
																priority
															/>
														</div>
														<div className='flex flex-col justify-end'>
															<span className='text-ellipsis line-clamp-2'>{item.title}</span>
															<span className='cursor-pointer text-009ADA'>Mua ngay</span>
														</div>
													</div>
												</a>
											</Link>
										);
									})}
								</Slider>
							</div>
						</div>
					);
				}
		}
	};

	return (
		<div className={`max-w-[calc(50%_-_10px)] flex-5/10 ${className || ''}`}>
			<div className='flex items-center '>
				<div className='relative mr-4 flex items-center justify-center rounded-full border border-E7E7E8'>
					<ImageCustom
						src={avatar ? avatar : '/static/images/empty-img.png'}
						objectFit='contain'
						width={62}
						height={62}
						className='rounded-full'
					/>
				</div>
				<div>
					<div>
						<span className='font-sfpro_semiBold text-16 text-272728'>{nameBrand}</span>
						<span className={`ml-6px text-14 ${isLiked ? 'text-[#666666]' : 'text-009ADA'}`}>
							{isLiked ? 'Đang theo dõi' : 'Theo dõi Shop'}
						</span>
					</div>
					<div className='mt-2 text-11 text-9F9F9F'>
						<span>{totalProduct} Sản phẩm</span>
						<span className='ml-18px'>127 Cửa hàng</span>
						<span className='ml-4'>8,290K Lượt theo dõi</span>
					</div>
				</div>
			</div>
			<div className='mt-2 w-full '>{renderBlockImage()}</div>
		</div>
	);
};

export default CardBrand;
