import { CheckCard } from 'components';
import { TYPE_FILTER_PARAM } from 'enums';
import { Property } from 'models';
import dynamic from 'next/dynamic';
import React, { FC, useEffect, useRef, useState } from 'react';

import { IItemFilter } from '@/modules/filterProperty';

import { IBottomFilter } from './BottomFilter';

export interface IFilterBox {
	className?: string;
	handleCancel?: (propertyId?: Array<string>) => void;
	loading?: boolean;
	onClickOutside?: React.MouseEventHandler;
	listData?: any;
	onSelect?: (value: { id?: number | string; label?: string }) => void;
	handleSearch?: () => void;
	count?: number;
	defaultSelected?: Array<IItemFilter>;
}

// const MAX_PER_LINE = 4;
// const MAX_LINE = 3;
const BottomFilter = dynamic(() => import('./BottomFilter'), { ssr: false }) as FC<IBottomFilter>;

const FilterBox: React.FC<IFilterBox> = ({
	className,
	handleCancel,
	loading,
	onClickOutside,
	listData,
	count,
	handleSearch,
	onSelect,
	defaultSelected,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [listSelected, setListSelected] = useState<Array<IItemFilter>>([]);
	// const [listSplit, setListSplit] = useState<Array<Property[]>>([]);

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

	// useEffect(() => {
	// 	if (listData.length) {
	// 		let listNew = splitArrayWithMaxLine(listData, MAX_LINE, MAX_PER_LINE);
	// 		setListSplit(listNew);
	// 	}
	// 	if (listData.propertyValues && listData.propertyValues?.length) {
	// 		let listNew = splitArrayWithMaxLine([...listData.propertyValues], MAX_LINE, MAX_PER_LINE);
	// 		setListSplit(listNew);
	// 	}
	// }, [listData]);

	return (
		<div
			className={` absolute z-10 bg-white w-688px border border-E0E0E0 top-16 ${className || ''}`}
			ref={ref}
		>
			<div className='flex max-h-[45vh] flex-wrap overflow-y-auto px-3 py-4 '>
				{/* {listData && listData.propertyValues
					? listSplit.map((item: Array<Property>, index) => {
							return (
								<div className='flex' key={index}>
									{item.map((childrenItem, index2) => {
										let pos = listSelected.findIndex(
											(itemSelected) =>
												itemSelected.id ===
												(childrenItem.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
													? `prop_${listData.id}:[${childrenItem.id}#${childrenItem.rangeValueType}]`
													: `prop_${listData.id}:[${childrenItem.rangeValueId}#${childrenItem.rangeValueType}]`),
										);
										return (
											<CheckCard
												key={index2}
												onClick={() =>
													onSelect &&
													onSelect({
														id:
															childrenItem.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
																? `prop_${listData.id}:[${childrenItem.id}#${childrenItem.rangeValueType}]`
																: `prop_${listData.id}:[${childrenItem.rangeValueId}#${childrenItem.rangeValueType}]`,
														label:
															childrenItem.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
																? childrenItem.name
																: childrenItem.rangeValueName,
													})
												}
												checked={pos !== -1 ? true : false}
												className={`w-[154px] mb-2 ${(index2 + 1) % 4 === 0 ? '!mr-0' : '!mr-2'}`}
											>
												<div className='w-full h-10 px-1 flex items-center justify-center rounded-3px'>
													<span className='text-ellipsis line-clamp-1'>{childrenItem.name}</span>
												</div>
											</CheckCard>
										);
									})}
								</div>
							);
					  })
					: null} */}
				{listData && listData.propertyValues
					? ([...listData?.propertyValues] || [])?.map((item: Property, index) => {
							const pos = listSelected.some((itemSelected) =>
								item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
									? itemSelected.id === `prop_${listData.id}:[${item.id}#${item.rangeValueType}]`
									: itemSelected.id ===
									  `prop_${listData.id}:[${item.rangeValueId}#${item.rangeValueType}]`,
							);
							return (
								<CheckCard
									key={index}
									onClick={() =>
										onSelect &&
										onSelect({
											id:
												item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
													? `prop_${listData.id}:[${item.id}#${item.rangeValueType}]`
													: `prop_${listData.id}:[${item.rangeValueId}#${item.rangeValueType}]`,
											label:
												item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
													? item.name
													: item.rangeValueName,
										})
									}
									checked={pos}
									className={`mb-3 !mr-[16px] w-[calc(calc(100%_/_4)_-_16px)]`}
								>
									<div className='flex h-10 w-full items-center justify-center rounded-3px px-1'>
										<span className='text-ellipsis text-13 line-clamp-1'>{item.name}</span>
									</div>
								</CheckCard>
							);
					  })
					: null}
			</div>
			<BottomFilter
				handleCancel={() =>
					handleCancel && handleCancel(listData.id ? [`${listData.id}`] : undefined)
				}
				handleSearch={handleSearch}
				loading={loading}
				count={count}
			/>
		</div>
	);
};

export default FilterBox;
