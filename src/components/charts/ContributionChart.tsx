import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePrefersDarkMode } from "~/utils/hooks";
import { type ContributionDataType } from "~/utils/types";

export default function ContributionChart({
  contributionData,
}: {
  contributionData: ContributionDataType[];
}) {
  const isDarkTheme = usePrefersDarkMode();
  const colourChoice = isDarkTheme ? "white" : "black";

  if (!contributionData) {
    return <p className="dark:text-white">There is no data for this sprint.</p>;
  }

  return (
    <ResponsiveContainer aspect={3}>
      <BarChart
        margin={{ top: 0, right: 40, left: 10, bottom: 20 }}
        data={contributionData}
      >
        <CartesianGrid stroke={colourChoice} strokeDasharray="5 5" />
        <XAxis
          dataKey="name"
          stroke={colourChoice}
          label={{ value: "Contributors", fill: colourChoice, dy: 20 }}
          height={50}
        />
        <YAxis
          stroke="white"
          label={{
            value: "Story Points",
            fill: colourChoice,
            angle: -90,
            dx: -10,
          }}
        />
        <Tooltip />
        <Legend
          verticalAlign="top"
          wrapperStyle={{
            paddingBottom: "10px",
          }}
        />
        <Bar dataKey="completed" fill="#8884d8" />
        <Bar dataKey="remaining" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
