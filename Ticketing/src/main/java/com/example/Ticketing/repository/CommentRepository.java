package com.example.Ticketing.repository;

import com.example.Ticketing.model.Comment;
import com.example.Ticketing.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Find all comments for a specific ticket, ordered by creation date
    List<Comment> findByTicketOrderByCreatedAtAsc(Ticket ticket);
}
