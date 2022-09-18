import { useSubscription } from '@apollo/react-hooks';
import { ImageCustom, Spin } from 'components';
import { EmptyImage, REGEX_IMAGE } from 'constants/';
import { CHAT_STATUS, CHAT_TYPE } from 'enums';
import { QUERY_MESSAGE_BY_CONVERSATION_ID } from 'graphql/queries/message';
import { useAppDispatch, useAppSelector, useChat, useIsomorphicLayoutEffect } from 'hooks';
import {
	ChatPayload,
	Content,
	Conversation,
	ConversationPayload,
	MessageChat,
	MessagePayload,
} from 'models';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { v4 } from 'uuid';

import { uploadMultiFileChatAPI } from '@/services/chat';
import {
	chatAction,
	// messageIdSelector,
	messageSentSelector,
} from '@/store/reducers/chatSlice';

import FriendMessage from './friendMessage';
import HeaderActionChat from './headerActionChat';
import HeaderChat from './headerChat';
import InputChat from './inputChat';
import MyMessage from './myMessage';

interface IChatProps {
	conversation: Conversation;
	handleRoomChat?: Function;
}
const defaultValues: MessagePayload = {
	content: '',
	conv_id: '',
	reply_to: '',
	type: '',
};
const LIMITED_PAGE_DATA: number = 20; // limit load data chat
const STEP_PAGE_DATA: number = 10; // plus limit load data chat
const RoomChat: React.FC<IChatProps> = ({ conversation, handleRoomChat }: IChatProps) => {
	const [isSearch, setIsSearch] = useState<boolean>(false);
	const [pageSize, setPageSize] = useState<number>(LIMITED_PAGE_DATA);
	const [isShowMore, setIsShowMore] = useState<boolean>(false);
	const [isLoading] = useState<boolean>(false);
	const [listChat, setListChat] = useState<MessageChat[]>([]);
	// const [messageTemp, setMessageTemp] = useState<MessageChat[]>([]);
	const [mediaFile, setMediaFile] = useState<string[]>([]);
	const [prevImageFile, setPrevImageFile] = useState<(string | undefined)[]>([]);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [textReply, setTextReply] = useState<Content>({});
	const [onTyping, setOnTyping] = useState<number>(0);
	const prevScrollY = useRef<HTMLDivElement>(null);
	const [isTyping, setIsTyping] = useState<boolean>(false);
	// const messageId = useAppSelector(messageIdSelector);
	// const conversationId = useAppSelector(conversationIdSector);
	const [conversationId, setConversationId] = useState<string>('');
	const messageSent = useAppSelector(messageSentSelector);

	const dispatch = useAppDispatch();

	const resultMessage = useSubscription(QUERY_MESSAGE_BY_CONVERSATION_ID, {
		variables: {
			conversationId: conversationId,
		},
	});
	const {
		sendMessage,
		createConversation,
		sendMessageMedia,
		sendReaction,
		sendTyping,
		seenMessage,
	} = useChat();

	useIsomorphicLayoutEffect(() => {
		if (!resultMessage.loading) {
			const messageData: MessageChat[] = resultMessage?.data?.webchat_chat_message || [];
			if (messageData.length > 0 || messageSent.length > 0) {
				const dataTemp: any = messageSent.reduce(
					(
						initial: { initialTemp: MessageChat[]; initialValue: MessageChat[] },
						currentValue,
						indexValue,
					) => {
						if (currentValue.conversation_id === conversationId) {
							let findMemo = messageData.find((obj) => obj.message_id === currentValue.message_id);
							if (!findMemo) {
								return { ...initial, initialTemp: initial.initialTemp.concat(currentValue) };
							} else {
								return {
									...initial,
									initialValue: initial.initialValue.filter(
										(x) => x.message_id !== currentValue.message_id,
									),
								};
							}
						}
						return initial;
					},
					{ initialTemp: [], initialValue: messageSent },
				);
				if (dataTemp.initialValue.length !== messageSent.length) {
					dispatch(chatAction.setMessageSent(dataTemp.initialValue));
				}
				setListChat(dataTemp.initialTemp.concat(messageData));
			} else {
				setListChat([]);
			}
		}
	}, [resultMessage, messageSent]);

	useIsomorphicLayoutEffect(() => {
		if (conversation.conversation_id) {
			setConversationId(conversation.conversation_id);
		} else {
			setConversationId(v4());
		}
	}, [conversation]);

	useEffect(() => {
		const checkFlog = listChat.filter(
			(item) =>
				item.content?.event_type !== CHAT_TYPE.TYPING &&
				item.sender_id !== conversation.participate_user_id,
		);
		if (
			conversation.conversation_id &&
			(listChat || []).length > 0 &&
			checkFlog.length > 0 &&
			checkFlog?.[0].status !== CHAT_STATUS.SEEN
		) {
			const payload: MessagePayload = {
				conv_id: conversationId,
				type: CHAT_TYPE.SEEN,
				msg_id: listChat.filter((item) => item.type !== CHAT_TYPE.TYPING)?.[0]?.message_id,
			};
			seenMessage(payload);
		}
	}, [listChat, conversation]);

	// get status message typing
	useEffect(() => {
		setIsTyping(false);
		if (
			listChat &&
			listChat[0]?.type === CHAT_TYPE.TYPING &&
			listChat[0]?.sender_id !== listChat[0]?.user_id
		) {
			const countTime = moment.duration(moment().diff(moment(listChat?.[0]?.received_at)));
			if (
				countTime.seconds() < 15 &&
				countTime.minutes() < 1 &&
				countTime.hours() < 1 &&
				countTime.days() < 1
			) {
				setIsTyping(true);
				const timeOut = setTimeout(() => setIsTyping(false), 10000);
				return () => clearTimeout(timeOut);
			}
		}
	}, [listChat, conversation.participates]);

	// post status message typing
	useEffect(() => {
		if (onTyping && conversation.conversation_id) {
			if (onTyping === 1) {
				const payload: MessagePayload = {
					conv_id: conversationId,
					type: CHAT_TYPE.TYPING,
				};
				sendTyping(payload);
			}
			const timeOut = setTimeout(() => {
				setOnTyping(0);
			}, 5000);
			return () => clearTimeout(timeOut);
		}
	}, [onTyping]);

	const handleTyping = (text: string) => {
		if (text) {
			setOnTyping(onTyping + 1);
		}
	};

	const methods = useForm<any>({
		mode: 'onSubmit',
		defaultValues,
	});

	const { setValue } = methods;
	const handleUploadImage = (event: any) => {
		const files: FileList[] = event?.target?.files;
		if (!files || files.length <= 0 || files.length >= 10) {
			alert('Số lượng file tải lên không được lớn hơn 10, và nhỏ hơn 0');
			setIsUploading(false);
			return;
		}
		setIsUploading(true);
		const listFileUpload = Object.keys(files)
			.map((item: string) => {
				const file: File = files[item];

				const { size } = file;
				const fileType = true;
				// type === 'image/jpeg' ||
				// type === 'image/jpg' ||
				// type === 'image/png' ||
				// type === 'application/pdf' ||
				// type === 'application/docx' ||
				// type === 'application/pdf';
				const fileSize = size / 1024 / 1024 < 10;
				if (fileType && fileSize) return file;
			})
			.filter((item) => item);
		if (listFileUpload && listFileUpload.length === files.length) {
			const pathEmp = listFileUpload
				.map((item) => {
					if (item) {
						const path = URL.createObjectURL(item);
						return path;
					}
				})
				.filter((data) => data);
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
						setIsUploading(false);
					} else {
						alert('Tải ảnh thất bại');
						setIsUploading(false);
						return;
					}
				})
				.catch((error) => {
					alert(error);
					setIsUploading(false);
				});
		} else {
			alert('File tải lên không đúng định dạng, kích thước không được lớn hơn 10Mb');
			setIsUploading(false);
			return;
		}
	};

	const handleDeletedImage = (urlMedia: string) => {
		if (urlMedia) {
			const reMakeListMedia = mediaFile.filter((url) => url !== urlMedia);
			setMediaFile(reMakeListMedia);
		}
	};

	const handleReplyMessage = (replyTo?: Content) => {
		setTextReply(replyTo ? replyTo : {});
		setValue('reply_to', replyTo?.msg_id ? replyTo?.msg_id : '');
	};

	// onsubmit chat
	const onSubmit: SubmitHandler<MessagePayload> = useCallback(
		(formData) => {
			if (formData.content || (mediaFile && mediaFile.length > 0)) {
				const mgsId = v4();
				const timezstampz = moment().format();
				const fakeDataMessage: MessageChat = {
					message_id: mgsId,
					user_id: conversation.participate_user_id,
					sender_id: conversation.participate_user_id,
					sender_at: timezstampz,
					created_at: timezstampz,
					conversation_id: conversationId,
					status: CHAT_STATUS.SENT,
					content: {
						content: formData.content,
						media_url: mediaFile,
						conv_id: conversationId,
						reply_to: formData.reply_to,
						type: mediaFile && mediaFile.length > 0 ? CHAT_TYPE.MEDIA : CHAT_TYPE.MESSAGE,
					},
				};
				dispatch(chatAction.setMessageSent([fakeDataMessage, ...messageSent]));
				if (conversation.conversation_id || listChat?.[0]?.conversation_id) {
					const messageFormData: MessagePayload = {
						content: formData.content,
						media_url: mediaFile,
						conv_id: conversationId,
						reply_to: formData.reply_to,
						type: mediaFile && mediaFile.length > 0 ? CHAT_TYPE.MEDIA : CHAT_TYPE.MESSAGE,
					};
					const messagePayload: ChatPayload = {
						data: messageFormData,
						mgsId: mgsId,
						timezstampz: timezstampz,
					};
					if (mediaFile && mediaFile.length > 0) {
						sendMessageMedia(messagePayload);
						setMediaFile([]);
						setPrevImageFile([]);
					} else {
						sendMessage(messagePayload);
					}
				} else {
					const conversationData: ConversationPayload = {
						content: formData.content,
						avatar: conversation.avatar,
						participates: conversation.participates
							? conversation.participates.replace('[', '').replace(']', '').split(',')
							: [],
						conv_name: conversation.name,
						conv_type: CHAT_TYPE.CONVERSATION,
						type: CHAT_TYPE.MESSAGE,
					};
					const conversationPayload: ChatPayload = {
						data: conversationData,
						mgsId: mgsId,
						conversationId: conversationId,
						timezstampz: timezstampz,
					};
					createConversation(conversationPayload);
				}
				setValue('content', '');
				setValue('reply_to', '');
				setTextReply({});
				setMediaFile([]);
			}
		},
		[mediaFile, conversation, listChat],
	);

	//scroll more
	useEffect(() => {
		const scrollY = prevScrollY.current;
		const onScroll = () => {
			const currentScrollY = scrollY ? scrollY.scrollHeight + scrollY.scrollTop : 0;
			const clientHeight = scrollY?.clientHeight ? scrollY?.clientHeight : 0;

			if (currentScrollY - clientHeight < 1 && listChat?.length >= pageSize) {
				let timeChange = setTimeout(() => setPageSize(pageSize + STEP_PAGE_DATA), 100);
				return () => {
					clearTimeout(timeChange);
				};
				// setPageSize(pageSize + STEP_PAGE_DATA);
			}
		};
		scrollY?.addEventListener('scroll', onScroll);
		return () => {
			scrollY?.removeEventListener('scroll', onScroll);
		};
	}, [listChat]);

	const onReaction = (content?: Content) => {
		if (content) {
			const payload: MessagePayload = {
				type: CHAT_TYPE.REACTION,
				conv_id: content.conv_id ? content.conv_id : '',
				msg_id: content.msg_id,
			};
			sendReaction(payload);
		}
	};

	// re-render scrollbar
	useEffect(() => {
		const scrollTop = prevScrollY.current ? prevScrollY.current?.scrollTop : 0;
		const clientHeight = prevScrollY.current ? prevScrollY.current?.clientHeight : 0;
		const scrollY = scrollTop + clientHeight;
		prevScrollY.current?.scrollTo({
			top: scrollY,
			behavior: 'smooth',
		});
	}, [pageSize]);

	const renderTimeCount = (timeAt?: string) => {
		if (timeAt) {
			const countTime = moment.duration(moment().diff(moment(timeAt)));
			if (countTime.years() > 0 || countTime.months() > 0) {
				const timer = moment(timeAt).format('hh:mm, DD/MM/YYYY');
				return timer;
			} else if (countTime.days() > 1) {
				const timer = moment(timeAt).format('hh:mm, ddd DD MM, YYYY');
				return timer;
			} else if (countTime.hours() > 12) {
				const timer = moment(timeAt).format('HH:mm');
				return timer;
			} else {
				return moment(timeAt).format('HH:mm');
			}
		}
		return null;
	};

	const checkTime = (createAt?: string, prevTime?: string) => {
		const diffTime = moment.duration(moment(createAt).diff(moment(prevTime)));
		if (
			diffTime &&
			(diffTime.minutes() > 30 ||
				diffTime.hours() > 0 ||
				diffTime.days() > 0 ||
				diffTime.months() > 0 ||
				diffTime.years() > 0)
		) {
			return false;
		} else {
			return true;
		}
	};

	return (
		<div className='relative h-[420px] w-72 rounded border bg-white'>
			<div className=''>
				<HeaderChat
					isShowMore={isShowMore}
					setIsShowMore={setIsShowMore}
					conversation={conversation}
					handleRoomChat={handleRoomChat}
				/>
				<HeaderActionChat isSearch={isSearch} setIsSearch={setIsSearch} />
			</div>
			<div className='flex h-[320px] flex-col justify-end bg-[#f0f0f0]'>
				<div
					className='relative flex w-full flex-col-reverse overflow-y-auto overscroll-y-contain p-3'
					ref={prevScrollY}
				>
					{isLoading && (
						<div className='w-full bg-[#f0f0f0]'>
							<Spin />
						</div>
					)}
					{isTyping && (
						<div className='flex w-[30%] items-center justify-start space-x-2'>
							<ImageCustom
								priority
								className='rounded-full object-cover'
								width={24}
								height={24}
								src={
									conversation.avatar && REGEX_IMAGE.test(conversation.avatar)
										? conversation.avatar
										: EmptyImage
								}
								alt={conversation?.name}
								title={conversation?.name}
							/>
							<span className='flex animate-bounce items-center justify-center py-2'>
								<ImageCustom width={16} height={16} src='/static/svg/three-dots-3e3e40.svg' />
							</span>
						</div>
					)}
					<div className='flex flex-col space-y-1'>
						{!isLoading &&
							listChat?.length > 0 &&
							[...listChat]
								.reverse()
								.filter(
									(x) =>
										x.content?.content || (x.content?.media_url && x.content.media_url.length > 0),
								)
								.map((item: MessageChat, index) => {
									const showTime = renderTimeCount(item.created_at);
									const isCheckAvt =
										[...listChat].reverse()[index + 1] &&
										[...listChat].reverse()[index + 1].sender_id === item.sender_id &&
										checkTime([...listChat].reverse()[index + 1].created_at, item.created_at)
											? true
											: false;
									return (
										<div key={item.message_id + '_' + index}>
											{item.user_id === item.sender_id ? (
												<MyMessage
													content={item.content}
													handleReplyMessage={handleReplyMessage}
													status={item.status}
													timeLine={showTime ? showTime : undefined}
													reaction={item.reaction}
													isCheckAvt={isCheckAvt}
													onReaction={onReaction}
												/>
											) : (
												<FriendMessage
													isCheckAvt={isCheckAvt}
													content={item.content}
													status={item.status}
													reaction={item.reaction}
													timeLine={showTime ? showTime : undefined}
													handleReplyMessage={handleReplyMessage}
													avatar={conversation.avatar}
													onReaction={onReaction}
												/>
											)}
										</div>
									);
								})}
					</div>
				</div>
				<div className='bottom-0 w-full bg-white'>
					<FormProvider {...methods}>
						<InputChat
							onSubmit={onSubmit}
							replyTo={textReply}
							roomInfo={conversation}
							isUploading={isUploading}
							mediaFile={mediaFile}
							prevImageFile={prevImageFile}
							handleDeletedImage={handleDeletedImage}
							handleUploadImage={handleUploadImage}
							handleTyping={handleTyping}
							handleReplyMessage={handleReplyMessage}
						/>
					</FormProvider>
				</div>
			</div>
		</div>
	);
};

export default RoomChat;
