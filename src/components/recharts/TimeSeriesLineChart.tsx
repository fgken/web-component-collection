// http://recharts.org/en-US/examples/HighlightAndZoomLineChart

import React, { PureComponent } from 'react'
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea
} from 'recharts'
import moment from "moment"

interface TimeSeriesData {
  [key: string]: number;
}
const data: Array<TimeSeriesData> = []

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}
data.push({ time: 0, cost: getRandomInt(1000), impression: getRandomInt(1000) })
for (let i = 1; i < 30; i++) {
  data.push({ time: 1000 * 60 * 60 * i, cost: getRandomInt(1000), impression: getRandomInt(1000) })
}

interface TimeSeriesLineChartState {
  data: Array<TimeSeriesData>;
  left: string | number;
  right: string | number;
  refAreaLeft: string | number;
  refAreaRight: string | number;
}

const initialState: TimeSeriesLineChartState = {
  data,
  left: 'dataMin',
  right: 'dataMax',
  refAreaLeft: '',
  refAreaRight: '',
}

export default class TimeSeriesLineChart extends PureComponent<{}, TimeSeriesLineChartState> {
  constructor(props: {}) {
    super(props)
    this.state = initialState
  }

  zoom() {
    let { refAreaLeft, refAreaRight } = this.state
    const { data } = this.state

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      this.setState(() => ({
        refAreaLeft: '',
        refAreaRight: '',
      }))
      return
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft]
    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
    }))
  }

  zoomOut() {
    const { data } = this.state
    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: 'dataMin',
      right: 'dataMax',
    }))
  }

  render() {
    const {
      data, left, right, refAreaLeft, refAreaRight,
    } = this.state

    return (
      <div className="highlight-bar-charts" style={{ userSelect: 'none' }}>
        <button
          className="btn update"
          onClick={this.zoomOut.bind(this)}
        >
          Zoom Out

        </button>

        <LineChart
          width={800}
          height={400}
          data={data}
          onMouseDown={e => this.setState({ refAreaLeft: e.activeLabel })}
          onMouseMove={e => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel })}
          onMouseUp={this.zoom.bind(this)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            allowDataOverflow={true}
            dataKey="time"
            domain={[left, right]}
            type="number"
            tickFormatter={(unixTime) => moment(unixTime).format('HH:mm:ss')}
          />
          <YAxis
            allowDataOverflow={true}
            type="number"
          />
          <Tooltip
            labelFormatter={(label) => moment(label).format("YYYY/MM/DD HH:mm:ss")}
          />
          <Line
            type="monotoneX"
            dataKey="cost"
            stroke="#8884d8"
            animationDuration={300}
            connectNulls={true}
          />
          <Line
            type="monotoneX"
            dataKey="impression"
            stroke="#8884d8"
            animationDuration={300}
            connectNulls={true}
          />

          {
            (refAreaLeft && refAreaRight) ? (
              <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />) : null
          }
        </LineChart>

      </div>
    )
  }
}
