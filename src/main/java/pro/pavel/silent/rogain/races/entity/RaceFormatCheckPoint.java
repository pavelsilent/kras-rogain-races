package pro.pavel.silent.rogain.races.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 * Сущность "Контрольный пункт"
 * Таблица: race_format_check_point
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "race_format_check_point")
@Schema(description = "Контрольный пункт")
public class RaceFormatCheckPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "race_format_id", nullable = false)
    @Schema(description = "Формат соревнования")
    private RaceFormat raceFormat;

    @Column(name = "name", nullable = false, length = 500)
    @Schema(description = "Название")
    private String name;

    @Column(name = "description", length = 1000)
    @Schema(description = "Описание")
    private String description;

    @Column(name = "order_number", nullable = false)
    @Schema(description = "Порядковый номер")
    private Integer orderNumber;

    @Column(name = "total_distance", nullable = false, precision = 19, scale = 2)
    @Schema(description = "Общая дистанция")
    private BigDecimal totalDistance;

    @Column(name = "check_time")
    @Schema(description = "Контрольное время")
    private LocalDateTime checkTime;

    @Column(name = "has_check_time", nullable = false)
    @Schema(description = "Есть контрольное время?")
    private boolean hasCheckTime;

    @Column(name = "leader_time")
    @Schema(description = "Время предполагаемого лидера")
    private LocalDateTime leaderTime;

    @Column(name = "is_start", nullable = false)
    @Schema(description = "Стартовая точка?")
    private boolean isStart;

    @Column(name = "is_finish", nullable = false)
    @Schema(description = "Финишная точка?")
    private boolean isFinish;

}
