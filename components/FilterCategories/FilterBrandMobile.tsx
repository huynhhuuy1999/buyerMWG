// import { AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';
import { CircleCard, ImageCustom } from 'components';
// import { TYPE_FILTER_PARAM } from 'enums';
import { debounce } from 'lodash';
import { IFilterBrand } from 'models';
import React, { useEffect, useRef, useState } from 'react';

interface IFilterBrandMobile {
	listBrand?: Array<IFilterBrand>;
	onSelect?: (value: { id?: string; label?: string }) => void;
	handleSearch?: any;
	defaultSelected?: Array<IFilterBrand>;
	count?: number;
	handleCancel?: any;
	loading?: boolean;
	className?: string;
}

const MAX_NUMBER_BRAND_FIRST_DISPLAY = 10;

const FilterBrandMobile: React.FC<IFilterBrandMobile> = ({
	listBrand = [],
	className = '',
	onSelect,
	defaultSelected = [],
}) => {
	const [numLimitBrand, setNumLimitBrand] = useState(MAX_NUMBER_BRAND_FIRST_DISPLAY);
	const [listChecked, setListChecked] = useState<Array<IFilterBrand>>([]);
	const [valueSearch, setValueSearch] = useState<string>('');
	const [screenWidth, setScreenWidth] = useState<number>(0);
	let ref_input_search = useRef<any>(null);

	useEffect(() => {
		if (document.body) setScreenWidth(document?.body?.clientWidth);
		return () => {
			setScreenWidth(0);
		};
	}, []);

	useEffect(() => {
		if (!defaultSelected.length) {
			if (ref_input_search !== null && ref_input_search.current) {
				ref_input_search.current.value = '';
			}
			valueSearch && setValueSearch('');
		}
		setListChecked(defaultSelected);
	}, [defaultSelected]);

	const onSearch = (e: any) => {
		const { value }: { value: string } = e.target;
		setValueSearch(value);
	};

	const listBrandSearch = listBrand.filter(
		(t: any) => t.getName().toUpperCase().indexOf(valueSearch.toUpperCase()) > -1,
	);

	return (
		<div className={className}>
			<div className='flex items-center'>
				<span className='mr-6 text-16'>Thương hiệu</span>
				{listBrand.length > 10 ? (
					<div className='flex h-9 flex-1 items-center justify-between rounded-6px border border-[#F6F6F6] px-6px'>
						<input
							ref={ref_input_search}
							onChange={debounce((e) => onSearch(e), 300)}
							placeholder='Tìm thương hiệu'
							className='flex-1 px-[10px] focus:outline-none'
						/>
						<div className='relative flex items-center justify-center'>
							<ImageCustom src='/static/svg/searchicon.svg' height={20} width={20} />
						</div>
					</div>
				) : null}
			</div>
			<div
				className={`ml-[-15px] mt-[14px]  ${
					!listBrandSearch.length ? 'text-center	' : 'flex flex-wrap'
				}`}
			>
				{listBrandSearch.length ? (
					listBrandSearch.map((brand: IFilterBrand, index: number) => {
						if (index < numLimitBrand) {
							const pos = listChecked.some((item) => brand.getId() === item.id);
							pos && console.log(brand.getId());

							return (
								<CircleCard
									key={index}
									image={brand.value ? brand.value : '/static/images/category-dress.png'}
									checked={pos}
									styles={{
										marginLeft: 15,
										width: `calc(20% - 15px)`,
										marginBottom: 16,
									}}
									clickHandle={() => {
										onSelect &&
											onSelect({
												id: brand?.getId(),
												label: brand?.getName(),
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
					})
				) : (
					<span className='text-[#F05A94]'>Không có dữ liệu</span>
				)}
			</div>
			{listBrandSearch?.length && numLimitBrand < listBrandSearch?.length ? (
				<div
					className='flex items-center justify-center'
					onClick={(e) => {
						e.stopPropagation();
						setNumLimitBrand(numLimitBrand + listBrand.length - numLimitBrand);
					}}
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
