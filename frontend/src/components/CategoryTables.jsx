import React from "react";

export default function CategoryTables({ expenses }) {
  // group by category (string). some expenses may have category as enum string; normalize.
  const groups = {};
  (expenses || []).forEach(e => {
    const cat = (e.category || "UNCATEGORIZED").toString();
    groups[cat] = groups[cat] || [];
    groups[cat].push(e);
  });

  const cats = Object.keys(groups).sort();

  return (
    <div>
      {cats.map(cat => (
        <div key={cat} style={{ marginBottom: 12 }}>
          <h3 style={{ marginBottom: 6 }}>{cat.replaceAll('_', ' ').toLowerCase()}</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th>Date</th><th>Note</th><th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {groups[cat].map(exp => (
                <tr key={exp.id}>
                  <td style={{ padding: 6 }}>{exp.date}</td>
                  <td style={{ padding: 6 }}>{exp.note}</td>
                  <td style={{ padding: 6 }}>${Number(exp.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
