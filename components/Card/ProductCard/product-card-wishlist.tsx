import classNames from 'classnames';
import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import { TYPE_LAYOUT_CARD, TYPE_PROPERTY } from 'enums';
import { useAppSelector } from 'hooks';
import { debounce } from 'lodash';
import { Configs, ProductVariation } from 'models';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { numberWithCommas } from 'utils';

import { isIOSDeviceSelector } from '@/store/reducers/appSlice';

export interface IProductCardLayout {
	type?: TYPE_LAYOUT_CARD;
	image?: string;
	widthImage?: number | string;
	heightImage?: number | string;
	price?: number;
	priceDash?: number | string;
	brandName?: string;
	percentDiscount?: number;
	title?: string;
	rating?: {
		rate?: number;
		isShow?: boolean;
		total?: number;
	};
	titlePomotion?: string;
	timeFreeShip?: number;
	gift?: string;
	isHeart?: boolean;
	propertyFeature?: Array<string>;
	listVariant?: Array<any>;
	variantIdSelected?: number;
	path?: string;
	isGuarantee?: boolean;
	isMobile?: boolean;
	variations?: ProductVariation[];
	handleAddCard?: any;
	handleLike?: (isLike: boolean) => void;
	variationConfig?: Configs[];
	onClick?: () => void;
	handleUpdateQuantityCart?: (quantity: number) => void;
	isChangeStyleHeart?: boolean;
	onShowMoreVariation?: () => void;
	animation?: boolean;
	className?: string;
	onChooseVariant?: (productId: number, variantId: number) => void;
	productId?: number;
	timeDealSock?: string;
}

const TYPE_CHANGE = {
	INCREASE: 1,
	DEINCREASE: 2,
};

