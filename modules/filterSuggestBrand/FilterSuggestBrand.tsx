import { Dropdown, Icon, ImageCustom } from 'components';
import React from 'react';

const data = [
	{
		id: 1,
		label: 'Được mua nhiều nhất',
	},
	{
		id: 2,
		label: 'Khuyến mãi tốt',
	},
	{
		id: 3,
		label: 'Sản phẩm mới nhất',
	},
	{
		id: 4,
		label: 'Giá bán tăng dần',
	},
	{
		id: 5,
		label: '% giảm giá giảm dần',
	},
	{
		id: 6,
		label: 'Yêu thích nhất',
	},
];

interface FilterSuggestBrand {
	totalMerchant?: number;
}

export const FilterSuggestBrand: React.FC<FilterSuggestBrand> = ({ totalMerchant }) => {
	return (
		<div className='container flex items-center justify-between'>
			<div className='flex'>
				<Dropdown
					placeholder='Khoảng giá'
					classNameHeader='w-[152px] h-10 mr-2'
					data={[
						{ id: 1, label: 'Khoảng giá 1' },
						{ id: 2, label: 'Khoảng giá 2' },
						{ id: 3, label: 'Khoảng giá 3' },
						{ id: 4, label: 'Khoảng giá 4' },
					]}
					classNameBody='w-[130px]'
					suffixIcon={<Icon type='icon-chevron-bottom' variant='dark' size={18} />}
				/>
				<Dropdown
					placeholder='Loại đánh giá'
					classNameHeader='w-[160px] h-10 mr-2'
					data={[
						{ id: 1, label: 'Đánh giá 1' },
						{ id: 2, label: 'Đánh giá 2' },
						{ id: 3, label: 'Đánh giá 3' },
						{ id: 4, label: 'Đánh giá 4' },
					]}
					classNameBody='w-[160px]'
					suffixIcon={<Icon type='icon-chevron-bottom' variant='dark' size={18} />}
				/>
				<Dropdown
					placeholder='Khu vực'
					classNameHeader='w-[152px] h-10 mr-2'
					data={[
						{ id: 1, label: 'Khu vực 1' },
						{ id: 2, label: 'Khu vực 2' },
						{ id: 3, label: 'Khu vực 3' },
						{ id: 4, label: 'Khu vực 4' },
					]}
					classNameBody='w-[152px]'
					suffixIcon={<Icon type='icon-chevron-bottom' variant='dark' size={18} />}
				/>
				<Dropdown
					placeholder='Bộ lọc khác'
					classNameHeader='w-[152px] h-10'
					data={[
						{ id: 1, label: 'Bộ lọc 1' },
						{ id: 2, label: 'Bộ lọc 2' },
						{ id: 3, label: 'Bộ lọc 3' },
						{ id: 4, label: 'Bộ lọc 4' },
					]}
					classNameBody='w-[152px]'
					prefixIcon={<ImageCustom src={'/static/svg/iconFilter.svg'} width={24} height={24} />}
				/>
			</div>
			<div className='flex items-center'>
				<span className='mr-5 text-333333'>{totalMerchant || 0} thương hiệu</span>
				<Dropdown
					placeholder='Sắp xếp'
					classNameHeader='w-[197px] h-10'
					data={data}
					classNameBody='w-[259px] right-0 rounded-3px mt-10px'
					prefixIcon={<ImageCustom src={'/static/svg/Sort.svg'} width={24} height={24} />}
					classNameItem={`text-14 h-10 flex justify-between items-center px-6`}
					iconSelected={<ImageCustom src={'/static/svg/checkBlack.svg'} width={15} height={10} />}
					labelHeaderFixBody='Sắp xếp'
				/>
			</div>
		</div>
	);
};
