package com.example.spring_boot_ecommerce.controller;

import com.example.spring_boot_ecommerce.dao.ProductCategoryRepository;
import com.example.spring_boot_ecommerce.dao.ProductRepository;
import com.example.spring_boot_ecommerce.entity.Product;
import com.example.spring_boot_ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.File;
import java.util.List;

@Controller
@RestController
@RequestMapping("/api")
public class UploadController {


    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    public UploadController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostMapping("/upload")
    public Product uploadImage(
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        Product product = mapper.readValue(productJson, Product.class);

        if (image != null && !image.isEmpty()) {
            product.setImageName(image.getOriginalFilename());
            product.setImageType(image.getContentType());
            product.setImageData(image.getBytes());
        }

        return productRepository.save(product);
    }


    @PostMapping("/products/bulk")
    public List<Product> bulkUpload(@RequestBody List<Product> products) throws Exception {

        for (Product product : products) {
            // 1. Resolve category
            ProductCategory category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);

            // 2. Optionally load image file from src/main/resources/static
            if (product.getImageUrl() != null && !product.getImageUrl().isEmpty()) {
                // 1. Create the resource handle
                ClassPathResource resource = new ClassPathResource("static/" + product.getImageUrl());

                // 2. Read bytes directly from the input stream (Works inside JARs!)
                byte[] data = FileCopyUtils.copyToByteArray(resource.getInputStream());

                product.setImageData(data);

                // 3. Get the name safely from the filename string instead of File object
                String filename = resource.getFilename();
                product.setImageName(filename);
                product.setImageType("image/png");
            }
        }

        return productRepository.saveAll(products);
    }
}