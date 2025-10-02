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
public class FileLinkDTO {

    @Schema(description = "Файл")
    private Long fileId;

    @Schema(description = "Тип файла", requiredMode = REQUIRED)
    private String fileType;

    @Schema(description = "Сущность файла", requiredMode = REQUIRED)
    private String entityType;

    @Schema(description = "Идентификатор сущности", requiredMode = REQUIRED)
    private String entityId;

}
