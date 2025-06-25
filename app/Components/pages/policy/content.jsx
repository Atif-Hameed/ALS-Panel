'use client'
import React from 'react';
import Container from '../../shared/container';

const Content = ({ data }) => {
    

    return (
        <Container parentStyle={'bg-gray-50'} className="h-full py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                
                {/* Content */}
                <div className="p-8">
                    {/* Add custom styles for tables */}
                    <style jsx global>{`
                        .content-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 1rem 0;
                        }
                        .content-table th {
                            background-color: #f3f4f6;
                            text-align: left;
                            font-weight: 600;
                            padding: 0.75rem;
                            border: 1px solid #d1d5db;
                        }
                        .content-table td {
                            padding: 0.75rem;
                            border: 1px solid #d1d5db;
                        }
                        .content-table tr:nth-child(even) {
                            background-color: #f9fafb;
                        }
                    `}</style>
                    
                    {/* Render the HTML content from the API */}
                    <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: data.content }}
                    />
                    
                    {/* Confirmation Statement */}
                    <section className="mt-12">
                        <p className="text-gray-600">
                            By continuing to use AgentListingservice.com, you confirm that you have read, 
                            understood, and agreed to every section of this {data.pageName}.
                        </p>
                    </section>
                </div>
            </div>
        </Container>
    );
};

export default Content;