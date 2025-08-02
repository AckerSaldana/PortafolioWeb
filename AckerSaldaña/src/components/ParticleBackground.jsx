import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Trail, useGLTF, Sparkles } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

function Stars() {
  const meshRef = useRef();
  const sphere = random.inSphere(new Float32Array(3000), { radius: 1.5 });
  
  // Store press state inside component
  const isPressed = useRef(false);
  
  // Animation state
  const animationState = useRef({
    rotationX: 0,
    rotationY: 0,
    rotationZ: Math.PI / 4,
    currentSpeed: 1,
    targetSpeed: 1
  });

  useEffect(() => {
    const handleMouseDown = (e) => {
      const isButton = e.target.tagName === 'BUTTON';
      const isLink = e.target.tagName === 'A';
      const isInteractive = e.target.closest('button') || e.target.closest('a');
      
      if (!isButton && !isLink && !isInteractive) {
        isPressed.current = true;
        animationState.current.targetSpeed = 8;
      }
    };

    const handleMouseUp = () => {
      isPressed.current = false;
      animationState.current.targetSpeed = 1;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Smooth speed interpolation
    const speedDiff = animationState.current.targetSpeed - animationState.current.currentSpeed;
    animationState.current.currentSpeed += speedDiff * 0.08;
    
    // Update rotation values based on current speed
    const rotationDeltaX = delta * 0.05 * animationState.current.currentSpeed;
    const rotationDeltaY = delta * 0.033 * animationState.current.currentSpeed;
    
    animationState.current.rotationX += rotationDeltaX;
    animationState.current.rotationY += rotationDeltaY;
    
    // Apply rotations
    meshRef.current.rotation.x = animationState.current.rotationX;
    meshRef.current.rotation.y = animationState.current.rotationY;
    meshRef.current.rotation.z = animationState.current.rotationZ;
  });

  return (
    <Points ref={meshRef} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4a9eff"
        size={0.002}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function Planet({ position, radius, color, orbitRadius, orbitSpeed, type = 'rocky' }) {
  const meshRef = useRef();
  const orbitAngle = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Orbit animation
    orbitAngle.current += delta * orbitSpeed;
    
    meshRef.current.position.x = position[0] + Math.cos(orbitAngle.current) * orbitRadius;
    meshRef.current.position.z = position[2] + Math.sin(orbitAngle.current) * orbitRadius;
    meshRef.current.position.y = position[1] + Math.sin(orbitAngle.current * 0.5) * 0.2;
    
    // Rotation
    meshRef.current.rotation.y += delta * 0.5;
  });

  // Different planet materials based on type
  const getMaterial = () => {
    switch(type) {
      case 'gas':
        return (
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.1}
            roughness={0.2}
            metalness={0.1}
          />
        );
      case 'ice':
        return (
          <meshPhysicalMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.05}
            roughness={0.1}
            metalness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transparent={true}
            opacity={0.9}
          />
        );
      default: // rocky
        return (
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.2}
            roughness={0.8}
            metalness={0.2}
          />
        );
    }
  };

  return (
    <group ref={meshRef} position={position}>
      <Sphere args={[radius, 64, 32]}>
        {getMaterial()}
      </Sphere>
      
      {/* Atmosphere glow for certain planets */}
      {(type === 'gas' || type === 'ice') && (
        <Sphere args={[radius * 1.2, 32, 16]}>
          <meshBasicMaterial
            color={color}
            transparent={true}
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  );
}

// More realistic Earth-like planet
function RealisticPlanet({ position, orbitRadius, orbitSpeed }) {
  const groupRef = useRef();
  const planetRef = useRef();
  const cloudsRef = useRef();
  const orbitAngle = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Orbit animation
    orbitAngle.current += delta * orbitSpeed;
    
    groupRef.current.position.x = position[0] + Math.cos(orbitAngle.current) * orbitRadius;
    groupRef.current.position.z = position[2] + Math.sin(orbitAngle.current) * orbitRadius;
    groupRef.current.position.y = position[1] + Math.sin(orbitAngle.current * 0.5) * 0.1;
    
    // Rotation
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.1;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Planet surface */}
      <Sphere ref={planetRef} args={[0.12, 64, 32]}>
        <meshPhongMaterial
          color="#2e5090"
          emissive="#112244"
          emissiveIntensity={0.1}
          specular="#ffffff"
          shininess={10}
        />
      </Sphere>
      
      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[0.125, 32, 16]}>
        <meshPhongMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.4}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Atmosphere */}
      <Sphere args={[0.14, 32, 16]}>
        <meshBasicMaterial
          color="#5588ff"
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// Component to load OBJ models with MTL
function OBJPlanet({ objPath, mtlPath, position, scale = 1, orbitRadius, orbitSpeed }) {
  const materials = useLoader(MTLLoader, mtlPath);
  const obj = useLoader(OBJLoader, objPath, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });
  
  const groupRef = useRef();
  const orbitAngle = useRef(Math.random() * Math.PI * 2);

  // Apply better material properties on mount
  useEffect(() => {
    if (obj) {
      obj.traverse((child) => {
        if (child.isMesh) {
          // Make sure materials are visible
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
      });
    }
  }, [obj]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Orbit animation
    orbitAngle.current += delta * orbitSpeed;
    
    groupRef.current.position.x = position[0] + Math.cos(orbitAngle.current) * orbitRadius;
    groupRef.current.position.z = position[2] + Math.sin(orbitAngle.current) * orbitRadius;
    groupRef.current.position.y = position[1] + Math.sin(orbitAngle.current * 0.5) * 0.1;
    
    // Rotation
    groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={obj} />
    </group>
  );
}

