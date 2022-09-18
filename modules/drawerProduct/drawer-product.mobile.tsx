import classNames from 'classnames';
import { Drawer, ImageCustom, ModalListProduct, Spin } from 'components';
import { TYPE_PROPERTY } from 'enums';
import cookies from 'js-cookie';
import { IProductSearch } from 'models';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { CardVariantProduct } from '@/components/Card';
import { CART_ID } from '@/constants/index';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { IProductVariation, ProductVariation } from '@/models/product';
import { addItemCart, updateItemsCart } from '@/services/cart';
import { getProductVariation } from '@/services/product';
import { cartActions, cartSelector } from '@/store/reducers/cartSlice';

export interface IDrawerProduct {
	isShowDrawer: boolean;
	setIsShowDrawer: (value: boolean) => void;
	product?: IProductSearch;
	getInfoVariantLastestAddCard?: (value: ProductVariation) => void;
}

const DrawerProduct: React.FC<IDrawerProduct> = ({
	isShowDrawer,
	setIsShowDrawer,
	product,
	getInfoVariantLastestAddCard,
}) => {
	const router = useRouter();
	const COOKIE_CART_ID = cookies.get(CART_ID);
	const itemInCart = useAppSelector(cartSelector);
	const dispatch = useAppDispatch();

	const [checkHeight, setCheckHeight] = useState<number>(0);
	const [loadingListVariant, setLoadingListVariant] = useState<boolean>(false);
	const [listVariantProduct, setListVariantProduct] = useState<IProductVariation>({});
	const [isShowModal, setIsShowModal] = useState<boolean>(false);
	const [statusShowModalError, setStatusShowModalError] = useState<{
		status: boolean;
		message: string;
	}>({ status: false, message: '' });
	const [loadingAddCart, setLoadingAddCart] = useState<boolean>(false);
	const [variationIdAddCart, setVariationIdAddCart] = useState<number>(0);

	useEffect(() => {
		setCheckHeight(window.innerHeight);
	}, []);

	useEffect(() => {
		if (isShowDrawer && product) {
			handleShowVariant(product);
		}
	}, [isShowDrawer, product]);

	useEffect(() => {
		if (statusShowModalError?.status) {
			const timeOut = setTimeout(() => {
				setStatusShowModalError((value) => ({ ...value, message: '', status: false }));
			}, 1000);
			return () => clearTimeout(timeOut);
		}
	}, [statusShowModalError?.status]);

	const handleAddCard = async (
		idVariant: number,
		merchantId: number,
		productId: number,
		brandId: number,
	) => {
		if (idVariant) {
			try {
				setLoadingAddCart(true);
				setVariationIdAddCart(idVariant);
				const resp = await addItemCart(COOKIE_CART_ID, '00000000-0000-0000-0000-000000000000', {
					merchantId: merchantId,
					itemPromotionIds: [],
					productId: productId,
					productQuantity: 1,
					variationId: idVariant,
					brandId,
				});
				if (resp.data) {
					const variationAdd = listVariantProduct.variations?.find(
						(variant) => variant.variationId === idVariant,
					);
					if (variationAdd) getInfoVariantLastestAddCard?.({ ...variationAdd, productId });
					setLoadingAddCart(false);

					dispatch(cartActions.increment(resp.data?.itemTotal));
					dispatch(cartActions.pushItems({ quantity: 1, variantId: idVariant }));
				}
			} catch (error) {
				setLoadingAddCart(false);
				const { response }: any = error;
				if (response?.data?.message === 'Sản phẩm hết hàng') {
					setIsShowModal(true);
				}
			}
		}
		return false;
	};

	const handleUpdateQuantityProduct = async (item: {
		merchantId: number;
		productId: number;
		variationId: number;
		quantity: number;
		cartId: string;
	}): Promise<any> => {
		try {
			if (item.quantity === 0) {
				setVariationIdAddCart(item.variationId);
				setLoadingAddCart(true);
			}
			const resp = await updateItemsCart(item as any);
			if (resp.data) {
				const copyListItemInCart = [...itemInCart.variationsActice];

				const indexCart = copyListItemInCart.findIndex(
					(itemInCart) => itemInCart.variantId === item.variationId,
				);
				dispatch(cartActions.pushItems({ quantity: item?.quantity, variantId: item?.variationId }));

				if (indexCart !== -1) {
					if (item.quantity === 0) {
						setLoadingAddCart(false);

						// xóa 1 sản phẩm trong giỏ hàng
						dispatch(cartActions.decrement());
					}
				}
			}
		} catch (error) {
			setLoadingAddCart(false);
		}
	};

	const handleShowVariant = async (product: IProductSearch) => {
		setIsShowDrawer(true);
		setLoadingListVariant(true);

		try {
			const listVariation = await getProductVariation(product.id);
			setLoadingListVariant(false);
			setListVariantProduct({
				...listVariation.data,
				productTitle: product.title,
				merchantId: product.merchantId,
				categoryId: product.categoryId,
				productType: product.productType,
				brandId: product.brandId,
				categoryUrlSlug: product.categoryUrlSlug,
				urlSlug: product.urlSlug,
			});
		} catch (err) {
			setStatusShowModalError({ status: true, message: String(err) });
			setLoadingListVariant(false);
		}
	};

	const getListColor = useMemo(() => {
		if (
			listVariantProduct.variationConfigs?.configs &&
			listVariantProduct.variationConfigs?.configs.length
		) {
			const getPropertyColor = listVariantProduct.variationConfigs?.configs.filter(
				(item) => item.type === TYPE_PROPERTY.COLOR,
			);
			if (getPropertyColor.length) {
				return getPropertyColor[0]?.propertyValues?.length;
			}
			return 0;
		}
		return 0;
	}, [listVariantProduct?.variationConfigs]);

	const checkParamPath = (infoVariation: ProductVariation) => {
		let param = '?';
		if (infoVariation?.variationId) param += `variationId=${infoVariation?.variationId}&`;
		if (infoVariation?.propertyValueId1)
			param += `propertyValueId1=${infoVariation?.propertyValueId1}&`;
		if (infoVariation?.propertyValueId2)
			param += `propertyValueId2=${infoVariation?.propertyValueId2}&`;
		return param;
	};

	return (
		<>
			<Drawer isOpen={isShowDrawer} setIsOpen={(value) => setIsShowDrawer(value)}>
				<div className='z-[99]'>
					<div className='flex items-start justify-between bg-[#F1F1F1] p-[10px]'>
						<div className='flex flex-col'>
							{loadingListVariant ? null : (
								<>
									<span className='font-sfpro_semiBold text-333333'>
										Xem {getListColor} màu của sản phẩm
									</span>
									<span className='text-666666'>{listVariantProduct?.productTitle}</span>
								</>
							)}
						</div>
						<ImageCustom
							src={'/static/svg/Close.svg'}
							width={30}
							height={30}
							role='button'
							onClick={() => setIsShowDrawer(false)}
						/>
					</div>
					<div
						className={classNames([
							'overflow-y-auto pt-[10px] overflow-x-hidden',
							checkHeight > 670 ? 'max-h-[70vh]' : 'max-h-[65vh]',
						])}
						style={{ paddingBottom: 60 }}
					>
						{loadingListVariant ? (
							<div className='flex justify-center'>
								<Spin size={40} />
							</div>
						) : (
							listVariantProduct?.variations?.length &&
							listVariantProduct?.variations.map((variant, index) => {
								let info: any = {};
								const infoPromotionIndex = listVariantProduct?.promotions?.length
									? listVariantProduct.promotions.findIndex(
											(item) => item?.variationId === variant?.variationId,
									  )
									: -1;
								if (infoPromotionIndex !== -1 && listVariantProduct?.promotions?.length) {
									if (listVariantProduct?.promotions[infoPromotionIndex]?.promotions?.length) {
										info = listVariantProduct?.promotions[infoPromotionIndex]?.promotions[0];
									}
								}

								const checkInCart: any =
									itemInCart?.variationsActice?.filter(
										(itemInCart) => itemInCart?.variantId === variant?.variationId,
									) || [];

								return (
									<CardVariantProduct
										image={variant?.variationImage}
										key={index}
										percentDiscount={info?.discountValue}
										price={info?.price}
										priceDiscount={info?.pricePromote || variant?.price}
										text={
											variant?.propertyValueName1 +
											` ${variant?.propertyValueName2 ? `- ${variant?.propertyValueName2}` : ''}`
										}
										className='mb-[19px] border-b-[2px] border-b-[#F6F6F6] pb-1'
										handleUpdateQuantityCart={(quantity) => {
											!loadingAddCart &&
												handleUpdateQuantityProduct({
													merchantId: listVariantProduct.merchantId || 0,
													productId: listVariantProduct.id || 0,
													variationId: variant?.variationId,
													quantity: quantity,
													cartId: COOKIE_CART_ID || '',
												});
										}}
										handleAddCard={() => {
											!loadingAddCart &&
												handleAddCard(
													variant?.variationId,
													listVariantProduct.merchantId || 0,
													listVariantProduct.id || 0,
													listVariantProduct.brandId || 0,
												);
										}}
										defaultQuantity={checkInCart?.length ? checkInCart[0]?.quantity : 0}
										isInCart={checkInCart?.length ? true : false}
										loading={variationIdAddCart === variant?.variationId && loadingAddCart}
										onClickImage={() => {
											router.push(
												`/${listVariantProduct?.categoryUrlSlug}/${
													listVariantProduct?.urlSlug
												}${checkParamPath(variant)}`,
											);
										}}
										quantityOrigin={variant?.quantities?.[0]?.quantity}
									/>
								);
							})
						)}
					</div>
				</div>
			</Drawer>

			<ModalListProduct
				isOpen={isShowModal}
				setIsOpen={(value) => setIsShowModal(value)}
				message='Sản phẩm hết hàng'
			/>
			<ModalListProduct
				isOpen={statusShowModalError.status}
				setIsOpen={(value) =>
					setStatusShowModalError({
						status: value,
						message: '',
					})
				}
				message='Lỗi API'
			/>
		</>
	);
};

export default DrawerProduct;
