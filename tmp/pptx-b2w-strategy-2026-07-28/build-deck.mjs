import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My Drive/B2W/Website";
const TMP = path.join(ROOT, "tmp/pptx-b2w-strategy-2026-07-28");
const OUT = path.join(ROOT, "output/presentations/B2W-Executive-Strategy-2026-07-28.pptx");
const RENDER = path.join(TMP, "artifact-render");

const W = 1280;
const H = 720;
const C = {
  cream: "#F7F4EC",
  paper: "#FCFAF5",
  ink: "#17221E",
  green: "#223C33",
  green2: "#3D6253",
  sage: "#DDE8E1",
  sage2: "#AEC1B7",
  gold: "#B68124",
  gold2: "#D8B56A",
  tan: "#EEE6D7",
  rust: "#A65D3E",
  gray: "#73817B",
  line: "#D7D9D1",
  white: "#FFFFFF",
  pink: "#CB3E92",
  orange: "#F28A38",
};

const pres = Presentation.create({ slideSize: { width: W, height: H } });

function shape(slide, geometry, x, y, w, h, fill, line = "none", radius = undefined, name = undefined) {
  const opts = {
    geometry,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: line === "none" ? { style: "solid", fill: "none", width: 0 } : { style: "solid", fill: line, width: 1 },
  };
  if (radius) opts.borderRadius = radius;
  if (name) opts.name = name;
  return slide.shapes.add(opts);
}

function rect(slide, x, y, w, h, fill, line = "none", radius = undefined, name = undefined) {
  return shape(slide, radius ? "roundRect" : "rect", x, y, w, h, fill, line, radius, name);
}

function text(slide, value, x, y, w, h, opts = {}) {
  const box = shape(slide, "textbox", x, y, w, h, "none", "none", undefined, opts.name);
  box.text = value;
  box.text.style = {
    fontFamily: opts.fontFamily || "Arial",
    fontSize: opts.fontSize || 18,
    bold: opts.bold || false,
    italic: opts.italic || false,
    color: opts.color || C.ink,
    alignment: opts.align || "left",
    verticalAlignment: opts.valign || "top",
    lineSpacing: opts.lineSpacing || 1.08,
  };
  return box;
}

function rule(slide, x, y, w, color = C.line, h = 1) {
  rect(slide, x, y, w, h, color);
}

function pill(slide, label, x, y, w, fill = C.sage, color = C.green) {
  rect(slide, x, y, w, 28, fill, "none", "rounded-full");
  text(slide, label.toUpperCase(), x, y + 6, w, 16, { fontSize: 11, bold: true, color, align: "center" });
}

function addBase(slide, number, section, titleValue, subtitle = "") {
  rect(slide, 0, 0, W, H, C.cream);
  text(slide, String(number).padStart(2, "0"), 54, 44, 40, 24, { fontSize: 13, bold: true, color: C.gold });
  text(slide, section.toUpperCase(), 104, 45, 310, 20, { fontSize: 11, bold: true, color: C.gray });
  const titleFontSize = titleValue.length > 48 ? 38 : 44;
  text(slide, titleValue, 104, 78, 1080, 90, { fontSize: titleFontSize, bold: true, color: C.ink, lineSpacing: 0.96 });
  if (subtitle) text(slide, subtitle, 106, 174, 1060, 34, { fontSize: 18, color: C.gray, lineSpacing: 1.1 });
  rule(slide, 54, 220, 1172);
  addFooter(slide, number);
  setNotes(slide);
}

function addFooter(slide, number) {
  text(slide, "B2W  /  EXECUTIVE STRATEGY SYSTEM", 54, 688, 330, 14, { fontSize: 9, bold: true, color: C.gray });
  text(slide, "JULY 28, 2026", 1055, 688, 130, 14, { fontSize: 9, bold: true, color: C.gray, align: "right" });
  text(slide, String(number).padStart(2, "0"), 1195, 688, 30, 14, { fontSize: 9, bold: true, color: C.gold, align: "right" });
}

function setNotes(slide) {
  slide.speakerNotes.textFrame.setText(
    "[Sources]\n- B2W Executive Strategy System, internal strategy content supplied by B2W, accessed 2026-07-28.\n[/Sources]"
  );
  slide.speakerNotes.setVisible(true);
}

