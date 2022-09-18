import { REGEX_FACEBOOK_ID, REGEX_TIKTOK_ID, REGEX_YOUTUBE_ID } from '@/constants/index';

const detectUrlMedia = (url: any) => {
	const isYoutubeUrl = url.match(REGEX_YOUTUBE_ID);
	const isFacebookUrl = url.match(REGEX_FACEBOOK_ID);
	const isTikTokUrl = url.match(REGEX_TIKTOK_ID);

	if (isYoutubeUrl) {
		return {
			url: `https://www.youtube.com/embed/${url.match(REGEX_YOUTUBE_ID)[1]}`,
			isYoutubeUrl: true,
		};
	}
	if (isFacebookUrl) {
		return {
			url: `https://www.facebook.com/plugins/video.php?href=${url}&show_text=0`,
			isFacebookUrl: true,
		};
	}

	if (isTikTokUrl) {
		return {
			url: `https://www.tiktok.com/embed/v2/${url
				?.match(/(?:video\/)\d+/)[0]
				?.replace('video/', '')}`,
			isFacebookUrl: true,
		};
	}
	return { url: url, isYoutubeUrl: false, isFacebookUrl: false, isTikTokUrl: false }; //return Url normal if not url youtube
};
export { detectUrlMedia };
