'use client';
import { useState, useEffect } from 'react';
import { getPropertySiteSettings, updatePropertySiteSettings } from '../../actions/property.action';

const LAYOUT_OPTIONS = [
    {
        id: 'textAlignment',
        name: 'Text Alignment',
        options: [
            { id: 'left', name: 'Left Aligned', description: 'Text aligned to the left', previewClass: 'text-left' },
            { id: 'center', name: 'Centered', description: 'Text centered on the page', previewClass: 'text-center' },
            { id: 'right', name: 'Right Aligned', description: 'Text aligned to the right', previewClass: 'text-right' }
        ]
    },
    {
        id: 'galleryLayout',
        name: 'Gallery Layout',
        options: [
            { id: 'gridView', name: 'Grid View', description: 'Images displayed in a responsive grid', previewClass: 'grid grid-cols-3 gap-1' },
            { id: 'carouselView', name: 'Carousel', description: 'Images in a horizontal scrolling carousel', previewClass: 'flex overflow-x-auto' },
            { id: 'gridNarrowView', name: 'Grid Narrow', description: 'Small gap grid layout', previewClass: 'columns-2 gap-1' }
        ]
    },
    {
        id: 'detailLayout',
        name: 'Details Layout',
        options: [
            { id: 'sideByside', name: 'Side by Side', description: 'Details and info Side by Side vertically', previewClass: 'space-y-4' },
            { id: 'grid', name: 'grid', description: 'Details in grid sections', previewClass: 'space-y-2' },
            { id: 'column', name: 'Stacked', description: 'Details and info displayed in single columns', previewClass: 'grid grid-cols-2 gap-4' },
        ]
    }
];

const LayoutSelection = ({ userId, propertyId, layoutSettings, setLayoutSettings, scrollToGallery, scrollToDetails }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Load initial layout settings
    useEffect(() => {
        const loadLayoutSettings = async () => {
            setIsLoading(true);
            try {
                const settings = await getPropertySiteSettings(propertyId);
                if (settings?.layoutSettings) {
                    setLayoutSettings(settings.layoutSettings);
                }
            } catch (error) {
                console.error('Error loading layout settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLayoutSettings();
    }, [propertyId, setLayoutSettings]);

    const handleLayoutChange = async (settingType, value) => {
        setIsLoading(true);
        try {
            const updatedSettings = {
                ...layoutSettings,
                [settingType]: value
            };
            setLayoutSettings(updatedSettings);
            const res = await updatePropertySiteSettings(propertyId, userId, {
                layoutSettings: updatedSettings
            });

            // Scroll to gallery when gallery layout is changed
            if (settingType === 'galleryLayout' && scrollToGallery) {
                scrollToGallery();
            }

            // Scroll to gallery when gallery layout is changed
            if (settingType === 'detailLayout' && scrollToDetails) {
                scrollToDetails();
            }

            console.log("Responseeee", res)
        } catch (error) {
            console.error('Error updating layout settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-4 text-center">Loading layout settings...</div>;

    return (
        <div className="space-y-8">
            {LAYOUT_OPTIONS.map((section) => (
                <div key={section.id} className="space-y-4">
                    <h3 className="font-semibold underline">{section.name}</h3>
                    <div className="flex flex-col gap-4">
                        {section.options.map((option) => (
                            <div
                                key={option.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-all ${layoutSettings?.[section.id] === option.id
                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => handleLayoutChange(section.id, option.id)}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow">
                                        <h4 className="font-medium">{option.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                                    </div>
                                    <div className={`w-full h-16 mt-3 rounded border ${option.previewClass} bg-gray-100 p-1`}>
                                        <div className="bg-white rounded-sm h-full w-1/3 inline-block mx-0.5"></div>
                                        <div className="bg-white rounded-sm h-full w-1/3 inline-block mx-0.5"></div>
                                        <div className="bg-white rounded-sm h-full w-1/3 inline-block mx-0.5"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LayoutSelection;