package pro.pavel.silent.rogain.races.data;

import java.util.List;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.AppSettings;

public interface AppSettingsRepository extends EntityRepository<AppSettings, Long> {

    @Override
    List<AppSettings> findAll();

}
