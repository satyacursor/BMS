/**
 * EC FARM PRO - BOILER MANAGEMENT SYSTEM
 * Standard Poultry Scientific Calculations & Formatting Utilities
 */

import { Batch, BatchClosingData, DailyLogRecord, ExpenseRecord, BirdSaleRecord } from '../types';

/**
 * Calculates Mortality Percentage
 * Formula: (Total Mortality / Initial Chicks Placed) * 100
 */
export function calculateMortalityPercent(initialChicks: number, totalMortality: number): number {
  if (initialChicks <= 0) return 0;
  const pct = (totalMortality / initialChicks) * 100;
  return Number(pct.toFixed(2));
}

/**
 * Calculates Livability Percentage
 * Formula: 100 - Mortality %
 */
export function calculateLivabilityPercent(initialChicks: number, totalMortality: number): number {
  const mortPct = calculateMortalityPercent(initialChicks, totalMortality);
  return Number((100 - mortPct).toFixed(2));
}

/**
 * Calculates Feed Conversion Ratio (FCR)
 * Formula: Total Feed Consumed (kg) / Total Live Body Weight Produced or Sold (kg)
 * Standard industry benchmark: 1.45 to 1.65 for modern broiler breeds (Cobb 500 / Ross 308)
 */
export function calculateFCR(totalFeedConsumedKg: number, totalWeightProducedKg: number): number {
  if (totalWeightProducedKg <= 0 || totalFeedConsumedKg <= 0) return 0;
  const fcr = totalFeedConsumedKg / totalWeightProducedKg;
  return Number(fcr.toFixed(3));
}

/**
 * Calculates European Production Efficiency Factor (EPEF / PEF)
 * Standard international performance index for boiler poultry batches
 * Formula: (Livability % * Average Weight in kg * 100) / (Age in Days * FCR)
 * Benchmark: > 380 is Good, > 420 is Excellent
 */
export function calculateEPEF(
  livabilityPercent: number,
  averageWeightKg: number,
  ageInDays: number,
  fcr: number
): number {
  if (ageInDays <= 0 || fcr <= 0) return 0;
  const epef = (livabilityPercent * averageWeightKg * 100) / (ageInDays * fcr);
  return Math.round(epef);
}

/**
 * Compute Batch Closing Comprehensive P&L
 */
export function computeBatchClosing(
  batch: Batch,
  salesForBatch: BirdSaleRecord[],
  logsForBatch: DailyLogRecord[],
  expensesForBatch: ExpenseRecord[],
  closingDateStr: string,
  remarks: string = 'Batch Closed Successfully'
): BatchClosingData {
  const initialChicks = batch.initialChicks;
  const chickCost = initialChicks * batch.chickRate;

  // Sales aggregation
  const finalBirdsSold = salesForBatch.reduce((sum, s) => sum + s.birdsCount, 0);
  const totalWeightSoldKg = salesForBatch.reduce((sum, s) => sum + s.netWeightKg, 0);
  const totalRevenue = salesForBatch.reduce((sum, s) => sum + s.finalAmount, 0);

  const averageWeightKg = finalBirdsSold > 0 ? Number((totalWeightSoldKg / finalBirdsSold).toFixed(2)) : batch.averageWeightKg;
  const averageRatePerKg = totalWeightSoldKg > 0 ? Number((totalRevenue / totalWeightSoldKg).toFixed(2)) : 0;

  // Mortality from daily logs
  const logMortality = logsForBatch.reduce((sum, l) => sum + l.mortalityCount + l.cullsCount, 0);
  const totalMortality = Math.max(batch.totalMortality, logMortality);
  const mortalityPercent = calculateMortalityPercent(initialChicks, totalMortality);
  const livabilityPercent = calculateLivabilityPercent(initialChicks, totalMortality);

  // Feed consumption
  const logFeedKg = logsForBatch.reduce((sum, l) => sum + l.feedConsumedKg, 0);
  const totalFeedConsumedKg = Math.max(batch.totalFeedConsumedKg, logFeedKg);

  // FCR & EPEF
  const fcr = calculateFCR(totalFeedConsumedKg, totalWeightSoldKg);
  const ageInDays = Math.max(1, batch.currentAgeDays);
  const epef = calculateEPEF(livabilityPercent, averageWeightKg, ageInDays, fcr);

  // Expenses breakdown
  let feedCost = 0;
  let medicineVaccineCost = 0;
  let dieselElectricityCost = 0;
  let labourCost = 0;
  let otherOverheads = 0;

  expensesForBatch.forEach((exp) => {
    const cat = exp.expenseCategory;
    if (cat === 'Feed Purchase') feedCost += exp.amount;
    else if (cat === 'Medicines & Sanitizers') medicineVaccineCost += exp.amount;
    else if (cat === 'Electricity & EB Bill' || cat === 'Generator Diesel' || cat === 'Gas Brooding / Heating') {
      dieselElectricityCost += exp.amount;
    } else if (cat === 'Labour & Wages') labourCost += exp.amount;
    else otherOverheads += exp.amount;
  });

  // If feed cost wasn't logged as direct expense, estimate standard bag rate: 50kg bag @ ₹2,200 (₹44/kg)
  if (feedCost === 0 && totalFeedConsumedKg > 0) {
    feedCost = Math.round(totalFeedConsumedKg * 44);
  }

  const totalExpenses = chickCost + feedCost + medicineVaccineCost + dieselElectricityCost + labourCost + otherOverheads;
  const netProfit = totalRevenue - totalExpenses;
  const profitPerBird = finalBirdsSold > 0 ? Number((netProfit / finalBirdsSold).toFixed(2)) : 0;
  const profitPerKg = totalWeightSoldKg > 0 ? Number((netProfit / totalWeightSoldKg).toFixed(2)) : 0;
  const costPerKg = totalWeightSoldKg > 0 ? Number((totalExpenses / totalWeightSoldKg).toFixed(2)) : 0;

  return {
    closingDate: closingDateStr,
    finalBirdsSold,
    totalWeightSoldKg: Number(totalWeightSoldKg.toFixed(2)),
    averageWeightKg,
    averageRatePerKg,
    totalMortality,
    mortalityPercent,
    totalFeedConsumedKg: Number(totalFeedConsumedKg.toFixed(1)),
    fcr,
    epef,
    totalRevenue,
    chickCost,
    feedCost,
    medicineVaccineCost,
    dieselElectricityCost,
    labourCost,
    otherOverheads,
    totalExpenses,
    netProfit,
    profitPerBird,
    profitPerKg,
    costPerKg,
    remarks,
  };
}

/**
 * Format currency with Indian / Standard notation
 */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  if (isNaN(amount) || amount === null || amount === undefined) return `${symbol}0`;
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${symbol}${formatted}`;
}

/**
 * Format number with comma separators
 */
export function formatNumber(val: number, decimals: number = 0): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

/**
 * Format Date to standard DD-MMM-YYYY
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate age in days between two ISO dates
 */
export function calculateAgeDays(placementDateStr: string, targetDateStr?: string): number {
  if (!placementDateStr) return 0;
  const start = new Date(placementDateStr).getTime();
  const end = targetDateStr ? new Date(targetDateStr).getTime() : new Date().getTime();
  const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
