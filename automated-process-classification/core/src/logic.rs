use crate::{generate_dependency_matrix, classify_matrix, parse_into_traces, InputMatrix, ClassificationOutput};
use crate::AppError;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::dependency_types::dependency::Dependency;
use crate::dependency_types::dependency::IncomingDependency;

#[derive(Debug, Deserialize)]
pub struct IncomingDependencyEntry {
    pub key: (String, String),
    pub value: IncomingDependency,
}

#[derive(Debug, Deserialize)]
pub struct MatrixRustIncoming {
    pub dependencies: Vec<IncomingDependencyEntry>,
}

fn to_input_matrix(dto: MatrixRustIncoming) -> Result<InputMatrix, AppError> {
    dto.dependencies
        .into_iter()
        .map(|entry| {
            let value = entry.value.try_into()?;
            Ok((entry.key, value))
        })
        .collect()
}

pub fn process_xes_classification(content: &str, existential_threshold: f64, temporal_threshold: f64) -> Result<ClassificationOutput, AppError> {
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
    Ok(classification_result)
}

pub fn process_matrix_classification(matrix_react: MatrixRustIncoming) -> Result<ClassificationOutput, AppError> {
    let matrix = to_input_matrix(matrix_react)?;
    let classification_result = classify_matrix(&matrix);
    Ok(classification_result)
}