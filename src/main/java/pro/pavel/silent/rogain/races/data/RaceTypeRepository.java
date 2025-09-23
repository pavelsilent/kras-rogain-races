package pro.pavel.silent.rogain.races.data;

import java.util.List;
import pro.pavel.silent.lib.core.service.ResourceRepository;
import pro.pavel.silent.rogain.races.entity.RaceType;

public interface RaceTypeRepository extends ResourceRepository<RaceType> {

    List<RaceType> findAll();
}
