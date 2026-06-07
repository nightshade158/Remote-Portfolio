'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function FloatingGeometry() {
  const mesh1 = useRef<THREE.Mesh>(null)
  const mesh2 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mesh1.current) {
      mesh1.current.rotation.x = t * 0.15
      mesh1.current.rotation.y = t * 0.2
      mesh1.current.position.y = Math.sin(t * 0.5) * 0.5
    }
    if (mesh2.current) {
      mesh2.current.rotation.x = -t * 0.1
      mesh2.current.rotation.z = t * 0.15
      mesh2.current.position.y = Math.sin(t * 0.5 + 1) * 0.3
    }
  })

  return (
    <>
      <mesh ref={mesh1} position={[3, 0, -2]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#00f5ff"
          wireframe
          transparent
          opacity={0.3}
          emissive="#00f5ff"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={mesh2} position={[-3.5, 1, -3]}>
        <octahedronGeometry args={[0.8]} />
        <meshStandardMaterial
          color="#4d9fff"
          wireframe
          transparent
          opacity={0.25}
          emissive="#4d9fff"
          emissiveIntensity={0.4}
        />
      </mesh>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 2]} color="#00f5ff" intensity={2} distance={10} />
    </>
  )
}