const ProductCardLayoutWishList: React.FC<IProductCardLayout> = ({
	type,
	heightImage,
	widthImage,
	price,
	priceDash,
	brandName,
	percentDiscount,
	title,
	rating,
	titlePomotion,
	timeFreeShip,
	gift,
	propertyFeature,
	isHeart,
	listVariant,
	path = '',
	isGuarantee,
	isMobile,
	variations,
	handleAddCard,
	handleLike,
	variationConfig,
	onClick,
	handleUpdateQuantityCart,
	isChangeStyleHeart = true,
	onShowMoreVariation,
	animation = true,
	className,
	onChooseVariant,
	productId,
	timeDealSock,
}) => {
	const [indexSelectedVariant, setIndexSelectedVariant] = useState(0);
	const checkPropertyColor = useMemo(
		() =>
			variationConfig?.every(
				(item) =>
					item.type === TYPE_PROPERTY.COLOR && item.propertyValues.some((t) => t.propertyValueName),
			),
		[variationConfig],
	);
	const [timeDeal, setTimeDeal] = useState<string>(timeDealSock || '');
	const [isLike, setIsLike] = useState<boolean>(isHeart || false);
	const [inCart, setInCart] = useState<boolean>(false);
	const [quantity, setQuantity] = useState<number>(1);
	const [like, setLike] = useState<boolean>(isHeart || false);
	const [flag, setFlag] = useState<number>(0);
	const onLike = useRef(
		debounce((item: boolean) => {
			setLike(item);
			if (flag !== 0 || item !== isLike) {
				setFlag(flag + 1);
			}
		}, 500),
	).current;

	useEffect(() => {
		if (flag !== 0) handleLike && handleLike(like);
	}, [like, flag]);

	useEffect(() => {
		if (timeDealSock) {
			const dealtime = moment(timeDealSock).unix();
			const currentTime = moment().unix();
			const difftime = dealtime - currentTime;
			let duration: any = moment.duration(difftime * 1000, 'milliseconds');
			const steptime = 1000;
			const interval = setInterval(() => {
				duration = moment.duration(duration - steptime, 'milliseconds');
				setTimeDeal(`${duration.hours()}:${duration.minutes()}:${duration.seconds()}`);
			}, steptime);

			return () => clearTimeout(interval);
		}
	}, [timeDealSock]);

	const handleChangeQuantity = (typeChange: number) => {
		if (typeChange === TYPE_CHANGE.INCREASE) setQuantity(quantity + 1);
		else {
			quantity >= 1 && setQuantity(quantity - 1);
		}
	};

	const deBounceUpdateOnClickQuantity = useRef(
		debounce((item) => {
			handleUpdateQuantityCart?.(item);
		}, 200),
	).current;

	const isIOSDevice = useAppSelector(isIOSDeviceSelector);

	return (
		<Link href={path} passHref>
			<a title={title} aria-disabled>
				<div
					onKeyDown={() => {
						return;
					}}
					tabIndex={0}
					role='button'
					onClick={() => onClick?.()}
					className={classNames(
						'pb-3 overflow-hidden cursor-pointer mx-auto',

						animation ? 'hover:shadow-productCard' : '',
					)}
					style={{ width: isMobile ? '100%' : widthImage }}
				>
					<div className='relative flex justify-center'>
						<div
							className={`relative aspect-square w-full ${
								!widthImage && !heightImage ? 'h-full' : ''
							}`}
							style={{ width: widthImage, height: heightImage }}
						>
							<ImageCustom
								width={widthImage || '100%'}
								height={heightImage || '100%'}
								objectFit='contain'
								src={variations?.[indexSelectedVariant]?.variationImage || EmptyImage}
								quality={isIOSDevice ? 100 : 75}
								priority
								alt=''
							/>
							{
								// type === TYPE_LAYOUT_CARD.CLOTHES &&
								listVariant?.length && listVariant.length > 1 && checkPropertyColor ? (
									<div className='absolute bottom-[2px] left-[12px] flex'>
										{listVariant.map((variant, index) => {
											return (
												index < 3 && (
													<div
														className={classNames([
															'relative h-full aspect-square rounded-full cursor-pointer border',
															isMobile ? 'w-10' : 'w-12',
															index === indexSelectedVariant &&
															(index !== 2 || listVariant.length === 3)
																? 'border-[#FF570E]'
																: 'border-white',
														])}
														key={index}
														onMouseOver={(e) => {
															if (index !== 2 || listVariant.length === 3) {
																e.stopPropagation();
																setIndexSelectedVariant(index);
															}
														}}
														onFocus={(e) => {
															if (index !== 2 || listVariant.length === 3) {
																e.stopPropagation();
																setIndexSelectedVariant(index);
															}
														}}
														onClick={(e) => {
															if (isMobile) {
																if (index !== 2 || listVariant.length === 3) {
																	e.preventDefault();
																	setIndexSelectedVariant(index);
																	onChooseVariant?.(productId ? productId : 0, variant.variationId);
																	// onShowMoreVariation?.();
																}
																if (index === 2 && listVariant.length > 3) {
																	e.preventDefault();
																	onShowMoreVariation?.();
																}
															}
														}}
														onKeyPress={(e) => {
															if ((index !== 2 || listVariant.length === 3) && isMobile) {
																e.preventDefault();
																setIndexSelectedVariant(index);
															}
														}}
														tabIndex={0}
														role='button'
													>
														<ImageCustom
															src={variant.variationImage || EmptyImage}
															className='rounded-full'
															layout='fill'
															priority
														/>
														{listVariant?.length > 3 && index === 2 ? (
															<div className='absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-full bg-[#0E0E10]/[.6] text-white'>
																+{listVariant?.length - 3}
															</div>
														) : null}
													</div>
												)
											);
										})}
									</div>
								) : null
							}
						</div>
						<div
							className='absolute bottom-3px right-3px cursor-pointer'
							onClick={(e: any) => {
								e.preventDefault();
								// setIsLike(!isLike);
								// onLike(!isLike);
								isChangeStyleHeart && setIsLike(!isLike);
								isChangeStyleHeart ? onLike(!isLike) : handleLike && handleLike(!isLike);
							}}
							tabIndex={0}
							onKeyPress={() => {}}
							role='button'
						>
							<ImageCustom
								src={isLike ? '/static/svg/heart-red.svg' : '/static/svg/heart.svg'}
								width={isMobile ? 20 : 24}
								height={isMobile ? 20 : 24}
								className='!bottom-0 !right-0'
								priority
							/>
						</div>
					</div>
					<div className={`${isMobile ? 'px-6px' : 'px-10px'}`}>
						{type === (TYPE_LAYOUT_CARD.TECHNICAL || TYPE_LAYOUT_CARD.DEFAULT) ? (
							<span
								className={`mt-5px text-ellipsis break-words line-clamp-2 ${
									isMobile ? 'text-12' : ''
								}`}
								title={title}
							>
								{title}
							</span>
						) : null}
						<div
							className={`flex ${
								type === TYPE_LAYOUT_CARD.CLOTHES ? 'flex-row items-start' : 'flex-col'
							}`}
						>
							<div
								className={`mt-5px h-full font-sfpro_bold ${isMobile ? '' : 'text-20'} text-333333`}
							>
								{numberWithCommas(price || 0, '.')} <sup>đ</sup>
							</div>
							{priceDash ? (
								<>
									<div
										className={`${isMobile ? 'text-12' : 'text-16'} ${
											type === TYPE_LAYOUT_CARD.CLOTHES ? 'ml-4px' : ''
										} flex h-full`}
									>
										<div className='text-666666 line-through'>
											{numberWithCommas(priceDash || 0, '.')}
										</div>{' '}
										{percentDiscount ? (
											<div className={`${isMobile ? 'text-12' : ''} ml-1 text-[#009908]`}>
												-{Math.round(Math.abs(percentDiscount))}%
											</div>
										) : null}
									</div>
								</>
							) : null}
						</div>
						{type !== (TYPE_LAYOUT_CARD.TECHNICAL || TYPE_LAYOUT_CARD.DEFAULT) ? (
							<span
								className={`${
									isMobile ? 'text-12' : 'text-16'
								} text-ellipsis text-333333 line-clamp-1`}
							>
								{type === TYPE_LAYOUT_CARD.CLOTHES ? (
									<span title={brandName + ' - ' + title}>
										<span className='uppercase'>{`${brandName}`}</span> - <span>{`${title}`}</span>
									</span>
								) : (
									`${title}`
								)}
							</span>
						) : null}
						{type === TYPE_LAYOUT_CARD.GROCERIES ? (
							<div
								className={`flex items-center font-sfpro_semiBold text-[#126BFB] ${
									isMobile ? 'text-12' : 'text-16'
								}`}
							>
								<span className='mr-3px' title={title}>
									{title}
								</span>
								<ImageCustom
									width={16}
									height={16}
									src='/static/svg/chevron-down-00ADA.svg'
									priority
								/>
							</div>
						) : null}
						<div className={`flex flex-wrap justify-between ${isMobile ? 'my-[9px]' : 'mt-3'}`}>
							{rating?.isShow && (
								<>
									{rating ? (
										<div className='flex items-center'>
											{rating.rate ? (
												<>
													<ImageCustom
														src='/static/svg/star-product.svg'
														width={isMobile ? 13 : 20}
														height={isMobile ? 13 : 20}
														priority
													/>
													<span
														className={`${isMobile ? 'text-12' : ''}`}
													>{`${rating.rate} (${rating.total})`}</span>
												</>
											) : (
												<>
													<ImageCustom
														src='/static/svg/star_nobg.svg'
														width={isMobile ? 13 : 20}
														height={isMobile ? 13 : 20}
														priority
													/>
													<span className={`${isMobile ? 'text-10' : ''}`}>Chưa đánh giá</span>
												</>
											)}
										</div>
									) : (
										<div className='flex items-center'>
											<ImageCustom
												src='/static/svg/star_nobg.svg'
												width={isMobile ? 13 : 20}
												height={isMobile ? 13 : 20}
												priority
											/>
											<span className={`${isMobile ? 'text-10' : ''}`}>Chưa đánh giá</span>
										</div>
									)}
								</>
							)}
							{isGuarantee && (
								<div className='flex items-center bg-[#009ADA]/[.08] px-[3px] py-[1px]'>
									<ImageCustom
										src={'/static/svg/iconLogoYellow.svg'}
										alt=''
										width={isMobile ? 14 : 20}
										height={isMobile ? 14 : 20}
										priority
									/>
									<span className={`ml-2px text-[#126BFB] ${isMobile ? 'text-12' : ''}`}>
										Đảm bảo
									</span>
								</div>
							)}
						</div>
						{type === TYPE_LAYOUT_CARD.GROCERIES ? (
							inCart ? (
								<div className='mx-auto flex w-[143px]'>
									<div
										className='flex w-[45px] cursor-pointer items-center justify-center rounded-l-3px bg-[#126BFB] py-2'
										role='button'
										onClick={(e) => {
											e.preventDefault();
											handleChangeQuantity(TYPE_CHANGE.DEINCREASE);
											deBounceUpdateOnClickQuantity(quantity - 1);
										}}
										onKeyPress={(e) => {
											e.preventDefault();
											handleChangeQuantity(TYPE_CHANGE.DEINCREASE);
										}}
										tabIndex={0}
									>
										<ImageCustom src='/static/svg/minusWhite.svg' width={16} height={16} priority />
									</div>
									<div className='flex grow items-center justify-center border-y border-[#f1f1f1] py-2'>
										{quantity}
									</div>
									<div
										className='flex w-[45px] cursor-pointer items-center justify-center rounded-r-3px bg-[#126BFB] py-2'
										role='button'
										onClick={(e) => {
											e.preventDefault();
											handleChangeQuantity(TYPE_CHANGE.INCREASE);
											deBounceUpdateOnClickQuantity(quantity + 1);
										}}
										onKeyPress={(e) => {
											e.preventDefault();
											handleChangeQuantity(TYPE_CHANGE.INCREASE);
										}}
										tabIndex={0}
									>
										<ImageCustom src='/static/svg/plusWhite.svg' width={16} height={16} priority />
									</div>
								</div>
							) : (
								<div
									className={`mx-auto flex cursor-pointer items-center justify-center rounded-3px border border-[#E0E0E0] py-2 ${
										isMobile ? 'mt-10px w-[143px]' : 'mt-3 w-[143px]'
									}`}
									onClick={(e) => {
										e.preventDefault();
										setInCart(true);
										handleAddCard && handleAddCard();
									}}
									role='button'
									onKeyPress={() => {}}
									tabIndex={0}
								>
									<span className='mr-6px text-333333'>Thêm vào giỏ</span>
									<ImageCustom src='/static/svg/plus.svg' width={16} height={16} priority />
								</div>
							)
						) : null}
						{titlePomotion ? (
							<span
								className={classNames([
									`text-ellipsis line-clamp-1 text-[#D1664A]`,
									isMobile ? 'text-12' : 'text-16',
									type === TYPE_LAYOUT_CARD.GROCERIES ? 'mt-3' : '',
								])}
							>
								{timeDeal ? `Deal sốc bắt đầu sau: ${timeDeal}` : titlePomotion}
							</span>
						) : null}
						{timeFreeShip ? (
							<span
								className={`${
									isMobile ? 'text-12' : 'text-16'
								} text-ellipsis text-333333 line-clamp-1`}
							>
								Giao miễn phí trong 4 giờ
							</span>
						) : null}
						{gift && <span className={`${isMobile ? 'text-12' : ''}`}>Quà 580.000</span>}
						{type === TYPE_LAYOUT_CARD.TECHNICAL && propertyFeature?.length && (
							<div className='flex flex-wrap'>
								{propertyFeature.map((property, index) => (
									<span
										className={`mr-2 mt-2 inline-block border border-[#F1F1F1] py-2px px-1 text-666666 ${
											isMobile ? 'text-12' : ''
										}`}
										key={index}
									>
										{property}
									</span>
								))}
							</div>
						)}
					</div>
				</div>
			</a>
		</Link>
	);
};
export default ProductCardLayoutWishList;
