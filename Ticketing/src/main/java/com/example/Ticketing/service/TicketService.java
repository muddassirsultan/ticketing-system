package com.example.Ticketing.service;

import com.example.Ticketing.dto.CommentDto;
import com.example.Ticketing.dto.TicketDto;
import com.example.Ticketing.exception.ResourceNotFoundException;
import com.example.Ticketing.model.Comment;
import com.example.Ticketing.model.Ticket;
import com.example.Ticketing.model.User;
import com.example.Ticketing.model.enums.Role;
import com.example.Ticketing.model.enums.Status;
import com.example.Ticketing.repository.CommentRepository;
import com.example.Ticketing.repository.TicketRepository;
import com.example.Ticketing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CommentRepository commentRepository;

    public TicketDto createTicket(TicketDto ticketDto, String username) {
        User owner = findUserByUsername(username);
        Ticket newTicket = new Ticket();
        newTicket.setSubject(ticketDto.getSubject());
        newTicket.setDescription(ticketDto.getDescription());
        newTicket.setPriority(ticketDto.getPriority());
        newTicket.setOwner(owner);
        Ticket savedTicket = ticketRepository.save(newTicket);
        return convertToDto(savedTicket);
    }

    public List<TicketDto> getTicketsForUser(String username) {
        User owner = findUserByUsername(username);
        return ticketRepository.findByOwner(owner).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TicketDto> getAssignedTickets(String username) {
        User assignee = findUserByUsername(username);
        if (assignee.getRole() != Role.SUPPORT_AGENT && assignee.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only Support Agents or Admins can view assigned tickets.");
        }
        return ticketRepository.findByAssignee(assignee).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TicketDto getTicketById(Long ticketId, String username) {
        User user = findUserByUsername(username);
        Ticket ticket = findTicketById(ticketId);

        boolean isOwner = ticket.getOwner().equals(user);
        boolean isAssignee = user.equals(ticket.getAssignee());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAssignee && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to view this ticket");
        }
        return convertToDto(ticket);
    }

    public List<TicketDto> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TicketDto assignTicket(Long ticketId, Long assigneeId) {
        Ticket ticket = findTicketById(ticketId);
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee user not found with id: " + assigneeId));

        if (assignee.getRole() != Role.SUPPORT_AGENT) {
            throw new IllegalArgumentException("User must have the SUPPORT_AGENT role to be assigned a ticket.");
        }

        ticket.setAssignee(assignee);
        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToDto(updatedTicket);
    }

    public TicketDto updateTicketStatus(Long ticketId, Status newStatus, String username) {
        User user = findUserByUsername(username);
        Ticket ticket = findTicketById(ticketId);

        boolean isAssignee = user.equals(ticket.getAssignee());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isAssignee && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to update the status of this ticket.");
        }

        ticket.setStatus(newStatus);
        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToDto(updatedTicket);
    }

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    private Ticket findTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
    }

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
        List<CommentDto> comments = commentRepository.findByTicketOrderByCreatedAtAsc(ticket).stream()
                .map(this::convertCommentToDto)
                .collect(Collectors.toList());
        dto.setComments(comments);
        return dto;
    }

    private CommentDto convertCommentToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setAuthorUsername(comment.getAuthor().getUsername());
        return dto;
    }
}