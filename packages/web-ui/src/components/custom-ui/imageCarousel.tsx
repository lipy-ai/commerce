import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

interface ImageCarouselProps {
	images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: "center",
		skipSnaps: false,
		dragFree: false,
	});

	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	const scrollTo = useCallback(
		(index: number) => {
			if (emblaApi) {
				emblaApi.scrollTo(index);
			}
		},
		[emblaApi],
	);

	const onSelect = useCallback(() => {
		if (emblaApi) {
			setSelectedIndex(emblaApi.selectedScrollSnap());
		}
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on("select", onSelect);
		return () => {
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi, onSelect]);

	if (!images || images.length === 0) {
		return null;
	}

	return (
		<div className="w-full relative">
			{/* Main carousel container */}
			<div className="relative">
				<div className="overflow-hidden" ref={emblaRef}>
					<div className="flex">
						{images.map((src, index) => (
							<div key={index} className="flex-[0_0_100%] min-w-0 relative">
								<div className="aspect-square border-0">
									<img
										src={src}
										alt={`Product ${index + 1}`}
										className="w-full h-full object-contain"
										loading={index === 0 ? "eager" : "lazy"}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Navigation dots */}
			{images.length > 1 && (
				<div className="absolute bottom-4 right-4 flex justify-center items-center gap-1.5 ">
					{images.map((_, index) => (
						<button
							type="button"
							key={index}
							onClick={() => scrollTo(index)}
							className={`w-2 h-2 rounded-full transition-colors duration-200 ${
								index === selectedIndex
									? "bg-gray-800"
									: "bg-gray-300 hover:bg-gray-400"
							}`}
							aria-label={`Go to image ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
