import { useAuth } from 'hooks';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

export interface AuthenticationProps {
	children: ReactNode;
}

const Authentication = ({ children }: AuthenticationProps) => {
	const router = useRouter();
	const { isLoggedIn, currentUser } = useAuth();

	useEffect(() => {
		if (!isLoggedIn || !currentUser) {
			router.push('/login');
		}
	}, [router, currentUser, isLoggedIn]);

	if (!currentUser) return <>Loading...</>;

	return <>{children}</>;
};

export default Authentication;
