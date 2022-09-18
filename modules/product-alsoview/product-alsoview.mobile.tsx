import classNames from 'classnames';
import { ProductCardLayout } from 'components';
import { EmptyImage } from 'constants/index';
import { CATEGORY_LAYOUT_TYPE, TYPE_LAYOUT_CARD } from 'enums';
import { getSelectorVariants } from 'hooks';
import { IDetailVariationProduct, IProductSearch, ProductViewES } from 'models';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import { IDrawerProduct } from '@/modules/drawerProduct/drawer-product.mobile';
import { getDetailProductVariation, postProductLike } from '@/services/product';

interface IProductAlsoViewProps {
	options?: ProductViewES[];
}

const DrawerProduct = dynamic(
	() => import('@/modules/drawerProduct/drawer-product.mobile'),
) as React.FC<IDrawerProduct>;

const ProductAlsoViewMobile = React.forwardRef(({ options }: IProductAlsoViewProps, ref: any) => {
	const [detailVariation, setDetailVariation] = useState<IDetailVariationProduct[]>([]);
	const [screenWidth, setScreenWidth] = useState(0);
	const [isShowModal, setIsShowModal] = useState<boolean>(false);

	const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false);
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

	screenWidth && window?.addEventListener('resize', getNumberOfCard);

	function getNumberOfCard() {
		setScreenWidth(
			document?.body?.clientWidth < 1050 ? Math.floor(document?.body?.clientWidth / 80) : 7,
		);
	}

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

	const setPath = (value: ProductViewES) => {
		return `/${
			value.categoryUrlSlug ? value.categoryUrlSlug + '/' + value?.urlSlug : 'coming-soon'
		}`;
	};

	return (
		<div className='flex flex-wrap justify-between'>
			{(options || []).map(
				(item: ProductViewES & ProductCardLayout.IProductCardLayout, index: number) => {
					let values = getSelectorVariants({
						product: item,
					});
					let percentDiscount = item?.promotions?.length ? item?.promotions[0].discountValue : 0;
					const indexChooseVariation = detailVariation.findIndex(
						(variation) => variation.productId === item.id,
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

					const titlePromotion: any = item?.promotions?.length
						? item?.promotions[0]?.titlePromotion
						: [];

					const numQuantitySock =
						item?.promotions?.length &&
						item?.promotions?.[0].promotionDealSock &&
						item?.promotions?.[0]?.promotionDealSock?.quantity
							? item?.promotions?.[0]?.promotionDealSock?.quantity
							: 0;
					return (
						<div
							className={classNames([
								'font-sfpro max-w-[50%] flex-[50%] border border-[#F2F2F2]',
								index + 1 / 2 ? 'border-l-0' : 'border-r-0',
								index + 2 / 4 && 'border-b-0',
							])}
							key={index}
							ref={ref}
						>
							<ProductCardLayout.ProductCardLayout
								animation={false}
								heightImage={165}
								// className='mx-auto'
								widthImage={165}
								price={values?.pricePromote || values?.price}
								priceDash={values?.pricePromote && values?.moduleType !== 0 ? values?.price : 0}
								percentDiscount={percentDiscount}
								type={
									item?.layoutType === TYPE_LAYOUT_CARD.GROCERIES
										? TYPE_LAYOUT_CARD.DEFAULT
										: item?.layoutType
								}
								title={item?.title}
								listVariant={[...item?.variations]}
								rating={{
									rate: item.averageRating,
									total: item.totalRating,
									isShow: true,
								}}
								propertyFeature={item?.propertyFeatured}
								brandName={item?.brandName}
								image={
									item?.variations?.length ? item?.variations?.[0]?.variationImage : EmptyImage
								}
								path={setPath(item)}
								isGuarantee={item.merchant?.type === 3}
								variations={item?.variations}
								variationConfig={item?.variationConfigs?.configs}
								isHeart={item?.isLike}
								statusPromotion={values?.status}
								titlePomotion={
									indexChooseVariation === -1 ? titlePromotion : infoVariation?.titlePromotion
								}
								numQuantityDealShock={numQuantitySock}
								onShowMoreVariation={() => handleShowVariant(item as any)}
								productId={item.id}
								onChooseVariant={onChooseVariant}
								timeDealSock={values?.promotionDealSock?.remainDuration}
								priceWillDealsock={values?.promotionDealSock?.pricePromote || 0}
								handleLike={(isLike: boolean) => {
									handleLike(
										{ productId: item.id, merchantId: item.merchantId },
										isLike,
										item.isLike ? true : false,
									);
								}}
								isMobile
								layoutType={CATEGORY_LAYOUT_TYPE.OPTION_TWO}
								infoVariationAddCart={infoVariantLastAddCart}
								moduleTypePromotion={values?.moduleType}
								priceOrigin={item?.price}
							/>
						</div>
					);
				},
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
});

export default ProductAlsoViewMobile;
