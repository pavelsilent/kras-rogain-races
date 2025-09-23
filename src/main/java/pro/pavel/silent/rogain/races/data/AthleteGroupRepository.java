package pro.pavel.silent.rogain.races.data;

import java.util.List;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.rogain.races.entity.AthleteGroup;
import pro.pavel.silent.rogain.races.entity.Race;

public interface AthleteGroupRepository extends PagingAndSortingRepository<AthleteGroup, Long>,
                                                CrudRepository<AthleteGroup, Long>,
                                                JpaSpecificationExecutor<AthleteGroup> {

    List<AthleteGroup> findAll();
}
