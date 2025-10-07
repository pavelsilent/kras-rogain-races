package pro.pavel.silent.rogain.races.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pro.pavel.silent.lib.core.util.DurationHelper;
import pro.pavel.silent.rogain.races.data.RaceAthleteCheckPointRepository;
import pro.pavel.silent.rogain.races.data.RaceAthleteGroupRepository;
import pro.pavel.silent.rogain.races.data.RaceAthleteRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatAthleteGroupRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatCheckPointRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatFileRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatRepository;
import pro.pavel.silent.rogain.races.data.RaceRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteState;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteType;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceFormatType;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceState;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.Race;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceAthleteCheckPoint;
import pro.pavel.silent.rogain.races.entity.RaceAthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatAthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceFormatCheckPoint;
import pro.pavel.silent.rogain.races.rest.dto.AthleteGroupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceAthleteCheckPointDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceAthleteSetupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatCheckPointSetupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceSetupDTO;
import pro.pavel.silent.rogain.races.rest.dto.StateDTO;

@Service
@RequiredArgsConstructor
public class RaceService {

    private final RaceRepository raceRepository;
    private final RaceAthleteRepository raceAthleteRepository;
    private final RaceAthleteCheckPointRepository raceAthleteCheckPointRepository;
    private final RaceQueryService raceQueryService;
    private final RaceTypeService raceTypeService;
    private final CityService cityService;
    private final RaceFormatRepository raceFormatRepository;
    private final AthleteQueryService athleteQueryService;
    private final RaceFormatAthleteGroupRepository raceFormatAthleteGroupRepository;
    private final RaceAthleteGroupRepository raceAthleteGroupRepository;
    private final RaceFormatCheckPointRepository raceFormatCheckPointRepository;
    private final FileService fileService;
    private final RaceFormatFileRepository raceFormatFileRepository;

    public Race createRace(RaceSetupDTO dto) {
        Race race = new Race();
        fillRace(race, dto);
        race.setState(RaceState.DRAFT);
        return raceRepository.save(race);
    }

    public Race updateRace(RaceSetupDTO dto) {
        Race race = raceQueryService.getRaceById(dto.getId());
        fillRace(race, dto);
        return raceRepository.save(race);
    }

    private void fillRace(Race race, RaceSetupDTO dto) {
        race.setName(dto.getName());
        race.setDescription(dto.getDescription());
        race.setDate(dto.getDate());
        race.setRaceType(raceTypeService.getById(dto.getRaceTypeId()));
        race.setCity(cityService.getById(dto.getCityId()));
    }

    public RaceFormat addRaceFormat(Long raceId, RaceFormatDTO dto) {
        Race race = raceQueryService.getRaceById(raceId);
        RaceFormat raceFormat = new RaceFormat();
        raceFormat.setState(RaceState.DRAFT);
        raceFormat.setViewToken(UUID.randomUUID().toString());
        raceFormat.setEditToken(UUID.randomUUID().toString());
        fillRaceFormat(raceFormat, race, dto);
        raceFormatRepository.save(raceFormat);

        addRaceFormatAthleteGroups(raceFormat, dto.getAthleteGroups());

        return raceFormat;
    }

    public List<RaceFormatAthleteGroup> addRaceFormatAthleteGroups(
        Long raceId,
        Long raceFormatId,
        List<AthleteGroupDTO> athleteGroups
    ) {
        RaceFormat raceFormat = raceQueryService.getRaceFormatById(raceFormatId);
        return addRaceFormatAthleteGroups(raceFormat, athleteGroups);
    }

    public List<RaceFormatAthleteGroup> addRaceFormatAthleteGroups(
        RaceFormat raceFormat,
        List<AthleteGroupDTO> athleteGroups
    ) {
        return Optional.ofNullable(athleteGroups)
                       .map(list -> list.stream()
                                        .map(athleteGroupDTO -> ensureRaceAthleteGroup(raceFormat, athleteGroupDTO))
                                        .toList())
                       .orElseGet(Collections::emptyList);
    }

    private void fillRaceFormat(RaceFormat raceFormat, Race race, RaceFormatDTO dto) {
        raceFormat.setRace(race);
        raceFormat.setName(dto.getName());
        raceFormat.setDescription(dto.getDescription());
        raceFormat.setType(RaceFormatType.valueOf(dto.getType()));
        raceFormat.setStartTime(dto.getStartTime());
        raceFormat.setFinishTime(dto.getFinishTime());
    }

