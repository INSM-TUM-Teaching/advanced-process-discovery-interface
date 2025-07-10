import type { MatrixRust, Matrix, Thresholds } from "@/types/matrix-types";
import { toInputMatrix } from "./classification-api";

export async function fetchDeclareFromMatrix(url: URL, matrix: Matrix) {
    const rustMatrix: MatrixRust = toInputMatrix(matrix);
    console.log(JSON.stringify(matrix));
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

    const declare: string = await response.text();
    return declare;
}

export async function fetchDeclareFromLog(url: URL, eventLog: File, thresholds: Thresholds) {
    const formData = new FormData();
    formData.append("file",eventLog);
    formData.append("existential_threshold", thresholds.existential_threshold.toString());
    formData.append("temporal_threshold", thresholds.temporal_threshold.toString());
    
    const response = await fetch(url, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Unknown error");
      }

    const declare: string = await response.text();
    return declare;
}