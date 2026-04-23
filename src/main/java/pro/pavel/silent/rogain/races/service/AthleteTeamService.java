package pro.pavel.silent.rogain.races.service;

import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.rogain.races.data.AthleteTeamMemberRepository;
import pro.pavel.silent.rogain.races.data.AthleteTeamRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.AthleteGroupSex;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.AthleteTeam;
import pro.pavel.silent.rogain.races.entity.AthleteTeamMember;
import pro.pavel.silent.rogain.races.rest.dto.AthleteTeamDTO;
import pro.pavel.silent.rogain.races.rest.dto.MemberInfoDTO;

@Service
@RequiredArgsConstructor
public class AthleteTeamService {

    private final AthleteTeamRepository athleteTeamRepository;
    private final AthleteTeamMemberRepository athleteTeamMemberRepository;
    private final AthleteQueryService athleteQueryService;

    public AthleteTeam createAthleteTeam(AthleteTeamDTO dto) {
        AthleteTeam athleteTeam = new AthleteTeam();
        fill(athleteTeam, dto);
        return athleteTeamRepository.save(athleteTeam);
    }

    public AthleteTeam updateAthleteTeam(Long id, AthleteTeamDTO dto) {
        AthleteTeam athleteTeam = athleteQueryService.getTeamById(dto.getId());
        fill(athleteTeam, dto);
        return athleteTeamRepository.save(athleteTeam);
    }

    private void fill(AthleteTeam athleteTeam, AthleteTeamDTO dto) {
        athleteTeam.setName(dto.getName());
        athleteTeam.setSex(AthleteGroupSex.valueOf(dto.getSex()));
        athleteTeamRepository.save(athleteTeam);

        List<Long> existingMemberIds =
            athleteTeamMemberRepository.findAllByTeam(athleteTeam)
                                       .stream()
                                       .map(AthleteTeamMember::getAthlete)
                                       .map(Athlete::getId)
                                       .toList();

        if (Objects.nonNull(dto.getMembers())) {
            List<Long> actualMemberIds = dto.getMembers().stream().map(MemberInfoDTO::getId).toList();

            List<Long> deletingMemberIds = existingMemberIds.stream()
                                                            .filter(id -> !actualMemberIds.contains(id))
                                                            .toList();
            List<Long> newMemberIds = actualMemberIds.stream()
                                                     .filter(id -> !existingMemberIds.contains(id))
                                                     .toList();

            deletingMemberIds.forEach(id -> athleteTeamMemberRepository.deleteByTeamAndAthleteId(athleteTeam, id));

            newMemberIds.forEach(id -> addAthleteTeamMember(athleteTeam, id));

        } else {
            athleteTeamMemberRepository.deleteAllByTeam(athleteTeam);
        }
    }

    public void addAthleteTeamMember(AthleteTeam athleteTeam, Long athleteId) {
        Athlete athlete = athleteQueryService.getById(athleteId);
        athleteTeamMemberRepository.findFirstByTeamAndAthlete(athleteTeam, athlete)
                                   .orElseGet(() -> {
                                       AthleteTeamMember member = new AthleteTeamMember();
                                       member.setTeam(athleteTeam);
                                       member.setAthlete(athlete);
                                       return athleteTeamMemberRepository.save(member);
                                   });
    }

    public void deleteAthleteTeamMember(AthleteTeam athleteTeam, Long athleteId) {
        Athlete athlete = athleteQueryService.getById(athleteId);
        AthleteTeamMember member = athleteTeamMemberRepository.findFirstByTeamAndAthlete(athleteTeam, athlete)
                                                              .orElse(null);
        if (Objects.nonNull(member)) {
            athleteTeamMemberRepository.delete(member);
        }
    }

}
