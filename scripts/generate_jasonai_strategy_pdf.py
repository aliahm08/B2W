from pathlib import Path
from textwrap import wrap

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import landscape, letter
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "jasonai-executive-strategy.pdf"
PUBLIC_OUTPUT = ROOT / "public" / "documents" / "jasonai-executive-strategy.pdf"

PAGE = landscape(letter)
W, H = PAGE
BLACK = HexColor("#090909")
INK = HexColor("#111111")
GRAY = HexColor("#666666")
LIGHT = HexColor("#E7E7E7")
PALE = HexColor("#F5F5F3")
WHITE = HexColor("#FFFFFF")
EMERALD = HexColor("#63E6BE")
EMERALD_DARK = HexColor("#006B4D")

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


def lines(text, width):
    return wrap(text, width=width, break_long_words=False, break_on_hyphens=False)


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


def header(c, title, eyebrow):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(BLACK)
    c.rect(0, H - 46, W, 46, fill=1, stroke=0)
    c.setFillColor(EMERALD)
    c.circle(27, H - 23, 7, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(44, H - 27, "JASONAI")
    c.setFillColor(Color(1, 1, 1, alpha=0.55))
    c.setFont("Courier", 7)
    c.drawRightString(W - 28, H - 27, eyebrow)
    c.setFillColor(INK)
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
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(BLACK)
    c.rect(W * 0.55, 0, W * 0.45, H, fill=1, stroke=0)
    c.setFillColor(EMERALD)
    c.circle(40, H - 38, 9, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Courier", 8)
    c.drawString(58, H - 41, "JASONAI EXECUTIVE STRATEGY")
    c.setFont("Helvetica-Bold", 37)
    c.drawString(40, H - 130, "The AI Assistant")
    c.setFillColor(HexColor("#A0A0A0"))
    c.setFont("Helvetica-Bold", 31)
    c.drawString(40, H - 170, "for Project Group")
    c.drawString(40, H - 205, "Chats")
    c.setFillColor(GRAY)
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
        c.setStrokeColor(LIGHT)
        c.line(40, y + 18, W * 0.49, y + 18)
        c.setFillColor(GRAY)
        c.setFont("Courier", 7)
        c.drawString(40, y, label)
        c.setFillColor(INK)
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
    c.setFillColor(GRAY)
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
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 10)
    c.drawString(28, H - 106, phase["objective"])
    c.setFillColor(EMERALD_DARK)
    c.setFont("Courier-Bold", 7)
    c.drawRightString(W - 28, H - 105, "PRICING  +  PRODUCT  +  SUCCESS")

    gap = 12
    margin = 28
    card_w = (W - margin * 2 - gap * 2) / 3
    card_y = 48
    card_h = H - 176
    for index, kpi in enumerate(phase["kpis"]):
        x = margin + index * (card_w + gap)
        c.setFillColor(WHITE)
        c.setStrokeColor(LIGHT)
        c.setLineWidth(1)
        c.rect(x, card_y, card_w, card_h, fill=1, stroke=1)
        c.setFillColor(BLACK if index == 0 else PALE)
        c.rect(x, card_y + card_h - 70, card_w, 70, fill=1, stroke=0)
        c.setFillColor(EMERALD if index == 0 else EMERALD_DARK)
        c.setFont("Courier-Bold", 7)
        c.drawString(x + 16, card_y + card_h - 21, kpi["type"])
        c.setFillColor(WHITE if index == 0 else INK)
        c.setFont("Helvetica-Bold", 13)
        draw_wrapped(c, kpi["name"], x + 16, card_y + card_h - 43, 27, "Helvetica-Bold", 13, 15, WHITE if index == 0 else INK, 2)
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
        c.setFillColor(EMERALD_DARK)
        c.setFont("Courier-Bold", 6.5)
        c.drawString(x + 16, y, "TARGET")
        y = draw_wrapped(c, kpi["target"], x + 16, y - 15, 38, "Helvetica-Bold", 8, 11, EMERALD_DARK) - 13
        c.setStrokeColor(LIGHT)
        c.line(x + 16, y, x + card_w - 16, y)
        y -= 20
        c.setFillColor(GRAY)
        c.setFont("Courier", 6.5)
        c.drawString(x + 16, y, "SUGGESTED PLAN")
        y -= 18
        for task_index, task in enumerate(kpi["tasks"], 1):
            c.setFillColor(EMERALD_DARK)
            c.setFont("Courier-Bold", 6.5)
            c.drawString(x + 16, y, f"{task_index:02d}")
            y = draw_wrapped(c, task, x + 39, y, 32, "Helvetica", 7.5, 10, INK) - 8

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
    c.save()
    PUBLIC_OUTPUT.write_bytes(OUTPUT.read_bytes())
    print(OUTPUT)
    print(PUBLIC_OUTPUT)


if __name__ == "__main__":
    generate()
