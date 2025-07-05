import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Label } from "../ui/label";

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
			<div className="bg-card p-4 space-y-2">
				<Label className="text-muted-foreground">{title.toUpperCase()}</Label>
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
									viewTransition={{ types: ["slide-left"] }}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<Avatar className="size-9">
												<AvatarFallback className="bg-muted/50">
													<item.icon className="size-5 text-foreground/80" />
												</AvatarFallback>
											</Avatar>

											<p className="font-medium">{item.title}</p>
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
