import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

export default function SettingsCard({
	items,
}: {
	items: {
		title: string;
		icon: any;
		url: string;
	}[];
}) {
	return (
		<>
			<Card className="p-4 shadow-none">
				{items.map((item, index) => (
					<div key={index}>
						<Link to={item.url} className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Avatar className="size-7">
										<AvatarFallback>
											<item.icon className="size-4 text-muted-foreground" />
										</AvatarFallback>
									</Avatar>

									<div className="text-sm font-medium">{item.title}</div>
								</div>
								<ChevronRight />
							</div>

							{index !== items.length - 1 && (
								<Separator className="-mb-4 border-t border-dashed bg-transparent" />
							)}
						</Link>
					</div>
				))}
			</Card>
		</>
	);
}
