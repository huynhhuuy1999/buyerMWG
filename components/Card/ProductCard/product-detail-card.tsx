import classNames from 'classnames';
import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import { Product, ProductVariation, ProductViewES } from 'models';
import Link from 'next/link';
import React, { CSSProperties, useState } from 'react';
import { numberWithCommas } from 'utils';

interface IProductDetailCard {
	image: Product['variations'];
	description?: { brandName: string; title: string };
	isGuarantee: boolean; //hiển thị icon đảm bảo
	rating?: { total?: number; rate: number };
	percentDiscount?: number;
	price?: number;
	className?: string;
	classNameImage?: string;
	priceDash?: number;
	classDescription?: string;
	classPrice?: string;
	classPercentDiscount?: string;
	width?: number | string;
	height?: number | string;
	isRouter?: ProductViewES;
	styles?: CSSProperties;
	isHeart?: boolean;
	listOption?: ProductVariation[];
	isDealShock?: boolean;
	shippingFee?: number;
	trackingId?: number;
	path: string;
}
const ProductDetailCard: React.FC<IProductDetailCard> = (props) => {
	const {
		classDescription,
		classPrice,
		price,
		percentDiscount,
		classNameImage,
		className,
		isRouter,
		image,
		shippingFee,
		rating,
		isGuarantee,
		description,
		classPercentDiscount,
		width,
		height,
		styles,
		priceDash,
		isHeart,
		listOption = [],
		isDealShock,
		path,
	} = props || {};

	const [activeOption, setActiveOption] = useState(0);

	const ListOptionProduct = (): JSX.Element => {
		return (
			<div className='absolute bottom-0 left-0 z-50 flex'>
				{listOption?.map((item, index) => {
					return (
						index < 3 && (
							<div
								key={index}
								className={`animation-300 h-12 w-12 cursor-pointer overflow-hidden rounded-full border bg-white hover:border-FF7A00 ${
									index === activeOption ? 'border-FF7A00' : 'border-white'
								} border-solid`}
								onMouseOver={() => setActiveOption(index)}
								onFocus={() => setActiveOption(index)}
								tabIndex={0}
								role='button'
							>
								{listOption?.length > 3 && index === 2 ? (
									<React.Fragment>
										<Link
											href={`${
												isRouter?.categoryUrlSlug
													? `/${isRouter?.categoryUrlSlug || '#'}/${isRouter?.urlSlug}`
													: path
											}`}
										>
											<a className='relative block' tabIndex={0} role='button'>
												<ImageCustom
													width={'100vw'}
													height={'100vh'}
													objectFit={'contain'}
													alt='variant vuivui product'
													src={item.variationImage}
												/>
												{listOption?.length - (index + 1) !== 0 ? (
													<>
														<div className='absolute inset-0 bg-[#0E0E10]/20'></div>
														<span className='absolute top-2/4 left-2/4 z-10 -translate-x-2/4 -translate-y-2/4 text-12 text-white'>
															+ {listOption?.length - (index + 2)}
														</span>
													</>
												) : (
													''
												)}
											</a>
										</Link>
									</React.Fragment>
								) : (
									<div className='relative h-full w-full'>
										<img
											className='h-full w-full object-contain'
											alt='variant vuivui product'
											src={item.variationImage || EmptyImage}
										/>
									</div>
								)}
							</div>
						)
					);
				})}
			</div>
		);
	};

	return (
		<Link href={path}>
			<a
				className='group animation-300 block overflow-hidden pb-2 outline-none lg:hover:shadow-xl'
				tabIndex={0}
				role={'button'}
			>
				<div
					className={`relative flex flex-col rounded-md bg-white ${className || ''}`}
					style={{ width, ...styles }}
				>
					<div className='relative overflow-hidden'>
						<div
							className={classNames([
								'object-cover relative',
								classNameImage || 'w-64 h-64',
								'animation-300 opacity-90 hover:opacity-100',
							])}
							style={{ width, height }}
						>
							{image?.map((item, index: number) => {
								return (
									index === activeOption && (
										<div className='relative h-full w-full' key={index}>
											<img
												src={item.variationImage || EmptyImage}
												alt='img product'
												className='object-contain'
												loading='lazy'
											/>
										</div>
									)
								);
							})}
						</div>

						{percentDiscount && (
							<div
								className={`absolute top-0 right-0 z-10 rounded-l-2xl text-xs font-semibold ${
									isDealShock
										? 'w-51px bg-gradient-to-r from-FF7A00 to-E34400 text-white'
										: 'w-40px bg-FEE800 text-272728'
								} flex h-5 items-center justify-center ${classPercentDiscount}`}
							>
								{isDealShock && <img loading='lazy' src='/static/svg/flash-yellow.svg' alt='' />}
								{`-${Math.round(percentDiscount)}%`}
							</div>
						)}
						{isHeart ? (
							<div className='absolute bottom-10px right-10px hidden h-5 w-5 cursor-pointer md:block'>
								<img
									src='/static/svg/heart-red.svg'
									alt='vuivui heart'
									className='h-6 w-[26px] object-contain'
								/>
							</div>
						) : (
							<div className='absolute bottom-10px right-10px hidden h-5 w-5 cursor-pointer md:block'>
								<img
									src='/static/svg/heart.svg'
									alt='vuivui heart'
									className='h-6 w-[26px] object-contain'
								/>
							</div>
						)}
						{listOption?.length ? <ListOptionProduct /> : ''}
					</div>
					<div className='px-2'>
						{price !== undefined && (
							<div className='mt-13px flex'>
								<p
									className={`mr-6px font-sfpro_bold text-14 font-extrabold text-black-60 md:text-18 md:text-272728 ${classPrice}`}
								>
									{numberWithCommas(price, '.')}
									<sup>đ</sup>
								</p>
								{priceDash !== price && (
									<p className='ml-2 font-normal line-through'>
										{numberWithCommas(priceDash || '', '.')}
									</p>
								)}
							</div>
						)}
						{description && (
							<p className={`text-16 text-black-60 line-clamp-1 ${classDescription}`}>
								<span className='animation-300 cursor-pointer text-16 font-normal uppercase leading-7 text-333333 lg:group-hover:text-FF7A00'>
									{description.brandName} {' - '}
									{description.title}
								</span>
							</p>
						)}
						{rating && (
							<div className='mt-3 flex justify-between'>
								<div className='mr-10px flex items-center'>
									<div className='relative h-4 w-[15px]'>
										{rating?.rate > 0 ? (
											<img
												className='mr-1 w-5 h-5'
												src='/static/svg/star-product.svg'
												alt='star'
												loading='lazy'
											/>
										) : (
											<div className='relative h-4 w-[15px]'>
												<img
													className='h-5 w-5'
													src='/static/svg/star_nobg.svg'
													alt='star background'
													loading='lazy'
												/>
											</div>
										)}
									</div>
									<p className='ml-6px'>
										{rating?.rate} ({rating?.total})
									</p>
								</div>
								{isGuarantee && (
									<div className='ml-6px flex items-center bg-[rgba(0,154,218,0.08)]/80 px-1 py-[1px] text-16'>
										<div className='relative h-14px w-14px'>
											<img
												className='h-full w-full object-contain'
												src='/static/svg/iconLogoYellow.svg'
												alt='vuivui logo'
											/>
										</div>
										<span className='ml-1 text-xs font-medium uppercase text-primary-009ADA'>
											đảm bảo
										</span>
									</div>
								)}
							</div>
						)}
						{shippingFee && shippingFee > 0 ? (
							<p className='text-16 text-black-60'>Giao hàng {Math.floor(shippingFee / 1000)}k</p>
						) : null}
					</div>
				</div>
			</a>
		</Link>
	);
};

export default ProductDetailCard;
