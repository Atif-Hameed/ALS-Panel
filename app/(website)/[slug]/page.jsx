import { getPageContent } from '../../actions/content-pages';
import Content from '../../Components/pages/policy/content'
import Hero from '../../Components/pages/policy/hero'
import React from 'react'

const page = async ({ params }) => {

    const { slug } = await params;

    const { data, error } = await getPageContent(slug);

    if (error) {
        return (
            <div>
                <h1 className='text-center py-40'>Something went wrong!</h1>
            </div>
        )
    }

    return (
        <div>
            <Hero name={data.pageName} date={data.updatedAt} />
            <Content data={data} />
        </div>
    )
}

export default page;
