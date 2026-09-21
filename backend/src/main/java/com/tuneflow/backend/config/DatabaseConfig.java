package com.tuneflow.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        String url = dbUrl;

        if (url != null && !url.startsWith("jdbc:")) {
            if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
                url = "jdbc:" + url;
            }
        }

        DataSourceBuilder<?> builder = DataSourceBuilder.create().url(url);

        if (username != null && !username.isBlank()) {
            builder.username(username);
        }

        if (password != null && !password.isBlank()) {
            builder.password(password);
        }

        return builder.build();
    }
}
