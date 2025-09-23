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
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import pro.pavel.silent.lib.core.domain.model.ResourceName;
import pro.pavel.silent.lib.core.domain.model.Resourced;
import pro.pavel.silent.rogain.races.domain.enumeration.DataResourceName;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceState;

/**
 * Сущность "Соревнование"
 * Таблица: race
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "race")
@Schema(description = "Соревнование")
public class Race implements Resourced {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @Column(name = "name", nullable = false, length = 500)
    @Schema(description = "Название")
    private String name;

    @Column(name = "description", nullable = false, length = 1000)
    @Schema(description = "Описание")
    private String description;

    @ManyToOne(optional = false)
    @JoinColumn(name = "race_type_id", nullable = false)
    @Schema(description = "Тип")
    private RaceType raceType;

    @Column(name = "date", nullable = false)
    @Schema(description = "Дата проведения")
    private LocalDate date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "race_city_id", nullable = false)
    @Schema(description = "Город проведения")
    private City city;

    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false, length = 255)
    @Schema(description = "Статус")
    private RaceState state;

    @Override
    public ResourceName getResource() {
        return DataResourceName.RACE;
    }

}
