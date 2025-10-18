package com.dinh.expense_tracker.controller;

import com.dinh.expense_tracker.model.Expense;
import com.dinh.expense_tracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    // GET all expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return service.listAll();
    }

    // GET single expense by ID
    @GetMapping("/{id}")
    public Optional<Expense> getExpenseById(@PathVariable Long id) {
        return service.getById(id);
    }

    // POST create new expense
    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        return service.save(expense);
    }

    // PUT update existing expense
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        expense.setId(id);
        return service.save(expense);
    }

    // DELETE an expense
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        service.delete(id);
    }

    // GET expenses by category
    @GetMapping("/category/{category}")
    public List<Expense> getByCategory(@PathVariable String category) {
        return service.byCategory(category);
    }

}
