import classNames from 'classnames';
import { ImageCustom } from 'components';
import { EmptyImage, REGEX_IMAGE } from 'constants/';
import { CHAT_STATUS, CHAT_TYPE } from 'enums';
import { useAppChat, useAppDispatch, useAppSelector } from 'hooks';
import { Conversation, MerchantChat, Users } from 'models';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { getListUserChatRequest, listUserChatSector } from '@/store/reducers/chatSlice';
interface IListChatProps {
	setIsOpenChat?: React.Dispatch<React.SetStateAction<boolean>>;
	handleRoomChat?: Function;
	listConversation?: Conversation[];
}
const ListChatMobile: React.FC<IListChatProps> = ({
	setIsOpenChat,
	handleRoomChat,
	listConversation,
}: IListChatProps) => {
	const router = useRouter();
	const [textSearch, setTextSearch] = useState<string>('');
	const dispatch = useAppDispatch();
	const dataUser = useAppSelector(listUserChatSector);
	const [listUserChat, setListUserChat] = useState<Users[]>([]);
	const { onHandleOpenChat } = useAppChat();
	useEffect(() => {
		if (dataUser) {
			setListUserChat((dataUser as any) || []);
		}
	}, [dataUser]);
	useEffect(() => {
		const payload = {
			query: textSearch.trim(),
		};
		const timeOut = setTimeout(() => dispatch(getListUserChatRequest(payload)), 300);
		return () => clearTimeout(timeOut);
	}, [dispatch, textSearch]);
	const handleOpenChat = (merchant: Users) => {
		const payload: MerchantChat = {
			userId: merchant.id || '',
			name: merchant.name || '',
			fullPath: merchant.avatar,
			brandId: merchant.id || '',
		};
		onHandleOpenChat(payload);
	};
	const renderTimeCount = (timeAt?: string) => {
		if (timeAt) {
			// const timer = moment().from(timeAt).replace('vài giây tới', '1 phút').replace('tới', '');
			const countTime = moment.duration(moment().diff(timeAt));
			if (countTime.days() >= 5 || countTime.years() > 0 || countTime.months() > 0) {
				const timer = moment(timeAt).format('DD-MM-YYYY').toString();
				return timer;
			} else if (countTime.days() < 5 && countTime.days() > 0) {
				const timer = `${countTime.days()} ngày trước`;
				return timer;
			} else if (countTime.hours() > 0) {
				const timer = `${countTime.hours()} giờ`;
				return timer;
			} else if (countTime.minutes() > 1) {
				const timer = `${countTime.minutes()} phút`;
				return timer;
			} else {
				const timer = `Ngay bây giờ`;
				return timer;
			}
		}
		return null;
	};
	return (
		<div
			className='h-screen'
			role='menubar'
			tabIndex={0}
			onMouseLeave={() => setIsOpenChat?.(false)}
		>
			<div className='flex h-[72px] items-end justify-between bg-pink-500'>
				<div className='w-full px-1 pb-1'>
					<div className='flex w-full items-center rounded-md bg-gray-100 text-gray-600'>
						<span
							className='flex items-center px-2'
							role='button'
							tabIndex={0}
							onKeyPress={() => router.back()}
							onClick={() => {
								router.back();
							}}
						>
							<ImageCustom src='/static/svg/arrow-left.svg' height={24} width={24} />
						</span>
						<input
							type='text'
							className='w-full border-none bg-gray-100 py-2 outline-none'
							name='search'
							autoComplete='off'
							value={textSearch}
							onChange={(event) => setTextSearch(event.target.value)}
							placeholder='Tìm kiếm'
						/>
						<span className='flex items-center justify-between px-2'>
							<span className='mr-1 flex items-center'>
								<ImageCustom src='/static/svg/search-outline-ffffff.svg' height={24} width={24} />
							</span>
							<span className='mr-1 flex items-center'>
								<ImageCustom src='/static/svg/QRCode.svg' height={24} width={24} />
							</span>
							<span className='mr-1 flex items-center'>
								<ImageCustom src='/static/svg/plus.svg' height={24} width={24} />
							</span>
						</span>
					</div>
				</div>
			</div>
			<div className='custom_scrollbar h-screen overflow-auto'>
				<div className='my-2 ml-2 text-lg font-bold text-gray-600'>Tin nhắn</div>
				<div>
					{textSearch
						? (listUserChat || []).map((item, index) => (
								<div
									onClick={() => {
										handleOpenChat?.(item);
										setIsOpenChat?.(false);
									}}
									onKeyPress={() => {
										handleOpenChat?.(item);
										setIsOpenChat?.(false);
									}}
									role='menubar'
									tabIndex={0}
									key={index}
									className='grid cursor-pointer grid-cols-6 content-center items-center gap-1 border border-gray-300 px-3 py-2 text-sm transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none'
								>
									<ImageCustom
										loading='lazy'
										className='col-span-1 rounded-full object-cover'
										src={item.avatar && REGEX_IMAGE.test(item.avatar) ? item.avatar : EmptyImage}
										width={50}
										height={50}
										alt={item.name ? item.name : 'unknown'}
									/>
									<div className='col-span-3 block'>
										<div className='relative flex justify-between truncate'>
											<span className='ml-2 block text-base font-medium text-gray-900'>
												{item.name}
											</span>
										</div>
										{/* <div
										className={classNames(['text-gray-600 ',
											'flex justify-between ml-2 text-xs truncate',
										])}
									>
										<span className='flex'>
											{item.last_message?.UserId === item.last_message?.SenderId
												? 'Bạn: '
												: item.name + ': '}
											{item.last_message?.LastMessage?.event_type === CHAT_TYPE.MEDIA
												? '[Hình ảnh]'
												: item.last_message?.LastMessage?.content}
										</span>
									</div> */}
									</div>
									{/* <div className='relative col-span-2 flex h-full content-end items-end justify-end text-xs'>
									<span className='block'>{renderTimeCount(item.last_message?.CreatedAt)}</span>
									{item.last_message?.UserId !== item.last_message?.SenderId &&
										item.last_message?.Status !== CHAT_STATUS.SEEN && (
											<span className='absolute right-2 top-1 h-3 w-3 rounded-full bg-blue-600'></span>
										)}
									{item.unread_number && item.unread_number > 0 && (
										<span className='absolute right-2 top-1 h-4 w-6 rounded-xl bg-red-500 text-center text-white'>
											{item.unread_number <= 5 ? item.unread_number : '5+'}
										</span>
									)}
								</div> */}
								</div>
						  ))
						: (listConversation || [])
								.sort((a, b) => {
									if (a.last_message?.CreatedAt && b.last_message?.CreatedAt) {
										if (a.last_message?.CreatedAt > b.last_message?.CreatedAt) return -1;
										else if (a.last_message?.CreatedAt < b.last_message?.CreatedAt) return 1;
										return 0;
									}
									return 0;
								})
								.map((item: Conversation, index) => (
									<div
										onClick={() => {
											handleRoomChat?.(item, 1);
											setIsOpenChat?.(false);
										}}
										onKeyPress={() => {
											handleRoomChat?.(item, 1);
											setIsOpenChat?.(false);
										}}
										role='menubar'
										tabIndex={0}
										key={index}
										className='grid cursor-pointer grid-cols-6 content-center items-center gap-1 border border-gray-300 px-3 py-2 text-sm transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none'
									>
										<ImageCustom
											loading='lazy'
											className='col-span-1 rounded-full object-cover'
											src={item.avatar && REGEX_IMAGE.test(item.avatar) ? item.avatar : EmptyImage}
											width={50}
											height={50}
											alt={item.name ? item.name : 'unknown'}
										/>
										<div className='col-span-3 block'>
											<div className='relative flex justify-between truncate'>
												<span className='ml-2 block text-base font-medium text-gray-900'>
													{item.name}
												</span>
											</div>
											<div
												className={classNames([
													item.last_message?.UserId !== item.last_message?.SenderId &&
													item.last_message?.Status !== CHAT_STATUS.SEEN
														? 'font-bold text-blue-600'
														: 'text-gray-600 ',
													'flex justify-between ml-2 text-xs truncate',
												])}
											>
												<span className='flex'>
													{item.last_message?.UserId === item.last_message?.SenderId
														? 'Bạn: '
														: item.name + ': '}
													{item.last_message?.LastMessage?.event_type === CHAT_TYPE.MEDIA
														? '[Hình ảnh]'
														: item.last_message?.LastMessage?.content}
												</span>
											</div>
										</div>
										<div className='relative col-span-2 flex h-full content-end items-end justify-end text-xs'>
											<span className='block'>{renderTimeCount(item.last_message?.CreatedAt)}</span>
											{item.last_message?.UserId !== item.last_message?.SenderId &&
												item.last_message?.Status !== CHAT_STATUS.SEEN && (
													<span className='absolute right-2 top-1 h-3 w-3 rounded-full bg-blue-600'></span>
												)}
											{item.unread_number && item.unread_number > 0 && (
												<span className='absolute right-2 top-1 h-4 w-6 rounded-xl bg-red-500 text-center text-white'>
													{item.unread_number <= 5 ? item.unread_number : '5+'}
												</span>
											)}
										</div>
									</div>
								))}
				</div>
			</div>
		</div>
	);
};
export default ListChatMobile;
