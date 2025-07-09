import type { MatrixRust, Matrix } from "@/types/matrix-types";
import { toInputMatrix } from "./classification-api";

export async function fetchDeclareFromMatrix(url: URL, matrix: Matrix) {
    const rustMatrix: MatrixRust = toInputMatrix(matrix);
    console.log(JSON.stringify(rustMatrix));
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

    const declare: string = await response.json();
    return declare;
}