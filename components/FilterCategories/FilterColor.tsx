import { PROPERTY, TYPE_FILTER_PARAM } from 'enums';
import { PropertyValue } from 'models';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { IItemFilter } from '@/modules/filterProperty';

import CheckCard from '../Card/CheckCard';
import { IBottomFilter } from '../FilterSearch';

export interface IFilterColor {
	className?: string;
	onClickOutside?: React.MouseEventHandler;
	onChange?: (value: Array<number>) => void;
	listColor?: Array<PropertyValue>;
	onSelect?: (value: { id?: number | string; label?: string }) => void;
	handleSearch?: () => void;
	count?: number;
	handleCancel?: (propertyId?: Array<string>) => void;
	defaultSelected?: Array<IItemFilter>;
	loading?: boolean;
}

const BottomFilter = dynamic(() => import('./BottomFilter'), {
	ssr: false,
}) as React.FC<IBottomFilter>;

export const FilterColor: React.FC<IFilterColor> = ({
	className,
	onClickOutside,
	listColor = [],
	onSelect,
	handleSearch,
	count,
	handleCancel,
	defaultSelected,
	loading,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [listSelected, setListSelected] = useState<Array<IItemFilter>>([]);

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

	const transformListColor = useCallback(() => {
		if (listColor.length) {
			const posListColor = listColor.findIndex((item) => item.name === PROPERTY.COLOR);
			if (posListColor !== -1) {
				return {
					listColor: listColor[posListColor].propertyValues || [],
					propertyId: listColor[posListColor].id,
					typeProperty: listColor[posListColor].type,
				};
			}

			return { listColor: [] };
		}
		return { listColor: [] };
	}, [listColor]);

	return (
		<div
			className={` absolute z-10 bg-white w-688px border border-E0E0E0 top-16 ${className || ''}`}
			ref={ref}
		>
			<div className='flex flex-wrap py-4 pl-3'>
				{transformListColor().listColor.length
					? transformListColor().listColor.map((item, index) => {
							const pos = listSelected.some((itemSelected) =>
								item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
									? itemSelected.id ===
									  `prop_${transformListColor().propertyId}:[${item.id}#${item.rangeValueType}]`
									: itemSelected.id ===
									  `prop_${transformListColor().propertyId}:[${item.rangeValueId}#${
											item.rangeValueType
									  }]`,
							);
							return (
								<CheckCard
									checked={pos}
									title={item.name}
									// className={`w-122px ${(index + 1) % 5 === 0 ? '!mr-0' : ''}`}
									className={`!mr-[12px] w-[calc(calc(100%_/_5)_-_12px)]`}
									key={index}
									onClick={() =>
										onSelect &&
										onSelect({
											id:
												item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
													? `prop_${transformListColor().propertyId}:[${item.id}#${
															item.rangeValueType
													  }]`
													: `prop_${transformListColor().propertyId}:[${item.rangeValueId}#${
															item.rangeValueType
													  }]`,
											label:
												item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
													? item.name
													: item.rangeValueName,
										})
									}
								>
									<div className='absolute -top-1px left-0 flex h-10 w-full items-center'>
										<div
											className={`mr-6px aspect-square h-[38px] w-10 rounded-3px `}
											style={{ background: `#${item.value}` }}
										/>
										<span className='text-ellipsis text-13 line-clamp-2'>{item.name}</span>
									</div>
								</CheckCard>
							);
					  })
					: ''}
			</div>
			<BottomFilter
				handleCancel={() =>
					handleCancel &&
					handleCancel(
						transformListColor().propertyId ? [`${transformListColor().propertyId}`] : undefined,
					)
				}
				handleSearch={handleSearch}
				loading={loading}
				count={count}
			/>
		</div>
	);
};

export default FilterColor;
