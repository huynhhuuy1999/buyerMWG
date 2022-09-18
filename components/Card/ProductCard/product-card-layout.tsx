import classNames from 'classnames';
import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import {
	CATEGORY_LAYOUT_TYPE,
	STATUS_PROMOTION,
	TYPE_DISCOUNT,
	TYPE_LAYOUT_CARD,
	TYPE_PROPERTY,
} from 'enums';
import { useAppSelector } from 'hooks';
import { debounce } from 'lodash';
import { Configs, ProductVariation } from 'models';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { numberWithCommas } from 'utils';

import { isIOSDeviceSelector } from '@/store/reducers/appSlice';

export interface IProductCardLayout {
	layoutType?: number;
	type?: TYPE_LAYOUT_CARD;
	image?: string;
	widthImage?: number | string;
	heightImage?: number | string;
	price?: number;
	priceDash?: number | string;
	priceOrigin?: number;
	brandName?: string;
	percentDiscount?: number;
	title?: string;
	rating?: {
		rate?: number;
		isShow?: boolean;
		total?: number;
	};
	titlePomotion?: string[];
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
	variationConfig?: Configs[];
	isChangeStyleHeart?: boolean;
	animation?: boolean;
	className?: string;
	productId?: number;
	timeDealSock?: number;
	categoryUrlSlug?: string;
	numQuantityDealShock?: number;
	statusPromotion?: number;
	configRemainQuantity?: number;
	priceWillDealsock?: number;
	handleLike?: (isLike: boolean) => void;
	onClick?: () => void;
	onShowMoreVariation?: () => void;
	onChooseVariant?: (productId: number, variantId: number) => void;
	infoVariationAddCart?: ProductVariation;
	hiddenHeart?: boolean;
	quantityStock?: number;
	moduleTypePromotion?: number;
}

