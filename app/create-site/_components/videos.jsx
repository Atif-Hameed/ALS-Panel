import { getAlignmentClass } from '../../utils/get-text-alignment';
import React from 'react';

const getEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}`;
    }

    // Wistia
    if (url.includes('wistia.com') || url.includes('wi.st')) {
        const match = url.match(/(medias|embed)\/([a-zA-Z0-9]+)/);
        const videoId = match?.[2];
        return `https://fast.wistia.net/embed/iframe/${videoId}`;
    }

    return null;
};

const Videos = ({ layoutSettings, data }) => {
    console.log(data)

    return (
        <div className="w-full mt-8 flex flex-col items-center justify-center">
            <h1 className={`lg:text-xl headings text-lg font-semibold  my-5 w-full ${getAlignmentClass(layoutSettings)}`}>
                Video
            </h1>

            <div className="w-5/6 flex flex-col gap-6">
                {data?.map((item, index) => {
                    const embedUrl = getEmbedUrl(item);
                    console.log(embedUrl)
                    if (!embedUrl) return null;

                    return (
                        <div key={index} className=" w-full">
                            <iframe
                                src={embedUrl}
                                className="w-full h-[400px] rounded"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Videos;
