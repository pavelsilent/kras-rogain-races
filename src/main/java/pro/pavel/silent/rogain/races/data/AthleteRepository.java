package pro.pavel.silent.rogain.races.data;

import java.util.List;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.Athlete;

public interface AthleteRepository extends EntityRepository<Athlete, Long> {

    List<Athlete> findAll();

}
