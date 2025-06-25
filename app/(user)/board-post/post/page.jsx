import ShowPost from '../../../Components/pages/board-post/show-post';
import { getAllBoardPosts } from '../../../actions/boardPost.action';
import React from 'react'
import Back from '../../../Components/shared/back-btn';

const page = async ({ searchParams }) => {

    const { page, limit, postType, category, city } = await searchParams;

    // Convert hyphenated values back to spaces, with fallbacks
    const originalCategory = category ? category : 'Unknown';
    const originalPostType = postType ? postType : 'Unknown';

    // Call API with transformed values
    const { data, error } = await getAllBoardPosts({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        postType: originalPostType,
        category: originalCategory,
        city: city,
    });

    // If there's an error or missing data
    if (error) {
        console.error('Error fetching data:', error);
        return <div>Something went wrong!</div>;
    }

    return (
        <div>
            <Back href={'/board-post'} />
            <ShowPost data={data?.data} filters={{ originalPostType, originalCategory, city }} />
        </div>
    )
}

export default page
