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
public class RaceMemberSetupDTO {

    @Schema(description = "Идентификатор", requiredMode = REQUIRED)
    private Long id;

    @Schema(description = "Участник", requiredMode = REQUIRED)
    private Long memberId;

    @Schema(description = "Тип участника", requiredMode = REQUIRED)
    private String memberType;

    @Schema(description = "Нагрудный номер", requiredMode = REQUIRED)
    private Integer bibNumber;

    @Schema(description = "Группа")
    private Long athleteGroupId;

}
