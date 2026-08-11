export default function TraceTable({ traceTable }) {
  const variables = traceTable?.variables || [];
  const rows = traceTable?.rows || [];

  if (!traceTable || variables.length === 0) {
    return (
      <div className="table-wrap table-empty">
        <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "24px", margin: 0, fontSize: "14px" }}>
          No trace table returned for this solution.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrap" style={{ overflowX: "auto" }}>
      <table>
        <caption className="sr-only">Step-by-step variable trace table</caption>
        <thead>
          <tr>{variables.map((item) => <th key={item}>{item}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="trace-row">
              {variables.map((key, cellIndex) => (
                <td key={key}>{String(readCell(row, key, cellIndex) ?? "-")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function readCell(row, key, index) {
  if (Array.isArray(row)) return row[index];
  return row?.[key];
}
