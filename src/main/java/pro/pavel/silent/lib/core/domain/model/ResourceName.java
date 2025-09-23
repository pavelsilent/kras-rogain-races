package pro.pavel.silent.lib.core.domain.model;

public interface ResourceName {

    String getCode();

    Class<? extends Resourced> getClazz();
}
