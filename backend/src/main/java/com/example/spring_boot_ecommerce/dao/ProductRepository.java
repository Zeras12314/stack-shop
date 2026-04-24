package com.example.spring_boot_ecommerce.dao;

import com.example.spring_boot_ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;



@Repository
@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Retrieves a paginated list of products filtered by category ID.
     *
     * This method is automatically exposed as a REST endpoint by Spring Data REST:
     * GET /products/search/findByCategoryId?id={id}&page={page}&size={size}
     *
     * @param id the ID of the category
     * @param pageable pagination and sorting information
     * @return a page of products belonging to the specified category
     */
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);


    /**
     * Retrieves a paginated list of products whose names contain the given keyword.
     *
     * This performs a "LIKE %name%" search in the database.
     * Automatically exposed as:
     * GET /products/search/findByNameContaining?name={keyword}&page={page}&size={size}
     *
     * @param name the keyword to search within product names
     * @param pageable pagination and sorting information
     * @return a page of products matching the search criteria
     */
    Page<Product> findByNameContainingIgnoreCase(@Param("name") String name, Pageable page);

}
