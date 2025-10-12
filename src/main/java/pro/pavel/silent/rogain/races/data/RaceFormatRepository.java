package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceState;
import pro.pavel.silent.rogain.races.entity.Race;
import pro.pavel.silent.rogain.races.entity.RaceFormat;

public interface RaceFormatRepository extends EntityRepository<RaceFormat, Long> {

    RaceFormat getById(Long id);

    List<RaceFormat> findAllByRace(Race race);

    List<RaceFormat> findAllByRaceId(Long id);

    Optional<RaceFormat> findFirstByViewTokenOrEditToken(String viewToken, String editToken);

    List<RaceFormat> findAllByStateNotInOrderByRaceDateAscRaceIdAsc(List<RaceState> states);

}
