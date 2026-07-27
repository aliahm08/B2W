from pathlib import Path
from textwrap import wrap

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "jasonai-executive-strategy.pdf"
PUBLIC_OUTPUT = ROOT / "public" / "documents" / "jasonai-executive-strategy.pdf"
COVER_IMAGE = ROOT / "public" / "images" / "jasonai" / "pdf" / "executive-strategy-cover-background.jpg"
SECTION_IMAGE = ROOT / "public" / "images" / "jasonai" / "pdf" / "executive-strategy-section-background.jpg"

PAGE = landscape(letter)
W, H = PAGE
BLACK = HexColor("#090909")
INK = HexColor("#111111")
GRAY = HexColor("#666666")
LIGHT = HexColor("#E7E7E7")
PALE = HexColor("#F5F5F3")
WHITE = HexColor("#FFFFFF")
EMERALD = HexColor("#8FAE9F")
EMERALD_DARK = HexColor("#516B5F")
PRICING_TINT = HexColor("#F0ECE6")
PRICING_ACCENT = HexColor("#6B5744")
PRODUCT_TINT = HexColor("#E9EDF0")
PRODUCT_ACCENT = HexColor("#4E5D67")
SUCCESS_TINT = HexColor("#E9EEE9")
SUCCESS_ACCENT = HexColor("#526157")

