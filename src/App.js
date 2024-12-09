import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [visualization, setVisualization] = useState('');

    // Handle file upload
    const handleFileUpload = async (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);

        if (uploadedFile) {
            const formData = new FormData();
            formData.append('file', uploadedFile);

            try {
                const response = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                alert(response.data.message || 'File uploaded successfully!');
            } catch (error) {
                alert('Error uploading file');
                console.error(error);
            }
        }
    };

    // Fetch predictions from backend
    const fetchPredictions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/predict');
            const data = response.data;
            setPredictions(data);
        } catch (error) {
            alert('Error fetching predictions');
            console.error(error);
        }
    };

    // Fetch visualization image from backend
    const fetchVisualization = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/visualization');
            setVisualization(response.data.image);
        } catch (error) {
            alert('Error fetching visualization');
            console.error(error);
        }
    };

    return (
        <div className="app-container">
            <h1>Hospitalized Cases Forcasting</h1>

            {/* File upload section */}
            <div className="upload-container">
                <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} />
                <button onClick={fetchPredictions}>Forcast</button>
                <button onClick={fetchVisualization}>Visualize</button>
            </div>

            {/* Predictions Table */}
            <h2>Forcasting Table</h2>
            {predictions.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>District</th>
                            <th>Population</th>
                            <th>Week</th>
                            <th>Rainsum</th>
                            <th>Mean Temperature</th>
                            <th>Weekly Hospitalised Cases</th>
                        </tr>
                    </thead>
                    <tbody>
                        {predictions.map((row, index) => (
                            <tr key={index}>
                                <td>{row.year}</td>
                                <td>{row.district}</td>
                                <td>{row.population}</td>
                                <td>{row.week}</td>
                                <td>{row.rainsum}</td>
                                <td>{row.meantemperature}</td>
                                <td>{row.weekly_hospitalised_cases}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No predictions available. Please upload data and fetch predictions.</p>
            )}

            {/* Visualization */}
            {visualization && (
                <div>
                    <h2>Visualization</h2>
                    <img src={`data:image/png;base64,${visualization}`} alt="Prediction Visualization" />
                </div>
            )}
        </div>
    );
}

export default App;