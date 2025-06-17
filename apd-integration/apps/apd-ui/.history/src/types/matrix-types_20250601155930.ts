type DependencyType = {
    type: string,
    direction: string
}

export type Dependency = {
    from: string,
    to: string,
    existential_dependency: DependencyType,
    temporal_dependency: DependencyType
}

export type Matrix = {
    activities: string[],
    dependencies: Dependency[]
}

export type Thresholds = {
    existential_threshold: number,
    temporal_threshold: number
}

export type MatrixTableProps = {
    matrix: Matrix;
};