PHASES = [
    {
        "number": "01",
        "label": "Foundation",
        "period": "AUG-OCT 2026",
        "curve": "INVEST",
        "objective": "Deliver useful output fast enough to earn payment.",
        "kpis": [
            {
                "type": "PRICING",
                "name": "Customers willing to pay",
                "owner": "CEO",
                "minimum": "3 pilot customers agree to pay after seeing JasonAI work.",
                "target": "5 customers willing to pay $10-$25 per month.",
                "tasks": [
                    "Recruit five qualified pilot teams.",
                    "Run pricing interviews after live demonstrations.",
                    "Document objections and payment commitments.",
                    "Select the initial paid package and contract terms.",
                ],
            },
            {
                "type": "PRODUCT",
                "name": "Useful-output rate",
                "owner": "CTO",
                "minimum": "80% of reviewed outputs are useful.",
                "target": "90% require little or no correction.",
                "tasks": [
                    "Define the useful-output review rubric.",
                    "Instrument quality and correction tracking.",
                    "Resolve the highest-frequency failure cases.",
                    "Complete privacy and audit controls for pilot data.",
                ],
            },
            {
                "type": "SUCCESS",
                "name": "Time to first value",
                "owner": "COO",
                "minimum": "Useful output within 15 minutes of onboarding.",
                "target": "Useful output within 5 minutes.",
                "tasks": [
                    "Create the owner onboarding checklist.",
                    "Measure setup time for every pilot.",
                    "Remove unnecessary onboarding steps.",
                    "Collect feedback after the first successful session.",
                ],
            },
        ],
    },
    {
        "number": "02",
        "label": "Validation",
        "period": "NOV 2026-JAN 2027",
        "curve": "VALIDATE",
        "objective": "Retain teams and prove measurable value.",
        "kpis": [
            {
                "type": "PRICING",
                "name": "Pilot-to-paid conversion",
                "owner": "CEO",
                "minimum": "30% pilot-to-paid conversion.",
                "target": "50% pilot-to-paid conversion.",
                "tasks": [
                    "Run structured pilot exit and conversion calls.",
                    "Package verified ROI evidence for each account.",
                    "Test monthly and annual payment options.",
                    "Review every lost conversion and update the offer.",
                ],
            },
            {
                "type": "PRODUCT",
                "name": "Four-week team retention",
                "owner": "CTO",
                "minimum": "50% of pilot teams remain active at week four.",
                "target": "65% of pilot teams remain active at week four.",
                "tasks": [
                    "Define meaningful weekly team activity.",
                    "Build cohort retention reporting.",
                    "Improve reminders and follow-up behaviors.",
                    "Prioritize workflows that drive repeated use.",
                ],
            },
            {
                "type": "SUCCESS",
                "name": "Verified hours saved",
                "owner": "COO",
                "minimum": "1 verified hour saved per team each week.",
                "target": "2 verified hours saved per team each week.",
                "tasks": [
                    "Establish a pre-JasonAI time baseline.",
                    "Run weekly value check-ins with owners.",
                    "Validate time-saved claims with each account.",
                    "Issue a monthly value summary.",
                ],
            },
        ],
    },
    {
        "number": "03",
        "label": "Inflection",
        "period": "FEB-JUL 2027",
        "curve": "PROVE",
        "objective": "Use proven ROI to support pricing and retention.",
        "kpis": [
            {
                "type": "PRICING",
                "name": "Average revenue per team",
                "owner": "CEO",
                "minimum": "$40 average monthly revenue per team.",
                "target": "$75 average monthly revenue per team.",
                "tasks": [
                    "Launch tiered, value-based pricing.",
                    "Identify and sell usage-expansion triggers.",
                    "Track discounts and realized revenue.",
                    "Package ROI evidence for higher-value tiers.",
                ],
            },
            {
                "type": "PRODUCT",
                "name": "Eight-week retention",
                "owner": "CTO",
                "minimum": "60% of teams remain active at week eight.",
                "target": "75% of teams remain active at week eight.",
                "tasks": [
                    "Instrument eight-week retention cohorts.",
                    "Ship the owner dashboard and ROI view.",
                    "Automate high-value follow-up workflows.",
                    "Improve context reliability across conversations.",
                ],
            },
            {
                "type": "SUCCESS",
                "name": "Customer-confirmed ROI",
                "owner": "COO",
                "minimum": "70% of customers confirm positive ROI.",
                "target": "85% of customers confirm positive ROI.",
                "tasks": [
                    "Run a structured quarterly ROI review.",
                    "Flag low-value accounts before renewal.",
                    "Execute intervention plans for at-risk teams.",
                    "Publish approved customer case studies.",
                ],
            },
        ],
    },
    {
        "number": "04",
        "label": "Scale",
        "period": "AUG 2027-JAN 2028",
        "curve": "SCALE",
        "objective": "Repeat acquisition, onboarding, and retention efficiently.",
        "kpis": [
            {
                "type": "PRICING",
                "name": "LTV:CAC",
                "owner": "CEO",
                "minimum": "3x lifetime value to acquisition cost.",
                "target": "4x lifetime value to acquisition cost.",
                "tasks": [
                    "Measure CAC by acquisition channel.",
                    "Maintain a cohort-based LTV model.",
                    "Scale only channels above the minimum gate.",
                    "Launch referral and partner acquisition motions.",
                ],
            },
            {
                "type": "PRODUCT",
                "name": "Weekly active teams",
                "owner": "CTO",
                "minimum": "80% of retained teams are active weekly.",
                "target": "90% of retained teams are active weekly.",
                "tasks": [
                    "Deliver self-service onboarding.",
                    "Release vertical workflow templates.",
                    "Track feature and workflow usage.",
                    "Meet production reliability targets.",
                ],
            },
            {
                "type": "SUCCESS",
                "name": "Monthly logo churn",
                "owner": "COO",
                "minimum": "Less than 4% monthly logo churn.",
                "target": "Less than 3% monthly logo churn.",
                "tasks": [
                    "Deploy customer health monitoring.",
                    "Run proactive churn-prevention playbooks.",
                    "Schedule recurring executive value reviews.",
                    "Classify every cancellation cause.",
                ],
            },
        ],
    },
    {
        "number": "05",
        "label": "Platform",
        "period": "FEB-JUL 2028",
        "curve": "EXPAND",
        "objective": "Expand customer usage and spend over time.",
        "kpis": [
            {
                "type": "PRICING",
                "name": "Net revenue retention",
                "owner": "CEO",
                "minimum": "110% net revenue retention.",
                "target": "120% net revenue retention.",
                "tasks": [
                    "Launch expansion and usage-based pricing.",
                    "Maintain account-level expansion forecasts.",
                    "Develop enterprise and partner packages.",
                    "Review net revenue retention monthly.",
                ],
            },
            {
                "type": "PRODUCT",
                "name": "Multi-workflow adoption",
                "owner": "CTO",
                "minimum": "50% of teams use at least two workflows.",
                "target": "70% of teams use at least two workflows.",
                "tasks": [
                    "Ship a modular agent and workflow system.",
                    "Add priority business integrations.",
                    "Harden context, access, and permissions.",
                    "Track adoption by workflow and customer segment.",
                ],
            },
            {
                "type": "SUCCESS",
                "name": "Customer ROI score",
                "owner": "COO",
                "minimum": "85 out of 100 average ROI score.",
                "target": "90 out of 100 average ROI score.",
                "tasks": [
                    "Standardize the customer ROI scorecard.",
                    "Benchmark results across account cohorts.",
                    "Create account expansion plans from ROI data.",
                    "Issue recurring executive value reports.",
                ],
            },
        ],
    },
]

