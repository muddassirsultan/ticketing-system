package com.example.Ticketing.repository;

import com.example.Ticketing.model.Ticket;
import com.example.Ticketing.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    // Find all tickets where the owner is the specified user
    List<Ticket> findByOwner(User owner);
}