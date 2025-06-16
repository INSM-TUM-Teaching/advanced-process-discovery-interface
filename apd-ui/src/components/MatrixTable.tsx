import React from "react";
import type { Dependency, MatrixTableProps } from "@/types/matrix-types.tsx";
import { HelpCircleIcon } from "lucide-react";

const existentialSymbols: Record<string, string> = {
    ImplicationForward: "⇒",
    ImplicationBackward: "⇐",
    EquivalenceForward: "⇔",
    EquivalenceBackward: "⇔",
    NegatedEquivalenceForward: "⇎",
    NegatedEquivalenceBackward: "⇎",
    NandForward: "⊼",
    NandBackward: "⊼",
    OrBackward: "∨",
    OrForward: "∨"
};

const temporalSymbols: Record<string, string> = {
    DirectForward: "≺d",
    DirectBackward: "≻d",
    EventualForward: "≺ₑ",
    EventualBackward: "≻ₑ"
};

const getInterpretation = (dependency: Dependency | undefined): any => {
    if (!dependency) return "";

    const { existential_dependency, temporal_dependency } = dependency;
    let existential_explanation;
    let temporal_explanation;

    if (temporal_dependency.type == "Direct")
        temporal_explanation = `There is a direct temporal dependency. Thus, a termination of ${temporal_dependency.direction == "Forward" ? dependency.from : dependency.to
            } directly leads to the enablement of ${temporal_dependency.direction == "Forward" ? dependency.to : dependency.from
            }.`;

    if (temporal_dependency.type == "Eventual") {
        temporal_explanation = `There is an eventual temporal dependency. Thus, ${temporal_dependency.direction == "Forward" ? dependency.to : dependency.from
            } eventually follows ${temporal_dependency.direction == "Forward" ? dependency.from : dependency.to
            } meaning that there may be other activities before ${temporal_dependency.direction == "Forward" ? dependency.to : dependency.from
            } begins.`
    }

    switch (existential_dependency.type) {
        case "Implication":
            existential_explanation = `There is an implication. Thus, whenever ${existential_dependency.direction == "Forward" ? dependency.from : dependency.to
                } happens ${existential_dependency.direction == "Forward" ? dependency.to : dependency.from
                } must happen or must have happened.`
            break;
        case "Equivalence":
            existential_explanation = `There is an equivalence. Thus, iff ${existential_dependency.direction == "Forward" ? dependency.from : dependency.to
                } ⇒ ${existential_dependency.direction == "Forward" ? dependency.to : dependency.from
                } and ${existential_dependency.direction == "Forward" ? dependency.to : dependency.from
                } ⇒ ${existential_dependency.direction == "Forward" ? dependency.from : dependency.to
                }.`
            break;
        case "NegatedEquivalence":
            existential_explanation = `There is a negated equivalence. Thus, either ${dependency.from
                } or ${dependency.to
                } occurs.`
            break;
        case "Nand":
            existential_explanation = `There is a NAND (negated and). Thus, neither ${dependency.from
                } nor ${dependency.to
                } occurs.`
            break;
        case "Or":
            existential_explanation = `There is an OR. Thus, at least one of the two activities (${dependency.from},${dependency.to}) must occur.`
            break;

    }

    return (
        <>
            <p className="mt-2">
                {temporal_explanation}
            </p>
            <p className="mt-2">
                {existential_explanation}
            </p>
        </>
    );
};

const formatDependencySymbol = (dependency: Dependency | undefined) => {
    if (!dependency) return "TODO";

    const existential = existentialSymbols[dependency.existential_dependency.type + dependency.existential_dependency.direction] || "-";
    const temporal = temporalSymbols[dependency.temporal_dependency.type + dependency.temporal_dependency.direction] || "-";

    return `(${temporal} , ${existential})`;
};

const MatrixTable: React.FC<MatrixTableProps> = ({ matrix }) => {
    const { activities, dependencies } = matrix;

    const dependencyMap = new Map<string, Dependency>();
    dependencies.forEach((dep) => {
        dependencyMap.set(`${dep.from}_${dep.to}`, dep);
    });

    return (
        <div className="overflow-auto">
            <table className="table-auto border-collapse border border-gray-400 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-400 p-2 bg-gray-100">
                            <div className="flex justify-center items-center">
                                <a
                                    href="https://link.springer.com/article/10.1007/s10270-024-01234-5"
                                    target="_blank"
                                >
                                    <HelpCircleIcon className="w-5 h-5 text-gray-600" />
                                </a>
                            </div>
                        </th>
                        {activities.map((activity) => (
                            <th key={activity} className="border border-gray-400 p-2 bg-gray-100">
                                {activity}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {activities.map((fromActivity) => (
                        <tr key={fromActivity}>
                            <th className="border border-gray-400 p-2 bg-gray-100">{fromActivity}</th>
                            {activities.map((toActivity) => {
                                const key = `${fromActivity}_${toActivity}`;
                                const dep = dependencyMap.get(key);

                                return (
                                    <td
                                        key={toActivity}
                                        className="relative group border border-gray-400 p-2 text-center text-sm"
                                    >
                                        {formatDependencySymbol(dep)}
                                        {dep && (
                                            <div className="absolute z-10 hidden group-hover:block w-72 p-2 bg-white text-black text-xs shadow-lg border border-gray-300 rounded -bottom-1 left-1/2 -translate-x-1/2 translate-y-full whitespace-normal">
                                                {getInterpretation(dep)}
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MatrixTable;