MEETINGS = [
    {
        "day": "MONDAY",
        "duration": "60 MINUTES",
        "name": "Executive Operating Review",
        "lead": "CEO",
        "purpose": "Set the company priority, inspect the active phase gate, and resolve cross-functional decisions.",
        "flow": [
            "00-05  Restate the phase objective and weekly outcome.",
            "05-20  Review KPI movement, gate risk, and exceptions.",
            "20-40  Decide the two or three issues blocking progress.",
            "40-55  Assign commitments with owner, metric, and date.",
            "55-60  Read back decisions and deprioritized work.",
        ],
        "outputs": ["One weekly priority", "Decision log", "Named commitments", "Recorded escalations"],
    },
    {
        "day": "WEDNESDAY",
        "duration": "45 MINUTES",
        "name": "Product + Customer Checkpoint",
        "lead": "CTO",
        "purpose": "Turn live customer evidence into product decisions before quality, privacy, or delivery risks compound.",
        "flow": [
            "00-10  Review incidents, quality, and delivery confidence.",
            "10-20  Review the highest-value customer signal.",
            "20-35  Decide fixes, experiments, and scope changes.",
            "35-45  Confirm owners, measures, and communication.",
        ],
        "outputs": ["Ranked interventions", "Acceptance criteria", "Customer communication", "Escalation list"],
    },
    {
        "day": "FRIDAY",
        "duration": "45 MINUTES",
        "name": "KPI + Commitments Review",
        "lead": "COO",
        "purpose": "Close the week with verified results, completed task reports, captured learning, and a clean Monday agenda.",
        "flow": [
            "00-15  Score commitments complete, incomplete, or invalid.",
            "15-25  Compare active KPIs with gate and goal.",
            "25-35  Capture evidence and changed assumptions.",
            "35-45  Accept carryovers and draft Monday decisions.",
        ],
        "outputs": ["Current dashboard", "Evidenced work", "Accepted carryovers", "Monday decision agenda"],
    },
]

RESPONSIBILITIES = [
    ("CEO", "Monday operating review", "Pricing, market selection, revenue, partnerships, capital, and final phase-priority decisions."),
    ("CTO", "Wednesday product checkpoint", "Product quality, architecture, delivery, reliability, and safety and privacy risk."),
    ("COO", "Friday KPI review", "Scorecard, customer success, onboarding, action tracking, and meeting follow-through."),
]

MEETING_PROTOCOL = [
    (
        "BEFORE",
        "24 HOURS BEFORE",
        "COO coordinates; every KPI owner contributes.",
        [
            "Update KPI results, task reports, quantities, evidence, and tracked metrics.",
            "Submit only topics requiring a decision, tradeoff, or escalation.",
            "State the desired decision for every agenda item.",
        ],
    ),
    (
        "DURING",
        "TIMEBOXED",
        "Meeting lead facilitates; CEO resolves company tradeoffs.",
        [
            "Start with the scorecard and exceptions; do not read status updates aloud.",
            "Separate facts, assumptions, options, and the requested decision.",
            "End every topic with one owner, success measure, and due date.",
        ],
    ),
    (
        "AFTER",
        "WITHIN 2 HOURS",
        "COO maintains the operating record.",
        [
            "Publish decisions and actions with owners, dates, and measures.",
            "Update any changed result, task, phase gate, or priority.",
            "Escalate any unresolved blocker older than 48 hours to the CEO.",
        ],
    ),
]

OPERATING_RULES = [
    "One directly responsible individual for every action.",
    "No commitment without an owner, metric, and deadline.",
    "Record every decision, rationale, and revisit condition.",
    "Below-minimum metrics take priority over new scope.",
    "Keep routine updates asynchronous.",
]


def lines(text, width):
    return wrap(text, width=width, break_long_words=False, break_on_hyphens=False)


