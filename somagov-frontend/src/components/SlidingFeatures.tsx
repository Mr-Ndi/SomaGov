import React from 'react';

const features = [
    { title: "Anonymous Reporting", icon: "🛡️", desc: "Report issues safely without revealing your identity." },
    { title: "Real-time Tracking", icon: "📊", desc: "Monitor the status of your complaints in real-time." },
    { title: "Government Response", icon: "🏛️", desc: "Get direct feedback and resolutions from agencies." },
    { title: "Community Impact", icon: "🤝", desc: "See how your reports improve public services." },
    { title: "Multilingual Support", icon: "🌍", desc: "Accessible in Kinyarwanda and English." },
];

export default function SlidingFeatures() {
    return (
        <div className="w-full overflow-hidden py-10 bg-gray-50">
            <div className="relative w-full flex">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...features, ...features].map((feature, index) => (
                        <div
                            key={index}
                            className="mx-4 w-64 bg-white p-6 rounded-xl shadow-md border border-blue-50 flex-shrink-0 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="text-lg font-semibold text-primary mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600 whitespace-normal">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
