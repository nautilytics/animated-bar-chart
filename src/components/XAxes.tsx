import { axisBottom, ScaleLinear, select } from 'd3'
import { type FC, useEffect, useRef } from 'react'
import { DURATION } from '../constants'

interface XAxesProps {
  xScale: ScaleLinear<number, number>
  xScaleTickFormat: (domainValue: number, index: number) => string
  height: number
}

const XAxes: FC<XAxesProps> = ({ xScale, xScaleTickFormat, height }) => {
  const xAxisRef = useRef(null)

  const renderXAxis = () => {
    const xAxis = select(xAxisRef.current)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const xAxisBottom: any = axisBottom<number>(xScale).tickFormat(xScaleTickFormat)
    xAxis.transition().duration(DURATION).call(xAxisBottom)
  }

  useEffect(() => {
    renderXAxis()
    const x = select(xAxisRef.current)
    return () => {
      x.transition().remove()
    }
  })

  return (
    <g data-testid="dynamic-rewards-x-axes" transform={`translate(0, ${height})`} ref={xAxisRef}>
      <g ref={xAxisRef} />
      <text
        x="50%"
        y="45px"
        className="[text-anchor:middle] fill-ink-800 stroke-none font-bold text-[14px]"
      >
        Total Spend by Category
      </text>
    </g>
  )
}

export default XAxes