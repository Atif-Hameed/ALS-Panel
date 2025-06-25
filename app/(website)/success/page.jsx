import Button from '../../Components/shared/custom-btn';
import Container from '../../Components/shared/container';
import CustomLink from '../../Components/shared/custom-link';
import Hero from '../../Components/pages/account-manage/hero';

const page = async ({ searchParams }) => {

    const { email, userId, plan,session_id } = await searchParams;

    return (
        <div>
            <Hero heading={'Subscription Successful!'} />
            <Container className="py-16 px-4 bg-white mx-auto text-center">
                {/* <h1 className="text-4xl font-bold text-[#02315A] mb-4">Subscription Successful!</h1> */}
                <p className="text-xl font-semibold text-dark mb-6">Thank you for subscribing. You can now access your plan features.</p>
                <CustomLink className={'flex justify-center w-full'} href={`/account-setup?email=${email}&userId=${userId}&plan=${plan}$session_id=${session_id}`}>
                    <Button
                        label='Go to Account Setup'
                        style="bg-dark text-white py-2 px-4 rounded-md font-medium  transition"
                    />
                </CustomLink>
            </Container>
        </div>
    );
}

export default page;