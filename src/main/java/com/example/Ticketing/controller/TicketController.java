package com.example.Ticketing.controller;

import com.example.Ticketing.dto.TicketDto;
import com.example.Ticketing.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@RequestBody TicketDto ticketDto, Authentication authentication) {
        String username = authentication.getName();
        TicketDto createdTicket = ticketService.createTicket(ticketDto, username);
        return ResponseEntity.ok(createdTicket);
    }

    @GetMapping
    public ResponseEntity<List<TicketDto>> getMyTickets(Authentication authentication) {
        String username = authentication.getName();
        List<TicketDto> tickets = ticketService.getTicketsForUser(username);
        return ResponseEntity.ok(tickets);
    }
}
