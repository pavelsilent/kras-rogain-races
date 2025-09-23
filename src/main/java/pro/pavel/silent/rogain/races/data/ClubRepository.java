package pro.pavel.silent.rogain.races.data;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.rogain.races.entity.Club;

public interface ClubRepository extends PagingAndSortingRepository<Club, Long>,
                                        CrudRepository<Club, Long>,
                                        JpaSpecificationExecutor<Club> {

    Optional<Club> findByNameIgnoreCase(String name);

}
