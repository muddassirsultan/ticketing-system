package com.example.Ticketing.controller;

import com.example.Ticketing.dto.TicketDto;
import com.example.Ticketing.dto.UserDto;
import com.example.Ticketing.model.User;
import com.example.Ticketing.model.enums.Role;
import com.example.Ticketing.model.enums.Status;
import com.example.Ticketing.service.TicketService;
import com.example.Ticketing.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private TicketService ticketService;

    // === User Management ===
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserDto> addUser(@RequestBody UserDto userDto) {
        User savedUser = userService.addUser(userDto);
        // Convert the returned User entity to a DTO for the response
        UserDto responseDto = new UserDto();
        responseDto.setId(savedUser.getId());
        responseDto.setUsername(savedUser.getUsername());
        responseDto.setRole(savedUser.getRole());
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> roleMap) {
        try {
            Role newRole = Role.valueOf(roleMap.get("role").toUpperCase());
            return ResponseEntity.ok(userService.updateUserRole(id, newRole));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role specified.");
        }
    }

    // === Ticket Management ===
    @GetMapping("/tickets")
    public ResponseEntity<List<TicketDto>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @PutMapping("/tickets/{ticketId}/assign")
    public ResponseEntity<TicketDto> assignTicket(@PathVariable Long ticketId, @RequestBody Map<String, Long> assignmentMap) {
        Long assigneeId = assignmentMap.get("assigneeId");
        return ResponseEntity.ok(ticketService.assignTicket(ticketId, assigneeId));
    }

    @PutMapping("/tickets/{ticketId}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long ticketId, @RequestBody Map<String, String> statusMap, Authentication authentication) {
        try {
            Status newStatus = Status.valueOf(statusMap.get("status").toUpperCase());
            TicketDto updatedTicket = ticketService.updateTicketStatus(ticketId, newStatus, authentication.getName());
            return ResponseEntity.ok(updatedTicket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status specified.");
        }
    }
}