def tracked_metrics(kpi):
    name = kpi["name"].lower()
    if "customers willing" in name:
        return [
            "Qualified pilots recruited (#)",
            "Payment commitment rate (%)",
            "Willingness-to-pay range ($)",
            "Committed monthly recurring revenue ($)",
        ]
    if "pilot-to-paid" in name:
        return [
            "Completed pilots (#)",
            "Paid conversions (# and %)",
            "Average initial contract value ($)",
            "Median conversion cycle (days)",
        ]
    if "average revenue" in name:
        return [
            "Average monthly revenue per team ($)",
            "Expansion revenue per team ($)",
            "Discount rate (%)",
            "Realized price by package ($)",
        ]
    if "ltv:cac" in name:
        return [
            "Customer acquisition cost by channel ($)",
            "Estimated customer lifetime value ($)",
            "LTV:CAC ratio",
            "CAC payback period (months)",
        ]
    if "net revenue" in name:
        return [
            "Net revenue retention (%)",
            "Expansion monthly recurring revenue ($)",
            "Contraction revenue ($)",
            "Customer revenue churn (%)",
        ]
    if "useful-output" in name:
        return [
            "Outputs reviewed (#)",
            "Useful-output rate (%)",
            "Outputs requiring correction (%)",
            "Critical failure rate (%)",
        ]
    if "retention" in name:
        return [
            "Activated teams by cohort (#)",
            "Four- or eight-week retention (%)",
            "Weekly active team rate (%)",
            "Meaningful workflows per team (#)",
        ]
    if "weekly active" in name:
        return [
            "Paying teams (#)",
            "Weekly active teams (# and %)",
            "Meaningful workflows per team (#)",
            "Inactive or at-risk teams (#)",
        ]
    if "multi-workflow" in name:
        return [
            "Teams using two or more workflows (%)",
            "Workflow adoption by account (%)",
            "Active workflows per team (#)",
            "Integration-driven activity (%)",
        ]
    if "time to first" in name:
        return [
            "Median time to first value (minutes)",
            "Onboarding completion rate (%)",
            "First-session success rate (%)",
            "Setups requiring assistance (%)",
        ]
    if "hours saved" in name:
        return [
            "Verified hours saved per team per week",
            "Customers validating time saved (%)",
            "Baseline workflow time (minutes)",
            "Post-JasonAI workflow time (minutes)",
        ]
    if "churn" in name:
        return [
            "Monthly logo churn (%)",
            "At-risk accounts identified (#)",
            "Retention interventions completed (%)",
            "Accounts saved after intervention (%)",
        ]
    if "roi" in name:
        return [
            "Customers confirming positive ROI (%)",
            "Average customer ROI score",
            "Estimated monthly value delivered ($)",
            "ROI reviews completed on time (%)",
        ]
    return [
        "Current measured result",
        "Minimum-gate attainment (%)",
        "Target attainment (%)",
        "Week-over-week performance change (%)",
    ]


def draw_wrapped(c, text, x, y, width, font="Helvetica", size=9, leading=12, color=INK, max_lines=None):
    c.setFillColor(color)
    c.setFont(font, size)
    rows = lines(text, width)
    if max_lines:
        rows = rows[:max_lines]
    for row in rows:
        c.drawString(x, y, row)
        y -= leading
    return y


def draw_image_cover(c, image_path, x, y, width, height, vertical_alignment="center"):
    image = ImageReader(str(image_path))
    image_width, image_height = image.getSize()
    scale = max(width / image_width, height / image_height)
    rendered_width = image_width * scale
    rendered_height = image_height * scale
    rendered_y = y + (height - rendered_height) / 2
    if vertical_alignment == "bottom":
        rendered_y = y
    elif vertical_alignment == "top":
        rendered_y = y + height - rendered_height
    c.saveState()
    clip = c.beginPath()
    clip.rect(x, y, width, height)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(
        image,
        x + (width - rendered_width) / 2,
        rendered_y,
        rendered_width,
        rendered_height,
        mask="auto",
    )
    c.restoreState()


def draw_b2w_brand(c, x, y, logo_height, label):
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(x, y + logo_height * 0.32, "B2W")
    divider_x = x + 28
    c.setStrokeColor(Color(1, 1, 1, alpha=0.28))
    c.line(divider_x, y + 1, divider_x, y + logo_height - 1)
    c.setFillColor(WHITE)
    c.setFont("Courier", 7.5)
    c.drawString(divider_x + 10, y + 4, label)


