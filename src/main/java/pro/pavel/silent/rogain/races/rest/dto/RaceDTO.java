package pro.pavel.silent.rogain.races.rest.dto;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
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
@Schema(description = "Соревнование")
public class RaceDTO {

    @Schema(description = "Идентификатор", requiredMode = REQUIRED)
    private Long id;

    @Schema(description = "Название", requiredMode = REQUIRED)
    private String name;

    @Schema(description = "Описание")
    private String description;

    @Schema(description = "Тип", requiredMode = REQUIRED)
    private RaceTypeDTO raceType;

    @Schema(description = "Дата проведения")
    private LocalDate date;

    @Schema(description = "Город проведения")
    private CityDTO city;

    @Schema(description = "Состояние")
    private String state;

    @Schema(description = "Форматы соревнования")
    private List<RaceFormatDTO> formats;

}
