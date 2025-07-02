// hooks/useSoundPlayer.ts
import { useCallback, useRef } from "react";

export function useSoundPlayer(
	options: {
		src?: string;
		volume?: number;
		loop?: boolean;
	} = {},
) {
	const {
		volume = 1,
		loop = false,
		src = "/assets/sounds/notification.wav",
	} = options;
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const loadAudio = useCallback(() => {
		if (!audioRef.current) {
			const audio = new Audio(src);
			audio.volume = volume;
			audio.loop = loop;
			audioRef.current = audio;
		}
	}, [src, volume, loop]);

	const play = useCallback(() => {
		loadAudio();
		audioRef.current?.pause(); // Ensure restart
		audioRef.current!.currentTime = 0;
		audioRef.current?.play().catch(console.error);
	}, [loadAudio]);

	const stop = useCallback(() => {
		audioRef.current?.pause();
		audioRef.current!.currentTime = 0;
	}, []);

	const pause = useCallback(() => {
		audioRef.current?.pause();
	}, []);

	return { play, stop, pause };
}
