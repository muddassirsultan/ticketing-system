package com.example.Ticketing.repository;

import com.example.Ticketing.model.Ticket;
import com.example.Ticketing.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByOwner(User owner);
    List<Ticket> findByAssignee(User assignee); // New method for support agents
}