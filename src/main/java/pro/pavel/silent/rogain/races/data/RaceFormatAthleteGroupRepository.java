package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatAthleteGroup;

public interface RaceFormatAthleteGroupRepository extends PagingAndSortingRepository<RaceFormatAthleteGroup, Long>,
                                                          CrudRepository<RaceFormatAthleteGroup, Long>,
                                                          JpaSpecificationExecutor<RaceFormatAthleteGroup> {

    List<RaceFormatAthleteGroup> findAllByRaceFormat(RaceFormat raceFormat);

    Optional<RaceFormatAthleteGroup> findFirstByRaceFormatAndAthleteGroup(
        RaceFormat raceFormat,
        AthleteGroup athleteGroup
    );

}
