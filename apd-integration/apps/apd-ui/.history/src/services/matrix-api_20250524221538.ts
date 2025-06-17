import type { Matrix, Dependency, Thresholds } from "@/types/matrix-types.tsx"

export async function fetchMatrix(url: URL, file: File, thresholds: Thresholds): Promise<Matrix> {
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
        throw new Error(`Failed to fetch matrix ${errorText}`);
    }

    const matrix: Matrix = await parseApiResponse(response.json());
    return matrix;
}

async function parseApiResponse(apiDataPromise: Promise<any>): Promise<Matrix> {
    const apiData = await apiDataPromise;
    const activities: string[] = apiData.activities;
  
    const dependencies: Dependency[] = [];
    
    for (const row of apiData.matrix) {
      for (const cell of row) {
        const dep = cell.dependency;
        if (dep) {
          dependencies.push({
            from: dep.from,
            to: dep.to,
            existential_dependency: {
              type: dep.existential_dependency?.dependency_type ?? 'none',
              direction: dep.existential_dependency?.direction ?? 'none',
            },
            temporal_dependency: {
              type: dep.temporal_dependency?.dependency_type ?? 'none',
              direction: dep.temporal_dependency?.direction ?? 'none',
            },
          });
        }
      }
    }
  
    return {
      activities,
      dependencies,
    };
  }