import React, { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree, useLoader } from 'react-three-fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { EditableManager, editable as e, configure } from 'react-three-editable'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Import our previously exported state
import editableState from './editableState'

configure({
  localStorageNamespace: 'cubes-demo'
})

extend({ OrbitControls })

function Controls(props) {
  const { camera, gl } = useThree()
  const ref = useRef()
  useFrame(() => ref.current.update())
  return <orbitControls ref={ref} target={[0, 0, 0]} {...props} args={[camera, gl.domElement]} />
}

function Dome() {
  const texture = useLoader(THREE.TextureLoader, 'http://192.168.1.198:3000/2294472375_24a3b8ef46_o.jpg')

  return (
    <mesh>
      <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
      <meshBasicMaterial attach="material" map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const EditableCamera = e(PerspectiveCamera, 'perspectiveCamera')

export default function App() {
  return (
    <Canvas>
      <Controls enableZoom={true} enablePan={false} enableDamping dampingFactor={0.2} autoRotate={true} rotateSpeed={-0.5} />

      {/* EditableManager connnects this canvas to the React Three Editable. Here we can also pass our state. */}
      <EditableManager state={editableState} />
      <EditableCamera makeDefault uniqueName="Camera1" />
      <ambientLight intensity={0.5} />
      {/* Mark objects as editable. */}
      <e.spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} uniqueName="Spotlight1" />
      <pointLight position={[-10, -10, -10]} />
      {/* Editable objects are displayed in a bounding box in the editor. */}
      {/* Transforms applied in the editor are added on top of  transforms applied in code. */}
      <e.group position={[-1.2, 0, 0]} uniqueName="Box1">
        <Box />
      </e.group>
      {/* Try marking this group as editable too. Don't forget to give it a unique name. */}
      <group position={[0, 0, 0]}>
        {/*<Box />*/}
        <Suspense fallback={null}>
          <Dome />
        </Suspense>
      </group>
    </Canvas>
  )
}
