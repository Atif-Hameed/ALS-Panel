import React from 'react';
import { getAlignmentClass } from '../../utils/get-text-alignment';

const ThreeDMediaView = ({ layoutSettings, data }) => {


    return (
        <div className="w-full mt-8 flex flex-col items-center">
            <h1 className={`lg:text-xl headings text-lg font-semibold my-5 w-full ${getAlignmentClass(layoutSettings)}`}>3D Tours & Other Media</h1>

            <div className="w-5/6">
                {data?.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {item?.propertyOther?.map((mediaUrl, mediaIndex) => (
                            <div key={mediaIndex} className="aspect-w-16 aspect-h-9">
                                <iframe
                                    src={mediaUrl}
                                    className="w-full h-[400px]"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="xr-spatial-tracking"
                                    title={`3D Tour ${mediaIndex + 1}`}
                                ></iframe>
                            </div>
                        ))}

                       
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThreeDMediaView;