package pro.pavel.silent.lib.core.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.lib.core.domain.model.Resourced;
import pro.pavel.silent.lib.core.domain.model.ResourcedData;

@Service
@RequiredArgsConstructor
public class ResourceServiceFactory {

    private final List<ResourceService<? extends Resourced>> services;

    @SuppressWarnings("unchecked")
    public <T extends Resourced> T build(ResourcedData data) {
        return (T) services.stream()
                           .filter(resourceService -> resourceService.supports(data.getResourceNameCode()))
                           .findFirst()
                           .map(resourceService -> resourceService.build(data))
                           .orElseThrow(() -> new RuntimeException(
                               "Not found resource: " + data.getResourceNameCode() + " by id: " + data.getId()));
    }

}
