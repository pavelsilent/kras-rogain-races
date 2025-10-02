package pro.pavel.silent.rogain.races.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Сущность "Файл"
 * Таблица: file
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "file")
@Schema(description = "Файл")
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @Column(name = "file_name", nullable = false)
    @Schema(description = "Название")
    private String fileName;

    @Column(name = "content_type", nullable = false)
    @Schema(description = "Тип содержимого")
    private String contentType;

 //   @Lob
    @Column(name = "file_data", columnDefinition = "BYTEA", nullable = false)
    @Schema(description = "Бинарные данные файла")
    private byte[] fileData;

}
