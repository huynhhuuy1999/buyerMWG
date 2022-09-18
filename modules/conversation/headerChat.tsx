import { ImageCustom } from 'components';
import { EmptyImage, REGEX_IMAGE } from 'constants/';
import { Conversation } from 'models';
import React from 'react';

interface IHeaderChatProps {
	isShowMore: boolean;
	setIsShowMore: Function;
	conversation: Conversation;
	handleRoomChat?: Function;
}
const HeaderChat: React.FC<IHeaderChatProps> = ({
	isShowMore,
	setIsShowMore,
	conversation,
	handleRoomChat,
}) => {
	return (
		<div className='relative flex items-center rounded border border-gray-200 bg-[#F05A94] p-2'>
			<div
				className='justify-left grid w-4/5 cursor-pointer grid-cols-5 items-center truncate'
				role='button'
				tabIndex={0}
				onKeyPress={() => setIsShowMore(true)}
				onClick={() => setIsShowMore(true)}
				onBlur={() => setIsShowMore(false)}
			>
				<ImageCustom
					className='col-span-1 h-9 w-9 rounded-full object-cover'
					width={36}
					height={36}
					priority
					src={
						conversation?.avatar && REGEX_IMAGE.test(conversation.avatar)
							? conversation.avatar
							: EmptyImage
					}
					alt={conversation?.name ? conversation?.name : 'unknown-user'}
				/>
				<div className='col-span-4 flex w-full items-center text-sm font-semibold text-white hover:bg-white hover:text-current'>
					<div className='mr-2 block w-full'>
						<div className=' w-full'>
							<span className='block w-full'>{conversation?.name && conversation.name}</span>
						</div>
						<div>
							<span className='block text-xs font-thin'>Đang hoạt động</span>
						</div>
					</div>
					<ImageCustom
						className='w-full justify-end rounded-full object-cover'
						width={12}
						height={12}
						priority
						src='/static/svg/chevron-down-00ADA.svg'
					/>
				</div>
				<span className='absolute left-2 bottom-2 h-3 w-3 rounded-full bg-green-600'></span>
				{isShowMore && (
					<div className='absolute top-12 right-0 z-10 min-h-[200px] w-full rounded-md border border-gray-300 bg-gray-100 p-2 font-light text-gray-800 shadow-md'>
						<div className='flex cursor-pointer items-center space-x-1 rounded p-1 hover:bg-gray-200'>
							<ImageCustom width={18} height={18} src='/static/svg/bold_user_circle.svg' />
							<span>Trang cá nhân</span>
						</div>
						<div className='flex cursor-pointer items-center space-x-1 rounded p-1 hover:bg-gray-200'>
							<ImageCustom width={18} height={18} src='/static/svg/bold_flag_report.svg' />
							<span>Report</span>
						</div>
						<div className='flex cursor-pointer items-center space-x-1 rounded p-1 hover:bg-gray-200'>
							<ImageCustom width={18} height={18} src='/static/svg/bold_ban_circle.svg' />
							<span>Chặn</span>
						</div>
					</div>
				)}
			</div>
			<div className='flex w-1/5 items-center justify-end'>
				<div
					className='ml-2 block cursor-pointer font-bold text-white'
					tabIndex={0}
					role='button'
					onKeyPress={() => handleRoomChat?.(conversation, 3)}
					onClick={() => handleRoomChat?.(conversation, 3)}
				>
					<ImageCustom
						priority
						className='w-6'
						width={16}
						height={16}
						src={'/static/svg/minus-dash.svg'}
					/>
				</div>
				{/* <div className='block ml-2 font-bold text-white cursor-pointer'>
                        <ImageCustom
                            priority
                            className='w-5'
                            width={14}
                            height={14}
                            src={'/static/svg/expand-arrow.svg'}
                        />
                    </div> */}
				<div
					className='ml-2 block cursor-pointer font-bold text-white'
					tabIndex={0}
					role='button'
					onKeyPress={() => handleRoomChat?.(conversation, 2)}
					onClick={() => handleRoomChat?.(conversation, 2)}
				>
					<ImageCustom
						priority
						className='w-6'
						width={16}
						height={16}
						src={'/static/svg/close-icon.svg'}
					/>
				</div>
			</div>
		</div>
	);
};

export default HeaderChat;
