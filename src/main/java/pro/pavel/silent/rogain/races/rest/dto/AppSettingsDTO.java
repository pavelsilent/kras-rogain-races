package pro.pavel.silent.rogain.races.rest.dto;

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
@Schema(description = "Настройки")
public class AppSettingsDTO {

    @Schema(description = "Анонимный режим")
    private boolean isAnonMode;

    @Schema(description = "Редактирование результатов разрешено")
    private boolean isEditEnabled;

    @Schema(description = "Настройка разрешена")
    private boolean isSetupEnabled;

}
