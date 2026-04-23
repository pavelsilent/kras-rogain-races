package pro.pavel.silent.rogain.races.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.rogain.races.data.AthleteGroupRepository;
import pro.pavel.silent.rogain.races.data.AthleteRepository;
import pro.pavel.silent.rogain.races.data.AthleteTeamMemberRepository;
import pro.pavel.silent.rogain.races.data.AthleteTeamRepository;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.AthleteTeam;
import pro.pavel.silent.rogain.races.entity.AthleteTeamMember;

@Service
@RequiredArgsConstructor
public class AthleteQueryService {

    private final AthleteRepository athleteRepository;
    private final AthleteGroupRepository athleteGroupRepository;
    private final AthleteTeamRepository athleteTeamRepository;
    private final AthleteTeamMemberRepository athleteTeamMemberRepository;

    public List<Athlete> getAll() {
        return athleteRepository.findAll();
    }

    public Athlete getById(Long id) {
        return athleteRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Not found athlete with id: " + id));
    }


    public AthleteGroup getAthleteGroupById(Long id) {
        return athleteGroupRepository.findById(id)
                                     .orElseThrow(() -> new RuntimeException("Not found athlete group with id: " + id));
    }

    public List<AthleteTeam> getAllTeams() {
        return athleteTeamRepository.findAll();
    }

    public AthleteTeam getTeamById(Long id) {
        return athleteTeamRepository.findById(id)
                                    .orElseThrow(() -> new RuntimeException("Not found athlete team with id: " + id));
    }

    public List<AthleteTeamMember> getTeamMembers(Long id) {
        return athleteTeamMemberRepository.findAllByTeamId(id);
    }

}
