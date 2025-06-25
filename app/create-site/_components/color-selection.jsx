'use client';
import { useState, useEffect } from 'react';
import { getPropertySiteSettings, updatePropertySiteSettings } from '../../actions/property.action';

const ColorSelector = ({ userId, propertyId, currentColors, setCurrentColors }) => {
    const [isLoading, setIsLoading] = useState(false);

    console.log(currentColors)

    useEffect(() => {
        const loadColorSettings = async () => {
            setIsLoading(true);
            try {
                const settings = await getPropertySiteSettings(propertyId);
                if (settings?.colorSettings) {
                    setCurrentColors(settings.colorSettings);
                }
            } catch (error) {
                console.error('Error loading color settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadColorSettings();
    }, [propertyId, setCurrentColors]);

    const handleColorChange = async (field, value) => {
        setIsLoading(true);
        try {
            const newColors = {
                ...currentColors,
                [field]: value,
            };
            setCurrentColors(newColors);
            const res = await updatePropertySiteSettings(propertyId,userId, { colorSettings: newColors });
            console.log("Color upfate ",res)
        } catch (error) {
            console.error('Error updating color settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNestedColorChange = async (parent, field, value) => {
        setIsLoading(true);
        try {
            const newColors = {
                ...currentColors,
                [parent]: {
                    ...currentColors[parent],
                    [field]: value,
                },
            };
            setCurrentColors(newColors);
            await updatePropertySiteSettings(propertyId, { colorSettings: newColors });
        } catch (error) {
            console.error('Error updating color settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // if (isLoading) return <div className="p-4 text-center">Loading color settings...</div>;

    return (
        <div className="space-y-6">
            {/* Text Colors */}
            <div className="flex flex-col gap-4">
                <ColorField label="Heading Color" value={currentColors?.heading} onChange={(val) => handleColorChange('heading', val)} />
                <ColorField label="Subheading Color" value={currentColors?.subheading} onChange={(val) => handleColorChange('subheading', val)} />
                <ColorField label="Paragraph Color" value={currentColors?.paragraph} onChange={(val) => handleColorChange('paragraph', val)} />
                <ColorField label="Navbar Color" value={currentColors?.listItem} onChange={(val) => handleColorChange('listItem', val)} />
            </div>

            {/* Link Colors */}
            {/* <div className="flex flex-col gap-4">
                <ColorField label="Normal Link" value={currentColors?.link?.normal} onChange={(val) => handleNestedColorChange('link', 'normal', val)} />
                <ColorField label="Hover Link" value={currentColors?.link?.hover} onChange={(val) => handleNestedColorChange('link', 'hover', val)} />
                <ColorField label="Visited Link" value={currentColors?.link?.visited} onChange={(val) => handleNestedColorChange('link', 'visited', val)} />
            </div> */}

            {/* Object Colors */}
            <div className="flex flex-col gap-4">
                <ColorField label="Badge Heading" value={currentColors?.objectKey} onChange={(val) => handleColorChange('objectKey', val)} />
                <ColorField label="Badge Value" value={currentColors?.objectValue} onChange={(val) => handleColorChange('objectValue', val)} />
                <ColorField label="Badge Background" value={currentColors?.objectBg} onChange={(val) => handleColorChange('objectBg', val)} />
            </div>

            {/* Preview */}
            {/* <div className="mt-6 p-4 border rounded bg-gray-50">
                <h4 className="text-sm font-medium mb-2">Current Color Settings</h4>
                <div className="flex flex-col gap-4 text-sm">
                    {Object.entries(currentColors).map(([key, value]) => {
                        if (typeof value === 'object') {
                            return Object.entries(value).map(([subKey, subValue]) => (
                                <div key={`${key}-${subKey}`} className="flex items-center">
                                    <div className="w-4 h-4 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: subValue }} />
                                    <span>{key}.{subKey}: {subValue}</span>
                                </div>
                            ));
                        }
                        return (
                            <div key={key} className="flex items-center">
                                <div className="w-4 h-4 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: value }} />
                                <span>{key}: {value}</span>
                            </div>
                        );
                    })}
                </div>
            </div> */}
        </div>
    );
};

const ColorField = ({ label, value, onChange }) => {
    return (
        <div className="flex items-center justify-between p-2  border rounded-lg">
            <div className="flex items-center">
                {/* <div className="w-6 h-6 rounded-full mr-3 border border-gray-300" style={{ backgroundColor: value }} /> */}
                <span className="text-lg font-medium">{label}</span>
            </div>
            <input
                type="color"
                value={value || '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 border-none bg-transparent cursor-pointer"
            />
        </div>
    );
};

export default ColorSelector;
