import { CheckCard } from 'components';
import { TYPE_FILTER_PARAM, TYPE_SEARCH } from 'enums';
import { IPropertyOrther, Property } from 'models';
import dynamic from 'next/dynamic';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { IItemFilter } from '@/modules/filterProperty';

import ImageCustom from '../ImageCustom';
import { IBottomFilter } from './BottomFilter';

export interface IFilterOrther {
	className?: string;
	handleCancel?: (propertyId?: Array<string>, categoryId?: string[], typeRating?: string[]) => void;
	loading?: boolean;
	onClickOutside?: React.MouseEventHandler;
	listData?: Array<IPropertyOrther>;
	onSelect?: (value: { id?: number | string; label?: string }, typeSearch: number) => void;
	handleSearch?: () => void;
	count?: number;
	defaultSelected?: Array<IItemFilter>;
	listCategory?: any;
}

const MAX_ORTHER_FILTER_DISPLAY = 2;
const BottomFilter = dynamic(() => import('./BottomFilter'), { ssr: false }) as FC<IBottomFilter>;

export const FilterOrther: React.FC<IFilterOrther> = ({
	className,
	handleCancel,
	loading,
	onClickOutside,
	listData = [],
	count,
	handleSearch,
	onSelect,
	defaultSelected,
	listCategory = [],
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

	const transformListData = useCallback((): Array<IPropertyOrther> => {
		let newList = [...listData];
		newList.splice(0, MAX_ORTHER_FILTER_DISPLAY);
		return newList || [];
	}, [listData]);

	const getListPropertyId = () => {
		return transformListData().map((item) => `${item.id}`);
	};

	const categoryId = useMemo(() => {
		return listCategory.map((item: Property) => `${item.id}`);
	}, [listCategory]);

	return (
		<div
			className={`absolute z-10 bg-white w-688px border border-E0E0E0 top-16 ${className || ''}`}
			ref={ref}
		>
			<div className='max-h-[45vh] overflow-y-auto'>
				{transformListData()?.map((item, index: number) => {
					return (
						<div key={index}>
							<div className='flex h-12 items-center bg-F8F8F8 px-3 font-sfpro_semiBold text-16 uppercase text-272728'>
								<span>{item.name}</span>
							</div>
							<div className='flex flex-wrap px-3 pt-4'>
								{item?.propertyValues?.map((itemProperty, index2: number) => {
									const pos = listSelected.findIndex((itemSelected) =>
										itemProperty.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
											? itemSelected.id ===
											  `prop_${item.id}:[${itemProperty.id}#${itemProperty.rangeValueType}]`
											: itemSelected.id ===
											  `prop_${item.id}:[${itemProperty.rangeValueId}#${itemProperty.rangeValueType}]`,
									);
									return (
										<CheckCard
											key={index2}
											onClick={() =>
												onSelect &&
												onSelect(
													{
														id:
															itemProperty.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
																? `prop_${item.id}:[${itemProperty.id}#${itemProperty.rangeValueType}]`
																: `prop_${item.id}:[${itemProperty.rangeValueId}#${itemProperty.rangeValueType}]`,
														label:
															itemProperty.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
																? itemProperty.name
																: itemProperty.rangeValueName,
													},
													TYPE_SEARCH.ORTHER,
												)
											}
											className={`mb-2 ${
												item.name === 'Màu sắc'
													? 'w-[calc(calc(100%_/_5)_-_12px)]'
													: 'w-[calc(calc(100%_/_4)_-_12px)]'
											} !mr-[12px]`}
											checked={pos !== -1 ? true : false}
										>
											{item.name === 'Màu sắc' ? (
												<div className='absolute -top-1px left-0 flex h-10 w-full items-center'>
													<div
														className={`mr-6px aspect-square h-[38px] w-10 rounded-3px `}
														style={{ background: `#${itemProperty.value}` }}
													/>
													<span className='text-ellipsis text-13 line-clamp-2'>
														{itemProperty.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
															? itemProperty.name
															: itemProperty.rangeValueName}
													</span>
												</div>
											) : (
												<div className='flex h-10 w-full items-center justify-center rounded-3px px-1'>
													<span className='text-ellipsis text-333333 line-clamp-1'>
														{itemProperty.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
															? itemProperty.name
															: itemProperty.rangeValueName}
													</span>
												</div>
											)}
										</CheckCard>
									);
								})}
							</div>
						</div>
					);
				})}

				{listCategory.length && (
					<div className='flex h-12 items-center bg-F8F8F8 px-3 font-sfpro_semiBold text-16 uppercase text-272728'>
						Loại sản phẩm
					</div>
				)}
				<div className='flex flex-wrap px-3 pt-4'>
					{listCategory.map((item: Property, index: number) => {
						const pos = listSelected.findIndex((itemSelected) => itemSelected.id === item.id);
						return (
							<CheckCard
								key={index}
								onClick={() =>
									onSelect &&
									onSelect(
										{
											id: item.id,
											label: item.name,
										},
										TYPE_SEARCH.LIST,
									)
								}
								checked={pos !== -1 ? true : false}
								className={`mb-2 !mr-[16px] w-[calc(calc(100%_/_4)_-_16px)]`}
							>
								<div className='flex h-10 w-full items-center justify-center rounded-3px px-1'>
									<span className='text-ellipsis line-clamp-1'>{item.name}</span>
								</div>
							</CheckCard>
						);
					})}
				</div>
				<div className='flex h-12 items-center bg-F8F8F8 px-3 font-sfpro_semiBold text-16 uppercase text-272728'>
					Đánh giá
				</div>
				<div className='flex flex-wrap px-3 pt-4'>
					{Array.from({ length: 5 }, (_, i) => {
						return 5 - i;
					}).map((item, index) => {
						const pos = listSelected.findIndex((itemSelected) => itemSelected.id === `${item}sao`);
						return (
							<CheckCard
								key={index}
								onClick={() =>
									onSelect &&
									onSelect(
										{
											id: `${item}sao`,
											label: `${item} sao`,
										},
										TYPE_SEARCH.RATING,
									)
								}
								checked={pos !== -1 ? true : false}
								className={`mb-2 mr-[16px]`}
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
			<BottomFilter
				handleCancel={() => {
					handleCancel && handleCancel(getListPropertyId(), categoryId, ['1', '2']);
				}}
				handleSearch={handleSearch}
				loading={loading}
				count={count}
			/>
		</div>
	);
};

export default FilterOrther;