    private RaceFormatAthleteGroup ensureRaceAthleteGroup(RaceFormat raceFormat, AthleteGroupDTO dto) {
        AthleteGroup athleteGroup = athleteQueryService.getAthleteGroupById(dto.getId());
        return raceQueryService.findRaceFormatAthleteGroup(raceFormat, athleteGroup)
                               .orElseGet(() -> createRaceAthleteGroup(raceFormat, athleteGroup));
    }

    private RaceFormatAthleteGroup createRaceAthleteGroup(RaceFormat raceFormat, AthleteGroup athleteGroup) {
        RaceFormatAthleteGroup group = new RaceFormatAthleteGroup();
        group.setRaceFormat(raceFormat);
        group.setAthleteGroup(athleteGroup);
        return raceFormatAthleteGroupRepository.save(group);
    }

    public RaceAthlete addRaceAthlete(Long raceId, Long raceFormatId, RaceAthleteSetupDTO raceAthleteDTO) {
        RaceFormat raceFormat = raceQueryService.getRaceFormatById(raceFormatId);
        Optional<RaceAthlete> raceAthleteBibNumber = raceQueryService.findRaceAthleteByBibNumber(
            raceFormat,
            raceAthleteDTO.getBibNumber()
        );
        if (raceAthleteBibNumber.isPresent()) {
            throw new RuntimeException("Race athlete with bib number '%s' already exists.".formatted(raceAthleteDTO.getBibNumber()));
        }

        Athlete athlete = athleteQueryService.getById(raceAthleteDTO.getAthleteId());
        Optional<RaceAthlete> existedRaceAthlete = raceQueryService.findRaceAthlete(raceFormat, athlete);
        if (existedRaceAthlete.isPresent()) {
            throw new RuntimeException("Race athlete with id '%s' already exists.".formatted(athlete.getId()));
        }

        RaceAthlete newRaceAthlete = new RaceAthlete();
        newRaceAthlete.setAthlete(athlete);
        newRaceAthlete.setRaceFormat(raceFormat);
        newRaceAthlete.setBibNumber(raceAthleteDTO.getBibNumber());
        newRaceAthlete.setState(RaceAthleteState.REGISTERED);
        newRaceAthlete.setType(RaceAthleteType.ATHLETE);
        newRaceAthlete.setLastCheckPointOrderNumber(0);
        raceAthleteRepository.save(newRaceAthlete);

        AthleteGroup athleteGroup = athleteQueryService.getAthleteGroupById(raceAthleteDTO.getAthleteGroupId());
        RaceAthleteGroup raceAthleteGroup = new RaceAthleteGroup();
        raceAthleteGroup.setAthleteGroup(athleteGroup);
        raceAthleteGroup.setRaceAthlete(newRaceAthlete);
        raceAthleteGroupRepository.save(raceAthleteGroup);

        return newRaceAthlete;
    }

