import { useRoutes } from 'hooks';
import { Breadcrumb, Route } from 'models';
import Link from 'next/link';
import React from 'react';

interface BreadcrumbProps {
	className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className = '' }) => {
	const { breadcrumbs } = useRoutes();

	return (
		<>
			{breadcrumbs && (
				<div
					className={`flex my-4 font-sfpro not-italic font-normal text-[14px] leading-normal ${
						className || ''
					}`}
				>
					{breadcrumbs.map((route: Route) => {
						return (
							<React.Fragment key={route.key}>
								{Array.isArray(route.breadcrumbs) ? (
									<>
										{route.breadcrumbs.map((breadcrumb: Breadcrumb, index: number) => {
											return (
												<Link key={index} href={`/${breadcrumb.urlSlug}`}>
													<a
														className={`text-ellipsis text-[#126BFB] line-clamp-1 after:mx-[6px] after:text-[12px] after:leading-[1.2] after:text-[#828282] after:content-['/'] last:pointer-events-none last:text-black after:last:content-none hover:cursor-pointer hover:underline`}
													>
														{breadcrumb.name}
													</a>
												</Link>
											);
										})}
									</>
								) : (
									<Link key={route.key} href={`${route.breadcrumbs.urlSlug}`}>
										<a
											className={`text-ellipsis text-[#126BFB] line-clamp-1 after:mx-[6px] after:text-[12px] after:leading-[1.2] after:text-[#828282] after:content-['/'] last:pointer-events-none last:text-black after:last:content-none hover:cursor-pointer hover:underline`}
										>
											{route.breadcrumbs.name}
										</a>
									</Link>
								)}
							</React.Fragment>
						);
					})}
				</div>
			)}
		</>
	);
};

export default Breadcrumb;
