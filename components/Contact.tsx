import React, { Suspense, useRef } from 'react';
import { SectionId } from '../types';
import { Reveal } from './Reveal';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Float, useTexture, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

// 3D Components
const AnimatedGlobe = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load reliable textures including a specific cloud map
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.05;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = t * 0.07;
      cloudsRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group scale={1.3}>
        <Sphere ref={earthRef} args={[1.5, 64, 64]}><meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={specularMap}
          roughness={0.7}
          metalness={0.1}
        /></Sphere>
        <Sphere ref={cloudsRef} args={[1.52, 64, 64]}><meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          alphaMap={cloudsMap}
          depthWrite={false}
        /></Sphere>
        <mesh scale={[1.6, 1.6, 1.6]}><sphereGeometry args={[1, 32, 32]} /><meshBasicMaterial
          color="#4f46e5"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        /></mesh>
      </group>
    </Float>
  );
};

const Contact: React.FC = () => {
  return (
    <section id={SectionId.CONTACT} className="py-20 md:py-32 bg-background relative overflow-hidden min-h-screen flex items-center">

      {/* Background stars effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Side: Form */}
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
            <Reveal>
              <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Get in touch</p>
              <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">Contact.</h2>
            </Reveal>

            <form className="space-y-6">
              <Reveal delay={100}>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-300">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="JSM"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="What's your web address?"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-300">Your Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="What you want to say?"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                  Send
                </button>
              </Reveal>
            </form>
          </div>

          {/* Right Side: 3D Scene */}
          <div className="h-[400px] lg:h-[600px] w-full relative">
            <Reveal delay={500} className="h-full w-full">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }} dpr={[1, 1.5]}>
                <Suspense fallback={null}>
                  <Environment preset="night" />
                  <ambientLight intensity={0.2} color="#ccccff" />
                  <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
                  <spotLight position={[-5, 5, -5]} intensity={2} color="#6366f1" angle={0.5} />

                  <AnimatedGlobe />
                  <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                  <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    enablePan={false}
                  />
                </Suspense>
              </Canvas>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;