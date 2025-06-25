import React from 'react';
import Container from '../../shared/container';

export default function BuildBrandSection() {
  return (
    <Container parentStyle={'bg-white md:px-10 sm:px-8 px-4'} className="bg-black text-white lg:p-10 p-8 rounded-2xl">
      <div className=" mx-auto">
        {/* Header */}
        <h2 className=" md:text-4xl text-3xl lg:text-5xl font-medium mb-4">
          Build Your Brand.
        </h2>
        <p className="lg:text-3xl md:text-2xl text-xl mb-6">Connect. Close. Grow.</p>

        {/* Description */}
        <p className="text-lg lg:text-2xl sm:text-xl max-w-4xl mb-12 text-white/60">
          ALS enhances your visibility, showcasing the true value of real estate professionals.
          We give you a powerful presence—both globally and in your local market—
          so you can attract more clients, build trust, and grow your business.
        </p>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="lg:text-3xl sm:text-2xl text-xl font-semibold mb-3">Mission</h3>
            <p className="text-sm sm:text-base text-white/60">
              At ALS, we empower real estate professionals by enhancing their visibility,
              credibility, and connections. Our platform provides the tools needed to build
              a strong brand, connect with clients and agents globally, and close more deals—
              driving growth and success in the competitive real estate market.
            </p>
          </div>
          <div>
            <h3 className="lg:text-3xl sm:text-2xl text-xl font-semibold mb-3">Vision</h3>
            <p className="text-sm sm:text-base text-white/60">
              To be the leading platform that transforms how real estate professionals connect,
              market themselves, and grow their businesses—ensuring they are recognized for
              their value in every local and global market.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
