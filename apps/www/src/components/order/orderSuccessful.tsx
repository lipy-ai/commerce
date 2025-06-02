import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@lipy/web-ui/components/ui/dialog";
import { motion } from "framer-motion";
import { CircleCheckBig, Sparkles } from "lucide-react";

export default function OrderSuccessful({
	showSuccessDialog,
	setShowSuccessDialog,
}: {
	showSuccessDialog: boolean;
	setShowSuccessDialog: (showSuccessDialog: boolean) => void;
}) {
	return (
		<Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
			<DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50">
				<div className="relative px-6 py-8 text-center">
					{/* Background decoration */}
					<div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50 rounded-lg" />

					{/* Floating sparkles */}
					<div className="absolute top-4 left-4 animate-bounce delay-75">
						<Sparkles className="text-green-300" size={16} />
					</div>
					<div className="absolute top-6 right-6 animate-bounce delay-150">
						<Sparkles className="text-emerald-300" size={12} />
					</div>
					<div className="absolute bottom-8 left-8 animate-bounce delay-300">
						<Sparkles className="text-green-400" size={14} />
					</div>

					<div className="relative z-10">
						<DialogHeader className="space-y-6">
							{/* Animated success icon */}
							<div className="flex items-center justify-center">
								<div className="relative">
									<div className="absolute inset-0 animate-ping bg-green-200 rounded-full opacity-40" />
									<div className="relative bg-white rounded-full p-4 shadow-lg animate-pulse">
										<CircleCheckBig className="text-green-500" size={64} />
									</div>
								</div>
							</div>

							<div className="space-y-3 animate-fade-in-up">
								<DialogTitle className="text-2xl font-bold text-gray-800">
									Order Successful! 🎉
								</DialogTitle>
								<DialogDescription className="text-gray-600 text-base leading-relaxed">
									Your order has been successfully placed. You can track your
									order in your account.
								</DialogDescription>
							</div>
						</DialogHeader>
						{/* Action button */}
						<motion.button
							initial={{ y: 100, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{
								duration: 0.8,
								ease: [0.25, 0.8, 0.25, 1], // Custom smooth easing
							}}
							onClick={() => setShowSuccessDialog(false)}
							className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl my-6"
						>
							Continue Shopping
						</motion.button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
