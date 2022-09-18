import 'moment/locale/vi';

import moment from 'moment';

import { timeConfig } from '../configs';
import { REGEX_APPLICATION, REGEX_IMAGE, REGEX_VIDEO } from '../constants';

export const formatTime = (time: string, format: any = timeConfig.locales?.vi, locale = 'vi') => {
	if (time) {
		return moment(time).locale(locale).format(format);
	}

	return null;
};

export const checkTypeMedia = (media_url: string) => {
	const type = media_url.substring(media_url.lastIndexOf('.') + 1);
	if (REGEX_VIDEO.test(media_url)) {
		return 'video/' + type;
	} else if (REGEX_IMAGE.test(media_url)) {
		return 'image/' + type;
	} else if (REGEX_APPLICATION.test(media_url)) {
		return 'application/' + type;
	}
	return type;
};
