package pro.pavel.silent.rogain.races.data;

import java.util.List;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.Race;

public interface RaceRepository extends EntityRepository<Race, Long> {

    Race getById(long id);

    List<Race> findAll();

}
