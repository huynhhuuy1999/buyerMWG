import { useAppSelector } from 'hooks';
import { NextComponentType } from 'next';

import { rolesSelector, userIdSelector } from '@/store/reducers/authSlice';

import { WrapperDevice } from '../layouts';

function withAuth(Component: NextComponentType, TypeLayouts?: any) {
	const Auth = (props: any) => {
		const whiteList = ['guest', 'user'];
		const permissionRules = useAppSelector(rolesSelector);
		const userId = useAppSelector(userIdSelector);

		if (userId && whiteList.some((t, i) => t === permissionRules?.[i])) {
			// If user is logged in, return original component
			return (
				<WrapperDevice deviceType={props?.deviceType}>
					<TypeLayouts>
						<Component {...props} />
					</TypeLayouts>
				</WrapperDevice>
			);
		}
		return null;
	};

	// Copy getInitial props so it will run as well
	if (Component.getInitialProps) {
		Auth.getInitialProps = Component.getInitialProps;
	}

	return Auth;
}

export default withAuth;
