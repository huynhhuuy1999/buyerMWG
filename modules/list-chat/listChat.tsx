import classNames from 'classnames';
import { ImageCustom } from 'components';
import { EmptyImage, REGEX_IMAGE } from 'constants/';
import { CHAT_STATUS, CHAT_TYPE } from 'enums';
import { useAppChat, useAppDispatch, useAppSelector } from 'hooks';
import { Conversation, MerchantChat, Users } from 'models';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { List } from 'react-virtualized';

import { getListUserChatRequest, listUserChatSector } from '@/store/reducers/chatSlice';
export interface IListChatProps {
	setIsOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
	handleRoomChat?: Function;
	listConversation?: Conversation[];
}
const ListChat: React.FC<IListChatProps> = ({
	setIsOpenChat,
	handleRoomChat,
	listConversation,
}: IListChatProps) => {
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
		if (textSearch) {
			const payload = {
				query: textSearch.trim(),
			};
			const timeOut = setTimeout(() => dispatch(getListUserChatRequest(payload)), 300);
			return () => clearTimeout(timeOut);
		} else {
			setListUserChat([]);
		}
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

	const renderRowVirtual = (item: Conversation, index: number) => {
		return (
			<div
				onClick={() => {
					handleRoomChat?.(item, 1);
					setIsOpenChat(false);
				}}
				onKeyPress={() => {
					handleRoomChat?.(item, 1);
					setIsOpenChat(false);
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
						<span className='ml-2 block text-base font-medium text-gray-900'>{item.name}</span>
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
					{item.unread_number && item.unread_number > 0 ? (
						<span className='absolute right-2 top-1 h-4 w-6 rounded-xl bg-red-500 text-center text-white'>
							{item.unread_number <= 5 ? item.unread_number : '5+'}
						</span>
					) : (
						<></>
					)}
				</div>
			</div>
		);
	};

	const renderSearchVirtual = (item: Users, index: number) => {
		return (
			<div
				onClick={() => {
					handleOpenChat?.(item);
					setIsOpenChat(false);
				}}
				onKeyPress={() => {
					handleOpenChat?.(item);
					setIsOpenChat(false);
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
						<span className='ml-2 block text-base font-medium text-gray-900'>{item.name}</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className='min-h-[35rem] rounded border border-gray-300'>
			<div className='m-3'>
				<div className='relative text-gray-600'>
					<span className='absolute inset-y-0 left-0 flex items-center pl-2'>
						<svg
							fill='none'
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							viewBox='0 0 24 24'
							className='h-6 w-6 text-gray-300'
						>
							<path
								stroke='black'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								fill='transparent'
								d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
							></path>
						</svg>
					</span>
					<input
						type='search'
						className='block w-full rounded bg-gray-100 py-2 pl-10 pr-3 outline-none'
						name='search'
						autoComplete='off'
						value={textSearch}
						onChange={(event) => setTextSearch(event.target.value)}
						placeholder='Tìm kiếm'
					/>
				</div>
			</div>
			<div className='custom_scrollbar max-h-[30rem] overflow-auto'>
				<div className='my-2 ml-2 text-lg font-bold text-gray-600'>Tin nhắn</div>
				<Fragment>
					{textSearch ? (
						listUserChat && listUserChat.length > 0 ? (
							<List
								height={430}
								width={280}
								rowHeight={62}
								rowCount={listUserChat?.length || 0}
								rowRenderer={({ key, index }) => {
									const userchat = listUserChat?.[index];
									return userchat ? renderSearchVirtual(userchat, index) : <></>;
								}}
							/>
						) : (
							<div className='relative flex min-h-[25rem] cursor-pointer content-center items-start justify-center px-3 py-2 text-sm transition duration-150 ease-in-out focus:outline-none'>
								<ImageCustom
									src={'/static/svg/empty-profile.icon.svg'}
									alt={'empty profile icon'}
									layout={'fill'}
								/>
								<span className='z-10'>Không tìm được kết quả nào</span>
							</div>
						)
					) : (
						<List
							height={430}
							width={280}
							rowHeight={62}
							rowCount={listConversation?.length || 0}
							rowRenderer={({ key, index }) => {
								const conversation = listConversation?.[index];
								return conversation ? renderRowVirtual(conversation, index) : <></>;
							}}
						/>
					)}
				</Fragment>
			</div>
		</div>
	);
};
export default ListChat;
