import { Skeleton, ViewListMobile } from 'components';
import { useAppSelector } from 'hooks';
import { FilterCustomerMobile, FilterMerchantFavorite } from 'modules';
import { useEffect, useState } from 'react';

import CardMerchant from '@/components/Card/CardMerchant';
import { useProductSearchInfinite } from '@/hooks/useProductSearchInfinite';
import { listAllCategorySelector } from '@/store/reducers/categorySlide';

const MAX_PAGE_SIZE = 6;
const CustomerWishlistMerchantsMobile = () => {
	const categories = useAppSelector(listAllCategorySelector);
	const [filter, setFilter] = useState(new FilterMerchantFavorite(null));

	useEffect(() => {
		if (categories) setFilter(new FilterMerchantFavorite({ categories }));
	}, [categories]);

	const {
		data: listProductLikedSWR,
		isValidating,
		size,
		setSize,
	} = useProductSearchInfinite(
		'/product/suggestedmerchants',

		{
			isValid: true,
			pageSize: MAX_PAGE_SIZE,
		},
	);

	const propsViewList = {
		setItem: (item: any) => {
			return <CardMerchant data={item} />;
		},
		setLoadingCard: () => {
			return (
				<>
					{[...new Array(MAX_PAGE_SIZE)].map((_, index) => {
						return (
							<Skeleton.Skeleton
								key={index}
								cardType={Skeleton.CardType.square}
								type='card'
								width={'99%'}
								height={330}
								isDescription
							></Skeleton.Skeleton>
						);
					})}
				</>
			);
		},
	};
	return (
		<div>
			<FilterCustomerMobile listPropertyFilter={filter} />

			<ViewListMobile
				page={0}
				{...propsViewList}
				data={[{ data: [] }] || listProductLikedSWR}
				setPage={(page: number) => setSize(page)}
				loading={isValidating}
				pageIndex={size}
			/>
		</div>
	);
};
export default CustomerWishlistMerchantsMobile;
