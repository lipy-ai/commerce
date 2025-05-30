import type { FC } from "react";

interface Props {
	strokeWidth?: number;
	sqSize?: number;
	percentage: number;
}

const CircularProgress: FC<Props> = (props) => {
	const { strokeWidth = 4, sqSize = 75, percentage } = props;
	const radius = (sqSize - strokeWidth) / 3;
	const viewBox = `0 0 ${sqSize} ${sqSize}`;
	const dashArray = radius * Math.PI * 2;
	const dashOffset = dashArray - (dashArray * (percentage || 0)) / 100;
	const statusMessage = `${percentage}%`;

	return (
		<svg width={sqSize} height={sqSize} viewBox={viewBox}>
			<title>Progress</title>

			<circle
				className="fill-none stroke-gray-200"
				cx={sqSize / 2}
				cy={sqSize / 2}
				r={radius}
				strokeWidth={`${strokeWidth}px`}
			/>
			<circle
				className="fill-none stroke-primary transition-all delay-200 ease-in"
				cx={sqSize / 2}
				cy={sqSize / 2}
				r={radius}
				strokeLinecap="round"
				strokeWidth={`${strokeWidth}px`}
				transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
				style={{
					strokeDasharray: dashArray,
					strokeDashoffset: dashOffset,
				}}
			/>
			<text
				x="50%"
				y="50%"
				dy=".3em"
				textAnchor="middle"
				className="text-xs font-light text-muted-foreground"
			>
				{statusMessage}
			</text>
		</svg>
	);
};

export default CircularProgress;
