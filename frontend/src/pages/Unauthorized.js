import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-6xl font-bold text-red-500">403</h1>
            <h2 className="text-2xl font-semibold mt-4 text-gray-800">Access Denied</h2>
            <p className="text-gray-600 mt-2 text-center">
                You do not have permission to access this page.<br />
                Please contact your administrator if you believe this is an error.
            </p>
            <div className="mt-6">
                <button
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
                <button
                    className="ml-4 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition"
                    onClick={() => navigate('/')}
                >
                    Return to Login
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;