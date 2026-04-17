-- Table: dialysis_performance_measures
CREATE TABLE dialysis_performance_measures (
    id              SERIAL PRIMARY KEY,
    facility_id     VARCHAR(20)     NOT NULL,
    patient_id      UUID            NOT NULL,
    measure_code    VARCHAR(10)     NOT NULL,
    measure_value   NUMERIC(6, 2),
    submission_date DATE            NOT NULL DEFAULT CURRENT_DATE,
    status          VARCHAR(20)     CHECK (status IN ('PENDING', 'SUBMITTED', 'REJECTED')),
    created_at      TIMESTAMP       DEFAULT NOW()
);

CREATE INDEX idx_facility_submission ON dialysis_performance_measures(facility_id, submission_date);

-- Query: Retrieve latest submission per facility with aggregate score
SELECT
    facility_id,
    MAX(submission_date)                        AS latest_submission,
    COUNT(*)                                    AS total_records,
    ROUND(AVG(measure_value), 2)                AS avg_measure_value,
    SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected_count
FROM dialysis_performance_measures
WHERE submission_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY facility_id
HAVING COUNT(*) > 0
ORDER BY latest_submission DESC;
