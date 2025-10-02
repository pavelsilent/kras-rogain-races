package pro.pavel.silent.rogain.races.rest.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.lib.core.util.DurationHelper;
import pro.pavel.silent.lib.core.util.ListHelper;
import pro.pavel.silent.lib.core.util.OptionalHelper;
import pro.pavel.silent.lib.core.util.ThreeMap;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceState;
import pro.pavel.silent.rogain.races.domain.model.RaceFormatTokenModel;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.City;
import pro.pavel.silent.rogain.races.entity.Club;
import pro.pavel.silent.rogain.races.entity.Race;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceAthleteCheckPoint;
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
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatTokenDTO;
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

        List<RaceAthlete> raceAthletes = raceQueryService.getRaceAthletes(raceFormat);
        List<AthleteGroup> athleteGroups = raceQueryService.getRaceFormatAthleteGroups(raceFormat)
                                                           .stream()
                                                           .map(RaceFormatAthleteGroup::getAthleteGroup)
                                                           .toList();
        RaceState raceState = raceFormat.getState();
        ThreeMap<Long, AthleteGroup, Integer> placesMap =
            raceState.isHasPlace() ?
            raceQueryService.resolveAthleteGroupsPlaceMap(
                raceAthletes,
                athleteGroups
            ) : new ThreeMap<>();

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
                                      ListHelper.mapI(
                                          raceQueryService.getRaceAthletes(raceFormat),
                                          (i, raceAthlete) -> toDTO(
                                              raceAthlete,
                                              i + 1,
                                              placesMap.get(raceAthlete.getId())
                                          )
                                      )
                                  )
                                  //                                  .checkTime(raceQueryService.findRaceCheckTime(raceFormat)
                                  //                                                             .map(this::toDTO)
                                  //                                                             .orElse(null)
                                  //                                  )
                                  //                                  .leaderTime(raceQueryService.findRaceLeaderTime(raceFormat)
                                  //                                                              .map(this::toDTO)
                                  //                                                              .orElse(null)
                                  //                                  )
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
                              .sex(athleteGroup.getSex().name())
                              .build();
    }

    public RaceFormatCheckPointDTO toDTO(RaceFormatCheckPoint checkPoint) {
        if (checkPoint == null) {
            return null;
        }

        LocalDateTime startTime = checkPoint.getRaceFormat().getStartTime();
        LocalDateTime leaderTime = Optional.ofNullable(checkPoint.getLeaderDuration())
                                           .map(startTime::plus)
                                           .orElse(null);

        Duration prevCheckPointDiff = null;
        Optional<RaceFormatCheckPoint> prevCheckPointOpt = raceQueryService.findPrevCheckPoint(checkPoint);
        if (prevCheckPointOpt.isPresent()) {
            RaceFormatCheckPoint prevCheckPoint = prevCheckPointOpt.get();

            LocalDateTime prevCheckPointTime = startTime.plus(prevCheckPoint.getLeaderDuration());

            if (Objects.nonNull(leaderTime)) {
                prevCheckPointDiff = Duration.between(prevCheckPointTime, leaderTime);
            }
        } else {
            prevCheckPointDiff = Duration.ofMillis(0);
        }

        return RaceFormatCheckPointDTO.builder()
                                      .id(checkPoint.getId())
                                      .name(checkPoint.getName())
                                      .description(checkPoint.getDescription())
                                      .orderNumber(checkPoint.getOrderNumber())
                                      .totalDistance(checkPoint.getTotalDistance())
                                      .checkDuration(DurationHelper.format(checkPoint.getCheckDuration()))
                                      .checkTime(Optional.ofNullable(checkPoint.getCheckDuration())
                                                         .map(startTime::plus)
                                                         .orElse(null))
                                      .leaderDuration(DurationHelper.format(checkPoint.getLeaderDuration()))
                                      .leaderTime(leaderTime)
                                      .leaderDiffDuration(DurationHelper.format(prevCheckPointDiff))
                                      .isStart(checkPoint.getIsStart())
                                      .isFinish(checkPoint.getIsFinish())
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
                             .build();
    }

    public RaceAthleteDTO toDTO(RaceAthlete raceAthlete, Integer absPlace, Map<AthleteGroup, Integer> placesMap) {
        RaceAthleteDTO dto = toDTO(raceAthlete);
        if (dto == null || placesMap == null) {
            return dto;
        }
        List<RaceAthleteGroupDTO> places =
            placesMap.entrySet()
                     .stream()
                     .map(entry -> new RaceAthleteGroupDTO(toDTO(entry.getKey()), entry.getValue()))
                     .toList();
        dto.setAbsPlace(absPlace);
        dto.setPlaces(places);
        return dto;
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
                         .city(Optional.ofNullable(athlete.getCity()).map(this::toDTO).orElse(null))
                         .club(Optional.ofNullable(athlete.getClub()).map(Club::getName).orElse(null))
                         .build();
    }

    public RaceAthleteCheckPointDTO toDTO(RaceAthleteCheckPoint checkPoint) {
        if (checkPoint == null) {
            return null;
        }

        RaceFormatCheckPoint raceFormatCheckPoint = checkPoint.getRaceFormatCheckPoint();

        LocalDateTime startTime = raceFormatCheckPoint.getRaceFormat().getStartTime();
        LocalDateTime startRaceTime = LocalDateTime.of(
            startTime.getYear(),
            startTime.getMonth(),
            startTime.getDayOfMonth(),
            0,
            0,
            0
        );

        boolean checkTimeIsExpired = false;
        if (Objects.nonNull(raceFormatCheckPoint.getCheckDuration()) && Objects.nonNull(checkPoint.getTime())) {
            LocalDateTime checkPointCheckTime = startTime.plus(checkPoint.getRaceFormatCheckPoint().getCheckDuration());
            checkTimeIsExpired = checkPoint.getTime().isAfter(checkPointCheckTime);
        }

        Duration raceDiff = Duration.between(startRaceTime, startTime);

        Duration prevCheckPointDiff = null;
        Optional<RaceAthleteCheckPoint> prevCheckPointOpt = raceQueryService.findPrevCheckPoint(checkPoint);
        if (prevCheckPointOpt.isPresent() && checkPoint.isPassed()) {
            RaceAthleteCheckPoint prevCheckPoint = prevCheckPointOpt.get();
            prevCheckPointDiff = Duration.between(prevCheckPoint.getTime(), checkPoint.getTime());
        }

        if (raceFormatCheckPoint.getIsStart()) {
            prevCheckPointDiff = Duration.ofMillis(0);
        }

        return RaceAthleteCheckPointDTO.builder()
                                       .id(raceFormatCheckPoint.getId())
                                       .athleteBibNumber(checkPoint.getRaceAthlete().getBibNumber())
                                       .time(checkPoint.getTime())
                                       .raceTime(Optional.ofNullable(checkPoint.getTime())
                                                         .map(time -> time.minus(raceDiff))
                                                         .orElse(null))
                                       .prevCheckPointDiffDuration(DurationHelper.format(prevCheckPointDiff))
                                       .passed(checkPoint.isPassed())
                                       .checkTimeExpired(checkTimeIsExpired)
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

    public RaceFormatTokenDTO toDTO(RaceFormatTokenModel model) {
        if (model == null) {
            return null;
        }
        return RaceFormatTokenDTO.builder()
                                 .raceId(model.getRaceId())
                                 .raceFormatId(model.getRaceFormatId())
                                 .token(model.getToken())
                                 .tokenType(model.getTokenType().name())
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
                            .raceName(raceFormat.getRace().getName())
                            .type(raceFormat.getType().name())
                            .viewToken(raceFormat.getViewToken())
                            .editToken(raceFormat.getEditToken())
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
