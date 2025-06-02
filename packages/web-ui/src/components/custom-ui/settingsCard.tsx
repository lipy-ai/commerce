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
			<div className="rounded border px-2 shadow-none divide-y">
				{items.map((item, index) => (
					<div key={index}>
						<Link to={item.url} className="flex flex-col p-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Avatar className="size-10">
										<AvatarFallback>
											<item.icon className="size-5 text-muted-foreground" />
										</AvatarFallback>
									</Avatar>

									<div className="">{item.title}</div>
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
