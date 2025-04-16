# Expense Tracker App

A simple command-line Expense Tracking application built using Flask for the backend API and Python for the interactive CLI. This project allows users to add, view, update, and delete their expenses, as well as see a summary of their spending.

## How to Run

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/dinhmi-creator/Expense-Tracker](https://github.com/dinhmi-creator/Expense-Tracker)
    cd Expense-Tracker
    ```

2.  **Initialize the database:**
    ```bash
    python3 init_db.py
    ```
    This will create an `expenses.db` file in the project directory.

3.  **Run the Flask API:** Open a **new** terminal and run:
    ```bash
    python3 app.py
    ```

4.  **Run the Expense Tracker CLI:** Open **another new** terminal and run:
    ```bash
    python3 expense_tracker.py
    ```

## Features

* Add new expenses with name, amount, and category.
* View a summary of all expenses, broken down by category.
* Update existing expense details.
* Delete expenses.
* Displays total spent, remaining budget, and daily budget.

## Technologies Used

* Python 3
* Flask
* Flask-SQLAlchemy
* Requests

## Contact

Minh Duy Dinh - duydinh3011@gmail.com