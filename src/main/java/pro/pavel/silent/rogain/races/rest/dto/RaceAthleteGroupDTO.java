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
@Schema(description = "Группа участника соревнования")
public class RaceAthleteGroupDTO {

    @Schema(description = "Идентификатор группы", requiredMode = REQUIRED)
    private Long id;

    @Schema(description = "Место", requiredMode = REQUIRED)
    private Integer place;

}
