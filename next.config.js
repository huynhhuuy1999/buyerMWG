/** @type {import('next').NextConfig} */
// const { withSentryConfig } = require('@sentry/nextjs');
const withPWA = require('next-pwa');
// const runtimeCaching = require('next-pwa/cache');

// const sentryWebpackPluginOptions = {
// 	// Additional config options for the Sentry Webpack plugin. Keep in mind that
// 	// the following options are set automatically, and overriding them is not
// 	// recommended:
// 	//   release, url, org, project, authToken, configFile, stripPrefix,
// 	//   urlPrefix, include, ignore
// 	dryRun: true,
// 	silent: true, // Suppresses all logs
// 	// For all available options, see:
// 	// https://github.com/getsentry/sentry-webpack-plugin#options.
// };

const {
	// NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
	// NEXT_PUBLIC_APP_STAGE,
	NEXT_PUBLIC_IMAGES_DOMAINS,
	NEXT_PUBLIC_DOMAIN_URL,
	// SENTRY_ORG,
	// SENTRY_PROJECT,
	// SENTRY_AUTH_TOKEN,
} = process.env;

const isProd = process.env.NODE_ENV === 'production';

const moduleExports = withPWA({
	pwa: {
		dest: 'public',
		register: true,
		skipWaiting: true,
		// runtimeCaching,
		// buildExcludes: [/manifest\.json$/],
		disable: !isProd,
	},
	// i18n,
	// webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
	// 	// config.plugins.push(new DuplicatePackageCheckerPlugin());
	// 	if (!isServer) {
	// 		config.resolve.alias['@sentry/node'] = '@sentry/browser';
	// 	}

	// webpack: (config) => {
	// 	// config.module.rules.push({
	// 	// 	test: /\.css$/,
	// 	// 	use: 'raw-loader',
	// 	// });

	// 	isProd
	// 		? (config.module.rules = [
	// 				...config.module.rules,
	// 				{
	// 					test: /\.css$/,
	// 					use: 'raw-loader',
	// 				},
	// 				{
	// 					test: /\.module.scss$/,
	// 					use: 'raw-loader',
	// 				},
	// 		  ])
	// 		: config;

	// 	return config;
	// },

	// 	// if (
	// 	// 	SENTRY_DSN &&
	// 	// 	SENTRY_ORG &&
	// 	// 	SENTRY_PROJECT &&
	// 	// 	SENTRY_AUTH_TOKEN &&
	// 	// 	NEXT_PUBLIC_APP_STAGE !== envs.DEVELOPMENT
	// 	// ) {
	// 	// 	config.plugins.push(
	// 	// 		new SentryWebpackPlugin({
	// 	// 			include: '.next',
	// 	// 			ignore: ['node_modules'],
	// 	// 			stripPrefix: ['webpack://_N_E/'],
	// 	// 			urlPrefix: `~${basePath}/_next`,
	// 	// 			release: releaseVersion,
	// 	// 			deploy: {
	// 	// 				env: NEXT_PUBLIC_APP_STAGE,
	// 	// 			},
	// 	// 		}),
	// 	// 	);
	// 	// }

	// 	return config;
	// },
	// sentry: {
	// 	hideSourceMaps: true,
	// 	disableServerWebpackPlugin: true,
	// 	disableClientWebpackPlugin: true,
	// },
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	reactStrictMode: true,
	swcMinify: process.env.NODE_ENV !== 'production',
	compress: true,
	// trailingSlash: true,
	experimental: {
		optimizeImages: true,
		esmExternals: true,
		outputStandalone: false,
		scrollRestoration: true,
		mizeCss: true,
		optimizeFonts: true,
	},
	productionBrowserSourceMaps: false,
	// publicRuntimeConfig: {
	// 	// Will be available on both server and client
	// 	// SENTRY_DSN,
	// 	NEXT_PUBLIC_APP_STAGE,
	// },
	images: {
		domains: NEXT_PUBLIC_IMAGES_DOMAINS?.split(','),
		minimumCacheTTL: 60 * 24,
		// disableStaticImages: true,
		formats: ['image/webp', 'image/avif'],
	},
	env: {
		BASE_API_URL: process.env.BASE_API_URL,
		IMAGES_DOMAINS: NEXT_PUBLIC_IMAGES_DOMAINS,
	},
	pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
	assetPrefix: isProd ? NEXT_PUBLIC_DOMAIN_URL : '',
	async rewrites() {
		return {
			afterFiles: [
				{
					source: '/tim-kiem',
					destination: '/search',
					has: [{ type: 'query', key: 'k' }],
				},
				{
					source: '/guest-call/:slug*',
					destination: '/chat/:slug*',
				},
				{
					source: '/ca-nhan/san-pham-yeu-thich',
					destination: '/customer/wishlist',
				},
				{
					source: '/ca-nhan/nha-ban-yeu-thich',
					destination: '/customer/wishlist?merchant=true',
					// has: [{ type: 'query', key: 'merchant', value: 'true' }],
				},
				{
					source: '/ca-nhan/danh-gia',
					destination: '/customer/review',
				},
				{
					source: '/ca-nhan/san-pham-da-xem',
					destination: '/customer/viewed',
				},
				{
					source: '/ca-nhan/don-hang',
					destination: '/customer/orders',
				},
				{
					source: '/ca-nhan/chinh-sua-thong-tin',
					destination: '/customer/edit-profile',
				},
				{
					source: '/gio-hang',
					destination: '/cart',
				},
				{
					source: '/thuong-hieu-goi-y',
					destination: '/suggest-brand',
				},
				{
					source: '/cai-dat/thong-bao',
					destination: '/setting/notification',
				},
				{
					source: '/ca-nhan/don-hang/:path',
					destination: '/customer/orders/:path',
				},
				{
					source: '/khuyen-mai',
					destination: '/promotion',
				},
				{
					source: '/khuyen-mai/:slug',
					destination: '/promotion/:slug',
				},
				{
					source: '/404',
					destination: '/page404',
				},
			],
		};
	},
	async headers() {
		return [
			{
				source: '/static/fonts/SFProFont/SFProDisplay.eot',
				headers: [
					{
						key: 'Cache-control',
						value: 'public, immutable, max-age=31536000',
					},
				],
			},
			{
				source: '/static/fonts/SFProFont/SFProDisplay.woff2',
				headers: [
					{
						key: 'Cache-control',
						value: 'public, immutable, max-age=31536000',
					},
				],
			},
			{
				source: '/static/fonts/SFProFont/SFProDisplay.woff',
				headers: [
					{
						key: 'Cache-control',
						value: 'public, immutable, max-age=31536000',
					},
				],
			},
			{
				source: '/static/fonts/SFProFont/SFProDisplay.ttf',
				headers: [
					{
						key: 'Cache-control',
						value: 'public, immutable, max-age=31536000',
					},
				],
			},
			{
				source: '/static/fonts/SFProFont/SFProDisplay-Bold.ttf',
				headers: [
					{
						key: 'Cache-control',
						value: 'public, immutable, max-age=31536000',
					},
				],
			},
			{
				source: '/static/fonts/SFProFont/SFProDisplay.svg#SFProDisplay',
				headers: [
					{
						key: 'Cache-control',
						value: 'public, immutable, max-age=31536000',
					},
				],
			},
			{
				source: '/static/fonts/SFProFont/SFProDisplay-Bold.ttf',
				headers: [
					{
						key: 'Cache-control',
						value: 'public, immutable, max-age=31536000',
					},
				],
			},
			{
				source: '/static/fonts/SFProFont/SFProDisplay-Semibold.woff',
				headers: [
					{
						key: 'Cache-control',
						value: 'public, immutable, max-age=31536000',
					},
				],
			},
			{
				source: '/static/fonts/SFProFont/SFProDisplay-Semibold.woff2',
				headers: [
					{
						key: 'Cache-control',
						value: 'public, immutable, max-age=31536000',
					},
				],
			},
			{
				source: '/assets/files\\?',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=2592000, stale-while-revalidate=60',
					},
				],
			},
		];
	},
});

// module.exports = withPWA({
// 	pwa: {
// 		dest: 'public',
// 		register: true,
// 		skipWaiting: false,
// 		disable: true,
// 		// runtimeCaching,
// 		cacheStartUrl: false,
// 		cacheOnFrontEndNav: false,
// 	},
// 	...moduleExports,
// });

module.exports = moduleExports;

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
// module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
