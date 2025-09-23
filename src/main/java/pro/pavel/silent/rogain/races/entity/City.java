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
import pro.pavel.silent.lib.core.domain.model.ResourceName;
import pro.pavel.silent.lib.core.domain.model.Resourced;
import pro.pavel.silent.lib.core.util.StringHelper;
import pro.pavel.silent.rogain.races.domain.enumeration.CityType;
import pro.pavel.silent.rogain.races.domain.enumeration.DataResourceName;

/**
 * Сущность "Населенный пункт"
 * Таблица: city
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "city")
@Schema(description = "Город проведения соревнования")
public class City implements Resourced {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    @Schema(description = "Тип")
    private CityType type;

    @Column(name = "name", nullable = false)
    @Schema(description = "Название")
    private String name;

    @Override
    public ResourceName getResource() {
        return DataResourceName.CITY;
    }

    @Override
    public String getResourceLinkName() {
        return name;
    }

}
