package pro.pavel.silent.rogain.races.data;

import java.util.List;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.entity.AthleteTeam;

public interface AthleteTeamRepository
    extends EntityRepository<AthleteTeam, Long> {

    List<AthleteTeam> findAll();

}
