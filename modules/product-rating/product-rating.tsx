import classNames from 'classnames';
import { ImageCustom } from 'components';
import { MODE_RUNNER } from 'enums';
import { IProductDetailProps } from 'models';
import { NextPage } from 'next';
import React from 'react';

import { Rating } from '@/components/index';

interface IFilterProps {
	name: string;
	typeFilter: number;
	onFilter: React.MouseEventHandler;
	className: string;
}

const ProductRating: NextPage<IProductDetailProps> = ({ productDetails, ratingStar, mode }) => {
	const DATA_RATING: any = [
		{
			isRating: 5,
			nameRating: '5 sao',
		},
		{
			isRating: 4,
			nameRating: '4 sao',
		},
		{
			isRating: 3,
			nameRating: '3 sao',
		},
		{
			isRating: 2,
			nameRating: '2 sao',
		},
		{
			isRating: 1,
			nameRating: '1 sao',
		},
		{
			isRating: 0,
			isSelected: [
				{
					name: 'Mới nhất',
					value: 10,
				},
				{
					name: 'Cũ nhất',
					value: 11,
				},
			],
			nameRating: '1 sao',
		},
	];

	const RenderFilterBlock: React.FC<IFilterProps> = ({
		name,
		typeFilter,
		onFilter,
		className,
		...rest
	}) => {
		return (
			<button
				className={classNames([
					'border-[#E0E0E0] hover:border-FB6E2E animation-300 border rounded-[3px] text-center p-2 text-13 font-sfpro font-light flex',
					className,
				])}
				onClick={onFilter}
				{...rest}
			>
				{typeFilter !== 0 ? (
					<React.Fragment>
						<div className='flex items-center'>
							{[...new Array(typeFilter)].map((_, index: number) =>
								index < +typeFilter ? (
									<div className='relative h-4 w-[15px]' key={index}>
										<img className='mr-1' src='/static/svg/star-product.svg' alt='star' />
									</div>
								) : (
									<div className='relative h-4 w-[15px]' key={index}>
										<img src='/static/svg/star_nobg.svg' alt='star background' />
									</div>
								),
							)}
						</div>
						<span className='ml-1.5 block'>{name}</span>
					</React.Fragment>
				) : (
					<div className='group'>
						<div className='relative flex flex-auto cursor-pointer items-center justify-center'>
							<div className='relative h-4 w-5'>
								<ImageCustom src={'/static/svg/Sort.svg'} alt='heart vuivui' layout='fill' />
							</div>
							<span className='ml-1.5 block text-14'>Mới nhất</span>

							<div className='animation-300 invisible absolute top-[120%] z-10 w-full rounded-md border border-[#E0E0E0] bg-white text-center opacity-0 shadow-md group-hover:visible group-hover:opacity-100'>
								<div className='mx-3 inline-block border-b border-[#E0E0E0] py-2'>Mới nhất</div>
								<div className='px-3 py-2'>Cũ nhất</div>
							</div>
							<div className='relative ml-2 h-2 w-3'>
								<ImageCustom
									src={'/static/svg/chevron-down-333333-2.svg'}
									alt='heart vuivui'
									layout='fill'
								/>
							</div>
						</div>
					</div>
				)}
			</button>
		);
	};

	return (
		<div className='relative mt-6 mb-4'>
			<div className='flex items-center justify-between pb-3'>
				<div className='font-sfpro_bold text-20 font-bold  uppercase'>
					Đánh giá của người mua ({ratingStar?.total || 0})
				</div>
				<button
					className={classNames([
						'bg-pink-F05A94 text-16 font-normal animation-300 leading-6 text-center px-4 py-2 text-white rounded-[3px] font-sfpro',
						[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!)
							? 'pointer-events-none'
							: 'cursor-pointer hover:bg-opacity-80',
					])}
				>
					Đánh giá
				</button>
			</div>
			<div className='px-3 pt-2.5'>
				<div className='flex'>
					<div className='flex flex-col items-center border-r border-E0ECF8 pr-4'>
						<span className='font-sfpro_bold text-4xl font-extrabold'>
							{productDetails.averageRating || 0}
						</span>
						<div className='mt-1 flex items-center pr-1.5'>
							<Rating typeRating='multiple' value={productDetails.averageRating} />
						</div>
						<span className='mt-2 text-14 text-slate-300'>{ratingStar?.total || 0} Đánh giá</span>
					</div>
					<div className='flex flex-auto flex-col'>
						{ratingStar
							? ratingStar?.detail
									.sort((a: any, b: any) => b.ratingStar - a.ratingStar)
									.map((rating: any, i: number) => (
										<div className='mt-1 flex items-center pl-4' key={i}>
											<Rating typeRating='multiple' value={rating.ratingStar} />
											<span className='relative ml-4 block h-2 flex-auto overflow-hidden rounded-full bg-E0ECF8'>
												<span
													style={{
														width: `${(rating.sumStar / ratingStar.total) * 100}%`,
													}}
													className={classNames(['absolute left-0 top-0 bg-666666 h-2'])}
												></span>
											</span>
											<span className='pl-4 font-sfpro_semiBold text-14 font-semibold text-dark-9F9F9F'>
												{rating.sumStar}
											</span>
										</div>
									))
							: ''}
					</div>
				</div>
			</div>
			<div className='mt-4'>
				<div className='font-sfpro_semiBold text-14 font-semibold'>Lọc theo:</div>
				<div
					className={classNames([
						'flex flex-wrap flex-auto',
						[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!) &&
							'pointer-events-none',
					])}
				>
					{DATA_RATING.map((item: any, i: number) => (
						<RenderFilterBlock
							name={item.nameRating}
							typeFilter={item.isRating}
							onFilter={() => {
								// console.log('id', item.nameRating);
							}}
							key={i}
							className='mr-1.5 mt-1.5 last-of-type:mr-0'
						/>
					))}
				</div>
			</div>
			{/* user write their comment */}
			<div className='relative mt-4'>
				{/* <div
					className='rounded-md overflow-hidden'
					style={{ border: '1px solid rgba(0,0,0,0.12)' }}
				>
					<input
						type='text'
						className='py-2.5 px-3 text-black text-opacity-60 outline-none w-9/12'
						placeholder='Đặt câu hỏi về sản phẩm'
					/>
					<div className='flex absolute top-2/4 right-0 pr-4 transform translate-x-0 -translate-y-2/4 h-full'>
						<div className='pr-[20px]  mr-2 cursor-pointer relative'>
							<ImageCustom src='/static/svg/icon-picture-dark.svg' alt='icon-smile' layout='fill' />
						</div>
						<div className='pr-[20px]  mr-2 cursor-pointer relative'>
							<ImageCustom src='/static/svg/icon-smile-dark.svg' alt='iconPicture' layout='fill' />
						</div>
						<div className='pr-[20px] cursor-pointer relative'>
							<ImageCustom
								src='/static/svg/icon-send-message-dark.svg'
								alt='iconMessage'
								layout='fill'
							/>
						</div>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default ProductRating;
