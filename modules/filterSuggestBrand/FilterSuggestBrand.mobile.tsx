import classNames from 'classnames';
import { Drawer, ImageCustom, PopupSort } from 'components';
import React, { useState } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

const listSort = [
	{
		id: 0,
		label: 'Mặc định',
	},
	{
		id: 1,
		label: 'Được mua nhiều nhất',
	},
	{
		id: 2,
		label: 'Mới nhất',
	},
	{
		id: 3,
		label: 'Sản phẩm đã thích',
	},
];

export const FilterSuggestBrandMobile = () => {
	const [isScrollDown, setIsScrollDown] = useState<boolean>(false);
	const [isShow, setIsShow] = useState<boolean>(false);

	let prevPosition: number = 0;

	useIsomorphicLayoutEffect(() => {
		const handleScrollWindow = () => {
			const position: number = window.scrollY;
			// const top = filterElement?.current?.getBoundingClientRect().top;
			if (position > prevPosition) {
				setIsScrollDown(true);
			} else {
				setIsScrollDown(false);
			}
			prevPosition = position;
		};

		window.addEventListener('scroll', handleScrollWindow);

		return () => window.removeEventListener('scroll', handleScrollWindow);
	}, []);

	return (
		<div className={'pb-8'}>
			<div
				className={classNames([
					'fixed w-full px-10px z-20 py-2 bg-white mt-[70px] border-b transition-[display] duration-100',
					isScrollDown ? 'hidden' : 'block',
				])}
			>
				<div className={`flex justify-between `}>
					<div
						className='flex items-center'
						onClick={() => setIsShow(true)}
						role='button'
						onKeyPress={() => setIsShow(true)}
						tabIndex={0}
					>
						<ImageCustom src={'/static/svg/iconFilter.svg'} width={24} height={24} />
						<span className='text-14'>Bộ lọc</span>
					</div>

					<PopupSort
						className='absolute right-0 top-5'
						listDataSort={listSort}
						// onChange={(value) => handleSearch({ ...listFilter, sortType: value })}
						// defaultValue={Number(route?.query?.sortType)}
					/>
				</div>
			</div>

			<Drawer isOpen={isShow} setIsOpen={(value) => setIsShow(value)}>
				<div className='flex h-45px items-center justify-between bg-[#F1F1F1] px-10px text-18'>
					<span>Bộ lọc</span>
					<ImageCustom
						src={'/static/svg/Close.svg'}
						width={24}
						height={24}
						onClick={() => setIsShow(false)}
					/>
				</div>
				<div className='mb-14 max-h-[70vh] overflow-y-auto px-[10px] pb-5 overflow-x-hidden'>
					{/* {arrayProperty.map((property: any, index: number) => {
				return renderProperty(property, index);
			})} */}
				</div>
				{/* <div className='fixed bottom-12 flex w-full overflow-x-auto bg-white px-10px py-3'>
			{listFilterSelected.map((itemFilter, index) => {
				const checkHasProvince = listFilterSelected.some(
					(itemFilter) => itemFilter.type === TYPE_SEARCH.PROVINCE,
				);
				const checkHasDistrict = listFilterSelected.some(
					(itemFilter) => itemFilter.type === TYPE_SEARCH.DISTRICT,
				);
				if (itemFilter.type === TYPE_SEARCH.PROVINCE) {
					if (checkHasDistrict && checkHasProvince) return;
				}
				return (
					<div
						className='mr-6px flex min-w-max items-center rounded-[20px] bg-[#F7F5FE] px-2 py-1 text-16 text-333333'
						key={index}
						role='button'
						onKeyPress={() => {}}
						tabIndex={0}
					>
						<span className='mr-2px '>{itemFilter.label}</span>
						<ImageCustom
							src={'/static/svg/xoa.svg'}
							width={16}
							height={16}
							priority
							onClick={(e) => {
								e.stopPropagation();
								handleRemoveItemFilter(itemFilter, itemFilter.type || 0);
							}}
						/>
					</div>
				);
			})}
		</div> */}
				<div className='fixed bottom-0 left-0 flex h-12 w-full shadow-[0_0px_4px_0px_rgba(0,0,0,0.2)]'>
					<button
						className='flex-1 bg-[#EEEFFF] text-16 text-[#333333]'
						// onClick={handleClearFilter}
					>{`Xoá & cài lại bộ lọc`}</button>
					<button
						className={`flex-1 bg-[#F05A94] text-16 text-white`}
						// onClick={handleSearchData}
						// disabled={countx?.data === 0}
					>
						Xem kết quả
					</button>
				</div>
			</Drawer>
		</div>
	);
};
