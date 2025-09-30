package pro.pavel.silent.rogain.races.rest;

import static pro.pavel.silent.lib.core.util.ListHelper.map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pro.pavel.silent.rogain.races.entity.Race;
import pro.pavel.silent.rogain.races.entity.RaceAthlete;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatAthleteGroup;
import pro.pavel.silent.rogain.races.entity.RaceFormatCheckPoint;
import pro.pavel.silent.rogain.races.rest.dto.AthleteGroupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceAthleteCheckPointDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceAthleteDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceAthleteSetupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatCheckPointDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatCheckPointSetupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatResultDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceFormatTokenDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceSetupDTO;
import pro.pavel.silent.rogain.races.rest.service.RestConverter;
import pro.pavel.silent.rogain.races.service.RaceQueryService;
import pro.pavel.silent.rogain.races.service.RaceService;

@RestController
@RequestMapping("/api/races")
@Tag(name = "RaceController", description = "API для работы с соревнованиями")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RaceController {

    private final RaceService raceService;
    private final RaceQueryService raceQueryService;
    private final RestConverter restConverter;

    @GetMapping
    @Operation(summary = "Получить список соревнований")
    @ApiResponse(responseCode = "200", description = "Список соревнований")
    public ResponseEntity<List<RaceDTO>> getAllRaces() {
        List<Race> races = raceQueryService.getRaces();
        return new ResponseEntity<>(races.stream().map(restConverter::toDTO).toList(), HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Создать новое соревнование")
    @ApiResponse(responseCode = "200", description = "Данные о новом соревновании")
    public ResponseEntity<Long> createRace(@RequestBody RaceSetupDTO dto) {
        Race race = raceService.createRace(dto);
        return new ResponseEntity<>(race.getId(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить соревнование по ID")
    public ResponseEntity<RaceDTO> getRaceById(@PathVariable Long id) {
        return new ResponseEntity<>(restConverter.toDTO(raceQueryService.getRaceById(id)), HttpStatus.OK);
    }

    @GetMapping("/{id}/formats")
    @Operation(summary = "Получить форматы")
    public ResponseEntity<List<RaceFormatDTO>> getRaceFormats(@PathVariable Long id) {
        return new ResponseEntity<>(
            map(raceQueryService.getRaceFormats(id), restConverter::toDTO),
            HttpStatus.OK
        );
    }

    @PostMapping("/{id}/formats")
    @Operation(summary = "Создать новый формат для соревнования")
    @ApiResponse(responseCode = "200", description = "Данные о новом формате")
    public ResponseEntity<Long> addRaceFormat(@PathVariable Long id, @RequestBody RaceFormatDTO dto) {
        RaceFormat raceFormat = raceService.addRaceFormat(id, dto);
        return new ResponseEntity<>(raceFormat.getId(), HttpStatus.OK);
    }

    @GetMapping("/{id}/formats/{formatId}")
    @Operation(summary = "Получить стартовый лист")
    public ResponseEntity<RaceFormatDTO> getRaceFormat(
        @PathVariable Long id,
        @PathVariable Long formatId
    ) {
        return new ResponseEntity<>(
            restConverter.toDTO(raceQueryService.getRaceFormatById(formatId)),
            HttpStatus.OK
        );
    }

    @GetMapping("/{id}/formats/{formatId}/athletes")
    @Operation(summary = "Получить стартовый лист")
    public ResponseEntity<List<RaceAthleteDTO>> getRaceFormatAthletes(
        @PathVariable Long id,
        @PathVariable Long formatId
    ) {
        return new ResponseEntity<>(
            map(raceQueryService.getRaceAthletes(formatId), restConverter::toDTO),
            HttpStatus.OK
        );
    }

    @PostMapping("/{id}/formats/{formatId}/athlete-groups")
    @Operation(summary = "Добавить группы атлетов")
    public ResponseEntity<List<Long>> addRaceFormatAthleteGroups(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @RequestBody List<AthleteGroupDTO> dto
    ) {
        List<RaceFormatAthleteGroup> groups = raceService.addRaceFormatAthleteGroups(id, formatId, dto);
        return new ResponseEntity<>(map(groups, RaceFormatAthleteGroup::getId), HttpStatus.OK);
    }

    @PostMapping("/{id}/formats/{formatId}/athletes")
    @Operation(summary = "Добавить атлета в стартовый лист")
    public ResponseEntity<Long> addRaceFormatAthlete(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @RequestBody RaceAthleteSetupDTO dto
    ) {
        RaceAthlete raceAthlete = raceService.addRaceAthlete(id, formatId, dto);
        return new ResponseEntity<>(raceAthlete.getId(), HttpStatus.OK);
    }

    @GetMapping("/{id}/formats/{formatId}/checkpoints")
    @Operation(summary = "Получить список контрольных точек")
    public ResponseEntity<List<RaceFormatCheckPointDTO>> getRaceFormatCheckPoints(
        @PathVariable Long id,
        @PathVariable Long formatId
    ) {
        return new ResponseEntity<>(
            map(raceQueryService.getRaceFormatCheckPoints(formatId), restConverter::toDTO),
            HttpStatus.OK
        );
    }

    @PostMapping("/{id}/formats/{formatId}/checkpoints")
    @Operation(summary = "Добавить контрольную точку")
    public ResponseEntity<Long> addRaceFormatCheckPoint(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @RequestBody RaceFormatCheckPointSetupDTO dto
    ) {
        RaceFormatCheckPoint raceCheckPoint = raceService.addRaceCheckPoint(id, formatId, dto);
        return new ResponseEntity<>(raceCheckPoint.getId(), HttpStatus.OK);
    }

    @GetMapping("/{id}/formats/{formatId}/result")
    @Operation(summary = "Получить результат соревнования")
    public ResponseEntity<RaceFormatResultDTO> getRaceFormatResultTable(
        @PathVariable Long id,
        @PathVariable Long formatId
    ) {
        return new ResponseEntity<>(
            restConverter.toResultDTO(raceQueryService.getRaceFormatById(formatId)),
            HttpStatus.OK
        );
    }

    @GetMapping("/{token}/token")
    @Operation(summary = "Получить данные формата соревнований по токену")
    public ResponseEntity<RaceFormatTokenDTO> getRaceFormatLink(@PathVariable String token) {
        return new ResponseEntity<>(
            restConverter.toDTO(
                raceQueryService.getRaceFormatTokenModel(token)
            ),
            HttpStatus.OK
        );
    }

    @GetMapping("/{id}/formats/{formatId}/athlete/{athleteBibNumber}/checkpoint/{checkpointId}")
    @Operation(summary = "Получить контрольную отсечку")
    public ResponseEntity<RaceAthleteCheckPointDTO> getRaceAthleteCheckPoint(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @PathVariable Integer athleteBibNumber,
        @PathVariable Long checkpointId
    ) {
        return new ResponseEntity<>(
            raceQueryService.getRaceAthleteCheckPoint(id, formatId, athleteBibNumber, checkpointId)
                            .map(restConverter::toDTO)
                            .orElseGet(() -> RaceAthleteCheckPointDTO.builder()
                                                                     .id(checkpointId)
                                                                     .athleteBibNumber(athleteBibNumber)
                                                                     .passed(false)
                                                                     .raceTime(null)
                                                                     .time(null)
                                                                     .prevCheckPointDiffDuration(null)
                                                                     .checkTimeExpired(false)
                                                                     .build()),
            HttpStatus.OK
        );
    }

    @GetMapping("/{id}/formats/{formatId}/athlete/{athleteBibNumber}/checkpoint/")
    @Operation(summary = "Получить следующую контрольную отсечку")
    public ResponseEntity<Long> getRaceAthleteNextCheckPoint(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @PathVariable Integer athleteBibNumber
    ) {
        return new ResponseEntity<>(
            raceQueryService.getRaceAthleteNextCheckPoint(id, formatId, athleteBibNumber).getId(),
            HttpStatus.OK
        );
    }

    @PutMapping("/{id}/formats/{formatId}/athlete/{athleteBibNumber}/checkpoint/{checkpointId}")
    @Operation(summary = "Добавить контрольную отсечку атлету")
    public ResponseEntity<RaceFormatResultDTO> addRaceAthleteCheckPoint(
        @PathVariable Long id,
        @PathVariable Long formatId,
        @PathVariable Integer athleteBibNumber,
        @PathVariable Long checkpointId,
        @RequestBody RaceAthleteCheckPointDTO checkPoint
    ) {
        raceService.addRaceAthleteCheckPoint(id, formatId, checkPoint);
        return new ResponseEntity<>(
            restConverter.toResultDTO(raceQueryService.getRaceFormatById(formatId)),
            HttpStatus.OK
        );
    }

    //
    //    @PostMapping
    //    @Operation(summary = "Создать новое соревнование")
    //    public RaceDTO create(@RequestBody RaceDTO dto) {
    //        return service.create(dto);
    //    }
    //
    //    @PutMapping("/{id}")
    //    @Operation(summary = "Обновить соревнование")
    //    public RaceDTO update(@PathVariable Long id, @RequestBody RaceDTO dto) {
    //        return service.update(id, dto);
    //    }
    //
    //    @DeleteMapping("/{id}")
    //    @Operation(summary = "Удалить соревнование")
    //    public void delete(@PathVariable Long id) {
    //        service.delete(id);
    //    }
}
