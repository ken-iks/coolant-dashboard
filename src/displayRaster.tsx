import React, { useEffect, useRef } from 'react';
import { GeoTIFFImage, ReadRasterResult, fromUrl } from 'geotiff';

type RasterDisplayProps = {
    raster: ReadRasterResult;
    image: number[]
  };

const RasterDisplay: React.FC<RasterDisplayProps> = ({ raster, image }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);


  // Define the class colors
  const classColors = ['#09150a', '#214c23', '#38833c','#a6d9a8', '#dfd0c0', '#DAA06D', '#702963', '#0000FF'];

  useEffect(() => {
    async function loadRaster() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // HARD CODING - NEED TO AUTOMATE
      const imageData = ctx.createImageData(image[2]-image[0], image[3]-image[1]);
        
      if (Array.isArray(raster)) {
        
      for (let i = 0; i < raster[0].length; i++) {
        const classIndex = raster[0][i];
        const color = classColors[classIndex];

        if (color) {
            const matches = color.match(/\w\w/g);
            if (matches) {
          const [r, g, b] = matches.map((v) => parseInt(v, 16));
          imageData.data[i * 4 + 0] = r;
          imageData.data[i * 4 + 1] = g;
          imageData.data[i * 4 + 2] = b;
          imageData.data[i * 4 + 3] = 255; // Alpha channel (fully opaque)
            }
        }
      }
    }
      ctx.putImageData(imageData, 0, 0);
    }
    loadRaster();
  }, []);

  return <canvas ref={canvasRef} />;
};

export default RasterDisplay;