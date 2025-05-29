import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

interface ImageCarouselProps {
	images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
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
		[emblaApi]
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
		<div className="w-full max-w-2xl mx-auto">
			{/* Main carousel container */}
			<div className="relative">
				<div className="overflow-hidden" ref={emblaRef}>
					<div className="flex">
						{images.map((src, index) => (
							<div key={index} className="flex-[0_0_100%] min-w-0 relative">
								<div className="aspect-square p-2">
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
				<div className="flex justify-center items-center gap-2 mt-2">
					{images.map((_, index) => (
						<button
							type="button"
							key={index}
							onClick={() => scrollTo(index)}
							className={`transition-all duration-200 ease-out rounded-full border-2 ${
								index === selectedIndex
									? "w-8 h-3 bg-primary border-primary"
									: "w-3 h-3 bg-transparent border-gray-300 hover:border-gray-400"
							}`}
							aria-label={`Go to image ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
