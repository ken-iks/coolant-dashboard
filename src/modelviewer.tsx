import React, {useState, useEffect, startTransition } from 'react';
import Model from './3Dmodelviewer';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import './modelviewer.css';
import { Environment, OrbitControls, useProgress, Html } from '@react-three/drei';
import useGetUser from './getuser';

// Function for loading circle as model is rendering. (TODO: center)
function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress()
  return <Html center className='loader' ></Html>
}

const ModelViewerPage: React.FC = () => {
  const nam = useGetUser();
  const name = nam.charAt(0).toUpperCase() + nam.slice(1);

  // Function for downloading 3D model as glb. Need to automate.
  const handleDownload = () => {
    return (
      <a href="/cropped_june_2_data.glb" download="model.glb" className='
      download-button'>
          <button className='button-object'>Download GLTF</button>
      </a>
          );
    }
  // Generate canvas that our 'Model' is displayed on. Then render model on canvas.
  return (
    <div className='whole'>
    <div className="canvas">
      <h1> 3D Model Viewer </h1>
      <h1> {name}'s Project </h1>
      <Canvas className='model' camera={{ position: [-0.5, 1, 8] }} shadows >
        <ambientLight />
        <directionalLight position={[3.3, 1.0, 4.4]}  />
        <OrbitControls  />
        <React.Suspense fallback={<Loader />}>
          <Model />
        </React.Suspense>
      </Canvas>
      {handleDownload()}
  </div>
  </div>
  )
};

export default ModelViewerPage;