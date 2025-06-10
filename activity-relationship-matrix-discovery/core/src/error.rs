use std::fmt;

#[derive(Debug)]
pub enum AppError {
    ParseError(String),
    MatrixGenerationError(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

pub type AppResult<T> = Result<T, AppError>;