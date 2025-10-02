package pro.pavel.silent.rogain.races.domain.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RaceAthleteState {
    FINISHED(1, true),
    STARTED(2, true),
    DISQUALIFIED(3, false),
    DID_NOT_FINISH(4, false),
    DID_NOT_START(5, false),
    REGISTERED(6, false);

    private final Integer order;

    private final boolean hasPlace;
}
