import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, ChefHat, Users, Camera } from 'lucide-react';

const images = [
    { url: '/images/uyghur-eats/interior.jpg', alt: 'Uyghur Eats Interior' },
    { url: '/images/uyghur-eats/laghman.jpg', alt: 'Signature Hand-Pulled Noodles' },
    { url: '/images/uyghur-eats/chicken.jpg', alt: 'Big Plate Chicken' }
];

type PropertyProfileProps = {
    basePath?: string;
};

export default function PropertyProfile({
    basePath = '/client/uyghur-eats-v5',
}: PropertyProfileProps) {
    return (
        <div className="min-h-screen bg-white text-black font-sans pb-24">
            {/* Floating Return Button */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed top-8 left-8 z-50"
            >
                <Link 
                    to={basePath}
                    className="flex items-center gap-3 px-4 py-2.5 bg-white border border-neutral-200 rounded-full shadow-lg hover:border-black transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Return to Proposal</span>
                </Link>
            </motion.div>

            {/* Header */}
            <header className="pt-32 pb-16 px-6 md:px-10 max-w-7xl mx-auto border-b border-neutral-100">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-6 font-bold">
                    <span>Ad Profile</span>
                    <span className="text-neutral-200">/</span>
                    <span>Asset Showcase</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-medium tracking-tight mb-8 max-w-4xl">
                    An Unrivaled Location with a Story to Tell.
                </h1>
                <div className="flex flex-wrap gap-4 items-center text-sm text-neutral-500">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 2412 Wisconsin Ave NW, DC</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    <span className="flex items-center gap-2"><ChefHat className="w-4 h-4" /> Authentic Uyghur Concept</span>
                </div>
            </header>

            {/* Content Sections */}
            <main className="px-6 md:px-10 max-w-7xl mx-auto py-24 space-y-32">
                
                {/* Visual Gallery Preview */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="aspect-[4/3] bg-neutral-100 border border-neutral-200 overflow-hidden relative group"
                        >
                            <img src={img.url} alt={img.alt} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            <div className="absolute bottom-4 left-4">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-white/80">{img.alt}</span>
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* Location Persistence */}
                <section className="grid md:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-2xl font-medium tracking-tight mb-6">Strategic Location</h2>
                        <p className="text-neutral-600 leading-relaxed text-lg mb-8 italic">
                            Situated at <strong>2412 Wisconsin Ave NW</strong>, the restaurant sits in a high-income, high-traffic corridor. The room combines high ceilings, cultural murals, and efficient seating density without reading as cramped.
                        </p>
                        <ul className="space-y-4 text-sm text-neutral-500">
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-black rounded-full" /> Size: 2,880 sqft retail space</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-black rounded-full" /> Demographics: Median HH Income $142K+</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-black rounded-full" /> Walk Score: 91 (Walker's Paradise)</li>
                        </ul>
                    </div>
                    <div className="p-10 bg-neutral-50 border border-neutral-200">
                         <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-4 font-bold">Acquisition Thesis</h3>
                         <p className="text-lg font-medium leading-snug">
                            Uyghur Eats is attractive because the product is difficult to replicate, the location is strong, and demand is already embedded in the neighborhood.
                         </p>
                    </div>
                </section>

                {/* Culinary Differentiation */}
                <section className="border-t border-neutral-100 pt-24">
                    <div className="max-w-3xl">
                        <h2 className="text-2xl font-medium tracking-tight mb-6">Culinary Draw</h2>
                        <p className="text-neutral-600 leading-relaxed text-lg mb-8">
                            The key value driver is <strong>daily hand-pulled laghman noodles</strong>. The menu wins because it is specific, labor-intensive, and hard to substitute nearby. Signature items include "Big Plate Chicken" and "Royal Laghman".
                        </p>
                    </div>
                </section>

            </main>
        </div>
    );
}
