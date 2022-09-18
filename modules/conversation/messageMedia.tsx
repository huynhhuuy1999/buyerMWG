import classNames from 'classnames';
import { ImageCustom } from 'components';
import React, { Fragment, useState } from 'react';

import { EmptyImage, REGEX_IMAGE } from '@/constants/index';
import { Content, Reaction, Users } from '@/models/chat';
import { checkTypeMedia } from '@/utils/convertTime';

import MessageAnswer from './messageAnswer';

interface IMediaProps {
	title?: string;
	content: Content;
	listUserChat: Users[];
	status: boolean;
	isCheckAvt: boolean;
	isLastMessage: boolean;
	handleReplyMessage: (content: Content) => void;
	onReaction: (content: Content) => void;
	reaction: Reaction[];
	timeLine?: string | null;
}

const MessageMedia: React.FC<IMediaProps> = ({
	title,
	content,
	listUserChat,
	isCheckAvt,
	isLastMessage,
	handleReplyMessage,
	onReaction,
	status,
	reaction,
	timeLine,
}: IMediaProps) => {
	const media: string[] = content.media_url ? content.media_url : [];
	const sender = listUserChat.find((item) => item.id === content.sender);
	const renderMediaFile = (urlMedia: string) => {
		const type = checkTypeMedia(urlMedia);
		switch (type.split('/')[0]) {
			case 'video':
				return (
					<video controls className='max-h-[284px] max-w-[284px] rounded-lg border'>
						<source className='max-h-[280px] max-w-[284px] px-6' src={urlMedia} type={type} />
						<track src='' kind='captions' label='english_captions'></track>
					</video>
				);
			case 'image':
				return (
					<ImageCustom
						width={media.length > 2 ? 126 : 378 / media.length}
						height={media.length > 2 ? 126 : 378 / media.length}
						src={urlMedia && REGEX_IMAGE.test(urlMedia) ? urlMedia : EmptyImage}
					/>
				);
			case 'application':
				return <>'File Office'</>;
			default:
				return <>temp</>;
		}
	};
	const MyMedia: React.FC = () => {
		const [isShow, setIsShow] = useState<boolean>(false);

		return (
			<div
				className={classNames([
					sender ? 'grid grid-cols-11 gap-1' : 'flex items-end justify-end',
					'p-1',
				])}
				role='none'
				title={title}
				onMouseLeave={() => setIsShow(false)}
				onMouseEnter={() => setIsShow(true)}
			>
				<div
					className='mr-3 flex w-[50%] justify-end text-10 font-normal not-italic leading-1.3 tracking-0.0025em text-666666'
					title={timeLine ? timeLine : ''}
				>
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
								onClick={() => handleReplyMessage(content)}
								src={'/static/svg/share_comment.svg'}
								className='cursor-pointer'
							/>
						</div>
						<div className='cursor-pointer'>
							<ImageCustom
								width={14}
								height={14}
								onClick={() => onReaction(content)}
								src={'/static/svg/heart.svg'}
								className='cursor-pointer'
							/>
						</div>
					</div>
				</div>
				<div className='relative rounded-lg bg-F5F5F5'>
					{content.reply_to && content.reply_to !== '00000000-0000-0000-0000-000000000000' && (
						<div className='rounded-t-md border-b-[1px] border-gray-100 bg-[#F05A94] text-white'>
							<MessageAnswer
								messageId={content.reply_to}
								listUserChat={listUserChat}
								senderId={content.sender || ''}
							/>
						</div>
					)}
					<div
						className={classNames([
							sender ? 'justify-start' : 'justify-end',
							'flex items-center flex-grow flex-row flex-wrap',
						])}
					>
						{media.map((urlMedia, index) => (
							<Fragment key={index}>{renderMediaFile(urlMedia)}</Fragment>
						))}
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

	const FriendMedia: React.FC = () => {
		const [isShow, setIsShow] = useState<boolean>(false);
		return (
			<div
				className={classNames([
					sender ? 'grid grid-cols-11 gap-1' : 'flex items-end justify-end',
					'p-1',
				])}
				role='none'
				title={title}
				onMouseLeave={() => setIsShow(false)}
				onMouseEnter={() => setIsShow(true)}
			>
				<div className='col-span-1 col-start-1'>
					{!isCheckAvt && (
						<ImageCustom
							width={48}
							height={48}
							className='rounded-full'
							src={sender?.avatar && REGEX_IMAGE.test(sender?.avatar) ? sender?.avatar : EmptyImage}
						/>
					)}
				</div>
				<div className='col-span-11 col-start-2'>
					<div className='flex items-end space-x-2' title={timeLine ? timeLine : ''}>
						<div className='text-sm font-semibold not-italic leading-normal tracking-0.0025em text-black'>
							<div className={classNames([isCheckAvt ? 'hidden' : 'text-14 pb-1 text-red-400'])}>
								{sender?.name}
							</div>
							<div className='relative rounded-lg bg-F5F5F5'>
								{content.reply_to && content.reply_to !== '00000000-0000-0000-0000-000000000000' && (
									<div className='border-b-[1px] border-gray-100 bg-[#F05A94] text-666666'>
										<MessageAnswer
											messageId={content.reply_to}
											listUserChat={listUserChat}
											senderId={content.sender || ''}
										/>
									</div>
								)}
								<div
									className={classNames([
										sender ? 'justify-start' : 'justify-end',
										'flex items-center flex-grow flex-row flex-wrap',
									])}
								>
									{media.map((urlMedia, index) => (
										<Fragment key={index}>{renderMediaFile(urlMedia)}</Fragment>
									))}
								</div>
								{reaction && reaction.length > 0 && (
									<div className='absolute -bottom-1 -right-1 h-4'>
										<ImageCustom width={16} height={16} src='/static/svg/heart-red.svg' />
									</div>
								)}
							</div>
						</div>
						<div className='flex w-[60%] items-end text-10 font-normal not-italic leading-1.3 tracking-0.0025em text-666666'>
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
										onClick={() => handleReplyMessage(content)}
										src={'/static/svg/share_comment.svg'}
										className='cursor-pointer'
									/>
								</div>
								<div className='cursor-pointer'>
									<ImageCustom
										width={14}
										height={14}
										onClick={() => onReaction(content)}
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

	return sender ? <FriendMedia /> : <MyMedia />;
};

export default MessageMedia;
