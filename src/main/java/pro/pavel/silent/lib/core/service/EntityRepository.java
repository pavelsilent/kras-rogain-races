package pro.pavel.silent.lib.core.service;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;

@NoRepositoryBean
public interface EntityRepository<T, TId> extends PagingAndSortingRepository<T, TId>,
                                             CrudRepository<T, TId>,
                                             JpaSpecificationExecutor<T> {

    Optional<T> findById(TId id);

}
