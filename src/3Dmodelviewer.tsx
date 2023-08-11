import { Suspense, useState, useEffect } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import * as React from 'react'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { Mesh } from 'three';
import * as THREE from 'three';

function Rock(props: JSX.IntrinsicElements['mesh']) {

    const textures = useMultipleTextures();
    const materials = useLoader(MTLLoader, '/mesh.mtl', );
    
    const obj = useLoader(OBJLoader, '/mesh.obj', (loader) => {
        materials.preload();
        loader.setMaterials(materials);}
        );
  
    const texture = useLoader(TextureLoader, '/textures/mesh_material0006_map_Kd.png');
    
    // Helper function to pad numbers with leading zeroes. (3 --> '003')
    function pad (num: number, size: number) {
      const ret = (('000000000' + num).slice(-size))
      console.log(ret);
      return ret;
    }

  

function useMultipleTextures() {
    const [pictextures, setPicTextures] = useState<THREE.Texture[]>([]);;

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        const promises = [];

        for (let i = 0; i <= 63; i++) {
            const texturePath = `/textures/mesh_material${String(i).padStart(4, '0')}_map_Kd.png`;
            promises.push(
                new Promise((resolve, reject) => {
                    loader.load(
                        texturePath,
                        texture => resolve(texture),
                        undefined,
                        error => reject(error)
                    );
                })
            );
        }

        Promise.all(promises).then(loadedTextures => {
            setPicTextures(loadedTextures as THREE.Texture[]);
        });

    }, []);
    return pictextures;
}


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
    <mesh geometry={geometry} scale={0.9}  >
      <meshPhysicalMaterial map={texture}/>
    </mesh>
  );
};

export default Rock;