function addArrow(slide, x, y, w, color = C.gold) {
  shape(slide, "rightArrow", x, y, w, 26, color);
}

function metric(slide, value, label, x, y, color = C.green) {
  text(slide, value, x, y, 180, 52, { fontSize: 42, bold: true, color });
  text(slide, label.toUpperCase(), x, y + 52, 190, 30, { fontSize: 11, bold: true, color: C.gray });
}

function addSlide1() {
  const slide = pres.slides.add();
  rect(slide, 0, 0, W, H, C.cream);
  rect(slide, 0, 0, 30, H, C.green);
  text(slide, "B2W", 72, 54, 130, 30, { fontSize: 17, bold: true, color: C.ink });
  text(slide, "PRIVATE / EXECUTIVE USE", 890, 58, 310, 20, { fontSize: 11, bold: true, color: C.gray, align: "right" });
  text(slide, "Executive\nStrategy System", 72, 156, 870, 176, { fontSize: 72, bold: true, color: C.ink, lineSpacing: 0.88 });
  text(slide, "A staged path from founder-led validation to a scalable AI operating layer for project-based businesses.", 76, 372, 770, 76, { fontSize: 24, color: C.gray, lineSpacing: 1.1 });
  rect(slide, 900, 150, 300, 360, C.green, "none", "rounded-2xl");
  text(slide, "STRATEGIC\nTHESIS", 932, 182, 220, 40, { fontSize: 12, bold: true, color: C.gold2 });
  rule(slide, 932, 246, 235, C.green2);
  text(slide, "Connect\ncommunication,\ncontext,\ndocuments,\nand approved action.", 932, 278, 228, 190, { fontSize: 25, bold: true, color: C.white, lineSpacing: 1.0 });
  text(slide, "JULY 28, 2026", 76, 626, 250, 24, { fontSize: 14, bold: true, color: C.gold });
  text(slide, "B2W-AI.COM", 1002, 626, 198, 24, { fontSize: 13, bold: true, color: C.gray, align: "right" });
  setNotes(slide);
}

function addSlide2() {
  const slide = pres.slides.add();
  addBase(slide, 2, "Company in one view", "Build the operating layer contractors already need.", "Begin with useful communication workflows, prove recurring value, then expand into documents and project control.");
  const cols = [
    { x: 54, label: "NOW", title: "Prove demand", body: "Free estimate, SOP, and proposal tools.\n\nFree product demos.\n\nGrowth consultations for contracting businesses.", fill: C.paper },
    { x: 446, label: "NEXT", title: "Prove payment", body: "Convert demand into paying customers.\n\nTrack plan choice, retention, and acquisition source.\n\nStandardize onboarding.", fill: C.sage },
    { x: 838, label: "FUTURE", title: "Scale the platform", body: "Configurable integrations, templates, approvals, and project systems.\n\nRecurring revenue grows faster than delivery cost.", fill: C.green },
  ];
  for (const c of cols) {
    rect(slide, c.x, 248, 340, 385, c.fill, c.fill === C.green ? C.green : C.line, "rounded-2xl");
    pill(slide, c.label, c.x + 24, 272, 86, c.fill === C.green ? C.green2 : C.tan, c.fill === C.green ? C.white : C.gold);
    text(slide, c.title, c.x + 24, 326, 292, 48, { fontSize: 28, bold: true, color: c.fill === C.green ? C.white : C.ink });
    text(slide, c.body, c.x + 24, 392, 292, 190, { fontSize: 18, color: c.fill === C.green ? C.sage : C.gray, lineSpacing: 1.15 });
  }
}

