import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Rock(props: JSX.IntrinsicElements['mesh']) {

    console.log("Loading gtlf");

    const gltf = useLoader(GLTFLoader, '/cropped_june_2_data.glb');

    console.log(gltf);
  
  return (<primitive
            object={gltf.scene}
            position={[-5, 0.5, 0]}
            children-0-castShadow
          />
  );
};

export default Rock;
