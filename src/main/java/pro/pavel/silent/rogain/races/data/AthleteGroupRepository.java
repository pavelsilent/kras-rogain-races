package pro.pavel.silent.rogain.races.data;

import java.util.List;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;

public interface AthleteGroupRepository extends EntityRepository<AthleteGroup, Long> {

    List<AthleteGroup> findAll();

}
