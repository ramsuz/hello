package com.ktg.poc.taskstation.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HelloController {
    
    @RequestMapping("/helloCtr")
    public String index() {
        return "Greetings from Spring Boot HELLO!";
    }

}
