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
import pro.pavel.silent.lib.core.domain.model.ResourceName;
import pro.pavel.silent.lib.core.domain.model.Resourced;
import pro.pavel.silent.lib.core.util.StringHelper;
import pro.pavel.silent.rogain.races.domain.enumeration.DataResourceName;

/**
 * Сущность "Тип соревнования"
 * Таблица: race_type
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "race_type")
@Schema(description = "Тип соревнования")
public class RaceType implements Resourced {

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

    @Override
    public ResourceName getResource() {
        return DataResourceName.RACE_TYPE;
    }

    @Override
    public String getResourceLinkName() {
        return name;
    }

}
