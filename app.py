from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Configure SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///expenses.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Expense Model with date_added field
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "amount": self.amount,
            "date_added": self.date_added.strftime("%Y-%m-%d %H:%M:%S"),  # Format date
        }

# Root route
@app.route("/")
def home():
    return "Welcome to the Expense Tracker API! Use /expenses to interact."

# Add an expense
@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.json
    name = data.get("name")
    category = data.get("category")
    amount = data.get("amount")

    if not name or not category or amount is None:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except ValueError:
        return jsonify({"error": "Amount must be a positive number"}), 400

    new_expense = Expense(name=name, category=category, amount=amount)
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"message": "Expense added!", "expense": new_expense.to_dict()}), 201

# Get all expenses
@app.route("/expenses", methods=["GET"])
def get_expenses():
    # You can add optional filters here, for example, filter by category or date range
    category = request.args.get("category")
    if category:
        expenses = Expense.query.filter_by(category=category).all()
    else:
        expenses = Expense.query.all()

    return jsonify([expense.to_dict() for expense in expenses]), 200

# Get a single expense by ID
@app.route("/expenses/<int:id>", methods=["GET"])
def get_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    return jsonify(expense.to_dict()), 200

# Update an expense
@app.route("/expenses/<int:id>", methods=["PUT"])
def update_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    data = request.json
    expense.name = data.get("name", expense.name)
    expense.category = data.get("category", expense.category)
    expense.amount = float(data.get("amount", expense.amount))

    db.session.commit()
    return jsonify({"message": "Expense updated!", "expense": expense.to_dict()}), 200

# Delete an expense
@app.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Expense deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True)
