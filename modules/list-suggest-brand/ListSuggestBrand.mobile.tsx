import { CardBrandMobile, Skeleton, Spin } from 'components';
import React, { Fragment, useCallback, useRef } from 'react';

import { CardType } from '@/components/skeleton';
import { IBrandSuggest } from '@/models/brand';

interface IListSuggestBrandMobile {
	data?: any;
	setPage: (page: number) => void;
	pageIndex: number;
	loading: boolean;
}

export const ListSuggestBrandMobile: React.FC<IListSuggestBrandMobile> = ({
	data,
	loading,
	pageIndex,
	setPage,
}) => {
	const observer: any = useRef();

	const Skeletons = () => (
		<>
			{[...new Array(8)].map((_, index) => {
				return (
					<div key={index} className='mb-2'>
						<Skeleton.Skeleton
							cardType={CardType.square}
							type='card'
							width={'99%'}
							height={330}
							isDescription
						/>
					</div>
				);
			})}
		</>
	);

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
		<div className='mt-[80px] pt-2'>
			{Array.isArray(data) ? (
				data.length ? (
					data.map((item: any, index) => {
						return (
							<Fragment key={index}>
								{item.data?.length
									? item.data.map((brand: IBrandSuggest, indexBrand: number) => {
											return (
												<div key={indexBrand} ref={lastElementRef}>
													<CardBrandMobile
														avatar={brand.avatarImage?.filePath}
														isLike={brand.isLiked}
														name={brand.name}
														numLike={brand.totalLike}
														numProduct={brand.totalProduct}
														averageRating={brand.averageRating}
														numRating={brand.totalRating}
														portalLink={brand.portalLink}
														listProduct={brand.products}
													/>
													<div className='h-[10px] w-full bg-[#DADDE1]' />
												</div>
											);
									  })
									: null}
							</Fragment>
						);
					})
				) : null
			) : (
				<Skeletons />
			)}
			{loading ? (
				<div className='flex justify-center'>
					<Spin size={40} />
				</div>
			) : null}
		</div>
	);
};
