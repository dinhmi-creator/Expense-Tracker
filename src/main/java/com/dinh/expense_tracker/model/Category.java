package com.dinh.expense_tracker.model;

public enum Category {
    LIVING, TRANSPORTATION, FOOD_DRINKS, ENTERTAINMENT, DEBT, HEALTHCARE, SUBSCRIPTIONS, PERSONAL_CARE, UNCATEGORIZED;

    public static Category fromString(String s) {
        if (s == null) return UNCATEGORIZED;
        String norm = s.trim().toLowerCase();
        switch (norm) {
            case "living": case "rent": case "utilities": return LIVING;
            case "transportation": case "transport": case "uber": case "lyft": return TRANSPORTATION;
            case "food": case "drinks": case "food & drinks": return FOOD_DRINKS;
            case "entertainment": return ENTERTAINMENT;
            case "debt": case "loan": return DEBT;
            case "healthcare": case "medical": return HEALTHCARE;
            case "subscriptions": case "subscription": return SUBSCRIPTIONS;
            case "personal": case "personal care": return PERSONAL_CARE;
            default: return UNCATEGORIZED;
        }
    }
}