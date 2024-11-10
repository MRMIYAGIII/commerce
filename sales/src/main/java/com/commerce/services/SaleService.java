package com.commerce.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.commerce.models.Sales;
import com.commerce.repositories.SaleRepository;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    public List<Sales> getSalesByDateRange(LocalDate startDate, LocalDate endDate) {
        return saleRepository.findBySaleDateBetween(startDate, endDate);
    }

    public Sales addSale(Sales sale) {
        return saleRepository.save(sale);
    }
}
