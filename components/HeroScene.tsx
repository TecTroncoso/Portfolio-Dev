import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Environment, ContactShadows } from '@react-three/drei';
import { Group, Mesh, InstancedMesh, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, Object3D } from 'three';

// --- STATIC DATA ---
export const CODE_SNIPPETS = [
    '<React />', 'const AI', 'npm i', 'git push', '{...props}', '</div>', 'import', 'async',
    'await', 'Next.js', 'Tailwind', 'Three.js', 'interface', 'type', 'export', 'return',
    'console.log', 'useEffect', 'useState', '404', '200 OK', 'sudo', 'docker', 'kubectl'
];

// --- 3D SUB-COMPONENTS ---

const FloatingCode = React.memo(() => {
    // Generate random positions once (memoized to prevent hydration mismatch/re-calc)
    const particles = useMemo(() => {
        return CODE_SNIPPETS.map((text, i) => {
            const x = (Math.random() - 0.5) * 16;
            const y = Math.random() * 8 - 2;
            const z = -2 - Math.random() * 6;
            return {
                text,
                position: [x, y, z] as [number, number, number],
                rotation: [Math.random() * 0.5, Math.random() * 0.5, 0] as [number, number, number],
                color: Math.random() > 0.6 ? "#818cf8" : (Math.random() > 0.5 ? "#22d3ee" : "#c084fc"),
                speed: Math.random() * 0.5 + 0.1
            };
        });
    }, []);

    return (
        <group>{particles.map((p, i) => (
            <Float key={i} speed={p.speed} rotationIntensity={0.5} floatIntensity={1.5} position={p.position}><Text
                fontSize={0.3}
                color={p.color}
                anchorX="center"
                anchorY="middle"
                fillOpacity={0.6}
                rotation={p.rotation}
            >{p.text}</Text></Float>
        ))}</group>
    );
});

// Reusable Fan Component
const RGBFan = ({ position, color, rotation = [0, 0, 0], scale = 1 }: { position: [number, number, number], color: string, rotation?: [number, number, number], scale?: number }) => {
    const fanBlades = useRef<Group>(null);
    useFrame((state, delta) => {
        if (fanBlades.current) fanBlades.current.rotation.z -= delta * 10;
    });

    return (
        <group position={position} rotation={rotation as any} scale={scale}>
            <mesh><boxGeometry args={[0.3, 0.3, 0.05]} /><meshStandardMaterial color="#111" /></mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.01, 16, 32]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} /></mesh>
            <group ref={fanBlades}>
                <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.05]} /><meshStandardMaterial color="#333" /></mesh>
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <mesh key={i} rotation={[0, 0, (i / 7) * Math.PI * 2]} position={[0, 0, 0]}>
                        <boxGeometry args={[0.02, 0.12, 0.01]} />
                        <meshStandardMaterial color="#222" />
                    </mesh>
                ))}
            </group>
        </group>
    )
}

