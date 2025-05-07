'use client';

import React, { useEffect, useState } from 'react';
// import { useParams, useSearchParams } from 'next/navigation';
import { getUserData } from '../../../actions/user.action';
import { getPropertiesWithPagination } from '../../../actions/property.action';
import { getPropertyReviews } from '../../../actions/review.action';
import Hero from '../../../Components/pages/agent-profile/hero';
import ProfileDetails from '../../../Components/pages/agent-profile/profile-details';
import Properties from '../../../Components/pages/agent-profile/properties';
import Reviews from '../../../Components/pages/agent-profile/reviews';

const Page = async ({params, searchParams}) => {
    // const params = useParams();
    // const searchParams = useSearchParams();
    // const id = params?.id;
    const {id} =await params;
    const {page , limit} =await searchParams;
    if (!id) {
        return <h1 className='text-2xl text-center py-60'>Invalid agent ID</h1>;
      }
   console.log(id)
   console.log(page, limit)

    const [userData, setUserData] = useState(null);
    const [properties, setProperties] = useState([]);
    const [meta, setMeta] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');


    // useEffect(() => {
    //     if (!id) return;
    
    //     const fetchData = async () => {
    //         setLoading(true);
    //         setErrorMsg('');
    
    //         const { data, error } = await getUserData(id);
    //         const { data: properties, error: propertyError } = await getPropertiesWithPagination(id, Number(page), Number(limit));
    //         const { data: reviews, error: reviewsError } = await getPropertyReviews(id);
    
    //         if (error || reviewsError || propertyError) {
    //             setErrorMsg(error || reviewsError || propertyError);
    //         } else {
    //             setUserData(data?.user);
    //             setProperties(properties.data);
    //             setMeta(properties.meta);
    //             setReviews(reviews);
    //         }
    
    //         setLoading(false);
    //     };
    
    //     fetchData();
    // }, [id, page, limit]);
    
    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true);
    //         setErrorMsg('');

    //         const { data, error } = await getUserData(id);
    //         const { data: properties, error: propertyError } = await getPropertiesWithPagination(id, Number(page), Number(limit));
    //         const { data: reviews, error: reviewsError } = await getPropertyReviews(id);
    //         console.log(reviews, reviewsError)
    //         if (error || reviewsError || propertyError) {
    //             setErrorMsg(error || reviewsError || propertyError);
    //         } else {
    //             setUserData(data?.user);
    //             setProperties(properties.data);
    //             setMeta(properties.meta);
    //             setReviews(reviews);
    //         }

    //         setLoading(false);
    //     };

    //     if (id) fetchData();
    // }, [id, page, limit]);

    // if (loading) {
    //     return <h1 className='text-2xl text-center py-60'>Loading...</h1>;
    // }

    // if (errorMsg) {
    //     return <h1 className='text-2xl text-center py-60'>Something went wrong: {errorMsg}</h1>;
    // }

    return (
        <div className='h-full'>
            {id}
            {/* {userData && <Hero data={userData} />}
            {userData && <ProfileDetails data={userData} reviews={reviews} />}
            <Properties
                properties={properties}
                reviews={reviews}
                meta={meta}
                currentPage={Number(page)}
                currentLimit={Number(limit)}
            />
            <Reviews id={id} data={reviews} /> */}
        </div>
    );
};

export default Page;