function addSlide3() {
  const slide = pres.slides.add();
  addBase(slide, 3, "Customer problem", "The owner is the integration layer.", "Business-critical context is fragmented across tools, so decisions and follow-up depend on manual coordination.");
  const tools = ["WhatsApp", "Google Drive", "PDFs", "Spreadsheets", "CRM", "Accounting"];
  const positions = [[72,278],[72,388],[72,498],[1010,278],[1010,388],[1010,498]];
  positions.forEach(([x,y], i) => {
    rect(slide, x, y, 200, 66, C.paper, C.line, "rounded-xl");
    text(slide, tools[i], x, y + 21, 200, 26, { fontSize: 18, bold: true, color: C.ink, align: "center" });
  });
  addArrow(slide, 294, 298, 88, C.gold2);
  addArrow(slide, 294, 408, 88, C.gold2);
  addArrow(slide, 294, 518, 88, C.gold2);
  addArrow(slide, 898, 298, 88, C.gold2);
  addArrow(slide, 898, 408, 88, C.gold2);
  addArrow(slide, 898, 518, 88, C.gold2);
  rect(slide, 400, 266, 480, 326, C.green, "none", "rounded-2xl");
  text(slide, "OWNER", 432, 296, 416, 25, { fontSize: 12, bold: true, color: C.gold2, align: "center" });
  text(slide, "Searches.\nInterprets.\nRe-enters.\nChases.\nApproves.", 432, 342, 416, 190, { fontSize: 34, bold: true, color: C.white, align: "center", lineSpacing: 1.02 });
  text(slide, "Slow decisions  •  Lost context  •  Inconsistent execution", 316, 622, 648, 22, { fontSize: 16, bold: true, color: C.rust, align: "center" });
}

function addSlide4() {
  const slide = pres.slides.add();
  addBase(slide, 4, "Product architecture", "Six layers move a request into secure execution.", "WhatsApp Assistant → Reasoning → Document Maker → SME Verification → Project Portal → SOC 2 and security development.");
  const layers = [
    { n:"01", title:"INTERFACE", name:"WhatsApp Assistant", desc:"The contractor asks, reviews, and follows through.", fill:C.orange, color:C.ink, x:54, y:270 },
    { n:"02", title:"REASONING", name:"Reasoning", desc:"Interprets intent, retrieves context, and selects the workflow.", fill:C.tan, color:C.ink, x:447, y:270 },
    { n:"03", title:"CREATION", name:"Document Maker", desc:"Creates estimates, SOPs, proposals, and reports.", fill:"#F3D7E8", color:C.ink, x:840, y:270 },
    { n:"04", title:"VERIFICATION", name:"SME Verification", desc:"An expert verifies accuracy, trade logic, and business fit.", fill:C.paper, color:C.ink, x:840, y:472 },
    { n:"05", title:"OPERATIONS", name:"Project Portal", desc:"Records the approved result with its project and owners.", fill:C.sage, color:C.ink, x:447, y:472 },
    { n:"06", title:"SECURITY", name:"SOC 2 + Security Development", desc:"Builds controls, access, logging, protection, and audit readiness.", fill:C.green, color:C.white, x:54, y:472 },
  ];
  addArrow(slide, 401, 334, 38, C.gold2);
  addArrow(slide, 794, 334, 38, C.gold2);
  shape(slide, "downArrow", 994, 426, 26, 38, C.gold2);
  shape(slide, "leftArrow", 794, 536, 38, 26, C.gold2);
  shape(slide, "leftArrow", 401, 536, 38, 26, C.gold2);
  layers.forEach((l) => {
    rect(slide, l.x, l.y, 340, 154, l.fill, l.fill === C.green ? C.green : C.line, "rounded-xl");
    text(slide, l.n, l.x + 22, l.y + 18, 32, 16, { fontSize: 11, bold: true, color: l.fill === C.green ? C.gold2 : C.gold });
    text(slide, l.title, l.x + 62, l.y + 19, 250, 15, { fontSize: 9, bold: true, color: l.fill === C.green ? C.sage : C.gray });
    text(slide, l.name, l.x + 22, l.y + 50, 296, 50, { fontSize: 24, bold: true, color: l.color, lineSpacing: 0.98 });
    text(slide, l.desc, l.x + 22, l.y + 104, 296, 40, { fontSize: 16, color: l.fill === C.green ? C.sage : C.gray, lineSpacing: 1.05 });
  });
}

