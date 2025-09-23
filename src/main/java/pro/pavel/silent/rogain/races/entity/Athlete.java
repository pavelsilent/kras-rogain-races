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
import pro.pavel.silent.lib.core.util.StringHelper;
import pro.pavel.silent.rogain.races.domain.enumeration.DataResourceName;
import pro.pavel.silent.rogain.races.domain.enumeration.Sex;

/**
 * Сущность "Спортсмен"
 * Таблица: athlete
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "athlete")
@Schema(description = "Спортсмен")
public class Athlete implements Resourced {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @Column(name = "first_name", nullable = false, length = 255)
    @Schema(description = "Имя")
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 255)
    @Schema(description = "Фамилия")
    private String lastName;

    @Column(name = "middle_name", length = 255)
    @Schema(description = "Отчество")
    private String middleName;

    @Enumerated(EnumType.STRING)
    @Column(name = "sex", nullable = false)
    @Schema(description = "Пол")
    private Sex sex;

    @Column(name = "birth_date")
    @Schema(description = "Дата рождения")
    private LocalDate birthDate;

    @ManyToOne
    @JoinColumn(name = "city_id")
    @Schema(description = "Город проживания")
    private City city;

    @ManyToOne
    @JoinColumn(name = "club_id")
    @Schema(description = "Клуб")
    private Club club;

    public String getFIO() {
        var result = "%s %s".formatted(lastName, firstName);
        if (StringHelper.hasLength(middleName)) {
            result += " %s".formatted(middleName);
        }
        return result;
    }

    @Override
    public ResourceName getResource() {
        return DataResourceName.ATHLETE;
    }

}
