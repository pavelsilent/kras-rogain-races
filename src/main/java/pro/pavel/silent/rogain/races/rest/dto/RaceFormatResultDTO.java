package pro.pavel.silent.rogain.races.rest.dto;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
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
@Schema(description = "Формат соревнования")
public class RaceFormatResultDTO {

    @Schema(description = "Идентификатор формата", requiredMode = REQUIRED)
    private Long id;

    @Schema(description = "Название формата", requiredMode = REQUIRED)
    private String name;

    @Schema(description = "Тип участия", requiredMode = REQUIRED)
    private String type;

    @Schema(description = "Описание")
    private String description;

    @Schema(description = "Дата-время начала")
    private LocalDateTime startTime;

    @Schema(description = "Дата-время завершения")
    private LocalDateTime finishTime;

    @Schema(description = "Группы участников")
    private List<AthleteGroupDTO> athleteGroups;

    @Schema(description = "Контрольные точки")
    private List<RaceFormatCheckPointDTO> checkPoints;

    @Schema(description = "Участники")
    private List<RaceAthleteDTO> athletes;

    @Schema(description = "Контрольное время")
    private RaceAthleteDTO checkTime;

    @Schema(description = "Время лидера")
    private RaceAthleteDTO leaderTime;

    @Schema(description = "Статус")
    private String state;

}
