import { CircleCard, Skeleton } from 'components';
import { IParamsBrands, Property } from 'models';
import dynamic from 'next/dynamic';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { getBrands } from 'services';

import { IItemFilter } from '@/modules/filterProperty';

import { IBottomFilter } from '../FilterSearch';

interface IFilterBrandFavorite {
	className?: string;
	listBrand?: Array<Property>;
	onClickOutside?: React.MouseEventHandler;
	onSelect?: (value: { id?: string; label?: string }) => void;
	handleSearch?: () => void;
	defaultSelected?: Array<IItemFilter>;
	count?: number;
	handleCancel?: () => void;
	loading?: boolean;
}

const default_params: IParamsBrands = {
	page: 0,
	pageSize: 10,
};
const DEFAULT_STYLE_CARD = {
	WIDTH: 91,
	HEIGHT: 91,
};

const Skeletons = React.memo(() => (
	<Fragment>
		{[...new Array(6)].map((_, index) => (
			<Skeleton.Skeleton
				key={index}
				cardType={Skeleton.CardType.circle}
				type='card'
				width={DEFAULT_STYLE_CARD.WIDTH}
				height={DEFAULT_STYLE_CARD.HEIGHT}
			></Skeleton.Skeleton>
		))}
	</Fragment>
));

const BottomFilter = dynamic(() => import('./BottomFilter'), {
	ssr: false,
}) as React.FC<IBottomFilter>;

export const FilterBrandFavorite: React.FC<IFilterBrandFavorite> = ({
	className,
	onClickOutside,
	onSelect,
	handleSearch,
	defaultSelected,
	count,
	handleCancel,
	loading,
}) => {
	const ref_brand = useRef<HTMLDivElement>(null);
	const [loadingBrand, setLoadingBrand] = useState<boolean>(true);
	const [listBrandSplit, setListBrandSplit] = useState<Array<any[]>>([]);
	const [params, setParams] = useState<IParamsBrands>(default_params);
	const [isFetchData, setIsFetchData] = useState<boolean>(false);
	const listChecked = useMemo(() => defaultSelected || [], [defaultSelected]);

	const handleScrollFetchData = (e: any) => {
		const isBottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
		if (isBottom && !isFetchData) {
			setLoadingBrand(true);
			setParams((state) => ({ ...state, page: params.page + 1 }));
		}
	};
	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (ref_brand.current && !ref_brand.current.contains(event.target)) {
				onClickOutside && onClickOutside(event);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [ref_brand, onClickOutside]);

	useEffect(() => {
		fetchData();
	}, [params]);

	const fetchData = async () => {
		try {
			const resp = await getBrands(params);
			setLoadingBrand(false);
			setListBrandSplit((state) => state.concat(resp.data));
		} catch (error) {
			setLoadingBrand(false);
			setListBrandSplit((state) => ({ ...state }));
			setIsFetchData(true);
		}
	};

	return (
		<div
			ref={ref_brand}
			className={` absolute border bg-white border-light-E0E0E0  max-h-397px z-10 top-16 ${
				className || ''
			}`}
		>
			<div className='scrollbar'>
				<div className='p-2 '>
					<div
						className='grid max-h-[200px] grid-cols-6 gap-x-4 overflow-y-auto'
						onScroll={handleScrollFetchData}
					>
						{Array.isArray(listBrandSplit)
							? listBrandSplit.map((item: any, index: number) => {
									let pos = listChecked.findIndex((itemCheck) => item.id === itemCheck.id);
									return (
										<Fragment key={index}>
											<CircleCard
												image={item.image || '/static/images/category-dress.png'}
												width={DEFAULT_STYLE_CARD.WIDTH}
												height={DEFAULT_STYLE_CARD.HEIGHT}
												checked={pos !== -1 ? true : false}
												styles={{ marginRight: 15 }}
												clickHandle={() =>
													onSelect &&
													onSelect({
														id: item.id,
														label: item.name,
													})
												}
												classImage={`${pos !== -1 ? '!border-primary-009ADA' : ''}`}
												iconCheck
											/>
										</Fragment>
									);
							  })
							: null}
						{loadingBrand ? Skeletons : null}
					</div>
				</div>
				<BottomFilter
					handleCancel={handleCancel}
					handleSearch={handleSearch}
					loading={loading}
					count={count}
				/>
			</div>
		</div>
	);
};

export default FilterBrandFavorite;
