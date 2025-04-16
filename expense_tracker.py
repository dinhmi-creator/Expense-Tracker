import requests
import datetime
import calendar

API_URL = "http://127.0.0.1:5000"  # Make sure your Flask API is running

def main():
    print(f"🎯 Running Expense Tracker!")
    budget = 2000  # Set a budget

    while True:
        print("\nWhat would you like to do?")
        print("1. Add a new expense")
        print("2. View summary")
        print("3. Update an expense")
        print("4. Delete an expense")
        print("5. Exit")

        choice = input("Select an option (1-5): ")

        if choice == "1":
            expense = get_user_expense()
            save_expense_to_api(expense)
        elif choice == "2":
            summarize_expenses(budget)
        elif choice == "3":
            update_expense()
        elif choice == "4":
            delete_expense()
        elif choice == "5":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid option. Try again.")

def get_user_expense():
    """Prompt user for expense details and return as a dictionary."""
    print(f"🎯 Getting User Expense")
    expense_name = input("Enter expense name: ")
    expense_amount = float(input("Enter expense amount: "))
    expense_categories = ["🍔 Food", "🏠 Home", "💼 Work", "🎉 Fun", "✨ Misc"]

    while True:
        print("Select a category: ")
        for i, category_name in enumerate(expense_categories):
            print(f"  {i + 1}. {category_name}")

        selected_index = int(input(f"Enter a category number [1 - {len(expense_categories)}]: ")) - 1

        if selected_index in range(len(expense_categories)):
            selected_category = expense_categories[selected_index]
            return {
                "name": expense_name,
                "category": selected_category,
                "amount": expense_amount
            }
        else:
            print("❌ Invalid category. Please try again!")

def save_expense_to_api(expense):
    """Send a POST request to save the expense via the API."""
    print(f"🎯 Saving User Expense: {expense} to API")
    response = requests.post(f"{API_URL}/expenses", json=expense)

    if response.status_code == 201:
        print("✅ Expense added successfully!")
    else:
        print("❌ Failed to add expense:", response.json())

def summarize_expenses(budget):
    """Fetch expenses from API and summarize."""
    print(f"🎯 Summarizing User Expenses")
    
    response = requests.get(f"{API_URL}/expenses")
    if response.status_code != 200:
        print("❌ Failed to fetch expenses!")
        return
    
    expenses = response.json()

    # Calculate total spent and breakdown by category
    amount_by_category = {}
    total_spent = sum(exp["amount"] for exp in expenses)

    for exp in expenses:
        category = exp["category"]
        amount_by_category[category] = amount_by_category.get(category, 0) + exp["amount"]

    print("Expenses By Category 📈:")
    for key, amount in amount_by_category.items():
        print(f"  {key}: ${amount:.2f}")

    remaining_budget = budget - total_spent
    print(f"💵 Total Spent: ${total_spent:.2f}")
    print(f"✅ Budget Remaining: ${remaining_budget:.2f}")

    now = datetime.datetime.now()
    days_in_month = calendar.monthrange(now.year, now.month)[1]
    remaining_days = days_in_month - now.day

    daily_budget = remaining_budget / remaining_days if remaining_days > 0 else 0
    print(green(f"👉 Budget Per Day: ${daily_budget:.2f}"))

def update_expense():
    print("🎯 Update an Expense")
    try:
        id = int(input("Enter the ID of the expense to update: "))
    except ValueError:
        print("❌ Invalid ID format.")
        return

    new_name = input("New name (leave blank to keep current): ")
    new_amount = input("New amount (leave blank to keep current): ")
    new_category = input("New category (leave blank to keep current): ")

    data = {}
    if new_name:
        data["name"] = new_name
    if new_amount:
        try:
            data["amount"] = float(new_amount)
        except ValueError:
            print("❌ Amount must be a number.")
            return
    if new_category:
        data["category"] = new_category

    if not data:
        print("⚠️ No updates provided.")
        return

    res = requests.put(f"{API_URL}/expenses/{id}", json=data)
    if res.status_code == 200:
        print("✅ Expense updated successfully!")
    else:
        print("❌ Failed to update expense:", res.json())

def delete_expense():
    print("🎯 Delete an Expense")
    try:
        id = int(input("Enter the ID of the expense to delete: "))
    except ValueError:
        print("❌ Invalid ID format.")
        return

    confirm = input(f"Are you sure you want to delete expense ID {id}? (y/n): ").lower()
    if confirm != "y":
        print("❌ Delete cancelled.")
        return

    res = requests.delete(f"{API_URL}/expenses/{id}")
    if res.status_code == 200:
        print("✅ Expense deleted successfully!")
    else:
        print("❌ Failed to delete expense:", res.json())

def green(text):
    return f"\033[92m{text}\033[0m"

if __name__ == "__main__":
    main()
