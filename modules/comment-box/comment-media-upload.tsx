import { ImageCustom } from 'components';
import { memo } from 'react';

interface IProps {
	item: any;
	handleDeleteMedia: (url: string, key: number) => void;
}
const MediaUpload: React.FC<IProps> = ({ item, handleDeleteMedia }) => {
	return (
		<label className='relative m-2 flex h-[80px] w-[80px] flex-col rounded  border border-dashed'>
			{item?.type !== 'mp4' ? (
				<div className='flex cursor-pointer flex-col items-center justify-center'>
					<img className='block h-[80px] w-[80px]' src={item?.url} alt='test vui vui'></img>
				</div>
			) : (
				<div className='relative flex h-[80px] w-[80px] cursor-pointer flex-col items-center justify-center'>
					<iframe className='block h-[80px] w-[80px]' src={item?.url} title='video' />
					<div className='z-2 absolute h-[25px] w-[25px]'>
						<img src='/static/svg/play-icon.svg' alt='play icon vuivui' />
					</div>
				</div>
			)}

			<div
				onClick={() => handleDeleteMedia(item?.url, 1)}
				onKeyPress={() => {}}
				role='button'
				tabIndex={0}
				className='absolute right-[-10px] top-[-10px] flex h-5 w-5 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(143,155,179,0.7)]'
			>
				<ImageCustom src='/static/svg/icon-close-order.svg' alt='close' width={10} height={10} />
			</div>
		</label>
	);
};
export default memo(MediaUpload);
