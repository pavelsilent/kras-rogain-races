package pro.pavel.silent.rogain.races.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import pro.pavel.silent.rogain.races.data.ClubRepository;
import pro.pavel.silent.rogain.races.entity.Club;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository repository;

    public Club ensureClub(String name) {
        return Optional.ofNullable(name)
                       .map(StringUtils::trim)
                       .map(repository::findByNameIgnoreCase)
                       .map(cityOpt -> cityOpt
                           .orElseGet(() -> {
                               Club club = new Club();
                               club.setName(name);
                               return repository.save(club);
                           }))
                       .orElse(null);
    }

}
