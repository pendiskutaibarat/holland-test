import assert from "node:assert/strict";
import test from "node:test";

const { questions } = await import("../data/questions.ts");
const {
  calculatePeminatanScores,
  calculateRiasecResult,
  getPeminatanCompatibility,
  rankRiasecResults,
} = await import("./riasec.ts");

test("uses the 90-item RIASEC v2 instrument", () => {
  assert.equal(questions.length, 6);
  assert.deepEqual(
    questions.map((section) => section.questions.length),
    [15, 15, 15, 15, 15, 15],
  );
  assert.deepEqual(
    questions.flatMap((section) => section.questions.map((item) => item.number)),
    Array.from({ length: 90 }, (_, index) => index + 1),
  );
});

test("matches the I-R-C scoring example", () => {
  const scores = [
    { type: "realistic", score: 14 },
    { type: "investigative", score: 15 },
    { type: "artistic", score: 0 },
    { type: "social", score: 0 },
    { type: "enterprising", score: 0 },
    { type: "conventional", score: 13 },
  ];
  const result = calculatePeminatanScores(scores);
  assert.deepEqual(
    Object.fromEntries(result.map((item) => [item.type, item.score])),
    { ipa: 14, ips: 5, bahasa: 3 },
  );
});

test("matches the A-S-E scoring example", () => {
  const scores = [
    { type: "realistic", score: 0 },
    { type: "investigative", score: 0 },
    { type: "artistic", score: 15 },
    { type: "social", score: 14 },
    { type: "enterprising", score: 13 },
    { type: "conventional", score: 0 },
  ];
  const result = calculatePeminatanScores(scores);
  assert.deepEqual(
    Object.fromEntries(result.map((item) => [item.type, item.score])),
    { bahasa: 14, ips: 12, ipa: 0 },
  );
});

test("applies every compatibility boundary", () => {
  assert.deepEqual(
    [0, 4, 5, 9, 10, 14].map(getPeminatanCompatibility),
    [
      "kurang_cocok",
      "kurang_cocok",
      "cukup_cocok",
      "cukup_cocok",
      "sangat_cocok",
      "sangat_cocok",
    ],
  );
});

test("uses canonical R-I-A-S-E-C order for ties", () => {
  const result = rankRiasecResults([
    { type: "conventional", score: 4 },
    { type: "enterprising", score: 4 },
    { type: "social", score: 4 },
    { type: "artistic", score: 4 },
    { type: "investigative", score: 4 },
    { type: "realistic", score: 4 },
  ]);
  assert.equal(result.hollandCode, "RIA");
  assert.equal(result.hasTies, true);
});

test("rejects invalid selections and returns no empty recommendation", () => {
  assert.throws(() => calculateRiasecResult([1, 1]), /duplikat/);
  assert.throws(() => calculateRiasecResult([91]), /1-90/);
  const empty = calculateRiasecResult([]);
  assert.equal(empty.hollandCode, null);
  assert.equal(empty.peminatan, null);
  assert.deepEqual(empty.top3, []);
});
