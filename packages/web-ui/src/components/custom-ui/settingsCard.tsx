import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@lipy/web-ui/lib/utils";

export default function SettingsCard({
	title,
	items,
}: {
	title: string;
	items: {
		title: string;
		icon: any;
		url?: string;
		type?: "link" | "button";
		handleFunction?: () => void;
	}[];
}) {

	const {pathname} = useLocation()
	return (
		<>
			<Card className="">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent className="divide-y py-2  divide-dashed">
					{items.map((item, index) => {

						const isActive = pathname.endsWith(item?.url!)

					return (

						<div key={index} className="py-3">
							<Link
								to={item?.url}
								className="flex flex-col "
								onClick={() => {
									if (item.type === "button" && item.handleFunction) {
										item.handleFunction();
									}
								}}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Avatar className="size-9">
											<AvatarFallback>
												<item.icon className={cn(
													isActive ? "fill-primary/40 text-foreground" : "", "size-5 text-muted-foreground"
												)} />
											</AvatarFallback>
										</Avatar>

										<div className={cn(
											isActive ? "text-primary": "", "font-medium"
										)}>{item.title}</div>
									</div>
									<ChevronRight />
								</div>
							</Link>
						</div>

					)
						
})}
				</CardContent>
			</Card>
		</>
	);
}
