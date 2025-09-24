package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceAthleteCheckPoint;
import pro.pavel.silent.rogain.races.entity.RaceFormatCheckPoint;

public interface RaceAthleteCheckPointRepository extends PagingAndSortingRepository<RaceAthleteCheckPoint, Long>,
                                                         CrudRepository<RaceAthleteCheckPoint, Long>,
                                                         JpaSpecificationExecutor<RaceAthleteCheckPoint> {

    List<RaceAthleteCheckPoint> findAllByRaceAthlete(RaceAthlete raceAthlete);

    List<RaceAthleteCheckPoint> findAllByRaceAthleteOrderByRaceFormatCheckPointOrderNumberAsc(RaceAthlete raceAthlete);


    Optional<RaceAthleteCheckPoint> findFirstByRaceAthleteAndRaceFormatCheckPoint(
        RaceAthlete raceAthlete,
        RaceFormatCheckPoint raceFormatCheckPoint
    );

    Optional<RaceAthleteCheckPoint> findFirstByRaceAthleteAndRaceFormatCheckPointIsStart(
        RaceAthlete raceAthlete,
        boolean isStart
    );

    Optional<RaceAthleteCheckPoint> findFirstByRaceAthleteAndRaceFormatCheckPointOrderNumberLessThanAndTimeNotNullOrderByRaceFormatCheckPointOrderNumberDesc(
        RaceAthlete raceAthlete,
        Integer orderNumber
    );

}
