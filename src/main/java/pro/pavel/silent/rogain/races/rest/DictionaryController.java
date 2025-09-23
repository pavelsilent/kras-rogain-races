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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pro.pavel.silent.rogain.races.entity.City;
import pro.pavel.silent.rogain.races.entity.RaceType;
import pro.pavel.silent.rogain.races.rest.dto.CityDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceTypeDTO;
import pro.pavel.silent.rogain.races.rest.service.RestConverter;
import pro.pavel.silent.rogain.races.service.CityService;
import pro.pavel.silent.rogain.races.service.RaceTypeService;

@RestController
@RequestMapping("/api/dictionaries")
@Tag(name = "DictionaryController", description = "API для работы со справочниками")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DictionaryController {

    private final RaceTypeService raceTypeService;
    private final CityService cityService;
    private final RestConverter restConverter;

    @GetMapping("/race-types")
    @Operation(summary = "Получить список типов соревнований")
    @ApiResponse(responseCode = "200", description = "Список")
    public ResponseEntity<List<RaceTypeDTO>> getAllRaceTypes() {
        return new ResponseEntity<>(map(raceTypeService.getAll(), restConverter::toDTO), HttpStatus.OK);
    }

    @PostMapping("/race-types")
    @Operation(summary = "Создать тип соревнований")
    @ApiResponse(responseCode = "200", description = "Данные типа")
    public ResponseEntity<Long> createRaceType(@RequestBody RaceTypeDTO dto) {
        RaceType raceType = raceTypeService.create(dto);
        return new ResponseEntity<>(raceType.getId(), HttpStatus.OK);
    }

    @GetMapping("/cities")
    @Operation(summary = "Получить список мест проведения соревнований")
    @ApiResponse(responseCode = "200", description = "Список")
    public ResponseEntity<List<CityDTO>> getAllCities() {
        return new ResponseEntity<>(map(cityService.getAll(), restConverter::toDTO), HttpStatus.OK);
    }

    @PostMapping("/cities")
    @Operation(summary = "Создать место проведения")
    @ApiResponse(responseCode = "200", description = "Данные места")
    public ResponseEntity<Long> createCity(@RequestBody CityDTO dto) {
        City city = cityService.create(dto);
        return new ResponseEntity<>(city.getId(), HttpStatus.OK);
    }



}
