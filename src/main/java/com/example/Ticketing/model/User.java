// --- File: User.java ---
// Action: Replace the code in your User.java file with this.

package com.example.Ticketing.model;

// IMPORT STATEMENTS ADDED HERE
import com.example.Ticketing.model.Ticket;
import com.example.Ticketing.model.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // This line will now work

    @OneToMany(mappedBy = "owner")
    private List<Ticket> createdTickets; // This line will now work

    @OneToMany(mappedBy = "assignee")
    private List<Ticket> assignedTickets; // This line will now work
}