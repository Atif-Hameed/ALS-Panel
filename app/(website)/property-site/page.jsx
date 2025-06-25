import { getPropertyData, getPropertySiteSettings } from '../../actions/property.action';
import React from 'react'
import CreateSite from './_components/create-site';

const page = async ({ searchParams }) => {
    const { id = '' } = await searchParams;

    // Fetch both property settings and property data
    const { data: siteSettings, error: settingsError } = await getPropertySiteSettings(id);
    const { data: propertyData, error: propertyError } = await getPropertyData(id);

    // If there's an error or missing data, handle it appropriately
    if (settingsError || propertyError) {
        console.error('Error fetching data:', settingsError || propertyError);
        return <div>Error loading property data</div>;
    }

    // Prepare the initial settings with proper structure
    const initialSettings = siteSettings?.data ? {
        currentTheme: siteSettings.data.currentTheme || 'light',
        layoutSettings: siteSettings.data.layoutSettings || {
            textAlignment: 'left',
            galleryLayout: 'gridView',
            detailLayout: 'sideByside'
        },
        fontSettings: siteSettings.data.fontSettings || {
            fontFamily: 'Inter',
            bodyFont: 'Inter',
            headlineFont: 'Inter',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontImportUrl: ''
        },
        colorSettings: siteSettings.data.colorSettings || {
            heading: '#000000',
            subheading: '#000000',
            paragraph: '#000000',
            listItem: '#000000',
            link: {
                normal: '#0066cc',
                hover: '#004499',
                visited: '#551a8b'
            },
            objectKey: '#000000',
            objectValue: '#000000',
            objectBg: '#eff6ff',
            backgroundColor: '#ffffff',
        }
    } : null;

    return (
        <div className=''>
            {/* <Hero data={propertyData} isProfile={false} /> */}
            <CreateSite 
                data={propertyData} 
                initialSettings={initialSettings}
            />
        </div>
    )
}

export default page