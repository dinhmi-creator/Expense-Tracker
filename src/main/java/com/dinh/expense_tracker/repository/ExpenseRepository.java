package com.dinh.expense_tracker.repository;

import com.dinh.expense_tracker.model.Category;
import com.dinh.expense_tracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByDateBetweenOrderByDateDesc(LocalDate start, LocalDate end);

    // Use Category enum, not String
    List<Expense> findByCategory(Category category);
}