def header(c, title, eyebrow):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    draw_image_cover(c, SECTION_IMAGE, 0, H - 126, W, 126)
    draw_b2w_brand(c, 27, H - 35, 24, "JASONAI")
    c.setFillColor(Color(1, 1, 1, alpha=0.55))
    c.setFont("Courier", 7)
    c.drawRightString(W - 28, H - 27, eyebrow)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(28, H - 83, title)


def footer(c, page_number):
    c.setStrokeColor(LIGHT)
    c.line(28, 25, W - 28, 25)
    c.setFillColor(GRAY)
    c.setFont("Courier", 6.5)
    c.drawString(28, 13, "EXECUTIVE STRATEGY  |  STATIC SNAPSHOT  |  JULY 2026")
    c.drawRightString(W - 28, 13, f"{page_number:02d}")


def cover(c):
    draw_image_cover(c, COVER_IMAGE, 0, 0, W, H)
    draw_b2w_brand(c, 40, H - 53, 28, "JASONAI EXECUTIVE STRATEGY")
    c.setFont("Helvetica-Bold", 37)
    c.drawString(40, H - 130, "The AI Assistant")
    c.setFillColor(HexColor("#C8C8C8"))
    c.setFont("Helvetica-Bold", 31)
    c.drawString(40, H - 170, "for Project Group")
    c.drawString(40, H - 205, "Chats")
    c.setFillColor(Color(1, 1, 1, alpha=0.76))
    c.setFont("Helvetica", 13)
    c.drawString(40, H - 246, "A 24-month operating strategy for the owners")
    c.drawString(40, H - 264, "of SMB general contractors.")
    meta = [
        ("TARGET CUSTOMER", "SMB General Contractors"),
        ("PRODUCT", "WhatsApp AI Assistant"),
        ("HORIZON", "August 2026 - July 2028"),
    ]
    y = H - 316
    for label, value in meta:
        c.setStrokeColor(Color(1, 1, 1, alpha=0.24))
        c.line(40, y + 18, W * 0.49, y + 18)
        c.setFillColor(Color(1, 1, 1, alpha=0.58))
        c.setFont("Courier", 7)
        c.drawString(40, y, label)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(150, y, value)
        y -= 39
    x = W * 0.55 + 34
    c.setFillColor(EMERALD)
    c.setFont("Courier", 8)
    c.drawString(x, H - 82, "24-MONTH ROADMAP")
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 24)
    draw_wrapped(c, "Build customer value before scaling the platform.", x, H - 125, 23, "Helvetica-Bold", 24, 28, WHITE)
    c.setFillColor(Color(1, 1, 1, alpha=0.7))
    draw_wrapped(
        c,
        "Earn the first payment. Retain active teams. Prove owner-confirmed ROI. Scale efficiently. Expand customer usage.",
        x,
        H - 235,
        39,
        "Helvetica",
        10,
        15,
        Color(1, 1, 1, alpha=0.7),
    )
    y = H - 340
    for i, item in enumerate(["Five phase gates", "Three accountable executives", "Pricing, product, and success KPIs"]):
        c.setFillColor(EMERALD)
        c.setFont("Courier", 7)
        c.drawString(x, y, f"{i + 1:02d}")
        c.setFillColor(WHITE)
        c.setFont("Helvetica", 10)
        c.drawString(x + 30, y, item)
        y -= 32
    c.setFillColor(Color(1, 1, 1, alpha=0.4))
    c.setFont("Courier", 7)
    c.drawString(x, 28, "CONFIDENTIAL - INTERNAL OPERATING DOCUMENT")
    c.showPage()


