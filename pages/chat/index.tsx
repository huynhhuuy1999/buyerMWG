import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

import { DeviceType } from '@/enums/index';
import { useAppSelector } from '@/hooks/useAppSelector';
import DefaultLayoutMobile from '@/layouts/defaultLayout.mobile';
import { CallVideo } from '@/models/chat';
import { ComingSoonMobile } from '@/modules/coming-soon';
import { CallingVideo } from '@/modules/conversation/calling-video';
import { deviceTypeSelector } from '@/store/reducers/appSlice';

const ChatPage: NextPage = () => {
	const router = useRouter();
	const deviceType = useAppSelector(deviceTypeSelector);
	const { slug, ring_ton, is_has_video, caller } = router.query;
	const [model, setModel] = useState<CallVideo>();

	useEffect(() => {
		if (is_has_video && ring_ton && slug) {
			if (!model || !model.id) {
				const payload: CallVideo = {
					id: slug as string,
					caller_id: caller as string,
					receiver_id: ring_ton as string,
					is_has_video: (is_has_video as string) === 'true',
				};
				setModel(payload);
			}
		}
	}, [caller, is_has_video, model, ring_ton, slug]);
	return (
		<Fragment>
			{deviceType === DeviceType.MOBILE ? (
				<DefaultLayoutMobile>
					<ComingSoonMobile />
				</DefaultLayoutMobile>
			) : (
				<CallingVideo model={model} />
			)}
		</Fragment>
	);
};

export default ChatPage;
