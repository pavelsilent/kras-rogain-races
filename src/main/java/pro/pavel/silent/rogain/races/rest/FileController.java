package pro.pavel.silent.rogain.races.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Base64;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import pro.pavel.silent.rogain.races.entity.EntityFile;
import pro.pavel.silent.rogain.races.entity.File;
import pro.pavel.silent.rogain.races.rest.dto.FileDTO;
import pro.pavel.silent.rogain.races.rest.dto.FileLinkDTO;
import pro.pavel.silent.rogain.races.service.FileService;

@RestController
@RequestMapping("/api/files")
@Tag(name = "FileController", description = "API для работы с файлами")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileController {

    private final FileService fileService;

    @Operation(summary = "Добавить файл")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Long upload(@RequestPart("file") MultipartFile fileData) {
        return this.fileService.create(fileData).getId();
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<FileDTO> download(@PathVariable Long id) {
        File file = fileService.getById(id);
        String base64Data = Base64.getEncoder().encodeToString(file.getFileData());

        FileDTO dto = new FileDTO();
        dto.setFileName(file.getFileName());
        dto.setContentType(file.getContentType());
        dto.setBase64Data(base64Data);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Привязать файл")
    @PostMapping(value = "/link")
    public ResponseEntity<Long> linkFile(@RequestBody FileLinkDTO dto) {
        EntityFile link = fileService.createLink(dto);
        return ResponseEntity.ok(link.getId());
    }

}
