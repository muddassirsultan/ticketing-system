package com.example.Ticketing.dto;

import com.example.Ticketing.model.enums.Priority;
import com.example.Ticketing.model.enums.Status;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class TicketDto {
    private Long id;
    private String subject;
    private String description;
    private Status status;
    private Priority priority;
    private LocalDateTime createdAt;
    private String ownerUsername;
    private String assigneeUsername;
}