def overview(c, page_number):
    header(c, "Strategy Overview", "THE JASONAI J-CURVE")
    c.setFillColor(Color(1, 1, 1, alpha=0.72))
    c.setFont("Helvetica", 9)
    c.drawString(28, H - 105, "Build evidence in sequence: payment, retention, ROI, efficient scale, then expansion.")

    gx, gy, gw, gh = 28, 155, 465, 300
    c.setFillColor(BLACK)
    c.rect(gx, gy, gw, gh, fill=1, stroke=0)
    c.setFillColor(Color(1, 1, 1, alpha=0.4))
    c.setFont("Courier", 7)
    c.drawString(gx + 20, gy + gh - 24, "OPERATING PATH  |  AUG 2026 - JUL 2028")
    c.setStrokeColor(Color(1, 1, 1, alpha=0.18))
    c.setDash(5, 5)
    c.line(gx + 36, gy + 148, gx + gw - 36, gy + 148)
    c.setDash()
    path = c.beginPath()
    path.moveTo(gx + 52, gy + 205)
    path.curveTo(gx + 115, gy + 195, gx + 95, gy + 70, gx + 170, gy + 74)
    path.curveTo(gx + 250, gy + 76, gx + 274, gy + 152, gx + 350, gy + 178)
    path.curveTo(gx + 382, gy + 190, gx + 412, gy + 215, gx + 432, gy + 232)
    c.setStrokeColor(EMERALD)
    c.setLineWidth(4)
    c.drawPath(path, stroke=1, fill=0)
    points = [(52, 205), (170, 74), (267, 148), (350, 178), (432, 232)]
    for phase, (px, py) in zip(PHASES, points):
        c.setFillColor(BLACK)
        c.setStrokeColor(EMERALD)
        c.setLineWidth(3)
        c.circle(gx + px, gy + py, 14, fill=1, stroke=1)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(gx + px, gy + py - 3, phase["number"])
        c.setFillColor(Color(1, 1, 1, alpha=0.65))
        c.setFont("Helvetica", 7)
        offset = 25 if phase["number"] != "02" else -31
        c.drawCentredString(gx + px, gy + py + offset, phase["curve"])
    c.setFillColor(Color(1, 1, 1, alpha=0.45))
    c.setFont("Courier", 7)
    c.drawString(gx + 36, gy + 28, "AUG 2026")
    c.drawRightString(gx + gw - 36, gy + 28, "JUL 2028")

    rx = 515
    c.setFillColor(PALE)
    c.rect(rx, gy, W - rx - 28, gh, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(rx + 18, gy + gh - 28, "Five phase gates")
    y = gy + gh - 58
    for phase in PHASES:
        c.setFillColor(EMERALD_DARK)
        c.setFont("Courier-Bold", 7)
        c.drawString(rx + 18, y, phase["number"])
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(rx + 44, y, phase["label"])
        c.setFillColor(GRAY)
        c.setFont("Courier", 6)
        c.drawRightString(W - 45, y, phase["period"])
        y = draw_wrapped(c, phase["objective"], rx + 44, y - 14, 35, "Helvetica", 7.5, 10, GRAY)
        y -= 12
    footer(c, page_number)
    c.showPage()


def phase_page(c, phase, page_number):
    header(c, f"{phase['number']}  {phase['label']}", f"{phase['period']}  |  {phase['curve']}")
    c.setFillColor(Color(1, 1, 1, alpha=0.72))
    c.setFont("Helvetica", 10)
    c.drawString(28, H - 106, phase["objective"])
    c.setFillColor(EMERALD)
    c.setFont("Courier-Bold", 7)
    c.drawRightString(W - 28, H - 105, "PRICING  +  PRODUCT  +  SUCCESS")

    gap = 12
    margin = 28
    card_w = (W - margin * 2 - gap * 2) / 3
    card_y = 48
    card_h = H - 176
    kpi_palettes = [
        (PRICING_TINT, PRICING_ACCENT),
        (PRODUCT_TINT, PRODUCT_ACCENT),
        (SUCCESS_TINT, SUCCESS_ACCENT),
    ]
    for index, kpi in enumerate(phase["kpis"]):
        banner_color, accent_color = kpi_palettes[index]
        x = margin + index * (card_w + gap)
        c.setFillColor(WHITE)
        c.setStrokeColor(LIGHT)
        c.setLineWidth(1)
        c.rect(x, card_y, card_w, card_h, fill=1, stroke=1)
        c.setFillColor(banner_color)
        c.rect(x, card_y + card_h - 70, card_w, 70, fill=1, stroke=0)
        c.setFillColor(accent_color)
        c.rect(x, card_y + card_h - 70, 4, 70, fill=1, stroke=0)
        c.setFillColor(accent_color)
        c.setFont("Courier-Bold", 7)
        c.drawString(x + 16, card_y + card_h - 21, kpi["type"])
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 13)
        draw_wrapped(c, kpi["name"], x + 16, card_y + card_h - 43, 27, "Helvetica-Bold", 13, 15, INK, 2)
        c.setFillColor(GRAY)
        c.setFont("Courier", 6.5)
        c.drawString(x + 16, card_y + card_h - 92, "OWNER")
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 9)
        c.drawRightString(x + card_w - 16, card_y + card_h - 92, kpi["owner"])
        y = card_y + card_h - 122
        c.setFillColor(GRAY)
        c.setFont("Courier", 6.5)
        c.drawString(x + 16, y, "MINIMUM GATE")
        y = draw_wrapped(c, kpi["minimum"], x + 16, y - 15, 38, "Helvetica", 8, 11, INK) - 10
        c.setFillColor(accent_color)
        c.setFont("Courier-Bold", 6.5)
        c.drawString(x + 16, y, "TARGET")
        y = draw_wrapped(c, kpi["target"], x + 16, y - 15, 38, "Helvetica-Bold", 8, 11, accent_color) - 13
        c.setStrokeColor(LIGHT)
        c.line(x + 16, y, x + card_w - 16, y)
        y -= 20
        c.setFillColor(GRAY)
        c.setFont("Courier", 6.5)
        c.drawString(x + 16, y, "TRACKED METRICS")
        y -= 18
        for task_index, task in enumerate(tracked_metrics(kpi), 1):
            c.setFillColor(accent_color)
            c.setFont("Courier-Bold", 6.5)
            c.drawString(x + 16, y, f"{task_index:02d}")
            y = draw_wrapped(c, task, x + 39, y, 32, "Helvetica", 7.5, 10, INK) - 8

    footer(c, page_number)
    c.showPage()


