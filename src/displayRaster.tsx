import React, { useEffect, useRef } from 'react';
import { GeoTIFFImage, ReadRasterResult, fromUrl } from 'geotiff';

type RasterDisplayProps = {
    raster: ReadRasterResult;
    image: number[]
  };

const RasterDisplay: React.FC<RasterDisplayProps> = ({ raster, image }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);


  // Define the class colors
  const classColors = ['#09150a', '#0000FF', '#dfd0c0', '#38833c','#214c23', '#DAA06D', '#a6d9a8', '#702963'];

  useEffect(() => {
    async function loadRaster() {
      const canvas = canvasRef.current;
      const canvasWidth = image[2] - image[0];
      const canvasHeight = image[3] - image[1];
      if (!canvas) return;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      console.log(image);
   

      // HARD CODING - NEED TO AUTOMATE
      const imageData = ctx.createImageData(image[2]-image[0], image[3]-image[1]);

      const width = ctx.canvas.width; // Assuming you have the width and height of the image
      const height = ctx.canvas.height;
      console.log(width * height);
        
      if (Array.isArray(raster)) {
      console.log(raster);
      console.log(raster[0].length)
      console.log(raster.length)
      console.log((image[2]-image[0]) * (image[3]-image[1]));

      for (let i = 0; i < raster[0].length; i++) {
        const classIndex = raster[0][i];
        //console.log(classIndex);
        const color = classColors[classIndex];

        if (color) {
            const matches = color.match(/[a-fA-F0-9]{2}/g);
            if (matches) {
          const [r, g, b] = matches.map((v) => parseInt(v, 16));
            // Convert the 1D index to 2D coordinates
            const y = Math.floor(i / width);
            const x = i - y * width;

            // Convert the 2D coordinates to the ImageData index
            const imageDataIndex = (y * width + x) * 4;
            imageData.data[imageDataIndex + 0] = r;
            imageData.data[imageDataIndex + 1] = g;
            imageData.data[imageDataIndex + 2] = b;
            imageData.data[imageDataIndex + 3] = 255; // Alpha channel (fully opaque)
            }
        }
      }
    }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    }
    loadRaster();
  }, []);

  return <canvas ref={canvasRef} className='rasterview' />;
};

export default RasterDisplay;