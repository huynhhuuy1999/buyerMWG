import { Property } from 'models';
import React, { useEffect, useRef, useState } from 'react';

import { IItemFilter } from '@/modules/filterProperty';

import CheckCard from '../Card/CheckCard';

interface IBoxFilter extends Property {
	getId: () => string;
	getName: () => string;
}
export interface IFilterBoxMobile {
	className?: string;
	handleCancel?: (propertyId?: Array<string>) => void;
	loading?: boolean;
	onClickOutside?: React.MouseEventHandler;
	listData?: any;
	onSelect?: (value: { id?: number | string; label?: string }) => void;
	handleSearch?: () => void;
	count?: number;
	defaultSelected?: Array<IItemFilter>;
	title?: string;
}
const MAX_ITEM = 12;
const FilterBoxMobile: React.FC<IFilterBoxMobile> = ({
	className,
	onClickOutside,
	listData,
	onSelect,
	defaultSelected,
	title,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [isMore, setIsMore] = useState<boolean>(true);

	const [listSelected, setListSelected] = useState<Array<IItemFilter>>([]);
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

	return (
		<div className={`bg-white border-b border-b-[#f6f6f6] py-6 ${className || ''}`} ref={ref}>
			<div className='flex flex-col'>
				<span className='mb-6 text-16 text-333333'>{title}</span>
				<div className='mr-[-8px] flex flex-wrap'>
					{listData && listData.length
						? (isMore ? [...listData].slice(0, MAX_ITEM) : listData).map(
								(item: IBoxFilter, index: number) => {
									const pos = listSelected.some((category) => item.id === category.id);
									return (
										<CheckCard
											key={index}
											onClick={() =>
												onSelect?.({
													id: item.getId(),
													label: item.getName(),
												})
											}
											checked={pos}
											className={`mb-2 !mr-[8px] w-[calc(calc(100%_/_3)_-_8px)]`}
										>
											<div className='flex h-10 w-full items-center justify-center rounded-3px px-1'>
												<span className='text-ellipsis text-13 line-clamp-1'>{item.getName()}</span>
											</div>
										</CheckCard>
									);
								},
						  )
						: listData?.propertyValues?.length
						? (isMore
								? [...listData?.propertyValues].slice(0, 12) || []
								: [...listData?.propertyValues] || []
						  )?.map((item: any, index) => {
								let pos = listSelected.some((itemSelected) => itemSelected.id === item.getId());
								return (
									<CheckCard
										key={index}
										onClick={() =>
											onSelect &&
											onSelect({
												id: item.getId(),
												label: item.getName(),
											})
										}
										checked={pos}
										className={`mb-2 !mr-[8px] w-[calc(calc(100%_/_3)_-_8px)]`}
									>
										<div className='flex h-10 w-full items-center justify-center rounded-3px px-1'>
											<span className='text-ellipsis text-13 line-clamp-1'>{item.getName()}</span>
										</div>
									</CheckCard>
								);
						  })
						: null}
				</div>
				{(listData?.length > MAX_ITEM || listData?.propertyValues?.length > MAX_ITEM) && isMore ? (
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
		</div>
	);
};

export default FilterBoxMobile;
