import 'react-virtualized/styles.css';
import 'styles/globals.css';
import 'styles/icons.css';
import 'tailwindcss/tailwind.css';

import { ApolloProvider } from '@apollo/react-hooks';
import { Head } from 'components';
import { getMessaging, onMessage } from 'firebase/messaging';
import {
	fetcher,
	useAppCart,
	useAppChat,
	useAppDispatch,
	useAppSelector,
	useAuth,
	useVersion,
} from 'hooks';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { FullLayout } from 'layouts';
import { AppPropsWithLayout, GuestLoginData, GuestLoginPayload, TokenDecode } from 'models';
// import { NextPageContext } from 'next';
// import { SessionProvider } from 'next-auth/react';
import App from 'next/app';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next/types';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, wrapper } from 'store';
import { SWRConfig } from 'swr';
import useApollo from 'utils/apollo-client';
import * as gtag from 'utils/gtag';
import { appIdentityRegister, fetchNewCart, guestLogin, refreshToken } from 'utils/requestServer';
import { iconSheet } from 'vuivui-icons';

import BackToTop from '@/components/back-to-top';
import Notification from '@/components/Notification';
import { appActions } from '@/store/reducers/appSlice';
import { authActions, getSelfInfoRequest } from '@/store/reducers/authSlice';
import { cartActions, cartSelector, reCheckStatusCart } from '@/store/reducers/cartSlice';
import {
	catalogSearchSuggestionSelector,
	fetchCatalogSuggestionRequest,
} from '@/store/reducers/categorySlide';
import { getCancelOrder } from '@/store/reducers/customerSlice';
import { firebaseCloudMessaging } from '@/utils/firebase';

import { DEVICE_TYPE, LogoImage } from '../constants';
import { checkDeviceMobile } from '../utils';

interface MyPageContext extends NextPageContext {
	ctx: NextPageContext;
}

const DEFAULT_REFRESH_INTERVAL = 60 * 60 * 1000;

