"use client";
import React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { format, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import AlertMessage from "./AlertMessage";
import { setTimeout } from "timers";

const postData = async (url: string, data: object) => {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};

	try {
		const res = await fetch(url, options);
		const data = await res.json();
		return data;
	} catch (error) {
		console.log(error);
	}
};

const Reservation = ({
	reservations,
	room,
	isUserAuthenticated,
	userData,
}: {
	reservations: any;
	room: any;
	isUserAuthenticated: boolean;
	userData: any;
}) => {
	// console.log(reservations, room, isUserAuthenticated, userData);
	const [checkInDate, setCheckInDate] = React.useState<Date>();
	const [checkOutDate, setCheckOutDate] = React.useState<Date>();
	const [alertMessage, setAlertMessage] = useState<{
		message: string;
		type: "error" | "success" | null;
	} | null>(null);

	const router = useRouter();

	const saveReservation = () => {
		if (!checkInDate || !checkOutDate) {
			return setAlertMessage({
				message: "Please select check-in and check-out dates",
				type: "error",
			});
		}

		if (checkInDate?.getTime() === checkOutDate?.getTime()) {
			return setAlertMessage({
				message: "Check-in and Check-out dates cannot be the same",
				type: "error",
			});
		}

		// Filter reservations for current room, and check if any reservation overlaps with cuirrent selected dates
		const isReserved = reservations.data
			.filter((item: any) => item.attributes.room.data.id === room.data.id) // filter reservations for current room.
			.some((item: any) => {
				// Check if any reservation overlaps with selected dates
				const existingCheckIn = new Date(item.attributes.checkIn).setHours(
					0,
					0,
					0,
					0
				); // Convert EXISTING check-in times to midnight
				const existingCheckOut = new Date(item.attributes.checkOut).setHours(
					0,
					0,
					0,
					0
				); // Convert EXISTING check-out times to midnight

				const checkInTime = checkInDate?.setHours(0, 0, 0, 0); // Convert SELECTED check-out times to midnight
				const checkOutTime = checkOutDate?.setHours(0, 0, 0, 0); // Convert SELECTED check-out times to midnight

				// Check if room is reserved between check-in and check-out dates
				console.log("Checking if reserved");
				const isReservedBetweenDates =
					(checkInTime >= existingCheckIn && checkInTime < existingCheckOut) ||
					(checkOutTime > existingCheckIn &&
						checkOutTime <= existingCheckOut) ||
					(existingCheckIn > checkInTime && existingCheckIn < checkOutTime) ||
					(existingCheckOut > checkInTime && existingCheckOut <= checkOutTime);

				return isReservedBetweenDates; // return true if any reservation overlaps with selected dates
			});

		// if room is reserved, log a message. Otherwise proceed with booking.
		if (isReserved) {
			return setAlertMessage({
				message:
					"This room is already booked for the selected dates. Pleas echoose different dates or another room.",
				type: "error",
			});
		} else {
			// Real Data
			const data = {
				data: {
					firstname: userData.given_name,
					lastname: userData.family_name,
					email: userData.email,
					checkIn: checkInDate ? formatDateForStrapi(checkInDate) : null,
					checkOut: checkOutDate ? formatDateForStrapi(checkOutDate) : null,
					room: room.data.id,
				},
			};

			// post booking data to the server
			postData("http://127.0.0.1:1337/api/reservations", data);

			// Notify user of successful booking
			setAlertMessage({
				message:
					"Your booking has been successfully connfiormed! We look forward to welcoming you on your selected dates.",
				type: "success",
			});

			// Refresh the page to reflect the updates reservation states
			router.refresh();
		}
	};

	const formatDateForStrapi = (date: Date) => {
		return format(date, "yyyy-MM-dd");
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			return setAlertMessage(null);
		}, 3000);
		// Clear timer
		return () => clearTimeout(timer);
	}, [alertMessage]);

	return (
		<div>
			<div className="bg-tertiary h-[320px] mb-4">
				{/* Top  */}
				<div className="bg-accent py-4 text-center relative mb-2">
					<h4 className="text-xl text-white">Book your room</h4>
					{/* triangle  */}
					<div className="absolute -bottom-[8px] left-[calc(50%_-_10px)] w-0 h-0 border-l-[10px] border-l-transparent border-t-[8px] border-t-accent border-r-[10px] border-r-transparent"></div>
				</div>
				<div className="flex flex-col gap-4 w-full py-6 px-8">
					{/* Check In  */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="default"
								size="md"
								className={cn(
									"w-full justify-start text-left font-semibold",
									!checkInDate && "text-secondary"
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{checkInDate ? (
									format(checkInDate, "PPP")
								) : (
									<span>Check In</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={checkInDate}
								onSelect={setCheckInDate}
								initialFocus
								disabled={isPast}
							/>
						</PopoverContent>
					</Popover>
					{/* Check Out  */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="default"
								size="md"
								className={cn(
									"w-full justify-start text-left font-semibold",
									!checkOutDate && "text-secondary"
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{checkOutDate ? (
									format(checkOutDate, "PPP")
								) : (
									<span>Check Out</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={checkOutDate}
								onSelect={setCheckOutDate}
								initialFocus
								disabled={isPast}
							/>
						</PopoverContent>
					</Popover>

					{/* conditional rendering of booking btn based on userAuthentication*/}
					{isUserAuthenticated ? (
						<Button onClick={() => saveReservation()} size="md">
							Book Now
						</Button>
					) : (
						<LoginLink>
							<Button className="w-full" size="md">
								Sign In
							</Button>
						</LoginLink>
					)}
				</div>
			</div>
			{alertMessage && (
				<AlertMessage message={alertMessage.message} type={alertMessage.type} />
			)}
		</div>
	);
};

export default Reservation;
