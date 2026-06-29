import {
  minatHobiCategories,
  minatHobiQuestions,
  minatHobiScale,
} from "../data/minatHobi.ts";

export interface MinatHobiAnswerInput {
  question_number: number;
  answer_code: string;
}

export interface RankedMinatHobiCategory {
  rank: number;
  category_code: string;
  category_name: string;
  score: number;
}

export interface MinatHobiResponseRecord {
  question_number: number;
  question: string;
  answer_code: string;
  score: number;
  category_code: string;
}

export interface MinatHobiScoreResult {
  total_score: number;
  category_scores: Record<string, number>;
  ranked_categories: RankedMinatHobiCategory[];
  top_categories: RankedMinatHobiCategory[];
  responses: MinatHobiResponseRecord[];
}

const categoryNameByCode = new Map(
  minatHobiCategories.map((category) => [category.code, category.name] as const),
);

export function calculateMinatHobiResult(
  answers: MinatHobiAnswerInput[],
): MinatHobiScoreResult {
  const scoreByCode = new Map<string, number>(
    minatHobiScale.map((item) => [item.code, item.score]),
  );
  const questionByNumber = new Map(
    minatHobiQuestions.map((question) => [question.number, question] as const),
  );

  if (answers.length !== minatHobiQuestions.length) {
    throw new Error("MINAT_HOBI_INCOMPLETE");
  }

  const seen = new Set<number>();
  const categoryScores = Object.fromEntries(
    minatHobiCategories.map((category) => [category.code, 0]),
  ) as Record<string, number>;

  const responses: MinatHobiResponseRecord[] = answers.map((answer) => {
    const question = questionByNumber.get(answer.question_number);
    const score = scoreByCode.get(answer.answer_code);

    if (!question || score === undefined) {
      throw new Error("MINAT_HOBI_INVALID_ANSWER");
    }

    if (seen.has(answer.question_number)) {
      throw new Error("MINAT_HOBI_DUPLICATE_ANSWER");
    }

    seen.add(answer.question_number);
    categoryScores[question.categoryCode] += score;

    return {
      question_number: question.number,
      question: question.statement,
      answer_code: answer.answer_code,
      score,
      category_code: question.categoryCode,
    };
  });

  if (seen.size !== minatHobiQuestions.length) {
    throw new Error("MINAT_HOBI_INCOMPLETE");
  }

  const rankedCategories = minatHobiCategories
    .map((category) => ({
      rank: 0,
      category_code: category.code,
      category_name: category.name,
      score: categoryScores[category.code],
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        minatHobiCategories.findIndex((category) => category.code === a.category_code) -
        minatHobiCategories.findIndex((category) => category.code === b.category_code)
      );
    })
    .map((category, index) => ({
      ...category,
      rank: index + 1,
    }));

  return {
    total_score: responses.reduce((sum, response) => sum + response.score, 0),
    category_scores: categoryScores,
    ranked_categories: rankedCategories,
    top_categories: rankedCategories.slice(0, 3),
    responses,
  };
}

export function getMinatHobiCategoryName(code: string): string {
  return categoryNameByCode.get(code) ?? code;
}
