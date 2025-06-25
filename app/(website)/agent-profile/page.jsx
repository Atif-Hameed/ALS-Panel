import { getUserData } from '../../actions/user.action'
import { getPropertiesWithPagination } from '../../actions/property.action';
import { getPropertyReviews } from '../../actions/review.action';
import Hero from '../../Components/pages/agent-profile/hero';
import ProfileDetails from '../../Components/pages/agent-profile/profile-details';
import Properties from '../../Components/pages/agent-profile/properties';
import Reviews from '../../Components/pages/agent-profile/reviews';
import React from 'react'

const page = async ({ searchParams }) => {

    const {
        page = '1',
        limit = '6',
        id = '',
        isConsumer,
    } = await searchParams;


    const { data, error } = await getUserData(id);
    const { data: properties, error: propertiesError, meta } = await getPropertiesWithPagination(id, Number(page), Number(limit));
    const { data: reviews, error: reviewError } = await getPropertyReviews(id);


    if (error || reviewError) {
        console.log(error || reviewError)
        return (
            <div>
                <h1 className='text-2xl text-center py-60'>Soemthing went wrong, please try again!</h1>
            </div>
        )

    } else {
        return (
            <div className='h-full'>
                <Hero data={data.user} isProfile={true} />
                <ProfileDetails data={data.user} reviews={reviews} isConsumer={isConsumer} />
                <Properties
                    properties={properties?.data}
                    reviews={reviews}
                    meta={properties?.meta}
                    currentPage={Number(page)}
                    currentLimit={Number(limit)}
                />
                <Reviews id={id} data={reviews} />
            </div>
        )
    }

}

export default page
