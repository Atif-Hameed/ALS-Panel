import React from 'react'
import Container from './container'

const HeroBanner = ({ bgStyle, children }) => {
    return (
        <Container
            parentStyle={`bg-cover md:!h-[85vh] !h-[74vh] relative ${bgStyle}`}
            className={'lg:px-16 sm:px-8 px-4'}
        >
            {children}
        </Container>
    )
}

export default HeroBanner
