import { getUserPosts } from '../../../actions/boardPost.action'
import React from 'react'
import Account from '../../../Components/pages/board-post/account';
import Back from '../../../Components/shared/back-btn';

const page = async ({ searchParams }) => {

    const { userId } = await searchParams;

    const { data, error } = await getUserPosts(userId)

    // If there's an error or missing data
    if (error) {
        console.error('Error fetching data:', error);
        return <div>Something went wrong!</div>;
    }

    return (
        <div>
            <Back href={'/board-post'} />
            <Account data={data} userId={userId} />
        </div>
    )
}

export default page