function addSlide5() {
  const slide = pres.slides.add();
  addBase(slide, 5, "Current reality", "Three products create one expandable system.", "Each product has a clear job today and a direct commercial role.");
  const widths = [250, 455, 405];
  const xs = [70, 320, 775];
  rect(slide, 54, 244, 1172, 50, C.green, "none", "rounded-xl");
  ["PRODUCT", "WHAT EXISTS TODAY", "COMMERCIAL ROLE"].forEach((h,i)=>text(slide,h,xs[i]+12,262,widths[i]-24,18,{fontSize:11,bold:true,color:C.sage}));
  const rows = [
    ["WhatsApp Assistant","Reads business communication, summarizes conversations, and identifies actions and follow-ups.","Core is the minimum B2W product: $2,000 setup + $99/month."],
    ["Document Maker","Creates SOPs, estimates, reports, proposals, and repeatable document workflows.","Premium adds document capability through a higher monthly plan—without another setup fee."],
    ["Project Portal","Organizes projects, contracts, dates, owners, status, actions, and linked documents.","Maximum adds the Project Portal for customers that need a shared project-control layer."],
  ];
  rows.forEach((r,i)=>{
    const y=294+i*112;
    rect(slide,54,y,1172,112,i%2===0?C.paper:C.cream,C.line);
    text(slide,r[0],82,y+31,220,40,{fontSize:19,bold:true});
    text(slide,r[1],338,y+25,408,60,{fontSize:16,color:C.gray,lineSpacing:1.12});
    text(slide,r[2],793,y+25,395,65,{fontSize:16,color:C.gold,lineSpacing:1.12});
  });
  text(slide, "Product names remain descriptive until market proof supports stronger branding.", 82, 644, 1040, 20, { fontSize: 13, italic: true, color: C.gray });
}

function addSlide6() {
  const slide = pres.slides.add();
  addBase(slide, 6, "Revenue model now", "Start simple. Expand with demonstrated need.", "The setup fee is paid once. Higher plans add capability through monthly pricing.");
  const plans = [
    { x:54, tag:"CORE", title:"WhatsApp Assistant", price:"$2,000 setup\n+ $99/month", body:"Required starting point.\nCommunication summaries, actions, and follow-up clarity.", fill:C.orange },
    { x:446, tag:"PREMIUM", title:"+ Document Maker", price:"Higher monthly plan", body:"No additional setup fee.\nBuild SOPs, estimates, proposals, and repeatable documents.", fill:"#E84B9B" },
    { x:838, tag:"MAXIMUM", title:"+ Project Portal", price:"Highest monthly plan", body:"No additional setup fee.\nAdd shared project control, visibility, linked records, and risk alerts.", fill:C.green },
  ];
  plans.forEach((p,i)=>{
    rect(slide,p.x,252,340,302,p.fill,"none","rounded-2xl");
    text(slide,p.tag,p.x+24,277,292,18,{fontSize:11,bold:true,color:i===2?C.gold2:C.white});
    text(slide,p.title,p.x+24,316,292,48,{fontSize:27,bold:true,color:i===0?C.ink:C.white});
    text(slide,p.price,p.x+24,382,292,62,{fontSize:21,bold:true,color:i===0?C.ink:C.white,lineSpacing:1.03});
    text(slide,p.body,p.x+24,463,290,72,{fontSize:15,color:i===0?C.ink:C.white,lineSpacing:1.12});
  });
  rect(slide, 54, 576, 1172, 66, C.paper, C.gold2, "rounded-xl");
  text(slide, "OPTIONAL DOCUMENT LEARNING", 78, 592, 250, 15, { fontSize: 10, bold: true, color: C.gold });
  text(slide, "One-time fee to learn up to 50 existing SOPs, estimating tools, templates, or process documents. Price to validate.", 337, 588, 850, 34, { fontSize: 16, color: C.gray });
}

function addSlide7() {
  const slide = pres.slides.add();
  addBase(slide, 7, "Three-stage business model", "Product maturity changes the economics.", "Service effort declines as demand, payment, recurring use, and repeatability are proven.");
  const stages = [
    {x:54,n:"01",tag:"FOUNDER-LED",title:"Prove value",sub:"Free tools, demos + consultations",body:"Attract contractors with free estimate, SOP, and proposal tools. Convert interest through product demos and growth consultations.",fill:C.paper,color:C.ink},
    {x:446,n:"02",tag:"STANDARDIZED",title:"Prove repeatability",sub:"Paying customers + source data",body:"Use customer count, plan selection, retention, and acquisition source to learn which offers and channels are working.",fill:C.sage,color:C.ink},
    {x:838,n:"03",tag:"LOW-TOUCH",title:"Scale the platform",sub:"Integrations, templates + approvals",body:"Grow recurring revenue faster than delivery cost as acquisition, onboarding, and fulfillment become repeatable.",fill:C.green,color:C.white},
  ];
  stages.forEach((s,i)=>{
    rect(slide,s.x,248,340,386,s.fill,s.fill===C.green?C.green:C.line,"rounded-2xl");
    text(slide,s.n,s.x+24,274,35,20,{fontSize:13,bold:true,color:s.fill===C.green?C.gold2:C.gold});
    pill(slide,s.tag,s.x+176,266,140,s.fill===C.green?C.green2:C.tan,s.fill===C.green?C.white:C.gray);
    text(slide,s.title,s.x+24,328,292,44,{fontSize:28,bold:true,color:s.color});
    text(slide,s.sub,s.x+24,390,292,48,{fontSize:18,bold:true,color:s.color,lineSpacing:1.06});
    rule(slide,s.x+24,460,292,s.fill===C.green?C.green2:C.line);
    text(slide,s.body,s.x+24,483,292,120,{fontSize:16,color:s.fill===C.green?C.sage:C.gray,lineSpacing:1.14});
  });
}

