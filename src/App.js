import { Canvas, extend, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three-stdlib'

extend({ OrbitControls })

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
  const {
    camera,
    gl: { domElement },
  } = useThree()
  return (
    <>
      <orbitControls args={[camera, domElement]} />
      <mesh>
        <boxGeometry />
        <meshPhongMaterial color="red" />
        <ambientLight intensity={0.4} />
        <directionalLight position={[0, 0, 5]} />
      </mesh>
    </>
  )
}

export default App
