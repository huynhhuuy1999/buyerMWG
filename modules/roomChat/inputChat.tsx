import classNames from 'classnames';
import { ImageCustom, Spin } from 'components';
import { EmptyImage, REGEX_IMAGE } from 'constants/';
import { Content, Conversation } from 'models';
import React from 'react';
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form';
import InputEmoji from 'react-input-emoji';

import styles from '@/styles/chat.module.scss';
interface IInputChatProps {
	onSubmit: SubmitHandler<any>;
	replyTo?: Content;
	roomInfo: Conversation;
	isUploading: boolean;
	mediaFile?: string[];
	prevImageFile: (string | undefined)[];
	handleDeletedImage: Function;
	handleUploadImage: Function;
	handleTyping: (text: string) => void;
	handleReplyMessage: (replyTo?: Content) => void;
}
const InputChat: React.FC<IInputChatProps> = ({
	onSubmit,
	replyTo,
	roomInfo,
	isUploading,
	mediaFile,
	prevImageFile,
	handleDeletedImage,
	handleUploadImage,
	handleTyping,
	handleReplyMessage,
}) => {
	const { control, handleSubmit } = useFormContext();
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{replyTo && replyTo.msg_id && (
				<div className='relative w-full border-t bg-white p-2'>
					<div className='w-full text-sm font-medium'>
						{roomInfo.participate_user_id === replyTo.sender
							? 'Đang trả lời chính mình'
							: `Đang trả lời ${roomInfo.name}`}
					</div>
					{replyTo.event_type && replyTo.event_type === 'Message' ? (
						<div className='w-full text-xs font-thin'>{replyTo.content}</div>
					) : (
						<div className='w-full text-xs font-thin'>[Hình ảnh]</div>
					)}
					<div
						className='absolute top-2 right-1'
						role='button'
						tabIndex={0}
						onClick={() => handleReplyMessage({})}
						onKeyPress={() => handleReplyMessage({})}
					>
						<ImageCustom width={16} height={16} src='/static/svg/Close.svg' />
					</div>
				</div>
			)}
			<div className='bottom-0 border-none py-1'>
				{!isUploading ? (
					mediaFile && (
						<div className='flex max-h-20 max-w-xs flex-row items-start justify-start space-x-1 overflow-x-auto overscroll-x-contain'>
							{mediaFile.map((item, index) => (
								<div className='relative h-20 w-16' key={index}>
									<div className='h-16 w-16 rounded-xl bg-gray-300'>
										<ImageCustom
											loading='lazy'
											width={64}
											height={64}
											key={index}
											src={item && REGEX_IMAGE.test(item) ? item : EmptyImage}
										/>
									</div>
									<div
										className='absolute top-0 right-0 z-10 cursor-pointer'
										tabIndex={0}
										role='button'
										onClick={() => handleDeletedImage(item)}
										onKeyPress={() => handleDeletedImage(item)}
									>
										<ImageCustom width={20} height={20} src='/static/svg/closeCircle.svg' />
									</div>
								</div>
							))}
						</div>
					)
				) : (
					<div className='flex max-h-20 max-w-xs flex-row items-start justify-start space-x-1 overflow-x-auto overscroll-x-contain'>
						{prevImageFile.map((item, index) => (
							<div className='relative w-16 rounded-xl bg-gray-300' key={index}>
								<div className='h-16 w-16'>
									<ImageCustom
										width={64}
										height={64}
										key={index}
										src={item && REGEX_IMAGE.test(item) ? item : EmptyImage}
									/>
								</div>
								<div className='absolute top-5 right-5 cursor-pointer'>
									<Spin className='w-full' />
								</div>
							</div>
						))}
					</div>
				)}
				<div
					className={classNames([
						styles.chat_input_emoji,
						'flex w-full items-center justify-between space-x-1 p-1',
					])}
				>
					<Controller
						control={control}
						name='content'
						render={({ field }) => (
							<InputEmoji
								{...field}
								onChange={(event: any) => {
									field.onChange(event);
									handleTyping(event);
								}}
								onEnter={handleSubmit(onSubmit)}
								cleanOnEnter
								borderColor={'border-none'}
								placeholder='Aa'
							/>
						)}
					/>
					<span className='relative flex h-6 w-6 cursor-pointer flex-col hover:border-gray-100 hover:bg-gray-100'>
						<ImageCustom
							priority
							className='w-auto'
							layout='fill'
							src={'/static/svg/file-image.svg'}
						/>
						<input
							type='file'
							onChange={(event) => handleUploadImage(event)}
							multiple
							className='w-6 opacity-0'
						/>
					</span>
					<div
						className='relative flex h-8 w-8 cursor-pointer flex-col hover:border-gray-100 hover:bg-gray-100'
						tabIndex={0}
						role='button'
						onClick={() => handleSubmit(onSubmit)}
						onKeyPress={() => handleSubmit(onSubmit)}
					>
						<ImageCustom
							priority
							className='w-auto'
							layout='fill'
							src={'/static/svg/icon_SendMessage.svg'}
						/>
						<input type='submit' className='w-6 opacity-0' />
					</div>
				</div>
			</div>
		</form>
	);
};
export default InputChat;
