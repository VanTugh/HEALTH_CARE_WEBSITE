package org.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import lombok.RequiredArgsConstructor;

@Configuration
@Profile("demo")
@RequiredArgsConstructor
public class DemoDataInitializer {

    private final DemoDataLoader demoDataLoader;

    @Bean
    CommandLineRunner initDemoData() {
        return args -> demoDataLoader.loadIfEmpty();
    }
}
