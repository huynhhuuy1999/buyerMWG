import { gql } from 'graphql-tag';

export const QUERY_MESSAGE_BY_CONVERSATION_ID = gql`
	subscription MyQuery($conversationId: uuid, $pageSize: Int) {
		webchat_chat_message(
			where: { conversation_id: { _eq: $conversationId } }
			distinct_on: [message_id, received_at]
			order_by: { received_at: desc, message_id: desc }
			limit: $pageSize
		) {
			conversation_id
			created_at
			id
			last_modified
			message_id
			received_at
			reaction
			receiver_id
			sender_id
			sent_at
			status
			type
			user_id
			content
		}
	}
`;

export const getMessageByMessageId = (messageId?: string) => {
	const queriesMessage = gql`
    subscription MyQuery {
        webchat_chat_message(where: {message_id: {_eq: "${messageId}"}}
	) {
            conversation_id
            created_at
            id
            last_modified
            message_id
            received_at
            reaction
            receiver_id
            sender_id
            sent_at
            status
            type
            user_id
            content
        }
    }`;
	return queriesMessage;
};

export const QUERY_MESSAGE_BY_MESSAGE_ID = gql`
	subscription MyQuery($messageId: uuid) {
		webchat_chat_message(where: { message_id: { _eq: $messageId } }) {
			conversation_id
			created_at
			id
			last_modified
			message_id
			received_at
			reaction
			receiver_id
			sender_id
			sent_at
			status
			type
			user_id
			content
		}
	}
`;
