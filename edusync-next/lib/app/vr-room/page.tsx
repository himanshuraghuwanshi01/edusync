"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Html } from "@react-three/drei"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Glasses, Loader2 } from "lucide-react"

function Table() {
  return (
    <group position={[0, 0, 0]}>
      {/* Table top */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshStandardMaterial color="#5c4033" roughness={0.8} />
      </mesh>
      {/* Table legs */}
      {[
        [-1.3, 0.35, -0.6],
        [1.3, 0.35, -0.6],
        [-1.3, 0.35, 0.6],
        [1.3, 0.35, 0.6],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 0.7, 0.1]} />
          <meshStandardMaterial color="#4a3728" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Chair({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#3d5c5c" roughness={0.7} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.75, -0.22]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.05]} />
        <meshStandardMaterial color="#3d5c5c" roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[
        [-0.2, 0.22, -0.2],
        [0.2, 0.22, -0.2],
        [-0.2, 0.22, 0.2],
        [0.2, 0.22, 0.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.05, 0.45, 0.05]} />
          <meshStandardMaterial color="#2d4444" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function Whiteboard() {
  return (
    <group position={[0, 1.5, -2.4]}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
      </mesh>
      {/* Board surface */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[2.8, 1.8, 0.02]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
      </mesh>
      {/* Text on whiteboard */}
      <Text
        position={[0, 0.5, 0.08]}
        fontSize={0.15}
        color="#333"
        font="/fonts/Geist-Bold.ttf"
        anchorX="center"
        anchorY="middle"
      >
        Study Room
      </Text>
      <Text
        position={[0, 0, 0.08]}
        fontSize={0.1}
        color="#666"
        font="/fonts/Geist-Regular.ttf"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        textAlign="center"
      >
        {"Welcome to the VR Study Room\nCollaborate with your study partners"}
      </Text>
    </group>
  )
}

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 2.5, -2.5]} receiveShadow>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshStandardMaterial color="#16213e" roughness={0.8} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      {/* Right wall */}
      <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
    </group>
  )
}

function StudyRoomScene() {
  return (
    <>
      <color attach="background" args={["#0f0f1a"]} />
      <fog attach="fog" args={["#0f0f1a", 5, 15]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={1} castShadow color="#fff5e6" />
      <spotLight
        position={[0, 4, 2]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.8}
        castShadow
        color="#e6f0ff"
      />
      
      {/* Environment */}
      <Environment preset="night" />
      
      {/* Room elements */}
      <Room />
      <Table />
      <Chair position={[-0.8, 0, 1]} rotation={[0, 0, 0]} />
      <Chair position={[0.8, 0, 1]} rotation={[0, 0, 0]} />
      <Chair position={[-0.8, 0, -1]} rotation={[0, Math.PI, 0]} />
      <Chair position={[0.8, 0, -1]} rotation={[0, Math.PI, 0]} />
      <Whiteboard />
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        target={[0, 1, 0]}
      />
    </>
  )
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading 3D Scene...</p>
      </div>
    </Html>
  )
}

export default function VRRoomPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar showAuth isLoggedIn />

      <main className="relative flex-1">
        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <Canvas
            shadows
            camera={{ position: [0, 2, 5], fov: 50 }}
            gl={{ antialias: true }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <StudyRoomScene />
            </Suspense>
          </Canvas>
        </div>

        {/* Overlay UI */}
        <div className="pointer-events-none absolute inset-0 flex flex-col">
          {/* Top overlay */}
          <div className="flex items-center justify-center pt-8">
            <div className="pointer-events-auto rounded-full bg-background/80 px-6 py-3 backdrop-blur-sm">
              <h1 className="text-center text-2xl font-bold tracking-tight">
                VR Study Room
              </h1>
              <p className="text-center text-sm text-muted-foreground">
                Coming Soon
              </p>
            </div>
          </div>

          {/* Bottom overlay */}
          <div className="mt-auto flex flex-col items-center gap-4 pb-8">
            <Badge variant="secondary" className="pointer-events-auto gap-2 px-4 py-2">
              <Glasses className="h-4 w-4" />
              VR Headset Required
            </Badge>
            
            <Button 
              size="lg" 
              className="pointer-events-auto gap-2 shadow-lg"
              disabled
            >
              <Glasses className="h-5 w-5" />
              Enter VR
            </Button>

            <p className="max-w-md text-center text-sm text-muted-foreground">
              Use your mouse to orbit around the room. VR functionality will be available soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