def meeting_cadence_page(c, page_number):
    header(c, "Executive Meeting Cadence", "GOVERNANCE  |  2H 30M PER WEEK")
    c.setFillColor(Color(1, 1, 1, alpha=0.72))
    c.setFont("Helvetica", 9)
    c.drawString(28, H - 106, "Three focused meetings connect phase priorities, customer evidence, and accountable execution.")

    row_colors = [HexColor("#242424"), HexColor("#343434"), HexColor("#464646")]
    row_height = 118
    row_gap = 10
    left_width = 184
    row_y = H - 126 - row_height - 13
    for index, meeting in enumerate(MEETINGS):
        c.setFillColor(WHITE)
        c.setStrokeColor(LIGHT)
        c.rect(28, row_y, W - 56, row_height, fill=1, stroke=1)
        c.setFillColor(row_colors[index])
        c.rect(28, row_y, left_width, row_height, fill=1, stroke=0)
        c.setFillColor(EMERALD)
        c.setFont("Courier-Bold", 7)
        c.drawString(44, row_y + row_height - 22, meeting["day"])
        c.setFillColor(Color(1, 1, 1, alpha=0.65))
        c.drawRightString(28 + left_width - 16, row_y + row_height - 22, meeting["duration"])
        c.setFillColor(WHITE)
        draw_wrapped(
            c,
            meeting["name"],
            44,
            row_y + row_height - 48,
            23,
            "Helvetica-Bold",
            14,
            16,
            WHITE,
            2,
        )
        c.setFillColor(Color(1, 1, 1, alpha=0.58))
        c.setFont("Courier", 6.5)
        c.drawString(44, row_y + 18, "LEAD")
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 10)
        c.drawRightString(28 + left_width - 16, row_y + 18, meeting["lead"])

        content_x = 28 + left_width + 18
        c.setFillColor(GRAY)
        c.setFont("Courier", 6.2)
        c.drawString(content_x, row_y + row_height - 19, "PURPOSE")
        draw_wrapped(
            c,
            meeting["purpose"],
            content_x,
            row_y + row_height - 35,
            50,
            "Helvetica",
            7.4,
            9,
            INK,
            2,
        )

        agenda_x = content_x + 278
        c.setFillColor(GRAY)
        c.setFont("Courier", 6.2)
        c.drawString(agenda_x, row_y + row_height - 19, "TIMEBOXED FLOW")
        agenda_y = row_y + row_height - 35
        for item in meeting["flow"]:
            agenda_y = draw_wrapped(
                c,
                item,
                agenda_x,
                agenda_y,
                35,
                "Helvetica",
                5.8,
                7,
                INK,
                2,
            ) - 4

        outputs_x = W - 140
        c.setFillColor(GRAY)
        c.setFont("Courier", 6.2)
        c.drawString(outputs_x, row_y + row_height - 19, "REQUIRED OUTPUTS")
        output_y = row_y + row_height - 35
        for output in meeting["outputs"]:
            c.setFillColor(EMERALD_DARK)
            c.setFont("Courier-Bold", 6.2)
            c.drawString(outputs_x, output_y, "+")
            c.setFillColor(INK)
            output_y = draw_wrapped(
                c,
                output,
                outputs_x + 12,
                output_y,
                18,
                "Helvetica",
                6.2,
                7.5,
                INK,
                2,
            ) - 6
        row_y -= row_height + row_gap

    footer(c, page_number)
    c.showPage()


