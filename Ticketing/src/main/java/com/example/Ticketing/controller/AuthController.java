package com.example.Ticketing.controller;

import com.example.Ticketing.config.JwtUtil;
import com.example.Ticketing.dto.LoginRequest;
import com.example.Ticketing.dto.UserDto;
import com.example.Ticketing.model.User;
import com.example.Ticketing.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Attempting to authenticate user: {}", loginRequest.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            // Use the full UserDetails object which includes authorities
            final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails);

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);

            logger.info("User {} authenticated successfully.", loginRequest.getUsername());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            logger.error("Authentication failed for user {}: Invalid credentials", loginRequest.getUsername());
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            logger.error("An unexpected error occurred during authentication for user {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(500).body("An unexpected error occurred");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            User registeredUser = userService.addUser(userDto);
            UserDto responseDto = new UserDto();
            responseDto.setId(registeredUser.getId());
            responseDto.setUsername(registeredUser.getUsername());
            responseDto.setRole(registeredUser.getRole());
            return ResponseEntity.ok(responseDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
