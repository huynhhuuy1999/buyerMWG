import classNames from 'classnames';
import React from 'react';

import { EmptyImage } from '../constants';

export enum CardType {
	circle = 'circle',
	square = 'square',
	productCardLayout = 'product-card-layout',
}
export interface SkeletonProps {
	lines?: number;
	type?: 'image' | 'avatar' | 'comment' | 'text' | 'card' | 'cardRow' | 'product-card-layout';
	cardType?: CardType;
	width?: number | string;
	height?: number | string;
	isDescription?: boolean;
	center?: boolean;
	isBorder?: boolean;
	className?: string;
	classNameImg?: string;
}

export const Skeleton = (props: SkeletonProps) => {
	const {
		lines = 2,
		type = 'avatar',
		cardType = CardType.square,
		width,
		height,
		isDescription,
		center,
		isBorder = true,
		className,
		classNameImg = '',
	} = props;

	const SkeletonLine = () =>
		lines > 2 ? (
			<div className='w-full space-y-3'>
				{[...new Array(lines - 1)].map((_, index) => (
					<div
						key={index}
						className='h-5 w-full animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 '
					/>
				))}
				<div className='h-5 w-2/3 animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ' />
			</div>
		) : (
			<div className='w-full space-y-3'>
				{[...new Array(2)].map((_, index) => (
					<div
						key={index}
						className='h-5 w-full animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 '
					/>
				))}
				<div className='h-5 w-2/3 animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ' />
			</div>
		);

	return (
		<div
			className={`min-h-fit w-full items-center ${
				center ? 'flex justify-center' : ''
			} ${className} `}
		>
			{type === 'card' && (
				<div className='flex flex-col items-center'>
					<img
						alt=''
						src={EmptyImage}
						className={classNames(
							cardType === CardType.circle
								? 'rounded-full'
								: isBorder
								? 'rounded-md'
								: 'rounded-none',
							classNameImg,
						)}
						style={{ width, height }}
					/>
					{isDescription && (
						<div className='flex flex-col' style={{ width }}>
							{lines > 1 ? (
								[...Array(lines)].map((_, key) =>
									key < lines - 1 ? (
										<div
											key={key}
											style={{ width: width }}
											className=' mt-2 h-5 animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'
										/>
									) : (
										<div
											key={key}
											style={{ width: '66%' }}
											className=' mt-2 h-5 animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'
										/>
									),
								)
							) : (
								<div
									style={{ width: width }}
									className=' mt-2 h-5 animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'
								/>
							)}
						</div>
					)}
				</div>
			)}
			{type === 'cardRow' && (
				<div className='flex items-start justify-between'>
					<img
						alt=''
						src={EmptyImage}
						className={`${
							cardType === CardType.circle ? 'rounded-full' : 'rounded-none'
						} bg-[#f1f1f1]`}
						style={{ width: width, height: height }}
					/>
					{/* <img
						alt=''
						src={EmptyImage}
						className={`${
							cardType === CardType.circle
								? 'rounded-full'
								: isBorder
								? 'rounded-md'
								: 'rounded-none'
						} `}
						style={{ width: width, height: height }}
					/> */}
					{isDescription && (
						<div className='flex flex-col px-2' style={{ width }}>
							{lines > 1 ? (
								[...Array(lines)].map((_, key) =>
									key < lines - 1 ? (
										key === 0 ? (
											<div
												key={key}
												style={{ width: width }}
												className='h-5 animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'
											/>
										) : (
											<div
												key={key}
												style={{ width: width }}
												className=' mt-2 h-5 animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'
											/>
										)
									) : (
										<div
											key={key}
											style={{ width: '66%' }}
											className=' mt-2 h-5 animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'
										/>
									),
								)
							) : (
								<div
									style={{ width: width }}
									className='h-5 animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'
								/>
							)}
						</div>
					)}
				</div>
			)}
			{type === 'avatar' && (
				<div className='flex h-full w-full flex-row items-start justify-center space-x-5'>
					<img alt='' src={EmptyImage} className='w-full h-full min-w-[48px]' />
					<SkeletonLine />
				</div>
			)}
			{type === 'comment' && (
				<div className='flex h-full w-full flex-row items-start justify-center space-x-5'>
					<SkeletonLine />
				</div>
			)}
			{type === 'image' && <img alt='' src={EmptyImage} className='w-full h-full' />}
			{type === 'text' && (
				<div className='h-5 w-full animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ' />
			)}
			{/* {type === 'product-card-layout' && (
				<div style={{ width, height }}>
					<div
						className={`${
							isMobile ? 'h-[200px]' : 'h-[270px]'
						}  aspect-square w-full animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 `}
					/>
					<div className='h-5 mt-3 w-full animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ' />
					<div className='h-5 mt-3 w-[80%] animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ' />
					<div className='h-5 mt-3 w-[60%] animate-pulse rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ' />
				</div>
			)} */}
		</div>
	);
};

export default Skeleton;
