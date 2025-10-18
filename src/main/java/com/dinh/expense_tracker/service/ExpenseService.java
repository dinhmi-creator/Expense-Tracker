package com.dinh.expense_tracker.service;

import com.dinh.expense_tracker.model.Category;
import com.dinh.expense_tracker.model.Expense;
import com.dinh.expense_tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    private final ExpenseRepository repo;

    public ExpenseService(ExpenseRepository repo) {
        this.repo = repo;
    }

    public Expense save(Expense e) { return repo.save(e); }
    public List<Expense> listAll() { return repo.findAll(); }
    public Optional<Expense> getById(Long id) { return repo.findById(id); }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Expense> byDateRange(LocalDate start, LocalDate end) {
        return repo.findByDateBetweenOrderByDateDesc(start, end);
    }

    // Convert String to Category before querying
    public List<Expense> byCategory(String categoryStr) {
        Category cat = Category.fromString(categoryStr);
        return repo.findByCategory(cat);
    }
}
