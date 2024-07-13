import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Hero = () => {
	return (
		<section className="h-[60vh] lg:h-[80vh] bg-hero bg-cover bg-center bg-no-repeat">
			<div className="container mx-auto h-full flex justify-center items-center">
				<div className="flex flex-col items-center justify-center">
					<h1 className="h1 text-white text-center max-w-[800px] mb-8">
						Experience hospitalioty at its finest
					</h1>
					<Link href="#rooms">
						<Button size="md">Discover more</Button>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Hero;
