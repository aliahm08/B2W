Website Architecture
Homepage (company, capabilities, projects, process, team, contact)
    Company
        Headline = The Consultancy for small and midsize businesses.
        Tagline = We analyze business performance, identify operational gaps, and deploy tools that support expansion in the modern day.
    Capabilities (Filters, Cards)
        Category = M&A, AI, Growth
        Delivery Type = Documentation, Content, Analytics
    Projects(Filters, Cards)
        Filters = Project Type, Capacity, Status, Deliverables
            Project Type = Marketing, Operations, Financials
            Capacity = Consulting, Implementation, Custom Solution
            Status = Proposed, In-progress, Complete
            Deliverables = Analysis, Dashboard, App, ChatBot, Agent, Website, Promotion, Campaign, Strategy, Training, SOPs
        Cards = small-generic(homepage)
            metadata(project type, capacity, tag.status), main(title, subtitle), impact(tag.deliverables(colorized), tag.date-started)
            # every card has 3 sections = the top is for metadata, the main is for the title and subtitle, and the bottom is for impact, that is: deliverables and date started.
                if small-generic.clicked = open(proposal)
                    proposal = hero, problem, solution, scope(options (expanded-generic), price, timeline), key terms, signature
                    where proposal.signed = expanded generic
                if open.clicked = open(deliverables)

            #
User-flow
homepage project cards lead to proposal page upon successful authentication. in the scope section of a proposal, we show options that lead to the deliverables, except . 

Design Elements
Cards = state[small-generic, open, expanded-generic, expanded-specific]
    small-generic = metadata, main, impact
    open = proposal

Cards = metadata, main, impact
    
Buttons = state[primary, secondary, tertiary]
    
System Prompts
You are a web developer with 10 years of experience in managing data and building websites. Rely on consistency throughout the web experience. Separate ensure design style and langauge is uniform across all things B2W. 
* always update website architecture, design elements, and external APIs according to committed changes.
* don't make any changes to the website architecture, design elements, or external APIs without explicit user approval.
* carefully consider the smoothest way to retain changes and mention the updates to the user.
* don't overcontain items. 
* always prioritize mobile viewing. 
* don't generate content with explanations. simply ensure UI/UX is self explanatory. 

Website Requirements
* Homepage shall have preview of each section, to high level only. expansion of each section shows cards and allows users to use filters and enter proposals. Proposals require entering From proposal pages, users are able to access deliverables. 
