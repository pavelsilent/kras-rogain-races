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
@Schema(description = "Файл сущности")
public class FileDTO {

    @Schema(description = "Файл")
    private Long fileId;

    @Schema(description = "Имя файла", requiredMode = REQUIRED)
    private String fileName;

    @Schema(description = "Тип контента", requiredMode = REQUIRED)
    private String contentType;

    @Schema(description = "Бинарные данные", requiredMode = REQUIRED)
    private String base64Data;

}
