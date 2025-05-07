import React from 'react'

const Container = ({ children, className, parentStyle }) => {
    return (
        <div className={`w-full flex justify-center h-full ${parentStyle}`}>
            <div className={`max-w-[1780px] w-full  mx-auto lg:px-16 sm:px-8 px-4  ${className}`}>
                {children}
            </div>
        </div>
    )
}

export default Container
