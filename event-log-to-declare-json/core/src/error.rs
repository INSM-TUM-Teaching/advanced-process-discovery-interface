#[derive(Debug, thiserror::Error, Clone, PartialEq)]
pub enum AppError {
    #[error("File reading error: {0}")]
    FileReadError(String),
    #[error("XES parsing error: {0}")]
    XesParseError(String),
    #[error("Classification error: {0}")]
    ClassificationError(String),
    #[error("Invalid input error: {0}")]
    InvalidInput(String),
    #[error("Error parsing traces: {0}")]
    ParseError(String)
}