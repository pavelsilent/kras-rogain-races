package pro.pavel.silent.lib.core.domain.model;

import java.io.Serializable;

public interface Resourced extends Serializable, Identifiable<Long> {

    default Resource build(Resourced object) {
        return Resource.build(object);
    }

    Long getId();

    default String getStringId() {
        return String.valueOf(getId());
    }

    ResourceName getResource();

    default String getResourceCode() {
        return getResource().getCode();
    }

    default String getResourceLinkCode() {
        return null;
    }

    default String getResourceLinkName() {
        return null;
    }

    default String getResourceLinkDescription() {
        return null;
    }

}
