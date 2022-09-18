import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import { useAppSelector } from 'hooks';
import Link from 'next/link';
import React from 'react';
import { isIOSDeviceSelector } from 'store/reducers/appSlice';
import { numberWithCommas } from 'utils';

export enum ProductType {
	bestSeller = 'best-seller',
	detail = 'detail',
	buffer = 'buffer',
	dealShock = 'deal-shock',
	liveStream = 'live-stream',
	interestDeal = 'interest-deal',
	recommend = 'recommend',
	dealShockMobile = 'deal-shock-mobile',
	interestDealMobile = 'interest-deal-mobile',
	uniqueProduct = 'unique-product',
	trendingProduct = 'trending-product',
	trendingProductMobile = 'trending-product-mobile',
	newProduct = 'new-product',
	newProductMobile = 'new-product-mobile',
	bestSellerMobile = 'best-seller-mobile',
	productDetailMobile = 'product-detail-mobile',
	favoriteProduct = 'favorite-product',
}
interface IProductCard {
	image: string;
	description?: string;
	percentDiscount?: number;
	price?: number;
	className?: string;
	classNameImage?: string;
	classDescription?: string;
	classPrice?: string;
	classPercentDiscount?: string;
	width?: number | string;
	height?: number | string;
	styles?: React.CSSProperties;
	isHeart?: boolean;
	listOption?: Array<string>;
	isDealShock?: boolean;
	rating?: {
		rate?: number;
		total?: number;
	};
	priceDash?: number | string;
	shippingFee?: number;
	shop?: {
		img?: string;
		name?: string;
	};
	type?: ProductType;
	isAssurance?: boolean;
	tool?: React.ReactNode;
	path?: string;
	left?: number;
	sold?: number;
	animation?: boolean;
	numQuantityDealShock?: number;
	statusPromotion?: number;
	timeDealSock?: string | number;
	isPromoteStarted?: boolean;
	onClick?: () => void;
}

