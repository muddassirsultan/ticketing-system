package com.example.Ticketing.controller;

import com.example.Ticketing.dto.TicketDto;
import com.example.Ticketing.model.enums.Status;
import com.example.Ticketing.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@RequestBody TicketDto ticketDto, Authentication authentication) {
        return ResponseEntity.ok(ticketService.createTicket(ticketDto, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<TicketDto>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.getTicketsForUser(authentication.getName()));
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<TicketDto>> getAssignedTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.getAssignedTickets(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getTicketById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(ticketService.getTicketById(id, authentication.getName()));
    }

    @PutMapping("/{ticketId}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long ticketId, @RequestBody Map<String, String> statusMap, Authentication authentication) {
        try {
            Status newStatus = Status.valueOf(statusMap.get("status").toUpperCase());
            TicketDto updatedTicket = ticketService.updateTicketStatus(ticketId, newStatus, authentication.getName());
            return ResponseEntity.ok(updatedTicket);
        } catch (IllegalArgumentException e) {
            // Correctly handle the return type for the error case
            return ResponseEntity.badRequest().body("Invalid status specified.");
        }
    }
}