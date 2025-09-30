package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.rogain.races.entity.Race;
import pro.pavel.silent.rogain.races.entity.RaceFormat;

public interface RaceFormatRepository extends PagingAndSortingRepository<RaceFormat, Long>,
                                              CrudRepository<RaceFormat, Long>,
                                              JpaSpecificationExecutor<RaceFormat> {

    List<RaceFormat> findAllByRace(Race race);

    List<RaceFormat> findAllByRaceId(Long id);

    Optional<RaceFormat> findFirstByViewTokenOrEditToken(String viewToken, String editToken);

}
