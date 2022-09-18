import classNames from 'classnames';
import { EmptyProduct, ProductCardLayout, Skeleton, Spin } from 'components';
import { CATEGORY_LAYOUT_TYPE, TYPE_LAYOUT_CARD } from 'enums';
import { getSelectorVariants } from 'hooks';
import { IDetailVariationProduct, IProductSearch } from 'models';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getDetailProductVariation, postProductLike } from 'services';

import { IDrawerProduct } from '@/modules/drawerProduct/drawer-product.mobile';

const DrawerProduct = dynamic(
	() => import('@/modules/drawerProduct/drawer-product.mobile'),
) as React.FC<IDrawerProduct>;

interface IProductMobile {
	data?: any;
	loading: boolean;
	setPage: (page: number) => void;
	colLayoutType?: number;
	// setPage: any;
	pageIndex: number;
	className?: string;
}
const HEIGHT_PRODUCT = 177;

const ProductMobile: React.FC<IProductMobile> = ({
	colLayoutType = CATEGORY_LAYOUT_TYPE.OPTION_TWO,
	data,
	loading,
	setPage,
	pageIndex,
	className,
}) => {
	const [screenWidth, setScreenWidth] = useState(0);

	const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false);
	const [detailVariation, setDetailVariation] = useState<IDetailVariationProduct[]>([]);

	const [isShowModal, setIsShowModal] = useState<boolean>(false);
	const [productSelect, setProductSelect] = useState<any>({});
	const [infoVariantLastAddCart, setInfoVariantLastAddCart] = useState<any>({});

	useEffect(() => {
		setScreenWidth(
			document?.body?.clientWidth < 1050 ? Math.floor(document?.body?.clientWidth / 80) : 7,
		);
	}, []);

	useEffect(() => {
		if (isShowModal) {
			const timeOut = setTimeout(() => setIsShowModal(false), 500);
			return () => clearTimeout(timeOut);
		}
	}, [isShowModal]);

	function getNumberOfCard() {
		setScreenWidth(
			document?.body?.clientWidth < 1050 ? Math.floor(document?.body?.clientWidth / 80) : 7,
		);
	}

	const Skeletons = (
		<div className={`grid grid-cols-${colLayoutType}`}>
			{[...new Array(8)].map((_, index) => {
				return (
					<div key={index}>
						<Skeleton.Skeleton
							cardType={Skeleton.CardType.square}
							type={colLayoutType === CATEGORY_LAYOUT_TYPE.OPTION_ONE ? 'cardRow' : 'card'}
							width={'100%'}
							height={HEIGHT_PRODUCT}
							isDescription
							lines={colLayoutType === CATEGORY_LAYOUT_TYPE.OPTION_ONE ? 4 : 2}
							className={classNames(
								'border px-2',
								'py-4',
								index % 2 === 0 ? 'border-r-[#e5e7eb]' : 'border-l-[#fff]',
								index >= colLayoutType ? 'mt-[-1px]' : 'border-t-[#fff]',
							)}
						/>
					</div>
				);
			})}
		</div>
	);

	const setPath = (value: IProductSearch) => {
		return `/${
			value.categoryUrlSlug ? value.categoryUrlSlug + '/' + value?.urlSlug : 'coming-soon'
		}`;
	};

	screenWidth && window?.addEventListener('resize', getNumberOfCard);

	const observer: any = useRef();

	const lastElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					data.length &&
					data[data.length - 1].totalPage >= pageIndex
				) {
					setPage && setPage(pageIndex + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[loading, data],
	);

	const handleLike = async (
		data: { productId: number; merchantId: number },
		isLike: boolean,
		preIsLike: boolean,
	) => {
		// if (isLike !== preIsLike)
		await postProductLike(data);
	};

	const handleShowVariant = async (product: IProductSearch) => {
		setIsShowDrawer(true);
		setProductSelect(product);
	};

	const onChooseVariant = async (productId: number, variationId: number) => {
		const respDetailVariation = await getDetailProductVariation({ productId, variationId });
		const copyDetailVariation = [...detailVariation];
		const indexCheck = copyDetailVariation.findIndex(
			(variation) => variation.productId === respDetailVariation.data.productId,
		);
		if (indexCheck !== -1) copyDetailVariation.splice(indexCheck, 1);
		copyDetailVariation.push(respDetailVariation.data);
		setDetailVariation(copyDetailVariation);
	};

	return (
		<div className={'mt-[80px] ' + className ?? ''}>
			{Array.isArray(data) ? (
				<div className={`grid grid-cols-${colLayoutType} bg-white `}>
					{data?.length
						? data.map((item: any, index: number) => {
								return (
									<React.Fragment key={index}>
										{item['data'] ? (
											item.data?.length ? (
												item.data.map((product: IProductSearch | any, indexProduct: number) => {
													const values = getSelectorVariants({
														product: product,
													});

													const indexChooseVariation = detailVariation.findIndex(
														(variation) => variation.productId === product.id,
													);
													let infoVariation: {
														price?: number;
														pricePromote?: number;
														moduleType?: number;
														discountValue?: number;
														titlePromotion?: string[];
													} = {
														price: 0,
														pricePromote: 0,
														moduleType: 0,
														discountValue: 0,
														titlePromotion: [''],
													};

													if (indexChooseVariation !== -1) {
														const {
															price,
															pricePromote,
															moduleType,
															discountValue,
															titlePromotion,
															promotionDealSock,
														} = detailVariation[indexChooseVariation];
														infoVariation = {
															price,
															pricePromote,
															moduleType,
															discountValue,
															titlePromotion:
																promotionDealSock && promotionDealSock.quantity
																	? [`${promotionDealSock.quantity} suất giảm sốc`]
																	: titlePromotion,
														};
													}

													const titlePromotion = product?.promotions?.length
														? product?.promotions[0]?.titlePromotion
														: [];

													const percentDiscount = product?.promotions?.length
														? product?.promotions[0]?.discountValue
														: 0;

													let numQuantitySock =
														product?.promotions?.length &&
														product?.promotions?.[0].promotionDealSock &&
														product?.promotions?.[0]?.promotionDealSock?.quantity
															? product?.promotions?.[0]?.promotionDealSock?.quantity
															: 0;

													return (
														<div
															key={indexProduct}
															ref={lastElementRef}
															className='border-l border-b pt-2'
														>
															<ProductCardLayout.ProductCardLayout
																layoutType={colLayoutType}
																price={
																	indexChooseVariation === -1
																		? values?.pricePromote || values?.price || product?.price
																		: infoVariation?.pricePromote || infoVariation?.price
																}
																priceDash={
																	indexChooseVariation === -1
																		? values?.pricePromote && values?.moduleType !== 0
																			? values?.price
																			: 0
																		: infoVariation?.pricePromote && infoVariation?.moduleType !== 0
																		? infoVariation.price
																		: 0
																}
																percentDiscount={
																	indexChooseVariation === -1
																		? percentDiscount
																		: infoVariation?.discountValue
																}
																type={
																	product?.layoutType === TYPE_LAYOUT_CARD.GROCERIES
																		? TYPE_LAYOUT_CARD.DEFAULT
																		: product?.layoutType
																}
																title={product?.title}
																rating={{
																	rate: product.averageRating,
																	total: product.totalRating,
																	isShow: true,
																}}
																propertyFeature={product?.propertyFeatured}
																brandName={product?.brandName}
																listVariant={[...product?.variations]}
																image={product?.variations?.[0]?.variationImage}
																titlePomotion={
																	indexChooseVariation === -1
																		? titlePromotion
																		: infoVariation?.titlePromotion
																}
																path={setPath(product)}
																isMobile={true}
																variations={product?.variations}
																variationConfig={product?.variationConfigs?.configs}
																isHeart={product?.isLike}
																handleLike={(isLike: boolean) => {
																	handleLike(
																		{ productId: product.id, merchantId: product.merchantId },
																		isLike,
																		product.isLike ? true : false,
																	);
																}}
																heightImage={HEIGHT_PRODUCT}
																widthImage={HEIGHT_PRODUCT}
																onShowMoreVariation={() => handleShowVariant(product)}
																productId={product.id}
																onChooseVariant={onChooseVariant}
																timeDealSock={values?.promotionDealSock?.remainDuration}
																isGuarantee={product.merchant?.type === 3}
																numQuantityDealShock={numQuantitySock}
																statusPromotion={values?.status}
																priceWillDealsock={values?.promotionDealSock?.pricePromote || 0}
																infoVariationAddCart={infoVariantLastAddCart}
																moduleTypePromotion={values?.moduleType}
																priceOrigin={product?.price}
																// listVariantProduct={listVariantProduct}
															/>
														</div>
													);
												})
											) : (
												<></>
												// <div className={`col-span-${colLayoutType}`}>
												// 	<EmptyProduct
												// 		type='category'
												// 		title='Không có sản phẩm phù hợp với bộ lọc'
												// 	/>
												// </div>
											)
										) : (
											<div className={`col-span-${colLayoutType}`}>
												<EmptyProduct
													type='category'
													title='Không có sản phẩm phù hợp với bộ lọc'
												/>
											</div>
										)}
									</React.Fragment>
								);
						  })
						: null}
				</div>
			) : (
				Skeletons
			)}

			{loading ? (
				<div className='flex justify-center'>
					<Spin size={40} />
				</div>
			) : (
				<div className={'flex justify-center py-[15px]'}>Không có sản phẩm</div>
			)}

			<DrawerProduct
				isShowDrawer={isShowDrawer}
				setIsShowDrawer={(value) => setIsShowDrawer(value)}
				product={productSelect}
				getInfoVariantLastestAddCard={(value: any) => {
					setInfoVariantLastAddCart(value);
				}}
			/>
		</div>
	);
};

export default ProductMobile;
