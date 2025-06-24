import React from "react";
import type { Dependency, MatrixTableProps } from "@/types/matrix-types.tsx";
import { HelpCircleIcon } from "lucide-react";

const NegatedEquivalenceSymbol = () => (
    <span
        style={{
            position: "relative",
            display: "inline-block",
            width: "1.4em",
            height: "1.2em",
            textAlign: "center",
        }}
    >
        <span
            style={{
                fontSize: "1.3em",
                lineHeight: "1.2em",
                fontFamily: "serif",
                fontWeight: "bold",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
            }}
        >
            ⇔
        </span>

        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
                position: "absolute",
                top: 3,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        >
            <line
                x1="40"
                y1="90"
                x2="70"
                y2="10"
                stroke="black"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    </span>
);

const existentialSymbols: Record<string, React.ReactNode> = {
    ImplicationForward: "⇒",
    ImplicationBackward: "⇐",
    EquivalenceForward: (
        <span style={{ fontSize: "1.3em", fontWeight: "bold", fontFamily: "serif", display: "inline-block" }}>
            ⇔
        </span>
    ),
    EquivalenceBackward: (
        <span style={{ fontSize: "1.3em", fontWeight: "bold", fontFamily: "serif", display: "inline-block" }}>
            ⇔
        </span>
    ),
    NegatedEquivalenceForward: <NegatedEquivalenceSymbol />,
    NegatedEquivalenceBackward: <NegatedEquivalenceSymbol />,
    NandForward: "⊼",
    NandBackward: "⊼",
    OrBackward: "∨",
    OrForward: "∨"
};

const formatExistentialSymbol = (type: string, direction: string) => {
    if (type === "NegatedEquivalence") return <NegatedEquivalenceSymbol />;
    return existentialSymbols[type + direction] || "-";
};

const formatTemporalSymbol = (type: string, direction: string) => {
    const arrow = direction === "Forward" ? "≺" : "≻";

    switch (type) {
        case "Direct":
            return (
                <span>
                    {arrow}
                    <sub>d</sub>
                </span>
            );
        case "Eventual":
            return (
                <span>
                    {arrow}
                    <sub>e</sub>
                </span>
            );
        default:
            return "-";
    }
};

const getInterpretation = (dependency: Dependency | undefined): React.ReactNode => {
    if (!dependency) return "";
  
    const { existential_dependency, temporal_dependency } = dependency;
  
    let temporal_explanation: React.ReactNode = null;
    let existential_explanation: React.ReactNode = null;
  
    if (temporal_dependency.type === "Direct") {
      temporal_explanation = (
        <>
          There is a direct temporal dependency. Thus, a termination of{" "}
          <strong>{temporal_dependency.direction === "Forward" ? dependency.from : dependency.to}</strong>{" "}
          directly leads to the enablement of{" "}
          <strong>{temporal_dependency.direction === "Forward" ? dependency.to : dependency.from}</strong>.
        </>
      );
    }
  
    if (temporal_dependency.type === "Eventual") {
      temporal_explanation = (
        <>
          There is an eventual temporal dependency. Thus,{" "}
          <strong>{temporal_dependency.direction === "Forward" ? dependency.to : dependency.from}</strong>{" "}
          eventually follows{" "}
          <strong>{temporal_dependency.direction === "Forward" ? dependency.from : dependency.to}</strong>{" "}
          meaning that there may be other activities before{" "}
          <strong>{temporal_dependency.direction === "Forward" ? dependency.to : dependency.from}</strong>{" "}
          begins.
        </>
      );
    }
  
    switch (existential_dependency.type) {
      case "Implication":
        existential_explanation = (
          <>
            There is an implication. Thus, whenever <strong>{existential_dependency.direction === "Forward" ? dependency.from : dependency.to}</strong> happens{" "}
            <strong>{existential_dependency.direction === "Forward" ? dependency.to : dependency.from}</strong> must happen or must have happened.
          </>
        );
        break;
  
      case "Equivalence":
        existential_explanation = (
          <>
            There is an equivalence. Thus, iff <strong>{existential_dependency.direction === "Forward" ? dependency.from : dependency.to}</strong> ⇒{" "}
            <strong>{existential_dependency.direction === "Forward" ? dependency.to : dependency.from}</strong> and{" "}
            <strong>{existential_dependency.direction === "Forward" ? dependency.to : dependency.from}</strong> ⇒{" "}
            <strong>{existential_dependency.direction === "Forward" ? dependency.from : dependency.to}</strong>.
          </>
        );
        break;
  
      case "NegatedEquivalence":
        existential_explanation = (
          <>
            There is a negated equivalence. Thus, either <strong>{dependency.from}</strong> or <strong>{dependency.to}</strong> occurs.
          </>
        );
        break;
  
      case "Nand":
        existential_explanation = (
          <>
            There is a NAND (negated and). Thus, neither <strong>{dependency.from}</strong> nor <strong>{dependency.to}</strong> occurs.
          </>
        );
        break;
  
      case "Or":
        existential_explanation = (
          <>
            There is an OR. Thus, at least one of the two activities (<strong>{dependency.from}</strong>, <strong>{dependency.to}</strong>) must occur.
          </>
        );
        break;
  
      default:
        existential_explanation = null;
    }
  
    return (
      <>
        {temporal_explanation && <p className="mt-2">{temporal_explanation}</p>}
        {existential_explanation && <p className="mt-2">{existential_explanation}</p>}
      </>
    );
  };

const formatDependencySymbol = (dependency: Dependency | undefined) => {
    if (!dependency) return "TODO";

    const existential = formatExistentialSymbol(dependency.existential_dependency.type, dependency.existential_dependency.direction);
    const temporal = formatTemporalSymbol(dependency.temporal_dependency.type, dependency.temporal_dependency.direction);

    return (
        <span className="inline-flex items-center gap-1">
            (<span>{temporal}</span>, <span>{existential}</span>)
        </span>
    );
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