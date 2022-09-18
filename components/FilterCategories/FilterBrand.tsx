// import { TYPE_FILTER_PARAM } from 'enums';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ImageCustom } from 'components';
import { IFilterBrand as IFilter } from 'models';
import dynamic from 'next/dynamic';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { splitArrayWithMaxLine } from 'utils/formatter';

import CircleCard from '@/components/Card/CircleCard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IItemFilter } from '@/modules/filterProperty';

import { IBottomFilter } from '../FilterSearch';

export interface IFilterBrand {
	className?: string;
	listBrand?: Array<IFilter>;
	onClickOutside?: React.MouseEventHandler;
	onSelect?: (value: { id?: string; label?: string }) => void;
	handleSearch?: () => void;
	defaultSelected?: Array<IItemFilter>;
	count?: number;
	handleCancel?: () => void;
	loading?: boolean;
}

const MAX_LINE = 3;
const MAX_ELEMENT_WITHOUT_SCROLL = 9;
const BottomFilter = dynamic(() => import('./BottomFilter'), {
	ssr: false,
}) as React.FC<IBottomFilter>;

export const FilterBrand: React.FC<IFilterBrand> = ({
	className,
	listBrand,
	onClickOutside,
	onSelect,
	handleSearch,
	defaultSelected,
	count,
	handleCancel,
	loading,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [listChecked, setListChecked] = useState<Array<IItemFilter>>([]);
	const [listBrandSplit, setListBrandSplit] = useState<Array<IFilter[]>>([]);

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
		if (listBrand) {
			let listSplit = splitArrayWithMaxLine(listBrand, MAX_LINE, MAX_ELEMENT_WITHOUT_SCROLL);
			setListBrandSplit(listSplit);
		}
	}, [listBrand]);

	useEffect(() => {
		if (defaultSelected) setListChecked(defaultSelected);
	}, [defaultSelected]);

	return (
		<div
			ref={ref}
			className={` absolute border bg-white border-light-E0E0E0 w-688px max-h-397px z-10 top-16 ${
				className || ''
			}`}
		>
			<div>
				{listBrand && listBrand?.length > 27 ? (
					<div className='flex items-center justify-between bg-F8F8F8 px-4 py-3'>
						<div className='flex h-10 w-72 items-center rounded-4px border border-E3DEDE bg-white px-3'>
							<input
								className='ml-6px mr-1 w-full text-16 focus:outline-none'
								placeholder='Tìm kiếm thương hiệu'
							/>
							<ImageCustom width={24} height={24} src='/static/svg/searchicon.svg' priority />
						</div>
						<ImageCustom
							src='/static/svg/Close.svg'
							width={24}
							height={24}
							className='cursor-pointer'
							onClick={(e) => onClickOutside && onClickOutside(e)}
							priority
						/>
					</div>
				) : null}

				<div className='overflow-x-auto p-4'>
					{listBrandSplit?.map((arrChild, index) => {
						return (
							<div className='flex' key={index}>
								{arrChild.map((item, index2: number) => {
									let pos = listChecked.findIndex((itemCheck) => item.getId() === itemCheck.id);

									return (
										<Fragment key={index2}>
											<CircleCard
												image={item.value ? item.value : '/static/images/category-dress.png'}
												width={56}
												height={56}
												checked={pos !== -1 ? true : false}
												styles={{ marginRight: 15 }}
												clickHandle={() =>
													onSelect &&
													onSelect({
														id: item.getId(),
														label: item.getName(),
													})
												}
												classImage={`${pos !== -1 ? '!border-[#F05A94]' : ''}`}
												iconCheck
											/>
											{index === 9 && <br />}
										</Fragment>
									);
								})}
							</div>
						);
					})}
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

export default FilterBrand;
