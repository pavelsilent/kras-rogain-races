package pro.pavel.silent.rogain.races.rest.dto;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Атлет")
public class AthleteDTO {

    @Schema(description = "Идентификатор")
    private Long id;

    @Schema(description = "Имя", requiredMode = REQUIRED)
    private String firstName;

    @Schema(description = "Фамилия", requiredMode = REQUIRED)
    private String lastName;

    @Schema(description = "Отчество")
    private String middleName;

    @Schema(description = "Пол", requiredMode = REQUIRED)
    private String sex;

    @Schema(description = "Дата рождения", requiredMode = REQUIRED)
    private LocalDate birthDate;

    @Schema(description = "Город")
    private String city;

    @Schema(description = "Клуб")
    private String club;

}
