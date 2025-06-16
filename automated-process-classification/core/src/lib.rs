pub mod logic;
pub mod classification;
pub mod matrix_generation;
pub mod parser;
pub mod dependency_types;
pub mod error;


pub use classification::{classify_matrix, InputMatrix};
pub use matrix_generation::generate_dependency_matrix;
pub use parser::parse_into_traces;
pub use error::{AppError};
pub use logic::process_xes_classification;
pub use logic::process_matrix_classification;
pub use dependency_types::dependency::Dependency;
pub use logic::MatrixRust;