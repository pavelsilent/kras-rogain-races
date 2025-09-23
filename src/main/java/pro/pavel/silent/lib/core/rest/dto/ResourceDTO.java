package pro.pavel.silent.lib.core.rest.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pro.pavel.silent.lib.core.domain.model.Resource;
import pro.pavel.silent.lib.core.domain.model.Resourced;
import pro.pavel.silent.lib.core.domain.model.ResourcedData;
import pro.pavel.silent.lib.core.util.ListHelper;
import pro.pavel.silent.lib.core.util.OptionalHelper;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDTO implements ResourcedData {

    private String resourceName;

    private String id;

    private String code;

    private String name;

    private String description;

    public static ResourceDTO of(String resourceName, String id, String code, String name, String description) {
        return ResourceDTO.builder()
                          .resourceName(resourceName)
                          .id(id)
                          .code(code)
                          .name(name)
                          .description(description)
                          .build();
    }

    public static <T extends Resourced> ResourceDTO toDTO(T resourceLinked) {
        return Optional.ofNullable(resourceLinked)
                       .map(Resource::build)
                       .map(ResourceDTO::toDTO)
                       .orElse(null);
    }

    public static ResourceDTO toDTO(Resource resource) {
        return OptionalHelper.map(
            resource,
            link -> of(
                link.getResourceName(),
                link.getId(),
                link.getCode(),
                link.getName(),
                link.getDescription()
            )
        );
    }

    public static Resource toModel(ResourceDTO dto) {
        return OptionalHelper.map(
            dto,
            data -> Resource.of(data.getResourceName(),
                                data.getId(),
                                data.getCode(), data.getName(), data.getDescription()
            )
        );

    }

    public static List<ResourceDTO> toDTO(List<Resource> resources) {
        return ListHelper.map(resources, ResourceDTO::toDTO);
    }

    public Resource toModel() {
        return toModel(this);
    }

    @Override
    @JsonIgnore()
    public String getResourceNameCode() {
        return resourceName;
    }

}
