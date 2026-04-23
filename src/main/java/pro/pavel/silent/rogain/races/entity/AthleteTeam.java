package pro.pavel.silent.rogain.races.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import pro.pavel.silent.rogain.races.domain.enumeration.AthleteGroupSex;

/**
 * Сущность "Команда"
 * Таблица: athlete_team
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "athlete_team")
@Schema(description = "Спортсмен")
public class AthleteTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    @Schema(description = "Название")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "sex", nullable = false)
    @Schema(description = "Пол")
    private AthleteGroupSex sex;

    public String getName(boolean isAnonMode) {
        if (isAnonMode) {
            return "Неизвестная команда";
        }

        return name;
    }

}
