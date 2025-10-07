package pro.pavel.silent.rogain.races.rest.dto;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Участник соревнования")
public class RaceAthleteDTO {

    @Schema(description = "Участник", requiredMode = REQUIRED)
    private AthleteDTO athlete;

    @Schema(description = "Нагрудный номер", requiredMode = REQUIRED)
    private Integer bibNumber;

    @Schema(description = "Статус", requiredMode = REQUIRED)
    private String state;

    @Schema(description = "Тип участника", requiredMode = REQUIRED)
    private String type;

    @Schema(description = "Контрольные точки")
    private List<RaceAthleteCheckPointDTO> checkPoints;

    @Schema(description = "Последняя пройденная КТ")
    private RaceFormatCheckPointDTO lastCheckPoint;

    @Schema(description = "Абсолютное место")
    private Integer absPlace;

    @Schema(description = "Места в группах")
    private List<RaceAthleteGroupDTO> places;
}
