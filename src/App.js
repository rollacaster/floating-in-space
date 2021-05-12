import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls, Html } from '@react-three/drei'
import { useSpring, animated } from 'react-spring'

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}

const Scene = () => {
  const { clock } = useThree()
  const cube = useRef()
  const [{ t }, api] = useSpring(() => ({
    t: clock.getElapsedTime(),
  }))

  useFrame(({ clock }) => {
    const et = clock.getElapsedTime()
    api({ t: clock.getElapsedTime() })
    cube.current.position.y = Math.sin(et / 2) * 1
    cube.current.rotation.x = Math.sin(et / 3) / 10
    cube.current.rotation.y = Math.cos(et / 2) / 10
    cube.current.rotation.z = Math.sin(et / 3) / 10
  })
  return (
    <>
      <Html calculatePosition={() => [10, 10]}>
        <svg>
          <animated.text x={0} y={20}>
            {t.to((x) => x.toFixed(0))}
          </animated.text>
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
