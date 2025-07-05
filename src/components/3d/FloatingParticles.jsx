import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingParticles = () => {
  const ref = useRef();
  
  // Generate floating cosmic particles
  const [positions, sizes] = useMemo(() => {
    const positions = [];
    const sizes = [];
    const particleCount = 400; // Reduced from 1000
    
    for (let i = 0; i < particleCount; i++) {
      // Create a more realistic distribution around the viewer
      const radius = Math.random() * 200 + 50; // Increased distance
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = (Math.random() - 0.5) * 120; // Slightly increased spread
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      positions.push(x, y, z);
      
      // Varying particle sizes - smaller
      sizes.push(Math.random() * 1.5 + 0.3); // Reduced size
    }
    
    return [new Float32Array(positions), new Float32Array(sizes)];
  }, []);
  
  useFrame((state) => {
    if (ref.current) {
      // Gentler floating motion
      ref.current.rotation.y = state.clock.elapsedTime * 0.002; // Much slower
      
      // Update particle positions for floating effect
      const positions = ref.current.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.0005; // Much subtler
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.8} // Smaller size
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.3} // Reduced opacity
      />
    </Points>
  );
};

export default FloatingParticles;
