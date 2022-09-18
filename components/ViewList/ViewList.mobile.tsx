// import classNames from 'classnames';
// import { InterPagingViewList } from 'components';
import { NextPage } from 'next';
import React, { ReactNode, useCallback, useRef, useState } from 'react';

import { EmptyProduct } from '@/components/common';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

import { Spin } from '..';

const defaultParams = {
	page: 0,
	pageSize: 10,
	totalObject: 0,
};
interface PropsProductsWishList {
	loading: boolean;
	data: Array<any>;
	page: number;
	setPage: (page: number) => void;
	className?: string;
	setItem: (product: any) => ReactNode;
	setLoadingCard: () => ReactNode;
	isOverFlow?: boolean;
	pageIndex: number;
}

const ViewListMobile: NextPage<PropsProductsWishList> = ({
	data = [],
	page = defaultParams.page,
	loading,
	setItem,
	setLoadingCard,
	className = '',
	pageIndex,
	setPage,
}) => {
	// const [_, setFilter] = useState((): InterPagingViewList => {
	// 	return {
	// 		pageSize: pageSize,
	// 		page: listProductLiked?.page,
	// 		totalObject: listProductLiked?.totalObject,
	// 	};
	// });
	const [screenWidth, setScreenWidth] = useState(0);

	// useEffect(() => {
	// 	setFilter((state: InterPagingViewList) => ({
	// 		...state,
	// 		pageSize,
	// 		page,
	// 		totalObject: listProductLiked?.totalObject,
	// 	}));
	// }, [pageSize, page, listProductLiked]);

	useIsomorphicLayoutEffect(() => {
		const getNumberOfCard = () => {
			setScreenWidth(
				document?.body?.clientWidth < 1050 ? Math.floor(document?.body?.clientWidth / 80) : 7,
			);
		};
		screenWidth && window?.addEventListener('resize', getNumberOfCard);
	}, []);

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

	return (
		<div className='mt-[60px]'>
			<div className={`grid grid-cols-2 bg-white`}>
				{Array.isArray(data) && data.length
					? data.map((item: any, index: number) => {
							return (
								<React.Fragment key={index}>
									{Array.isArray(item.data) ? (
										item.data.length ? (
											item.data.map((product: any, indexProduct: number) => {
												// eslint-disable-next-line react-hooks/rules-of-hooks
												return (
													<div ref={lastElementRef} key={indexProduct} className='p-[5px]'>
														{setItem && setItem(product)}
													</div>
												);
											})
										) : (
											<div className={`col-span-2`}>
												<EmptyProduct
													type='category'
													title='Không có sản phẩm phù hợp với bộ lọc'
												/>
											</div>
										)
									) : (
										setLoadingCard && setLoadingCard()
									)}
								</React.Fragment>
							);
					  })
					: setLoadingCard && setLoadingCard()}
			</div>
			{loading ? (
				<div className='flex justify-center'>
					<Spin size={40} />
				</div>
			) : null}
		</div>
	);
};
export default ViewListMobile;
