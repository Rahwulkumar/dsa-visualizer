import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const SpaceBackground = () => {
  const ref = useRef();
  
  // Generate nebula particles
  const [positions, colors] = useMemo(() => {
    const positions = [];
    const colors = [];
    const particleCount = 800; // Reduced from 2000
    
    for (let i = 0; i < particleCount; i++) {
      // Create more realistic space distribution
      const radius = Math.random() * 250 + 80; // Pushed further back
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions.push(x, y, z);
      
      // Space-themed colors: deep blues, purples, and teals
      const colorChoice = Math.random();
      let r, g, b;
      
      if (colorChoice < 0.4) {
        // Deep blue - more muted
        r = 0.0;
        g = 0.2 + Math.random() * 0.3;
        b = 0.4 + Math.random() * 0.3;
      } else if (colorChoice < 0.7) {
        // Purple/violet - more muted
        r = 0.2 + Math.random() * 0.3;
        g = 0.0;
        b = 0.3 + Math.random() * 0.3;
      } else {
        // Teal/cyan - more muted
        r = 0.0;
        g = 0.3 + Math.random() * 0.3;
        b = 0.4 + Math.random() * 0.3;
      }
      
      colors.push(r, g, b);
    }
    
    return [new Float32Array(positions), new Float32Array(colors)];
  }, []);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.01; // Slower rotation
      ref.current.rotation.y = state.clock.elapsedTime * 0.005; // Slower rotation
    }
  });
  
  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.3} // Smaller particles
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        opacity={0.4} // Reduced opacity
      />
    </Points>
  );
};

export default SpaceBackground;
