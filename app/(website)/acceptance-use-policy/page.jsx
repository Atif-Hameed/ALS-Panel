import { getPageContent } from '../../actions/content-pages'
import Content from '../../Components/pages/policy/content'
import Hero from '../../Components/pages/policy/hero'
import React from 'react'

const page = async () => {

    const slug = 'acceptable-use-policy'

    const { data, error } = await getPageContent(slug);

    if (error) {
        return (
            <div>
                <h1 className='text-center py-20'>Somehting went wrong! Please try again!</h1>
            </div>
        )
    }

    console.log(data.updatedAt)

    return (
        <div>
            <Hero name={data.pageName} date={data.updatedAt} />
            <Content data={data} />
        </div>
    )
}

export default page
