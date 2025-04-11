import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { descending, format, scaleBand, scaleLinear } from "d3";
import { useState, type FC, type MouseEvent } from "react";
import { useMeasure } from "react-use";
import { Bar, Label, XAxes } from "./components";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const CATEGORIES = ["Gas", "Dining", "Travel", "Streaming", "Groceries"];

const MARGIN = {
  top: 10,
  right: 125,
  bottom: 50,
  left: 0,
};

const App: FC = () => {
  const [ref, { height, width }] = useMeasure<HTMLDivElement>();
  const [data] = useState(
    MONTHS.reduce(
      (acc, month) => {
        const values = CATEGORIES.map((category) => ({
          category,
          value: Math.random() * 100,
        }));
        acc[month] = values;
        return acc;
      },
      {} as Record<string, { category: string; value: number }[]>
    )
  );
  const [activeMonth, setActiveMonth] = useState(MONTHS[0]);
  const handleActiveMonthChange = (
    _event: MouseEvent<HTMLElement>,
    newActiveMonth: string
  ) => {
    setActiveMonth(newActiveMonth);
  };
  const [activeYear, setActiveYear] = useState("2025");
  const handleActiveYearChange = (
    _event: MouseEvent<HTMLElement>,
    newActiveYear: string
  ) => {
    setActiveYear(newActiveYear);
  };
  const innerHeight = height - MARGIN.top - MARGIN.bottom;
  const innerWidth = width - MARGIN.left - MARGIN.right;

  const values = Object.values(data)
    .flat()
    .map((d) => d.value);
  const xScale = scaleLinear()
    .domain([0, Math.max(...values)])
    .range([0, innerWidth]);
  const yScale = scaleBand()
    .padding(0.05)
    .domain(CATEGORIES.map((_d, i) => i.toString()))
    .range([0, innerHeight]);

  return (
    <div data-testid="bar-chart-canvas" className="flex-1 w-full h-full m-6">
      <div className="flex flex-col gap-y-2">
        <ToggleButtonGroup
          aria-label="Year selection toggle button group"
          exclusive
          value={activeYear}
          onChange={handleActiveYearChange}
        >
          {["2025"].map((year) => (
            <ToggleButton key={year} value={year} aria-label={year}>
              {year}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <ToggleButtonGroup
          aria-label="Month selection toggle button group"
          exclusive
          value={activeMonth}
          onChange={handleActiveMonthChange}
        >
          {MONTHS.map((month) => (
            <ToggleButton key={month} value={month} aria-label={month}>
              {month}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div className="w-[800px] h-[400px]" ref={ref}>
        <svg width={width} height={height}>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {data[activeMonth]
              .sort((a, b) => descending(a.value, b.value))
              .map((d, i) => (
                <g key={`chart-row-for-${d.category}`}>
                  <Bar
                    width={xScale(d.value)}
                    height={yScale.bandwidth()}
                    x={0}
                    y={yScale(i.toString()) as number}
                  />
                  <Label
                    x={xScale(d.value)}
                    y={
                      (yScale(i.toString()) as number) + yScale.bandwidth() / 2
                    }
                    value={`${d.category} (${format("$,.0f")(d.value)})`}
                  />
                </g>
              ))}
            <XAxes
              xScale={xScale}
              xScaleTickFormat={format("$,.0f")}
              height={innerHeight}
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default App;
