package com.dinh.expense_tracker.service;

import com.dinh.expense_tracker.model.Allocation;
import com.dinh.expense_tracker.model.Expense;
import com.dinh.expense_tracker.repository.AllocationRepository;
import com.dinh.expense_tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PaycheckService {

    private static final BigDecimal PAYCHECK_AMOUNT = BigDecimal.valueOf(2000); // biweekly
    private static final LocalDate EPOCH = LocalDate.of(2025, 1, 1);

    private final ExpenseRepository expenseRepo;
    private final AllocationRepository allocationRepo;

    public PaycheckService(ExpenseRepository expenseRepo, AllocationRepository allocationRepo) {
        this.expenseRepo = expenseRepo;
        this.allocationRepo = allocationRepo;
    }

    public LocalDate periodStartFor(LocalDate date) {
        long days = ChronoUnit.DAYS.between(EPOCH, date);
        long periods = Math.floorDiv(days, 14); // integer division
        return EPOCH.plusDays(periods * 14);
    }

    public LocalDate periodEndFor(LocalDate date) {
        return periodStartFor(date).plusDays(13);
    }

    public BigDecimal totalSpentInPeriod(LocalDate start, LocalDate end) {
        List<Expense> list = expenseRepo.findByDateBetweenOrderByDateDesc(start, end);
        BigDecimal sum = BigDecimal.ZERO;
        for (Expense e : list) {
            if (e.getAmount() != null) sum = sum.add(e.getAmount());
        }
        return sum;
    }

    public PaycheckSummary getCurrentSummary() {
        LocalDate today = LocalDate.now();
        LocalDate start = periodStartFor(today);
        LocalDate end = periodEndFor(today);
        BigDecimal spent = totalSpentInPeriod(start, end);
        BigDecimal remaining = PAYCHECK_AMOUNT.subtract(spent);
        if (remaining.compareTo(BigDecimal.ZERO) < 0) remaining = BigDecimal.ZERO;
        boolean periodEnded = today.isAfter(end);
        BigDecimal savings = BigDecimal.ZERO;
        BigDecimal investing = BigDecimal.ZERO;
        if (periodEnded) {
            savings = remaining.multiply(BigDecimal.valueOf(0.25));
            investing = remaining.multiply(BigDecimal.valueOf(0.75));
        }
        return new PaycheckSummary(start, end, PAYCHECK_AMOUNT, spent, remaining, savings, investing, periodEnded);
    }

    public Allocation createAllocationIfPeriodEnded() {
        PaycheckSummary s = getCurrentSummary();
        if (!s.isPeriodEnded()) return null; // nothing to allocate yet
        Allocation a = new Allocation();
        a.setPeriodStart(s.getStart());
        a.setPeriodEnd(s.getEnd());
        a.setRemaining(s.getRemaining());
        a.setSavings(s.getSavings());
        a.setInvesting(s.getInvesting());
        a.setCreatedAt(LocalDate.now());
        return allocationRepo.save(a);
    }

    // DTO:
    public static class PaycheckSummary {
        private final LocalDate start, end;
        private final BigDecimal gross, spent, remaining, savings, investing;
        private final boolean periodEnded;
        public PaycheckSummary(LocalDate start, LocalDate end, BigDecimal gross, BigDecimal spent,
                               BigDecimal remaining, BigDecimal savings, BigDecimal investing, boolean periodEnded) {
            this.start = start; this.end = end; this.gross = gross; this.spent = spent; this.remaining = remaining;
            this.savings = savings; this.investing = investing; this.periodEnded = periodEnded;
        }
        public LocalDate getStart(){return start;}
        public LocalDate getEnd(){return end;}
        public BigDecimal getGross(){return gross;}
        public BigDecimal getSpent(){return spent;}
        public BigDecimal getRemaining(){return remaining;}
        public BigDecimal getSavings(){return savings;}
        public BigDecimal getInvesting(){return investing;}
        public boolean isPeriodEnded(){return periodEnded;}
    }
}
