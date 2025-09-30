package pro.pavel.silent.rogain.races.domain.model;

import lombok.Getter;
import lombok.Setter;
import pro.pavel.silent.rogain.races.domain.enumeration.RaceFormatTokenType;

@Getter
@Setter
public class RaceFormatTokenModel {

    private Long raceId;

    private Long raceFormatId;

    private String token;

    private RaceFormatTokenType tokenType;

}
