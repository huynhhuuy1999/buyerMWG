import { InterParamsViewList, PopupNotification, Skeleton, ViewList } from 'components';
import CardMerchant from 'components/Card/CardMerchant';
import { useAppSelector } from 'hooks';
import { FilterCustomer, FilterMerchantFavorite } from 'modules';
import React, { useEffect, useState } from 'react';

import Portal from '@/HOCs/portal';
import { getListMerchantLikeFromUser } from '@/services/customer';
import { listAllCategorySelector } from '@/store/reducers/categorySlide';

const MAX_PAGE_SIZE = 6;

const defaultParams: InterParamsViewList = {
	page: 0,
	pageSize: MAX_PAGE_SIZE,
};

const CustomerWishlistMerchants = () => {
	const categories = useAppSelector(listAllCategorySelector);
	const filter = new FilterMerchantFavorite({ categories });
	const [params, setParams] = useState<Record<string, any>>({
		...defaultParams,
		categoryIds: [],
		brandIds: [],
	});

	const [isActiveNotification, setIsActiveNotification] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);

	const [responseLiked, setResponseLiked] = useState<any>({
		data: [],
		pageSize: defaultParams.pageSize,
		page: defaultParams.page,
		totalObject: 0,
	});

	useEffect(() => {
		if (categories) {
			const newParams = { ...params, categoryIds: categories?.map((t) => t['id']) };
			setParams(newParams);
			fetchDataLiked({ ...newParams, pageSize: defaultParams.pageSize });
		}
	}, [categories]);

	const fetchDataLiked = async (params: InterParamsViewList = defaultParams) => {
		try {
			const resp = await getListMerchantLikeFromUser(params);

			if (!resp.isError) {
				setLoading(false);
				setResponseLiked(resp);
			}
		} catch (err) {
			setLoading(false);
		}
	};

	const handleLike = async (merchantId: number) => {
		console.log('handleLike');
	};

	const handleChangePaging = (callback: any) => {
		setLoading(true);
		callback();
		window.scrollTo(0, 0);
	};

	const propsViewList = {
		setItem: (item: any) => {
			return (
				<CardMerchant
					data={item}
					onClickLike={handleLike}
					onClickDoubleLike={handleLike}
					isChangeLike={false}
				/>
			);
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
								width={255}
								height={353}
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
			{false ?? <FilterCustomer listPropertyFilter={filter} />}

			<ViewList
				className={'grid-cols-3'}
				{...propsViewList}
				loading={loading}
				data={responseLiked.data}
				pageSize={responseLiked.pageSize}
				page={responseLiked.page}
				totalObject={responseLiked.totalObject}
				changePage={(value: InterParamsViewList) => {
					handleChangePaging(() => fetchDataLiked(value));
				}}
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
export default CustomerWishlistMerchants;
