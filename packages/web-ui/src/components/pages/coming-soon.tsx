import { Player } from "@lottiefiles/react-lottie-player";
const ComingSoonPage = () => {
	return (
		<>
			<div className="flex flex-col items-center justify-center mx-6 ">
				<Player
					src={"./lottie/online-delivery-service.json"}
					loop
					autoplay
					style={{ height: "250px", width: "250px" }}
				/>
				<div className="text-center -mt-10 mx-auto">
					<h1 className="text-xl font-bold">Coming Soon to your doorstep!</h1>

					<p className="px-4 max-w-sm text-sm text-muted-foreground">
						Sorry , no store is available at your location right now. We hope to
						be in your service soon.
					</p>
				</div>
			</div>
		</>
	);
};

export default ComingSoonPage;
