package pro.pavel.silent.rogain.races.service;

import static pro.pavel.silent.lib.core.util.FunctionHelper.firstArgSupplier;
import static pro.pavel.silent.lib.core.util.StringHelper.hasLength;
import static pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteType.ATHLETE;
import static pro.pavel.silent.rogain.races.domain.enumeration.RaceFormatTokenType.EDIT;
import static pro.pavel.silent.rogain.races.domain.enumeration.RaceFormatTokenType.VIEW;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.lib.core.util.ThreeMap;
import pro.pavel.silent.rogain.races.data.AthleteRepository;
import pro.pavel.silent.rogain.races.data.RaceAthleteCheckPointRepository;
import pro.pavel.silent.rogain.races.data.RaceAthleteGroupRepository;
import pro.pavel.silent.rogain.races.data.RaceAthleteRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatAthleteGroupRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatCheckPointRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatRepository;
import pro.pavel.silent.rogain.races.data.RaceRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteState;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceState;
import pro.pavel.silent.rogain.races.domain.model.RaceFormatTokenModel;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.Race;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceAthleteCheckPoint;
import pro.pavel.silent.rogain.races.entity.RaceAthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatAthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceFormatCheckPoint;

@Service
@RequiredArgsConstructor
public class RaceQueryService {

    private final RaceRepository raceRepository;
    private final RaceFormatRepository raceFormatRepository;
    private final RaceFormatAthleteGroupRepository raceFormatAthleteGroupRepository;
    private final RaceFormatCheckPointRepository raceFormatCheckPointRepository;
    private final RaceAthleteRepository raceAthleteRepository;
    private final RaceAthleteGroupRepository raceAthleteGroupRepository;
    private final RaceAthleteCheckPointRepository raceAthleteCheckPointRepository;
    private final AthleteRepository athleteRepository;

    public List<Race> getRaces() {
        return raceRepository.findAll();
    }

    public Race getRaceById(Long id) {
        return raceRepository.findById(id)
                             .orElseThrow(() -> new RuntimeException("Not found race with id: " + id));
    }

    public RaceFormat getRaceFormatById(Long id) {
        return raceFormatRepository.findById(id)
                                   .orElseThrow(() -> new RuntimeException("Not found race format with id: " + id));
    }

    public List<RaceFormat> getActiveRaceFormats() {
        return raceFormatRepository.findAllByStateNotInOrderByRaceDateAscRaceIdAsc(
            List.of(RaceState.DRAFT, RaceState.CANCELED, RaceState.PLANNED));
    }

    public List<RaceFormat> getRaceFormats(Long id) {
        return raceFormatRepository.findAllByRaceId(id);
    }

    public RaceAthlete getRaceAthleteByBibNumber(RaceFormat raceFormat, Integer bibNumber) {
        return findRaceAthleteByBibNumber(raceFormat, bibNumber)
            .orElseThrow(() -> new RuntimeException("Not found race athlete by bib number: " + bibNumber));
    }


    public Optional<RaceAthlete> findRaceAthlete(RaceFormat raceFormat, Athlete athlete) {
        return raceAthleteRepository.findFirstByRaceFormatAndAthlete(raceFormat, athlete);
    }

    public Optional<RaceAthlete> findRaceAthleteByBibNumber(RaceFormat raceFormat, Integer bibNumber) {
        return raceAthleteRepository.findFirstByRaceFormatAndBibNumber(raceFormat, bibNumber);
    }

    public RaceAthlete getRaceAthlete(RaceFormat raceFormat, Athlete athlete) {
        return raceAthleteRepository.findFirstByRaceFormatAndAthlete(raceFormat, athlete)
                                    .orElseThrow(() -> new RuntimeException(
                                        "Not found race athlete with id: " + athlete.getId()));
    }

    public Optional<RaceFormatCheckPoint> findRaceFormatCheckPoint(Long id) {
        return raceFormatCheckPointRepository.findById(id);
    }

    public RaceFormatCheckPoint getRaceFormatCheckPoint(Long id) {
        return findRaceFormatCheckPoint(id)
            .orElseThrow(() -> new RuntimeException("Not found race format check point with id: " + id));
    }

    public RaceFormatCheckPoint getRaceFormatCheckPoint(RaceFormat raceFormat, Integer orderNumber) {
        return raceFormatCheckPointRepository.findFirstByRaceFormatAndOrderNumber(raceFormat, orderNumber)
                                             .orElseThrow(() -> new RuntimeException(
                                                 "Not found race format check point with number: " + orderNumber));
    }

    public List<RaceFormatCheckPoint> getRaceFormatCheckPoints(RaceFormat raceFormat, Integer startedOrderNumber) {
        return raceFormatCheckPointRepository.findAllByRaceFormatAndOrderNumberGreaterThanEqual(
            raceFormat,
            startedOrderNumber
        );
    }

