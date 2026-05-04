import { TestResult, PeminatanType, PeminatanWeights } from "@/data/types";
import { PEMINATAN_WEIGHTS } from "@/data/peminatan";

type PeminatanPercentages = Record<PeminatanType, number>;

export function calculatePeminatanPercentages(
  results: TestResult[],
): PeminatanPercentages {
  let ipaSum = 0;
  let ipsSum = 0;
  let bahasaSum = 0;
  let totalScore = 0;

  for (const result of results) {
    const weights: PeminatanWeights = PEMINATAN_WEIGHTS[result.type];
    const score = result.score;
    ipaSum += score * weights.ipa;
    ipsSum += score * weights.ips;
    bahasaSum += score * weights.bahasa;
    totalScore += score;
  }

  const totalWeighted = ipaSum + ipsSum + bahasaSum;

  if (totalWeighted === 0 || totalScore === 0) {
    return { ipa: 33.33, ips: 33.33, bahasa: 33.34 };
  }

  return {
    ipa: Math.round((ipaSum / totalWeighted) * 100 * 100) / 100,
    ips: Math.round((ipsSum / totalWeighted) * 100 * 100) / 100,
    bahasa:
      Math.round((bahasaSum / totalWeighted) * 100 * 100) / 100,
  };
}

export function getTopPeminatan(
  percentages: PeminatanPercentages,
): PeminatanType[] {
  const entries = Object.entries(percentages) as [PeminatanType, number][];
  return entries.sort((a, b) => b[1] - a[1]).map(([type]) => type);
}
