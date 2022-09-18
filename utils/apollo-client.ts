import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { ACCESS_TOKEN } from 'constants/index';
import { createClient } from 'graphql-ws';
import cookies from 'js-cookie';
import { useMemo } from 'react';

const token = cookies.get(ACCESS_TOKEN);
let apolloClient: any;

const urlWssGraphql = process.env.NEXT_PUBLIC_WSS_URL_GRAPHQL
	? process.env.NEXT_PUBLIC_WSS_URL_GRAPHQL
	: '';
const wsLink = () => {
	return new GraphQLWsLink(
		createClient({
			url: urlWssGraphql,
			lazy: true,
			connectionParams: async () => {
				// const session = await getSession();

				return {
					headers: {
						authorization: token ? `Bearer ${token}` : '',
					},
				};
			},
		}),
	);
};

const authLink = setContext(async (_, { headers }) => {
	// const session = await getSession();

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});
const createHttpLink = () => {
	const httpLink = new HttpLink({
		uri: process.env.NEXT_PUBLIC_BASE_URL_GRAPHQL,
		credentials: 'include',
		headers: authLink,
	});
	return httpLink;
};
const createApolloClient = () => {
	const ssrMode = typeof window === 'undefined';
	let link: any;
	if (ssrMode) {
		link = createHttpLink();
	} else {
		link = wsLink();
	}
	return new ApolloClient({
		ssrMode,
		link,
		cache: new InMemoryCache(),
		ssrForceFetchDelay: 100,
	});
};
const initializeApollo = (initialState: any = null) => {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) {
		const existingCache = _apolloClient.extract();
		_apolloClient.cache.restore({ ...existingCache, ...initialState });
	}
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;
	return _apolloClient;
};
const useApollo = (initialState: any) => {
	const store = useMemo(() => initializeApollo(initialState), [initialState]);
	return store;
};
export default useApollo;
