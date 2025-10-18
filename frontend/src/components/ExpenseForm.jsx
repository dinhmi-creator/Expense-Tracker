import { useState } from "react";
import axios from "axios";

const CATEGORY_OPTIONS = [
  { value: "UNCATEGORIZED", label: "Uncategorized" },
  { value: "LIVING", label: "Living Expenses" },
  { value: "TRANSPORTATION", label: "Transportation" },
  { value: "FOOD_DRINKS", label: "Food & Drinks" },
  { value: "ENTERTAINMENT", label: "Entertainment" },
  { value: "DEBT", label: "Debt Payments" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "SUBSCRIPTIONS", label: "Subscriptions" },
  { value: "PERSONAL_CARE", label: "Personal Care" },
];

export default function ExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("UNCATEGORIZED");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const amt = parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    const d = date && date.trim() !== "" ? date : new Date().toISOString().slice(0, 10);

    const payload = {
      amount: amt,
      category: category, // already an enum name like "FOOD_DRINKS"
      note: note || "",
      date: d,
    };

    try {
      setLoading(true);
      const res = await axios.post(`${API}/expenses`, payload);
      onAdd && onAdd(res.data);
      setAmount("");
      setCategory("UNCATEGORIZED");
      setNote("");
      setDate("");
    } catch (err) {
      console.error("Failed to create expense:", err);
      alert("Failed to add expense. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr 1fr auto" }}>
      <input
        name="amount"
        type="number"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <input
        name="date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: "8px", borderRadius: 6 }}
      >
        {CATEGORY_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" style={{ padding: "6px 10px" }} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <input
        name="note"
        type="text"
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ gridColumn: "1 / -1" }}
      />
    </form>
  );
}

