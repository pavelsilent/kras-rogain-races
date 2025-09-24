package pro.pavel.silent.rogain.races.rest.dto;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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
@Schema(description = "Контрольная точка")
public class RaceFormatCheckPointDTO {

    @Schema(description = "Идентификатор", requiredMode = REQUIRED)
    private Long id;

    @Schema(description = "Название", requiredMode = REQUIRED)
    private String name;

    @Schema(description = "Описание")
    private String description;

    @Schema(description = "Порядковый номер", requiredMode = REQUIRED)
    private Integer orderNumber;

    @Schema(description = "Общая дистанция от старта")
    private BigDecimal totalDistance;

    @Schema(description = "Контрольное время от старта")
    private String checkDuration;

    @Schema(description = "Контрольное время")
    private LocalDateTime checkTime;

    @Schema(description = "Есть ли контрольное время", requiredMode = REQUIRED)
    private Boolean hasCheckTime;

    @Schema(description = "Время предполагаемого лидера от старта")
    private String leaderDuration;

    @Schema(description = "Время предполагаемого лидера")
    private LocalDateTime leaderTime;

    @Schema(description = "Время предполагаемого лидера от предыдущей КТ")
    private String leaderDiffDuration;

    @Schema(description = "Это старт?", requiredMode = REQUIRED)
    private Boolean isStart;

    @Schema(description = "Это финиш?", requiredMode = REQUIRED)
    private Boolean isFinish;

}
