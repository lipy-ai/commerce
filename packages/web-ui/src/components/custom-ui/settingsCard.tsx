import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

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
	return (
		<>
			<div className="bg-card p-4">
				<p className="text-base text-muted-foreground pb-2">
					{title.toUpperCase()}
				</p>
				<div className="divide-y  divide-dashed">
					{items.map((item, index) => {
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
													<item.icon className={cn("size-5")} />
												</AvatarFallback>
											</Avatar>

											<div className={cn("font-medium")}>{item.title}</div>
										</div>
										<ChevronRight />
									</div>
								</Link>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
