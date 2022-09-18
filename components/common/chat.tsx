import { Conversation } from 'models';
import dynamic from 'next/dynamic';
import React from 'react';

// import Conversation from '@/modules/conversation';
interface IChatProps {
	listRoom?: Conversation[];
	listRoomHidden?: Conversation[];
	handleRoomChat?: Function;
}

interface IChatComponent {
	room: Conversation;
	handleRoomChat?: Function;
}
interface ContactSupportProps {
	width?: string;
	height?: string;
	bottom?: string;
	right?: string;
	zIndex?: number;
	listChat?: Conversation[];
	handleRoomChat?: Function;
}
const ContactSupport = dynamic(() => import('../contact-support')) as React.FC<ContactSupportProps>;
const RoomChat = dynamic(() => import('@/modules/conversation/index')) as React.FC<IChatComponent>;

const Chat: React.FC<IChatProps> = ({ listRoom, handleRoomChat, listRoomHidden }) => {
	return (
		<>
			<div className='fixed bottom-1 right-24 z-30'>
				<div className='flex justify-end space-x-2'>
					{listRoom &&
						listRoom.length > 0 &&
						listRoom
							.slice(0, 1)
							.map((item: Conversation, index) => (
								<RoomChat room={item} key={index} handleRoomChat={handleRoomChat} />
							))}
					<ContactSupport listChat={listRoomHidden} handleRoomChat={handleRoomChat} />
				</div>
			</div>
		</>
	);
};
export default Chat;
