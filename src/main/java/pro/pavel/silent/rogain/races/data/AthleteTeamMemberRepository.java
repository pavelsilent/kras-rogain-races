package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.AthleteTeam;
import pro.pavel.silent.rogain.races.entity.AthleteTeamMember;

public interface AthleteTeamMemberRepository
    extends EntityRepository<AthleteTeamMember, Long> {

    List<AthleteTeamMember> findAll();

    Optional<AthleteTeamMember> findFirstByTeamAndAthlete(AthleteTeam athleteTeam, Athlete athlete);

    List<AthleteTeamMember> findAllByTeam(AthleteTeam team);

    List<AthleteTeamMember> findAllByTeamId(Long id);

    void deleteAllByTeam(AthleteTeam team);

    void deleteByTeamAndAthleteId(AthleteTeam team, Long athleteId);

}
