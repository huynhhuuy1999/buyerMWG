import classNames from 'classnames';
import { ImageCustom, MessageErrors } from 'components';
import { MODE_RUNNER, PROMOTION_STATUS_SHOW, TYPE_PRODUCT_VARIANT } from 'enums';
import { useAppCart, useAppDispatch } from 'hooks';
import { IProductDetailProps, ProductVariation } from 'models';
import { Configs } from 'models/common';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { productDetailActions } from '@/store/reducers/productDetailSlice';

import { ProductPromotions } from '../product-promotions';
import {
	RenderBlockBuyProduct,
	RenderCountDownPromotion,
	RenderListVariations,
	RenderPriceTypePromotion,
	RenderTagTypePromotion,
} from './components';
import { useFormVariants, useMemoTypeProduct } from './hooks';
import { DataSelectedVariantProps } from './types';
import { handleDataVariation } from './utils';

const ProductVariants: NextPage<IProductDetailProps> = ({ productDetails, mode }) => {
	const dispatch = useAppDispatch();
	const { query } = useRouter();
	const { variationConfigs, variations } = productDetails;
	const { cartId } = useAppCart();
	const [isValid, setIsValid] = useState<boolean>(false);
	const defaultVariantActive = query?.variationId;
	const [dataSelectedProperties, setDataSelectedProperties] = useState<DataSelectedVariantProps>();
	const [isLoadingVariant, setIsLoadingVariant] = useState<boolean>(false);
	const [dataSelectVariants, setDataSelectVariants] = useState<ProductVariation>();

	//get type value product
	const {
		memoryTypeValuesProducts,
		memoryReturnTypeProduct,
		regexProductHasPromotion,
		regexProductHasMultiVariantConfigs,
		valueBinding,
		conditionReturnDataFirst,
		isOutOfStockThisProduct,
	} = useMemoTypeProduct(productDetails, dataSelectVariants);

	const { methods, validVariantForms } = useFormVariants(
		variationConfigs.configs?.length === 2,
		Boolean(variationConfigs?.configs?.length < 1),
	);

	const conditionReturnDataSelected =
		dataSelectVariants?.price?.toLocaleString('it-IT') ??
		memoryTypeValuesProducts?.price?.toLocaleString('it-IT') ??
		memoryTypeValuesProducts?.data?.price?.toLocaleString('it-IT');

	const onSubmit = async (formData: DataSelectedVariantProps) => {
		Object.keys(formData)?.length && setIsValid(!isValid);
	};

	useEffect(() => {
		if (
			!isNaN(Number(defaultVariantActive)) ||
			productDetails?.firstVariationPromotions?.variationId
		) {
			handleDataVariation(
				productDetails.id,
				Number(defaultVariantActive),
				dataSelectVariants,
				setDataSelectVariants,
				setIsLoadingVariant,
			);
			const getPropertiesIds: Partial<ProductVariation | undefined> = productDetails
				?.firstVariationPromotions?.variationId
				? productDetails?.variations?.find(
						(ele) =>
							ele?.variationId ===
							(!isNaN(Number(defaultVariantActive))
								? defaultVariantActive
								: productDetails?.firstVariationPromotions?.variationId),
				  )
				: {};

			const values: Partial<{ propertyValueId1: number; propertyValueId2: number }> = {
				propertyValueId1: Number(getPropertiesIds?.propertyValueId1 ?? query?.propertyValueId1),
				propertyValueId2: Number(getPropertiesIds?.propertyValueId2 ?? query?.propertyValueId2),
			};

			!Number(getPropertiesIds?.propertyValueId2 ?? query?.propertyValueId2) &&
				delete values.propertyValueId2;
			setDataSelectedProperties({
				...dataSelectedProperties,
				...values,
			});
			methods.setValue(
				`propertyValueId1`,
				Number(getPropertiesIds?.propertyValueId1 ?? query?.propertyValueId1),
				{
					shouldValidate: Boolean(getPropertiesIds?.propertyValueId1 ?? query?.propertyValueId1),
				},
			);
			Number(getPropertiesIds?.propertyValueId2 ?? query?.propertyValueId2) &&
				methods.setValue(
					`propertyValueId2`,
					Number(getPropertiesIds?.propertyValueId2 ?? query?.propertyValueId2),
					{
						shouldValidate: Boolean(getPropertiesIds?.propertyValueId2 ?? query?.propertyValueId2),
					},
				);
		}
	}, [defaultVariantActive, dispatch, productDetails?.firstVariationPromotions?.variationId]);

	return (
		<React.Fragment>
			<div className='flex items-center justify-between mb-2'>
				<div className='mt-2 flex flex-col justify-start'>
					<span className='font-sfpro_bold text-24 font-extrabold leading-9 text-black'>
						<RenderPriceTypePromotion
							firstData={conditionReturnDataFirst}
							selectedData={conditionReturnDataSelected}
							promotionType={memoryReturnTypeProduct}
							mode={mode}
							status={memoryTypeValuesProducts?.data?.status}
							dataSource={memoryTypeValuesProducts}
						/>

						{productDetails?.price > 0 ? <sup>đ</sup> : null}
					</span>
					{(memoryTypeValuesProducts.data?.discountValue &&
						memoryTypeValuesProducts?.data?.status === PROMOTION_STATUS_SHOW.RUNNING) ||
					mode === MODE_RUNNER.PREVIEW_PROMOTION ? (
						<div className='flex items-center'>
							<span className='px-1 font-medium text-[#727272] line-through'>
								{mode === MODE_RUNNER.PREVIEW_PROMOTION
									? memoryTypeValuesProducts?.price?.toLocaleString('it-IT')
									: memoryTypeValuesProducts?.data?.price?.toLocaleString('it-IT')}
							</span>
							<RenderTagTypePromotion
								discountValue={memoryTypeValuesProducts?.data?.discountValue}
								promotionType={memoryTypeValuesProducts?.data?.moduleType}
								mode={mode}
							/>
						</div>
					) : null}
				</div>

				{productDetails.averageStar !== 0 && productDetails.averageRating !== 0 && (
					<div className='flex items-center'>
						<div className='relative h-4 w-4 px-1'>
							<ImageCustom src='/static/svg/star-product.svg' alt='star' layout='fill' />
						</div>
						<span className='px-1 '>{productDetails.averageStar}</span>
						<div className='cursor-pointer text-[#126BFB]'>
							(Xem {productDetails.averageRating} đánh giá)
						</div>
					</div>
				)}
			</div>

			<RenderCountDownPromotion
				dateForPromotion={{
					startDate: memoryTypeValuesProducts?.data?.startDate,
					endDate: memoryTypeValuesProducts?.data?.endDate,
					remainDuration: memoryTypeValuesProducts?.data?.remainDuration,
				}}
				mode={mode}
				info={memoryTypeValuesProducts?.data}
				isEnabledWithTimeSlot={memoryTypeValuesProducts?.data?.status}
				promotionType={memoryTypeValuesProducts?.data?.moduleType}
			/>

			<span className='text-16 font-normal leading-7 text-[#333333]'>
				<Link href={`/thuong-hieu-goi-y/${productDetails.brandName}`}>
					<a className='inline pr-1 cursor-pointer capitalize font-medium font-sfpro_semiBold text-[#333333] underline'>
						{productDetails.brandName}
					</a>
				</Link>
				<h1 className='inline break-words'>{productDetails.title}</h1>
			</span>

			<form onSubmit={methods.handleSubmit(onSubmit)}>
				{variationConfigs.configs.length !== 0
					? variationConfigs.configs.map((item: Configs, currIndexProperties: number) => {
							return (
								<div key={currIndexProperties}>
									{item.propertyName && (
										<div key={currIndexProperties} className='mt-7'>
											<p className='font-sfpro_bold text-14 font-normal leading-5 text-[#727272]'>
												Chọn {item.propertyName}:{' '}
												<span className='inline pl-1.5 font-sfpro text-[#333333]'>
													{
														item.propertyValues?.find(
															(ele) =>
																+ele.propertyValueId ===
																dataSelectedProperties?.[
																	`propertyValueId${currIndexProperties + 1}` // has two properties when prefix 2 variantion selected
																],
														)?.propertyValueName
													}
												</span>
											</p>
											<div
												className={classNames([
													'flex gap-2 items-center pt-2 flex-wrap animation-100',
													isLoadingVariant ? 'pointer-events-none' : 'cursor-auto',
													item?.type === 2 && 'w-fit',
												])}
											>
												{item.propertyValues?.map((value, i: number) => {
													const variationHasActive = variations?.find(
														(ele) =>
															(ele.propertyValueId2 === +value?.propertyValueId ||
																ele.propertyValueId1 === +value?.propertyValueId) &&
															ele.totalQuantity - ele.quantitySold !== 0,
													) as ProductVariation;

													const variationTargetInfo = variations?.find(
														(ele) =>
															ele.propertyValueId2 === +value?.propertyValueId ||
															ele.propertyValueId1 === +value?.propertyValueId,
													) as ProductVariation;

													// + check out of stock
													// + get variant full with properties id from propertyValues variationConfigs

													//get info variant in selecting
													const targetVariantSelecting = variations?.find((ele, _) => {
														return (
															(ele.propertyValueId2 === +value.propertyValueId &&
																ele.propertyValueId1 ===
																	dataSelectedProperties?.propertyValueId1) ||
															(ele.propertyValueId2 === dataSelectedProperties?.propertyValueId2 &&
																ele.propertyValueId1 === +value.propertyValueId)
														);
													});

													let flagCheckOutOfStock =
														targetVariantSelecting &&
														targetVariantSelecting?.totalQuantity -
															targetVariantSelecting?.quantitySold ===
															0;

													const checkActiveVariant = () => {
														return (
															+value?.propertyValueId ===
																dataSelectedProperties?.[
																	`propertyValueId${currIndexProperties + 1}`
																] && '!border-[#FB6E2E]'
														);
													};

													if (variationHasActive) {
														// for properties custom
														if (!value.propertyValueName) {
															return (
																<button
																	key={i}
																	disabled
																	className={classNames([
																		'border border-[#e0e0e0] rounded-[3px] overflow-hidden',
																		item?.type === TYPE_PRODUCT_VARIANT.color
																			? 'h-[76px] w-[76px]'
																			: 'h-[60px] w-auto',
																	])}
																>
																	<RenderListVariations
																		type={item.type}
																		value={variationTargetInfo}
																		disabled
																	/>
																</button>
															);
														}

														if (!flagCheckOutOfStock) {
															return (
																<button
																	key={i}
																	className={classNames([
																		'hover:border-[#FB6E2E] relative border-2 border-[#e0e0e0] transition-all duration-300 rounded-[3px] overflow-hidden',
																		methods.getFieldState(
																			`propertyValueId${currIndexProperties + 1}`,
																		).error && '!border-red-500',
																		checkActiveVariant(),
																		item?.type === TYPE_PRODUCT_VARIANT.color
																			? 'h-[76px] w-[76px]'
																			: 'h-[60px] w-auto',
																	])}
																	onMouseOver={() =>
																		item.type === TYPE_PRODUCT_VARIANT.color &&
																		dispatch(
																			productDetailActions.onHoverImage(
																				variations?.find(
																					(item) =>
																						item?.propertyValueId1 === +value.propertyValueId,
																				)?.variationId ?? 0,
																			),
																		)
																	}
																	onMouseLeave={() =>
																		item.type === TYPE_PRODUCT_VARIANT.color &&
																		dispatch(
																			productDetailActions.clearImage(
																				Number(
																					dataSelectVariants?.variationId ?? defaultVariantActive,
																				),
																			),
																		)
																	}
																	onFocus={() => {}}
																	onClick={(event) => {
																		event.preventDefault();
																		let valueVariantSelecting;

																		if (Object.values(dataSelectedProperties ?? [])?.length < 1) {
																			!regexProductHasMultiVariantConfigs
																				? (valueVariantSelecting = variations?.find(
																						(ele) =>
																							ele?.[`propertyValueId${currIndexProperties + 1}`] ===
																								+value?.propertyValueId &&
																							ele?.totalQuantity - ele?.quantitySold !== 0,
																				  )?.variationId)
																				: null;
																		} else {
																			valueVariantSelecting = variations?.find(
																				(ele) =>
																					((ele.propertyValueId2 === +value.propertyValueId &&
																						ele.propertyValueId1 ===
																							dataSelectedProperties?.propertyValueId1) ||
																						(ele.propertyValueId2 ===
																							dataSelectedProperties?.propertyValueId2 &&
																							ele.propertyValueId1 === +value.propertyValueId)) &&
																					ele?.totalQuantity - ele?.quantitySold !== 0,
																			)?.variationId;
																		}
																		{
																			valueVariantSelecting
																				? handleDataVariation(
																						productDetails.id,
																						Number(valueVariantSelecting),
																						dataSelectVariants,
																						setDataSelectVariants,
																						setIsLoadingVariant,
																						() => {
																							setDataSelectedProperties({
																								propertyValueId1:
																									valueBinding?.[0]?.propertyValueId1,
																								propertyValueId2:
																									valueBinding?.[0]?.propertyValueId2,
																							});
																							methods.setValue(
																								`propertyValueId1`,
																								valueBinding?.[0]?.propertyValueId1,
																								{ shouldValidate: true },
																							);
																							methods.setValue(
																								`propertyValueId2`,
																								valueBinding?.[0]?.propertyValueId2,
																								{ shouldValidate: true },
																							);
																						},
																				  )
																				: null;
																		}
																		if (
																			[
																				dataSelectedProperties?.propertyValueId1,
																				dataSelectedProperties?.propertyValueId2,
																			]?.includes(+value.propertyValueId)
																		) {
																			const removePropertiesTarget = `propertyValueId${
																				currIndexProperties + 1
																			}`;
																			const cloneValues = dataSelectedProperties;
																			delete cloneValues?.[removePropertiesTarget];
																			setDataSelectedProperties(cloneValues);
																			methods.reset(cloneValues);
																		} else {
																			setDataSelectedProperties({
																				...dataSelectedProperties,
																				[`propertyValueId${currIndexProperties + 1}`]:
																					value.propertyValueId,
																			});
																			methods.setValue(
																				`propertyValueId${currIndexProperties + 1}`,
																				value.propertyValueId,
																				{ shouldValidate: true },
																			);
																		}

																		//
																	}}
																>
																	<RenderListVariations
																		type={item.type}
																		value={variationTargetInfo}
																	/>
																</button>
															);
														}

														return (
															<button
																key={i}
																disabled
																className={classNames([
																	'border relative border-[#e0e0e0] rounded-[3px] overflow-hidden',
																	item?.type === TYPE_PRODUCT_VARIANT.color
																		? 'h-[76px] w-[76px]'
																		: 'h-[60px] w-auto',
																])}
															>
																<RenderListVariations
																	type={item.type}
																	value={variationTargetInfo}
																	disabled
																/>
															</button>
														);
													}
													return (
														<button
															key={i}
															disabled
															className={classNames([
																'border border-[#e0e0e0] rounded-[3px] overflow-hidden',
																item?.type === TYPE_PRODUCT_VARIANT.color
																	? 'h-[76px] w-[76px]'
																	: 'h-[60px] w-auto',
															])}
														>
															<RenderListVariations
																type={item.type}
																value={variationTargetInfo}
																disabled
															/>
														</button>
													);
												})}
											</div>
										</div>
									)}
									<MessageErrors
										name={`propertyValueId${currIndexProperties + 1}`}
										errors={methods.formState.errors}
										messageExtra={`Vui lòng chọn ${item.propertyName}`}
									/>
								</div>
							);
					  })
					: null}

				{!isOutOfStockThisProduct ? (
					<RenderBlockBuyProduct
						mode={mode}
						isValidSubmit={validVariantForms}
						productDetails={productDetails}
						cartId={String(cartId)}
						disableBuy={isOutOfStockThisProduct}
						idVariant={
							Boolean(productDetails?.variationConfigs.configs.length === 0)
								? valueBinding?.[0]?.variationId
								: !dataSelectedProperties?.propertyValueId1
								? !regexProductHasMultiVariantConfigs
									? variations?.find(
											(ele) => ele.propertyValueId1 === dataSelectedProperties?.propertyValueId1,
									  )?.variationId
									: null
								: variations?.find(
										(ele) =>
											ele.propertyValueId1 === dataSelectedProperties?.propertyValueId1 &&
											ele.propertyValueId2 === dataSelectedProperties?.propertyValueId2,
								  )?.variationId
						}
					/>
				) : null}
			</form>

			{/* promotions description */}
			<ProductPromotions
				dataSelectVariantPromotions={
					conditionReturnDataFirst && regexProductHasPromotion
						? productDetails?.firstVariationPromotions
						: dataSelectVariants
				}
			/>
		</React.Fragment>
	);
};

export default ProductVariants;