function addSlide8() {
  const slide = pres.slides.add();
  addBase(slide, 8, "Phase gates", "Advance when evidence changes—not when the calendar does.", "Each phase must produce a specific proof across demand, product, revenue, delivery, and economics.");
  const headers = ["EVIDENCE", "PHASE 1  /  VALUE", "PHASE 2  /  REPEATABILITY", "SCALE"];
  const x=[54,250,550,890], w=[196,300,340,336];
  headers.forEach((h,i)=>{rect(slide,x[i],244,w[i],44,i===0?C.tan:C.green);text(slide,h,x[i]+14,258,w[i]-28,16,{fontSize:10,bold:true,color:i===0?C.gold:C.sage});});
  const rows = [
    ["Customers","Qualified demos + consultations","Paying customers + source data","Repeatable acquisition"],
    ["Product","Useful free tools + demo proven","Paid product in recurring use","Configurable platform"],
    ["Revenue","Offer interest validated","Initial recurring revenue + retention","Predictable growth"],
    ["Delivery","Founder-led demos + consultations","Standardized onboarding","Low-touch deployment"],
    ["Economics","Demand signal validated","Positive contribution margin","Strong gross margin"],
  ];
  rows.forEach((r,ri)=>{
    const y=288+ri*61;
    r.forEach((v,i)=>{
      rect(slide,x[i],y,w[i],61,ri%2===0?C.paper:C.cream,C.line);
      text(slide,v,x[i]+14,y+15,w[i]-28,38,{fontSize:i===0?13:14,bold:i===0,color:i===0?C.gold:C.ink,lineSpacing:1.08});
    });
  });
  text(slide, "Phase 1 → consistent demand signals", 54, 622, 350, 18, { fontSize: 13, bold: true, color: C.gray });
  text(slide, "Phase 2 → payment, use, retention, source data", 444, 622, 430, 18, { fontSize: 13, bold: true, color: C.gray });
  text(slide, "Scale → predictable system", 940, 622, 286, 18, { fontSize: 13, bold: true, color: C.gray, align: "right" });
}

function addSlide9() {
  const slide = pres.slides.add();
  addBase(slide, 9, "What to build next", "Prove one complete workflow before expanding.", "The winning product is the reliable passage from a business request to an approved, recorded outcome.");
  const nodes = [
    ["1","Ask","WhatsApp"],
    ["2","Understand","Intent"],
    ["3","Retrieve","Project + contract"],
    ["4","Create","Document skill"],
    ["5","Approve","Human control"],
    ["6","Record","Save + action"],
  ];
  nodes.forEach((n,i)=>{
    const x=58+i*200;
    if(i<5) addArrow(slide,x+158,352,40,C.gold2);
    rect(slide,x,276,160,190,i===0?C.orange:(i===5?C.green:C.paper),i===5?C.green:C.line,"rounded-2xl");
    text(slide,n[0],x+18,294,30,20,{fontSize:12,bold:true,color:i===5?C.gold2:C.gold});
    text(slide,n[1],x+8,338,144,34,{fontSize:20,bold:true,color:i===5?C.white:C.ink,align:"center"});
    text(slide,n[2],x+18,386,124,42,{fontSize:14,color:i===5?C.sage:C.gray,align:"center",lineSpacing:1.05});
  });
  rect(slide, 58, 512, 1160, 102, C.sage, "none", "rounded-xl");
  text(slide, "FIRST WORKFLOW TEST", 82, 532, 220, 16, { fontSize: 10, bold: true, color: C.gold });
  text(slide, "A contractor asks for an estimate or proposal → B2W retrieves context → drafts the document → requests approval → saves, shares, and records the result.", 82, 560, 1088, 40, { fontSize: 17, bold: true, color: C.green });
}

