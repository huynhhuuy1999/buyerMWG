import { memo, useEffect, useState } from 'react';

interface IProps {
	media: any;
	index: number;
	item: any;
	handleShowMedia: (itemChild: any, index: number, key: number) => void;
}
const ShowMedia: React.FC<IProps> = ({ media, item, handleShowMedia, index }) => {
	const [key, setKey] = useState<number>(0);
	useEffect(() => {
		if (media) {
			if (!media.parentCommentId) {
				setKey(1);
			} else setKey(2);
		}
	}, [media]);
	return (
		<label
			onClick={() => handleShowMedia(media, index, key)}
			onKeyPress={() => {}}
			role='none'
			tabIndex={0}
			key={index}
			className='relative my-2 mr-3 flex h-[80px] w-[80px] flex-col  rounded border border-dashed'
		>
			{item?.description !== 'mp4' ? (
				<div className='flex h-full w-full cursor-pointer flex-col items-center justify-center'>
					<img className='block h-full w-full' src={item?.filePath} alt='test vui vui'></img>
				</div>
			) : (
				<div className='relative flex h-[80px] w-[80px] cursor-pointer flex-col items-center justify-center'>
					<iframe className='block h-[80px] w-[80px]' src={item?.filePath} title='video' />
					<div className='z-2 absolute h-[25px] w-[25px]'>
						<img src='/static/svg/play-icon.svg' alt='play icon vuivui' />
					</div>
				</div>
			)}
		</label>
	);
};
export default memo(ShowMedia);
