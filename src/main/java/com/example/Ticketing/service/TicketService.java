package com.example.Ticketing.service;

import com.example.Ticketing.dto.TicketDto;
import com.example.Ticketing.exception.ResourceNotFoundException;
import com.example.Ticketing.model.Ticket;
import com.example.Ticketing.model.User;
import com.example.Ticketing.repository.TicketRepository;
import com.example.Ticketing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    public TicketDto createTicket(TicketDto ticketDto, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Ticket newTicket = new Ticket();
        newTicket.setSubject(ticketDto.getSubject());
        newTicket.setDescription(ticketDto.getDescription());
        newTicket.setPriority(ticketDto.getPriority());
        newTicket.setOwner(owner);

        Ticket savedTicket = ticketRepository.save(newTicket);
        return convertToDto(savedTicket);
    }

    public List<TicketDto> getTicketsForUser(String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return ticketRepository.findByOwner(owner)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Helper method to convert a Ticket Entity to a Ticket DTO
    private TicketDto convertToDto(Ticket ticket) {
        TicketDto dto = new TicketDto();
        dto.setId(ticket.getId());
        dto.setSubject(ticket.getSubject());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus());
        dto.setPriority(ticket.getPriority());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setOwnerUsername(ticket.getOwner().getUsername());
        if (ticket.getAssignee() != null) {
            dto.setAssigneeUsername(ticket.getAssignee().getUsername());
        }
        return dto;
    }
}