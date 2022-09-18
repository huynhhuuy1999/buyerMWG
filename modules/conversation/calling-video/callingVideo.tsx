// import { useMutation } from '@apollo/react-hooks';
import { MODULE_CHAT } from 'enums';
import { CallVideo } from 'models';
import React, { Fragment, useEffect } from 'react';

interface ICallingVideoProps {
	model?: CallVideo;
}

const CallingVideo: React.FC<ICallingVideoProps> = ({ model }: ICallingVideoProps) => {
	useEffect(() => {
		const timeOut = setTimeout(() => {
			if (model && model.caller_id) {
				const callIframe = document.getElementById('vuivui-chat-app') as HTMLIFrameElement;
				if (callIframe) {
					callIframe.classList.remove('hidden');
					callIframe.style.width = '100vw';
					callIframe.style.height = '100vh';
					callIframe.style.left = '';
					callIframe.style.right = '';
					callIframe.style.top = '';
					callIframe.style.bottom = '';
					const chilldrenFrame = callIframe.contentWindow;
					if (chilldrenFrame) {
						chilldrenFrame.postMessage(
							{ type: MODULE_CHAT.CALLING, data: model },
							process.env.NEXT_PUBLIC_DOMAIN_URL_CHAT || '',
						);
					}
				}
			}
		}, 500);
		return () => clearTimeout(timeOut);
	}, [model]);
	return <Fragment></Fragment>;
};

export default CallingVideo;
