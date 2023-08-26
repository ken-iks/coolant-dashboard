import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


// Generate 3D model object, ready to be displayed on a canvas
// For some reason you can't generate and display in the same function,
// So this was a workaround.
function Model(props: JSX.IntrinsicElements['mesh']) {
  // TODO: Store glb file on backend so it is not needed on local device
  // Difficulty: ThreeJS cannot currently fetch gltf/glb files from Cloud Storage.
  const gltfPath = process.env.PUBLIC_URL + '/cropped_june_2_data.glb';
  const gltf = useLoader(GLTFLoader, gltfPath);
  return (<primitive
            object={gltf.scene}
            position={[-5, 0.5, 0]}
            children-0-castShadow
          />
  );

};

export default Model;
