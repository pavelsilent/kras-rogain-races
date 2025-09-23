package pro.pavel.silent.lib.core.service;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;
import pro.pavel.silent.lib.core.domain.model.Resourced;

@NoRepositoryBean
public interface ResourceRepository<T extends Resourced> extends PagingAndSortingRepository<T, Long>,
                                                                 CrudRepository<T, Long>,
                                                                 JpaSpecificationExecutor<T> {

    Optional<T> findById(Long id);

}
