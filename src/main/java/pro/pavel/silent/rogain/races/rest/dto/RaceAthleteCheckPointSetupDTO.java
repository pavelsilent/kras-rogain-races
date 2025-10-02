package pro.pavel.silent.rogain.races.rest.dto;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pro.pavel.silent.rogain.races.entity.RaceAthleteCheckPoint;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Настройка прохождения контрольной точки участником")
public class RaceAthleteCheckPointSetupDTO {

    @Schema(description = "Прохождение контрольной точки участником")
    private RaceAthleteCheckPointDTO data;

    @Schema(description = "Время прохождения пред. точки")
    private LocalDateTime prevPointTime;

    @Schema(description = "Время прохождения след. точки")
    private LocalDateTime nextPointTime;


}
