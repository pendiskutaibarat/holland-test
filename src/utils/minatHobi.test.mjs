import assert from "node:assert/strict";
import test from "node:test";

const { minatHobiQuestions } = await import("../data/minatHobi.ts");
const { calculateMinatHobiResult } = await import("./minatHobi.ts");

function buildAnswers(overrides = {}) {
  return minatHobiQuestions.map((question) => ({
    question_number: question.number,
    answer_code: overrides[question.number] ?? "SETUJU",
  }));
}

test("calculates a complete 60-answer result", () => {
  const result = calculateMinatHobiResult(buildAnswers());

  assert.equal(result.total_score, 60);
  assert.equal(result.responses.length, 60);
  assert.equal(result.top_categories[0]?.score, 6);
  assert.equal(result.ranked_categories.length, 10);
  assert.equal(result.category_scores.outdoor, 6);
  assert.equal(result.category_scores.medical, 6);
});

test("rejects incomplete answers", () => {
  assert.throws(
    () => calculateMinatHobiResult(buildAnswers().slice(0, 59)),
    /MINAT_HOBI_INCOMPLETE/,
  );
});

test("rejects duplicate answers", () => {
  const answers = buildAnswers();
  answers[1] = answers[0];

  assert.throws(
    () => calculateMinatHobiResult(answers),
    /MINAT_HOBI_DUPLICATE_ANSWER/,
  );
});

test("rejects invalid answer codes", () => {
  const answers = buildAnswers({ 1: "MUNGKIN" });

  assert.throws(
    () => calculateMinatHobiResult(answers),
    /MINAT_HOBI_INVALID_ANSWER/,
  );
});

test("keeps tie ordering stable by category order", () => {
  const answers = buildAnswers();

  for (const answer of answers) {
    answer.answer_code = answer.question_number <= 12 ? "SETUJU" : "TIDAK_SETUJU";
  }

  const result = calculateMinatHobiResult(answers);

  assert.deepEqual(
    result.top_categories.map((category) => category.category_code),
    ["outdoor", "mechanical_practical", "computational_clerical"],
  );
});
