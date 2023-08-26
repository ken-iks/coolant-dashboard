import React, { useRef, useEffect, useState } from 'react';
//@ts-ignore
import { GeoTIFFImage, ReadRasterResult, fromUrl } from "geotiff";
import RasterDisplay from './displayRaster';

type FrequencyData = {
    value: number;
    relativeFrequency: number;
  }[];

function freqToPercentage(freq: number) {
    return (freq * 100).toFixed(3);
}

// Function to convert index to meaning (will need to automate but okay for now)

function indToLegend(ind: number) {
    switch(ind){
        case 0:
            return "High Density Forest";
        case 1:
            return "Med Density Forest";
        case 2:
            return "Low Density Forest";
        case 3:
            return "Shrubs";
        case 4:
            return "Open Land";
        case 5:
            return "Monoculture";
        case 6:
            return "Dry Monoculture";
        case 7:
            return "Built Land";
        default:
            return "error";
    }
}
var namer = require('color-namer');

function indToColor(ind: number) {
    switch(ind){
        case 0:
            return namer('#09150a').html[0].name;
        case 1:
            return namer('#214C23').html[0].name;
        case 2:
            return namer('#38833C').html[0].name;
        case 3:
            return namer('#A6D9A8').html[0].name;
        case 4:
            return namer('#DFD0C0').html[0].name;
        case 5:
            return namer('#DAA06D').html[0].name;
        case 6:
            return namer('#702963').html[0].name;
        case 7:
            return namer('#0000FF').html[0].name;
        default:
            return "error";
    }
}

type TiffViewerProps = {
    windows: number[]
}



function polyToRect(window: number[]) {
    var xpoints: number[] = window.filter((_, index) => index % 2 === 0);
    var ypoints: number[] = window.filter((_, index) => index % 2 === 1);
    const left = Math.min(...xpoints);
    const right = Math.max(...xpoints);
    const top = Math.min(...ypoints);
    const bottom = Math.max(...ypoints);
    console.log(left, top, right, bottom)
    return [left, top, right, bottom];
}


  

const TiffViewer: React.FC<TiffViewerProps> = (props) => {
    
    // Function for generating an image of a tiff (essentially a reference)
    async function getTiff(url: string) {
        const tiff = await fromUrl(url);
        const image = await tiff.getImage();
        return image;
    }

    // To access tiff data, we have an image and a window 
    // The window is the polygon section of the full tiff we want to access
    async function getData(img: GeoTIFFImage, window: number[]) {
        // Add padding to the section (minimum bounding box around points)
        const rect = polyToRect(window);
        console.log(window);
        // Get rasters
        const sidedata = await img.readRasters();
        setFullRaster(sidedata);
        const data = await img.readRasters({ window: rect });
        return data;
    }


    const [data, setData] = useState<FrequencyData | null>(null);
    const [rasters, setRasters] = useState<ReadRasterResult | null>(null);
    const [fullImg, setFullImg] = useState<GeoTIFFImage | null>(null);
    const [fullRaster, setFullRaster] = useState<ReadRasterResult | null>(null);
   
    

    // Load our data tile from url, arraybuffer, or blob, so we can work with it:
    
    const canvasRef = useRef(null);

    const tiffPath = process.env.PUBLIC_URL + '/8_class_kmeans_v2.tif'

    useEffect(()=>{
    getTiff(tiffPath).then(image => {
        // This is how you get pixel width/height and band info
        console.log(image.getWidth());
        console.log(image.getHeight());
        console.log(image.getBoundingBox());
        setFullImg(image);
        const data = getData(image, props.windows);
        
        data.then(result => {
            var rasters = result;
            console.log('Cropped raster:');
            console.log(rasters);
            setRasters(rasters);
            if (Array.isArray(rasters)) {
                console.log(rasters[0]);
                rasters.forEach((band, index) => {
                    const frequencies: { [key: number]: number } = {};
                    // Calculate the frequencies for each unique value in the band
                    band.forEach((value) => {
                        frequencies[value] = (frequencies[value] || 0) + 1;
                    });
                
                    // Calculate relative frequencies
                    const totalPixels = band.length;
                    const relativeFrequencies = Object.entries(frequencies).map(([value, count]) => ({
                        value: +value,
                        relativeFrequency: count / totalPixels,
                    }));
                    console.log(`Relative Frequencies for Band ${index}:`, relativeFrequencies);
                    setData(relativeFrequencies);
                    });
            }
        } )       
    }) }, [])

    
    return (
        <div>
            <div className='image-results'>
            {rasters ? (
            <div> <h3>Cropped Image</h3>
            <RasterDisplay raster={rasters} image={polyToRect(props.windows)} polygon={props.windows} />
            </div>
        ): (<div>Generating cropped labelled image...</div>)}
          {(fullRaster && fullImg) ? (
            <div> <h3>Full Image</h3>
            <RasterDisplay raster={fullRaster} image={[0,0,fullImg.getWidth(),fullImg.getHeight()]} polygon={null} />
            </div>
        ): (<div>Generating full labelled image...</div>)}
            </div>
        {data ? (
          <div className="tiff-info">
            <h1> Label info </h1>
            {data.map((item, index) => (
              <div key={index} style={{color: indToColor(item.value) }}>
                Type: {indToLegend(item.value)} ({indToColor(item.value)}), Percentage: {freqToPercentage(item.relativeFrequency)}%
              </div>
            ))}
          </div>
        ) : (
          <div>Generating crop data...</div>
        )}
      </div>
    )

};

export default TiffViewer;