function addSlide10() {
  const slide = pres.slides.add();
  addBase(slide, 10, "Ownership model", "Three leaders. One evidence loop.", "Clear ownership keeps market learning, operating discipline, and product architecture synchronized.");
  const roles = [
    {x:54,role:"CEO",focus:"Market",items:"Positioning\nPricing\nPartnerships\nRevenue",fill:C.green},
    {x:446,role:"COO",focus:"Execution",items:"Priorities\nOnboarding\nDelivery\nCustomer success",fill:C.tan},
    {x:838,role:"CTO",focus:"Platform",items:"Architecture\nIntegrations\nSecurity\nReliability",fill:C.sage},
  ];
  roles.forEach((r,i)=>{
    rect(slide,r.x,254,340,318,r.fill,r.fill===C.green?C.green:C.line,"rounded-2xl");
    text(slide,r.role,r.x+24,278,80,22,{fontSize:13,bold:true,color:r.fill===C.green?C.gold2:C.gold});
    text(slide,r.focus,r.x+24,326,290,40,{fontSize:29,bold:true,color:r.fill===C.green?C.white:C.ink});
    text(slide,r.items,r.x+24,390,290,135,{fontSize:21,bold:true,color:r.fill===C.green?C.sage:C.green,lineSpacing:1.24});
  });
  rect(slide, 152, 596, 976, 46, C.paper, C.gold2, "rounded-full");
  text(slide, "Weekly loop: market signal  →  product priority  →  delivery evidence  →  pricing and positioning", 172, 610, 936, 20, { fontSize: 15, bold: true, color: C.gray, align: "center" });
}

function addSlide11() {
  const slide = pres.slides.add();
  addBase(slide, 11, "Financial progression", "Use scenarios to expose the operating requirements.", "These are planning cases—not forecasts. Each step requires stronger acquisition, retention, automation, and gross margin.");
  const scenarios = [
    {label:"INITIAL VALIDATION",cust:"10",avg:"$1K",arr:"$120K",h:70,color:C.sage2},
    {label:"INTEGRATED PRODUCT",cust:"50",avg:"$1.5K",arr:"$900K",h:130,color:C.green2},
    {label:"EARLY SCALE",cust:"250",avg:"$2K",arr:"$6M",h:210,color:C.green},
    {label:"PLATFORM SCALE",cust:"1,000",avg:"$2.5K",arr:"$30M",h:300,color:C.gold},
  ];
  const baseY=604;
  scenarios.forEach((s,i)=>{
    const x=96+i*290;
    rect(slide,x,baseY-s.h,220,s.h,s.color,"none","rounded-xl");
    text(slide,s.arr,x,baseY-s.h+18,220,42,{fontSize:31,bold:true,color:i===0?C.ink:C.white,align:"center"});
    text(slide,"ARR",x,baseY-s.h+58,220,16,{fontSize:10,bold:true,color:i===0?C.green:C.sage,align:"center"});
    text(slide,s.label,x,618,220,20,{fontSize:10,bold:true,color:C.gray,align:"center"});
    text(slide,`${s.cust} customers  •  ${s.avg}/mo avg`,x,646,220,18,{fontSize:12,bold:true,color:C.ink,align:"center"});
  });
  text(slide, "SCENARIO", 54, 245, 86, 16, { fontSize: 10, bold: true, color: C.gold });
  text(slide, "ARR grows only when the operating system behind it becomes repeatable.", 152, 241, 850, 28, { fontSize: 20, bold: true, color: C.ink });
}

