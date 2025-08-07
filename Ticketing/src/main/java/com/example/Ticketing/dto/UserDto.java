package com.example.Ticketing.dto;

import com.example.Ticketing.model.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String username;
    private String password; // Added for registration
    private Role role;
}