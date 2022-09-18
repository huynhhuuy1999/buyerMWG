import { CHAT_STATUS, MODULE_CHAT } from 'enums';
import { useAppDispatch, useAppSelector } from 'hooks';
// import { Conversation } from 'models';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { Icon, IconEnum } from 'vuivui-icons';

import { cartSelector } from '@/store/reducers/cartSlice';
import {
	chatAction,
	listConversationSelector,
	stepIframeSelector,
} from '@/store/reducers/chatSlice';

// interface IListChatProps {
// 	handleRoomChat?: Function;
// 	listConversation?: Conversation[];
// 	setIsOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
// }

interface IRightHeaderProps {
	handleRoomChat?: Function;
}

const RightHeader: React.FC<IRightHeaderProps> = ({ handleRoomChat }: IRightHeaderProps) => {
	const dispatch = useAppDispatch();
	const totalItemCart = useAppSelector(cartSelector);
	const listConversation = useAppSelector(listConversationSelector);
	const stepIframe = useAppSelector(stepIframeSelector);
	const clickRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const iframeChat = document.getElementById('vuivui-chat-app') as HTMLIFrameElement;

		const childWindow = iframeChat?.contentWindow;

		const handleClickOutside = (event: any) => {
			if (
				iframeChat &&
				!iframeChat.contains(event.target) &&
				clickRef.current &&
				clickRef.current.contains(event.target) &&
				iframeChat.classList.contains('hidden')
			) {
				iframeChat.classList.remove('hidden');
				if (!!childWindow) {
					childWindow.postMessage(
						{ type: MODULE_CHAT.LIST_CONVERSATION },
						process.env.NEXT_PUBLIC_DOMAIN_URL_CHAT || '',
					);
				}
			} else if (
				iframeChat &&
				!iframeChat.classList.contains('hidden') &&
				stepIframe &&
				stepIframe === MODULE_CHAT.LIST_CONVERSATION
			) {
				iframeChat.classList.add('hidden');
				dispatch(chatAction.setStepIframe(''));
				// if (!!childWindow) {
				// 	childWindow.postMessage(
				// 		{ type: MODULE_CHAT.CLOSE_ALL },
				// 		process.env.NEXT_PUBLIC_DOMAIN_URL_CHAT || '',
				// 	);
				// }
			}
		};
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [clickRef, stepIframe]);

	return (
		<div className='relative' id='right-side-menu'>
			<div className='flex flex-row gap-3 pt-[8px]'>
				<Link href={'/live-stream'}>
					<div className=' flex cursor-pointer flex-col'>
						<div className='relative mx-auto '>
							<Icon name={IconEnum.MonitorPlay} color='white' size={20} />
							{/* <div className='not-italic font-bold text-[11px] text-[#333333] tracking-[0.96px] font-sfpro_bold bg-[#FEE800] px-[6px] py-0 rounded-[15px] absolute translate-x-1/2 -translate-y-1/2 top-1/2 -right-1/3'>
											0
										</div> */}
						</div>
						<span className='mt-[6px] text-base font-normal not-italic leading-normal tracking-[0.04px] text-white'>
							Livestream
						</span>
					</div>
				</Link>

				<div className=' flex cursor-pointer flex-col' role='menubar' ref={clickRef} tabIndex={0}>
					<div className='relative mx-auto '>
						<Icon name={IconEnum.ChatCircle} color='white' size={20} />
						<div className='absolute top-1 -right-1/3 translate-x-1/2 -translate-y-1/2 rounded-[15px] bg-[#FEE800] px-[6px] py-0 font-sfpro_bold text-[11px] font-bold not-italic tracking-[0.96px] text-[#333333]'>
							{listConversation &&
								listConversation?.filter(
									(item) =>
										item.participate_user_id !== item.last_message?.SenderId &&
										item.last_message?.Status !== CHAT_STATUS.SEEN,
								).length > 0 &&
								listConversation?.filter(
									(item) =>
										item.participate_user_id !== item.last_message?.SenderId &&
										item.last_message?.Status !== CHAT_STATUS.SEEN,
								).length}
						</div>
					</div>
					<span className='mt-[6px] text-base font-normal not-italic leading-normal tracking-[0.04px] text-white'>
						Tin nhắn
					</span>
				</div>
				<Link href={'/ca-nhan/don-hang/cho-xac-nhan'}>
					<a className=' flex cursor-pointer flex-col'>
						<div className='relative mx-auto '>
							<Icon name={IconEnum.User} color='white' size={20} />
						</div>
						<span className='mt-[6px] text-base font-normal not-italic leading-normal tracking-[0.04px] text-white'>
							Cá nhân
						</span>
					</a>
				</Link>
				<Link href={'/gio-hang'}>
					<a className=' flex cursor-pointer flex-col'>
						<div className='relative mx-auto '>
							<Icon name={IconEnum.ShoppingCartSimple} color='white' size={20} />
							{totalItemCart.total > 0 && (
								<div className='absolute top-1 right-0 translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[#EA001B] px-[4px] py-0 text-[10px] font-bold not-italic tracking-[0.96px] text-white'>
									{totalItemCart.total > 99 ? (
										<>
											99
											<sup>+</sup>
										</>
									) : (
										<>{totalItemCart.total}</>
									)}
								</div>
							)}
						</div>
						<span className='mt-[6px] text-base font-normal not-italic leading-normal tracking-[0.04px] text-white'>
							Giỏ hàng
						</span>
					</a>
				</Link>
			</div>
		</div>
	);
};

export default RightHeader;
