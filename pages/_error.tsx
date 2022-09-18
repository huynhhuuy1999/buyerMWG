import { ErrorComponent } from 'modules';
import { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

import { appActions } from '@/store/reducers/appSlice';

import { DeviceType } from '../enums';
import { useAppDispatch } from '../hooks';
import { checkDeviceMobile } from '../utils';
import Disconnect from './_offline';

export type ErrorPageProps = {
	err: Error;
	statusCode: number;
	isReadyToRender: boolean;
	children?: React.ReactElement;
	hasGetInitialPropsRun?: boolean;
};

function ErrorPage(props: any) {
	const [checkDisconnect, setCheckDisconnect] = useState(false);
	const dispatch = useAppDispatch();

	const router = useRouter();
	// const statusCode = props?.pageProps?.statusCode;
	// if (props?.pageProps?.statusCode === 404) return router.push('/404');
	useEffect(() => {
		if (props?.pageProps?.statusCode === 404) router.push('/404');
		if (props?.pageProps?.deviceType) {
			dispatch(appActions.setDeviceType(props?.pageProps?.deviceType));
		}
	}, [props]);

	useEffect(() => {
		if (!window.navigator.onLine) {
			setCheckDisconnect(true);
		}
	}, []);

	return (
		<Fragment>
			{props?.pageProps?.statusCode !== 404 ? (
				checkDisconnect ? (
					<Disconnect />
				) : (
					<ErrorComponent />
				)
			) : (
				<ErrorComponent />
			)}
		</Fragment>
	);
}

// Error.getInitialProps = async ({ res, err }: any) => {
ErrorPage.getInitialProps = async (props: any) => {
	const { res, err, req } = props;

	let deviceType = DeviceType.DESKTOP;
	if (!res || !err) {
		if (req) {
			deviceType = checkDeviceMobile(req);
			if (res?.statusCode === 404) {
				// Opinionated: do not record an exception in Sentry for 404
				// return { statusCode: 404 };
				return { statusCode: 404, deviceType };
				// return { ...errorInitialProps, statusCode: 404, deviceType };
			}
		}
		if (err) {
			if (err?.statusCode === 404) {
				return { statusCode: 404, deviceType };
				// return { ...errorInitialProps, statusCode: 404, deviceType };
			}
			// return { ...errorInitialProps, statusCode: 500, deviceType };
			return { statusCode: 500, deviceType };
		}
		return { statusCode: 500, deviceType };
	}

	const errorInitialProps = await NextErrorComponent.getInitialProps({
		res,
		err,
	} as NextPageContext);

	if (req) {
		deviceType = checkDeviceMobile(req);
		if (res?.statusCode === 404) {
			// Opinionated: do not record an exception in Sentry for 404
			// return { statusCode: 404 };
			return { ...errorInitialProps, statusCode: 404, deviceType };
		}
	}
	if (err) {
		if (err?.statusCode === 404) {
			return { ...errorInitialProps, statusCode: 404, deviceType };
		}
		return { ...errorInitialProps, statusCode: 500, deviceType };
	}

	return { ...errorInitialProps, statusCode: 500, deviceType };
};

export default ErrorPage;
