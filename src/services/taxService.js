/**
 * Tax calculation service for freelancers and self-employed individuals
 */

// 2023 Federal Tax Brackets (Single)
const FEDERAL_TAX_BRACKETS_2023_SINGLE = [
  { min: 0, max: 11000, rate: 0.10 },
  { min: 11000, max: 44725, rate: 0.12 },
  { min: 44725, max: 95375, rate: 0.22 },
  { min: 95375, max: 182100, rate: 0.24 },
  { min: 182100, max: 231250, rate: 0.32 },
  { min: 231250, max: 578125, rate: 0.35 },
  { min: 578125, max: Infinity, rate: 0.37 }
];

// 2023 Federal Tax Brackets (Married Filing Jointly)
const FEDERAL_TAX_BRACKETS_2023_MARRIED_JOINT = [
  { min: 0, max: 22000, rate: 0.10 },
  { min: 22000, max: 89450, rate: 0.12 },
  { min: 89450, max: 190750, rate: 0.22 },
  { min: 190750, max: 364200, rate: 0.24 },
  { min: 364200, max: 462500, rate: 0.32 },
  { min: 462500, max: 693750, rate: 0.35 },
  { min: 693750, max: Infinity, rate: 0.37 }
];

// 2023 Federal Tax Brackets (Married Filing Separately)
const FEDERAL_TAX_BRACKETS_2023_MARRIED_SEPARATE = [
  { min: 0, max: 11000, rate: 0.10 },
  { min: 11000, max: 44725, rate: 0.12 },
  { min: 44725, max: 95375, rate: 0.22 },
  { min: 95375, max: 182100, rate: 0.24 },
  { min: 182100, max: 231250, rate: 0.32 },
  { min: 231250, max: 346875, rate: 0.35 },
  { min: 346875, max: Infinity, rate: 0.37 }
];

// 2023 Federal Tax Brackets (Head of Household)
const FEDERAL_TAX_BRACKETS_2023_HEAD_HOUSEHOLD = [
  { min: 0, max: 15700, rate: 0.10 },
  { min: 15700, max: 59850, rate: 0.12 },
  { min: 59850, max: 95350, rate: 0.22 },
  { min: 95350, max: 182100, rate: 0.24 },
  { min: 182100, max: 231250, rate: 0.32 },
  { min: 231250, max: 578100, rate: 0.35 },
  { min: 578100, max: Infinity, rate: 0.37 }
];

// 2023 Standard Deduction
const STANDARD_DEDUCTION_2023 = {
  single: 13850,
  married_joint: 27700,
  married_separate: 13850,
  head_household: 20800,
  qualifying_widow: 27700
};

// 2023 Self-Employment Tax Rate
const SELF_EMPLOYMENT_TAX_RATE = 0.153; // 15.3%
const SELF_EMPLOYMENT_TAX_WAGE_BASE = 160200; // For 2023

// State Tax Rates (simplified for example)
const STATE_TAX_RATES = {
  'AL': 0.05,
  'AK': 0.00,
  'AZ': 0.0459,
  'AR': 0.055,
  'CA': 0.0930,
  'CO': 0.0455,
  'CT': 0.0699,
  'DE': 0.066,
  'FL': 0.00,
  'GA': 0.0575,
  'HI': 0.11,
  'ID': 0.06,
  'IL': 0.0495,
  'IN': 0.0323,
  'IA': 0.0575,
  'KS': 0.057,
  'KY': 0.05,
  'LA': 0.0425,
  'ME': 0.0715,
  'MD': 0.0575,
  'MA': 0.05,
  'MI': 0.0425,
  'MN': 0.0985,
  'MS': 0.05,
  'MO': 0.0495,
  'MT': 0.0675,
  'NE': 0.0684,
  'NV': 0.00,
  'NH': 0.05,
  'NJ': 0.1075,
  'NM': 0.059,
  'NY': 0.109,
  'NC': 0.0499,
  'ND': 0.0290,
  'OH': 0.0399,
  'OK': 0.0475,
  'OR': 0.099,
  'PA': 0.0307,
  'RI': 0.0599,
  'SC': 0.07,
  'SD': 0.00,
  'TN': 0.00,
  'TX': 0.00,
  'UT': 0.0495,
  'VT': 0.0875,
  'VA': 0.0575,
  'WA': 0.00,
  'WV': 0.065,
  'WI': 0.0765,
  'WY': 0.00,
  'DC': 0.0895
};

