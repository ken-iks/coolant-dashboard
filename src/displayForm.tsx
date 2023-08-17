import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './siteeval.css';
import TiffViewer from "./tiffviewer";
import './displayForm.css';
import './displayRaster.css';

let pointsConverted: number[];
  

// HARD CODING VALUES FROM DESA PLOT FOR DEADLINE. WILL NEED TO AUTOMATE
const bbox = [111.82264589331169, 0.14337111934547572, 112.029438071716, 0.3233935022830277] 
const pixelWidth = 2302 
const pixelHeight = 2004 
const bboxWidth = 0.20679217840431363 
const bboxHeight = 0.180022382937552

const addNewMap = (points: number[]) => {
    console.log(points)

    var xpoints: number[] = points.filter((_, index) => index % 2 === 0);
    var ypoints: number[] = points.filter((_, index) => index % 2 === 1);

    const pointsString = Array.from({ length: points.length / 2 }, (_, i) => {
        return `${points[2 * i]},${points[2 * i + 1]}`;
      }).join(' ');

    console.log(pointsString);
    console.log(points.join(' '));

    // Validation 
    if (points.some((num) => num < 0) || 
        points.some((num) => isNaN(num)) ||
        xpoints.some((num) => num > pixelWidth) || 
        ypoints.some((num) => num > pixelHeight)
        ) {
            return (
                <h1> Invalid points. Try again </h1>
            )
        }
    else { 
    return (
        <div>
        <h1> Here is the breakdown for your section of the Desa Plot </h1>
        <TiffViewer windows={points} />
        </div>
    )}
} 

const DisplayForm: React.FC = () => {

    const [points, setPoints] = React.useState<number[]>([]);

    let g1, g2, g3, g4;

    const [formState, setFormState] = useState<Array<string>>([
     "",
    "",
    "",
    "",
    ]);



    const converter = (long: any, lat: any) => {
        const widthPct = (long - bbox[ 0 ] ) / bboxWidth;
        const heightPct = (lat - bbox[ 1 ] ) / bboxHeight;
        const xPx = Math.floor( pixelWidth * widthPct );
        const yPx = Math.floor( pixelHeight * ( 1 - heightPct ) );
        return [xPx, yPx]
    }

    const AnsToLoc = (ans: string) => {
        const arr = ans.split(" ");
        return ( converter(parseFloat(arr[0]), parseFloat(arr[1])) );
        }

    const handleInputChange = (index: number, event: any) => {
        const formPoints = [...formState];
        formPoints[index] = event.target.value;
        setFormState(formPoints);
        };
    
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const convertedPoints = formState.map(point => AnsToLoc(point));
        pointsConverted = convertedPoints.flat();
        setPoints(pointsConverted);
        setFormSubmitted(true);
        };
    
    const handleReset = () => {
        // Reset the form state
        setFormState([
            '',
            '',
            '',
            '',
        ]);
        setFormSubmitted(false); // Mark the form as not submitted
        };

    const handleAddPoint = () => {
        setFormState([...formState, '']);
    }


    return (
        <div>  
        {formSubmitted && (addNewMap(points))}
        {!formSubmitted && <div>
        <div className="plot">
        <h1> Full sentinal image of the Desa Plot </h1>
        <img src="./original_desa_satellite.png" alt="Desa Plot" className='fullimg'></img>
        <p> To get specific details about a section of the plot, input the longitude and latitude of the corners of the
            area you would like to learn more about. (Seperate long and lat by space, eg 'LO LA'). Use the add point button
            to increase the number of vertices in your polygon. </p> 
        </div>
        <form onSubmit={handleSubmit} className="inputs">
            {formState.map((point, index) => (
                        <div key={index}>
                            <label>
                                {`Point ${index + 1}:`}
                                <input
                                    type="text"
                                    value={point}
                                    onChange={(event) => handleInputChange(index, event)}
                                />
                            </label>
                            <br />
                        </div>
                    ))}
                    <div className="display-button-submit">
            <button className='display-button' type="submit">Submit</button>
            </div>
        </form> 
        <button className='display-button' onClick={handleAddPoint}>Add Point</button>
        </div>}
        <button className='display-button' onClick={handleReset}>Reset</button> {/* Reset button */}
        </div>
    )
}

export default { DisplayForm };