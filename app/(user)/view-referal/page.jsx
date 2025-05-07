'use client'
import React, { useEffect, useState } from 'react'
import ViewAgent from './view-agent';
import { fetchUserByAgentId } from '../../actions/user.action';
import { useSearchParams } from 'next/navigation';

const Page = () => {

    const params = useSearchParams();
    const id = params.get('id');
    const [data, setData] = useState();

    const fetchUser = async (id) => {
        try {
            const { data, error } = await fetchUserByAgentId(id)
            if (error) {
                console.log(error)
            }
            if (data) {
                setData(data?.user)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (id) {
            fetchUser(id)
        }
    }, [id])


    return (
        <div>
            <ViewAgent data={data} />
        </div>
    )
}

export default Page
