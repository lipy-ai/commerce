import { Player } from "@lottiefiles/react-lottie-player";
const ComingSoonPage = () => {
	return (
		<>
			<div className="flex flex-col items-center justify-center m-auto px-6 text-center">
				<Player
					autoplay
					loop
					src="/lottie/online-delivery-service.json"
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