export const ProductCard: React.FC<IProductCard> = (props) => {
	const {
		classDescription,
		classPrice,
		price,
		percentDiscount,
		classNameImage,
		className,
		image,
		description,
		width,
		height,
		styles,
		rating,
		priceDash,
		shippingFee = 0,
		shop,
		type = ProductType.detail,
		isAssurance,
		tool,
		path = '',
		left = 0,
		classPercentDiscount = '',
		onClick,
		animation = true,
		isHeart,
		isPromoteStarted,
		// numQuantityDealShock,
		// statusPromotion,
		// timeDealSock,
	} = props || {};

	const isIOSDevice = useAppSelector(isIOSDeviceSelector);

	return (
		<Link href={path} passHref>
			<a
				onClick={() => onClick && onClick()}
				onKeyPress={() => {}}
				role='button'
				tabIndex={0}
				title={description}
				className={` focus-outline-none animation-100 flex flex-col outline-none ${
					type === ProductType.dealShockMobile || type === ProductType.interestDealMobile
						? 'w-full rounded-md bg-white'
						: ''
				} 
					 ${type === ProductType.uniqueProduct ? 'w-full rounded-md' : ''}
					 ${type === ProductType.interestDeal ? 'w-full items-center' : ''}
					 ${type === ProductType.recommend ? 'mx-auto' : ''}
					 ${type === ProductType.bestSeller ? 'rounded-md border border-E7E7E8' : ''}
					 ${type === ProductType.bestSellerMobile ? 'rounded-md border border-E7E7E8' : ''}
					 ${type === ProductType.productDetailMobile ? '' : ''}
					 ${type === ProductType.trendingProduct ? 'rounded-md border-none' : ''}
					 ${type === ProductType.trendingProductMobile ? 'w-full items-center rounded-md border-none' : ''}
					 relative cursor-pointer overflow-hidden opacity-100 hover:opacity-90
					 ${
							type !== ProductType.dealShock &&
							type !== ProductType.favoriteProduct &&
							animation &&
							'hover:shadow-productCard'
						}
					 `}
			>
				<div
					className={`focus-outline-none relative flex cursor-pointer flex-col items-center rounded-md bg-white ${
						className || ''
					}  flex-1`}
					style={{ width: width, ...styles }}
				>
					<div className='focus-outline-none relative flex'>
						<div className={`focus-outline-none relative`} style={{ width: width, height }}>
							<ImageCustom
								loading='lazy'
								src={image || EmptyImage}
								alt=''
								layout={'fixed'}
								width={type === ProductType.bestSeller ? 128 : width || 'auto'}
								quality={isIOSDevice ? 100 : 75}
								height={height || 'auto'}
								className={`object-cover ${classNameImage} focus-outline-none aspect-square ${
									type === ProductType.favoriteProduct && 'rounded-lg'
								}`}
							/>
						</div>

						{/* {![ProductType.dealShock, ProductType.recommend, ProductType.buffer].includes(type) &&
							(isHeart ? (
								<img
									loading='lazy'
									src='/static/svg/heart-red.svg'
									alt=''
									className='absolute w-5 h-5 bottom-10px right-10px cursor-pointer hidden md:block'
								/>
							) : (
								<img
									loading='lazy'
									src='/static/svg/heart.svg'
									alt=''
									className=' hidden md:block absolute w-5 h-5 bottom-10px right-10px cursor-pointer'
								/>
							))} */}

						{isHeart !== undefined && (
							<div className='absolute bottom-10px right-10px h-[20px] w-[20px] cursor-pointer'>
								<ImageCustom
									loading='lazy'
									width='20px'
									height='20px'
									src={`/static/svg/${isHeart ? 'heart-red' : 'heart'}.svg`}
									alt=''
								/>
							</div>
						)}
						{type === ProductType.liveStream && (
							<div className='absolute top-6px left-6px flex'>
								<p className='rounded-4px border-none bg-DF0707 px-1 text-12 font-medium uppercase text-white'>
									Trực tiếp
								</p>
								<div className='ml-6px flex h-18px items-center rounded-4px bg-343A40 px-1'>
									<ImageCustom src='/static/svg/visible.svg' alt='' width='auto' height='9px' />
									<p className='ml-1 text-12 text-white'>25</p>
								</div>
							</div>
						)}
						{/* {listOption.length && <ListOptionProduct />} */}
					</div>
				</div>
				{percentDiscount && type === ProductType.recommend ? (
					<div
						className={`
						z-5 absolute top-0 right-0 rounded-tr-md text-xs font-semibold 
						${'w-40px bg-FEE800 text-272728'} 
							flex h-5 items-center justify-center ${classPercentDiscount}
						`}
					>
						{percentDiscount && (
							<ImageCustom
								loading='lazy'
								src='/static/svg/flash-yellow.svg'
								alt=''
								width='7px'
								height='13px'
							/>
						)}
						{`-${Math.floor(Math.abs(percentDiscount ?? 0))}%`}
					</div>
				) : (
					<></>
				)}
				{description &&
					![
						ProductType.bestSeller,
						ProductType.bestSellerMobile,
						ProductType.interestDeal,
						ProductType.recommend,
						ProductType.dealShockMobile,
						ProductType.trendingProductMobile,
						ProductType.favoriteProduct,
						// ProductType.productDetailMobile,
					].includes(type) &&
					(type === ProductType.detail ? (
						<h3
							className={`h3x-2 mt-1 text-16 text-black-60 line-clamp-1 md:mt-2 ${classDescription} ml-0 px-2`}
						>
							{description}
						</h3>
					) : (
						![ProductType.uniqueProduct, ProductType.dealShock].includes(type) && (
							<h3
								className={`ml-0 mt-1 px-2 text-center text-16 text-black-60 line-clamp-1 md:mt-2 ${classDescription} overflow-hidden text-ellipsis`}
								// style={{ width: width !== 'w-full' ? width : '' }}
							>
								{description}
							</h3>
						)
					))}
				{type === ProductType.detail && (
					<div className='px-2'>
						<div className='mt-6px flex'>
							{rating?.rate ? (
								<div className='mr-10px flex'>
									<ImageCustom
										loading='lazy'
										src='/static/svg/star.svg'
										alt=''
										width={13}
										height={13}
									/>
									<p className='ml-6px'>
										{rating?.rate} ({rating?.total})
									</p>
								</div>
							) : (
								''
							)}
							{shippingFee > 0 ? (
								<p className='text-16 text-black-60'>Giao hàng {Math.floor(shippingFee / 1000)}k</p>
							) : (
								<p className='text-16 text-0EB200'>Giao miễn phí</p>
							)}
						</div>
						<div className='mt-13px flex'>
							<p className='font-sfpro_semiBold text-18 font-semibold'>
								{numberWithCommas(price || 0, '.')}
								<sup className='ml-2px'>đ</sup>
							</p>
							{priceDash !== 0 ? (
								<p className='ml-2 font-normal line-through'>
									{numberWithCommas(priceDash || '', '.')}
								</p>
							) : (
								''
							)}
						</div>
						<div className='mt-10px flex text-9F9F9F'>
							<div className='mr-2 flex'>
								{shop?.img && (
									<ImageCustom
										loading='lazy'
										className='mr-5px rounded-full'
										src={shop?.img}
										alt=''
										width={24}
										height={24}
									/>
								)}
								{shop?.name && <p className='ml-1 text-16'> {shop?.name}</p>}
							</div>
							{isAssurance && (
								<div className='flex items-center'>
									<ImageCustom
										width={14}
										height={14}
										loading='lazy'
										src='/static/svg/assurance-logo.svg'
										alt=''
										className='mr-1'
									/>
									<p className='text-12 text-primary-4834D6'>ĐẢM BẢO</p>
								</div>
							)}
						</div>
					</div>
				)}
				{type === ProductType.buffer && price !== undefined && (
					<div>
						<p
							className={`mx-6px text-center font-sfpro_semiBold text-black-60 md:text-272728 ${classPrice} ml-0`}
						>
							{numberWithCommas(price, '.')}
							<sup>đ</sup>
						</p>
						{priceDash && (
							<p
								className={`text-center text-16 font-semibold text-828282 line-through`}
								style={{ width: width }}
							>
								{numberWithCommas(priceDash, '.')}
								<sup>đ</sup>
							</p>
						)}
					</div>
				)}
				{/* {type === ProductType.dealShock && price !== undefined && (
					<div>
						<p
							className={`text-black md:text-272728 text-14 md:text-18 text-center font-sfpro_semiBold md:font-bold mx-6px ${classPrice}`}
						>
							{numberWithCommas(price, '.')}
							<sup>đ</sup>
						</p>
						{priceDash && (
							<p className={`text-828282 line-through text-16 text-center font-semibold mx-6px`}>
								{numberWithCommas(priceDash, '.')}
								<sup>đ</sup>
							</p>
						)}
						<div className='px-2px'>
							{sold !== undefined && left > 0 && (
								<div className='relative my-6px w-full rounded-full bg-FFE4D8'>
									{Math.round((100 * left) / (sold + left)) > 0 ? (
										Math.round((100 * left) / (sold + left)) === 100 ? (
											<div
												className='h-6 rounded-full bg-gradient-to-r from-FF570E to-FF9900 p-0.5 text-center text-xs font-medium leading-none'
												style={{ width: `100%` }}
											></div>
										) : (
											<div
												className='h-6 rounded-l-full bg-gradient-to-r from-FF570E to-FF9900 p-0.5 text-center text-xs font-medium leading-none'
												style={{ width: `${Math.round((100 * left) / (sold + left))}%` }}
											></div>
										)
									) : (
										<div
											className='h-6 rounded-full bg-FFE4D8 p-0.5 text-center text-xs font-medium leading-none'
											style={{ width: '100%' }}
										></div>
									)}
									<div className='absolute top-0 w-full text-center'>
										<p className='text-16'>Còn {left} sản phẩm</p>
									</div>
								</div>
							)}
						</div>
					</div>
				)} */}
				{type === ProductType.bestSellerMobile && price !== undefined && (
					<div className='mt-2 flex flex-col justify-center'>
						<h3
							style={{ width: width }}
							className='overflow-hidden text-ellipsis whitespace-nowrap px-10px text-center text-14 text-6E6E70'
						>
							{description}
						</h3>
					</div>
				)}
				{[ProductType.bestSellerMobile].includes(type) && (
					<div className='px-1 pb-3'>
						<p
							className={`mx-6px text-center font-sfpro_bold text-14 text-272728 md:text-18 ${classPrice}`}
						>
							{numberWithCommas(price || 0, '.')}
							<sup>đ</sup>
						</p>
						{percentDiscount && percentDiscount > 0 && priceDash ? (
							<div className='flex items-center justify-center'>
								<p className={`text-center text-12 text-black-60 line-through ${classPrice}`}>
									{numberWithCommas(priceDash || 0, '.')}
									<sup>đ</sup>
								</p>
								<p className='font-sfpro_semiBold text-12 font-bold text-[#009908]'>
									-{Math.round(Math.abs(percentDiscount ?? 0))}%
								</p>
							</div>
						) : null}
					</div>
				)}

				{(type === ProductType.dealShockMobile ||
					type === ProductType.dealShock ||
					type === ProductType.productDetailMobile) &&
					percentDiscount !== 0 && (
						<div className='mt-2 px-1 pb-3'>
							<p
								className={`mx-6px text-center font-sfpro_bold text-14 text-272728 md:text-18 ${classPrice}`}
							>
								{numberWithCommas(price ?? 0, '.')}
								<sup>đ</sup>
							</p>
							{priceDash && !!percentDiscount ? (
								<div className='flex items-center justify-center'>
									<p className={`text-center text-12 text-black-60 line-through ${classPrice}`}>
										{numberWithCommas(priceDash ?? 0, '.')}
										<sup>đ</sup>
									</p>
									<p className='text-12 text-[#009908]'>
										-{Math.floor(Math.abs(percentDiscount ?? 0))}%
									</p>
								</div>
							) : null}

							{left ? (
								<>
									{left > 0 ? (
										<p className='text-center text-12 text-[#999]'>Còn {left} sản phẩm</p>
									) : (
										<p className='w-full text-center text-12 text-red-500'>Hết hàng</p>
									)}
								</>
							) : null}
						</div>
					)}
				{type === ProductType.interestDealMobile && price !== undefined && (
					<p className='pb-4 text-center font-sfpro_semiBold text-14 text-[#009908]'>
						Giảm đến {Math.floor(Math.abs(percentDiscount ?? 0))}%
					</p>
				)}
				{type === ProductType.bestSeller && price !== undefined && (
					<div className='mt-2 flex flex-col justify-center pb-3'>
						<h3
							style={{ width: width }}
							className='overflow-hidden text-ellipsis whitespace-nowrap px-10px text-center text-14 text-6E6E70'
						>
							{description}
						</h3>
						<p className='text-center font-sfpro_semiBold text-14 text-black'>
							{numberWithCommas(price ?? 0, '.')}
							<sup>đ</sup>
						</p>
						{percentDiscount && percentDiscount > 0 && priceDash && isPromoteStarted ? (
							<div className='flex items-center justify-center'>
								<p className={`text-center text-12 text-black-60 line-through ${classPrice}`}>
									{numberWithCommas(priceDash ?? 0, '.')}
									<sup>đ</sup>
								</p>
								<p className='text-12 text-[#009908]'>
									-{Math.floor(Math.abs(percentDiscount ?? 0))}%
								</p>
							</div>
						) : null}
					</div>
				)}

				{type === ProductType.favoriteProduct && price !== undefined && (
					<div className='mt-2 flex flex-col pb-3'>
						<p className='font-sfpro_semiBold text-14 text-black'>
							{numberWithCommas(price ?? 0, '.')}
							<sup>đ</sup>
						</p>
						{percentDiscount && percentDiscount > 0 && priceDash && isPromoteStarted ? (
							<div className='flex items-center'>
								<p className={`text-12 text-black-60 line-through ${classPrice}`}>
									{numberWithCommas(priceDash ?? 0, '.')}
									<sup>đ</sup>
								</p>
								<p className='text-12 text-[#009908]'>
									-{Math.floor(Math.abs(percentDiscount ?? 0))}%
								</p>
							</div>
						) : null}
						<h3
							style={{ width: width }}
							className='mt-[5px] overflow-hidden overflow-hidden truncate line-clamp-2 whitespace-normal text-14 text-333333'
						>
							{description}
						</h3>
					</div>
				)}

				{type === ProductType.interestDeal && (
					<div className='flex flex-col text-center'>
						<h3 className='mt-2 px-1 text-16 text-6E6E70'>{description}</h3>
						<p className='mt-1 font-sfpro_semiBold text-18 text-272728'>
							Từ {price !== undefined ? numberWithCommas(price, '.') : ''}
							<sup>đ</sup>
						</p>
					</div>
				)}
				{tool}
			</a>
		</Link>
	);
};

export default ProductCard;
