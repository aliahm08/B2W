import type { JasonAiRoiModel } from '../../src/lib/jasonAiRoi.js';
import type { JasonAiRoiReportSubmission } from './validation.js';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percentage = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0,
});

const reportDate = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'America/New_York',
});

function businessTypeLabel(type: JasonAiRoiReportSubmission['businessType']) {
  return type === 'firm' ? 'Contracting Firm' : 'General Contractor';
}

function buildChartRows(model: JasonAiRoiModel) {
  const maxNet = Math.max(...model.years.map((year) => year.net), 1);

  return model.years
    .map((year) => {
      const barWidth = Math.max(8, Math.round((year.net / maxNet) * 100));

      return `
        <tr>
          <td style="width:56px;padding:8px 12px 8px 0;color:#4f463c;font-size:13px;font-weight:700;white-space:nowrap;">
            Year ${year.year}
          </td>
          <td style="padding:8px 12px 8px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="height:13px;background:#eee8dd;">
                  <table role="presentation" width="${barWidth}%" cellspacing="0" cellpadding="0" border="0">
                    <tr><td style="height:13px;background:#1f5f7a;font-size:0;line-height:0;">&nbsp;</td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
          <td style="width:90px;padding:8px 0;text-align:right;color:#1f5f7a;font-size:13px;font-weight:700;white-space:nowrap;">
            ${currency.format(year.net)}
          </td>
        </tr>
      `;
    })
    .join('');
}

function buildYearRows(model: JasonAiRoiModel) {
  return model.years
    .map((year) => {
      const investment =
        year.standardInvestment > year.investment
          ? `<span style="color:#8a8176;text-decoration:line-through;">${currency.format(year.standardInvestment)}</span>
             <strong style="margin-left:6px;color:#141414;">${currency.format(year.investment)}</strong>`
          : currency.format(year.investment);

      return `
        <tr>
          <th scope="row" style="padding:13px 12px;border-top:1px solid #d9d2c3;text-align:left;font-size:13px;">Year ${year.year}</th>
          <td style="padding:13px 12px;border-top:1px solid #d9d2c3;text-align:right;font-size:13px;">${currency.format(year.value)}</td>
          <td style="padding:13px 12px;border-top:1px solid #d9d2c3;text-align:right;font-size:13px;">${investment}</td>
          <td style="padding:13px 12px;border-top:1px solid #d9d2c3;text-align:right;font-size:13px;font-weight:700;">${currency.format(year.net)}</td>
        </tr>
      `;
    })
    .join('');
}

