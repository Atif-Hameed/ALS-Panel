import { getAllBoardPosts, getPostTopics } from '../../actions/boardPost.action';
import BoardPost from '../../Components/pages/board-post/BoardPost'
import React from 'react'

const page = async ({ searchParams }) => {

    const { data: topics, error: topicsError } = await getPostTopics();

    // If there's an error or missing data
    if (topicsError) {
        console.error('Error fetching data:', topicsError);
        return <div>Something went wrong!</div>;
    }

    return (
        <div>
            <BoardPost topics={topics} />
        </div>
    )
}

export default page
