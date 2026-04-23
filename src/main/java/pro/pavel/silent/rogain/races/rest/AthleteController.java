package pro.pavel.silent.rogain.races.rest;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static pro.pavel.silent.lib.core.util.ListHelper.map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.AthleteTeam;
import pro.pavel.silent.rogain.races.rest.dto.AthleteDTO;
import pro.pavel.silent.rogain.races.rest.dto.AthleteGroupDTO;
import pro.pavel.silent.rogain.races.rest.dto.AthleteTeamDTO;
import pro.pavel.silent.rogain.races.rest.dto.MemberInfoDTO;
import pro.pavel.silent.rogain.races.rest.service.RestConverter;
import pro.pavel.silent.rogain.races.service.AthleteGroupService;
import pro.pavel.silent.rogain.races.service.AthleteQueryService;
import pro.pavel.silent.rogain.races.service.AthleteService;
import pro.pavel.silent.rogain.races.service.AthleteTeamService;

@RestController
@RequestMapping("/api/athletes")
@Tag(name = "AthleteController", description = "API для работы с атлетами")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AthleteController {

    private final AthleteService athleteService;
    private final AthleteTeamService athleteTeamService;
    private final AthleteQueryService athleteQueryService;
    private final AthleteGroupService athleteGroupService;
    private final RestConverter restConverter;

    @GetMapping(produces = APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить список атлетов")
    @ApiResponse(responseCode = "200", description = "Список")
    public ResponseEntity<List<AthleteDTO>> getAllAthletes() {
        List<Athlete> athletes = athleteQueryService.getAll();
        return ResponseEntity.ok(athletes.stream().map(restConverter::toDTO).toList());
    }

    @PostMapping
    @Operation(summary = "Создать нового атлета")
    @ApiResponse(responseCode = "200", description = "Данные атлета")
    public ResponseEntity<Long> createAthlete(@RequestBody AthleteDTO dto) {
        Athlete athlete = athleteService.createAthlete(dto);
        return ResponseEntity.ok(athlete.getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Редактировать атлета")
    @ApiResponse(responseCode = "200", description = "Данные атлета")
    public ResponseEntity<Long> updateAthlete(@PathVariable Long id, @RequestBody AthleteDTO dto) {
        Athlete athlete = athleteService.updateAthlete(id, dto);
        return ResponseEntity.ok(athlete.getId());
    }

    @GetMapping(path = "/{id}", produces = APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить данные атлета")
    @ApiResponse(responseCode = "200", description = "Данные атлета")
    public ResponseEntity<AthleteDTO> getAthleteById(@PathVariable Long id) {
        Athlete athlete = athleteQueryService.getById(id);
        return ResponseEntity.ok(restConverter.toDTO(athlete));
    }

    @GetMapping(path = "/athlete-groups", produces = APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить список групп атлетов")
    @ApiResponse(responseCode = "200", description = "Список")
    public ResponseEntity<List<AthleteGroupDTO>> getAllAthleteGroups() {
        return ResponseEntity.ok(map(athleteGroupService.getAll(), restConverter::toDTO));
    }

    @PostMapping("/athlete-groups")
    @Operation(summary = "Создать группу атлетов")
    @ApiResponse(responseCode = "200", description = "Данные типа")
    public ResponseEntity<Long> createAthleteGroup(@RequestBody AthleteGroupDTO dto) {
        AthleteGroup athleteGroup = athleteGroupService.create(dto);
        return ResponseEntity.ok(athleteGroup.getId());
    }

    @GetMapping(value = "/teams", produces = APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить список команд атлетов")
    @ApiResponse(responseCode = "200", description = "Список")
    public ResponseEntity<List<AthleteTeamDTO>> getAllAthleteTeams() {
        List<AthleteTeam> athletes = athleteQueryService.getAllTeams();
        return ResponseEntity.ok(athletes.stream().map(restConverter::toDTO).toList());
    }

    @PostMapping(value = "/teams", produces = APPLICATION_JSON_VALUE)
    @Operation(summary = "Создать новую команду")
    @ApiResponse(responseCode = "200", description = "Данные команды")
    public ResponseEntity<Long> createAthleteTeam(@RequestBody AthleteTeamDTO dto) {
        AthleteTeam athleteTeam = athleteTeamService.createAthleteTeam(dto);
        return ResponseEntity.ok(athleteTeam.getId());
    }

    @PutMapping("/teams/{id}")
    @Operation(summary = "Редактировать команду")
    @ApiResponse(responseCode = "200", description = "Данные команды")
    public ResponseEntity<Long> updateAthleteTeam(@PathVariable Long id, @RequestBody AthleteTeamDTO dto) {
        AthleteTeam athleteTeam = athleteTeamService.updateAthleteTeam(id, dto);
        return ResponseEntity.ok(athleteTeam.getId());
    }

    @GetMapping(path = "/teams/{id}", produces = APPLICATION_JSON_VALUE)
    @Operation(summary = "Получить данные команды")
    @ApiResponse(responseCode = "200", description = "Данные команды")
    public ResponseEntity<AthleteTeamDTO> getAthleteTeamById(@PathVariable Long id) {
        AthleteTeam athleteTeam = athleteQueryService.getTeamById(id);
        return ResponseEntity.ok(restConverter.toDTO(athleteTeam));
    }

    @PostMapping(path = "/teams/{id}", produces = APPLICATION_JSON_VALUE)
    @Operation(summary = "Добавить участника команды")
    @ApiResponse(responseCode = "200", description = "Данные участника")
    public ResponseEntity<Void> addAthleteTeamMember(@PathVariable Long id, @RequestBody MemberInfoDTO dto) {
        AthleteTeam athleteTeam = athleteQueryService.getTeamById(id);
        athleteTeamService.addAthleteTeamMember(athleteTeam, dto.getId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping(path = "/teams/{id}", produces = APPLICATION_JSON_VALUE)
    @Operation(summary = "Удалить участника команды")
    @ApiResponse(responseCode = "200", description = "Данные участника")
    public ResponseEntity<Void> deleteAthleteTeamMember(
        @PathVariable Long id,
        @RequestBody MemberInfoDTO dto
    ) {
        AthleteTeam athleteTeam = athleteQueryService.getTeamById(id);
        athleteTeamService.deleteAthleteTeamMember(athleteTeam, dto.getId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
