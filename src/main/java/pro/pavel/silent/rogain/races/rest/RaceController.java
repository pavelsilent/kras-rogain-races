package pro.pavel.silent.rogain.races.rest;

import static pro.pavel.silent.lib.core.util.ListHelper.map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceState;
import pro.pavel.silent.rogain.races.entity.Race;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceAthleteCheckPoint;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatAthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceFormatCheckPoint;
import pro.pavel.silent.rogain.races.rest.dto.AthleteGroupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceAthleteCheckPointDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceAthleteCheckPointSetupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatCheckPointDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatCheckPointSetupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatResultDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatResultLinkDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatTokenDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceMemberDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceMemberSetupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceSetupDTO;
import pro.pavel.silent.rogain.races.rest.dto.StateDTO;
import pro.pavel.silent.rogain.races.rest.dto.core.StringDTO;
import pro.pavel.silent.rogain.races.rest.service.RestConverter;
import pro.pavel.silent.rogain.races.service.RaceQueryService;
import pro.pavel.silent.rogain.races.service.RaceService;

@Transactional
@RestController
@RequestMapping("/api/races")
@Tag(name = "RaceController", description = "API для работы с соревнованиями")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RaceController {

    private final RaceService raceService;
    private final RaceQueryService raceQueryService;
    private final RestConverter restConverter;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить список соревнований")
    @ApiResponse(responseCode = "200", description = "Список соревнований")
    public ResponseEntity<List<RaceDTO>> getAllRaces() {
        List<Race> races = raceQueryService.getRaces();
        return ResponseEntity.ok(races.stream().map(restConverter::toDTO).toList());
    }

    @PostMapping
    @Operation(summary = "Создать новое соревнование")
    @ApiResponse(responseCode = "200", description = "Данные о новом соревновании")
    public ResponseEntity<Long> createRace(@RequestBody RaceSetupDTO dto) {
        Race race = raceService.createRace(dto);
        return ResponseEntity.ok(race.getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Редактировать соревнование")
    @ApiResponse(responseCode = "200", description = "Данные о соревновании")
    public ResponseEntity<Long> editRace(@PathVariable Long id, @RequestBody RaceSetupDTO dto) {
        Race race = raceService.updateRace(id, dto);
        return ResponseEntity.ok(race.getId());
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить соревнование по ID")
    public ResponseEntity<RaceDTO> getRaceById(@PathVariable Long id) {
        return ResponseEntity.ok(restConverter.toDTO(raceQueryService.getRaceById(id)));
    }

    @GetMapping(path = "/{id}/formats", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить форматы")
    public ResponseEntity<List<RaceFormatDTO>> getRaceFormats(@PathVariable Long id) {
        return ResponseEntity.ok(map(raceQueryService.getRaceFormats(id), restConverter::toDTO));
    }

    @PostMapping("/{id}/formats")
    @Operation(summary = "Создать новый формат для соревнования")
    @ApiResponse(responseCode = "200", description = "Данные о новом формате")
    public ResponseEntity<Long> addRaceFormat(@PathVariable Long id, @RequestBody RaceFormatDTO dto) {
        RaceFormat raceFormat = raceService.addRaceFormat(id, dto);
        return ResponseEntity.ok(raceFormat.getId());
    }

    @PutMapping("/{id}/formats/{formatId}")
    @Operation(summary = "Редактировать формат для соревнования")
    @ApiResponse(responseCode = "200", description = "Данные о формате")
    public ResponseEntity<Long> editRaceFormat(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @RequestBody RaceFormatDTO dto
    ) {
        RaceFormat raceFormat = raceService.editRaceFormat(id, formatId, dto);
        return ResponseEntity.ok(raceFormat.getId());
    }

    @GetMapping(path = "/{id}/formats/{formatId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить данные о формате")
    public ResponseEntity<RaceFormatDTO> getRaceFormat(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @RequestParam(required = false, defaultValue = "true") Boolean fullData
    ) {
        RaceFormatDTO dto = restConverter.toDTO(raceQueryService.getRaceFormatById(formatId));
        if (!fullData) {
            dto.setViewToken(null);
            dto.setEditToken(null);
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping(path = "/{id}/formats/{formatId}/athletes", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить стартовый лист")
    public ResponseEntity<List<RaceMemberDTO>> getRaceFormatAthletes(
        @PathVariable Long id,
        @PathVariable Long formatId
    ) {
        return ResponseEntity.ok(map(raceQueryService.getRaceAthletes(formatId), restConverter::toDTO));
    }

    @PostMapping("/{id}/formats/{formatId}/athlete-groups")
    @Operation(summary = "Добавить группы атлетов")
    public ResponseEntity<List<Long>> addRaceFormatAthleteGroups(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @RequestBody List<AthleteGroupDTO> dto
    ) {
        List<RaceFormatAthleteGroup> groups = raceService.addRaceFormatAthleteGroups(id, formatId, dto);
        return ResponseEntity.ok(map(groups, RaceFormatAthleteGroup::getId));
    }

    @PostMapping("/{id}/formats/{formatId}/athletes")
    @Operation(summary = "Добавить атлета в стартовый лист")
    public ResponseEntity<Long> addRaceFormatAthlete(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @RequestBody RaceMemberSetupDTO dto
    ) {
        RaceAthlete raceAthlete = raceService.addRaceAthlete(id, formatId, dto);
        return ResponseEntity.ok(raceAthlete.getId());
    }

    @PutMapping("/{id}/formats/{formatId}/athletes")
    @Operation(summary = "Редактировать атлета в стартовом листе")
    public ResponseEntity<Long> editRaceFormatAthlete(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @RequestBody RaceMemberSetupDTO dto
    ) {
        RaceAthlete raceAthlete = raceService.editRaceAthlete(id, formatId, dto);
        return ResponseEntity.ok(raceAthlete.getId());
    }

    @DeleteMapping("/{id}/formats/{formatId}/athlete/{athleteBibNumber}")
    @Operation(summary = "Удалить атлета из стартового листа")
    public ResponseEntity<Void> deleteRaceFormatAthlete(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @PathVariable Integer athleteBibNumber
    ) {
        raceService.deleteRaceAthlete(id, formatId, athleteBibNumber);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/formats/{formatId}/checkpoints", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить список контрольных точек")
    public ResponseEntity<List<RaceFormatCheckPointDTO>> getRaceFormatCheckPoints(
        @PathVariable Long id,
        @PathVariable Long formatId
    ) {
        return ResponseEntity.ok(map(raceQueryService.getRaceFormatCheckPoints(formatId), restConverter::toDTO));
    }

    @PostMapping("/{id}/formats/{formatId}/checkpoints")
    @Operation(summary = "Добавить контрольную точку")
    public ResponseEntity<Long> addRaceFormatCheckPoint(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @RequestBody RaceFormatCheckPointSetupDTO dto
    ) {
        RaceFormatCheckPoint raceCheckPoint = raceService.addRaceCheckPoint(id, formatId, dto);
        return ResponseEntity.ok(raceCheckPoint.getId());
    }

    @PostMapping("/{id}/formats/{formatId}/checkpoints/{checkPointId}")
    @Operation(summary = "Добавить контрольную точку")
    public ResponseEntity<Long> editRaceFormatCheckPoint(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @PathVariable Long checkPointId,
        @RequestBody RaceFormatCheckPointSetupDTO dto
    ) {
        RaceFormatCheckPoint raceCheckPoint = raceService.editRaceCheckPoint(id, formatId, checkPointId, dto);
        return ResponseEntity.ok(raceCheckPoint.getId());
    }

    @GetMapping(path = "/results", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить результаты соревнования")
    public ResponseEntity<List<RaceFormatResultLinkDTO>> getActiveRaceFormatResults() {
        return ResponseEntity.ok(map(raceQueryService.getActiveRaceFormats(), restConverter::toLinkDTO));
    }

    @GetMapping(path = "/{id}/formats/{formatId}/result", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить результат соревнования")
    public ResponseEntity<RaceFormatResultDTO> getRaceFormatResultTable(
        @PathVariable Long id,
        @PathVariable Long formatId
    ) {
        RaceFormatResultDTO resultDTO = restConverter.toResultDTO(raceQueryService.getRaceFormatById(formatId));
        return ResponseEntity.ok(resultDTO);
    }

    @GetMapping(path = "/{token}/token", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить данные формата соревнований по токену")
    public ResponseEntity<RaceFormatTokenDTO> getRaceFormatLink(@PathVariable String token) {
        return ResponseEntity.ok(
            restConverter.toDTO(
                raceQueryService.getRaceFormatTokenModel(token)));
    }

    @PutMapping(path = "/{id}/formats/{formatId}/state", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Установить статус соревнованию")
    public ResponseEntity<RaceFormatResultDTO> setRaceState(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @RequestBody StateDTO dto
    ) {
        if (RaceState.STARTED.name().equals(dto.getState())) {
            raceService.startRace(id, formatId, dto);
        } else if (RaceState.FINISHED.name().equals(dto.getState())) {
            raceService.finishRace(id, formatId, dto);
        }
        return ResponseEntity.ok(
            restConverter.toResultDTO(raceQueryService.getRaceFormatById(formatId)));
    }

    @GetMapping(path = "/{id}/formats/{formatId}/athlete/{athleteBibNumber}/state/", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить статус атлета")
    public ResponseEntity<StringDTO> getRaceAthleteState(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @PathVariable Integer athleteBibNumber
    ) {
        return ResponseEntity.ok(
            StringDTO.of(raceQueryService.getRaceAthleteState(id, formatId, athleteBibNumber).name()));
    }

    @PutMapping(path = "/{id}/formats/{formatId}/athlete/{athleteBibNumber}/state/", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Установить статус атлету")
    public ResponseEntity<RaceFormatResultDTO> setRaceAthleteState(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @PathVariable Integer athleteBibNumber,
        @RequestBody StringDTO state
    ) {
        raceService.setRaceAthleteState(id, formatId, athleteBibNumber, state.getValue());
        return ResponseEntity.ok(
            restConverter.toResultDTO(raceQueryService.getRaceFormatById(formatId)));
    }

    @GetMapping(path = "/{id}/formats/{formatId}/athlete/{athleteBibNumber}/checkpoint/{checkpointId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить контрольную отсечку")
    public ResponseEntity<RaceAthleteCheckPointSetupDTO> getRaceAthleteCheckPoint(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @PathVariable Integer athleteBibNumber,
        @PathVariable Long checkpointId
    ) {
        RaceFormatCheckPoint checkPoint = raceQueryService.getRaceFormatCheckPoint(checkpointId);
        RaceAthlete raceAthlete = raceQueryService.getRaceAthleteByBibNumber(
            checkPoint.getRaceFormat(),
            athleteBibNumber
        );

        RaceAthleteCheckPointDTO raceAthleteCheckPointDTO =
            raceQueryService.findRaceAthleteCheckPoint(raceAthlete, checkPoint)
                            .map(restConverter::toDTO)
                            .orElseGet(() -> RaceAthleteCheckPointDTO
                                .builder()
                                .id(checkpointId)
                                .passed(false)
                                .raceTime(null)
                                .raceDuration(null)
                                .time(null)
                                .prevCheckPointDiffDuration(null)
                                .checkTimeExpired(false)
                                .members(Collections.emptyList())
                                .build());

        Optional<RaceAthleteCheckPoint> prevCheckPoint =
            raceQueryService.findPrevCheckPoint(raceAthlete, checkPoint);
        Optional<RaceAthleteCheckPoint> nextCheckPoint =
            raceQueryService.findNextCheckPoint(raceAthlete, checkPoint);

        return ResponseEntity.ok(
            RaceAthleteCheckPointSetupDTO
                .builder()
                .data(raceAthleteCheckPointDTO)
                .prevPointTime(prevCheckPoint.map(RaceAthleteCheckPoint::getTime)
                                             .orElseGet(() -> checkPoint.getRaceFormat().getStartTime()))
                .nextPointTime(nextCheckPoint.map(RaceAthleteCheckPoint::getTime)
                                             .orElseGet(() -> checkPoint.getRaceFormat().getFinishTime()))
                .members(
                    raceQueryService.getAthletes(raceAthlete)
                                    .stream()
                                    .map(athlete -> restConverter.toMemberDTO(athlete, false))
                                    .toList())
                .build())
            ;
    }

    @GetMapping(value = "/{id}/formats/{formatId}/athlete/{athleteBibNumber}/checkpoint/next", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить следующую контрольную отсечку")
    public ResponseEntity<Long> getRaceAthleteNextCheckPoint(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @PathVariable Integer athleteBibNumber
    ) {
        return ResponseEntity.ok(
            raceQueryService.getRaceAthleteNextCheckPoint(id, formatId, athleteBibNumber).getId());
    }

    @PutMapping(path = "/{id}/formats/{formatId}/athlete/{athleteBibNumber}/checkpoint", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Добавить контрольную отсечку атлету")
    public ResponseEntity<RaceFormatResultDTO> addRaceAthleteCheckPoint(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @PathVariable Integer athleteBibNumber,
        @RequestBody RaceAthleteCheckPointDTO checkPoint
    ) {
        raceService.addRaceAthleteCheckPoint(id, formatId, athleteBibNumber, checkPoint);
        return ResponseEntity.ok(
            restConverter.toResultDTO(raceQueryService.getRaceFormatById(formatId)));
    }

}
