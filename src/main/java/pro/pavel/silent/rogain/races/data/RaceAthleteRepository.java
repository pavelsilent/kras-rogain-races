package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteType;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceFormat;

public interface RaceAthleteRepository extends PagingAndSortingRepository<RaceAthlete, Long>,
                                               CrudRepository<RaceAthlete, Long>,
                                               JpaSpecificationExecutor<RaceAthlete> {

    List<RaceAthlete> findAllByRaceFormatAndTypeOrderByTypeAsc(RaceFormat raceFormat, RaceAthleteType type);

    List<RaceAthlete> findAllByRaceFormatAndTypeOrderByLastCheckPointOrderNumberDescLastCheckPointTimeAscBibNumberAsc(RaceFormat raceFormat, RaceAthleteType type);

    Optional<RaceAthlete> findFirstByRaceFormatAndType(RaceFormat raceFormat, RaceAthleteType type);

    Optional<RaceAthlete> findFirstByRaceFormatAndAthlete(RaceFormat raceFormat, Athlete athlete);

    Optional<RaceAthlete> findFirstByRaceFormatAndBibNumber(RaceFormat raceFormat, Integer bibNumber);

}
