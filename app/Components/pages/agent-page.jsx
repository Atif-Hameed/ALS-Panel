'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllUsers } from '../../actions/user.action';
import AgentMap from '../pages/agent-search/agent-map';
import Hero from '../../Components/pages/agent-search/hero';
import Footer from '../layout/footer';

const AgentPage = () => {
    const searchParams = useSearchParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Extract query parameters
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const agentName = searchParams.get('agentName');
    const zipCode = searchParams.get('zipCode');
    const city = searchParams.get('city');

    // Prepare filters object
    const filters = {};
    if (agentName) filters.agentName = agentName;
    if (zipCode) filters.zipCode = zipCode;
    if (city) filters.city = city;

    // Fetch data with useEffect
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const pageNumber = Number(page) || 1;
                const limitNumber = Number(limit) || 20;
                const response = await getAllUsers(pageNumber, limitNumber, filters);
                if (response.error) {
                    setError(response.error);
                } else {
                    setData(response.data);
                }
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, limit, agentName, zipCode, city]); // Re-run when search params change

    // Set localStorage view to 'agent' on mount
    // useEffect(() => {
    //     localStorage.setItem('view', 'agent');
    // }, []);

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl text-center py-10">Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1 className="text-2xl text-center py-10">Something went wrong, please try again!</h1>
            </div>
        );
    }

    return (
        <div className="h-full">
            <Hero />
            <AgentMap data={data} />
            <Footer />
        </div>
    );
};

export default AgentPage;