import { QueryParams } from 'models';
// import { ConversationPayload, MessagePayload } from '@/models/chat';
import request from 'utils/request';

export const getListUserChatAPI = (params: QueryParams): Promise<any> => {
	return request({
		url: `/chat/user/search`,
		method: 'GET',
		params,
	});
};

export const postMessage = (data: any): Promise<any> => {
	return request({
		url: `/webchat/message`,
		method: 'POST',
		data,
	});
};

export const postMessageMediaAPI = (data: any): Promise<any> => {
	return request({
		url: `/webchat/media`,
		method: 'POST',
		data,
	});
};

export const postConversation = (data: any): Promise<any> => {
	return request({
		url: '/webchat/conversation',
		method: 'POST',
		data,
	});
};

export const postReactionAPI = (data: any): Promise<any> => {
	return request({
		url: '/webchat/reaction',
		method: 'POST',
		data,
	});
};

export const postTyping = (data: any): Promise<any> => {
	return request({
		url: '/webchat/typing',
		method: 'POST',
		data,
	});
};

export const postSeenAPI = (data: any): Promise<any> => {
	return request({
		url: 'webchat/seen',
		method: 'POST',
		data,
	});
};

export const uploadMultiFileChatAPI = (data: FormData) => {
	return request({
		url: '/webchat/uploadmultifile',
		method: 'POST',
		headers: { 'Content-Type': 'multipart/form-data' },
		data,
	});
};

export const getUserChatAPI = (userId: string): Promise<any> => {
	return request({
		url: `/chat/user/${userId}`,
		method: 'GET',
	});
};
