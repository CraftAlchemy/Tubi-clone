import React, { useState } from 'react';

interface FAQPageProps {
    siteName: string;
}

const FAQItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-700 last:border-b-0">
            <button
                className="w-full flex justify-between items-center text-left py-5 px-6"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="text-lg font-semibold text-white">{question}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                    <PlusIcon />
                </span>
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-gray-300 leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FAQPage: React.FC<FAQPageProps> = ({ siteName }) => {
    const faqs = [
        {
            q: `What is ${siteName}?`,
            a: `${siteName} is a premium streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price.`
        },
        {
            q: `How much does ${siteName} cost?`,
            a: `Watch ${siteName} on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $9.99 to $19.99 a month. No extra costs, no contracts.`
        },
        {
            q: `Where can I watch?`,
            a: `Watch anywhere, anytime. Sign in with your ${siteName} account to watch instantly on the web at ${siteName.toLowerCase().replace(/\s/g, '')}.com from your personal computer or on any internet-connected device that offers the ${siteName} app, including smart TVs, smartphones, tablets, streaming media players and game consoles.`
        },
        {
            q: `How do I cancel?`,
            a: `${siteName} is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.`
        }
    ];

    return (
        <div className="pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-12">
                    Frequently Asked Questions
                </h1>
                <div className="bg-myflix-gray rounded-lg shadow-lg">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.q}>
                            <p>{faq.a}</p>
                        </FAQItem>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

export default FAQPage;
