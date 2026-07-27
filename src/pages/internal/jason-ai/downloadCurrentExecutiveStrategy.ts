import {
  getDefaultTaskReport,
  getTaskId,
  normalizeTaskReports,
  phases,
  trackingMetricsVersion,
  trackingStorageKey,
  type KpiReport,
  type TaskReport,
} from './JasonAIInternalPortal';
import {
  executiveMeetings,
  executiveResponsibilities,
  meetingProtocol,
  operatingRules,
} from './meetingCadence';

const black = '#090909';
const ink = '#111111';
const gray = '#666666';
const light = '#E7E7E7';
const pale = '#F5F5F3';
const emerald = '#8FAE9F';
const emeraldDark = '#516B5F';
const pricingTint = '#F0ECE6';
const pricingAccent = '#6B5744';
const productTint = '#E9EDF0';
const productAccent = '#4E5D67';
const successTint = '#E9EEE9';
const successAccent = '#526157';

type PdfImageAsset = {
  dataUrl: string;
  width: number;
  height: number;
};

async function loadPdfImage(
  url: string,
  width: number,
  height: number,
): Promise<PdfImageAsset | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    return { dataUrl, width, height };
  } catch {
    return null;
  }
}

function getSavedTracking() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(trackingStorageKey) ?? '{}') as {
      taskReports?: Record<string, TaskReport>;
      kpiReports?: Record<string, KpiReport>;
      metricsVersion?: number;
    };
    return {
      taskReports: normalizeTaskReports(
        parsed.taskReports ?? {},
        parsed.metricsVersion !== trackingMetricsVersion,
      ),
      kpiReports: parsed.kpiReports ?? {},
    };
  } catch {
    return {
      taskReports: {} as Record<string, TaskReport>,
      kpiReports: {} as Record<string, KpiReport>,
    };
  }
}

