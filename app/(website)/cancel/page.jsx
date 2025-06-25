import Button from '../../Components/shared/custom-btn';
import Container from '../../Components/shared/container';
import CustomLink from '../../Components/shared/custom-link';

const page = async ({ searchParams }) => {

    const { email, userId } = await searchParams;

    return (
        <div>
            <Hero heading={'Subscription Cancelled!'} />
            <Container className="py-16 px-4 bg-white mx-auto text-center">
                <h1 className="text-4xl font-bold text-[#02315A] mb-4"></h1>
                <p className="text-xl font-semibold text-dark mb-6">You have cancelled the subscription process.</p>
                <CustomLink href={`/plan?email=${email}&userId=${userId}`}>
                    <Button
                        label='Choose a Plan'
                        style="bg-dark text-white py-2 px-4 rounded-md font-medium  transition"
                    />
                </CustomLink>
            </Container>
        </div>
    );
}

export default page;