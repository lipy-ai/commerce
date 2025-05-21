"use client";
import { env } from "@envClient";
import { authClient, signIn } from "@lipy/lib/providers/auth";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Input } from "@lipy/web-ui/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@lipy/web-ui/components/ui/input-otp";
import { Label } from "@lipy/web-ui/components/ui/label";
import Loading from "@lipy/web-ui/components/ui/loading";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { type FormEvent, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function LoginScreen({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const { data, isPending } = authClient.useSession();
	const navigate = useNavigate();

	const [pending, trans] = useTransition();
	const [verifyEmail, setVerifyEmail] = useQueryState(
		"verify-email",
		parseAsString,
	);

	const [otp, setOtp] = useState("");

	const [callbackURL] = useQueryState(
		"cb",
		parseAsString.withDefault(env.WEB_URL!),
	);
	useEffect(() => {
		if (data?.user?.id && callbackURL) {
			window.location.href = callbackURL;
		}
	}, [data, isPending, callbackURL]);

	const handler = (p: Parameters<typeof signIn>) => {
		trans(async () => {
			await signIn(p[0], { ...p[1], callbackURL }, (v: string) =>
				navigate({ to: v, replace: true }),
			)
				.then(() => {
					setOtp("");
					if (p[0] === "otp" && p[1]?.email) {
						return setVerifyEmail(p[1]?.email);
					}
				})
				.catch((e) => {
					toast.error(e.message || "Something went wrong.");
				});
		});
	};

	const handleForm = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formdata = new FormData(e.currentTarget);
		const email = formdata.get("email")?.toString();
		if (!email) return toast.error(`Invalid email: ${email}`);
		handler(["otp", { email }]);
	};

	if (verifyEmail) {
		return (
			<Card className="py-10 relative shadow-none border-0">
				{pending && (
					<div className="absolute h-full w-full m-auto bg-background z-50 flex justify-center items-center">
						<Loading />
					</div>
				)}
				<CardHeader className="text-center">
					<CardTitle className="text-xl flex items-center justify-center flex-col">
						<>
							<CheckCircle2 className="size-16 mb-6" />
							<span>Sign-in OTP Sent</span>
						</>
					</CardTitle>
					<CardDescription className="max-w-sm px-5">
						We&apos;ve sent you an OTP on {verifyEmail}.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center gap-4 space-y-8">
					<InputOTP
						maxLength={6}
						onComplete={(c) =>
							handler(["signin-otp", { email: verifyEmail, otp: c }])
						}
						onChange={(v) => setOtp(v)}
						value={otp}
					>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
							{/* </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup> */}
							<InputOTPSlot index={3} />
							<InputOTPSlot index={4} />
							<InputOTPSlot index={5} />
						</InputOTPGroup>
					</InputOTP>
					<div className="flex gap-4">
						<Button
							variant={"outline"}
							size={"lg"}
							onClick={() => setVerifyEmail("")}
						>
							<ArrowLeft />
						</Button>
						<Button
							variant={"secondary"}
							size={"lg"}
							onClick={() => handler(["otp", { email: verifyEmail }])}
						>
							Resend OTP
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="h-svh overflow-hidden flex justify-center items-center xl:grid grid-cols-2">
			<div className="bg-amber-300/50 flex-1 h-full fixed xl:w-2/5 w-full" />
			<div className="fixed xl:left-30 top-14 xl:relative xl:-top-14 xl:flex xl:items-end xl:flex-1 xl:h-full">
				<img
					src="/assets/paper-bag-items.webp"
					className="rotate-180 scale-150 xl:scale-140 xl:rotate-0"
					width={800}
				/>
			</div>
			<Card className="flex w-full max-w-sm flex-col gap-6 mx-auto mt-auto md:m-auto py-8 shadow-none border-0 bg-transparent relative z-10">
				<div className="flex items-center gap-2 self-center font-medium"></div>
				<div className={cn("flex flex-col gap-6", className)} {...props}>
					<div className="space-y-4">
						<div className="flex justify-center items-center">
							<Link to={"/"}>
								<img
									src="/logo/ico.png"
									alt="Lipy"
									width={75}
									height={75}
									className="rounded-md"
								/>
							</Link>
						</div>
						<CardHeader className="text-center">
							<CardDescription>Log in or Sign up</CardDescription>

							<CardTitle className="text-xl">
								India's Local Commerce App
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleForm}>
								<div className="grid gap-6">
									<div className="grid gap-6">
										<div className="grid gap-2">
											<Label htmlFor="email" className="sr-only">
												Email
											</Label>
											<Input
												id="email"
												name="email"
												type="email"
												placeholder="Enter your email"
												required
												size={"lg"}
											/>
										</div>
										{/* <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div> */}
										<Button
											type="submit"
											className="w-full"
											size={"lg"}
											disabled={pending}
										>
											Login with Email
										</Button>
									</div>
									{/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div> */}
									<Button
										variant="outline"
										className="w-full"
										disabled={pending}
										onClick={() => handler(["google"])}
										size={"lg"}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="2443"
											height="2500"
											preserveAspectRatio="xMidYMid"
											viewBox="0 0 256 262"
											id="google"
										>
											<path
												fill="#4285F4"
												d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
											></path>
											<path
												fill="#34A853"
												d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
											></path>
											<path
												fill="#FBBC05"
												d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
											></path>
											<path
												fill="#EB4335"
												d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
											></path>
										</svg>
										Login with Google
									</Button>
									{/* <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div> */}
								</div>
							</form>
						</CardContent>
					</div>
					<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
						By clicking continue, you agree to our{" "}
						<a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>.
					</div>
				</div>
			</Card>
		</div>
	);
}
