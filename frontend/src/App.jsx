import React, { useEffect, useState } from "react";
import axios from "axios";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import PaycheckPanel from "./components/PaycheckPanel";
import CategoryTables from "./components/CategoryTables";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // load expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API}/expenses`);
        setExpenses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setError("Failed to load expenses. See console for details.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Add new expense (prepend so newest shows first)
  const addExpense = (newExp) => {
    setExpenses(prev => [newExp, ...prev]);
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API}/expenses/${id}`);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete expense. See console for details.");
    }
  };

  // Update expense
  const updateExpense = async (id, updatedExp) => {
    try {
      const res = await axios.put(`${API}/expenses/${id}`, updatedExp);
      setExpenses(prev => prev.map(exp => (exp.id === id ? res.data : exp)));
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update expense. See console for details.");
    }
  };

  // Called when allocation is recorded (re-fetch summary or expenses if needed)
  const handleAllocated = (alloc) => {
    // optional: show toast or refetch expenses
    console.log("Allocation recorded:", alloc);
    // refresh expenses to ensure UI is up to date
    axios.get(`${API}/expenses`).then(res => setExpenses(res.data || [])).catch(e => console.error(e));
  };

  return (
    <div style={{ maxWidth: 920, margin: "2rem auto", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Expense Tracker</h1>
        <p style={{ margin: "6px 0 0", color: "#666" }}>React • Spring Boot • PostgreSQL — track spending, allocate savings & investing</p>
      </header>

      <section style={{ marginBottom: 18 }}>
        <ExpenseForm onAdd={addExpense} />
      </section>

      <section style={{ marginBottom: 18 }}>
        <PaycheckPanel onAllocated={handleAllocated} />
      </section>

      <section style={{ marginBottom: 18 }}>
        {loading ? (
          <div>Loading expenses...</div>
        ) : error ? (
          <div style={{ color: "crimson" }}>{error}</div>
        ) : (
          <ExpenseList expenses={expenses} onDelete={deleteExpense} onUpdate={updateExpense} />
        )}
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ marginBottom: 12 }}>Expenses by Category</h2>
        <CategoryTables expenses={expenses} />
      </section>
    </div>
  );
}
