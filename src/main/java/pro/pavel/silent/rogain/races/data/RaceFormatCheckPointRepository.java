package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatCheckPoint;

public interface RaceFormatCheckPointRepository extends PagingAndSortingRepository<RaceFormatCheckPoint, Long>,
                                                        CrudRepository<RaceFormatCheckPoint, Long>,
                                                        JpaSpecificationExecutor<RaceFormatCheckPoint> {


    List<RaceFormatCheckPoint> findAllByRaceFormatOrderByOrderNumberAsc(RaceFormat raceFormat);

    List<RaceFormatCheckPoint> findAllByRaceFormatAndOrderNumberGreaterThanEqual(
        RaceFormat raceFormat,
        Integer orderNumber
    );

    Optional<RaceFormatCheckPoint> findFirstByRaceFormatAndOrderNumber(
        RaceFormat raceFormat,
        Integer orderNumber
    );

    Optional<RaceFormatCheckPoint> findFirstByRaceFormatAndIsStartTrue(RaceFormat raceFormat);

    Optional<RaceFormatCheckPoint> findFirstByRaceFormatAndIsFinishTrue(RaceFormat raceFormat);

    Optional<RaceFormatCheckPoint> findFirstByRaceFormatAndOrderNumberLessThanAndLeaderDurationNotNullOrderByOrderNumberDesc(
        RaceFormat raceFormat,
        Integer orderNumber
    );

}
