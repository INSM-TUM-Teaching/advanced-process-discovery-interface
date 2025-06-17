use crate::dependency_types::existential::ExistentialDependency;
use crate::dependency_types::temporal::TemporalDependency;
use serde::{Serialize, Deserialize};
use crate::AppError;

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub struct Dependency {
    pub from: String,
    pub to: String,
    pub temporal_dependency: Option<TemporalDependency>,
    pub existential_dependency: Option<ExistentialDependency>,
}

impl Dependency {
    pub fn new(
        from: String,
        to: String,
        temporal_dependency: Option<TemporalDependency>,
        existential_dependency: Option<ExistentialDependency>,
    ) -> Self {
        Self {
            from,
            to,
            temporal_dependency,
            existential_dependency,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct IncomingDependencyType {
    #[serde(rename = "type")]
    pub r#type: String,
    pub direction: String,
}

#[derive(Debug, Deserialize)]
pub struct IncomingDependency {
    pub from: String,
    pub to: String,
    pub existential_dependency: IncomingDependencyType,
    pub temporal_dependency: IncomingDependencyType,
}

impl TryFrom<IncomingDependency> for crate::dependency_types::dependency::Dependency {
    type Error = AppError;

    fn try_from(dep: IncomingDependency) -> Result<Self, Self::Error> {
        use crate::dependency_types::existential::{ExistentialDependency, DependencyType as ExistentialType, Direction as ExistentialDirection};
        use crate::dependency_types::temporal::{TemporalDependency, DependencyType as TemporalType, Direction as TemporalDirection};

        let existential = if dep.temporal_dependency.r#type.to_lowercase() == "none" {
            None
        } else {
            Some(ExistentialDependency {
                from: dep.from.clone(),
                to: dep.to.clone(),
                dependency_type: match dep.existential_dependency.r#type.as_str() {
                    "Implication" => ExistentialType::Implication,
                    "Equivalence" => ExistentialType::Equivalence,
                    "NegatedEquivalence" => ExistentialType::NegatedEquivalence,
                    "Nand" => ExistentialType::Nand,
                    "Or" => ExistentialType::Or,
                    _ => return Err(AppError::InvalidInput("Invalid existential dependency type".into())),
                },
                direction: match dep.existential_dependency.direction.as_str() {
                    "Forward" => ExistentialDirection::Forward,
                    "Backward" => ExistentialDirection::Backward,
                    _ => return Err(AppError::InvalidInput("Invalid direction".into())),
                },
            })
        };

        let temporal = if dep.temporal_dependency.r#type.to_lowercase() == "none" {
            None
        } else {
            Some(TemporalDependency {
                from: dep.from.clone(),
                to: dep.to.clone(),
                dependency_type: match dep.temporal_dependency.r#type.as_str() {
                    "Direct" => TemporalType::Direct,
                    "Eventual" => TemporalType::Eventual,
                    other => return Err(AppError::InvalidInput(format!("Invalid temporal dependency type: {}", other))),
                },
                direction: match dep.temporal_dependency.direction.as_str() {
                    "Forward" => TemporalDirection::Forward,
                    "Backward" => TemporalDirection::Backward,
                    _ => return Err(AppError::InvalidInput("Invalid temporal direction".into())),
                },
            })
        };

        Ok(Self::new(
            dep.from,
            dep.to,
            temporal,
            existential,
        ))
    }
}

impl std::fmt::Display for Dependency {
    /// Formats the object using the given formatter.
    ///
    /// This method checks for the presence of `temporal_dependency` and `existential_dependency`
    /// and formats the output accordingly:
    /// - If both dependencies are present, it writes them separated by a comma.
    /// - If only `temporal_dependency` is present, it writes it followed by a comma and a dash.
    /// - If only `existential_dependency` is present, it writes a dash followed by the dependency.
    /// - If neither dependency is present, it writes "None".
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let temporal_dep = self.temporal_dependency.as_ref().map(|dep| dep.to_string());
        let existential_dep = self
            .existential_dependency
            .as_ref()
            .map(|dep| dep.to_string());

        match (temporal_dep, existential_dep) {
            (Some(t), Some(e)) => write!(f, "{},{}", t, e),
            (Some(t), None) => write!(f, "{},-", t),
            (None, Some(e)) => write!(f, "-,{}", e),
            (None, None) => write!(f, "None"),
        }
    }
}