'use client'
import React, { useState, useEffect } from 'react';
import AgentPage from '../agent-page';
import ConsumerPage from '../consumer-page';
import HomePage from './home-page';

const MainPage = () => {
    const [view, setView] = useState('home');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname.toLowerCase();

            if (hostname.startsWith('consumer')) {
                setView('consumer');
            } else if (hostname.startsWith('agent.')) {
                setView('agent');
            } else {
                setView('home');
            }
        }
    }, []);

    console.log("View : ",view)

    return (
        <div>
            {view === 'consumer' && <ConsumerPage />}
            {view === 'agent' && <AgentPage />}
            {view === 'home' && <HomePage />}
        </div>
    );
};

export default MainPage;
