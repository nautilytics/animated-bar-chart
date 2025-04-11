import { select } from "d3";
import { type FC, useEffect, useRef } from "react";
import { DURATION } from "../constants";

interface BarProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const Bar: FC<BarProps> = ({ x, y, width, height }) => {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = select(barRef.current);
    bar
      .transition()
      .duration(DURATION / 2)
      .attr("y", y)
      .attr("width", width);
    return () => {
      bar.transition().remove();
    };
  }, [y, width]);

  return (
    <rect
      className="stroke-none cursor-pointer fill-blue-600 *:hover:fill-blue-700"
      ref={barRef}
      x={x}
      height={height}
    />
  );
};

export default Bar;
