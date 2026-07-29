export type JasonAiBusinessType = 'contractor' | 'firm';

export type JasonAiBusinessProfile = {
  employees: number;
  activeProjects: number;
  averageProjectWeeks: number;
};

export type JasonAiScenario = {
  type: JasonAiBusinessType;
  businesses: number;
  teamMembers: number;
  weeklyBusinessHours: number;
  hourlyCost: number;
  annualGrowth: number;
};

export type JasonAiRoiYear = {
  year: number;
  value: number;
  standardInvestment: number;
  investment: number;
  net: number;
};

export type JasonAiRoiModel = {
  preLaunchFirstYearSavings: number;
  years: JasonAiRoiYear[];
  totalValue: number;
  totalStandardInvestment: number;
  totalInvestment: number;
  netReturn: number;
  roi: number;
};

const scenarioDefaults: Record<JasonAiBusinessType, JasonAiScenario> = {
  contractor: {
    type: 'contractor',
    businesses: 1,
    teamMembers: 4,
    weeklyBusinessHours: 45,
    hourlyCost: 65,
    annualGrowth: 5,
  },
  firm: {
    type: 'firm',
    businesses: 5,
    teamMembers: 20,
    weeklyBusinessHours: 45,
    hourlyCost: 85,
    annualGrowth: 7,
  },
};

export const jasonAiProfileDefaults: Record<JasonAiBusinessType, JasonAiBusinessProfile> = {
  contractor: {
    employees: 12,
    activeProjects: 6,
    averageProjectWeeks: 16,
  },
  firm: {
    employees: 50,
    activeProjects: 20,
    averageProjectWeeks: 20,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function buildJasonAiScenario(
  type: JasonAiBusinessType,
  profile: JasonAiBusinessProfile,
): JasonAiScenario {
  const businesses = type === 'firm' ? clamp(Math.round(profile.activeProjects / 4), 2, 12) : 1;
  const coordinationShare = type === 'firm' ? 0.25 : 0.35;
  const projectLoad = profile.activeProjects / Math.max(1, profile.employees);

  return {
    ...scenarioDefaults[type],
    businesses,
    teamMembers: clamp(
      Math.round(profile.employees * coordinationShare + Math.min(4, profile.activeProjects / 10)),
      1,
      100,
    ),
    weeklyBusinessHours: clamp(
      Math.round((38 + Math.min(20, projectLoad * 30)) / 5) * 5,
      35,
      60,
    ),
    annualGrowth: clamp(
      Math.round(4 + Math.min(8, projectLoad * 5 + 26 / profile.averageProjectWeeks)),
      0,
      20,
    ),
  };
}

export function calculateJasonAiRoi(scenario: JasonAiScenario): JasonAiRoiModel {
  const communicationShare = 0.15;
  const timeRecoveryRate = 0.3;
  const portfolioMultiplier =
    scenario.type === 'firm' ? 1 + Math.min(0.45, Math.max(0, scenario.businesses - 1) * 0.07) : 1;
  const standardMonthlyInvestment = 99;
  const preLaunchMonthlyInvestment = 25;
  const standardSetupInvestment = 2_000;
  const preLaunchSetupInvestment = 0;
  const firstYearTimeRecovered =
    scenario.teamMembers *
    scenario.weeklyBusinessHours *
    communicationShare *
    52 *
    scenario.hourlyCost *
    timeRecoveryRate *
    portfolioMultiplier;

  const years = Array.from({ length: 4 }, (_, index): JasonAiRoiYear => {
    const growthFactor = Math.pow(1 + scenario.annualGrowth / 100, index);
    const value = firstYearTimeRecovered * growthFactor;
    const standardInvestment =
      index === 0
        ? standardMonthlyInvestment * 12 + standardSetupInvestment
        : standardMonthlyInvestment * 12;
    const investment =
      index === 0
        ? preLaunchMonthlyInvestment * 12 + preLaunchSetupInvestment
        : standardMonthlyInvestment * 12;

    return {
      year: index + 1,
      value,
      standardInvestment,
      investment,
      net: value - investment,
    };
  });

  const totalValue = years.reduce((sum, year) => sum + year.value, 0);
  const totalStandardInvestment = years.reduce((sum, year) => sum + year.standardInvestment, 0);
  const totalInvestment = years.reduce((sum, year) => sum + year.investment, 0);
  const netReturn = totalValue - totalInvestment;
  const roi = totalInvestment > 0 ? netReturn / totalInvestment : 0;
  const standardFirstYearInvestment = standardMonthlyInvestment * 12 + standardSetupInvestment;
  const preLaunchFirstYearInvestment = years[0].investment;

  return {
    preLaunchFirstYearSavings: standardFirstYearInvestment - preLaunchFirstYearInvestment,
    years,
    totalValue,
    totalStandardInvestment,
    totalInvestment,
    netReturn,
    roi,
  };
}
