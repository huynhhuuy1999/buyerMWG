export interface Conversation {
	id?: number;
	last_message?: LastMessage;
	unread?: number;
	participate_user_id?: string;
	participates?: string;
	status?: boolean;
	conversation_id?: string;
	name?: string;
	conversation_type?: string;
	type?: string;
	avatar?: string;
	created_at?: string;
	created_by?: string;
	update_at?: string;
	update_by?: string;
	unread_number?: number;
}
export interface Users {
	id?: string;
	name?: string;
	conversation?: Conversation[];
	avatar?: string;
	firebase_tokens?: any[];
	is_chat_accepted?: boolean;
	app_id?: string;
	signature?: string;
	slogan?: string;
	phone?: string;
}
export interface LastMessage {
	Id?: number;
	Type?: string;
	SendAt?: string;
	Status?: number;
	UserId?: string;
	SenderId?: string;
	CreatedAt?: string;
	MessageId?: string;
	Reactions?: string;
	ConversationId?: string;
	LastModified?: string;
	ReceivedAt?: string;
	LastMessage?: Content;
}
export interface Reaction {
	Name: string;
	UserId: string;
	Reaction: string;
}
export interface Content {
	type?: string;
	avatar?: string;
	msg_id?: string;
	sender?: string;
	content?: string;
	conv_id?: string;
	order_id?: string;
	reply_to?: string;
	conv_name?: string;
	conv_type?: string;
	media_url?: string[] | null;
	event_type?: string;
	participates?: string[];
}

export interface MessageChat {
	id?: number;
	user_id?: string;
	conversation_id?: string;
	message_id?: string;
	receiver_id?: string;
	received_at?: string;
	sender_id?: string;
	sender_at?: string;
	status?: number;
	type?: string;
	last_modified?: string;
	created_at?: string;
	reaction?: Reaction[];
	content?: Content;
}
export interface MessagePayload {
	content?: string;
	media_url?: string[];
	reply_to?: string;
	msg_id?: string;
	mgsId?: string;
	type?: string;
	conv_id: string;
}
export interface ConversationPayload {
	content?: string;
	avatar?: string;
	participates?: string[];
	conv_name?: string;
	conv_type?: string;
	type?: string;
}
export interface MerchantChat {
	fullPath?: string;
	name?: string;
	userId: string;
	brandId: string;
}

export interface ChatPayload {
	data: MessagePayload | ConversationPayload;
	mgsId: string;
	conversationId?: string;
	timezstampz: string;
}

export interface Candidate {
	sdpMLineIndex: number | null;
	sdpMid: number | null;
	candidate: string;
}

export interface VariationUpdate {
	key: string;
	value: string;
}
export interface CallVideo {
	id?: string;
	caller_id?: string;
	caller?: Users;
	receiver_id?: string;
	event?: string;
	type?: string;
	sdp_offer?: string;
	sdp_answer?: string;
	candidate_offer?: Candidate[];
	candidate_answer?: Candidate[];
	is_bye?: boolean;
	is_calling?: boolean;
	is_accept?: boolean;
	is_reject?: boolean;
	user_create_bye?: string;
	is_has_video?: boolean;
	required_call_end?: boolean;
	updated_at?: string;
}

export interface NotificationTmp {
	id?: string;
	notificaiton_id?: string;
	list_token?: any[];
	title?: string;
	content?: string;
	type?: string;
	object_id?: string;
	is_community?: string;
	click_action?: string;
	list_token_str?: string;
	img_src?: string;
	noti_type?: string;
	created_at?: string;
	updated_at?: string;
	data_notification?: DataNotification;
}

export interface DataNotification {
	id: string;
	avatar: string;
	handle: string;
	isVideo: boolean;
	nameCaller: string;
}
