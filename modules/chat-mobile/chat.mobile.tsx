import { useAppDispatch, useAppSelector } from 'hooks';
import { Conversation } from 'models';
import React, { useState } from 'react';

import { chatAction, listChatSector } from '@/store/reducers/chatSlice';

import { ListChatMobile } from '../list-chat';
import { RoomChatMobile } from '../roomChat';
interface IChatMobileProps {
	listConversation?: Conversation[];
}
const ChatMobile: React.FC<IChatMobileProps> = ({ listConversation }) => {
	const dispatch = useAppDispatch();
	const listChat: Conversation[] = useAppSelector(listChatSector);
	const [isOpenChat, setIsOpenChat] = useState<boolean>(false);
	const handleRoomChat = (newRoom: Conversation, status?: number) => {
		dispatch(chatAction.handleRoomChat({ status, newRoom, listChat }));
		setIsOpenChat(status === 1);
	};
	const renderChatStep = () => {
		switch (isOpenChat) {
			case false:
				return (
					<ListChatMobile listConversation={listConversation} handleRoomChat={handleRoomChat} />
				);
			case true:
				return <RoomChatMobile conversaiton={listChat?.[0]} handleRoomChat={handleRoomChat} />;
		}
	};
	return <div>{renderChatStep()}</div>;
};

export default ChatMobile;
