import { ImageCustom } from 'components';
import { Property } from 'models';
import { IItemFilter } from 'modules';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { Icon, IconEnum } from 'vuivui-icons';

import CheckCard from '../Card/CheckCard';
import { IBottomFilter } from './BottomFilter';

interface IFilterBox {
	className?: string;
	handleCancel?: (propertyId?: Array<string>) => void;
	loading?: boolean;
	onClickOutside?: React.MouseEventHandler;
	listData?: any;
	onSelect?: (value: { id?: number | string; label?: string }) => void;
	handleSearch?: () => void;
	count?: number;
	defaultSelected?: Array<IItemFilter>;
	limitBox: number;
}

const BottomFilter = dynamic(() => import('./BottomFilter'), {
	ssr: false,
}) as React.FC<IBottomFilter>;
interface IBoxFilter extends Property {
	getId: () => string;
	getName: () => string;
}
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
	limitBox,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [listSelected, setListSelected] = useState<Array<IItemFilter>>([]);

	const [numLimitBox, setNumLimitBox] = useState(limitBox);

	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (ref.current && !ref.current.contains(event.target)) {
				onClickOutside?.(event);
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
	const convertValues = () => listData.propertyValues?.slice(0, numLimitBox);

	return (
		<div
			className={` absolute z-10 bg-white w-688px border border-E0E0E0 top-16 ${className || ''}`}
			ref={ref}
		>
			<div className='flex max-h-[45vh] flex-wrap overflow-y-auto px-3 py-4'>
				{convertValues()
					? (convertValues() ? convertValues() : listData.propertyValues)?.map(
							(item: IBoxFilter, index: number) => {
								let pos = listSelected.some(
									(itemSelected) => itemSelected.id === item.getId(),
								);
								return (
									<CheckCard
										title={item.name}
										key={index}
										onClick={() =>
											onSelect?.({
												id: item.getId(),
												label: item.getName(),
											})
										}
										checked={pos}
										className={`mb-3 !mr-[16px] w-[calc(calc(100%_/_4)_-_16px)]`}
									>
										<div className='flex h-10 w-full items-center justify-center rounded-3px px-1'>
											<span className='text-ellipsis line-clamp-1'>{item.name}</span>
										</div>
									</CheckCard>
								);
							},
					  )
					: null}
			</div>

			{Array.isArray(listData.propertyValues) &&
			listData.propertyValues?.length - numLimitBox > 0 ? (
				<div
					className='flex items-center justify-center'
					onClick={(e) => {
						e.stopPropagation();
						setNumLimitBox(listData.propertyValues?.length || 0);
					}}
					role='button'
					onKeyPress={() => setNumLimitBox(listData.propertyValues?.length || 0)}
					tabIndex={0}
				>
					<span className='text-[#0093E9]'>{`Xem thêm (${
						listData.propertyValues.length - numLimitBox
					})`}</span>
					<Icon name={IconEnum.CaretDown} size={22} />

					<ImageCustom src={'/static/svg/chevron-down-4834D6.svg'} width={7} height={3} />
				</div>
			) : null}

			<BottomFilter
				handleCancel={() => handleCancel?.(listData.id ? [`${listData.id}`] : undefined)}
				handleSearch={handleSearch}
				loading={loading}
				count={count}
			/>
		</div>
	);
};

export default FilterBox;
