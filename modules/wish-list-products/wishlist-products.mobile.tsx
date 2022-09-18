import { useAppSelector } from 'hooks';
import { FilterCustomerMobile, FilterProductFavorite, ProductMobileWishlist } from 'modules';
import React, { useEffect, useState } from 'react';

import { useProductSearchInfinite } from '@/hooks/useProductSearchInfinite';
import { listAllCategorySelector } from '@/store/reducers/categorySlide';

const MAX_PAGE_SIZE = 6;

const WishListProductsMobile = () => {
	const categories = useAppSelector(listAllCategorySelector);
	const [filter, setFilter] = useState(new FilterProductFavorite(null));
	const [currentProductsLiked, setCurrentProductLiked] = useState<null | Array<any>>(null);

	useEffect(() => {
		if (categories) setFilter(new FilterProductFavorite({ categories }));
	}, [categories]);

	const {
		data: listProductLikedSWR,
		isValidating,
		size,
		setSize,
	} = useProductSearchInfinite(
		filter ? '/product/liked' : '',

		{
			isValid: true,
			pageSize: MAX_PAGE_SIZE,
		},
	);

	useEffect(() => {
		if (listProductLikedSWR) {
			const newData = (currentProductsLiked || []).concat(
				listProductLikedSWR[listProductLikedSWR.length - 1].data,
			);
			setCurrentProductLiked(newData);
		}
	}, [listProductLikedSWR]);

	const removeProductLike = (productId: number) => {
		const newData = [...(currentProductsLiked || [])];
		const productIdx: number = newData.findIndex((t) => t.id === productId);

		if (productIdx > -1) {
			newData?.splice(productIdx, 1);
			setCurrentProductLiked(newData);
		}
	};

	return (
		<>
			<FilterCustomerMobile listPropertyFilter={filter} />
			<ProductMobileWishlist
				data={listProductLikedSWR}
				products={currentProductsLiked as any}
				setPage={(page: number) => setSize(page)}
				loading={isValidating}
				pageIndex={size}
				removeLike={(productId: number) => removeProductLike(productId)}
			/>
		</>
	);
};

export default WishListProductsMobile;
