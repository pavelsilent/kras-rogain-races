package pro.pavel.silent.rogain.races.data;

import java.util.Optional;
import pro.pavel.silent.lib.core.service.EntityRepository;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceFormatFileType;
import pro.pavel.silent.rogain.races.entity.RaceFormat;
import pro.pavel.silent.rogain.races.entity.RaceFormatFile;

public interface RaceFormatFileRepository extends EntityRepository<RaceFormatFile, Long> {

    Optional<RaceFormatFile> findFirstByEntityAndType(RaceFormat raceFormat, RaceFormatFileType type);
}
