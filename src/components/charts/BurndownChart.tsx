import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { usePrefersDarkMode } from "~/utils/hooks";
import {
  type ExpectedGraphDataType,
  type ActualGraphDataType,
} from "~/utils/types";

export default function BurndownChart({
  actualData,
  expectedData,
}: {
  actualData: ActualGraphDataType[];
  expectedData: ExpectedGraphDataType[];
}) {
  const isDarkTheme = usePrefersDarkMode();
  const colourChoice = isDarkTheme ? "white" : "black";

  if (actualData.length == 0 || expectedData.length == 0) {
    return (
      <p className="dark:text-white">
        There&apos;s been no progress for this sprint yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer aspect={3}>
      <LineChart margin={{ top: 20, right: 40, left: 10, bottom: 20 }}>
        <XAxis
          dataKey="day"
          stroke={colourChoice}
          label={{ value: "Day", fill: colourChoice, dy: 20 }}
          height={50}
          ticks={[...Array(expectedData[1].day + 1).keys()]}
          scale="linear"
          allowDuplicatedCategory={false}
        />
        <YAxis
          stroke={colourChoice}
          label={{
            value: "Story Points",
            fill: "white",
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
        <CartesianGrid stroke={colourChoice} strokeDasharray="5 5" />
        <Line
          type="linear"
          dataKey="actual"
          stroke="#82ca9d"
          strokeWidth={3}
          data={actualData}
        />
        <Line
          type="linear"
          dataKey="expected"
          stroke="#8884d8"
          strokeWidth={3}
          data={expectedData}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
