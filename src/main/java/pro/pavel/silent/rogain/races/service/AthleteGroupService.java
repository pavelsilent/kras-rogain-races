package pro.pavel.silent.rogain.races.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.rogain.races.data.AthleteGroupRepository;
import pro.pavel.silent.rogain.races.data.AthleteRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.Sex;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.City;
import pro.pavel.silent.rogain.races.entity.RaceType;
import pro.pavel.silent.rogain.races.rest.dto.AthleteDTO;
import pro.pavel.silent.rogain.races.rest.dto.AthleteGroupDTO;
import pro.pavel.silent.rogain.races.rest.dto.RaceTypeDTO;

@Service
@RequiredArgsConstructor
public class AthleteGroupService {

    private final AthleteGroupRepository repository;

    public List<AthleteGroup> getAll() {
        return repository.findAll();
    }

    public AthleteGroup getById(Long id) {
        return repository.findById(id)
                         .orElseThrow(() -> new RuntimeException("Not found athlete group with id: " + id));
    }

    public AthleteGroup create(AthleteGroupDTO dto) {
        AthleteGroup athleteGroup = new AthleteGroup();
        fill(athleteGroup, dto);
        return repository.save(athleteGroup);
    }

    public AthleteGroup update(AthleteGroupDTO dto) {
        AthleteGroup athleteGroup = getById(dto.getId());
        fill(athleteGroup, dto);
        return repository.save(athleteGroup);
    }

    private void fill(AthleteGroup entity, AthleteGroupDTO dto) {
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
    }

}
