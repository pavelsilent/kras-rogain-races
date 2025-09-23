package pro.pavel.silent.lib.core.domain.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource implements ResourcedData, Serializable {

    @NotNull
    @Getter
    private String id;

    @NotBlank
    private String resourceName;

    private String code;

    private String name;

    private String description;

    public static Resource of(String resourceName, Long id) {
        return of(resourceName, String.valueOf(id));
    }

    public static Resource of(String resourceName, String id) {
        return of(resourceName, id, null, null, null);
    }

    public static Resource of(
        String resourceName,
        String objId,
        String objCode,
        String objName,
        String objDescription
    ) {
        return Resource.builder()
                       .resourceName(resourceName)
                       .id(objId)
                       .code(objCode)
                       .name(objName)
                       .description(objDescription)
                       .build();
    }

    public static <T extends Resourced> Resource build(T object) {
        return Optional.ofNullable(object)
                       .map(data -> of(
                           data.getResourceCode(),
                           data.getStringId(),
                           data.getResourceLinkCode(),
                           data.getResourceLinkName(),
                           data.getResourceLinkDescription()
                       ))
                       .orElse(null);
    }

    @Override
    public String getResourceNameCode() {
        return resourceName;
    }

}

