import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

const AsteroidField = () => {
  const groupRef = useRef();
  
  // Generate asteroid data
  const asteroids = useMemo(() => {
    const asteroidData = [];
    const count = 25; // Reduced from 50
    
    for (let i = 0; i < count; i++) {
      const asteroid = {
        id: i,
        position: [
          (Math.random() - 0.5) * 600, // Pushed further away
          (Math.random() - 0.5) * 300,
          (Math.random() - 0.5) * 600
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.01, // Slower rotation
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ],
        scale: 0.3 + Math.random() * 1.2, // Smaller asteroids
        type: Math.random() > 0.5 ? 'sphere' : 'box'
      };
      asteroidData.push(asteroid);
    }
    
    return asteroidData;
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const asteroid = asteroids[index];
        child.rotation.x += asteroid.rotationSpeed[0];
        child.rotation.y += asteroid.rotationSpeed[1];
        child.rotation.z += asteroid.rotationSpeed[2];
        
        // Subtle drift movement
        child.position.x += Math.sin(state.clock.elapsedTime * 0.0005 + index) * 0.005; // Much slower
        child.position.y += Math.cos(state.clock.elapsedTime * 0.0005 + index) * 0.005;
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {asteroids.map((asteroid) => {
        const AsteroidComponent = asteroid.type === 'sphere' ? Sphere : Box;
        
        return (
          <AsteroidComponent
            key={asteroid.id}
            position={asteroid.position}
            rotation={asteroid.rotation}
            scale={asteroid.scale}
            args={asteroid.type === 'sphere' ? [1, 16, 16] : [1, 1, 1]}
          >
            <meshStandardMaterial
              color={new THREE.Color().setHSL(
                0.6 + Math.random() * 0.1, // Bluish hue
                0.2 + Math.random() * 0.1, // Even lower saturation
                0.15 + Math.random() * 0.2  // Darker
              )}
              roughness={0.9}
              metalness={0.1}
              emissive={new THREE.Color().setHSL(
                0.6 + Math.random() * 0.1,
                0.3,
                0.02 // Much dimmer emission
              )}
              transparent
              opacity={0.6} // Added transparency
            />
          </AsteroidComponent>
        );
      })}
    </group>
  );
};

export default AsteroidField;
