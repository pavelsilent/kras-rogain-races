package pro.pavel.silent.rogain.races.data;

import java.util.List;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.rogain.races.entity.Athlete;

public interface AthleteRepository extends PagingAndSortingRepository<Athlete, Long>,
                                           CrudRepository<Athlete, Long>,
                                           JpaSpecificationExecutor<Athlete> {

    List<Athlete> findAll();

}
