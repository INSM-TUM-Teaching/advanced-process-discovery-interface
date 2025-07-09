pub mod logic;
pub mod declare_translation;
pub mod matrix_generation;
pub mod parser;
pub mod dependency_types;
pub mod error;


pub use matrix_generation::{InputMatrix, Activity};
pub use matrix_generation::generate_dependency_matrix;
pub use declare_translation::{matrix_to_declare_model, declare_model_to_txt};
pub use declare_translation::DeclareModel;
pub use parser::parse_into_traces;
pub use error::{AppError};
pub use logic::process_matrix_declare;
pub use dependency_types::dependency::Dependency;
pub use logic::MatrixRustIncoming;