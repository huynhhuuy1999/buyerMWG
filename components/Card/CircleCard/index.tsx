import { ImageCustom } from 'components';
import { useAppSelector } from 'hooks';
import Link from 'next/link';
import { CSSProperties } from 'react';

import { isIOSDeviceSelector } from '@/store/reducers/appSlice';

export enum CircleCardType {
	service = 'service',
	brand = 'brand',
}
interface ICircleCard {
	value?: any;
	description?: string;
	image: string;
	discountPercent?: number;
	className?: string;
	classImage?: string;
	width?: number | string;
	height?: number | string;
	styles?: CSSProperties;
	checked?: boolean; // đã tick vào nhãn hàng
	clickHandle?: (value: any) => void;
	iconCheck?: boolean;
	type?: CircleCardType;
	path?: string;
	onClick?: () => void;
	isMobile?: boolean;
}
const CircleCard: React.FC<ICircleCard> = (props) => {
	const {
		value,
		description,
		classImage,
		image,
		discountPercent = 0,
		className,
		width,
		height,
		styles,
		checked,
		clickHandle,
		iconCheck,
		type = CircleCardType.brand,
		path = '#',
		onClick,
		isMobile,
	} = props || {};

	const isIOSDevice = useAppSelector(isIOSDeviceSelector);

	return (
		<>
			{path !== '#' ? (
				<Link href={path} passHref>
					<a
						title={description}
						onClick={() => onClick && onClick()}
						onKeyPress={() => {}}
						tabIndex={0}
						role='button'
					>
						<div
							className={`md:flex md:flex-col md:items-center cursor-pointer md:border-none rounded-full md:rounded-none ${
								className || ''
							}`}
							style={{ width, ...styles }}
						>
							<div
								className='relative'
								onClick={() => {
									if (clickHandle) clickHandle(value);
								}}
								onKeyPress={() => {
									if (clickHandle) clickHandle(value);
								}}
								tabIndex={0}
								role='button'
								style={{ width, height }}
							>
								<div
									style={{ width: width, height: height }}
									className={`animation-200 rounded-full border-4 ${
										checked ? 'border-4834D6' : 'border-E7E7E8'
									} hover:border-gray-200 ${classImage}`}
								>
									<ImageCustom
										loading='lazy'
										className='rounded-full object-cover'
										src={image}
										alt=''
										width={width}
										height={height}
									/>
								</div>
								{discountPercent > 0 && type !== CircleCardType.service && (
									<div className='hidden justify-center md:flex'>
										<div className='absolute -bottom-2 m-auto h-23px w-45px rounded-md bg-4834D6 text-center font-bold text-white'>
											-{discountPercent}%
										</div>
									</div>
								)}
								{iconCheck && checked && (
									<div className='absolute bottom-0 right-2 flex h-15px w-15px items-center justify-center rounded-full border-2px border-white bg-primary-009ADA'>
										<ImageCustom src={'/static/svg/iconCheck.svg'} width={7} height={4} />
									</div>
								)}
							</div>
							<span className='mt-4 hidden text-16 text-6E6E70 md:block'>{description}</span>
						</div>
					</a>
				</Link>
			) : (
				<div
					className={`md:flex md:flex-col md:items-center cursor-pointer md:border-none rounded-full md:rounded-none ${
						className || ''
					}`}
					style={{ width, ...styles }}
				>
					<div
						className='relative'
						onClick={() => {
							if (clickHandle) clickHandle(value);
						}}
						onKeyPress={() => {
							if (clickHandle) clickHandle(value);
						}}
						tabIndex={0}
						role='button'
						style={{ width, height }}
					>
						<div
							style={{ width: width, height: height }}
							className={`relative animation-200 rounded-full border-4 ${
								checked ? 'border-4834D6' : 'border-E7E7E8'
							} hover:border-gray-200 ${classImage}`}
						>
							<ImageCustom
								src={image}
								width={width ? Number(width) - 8 : width}
								height={Number(height) - 8}
								alt=''
								quality={isIOSDevice ? 100 : 75}
								priority
								objectFit='cover'
								className='rounded-full top-0 left-0'
								layout={isMobile ? 'fill' : 'responsive'}
							/>
						</div>
						{discountPercent > 0 && type !== CircleCardType.service && (
							<div className='hidden justify-center md:flex'>
								<div className='absolute -bottom-2 m-auto h-23px w-45px rounded-md bg-4834D6  text-center font-sfpro_semiBold text-white'>
									-{discountPercent}%
								</div>
							</div>
						)}
						{iconCheck && checked && (
							<div className='absolute bottom-0 right-2 flex h-15px w-15px items-center justify-center rounded-full border-2px border-white bg-[#F05A94]'>
								<ImageCustom
									src={'/static/svg/iconCheck.svg'}
									width={8}
									height={7}
									priority
									alt='vuivui iconcheck'
								/>
							</div>
						)}
					</div>
					<span className='mt-4 hidden text-16 text-6E6E70 md:block'>{description}</span>
				</div>
			)}
		</>
	);
};

export default CircleCard;
