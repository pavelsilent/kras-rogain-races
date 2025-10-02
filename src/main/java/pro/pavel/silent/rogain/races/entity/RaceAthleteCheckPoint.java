package pro.pavel.silent.rogain.races.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 * Сущность "Результат спортсмена на контрольной точке"
 * Таблица: race_athlete_check_point
 */
@Getter
@Setter
@Entity
@Table(name = "race_athlete_check_point")
@Schema(description = "Результат спортсмена на контрольной точке")
public class RaceAthleteCheckPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "race_athlete_id", nullable = false)
    @Schema(description = "Участник соревнования")
    private RaceAthlete raceAthlete;

    @ManyToOne(optional = false)
    @JoinColumn(name = "race_format_check_point", nullable = false)
    @Schema(description = "Контрольный пункт")
    private RaceFormatCheckPoint raceFormatCheckPoint;

    @Column(name = "time")
    @Schema(description = "Местное время прохождения")
    private LocalDateTime time;

    @Column(name = "passed", nullable = false)
    @Schema(description = "Пройдено?")
    private boolean passed;

}
