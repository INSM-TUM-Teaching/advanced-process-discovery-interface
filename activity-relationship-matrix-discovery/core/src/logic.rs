use crate::parser::{parse_into_traces, variants_of_traces};
use crate::generate_adj_matrix_from_traces;
use crate::DependencyMatrix;
use crate::error::{AppResult, AppError};

pub fn process_xes_content(content: &str, existential_threshold: f64, temporal_threshold: f64) -> AppResult<DependencyMatrix> {
    let traces = parse_into_traces(None, Some(content))
        .map_err(|e| AppError::ParseError(format!("{:?}", e)))?;

    let adj_matrix = generate_adj_matrix_from_traces(
        traces.clone(),
        existential_threshold,
        temporal_threshold,
    );

    Ok(adj_matrix)
}