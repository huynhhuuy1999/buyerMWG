import { TYPE_SEARCH } from 'enums';
import React, { MouseEventHandler, useEffect, useMemo, useRef } from 'react';
import { numberWithCommas } from 'utils';
import { roundNumber } from 'utils/methods';

export interface IFilterPriceMobile {
	className?: string;
	onClickOutside?: MouseEventHandler;
	maxPrice?: number;
	onSelect?: (value: { id?: number | string; label?: string }) => void;
	defaultSelected?: Array<any>;
	title?: string;
	minPrice?: number;
	priceStep?: number;
}

const RANGE_START_DEFAULT = 0;
// const RANGE_END_DEFAULT = 0;

export const FilterPriceMobile: React.FC<IFilterPriceMobile> = ({
	className,
	onClickOutside,
	maxPrice,
	onSelect,
	defaultSelected,
	title,
	minPrice = 0,
	priceStep = 100,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const refSlider1 = useRef<HTMLInputElement>(null);
	const refSlider2 = useRef<HTMLInputElement>(null);
	const refTrack = useRef<HTMLDivElement>(null);
	const refPrice1 = useRef<HTMLDivElement>(null);
	const refPrice2 = useRef<HTMLDivElement>(null);
	const refText1 = useRef<HTMLDivElement>(null);
	const refText2 = useRef<HTMLDivElement>(null);

	const minGap = useMemo(() => {
		if (maxPrice) {
			return Number(maxPrice) * 0.1;
		}
		return 0;
	}, [maxPrice]);

	useEffect(() => {
		if (refSlider1.current && refSlider2.current && refTrack.current && defaultSelected) {
			let filterPrice = defaultSelected?.filter((item) => item.type === TYPE_SEARCH.PRICE);
			let arrPrice: any = [];
			if (filterPrice?.length) {
				arrPrice = filterPrice[0].label?.split('-') || [];
				refSlider1.current.value = arrPrice[0].trim();
				refSlider2.current.value = arrPrice[1].trim();
			} else {
				refSlider1.current.value = `${RANGE_START_DEFAULT}`;
				refSlider2.current.value = `${maxPrice}`;
			}
			slideOne();
			slideTwo();
		}
	}, [refSlider1, refSlider2, refTrack, defaultSelected]);

	const slideOne = () => {
		if (refSlider2.current && refSlider1.current && refPrice1.current && refText1.current) {
			if (parseInt(refSlider2.current.value) - parseInt(refSlider1.current.value) <= minGap) {
				refSlider1.current.value = `${parseInt(refSlider2.current.value) - minGap}`;
			}
			const newValue = Number(
				((Number(refSlider1.current.value) - Number(refSlider1.current.min)) * 100) /
					(Number(refSlider1.current.max) - Number(refSlider1.current.min)),
			);
			const newPosition = -10 - newValue * 0.5;
			if (Number(refSlider1.current.value) > 1000000) {
				let numberRouned = roundNumber(Number(refSlider1.current.value) / 1000000, 2);
				refPrice1.current.innerHTML = `${numberRouned} triệu`;
			} else {
				refPrice1.current.innerHTML = `${numberWithCommas(refSlider1.current.value, '.')}đ`;
			}

			refPrice1.current.style.left = `calc(${newValue}% + (${newPosition}px))`;
			refText1.current.style.left = `calc(${newValue}% + (${newPosition - 20}px))`;

			fillColor();
		}
	};

	const slideTwo = () => {
		if (refSlider2.current && refSlider1.current && refPrice2.current && refText2.current) {
			if (parseInt(refSlider2.current.value) - parseInt(refSlider1.current.value) <= minGap) {
				refSlider2.current.value = `${parseInt(refSlider1.current.value) + minGap}`;
			}
			const newValue = Number(
				((Number(refSlider2.current.value) - Number(refSlider2.current.min)) * 100) /
					(Number(refSlider2.current.max) - Number(refSlider2.current.min)),
			);

			const newPosition = -10 - newValue * 0.5;

			if (Number(refSlider2.current.value) > 1000000) {
				let numberRouned = roundNumber(Number(refSlider2.current.value) / 1000000, 2);
				refPrice2.current.innerHTML = `${numberRouned} triệu`;
			} else {
				refPrice2.current.innerHTML = `${numberWithCommas(refSlider2.current.value, '.')}đ`;
			}

			// refPrice2.current.innerHTML = `${refSlider2.current.value}`;
			refPrice2.current.style.left = `calc(${newValue}% + (${newPosition}px))`;
			refText2.current.style.left = `calc(${newValue}% + (${newPosition - 20}px))`;

			fillColor();
		}
	};

	const fillColor = () => {
		if (refSlider1.current && refSlider2.current && refTrack.current) {
			let percent1 = (Number(refSlider1.current.value) / Number(refSlider1.current.max)) * 100;
			let percent2 = (Number(refSlider2.current.value) / Number(refSlider1.current.max)) * 100;
			refTrack.current.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #F05A94 ${percent1}% , #F05A94 ${percent2}%, #dadae5 ${percent2}%)`;
		}
	};

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

	const handleSelect = () => {
		if (refSlider1.current && refSlider2.current) {
			onSelect &&
				onSelect({
					id: `${refSlider1.current.value}-${refSlider2.current.value}`,
					label: `${refSlider1.current.value} - ${refSlider2.current.value}`,
				});
		}
	};

	return (
		<div className={`bg-white pb-12 border-b border-b-[#F6F6F6] ${className || ''}`} ref={ref}>
			<span className='mb-5 text-16 text-333333'>{title}</span>
			<div className='m-auto flex w-4/5 justify-center'>
				<div className='relative mt-16 w-full'>
					<div className='absolute inset-y-0 m-auto h-4px w-[99%] rounded-[4px]' ref={refTrack} />
					<div className='absolute top-[-45px] min-w-max rounded-sm px-3' ref={refPrice1} />
					<div className='absolute top-[-45px] min-w-max rounded-sm px-3' ref={refPrice2} />
					<div
						className='absolute top-[15px] min-w-max rounded-sm bg-white px-3 text-666666'
						ref={refText1}
					>
						Thấp nhất
					</div>
					<div
						className='absolute top-[15px] min-w-max rounded-sm bg-white px-3 text-666666'
						ref={refText2}
					>
						Cao nhất
					</div>

					<input
						step={priceStep}
						type='range'
						min={minPrice}
						max={maxPrice}
						ref={refSlider1}
						onInput={slideOne}
						onTouchEnd={handleSelect}
						className='rangeInput-mobile pointer-events-none absolute inset-y-0 m-auto w-full appearance-none bg-transparent outline-none'
					/>
					<input
						step={priceStep}
						type='range'
						min={minPrice}
						max={maxPrice}
						onInput={slideTwo}
						onTouchEnd={handleSelect}
						ref={refSlider2}
						className='rangeInput-mobile pointer-events-none absolute inset-y-0 m-auto w-full appearance-none bg-transparent outline-none'
					/>
				</div>
			</div>
		</div>
	);
};

export default FilterPriceMobile;
