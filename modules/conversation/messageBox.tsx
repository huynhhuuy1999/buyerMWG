import classNames from 'classnames';
import { ImageCustom } from 'components';
import React, { Fragment, useState } from 'react';

import { EmptyImage, REGEX_IMAGE } from '@/constants/index';
import { Content, Reaction, Users } from '@/models/chat';

import MessageAnswer from './messageAnswer';
interface IMessageBoxProps {
	message: Content;
	listUserChat: Users[];
	timeLine?: string | null;
	isCheckAvt: boolean;
	isLastMessage: boolean;
	status: boolean;
	handleReplyMessage: (content: Content) => void;
	onReaction: (content: Content) => void;
	reaction: Reaction[];
}
const MessageBox: React.FC<IMessageBoxProps> = ({
	message,
	listUserChat,
	status,
	isCheckAvt,
	isLastMessage,
	timeLine,
	handleReplyMessage,
	onReaction,
	reaction,
}: IMessageBoxProps) => {
	const sender = listUserChat.find((item) => item.id === message.sender);

	const MyMessage: React.FC = () => {
		const [isShow, setIsShow] = useState<boolean>(false);
		return (
			<div
				className='flex items-end justify-end space-x-2'
				role='menu'
				tabIndex={0}
				onMouseEnter={() => setIsShow(true)}
				onMouseLeave={() => setIsShow(false)}
			>
				<div className='my-1 flex w-[50%] justify-end text-10 font-normal not-italic leading-1.3 tracking-0.0025em text-666666'>
					<div className={classNames([!status && isShow ? 'hidden' : 'block'])}>
						<div className='animate-pulse'>{status && 'Đang gửi...'}</div>
						<div>{!isLastMessage && timeLine}</div>
					</div>
					<div
						className={classNames([!status && isShow ? 'flex' : 'hidden', 'items-end space-x-2'])}
					>
						<div className='cursor-pointer'>
							<ImageCustom
								width={12}
								height={14}
								onClick={() => handleReplyMessage(message)}
								src={'/static/svg/share_comment.svg'}
								className='cursor-pointer'
							/>
						</div>
						<div className='cursor-pointer'>
							<ImageCustom
								width={14}
								height={14}
								onClick={() => onReaction(message)}
								src={'/static/svg/heart.svg'}
								className='cursor-pointer'
							/>
						</div>
					</div>
				</div>
				<div className='relative my-1 rounded-t-xl rounded-l-xl bg-[#F05A94] p-1'>
					{message.reply_to && message.reply_to !== '00000000-0000-0000-0000-000000000000' && (
						<div className='border-b-[1px] border-gray-100 text-white'>
							<MessageAnswer
								messageId={message.reply_to}
								listUserChat={listUserChat}
								senderId={message.sender || ''}
							/>
						</div>
					)}
					<div className='break-all p-2 text-justify  text-sm font-normal not-italic leading-normal tracking-0.0025em text-white'>
						{message?.content}
					</div>
					{reaction && reaction.length > 0 && (
						<div className='absolute -bottom-1 -left-1 h-4'>
							<ImageCustom width={16} height={16} src='/static/svg/heart-red.svg' />
						</div>
					)}
				</div>
			</div>
		);
	};

	const MerchantMessage: React.FC = () => {
		const [isShow, setIsShow] = useState<boolean>(false);
		return (
			<div
				className='grid grid-cols-11 gap-1'
				role='menu'
				tabIndex={0}
				onMouseEnter={() => setIsShow(true)}
				onMouseLeave={() => setIsShow(false)}
			>
				<div className='col-span-1 col-start-1'>
					{!isCheckAvt && (
						<ImageCustom
							width={48}
							height={48}
							className='rounded-full border border-gray-300 bg-gray-300'
							src={sender?.avatar && REGEX_IMAGE.test(sender?.avatar) ? sender?.avatar : EmptyImage}
						/>
					)}
				</div>
				<div className='col-span-10 col-start-2'>
					<div className='flex items-end space-x-2'>
						<div className='relative text-sm font-semibold not-italic leading-normal tracking-0.0025em text-black'>
							<div className={classNames([isCheckAvt ? 'hidden' : 'text-14 text-red-400'])}>
								{sender?.name}
							</div>
							<div className='my-1 rounded-b-2xl rounded-r-2xl bg-white p-1'>
								{message.reply_to && message.reply_to !== '00000000-0000-0000-0000-000000000000' && (
									<div className='border-b-[1px] border-gray-100 text-666666'>
										<MessageAnswer
											messageId={message.reply_to}
											listUserChat={listUserChat}
											senderId={message.sender || ''}
										/>
									</div>
								)}
								<div className='break-all p-2 text-justify text-14 font-normal not-italic leading-normal tracking-0.0025em text-222222'>
									{message?.content}
								</div>
							</div>
							{reaction && reaction.length > 0 && (
								<div className='absolute -bottom-1 -right-1 h-4'>
									<ImageCustom width={16} height={16} src='/static/svg/heart-red.svg' />
								</div>
							)}
						</div>
						<div className='my-1 flex w-[60%] items-end text-10 font-normal not-italic leading-1.3 tracking-0.0025em text-666666'>
							<div className={classNames([!status && isShow ? 'hidden' : 'block'])}>
								<div className='animate-pulse'>{status && 'Đang gửi...'}</div>
								<div>{!isLastMessage && timeLine}</div>
							</div>
							<div
								className={classNames([
									!status && isShow ? 'flex items-start space-x-2' : 'hidden',
								])}
							>
								<div className='cursor-pointer'>
									<ImageCustom
										width={12}
										height={14}
										onClick={() => handleReplyMessage(message)}
										src={'/static/svg/share_comment.svg'}
										className='cursor-pointer'
									/>
								</div>
								<div className='cursor-pointer'>
									<ImageCustom
										width={14}
										height={14}
										onClick={() => onReaction(message)}
										src={'/static/svg/heart.svg'}
										className='cursor-pointer'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderMessager = () => {
		return sender ? <MerchantMessage /> : <MyMessage />;
	};

	return <Fragment>{renderMessager()}</Fragment>;
};

export default MessageBox;
