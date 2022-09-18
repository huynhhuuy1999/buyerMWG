import { CSSProperties } from 'react';

interface IDistributorCard {
	avatar?: string;
	name?: string;
	numStar?: number;
	numRate?: number;
	className?: string;
	classImage?: string;
	classDescription?: string;
	width?: string | number;
	height?: number | string;
	styles?: CSSProperties;
	stylesImage?: CSSProperties;
}

const DistributorCard: React.FC<IDistributorCard> = ({
	avatar,
	name,
	numStar,
	numRate,
	className,
	classDescription,
	classImage,
	height,
	width,
	styles,
	stylesImage,
}) => {
	return (
		<div
			className={`border border-E7E7E8 p-6px rounded-md flex bg-white h-full ${
				className || ''
			} w-314px`}
			style={{ width, height, ...styles }}
		>
			<div className='relative'>
				<img
					loading='lazy'
					src={avatar}
					alt=''
					className={`h-28 w-28 rounded-full object-cover ${classImage}`}
					style={{ ...stylesImage }}
				/>
				<div className='absolute bottom-0 flex w-full justify-center'>
					<div className='relative flex h-17px w-70px items-center justify-center rounded-20px bg-4834D6'>
						<img
							loading='lazy'
							src='/assets/images/logo.png'
							alt=''
							className='absolute -left-1 h-17px w-17px'
						/>
						<span className='ml-2 text-xs font-medium text-white'>Đảm bảo</span>
					</div>
				</div>
			</div>
			<div className='ml-3 mt-9px'>
				<span
					className={`text-272728 font-semibold text-20 line-clamp-1 max-w-160px ${classDescription}`}
				>
					{name}
				</span>
				<div className='flex items-center'>
					<img loading='lazy' src='/assets/images/icons/star.svg' alt='' />
					<span className='ml-6px text-16'>{`${numStar} (${numRate})`}</span>
				</div>
				<div className='cursor-pointer pt-4 text-16 text-4834D6'>Xem chi tiết shop</div>
			</div>
		</div>
	);
};

export default DistributorCard;
