import classNames from 'classnames';
import { ProductCardLayout } from 'components';
import { EmptyImage } from 'constants/';
import { CATEGORY_LAYOUT_TYPE, TYPE_LAYOUT_CARD } from 'enums';
import { getSelectorVariants } from 'hooks';
import { IDetailVariationProduct, IProductSearch, ProductViewES } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getDetailProductVariation } from 'services';

import { DrawerProduct } from '../drawerProduct';

interface IProductAlsoViewProps {
	options?: ProductViewES[];
	viewMore?: string;
}

const ProductSimilarMobile = React.forwardRef(
	({ options, viewMore }: IProductAlsoViewProps, ref: any) => {
		// const { cartId } = useAppCart();
		const router = useRouter();
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
			// getItemInCart();
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
		const setPath = (value: ProductViewES) => {
			return `/${
				value.categoryUrlSlug ? value.categoryUrlSlug + '/' + value?.urlSlug : 'coming-soon'
			}`;
		};

		const handleShowVariant = async (product: IProductSearch) => {
			setIsShowDrawer(true);
			setProductSelect(product);
		};
		return (
			<>
				<div className='px-2.5 py-4 font-sfpro_semiBold text-16 font-semibold normal-case'>
					Sản phẩm tương tự
				</div>
				<div className='hide-scrollbar flex gap-2 justify-start overflow-x-scroll'>
					{(options || []).map(
						(item: ProductViewES & ProductCardLayout.IProductCardLayout, index: number) => {
							let values = getSelectorVariants({
								product: item,
							});
							let percentDiscount = item?.promotions?.length
								? item?.promotions[0].discountValue
								: 0;
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
										hiddenHeart
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
										numQuantityDealShock={numQuantitySock}
										onShowMoreVariation={() => handleShowVariant(item as any)}
										productId={item.id}
										onChooseVariant={onChooseVariant}
										timeDealSock={values?.promotionDealSock?.remainDuration}
										priceWillDealsock={values?.promotionDealSock?.pricePromote || 0}
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

					{(options || []).length > 5 ? (
						<div
							className='flex aspect-square h-full min-h-[224px] w-full flex-auto items-center justify-center bg-[#E0EBFD] text-center'
							onClick={() =>
								router.push({
									pathname: '/search',
									query: { k: viewMore && decodeURIComponent(viewMore).replaceAll(' ', '+') },
								})
							}
							onKeyPress={() =>
								router.push({
									pathname: '/search',
									query: { k: viewMore && decodeURIComponent(viewMore).replaceAll(' ', '+') },
								})
							}
							tabIndex={0}
							role={'button'}
						>
							<div className='flex h-[150px] w-[150px] items-center'>
								<div className='flex w-full flex-col justify-center'>
									<div className='mx-auto h-8 w-8 rounded-full bg-[#126BFB] p-[2px]'>
										<img src='/static/svg/chevron-right-ffffff.svg' alt='' />
									</div>
									<p className='mt-[14px] text-14 text-[#126BFB]'> Xem thêm &rsaquo;</p>
								</div>
							</div>
						</div>
					) : null}
				</div>
			</>
		);
	},
);

export default ProductSimilarMobile;