    public List<RaceFormatCheckPoint> getRaceFormatCheckPoints(
        RaceFormat raceFormat,
        Integer startedOrderNumber,
        Integer finishedOrderNumber
    ) {
        return raceFormatCheckPointRepository.findAllByRaceFormatAndOrderNumberGreaterThanEqualAndOrderNumberLessThanEqual(
            raceFormat,
            startedOrderNumber,
            finishedOrderNumber
        );
    }

    public RaceFormatCheckPoint getRaceFormatStartCheckPoint(RaceFormat raceFormat) {
        return raceFormatCheckPointRepository
            .findFirstByRaceFormatAndIsStartTrue(raceFormat)
            .orElseThrow(() -> new RuntimeException(
                "Not found start check point of race format with id: " + raceFormat.getId()));
    }

    public RaceFormatCheckPoint getRaceFormatFinishCheckPoint(RaceFormat raceFormat) {
        return raceFormatCheckPointRepository
            .findFirstByRaceFormatAndIsFinishTrue(raceFormat)
            .orElseThrow(() -> new RuntimeException(
                "Not found finish check point of race format with id: " + raceFormat.getId()));
    }

    public List<RaceFormatAthleteGroup> getRaceFormatAthleteGroups(RaceFormat raceFormat) {
        return raceFormatAthleteGroupRepository.findAllByRaceFormat(raceFormat);
    }

    public Optional<RaceFormatAthleteGroup> findRaceFormatAthleteGroup(
        RaceFormat raceFormat,
        AthleteGroup athleteGroup
    ) {
        return raceFormatAthleteGroupRepository.findFirstByRaceFormatAndAthleteGroup(raceFormat, athleteGroup);
    }

    public List<RaceFormatCheckPoint> getRaceFormatCheckPoints(Long raceFormatId) {
        return getRaceFormatCheckPoints(getRaceFormatById(raceFormatId));
    }

    public List<RaceFormatCheckPoint> getRaceFormatCheckPoints(RaceFormat raceFormat) {
        return raceFormatCheckPointRepository.findAllByRaceFormatOrderByOrderNumberAsc(raceFormat);
    }

    public List<RaceAthlete> getRaceAthletes(Long raceFormatId) {
        return getRaceAthletes(getRaceFormatById(raceFormatId));
    }

    public List<RaceAthlete> getRaceAthletes(RaceFormat raceFormat) {
        return raceAthleteRepository.findAllByRaceFormatAndTypeOrderByLastCheckPointOrderNumberDescLastCheckPointTimeAscBibNumberAsc(
                                        raceFormat,
                                        ATHLETE
                                    ).stream()
                                    .sorted(Comparator.comparing(order -> order.getState().getOrder()))
                                    .toList();
    }

    public ThreeMap<Long, AthleteGroup, Integer> resolveAthleteGroupsPlaceMap(
        List<RaceAthlete> raceAthletes,
        List<AthleteGroup> athleteGroups
    ) {
        return athleteGroups.stream()
                            .map(athleteGroup -> resolveAthleteGroupPlaceMap(raceAthletes, athleteGroup))
                            .reduce(new ThreeMap<>(), ThreeMap::add, firstArgSupplier());
    }

    public ThreeMap<Long, AthleteGroup, Integer> resolveAthleteGroupPlaceMap(
        List<RaceAthlete> raceAthletes,
        AthleteGroup athleteGroup
    ) {
        List<RaceAthlete> places = new ArrayList<>();
        for (int i = 0; i < raceAthletes.size(); i++) {
            RaceAthlete raceAthlete = raceAthletes.get(i);
            if (!raceAthlete.getState().isHasPlace()) {
                continue;
            }
            if (findRaceAthleteGroup(raceAthlete, athleteGroup).isPresent()) {
                places.add(raceAthlete);
            }
        }

        ThreeMap<Long, AthleteGroup, Integer> placeMap = new ThreeMap<>();
        for (int i = 0; i < places.size(); i++) {
            RaceAthlete raceAthlete = places.get(i);
            placeMap.add(raceAthlete.getId(), athleteGroup, i + 1);
        }
        return placeMap;
    }

    public List<RaceAthleteCheckPoint> getRaceAthleteCheckPoints(RaceAthlete raceAthlete) {
        return raceAthleteCheckPointRepository.findAllByRaceAthlete(raceAthlete);
    }

    public List<RaceAthleteGroup> getRaceAthleteGroups(RaceAthlete raceAthlete) {
        return raceAthleteGroupRepository.findAllByRaceAthlete(raceAthlete);
    }

    public Optional<RaceAthleteGroup> findRaceAthleteGroup(RaceAthlete raceAthlete, AthleteGroup athleteGroup) {
        return raceAthleteGroupRepository.findFirstByRaceAthleteAndAthleteGroup(raceAthlete, athleteGroup);
    }

    public Optional<RaceAthleteCheckPoint> findRaceAthleteCheckPoint(
        RaceAthlete raceAthlete,
        RaceFormatCheckPoint checkPoint
    ) {
        return raceAthleteCheckPointRepository.findFirstByRaceAthleteAndRaceFormatCheckPoint(raceAthlete, checkPoint);
    }

