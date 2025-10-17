package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceAthleteCheckPoint;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatCheckPoint;

public interface RaceAthleteCheckPointRepository extends EntityRepository<RaceAthleteCheckPoint, Long> {

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

    Optional<RaceAthleteCheckPoint> findFirstByRaceAthleteAndRaceFormatCheckPointOrderNumberGreaterThanAndTimeNotNullOrderByRaceFormatCheckPointOrderNumberAsc(
        RaceAthlete raceAthlete,
        Integer orderNumber
    );

    void deleteAllByRaceFormatCheckPointRaceFormat(RaceFormat raceFormat);

    void deleteAllByRaceAthlete(RaceAthlete raceAthlete);

}