const Workstation = () => {
    const group = useRef<Group>(null);
    const leftShoulder = useRef<Group>(null);
    const rightShoulder = useRef<Group>(null);
    const leftForearm = useRef<Group>(null);
    const rightForearm = useRef<Group>(null);
    const head = useRef<Group>(null);
    const screenRef = useRef<Mesh>(null);
    const keyboardRef = useRef<InstancedMesh>(null);
    const lineRefs = useRef<Mesh[]>([]);
    const hoveredKeyId = useRef<string | null>(null);

    const materials = useMemo(() => ({
        hoodie: new MeshStandardMaterial({ color: "#1e293b", roughness: 0.9 }),
        skin: new MeshPhysicalMaterial({ color: "#ffdbac", roughness: 0.4 }),
        darkMetal: new MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.3, metalness: 0.8 }),
        pcb: new MeshStandardMaterial({ color: "#0f172a", roughness: 0.5, metalness: 0.5 }),
        glass: new MeshPhysicalMaterial({
            color: "#ffffff", transmission: 0.6, opacity: 0.3, transparent: true, roughness: 0.1, thickness: 0.5, metalness: 0.1, ior: 1.5, clearcoat: 1
        }),
        desk: new MeshStandardMaterial({ color: "#0f172a", roughness: 0.2, metalness: 0.1 }),
        mousepad: new MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.9 }),
        screenGlow: new MeshStandardMaterial({ color: "#050510", emissive: "#0000ff", emissiveIntensity: 0.2, toneMapped: false }),
        neonPurple: new MeshStandardMaterial({ color: "#a855f7", emissive: "#a855f7", emissiveIntensity: 2, toneMapped: false }),
        neonCyan: new MeshStandardMaterial({ color: "#22d3ee", emissive: "#22d3ee", emissiveIntensity: 2, toneMapped: false }),
        componentBlack: new MeshStandardMaterial({ color: "#050505", roughness: 0.4 }),
        matteBlack: new MeshStandardMaterial({ color: "#111", roughness: 0.8 }),
        chairLeather: new MeshStandardMaterial({ color: "#111", roughness: 0.6 }),
        chairPlastic: new MeshStandardMaterial({ color: "#222", roughness: 0.5 }),
        chairAccent: new MeshStandardMaterial({ color: "#6366f1", roughness: 0.5, emissive: "#6366f1", emissiveIntensity: 0.2 }),
    }), []);

    const screenLines = useMemo(() => {
        return Array.from({ length: 14 }).map((_, i) => ({
            width: Math.random() * 1.5 + 0.5,
            color: i % 4 === 0 ? "#22d3ee" : (i % 3 === 0 ? "#a855f7" : (i % 2 === 0 ? "#6366f1" : "#e2e8f0")),
            z: Math.random() * 0.04,
            y: (i * 0.05) - 0.35
        }));
    }, []);

    const keyLayout = useMemo(() => {
        const keys = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 15; col++) {
                keys.push({
                    position: [(col - 7) * 0.075, 0, (row - 1.5) * 0.075] as [number, number, number],
                    id: `k-${row}-${col}`,
                    width: 0.06
                });
            }
        }
        return keys;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (leftForearm.current && rightForearm.current) {
            if (leftShoulder.current) leftShoulder.current.rotation.x = -0.2 + Math.sin(t * 8) * 0.05;
            if (rightShoulder.current) rightShoulder.current.rotation.x = -0.2 + Math.cos(t * 8) * 0.05;

            leftForearm.current.rotation.x = -1.3 + Math.sin(t * 20) * 0.1;
            rightForearm.current.rotation.x = -1.3 + Math.cos(t * 22) * 0.1;
        }

        if (keyboardRef.current) {
            const dummy = new Object3D();
            const mesh = keyboardRef.current as unknown as InstancedMesh;

            if (mesh.count) {
                keyLayout.forEach((key, i) => {
                    const noise = Math.sin(t * 25 + i * 133.37);
                    const isAutoTyping = noise > 0.9;
                    const isHovered = hoveredKeyId.current === key.id;
                    const isPressed = isAutoTyping || isHovered;

                    const targetY = isPressed ? -0.015 : 0;

                    dummy.position.set(key.position[0], key.position[1] + targetY * 0.4, key.position[2]);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                });
                mesh.instanceMatrix.needsUpdate = true;
            }
        }

        if (head.current) {
            head.current.rotation.x = Math.sin(t * 2) * 0.05 + 0.1;
            head.current.rotation.y = Math.sin(t * 0.5) * 0.1;
            head.current.rotation.z = Math.sin(t * 1) * 0.02;
        }

        if (screenRef.current) {
            (screenRef.current.material as MeshStandardMaterial).emissiveIntensity = 1 + Math.sin(t * 2) * 0.2;
        }

        lineRefs.current.forEach((mesh, i) => {
            if (mesh) {
                const line = screenLines[i];
                const scrollSpeed = 0.2;
                const sectionHeight = 0.7;

                const phase = (t * scrollSpeed + (i / screenLines.length)) % 1;
                const yPos = -0.35 + (phase * sectionHeight);

                mesh.position.y = yPos;
                mesh.position.z = line.z;

                const entranceProgress = Math.min(phase * 15, 1);
                const jitter = Math.random() > 0.99 ? 0.9 : 1;
                mesh.scale.x = entranceProgress * jitter;
                mesh.position.x = (line.width * mesh.scale.x) / 2;
                const exitProgress = Math.max(0, (phase - 0.85) * 6.66);
                const opacity = 1 - exitProgress;

                const mat = mesh.material as MeshBasicMaterial;
                if (mat) {
                    mat.opacity = opacity;
                    mat.transparent = true;
                }
            }
        });

        if (group.current) {
            group.current.position.y = -1 + Math.sin(t * 0.5) * 0.02;
        }
    });

    return (
        <group ref={group} rotation={[0, -0.4, 0]} position={[0, -1, 0]}>
            <group position={[0, 0.45, 1.2]}>
                <group ref={head} position={[0, 1.15, 0]}>
                    <mesh><boxGeometry args={[0.45, 0.5, 0.45]} /><primitive object={materials.skin} attach="material" /></mesh>
                    <group position={[0, 0.28, 0]}>
                        <mesh><boxGeometry args={[0.5, 0.15, 0.5]} /><meshStandardMaterial color="#2d2216" roughness={0.9} /></mesh>
                        <mesh position={[0, -0.1, -0.25]}><boxGeometry args={[0.5, 0.4, 0.1]} /><meshStandardMaterial color="#2d2216" roughness={0.9} /></mesh>
                    </group>
                    <group position={[0, 0.02, 0.24]}>
                        <mesh position={[-0.1, 0, 0]}><boxGeometry args={[0.12, 0.08, 0.02]} /><meshStandardMaterial color="#000" /></mesh>
                        <mesh position={[0.1, 0, 0]}><boxGeometry args={[0.12, 0.08, 0.02]} /><meshStandardMaterial color="#000" /></mesh>
                        <mesh><boxGeometry args={[0.1, 0.01, 0.02]} /><meshStandardMaterial color="#000" /></mesh>
                    </group>
                    <group position={[0, 0.05, 0]}>
                        <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.28, 0.04, 8, 24, Math.PI]} /><meshStandardMaterial color="#333" roughness={0.5} /></mesh>
                        <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
                            <meshStandardMaterial color="#111" />
                            <mesh position={[0, -0.051, 0]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.06, 0.08, 16]} /><primitive object={materials.neonPurple} attach="material" /></mesh>
                        </mesh>
                        <mesh position={[0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
                            <meshStandardMaterial color="#111" />
                            <mesh position={[0, 0.051, 0]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.06, 0.08, 16]} /><primitive object={materials.neonPurple} attach="material" /></mesh>
                        </mesh>
                    </group>
                </group>
                <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.5, 0.9, 0.3]} /><primitive object={materials.hoodie} attach="material" /></mesh>
                <mesh position={[0, 0.75, -0.16]} rotation={[-0.2, 0, 0]}><boxGeometry args={[0.48, 0.3, 0.15]} /><primitive object={materials.hoodie} attach="material" /></mesh>
                <group ref={leftShoulder} position={[-0.32, 0.8, 0]} rotation={[-0.2, -0.3, -0.2]}>
                    <mesh position={[0, -0.18, 0]}><boxGeometry args={[0.12, 0.36, 0.12]} /><primitive object={materials.hoodie} attach="material" /></mesh>
                    <group ref={leftForearm} position={[0, -0.34, 0]} rotation={[-1.3, 0, 0]}>
                        <mesh position={[0, -0.15, 0]}><boxGeometry args={[0.10, 0.3, 0.10]} /><primitive object={materials.hoodie} attach="material" /></mesh>
                        <mesh position={[0, -0.32, 0]}><sphereGeometry args={[0.07]} /><primitive object={materials.skin} attach="material" /></mesh>
                    </group>
                </group>
                <group ref={rightShoulder} position={[0.32, 0.8, 0]} rotation={[-0.2, 0.3, 0.2]}>
                    <mesh position={[0, -0.18, 0]}><boxGeometry args={[0.12, 0.36, 0.12]} /><primitive object={materials.hoodie} attach="material" /></mesh>
                    <group ref={rightForearm} position={[0, -0.34, 0]} rotation={[-1.3, 0, 0]}>
                        <mesh position={[0, -0.15, 0]}><boxGeometry args={[0.10, 0.3, 0.10]} /><primitive object={materials.hoodie} attach="material" /></mesh>
                        <mesh position={[0, -0.32, 0]}><sphereGeometry args={[0.07]} /><primitive object={materials.skin} attach="material" /></mesh>
                    </group>
                </group>
                <group position={[-0.15, 0, 0.15]}>
                    <mesh position={[0, 0, 0.2]} rotation={[-1.57, 0, 0]}><boxGeometry args={[0.18, 0.45, 0.18]} /><meshStandardMaterial color="#0f172a" roughness={0.6} /></mesh>
                    <mesh position={[0, -0.4, 0.4]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.16, 0.5, 0.16]} /><meshStandardMaterial color="#0f172a" roughness={0.6} /></mesh>
                    <mesh position={[0, -0.65, 0.45]} rotation={[0, 0, 0]}><boxGeometry args={[0.17, 0.1, 0.35]} /><meshStandardMaterial color="#111" />
                        <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.1, 0.02, 0.1]} /><meshStandardMaterial color="#fff" /></mesh>
                    </mesh>
                </group>
                <group position={[0.15, 0, 0.15]}>
                    <mesh position={[0, 0, 0.2]} rotation={[-1.57, 0, 0]}><boxGeometry args={[0.18, 0.45, 0.18]} /><meshStandardMaterial color="#0f172a" roughness={0.6} /></mesh>
                    <mesh position={[0, -0.4, 0.4]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.16, 0.5, 0.16]} /><meshStandardMaterial color="#0f172a" roughness={0.6} /></mesh>
                    <mesh position={[0, -0.65, 0.45]} rotation={[0, 0, 0]}><boxGeometry args={[0.17, 0.1, 0.35]} /><meshStandardMaterial color="#111" />
                        <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.1, 0.02, 0.1]} /><meshStandardMaterial color="#fff" /></mesh>
                    </mesh>
                </group>
            </group>

            <mesh position={[0, 0.8, 2]} receiveShadow castShadow><boxGeometry args={[3.8, 0.1, 1.6]} /><primitive object={materials.desk} attach="material" /></mesh>
            <mesh position={[0, 0.86, 2.2]}><boxGeometry args={[2, 0.01, 0.8]} /><primitive object={materials.mousepad} attach="material" /></mesh>

            <group position={[0, 1.5, 2]} rotation={[0, Math.PI, 0]}>
                <mesh><boxGeometry args={[2.2, 0.85, 0.1]} /><meshStandardMaterial color="#111" roughness={0.4} /></mesh>
                <mesh ref={screenRef} position={[0, 0, 0.06]}>
                    <planeGeometry args={[2.1, 0.75]} /><primitive object={materials.screenGlow} attach="material" />
                    <group position={[-0.95, 0, 0.01]}>
                        {screenLines.map((line, i) => (
                            <mesh key={i} ref={(el) => { lineRefs.current[i] = el!; }} position={[line.width / 2, line.y, 0]}>
                                <planeGeometry args={[line.width, 0.04]} /><meshBasicMaterial color={line.color} transparent opacity={1} />
                            </mesh>
                        ))}
                    </group>
                </mesh>
                <mesh position={[0, -0.5, -0.1]}><cylinderGeometry args={[0.08, 0.12, 0.5, 16]} /><meshStandardMaterial color="#222" /></mesh>
                <mesh position={[0, -0.75, 0.1]}><boxGeometry args={[0.8, 0.05, 0.4]} /><meshStandardMaterial color="#222" /></mesh>
            </group>

            <group position={[0, 0.88, 1.7]} rotation={[-0.08, 0, 0]}>
                <mesh position={[0, -0.01, 0]}><boxGeometry args={[1.25, 0.05, 0.45]} /><meshStandardMaterial color="#050505" roughness={0.7} /></mesh>
                <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.15, 0.38]} /><meshBasicMaterial color="#a855f7" transparent opacity={0.2} /></mesh>
                <instancedMesh ref={keyboardRef} args={[undefined, undefined, keyLayout.length]} position={[0, 0.03, 0]} onPointerOver={(e) => { e.stopPropagation(); hoveredKeyId.current = keyLayout[e.instanceId].id; }} onPointerOut={(e) => { hoveredKeyId.current = null; }}>
                    <boxGeometry args={[0.06, 0.025, 0.06]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
                </instancedMesh>
                <mesh position={[0, 0, 2.5 * 0.075]} name="spacebar" onPointerOver={(e) => { e.stopPropagation(); hoveredKeyId.current = "spacebar"; }} onPointerOut={(e) => { hoveredKeyId.current = null; }}>
                    <boxGeometry args={[0.4, 0.025, 0.06]} /><meshStandardMaterial color="#1a1a1a" roughness={0.4} />
                </mesh>
            </group>

            <mesh position={[0.8, 0.88, 1.7]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[0.15, 0.08, 0.25]} /><meshStandardMaterial color="#111" />
                <mesh position={[0, 0.04, -0.05]}><boxGeometry args={[0.02, 0.01, 0.05]} /><meshStandardMaterial color="#22d3ee" emissive="#22d3ee" /></mesh>
            </mesh>

            <group position={[1.5, 1.4, 2]} scale={1.1}>
                <mesh position={[0.2, -0.72, 0.4]}><cylinderGeometry args={[0.04, 0.03, 0.05]} /><meshStandardMaterial color="#111" /></mesh>
                <mesh position={[-0.2, -0.72, 0.4]}><cylinderGeometry args={[0.04, 0.03, 0.05]} /><meshStandardMaterial color="#111" /></mesh>
                <mesh position={[0.2, -0.72, -0.4]}><cylinderGeometry args={[0.04, 0.03, 0.05]} /><meshStandardMaterial color="#111" /></mesh>
                <mesh position={[-0.2, -0.72, -0.4]}><cylinderGeometry args={[0.04, 0.03, 0.05]} /><meshStandardMaterial color="#111" /></mesh>

                <group>
                    <mesh position={[0, 0, -0.55]} castShadow><boxGeometry args={[0.6, 1.4, 0.02]} /><primitive object={materials.darkMetal} attach="material" /></mesh>
                    <mesh position={[0, -0.6, 0]} castShadow><boxGeometry args={[0.6, 0.2, 1.15]} /><primitive object={materials.darkMetal} attach="material" /></mesh>
                    <mesh position={[0, 0.68, 0]} castShadow><boxGeometry args={[0.6, 0.05, 1.15]} /><primitive object={materials.darkMetal} attach="material" /></mesh>
                    <mesh position={[0, 0, 0.55]}>
                        <group>
                            <mesh position={[0, 0, 0.02]}><boxGeometry args={[0.58, 1.38, 0.02]} /><primitive object={materials.glass} attach="material" /></mesh>
                            <mesh position={[0.28, 0, 0]}><boxGeometry args={[0.04, 1.4, 0.05]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                            <mesh position={[-0.28, 0, 0]}><boxGeometry args={[0.04, 1.4, 0.05]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                        </group>
                    </mesh>
                    <mesh position={[0.28, 0.1, 0]}><boxGeometry args={[0.02, 1.15, 1.05]} /><primitive object={materials.darkMetal} attach="material" /></mesh>
                </group>
                <mesh position={[-0.3, 0.05, 0]}>
                    <boxGeometry args={[0.01, 1.25, 1.05]} /><primitive object={materials.glass} attach="material" />
                    <mesh position={[-0.01, 0.55, 0.45]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.02]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                    <mesh position={[-0.01, 0.55, -0.45]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.02]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                    <mesh position={[-0.01, -0.55, 0.45]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.02]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                    <mesh position={[-0.01, -0.55, -0.45]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.015, 0.015, 0.02]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                </mesh>
                <group position={[0.05, 0, 0]}>
                    <mesh position={[0.24, 0.1, 0]}><boxGeometry args={[0.02, 0.8, 0.8]} /><primitive object={materials.pcb} attach="material" /></mesh>
                    <mesh position={[0.22, 0.35, -0.1]}><boxGeometry args={[0.05, 0.04, 0.25]} /><primitive object={materials.darkMetal} attach="material" /></mesh>
                    <mesh position={[0.22, 0.25, -0.2]}><boxGeometry args={[0.05, 0.2, 0.04]} /><primitive object={materials.darkMetal} attach="material" /></mesh>
                    <group position={[0, -0.25, 0]}>
                        <mesh castShadow><boxGeometry args={[0.25, 0.06, 0.7]} /><primitive object={materials.componentBlack} attach="material" /></mesh>
                        <mesh position={[0, 0.035, 0]}><boxGeometry args={[0.25, 0.005, 0.7]} /><meshStandardMaterial color="#222" roughness={0.7} /></mesh>
                        <mesh position={[-0.126, 0, 0]}><boxGeometry args={[0.005, 0.02, 0.6]} /><primitive object={materials.neonCyan} attach="material" /></mesh>
                        <group position={[-0.1, 0.03, 0.3]} rotation={[0, 0, 0.2]}>
                            <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.15]} /><meshStandardMaterial color="#000" /></mesh>
                            <mesh position={[0.02, 0.05, 0]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.15]} /><meshStandardMaterial color="#000" /></mesh>
                        </group>
                    </group>
                    <group position={[0.18, 0.25, 0]}>
                        <mesh><cylinderGeometry args={[0.06, 0.06, 0.05]} /><primitive object={materials.componentBlack} attach="material" /></mesh>
                        <mesh position={[-0.061, 0, 0]} rotation={[0, 0, Math.PI / 2]}><circleGeometry args={[0.04, 32]} /><primitive object={materials.neonPurple} attach="material" /></mesh>
                        <group position={[-0.1, 0.15, 0]} rotation={[0, 0, -0.5]}>
                            <mesh position={[0, 0, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.01, 0.01, 0.25]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                            <mesh position={[-0.05, 0.12, 0]} rotation={[0, 0, 0.6]}><cylinderGeometry args={[0.01, 0.01, 0.2]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                        </group>
                    </group>
                    <group position={[0.18, 0.25, 0.12]}>
                        {[0, 1, 2, 3].map((i) => (
                            <group key={i} position={[i * 0.02, 0, 0]}>
                                <mesh><boxGeometry args={[0.01, 0.12, 0.005]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                                <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.011, 0.08, 0.006]} /><primitive object={materials.neonCyan} attach="material" /></mesh>
                            </group>
                        ))}
                    </group>
                    <mesh position={[0.2, 0.1, 0.35]} rotation={[0, 0, -0.2]}><cylinderGeometry args={[0.03, 0.03, 0.1]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                </group>
                <group position={[-0.1, 0, 0.48]}>
                    <RGBFan position={[0, 0.35, 0]} color="#a855f7" rotation={[0, 0, 0]} scale={0.9} />
                    <RGBFan position={[0, 0, 0]} color="#22d3ee" rotation={[0, 0, 0]} scale={0.9} />
                    <RGBFan position={[0, -0.35, 0]} color="#a855f7" rotation={[0, 0, 0]} scale={0.9} />
                </group>
                <group position={[0, 0.35, -0.48]}>
                    <RGBFan position={[0, 0, 0]} color="#22d3ee" rotation={[0, Math.PI, 0]} scale={0.9} />
                </group>
                <mesh position={[0, 0.64, 0]}><boxGeometry args={[0.4, 0.02, 1.0]} /><primitive object={materials.matteBlack} attach="material" /></mesh>
                <pointLight position={[0, 0.2, 0]} color="#a855f7" intensity={2} distance={1.5} decay={2} />
            </group>

            <group position={[0, 0, 1.2]} rotation={[0, 0, 0]}>
                <group position={[0, 0.08, 0]}>
                    <mesh><cylinderGeometry args={[0.08, 0.35, 0.1]} /><primitive object={materials.chairPlastic} attach="material" /></mesh>
                    {[0, 1, 2, 3, 4].map(i => (
                        <mesh key={i} rotation={[0, (i / 5) * Math.PI * 2, 0]} position={[0, -0.02, 0]}>
                            <boxGeometry args={[0.05, 0.04, 0.35]} /><primitive object={materials.chairPlastic} attach="material" />
                            <mesh position={[0, -0.04, 0.15]}><cylinderGeometry args={[0.025, 0.025, 0.04]} /><meshStandardMaterial color="#111" /></mesh>
                        </mesh>
                    ))}
                </group>
                <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.04, 0.04, 0.4]} /><meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} /></mesh>
                <group position={[0, 0.45, 0]}>
                    <mesh><boxGeometry args={[0.65, 0.1, 0.6]} /><primitive object={materials.chairLeather} attach="material" /></mesh>
                    <mesh position={[0, 0.051, 0.25]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.05]} /><primitive object={materials.chairAccent} attach="material" /></mesh>
                </group>
                <group position={[0, 0.95, -0.25]} rotation={[-0.15, 0, 0]}>
                    <mesh><boxGeometry args={[0.6, 1.1, 0.1]} /><primitive object={materials.chairLeather} attach="material" /></mesh>
                    <mesh position={[0.28, 0, 0.05]} rotation={[0, -0.2, 0]}><boxGeometry args={[0.1, 1.0, 0.1]} /><primitive object={materials.chairLeather} attach="material" /></mesh>
                    <mesh position={[-0.28, 0, 0.05]} rotation={[0, 0.2, 0]}><boxGeometry args={[0.1, 1.0, 0.1]} /><primitive object={materials.chairLeather} attach="material" /></mesh>
                    <mesh position={[0.15, 0, 0.051]}><planeGeometry args={[0.04, 0.8]} /><primitive object={materials.chairAccent} attach="material" /></mesh>
                    <mesh position={[-0.15, 0, 0.051]}><planeGeometry args={[0.04, 0.8]} /><primitive object={materials.chairAccent} attach="material" /></mesh>
                    <mesh position={[0, 0.45, 0.08]}><boxGeometry args={[0.3, 0.2, 0.08]} /><primitive object={materials.chairLeather} attach="material" /></mesh>
                </group>
                <group position={[0, 0.45, 0]}>
                    <mesh position={[0.35, 0.2, 0]}>
                        <boxGeometry args={[0.05, 0.3, 0.05]} /><primitive object={materials.chairPlastic} attach="material" />
                        <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.08, 0.04, 0.4]} /><primitive object={materials.chairPlastic} attach="material" /></mesh>
                    </mesh>
                    <mesh position={[-0.35, 0.2, 0]}>
                        <boxGeometry args={[0.05, 0.3, 0.05]} /><primitive object={materials.chairPlastic} attach="material" />
                        <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.08, 0.04, 0.4]} /><primitive object={materials.chairPlastic} attach="material" /></mesh>
                    </mesh>
                </group>
            </group>
        </group >
    );
};

// Default export wrapper
const HeroScene = () => {
    return (
        <Canvas className="w-full h-full" shadows dpr={[1, 1.5]} camera={{ position: [3, 2, 5.5], fov: 35 }}>
            <Suspense fallback={null}>
                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} autoRotate autoRotateSpeed={0.5} />
                <Environment preset="city" />
                <ambientLight intensity={0.4} color="#4f46e5" />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" castShadow />
                <spotLight position={[-5, 5, 0]} intensity={2} color="#a855f7" angle={0.5} penumbra={1} castShadow />
                <pointLight position={[0, 1.5, 1.5]} intensity={1.5} color="#22d3ee" distance={3} />
                <Workstation />
                <FloatingCode />
                <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2.5} far={4} resolution={256} />
            </Suspense>
        </Canvas>
    )
}

export default HeroScene;
