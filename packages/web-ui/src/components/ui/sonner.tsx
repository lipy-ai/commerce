import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps, toast } from "sonner";

const Toaster = ({ position, ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();
	const { isMobile } = useViewport();
	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			closeButton
			richColors
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			position={isMobile ? "top-right" : position}
			{...props}
		/>
	);
};

export { Toaster, toast };
