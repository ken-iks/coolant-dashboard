import { Suspense } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import * as React from 'react'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { Mesh } from 'three';

function Rock(props: JSX.IntrinsicElements['mesh']) {
    const materials = useLoader(MTLLoader, '/mesh.mtl', );
    const obj = useLoader(OBJLoader, '/mesh.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);}
        );
    const texture = useLoader(TextureLoader, '/textures/mesh_material0000_map_Kd.png');

    const geometry = React.useMemo(() => {
        let g;
        obj.traverse((c) => {
        if (c.type === "Mesh") {
            const _c = c as Mesh;
            g = _c.geometry;
        }
        });
        return g;
    }, [obj]);

  return (
    <mesh geometry={geometry} scale={0.9}>
      <meshPhysicalMaterial map={texture} />
    </mesh>
  );
};

export default Rock;