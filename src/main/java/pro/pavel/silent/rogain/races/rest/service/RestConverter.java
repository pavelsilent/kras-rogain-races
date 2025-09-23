package pro.pavel.silent.rogain.races.rest.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.lib.core.util.ListHelper;
import pro.pavel.silent.lib.core.util.OptionalHelper;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.City;
import pro.pavel.silent.rogain.races.entity.Club;
import pro.pavel.silent.rogain.races.entity.Race;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceAthleteCheckPoint;
import pro.pavel.silent.rogain.races.entity.RaceAthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatAthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceFormatCheckPoint;
import pro.pavel.silent.rogain.races.entity.RaceType;
import pro.pavel.silent.rogain.races.rest.dto.AthleteDTO;
import pro.pavel.silent.rogain.races.rest.dto.AthleteGroupDTO;
import pro.pavel.silent.rogain.races.rest.dto.CityDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceAthleteCheckPointDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceAthleteDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceAthleteGroupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatCheckPointDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatResultDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceTypeDTO;
import pro.pavel.silent.rogain.races.service.RaceQueryService;

@Service
@RequiredArgsConstructor
public class RestConverter {

    private final RaceQueryService raceQueryService;

    public RaceFormatResultDTO toResultDTO(RaceFormat raceFormat) {
        if (raceFormat == null) {
            return null;
        }
        return RaceFormatResultDTO.builder()
                                  .id(raceFormat.getId())
                                  .name(raceFormat.getName())
                                  .type(Optional.ofNullable(raceFormat.getType()).map(Enum::name).orElse(null))
                                  .state(raceFormat.getState().name())
                                  .startTime(raceFormat.getStartTime())
                                  .finishTime(raceFormat.getFinishTime())
                                  .athleteGroups(
                                      ListHelper.map(
                                          ListHelper.map(
                                              raceQueryService.getRaceFormatAthleteGroups(raceFormat),
                                              RaceFormatAthleteGroup::getAthleteGroup
                                          ), this::toDTO))
                                  .checkPoints(
                                      ListHelper.map(
                                          raceQueryService.getRaceFormatCheckPoints(raceFormat),
                                          this::toDTO
                                      ))
                                  .athletes(
                                      ListHelper.map(
                                          raceQueryService.getRaceAthletes(raceFormat),
                                          this::toDTO
                                      )
                                  )
                                  .checkTime(raceQueryService.findRaceCheckTime(raceFormat)
                                                             .map(this::toDTO)
                                                             .orElse(null)
                                  )
                                  .leaderTime(raceQueryService.findRaceLeaderTime(raceFormat)
                                                              .map(this::toDTO)
                                                              .orElse(null)
                                  )
                                  .build();
    }

    public AthleteGroupDTO toDTO(AthleteGroup athleteGroup) {
        if (athleteGroup == null) {
            return null;
        }
        return AthleteGroupDTO.builder()
                              .id(athleteGroup.getId())
                              .name(athleteGroup.getName())
                              .description(athleteGroup.getDescription())
                              .build();
    }

    public RaceFormatCheckPointDTO toDTO(RaceFormatCheckPoint checkPoint) {
        if (checkPoint == null) {
            return null;
        }
        return RaceFormatCheckPointDTO.builder()
                                      .id(checkPoint.getId())
                                      .name(checkPoint.getName())
                                      .description(checkPoint.getDescription())
                                      .orderNumber(checkPoint.getOrderNumber())
                                      .totalDistance(checkPoint.getTotalDistance())
                                      .checkTime(checkPoint.getCheckTime())
                                      .hasCheckTime(checkPoint.isHasCheckTime())
                                      .leaderTime(checkPoint.getLeaderTime())
                                      .isStart(checkPoint.isStart())
                                      .isFinish(checkPoint.isFinish())
                                      .build();
    }

