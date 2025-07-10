import type { Matrix, MatrixRust, Thresholds } from "@/types/matrix-types";
import type { ClassificationOutput } from "@/types/classification-types";

export function toInputMatrix(matrix: Matrix): MatrixRust {
    return {
        dependencies: matrix.dependencies.map(dep => ({
            key: [dep.from, dep.to],
            value: dep,
        })),
    };
}

export async function fetchClassification(url: URL, file: File, thresholds: Thresholds): Promise<ClassificationOutput> {
    const formData = new FormData();
    formData.append("file",file);
    formData.append("existential_threshold", thresholds.existential_threshold.toString());
    formData.append("temporal_threshold", thresholds.temporal_threshold.toString());

    const response = await fetch(url, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorText = response.body;
        throw new Error(`Failed to fetch classification ${errorText}`);
    }

    const classification: ClassificationOutput = await response.json();
    return classification;
}

export async function fetchClassificationFromMatrix(url: URL, matrix: Matrix) {
    const rustMatrix: MatrixRust = toInputMatrix(matrix);
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(rustMatrix)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Unknown error");
      }

    const classification: ClassificationOutput = await response.json();
    return classification;
}