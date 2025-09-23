package pro.pavel.silent.rogain.races.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.rogain.races.data.AthleteRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.Sex;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.rest.dto.AthleteDTO;

@Service
@RequiredArgsConstructor
public class AthleteService {

    private final AthleteRepository athleteRepository;
    private final AthleteQueryService athleteQueryService;
    private final CityService cityService;
    private final ClubService clubService;

    public Athlete createAthlete(AthleteDTO dto) {
        Athlete athlete = new Athlete();
        fillAthlete(athlete, dto);
        return athleteRepository.save(athlete);
    }

    public Athlete updateAthlete(AthleteDTO dto) {
        Athlete athlete = athleteQueryService.getById(dto.getId());
        fillAthlete(athlete, dto);
        return athleteRepository.save(athlete);
    }

    private Athlete fillAthlete(Athlete athlete, AthleteDTO dto) {
        athlete.setFirstName(dto.getFirstName());
        athlete.setLastName(dto.getLastName());
        athlete.setMiddleName(dto.getMiddleName());
        athlete.setBirthDate(dto.getBirthDate());
        athlete.setSex(Sex.valueOf(dto.getSex()));
        athlete.setCity(cityService.ensureCity(dto.getCity()));
        athlete.setClub(clubService.ensureClub(dto.getClub()));
        return athleteRepository.save(athlete);
    }

}
