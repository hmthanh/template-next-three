'use client'

import { Loading } from '@/components/dom/Loading'
import { useFrame } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { Suspense, useCallback, useRef, useState } from 'react'

const Logo = dynamic(() => import('@/features/Logo').then((mod) => mod.Logo), { ssr: false })
const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
const Duck = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Duck), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <Loading />
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

function Box(props) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}



export default function Page() {
  const [state, setState] = useState("dog");
  const onHandleClick = useCallback((event) => {
    if (state == "dog") {
      setState('duck')
    } else if (state === "duck") {
      setState('dog')
    }
    console.log(state)
  }, [state])

  return (
    <>
      <div className='mx-auto flex w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5'>
        <div className='flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left'>
          <h1 className='my-4 text-5xl font-bold leading-tight'>ThreeJS with Next Starter</h1>
          <p className='mb-8 text-2xl leading-normal'>A minimalist starter for React, React-three-fiber and Threejs.</p>
        </div>

        <div className='w-full text-center md:w-3/5'>
          <View className='flex h-96 w-full flex-col items-center justify-center'>
            <Suspense fallback={<Loading />}>
              <Logo route='/about' scale={0.6} position={[0, 0, 0]} />
              {
                state === "dog" ? <Dog /> : <Duck />
              }
              <Box position={[-1.2, 0, 0]} />
              <Common />
            </Suspense>
          </View>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onHandleClick}>
            Change to {state === "dog" ? "duck" : "dog"}
          </button>
        </div>
      </div>
    </>
  )
}
