import { cn } from "@lipy/web-ui/lib/utils";
import { Player } from "@lottiefiles/react-lottie-player";
const ComingSoonPage = () => {
	return (
		<>
			<div
				className={cn(
					"m-auto flex flex-1 flex-col space-y-1 items-center justify-center px-4 text-center",
				)}
			>
				<Player
					src={"./lottie/online-delivery-service.json"}
					loop
					autoplay
					style={{ height: "250px", width: "250px" }}
				/>
				<h1 className="text-xl font-bold">Coming Soon to your doorstep!</h1>
				<p className="text-muted-foreground">
					We are currently not available at your location. We will be in your
					service soon.
				</p>
			</div>
		</>
	);
};

export default ComingSoonPage;
