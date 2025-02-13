import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../fetcher";
import { useAuth } from '../components/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    const role = user.role;
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (role === "admin" || role === "vendor") {
                    const response = await makeRequest("GET", '/api/users')
                    // setCustomers(response.data);
                } 
                else if (role === "user") {
                    const response = await makeRequest('GET', "/api/projects");
                    // setProjects(response.data);
                }
            } 
            catch (err) {
                setError("Failed to fetch data.");
            } 
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [role]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleAddCustomer = () => navigate("/add-customer");
    const handleViewProjects = (userId) => navigate(`/user/${userId}/projects`);
    const handleViewProjectDetails = (projectId) => navigate(`/project/${projectId}`);

    return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {role === "admin" || role === "vendor" ? (
        <div>
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Customers</h2>
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleAddCustomer}
            >
                Add Customer
            </button>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers && customers.map((customer) => (
                <li
                key={customer.id}
                className="border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer"
                onClick={() => handleViewProjects(customer.id)}
                >
                <h3 className="font-medium">{customer.name}</h3>
                <p className="text-sm text-gray-500">{customer.email}</p>
                </li>
            ))}
            </ul>
        </div>
        ) : (
        <div>
            <h2 className="text-xl font-semibold mb-4">My Projects</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects && projects.map((project) => (
                <li
                key={project._id}
                className="border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer"
                onClick={() => handleViewProjectDetails(project._id)}
                >
                <h3 className="font-medium">{project.projectName}</h3>
                <p className="text-sm text-gray-500">{project.tagline}</p>
                </li>
            ))}
            </ul>
        </div>
        )}
    </div>
    );
};

export default Dashboard;