import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './siteeval.css';
import TiffViewer from "./tiffviewer";

let pointsConverted: number[];
  

// HARD CODING VALUES FROM DESA PLOT FOR DEADLINE. WILL NEED TO AUTOMATE
const bbox = [111.82264589331169, 0.14337111934547572, 112.029438071716, 0.3233935022830277] 
const pixelWidth = 2302 
const pixelHeight = 2004 
const bboxWidth = 0.20679217840431363 
const bboxHeight = 0.180022382937552

const addNewMap = (points: number[]) => {
    console.log(points)

    var xpoints: number[] = [points[0], points[2], points[4], points[6]];
    var ypoints: number[] = [points[1], points[3], points[5], points[7]];

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

    const [formState, setFormState] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    });



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

    const handleInputChange = (event: any) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        });
        };
    
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const { q1, q2, q3, q4 } = formState;
        console.log(q1, q2, q3, q4);
        g1 = AnsToLoc(q1);
        g2 = AnsToLoc (q2);
        g3 = AnsToLoc(q3);
        g4 = AnsToLoc (q4);
        console.log(g1, g2, g3, g4);
        pointsConverted = [g1[0], g1[1], g2[0], g2[1], g3[0], g3[1], g4[0], g4[1]];
        setPoints(pointsConverted);
        setFormSubmitted(true);
        };
    
    const handleReset = () => {
        // Reset the form state
        setFormState({
            q1: '',
            q2: '',
            q3: '',
            q4: '',
        });
        setFormSubmitted(false); // Mark the form as not submitted
        };


    return (
        <div>
        <button onClick={handleReset}>Reset</button> {/* Reset button */}
        {formSubmitted && (addNewMap(points))}
        {!formSubmitted && <div>
        <h1> Here is a full image of the Desa Plot </h1>
        <img src="./8_class_kmeans_ar.png" alt="Desa Plot" className='fullimg'></img>
        <div> To get specific details about a section of the plot, input the longitude and latitude of the 4 corners of the
            polygon you would like to learn more about. (Seperate long and lat by space, eg 'LO LA') </div>
        <form onSubmit={handleSubmit}>
            <label>
            Point 1:
            <input
                type="text"
                name="q1"
                value={formState.q1}
                onChange={handleInputChange}
            />
            </label>
            <br />
            <label>
            Point 2:
            <input
                type="text"
                name="q2"
                value={formState.q2}
                onChange={handleInputChange}
            />
            </label>
            <br />
            <label>
            Point 3:
            <input
                type="text"
                name="q3"
                value={formState.q3}
                onChange={handleInputChange}
            />
            </label>
            <br />
            <label>
            Point 4:
            <input
                type="text"
                name="q4"
                value={formState.q4}
                onChange={handleInputChange}
            />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form> </div>}
        </div>
    )
}

export default { DisplayForm };