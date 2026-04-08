import { useMemo, useState } from 'react';
import { Download, LineChart, PiggyBank, Wallet } from 'lucide-react';
import Seo from '../../components/Seo';

type ProjectionRow = {
  year: number;
  revenue: number;
  netOperatingIncome: number;
  annualDebtService: number;
  preTaxCashFlow: number;
  cumulativeCashFlow: number;
};

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const PERCENT = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function monthlyDebtPayment(principal: number, annualRate: number, termYears: number) {
  const monthlyRate = annualRate / 12;
  const totalPayments = termYears * 12;
  if (monthlyRate === 0) {
    return principal / totalPayments;
  }
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
}

function downloadReport(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function CoffeeShopFinancingModelPage() {
  const [purchasePrice, setPurchasePrice] = useState(550000);
  const [downPaymentPct, setDownPaymentPct] = useState(0.25);
  const [interestRate, setInterestRate] = useState(0.085);
  const [loanTermYears, setLoanTermYears] = useState(10);
  const [baseRevenue, setBaseRevenue] = useState(540000);
  const [revenueGrowth, setRevenueGrowth] = useState(0.04);
  const [grossMargin, setGrossMargin] = useState(0.67);
  const [annualOperatingCosts, setAnnualOperatingCosts] = useState(255000);
  const [projectionYears, setProjectionYears] = useState(7);

  const model = useMemo(() => {
    const downPayment = purchasePrice * clamp(downPaymentPct, 0.05, 0.9);
    const principal = purchasePrice - downPayment;
    const monthlyPayment = monthlyDebtPayment(principal, clamp(interestRate, 0, 0.2), loanTermYears);
    const annualDebtService = monthlyPayment * 12;

    const rows: ProjectionRow[] = [];
    let cumulativeCashFlow = 0;
    for (let year = 1; year <= projectionYears; year += 1) {
      const revenue = baseRevenue * Math.pow(1 + revenueGrowth, year - 1);
      const grossProfit = revenue * grossMargin;
      const netOperatingIncome = grossProfit - annualOperatingCosts;
      const preTaxCashFlow = netOperatingIncome - annualDebtService;
      cumulativeCashFlow += preTaxCashFlow;

      rows.push({
        year,
        revenue,
        netOperatingIncome,
        annualDebtService,
        preTaxCashFlow,
        cumulativeCashFlow,
      });
    }

    const yearOne = rows[0];
    const stabilizationYear = rows.find((row) => row.cumulativeCashFlow >= downPayment)?.year ?? null;
    const cashOnCash = downPayment > 0 ? yearOne.preTaxCashFlow / downPayment : 0;
    const dscr = annualDebtService > 0 ? yearOne.netOperatingIncome / annualDebtService : 0;

    return {
      downPayment,
      principal,
      monthlyPayment,
      annualDebtService,
      rows,
      yearOne,
      stabilizationYear,
      cashOnCash,
      dscr,
    };
  }, [
    annualOperatingCosts,
    baseRevenue,
    downPaymentPct,
    grossMargin,
    interestRate,
    loanTermYears,
    projectionYears,
    purchasePrice,
    revenueGrowth,
  ]);

  const handleDownload = () => {
    const lines = [
      'Coffee Shop Financing Model Report',
      `Generated: ${new Date().toISOString()}`,
      '',
      'Assumptions',
      `Purchase Price,${purchasePrice}`,
      `Down Payment %,${(downPaymentPct * 100).toFixed(2)}%`,
      `Interest Rate,${(interestRate * 100).toFixed(2)}%`,
      `Loan Term (Years),${loanTermYears}`,
      `Starting Revenue,${baseRevenue}`,
      `Revenue Growth %,${(revenueGrowth * 100).toFixed(2)}%`,
      `Gross Margin %,${(grossMargin * 100).toFixed(2)}%`,
      `Annual Operating Costs,${annualOperatingCosts}`,
      '',
      'Summary',
      `Down Payment,${model.downPayment.toFixed(2)}`,
      `Loan Principal,${model.principal.toFixed(2)}`,
      `Annual Debt Service,${model.annualDebtService.toFixed(2)}`,
      `Year 1 Cash Flow,${model.yearOne.preTaxCashFlow.toFixed(2)}`,
      `Year 1 DSCR,${model.dscr.toFixed(2)}`,
      `Year 1 Cash-on-Cash,${(model.cashOnCash * 100).toFixed(2)}%`,
      `Down Payment Recovery Year,${model.stabilizationYear ?? 'Not reached in selected horizon'}`,
      '',
      'Projection',
      'Year,Revenue,NOI,Debt Service,Pre-Tax Cash Flow,Cumulative Cash Flow',
      ...model.rows.map((row) =>
        `${row.year},${row.revenue.toFixed(2)},${row.netOperatingIncome.toFixed(2)},${row.annualDebtService.toFixed(2)},${row.preTaxCashFlow.toFixed(2)},${row.cumulativeCashFlow.toFixed(2)}`,
      ),
    ];

    downloadReport('coffee-shop-financing-model-report.csv', lines.join('\n'));
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-black">
      <Seo
        title="Coffee Shop Financing Model | B2W"
        description="Interactive investor income projection dashboard for coffee shop financing with downloadable report."
        canonicalPath="/work/coffeeshop-financing/model"
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <header className="mb-10 border border-neutral-200 bg-white p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">aliahmed.co/work/coffeeshop-financing/model</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Coffee Shop Financing Model</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600 md:text-base">
            Interactive dashboard for investor income projection. Update assumptions to test scenarios, review debt coverage and cash-on-cash return,
            then export a detailed report.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <section className="space-y-4 border border-neutral-200 bg-white p-5 md:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Assumptions</h2>

            {[
              ['Purchase Price', purchasePrice, setPurchasePrice, 250000, 1300000, 10000],
              ['Starting Annual Revenue', baseRevenue, setBaseRevenue, 200000, 1500000, 10000],
              ['Annual Operating Costs', annualOperatingCosts, setAnnualOperatingCosts, 100000, 700000, 5000],
            ].map(([label, value, setter, min, max, step]) => (
              <label key={String(label)} className="block">
                <div className="mb-1 flex items-center justify-between text-xs text-neutral-600">
                  <span>{label}</span>
                  <span className="font-mono">{CURRENCY.format(value as number)}</span>
                </div>
                <input
                  type="range"
                  min={min as number}
                  max={max as number}
                  step={step as number}
                  value={value as number}
                  onChange={(event) => (setter as (next: number) => void)(Number(event.target.value))}
                  className="w-full accent-black"
                />
              </label>
            ))}

            <label className="block">
              <div className="mb-1 flex items-center justify-between text-xs text-neutral-600">
                <span>Down Payment</span>
                <span className="font-mono">{PERCENT.format(downPaymentPct)}</span>
              </div>
              <input type="range" min={0.1} max={0.5} step={0.01} value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))} className="w-full accent-black" />
            </label>
            <label className="block">
              <div className="mb-1 flex items-center justify-between text-xs text-neutral-600">
                <span>Interest Rate</span>
                <span className="font-mono">{PERCENT.format(interestRate)}</span>
              </div>
              <input type="range" min={0.04} max={0.14} step={0.001} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full accent-black" />
            </label>
            <label className="block">
              <div className="mb-1 flex items-center justify-between text-xs text-neutral-600">
                <span>Revenue Growth</span>
                <span className="font-mono">{PERCENT.format(revenueGrowth)}</span>
              </div>
              <input type="range" min={0} max={0.12} step={0.005} value={revenueGrowth} onChange={(e) => setRevenueGrowth(Number(e.target.value))} className="w-full accent-black" />
            </label>
            <label className="block">
              <div className="mb-1 flex items-center justify-between text-xs text-neutral-600">
                <span>Gross Margin</span>
                <span className="font-mono">{PERCENT.format(grossMargin)}</span>
              </div>
              <input type="range" min={0.5} max={0.82} step={0.005} value={grossMargin} onChange={(e) => setGrossMargin(Number(e.target.value))} className="w-full accent-black" />
            </label>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="text-xs text-neutral-600">
                Loan Term
                <select className="mt-1 w-full border border-neutral-200 bg-white px-2 py-2 text-sm" value={loanTermYears} onChange={(e) => setLoanTermYears(Number(e.target.value))}>
                  {[5, 7, 10, 12, 15].map((option) => (
                    <option key={option} value={option}>
                      {option} years
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-neutral-600">
                Projection
                <select className="mt-1 w-full border border-neutral-200 bg-white px-2 py-2 text-sm" value={projectionYears} onChange={(e) => setProjectionYears(Number(e.target.value))}>
                  {[3, 5, 7, 10].map((option) => (
                    <option key={option} value={option}>
                      {option} years
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: Wallet,
                  label: 'Year 1 Cash Flow',
                  value: CURRENCY.format(model.yearOne.preTaxCashFlow),
                },
                {
                  icon: PiggyBank,
                  label: 'Cash on Cash',
                  value: PERCENT.format(model.cashOnCash),
                },
                {
                  icon: LineChart,
                  label: 'DSCR',
                  value: model.dscr.toFixed(2),
                },
                {
                  icon: Download,
                  label: 'Recovery Year',
                  value: model.stabilizationYear ? `Year ${model.stabilizationYear}` : 'Beyond horizon',
                },
              ].map((metric) => (
                <article key={metric.label} className="border border-neutral-200 bg-white p-5">
                  <metric.icon className="h-4 w-4 text-neutral-500" />
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-neutral-500">{metric.label}</p>
                  <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
                </article>
              ))}
            </div>

            <div className="border border-neutral-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold">Investor Income Projection</h2>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 border border-black bg-black px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-xs uppercase tracking-[0.12em] text-neutral-500">
                      <th className="px-3 py-3 font-medium">Year</th>
                      <th className="px-3 py-3 font-medium">Revenue</th>
                      <th className="px-3 py-3 font-medium">NOI</th>
                      <th className="px-3 py-3 font-medium">Debt Service</th>
                      <th className="px-3 py-3 font-medium">Pre-Tax Cash Flow</th>
                      <th className="px-3 py-3 font-medium">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.rows.map((row) => (
                      <tr key={row.year} className="border-b border-neutral-100">
                        <td className="px-3 py-3 font-mono text-xs">{row.year}</td>
                        <td className="px-3 py-3 font-mono text-xs">{CURRENCY.format(row.revenue)}</td>
                        <td className="px-3 py-3 font-mono text-xs">{CURRENCY.format(row.netOperatingIncome)}</td>
                        <td className="px-3 py-3 font-mono text-xs">{CURRENCY.format(row.annualDebtService)}</td>
                        <td className={`px-3 py-3 font-mono text-xs ${row.preTaxCashFlow >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{CURRENCY.format(row.preTaxCashFlow)}</td>
                        <td className={`px-3 py-3 font-mono text-xs ${row.cumulativeCashFlow >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{CURRENCY.format(row.cumulativeCashFlow)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
