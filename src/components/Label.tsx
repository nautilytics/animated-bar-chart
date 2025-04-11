import { select } from 'd3'
import { type FC, useEffect, useRef } from 'react'
import { DURATION } from '../constants'

interface LabelProps {
  x: number
  y: number
  value: string
}

const Label: FC<LabelProps> = ({ x, y, value }) => {
  const labelRef = useRef(null)

  useEffect(() => {
    const label = select(labelRef.current)
    label
      .transition()
      .duration(DURATION / 2)
      .attr('transform', `translate(${x}, ${y})`)
    return () => {
      label.transition().remove()
    }
  }, [x, y])

  return (
    <g ref={labelRef} className="label">
      <text className="stroke-none font-bold text-[14px] fill-ink-800" dx="1rem">
        {value}
      </text>
    </g>
  )
}

export default Label