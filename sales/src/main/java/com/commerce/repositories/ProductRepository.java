package com.commerce.repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import com.commerce.models.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
