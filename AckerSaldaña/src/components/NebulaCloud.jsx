import { useRef, useContext, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ScrollProgressContext } from './ParticleBackground';

// Simplex noise GLSL (same proven implementation as the reference)
const simplexNoiseGLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                           dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const nebulaVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const nebulaFragmentShader = /* glsl */ `
precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform float uScrollProgress;
uniform float uOpacity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uSeed;

${simplexNoiseGLSL}

void main() {
  vec2 u = vUv - 0.5;
  float d = length(u);

  // Per-nebula time offset so they don't all animate in sync
  float t = uTime + uSeed * 100.0;

  // Warp the UV coordinates for organic movement
  // Each nebula warps differently based on its seed
  vec2 warp = vec2(
    snoise(u * 2.0 + t * 0.05) * 0.08,
    snoise(u * 2.0 + t * 0.04 + 50.0) * 0.08
  );
  vec2 warpedUv = u + warp;

  // Four-octave FBM with varied speeds and directions per octave
  float n1 = snoise(warpedUv * 3.0 + vec2(t * 0.06, t * -0.04)) * 0.5 + 0.5;
  float n2 = snoise(warpedUv * 6.0 + vec2(t * -0.08, t * 0.05)) * 0.5 + 0.5;
  float n3 = snoise(warpedUv * 12.0 + vec2(t * 0.04, t * 0.07)) * 0.5 + 0.5;
  float n4 = snoise(warpedUv * 24.0 + vec2(t * -0.1, t * -0.06)) * 0.5 + 0.5;

  // Weighted combination with high-freq detail for wispy edges
  float neb = n1 * 0.4 + n2 * 0.3 + n3 * 0.2 + n4 * 0.1;

  // Radial fade — generous center, soft edges
  neb *= smoothstep(0.7, 0.0, d);

  // Contrast boost with time-varying intensity
  float contrast = 1.5 + sin(t * 0.3) * 0.15;
  neb = pow(neb, contrast);

  // Opacity breathing — gentle pulse
  float breath = 1.0 + sin(t * 0.5 + uSeed * 6.28) * 0.15
                     + sin(t * 0.8 + uSeed * 3.14) * 0.08;

  // Scroll-reactive color mixing with time-varying blend
  float timeShift = sin(t * 0.2) * 0.15;
  float scrollShift = uScrollProgress * 0.3;
  vec3 color = mix(uColor1, uColor2, clamp(n2 + scrollShift + timeShift, 0.0, 1.0));

  // Add bright core spots where density is high
  float coreGlow = smoothstep(0.6, 0.9, neb) * 0.3;
  color += coreGlow;

  // Final alpha with breathing
  float alpha = neb * uOpacity * breath;

  if (alpha < 0.002) discard;

  gl_FragColor = vec4(color, alpha);
}
`;

function NebulaCloud({
  position = [0, 0, -3],
  scale = 3,
  opacity = 0.18,
  color1 = '#4411aa',
  color2 = '#1144ff',
  seed = 0,
  driftSpeed = 0.03,
  rotationSpeed = 0.02,
}) {
  const materialRef = useRef();
  const meshRef = useRef();
  const scrollData = useContext(ScrollProgressContext);
  const initialPos = useRef(new THREE.Vector3(...position));

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uOpacity: { value: opacity },
    uColor1: { value: new THREE.Color(color1) },
    uColor2: { value: new THREE.Color(color2) },
    uSeed: { value: seed },
  }), []);

  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    const u = materialRef.current.uniforms;
    u.uTime.value += delta;
    u.uScrollProgress.value = scrollData?.current?.progress || 0;

    const t = u.uTime.value;
    const mesh = meshRef.current;

    // Billboard — face camera
    mesh.quaternion.copy(state.camera.quaternion);

    // Slow z-axis rotation (post-billboard) for organic swirl
    mesh.rotateZ(delta * rotationSpeed);

    // Gentle positional drift — figure-8 / lissajous pattern
    const base = initialPos.current;
    mesh.position.x = base.x + Math.sin(t * driftSpeed + seed * 10) * 0.15;
    mesh.position.y = base.y + Math.cos(t * driftSpeed * 0.7 + seed * 7) * 0.1;
    mesh.position.z = base.z + Math.sin(t * driftSpeed * 0.5 + seed * 5) * 0.05;

    // Gentle scale breathing
    const breathScale = scale * (1.0 + Math.sin(t * 0.4 + seed * 4) * 0.05);
    mesh.scale.set(breathScale, breathScale, 1);

    state.invalidate();
  });

  return (
    <mesh ref={meshRef} position={position} scale={[scale, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Each nebula has unique seed, drift speed, and rotation speed for variation
const NEBULA_CONFIGS = [
  { position: [-1.2, 0.4, -1.5], scale: 3.5, opacity: 0.18, color1: '#4411aa', color2: '#1144ff', seed: 0.0, driftSpeed: 0.035, rotationSpeed: 0.015 },
  { position: [1.0, -0.3, -2.0], scale: 4.0, opacity: 0.16, color1: '#aa2244', color2: '#ff6633', seed: 1.7, driftSpeed: 0.025, rotationSpeed: -0.02 },
  { position: [0.0, 0.5, -2.5], scale: 3.0, opacity: 0.14, color1: '#115577', color2: '#22aacc', seed: 3.2, driftSpeed: 0.04, rotationSpeed: 0.01 },
  { position: [-0.5, -0.2, -1.0], scale: 2.5, opacity: 0.15, color1: '#552288', color2: '#aa44cc', seed: 5.1, driftSpeed: 0.03, rotationSpeed: -0.025 },
];

function NebulaSystem({ count = 4 }) {
  const activeNebulas = NEBULA_CONFIGS.slice(0, count);

  return (
    <>
      {activeNebulas.map((config, index) => (
        <NebulaCloud
          key={index}
          position={config.position}
          scale={config.scale}
          opacity={config.opacity}
          color1={config.color1}
          color2={config.color2}
          seed={config.seed}
          driftSpeed={config.driftSpeed}
          rotationSpeed={config.rotationSpeed}
        />
      ))}
    </>
  );
}

export { NebulaCloud, NebulaSystem };
