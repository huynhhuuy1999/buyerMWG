function clearCookies(wildcardDomain = false, primaryDomain = true, path = null) {
	let pathSegment = path ? '; path=' + path : '';
	let expSegment = '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
	document.cookie.split(';').forEach(function (c) {
		primaryDomain &&
			(document.cookie = c.replace(/^ +/, '').replace(/=.*/, expSegment + pathSegment));
		wildcardDomain &&
			(document.cookie = c
				.replace(/^ +/, '')
				.replace(
					/=.*/,
					expSegment + pathSegment + `; domain=${process.env.NEXT_PUBLIC_ENDPOINT_NAME}`,
				));
	});
}

export const logoutClient = () => {
	localStorage.clear();
	clearCookies(true, false, null);
};
