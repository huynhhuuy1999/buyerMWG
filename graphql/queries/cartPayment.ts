import { gql } from 'graphql-tag';

export const QUERY_ORDER_PAYMENT = gql`
	subscription MyQuery($order_id: String) {
		orderpush_order_payment_result(where: { order_id: { _eq: $order_id } }) {
			id
			new_cart_id
			order_id
			exception_message
			payment_status
		}
	}
`;

export const QUERY_ORDER_INFO = gql`
	subscription MyQuery($order_id: String) {
		orderpush_order_result(where: { order_id: { _eq: $order_id } }) {
			cart_id
			new_cart_id
			order_id
			status
			user_id
		}
	}
`;
