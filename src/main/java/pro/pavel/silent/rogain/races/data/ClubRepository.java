package pro.pavel.silent.rogain.races.data;

import java.util.Optional;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.Club;

public interface ClubRepository extends EntityRepository<Club, Long> {

    Optional<Club> findByNameIgnoreCase(String name);

}
