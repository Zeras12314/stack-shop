package com.example.spring_boot_ecommerce.service;

import com.example.spring_boot_ecommerce.dao.CustomerRepository;
import com.example.spring_boot_ecommerce.dto.Purchase;
import com.example.spring_boot_ecommerce.dto.PurchaseResponse;
import com.example.spring_boot_ecommerce.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;

public interface CheckoutService {

 PurchaseResponse placeOrder(Purchase purchase);
}
