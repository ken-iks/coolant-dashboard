import React, {useState, useEffect, startTransition } from 'react';
import Rock from './3Dmodelviewer';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import './modelviewer.css';
import { Environment, OrbitControls, useProgress, Html } from '@react-three/drei';
import useGetUser from './getuser';


function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress()
  return <Html center className='loader' ></Html>
}

const ModelViewerPage: React.FC = () => {
  const nam = useGetUser();
  const name = nam.charAt(0).toUpperCase() + nam.slice(1);

  const handleDownload = () => {
    return (
      <a href="/cropped_june_2_data.glb" download="model.glb" className='
      download-button'>
          <button className='button-object'>Download GLTF</button>
      </a>
          );
    }
 

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
          <Rock />
        </React.Suspense>
      </Canvas>
      {handleDownload()}
  </div>
  </div>
  )
};

export default ModelViewerPage;

/*
      <Canvas className='model'>
        <OrbitControls position={[5, 1, 5]} />
        <pointLight position={[10, 10, 10]} />
        <React.Suspense fallback={<Loader />}>
          <Rock />
        </React.Suspense>
    </Canvas>
*/

/*
If you want to add LumaLabs:
<iframe src="https://lumalabs.ai/embed/466679ca-f710-48a5-bf70-02110de2506c?mode=slf&background=%23ffffff&color=%23000000&showTitle=false&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false" width="300" height="200" frameBorder="0" title="luma embed"></iframe>
*/