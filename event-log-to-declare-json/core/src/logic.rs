use crate::{generate_dependency_matrix, matrix_to_declare_model, declare_model_to_txt, parse_into_traces, InputMatrix, Activity, DeclareModel};
use crate::AppError;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::dependency_types::dependency::Dependency;
use crate::dependency_types::dependency::IncomingDependency;
use std::collections::HashSet;

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

fn extract_activities(dto: &MatrixRustIncoming) -> Result<HashSet<String>, AppError> {
    let activities = dto
        .dependencies
        .iter()
        .flat_map(|entry| vec![entry.key.0.clone(), entry.key.1.clone()])
        .collect::<HashSet<String>>();

    Ok(activities)
}

pub fn process_matrix_declare(matrix_react: MatrixRustIncoming) -> Result<String, AppError> {
    let activities = extract_activities(&matrix_react)?;
    let matrix = to_input_matrix(matrix_react)?;
    let declare_model = matrix_to_declare_model(&matrix, &activities, "model");
    let classification_result = declare_model_to_txt(&declare_model);
    Ok(classification_result)
}