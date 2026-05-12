package com.example.spring_boot_ecommerce.controller;

import com.example.spring_boot_ecommerce.dao.ProductRepository;
import com.example.spring_boot_ecommerce.dto.Purchase;
import com.example.spring_boot_ecommerce.dto.PurchaseResponse;
import com.example.spring_boot_ecommerce.entity.OrderItem;
import com.example.spring_boot_ecommerce.entity.Product;
import com.example.spring_boot_ecommerce.service.CheckoutService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/checkout")
public class CheckoutController {
    private CheckoutService checkoutService;
    private ProductRepository productRepository;

    public CheckoutController(CheckoutService checkoutService, ProductRepository productRepository){
        this.checkoutService = checkoutService;
        this.productRepository = productRepository;
    }

    @PostMapping(value = "/purchase", consumes = MediaType.APPLICATION_JSON_VALUE)
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {

        // loop through each order item in the purchase
        for (OrderItem item : purchase.getOrderItems()) {

            // fetch the product from the DB using the productId from the order item
            // throw an exception if the product is not found
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));

            // copy the image bytes from the product to the order item
            item.setImageData(product.getImageData());

            // copy the image filename from the product to the order item
            item.setImageName(product.getImageName());

            // copy the image MIME type (e.g. "image/jpeg") from the product to the order item
            item.setImageType(product.getImageType());
        }
        return checkoutService.placeOrder(purchase);
    }

}
