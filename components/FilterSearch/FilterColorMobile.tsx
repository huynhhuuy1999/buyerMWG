import { CheckCard } from 'components';
import { TYPE_FILTER_PARAM } from 'enums';
import { PropertyValue } from 'models';
import React, { useEffect, useRef, useState } from 'react';

import { IItemFilter } from '@/modules/filterProperty';

export interface IFilterColorMobile {
	className?: string;
	onClickOutside?: React.MouseEventHandler;
	onChange?: (value: Array<number>) => void;
	listColor?: PropertyValue;
	onSelect?: (value: { id?: number | string; label?: string }) => void;
	handleSearch?: () => void;
	count?: number;
	handleCancel?: (propertyId?: Array<string>) => void;
	defaultSelected?: Array<IItemFilter>;
	loading?: boolean;
	title?: string;
}

export const FilterColorMobile: React.FC<IFilterColorMobile> = ({
	className,
	onClickOutside,
	listColor,
	onSelect,
	defaultSelected,
	title,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [listSelected, setListSelected] = useState<Array<IItemFilter>>([]);
	const [isMore, setIsMore] = useState<boolean>(true);

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

	return (
		<div className={`bg-white flex flex-col border-b-[#f6f6f6] py-6 ${className || ''}`} ref={ref}>
			<span className='mb-5 text-16 text-333333'>{title}</span>
			<div className='mr-[-8px] flex flex-wrap'>
				{listColor
					? (isMore
							? [...(listColor?.propertyValues || [])].slice(0, 12)
							: listColor?.propertyValues
					  )?.map((item, index) => {
							const pos = listSelected.some((itemSelected) =>
								item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
									? itemSelected.id === `prop_${listColor.id}:[${item.id}#${item.rangeValueType}]`
									: itemSelected.id ===
									  `prop_${listColor.id}:[${item.rangeValueId}#${item.rangeValueType}]`,
							);
							return (
								<CheckCard
									checked={pos}
									className={`relative mb-2 !mr-[8px] w-[calc(calc(100%_/_3)_-_8px)]`}
									key={index}
									onClick={() =>
										onSelect &&
										onSelect({
											id:
												item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
													? `prop_${listColor.id}:[${item.id}#${item.rangeValueType}]`
													: `prop_${listColor.id}:[${item.rangeValueId}#${item.rangeValueType}]`,

											label:
												item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
													? item.name
													: item.rangeValueName,
										})
									}
								>
									<div className='absolute -top-1px left-0 flex h-10 w-full items-center'>
										<div
											className={`mr-6px aspect-square h-[38px] rounded-3px `}
											style={{ background: `#${item.value}` }}
										/>
										<span className='text-ellipsis text-13 line-clamp-2'>
											{item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
												? item.name
												: item.rangeValueName}
										</span>
									</div>
								</CheckCard>
							);
					  })
					: ''}
			</div>
			{(listColor?.propertyValues?.length || 0) > 12 && isMore ? (
				<span
					className='text-center text-[#0093E9] '
					role={'button'}
					onKeyPress={(e) => {
						e.stopPropagation();
						setIsMore(false);
					}}
					onClick={(e) => {
						e.stopPropagation();
						setIsMore(false);
					}}
					tabIndex={0}
				>
					Xem thêm &#8744;
				</span>
			) : null}
		</div>
	);
};

export default FilterColorMobile;
