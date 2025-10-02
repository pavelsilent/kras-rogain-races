package pro.pavel.silent.rogain.races.entity;

public interface EntityFile<T> {

    Long getId();

    T getEntity();

    void setEntity(T entity);

    File getFile();

    void setFile(File file);

}
