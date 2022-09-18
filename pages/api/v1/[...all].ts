import {
	ACCESS_TOKEN,
	// APP_ID,
	// SIGNATURE,
	// VV_APP_ID,
	// VV_APP_SIGNATURE,
	WEB_TOKEN,
	// WEB_TOKEN_KEY,
} from 'constants/';
import Cookies from 'cookies';
import httpProxy from 'http-proxy';
import { NextApiRequest, NextApiResponse } from 'next';

const proxy = httpProxy.createProxyServer();

export const config = {
	api: {
		bodyParser: false,
		externalResolver: true,
	},
};

const handler = (req: NextApiRequest, res: NextApiResponse<any>) => {
	return new Promise((resolve: any) => {
		const cookies = new Cookies(req, res);
		const accessToken = cookies.get(ACCESS_TOKEN);
		const webToken = cookies.get(WEB_TOKEN);
		// const appId = cookies.get(APP_ID);
		// const signature = cookies.get(SIGNATURE);

		if (Boolean(accessToken) && Boolean(webToken)) {
			req.headers['authorization'] = `Bearer ${accessToken}`;
			// req.headers[WEB_TOKEN_KEY] = webToken;
			// req.headers[VV_APP_ID] = appId;
			// req.headers[VV_APP_SIGNATURE] = signature;
		}

		proxy.web(req, res, {
			target: process.env.BASE_API_URL,
			changeOrigin: true,
			selfHandleResponse: false,
		});

		proxy.once('proxyRes', () => {
			resolve(true);
		});
	});
};

export default handler;
