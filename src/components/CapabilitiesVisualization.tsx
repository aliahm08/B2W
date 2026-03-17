import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ChevronRight, Layers, Database, Cpu, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

// The "ingredients" from the CSV
const ingredientsData = [
    {
        category: 'Information',
        icon: Database,
        items: [
            { id: 'financial-statements', label: 'Financial statements' },
            { id: 'project-proposals', label: 'Project proposals' },
            { id: 'engineering-drawings', label: 'Engineering drawings/floorplans' },
            { id: 'supplier-invoices', label: 'Supplier invoices' },
        ],
    },
    {
        category: 'Integrations',
        icon: Cpu,
        items: [
            { id: 'pos-analytics', label: 'POS analytics' },
            { id: 'instagram-analytics', label: 'Instagram analytics' },
            { id: 'google-analytics', label: 'Google analytics' },
            { id: 'website-scrubbing', label: 'Website scrubbing' },
        ],
    },
    {
        category: 'Production',
        icon: Activity,
        items: [
            { id: 'fullstack', label: 'Fullstack engineering' },
            { id: 'senior-analysis', label: 'Senior-level analysis' },
            { id: 'safety-risk', label: 'Safety Risk coordination' },
            { id: 'real-estate', label: 'Real Estate consulting' },
        ],
    },
];

// The "recipes" (Solutions) and the ingredient IDs they utilize
const recipes = [
    {
        id: 'financial-dashboard',
        name: 'Automated Financial Dashboard',
        description: 'Real-time sync of sales data and expenses for immediate P&L insights.',
        activeIngredients: ['financial-statements', 'pos-analytics', 'fullstack'],
    },
    {
        id: 'risk-assessment',
        name: 'Site Risk Assessment',
        description: 'Comprehensive safety evaluations based on structural blueprints and site data.',
        activeIngredients: ['engineering-drawings', 'website-scrubbing', 'safety-risk'],
    },
    {
        id: 'due-diligence',
        name: 'Acquisition Due Diligence',
        description: 'Deep-dive analysis of target companies combining local search intent and financial health.',
        activeIngredients: ['project-proposals', 'supplier-invoices', 'google-analytics', 'senior-analysis', 'real-estate'],
    },
];

export default function CapabilitiesVisualization() {
    const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);

    const activeRecipe = activeRecipeId ? recipes.find(r => r.id === activeRecipeId) : null;
    const activeIngredients = activeRecipe ? activeRecipe.activeIngredients : [];

    return (
        <div className="py-32 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
            >
                <h2 className="text-4xl font-medium tracking-tight mb-4">Capabilities</h2>
                <p className="max-w-3xl text-base text-neutral-600 leading-relaxed mb-6">
                    Think of us as a solutions kitchen. We take high-fidelity inputs, connect them 
                    through strategic integrations, and produce operational leverage. 
                    <br/><br/>
                    <strong>Select a recipe below</strong> to see how our ingredients combine into measurable solutions.
                </p>

                {/* Recipe Selectors */}
                <div className="flex flex-wrap gap-4 mb-2">
                    {recipes.map((recipe) => (
                        <button
                            key={recipe.id}
                            onClick={() => setActiveRecipeId(recipe.id === activeRecipeId ? null : recipe.id)}
                            className={`flex items-center gap-3 px-5 py-3 border transition-all duration-300 ${
                                activeRecipeId === recipe.id
                                    ? 'border-black bg-black text-white shadow-lg scale-105'
                                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-black hover:shadow-sm'
                            }`}
                        >
                            <Layers className={`w-4 h-4 ${activeRecipeId === recipe.id ? 'text-white' : 'text-neutral-500'}`} />
                            <span className="text-sm font-medium">{recipe.name}</span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Dynamic Ingredient Architecture Visualization */}
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative bg-neutral-50 border border-neutral-200 p-8 md:p-12 mb-12 rounded-sm overflow-hidden"
            >
                {/* Visual Connector Lines Background (abstract representation) */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-neutral-300" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-12">
                    {ingredientsData.map((category, colIndex) => {
                        const Icon = category.icon;
                        return (
                            <div key={category.category} className="flex flex-col relative">
                                <div className="flex items-center gap-3 mb-8 border-b border-neutral-200 pb-4">
                                    <div className="p-2 bg-white border border-neutral-200 shadow-sm rounded-sm">
                                        <Icon className="w-5 h-5 text-neutral-700" />
                                    </div>
                                    <h3 className="text-lg font-medium tracking-tight text-neutral-900">{category.category}</h3>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {category.items.map((item, itemIndex) => {
                                        const isActive = activeIngredients.includes(item.id);
                                        const isDimmed = activeRecipeId && !isActive;

                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ 
                                                    opacity: isDimmed ? 0.3 : 1,
                                                    x: isActive ? 4 : 0,
                                                    scale: isActive ? 1.02 : 1
                                                }}
                                                transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                                                className={`relative p-4 border transition-colors duration-300 group ${
                                                    isActive 
                                                        ? 'border-black bg-white shadow-md z-10' 
                                                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                                                }`}
                                            >
                                                {/* Active Left Border Accent */}
                                                {isActive && (
                                                    <motion.div 
                                                        layoutId="activeAccent"
                                                        className="absolute left-0 top-0 bottom-0 w-1 bg-black"
                                                    />
                                                )}
                                                
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm font-medium ${isActive ? 'text-black' : 'text-neutral-700'}`}>
                                                        {item.label}
                                                    </span>
                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="h-2 w-2 rounded-full bg-green-500"
                                                        />
                                                    )}
                                                </div>

                                                {/* Hover details tooltip (simulate architecture metadata) */}
                                                {!activeRecipeId && (
                                                    <div className="absolute left-full top-0 ml-2 w-48 bg-black text-white p-3 text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
                                                        Data node: {item.id}
                                                        <br/>
                                                        Status: Ready for integration
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Flow indicators between columns */}
                                {colIndex < 2 && (
                                    <div className="hidden md:flex absolute top-1/2 -right-4 lg:-right-6 w-8 h-px bg-neutral-300 transform -translate-y-1/2 items-center justify-center">
                                        <ChevronRight className="w-4 h-4 text-neutral-400 bg-neutral-50" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Recipe Description Panel */}
                <AnimatePresence>
                    {activeRecipe && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: 10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: 10 }}
                            transition={{ duration: 0.4 }}
                            className="mt-12 bg-black text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden"
                        >
                            <div>
                                <h4 className="text-lg font-medium mb-2 text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-green-400" />
                                    Solution Active: {activeRecipe.name}
                                </h4>
                                <p className="text-neutral-400 text-sm max-w-2xl leading-relaxed">
                                    {activeRecipe.description}
                                </p>
                            </div>
                            <div className="shrink-0 text-xs font-mono text-neutral-500 bg-neutral-900 border border-neutral-800 px-4 py-2">
                                {activeIngredients.length} INGREDIENTS SYNCED
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex justify-center"
            >
                <Link
                    to="/capabilities"
                    className="inline-flex items-center gap-3 border border-neutral-200 bg-white px-6 py-4 text-sm font-medium text-neutral-800 transition-all hover:border-black hover:bg-black hover:text-white group shadow-sm"
                >
                    Explore all use cases and capabilities
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
            </motion.div>
        </div>
    );
}
