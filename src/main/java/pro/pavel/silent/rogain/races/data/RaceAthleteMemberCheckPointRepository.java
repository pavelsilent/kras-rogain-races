package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteType;
import pro.pavel.silent.rogain.races.entity.RaceAthleteCheckPoint;
import pro.pavel.silent.rogain.races.entity.RaceAthleteMemberCheckPoint;

public interface RaceAthleteMemberCheckPointRepository
    extends EntityRepository<RaceAthleteMemberCheckPoint, Long> {

    List<RaceAthleteMemberCheckPoint> findAllByRaceAthleteCheckPoint(RaceAthleteCheckPoint checkPoint);

    void deleteAllByRaceAthleteCheckPoint(RaceAthleteCheckPoint checkPoint);

    Optional<RaceAthleteMemberCheckPoint> findFirstByRaceAthleteCheckPointAndMemberTypeAndMemberId(
        RaceAthleteCheckPoint checkPoint,
        RaceAthleteType memberType,
        Long memberId
    );

}
