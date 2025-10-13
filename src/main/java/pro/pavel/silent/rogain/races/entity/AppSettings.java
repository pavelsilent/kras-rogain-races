package pro.pavel.silent.rogain.races.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Сущность "Настройки приложения"
 * Таблица: app_settings
 */
@Getter
@Setter
@Entity
@Table(schema = "public", name = "app_settings")
@Schema(description = "Спортсмен")
public class AppSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Идентификатор")
    private Long id;

    @Column(name = "is_anon_mode", nullable = false)
    @Schema(description = "Анонимный режим")
    private boolean isAnonMode;

    @Column(name = "is_edit_enabled", nullable = false)
    @Schema(description = "Редактирование результатов разрешено")
    private boolean isEditEnabled;

    @Column(name = "is_setup_enabled", nullable = false)
    @Schema(description = "Настройка разрешена")
    private boolean isSetupEnabled;

}
