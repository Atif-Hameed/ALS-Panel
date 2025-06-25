'use client';
import { useState, useEffect } from 'react';
import { getPropertySiteSettings, updatePropertySiteSettings } from '../../actions/property.action';

const FONT_PAIRS = [
    {
        headlineFont: 'Julius Sans One',
        bodyFont: 'Open Sans',
        importUrl: 'https://fonts.googleapis.com/css2?family=Julius+Sans+One&family=Open+Sans:wght@400&display=swap'
    },
    {
        headlineFont: 'Cinzel',
        bodyFont: 'Montserrat',
        importUrl: 'https://fonts.googleapis.com/css2?family=Cinzel&family=Montserrat:wght@400&display=swap'
    },
    {
        headlineFont: 'Oswald',
        bodyFont: 'Source Sans Pro',
        importUrl: 'https://fonts.googleapis.com/css2?family=Oswald:wght@600&family=Source+Sans+Pro:wght@400&display=swap'
    },
    {
        headlineFont: 'Urbanist',
        bodyFont: 'Lato',
        importUrl: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@600&family=Lato:wght@400&display=swap'
    },
    {
        headlineFont: 'Plus Jakarta Sans',
        bodyFont: 'Roboto',
        importUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600&family=Roboto:wght@400&display=swap'
    }
];

const FontSelector = ({ userId, propertyId, currentFont, setCurrentFont }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadFontSettings = async () => {
            setIsLoading(true);
            try {
                const settings = await getPropertySiteSettings(propertyId);
                if (settings?.fontSettings) {
                    setCurrentFont(settings.fontSettings);
                }
            } catch (error) {
                console.error('Error loading font settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadFontSettings();
    }, [propertyId, setCurrentFont]);

    useEffect(() => {
        if (currentFont?.importUrl) {
            const link = document.createElement('link');
            link.href = currentFont.importUrl;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            return () => {
                document.head.removeChild(link);
            };
        }
    }, [currentFont]);

    const handleFontChange = async (pair) => {
        setIsLoading(true);
        try {
            const newSettings = {
                ...currentFont,
                fontFamily: pair.headlineFont,
                fontImportUrl: pair.importUrl,
                headlineFont: pair.headlineFont,
                bodyFont: pair.bodyFont
            };
            setCurrentFont(newSettings);
            await updatePropertySiteSettings(propertyId,userId, { fontSettings: newSettings });
        } catch (error) {
            console.error('Error updating font settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-4 text-center">Loading font settings...</div>;

    return (
        <div className="">
            <div className="mb-4">
                <div className="flex flex-col gap-6">
                    {FONT_PAIRS.map((pair) => (
                        <div
                            key={`${pair.headlineFont}-${pair.bodyFont}`}
                            className={`p-2 bg-white border rounded-lg shadow hover:shadow-md transition ${currentFont?.headlineFont === pair.headlineFont &&
                                    currentFont?.bodyFont === pair.bodyFont
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-200'
                                }`}
                        >
                            <h2
                                className="text-lg mb-2"
                                style={{ fontFamily: pair.headlineFont }}
                            >
                                {pair.headlineFont} and {pair.bodyFont}
                            </h2>
                            <p
                                className="text-xs text-gray-700"
                                style={{ fontFamily: pair.bodyFont }}
                            >
                                This is a preview of body copy using font {pair.bodyFont} paired
                                with the headline shown above in {pair.headlineFont}.
                            </p>
                            <button
                                onClick={() => handleFontChange(pair)}
                                className="mt-4 px-4 py-2 text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Applying...' : 'Apply Fonts'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* {currentFont && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h4 className="text-sm font-medium mb-2">Current Selection</h4>
                    <div>
                        <p className="text-xl" style={{ fontFamily: currentFont.headlineFont }}>
                            Headline Font: {currentFont.headlineFont}
                        </p>
                        <p className="text-base mt-2" style={{ fontFamily: currentFont.bodyFont }}>
                            Body Font: {currentFont.bodyFont}
                        </p>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default FontSelector;
