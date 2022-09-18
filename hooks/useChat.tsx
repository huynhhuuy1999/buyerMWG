import { ChatPayload, MessagePayload } from 'models';
import { useDispatch } from 'react-redux';

import {
	createConversationRequest,
	seenMessageRequest,
	sendMessageMediaRequest,
	sendMessageRequest,
	sendReactionRequest,
	sendTypingRequest,
} from '@/store/reducers/chatSlice';
export const useChat = () => {
	const dispatch = useDispatch();
	const sendMessage = async (data: ChatPayload) => {
		await dispatch(sendMessageRequest(data));
	};
	const createConversation = async (data: ChatPayload) => {
		await dispatch(createConversationRequest(data));
	};
	const sendMessageMedia = async (data: ChatPayload) => {
		await dispatch(sendMessageMediaRequest(data));
	};
	const sendReaction = async (data: MessagePayload) => {
		await dispatch(sendReactionRequest(data));
	};
	const sendTyping = async (data: MessagePayload) => {
		await dispatch(sendTypingRequest(data));
	};
	const seenMessage = async (data: MessagePayload) => {
		await dispatch(seenMessageRequest(data));
	};
	return {
		sendMessage,
		createConversation,
		sendMessageMedia,
		sendReaction,
		sendTyping,
		seenMessage,
	};
};
