import React, { useRef, useEffect, useState } from 'react';
import { GeoTIFFImage, fromUrl } from "geotiff";


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

type TiffViewerProps = {
    windows: number[]
}

const TiffViewer: React.FC<TiffViewerProps> = (props) => {
    
    async function getTiff(url: string) {
        const tiff = await fromUrl(url);
        const image = await tiff.getImage();
        return image;
    }

    async function getData(img: GeoTIFFImage, window: number[]) {
        // Add padding 
        const left = Math.min(window[0], window[2], window[4], window[6]);
        const right = Math.max(window[0], window[2], window[4], window[6]);
        const top = Math.min(window[1], window[3], window[5], window[7]);
        const bottom = Math.max(window[1], window[3], window[5], window[7]);
        // Get rasters
        const data = await img.readRasters({ window: [left, top, right, bottom] });
        return data;
    }
    const [data, setData] = useState<FrequencyData | null>(null);

    // Load our data tile from url, arraybuffer, or blob, so we can work with it:
    
    const canvasRef = useRef(null);
    
    useEffect(()=>{
    getTiff('./8_class_kmeans.tif').then(image => {

        const data = getData(image, props.windows);

        data.then(result => {
            var rasters = result;
            if (Array.isArray(rasters)) {
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

            }} )

            
    }) }, [])

    
    return (
        <div>
        {data ? (
          <div>
            {data.map((item, index) => (
              <div key={index}>
                Type: {indToLegend(item.value)}, Relative Frequency: {freqToPercentage(item.relativeFrequency)}%
              </div>
            ))}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    )

};

export default TiffViewer;

