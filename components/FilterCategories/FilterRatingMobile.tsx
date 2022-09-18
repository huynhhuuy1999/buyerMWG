import { CheckCard } from 'components';
import React, { useEffect, useRef, useState } from 'react';

import { IItemFilter } from '@/modules/filterProperty';

import ImageCustom from '../ImageCustom';

export interface IFilterRatingMobile {
	className?: string;
	handleCancel?: (propertyId?: Array<string>) => void;
	loading?: boolean;
	onClickOutside?: React.MouseEventHandler;
	onSelect?: (value: { id?: number | string; label?: string }) => void;
	handleSearch?: () => void;
	count?: number;
	defaultSelected?: Array<IItemFilter>;
	title?: string;
}
const MAX_RATING = 5;
const FilterRatingMobile: React.FC<IFilterRatingMobile> = ({
	className,
	onClickOutside,
	onSelect,
	defaultSelected,
	title,
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

	return (
		<div className={`bg-white border-b border-b-[#f6f6f6] py-6 ${className || ''}`} ref={ref}>
			<div className='flex flex-col'>
				<span className='mb-6 text-16 text-333333'>{title}</span>
				<div className='mr-[-8px] flex flex-wrap'>
					{Array.from({ length: MAX_RATING }, (_, i) => {
						return 5 - i;
					}).map((item, index) => {
						const pos = listSelected.some((selected) => selected.id === item);
						return (
							<CheckCard
								key={index}
								onClick={() =>
									onSelect &&
									onSelect({
										id: item,
										label: `${item} sao`,
									})
								}
								checked={pos}
								className={`mb-2 !mr-[8px]`}
							>
								<div className='flex h-10 w-full items-center justify-center rounded-3px px-3'>
									{Array.from({ length: item }, (_, i) => i + 1).map((_, index) => (
										<ImageCustom
											src={'/static/svg/star-product.svg'}
											width={16}
											height={16}
											key={index}
										/>
									))}{' '}
									<span className='ml-[2px]'>{item} sao</span>
								</div>
							</CheckCard>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default FilterRatingMobile;
