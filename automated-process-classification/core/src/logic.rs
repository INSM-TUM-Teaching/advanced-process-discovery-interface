use crate::{generate_dependency_matrix, classify_matrix, parse_into_traces, InputMatrix};
use crate::AppError;

pub fn process_xes_classification(content: &str, existential_threshold: f64, temporal_threshold: f64) -> Result<String, AppError> {
    let traces = parse_into_traces(None, Some(&content))
    .map_err(|e| AppError::XesParseError(e.to_string()))?;

    if traces.is_empty() {
        return Err(AppError::XesParseError("No traces found in log.".to_string()));
    }

    let matrix: InputMatrix = generate_dependency_matrix(
        &traces,
        existential_threshold,
        temporal_threshold,
    );

    let classification_result = classify_matrix(&matrix);
    Ok(classification_result.to_string())
}