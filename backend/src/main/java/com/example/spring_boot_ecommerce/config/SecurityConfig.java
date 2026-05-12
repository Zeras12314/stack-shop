package com.example.spring_boot_ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.List;

@Configuration          // Marks this class as a Spring configuration class (source of bean definitions)
@EnableWebSecurity      // Enables Spring Security's web security support and provides the MVC integration
public class SecurityConfig {

    @Bean               // Registers this method's return value as a Spring-managed bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                // Applies CORS using the corsConfigurationSource() bean defined below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disables CSRF protection — safe here because Angular uses session cookies
                // on a trusted origin (localhost:4200), not a third-party site
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // Allows unauthenticated access to any route under /api/public/
                        // (e.g. /api/public/products for your e-commerce catalog)
                        // Only these routes require authentication
                        .requestMatchers("/api/me").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/products/**").authenticated()

                        // Everything else (products, categories, etc.) is public
                        .anyRequest().permitAll()
                )

                .oauth2Login(oauth2 -> oauth2
                        // After successful Google login, Spring Boot redirects the browser to this Angular route
                        // 'true' forces this URL even if the user originally requested a different page
                        .defaultSuccessUrl("http://localhost:4200/auth/callback", true)

                        // If login fails (e.g. user denied Google permissions), redirect to Angular login page with an error flag
                        .failureUrl("http://localhost:4200/login?error=true")
                )

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
                            response.setHeader("Access-Control-Allow-Credentials", "true");
                            response.setStatus(200);
                        })
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );

        // Builds and returns the fully configured SecurityFilterChain
        return http.build();
    }

    @Bean   // Registers this CORS configuration as a Spring-managed bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Only allows requests originating from the Angular dev server
        // Prevents other origins (e.g. malicious sites) from making requests to your API
        config.setAllowedOrigins(List.of("http://localhost:4200"));

        // Specifies which HTTP methods Angular is allowed to use
        // OPTIONS is required for CORS preflight requests that browsers send automatically
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allows all request headers (e.g. Content-Type, Authorization)
        // You can restrict this later in production (e.g. List.of("Content-Type", "Authorization"))
        config.setAllowedHeaders(List.of("*"));

        // Allows the browser to send cookies (like JSESSIONID) with cross-origin requests
        // This is required for session-based auth to work between :4200 and :8080
        config.setAllowCredentials(true);

        // Maps this CORS config to all endpoints in the application ("/**")
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        // Returns the source so Spring Security can apply it to incoming requests
        return source;
    }
}
