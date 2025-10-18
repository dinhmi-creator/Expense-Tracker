package com.dinh.expense_tracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "allocations")
public class Allocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal remaining;      // remaining amount in period
    private BigDecimal savings;        // 25% of remaining
    private BigDecimal investing;      // 75% of remaining
    private LocalDate createdAt;

    public Allocation() {}

    // getters & setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getPeriodStart() { return periodStart; }
    public void setPeriodStart(LocalDate periodStart) { this.periodStart = periodStart; }
    public LocalDate getPeriodEnd() { return periodEnd; }
    public void setPeriodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; }
    public BigDecimal getRemaining() { return remaining; }
    public void setRemaining(BigDecimal remaining) { this.remaining = remaining; }
    public BigDecimal getSavings() { return savings; }
    public void setSavings(BigDecimal savings) { this.savings = savings; }
    public BigDecimal getInvesting() { return investing; }
    public void setInvesting(BigDecimal investing) { this.investing = investing; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
