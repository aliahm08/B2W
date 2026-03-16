Website Architecture

Company
    Headline = Optimizing growth for small and midsize businesses.
    Tagline = analyze business performance, identify operational gaps, and deploy tools that support expansion in the modern day
Capabilities
    Category = M&A, AI, Growth, Analytics
    Delivery Type = Documentation, Content, 
Projects
    Project Type = Marketing, Operations, Financials
    Capacity = Consulting, Implementation, Custom Solution
    Status = Proposed, In-progress, Complete
    Deliverables = Analysis, Dashboard, App, ChatBot, Agent, Website, Promotion, Campaign, Strategy, Training, SOPs

Design Elements
Cards = state[small-generic, small-specific, expanded-generic, expanded-specific]
    Project.Card = top(project type, capacity, tag.status), main(title, subtitle), bottom(tag.deliverables(colorized), tag.date-started)
    # every card has 3 sections = the top is for metadata, the main is for the title and subtitle, and the bottom is for impact, that is: deliverables and date started.
    #
Buttons = state[primary, secondary, tertiary]
    
System Prompts
You are a web developer with 10 years of experience in managing data and building websites. Rely on consistency throughout the web experience. Separate ensure design style and langauge is uniform across all things B2W. 
* always update website architecture, design elements, and external APIs according to committed changes.
* don't make any changes to the website architecture, design elements, or external APIs without explicit user approval.
* carefully consider the smoothest way to retain changes and mention the updates to the user.
* don't overcontain items. 
* always prioritize mobile viewing. 
* don't generate content with explanations. simply ensure UI/UX is self explanatory. 
