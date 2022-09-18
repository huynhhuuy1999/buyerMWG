import { CategoryProductCard, CheckCard } from 'components';
import React from 'react';
import { Icon, IconEnum } from 'vuivui-icons';
import { Slider } from 'vuivui-slider';

interface IListCategorySuggestBrand {}

export const ListCategorySuggestBrand: React.FC<IListCategorySuggestBrand> = ({}) => {
	const settings = {
		dots: false,
		infinite: false,
		slidesToShow: 14,
		slidesToScroll: 14,
		arrows: true,
		className: 'mb-0',
		nextArrow: () => (
			<div className='absolute right-3 top-[-14px] flex h-[35px] w-[35px] items-center justify-center rounded-full border border-E7E7E8 bg-white'>
				<Icon name={IconEnum.CaretRight} size={22} />
			</div>
		),
		autoplay: false,
		prevArrow: () => (
			<div className='absolute left-3 top-[-14px] flex h-[35px] w-[35px] items-center justify-center rounded-full border border-E7E7E8 bg-white'>
				<Icon name={IconEnum.CaretLeft} size={22} />
			</div>
		),
	};

	return (
		<div className='container py-4'>
			<Slider {...settings}>
				{[...new Array(25)].map((item, index) => (
					<CheckCard
						checked
						className='mr-10px h-[107px] w-[66px] rounded-3px outline-1 '
						key={index}
					>
						<CategoryProductCard
							type='CATEGORY_PRODUCT_HOMEPAGE'
							image='	https://testcdn.vuivui.com/category/dien-thoai-cac-loai.png'
							description='Điện thoại các loại'
							classDescription='!text-12'
						/>
					</CheckCard>
				))}
			</Slider>
		</div>
	);
};
