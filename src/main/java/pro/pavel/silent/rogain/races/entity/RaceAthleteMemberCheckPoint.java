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
import lombok.Getter;
import lombok.Setter;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteType;

/**
 * Сущность "Результат участника на контрольной точке"
 * Таблица: race_athlete_member_check_point
 */
@Getter
@Setter
@Entity
@Table(name = "race_athlete_member_check_point")
@Schema(description = "Результат участника на контрольной точке")
public class RaceAthleteMemberCheckPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "race_athlete_check_point_id", nullable = false)
    @Schema(description = "Участник соревнования")
    private RaceAthleteCheckPoint raceAthleteCheckPoint;

    @Column(name = "member_id", nullable = false)
    @Schema(description = "Спортсмен / команда спортсменов")
    private Long memberId;

    @Enumerated(EnumType.STRING)
    @Column(name = "member_type", nullable = false, length = 255)
    @Schema(description = "Тип участника")
    private RaceAthleteType memberType;

}