    @Transactional
    public RaceFormatCheckPoint addRaceCheckPoint(
        Long raceId,
        Long raceFormatId,
        RaceFormatCheckPointSetupDTO checkPointDTO
    ) {
        RaceFormat raceFormat = raceQueryService.getRaceFormatById(raceFormatId);

        List<RaceFormatCheckPoint> nextCheckPoints =
            raceQueryService.getRaceFormatCheckPoints(raceFormat, checkPointDTO.getOrderNumber());

        for (RaceFormatCheckPoint nextCheckPoint : nextCheckPoints) {
            nextCheckPoint.setOrderNumber(nextCheckPoint.getOrderNumber() + 1);
            if (nextCheckPoint.getIsStart()) {
                nextCheckPoint.setIsStart(false);
            }
            raceFormatCheckPointRepository.save(nextCheckPoint);
        }

        boolean isItNewStart = checkPointDTO.getOrderNumber().equals(1);
        boolean isItNewFinish = nextCheckPoints.isEmpty();

        if (!isItNewStart && isItNewFinish) {
            RaceFormatCheckPoint oldFinishCheckPoint = raceQueryService.getRaceFormatFinishCheckPoint(raceFormat);
            oldFinishCheckPoint.setIsFinish(false);
            raceFormatCheckPointRepository.save(oldFinishCheckPoint);
        }

        RaceFormatCheckPoint newCheckPoint = new RaceFormatCheckPoint();
        newCheckPoint.setRaceFormat(raceFormat);
        newCheckPoint.setName(checkPointDTO.getName());
        newCheckPoint.setDescription(checkPointDTO.getDescription());
        newCheckPoint.setOrderNumber(checkPointDTO.getOrderNumber());
        newCheckPoint.setIsStart(isItNewStart);
        newCheckPoint.setIsFinish(isItNewFinish);
        newCheckPoint.setTotalDistance(checkPointDTO.getTotalDistance());
        newCheckPoint.setHasCheckTime(Objects.nonNull(checkPointDTO.getCheckDuration()));
        newCheckPoint.setCheckDuration(DurationHelper.parse(checkPointDTO.getCheckDuration()));
        newCheckPoint.setLeaderDuration(DurationHelper.parse(checkPointDTO.getLeaderDuration()));

        raceFormatCheckPointRepository.save(newCheckPoint);

        List<RaceFormatCheckPoint> raceFormatCheckPoints = raceQueryService.getRaceFormatCheckPoints(raceFormat);
        for (int i = 0; i < raceFormatCheckPoints.size(); i++) {
            RaceFormatCheckPoint raceFormatCheckPoint = raceFormatCheckPoints.get(i);
            raceFormatCheckPoint.setOrderNumber(i + 1);
            raceFormatCheckPointRepository.save(raceFormatCheckPoint);
        }

        return newCheckPoint;
    }

    public void addRaceAthleteCheckPoint(
        Long raceId,
        Long raceFormatId,
        Integer athleteBibNumber,
        RaceAthleteCheckPointDTO checkPoint
    ) {
        RaceFormat raceFormat = raceQueryService.getRaceFormatById(raceFormatId);
        RaceAthlete raceAthlete = raceQueryService.getRaceAthleteByBibNumber(raceFormat, athleteBibNumber);
        RaceFormatCheckPoint raceFormatCheckPoint = raceQueryService.getRaceFormatCheckPoint(checkPoint.getId());

        LocalDateTime realTime = checkPoint.getTime();

        RaceAthleteCheckPoint raceAthleteCheckPoint =
            raceQueryService.findRaceAthleteCheckPoint(raceAthlete, raceFormatCheckPoint)
                            .orElseGet(RaceAthleteCheckPoint::new);

        raceAthleteCheckPoint.setRaceAthlete(raceAthlete);
        raceAthleteCheckPoint.setRaceFormatCheckPoint(raceFormatCheckPoint);
        raceAthleteCheckPoint.setTime(realTime);
        raceAthleteCheckPoint.setPassed(checkPoint.getPassed());

        raceAthleteCheckPointRepository.save(raceAthleteCheckPoint);

        calcDiffs(raceAthlete);
    }

    private void calcDiffs(RaceAthlete raceAthlete) {
        ensureRaceAthleteStartPoint(raceAthlete);
        raceQueryService
            .findLastPassedCheckPoint(raceAthlete)
            .ifPresent(lastCheckPoint -> {
                raceAthlete.setLastCheckPointOrderNumber(lastCheckPoint.getRaceFormatCheckPoint().getOrderNumber());
                raceAthlete.setLastCheckPointTime(lastCheckPoint.getTime());
                raceAthleteRepository.save(raceAthlete);
            });
    }

    public RaceAthleteCheckPoint ensureRaceAthleteStartPoint(RaceAthlete raceAthlete) {
        RaceFormat raceFormat = raceAthlete.getRaceFormat();
        RaceFormatCheckPoint startCheckPoint = raceQueryService.getRaceFormatStartCheckPoint(raceFormat);
        RaceAthleteCheckPoint raceAthleteStartPoint =
            raceQueryService.findRaceAthleteCheckPoint(raceAthlete, startCheckPoint)
                            .orElseGet(RaceAthleteCheckPoint::new);

        if (!raceAthleteStartPoint.isPassed()) {
            LocalDateTime realTime = raceFormat.getStartTime();
            raceAthleteStartPoint.setRaceAthlete(raceAthlete);
            raceAthleteStartPoint.setRaceFormatCheckPoint(startCheckPoint);
            raceAthleteStartPoint.setTime(realTime);
            raceAthleteStartPoint.setPassed(true);
        }
        return raceAthleteCheckPointRepository.save(raceAthleteStartPoint);
    }

