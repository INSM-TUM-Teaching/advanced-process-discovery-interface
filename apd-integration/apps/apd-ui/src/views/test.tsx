import { useState } from "react";
import { fetchMatrix } from "@/services/matrix-api.ts";
import MatrixTable from "@/components/MatrixTable";
import type { Matrix } from "@/types/matrix-types.ts";

export default function Test() {
    const [url, setUrl] = useState("");
    const [matrix, setMatrix] = useState<Matrix | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [existentialThreshold, setExistentialThreshold] = useState<number | null>(null);
    const [temporalThreshold, setTemporalThreshold] = useState<number | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFile(file);
    };

    const handleFetch = async () => {
        try {
            if (url == null || file == null || existentialThreshold == null || temporalThreshold == null) {
                setError("Some of the parameters were null, either url, file or thresholds");
            }
            else {
                const matrix: Matrix = await fetchMatrix(new URL(url), file, {existential_threshold: existentialThreshold, temporal_threshold: temporalThreshold});
                setMatrix(matrix);
                setError(null);
            }
        } catch (err) {
            setError(`Failed to fetch or parse matrix: ${err}`);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Fetch the Activity Relationships Matrix</h1>

            <input
                type="file"
                accept=".xes"
                onChange={handleFileUpload}
                className="block"
            />

            <div className="mb-3">
                <label className="block mb-1 font-medium">Temporal Threshold:</label>
                <input
                    type="number"
                    step="0.01"
                    className="w-full border p-2"
                    value={temporalThreshold?.valueOf()}
                    onChange={(e) => setTemporalThreshold(parseFloat(e.target.value))}
                />
            </div>

            <div className="mb-3">
                <label className="block mb-1 font-medium">Existential Threshold:</label>
                <input
                    type="number"
                    step="0.01"
                    className="w-full border p-2"
                    value={existentialThreshold?.valueOf()}
                    onChange={(e) => setExistentialThreshold(parseFloat(e.target.value))}
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Enter matrix API URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="border px-2 py-1 w-full"
                />
                <button onClick={handleFetch} className="bg-blue-500 text-white px-4 py-1 rounded">
                    Fetch
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {matrix && (
                <div className="p-4">
                    <h1 className="text-xl font-bold mb-4">Dependency Matrix</h1>
                        <MatrixTable matrix={matrix} />
                </div>
            )}
        </div>
    );
}