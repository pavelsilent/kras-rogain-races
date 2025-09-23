package pro.pavel.silent.rogain.races.data;

import java.util.List;
import java.util.Optional;
import pro.pavel.silent.lib.core.service.ResourceRepository;
import pro.pavel.silent.rogain.races.entity.City;

public interface CityRepository extends ResourceRepository<City> {

    Optional<City> findByNameIgnoreCase(String name);

    List<City> findAll();

}