    public LocalDateTime calcRaceTime(LocalDateTime startTime, LocalDateTime realTime) {
        Duration raceTimeDiff = Duration.between(startTime, realTime);
        return LocalDateTime.of(startTime.toLocalDate(), LocalTime.of(0, 0, 0)).plus(raceTimeDiff);
    }

    public List<RaceAthleteCheckPoint> ensureRaceAthleteCheckPoints(RaceAthlete raceAthlete) {
        List<RaceFormatCheckPoint> checkPoints = raceQueryService.getRaceFormatCheckPoints(raceAthlete.getRaceFormat());
        checkPoints.forEach(
            checkPoint ->
                raceQueryService.findRaceAthleteCheckPoint(raceAthlete, checkPoint)
                                .orElseGet(() -> {
                                    var raceAthleteCheckPoint = new RaceAthleteCheckPoint();
                                    raceAthleteCheckPoint.setRaceAthlete(raceAthlete);
                                    raceAthleteCheckPoint.setRaceFormatCheckPoint(checkPoint);
                                    raceAthleteCheckPoint.setPassed(false);
                                    return raceAthleteCheckPointRepository.save(raceAthleteCheckPoint);
                                }));

        return raceQueryService.getRaceAthleteCheckPoints(raceAthlete);
    }

    @Transactional
    public void startRace(Long raceId, Long raceFormatId, StateDTO dto) {
        RaceState raceState = RaceState.valueOf(dto.getState());
        RaceFormat raceFormat = raceQueryService.getRaceFormatById(raceFormatId);
        raceFormat.setState(raceState);
        raceFormat.setStartTime(dto.getStateTime());
        raceFormatRepository.save(raceFormat);

        raceAthleteCheckPointRepository.deleteAllByRaceFormatCheckPointRaceFormat(raceFormat);

        List<RaceAthlete> raceAthletes = raceAthleteRepository.findAllByRaceFormatAndTypeOrderByTypeAsc(
            raceFormat,
            RaceAthleteType.ATHLETE
        );

        raceAthletes.forEach(
            raceAthlete -> {
                RaceAthleteCheckPoint startPoint = ensureRaceAthleteStartPoint(raceAthlete);
                raceAthlete.setState(RaceAthleteState.STARTED);
                raceAthlete.setLastCheckPointOrderNumber(startPoint.getRaceFormatCheckPoint().getOrderNumber());
                raceAthlete.setLastCheckPointTime(startPoint.getTime());
                raceAthleteRepository.save(raceAthlete);
            });
    }


    @Transactional
    public void finishRace(Long raceId, Long raceFormatId, StateDTO dto) {
        RaceState raceState = RaceState.valueOf(dto.getState());
        RaceFormat raceFormat = raceQueryService.getRaceFormatById(raceFormatId);
        raceFormat.setState(raceState);
        raceFormat.setFinishTime(dto.getStateTime());
        raceFormatRepository.save(raceFormat);

        List<RaceAthlete> raceAthletes = raceAthleteRepository.findAllByRaceFormatAndTypeOrderByTypeAsc(
            raceFormat,
            RaceAthleteType.ATHLETE
        );

        raceAthletes.stream()
                    .filter(raceAthlete -> raceAthlete.getState().equals(RaceAthleteState.STARTED)).forEach(
                        raceAthlete -> {
                            raceAthlete.setState(RaceAthleteState.DID_NOT_FINISH);
                            raceAthleteRepository.save(raceAthlete);
                        });
    }

    public void setRaceAthleteState(Long raceId, Long raceFormatId, Integer athleteBibNumber, String state) {
        RaceFormat raceFormat = raceQueryService.getRaceFormatById(raceFormatId);
        RaceAthlete raceAthlete = raceQueryService.getRaceAthleteByBibNumber(raceFormat, athleteBibNumber);
        raceAthlete.setState(RaceAthleteState.valueOf(state));
        raceAthleteRepository.save(raceAthlete);
    }

}
