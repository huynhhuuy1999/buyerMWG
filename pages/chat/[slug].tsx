import { Head } from 'components';
import { DeviceType } from 'enums/';
import { useAppSelector } from 'hooks';
import { CallVideo, NextPageWithLayout } from 'models';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';

import { CallingVideo } from '@/modules/conversation/calling-video';
import { deviceTypeSelector } from '@/store/reducers/appSlice';

const ChatSlug: NextPageWithLayout = ({ title = 'Calling....', data }: any) => {
	const router = useRouter();
	const { slug, ring_ton, is_has_video, caller } = router.query;
	const [model, setModel] = useState<CallVideo>();
	const deviceType = useAppSelector(deviceTypeSelector);
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
			<Head title={title} />
			{deviceType === DeviceType.MOBILE ? (
				<Fragment>Mobile</Fragment>
			) : (
				<CallingVideo model={model} />
			)}
		</Fragment>
	);
};

export default ChatSlug;
