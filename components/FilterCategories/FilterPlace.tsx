import { ImageCustom } from 'components';
import dynamic from 'next/dynamic';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';

import { ProvinceTree } from '@/models/common';

// import { IItemFilter } from '@/modules/filterProperty';
import CheckCard from '../Card/CheckCard';
import { DropdownLocation } from '../Dropdown';
import { IBottomFilter } from '../FilterSearch';

export interface IFilterPlace {
	className?: string;
	onClickOutside?: MouseEventHandler;
	listPlace?: Array<ProvinceTree>;
	onSelect?: (value: { id?: number; label?: string }) => void;
	handleSearch?: () => void;
	count?: number;
	handleCancel?: () => void;
	getProvince?: (value: { id?: number; label?: string }) => void;
	defaultSelected?: {
		listDefault: Array<any>;
		province?: number;
	};
	loading?: boolean;
	getNearbyPlace?: () => void;
}

const BottomFilter = dynamic(() => import('./BottomFilter'), {
	ssr: false,
}) as React.FC<IBottomFilter>;

export const FilterPlace: React.FC<IFilterPlace> = ({
	className,
	onClickOutside,
	listPlace,
	count,
	handleCancel,
	handleSearch,
	onSelect,
	getProvince,
	defaultSelected,
	loading,
	getNearbyPlace,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [listChecked, setListChecked] = useState<{
		listDefault: Array<any>;
		province?: number;
	}>({ listDefault: [], province: 0 });
	const [province, setProvince] = useState<{
		id?: number;
		label?: string;
		district?: Array<any>;
	}>();

	useEffect(() => {
		if (defaultSelected && listPlace?.length) {
			setListChecked(defaultSelected);
			let index = listPlace.findIndex(
				(item: ProvinceTree) => item.provinceId === defaultSelected.province,
			);
			if (index !== -1)
				setProvince({
					id: listPlace[index].provinceId,
					label: listPlace[index].provinceName,
					district: listPlace[index].children,
				});
		}
	}, [defaultSelected, listPlace]);

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

	const transformListProvince: any = () => {
		if (listPlace?.length) {
			return listPlace.map((item) => {
				return {
					id: item.provinceId,
					label: item.provinceName,
					district: item.children,
				};
			});
		}
		return [];
	};

	return (
		<div
			className={`absolute z-10 bg-white w-688px border border-E0E0E0 top-16 ${className || ''}`}
			ref={ref}
		>
			<div className='flex h-16 items-center justify-between bg-F8F8F8 px-4'>
				<div
					className='flex cursor-pointer items-center'
					onClick={getNearbyPlace}
					tabIndex={0}
					role='button'
					onKeyPress={() => {}}
				>
					<ImageCustom width={32} height={32} src='/static/svg/iconLocation.svg' priority />
					<span className='ml-6px mr-7px text-[#0093E9]'>Tìm quanh đây</span>
					<ImageCustom width={10} height={5} src='/static/svg/iconDownBlue.svg' priority />
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

			<>
				<DropdownLocation
					data={transformListProvince()}
					legend={
						<span>
							Tỉnh/Thành phố<sup className='text-red-500'>*</sup>
						</span>
					}
					placeholder='Chọn tỉnh thành'
					classNameContainer='mx-4 mt-[25px] mb-4'
					onChange={(value) => {
						setProvince(value);
						getProvince && getProvince({ id: value.id, label: value.label });
					}}
					classNameBody='h-[200px] overflow-y-auto'
					defaultValue={{ id: listChecked.province }}
				/>
				{province && province.id !== 0 ? (
					<div className='overlay-overflow mx-4 mt-3 flex h-[159px] flex-wrap'>
						{province.district?.map((item, index) => {
							let pos = listChecked?.listDefault.findIndex((itemCheck) => itemCheck.id === item.id);
							return (
								<CheckCard
									className={`mb-2 !mr-[8px] w-[calc(calc(100%_/_4)_-_8px)]`}
									onClick={() => {
										onSelect &&
											onSelect({ id: item.id, label: `${province.label} > ${item.name}` });
									}}
									checked={pos !== -1 ? true : false}
									key={index}
								>
									<div className='flex h-10 w-full items-center justify-center rounded-3px px-1'>
										<span className='text-ellipsis line-clamp-1'>{item.name}</span>
									</div>
								</CheckCard>
							);
						})}
					</div>
				) : null}
			</>

			<BottomFilter
				handleCancel={handleCancel}
				handleSearch={handleSearch}
				loading={loading}
				count={count}
			/>
		</div>
	);
};

export default FilterPlace;
