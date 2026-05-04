import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
	{ week: "Week 1", miles: 3.2 },
	{ week: "Week 2", miles: 5.0 },
	{ week: "Week 3", miles: 4.5 },
	{ week: "Week 4", miles: 6.8 },
	{ week: "Week 5", miles: 5.5 },
	{ week: "Week 6", miles: 7.2 },
];

export default function WeeklyMileageChart() {
	const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const axisColor = isDark ? "#9ca3af" : "#6b6375";
	const gridColor = isDark ? "#2e303a" : "#e5e4e7";
	const bgColor = isDark ? "#16171d" : "#ffffff";

	return (
		<div className="mx-auto max-w-2xl w-full">
			<h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--text-h)" }}>
				Weekly Mileage
			</h2>
			<p className="mb-6 text-sm" style={{ color: "var(--text)" }}>
				Miles logged per week over the last 6 weeks
			</p>
			<div
				style={{ background: bgColor, borderRadius: "12px", padding: "24px" }}
			>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
						<CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
						<XAxis
							dataKey="week"
							stroke={axisColor}
							tick={{ fill: axisColor, fontSize: 13 }}
							tickLine={{ stroke: gridColor }}
							axisLine={{ stroke: gridColor }}
						/>
						<YAxis
							stroke={axisColor}
							tick={{ fill: axisColor, fontSize: 13 }}
							label={{ value: "miles", angle: -90, position: "insideLeft", fill: axisColor, fontSize: 12 }}
							tickLine={{ stroke: gridColor }}
							axisLine={{ stroke: gridColor }}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: bgColor,
								border: `1px solid ${gridColor}`,
								borderRadius: "8px",
								color: axisColor,
								fontSize: 13,
							}}
							cursor={{ fill: isDark ? "#ffffff08" : "#00000008" }}
						/>
						<Bar
							dataKey="miles"
							fill="#aa3bff"
							radius={[6, 6, 0, 0]}
							style={{ filter: "saturate(1.2)" }}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