export async function downloadCurrentExecutiveStrategy() {
  const [{ jsPDF }, coverImage, sectionImage] = await Promise.all([
    import('jspdf'),
    loadPdfImage('/images/jasonai/pdf/executive-strategy-cover-background.jpg', 1584, 1224),
    loadPdfImage('/images/jasonai/pdf/executive-strategy-section-background.jpg', 1584, 252),
  ]);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const { taskReports, kpiReports } = getSavedTracking();
  const generatedAt = new Date();
  const generatedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(generatedAt);

  const phaseProgress = (phaseId: string) => {
    const phase = phases.find((item) => item.id === phaseId);
    if (!phase) return 0;
    const tasks = phase.kpis.flatMap((kpi) =>
      kpi.tasks.map((_, taskIndex) => taskReports[getTaskId(phase.id, kpi.id, taskIndex)]),
    );
    return Math.round((tasks.filter((task) => task?.completed).length / tasks.length) * 100);
  };

  const kpiProgress = (phaseId: string, kpiId: string) => {
    const phase = phases.find((item) => item.id === phaseId);
    const kpi = phase?.kpis.find((item) => item.id === kpiId);
    if (!kpi) return 0;
    const completed = kpi.tasks.filter(
      (_, taskIndex) => taskReports[getTaskId(phaseId, kpi.id, taskIndex)]?.completed,
    ).length;
    return Math.round((completed / kpi.tasks.length) * 100);
  };

  const drawImageCover = (
    image: PdfImageAsset,
    x: number,
    y: number,
    targetWidth: number,
    targetHeight: number,
    verticalAlignment: 'center' | 'bottom' = 'center',
  ) => {
    const scale = Math.max(targetWidth / image.width, targetHeight / image.height);
    const renderedWidth = image.width * scale;
    const renderedHeight = image.height * scale;
    const renderedY =
      verticalAlignment === 'bottom'
        ? y + targetHeight - renderedHeight
        : y + (targetHeight - renderedHeight) / 2;
    doc.addImage(
      image.dataUrl,
      'JPEG',
      x + (targetWidth - renderedWidth) / 2,
      renderedY,
      renderedWidth,
      renderedHeight,
      undefined,
      'FAST',
    );
  };

  const drawB2WBrand = (
    x: number,
    y: number,
    logoHeight: number,
    label: string,
  ) => {
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('B2W', x, y + logoHeight * 0.64);
    const dividerX = x + 28;
    doc.setDrawColor('#666666');
    doc.line(dividerX, y + 1, dividerX, y + logoHeight - 1);
    doc.setTextColor('#FFFFFF');
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.text(label, dividerX + 10, y + logoHeight * 0.72);
  };

  const getKpiPalette = (kpiId: string) => {
    if (kpiId === 'product') return { tint: productTint, accent: productAccent };
    if (kpiId === 'success') return { tint: successTint, accent: successAccent };
    return { tint: pricingTint, accent: pricingAccent };
  };

  const drawPageHeader = (eyebrow: string, title: string) => {
    if (sectionImage) {
      drawImageCover(sectionImage, 0, 0, width, 100);
      doc.setFillColor('#FFFFFF');
      doc.rect(0, 100, width, height - 100, 'F');
    } else {
      doc.setFillColor(black);
      doc.rect(0, 0, width, 100, 'F');
    }
    drawB2WBrand(27, 11, 24, 'JASONAI');
    doc.setTextColor('#A0A0A0');
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.text(eyebrow.toUpperCase(), width - 28, 27, { align: 'right' });
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(title, 28, 82);
  };

  const drawFooter = (pageNumber: number) => {
    doc.setDrawColor(light);
    doc.line(28, height - 25, width - 28, height - 25);
    doc.setTextColor(gray);
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.5);
    doc.text(`CURRENT STRATEGY SNAPSHOT  |  ${generatedDate.toUpperCase()}`, 28, height - 13);
    doc.text(String(pageNumber).padStart(2, '0'), width - 28, height - 13, { align: 'right' });
  };

  const writeWrapped = (
    value: string,
    x: number,
    y: number,
    maxWidth: number,
    options: { size?: number; color?: string; style?: 'normal' | 'bold'; lineHeight?: number } = {},
  ) => {
    const size = options.size ?? 9;
    const lineHeight = options.lineHeight ?? size * 1.35;
    doc.setFont('helvetica', options.style ?? 'normal');
    doc.setFontSize(size);
    doc.setTextColor(options.color ?? ink);
    const lines = doc.splitTextToSize(value || 'Not reported', maxWidth) as string[];
    doc.text(lines, x, y, { lineHeightFactor: lineHeight / size });
    return y + lines.length * lineHeight;
  };

  if (coverImage) {
    drawImageCover(coverImage, 0, 0, width, height);
  } else {
    doc.setFillColor('#FFFFFF');
    doc.rect(0, 0, width, height, 'F');
    doc.setFillColor(black);
    doc.rect(width * 0.58, 0, width * 0.42, height, 'F');
  }
  drawB2WBrand(40, 23, 28, 'JASONAI EXECUTIVE STRATEGY');
  doc.setTextColor(coverImage ? '#FFFFFF' : ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(38);
  doc.text('Current operating', 40, 132);
  doc.text('snapshot', 40, 174);
  doc.setTextColor(coverImage ? '#C8C8C8' : gray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.text('Latest saved dashboard results, task status,', 40, 220);
  doc.text('reported outcomes, and tracked metrics.', 40, 239);
  doc.setTextColor(coverImage ? '#FFFFFF' : ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(generatedDate, 40, 296);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(coverImage ? '#C8C8C8' : gray);
  doc.text('Strategy horizon: August 2026 - July 2028', 40, 318);
  doc.setTextColor(emerald);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.text('LIVE DASHBOARD EXPORT', width * 0.58 + 34, 82);
  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  doc.text(['Progress is measured', 'through accountable', 'execution.'], width * 0.58 + 34, 125, {
    lineHeightFactor: 1.2,
  });
  doc.setTextColor('#B7B7B7');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(['This export reflects the latest', 'information saved in this browser.'], width * 0.58 + 34, 242, {
    lineHeightFactor: 1.45,
  });

  let pageNumber = 2;
  doc.addPage();
  drawPageHeader('Current Dashboard', 'Strategy Progress Overview');
  doc.setTextColor(gray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Five sequential phases with live completion based on the latest saved task reports.', 28, 118);
  let overviewY = 145;
  phases.forEach((phase) => {
    const progress = phaseProgress(phase.id);
    doc.setFillColor(progress > 0 ? '#ECFDF5' : pale);
    doc.rect(28, overviewY, width - 56, 70, 'F');
    doc.setTextColor(emeraldDark);
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.text(phase.number, 45, overviewY + 24);
    doc.setTextColor(ink);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(phase.label, 78, overviewY + 24);
    doc.setTextColor(gray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(phase.objective, 78, overviewY + 43);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.text(phase.period.toUpperCase(), width - 155, overviewY + 24);
    doc.setTextColor(ink);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`${progress}%`, width - 46, overviewY + 25, { align: 'right' });
    doc.setFillColor('#D7D7D7');
    doc.rect(width - 155, overviewY + 43, 109, 4, 'F');
    doc.setFillColor(emerald);
    doc.rect(width - 155, overviewY + 43, 109 * (progress / 100), 4, 'F');
    overviewY += 78;
  });
  drawFooter(pageNumber);

  phases.forEach((phase) => {
    phase.kpis.forEach((kpi) => {
      pageNumber += 1;
      doc.addPage();
      drawPageHeader(
        `Phase ${phase.number} | ${phase.period} | ${kpi.id}`,
        `${phase.label}: ${kpi.label}`,
      );

      const progress = kpiProgress(phase.id, kpi.id);
      const currentResult = kpiReports[`${phase.id}:${kpi.id}`]?.currentResult || 'Not yet reported';

      const kpiPalette = getKpiPalette(kpi.id);
      doc.setFillColor(kpiPalette.tint);
      doc.rect(0, 100, width, 24, 'F');
      doc.setFillColor(kpiPalette.accent);
      doc.rect(0, 100, 5, 24, 'F');
      doc.setTextColor(kpiPalette.accent);
      doc.setFont('courier', 'bold');
      doc.setFontSize(7);
      doc.text(`${kpi.id.toUpperCase()} KPI`, 28, 116);

      doc.setFillColor(pale);
      doc.rect(28, 124, width - 56, 81, 'F');
      doc.setTextColor(gray);
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.text('OWNER', 45, 144);
      doc.text('CURRENT RESULT', 145, 144);
      doc.text('EXECUTION', width - 150, 144);
      doc.setTextColor(ink);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(kpi.owner, 45, 164);
      writeWrapped(currentResult, 145, 164, 430, { size: 9, style: 'bold' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(`${progress}%`, width - 45, 167, { align: 'right' });
      doc.setFillColor('#D7D7D7');
      doc.rect(width - 150, 184, 105, 4, 'F');
      doc.setFillColor(emerald);
      doc.rect(width - 150, 184, 105 * (progress / 100), 4, 'F');

      doc.setDrawColor(light);
      doc.rect(28, 218, (width - 68) / 2, 66);
      doc.rect(40 + (width - 68) / 2, 218, (width - 68) / 2, 66);
      doc.setTextColor(gray);
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.text('MINIMUM GATE', 42, 238);
      doc.setTextColor(kpiPalette.accent);
      doc.text('GOAL', 54 + (width - 68) / 2, 238);
      writeWrapped(kpi.minimum, 42, 256, (width - 110) / 2, { size: 8, style: 'bold' });
      writeWrapped(kpi.target, 54 + (width - 68) / 2, 256, (width - 110) / 2, {
        size: 8,
        style: 'bold',
        color: kpiPalette.accent,
      });

      let taskY = 306;
      kpi.tasks.forEach((task, taskIndex) => {
        const taskId = getTaskId(phase.id, kpi.id, taskIndex);
        const report =
          taskReports[taskId] ?? getDefaultTaskReport(task, kpi.owner, kpi.id);
        doc.setFillColor(report.completed ? '#ECFDF5' : '#FFFFFF');
        doc.setDrawColor(light);
        doc.rect(28, taskY, width - 56, 61, 'FD');
        doc.setTextColor(report.completed ? emeraldDark : gray);
        doc.setFont('courier', 'bold');
        doc.setFontSize(7);
        doc.text(report.completed ? '[X]' : '[ ]', 42, taskY + 18);
        writeWrapped(task, 68, taskY + 18, 380, { size: 8.5, style: 'bold', lineHeight: 10 });
        const quantity = report.quantity
          ? `${report.quantity}${report.unit ? ` ${report.unit}` : ''}`
          : 'No quantity reported';
        doc.setTextColor(gray);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(quantity, width - 42, taskY + 18, { align: 'right' });
        const result = report.result || 'No outcome reported';
        writeWrapped(`Outcome: ${result}`, 68, taskY + 38, 300, { size: 6.7, color: gray, lineHeight: 8 });
        const metrics = report.plan.split('\n').filter(Boolean).join('; ');
        writeWrapped(`Track: ${metrics}`, 385, taskY + 38, width - 427, {
          size: 6.3,
          color: kpiPalette.accent,
          lineHeight: 7.3,
        });
        taskY += 67;
      });
      drawFooter(pageNumber);
    });
  });

  pageNumber += 1;
  doc.addPage();
  drawPageHeader('Governance | 2h 30m per week', 'Executive Meeting Cadence');
  doc.setTextColor(gray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    'Three focused meetings connect phase priorities, customer evidence, and accountable execution.',
    28,
    118,
  );

  const meetingBannerColors = ['#242424', '#343434', '#464646'];
  const meetingRowHeight = 126;
  let meetingY = 140;
  executiveMeetings.forEach((meeting, meetingIndex) => {
    doc.setFillColor('#FFFFFF');
    doc.setDrawColor(light);
    doc.rect(28, meetingY, width - 56, meetingRowHeight, 'FD');
    doc.setFillColor(meetingBannerColors[meetingIndex]);
    doc.rect(28, meetingY, 170, meetingRowHeight, 'F');
    doc.setTextColor(emerald);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7);
    doc.text(meeting.day.toUpperCase(), 44, meetingY + 22);
    doc.setTextColor('#B7B7B7');
    doc.text(meeting.duration.toUpperCase(), 182, meetingY + 22, { align: 'right' });
    writeWrapped(meeting.name, 44, meetingY + 48, 136, {
      size: 14,
      style: 'bold',
      color: '#FFFFFF',
      lineHeight: 16,
    });
    doc.setTextColor('#B7B7B7');
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.5);
    doc.text('LEAD', 44, meetingY + 108);
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(meeting.lead, 182, meetingY + 108, { align: 'right' });

    const purposeX = 216;
    doc.setTextColor(gray);
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.2);
    doc.text('PURPOSE', purposeX, meetingY + 20);
    writeWrapped(meeting.purpose, purposeX, meetingY + 38, 220, {
      size: 7.1,
      color: ink,
      lineHeight: 9,
    });

    const agendaX = 448;
    doc.setTextColor(gray);
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.2);
    doc.text('TIMEBOXED FLOW', agendaX, meetingY + 20);
    let agendaY = meetingY + 38;
    meeting.agenda.forEach((item) => {
      agendaY = writeWrapped(item, agendaX, agendaY, 190, {
        size: 6.2,
        color: ink,
        lineHeight: 7.2,
      }) + 3;
    });

    const outputsX = 652;
    doc.setTextColor(gray);
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.2);
    doc.text('OUTPUTS', outputsX, meetingY + 20);
    let outputY = meetingY + 38;
    meeting.outputs.forEach((output) => {
      doc.setTextColor(emeraldDark);
      doc.setFont('courier', 'bold');
      doc.setFontSize(6.2);
      doc.text('+', outputsX, outputY);
      outputY = writeWrapped(output, outputsX + 12, outputY, 95, {
        size: 6.4,
        color: ink,
        lineHeight: 7.4,
      }) + 5;
    });
    meetingY += meetingRowHeight + 8;
  });
  drawFooter(pageNumber);

  pageNumber += 1;
  doc.addPage();
  drawPageHeader('Prepare | Decide | Follow through', 'How We Conduct the Meetings');
  doc.setTextColor(gray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    'Every meeting starts with current evidence and ends with a recorded decision or commitment.',
    28,
    118,
  );

  const governanceGap = 10;
  const governanceCardWidth = (width - 56 - governanceGap * 2) / 3;
  executiveResponsibilities.forEach((responsibility, responsibilityIndex) => {
    const x = 28 + responsibilityIndex * (governanceCardWidth + governanceGap);
    doc.setFillColor(meetingBannerColors[responsibilityIndex]);
    doc.rect(x, 136, governanceCardWidth, 96, 'F');
    doc.setTextColor(emerald);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7);
    doc.text(responsibility.role, x + 16, 157);
    writeWrapped(responsibility.leads, x + 16, 179, governanceCardWidth - 32, {
      size: 9,
      style: 'bold',
      color: '#FFFFFF',
      lineHeight: 10.5,
    });
    writeWrapped(responsibility.owns, x + 16, 204, governanceCardWidth - 32, {
      size: 6.6,
      color: '#C8C8C8',
      lineHeight: 8,
    });
  });

  meetingProtocol.forEach((stage, stageIndex) => {
    const x = 28 + stageIndex * (governanceCardWidth + governanceGap);
    doc.setFillColor(pale);
    doc.setDrawColor(light);
    doc.rect(x, 244, governanceCardWidth, 222, 'FD');
    doc.setTextColor(emeraldDark);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7);
    doc.text(`${String(stageIndex + 1).padStart(2, '0')}  ${stage.stage.toUpperCase()}`, x + 16, 266);
    doc.setTextColor(gray);
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.2);
    doc.text(stage.timing.toUpperCase(), x + governanceCardWidth - 16, 266, { align: 'right' });
    let protocolY = writeWrapped(stage.owner, x + 16, 291, governanceCardWidth - 32, {
      size: 8,
      style: 'bold',
      color: ink,
      lineHeight: 10,
    }) + 8;
    stage.steps.forEach((step, stepIndex) => {
      doc.setTextColor(emeraldDark);
      doc.setFont('courier', 'bold');
      doc.setFontSize(6.5);
      doc.text(String(stepIndex + 1).padStart(2, '0'), x + 16, protocolY);
      protocolY = writeWrapped(step, x + 42, protocolY, governanceCardWidth - 58, {
        size: 7,
        color: gray,
        lineHeight: 9,
      }) + 9;
    });
  });

  doc.setFillColor(black);
  doc.rect(28, 478, width - 56, 78, 'F');
  doc.setTextColor(emerald);
  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  doc.text('OPERATING RULES', 44, 499);
  const ruleWidth = (width - 88) / operatingRules.length;
  operatingRules.forEach((rule, ruleIndex) => {
    const x = 44 + ruleIndex * ruleWidth;
    doc.setTextColor(emerald);
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.text(String(ruleIndex + 1).padStart(2, '0'), x, 520);
    writeWrapped(rule, x + 20, 520, ruleWidth - 24, {
      size: 6.4,
      color: '#C8C8C8',
      lineHeight: 7.4,
    });
  });
  drawFooter(pageNumber);

  doc.setProperties({
    title: `JasonAI Executive Strategy - Current - ${generatedDate}`,
    subject: 'Current JasonAI executive strategy dashboard export',
    author: 'JasonAI',
  });
  const fileDate = [
    generatedAt.getFullYear(),
    String(generatedAt.getMonth() + 1).padStart(2, '0'),
    String(generatedAt.getDate()).padStart(2, '0'),
  ].join('-');
  const fileName = `JasonAI-Executive-Strategy-Current-${fileDate}.pdf`;
  const pdfBlob = doc.output('blob');

  if (typeof document !== 'undefined') {
    const objectUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
  }

  return {
    fileName,
    pages: doc.getNumberOfPages(),
    bytes: pdfBlob.size,
    blob: pdfBlob,
  };
}
