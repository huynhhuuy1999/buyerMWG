import { useAppSelector } from 'hooks';
import React, { Fragment, useEffect, useState } from 'react';

import { Content, Conversation, Users } from '@/models/chat';
import { getUserChatAPI } from '@/services/chat';
import { listConversationSelector, messageSentSelector } from '@/store/reducers/chatSlice';

import HeaderActionChat from './headerActionChat';
import HeaderChat from './headerChat';
import InputChat from './inputChat';
import MessageOrder from './messageOrder';
interface IConversationProps {
	room: Conversation;
	handleRoomChat?: Function;
}
const Conversation: React.FC<IConversationProps> = ({
	room,
	handleRoomChat,
}: IConversationProps) => {
	const [conversation, setConversation] = useState<Conversation>(room);
	const [listUserChat, setListUserChat] = useState<Users[]>([]);
	const [replyTo, setReplyTo] = useState<Content>({});
	const listConversation = useAppSelector(listConversationSelector);
	const messageSent = useAppSelector(messageSentSelector);

	const [isSearch, setIsSearch] = useState<boolean>(false);
	const [isShowMore, setIsShowMore] = useState<boolean>(false);

	// const resultConversation = useSubscription(QUERY_CONVERSATION_BY_MERCHANT_ID, {
	// 	variables: {
	// 		participates: `[${merchant.userId}]`,
	// 	},
	// });

	useEffect(() => {
		if (room) {
			setConversation(room);
			if (room.participates && room.conversation_type !== 'individual') {
				room.participates
					.replace('[', '')
					.replace(']', '')
					.split(',')
					.forEach((item: string) => {
						if (item) {
							getUserChatAPI(item).then((response) => {
								if (!response.isError && response.data) {
									setListUserChat((list) => list.concat(response.data));
								}
							});
						}
					});
			} else {
				const userTmp: Users = {
					id: room.participates?.replace('[', '').replace(']', ''),
					name: room.name,
					avatar: room.avatar,
					is_chat_accepted: true,
				};
				setListUserChat([userTmp]);
			}
		}
	}, [room]);

	useEffect(() => {
		const getConversation = listConversation.find(
			(item) => item.participates === conversation?.participates,
		);
		if (!conversation?.conversation_id) {
			if (getConversation) {
				setConversation(getConversation);
			}
		}
	}, [listConversation]);

	// const onTyping = async () => {};

	return (
		<Fragment>
			<div className='relative h-[450px] w-80 rounded border bg-white'>
				<div className=''>
					<HeaderChat
						isShowMore={isShowMore}
						setIsShowMore={setIsShowMore}
						conversation={conversation}
						handleRoomChat={handleRoomChat}
					/>
					<HeaderActionChat
						isSearch={isSearch}
						setIsSearch={setIsSearch}
						listUserChat={listUserChat}
						conversation={conversation}
					/>
				</div>
				<div className='flex h-[350px] flex-col justify-end bg-[#f0f0f0]'>
					{conversation && conversation.conversation_id && (
						<MessageOrder
							conversation={conversation}
							messageSent={messageSent}
							listUserChat={listUserChat}
							setReplyTo={setReplyTo}
						/>
					)}
					<div className='bottom-0 w-full bg-white'>
						<InputChat
							conversation={conversation}
							replyTo={replyTo}
							setReplyTo={setReplyTo}
							messageSent={messageSent}
							listConversation={listConversation}
							merchant={listUserChat[0]}
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Conversation;
