package pro.pavel.silent.rogain.races.rest;

import static pro.pavel.silent.lib.core.util.ListHelper.map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.rest.dto.AthleteDTO;
import pro.pavel.silent.rogain.races.rest.dto.AthleteGroupDTO;
import pro.pavel.silent.rogain.races.rest.service.RestConverter;
import pro.pavel.silent.rogain.races.service.AthleteGroupService;
import pro.pavel.silent.rogain.races.service.AthleteQueryService;
import pro.pavel.silent.rogain.races.service.AthleteService;

@RestController
@RequestMapping("/api/athletes")
@Tag(name = "AthleteController", description = "API для работы с атлетами")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AthleteController {

    private final AthleteService athleteService;
    private final AthleteQueryService athleteQueryService;
    private final AthleteGroupService athleteGroupService;
    private final RestConverter restConverter;

    @GetMapping
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

    @PutMapping
    @Operation(summary = "Сохранить атлета")
    @ApiResponse(responseCode = "200", description = "Данные атлета")
    public ResponseEntity<AthleteDTO> updateAthlete(@RequestBody AthleteDTO dto) {
        Athlete athlete = athleteService.updateAthlete(dto);
        return ResponseEntity.ok(restConverter.toDTO(athlete));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить данные атлета")
    @ApiResponse(responseCode = "200", description = "Данные атлета")
    public ResponseEntity<AthleteDTO> getAthleteById(@PathVariable Long id) {
        Athlete athlete = athleteQueryService.getById(id);
        return ResponseEntity.ok(restConverter.toDTO(athlete));
    }

    @GetMapping("/athlete-groups")
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

}
