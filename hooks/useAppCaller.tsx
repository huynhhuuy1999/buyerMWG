import { useMutation } from '@apollo/react-hooks';
import { INSERT_CONVERSATION_CALL, INSERT_NOTIFICATION_TMP } from 'graphql/queries/conversation';
import { CallVideo, NotificationTmp } from 'models';

export const useAppCaller = () => {
	const useCreateCall = () => {
		const [createCall] = useMutation(INSERT_CONVERSATION_CALL);
		const [createNotification] = useMutation(INSERT_NOTIFICATION_TMP);
		const handleCreateCall = async (model: CallVideo) => {
			const response = await createCall({
				variables: {
					caller: model.caller_id,
					receiver: model.receiver_id,
					hasVideo: model.is_has_video,
				},
			});

			const { insert_chatdb_chat_calls_one } = response.data;
			return insert_chatdb_chat_calls_one.id;
		};
		const handlePushNotification = async (model: NotificationTmp) => {
			const response = await createNotification({
				variables: {
					listToken: model.list_token,
					type: model.type,
					clickAction: model.click_action,
					notiType: model.noti_type,
					dataNotification: model.data_notification,
				},
			});
			const { insert_notification_notification_tmp } = response.data;
			return insert_notification_notification_tmp?.returning?.[0]?.id;
		};

		return { handleCreateCall, handlePushNotification };
	};

	return { useCreateCall };
};
