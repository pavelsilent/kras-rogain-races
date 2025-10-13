package pro.pavel.silent.rogain.races.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceFormatType;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceState;

/**
 * Сущность "Формат соревнования"
 * Таблица: race_format
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "race_format")
@Schema(description = "Формат соревнования")
public class RaceFormat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "race_id", nullable = false)
    @Schema(description = "Соревнование")
    private Race race;

    @Column(name = "name", nullable = false, length = 500)
    @Schema(description = "Название")
    private String name;

    @Column(name = "description", nullable = false, length = 1000)
    @Schema(description = "Описание")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 255)
    @Schema(description = "Тип формата участия")
    private RaceFormatType type;

    @Column(name = "start_time", nullable = false)
    @Schema(description = "Время старта")
    private LocalDateTime startTime;

    @Column(name = "finish_time", nullable = false)
    @Schema(description = "Время финиша")
    private LocalDateTime finishTime;

    @Column(name = "start_time_fact")
    @Schema(description = "Фактическое время старта")
    private LocalDateTime startTimeFact;

    @Column(name = "finish_time_fact", nullable = false)
    @Schema(description = "Фактическое время финиша")
    private LocalDateTime finishTimeFact;

    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false, length = 255)
    @Schema(description = "Статус")
    private RaceState state;

    @Column(name = "view_token", length = 255)
    @Schema(description = "Токен просмотра")
    private String viewToken;

    @Column(name = "edit_token", length = 255)
    @Schema(description = "Токен редактирования")
    private String editToken;

    @Column(name = "is_anon_mode", nullable = false)
    @Schema(description = "Анонимный режим")
    private boolean isAnonMode;

    @Column(name = "can_edit", nullable = false)
    @Schema(description = "Редактирование разрешено")
    private boolean canEdit;
}
