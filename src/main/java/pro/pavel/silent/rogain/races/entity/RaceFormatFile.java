package pro.pavel.silent.rogain.races.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceFormatFileType;

/**
 * Сущность "Файл формата соревнования"
 * Таблица: race_format_file
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "race_format_file")
@Schema(description = "Файл формата соревнования")
public class RaceFormatFile implements EntityFile<RaceFormat> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "race_format_id", nullable = false)
    @Schema(description = "Формат соревнования")
    private RaceFormat entity;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 255)
    @Schema(description = "Тип файла")
    private RaceFormatFileType type;

    @ManyToOne(optional = false)
    @JoinColumn(name = "file_id", nullable = false)
    @Schema(description = "Файл")
    private File file;

}