const ContentApp = ({ Component, pageProps }: any) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const Layout = Component.Layout ?? FullLayout;
	const client = useApollo(pageProps?.initialApolloState);
	const catalogSearchSuggestion = useAppSelector(catalogSearchSuggestionSelector);
	const dataCartSelector = useAppSelector(cartSelector);
	const { checkVersion } = useVersion();
	const { cartId } = useAppCart();
	const { currentUser } = useAuth();
	const { useDeclareIframe } = useAppChat();
	useDeclareIframe('vuivui-chat-app', 'right-side-menu');
	// if (pageProps?.error) {
	// 	// console.log('pageProps?.error', pageProps?.error?.message);
	// 	const { message }: any = pageProps?.error;
	// 	if (message === 'Failed to fetch') router.push('/_error');
	// }

	useEffect(() => {
		if (!catalogSearchSuggestion || (catalogSearchSuggestion || []).length <= 0) {
			dispatch(fetchCatalogSuggestionRequest());
		}
	}, [catalogSearchSuggestion]);

	useEffect(() => {
		if (pageProps?.deviceType) {
			Cookies.set(DEVICE_TYPE, pageProps.deviceType, {
				domain: process.env.NEXT_PUBLIC_ENDPOINT_NAME,
			});
		}
	}, [pageProps]);

	// useEffect(() => {
	// 	dispatch(trackAction.fetchListHistorySearch(listHistory as string[]));
	// 	dispatch(trackAction.fetchListTrendingSearch(listTrending as string[]));
	// }, [listHistory, listTrending]);

	// useEffect(() => {
	// 	if (!window.navigator.onLine) {
	// 		console.log('offline');
	// 		router.reload();
	// 	}
	// }, [router.pathname]);

	useEffect(() => {
		checkVersion();
		dispatch(getCancelOrder());
	}, []);

	useEffect(() => {
		dispatch(appActions.setIOSDevice(pageProps.isIOSDevice));
	}, [pageProps.isIOSDevice, dispatch]);

	useEffect(() => {
		if (pageProps.deviceType) dispatch(appActions.setDeviceType(pageProps.deviceType));
	}, [dispatch, pageProps.deviceType]);

	useEffect(() => {
		dispatch(authActions.setLoginRoles(pageProps?.auth));
	}, [pageProps?.auth, dispatch]);

	useEffect(() => {
		!dataCartSelector.hasInitial &&
			dispatch(cartActions.callbackItems(pageProps.initialCartItems?.itemsLength));
	}, [pageProps.initialCartItems, dataCartSelector.hasInitial, dispatch]);

	useEffect(() => {
		dataCartSelector.hasInitial && dispatch(reCheckStatusCart(cartId));
	}, [cartId, dataCartSelector.hasInitial, dispatch, pageProps.initialCartItems?.cartId]);

	useEffect(() => {
		if (!currentUser?.id) {
			dispatch(getSelfInfoRequest()).then((data) => {
				if (data.payload && data.payload.id) {
					setToken(data.payload.id);
				}
			});
			async function setToken(userId: string) {
				try {
					const token = await firebaseCloudMessaging.init(userId);
					if (token) {
						await getMessage();
					}
				} catch (error) {
					console.log('error token', error);
				}
			}
		}
	}, [dispatch, currentUser]);

	useEffect(() => {
		const handleRouteChange = (url: URL) => {
			gtag.pageview(url);
			// Notification.Loading.remove(300);
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			// router.events.on('routeChangeStart', () => {
			//  Notification.Loading.default();
			// });
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	const getMessage = () => {
		const messaging = getMessaging();
		onMessage(messaging, (message) => {
			if (message.notification) {
				const data = message.data?.payload && JSON.parse(message.data.payload);
				Notification.Coming.show({
					message: message.notification.body,
					titleHeade: message.notification.title,
					isOpen: true,
					timeout: 10000,
					icon: data?.avatar ? data?.avatar : message.notification.image || LogoImage,
				});
			}
		});
	};

	return (
		<SWRConfig
			value={{
				revalidateIfStale: true,
				revalidateOnReconnect: true,
				revalidateOnFocus: false,
				revalidateOnMount: true,
				onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
					// Never retry on 404.
					if (error.status === 404) return;

					// Only retry up to 3 times.
					if (retryCount >= 3) return;

					// Retry after 500 mili seconds.
					setTimeout(() => revalidate({ retryCount }), 2000);
				},
				refreshInterval: process.env.NEXT_PUBLIC_REFRESH_INTERVAL
					? +process.env.NEXT_PUBLIC_REFRESH_INTERVAL
					: DEFAULT_REFRESH_INTERVAL,
				fetcher,
				provider: () => new Map(),
			}}
		>
			{/* <SessionProvider> */}
			<ApolloProvider client={client as any}>
				<Head />
				<Layout>
					<Component {...pageProps} />
				</Layout>
				<BackToTop />
			</ApolloProvider>
			{/* </SessionProvider> */}
		</SWRConfig>
	);
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
	return (
		<Provider store={store}>
			{iconSheet}

			<ContentApp pageProps={{ ...pageProps }} Component={Component}></ContentApp>
		</Provider>
	);
};

MyApp.getInitialProps = wrapper.getInitialPageProps((store) => async (ctx: MyPageContext) => {
	// MyApp.getInitialProps = wrapper.getInitialPageProps((store) => async (ctx: AppContext) => {
	try {
		const { req, res, err } = ctx.ctx;

		const appProps = await App.getInitialProps(ctx as any);
		if (!req || !res) {
			return {
				pageProps: {
					error: err,
				},
			};
		}

		const userAgent = req?.headers?.['user-agent'];

		const isIOS = Boolean(
			userAgent?.match(/iPad Simulator|iPhone Simulator|iPod Simulator|iPad|iPhone|iPod/i),
		);

		const isExpired: boolean = await refreshToken(req, res);
		const payload: GuestLoginPayload = await appIdentityRegister(req, res, isExpired);

		const data: GuestLoginData = await guestLogin(req, res, isExpired, payload);
		const token: TokenDecode = jwt_decode<TokenDecode>(data.accessToken);
		const initialCartItems = await fetchNewCart(req, res, data);

		const defaultProps = {
			...appProps,
			deviceType: checkDeviceMobile(req),
			isIOSDevice: isIOS,
			initialCartItems: initialCartItems,
			auth: { userId: token.user, roles: token.roles },
		};

		store.dispatch({
			type: appActions.setDeviceType,
			payload: checkDeviceMobile(req),
		});

		return {
			pageProps: {
				...defaultProps,
			},
		};
	} catch (error) {
		return {
			pageProps: {
				error,
			},
		};
	}
});
export default wrapper.withRedux(MyApp);