    public Optional<RaceAthleteCheckPoint> findLastPassedCheckPoint(RaceAthlete raceAthlete) {
        return raceAthleteCheckPointRepository.findAllByRaceAthlete(raceAthlete)
                                              .stream()
                                              .filter(RaceAthleteCheckPoint::isPassed)
                                              .max(Comparator.comparing(o -> o.getRaceFormatCheckPoint()
                                                                              .getOrderNumber()));
    }

    public Optional<RaceFormatCheckPoint> findPrevCheckPoint(RaceFormatCheckPoint checkPoint) {
        return raceFormatCheckPointRepository.findFirstByRaceFormatAndOrderNumberLessThanAndLeaderDurationNotNullOrderByOrderNumberDesc(
            checkPoint.getRaceFormat(),
            checkPoint.getOrderNumber()
        );
    }

    public Optional<RaceAthleteCheckPoint> findPrevCheckPoint(RaceAthleteCheckPoint checkPoint) {
        return findPrevCheckPoint(
            checkPoint.getRaceAthlete(),
            checkPoint.getRaceFormatCheckPoint()
        );
    }

    public Optional<RaceAthleteCheckPoint> findPrevCheckPoint(
        RaceAthlete raceAthlete,
        RaceFormatCheckPoint checkPoint
    ) {
        return raceAthleteCheckPointRepository.findFirstByRaceAthleteAndRaceFormatCheckPointOrderNumberLessThanAndTimeNotNullOrderByRaceFormatCheckPointOrderNumberDesc(
            raceAthlete,
            checkPoint.getOrderNumber()
        );
    }

    public Optional<RaceAthleteCheckPoint> findNextCheckPoint(RaceAthleteCheckPoint checkPoint) {
        return findNextCheckPoint(checkPoint.getRaceAthlete(), checkPoint.getRaceFormatCheckPoint());
    }

    public Optional<RaceAthleteCheckPoint> findNextCheckPoint(
        RaceAthlete raceAthlete,
        RaceFormatCheckPoint checkPoint
    ) {
        return raceAthleteCheckPointRepository.findFirstByRaceAthleteAndRaceFormatCheckPointOrderNumberGreaterThanAndTimeNotNullOrderByRaceFormatCheckPointOrderNumberAsc(
            raceAthlete,
            checkPoint.getOrderNumber()
        );
    }

    public RaceFormatTokenModel getRaceFormatTokenModel(String link) {
        RaceFormat raceFormat = raceFormatRepository
            .findFirstByViewTokenOrEditToken(link, link)
            .orElseThrow(() -> new RuntimeException("Not found race format by link:" + link));

        RaceFormatTokenModel model = new RaceFormatTokenModel();
        model.setRaceId(raceFormat.getRace().getId());
        model.setRaceFormatId(raceFormat.getId());
        model.setToken(link);
        model.setTokenType(
            hasLength(raceFormat.getViewToken()) && link.equals(raceFormat.getViewToken()) ? VIEW :
            hasLength(raceFormat.getEditToken()) && link.equals(raceFormat.getEditToken()) ? EDIT : null);
        return model;
    }

    public Optional<RaceAthleteCheckPoint> findRaceAthleteCheckPoint(
        Long raceId,
        Long raceFormatId,
        Integer bibNumber,
        Long checkPointId
    ) {
        RaceFormat raceFormat = getRaceFormatById(raceFormatId);
        RaceAthlete raceAthlete = getRaceAthleteByBibNumber(raceFormat, bibNumber);
        RaceFormatCheckPoint raceFormatCheckPoint = getRaceFormatCheckPoint(checkPointId);

        return findRaceAthleteCheckPoint(raceAthlete, raceFormatCheckPoint);
    }

    public RaceFormatCheckPoint getRaceAthleteNextCheckPoint(
        Long raceId,
        Long raceFormatId,
        Integer bibNumber
    ) {
        RaceFormat raceFormat = getRaceFormatById(raceFormatId);
        RaceAthlete raceAthlete = getRaceAthleteByBibNumber(raceFormat, bibNumber);
        Integer lastCheckPointOrderNumber = raceAthlete.getLastCheckPointOrderNumber();
        Integer nextCheckPointOrderNumber = lastCheckPointOrderNumber + 1;

        if (lastCheckPointOrderNumber > 0) {
            RaceFormatCheckPoint lastCheckPoint = getRaceFormatCheckPoint(
                raceFormat,
                raceAthlete.getLastCheckPointOrderNumber()
            );
            if (lastCheckPoint.getIsFinish()) {
                return lastCheckPoint;
            }
        }

        return getRaceFormatCheckPoint(raceFormat, nextCheckPointOrderNumber);
    }

    public RaceAthleteState getRaceAthleteState(
        Long raceId,
        Long raceFormatId,
        Integer bibNumber
    ) {
        RaceFormat raceFormat = getRaceFormatById(raceFormatId);
        RaceAthlete raceAthlete = getRaceAthleteByBibNumber(raceFormat, bibNumber);
        return raceAthlete.getState();
    }

}
