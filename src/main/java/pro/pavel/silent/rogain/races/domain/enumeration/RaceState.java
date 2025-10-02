package pro.pavel.silent.rogain.races.domain.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RaceState {
    DRAFT(false),
    PLANNED(false),
    REGISTRATION_STARTED(false),
    REGISTRATION_FINISHED(false),
    STARTED(true),
    FINISHED(true),
    CANCELED(false);

    private final boolean hasPlace;
}
