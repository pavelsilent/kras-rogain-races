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
@Schema(description = "Формат соревнования: данные для редиректа по ссылке")
public class RaceFormatTokenDTO {

    @Schema(description = "Идентификатор формата", requiredMode = REQUIRED)
    private Long raceId;

    @Schema(description = "Идентификатор формата", requiredMode = REQUIRED)
    private Long raceFormatId;

    @Schema(description = "Токен", requiredMode = REQUIRED)
    private String token;

    @Schema(description = "Тип токена", requiredMode = REQUIRED)
    private String tokenType;

}
