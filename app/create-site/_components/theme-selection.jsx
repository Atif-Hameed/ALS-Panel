'use client';
import { useState, useEffect } from 'react';
import { getPropertySiteSettings, updatePropertySiteSettings } from '../../actions/property.action';

const THEMES = [
    {
        id: 'light',
        name: 'Light',
        colors: {
            heading: '#000000',
            subheading: '#333333',
            paragraph: '#444444',
            listItem: '#444444',
            link: {
                normal: '#0066cc',
                hover: '#004499',
                visited: '#551a8b'
            },
            objectKey: '#000000',
            objectValue: '#333333',
            objectBg: '#ffffff',
            backgroundColor: '#ffffff',
        },
        fonts: {
            fontFamily: 'Inter',
            fontWeight: 'normal',
            fontStyle: 'normal',
            headlineFont: 'Inter',
            bodyFont: 'Inter',
            fontImportUrl: ''
        }
    },
    {
        id: 'dark',
        name: 'Dark',
        colors: {
            heading: '#ffffff',
            subheading: '#e0e0e0',
            paragraph: '#cccccc',
            listItem: '#cccccc',
            link: {
                normal: '#4dabf7',
                hover: '#339af0',
                visited: '#9775fa'
            },
            objectKey: '#ffffff',
            objectValue: '#e0e0e0',
            objectBg: '#1a1a1a',
            backgroundColor: '#121212',
        },
        fonts: {
            fontFamily: 'Inter',
            fontWeight: 'normal',
            fontStyle: 'normal',
            headlineFont: 'Inter',
            bodyFont: 'Inter',
            fontImportUrl: ''
        }
    },
    {
        id: 'professional',
        name: 'Professional',
        colors: {
            heading: '#2c3e50',
            subheading: '#34495e',
            paragraph: '#7f8c8d',
            listItem: '#7f8c8d',
            link: {
                normal: '#3498db',
                hover: '#2980b9',
                visited: '#9b59b6'
            },
            objectKey: '#2c3e50',
            objectValue: '#34495e',
            objectBg: '#f8f9fa',
            backgroundColor: '#ecf0f1'
        },
        fonts: {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
            fontStyle: 'normal',
            headlineFont: 'Roboto',
            bodyFont: 'Roboto',
            fontImportUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
        }
    },
    {
        id: 'warm',
        name: 'Warm',
        colors: {
            heading: '#5c2c0d',
            subheading: '#7a4311',
            paragraph: '#8b5a2b',
            listItem: '#8b5a2b',
            link: {
                normal: '#e67e22',
                hover: '#d35400',
                visited: '#a84300'
            },
            objectKey: '#5c2c0d',
            objectValue: '#7a4311',
            objectBg: '#fdf6e3',
            backgroundColor: '#fff5e1'
        },
        fonts: {
            fontFamily: 'Merriweather',
            fontWeight: 'normal',
            fontStyle: 'normal',
            headlineFont: 'Merriweather',
            bodyFont: 'Merriweather',
            fontImportUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap'
        }
    }
];

const ThemeSelection = ({ propertyId, UserId, currentTheme, setCurrentTheme, currentColors, setCurrentColors, currentFont, setCurrentFont }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadThemeSettings = async () => {
            setIsLoading(true);
            try {
                const response = await getPropertySiteSettings(propertyId);
                if (response?.data) {
                    const settings = response.data;
                    setCurrentTheme(settings.currentTheme || 'light');

                    // Only update colors and fonts if they exist in the response
                    if (settings.colorSettings) {
                        setCurrentColors(settings.colorSettings);
                    }
                    if (settings.fontSettings) {
                        setCurrentFont(settings.fontSettings);
                    }
                }
            } catch (error) {
                console.error('Error loading theme settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadThemeSettings();
    }, [propertyId, setCurrentTheme, setCurrentColors, setCurrentFont]);

    const handleThemeChange = async (themeId) => {
        setIsLoading(true);
        try {
            const selectedTheme = THEMES.find(t => t.id === themeId);
            if (!selectedTheme) return;

            // Prepare the updated settings
            const updatedSettings = {
                currentTheme: themeId,
                colorSettings: selectedTheme.colors,
                fontSettings: {
                    ...selectedTheme.fonts,
                    // Preserve any existing font settings that aren't theme-specific
                    ...currentFont
                }
            };

            // Update backend first
            const response = await updatePropertySiteSettings(
                propertyId,
                UserId,
                updatedSettings
            );

            console.log("Themee responseee", response)

            // Only update local state if backend update was successful
            if (response?.data?.data) {
                setCurrentTheme(themeId);
                setCurrentColors(selectedTheme.colors);
                setCurrentFont(updatedSettings.fontSettings);
            } else {
                console.error('Failed to update theme settings');
            }
        } catch (error) {
            console.error('Error updating theme settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-4 text-center">Loading theme settings...</div>;

    return (
        <div className="">
            <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                    {THEMES.map((theme) => (
                        <div
                            key={theme.id}
                            className={`p-3 bg-white border rounded-lg shadow hover:shadow-md transition cursor-pointer ${currentTheme === theme.id
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-200'
                                }`}
                            onClick={() => handleThemeChange(theme.id)}
                        >
                            <h3 className="font-medium text-center break-all">{theme.name}</h3>
                            <div className="flex justify-center mt-2 gap-1">
                                {Object.values(theme.colors)
                                    .filter(color => typeof color === 'string')
                                    .map((color, i) => (
                                        <div
                                            key={i}
                                            className="w-4 h-4 rounded-full border border-gray-200"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeSelection;