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
@Schema(description = "Краткий вид результата формата соревнования")
public class RaceFormatResultLinkDTO {

    @Schema(description = "Идентификатор формата", requiredMode = REQUIRED)
    private Long id;

    @Schema(description = "Название гонки", requiredMode = REQUIRED)
    private String raceName;

    @Schema(description = "Название формата", requiredMode = REQUIRED)
    private String formatName;

    @Schema(description = "Тип", requiredMode = REQUIRED)
    private RaceTypeDTO raceType;

    @Schema(description = "Дата")
    private LocalDate raceDate;

    @Schema(description = "Статус")
    private String state;

    @Schema(description = "Токен страницы просмотра результата")
    private String viewToken;


}
