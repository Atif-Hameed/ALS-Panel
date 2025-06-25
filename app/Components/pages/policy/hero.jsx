import Heading from '../../shared/heading';
import HeroBanner from '../../shared/hero-banner';

const Hero = ({ name, date }) => {

    // Format the last updated date
    const lastUpdated = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <HeroBanner bgStyle={'bg-[url("/assets/images/howWork.jpg")] md:!h-[60vh] !h-[50vh] bg-center'}>
            <div className='h-full sm:mt-10 flex items-center'>
                <div className='w-full z-30 flex flex-col  items-center  justify-center relative'>
                    <Heading className={'text-white z-30 text-center font-semibold w-full'}>{name}</Heading>
                    <p className=" text-gray-300">Last updated: {lastUpdated}</p>
                </div>
            </div>

            <div
                className="absolute w-full h-full top-0 left-0 z-20"
                style={{
                    background: 'linear-gradient(0deg, #0A1629 -54.47%, rgba(10, 22, 41, 0) 204.09%), #02315A99',
                    backgroundBlendMode: 'multiply',
                }}
            ></div>

        </HeroBanner>
    );
};

export default Hero;