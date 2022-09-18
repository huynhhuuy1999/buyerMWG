import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	ChatPayload,
	Conversation,
	MerchantChat,
	MessageChat,
	MessagePayload,
	QueryParams,
	Users,
} from 'models';
import moment from 'moment';
import {
	getListUserChatAPI,
	postConversation,
	postMessage,
	postMessageMediaAPI,
	postReactionAPI,
	postSeenAPI,
	postTyping,
} from 'services';
import { RootState } from 'store';
export interface ChatState {
	isLoading: boolean;
	listRoom: Conversation[];
	listHiddenRoom: Conversation[];
	listUserChat: Users[];
	userInfoChat?: MerchantChat | null;
	messageSent: MessageChat[];
	listConversation: Conversation[];
	conversationId: string;
	messageId: string;
	participateUserId: string;
	stepIframe: string;
}
const initialState: ChatState = {
	isLoading: false,
	listRoom: [],
	listUserChat: [],
	listHiddenRoom: [],
	listConversation: [],
	userInfoChat: null,
	messageSent: [],
	conversationId: '',
	messageId: '',
	participateUserId: '',
	stepIframe: '',
};

export const getListUserChatRequest = createAsyncThunk(
	'chat/user/search',
	async (params: QueryParams) => {
		const response = await getListUserChatAPI(params);
		if (response?.isError) {
			return Promise.reject(response.isError);
		} else {
			return response.data;
		}
	},
);

export const sendMessageRequest = createAsyncThunk('webchat/message', async (data: ChatPayload) => {
	const response = await postMessage(data);
	if (response?.isError) {
		return Promise.reject(response.isError);
	} else {
		return response.data;
	}
});

export const sendMessageMediaRequest = createAsyncThunk(
	'webchat/media',
	async (data: ChatPayload) => {
		const response = await postMessageMediaAPI(data);
		if (response?.isError) {
			return Promise.reject(response.isError);
		} else {
			return response.data;
		}
	},
);

export const sendReactionRequest = createAsyncThunk(
	'webchat/reaction',
	async (data: MessagePayload) => {
		const payload = {
			data,
			timestampz: moment(),
		};
		const response = await postReactionAPI(payload);
		if (response?.isError) {
			return Promise.reject(response.isError);
		} else {
			return response.data;
		}
	},
);

export const sendTypingRequest = createAsyncThunk(
	'webchat/typing',
	async (data: MessagePayload) => {
		const payload = {
			data,
			timestampz: moment(),
		};
		const response = await postTyping(payload);
		if (response?.isError) {
			return Promise.reject(response.isError);
		} else {
			return response.data;
		}
	},
);

export const seenMessageRequest = createAsyncThunk('webchat/seen', async (data: MessagePayload) => {
	const payload = {
		data,
		timestampz: moment(),
	};
	const response = await postSeenAPI(payload);
	if (response?.isError) {
		return Promise.reject(response.isError);
	} else {
		return response.data;
	}
});

