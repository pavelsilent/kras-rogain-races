package pro.pavel.silent.rogain.races.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pro.pavel.silent.rogain.races.entity.AppSettings;
import pro.pavel.silent.rogain.races.rest.dto.AppSettingsDTO;
import pro.pavel.silent.rogain.races.service.AppSettingsService;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "AppSettingsController", description = "Настройки")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppSettingsController {

    private final AppSettingsService appSettingsService;

    @GetMapping
    @Operation(summary = "Получить список настроек")
    @ApiResponse(responseCode = "200", description = "Список настроек")
    public ResponseEntity<AppSettingsDTO> getSettings() {
        AppSettings appSettings = appSettingsService.ensure();
        AppSettingsDTO dto = new AppSettingsDTO();
        dto.setAnonMode(appSettings.isAnonMode());
        dto.setSetupEnabled(appSettings.isSetupEnabled());
        dto.setEditEnabled(appSettings.isEditEnabled());
        return ResponseEntity.ok(dto);
    }

}
