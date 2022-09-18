import { ImageCustom } from 'components';
import { memo } from 'react';
import { Icon, IconEnum } from 'vuivui-icons';

interface IProps {
	item: any;
	index: number;
	handleDeleteMedia: (url: string, key: number) => void;
	handleShowMedia: (index: number) => void;
}
const ShowMedia: React.FC<IProps> = ({ item, handleDeleteMedia, handleShowMedia, index }) => {
	return (
		<label className='relative m-2 flex h-[80px] w-[80px] flex-col rounded  border border-dashed'>
			{item?.type !== 'mp4' ? (
				<div
					className='flex cursor-pointer flex-col items-center justify-center'
					onClick={() => handleShowMedia(index)}
					aria-hidden='true'
				>
					<ImageCustom
						className='block h-[80px] w-[80px]'
						src={item?.url}
						width={80}
						height={80}
						alt='test vui vui'
					></ImageCustom>
				</div>
			) : (
				<div
					className='relative flex h-[80px] w-[80px] cursor-pointer flex-col items-center justify-center'
					onClick={() => handleShowMedia(index)}
					aria-hidden='true'
				>
					<iframe className='block h-[80px] w-[80px]' src={item?.url} title='video' />
					<div className='z-2 absolute h-[25px] w-[25px]'>
						<ImageCustom
							src='/static/svg/play-icon.svg'
							width={25}
							height={25}
							alt='play icon vuivui'
						/>
					</div>
					<div className='z-3 absolute h-[80px] w-[80px] bg-[rgba(255,255,255, 0.7)]'></div>
				</div>
			)}

			<div
				onClick={() => handleDeleteMedia(item?.url, 1)}
				onKeyPress={() => {}}
				role='button'
				tabIndex={0}
				className='absolute right-[-10px] top-[-10px] flex h-5 w-5 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(143,155,179,0.7)]'
			>
				<Icon name={IconEnum.X} size={12} fill='red' strokeWidth={1} />
			</div>
		</label>
	);
};
export default memo(ShowMedia);
