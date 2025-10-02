package pro.pavel.silent.rogain.races.service;

import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pro.pavel.silent.rogain.races.data.FileRepository;
import pro.pavel.silent.rogain.races.entity.EntityFile;
import pro.pavel.silent.rogain.races.entity.File;
import pro.pavel.silent.rogain.races.rest.dto.FileLinkDTO;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final List<FileEntityService> fileEntityServices;

    public File getById(Long id) {
        return fileRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found file with id: " + id));
    }

    public File create(MultipartFile multipartFile) {
        File file = new File();
        file.setFileName(multipartFile.getOriginalFilename());
        file.setContentType(multipartFile.getContentType());
        try {
            file.setFileData(multipartFile.getBytes());
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
        return fileRepository.save(file);
    }

    public <T, R extends EntityFile<T>> R createLink(FileLinkDTO fileDTO) {
        FileEntityService<T, R> entityService = fileEntityServices
            .stream()
            .filter(fileEntityService -> fileEntityService.supports(fileDTO.getEntityType()))
            .findFirst()
            .map(fileEntityService -> (FileEntityService<T, R>) fileEntityService)
            .orElseThrow(() -> new RuntimeException("Не найден сервис для файлов " + fileDTO.getEntityType() + "."));

        File file = getById(fileDTO.getFileId());
        return entityService.createLink(file, fileDTO);

    }

}
