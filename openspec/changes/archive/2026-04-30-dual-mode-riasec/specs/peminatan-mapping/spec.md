## ADDED Requirements

### Requirement: Peminatan weight matrix data
The system SHALL define a weight matrix in `src/data/peminatan.ts` mapping each RIASEC personality type to peminatan group weights (IPA, IPS, Bahasa). Each weight set SHALL sum to 1.0. Initial weights SHALL be:
- Realistic: IPA 0.80, IPS 0.15, Bahasa 0.05
- Investigative: IPA 0.70, IPS 0.20, Bahasa 0.10
- Artistic: IPA 0.15, IPS 0.20, Bahasa 0.65
- Social: IPA 0.10, IPS 0.70, Bahasa 0.20
- Enterprising: IPA 0.10, IPS 0.65, Bahasa 0.25
- Conventional: IPA 0.15, IPS 0.70, Bahasa 0.15

#### Scenario: Weight lookup
- **WHEN** the peminatan calculation function reads the weight for Realistic
- **THEN** it returns `{ ipa: 0.80, ips: 0.15, bahasa: 0.05 }`

### Requirement: Peminatan percentage calculation
The system SHALL calculate peminatan percentages using the weighted sum formula: for each peminatan group, sum (score × weight) across all 6 RIASEC types, then normalize by dividing by the total weighted sum across all groups.

#### Scenario: Student with high R and I scores
- **WHEN** a student has scores R=10, I=12, A=2, S=1, E=1, C=3
- **THEN** IPA percentage is calculated as (10×0.80 + 12×0.70 + 2×0.15 + 1×0.10 + 1×0.10 + 3×0.15) / total_weighted_sum, yielding a high IPA percentage (>60%)

#### Scenario: Student with zero total score
- **WHEN** a student selects no statements at all (all scores = 0)
- **THEN** the system SHALL display equal percentages (33.3% each) or a message indicating no data

#### Scenario: Student with dominant A score
- **WHEN** a student has scores R=1, I=2, A=13, S=3, E=2, C=1
- **THEN** Bahasa percentage is the highest among the three groups, reflecting the 0.65 weight on Artistic

### Requirement: Peminatan type and info data
The system SHALL define a `PeminatanType` type (`"ipa"` | `"ips"` | `"bahasa"`) and a `PEMINATAN_INFO` record containing label, description, and subjects list for each peminatan group.

#### Scenario: Peminatan info lookup
- **WHEN** the result display reads info for "ipa"
- **THEN** it receives a label "Ilmu Pengetahuan Alam (IPA)", a narrative description, and a list of relevant subjects