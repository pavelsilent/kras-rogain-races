package pro.pavel.silent.rogain.races.rest.dto;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Группа участников")
public class AthleteGroupDTO {

    @Schema(description = "Идентификатор", requiredMode = REQUIRED)
    private Long id;

    @Schema(description = "Название", requiredMode = REQUIRED)
    private String name;

    @Schema(description = "Описание")
    private String description;
}
