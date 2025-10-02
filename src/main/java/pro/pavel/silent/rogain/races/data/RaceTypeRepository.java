package pro.pavel.silent.rogain.races.data;

import java.util.List;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.RaceType;

public interface RaceTypeRepository extends EntityRepository<RaceType, Long> {

    List<RaceType> findAll();

}
