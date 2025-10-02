package pro.pavel.silent.rogain.races.service;

import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.rogain.races.data.RaceTypeRepository;
import pro.pavel.silent.rogain.races.entity.RaceType;
import pro.pavel.silent.rogain.races.rest.dto.RaceTypeDTO;

@Getter
@Service
@RequiredArgsConstructor
public class RaceTypeService {

    private final RaceTypeRepository repository;

    public List<RaceType> getAll() {
        return repository.findAll();
    }

    public RaceType getById(Long id) {
        return repository.findById(id)
                         .orElseThrow(() -> new RuntimeException("Not found race type with id: " + id));
    }

    public RaceType create(RaceTypeDTO dto) {
        RaceType raceType = new RaceType();
        fill(raceType, dto);
        return repository.save(raceType);
    }

    public RaceType update(RaceTypeDTO dto) {
        RaceType raceType = getById(dto.getId());
        fill(raceType, dto);
        return repository.save(raceType);
    }

    private void fill(RaceType entity, RaceTypeDTO dto) {
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
    }

}
