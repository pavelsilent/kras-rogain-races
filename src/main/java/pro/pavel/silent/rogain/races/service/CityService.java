package pro.pavel.silent.rogain.races.service;

import java.util.List;
import java.util.Optional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import pro.pavel.silent.lib.core.domain.model.ResourceName;
import pro.pavel.silent.lib.core.service.ResourceService;
import pro.pavel.silent.lib.core.util.OptionalHelper;
import pro.pavel.silent.rogain.races.data.CityRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.CityType;
import pro.pavel.silent.rogain.races.domain.enumeration.DataResourceName;
import pro.pavel.silent.rogain.races.entity.City;
import pro.pavel.silent.rogain.races.rest.dto.CityDTO;

@Service
@RequiredArgsConstructor
public class CityService implements ResourceService<City> {

    @Getter
    private final CityRepository repository;

    public List<City> getAll() {
        return repository.findAll();
    }

    public City getById(Long id) {
        return repository.findById(id)
                         .orElseThrow(() -> new RuntimeException("Not found city with id: " + id));
    }

    public City create(String name, String type) {
        return create(CityDTO.builder().name(name).type(type).build());
    }

    public City create(CityDTO dto) {
        City city = new City();
        fill(city, dto);
        return repository.save(city);
    }

    public City update(CityDTO dto) {
        City city = getById(dto.getId());
        fill(city, dto);
        return repository.save(city);
    }

    private void fill(City entity, CityDTO dto) {
        entity.setName(dto.getName());
        entity.setType(OptionalHelper.map(dto.getType(), CityType::valueOf, CityType.OTHER));
    }

    public City ensureCity(String name) {
        return Optional.ofNullable(name)
                       .map(StringUtils::trim)
                       .map(repository::findByNameIgnoreCase)
                       .map(cityOpt -> cityOpt
                           .orElseGet(() -> create(name, "")))
                       .orElse(null);
    }

    @Override
    public ResourceName getResourceName() {
        return DataResourceName.RACE_TYPE;
    }

}
