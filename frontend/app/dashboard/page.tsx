import React from "react";
import Link from "next/link";

import { format } from "date-fns";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Reservation from "@/components/Reservation";
import CancelReservation from "@/components/CancelReservation";
import { Button } from "@/components/ui/button";

const getUserReservations = async (userEmail: any) => {
	const res = await fetch(
		`http://127.0.0.1:1337/api/reservations?filters[email][$eq]=${userEmail}&populate=room`,
		{
			next: {
				revalidate: 0,
			},
		}
	);
	return await res.json();
};

const Dashboard = async () => {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
	const userReservations = await getUserReservations(user?.email);
	console.log(userReservations);

	return (
		<section className="min-h-[80vh]">
			<div className="container mx-auto py-8 h-full ">
				<h3 className="h3 font-bold mb-12 border-b pb-4 text-center lg:text-left">
					My bookings
				</h3>
				<div className="flex flex-col gap-8 h-full">
					{userReservations.data.length < 1 ? (
						<div className="flex flex-col items-center justify-center h-[50vh]">
							<p className="text-xl text-center text-secondary/70 mb-4">
								You don't have any reservations
							</p>
							{/* back to homepage button */}
							<Link href="/">
								<Button size="md">Back to Homepage</Button>
							</Link>
						</div>
					) : (
						userReservations.data.map((reservation: any) => {
							console.log(reservation);
							return (
								<div key={reservation.id} className="bg-tertiary py-8 px-12">
									<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
										<h3 className="text-2xl font-medium w-[200px] text-center lg:text-left">
											{reservation.attributes.room.data.attributes.title}
										</h3>
										{/* Check in and check out text  */}
										<div className="flex flex-col lg:flex-row gap-2 lg:w-[380px]">
											{/* Check In  */}
											<div className="flex items-center gap-1 flex-1">
												<span className="text-accent font-bold uppercase tracking-[2px]">
													from:
												</span>
												<span className="text-secondary font-semibold">
													{format(reservation.attributes.checkIn, "PPP")}
												</span>
											</div>

											{/* Check Out  */}
											<div className="flex items-center gap-1 flex-1">
												<span className="text-accent font-bold uppercase tracking-[2px]">
													To:
												</span>
												<span className="text-secondary font-semibold">
													{format(reservation.attributes.checkOut, "PPP")}
												</span>
											</div>
										</div>
										<CancelReservation reservation={reservation} />
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
