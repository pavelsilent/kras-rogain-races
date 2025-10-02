package pro.pavel.silent.rogain.races.service;

import pro.pavel.silent.rogain.races.entity.EntityFile;
import pro.pavel.silent.rogain.races.entity.File;
import pro.pavel.silent.rogain.races.rest.dto.FileLinkDTO;

public interface FileEntityService<T, R extends EntityFile<T>> {

    R createLink(File file, FileLinkDTO fileDTO);

    Class<T> getSupportedEntityClass();

    default boolean supports(String className) {
        return getSupportedEntityClass().getSimpleName().equals(className);
    }

}
