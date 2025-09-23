package pro.pavel.silent.rogain.races.domain.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import pro.pavel.silent.lib.core.domain.model.ResourceName;
import pro.pavel.silent.lib.core.domain.model.Resourced;
import pro.pavel.silent.rogain.races.entity.Athlete;
import pro.pavel.silent.rogain.races.entity.City;
import pro.pavel.silent.rogain.races.entity.Club;
import pro.pavel.silent.rogain.races.entity.Race;
import pro.pavel.silent.rogain.races.entity.RaceType;

@Getter
@RequiredArgsConstructor
public enum DataResourceName implements ResourceName {
    RACE("race", Race.class),
    RACE_TYPE("race-type", RaceType.class),
    ATHLETE("athlete", Athlete.class),
    CITY("city", City.class),
    CLUB("club", Club.class),;

    private final String code;
    private final Class<? extends Resourced> clazz;

}
