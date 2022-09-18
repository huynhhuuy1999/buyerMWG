import { ImageCustom } from 'components';
import React from 'react';
interface IHeaderActionChatProps {
	isSearch: boolean;
	setIsSearch: Function;
}
const HeaderActionChat: React.FC<IHeaderActionChatProps> = ({ isSearch, setIsSearch }) => {
	return (
		<div className='relative flex items-center border-b border-gray-300 p-2'>
			<div className='justify-left flex w-1/4 items-center'>
				<span className='ml-2 block cursor-pointer font-bold text-white'>
					<ImageCustom
						priority
						className='w-auto'
						width={24}
						height={24}
						src={'/static/svg/fluent_call-20-regular.svg'}
					/>
				</span>
				<span className='ml-2 block cursor-pointer font-bold text-white'>
					<ImageCustom
						priority
						className='w-auto'
						width={24}
						height={24}
						src={'/static/svg/clarity_video-camera-line.svg'}
					/>
				</span>
			</div>
			<div className='flex w-1/2 items-center justify-center'>
				{isSearch && (
					<input
						type='text'
						placeholder='Search'
						className='block w-full border-none focus:text-gray-700 focus:outline-none'
						name='Search'
						required
					/>
				)}
			</div>
			<div className='flex w-1/4 items-center justify-end'>
				<span
					className='ml-2 block cursor-pointer font-bold text-white'
					tabIndex={0}
					role='menu'
					onKeyPress={() => setIsSearch(!isSearch)}
					onClick={() => setIsSearch(!isSearch)}
				>
					<ImageCustom
						priority
						className='w-auto'
						width={24}
						height={24}
						src={isSearch ? '/static/svg/Close.svg' : '/static/svg/searchicon.svg'}
					/>
				</span>
				<span className='ml-2 block cursor-pointer font-bold text-white'>
					<ImageCustom
						priority
						className='w-auto'
						width={20}
						height={20}
						src={'/static/svg/carbon_overflow-menu-vertical.svg'}
					/>
				</span>
			</div>
		</div>
	);
};
export default HeaderActionChat;
