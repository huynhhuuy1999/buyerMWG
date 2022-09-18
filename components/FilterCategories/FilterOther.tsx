import { TYPE_SEARCH } from 'enums';
import { IPropertyOrther, IPropertyOrther as IPropertyOther } from 'models';
// import { splitArrayWithMaxLine } from 'utils/formatter';
import { IItemFilter } from 'modules';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';

import { IBottomFilter } from '../FilterSearch';
import FilterBoxCard from './FilterBoxCard';

export interface IFilterOther {
	className?: string;
	handleCancel?: (propertyId?: Array<string>) => void;
	loading?: boolean;
	onClickOutside?: React.MouseEventHandler;
	listData?: Array<IPropertyOther>;
	onSelect?: (value: { id?: number | string; label?: string }, typeSearch: number) => void;
	handleSearch?: () => void;
	count?: number;
	defaultSelected?: Array<IItemFilter>;
	limitBox: number;
}

const BottomFilter = dynamic(() => import('./BottomFilter'), {
	ssr: false,
}) as React.FC<IBottomFilter>;

export const FilterOther: React.FC<IFilterOther> = ({
	className = '',
	handleCancel,
	loading,
	onClickOutside,
	listData = [],
	count,
	handleSearch,
	onSelect,
	defaultSelected,
	limitBox,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [listSelected, setListSelected] = useState<Array<IItemFilter>>([]);
	// const [listSplitCategory, setListSplitCategory] = useState<Array<IOtherFilter[]>>([]);

	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (ref.current && !ref.current.contains(event.target)) {
				onClickOutside && onClickOutside(event);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [ref, onClickOutside]);

	useEffect(() => {
		if (defaultSelected) setListSelected(defaultSelected);
	}, [defaultSelected]);

	const getListPropertyId = () => {
		return listData.map((item) => `${item.id}`);
	};

	return (
		<div
			className={`border-E0E0E0 absolute top-16 z-10 w-688px border bg-white ${className}`}
			ref={ref}
		>
			<div className='max-h-[250px] overflow-y-auto'>
				{listData.map((item: IPropertyOrther, index: number) => {
					return (
						<React.Fragment key={index}>
							<FilterBoxCard
								data={item}
								limitBox={limitBox}
								onSelect={(val) => onSelect?.(val, TYPE_SEARCH.ORTHER)}
								listSelected={listSelected}
							/>
						</React.Fragment>
					);
				})}
			</div>

			<BottomFilter
				handleCancel={() => handleCancel && handleCancel(getListPropertyId())}
				handleSearch={handleSearch}
				loading={loading}
				count={count}
			/>
		</div>
	);
};

export default FilterOther;
