import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [inputs, setInputs] = useState({
        Sales: '',
        Quantity: '',
        Discount: '',
        Category: '',
        SubCategory: ''
    });
    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/predict', inputs, {
                timeout: 5000
            });
            setPrediction(`Predicted Profit: $${response.data.profit.toFixed(2)}`);
        } catch (error) {
            console.error('Error fetching prediction:', error);
            if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
                setPrediction('Request timed out. Please try again.');
            } else if (error.response) {
                setPrediction(`Server error: ${error.response.status} - ${error.response.data}`);
            } else {
                setPrediction('Error making prediction. Please try again.');
            }
        }
    };

    return (
        <div className="app-container">
            <h1>Supermarket Profit Predictor</h1>
            <form onSubmit={handleSubmit}>
                <input type="number" name="Sales" placeholder="Sales" value={inputs.Sales} onChange={handleChange} required />
                <input type="number" name="Quantity" placeholder="Quantity" value={inputs.Quantity} onChange={handleChange} required />
                <input type="number" name="Discount" placeholder="Discount" value={inputs.Discount} onChange={handleChange} required />
                <select name="Category" value={inputs.Category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Technology">Technology</option>
                </select>
                <input type="text" name="SubCategory" placeholder="Sub-Category" value={inputs.SubCategory} onChange={handleChange} required />
                <button type="submit">Predict Profit</button>
            </form>
            {prediction && <p className="prediction-result">{prediction}</p>}
        </div>
    );
};

export default App;
