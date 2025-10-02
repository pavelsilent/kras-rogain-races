package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceAthleteGroup;

public interface RaceAthleteGroupRepository extends EntityRepository<RaceAthleteGroup, Long> {

    List<RaceAthleteGroup> findAllByRaceAthlete(RaceAthlete raceAthlete);

    Optional<RaceAthleteGroup> findFirstByRaceAthleteAndAthleteGroup(
        RaceAthlete raceAthlete,
        AthleteGroup athleteGroup
    );

}
