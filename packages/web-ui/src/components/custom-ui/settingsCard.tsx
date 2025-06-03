import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

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
			<div className="rounded border p-2 shadow-none divide-y">
				{items.map((item, index) => (
					<div key={index}>
						<Link to={item.url} className="flex flex-col px-2 py-2.5">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Avatar className="size-10">
										<AvatarFallback>
											<item.icon className="size-5 text-muted-foreground" />
										</AvatarFallback>
									</Avatar>

									<div className="font-medium">{item.title}</div>
								</div>
								<ChevronRight />
							</div>

							{/* {index !== items.length - 1 && (
								<Separator className="-mb-4 border-t border-dashed bg-transparent" />
							)} */}
						</Link>
					</div>
				))}
			</div>
		</>
	);
}
