package pro.pavel.silent.rogain.races.rest.dto.core;

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
@Schema(description = "ДТО-обертка над строкой")
public class StringDTO {

    @Schema(description = "Значение")
    private String value;

    public static StringDTO of(String value) {
        return new StringDTO(value);
    }

}
