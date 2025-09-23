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
import pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteType;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteState;

/**
 * Сущность "Участник соревнования"
 * Таблица: race_athlete
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "race_athlete")
@Schema(description = "Участник соревнования")
public class RaceAthlete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "race_format_id", nullable = false)
    @Schema(description = "Формат соревнования")
    private RaceFormat raceFormat;

    @ManyToOne(optional = false)
    @JoinColumn(name = "athlete_id", nullable = false)
    @Schema(description = "Спортсмен")
    private Athlete athlete;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "type", nullable = false, length = 255)
    @Schema(description = "Тип участника")
    private RaceAthleteType type;

    @Column(name = "bib_number", nullable = false)
    @Schema(description = "Нагрудный номер")
    private Integer bibNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false, length = 255)
    @Schema(description = "Статус")
    private RaceAthleteState state;

    @Column(name = "last_check_point_order_number")
    @Schema(description = "Космическое время прохождения")
    private Integer lastCheckPointOrderNumber;

    @Column(name = "last_check_point_time")
    @Schema(description = "Космическое время прохождения")
    private LocalDateTime lastCheckPointTime;

}
