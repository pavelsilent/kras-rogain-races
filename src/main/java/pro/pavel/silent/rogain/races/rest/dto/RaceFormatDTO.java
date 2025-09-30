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
public class RaceFormatDTO {

    @Schema(description = "Идентификатор формата", requiredMode = REQUIRED)
    private Long id;

    @Schema(description = "Название формата", requiredMode = REQUIRED)
    private String name;

    @Schema(description = "Описание")
    private String description;

    @Schema(description = "Название гонки", requiredMode = REQUIRED)
    private String raceName;

    @Schema(description = "Тип участия", requiredMode = REQUIRED)
    private String type;

    @Schema(description = "Состояние", requiredMode = REQUIRED)
    private String state;

    @Schema(description = "Дата-время начала")
    private LocalDateTime startTime;

    @Schema(description = "Дата-время завершения")
    private LocalDateTime finishTime;

    @Schema(description = "Группы участников")
    private List<AthleteGroupDTO> athleteGroups;

    @Schema(description = "Токен страницы просмотра результата")
    private String viewToken;

    @Schema(description = "Токен страницы редактирования результата")
    private String editToken;

}
