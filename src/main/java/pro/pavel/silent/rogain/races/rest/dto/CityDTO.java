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
@Schema(description = "Место проведения")
public class CityDTO {

    @Schema(description = "Идентификатор", requiredMode = REQUIRED)
    private Long id;

    @Schema(description = "Название", requiredMode = REQUIRED)
    private String name;

    @Schema(description = "Тип", requiredMode = REQUIRED)
    private String type;

}
