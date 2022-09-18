import {
	EmptyProduct,
	PopupNotification,
	ProductCardLayoutWishList,
	Skeleton,
	Spin,
} from 'components';
import { TYPE_ADD_CART, TYPE_LAYOUT_CARD } from 'enums';
import { IDetailVariationProduct, IProductSearch } from 'models';
import moment from 'moment';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getDetailProductVariation, postProductLike } from 'services';
import { getCookie } from 'utils/methods';

import { CART_ID } from '@/constants/index';
import Portal from '@/HOCs/portal';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import getSelectorVariants from '@/hooks/useSelectorVariants';
import { IDrawerProduct } from '@/modules/drawerProduct/drawer-product.mobile';

const DrawerProduct = dynamic(
	() => import('@/modules/drawerProduct/drawer-product.mobile'),
) as React.FC<IDrawerProduct>;

interface IProductMobile {
	data?: any;
	loading: boolean;
	setPage: (page: number) => void;
	// setPage: any;
	products: Array<any>;
	pageIndex: number;
	removeLike: Function;
}

const ProductMobile: NextPage<IProductMobile> = ({
	data,
	loading,
	setPage,
	pageIndex,
	products,
	removeLike,
}) => {
	const [isActiveNotification, setIsActiveNotification] = useState<boolean>(false);

	const [screenWidth, setScreenWidth] = useState(0);

	const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false);

	const [detailVariation, setDetailVariation] = useState<IDetailVariationProduct[]>([]);

	const [productSelect, setProductSelect] = useState<any>({});

	useEffect(() => {
		setScreenWidth(
			document?.body?.clientWidth < 1050 ? Math.floor(document?.body?.clientWidth / 80) : 7,
		);
	}, []);

	const Skeletons = React.memo(() => (
		<>
			{[...new Array(8)].map((_, index) => {
				return (
					<div key={index} className='mb-2'>
						<Skeleton.Skeleton
							cardType={Skeleton.CardType.square}
							type='card'
							width={'99%'}
							height={330}
							isDescription
						/>
					</div>
				);
			})}
		</>
	));

	const setPath = (value: IProductSearch) => {
		return `/${
			value.categoryUrlSlug ? value.categoryUrlSlug + '/' + value?.urlSlug : 'coming-soon'
		}`;
	};
	useIsomorphicLayoutEffect(() => {
		function getNumberOfCard() {
			setScreenWidth(
				document?.body?.clientWidth < 1050 ? Math.floor(document?.body?.clientWidth / 80) : 7,
			);
		}
		screenWidth && window?.addEventListener('resize', getNumberOfCard);
	});

	const observer: any = useRef();

	const lastElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (
					entries[0].isIntersecting &&
					data.length &&
					data[data.length - 1].totalPage - 1 >= pageIndex
				) {
					setPage && setPage(pageIndex + 1);
				}
			});

			if (node) observer.current.observe(node);
		},
		[loading, data],
	);

	const handleUpdateQuantityProduct = async (item: {
		merchantId: number;
		productId: number;
		variationId: number;
		sku: string;
		quantity: number;
		categoryId: number;
		type: number;
		cartId: string;
	}): Promise<any> => {};

	const handleLike = async (
		data: { productId: number; merchantId: number },
		isLike: boolean,
		preIsLike: boolean,
	) => {
		// if (isLike !== preIsLike)
		const productId: number = data.productId;
		const resp = await postProductLike(data);

		if (!resp.isError) {
			removeLike?.(productId);
			setIsActiveNotification(true);
		}
	};

	const handleAddCard = async (
		idVariant: number,
		merchantId: number,
		productId: number,
		brandId: number,
	) => {};

	const handleShowVariant = async (product: IProductSearch) => {
		setProductSelect(product);

		setIsShowDrawer(true);
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
		<div className='mt-[80px]'>
			<div className={`grid grid-cols-2 bg-white`}>
				<React.Fragment>
					{products ? (
						products?.length ? (
							products.map((product: IProductSearch, indexProduct: number) => {
								const values = getSelectorVariants({
									product: product as any,
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
								let timeDealShock = '';
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
									if (promotionDealSock && moment(promotionDealSock.startDate).isAfter(moment()))
										timeDealShock = promotionDealSock.startDate || '';
								}

								const titlePromotion = product?.promotions?.length
									? product?.promotions[0]?.titlePromotion?.[0]
									: '';

								const percentDiscount = product?.promotions?.length
									? product?.promotions[0]?.discountValue
									: 0;

								return (
									<div key={indexProduct} ref={lastElementRef}>
										<ProductCardLayoutWishList
											price={
												indexChooseVariation === -1
													? values?.pricePromote || values?.price
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
												indexChooseVariation === -1 ? percentDiscount : infoVariation?.discountValue
											}
											type={
												product?.layoutType === TYPE_LAYOUT_CARD.GROCERIES
													? TYPE_LAYOUT_CARD.DEFAULT
													: product?.layoutType
											}
											title={product?.title}
											rating={{ rate: 3, total: 30, isShow: true }}
											propertyFeature={product?.propertyFeatured}
											brandName={product?.brandName}
											listVariant={[...product?.variations]}
											image={product?.variations?.[0]?.variationImage}
											titlePomotion={
												indexChooseVariation === -1
													? titlePromotion
													: infoVariation?.titlePromotion?.[0]
											}
											path={setPath(product)}
											isMobile={true}
											variations={product?.variations}
											variationConfig={product?.variationConfigs?.configs}
											isHeart={product?.isLike}
											isChangeStyleHeart={false}
											handleLike={(isLike) => {
												handleLike(
													{ productId: product.id, merchantId: product.merchantId },
													isLike,
													!!product.isLike,
												);
											}}
											handleUpdateQuantityCart={(quantity) =>
												handleUpdateQuantityProduct({
													merchantId: product.merchantId,
													productId: product.id,
													variationId: product.variations?.[0].variationId,
													categoryId: product.categoryId,
													type: TYPE_ADD_CART.UPDATE,
													quantity: quantity,
													sku: product.variations?.[0].sku,
													cartId: getCookie(CART_ID) || '',
												})
											}
											handleAddCard={() =>
												handleAddCard(
													product.variations?.[0].variationId,
													product.merchantId,
													product.id,
													product?.brandId,
												)
											}
											heightImage={177}
											widthImage={177}
											onShowMoreVariation={() => handleShowVariant(product)}
											productId={product.id}
											onChooseVariant={onChooseVariant}
											timeDealSock={timeDealShock}

											// listVariantProduct={listVariantProduct}
										/>
									</div>
								);
							})
						) : (
							<div className={`col-span-2`}>
								<EmptyProduct type='category' title='Không có sản phẩm phù hợp với bộ lọc' />
							</div>
						)
					) : (
						<Skeletons />
					)}
				</React.Fragment>
			</div>
			{loading ? (
				<div className='flex justify-center'>
					<Spin size={40} />
				</div>
			) : null}

			<DrawerProduct
				isShowDrawer={isShowDrawer}
				setIsShowDrawer={(value) => setIsShowDrawer(value)}
				product={productSelect}
			/>
			{isActiveNotification && (
				<Portal>
					<PopupNotification
						message={'Đã bỏ thích thành công !'}
						status={'SUCCESS'}
						isOpen={isActiveNotification}
						onClose={() => setIsActiveNotification(false)}
					/>
				</Portal>
			)}
		</div>
	);
};

export default ProductMobile;
