package com.dinh.expense_tracker.controller;

import com.dinh.expense_tracker.model.Allocation;
import com.dinh.expense_tracker.service.PaycheckService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paycheck")
public class PaycheckController {

    private final PaycheckService service;

    public PaycheckController(PaycheckService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> summary() {
        return ResponseEntity.ok(service.getCurrentSummary());
    }

    // call this when pay period ended to create an Allocation record
    @PostMapping("/allocate")
    public ResponseEntity<?> allocate() {
        Allocation a = service.createAllocationIfPeriodEnded();
        if (a == null) return ResponseEntity.badRequest().body("Period not ended or nothing to allocate");
        return ResponseEntity.ok(a);
    }
}
