import { getAllUsers } from '../../actions/user.action'
import AgentMap from '../../Components/pages/agent-search/agent-map'
import Hero from '../../Components/pages/agent-search/hero'
import React from 'react'

const page = async ({ searchParams }) => {
    // Extract all query parameters
    const {
        page = '1',
        limit = '10',
        agentName,
        zipCode,
        city
    } = await searchParams;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    // Prepare filters object
    const filters = {};
    if (agentName) filters.agentName = agentName;
    if (zipCode) filters.zipCode = zipCode;
    if (city) filters.city = city;

    // Fetch data with pagination and filters
    const { data, error } = await getAllUsers(pageNumber, limitNumber, filters);

    if (error) {
        return (
            <div>
                <h1 className='text-2xl text-center py-10'>Something went wrong, please try again!</h1>
            </div>
        )
    }

    return (
        <div className='h-full'>
            <Hero />
            <AgentMap data={data} />
        </div>
    )
}

export default page