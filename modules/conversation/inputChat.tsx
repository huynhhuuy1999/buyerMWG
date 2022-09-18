import classNames from 'classnames';
import { ImageCustom } from 'components';
import { Picker, PickerProps } from 'emoji-mart';
import { CHAT_STATUS, CHAT_TYPE } from 'enums';
import { useAppDispatch } from 'hooks';
import {
	ChatPayload,
	Content,
	Conversation,
	ConversationPayload,
	MessageChat,
	MessagePayload,
	Users,
} from 'models';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { Icon, IconEnum } from 'vuivui-icons';

import Spin from '@/components/spinning';
import { EmptyImage, REGEX_IMAGE, REGEX_VIDEO } from '@/constants/index';
import { useAuth } from '@/hooks/useAuth';
import { LastMessage } from '@/models/chat';
import { uploadMultiFileChatAPI } from '@/services/chat';
import {
	chatAction,
	createConversationRequest,
	sendMessageMediaRequest,
	sendMessageRequest,
	sendTypingRequest,
} from '@/store/reducers/chatSlice';
import { checkTypeMedia } from '@/utils/convertTime';

interface IInputChatProps {
	conversation: Conversation;
	replyTo: Content;
	setReplyTo: (content: Content) => void;
	messageSent: MessageChat[];
	merchant: Users;
	listConversation: Conversation[];
}

interface MediaPreView {
	media_url?: string;
	type?: string;
}

