import { CheckCard } from 'components';
import { Property } from 'models';
import { IItemFilter } from 'modules';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';

import { IBottomFilter } from '..';

interface IFilterCategory {
	className?: string;
	listCategory: Array<Property>;
	onClickOutside?: React.MouseEventHandler;
	onSelect?: (value: { id?: string; label?: string }) => void;
	handleSearch?: () => void;
	defaultSelected: Array<IItemFilter>;
	count?: number;
	handleCancel?: () => void;
	loading?: boolean;
}

const BottomFilter = dynamic(() => import('components/FilterSearch/BottomFilter'), {
	ssr: false,
}) as React.FC<IBottomFilter>;

export const FilterCategory: React.FC<IFilterCategory> = ({
	className,
	listCategory,
	onClickOutside,
	onSelect,
	handleSearch,
	defaultSelected,
	count,
	handleCancel,
	loading,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	// const [_, setListChecked] = useState<Array<IItemFilter>>([]);

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

	// useEffect(() => {
	// 	if (defaultSelected) setListChecked(defaultSelected);
	// }, [defaultSelected]);

	return (
		<div
			ref={ref}
			className={` absolute border bg-white border-light-E0E0E0 max-h-397px z-10 top-16  ${
				className || ''
			}`}
		>
			<div className=' scrollbar'>
				<div className='max-h-[300px] py-4  pl-3  overflow-x-hidden'>
					<div className='mr-[2px] grid grid-cols-4  gap-x-3'>
						{listCategory.map((childrenItem: any, index: number) => {
							let pos = defaultSelected.findIndex(
								(itemSelected) => itemSelected.id === childrenItem.id,
							);
							return (
								<CheckCard
									key={index}
									onClick={() =>
										onSelect &&
										onSelect({
											id: childrenItem.id,
											label: childrenItem.name,
										})
									}
									checked={pos !== -1 ? true : false}
									className={`!mr-2 !mb-2 w-[154px]`}
								>
									<div className='flex h-10 w-full items-center justify-center rounded-3px px-1'>
										<span className='text-ellipsis line-clamp-1'>{childrenItem.name}</span>
									</div>
								</CheckCard>
							);
						})}
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

export default FilterCategory;
