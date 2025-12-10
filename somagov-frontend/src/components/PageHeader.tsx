import React from 'react';

interface PageHeaderProps {
    title: string;
    description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <section className="bg-primary text-white py-16 px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg">{description}</p>
        </section>
    );
}
