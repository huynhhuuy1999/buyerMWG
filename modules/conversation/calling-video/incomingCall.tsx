import { useMutation, useSubscription } from '@apollo/react-hooks';
import { DENIED_MESSAGE_CALL, QUERY_INCOMING_CALL } from 'graphql/queries/conversation';
import React, { Fragment, useEffect, useState } from 'react';

import { ConfirmNotification } from '@/components/Notification/Confirm';
import { useAuth } from '@/hooks/useAuth';
import { CallVideo } from '@/models/chat';

const InComingCall: React.FC = () => {
	const { currentUser } = useAuth();
	const callResult = useSubscription(QUERY_INCOMING_CALL, {
		variables: {
			receiverId: currentUser?.id,
		},
	});
	const [updateDenied] = useMutation(DENIED_MESSAGE_CALL);
	const [callModel, setCallModel] = useState<CallVideo>();
	useEffect(() => {
		if (!callResult.error && !callResult.loading && callResult.data) {
			setCallModel(callResult.data.chatdb_chat_calls?.[0]);
		}
	}, [callResult]);
	const onAcceptCall = () => {
		if (callModel) {
			console.log('callModel', callModel);
			const newWindow = window.open(
				'/guest-call/' +
					callModel.id +
					'?is_has_video=' +
					callModel.is_has_video +
					'&caller=' +
					callModel.caller_id +
					'&ring_ton=' +
					callModel.receiver_id,
				'_blank',
				'location=yes,height=730,width=1200,scrollbars=no,status=yes',
			);
			// await onCall(data);
			if (newWindow) {
				newWindow.opener = null;
			}
		}
	};
	const onCancel = () => {
		if (callModel && currentUser && callModel.id) {
			updateDenied({
				variables: {
					id: callModel.id,
					userId: currentUser.id,
				},
			});
		}
	};
	return (
		<Fragment>
			{callModel?.id && (
				<ConfirmNotification
					message={''}
					titleHead={'Cuộc gọi tới từ ' + callModel.caller?.name}
					contextConfirm={'Đồng ý'}
					contextNotConfirm={'Từ chối'}
					onConfirm={async () => onAcceptCall()}
					onNotConfirm={async () => onCancel()}
				/>
			)}
		</Fragment>
	);
};

export default InComingCall;
