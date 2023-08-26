import React, { useEffect, useRef } from 'react';
import { ReadRasterResult } from 'geotiff';

type RasterDisplayProps = {
    raster: ReadRasterResult,
    image: number[],
    polygon: number[] | null
  };

// This function generates the cropped raster based on the polygon prop
// It also has the functionality for the user to download the image as a png
// We also draw over the image with the polygon outline

const RasterDisplay: React.FC<RasterDisplayProps> = ({ raster, image, polygon }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // TODO: Also be able to download as a tiff
    const handleDownload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const imageURI = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageURI;
        link.download = 'canvas.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

    // Function to scale the polygon to the pixel values of the new cropped image
    // This is because the polygon values are given relative to the size of the original image
    const scalePolygon = (points: number[]) => {
      var xpoints: number[] = points.filter((_, index) => index % 2 === 0);
      var ypoints: number[] = points.filter((_, index) => index % 2 === 1);
      const left = Math.min(...xpoints);
      const top = Math.min(...ypoints);
      for (let i = 0; i < points.length; i++) {
        if (i % 2 === 0) {
          points[i] = points[i] - left;
        }
        else {
          points[i] = points[i] - top;
        }
      }
      return points;
    }

    // TODO: Right now this will draw different polygons based on the order of the points.
    //       The most optimal approach would produce the same drawing for the same points, any order.
    //       This is a nontrivial problem.
    const drawPolygon = (canvas: HTMLCanvasElement | null, points: number[] | null) => {
      if (!canvas) return;

      if (!points) return;
    
      const ctx = canvas.getContext('2d');
      if (!ctx || points.length < 4) return;  // We need at least 2 points to draw a line

      points = scalePolygon(points);
  
      ctx.strokeStyle = "#FF0000"; // Set the stroke color (red)
      ctx.lineWidth = 30;           // Set the line width
      ctx.beginPath();
  
      // Start from the first point
      ctx.moveTo(points[0], points[1]);
  
      // Loop through the rest of the points
      for (let i = 2; i < points.length; i += 2) {
          ctx.lineTo(points[i], points[i + 1]);
      }
  
      ctx.closePath();  // This will close the path and join the last point with the first
      ctx.stroke();     // Render the polygon
  
    }


  // Define the class colors - TODO: Store on backend in order to be differentiated with different projects
  const classColors = ['#09150a', '#0000FF', '#dfd0c0', '#38833c','#214c23', '#DAA06D', '#a6d9a8', '#702963'];

  useEffect(() => {
    // Functin to load the raster information from the tiff image
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
   
      const imageData = ctx.createImageData(image[2]-image[0], image[3]-image[1]);

      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      console.log(width * height);
        
      if (Array.isArray(raster)) {
      console.log(raster);
      console.log(raster[0].length)
      console.log(raster.length)
      console.log((image[2]-image[0]) * (image[3]-image[1]));

      for (let i = 0; i < raster[0].length; i++) {
        const classIndex = raster[0][i];
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
            imageData.data[imageDataIndex + 3] = 255; 
            }
        }
      }
    }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
      drawPolygon(canvas, polygon);
    }
    loadRaster();
  }, []);

  return ( <div>
  <canvas ref={canvasRef} className='rasterview' />
  <button onClick={handleDownload}>
            Download Image
        </button>
  </div>);
};

export default RasterDisplay;