package pro.pavel.silent.rogain.races.rest.dto;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
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
public class RaceAthleteSetupDTO {

    @Schema(description = "Участник", requiredMode = REQUIRED)
    private Long athleteId;

    @Schema(description = "Нагрудный номер", requiredMode = REQUIRED)
    private Integer bibNumber;

    @Schema(description = "Группа")
    private Long athleteGroupId;

}
