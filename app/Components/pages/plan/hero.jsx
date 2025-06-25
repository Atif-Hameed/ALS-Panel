import Heading from '../../shared/heading';
import HeroBanner from '../../shared/hero-banner';

const Hero = () => {


    return (
        <HeroBanner bgStyle={'bg-[url("/assets/images/plan.jpg")] md:!h-[60vh] !h-[50vh]'}>
            <div className='h-full sm:mt-10 flex items-center'>
                <div className='w-full z-30 flex  items-center  justify-center relative'>
                    <Heading className={'text-white z-30 text-center font-semibold w-full'}>Pricing Plans</Heading>
                </div>
            </div>

            <div
                className="absolute w-full h-full top-0 left-0 z-20"
                style={{
                    background: 'linear-gradient(270deg, rgba(10, 22, 41, 0) -1.55%, #0A1629 97.46%)',
                    backgroundBlendMode: 'multiply',
                }}

            ></div>
        </HeroBanner>
    );
};

export default Hero;