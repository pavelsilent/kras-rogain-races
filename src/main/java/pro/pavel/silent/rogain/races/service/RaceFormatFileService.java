package pro.pavel.silent.rogain.races.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pro.pavel.silent.rogain.races.data.RaceFormatFileRepository;
import pro.pavel.silent.rogain.races.data.RaceFormatRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceFormatFileType;
import pro.pavel.silent.rogain.races.entity.File;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatFile;
import pro.pavel.silent.rogain.races.rest.dto.FileLinkDTO;

@Service
@RequiredArgsConstructor
public class RaceFormatFileService implements FileEntityService<RaceFormat, RaceFormatFile> {

    private final RaceFormatRepository raceFormatRepository;
    private final RaceFormatFileRepository raceFormatFileRepository;

    @Override
    public RaceFormatFile createLink(File file, FileLinkDTO fileDTO) {
        RaceFormat raceFormat = raceFormatRepository.getById(Long.valueOf(fileDTO.getEntityId()));

        RaceFormatFile raceFormatFile = new RaceFormatFile();
        raceFormatFile.setEntity(raceFormat);
        raceFormatFile.setFile(file);
        raceFormatFile.setType(RaceFormatFileType.valueOf(fileDTO.getFileType()));
        return raceFormatFileRepository.save(raceFormatFile);
    }

    public Optional<File> findFile(RaceFormat raceFormat, RaceFormatFileType fileType) {
        return raceFormatFileRepository.findFirstByEntityAndTypeOrderByIdDesc(raceFormat, fileType)
                                       .map(RaceFormatFile::getFile);
    }

    @Override
    public Class<RaceFormat> getSupportedEntityClass() {
        return RaceFormat.class;
    }

}
