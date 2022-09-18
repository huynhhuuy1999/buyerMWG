import { ImageCustom } from 'components';
import { TYPE_FILTER_PARAM } from 'enums';
import { debounce } from 'lodash';
import { Property } from 'models';
import React, { useEffect, useState } from 'react';
import { Icon, IconEnum } from 'vuivui-icons';

import { IItemFilter } from '@/modules/filterProperty';

import CircleCard from '../Card/CircleCard';

export interface IFilterBrandMobile {
	listBrand?: Array<Property>;
	onSelect?: (value: { id?: string; label?: string }) => void;
	handleSearch?: any;
	defaultSelected?: Array<IItemFilter>;
	count?: number;
	handleCancel?: any;
	loading?: boolean;
	className?: string;
}

const MAX_NUMBRAND_FIRST_DISPLAY = 10;

const FilterBrandMobile: React.FC<IFilterBrandMobile> = ({
	listBrand = [],
	className,
	onSelect,
	defaultSelected = [],
}) => {
	const [numLimitBrand, setNumLimitBrand] = useState(MAX_NUMBRAND_FIRST_DISPLAY);
	const [listChecked, setListChecked] = useState<Array<IItemFilter>>([]);
	const [listBrandFilter, setListBrandFilter] = useState<Property[]>(listBrand);
	const [screenWidth, setScreenWidth] = useState<number>(0);

	useEffect(() => {
		if (document.body) setScreenWidth(document?.body?.clientWidth);
		return () => {
			setScreenWidth(0);
		};
	}, []);

	useEffect(() => {
		if (defaultSelected) setListChecked(defaultSelected);
	}, [defaultSelected]);

	const handleSearchBrand = (text: string) => {
		let listBrandCopy = listBrand.filter((brand) =>
			brand.name?.toLowerCase()?.includes(text.toLowerCase()),
		);
		setListBrandFilter(listBrandCopy);
	};

	return (
		<div className={`${className || ''}`}>
			<div className='flex items-center'>
				<span className='mr-6 text-16'>Thương hiệu</span>
				{listBrand && listBrand?.length > 10 ? (
					<div className='flex h-9 flex-1 items-center justify-between rounded-6px border border-[#F6F6F6] px-6px'>
						<input
							placeholder='Tìm thương hiệu'
							className='flex-1 px-[10px] focus:outline-none'
							onChange={debounce((e) => handleSearchBrand(e.target.value), 200)}
						/>
						<div className='relative flex items-center justify-center'>
							{/* <ImageCustom src='/static/svg/searchicon.svg' height={20} width={20} /> */}
							<Icon name={IconEnum.MagnifyingGlass} size={20} />
						</div>
					</div>
				) : null}
			</div>
			<div className='-ml-15px mt-[14px] flex flex-wrap'>
				{listBrandFilter?.map((brand, i: number) => {
					if (i < numLimitBrand) {
						const pos = listChecked.some((item) =>
							brand.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
								? `${item.id}` === `${brand.id}#${brand.rangeValueType}`
								: `${item.id}` === `${brand.rangeValueId}#${brand.rangeValueType}`,
						);

						return (
							<CircleCard
								key={i}
								image={brand.value ? brand.value : '/static/images/empty-img.png'}
								checked={pos}
								styles={{
									marginLeft: 15,
									width: `calc(20% - 15px)`,
									marginBottom: 16,
								}}
								clickHandle={() => {
									onSelect &&
										onSelect({
											id:
												brand.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
													? `${brand.id}#${brand.rangeValueType}`
													: `${brand.rangeValueId}#${brand.rangeValueType}`,
											label:
												brand.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
													? `${brand.name}`
													: `${brand.rangeValueName}`,
										});
								}}
								classImage={`${pos ? '!border-[#F05A94]' : ''} relative aspect-square`}
								iconCheck
								isMobile
								width={screenWidth * 0.2 - 15}
								height={screenWidth * 0.2 - 15}
							/>
						);
					}

					return;
				})}
			</div>
			{listBrand?.length && numLimitBrand < listBrand?.length ? (
				<div
					className='flex items-center justify-center'
					onClick={() => setNumLimitBrand(numLimitBrand + listBrand.length - numLimitBrand)}
					role='button'
					onKeyPress={() => setNumLimitBrand(numLimitBrand + listBrand.length - numLimitBrand)}
					tabIndex={0}
				>
					<span className='text-[#0093E9]'>{`Xem thêm (${listBrand.length - numLimitBrand})`}</span>
					<ImageCustom src={'/static/svg/chevron-down-4834D6.svg'} width={7} height={3} />
				</div>
			) : (
				''
			)}
			<div className='mt-6 h-1px w-full bg-[#F6F6F6]' />
		</div>
	);
};

export default FilterBrandMobile;
