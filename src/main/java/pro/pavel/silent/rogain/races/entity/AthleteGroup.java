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
 * Сущность "Группа / зачет"
 * Таблица: athlete_group
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "athlete_group")
@Schema(description = "Группа")
public class AthleteGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    @Schema(description = "Название")
    private String name;

    @Column(name = "description", length = 1000)
    @Schema(description = "Описание")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "sex", nullable = false)
    @Schema(description = "Пол")
    private AthleteGroupSex sex;

}
