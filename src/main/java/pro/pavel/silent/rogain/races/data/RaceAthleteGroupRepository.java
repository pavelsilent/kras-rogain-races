package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceAthleteGroup;

public interface RaceAthleteGroupRepository extends PagingAndSortingRepository<RaceAthleteGroup, Long>,
                                                    CrudRepository<RaceAthleteGroup, Long>,
                                                    JpaSpecificationExecutor<RaceAthleteGroup> {

    List<RaceAthleteGroup> findAllByRaceAthlete(RaceAthlete raceAthlete);

    Optional<RaceAthleteGroup> findFirstByRaceAthleteAndAthleteGroup(
        RaceAthlete raceAthlete,
        AthleteGroup athleteGroup
    );

}
