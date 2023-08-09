import React from 'react';
import Rock from './3Dmodelviewer';
import { Canvas, useFrame } from '@react-three/fiber'
import './modelviewer.css';
import { Environment, OrbitControls } from '@react-three/drei';
import { auth } from './firebaseConfig';

const user = auth.currentUser;
const name = user?.email?.split('@')[0];

const ModelViewerPage: React.FC = () => {
  return (
    <div className="canvas">
      <h1> 3D Model Viewer </h1>
      <h1> {name}'s Project </h1>
      <Canvas>
        <ambientLight />
        <OrbitControls position={[5, 1, 5]} />
        <pointLight position={[10, 10, 10]} />
        <React.Suspense fallback={null}>
          <Rock />
        </React.Suspense>
    </Canvas>
  </div>
  )
};

export default ModelViewerPage;