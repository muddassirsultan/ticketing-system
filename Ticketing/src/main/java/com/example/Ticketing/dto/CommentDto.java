package com.example.Ticketing.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class CommentDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private String authorUsername;
}
