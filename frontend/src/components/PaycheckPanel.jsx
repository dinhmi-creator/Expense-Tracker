import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PaycheckPanel({ onAllocated }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const API = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/paycheck`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const allocate = async () => {
    setAllocating(true);
    try {
      const res = await axios.post(`${API}/paycheck/allocate`);
      onAllocated && onAllocated(res.data);
      fetch();
      alert("Allocation recorded.");
    } catch (err) {
      alert(err?.response?.data || "Allocation failed");
    } finally {
      setAllocating(false);
    }
  };

  if (loading) return <div>Loading paycheck...</div>;
  if (!summary) return <div>No paycheck data</div>;

  const { start, end, gross, spent, remaining, savings, investing, periodEnded } = summary;

  return (
    <div style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700 }}>Biweekly Paycheck</div>
          <div style={{ color: "#666" }}>{start} → {end}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div>Gross: ${Number(gross).toFixed(2)}</div>
          <div>Spent: ${Number(spent).toFixed(2)}</div>
          <div style={{ fontWeight: 700 }}>Remaining: ${Number(remaining).toFixed(2)}</div>
        </div>
      </div>

      {periodEnded ? (
        <div style={{ marginTop: 8 }}>
          <div>Savings (25%): ${Number(savings).toFixed(2)}</div>
          <div>Investing (75%): ${Number(investing).toFixed(2)}</div>
          <button onClick={allocate} disabled={allocating} style={{ marginTop: 8 }}>
            {allocating ? "Allocating..." : "Record Allocation"}
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 8, color: "#666" }}>Pay period active — funds will be allocated after {end}.</div>
      )}
    </div>
  );
}
