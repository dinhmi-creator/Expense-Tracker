import { useState } from "react";

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

export default function ExpenseList({ expenses = [], onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filter, setFilter] = useState("");

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({
      amount: expense.amount,
      category: expense.category || "UNCATEGORIZED",
      note: expense.note || "",
      date: expense.date || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const submitEdit = () => {
    const payload = {
      amount: parseFloat(editData.amount),
      category: editData.category,
      note: editData.note,
      date: editData.date,
    };
    onUpdate(editingId, payload);
    setEditingId(null);
  };

  const filteredExpenses = expenses.filter(exp =>
    (exp.category || "UNCATEGORIZED").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Expenses</h2>
      <input
        type="text"
        placeholder="Filter by category"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: "10px", padding: "6px", borderRadius: 6 }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredExpenses.map(exp => (
          <li key={exp.id} style={{ marginBottom: 8, border: "1px solid #eee", padding: 8, borderRadius: 6 }}>
            {editingId === exp.id ? (
              <>
                <input name="amount" type="number" value={editData.amount} onChange={handleChange} style={{ marginRight: 8 }} />
                <input name="date" type="date" value={editData.date} onChange={handleChange} style={{ marginRight: 8 }} />
                <select name="category" value={editData.category} onChange={handleChange} style={{ marginRight: 8 }}>
                  {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <input name="note" value={editData.note} onChange={handleChange} style={{ marginRight: 8 }} />
                <button onClick={submitEdit}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ marginLeft: 6 }}>Cancel</button>
              </>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{(exp.category || "UNCATEGORIZED").replaceAll("_", " ")} • ${Number(exp.amount).toFixed(2)}</div>
                    <div style={{ fontSize: 13, color: "#666" }}>{exp.date} {exp.note ? `• ${exp.note}` : ""}</div>
                  </div>
                  <div>
                    <button onClick={() => startEdit(exp)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => onDelete(exp.id)}>Delete</button>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
