package com.tuneflow.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI tuneFlowOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TuneFlow AI API")
                        .version("1.0")
                        .description("Music Streaming Platform Backend API"));
    }
}