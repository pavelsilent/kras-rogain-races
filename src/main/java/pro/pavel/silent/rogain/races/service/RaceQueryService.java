package pro.pavel.silent.rogain.races.service;

import static pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteType.ATHLETE;
import static pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteType.CONTROL;
import static pro.pavel.silent.rogain.races.domain.enumeration.RaceAthleteType.LEADER;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.rogain.races.data.AthleteRepository;
import pro.pavel.silent.rogain.races.data.RaceAthleteCheckPointRepository;
import pro.pavel.silent.rogain.races.data.RaceAthleteGroupRepository;
import pro.pavel.silent.rogain.races.data.RaceAthleteRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatAthleteGroupRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatCheckPointRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatRepository;
import pro.pavel.silent.rogain.races.data.RaceRepository;
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

    public RaceFormatCheckPoint getRaceFormatCheckPoint(Long id) {
        return raceFormatCheckPointRepository.findById(id)
                                             .orElseThrow(() -> new RuntimeException(
                                                 "Not found race format check point with id: " + id));
    }

    public List<RaceFormatCheckPoint> getRaceFormatCheckPoints(RaceFormat raceFormat, Integer startedOrderNumber) {
        return raceFormatCheckPointRepository.findAllByRaceFormatAndOrderNumberGreaterThanEqual(
            raceFormat,
            startedOrderNumber
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
        );
    }

    public List<RaceAthleteCheckPoint> getRaceAthleteCheckPoints(RaceAthlete raceAthlete) {
        return raceAthleteCheckPointRepository.findAllByRaceAthlete(raceAthlete);
    }

    public List<RaceAthleteGroup> getRaceAthleteGroups(RaceAthlete raceAthlete) {
        return raceAthleteGroupRepository.findAllByRaceAthlete(raceAthlete);
    }

    public Optional<RaceAthlete> findRaceCheckTime(RaceFormat raceFormat) {
        return raceAthleteRepository.findFirstByRaceFormatAndType(raceFormat, CONTROL);
    }

    public Optional<RaceAthlete> findRaceLeaderTime(RaceFormat raceFormat) {
        return raceAthleteRepository.findFirstByRaceFormatAndType(raceFormat, LEADER);
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

}
