import { Canvas, extend, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three-stdlib'
import { useRef } from 'react'

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
    gl: { domElement, setClearColor },
  } = useThree()
  const lightRef = useRef()
  setClearColor('#000000')

  return (
    <>
      <orbitControls args={[camera, domElement]} />

      <mesh>
        <boxGeometry />
        <meshPhongMaterial color="red" />
      </mesh>
      <mesh position={[0, 0, -8]}>
        <sphereGeometry args={[0.5]} />
        <meshPhongMaterial color="red" />
      </mesh>
      <directionalLight ref={lightRef} position={[0, 0, -5]} />
      {lightRef.current && <directionalLightHelper args={[lightRef.current]} />}
    </>
  )
}

export default App
