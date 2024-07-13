"use client";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

const links = [
	{ name: "Home", path: "/" },
	{ name: "Restaurant", path: "/" },
	{ name: "Pool", path: "/" },
	{ name: "Best deals", path: "/" },
	{ name: "Contact", path: "/" },
];

const Nav = ({ isUserAuthenticated }: { isUserAuthenticated: boolean }) => {
	const pathName = usePathname();
	return (
		<nav>
			<ul className="flex flex-col lg:flex-row gap-6 ">
				{links.map((link, index) => {
					return (
						<li key={index}>
							<Link
								href={link.path}
								className="font-bold text-[13px] uppercase tracking-[3px] hover:text-accent-hover transition-all"
							>
								{link.name}
							</Link>
						</li>
					);
				})}
			</ul>
			{/* Redirect to homepage if user is not authenticated and pathname is "/dashboard"  */}
			{!isUserAuthenticated && pathName === "/dashboard" && redirect("/")}
		</nav>
	);
};

export default Nav;