    public RaceAthleteDTO toDTO(RaceAthlete raceAthlete) {
        if (raceAthlete == null) {
            return null;
        }
        return RaceAthleteDTO.builder()
                             .athlete(toDTO(raceAthlete.getAthlete()))
                             .bibNumber(raceAthlete.getBibNumber())
                             .state(raceAthlete.getState().name())
                             .type(raceAthlete.getType().name())
                             .checkPoints(ListHelper.map(
                                 raceQueryService.getRaceAthleteCheckPoints(raceAthlete),
                                 this::toDTO
                             ))
                             .places(ListHelper.map(raceQueryService.getRaceAthleteGroups(raceAthlete), this::toDTO))
                             .build();
    }

    public AthleteDTO toDTO(Athlete athlete) {
        if (athlete == null) {
            return null;
        }
        return AthleteDTO.builder()
                         .id(athlete.getId())
                         .firstName(athlete.getFirstName())
                         .lastName(athlete.getLastName())
                         .middleName(athlete.getMiddleName())
                         .sex(athlete.getSex().name())
                         .birthDate(athlete.getBirthDate())
                         .city(Optional.ofNullable(athlete.getCity()).map(City::getName).orElse(null))
                         .club(Optional.ofNullable(athlete.getClub()).map(Club::getName).orElse(null))
                         .build();
    }

    public RaceAthleteCheckPointDTO toDTO(RaceAthleteCheckPoint checkPoint) {
        if (checkPoint == null) {
            return null;
        }
        return RaceAthleteCheckPointDTO.builder()
                                       .id(checkPoint.getRaceFormatCheckPoint().getId())
                                       .athleteBibNumber(checkPoint.getRaceAthlete().getBibNumber())
                                       .time(checkPoint.getTime())
                                       .raceTime(checkPoint.getRaceTime())
                                       .previousCheckPointDiffTime(checkPoint.getPreviousCheckPointDiffTime())
                                       .passed(checkPoint.isPassed())
                                       .build();
    }

    public RaceAthleteGroupDTO toDTO(RaceAthleteGroup raceAthleteGroup) {
        if (raceAthleteGroup == null) {
            return null;
        }
        return RaceAthleteGroupDTO.builder()
                                  .id(raceAthleteGroup.getId())
                                  .place(raceAthleteGroup.getPlace())
                                  .build();
    }


    public RaceDTO toDTO(Race race) {
        if (race == null) {
            return null;
        }
        return RaceDTO.builder()
                      .id(race.getId())
                      .name(race.getName())
                      .description(race.getDescription())
                      .raceType(OptionalHelper.map(race.getRaceType(), this::toDTO))
                      .date(race.getDate())
                      .city(OptionalHelper.map(race.getCity(), this::toDTO))
                      .state(race.getState().name())
                      .formats(ListHelper.map(raceQueryService.getRaceFormats(race.getId()), this::toDTO))
                      .build();
    }

    public RaceFormatDTO toDTO(RaceFormat raceFormat) {
        if (raceFormat == null) {
            return null;
        }
        return RaceFormatDTO.builder()
                            .id(raceFormat.getId())
                            .name(raceFormat.getName())
                            .description(raceFormat.getDescription())
                            .type(raceFormat.getType().name())
                            .startTime(raceFormat.getStartTime())
                            .finishTime(raceFormat.getFinishTime())
                            .state(raceFormat.getState().name())
                            .athleteGroups(
                                ListHelper.map(
                                    ListHelper.map(
                                        raceQueryService.getRaceFormatAthleteGroups(raceFormat),
                                        RaceFormatAthleteGroup::getAthleteGroup
                                    ), this::toDTO))
                            .build();
    }

    public RaceTypeDTO toDTO(RaceType raceType) {
        if (raceType == null) {
            return null;
        }
        return RaceTypeDTO.builder()
                          .id(raceType.getId())
                          .name(raceType.getName())
                          .description(raceType.getDescription())
                          .build();
    }

    public CityDTO toDTO(City city) {
        if (city == null) {
            return null;
        }
        return CityDTO.builder()
                      .id(city.getId())
                      .name(city.getName())
                      .type(city.getType().name())
                      .build();
    }

}
