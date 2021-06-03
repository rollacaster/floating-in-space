import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls, Html } from '@react-three/drei'
import { useSpring, animated } from 'react-spring'
import { line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
const width = 300
const chartHeight = 180
const chartCount = 4
const height = chartHeight * chartCount
const margin = { top: 25, right: 30, bottom: 30, left: 30 }
const x = scaleLinear()
  .domain([0, 100])
  .range([margin.left, width - margin.right])

const positionYScale = scaleLinear()
  .domain([-1, 1])
  .range([chartHeight - margin.bottom, margin.top])
const rotationYScale = scaleLinear()
  .domain([-0.1, 0.1])
  .range([chartHeight - margin.bottom, margin.top])
const axisPosition = axisLeft(positionYScale)
const axisRotation = axisLeft(rotationYScale)

const computeLine = (attr, y) =>
  line()
    .x((d, i) => x(i))
    .y((d) => y(d[attr]))
function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}

const Chart = ({ value, attribute, label, data, scale, axis }) => (
  <>
    <animated.text y={12}>
      {value.to((n) => label + ' ' + n.toFixed(2))}
    </animated.text>
    <g
      ref={(el) => {
        if (el) {
          select(el).attr('transform', `translate(${margin.left},0)`).call(axis)
        }
      }}
    />

    <animated.path
      fill="none"
      stroke="black"
      d={value.to((n) => computeLine(attribute, scale)(data.current.points))}
    />
  </>
)

const Scene = () => {
  const { clock } = useThree()
  const cube = useRef()
  const state = useRef({
    points: [{ t: 0, positionY: 0, rotationX: 0, rotationY: 0, rotationZ: 0 }],
  })
  const [{ positionY, rotationX, rotationY, rotationZ }, api] = useSpring(
    () => ({
      t: clock.getElapsedTime(),
      positionY: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
    })
  )

  useFrame(({ clock }) => {
    const et = clock.getElapsedTime()

    cube.current.position.y = Math.sin(et / 2) * 1
    cube.current.rotation.x = Math.sin(et / 3) / 10
    cube.current.rotation.y = Math.cos(et / 2) / 10
    cube.current.rotation.z = Math.sin(et / 3) / 10

    const newPoint = {
      t: clock.getElapsedTime(),
      positionY: Math.sin(et / 2) * 1,
      rotationX: Math.sin(et / 3) / 10,
      rotationY: Math.cos(et / 2) / 10,
      rotationZ: Math.sin(et / 3) / 10,
    }
    api({
      t: clock.getElapsedTime(),
      positionY: Math.sin(et / 2) * 1,
      rotationX: Math.sin(et / 3) / 10,
      rotationY: Math.cos(et / 2) / 10,
      rotationZ: Math.sin(et / 3) / 10,
    })

    if (
      state.current.points[state.current.points.length - 1].t + 0.1 <
      clock.getElapsedTime()
    ) {
      const newPoints =
        state.current.points.length <= 100
          ? state.current.points.concat(newPoint)
          : state.current.points.slice(1).concat(newPoint)

      state.current.points = newPoints
    }
  })

  return (
    <>
      <Html calculatePosition={() => [10, 10]}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Chart
            value={positionY}
            scale={positionYScale}
            attribute="positionY"
            label={'Y Position'}
            data={state}
            axis={axisPosition}
          />

          <g transform={`translate(0, ${height / chartCount})`}>
            <Chart
              value={rotationX}
              scale={rotationYScale}
              attribute="rotationX"
              label={'X Rotation'}
              data={state}
              axis={axisRotation}
            />
          </g>
          <g transform={`translate(0, ${(height / chartCount) * 2})`}>
            <Chart
              value={rotationY}
              scale={rotationYScale}
              attribute="rotationY"
              label={'Y Rotation'}
              data={state}
              axis={axisRotation}
            />
          </g>
          <g transform={`translate(0, ${(height / chartCount) * 3})`}>
            <Chart
              value={rotationZ}
              scale={rotationYScale}
              attribute="rotationZ"
              label={'Z Rotation'}
              data={state}
              axis={axisRotation}
            />
          </g>
        </svg>
      </Html>

      <ambientLight intensity={0.3} />
      <mesh ref={cube}>
        <boxGeometry />
        <meshPhongMaterial color="red" />
      </mesh>
      <OrbitControls />
      <directionalLight position={[0, 0, 1]} />
    </>
  )
}

export default App
