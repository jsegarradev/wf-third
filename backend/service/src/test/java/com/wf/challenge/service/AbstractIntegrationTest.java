package com.wf.challenge.service;

import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base for full-context integration tests: boots the whole application against the in-memory H2 database (schema
 * applied by Liquibase). Slice tests ({@code @DataJpaTest}, {@code @WebMvcTest}) should NOT extend this — they use
 * their own narrower context.
 */
@SpringBootTest
public abstract class AbstractIntegrationTest {
}