def meeting_protocol_page(c, page_number):
    header(c, "How We Conduct the Meetings", "PREPARE  |  DECIDE  |  FOLLOW THROUGH")
    c.setFillColor(Color(1, 1, 1, alpha=0.72))
    c.setFont("Helvetica", 9)
    c.drawString(28, H - 106, "Every meeting starts with current evidence and ends with a recorded decision or commitment.")

    gap = 10
    card_width = (W - 56 - gap * 2) / 3
    ownership_y = 354
    ownership_h = 102
    for index, (role, leads, owns) in enumerate(RESPONSIBILITIES):
        x = 28 + index * (card_width + gap)
        c.setFillColor([HexColor("#242424"), HexColor("#343434"), HexColor("#464646")][index])
        c.rect(x, ownership_y, card_width, ownership_h, fill=1, stroke=0)
        c.setFillColor(EMERALD)
        c.setFont("Courier-Bold", 7)
        c.drawString(x + 16, ownership_y + ownership_h - 20, role)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(x + 16, ownership_y + ownership_h - 42, leads)
        draw_wrapped(
            c,
            owns,
            x + 16,
            ownership_y + ownership_h - 61,
            43,
            "Helvetica",
            7,
            9,
            Color(1, 1, 1, alpha=0.72),
            3,
        )

    protocol_y = 141
    protocol_h = 198
    for index, (stage, timing, owner, steps) in enumerate(MEETING_PROTOCOL):
        x = 28 + index * (card_width + gap)
        c.setFillColor(PALE)
        c.setStrokeColor(LIGHT)
        c.rect(x, protocol_y, card_width, protocol_h, fill=1, stroke=1)
        c.setFillColor(EMERALD_DARK)
        c.setFont("Courier-Bold", 7)
        c.drawString(x + 16, protocol_y + protocol_h - 22, f"{index + 1:02d}  {stage}")
        c.setFillColor(GRAY)
        c.setFont("Courier", 6.2)
        c.drawRightString(x + card_width - 16, protocol_y + protocol_h - 22, timing)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 8)
        y = draw_wrapped(c, owner, x + 16, protocol_y + protocol_h - 47, 44, "Helvetica-Bold", 8, 10, INK, 2) - 9
        for step_index, step in enumerate(steps, 1):
            c.setFillColor(EMERALD_DARK)
            c.setFont("Courier-Bold", 6.5)
            c.drawString(x + 16, y, f"{step_index:02d}")
            y = draw_wrapped(c, step, x + 39, y, 38, "Helvetica", 7, 9, GRAY, 3) - 9

    rules_y = 48
    rules_h = 78
    c.setFillColor(BLACK)
    c.rect(28, rules_y, W - 56, rules_h, fill=1, stroke=0)
    c.setFillColor(EMERALD)
    c.setFont("Courier-Bold", 7)
    c.drawString(44, rules_y + rules_h - 20, "OPERATING RULES")
    rule_width = (W - 88) / len(OPERATING_RULES)
    for index, rule in enumerate(OPERATING_RULES):
        x = 44 + index * rule_width
        c.setFillColor(EMERALD)
        c.setFont("Courier-Bold", 6.5)
        c.drawString(x, rules_y + 35, f"{index + 1:02d}")
        draw_wrapped(c, rule, x + 20, rules_y + 35, 24, "Helvetica", 6.6, 8, Color(1, 1, 1, alpha=0.72), 3)

    footer(c, page_number)
    c.showPage()


def generate():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=PAGE, pageCompression=1)
    c.setTitle("JasonAI Executive Strategy")
    c.setAuthor("JasonAI")
    c.setSubject("24-month executive operating strategy")
    cover(c)
    overview(c, 2)
    for page_number, phase in enumerate(PHASES, 3):
        phase_page(c, phase, page_number)
    meeting_cadence_page(c, 8)
    meeting_protocol_page(c, 9)
    c.save()
    PUBLIC_OUTPUT.write_bytes(OUTPUT.read_bytes())
    print(OUTPUT)
    print(PUBLIC_OUTPUT)


if __name__ == "__main__":
    generate()