// Component to load GLTF/GLB models (more common for 3D models)
function GLTFPlanet({ modelPath, position, scale = 1, orbitRadius, orbitSpeed, initialAngle = 0 }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef();
  const planetRef = useRef();
  const orbitAngle = useRef(initialAngle);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Orbit animation - smooth elliptical orbit
    orbitAngle.current += delta * orbitSpeed;
    
    // Create elliptical orbits with varying eccentricity
    const ellipseX = orbitRadius;
    const ellipseZ = orbitRadius * 0.8; // Slightly elliptical
    
    groupRef.current.position.x = position[0] + Math.cos(orbitAngle.current) * ellipseX;
    groupRef.current.position.z = position[2] + Math.sin(orbitAngle.current) * ellipseZ;
    groupRef.current.position.y = position[1] + Math.sin(orbitAngle.current * 2) * 0.05; // Gentle vertical oscillation
    
    // Planet rotation on its own axis
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group ref={planetRef} scale={scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
}


function Comet({ delay = 3000 }) {
  const groupRef = useRef();
  const cometRef = useRef();
  const glowRef = useRef();
  const outerGlowRef = useRef();
  const [isActive, setIsActive] = useState(false);
  const [showTrail, setShowTrail] = useState(false);
  
  // Generate random starting position - more centered to screen
  const generateStartPosition = () => {
    const side = Math.random();
    let x, y;
    
    if (side < 0.25) { // From left
      x = -8;
      y = (Math.random() - 0.5) * 4; // More centered vertically
    } else if (side < 0.5) { // From right
      x = 8;
      y = (Math.random() - 0.5) * 4;
    } else if (side < 0.75) { // From top
      x = (Math.random() - 0.5) * 6; // More centered horizontally
      y = 5;
    } else { // From bottom
      x = (Math.random() - 0.5) * 6;
      y = -5;
    }
    
    // Start far from camera for better entry effect
    return { x, y, z: -15 };
  };
  
  // Store comet data
  const cometData = useRef({
    startX: 0,
    startY: 0,
    startZ: 0,
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0,
    currentX: 0,
    currentY: 0,
    currentZ: 0,
    time: 0
  });
  
  const initializeComet = () => {
    const startPos = generateStartPosition();
    // More controlled velocities for centered movement
    const targetX = (Math.random() - 0.5) * 3; // Wider spread
    const targetY = (Math.random() - 0.5) * 2;
    
    // Add some curve to the trajectory
    const curveStrength = (Math.random() - 0.5) * 0.5;
    
    cometData.current = {
      startX: startPos.x,
      startY: startPos.y,
      startZ: startPos.z,
      velocityX: (targetX - startPos.x) * 0.3, // Velocity for dynamic trail
      velocityY: (targetY - startPos.y) * 0.2,
      velocityZ: Math.random() * 4 + 3, // Much faster forward movement for longer distance
      curveX: curveStrength, // Add curve to trajectory
      currentX: startPos.x,
      currentY: startPos.y,
      currentZ: startPos.z,
      time: 0
    };
    
    // Set initial position if group exists
    if (groupRef.current) {
      groupRef.current.position.set(
        cometData.current.currentX,
        cometData.current.currentY,
        cometData.current.currentZ
      );
    }
  };
  
  // Initialize comet data immediately
  useEffect(() => {
    initializeComet();
    
    // Start after delay
    const timer = setTimeout(() => {
      setIsActive(true);
      // Enable trail after a small delay to ensure proper positioning
      setTimeout(() => {
        setShowTrail(true);
      }, 100);
    }, delay + Math.random() * 2000);
    
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((state, delta) => {
    if (!groupRef.current || !isActive) return;
    
    // Update time
    cometData.current.time += delta;
    const time = cometData.current.time;
    
    // Update position with curve
    cometData.current.currentX += cometData.current.velocityX * delta;
    cometData.current.currentY += cometData.current.velocityY * delta;
    cometData.current.currentZ += cometData.current.velocityZ * delta;
    
    // Add subtle sine wave motion for more realistic trajectory
    const wobbleX = Math.sin(time * 2) * cometData.current.curveX * delta;
    const wobbleY = Math.cos(time * 1.5) * 0.1 * delta;
    
    cometData.current.currentX += wobbleX;
    cometData.current.currentY += wobbleY;
    
    // Apply position
    groupRef.current.position.set(
      cometData.current.currentX,
      cometData.current.currentY,
      cometData.current.currentZ
    );
    
    // Animate comet core with pulsation
    if (cometRef.current) {
      cometRef.current.rotation.x += delta * 4;
      cometRef.current.rotation.y += delta * 3;
      // Pulsating size effect
      const pulseFactor = 1 + Math.sin(time * 8) * 0.15;
      cometRef.current.scale.setScalar(pulseFactor);
      
      // Animate emissive intensity
      if (cometRef.current.material) {
        cometRef.current.material.emissiveIntensity = 2 + Math.sin(time * 10) * 0.5;
      }
    }
    
    // Animate glow layers
    if (glowRef.current) {
      glowRef.current.rotation.z -= delta * 2;
      const glowPulse = 1 + Math.sin(time * 6 + 0.5) * 0.2;
      glowRef.current.scale.setScalar(glowPulse);
      
      // Keep white color, no color animation needed
    }
    
    if (outerGlowRef.current) {
      outerGlowRef.current.rotation.z += delta * 1.5;
      const outerPulse = 1 + Math.sin(time * 4 + 1) * 0.1;
      outerGlowRef.current.scale.setScalar(outerPulse);
    }
    
    // Reset when out of view
    if (cometData.current.currentZ > 5 || Math.abs(cometData.current.currentX) > 15) {
      setIsActive(false);
      setShowTrail(false);
      
      // Reset after timer
      setTimeout(() => {
        initializeComet();
        setIsActive(true);
        // Enable trail after positioning
        setTimeout(() => {
          setShowTrail(true);
        }, 100);
      }, (Math.random() * 8 + 3) * 1000);
    }
  });

  // Don't render until active
  if (!isActive) return null;

  // White gradient for trail
  const trailGradient = [
    new THREE.Color('#ffffff'), // Bright white
    new THREE.Color('#f0f0f0'), // Slightly dimmer white
    new THREE.Color('#e0e0e0'), // Light gray
    new THREE.Color('#d0d0d0'), // Lighter gray
    new THREE.Color('#c0c0c0')  // Light gray fade
  ];

  return (
    <group ref={groupRef}>
      {showTrail ? (
        // Enhanced trail with gradient colors
        <Trail
          width={8} // Wider trail for fire effect
          length={4} // Longer trail
          color={trailGradient} // Gradient colors
          attenuation={(t) => {
            // More organic attenuation with flickering
            const flicker = 1 + Math.sin(t * Math.PI * 4) * 0.1;
            return (t * 0.8 + 0.2) * flicker;
          }}
          target={groupRef}
          interval={1}
        >
          {/* Multi-layered comet core */}
          <group>
            {/* Inner hot core */}
            <Sphere ref={cometRef} args={[0.12, 32, 32]}>
              <meshStandardMaterial 
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={2}
                toneMapped={false}
              />
            </Sphere>
            
            {/* Middle glow layer */}
            <Sphere ref={glowRef} args={[0.18, 24, 24]}>
              <meshStandardMaterial
                color="#ffffff"
                emissive="#f0f0f0"
                emissiveIntensity={1.2}
                transparent={true}
                opacity={0.5}
                roughness={0}
                metalness={0}
              />
            </Sphere>
            
            {/* Outer glow */}
            <Sphere ref={outerGlowRef} args={[0.25, 16, 16]}>
              <meshBasicMaterial
                color="#e0e0e0"
                transparent={true}
                opacity={0.2}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </Sphere>
          </group>
        </Trail>
      ) : (
        // Render without trail initially
        <group>
          {/* Inner hot core */}
          <Sphere ref={cometRef} args={[0.12, 32, 32]}>
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </Sphere>
          
          {/* Middle glow layer */}
          <Sphere ref={glowRef} args={[0.18, 24, 24]}>
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f0f0f0"
              emissiveIntensity={1.2}
              transparent={true}
              opacity={0.5}
              roughness={0}
              metalness={0}
            />
          </Sphere>
          
          {/* Outer glow */}
          <Sphere ref={outerGlowRef} args={[0.25, 16, 16]}>
            <meshBasicMaterial
              color="#e0e0e0"
              transparent={true}
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </Sphere>
        </group>
      )}
    </group>
  );
}

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Mejor iluminación para los planetas */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        
        <Stars />
        
        {/* Cometas con delays diferentes y más dinámicos */}
        <Comet delay={1000} />
        <Comet delay={4000} />
        <Comet delay={7000} />
        <Comet delay={10000} />
        
        {/* Planetas más separados */}
        <Suspense fallback={null}>
          <GLTFPlanet 
            modelPath="/models/Planet_21.glb"
            position={[1.5, 0.3, -2]}
            scale={0.049}
            orbitRadius={0.5}
            orbitSpeed={0.4}
            initialAngle={0}
          />
        </Suspense>
        
        <Suspense fallback={null}>
          <GLTFPlanet 
            modelPath="/models/Planet_15.glb"
            position={[-1.8, -0.2, -1.5]}
            scale={0.010}
            orbitRadius={0.4}
            orbitSpeed={0.3}
            initialAngle={Math.PI / 3}
          />
        </Suspense>
        
        <Suspense fallback={null}>
          <GLTFPlanet 
            modelPath="/models/Planet_4.glb"
            position={[0.5, -0.5, -2.5]}
            scale={0.02}
            orbitRadius={0.6}
            orbitSpeed={0.15}
            initialAngle={Math.PI * 2/3}
          />
        </Suspense>
        
        <Suspense fallback={null}>
          <GLTFPlanet 
            modelPath="/models/Planet_42.glb"
            position={[-0.8, 0.6, -3]}
            scale={0.013}
            orbitRadius={0.7}
            orbitSpeed={0.1}
            initialAngle={Math.PI * 4/3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ParticleBackground;