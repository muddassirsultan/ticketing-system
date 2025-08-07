package com.example.Ticketing.service;

import com.example.Ticketing.dto.CommentDto;
import com.example.Ticketing.exception.ResourceNotFoundException;
import com.example.Ticketing.model.Comment;
import com.example.Ticketing.model.Ticket;
import com.example.Ticketing.model.User;
import com.example.Ticketing.model.enums.Role;
import com.example.Ticketing.repository.CommentRepository;
import com.example.Ticketing.repository.TicketRepository;
import com.example.Ticketing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private UserRepository userRepository;

    public CommentDto addComment(Long ticketId, CommentDto commentDto, String username) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        // Security check: Allow commenting if user is the owner, the assignee, or an admin
        boolean isOwner = ticket.getOwner().equals(author);
        boolean isAssignee = author.equals(ticket.getAssignee());
        boolean isAdmin = author.getRole() == Role.ADMIN;

        if (!isOwner && !isAssignee && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to comment on this ticket");
        }

        Comment newComment = new Comment();
        newComment.setContent(commentDto.getContent());
        newComment.setTicket(ticket);
        newComment.setAuthor(author);

        Comment savedComment = commentRepository.save(newComment);
        return convertToDto(savedComment);
    }

    private CommentDto convertToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setAuthorUsername(comment.getAuthor().getUsername());
        return dto;
    }
}
