package pro.pavel.silent.rogain.races.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.rogain.races.data.AppSettingsRepository;
import pro.pavel.silent.rogain.races.entity.AppSettings;

@Service
@RequiredArgsConstructor
public class AppSettingsService {

    private final AppSettingsRepository repository;

    public AppSettings ensure() {
        return repository.findAll().stream().findFirst()
                         .orElseGet(() -> {
                             AppSettings settings = new AppSettings();
                             settings.setAnonMode(false);
                             settings.setEditEnabled(true);
                             settings.setSetupEnabled(true);
                             return repository.save(settings);
                         });
    }

    public boolean canSetup() {
        return ensure().isSetupEnabled();
    }

    public boolean canEdit() {
        return ensure().isEditEnabled();
    }

    public boolean isAnonMode() {
        return ensure().isAnonMode();
    }

}
