package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatAthleteGroup;

public interface RaceFormatAthleteGroupRepository extends EntityRepository<RaceFormatAthleteGroup, Long> {

    List<RaceFormatAthleteGroup> findAllByRaceFormat(RaceFormat raceFormat);

    Optional<RaceFormatAthleteGroup> findFirstByRaceFormatAndAthleteGroup(
        RaceFormat raceFormat,
        AthleteGroup athleteGroup
    );

}
