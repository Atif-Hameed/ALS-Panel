import ViewPost from '../../../Components/pages/board-post/view-post';
import { getPost } from '../../../actions/boardPost.action'
import React from 'react'
import Back from '../../../Components/shared/back-btn';

const page = async ({ searchParams }) => {

    const { id } = await searchParams;

    const { data, error } = await getPost(id)

    if (error) {
        console.error('Error fetching data:', error);
        return <div>Something went wrong!</div>;
    }

    return (
        <div>
            <Back href={'/board-post'} />
            <ViewPost data={data} />
        </div>
    )
}

export default page
