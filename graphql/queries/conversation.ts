import { gql } from 'graphql-tag';

export const QUERIES_CONVERSATION = gql`
	subscription MyQuery {
		webchat_chat_conversation(order_by: { updated_at: desc }) {
			avatar
			conversation_id
			conversation_type
			name
			participate_user_id
			participates
			status
			type
			last_message
			update_at
			update_by
			unread_number
		}
	}
`;

export const QUERY_CONVERSATION_BY_MERCHANT_ID = gql`
	subscription MyQuery($participates: String) {
		webchat_chat_conversation(
			where: { participates: { _eq: $participates } }
			order_by: { update_at: desc }
		) {
			avatar
			conversation_id
			conversation_type
			name
			participate_user_id
			participates
			status
			type
			last_message
			update_at
			update_by
			unread_number
		}
	}
`;

export const INSERT_CONVERSATION_CALL = gql`
	mutation MyMutation($caller: uuid, $receiver: uuid, $hasVideo: Boolean) {
		insert_chatdb_chat_calls_one(
			object: { caller_id: $caller, receiver_id: $receiver, is_has_video: $hasVideo }
		) {
			id
		}
	}
`;

export const INSERT_NOTIFICATION_TMP = gql`
	mutation MyMutation(
		$listToken: jsonb
		$type: String
		$clickAction: String
		$notiType: String
		$dataNotification: jsonb
	) {
		insert_notification_notification_tmp(
			objects: {
				list_token: $listToken
				type: $type
				click_action: $clickAction
				noti_type: $notiType
				data_notification: $dataNotification
			}
		) {
			returning {
				id
			}
		}
	}
`;

export const update_message_call = (data: string) => {
	const queryString = `mutation MyMutation($id: uuid) {
			update_chatdb_chat_calls(where: { id: { _eq: $id } }, _set:{${data}}) {
				returning {
					id
					sdp_offer
					candidate_offer
				}
			}
		}`;
	return gql`
		${queryString}
	`;
};

export const QUERY_INCOMING_CALL = gql`
	subscription webchat_call($receiverId: uuid) {
		chatdb_chat_calls(
			where: {
				receiver_id: { _eq: $receiverId }
				is_calling: { _eq: true }
				is_accept: { _eq: false }
				is_bye: { _eq: false }
				event: { _eq: "offer-event" }
			}
		) {
			caller_id
			candidate_offer
			receiver_id
			candidate_answer
			created_at
			event
			id
			is_accept
			is_bye
			is_calling
			is_has_video
			is_reject
			caller {
				app_id
				avatar
				firebase_tokens
				id
				is_chat_accepted
				name
				parent_user_id
				phone
				signature
				slogan
			}
		}
	}
`;

export const DENIED_MESSAGE_CALL = gql`
	mutation MyMutation($id: uuid, $userId: uuid) {
		update_chatdb_chat_calls(
			where: { id: { _eq: $id } }
			_set: { event: "bye-event", user_created_bye: $userId }
		) {
			returning {
				id
				sdp_offer
				candidate_offer
			}
		}
	}
`;