export function buildJasonAiRoiReportEmail(
  submission: JasonAiRoiReportSubmission,
  model: JasonAiRoiModel,
  generatedAt = new Date(),
) {
  const typeLabel = businessTypeLabel(submission.businessType);
  const generatedDate = reportDate.format(generatedAt);
  const subject = `Your JasonAI four-year ROI estimate — ${percentage.format(model.roi)}`;
  const standardInvestment = currency.format(model.totalStandardInvestment);
  const preLaunchInvestment = currency.format(model.totalInvestment);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${subject}</title>
  </head>
  <body style="margin:0;background:#f4efe4;color:#141414;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4efe4;">
      <tr>
        <td align="center" style="padding:28px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border:1px solid #d9d2c3;">
            <tr>
              <td style="padding:22px 28px;border-bottom:1px solid #d9d2c3;background:#fffaf0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="font-size:24px;font-weight:800;letter-spacing:-0.5px;">JasonAI</td>
                    <td style="text-align:right;color:#6b6256;font-size:13px;font-weight:700;">by B2W</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;background:#141414;color:#ffffff;">
                <p style="margin:0;color:#f1b37b;font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;">
                  General Contractor AI ROI Report
                </p>
                <h1 style="margin:12px 0 4px;font-size:44px;line-height:1;color:#7ee2ad;letter-spacing:-1.5px;">
                  ${percentage.format(model.roi)} ROI
                </h1>
                <p style="margin:12px 0 0;color:#ffffff;font-size:20px;font-weight:700;">
                  ${currency.format(model.netReturn)} estimated four-year net return
                </p>
                <p style="margin:10px 0 0;color:#aaa39a;font-size:12px;">Generated ${generatedDate}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 12px;color:#9b3d1e;font-size:12px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase;">Your inputs</p>
                <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #d9d2c3;border-collapse:collapse;">
                  <tr>
                    <td style="padding:12px;border-bottom:1px solid #d9d2c3;color:#6b6256;font-size:12px;text-transform:uppercase;">Business type</td>
                    <td style="padding:12px;border-bottom:1px solid #d9d2c3;text-align:right;font-size:13px;font-weight:700;">${typeLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px;border-bottom:1px solid #d9d2c3;color:#6b6256;font-size:12px;text-transform:uppercase;">Employees</td>
                    <td style="padding:12px;border-bottom:1px solid #d9d2c3;text-align:right;font-size:13px;font-weight:700;">${submission.employees}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px;border-bottom:1px solid #d9d2c3;color:#6b6256;font-size:12px;text-transform:uppercase;">Active projects</td>
                    <td style="padding:12px;border-bottom:1px solid #d9d2c3;text-align:right;font-size:13px;font-weight:700;">${submission.activeProjects}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px;color:#6b6256;font-size:12px;text-transform:uppercase;">Average project duration</td>
                    <td style="padding:12px;text-align:right;font-size:13px;font-weight:700;">${submission.averageProjectWeeks} weeks</td>
                  </tr>
                </table>

                <p style="margin:28px 0 4px;color:#9b3d1e;font-size:12px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase;">Four-year return by year</p>
                <p style="margin:0 0 10px;color:#6b6256;font-size:13px;line-height:1.5;">Each bar shows estimated net return after JasonAI investment.</p>
                <table role="img" aria-label="Estimated net return increases from year one through year four" width="100%" cellspacing="0" cellpadding="0" border="0">
                  ${buildChartRows(model)}
                </table>

                <p style="margin:28px 0 12px;color:#9b3d1e;font-size:12px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase;">Value, investment, and net return</p>
                <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #d9d2c3;border-collapse:collapse;">
                  <thead>
                    <tr style="background:#f8f3e8;">
                      <th style="padding:11px 12px;text-align:left;color:#6b6256;font-size:10px;text-transform:uppercase;">Period</th>
                      <th style="padding:11px 12px;text-align:right;color:#6b6256;font-size:10px;text-transform:uppercase;">Value</th>
                      <th style="padding:11px 12px;text-align:right;color:#6b6256;font-size:10px;text-transform:uppercase;">Investment</th>
                      <th style="padding:11px 12px;text-align:right;color:#6b6256;font-size:10px;text-transform:uppercase;">Net return</th>
                    </tr>
                  </thead>
                  <tbody>${buildYearRows(model)}</tbody>
                  <tfoot>
                    <tr style="background:#f8f3e8;">
                      <th style="padding:14px 12px;border-top:2px solid #141414;text-align:left;font-size:13px;">Four-year total</th>
                      <td style="padding:14px 12px;border-top:2px solid #141414;text-align:right;font-size:13px;font-weight:700;">${currency.format(model.totalValue)}</td>
                      <td style="padding:14px 12px;border-top:2px solid #141414;text-align:right;font-size:13px;">
                        <span style="color:#8a8176;text-decoration:line-through;">${standardInvestment}</span>
                        <strong style="display:block;color:#141414;">${preLaunchInvestment}</strong>
                      </td>
                      <td style="padding:14px 12px;border-top:2px solid #141414;text-align:right;color:#1f5f7a;font-size:14px;font-weight:800;">${currency.format(model.netReturn)}</td>
                    </tr>
                  </tfoot>
                </table>

                <p style="margin:24px 0 0;color:#6b6256;font-size:12px;line-height:1.6;">
                  This directional estimate uses the operating inputs entered in the JasonAI calculator and the current pre-launch offer. It is not a guarantee of savings or financial performance.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#1f5f7a;color:#ffffff;text-align:center;font-size:12px;">
                JasonAI by B2W &nbsp;·&nbsp; <a href="https://www.b2w-ai.com/jasonai/pricing" style="color:#ffffff;font-weight:700;">Determine your ROI</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const yearLines = model.years
    .map(
      (year) =>
        `Year ${year.year}: value ${currency.format(year.value)}, investment ${currency.format(year.investment)}, net return ${currency.format(year.net)}`,
    )
    .join('\n');

  const text = `JASONAI BY B2W
General Contractor AI ROI Report
Generated ${generatedDate}

Estimated four-year ROI: ${percentage.format(model.roi)}
Estimated four-year net return: ${currency.format(model.netReturn)}

YOUR INPUTS
Business type: ${typeLabel}
Employees: ${submission.employees}
Active projects: ${submission.activeProjects}
Average project duration: ${submission.averageProjectWeeks} weeks

YEAR-BY-YEAR ESTIMATE
${yearLines}

FOUR-YEAR TOTALS
Modeled value: ${currency.format(model.totalValue)}
Standard investment: ${standardInvestment}
Pre-launch investment: ${preLaunchInvestment}
Net return: ${currency.format(model.netReturn)}

This directional estimate uses the operating inputs entered in the JasonAI calculator and the current pre-launch offer. It is not a guarantee of savings or financial performance.

Determine your ROI: https://www.b2w-ai.com/jasonai/pricing`;

  return { subject, html, text };
}
