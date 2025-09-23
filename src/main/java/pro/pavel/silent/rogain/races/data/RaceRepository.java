package pro.pavel.silent.rogain.races.data;

import java.util.List;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.rogain.races.entity.Race;

public interface RaceRepository extends PagingAndSortingRepository<Race, Long>,
                                        CrudRepository<Race, Long>,
                                        JpaSpecificationExecutor<Race> {

    Race getById(long id);

    List<Race> findAll();

}