const InputChat: React.FC<IInputChatProps> = ({
	conversation,
	messageSent,
	replyTo,
	merchant,
	setReplyTo,
	listConversation,
}: IInputChatProps) => {
	const EmojiPicker = Picker as unknown as React.FC<PickerProps>;

	const [mediaFile, setMediaFile] = useState<string[]>([]);
	const [lastMessage, setLastMessage] = useState<LastMessage>({});
	const [prevImageFile, setPrevImageFile] = useState<MediaPreView[]>([]);
	const [iconPicker, setIconPicker] = useState<boolean>(false);
	const [isUploading, setIsUploading] = useState<boolean>(false);

	const typingTimeout: { current: NodeJS.Timeout | null } = useRef<NodeJS.Timeout>(null);

	const [countTyping, setCountTyping] = useState<number>(0);

	const emojiRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const mediaRef = useRef<HTMLInputElement>(null);
	const pickerRef = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();

	const { currentUser } = useAuth();

	useEffect(() => {
		if (lastMessage && lastMessage.ConversationId && conversation?.conversation_id) {
			const getConversations = listConversation.filter(
				(item) => item.conversation_id !== conversation.conversation_id,
			);
			if (conversation && conversation.conversation_id) {
				dispatch(
					chatAction.setListConversation([
						{
							...conversation,
							conversation_id: conversation?.conversation_id
								? conversation?.conversation_id
								: lastMessage.ConversationId,
							last_message: lastMessage,
						},
						...getConversations,
					]),
				);
			}
		}
	}, [lastMessage]);

	useEffect(() => {
		setValue('reply_to', replyTo.msg_id);
	}, [replyTo]);

	useEffect(() => {
		const onHandleClickOutside = (event: any) => {
			if (
				emojiRef.current &&
				!emojiRef.current.contains(event.target) &&
				pickerRef.current &&
				!pickerRef.current.contains(event.target) &&
				iconPicker
			) {
				setIconPicker(false);
			}
		};

		document.addEventListener('click', onHandleClickOutside);

		return () => document.removeEventListener('click', onHandleClickOutside);
	}, [iconPicker, pickerRef]);

	useEffect(() => {
		if (countTyping === 1) {
			const msgId = v4();
			const payload: MessagePayload = {
				msg_id: msgId,
				type: CHAT_TYPE.TYPING,
				conv_id: conversation.conversation_id || '',
				mgsId: msgId,
			};
			dispatch(sendTypingRequest(payload));
		} else {
			if (typingTimeout.current) {
				clearTimeout(typingTimeout.current);
			}
			typingTimeout.current = setTimeout(() => {
				setCountTyping(0);
			}, 1500);
		}
	}, [countTyping]);

	const {
		control,
		handleSubmit,
		setValue,
		reset,
		// formState: { errors },
	} = useForm<MessagePayload>();

	const onSubmit = (formData: MessagePayload) => {
		if (!isUploading) {
			if (formData.content?.trim()) {
				const messageData: MessagePayload = {
					conv_id: conversation?.conversation_id || '',
					content: formData.content,
					type: CHAT_TYPE.MESSAGE,
					reply_to: formData.reply_to,
				};
				if (conversation && conversation.conversation_id) {
					handleSendMessage(messageData, conversation.conversation_id);
				} else {
					handleCreateConversation(messageData);
				}
				reset({
					content: '',
					media_url: [],
					reply_to: '',
					msg_id: '',
					conv_id: '',
				});
				setReplyTo({});
			}
			if ((mediaFile || []).length > 0) {
				const messageData: MessagePayload = {
					conv_id: conversation?.conversation_id || '',
					content: '',
					media_url: mediaFile,
					type: CHAT_TYPE.MEDIA,
					reply_to: formData.reply_to,
				};
				if (conversation && conversation.conversation_id) {
					handleSendMessage(messageData, conversation.conversation_id);
				} else {
					handleCreateConversation(messageData);
				}
				setMediaFile([]);
				if (mediaRef.current) {
					mediaRef.current.files = null;
				}
				setPrevImageFile([]);
				setReplyTo({});
			}
		}
	};

	let messageTmp: MessageChat[] = [];
	const handleSendMessage = async (message: MessagePayload, conversationId: string) => {
		const mgsId = v4();
		const timezstampz = moment().format();
		const userId = conversation?.participate_user_id || currentUser?.id;
		const messageTemp: MessageChat = {
			message_id: mgsId,
			user_id: userId,
			sender_id: userId,
			sender_at: timezstampz,
			created_at: timezstampz,
			conversation_id: conversationId,
			status: CHAT_STATUS.SENT,
			type: message.type,
			content: {
				...message,
				msg_id: mgsId,
				sender: conversation?.participate_user_id || currentUser?.id,
				participates: userId ? [userId, merchant.id || ''] : [],
				event_type: message.type,
				conv_name: conversation?.name || merchant.name,
				avatar: conversation?.avatar,
			},
		};
		messageTmp = [messageTemp, ...messageTmp];

		await handleSetMessageTmp(messageTmp);

		setLastMessage({
			MessageId: mgsId,
			UserId: conversation?.participate_user_id || currentUser?.id,
			SenderId: conversation?.participate_user_id || currentUser?.id,
			SendAt: timezstampz,
			CreatedAt: timezstampz,
			ConversationId: conversationId,
			Status: CHAT_STATUS.SENT,
			Type: message.type,
			LastMessage: messageTemp.content,
		});

		switch (message.type) {
			case CHAT_TYPE.MESSAGE:
				const chatMessage: ChatPayload = {
					data: { ...message, conv_id: conversationId, media_url: [], mgsId: mgsId },
					mgsId: mgsId,
					timezstampz: timezstampz,
				};
				await dispatch(sendMessageRequest(chatMessage));
				break;

			case CHAT_TYPE.MEDIA:
				const chatMedia: ChatPayload = {
					data: { ...message, conv_id: conversationId, content: '', mgsId: mgsId },
					mgsId: mgsId,
					timezstampz: timezstampz,
				};
				await dispatch(sendMessageMediaRequest(chatMedia));
				break;
		}
	};

	const handleSetMessageTmp = (messageTemp: MessageChat[]) => {
		dispatch(chatAction.setMessageSent([...messageTemp, ...messageSent]));
	};

	const handleCreateConversation = async (message: MessagePayload) => {
		const conversationId = v4();
		const mgsId = v4();
		const timezstampz = moment().format();

		await dispatch(chatAction.setConversationId(conversationId));

		const conversationPayload: ConversationPayload = {
			content: '',
			participates: [
				conversation.participates?.replace('[', '').replace(']', '') || merchant.id || '',
			],
			avatar: conversation.avatar || merchant.avatar,
			conv_name: conversation.name || merchant.name,
			conv_type: 'individual',
			type: CHAT_TYPE.CONVERSATION,
		};

		await handleCreateConversationTemp(conversationId);
		const chatConversation: ChatPayload = {
			data: conversationPayload,
			mgsId: mgsId,
			conversationId: conversationId,
			timezstampz: timezstampz,
		};

		await dispatch(createConversationRequest(chatConversation))
			.then((resp: any) => {
				if (resp.meta && resp.payload && resp.payload.IsSuccess && resp.payload.ConversationId) {
					setIsUploading(true);
					const timeOut = setTimeout(
						() =>
							handleSendMessage(message, resp.payload.ConversationId)
								.then((resp: any) => {
									if (resp.payload && resp.payload.IsSuccess) {
										setIsUploading(false);
									}
								})
								.catch(() => {
									setIsUploading(false);
								}),
						2500,
					);
					return () => clearTimeout(timeOut);
				}
			})
			.catch((errors: any) => console.error('Tạo cuộc trò chuyện lỗi'));
	};

	const handleCreateConversationTemp = async (conversationId: string) => {
		const findConversation = listConversation.find(
			(item) => item.conversation_id === conversationId,
		);
		if (findConversation && findConversation.conversation_id) {
			dispatch(
				chatAction.setListConversation([
					findConversation,
					...listConversation.filter((item) => item !== findConversation.conversation_id),
				]),
			);
		} else {
			dispatch(
				chatAction.setListConversation([
					{ ...conversation, conversation_id: conversationId, last_message: {} },
					...listConversation,
				]),
			);
		}
	};

	const handleUploadImage = (event: any) => {
		const files: FileList[] = event?.target?.files;
		if (!files || files.length >= 10) {
			alert('Số lượng file tải lên không được lớn hơn 10');
			setIsUploading(false);
			if (mediaRef.current) {
				mediaRef.current.value = '';
			}
			return;
		}

		setIsUploading(true);

		const listFileUpload = Object.keys(files).reduce((previousValue: File[], item: string) => {
			const file: File = files[item];

			const { size } = file;
			const fileType = true;
			// type === 'image/jpeg' ||
			// type === 'image/jpg' ||
			// type === 'image/png' ||
			// type === 'application/pdf' ||
			// type === 'application/docx' ||
			// type === 'application/pdf';
			// type === 'video/mp4';
			const fileSize = size / 1024 / 1024 < 10;
			if (fileType && fileSize) return [...previousValue, file];
			return previousValue;
		}, []);

		if (listFileUpload && listFileUpload.length === files.length) {
			const pathEmp: MediaPreView[] = listFileUpload?.reduce(
				(currentArray: MediaPreView[], currentValue) => {
					if (currentValue) {
						const path = URL.createObjectURL(currentValue);
						const temp: MediaPreView = { media_url: path, type: currentValue.type };
						return [...currentArray, temp];
					}
					return currentArray;
				},
				[],
			);

			setPrevImageFile(pathEmp && pathEmp.length > 0 ? pathEmp : []);
			const formData: FormData = new FormData();
			listFileUpload?.forEach((item: any) => formData.append('files', item));
			uploadMultiFileChatAPI(formData)
				.then((resp: any) => {
					if (resp && resp.length > 0) {
						const respData: string[] = resp
							.map((item: any) => {
								if (item.data && !item.isError) {
									return item.data.url;
								}
							})
							.filter((data: string) => data);
						setMediaFile(respData);
						if (mediaRef.current) {
							mediaRef.current.value = '';
							setPrevImageFile([]);
						}
						setIsUploading(false);
					} else {
						alert('Tải ảnh thất bại');
						if (mediaRef.current) {
							mediaRef.current.value = '';
						}
						setPrevImageFile([]);
						if (mediaRef.current) {
							mediaRef.current.value = '';
						}
						setIsUploading(false);
						return;
					}
				})
				.catch((error) => {
					alert(error);
					setPrevImageFile([]);
					if (mediaRef.current) {
						mediaRef.current.value = '';
					}
					setIsUploading(false);
				});
		} else {
			alert('File tải lên không đúng định dạng, kích thước không được lớn hơn 10Mb');
			setPrevImageFile([]);
			if (mediaRef.current) {
				mediaRef.current.value = '';
			}
			setIsUploading(false);
			return;
		}
	};

	const handleDeletedImage = (file: string) => {
		setMediaFile((item) => item.filter((x) => x !== file));
	};

	let position = 0;

	const handlePickEmoji = (event: any) => {
		position = position || inputRef.current?.selectionStart || 0;
		if (inputRef.current) {
			inputRef.current.value =
				inputRef.current?.value.slice(0, position) +
				event.native +
				inputRef.current?.value.slice(position);
			setValue('content', inputRef.current?.value || '');
		}
	};

	const handleOnTyping = (event: any) => {
		if (inputRef.current) {
			inputRef.current.value = event.target?.value;
			setValue('content', event.target?.value);
		}
		if (conversation.conversation_id && event.target?.value) {
			setCountTyping((current) => current + 1);
		}
	};

	const renderMediaFile = (urlMedia: string) => {
		const type = checkTypeMedia(urlMedia);
		switch (type.split('/')[0]) {
			case 'video':
				return (
					<video controls className='max-h-[64px] max-w-[64px] rounded-lg border'>
						<source
							className='max-h-[64px] max-w-[64px] px-6'
							src={urlMedia && REGEX_VIDEO.test(urlMedia) ? urlMedia : EmptyImage}
							type={type}
						/>
						<track src='' kind='captions' label='english_captions'></track>
					</video>
				);
			case 'image':
				return (
					<ImageCustom
						width={urlMedia.length > 2 ? 126 : 378 / urlMedia.length}
						height={urlMedia.length > 2 ? 126 : 378 / urlMedia.length}
						src={urlMedia && REGEX_IMAGE.test(urlMedia) ? urlMedia : '/static/images/empty-img.png'}
					/>
				);
			case 'application':
				return <>'File Office'</>;
			default:
				return <>temp</>;
		}
	};

	return (
		<div
			className={classNames([
				mediaFile.length > 0 || prevImageFile.length > 0 || (replyTo && replyTo.msg_id)
					? 'rounded-t-lg border-x border-t border-t-gray-200'
					: '',
				'relative',
			])}
		>
			<div
				className={classNames([
					!isUploading && mediaFile.length > 0
						? 'flex flex-row items-start justify-start space-x-2 overflow-x-auto overscroll-x-contain p-2'
						: 'hidden',
				])}
			>
				{mediaFile.map((item, index) => (
					<div className='relative h-16 w-16' key={index}>
						<div className='h-14 w-14 rounded-xl'>{renderMediaFile(item)}</div>
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
			<div
				className={classNames([
					isUploading && prevImageFile.length > 0
						? 'flex flex-row items-start justify-start space-x-2 overflow-x-auto overscroll-x-contain p-2'
						: 'hidden',
				])}
			>
				{prevImageFile.map((item, index) => (
					<div
						className='relative flex h-16 w-16 items-center justify-center rounded-xl'
						key={index}
					>
						<div className='h-14 w-14'>
							{item.type === 'video/mp4' ? (
								<video className='h-14 w-14'>
									<source
										src={item.media_url ? item.media_url : '/static/svg/file-image.svg'}
										type={item.type}
									/>
									<track src='' kind='captions' label='english_captions'></track>
								</video>
							) : (
								<ImageCustom
									width={64}
									height={64}
									key={index}
									src={item.media_url ? item.media_url : '/static/svg/file-image.svg'}
								/>
							)}
						</div>
						<div className='absolute cursor-pointer'>
							<Spin className='w-full' />
						</div>
					</div>
				))}
			</div>
			<div
				className={classNames([iconPicker ? 'absolute bottom-10 right-0 z-20' : 'hidden'])}
				ref={emojiRef}
			>
				<EmojiPicker
					set='apple'
					color='orange'
					showPreview={false}
					showSkinTones={false}
					onSelect={(e) => handlePickEmoji(e)}
				/>
			</div>
			<div
				className={classNames([
					replyTo && replyTo.msg_id
						? 'relative grid grid-cols-10 items-start space-x-2 p-3 rounded-t-lg border-t border-l border-r border-t-gray-200'
						: 'hidden',
				])}
			>
				<div className='col-span-1 col-start-1'>
					<img
						className='h-7 w-7 rounded-full lg:h-8 lg:w-8'
						src={replyTo?.sender === merchant?.id ? merchant?.avatar : EmptyImage}
						alt={replyTo?.sender === merchant?.id ? merchant?.name : 'Trả lời chính mình'}
					/>
				</div>
				<span className='col-span-9 col-start-2 text-sm font-medium not-italic leading-normal tracking-0.0025em text-red-400'>
					<div>{replyTo?.sender === merchant?.id ? merchant?.name : 'Trả lời chính mình'}</div>
					{replyTo.event_type === CHAT_TYPE.MESSAGE ? (
						<div className='truncate break-all text-justify text-12 font-normal text-666666 opacity-60'>
							{replyTo?.content}
						</div>
					) : replyTo.event_type === CHAT_TYPE.MEDIA ? (
						<div
							className={classNames([
								replyTo.media_url && replyTo.media_url.length > 0
									? 'flex flex-row items-start justify-start space-x-2 overflow-x-auto overscroll-x-contain'
									: 'hidden',
							])}
						>
							{replyTo.media_url?.map((item: string, index) => (
								<div className='relative h-16 w-16 rounded-xl' key={index}>
									{renderMediaFile(item)}
								</div>
							))}
						</div>
					) : (
						<></>
					)}
				</span>
				<div
					className='absolute top-0 right-0 z-10 cursor-pointer'
					tabIndex={0}
					role='button'
					onClick={() => setReplyTo({})}
					onKeyPress={() => setReplyTo({})}
				>
					<ImageCustom width={20} height={20} src='/static/svg/closeCircle.svg' />
				</div>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='relative overflow-hidden rounded-md border border-[#E0E0E0]'
			>
				<Controller
					name='content'
					control={control}
					render={({ field }) => (
						<input
							type='text'
							{...field}
							ref={inputRef}
							autoComplete='off'
							onChange={(event) => handleOnTyping(event)}
							className='w-[70%] py-2.5 px-3 text-black outline-none'
							placeholder='Chat với shop ngay'
						/>
					)}
				/>
				<div className='absolute top-2/4 right-0 flex h-full translate-x-0 -translate-y-2/4 items-center'>
					<span className='relative mr-2 flex h-6 w-6 cursor-pointer flex-col pr-[20px]'>
						<Icon name={IconEnum.Image} size={24} />
						<input
							type='file'
							accept='*'
							ref={mediaRef}
							onChange={(event) => handleUploadImage(event)}
							multiple
							disabled={isUploading}
							className='h-6 w-6 cursor-pointer opacity-0'
						/>
					</span>
					<div
						className='relative mr-2 flex h-6 w-6 cursor-pointer flex-col pr-[20px]'
						tabIndex={0}
						role='button'
						ref={pickerRef}
						onKeyPress={() => setIconPicker(!iconPicker)}
						onClick={() => setIconPicker(!iconPicker)}
					>
						<Icon name={IconEnum.Smiley} size={24} />
					</div>
					<div className='relative mr-2 flex h-6 w-6 cursor-pointer flex-col pr-[20px]'>
						<Icon name={IconEnum.PaperPlaneRight} size={24} />
					</div>
				</div>
			</form>
		</div>
	);
};

export default InputChat;
