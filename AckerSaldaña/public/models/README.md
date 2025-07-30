# Cómo usar modelos 3D en tu portafolio

## Formatos soportados:
- **.obj** - Formato simple, sin texturas embebidas
- **.gltf/.glb** - Formato recomendado, soporta texturas y animaciones
- **.fbx** - Requiere loader adicional

## Dónde conseguir modelos 3D gratuitos:

### Planetas y objetos espaciales:
1. **NASA 3D Resources** - https://nasa3d.arc.nasa.gov/models
   - Modelos reales de planetas, asteroides, naves espaciales
   - Gratis y de dominio público

2. **Sketchfab** - https://sketchfab.com
   - Busca "planet free" o "space free"
   - Muchos modelos CC0 (uso libre)

3. **TurboSquid** - https://www.turbosquid.com
   - Filtrar por modelos gratuitos

4. **Poly Haven** - https://polyhaven.com
   - HDRIs y algunos modelos 3D

## Cómo usar:

1. Descarga el modelo (preferiblemente .glb o .gltf)
2. Colócalo en esta carpeta `/public/models/`
3. En ParticleBackground.jsx, descomenta el código de ejemplo
4. Ajusta los parámetros:
   - `modelPath`: ruta al archivo
   - `position`: posición inicial [x, y, z]
   - `scale`: tamaño del modelo
   - `orbitRadius`: radio de la órbita
   - `orbitSpeed`: velocidad de rotación

## Ejemplo:
```jsx
<Suspense fallback={null}>
  <GLTFPlanet 
    modelPath="/models/earth.glb"
    position={[0, 0, -2]}
    scale={0.1}
    orbitRadius={0.6}
    orbitSpeed={0.2}
  />
</Suspense>
```

## Tips:
- Los archivos .glb son más eficientes que .gltf
- Optimiza los modelos antes de usarlos (menos de 1MB idealmente)
- Usa herramientas como Blender para reducir polígonos si es necesario
- El componente Suspense evita que la app se congele mientras carga