/**
 * Calculate federal income tax based on taxable income and filing status
 * @param {number} taxableIncome - Taxable income after deductions
 * @param {string} filingStatus - Filing status (single, married_joint, etc.)
 * @param {number} year - Tax year
 * @returns {number} Federal income tax amount
 */
function calculateFederalIncomeTax(taxableIncome, filingStatus, year = 2023) {
  // Select the appropriate tax brackets based on filing status
  let brackets;
  switch (filingStatus) {
    case 'married_joint':
    case 'qualifying_widow':
      brackets = FEDERAL_TAX_BRACKETS_2023_MARRIED_JOINT;
      break;
    case 'married_separate':
      brackets = FEDERAL_TAX_BRACKETS_2023_MARRIED_SEPARATE;
      break;
    case 'head_household':
      brackets = FEDERAL_TAX_BRACKETS_2023_HEAD_HOUSEHOLD;
      break;
    case 'single':
    default:
      brackets = FEDERAL_TAX_BRACKETS_2023_SINGLE;
      break;
  }

  // Calculate tax using progressive brackets
  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      const taxableAmountInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      tax += taxableAmountInBracket * bracket.rate;
    }
    if (taxableIncome <= bracket.max) {
      break;
    }
  }

  return tax;
}

/**
 * Calculate self-employment tax
 * @param {number} netBusinessIncome - Net business income
 * @returns {number} Self-employment tax amount
 */
function calculateSelfEmploymentTax(netBusinessIncome) {
  // Self-employment tax is calculated on 92.35% of net business income
  const taxableIncome = netBusinessIncome * 0.9235;
  
  // Social Security portion (12.4%) is capped at the wage base
  const socialSecurityTax = Math.min(taxableIncome, SELF_EMPLOYMENT_TAX_WAGE_BASE) * 0.124;
  
  // Medicare portion (2.9%) has no cap
  const medicareTax = taxableIncome * 0.029;
  
  return socialSecurityTax + medicareTax;
}

/**
 * Calculate state income tax
 * @param {number} taxableIncome - Taxable income
 * @param {string} state - State code (e.g., 'CA', 'NY')
 * @returns {number} State income tax amount
 */
function calculateStateTax(taxableIncome, state) {
  if (!state || !STATE_TAX_RATES[state]) {
    return 0;
  }
  
  return taxableIncome * STATE_TAX_RATES[state];
}

/**
 * Calculate taxes for a freelancer or self-employed individual
 * @param {Object} params - Tax calculation parameters
 * @returns {Object} Tax calculation results
 */
export async function calculateTaxes(params) {
  const {
    income,
    expenses,
    year = new Date().getFullYear(),
    country = 'US',
    state = '',
    businessType = 'sole_prop',
    filingStatus = 'single',
    dependents = 0
  } = params;

  // For now, we only support US tax calculations
  if (country !== 'US') {
    throw new Error('Only US tax calculations are supported at this time');
  }

  // Calculate net business income
  const grossIncome = income;
  const netBusinessIncome = Math.max(0, grossIncome - expenses);

  // Calculate self-employment tax
  const selfEmploymentTax = calculateSelfEmploymentTax(netBusinessIncome);
  
  // Calculate adjusted gross income (AGI)
  // For simplicity, we're just using net business income minus half of self-employment tax
  const adjustedGrossIncome = netBusinessIncome - (selfEmploymentTax / 2);
  
  // Apply standard deduction
  const standardDeduction = STANDARD_DEDUCTION_2023[filingStatus] || STANDARD_DEDUCTION_2023.single;
  const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction);
  
  // Calculate federal income tax
  const federalIncomeTax = calculateFederalIncomeTax(taxableIncome, filingStatus, year);
  
  // Calculate state tax
  const stateTax = calculateStateTax(taxableIncome, state);
  
  // Calculate total tax
  const totalFederalTax = federalIncomeTax + selfEmploymentTax;
  const totalTax = totalFederalTax + stateTax;
  
  // Calculate effective tax rate
  const effectiveTaxRate = (totalTax / grossIncome) * 100;
  
  // Calculate quarterly estimated tax payments
  const quarterlyTax = totalTax / 4;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    grossIncome,
    expenses,
    netBusinessIncome,
    adjustedGrossIncome,
    taxableIncome,
    selfEmploymentTax,
    federalIncomeTax,
    stateTax,
    totalFederalTax,
    totalTax,
    effectiveTaxRate,
    quarterlyTax
  };
} 