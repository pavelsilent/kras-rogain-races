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
import lombok.Getter;
import lombok.Setter;

/**
 * Сущность "Связь участника соревнования и группы спортсменов"
 * Таблица: race_athlete_group
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "race_athlete_group")
@Schema(description = "Связь участника соревнования и группы спортсменов")
public class RaceAthleteGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "race_athlete_id", nullable = false)
    @Schema(description = "Участник")
    private RaceAthlete raceAthlete;

    @ManyToOne(optional = false)
    @JoinColumn(name = "athlete_group_id", nullable = false)
    @Schema(description = "Группа")
    private AthleteGroup athleteGroup;

    @Column(name = "place")
    @Schema(description = "Место")
    private Integer place;
}
