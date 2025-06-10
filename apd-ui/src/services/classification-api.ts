import type { Thresholds } from "@/types/matrix-types";

export async function fetchClassification(url: URL, file: File, thresholds: Thresholds): Promise<string> {
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

    const classification: string = await response.json();
    return classification;
}