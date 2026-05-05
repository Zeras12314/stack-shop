package com.example.spring_boot_ecommerce.controller;

import com.example.spring_boot_ecommerce.dto.Purchase;
import com.example.spring_boot_ecommerce.dto.PurchaseResponse;
import com.example.spring_boot_ecommerce.entity.OrderItem;
import com.example.spring_boot_ecommerce.service.CheckoutService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin("https://localhost:4200")
@RequestMapping("/api/checkout")
public class CheckoutController {
    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }

    @PostMapping(value = "/purchase", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PurchaseResponse placeOrder(
            @RequestPart("purchase") Purchase purchase,
            @RequestPart("file") MultipartFile file) throws IOException {

        // attach image data to each order item before saving
        for (OrderItem item : purchase.getOrderItems()) {
            item.setImageData(file.getBytes());
            item.setImageName(file.getOriginalFilename());
            item.setImageType(file.getContentType());
        }

        return checkoutService.placeOrder(purchase);
    }

}