export const ProductCardLayout: React.FC<IProductCardLayout> = ({
	type,
	heightImage,
	widthImage,
	price,
	priceDash,
	priceOrigin,
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
	handleLike,
	variationConfig,
	onClick,
	isChangeStyleHeart = true,
	onShowMoreVariation,
	layoutType = CATEGORY_LAYOUT_TYPE.OPTION_TWO,
	animation = true,
	className,
	onChooseVariant,
	productId,
	timeDealSock,
	categoryUrlSlug,
	numQuantityDealShock,
	statusPromotion,
	configRemainQuantity,
	priceWillDealsock,
	infoVariationAddCart,
	hiddenHeart = false,
	quantityStock,
	moduleTypePromotion,
}) => {
	const transformType = type === TYPE_LAYOUT_CARD.GROCERIES ? TYPE_LAYOUT_CARD.DEFAULT : type;
	const [indexSelectedVariant, setIndexSelectedVariant] = useState(-1);

	const checkPropertyColor = useMemo(() => {
		const listPropertyValueId = variationConfig?.filter(
			(config) => config.type === TYPE_PROPERTY.COLOR,
		);
		return listPropertyValueId?.length
			? listPropertyValueId?.map((item) => {
					const a = item.propertyValues.filter((x) => x.propertyValueName || x.value);
					return a;
			  })[0]
			: [];
	}, [variationConfig]);

	const [timeDeal, setTimeDeal] = useState<string>('');

	const [numberRemainDuration, setNumberRemainDuration] = useState<number>(
		(statusPromotion === STATUS_PROMOTION.COMING_SOON && timeDealSock) ||
			(statusPromotion === STATUS_PROMOTION.RUNNING &&
				moduleTypePromotion !== TYPE_DISCOUNT.FLASH_SALE &&
				timeDealSock) ||
			0,
	);

	const [isLike, setIsLike] = useState<boolean>(isHeart || false);

	const [like, setLike] = useState<boolean>(isHeart || false);

	const [flag, setFlag] = useState<number>(0);
	const [isShowRemind, setIsShowRemind] = useState<boolean>(false);

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
		if (
			(timeDealSock && statusPromotion === STATUS_PROMOTION.COMING_SOON) ||
			(timeDealSock &&
				statusPromotion === STATUS_PROMOTION.RUNNING &&
				moduleTypePromotion !== TYPE_DISCOUNT.FLASH_SALE)
		) {
			const stepTime = 1000;
			const interval = setInterval(() => {
				setNumberRemainDuration((numberRemainDuration) => numberRemainDuration - 1);
			}, stepTime);

			return () => clearTimeout(interval);
		}
	}, [timeDealSock]);

	useEffect(() => {
		if (
			(numberRemainDuration && statusPromotion === STATUS_PROMOTION.COMING_SOON) ||
			(numberRemainDuration &&
				statusPromotion === STATUS_PROMOTION.RUNNING &&
				moduleTypePromotion !== TYPE_DISCOUNT.FLASH_SALE)
		) {
			const formatted = moment.utc(numberRemainDuration * 1000).format('HH:mm:ss');
			setTimeDeal(formatted);
		}
	}, [numberRemainDuration]);

	useEffect(() => {
		if (isShowRemind) {
			const time = setTimeout(() => {
				setIsShowRemind(false);
			}, 1000);
			return () => clearTimeout(time);
		}
	}, [isShowRemind]);

	// const handleChangeQuantity = (typeChange: number) => {
	// 	if (typeChange === TYPE_CHANGE.INCREASE) setQuantity(quantity + 1);
	// 	else {
	// 		quantity >= 1 && setQuantity(quantity - 1);
	// 	}
	// };

	// const deBounceUpdateOnClickQuantity = useRef(
	// 	debounce((item) => {
	// 		handleUpdateQuantityCart?.(item);
	// 	}, 200),
	// ).current;

	const handleShowRemind = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsShowRemind(true);
	};

	const isIOSDevice = useAppSelector(isIOSDeviceSelector);

	const router = useRouter();

	const checkParamPath = (infoVariation: ProductVariation) => {
		let param = '?';

		if (infoVariation?.variationId) param += `variationId=${infoVariation.variationId}&`;
		if (infoVariation?.propertyValueId1)
			param += `propertyValueId1=${infoVariation.propertyValueId1}${
				infoVariation.propertyValueId2 ? '&' : ''
			} `;
		if (infoVariation?.propertyValueId2)
			param += `propertyValueId2=${infoVariation.propertyValueId2}`;
		return param;
	};

	return (
		<Link
			href={
				!isMobile && indexSelectedVariant >= 0 && variations?.[indexSelectedVariant]?.variationId
					? decodeURIComponent(
							`${path}${
								infoVariationAddCart && infoVariationAddCart.productId === productId
									? checkParamPath(infoVariationAddCart)
									: checkParamPath(variations?.[indexSelectedVariant])
							}`,
					  ).replaceAll(' ', '')
					: isMobile
					? decodeURIComponent(
							`${path}${
								infoVariationAddCart && infoVariationAddCart.productId === productId
									? checkParamPath(infoVariationAddCart)
									: ''
							}`,
					  ).replaceAll(' ', '')
					: path
			}
			passHref
		>
			<a title={title} aria-disabled>
				<div
					onKeyDown={() => {
						return;
					}}
					tabIndex={0}
					role='button'
					onClick={() => onClick?.()}
					className={classNames(
						'pb-3 overflow-hidden cursor-pointer mx-auto relative',
						isMobile
							? layoutType === CATEGORY_LAYOUT_TYPE.OPTION_ONE
								? 'flex'
								: 'flex flex-col'
							: animation
							? 'hover:shadow-productCard animation-100'
							: '',
					)}
					style={{ width: isMobile ? '100%' : widthImage }}
				>
					<div
						className='relative flex justify-center'
						style={{ textAlign: '-webkit-center' as any }}
					>
						<div
							className={`relative w-full ${!widthImage && !heightImage ? 'h-full' : ''}`}
							style={{ height: heightImage }}
							onMouseOver={(e) => {
								e.preventDefault();
								setIndexSelectedVariant(-1);
							}}
							onFocus={() => {}}
							tabIndex={0}
							role='button'
						>
							<ImageCustom
								width={widthImage || '100%'}
								height={heightImage || '100%'}
								src={
									indexSelectedVariant === -1
										? variations?.[0]?.variationImage || EmptyImage
										: variations?.[indexSelectedVariant]?.variationImage || EmptyImage
								}
								quality={isIOSDevice ? 100 : 75}
								alt=''
								className='object-contain'
							/>
							{!isMobile && checkPropertyColor.length > 1 ? (
								<div className='absolute bottom-[2px] left-[12px] flex'>
									{checkPropertyColor.map((property, index) => {
										const indexVariantColor: any = listVariant?.findIndex(
											(variant) =>
												variant?.propertyValueId1 === property?.propertyValueId ||
												variant?.propertyValueId2 === property?.propertyValueId,
										);

										return indexVariantColor !== -1 ? (
											<Fragment key={index}>
												{index < 3 && (
													<div
														className={classNames([
															`relative overflow-hidden h-full aspect-square rounded-full cursor-pointer border`,
															isMobile ? 'w-10 min-h-[40px]' : 'w-12 min-h-[40px]',
															indexVariantColor === indexSelectedVariant &&
															(index !== 2 || checkPropertyColor.length === 3)
																? 'border-[#FF570E]'
																: 'border-white',
														])}
														onMouseLeave={(e) => {
															e.stopPropagation();
															setIndexSelectedVariant(-1);
														}}
														onMouseOver={(e) => {
															if (index !== 2 || checkPropertyColor.length === 3) {
																e.stopPropagation();
																setIndexSelectedVariant(indexVariantColor);
															}
														}}
														onFocus={(e) => {
															if (index !== 2 || checkPropertyColor.length === 3) {
																e.stopPropagation();
																setIndexSelectedVariant(indexVariantColor);
															}
														}}
														onClick={(e) => {
															if (isMobile) {
																if (index !== 2 || checkPropertyColor.length === 3) {
																	e.preventDefault();
																}
																if (index === 2 && checkPropertyColor.length > 3) {
																	e.preventDefault();
																	onShowMoreVariation?.();
																}
															}
														}}
														onKeyPress={(e) => {}}
														tabIndex={0}
														role='button'
													>
														<div title={title + ' - ' + property?.propertyValueName || ''}>
															<ImageCustom
																src={listVariant?.[indexVariantColor].variationImage || EmptyImage}
																className='rounded-full aspect-square object-cover'
															/>
														</div>
														{checkPropertyColor?.length > 3 && index === 2 ? (
															<a title={title + ' - Khác' || ''}>
																<div className='absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-full bg-[#0E0E10]/[.6] text-white'>
																	+{checkPropertyColor?.length - 2}
																</div>
															</a>
														) : null}
													</div>
												)}
											</Fragment>
										) : null;
									})}
								</div>
							) : null}
						</div>
						{!hiddenHeart ? (
							<div
								className='absolute bottom-3px right-3px cursor-pointer'
								onClick={(e: any) => {
									e.preventDefault();
									isChangeStyleHeart && setIsLike(!isLike);
									isChangeStyleHeart ? onLike(!isLike) : handleLike && handleLike(!isLike);
								}}
								tabIndex={0}
								onKeyPress={() => {}}
								role='button'
							>
								<img
									alt='heart'
									src={isLike ? '/static/svg/heart-red.svg' : '/static/svg/heart.svg'}
									width={isMobile ? 20 : 24}
									height={isMobile ? 20 : 24}
									className='!bottom-0 !right-0'
									loading='lazy'
								/>
							</div>
						) : null}
					</div>
					<div className={`${isMobile ? 'px-6px' : 'px-10px'}`}>
						{transformType === TYPE_LAYOUT_CARD.DEFAULT ||
						transformType === TYPE_LAYOUT_CARD.TECHNICAL ? (
							<span
								className={`mt-5px text-ellipsis break-words line-clamp-2 text-333333 font-sfpro ${
									isMobile ? 'text-12' : ''
								}`}
								title={title}
							>
								{title}
							</span>
						) : null}
						<div
							className={`mt-5px flex flex-wrap ${
								transformType === TYPE_LAYOUT_CARD.CLOTHES ? 'flex-row items-center ' : 'flex-col'
							}`}
						>
							<div className={`h-full font-sfpro_bold ${isMobile ? '' : 'text-20'} text-333333`}>
								{numberWithCommas(
									(statusPromotion !== STATUS_PROMOTION.COMING_SOON ||
									(statusPromotion === STATUS_PROMOTION.COMING_SOON && !numberRemainDuration)
										? price
										: priceDash || price) || 0,
									'.',
								)}{' '}
								<sup>đ</sup>
							</div>

							{(priceDash && statusPromotion !== STATUS_PROMOTION.COMING_SOON) ||
							(priceDash &&
								statusPromotion === STATUS_PROMOTION.COMING_SOON &&
								!numberRemainDuration) ? (
								<>
									<div
										className={`${isMobile ? 'text-12' : 'text-16'} ${
											transformType === TYPE_LAYOUT_CARD.CLOTHES ? 'ml-4px' : ''
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

						{transformType !== TYPE_LAYOUT_CARD.TECHNICAL &&
						transformType !== TYPE_LAYOUT_CARD.DEFAULT ? (
							<span
								className={`${
									isMobile ? 'text-12' : 'text-16'
								} text-ellipsis text-333333 line-clamp-1`}
							>
								{transformType === TYPE_LAYOUT_CARD.CLOTHES ? (
									<span title={brandName + ' - ' + title}>
										<span className='uppercase'>{`${brandName}`}</span> - <span>{`${title}`}</span>
									</span>
								) : (
									`${title}`
								)}
							</span>
						) : null}
						{/* {transformType === TYPE_LAYOUT_CARD.GROCERIES ? (
							<div
								className={`flex items-center font-sfpro_semiBold text-[#126BFB] ${
									isMobile ? 'text-12' : 'text-16'
								}`}
							>
								<span className='mr-3px' title={title}>
									{title}
								</span>
								<ImageCustom width={16} height={16} src='/static/svg/chevron-down-00ADA.svg' />
							</div>
						) : null} */}
						{isMobile && checkPropertyColor.length > 1 ? (
							<div className=' flex'>
								{checkPropertyColor.map((property, index) => {
									const indexVariantColor: any = listVariant?.findIndex(
										(variant) =>
											variant?.propertyValueId1 === property?.propertyValueId ||
											variant?.propertyValueId2 === property?.propertyValueId,
									);

									return indexVariantColor !== -1 ? (
										<div className='flex justify-start items-center' key={index}>
											{index < 3 ? (
												<div
													className={classNames([
														`relative overflow-hidden aspect-square rounded-full cursor-pointer border mr-[2px]`,
														isMobile ? 'w-[16px] min-h-[16px]' : 'w-12 min-h-[40px]',
													])}
													onClick={(e) => {
														if (isMobile) {
															e.preventDefault();
															// setIndexSelectedVariant(indexVariantColor);
															// onChooseVariant?.(
															// 	productId ? productId : 0,
															// 	listVariant?.[indexVariantColor].variationId,
															// );
															onShowMoreVariation?.();
														}
													}}
													onKeyPress={(e) => {}}
													tabIndex={0}
													role='button'
												>
													<div title={title + ' - ' + property?.propertyValueName || ''}>
														<ImageCustom
															src={listVariant?.[indexVariantColor].variationImage || EmptyImage}
															className='rounded-full aspect-square object-cover'
														/>
													</div>
												</div>
											) : index === 3 ? (
												<span
													className='text-11 font-sfpro_semiBold text-333333 ml-[2px]'
													onClick={(e) => {
														e.preventDefault();
														onShowMoreVariation?.();
													}}
													onKeyDown={() => {}}
													role='button'
													tabIndex={0}
												>
													+{checkPropertyColor?.length - 3} màu
												</span>
											) : null}
										</div>
									) : null;
								})}
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
						{/* {type === TYPE_LAYOUT_CARD.GROCERIES ? (
							inCart ? (
								<div className='mx-auto flex w-[143px]'>
									<div
										className='flex w-[45px] cursor-pointer items-center justify-center rounded-l-3px bg-[#126BFB] py-2'
										role='button'
										onClick={(e) => {
											e.preventDefault();
											handleChangeQuantity(TYPE_CHANGE.DECREASE);
											deBounceUpdateOnClickQuantity(quantity - 1);
										}}
										onKeyPress={(e) => {
											e.preventDefault();
											handleChangeQuantity(TYPE_CHANGE.DECREASE);
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
						) : null} */}
						{(timeDeal && statusPromotion === STATUS_PROMOTION.COMING_SOON) ||
						(timeDeal &&
							statusPromotion === STATUS_PROMOTION.RUNNING &&
							moduleTypePromotion !== TYPE_DISCOUNT.FLASH_SALE) ? (
							<div
								className='flex flex-col '
								onClick={(e) => handleShowRemind(e)}
								tabIndex={0}
								onKeyPress={() => {}}
								role='button'
							>
								<span
									className={classNames([
										`text-ellipsis line-clamp-1 text-[#D1664A]`,
										isMobile ? 'text-12' : 'text-16',
									])}
								>
									{`Deal sốc bắt đầu sau:`}
								</span>
								<span
									className={classNames([
										`text-ellipsis line-clamp-1 text-[#D1664A]`,
										isMobile ? 'text-12' : 'text-16',
									])}
								>
									{timeDeal}
								</span>
								{isShowRemind ? (
									<div className='z-50 absolute bottom-[10px] flex justify-between items-center py-[4px] pr-[8px] pl-[4px] rounded-[4px] bg-[#0E0E10]/80'>
										<div className='flex flex-col '>
											<span className='font-sfpro_bold text-12 text-[#FFF]'>
												{numberWithCommas(priceWillDealsock || 0, '.')} <sup>đ</sup>
											</span>
											<span className='text-[#EBEBEB] font-sfpro_bold text-[10px] line-through'>
												{numberWithCommas(priceOrigin || 0, '.')}
												<sup>đ</sup>
											</span>
										</div>
										<span className='text-[#FFC107] text-[11px] font-sfpro_bold uppercase ml-2'>
											Nhắc nhở
										</span>
									</div>
								) : null}
							</div>
						) : null}
						{numQuantityDealShock && statusPromotion === STATUS_PROMOTION.RUNNING ? (
							<span
								className={classNames([
									`text-ellipsis line-clamp-1 text-[#D1664A]`,
									isMobile ? 'text-12' : 'text-16',
									// transformType === TYPE_LAYOUT_CARD.GROCERIES ? 'mt-3' : '',
								])}
							>
								{`${
									Number(configRemainQuantity) >= numQuantityDealShock ? 'Còn ' : ''
								} ${numQuantityDealShock} suất giảm sốc`}
							</span>
						) : null}

						{titlePomotion?.length ? (
							<div className='flex flex-col items-start'>
								{titlePomotion?.map((title, key) => (
									<span
										key={key}
										className={classNames([
											`text-ellipsis line-clamp-1 text-333333`,
											isMobile ? 'text-12' : 'text-16',
											// type === TYPE_LAYOUT_CARD.GROCERIES && !timeDeal && !numQuantityDealShock
											// 	? 'mt-3'
											// 	: '',
										])}
									>
										{title}
									</span>
								))}
							</div>
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
						{transformType === TYPE_LAYOUT_CARD.TECHNICAL && propertyFeature?.length ? (
							<div className='flex flex-wrap'>
								{propertyFeature.map((property, index) => (
									<span
										tabIndex={-1}
										role='button'
										onKeyPress={(e: any) => {
											e.preventDefault();
											router?.push(`/${categoryUrlSlug}?k=${property?.replace(/ /g, '+')}`);
										}}
										onClick={(e: any) => {
											e.preventDefault();
											router?.push(`/${categoryUrlSlug}?k=${property?.replace(/ /g, '+')}`);
										}}
										className={`animation-100 mr-2 mt-2 inline-block cursor-pointer border border-[#F1F1F1] py-2px px-1 text-666666 hover:border-[#F05a94] hover:text-[#F05a94] ${
											isMobile ? 'text-12' : ''
										}`}
										key={index}
									>
										{property}
									</span>
								))}
							</div>
						) : null}
						{quantityStock !== undefined ? (
							!quantityStock ? (
								<span className={`${isMobile ? 'text-12' : ''}`}>Hết hàng</span>
							) : (
								<span className={`${isMobile ? 'text-12' : ''}`}>Còn {quantityStock} sản phẩm</span>
							)
						) : null}
					</div>
				</div>
			</a>
		</Link>
	);
};
