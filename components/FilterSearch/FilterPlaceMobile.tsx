import { CheckCard, ImageCustom } from 'components';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';

import { ProvinceTree } from '@/models/common';
import { IItemFilter } from '@/modules/filterProperty';

import { DropdownLocation } from '../Dropdown';

export interface IFilterPlaceMobile {
	className?: string;
	onClickOutside?: MouseEventHandler;
	listPlace?: Array<ProvinceTree>;
	onSelect?: (value: { id?: number; label?: string }) => void;
	handleCancel?: () => void;
	getProvince?: (value: { id?: number; label?: string }) => void;
	defaultSelected?: {
		listDefault: Array<IItemFilter>;
		province?: number;
	};
	title?: string;
}

const FilterPlaceMobile: React.FC<IFilterPlaceMobile> = ({
	className,
	onClickOutside,
	listPlace,
	onSelect,
	getProvince,
	defaultSelected,
	title,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [listChecked, setListChecked] = useState<{
		listDefault: Array<IItemFilter>;
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
			const index = listPlace.findIndex(
				(item: ProvinceTree) => item.provinceId === defaultSelected.province,
			);
			if (index !== -1)
				setProvince({
					id: listPlace[index].provinceId,
					label: listPlace[index].provinceName,
					district: listPlace[index].children,
				});
			else {
				setProvince({ id: 0 });
			}
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
		<div className={` bg-white border-b border-b-[#F6F6F6] pb-5 ${className || ''}`} ref={ref}>
			<span className='mb-5 text-16 text-333333'>{title}</span>
			<div className='px-4'>
				<div className='flex items-center justify-end'>
					<ImageCustom width={25} height={25} src='/static/svg/iconLocation.svg' priority />
					<span className='ml-6px mr-7px text-[#0093E9]'>Tìm quanh đây</span>
					<ImageCustom width={10} height={5} src='/static/svg/iconDownBlue.svg' priority />
				</div>
			</div>
			<DropdownLocation
				data={transformListProvince()}
				legend={
					<span>
						Tỉnh/Thành phố<sup className='text-red-500'>*</sup>
					</span>
				}
				placeholder='Chọn tỉnh thành'
				classNameContainer=' mt-[25px] mb-[10px]'
				onChange={(value) => {
					setProvince(value);
					getProvince && getProvince({ id: value.id, label: value.label });
				}}
				classNameBody='h-[200px] overflow-y-auto'
				defaultValue={{ id: listChecked.province }}
			/>
			{province && province.id !== 0 ? (
				<div className='mt-3 -mr-[8px] flex flex-wrap'>
					{province.district?.map((item, index) => {
						const pos = listChecked?.listDefault.findIndex(
							(itemCheck) => itemCheck.id === item.districtId,
						);
						return (
							<CheckCard
								className={`mb-2 !mr-[8px] w-[calc(calc(100%_/_3)_-_8px)]`}
								onClick={() => {
									onSelect &&
										onSelect({
											id: item.districtId,
											label: `${province.label} > ${item.districtName}`,
										});
								}}
								checked={pos !== -1 ? true : false}
								key={index}
							>
								<div className='flex h-10 w-full items-center justify-center rounded-3px px-1'>
									<span className='text-ellipsis text-13 line-clamp-1'>{item.districtName}</span>
								</div>
							</CheckCard>
						);
					})}
				</div>
			) : null}
		</div>
	);
};

export default FilterPlaceMobile;
