import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { allCapabilities } from '../src/content/capabilities.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html not found. Please run vite build first.');
    process.exit(1);
}

const originalHtml = fs.readFileSync(indexPath, 'utf-8');

interface RouteSeo {
    path: string;
    title: string;
    description: string;
}

const routes: RouteSeo[] = [
    {
        path: '/',
        title: 'B2W | Consulting for Small to Midsize Businesses',
        description: 'B2W helps small and midsize businesses analyze performance, identify operational gaps, and deploy modern tools to support sustainable expansion.'
    },
    {
        path: '/capabilities',
        title: 'Our Capabilities & Use Cases | B2W',
        description: 'Explore our full range of consulting capabilities, from business performance analysis to evaluating operational gaps and deploying modern expansion tools.'
    },
    {
        path: '/borek-g-social-media-management',
        title: 'Turkish Bistro in Falls Church, VA',
        description: 'Social media management and marketing profile for Borek-G covering reputation strength, discovery coverage, social traction, channel depth, and restaurant growth potential in Falls Church.'
    },
    {
        path: '/borek-g-operations',
        title: 'Borek-G | Growth Proposal',
        description: 'Growth systems proposal for Borek-G. Review our consulting engagement scope, strategies for local discovery, and phased implementation recommendations.'
    },
    {
        path: '/sabucnu-operations',
        title: 'Sabucnu Contractors | Operations Profile',
        description: 'Operations analysis for Sabucnu Contractors. Detailed evaluation of workforce coordination, standard operating procedures, and scheduling systems.'
    },
    {
        path: '/uyghur-eats',
        title: 'Uyghur Eats | Business Opportunity Profile',
        description: 'Comprehensive business profile for Uyghur Eats. Explore the location footprint, culinary draw, community integration, and acquisition thesis for this Washington, DC restaurant.'
    },
    {
        path: '/client/uyghur-eats',
        title: 'Uyghur Eats | Client Portal',
        description: 'Secure client portal for Uyghur Eats. Review business sale preparation deliverables, valuation models, operations documentation, and buyer packages from B2W.'
    },
    {
        path: '/uyghur-eats-valuation',
        title: 'Uyghur Eats | Valuation Model & Financial Scenarios',
        description: 'Financial snapshot and valuation modeling for Uyghur Eats, featuring revenue mix, cost structure, buyer scenarios, and capacity analysis for a property sale.'
    },
    {
        path: '/uyghur-eats-data-room',
        title: 'Uyghur Eats | Buyer Due Diligence Data Room',
        description: 'Secure buyer information package and data room for Uyghur Eats, organizing financial records, operations, leases, and digital assets for due diligence.'
    }
];

// Add dynamic capabilities pages
allCapabilities.forEach(capability => {
    routes.push({
        path: `/capabilities/${capability.slug}`,
        title: `${capability.title} | Capability`,
        description: `Explore how our ${capability.title} capability helps address operational gaps, streamline workflows, and support expansion.`
    });
});

function replaceSeoTags(html: string, title: string, description: string): string {
    let newHtml = html;
    
    // Replace <title>
    newHtml = newHtml.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    
    // Replace standard description
    newHtml = newHtml.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}">`);
    
    // Replace Open Graph title and description
    newHtml = newHtml.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}">`);
    newHtml = newHtml.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${description}">`);
    
    // Replace Twitter title and description
    newHtml = newHtml.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${title}">`);
    newHtml = newHtml.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${description}">`);

    // Ensure fallback if regex fails due to line breaks or slightly different formatting
    if (!newHtml.includes(`content="${title}"`)) {
        console.warn(`Warning: Regex replacement might have failed for ${title}`);
    }

    return newHtml;
}

console.log(`Generating static SEO HTML files for ${routes.length} routes...`);

let successCount = 0;

for (const route of routes) {
    if (route.path === '/') continue; // We already have index.html, though we could rewrite it if needed, but Vite builds the global one correctly.

    // If it's a root route like `/capabilities`, Vercel serves `dist/capabilities/index.html` or `dist/capabilities.html`
    // It's safest to create a folder and `index.html`
    const routeDir = path.join(distPath, route.path.substring(1));
    const targetHtmlPath = path.join(routeDir, 'index.html');

    if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
    }

    const customHtml = replaceSeoTags(originalHtml, route.title, route.description);
    fs.writeFileSync(targetHtmlPath, customHtml, 'utf-8');
    successCount++;
}

// Rewrite root index.html to have the default global SEO just to be safe
const rootSeo = routes.find(r => r.path === '/');
if (rootSeo) {
    const customHtml = replaceSeoTags(originalHtml, rootSeo.title, rootSeo.description);
    fs.writeFileSync(indexPath, customHtml, 'utf-8');
    successCount++;
}

console.log(`Successfully generated ${successCount} static HTML files with custom SEO.`);
