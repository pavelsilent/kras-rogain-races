package pro.pavel.silent.rogain.races.rest.dto;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
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
@Schema(description = "Прохождение контрольной точки участником")
public class RaceAthleteCheckPointDTO {

    @Schema(description = "Идентификатор контрольной точки", requiredMode = REQUIRED)
    private Long id;

    @Schema(description = "Номер участника", requiredMode = REQUIRED)
    private Integer athleteBibNumber;

    @Schema(description = "Космическое время прохождения")
    private LocalDateTime time;

    @Schema(description = "Время прохождения")
    private LocalDateTime raceTime;

    @Schema(description = "Разница по времени с предыдущей контрольной точкой")
    private String prevCheckPointDiffDuration;

    @Schema(description = "Точка пройдена?", requiredMode = REQUIRED)
    private Boolean passed;

    @Schema(description = "Контрольное время истекло")
    private Boolean checkTimeExpired;

}
