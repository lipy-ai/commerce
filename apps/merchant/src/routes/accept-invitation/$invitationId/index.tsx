import { authClient } from "@lipy/lib/providers/auth";
import ErrorPage from "@lipy/web-ui/components/pages/error";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@lipy/web-ui/components/ui/alert-dialog";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button } from "@lipy/web-ui/components/ui/button";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { Spinner } from "@lipy/web-ui/components/ui/spinner"; // optional for loading state
import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
export const Route = createFileRoute("/accept-invitation/$invitationId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { invitationId } = Route.useParams();
	const navigate = Route.useNavigate();

	const [invitation, setInvitation] = useState<
		| Awaited<ReturnType<typeof authClient.organization.getInvitation>>["data"]
		| null
	>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [acceptingInvite, setAcceptingInvite] = useState(false);

	const { data: session } = authClient.useSession();

	useEffect(() => {
		const fetchInvitation = async () => {
			try {
				const { data, error } = await authClient.organization.getInvitation({
					query: { id: invitationId },
				});
				if (error || !data) {
					throw new Error(error?.message || "Invalid or expired invitation");
				}
				setInvitation(data);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchInvitation();
	}, [invitationId]);

	const handleAccept = async () => {
		setAcceptingInvite(true);
		const { data, error } = await authClient.organization.acceptInvitation({
			invitationId,
		});

		if (error) {
			toast.error(error.message || error.statusText || "Something went wrong");

			return;
		}

		if (data) {
			toast.success(
				`Congratulations! You are now a ${data.invitation.role} of ${invitation?.organizationName}`,
			);
			authClient.organization.setActive({
				organizationId: data.invitation.organizationId,
			});
			setAcceptingInvite(false);
			navigate({ to: "/" });
		}
	};

	const handleReject = async () => {
		const { data, error } = await authClient.organization.rejectInvitation({
			invitationId,
		});

		if (error) {
			toast.error(error.message || error.statusText || "Something went wrong");
			return;
		}

		if (data) {
			toast("Invitation rejected");
			navigate({ to: "/", replace: true });
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Spinner />
			</div>
		);
	}

	if (error || !invitation) {
		return (
			<ErrorPage
				error={new Error(error || "Invalid or expired invitation")}
				reset={() => navigate({ to: "/" })}
			/>
		);
	}

	return (
		<AlertDialog open>
			<AlertDialogContent className="p-6 sm:p-8 space-y-6">
				<AlertDialogHeader className="space-y-4">
					<Link to="/" className="block w-fit mx-auto">
						<img
							src="/logo/logo.png"
							alt="lipy-img"
							width={80}
							height={80}
							className="object-contain"
						/>
					</Link>

					<div className="text-center space-y-1">
						<AlertDialogTitle className="text-2xl font-semibold">
							You're Invited!
						</AlertDialogTitle>
						<AlertDialogDescription className="text-muted-foreground text-base">
							Join{" "}
							<span className="font-medium text-primary">
								{invitation.organizationName}
							</span>{" "}
							as a{" "}
							<span className="font-medium text-primary">
								{invitation.role}
							</span>
							.
						</AlertDialogDescription>
					</div>
				</AlertDialogHeader>

				<div className="flex items-center justify-center ">
					<Avatar className="size-16 border border-muted">
						<AvatarImage src="/avatars/01.png" />
						<AvatarFallback className="text-lg bg-muted text-muted-foreground">
							ORG
						</AvatarFallback>
					</Avatar>

					<Avatar className="size-16 border border-muted -ml-4">
						<AvatarImage src={session?.user?.image || "/avatars/02.png"} />
						<AvatarFallback className="text-lg bg-muted text-muted-foreground">
							{session?.user?.name
								?.split(" ")
								.map((chunk: string) => chunk[0])
								.join("") ||
								session?.user?.email
									?.split(" ")
									.map((chunk: string) => chunk[0])
									.join("")}
						</AvatarFallback>
					</Avatar>
				</div>

				<p className="text-center text-lg font-medium">
					Hello, {invitation.email}
				</p>

				<AlertDialogFooter className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
					<AlertDialogCancel asChild>
						<Button
							variant="outline"
							className="w-full sm:w-auto"
							onClick={handleReject}
						>
							Reject
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button className="w-full sm:w-auto" onClick={handleAccept}>
							{acceptingInvite ? (
								<Loader2 className="animate-spin" />
							) : (
								"Accept Invitation"
							)}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
				<p className="text-xs text-muted-foreground">
					* If you weren&apos;t expecting this, you can safely ignore or reject
					this invitation
				</p>
			</AlertDialogContent>
		</AlertDialog>
	);
}