function addSlide12() {
  const slide = pres.slides.add();
  addBase(slide, 12, "90-day plan", "Learn fast enough to make the next decision obvious.", "The near-term objective is not feature volume. It is evidence of demand, payment, use, and repeatability.");
  const phases = [
    {x:54,d:"DAYS 1–30",title:"Focus",items:["Select contracting segment","Define the paid offer","Specify the first workflow"],fill:C.paper},
    {x:446,d:"DAYS 31–60",title:"Build + onboard",items:["Validate assistant-to-document flow","Onboard initial customers","Measure time-to-first-value"],fill:C.sage},
    {x:838,d:"DAYS 61–90",title:"Prove + standardize",items:["Document recurring use","Validate pricing + outcomes","Capture a repeatable playbook"],fill:C.green},
  ];
  phases.forEach((p,i)=>{
    rect(slide,p.x,252,340,370,p.fill,p.fill===C.green?C.green:C.line,"rounded-2xl");
    text(slide,p.d,p.x+24,278,292,18,{fontSize:11,bold:true,color:p.fill===C.green?C.gold2:C.gold});
    text(slide,p.title,p.x+24,325,292,42,{fontSize:28,bold:true,color:p.fill===C.green?C.white:C.ink});
    p.items.forEach((item,j)=>{
      const y=400+j*62;
      rect(slide,p.x+24,y+3,20,20,p.fill===C.green?C.green2:C.tan,"none","rounded-full");
      text(slide,String(j+1),p.x+24,y+6,20,14,{fontSize:9,bold:true,color:p.fill===C.green?C.white:C.gold,align:"center"});
      text(slide,item,p.x+58,y,248,42,{fontSize:16,bold:true,color:p.fill===C.green?C.sage:C.green,lineSpacing:1.08});
    });
  });
}

function addSlide13() {
  const slide = pres.slides.add();
  rect(slide, 0, 0, W, H, C.green);
  text(slide, "13", 54, 44, 40, 24, { fontSize: 13, bold: true, color: C.gold2 });
  text(slide, "EXECUTION TRACKER", 104, 45, 310, 20, { fontSize: 11, bold: true, color: C.sage });
  text(slide, "The next proof is a paying customer.", 104, 102, 1040, 65, { fontSize: 48, bold: true, color: C.white });
  text(slide, "Everything below should sharpen that outcome.", 106, 176, 980, 34, { fontSize: 21, color: C.sage });
  rule(slide, 54, 231, 1172, C.green2);
  const tracks = [
    {x:54,n:"01",title:"Demand",body:"Publish useful free tools.\nBook qualified demos.\nRun growth consultations."},
    {x:446,n:"02",title:"Conversion",body:"Present the Core offer.\nTrack source and objections.\nClose first paying customers."},
    {x:838,n:"03",title:"Learning",body:"Measure activation and use.\nValidate pricing and outcomes.\nStandardize what works."},
  ];
  tracks.forEach(t=>{
    text(slide,t.n,t.x,277,35,18,{fontSize:11,bold:true,color:C.gold2});
    text(slide,t.title,t.x,318,340,40,{fontSize:28,bold:true,color:C.white});
    text(slide,t.body,t.x,380,330,130,{fontSize:18,color:C.sage,lineSpacing:1.22});
  });
  rect(slide, 54, 568, 1172, 62, C.paper, "none", "rounded-full");
  text(slide, "DECISION RULE", 80, 588, 160, 18, { fontSize: 10, bold: true, color: C.gold });
  text(slide, "Keep what produces payment and recurring use. Change what does not.", 260, 582, 920, 30, { fontSize: 20, bold: true, color: C.ink });
  text(slide, "B2W  /  EXECUTIVE STRATEGY SYSTEM", 54, 682, 330, 14, { fontSize: 9, bold: true, color: C.sage });
  text(slide, "JULY 28, 2026", 1070, 682, 155, 14, { fontSize: 9, bold: true, color: C.sage, align: "right" });
  setNotes(slide);
}

addSlide1();
addSlide2();
addSlide3();
addSlide4();
addSlide5();
addSlide6();
addSlide7();
addSlide8();
addSlide9();
addSlide10();
addSlide11();
addSlide12();
addSlide13();

await fs.mkdir(RENDER, { recursive: true });
for (let i = 0; i < pres.slides.items.length; i++) {
  const slide = pres.slides.items[i];
  const png = await pres.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(RENDER, `slide-${String(i + 1).padStart(2, "0")}.png`), new Uint8Array(await png.arrayBuffer()));
  const layout = await pres.export({ slide, format: "layout-json" });
  await fs.writeFile(path.join(RENDER, `slide-${String(i + 1).padStart(2, "0")}.json`), new Uint8Array(await layout.arrayBuffer()));
}

const pptx = await PresentationFile.exportPptx(pres);
await pptx.save(OUT);
console.log(OUT);
