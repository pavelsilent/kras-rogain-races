package pro.pavel.silent.rogain.races.domain.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum RaceFormatType {
    PERSONAL(RaceAthleteType.ATHLETE),
    TEAM(RaceAthleteType.ATHLETE_TEAM);

    @Getter
    private final RaceAthleteType athleteType;
}
