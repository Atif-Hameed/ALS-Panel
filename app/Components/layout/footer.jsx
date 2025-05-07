import Link from "next/link";
import Container from "../shared/container";
import Button from "../shared/custom-btn";
import CustomLink from "../shared/custom-link";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa';

const quickLinks = ["About", "Features", "Works", "Career"];
const helpLinks = ["Customer", "Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"];
const socialIcons = [
    { icon: <FaTwitter />, url: "#" },
    { icon: <FaFacebookF />, url: "#" },
    { icon: <FaInstagram />, url: "#" },
    { icon: <FaGithub />, url: "#" },
];

export default function Footer() {
    return (
        <Container parentStyle={'bg-black'} className=" text-white xl:px-20 sm:px-12 px-4 xl:py-20 py-12">
            <div className=" mx-auto font-plusJakarta">
                {/* Header */}
                <div className="flex justify-between gap-4 items-center flex-wrap">
                    <div>
                        <h2 className="text-3xl font-bold">ALS</h2>
                        <p className="mt-1 text-xl ">AGENT LISTING SERVICES</p>
                    </div>
                    <Button
                        label="Download Free Chapter"
                        style="bg-white !text-black !px-3 font-medium  py-3 !text-sm rounded-full"
                    />
                </div>

                <hr className="border-b border-[#E4E4E7] my-8" />

                {/* Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-8 ">
                    {/* About */}
                    <div>
                        <h3 className="font-bold mb-2">About</h3>
                        <p className="font-bold mb-2">Agent Listing Service</p>
                        <p className="text-white text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pharetra
                            tristique non sed euismod. Lorem neque, risus tellus non enim.
                            Consectetur montes, laoreet rutrum sodales. Dignissim gravida
                            pulvinar faucibus sed blandit tempus feugiat a, sit. Est pharetra
                            euismod facanatis,
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-4 text-lg">
                            {socialIcons.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.url}
                                    className="text-white hover:text-primary transition-colors duration-300"
                                >
                                    {item.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-3 text-white">
                            {quickLinks.map((link, index) => (
                                <li key={index} className="text-sm">
                                    <CustomLink
                                        key={index}
                                        href={'#'}
                                    >
                                        {link}
                                    </CustomLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h3 className="font-bold mb-4">Help</h3>
                        <ul className="space-y-3 text-white text-sm">
                            {helpLinks.map((link, index) => (
                                <li key={index}>
                                    <CustomLink
                                        key={index}
                                        href={'#'}
                                    >
                                        {link}
                                    </CustomLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Address */}
                    <div>
                        <h3 className="font-bold mb-4">Address</h3>
                        <p className="text-whie text-sm">
                            Street 123 Lorem ipsum dolor sit amet, USA
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
}