export const createConversationRequest = createAsyncThunk(
	'webchat/conversation',
	async (data: ChatPayload) => {
		const response = await postConversation(data);
		if (response?.isError) {
			return Promise.reject(response.isError);
		} else {
			return response.data;
		}
	},
);

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setListChat(state, action: PayloadAction<Conversation[]>) {
			state.isLoading = true;
			state.listRoom = [...action.payload];
		},
		handleRoomChat(
			state,
			action: PayloadAction<{
				status?: number;
				newRoom: Conversation;
				listChat: Conversation[];
			}>,
		) {
			const { status, listChat, newRoom } = action.payload;
			let countRoom = listChat?.length ? listChat.length : 0;
			state.userInfoChat = undefined;
			const check = listChat.filter((item: Conversation) => {
				if (item.conversation_id) {
					if (item.conversation_id !== newRoom.conversation_id) return item;
				} else {
					if (item.participates !== newRoom.participates) return item;
				}
			});
			switch (status) {
				case 1:
					if (countRoom > 0) {
						if (state.listHiddenRoom.length > 0) {
							state.listRoom = [newRoom, ...check];
							state.listHiddenRoom = [
								...state.listHiddenRoom.filter((item: Conversation) => {
									if (
										item.conversation_id !== newRoom.conversation_id &&
										(!check || !check.find((data) => data.conversation_id === item.conversation_id))
									)
										return item;
								}),
								...check,
							];
						} else {
							state.listRoom = [newRoom, ...check];
							state.listHiddenRoom = [...check];
						}
					} else {
						countRoom = state.listHiddenRoom.length;
						if (countRoom > 0) {
							state.listRoom = [newRoom];
							state.listHiddenRoom = state.listHiddenRoom
								? [
										...state.listHiddenRoom.filter((item: Conversation) => {
											if (item.conversation_id !== newRoom.conversation_id) return item;
										}),
								  ]
								: [];
						} else {
							state.listRoom = [newRoom];
							state.listHiddenRoom = [];
						}
					}
					return;
				case 2:
					state.listRoom = check ? [...check] : [];
					if (state.listHiddenRoom.length > 0) {
						if (check.length > 1) {
							state.listHiddenRoom = [
								...state.listHiddenRoom.filter((item: Conversation) => {
									if (
										item.conversation_id !== newRoom.conversation_id &&
										(!check || !check.find((data) => data.conversation_id === item.conversation_id))
									) {
										return item;
									}
								}),
								...check.filter((item, index) => index > 0 && item),
							];
						} else {
							state.listHiddenRoom = [
								...state.listHiddenRoom.filter((item: Conversation) => {
									if (
										item.conversation_id !== newRoom.conversation_id &&
										(!check || !check.find((data) => data.conversation_id === item.conversation_id))
									) {
										return item;
									}
								}),
							];
						}
					} else {
						state.listHiddenRoom = [...check];
					}
					return;
				case 3:
					if (countRoom > 1) {
						state.listHiddenRoom.shift();
						state.listHiddenRoom = [
							...state.listHiddenRoom.filter((item: Conversation) => {
								if (item.conversation_id) {
									if (item.conversation_id !== newRoom.conversation_id) return item;
								} else {
									if (item.participates !== newRoom.participates) return item;
								}
							}),
							newRoom,
						];
						state.listRoom = [...check];
					} else {
						state.listRoom = [];
						state.listHiddenRoom = [
							...state.listHiddenRoom.filter((item: Conversation) => {
								if (item.conversation_id) {
									if (item.conversation_id !== newRoom.conversation_id) return item;
								} else {
									if (item.participates !== newRoom.participates) return item;
								}
							}),
							newRoom,
						];
					}
					return;
				default:
					return;
			}
		},
		setListRoom(state, action: PayloadAction<{ newRoom: Conversation; listChat: Conversation[] }>) {
			state.isLoading = true;
			const { newRoom, listChat } = action.payload;
			let countRoom = listChat?.length ? listChat.length : 0;
			const check = listChat.filter((item: Conversation) => {
				if (item.conversation_id) {
					if (item.conversation_id !== newRoom.conversation_id) return item;
				} else {
					if (item.participates !== newRoom.participates) return item;
				}
			});
			if (countRoom > 0) {
				if (state.listHiddenRoom.length > 0) {
					state.listRoom = [newRoom, ...check];
					state.listHiddenRoom = [
						...state.listHiddenRoom.filter((item: Conversation) => {
							if (
								item.conversation_id !== newRoom.conversation_id &&
								(!check || !check.find((data) => data.conversation_id === item.conversation_id))
							)
								return item;
						}),
						...check,
					];
				} else {
					state.listRoom = [newRoom, ...check];
					state.listHiddenRoom = [...check];
				}
			} else {
				countRoom = state.listHiddenRoom.length;
				if (countRoom > 0) {
					state.listRoom = [newRoom];
					state.listHiddenRoom = state.listHiddenRoom
						? [
								...state.listHiddenRoom.filter((item: Conversation) => {
									if (item.conversation_id !== newRoom.conversation_id) return item;
								}),
						  ]
						: [];
				} else {
					state.listRoom = [newRoom];
					state.listHiddenRoom = [];
				}
			}
		},
		setConversationId(state, action: PayloadAction<string>) {
			state.conversationId = action.payload;
		},
		setMerchantChat(state, action: PayloadAction<MerchantChat>) {
			state.userInfoChat = action.payload;
		},
		setMessageSent(state, action: PayloadAction<MessageChat[]>) {
			state.messageSent = action.payload;
		},
		setListConversation(state, action: PayloadAction<Conversation[]>) {
			state.listConversation = action.payload.sort((a, b) => {
				if (a.last_message?.CreatedAt && b.last_message?.CreatedAt) {
					if (a.last_message?.CreatedAt > b.last_message?.CreatedAt) return -1;
					else if (a.last_message?.CreatedAt < b.last_message?.CreatedAt) return 1;
					return 0;
				}
				return 0;
			});
		},
		setStepIframe(state, action: PayloadAction<string>) {
			state.stepIframe = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(sendMessageRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(sendMessageRequest.fulfilled, (state, action: PayloadAction<any>) => {
				const { MessageId } = action.payload;
				state.messageId = MessageId;
				state.isLoading = false;
			})
			.addCase(sendMessageRequest.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(createConversationRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createConversationRequest.fulfilled, (state, action: PayloadAction<any>) => {
				const { ConversationId, MessageId } = action.payload;
				state.isLoading = false;
				state.messageId = MessageId;
				state.conversationId = ConversationId;
			})
			.addCase(createConversationRequest.rejected, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
			})
			.addCase(sendReactionRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(sendReactionRequest.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(sendTypingRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(sendTypingRequest.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(seenMessageRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(seenMessageRequest.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(getListUserChatRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getListUserChatRequest.fulfilled, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.listUserChat = action.payload;
			});
	},
});

export const chatAction = chatSlice.actions;

export const listChatSector = (state: RootState) => state.chat.listRoom;
export const isLoadingSector = (state: RootState) => state.chat.isLoading;
export const conversationIdSector = (state: RootState) => state.chat.conversationId;
export const messageIdSelector = (state: RootState) => state.chat.messageId;
export const listHiddenRoomSector = (state: RootState) => state.chat.listHiddenRoom;
export const participatesSector = (state: RootState) => state.chat.participateUserId;
export const listUserChatSector = (state: RootState) => state.chat.listUserChat;
export const userInfoChatSector = (state: RootState) => state.chat.userInfoChat;
export const messageSentSelector = (state: RootState) => state.chat.messageSent;
export const listConversationSelector = (state: RootState) => state.chat.listConversation;
export const stepIframeSelector = (state: RootState) => state.chat.stepIframe;
const chatReducer = chatSlice.reducer;

export default chatReducer;
