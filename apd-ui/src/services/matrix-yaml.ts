import yaml from "js-yaml";
import type { Matrix } from "@/types/matrix-types";

export const downloadYAML = (matrix: Matrix, name: string) => {
    const yamlStr = yaml.dump(matrix);
    const blob = new Blob([yamlStr], { type: "application/x-yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    if (name.endsWith(".xes")) {
        name = name.slice(0, name.length - 4);
      }

    a.download = name+"_matrix.yaml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};