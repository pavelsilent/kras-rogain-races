package pro.pavel.silent.lib.core.service;

import pro.pavel.silent.lib.core.domain.model.Resource;
import pro.pavel.silent.lib.core.domain.model.ResourceName;
import pro.pavel.silent.lib.core.domain.model.Resourced;
import pro.pavel.silent.lib.core.domain.model.ResourcedData;
import pro.pavel.silent.lib.core.util.OptionalHelper;

public interface ResourceService<T extends Resourced> {

    ResourceRepository<T> getRepository();

    ResourceName getResourceName();

    default String getResourceNameCode() {
        return getResourceName().getCode();
    }

    default boolean supports(Resource resource) {
        return supports(resource.getResourceName());
    }

    default boolean supports(ResourceName resourceName) {
        return supports(resourceName.getCode());
    }

    default boolean supports(String resourceNameCode) {
        return getResourceNameCode().equals(resourceNameCode);
    }

    default T build(ResourcedData data) {
        return OptionalHelper.map(data, resource -> build(resource.getId()));
    }

    default T build(String id) {
        if (id == null || id.isEmpty()) {
            return null;
        }
        return build(Long.valueOf(id));
    }

    default T build(Long id) {
        return getRepository().findById(id)
                              .orElseThrow(() -> new RuntimeException(
                                  "Not found '%s' by id '%s'.".formatted(getResourceNameCode(), id)));
    }

}
