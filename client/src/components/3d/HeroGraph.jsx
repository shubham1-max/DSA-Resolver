import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Sphere } from "@react-three/drei";
import { useTheme } from "../../context/ThemeContext";

const nodePositions = [
  [-5.4, 1.8, -1.5], [-3.2, -0.7, 0.2], [-1.2, 2.1, 1.1], [1.4, 0.8, -0.6],
  [3.6, 2.5, 0.8], [5.3, -0.1, -1.2], [2.4, -2.2, 1.5], [-0.6, -1.8, -1.4],
  [-4.7, -2.4, 0.9], [0, 0, 0.4], [4.8, -2.7, 0.3], [-2.5, 3.3, -0.8],
];

const connections = [
  [0, 1], [0, 11], [1, 2], [1, 7], [2, 3], [2, 9], [3, 4], [3, 6],
  [4, 5], [5, 10], [6, 10], [6, 9], [7, 8], [7, 9], [8, 1], [9, 3],
];

function AlgorithmGraph({ theme }) {
  const groupRef = useRef(null);
  const pulseRef = useRef(null);
  const { mouse, viewport } = useThree();

  const edges = useMemo(() => connections.map(([a, b]) => [nodePositions[a], nodePositions[b]]), []);
  
  const isDark = theme === "dark";
  const palette = isDark ? ["#8BA7FF", "#FF8C73", "#F5C963", "#48C8BE"] : ["#2D63D8", "#EE6B4D", "#F3B63F", "#159F9A"];
  const edgeColor = isDark ? "#52525b" : "#8da0b8";

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.045;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
    groupRef.current.position.x += ((mouse.x * viewport.width) / 22 - groupRef.current.position.x) * 0.035;
    groupRef.current.position.y += ((mouse.y * viewport.height) / 24 - groupRef.current.position.y) * 0.035;

    if (pulseRef.current) {
      const t = state.clock.elapsedTime;
      pulseRef.current.position.x = Math.sin(t * 0.8) * 2.8;
      pulseRef.current.position.y = Math.cos(t * 0.65) * 1.2;
      pulseRef.current.position.z = Math.sin(t * 0.45) * 1.4;
    }
  });

  return (
    <group ref={groupRef} position={[1.5, 0.2, 0]}>
      {edges.map((points, index) => (
        <Line key={index} points={points} color={edgeColor} lineWidth={1.2} transparent opacity={isDark ? 0.45 : 0.34} />
      ))}

      {nodePositions.map((position, index) => (
        <Sphere key={index} args={[0.13 + (index % 3) * 0.035, 28, 28]} position={position}>
          <meshStandardMaterial
            color={palette[index % palette.length]}
            emissive={palette[index % palette.length]}
            emissiveIntensity={0.28}
            roughness={0.34}
            metalness={0.25}
          />
        </Sphere>
      ))}

      <mesh ref={pulseRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial color={palette[1]} emissive={palette[1]} emissiveIntensity={0.7} roughness={0.2} metalness={0.35} />
      </mesh>
      <mesh rotation={[0.7, 0.15, 0.45]} position={[-1.2, 1.25, -0.8]}>
        <torusGeometry args={[1.15, 0.025, 12, 80]} />
        <meshStandardMaterial color={palette[0]} emissive={palette[0]} emissiveIntensity={0.38} transparent opacity={0.62} />
      </mesh>
      <mesh rotation={[-0.45, 0.7, 0.2]} position={[1.7, -1.1, 0.3]}>
        <torusGeometry args={[0.76, 0.022, 12, 80]} />
        <meshStandardMaterial color={palette[2]} emissive={palette[2]} emissiveIntensity={0.36} transparent opacity={0.58} />
      </mesh>
      <mesh position={[3.25, 1.05, -1.3]} rotation={[0.5, 0.6, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={palette[3]} emissive={palette[3]} emissiveIntensity={0.48} roughness={0.25} metalness={0.46} />
      </mesh>

      <ambientLight intensity={isDark ? 0.6 : 0.86} />
      <directionalLight position={[5, 7, 5]} intensity={isDark ? 1.4 : 1.1} />
      <pointLight position={[-4, -2, 4]} intensity={2.2} color={palette[0]} />
      <pointLight position={[5, 3, -4]} intensity={1.7} color={palette[1]} />
    </group>
  );
}

export default function HeroGraph({ variant = "default" }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (event) => setReducedMotion(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className={`r3f-canvas-container ${variant === "home" ? "home-canvas" : ""}`}>
      <Canvas camera={{ position: [0, 0, 10.5], fov: 46 }} dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
        <AlgorithmGraph theme={theme} />
      </Canvas>
    </div>
  );
}
