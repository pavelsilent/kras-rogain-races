package pro.pavel.silent.rogain.races.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Сущность "Тип соревнования"
 * Таблица: race_type
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "race_type")
@Schema(description = "Тип соревнования")
public class RaceType {

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

}
