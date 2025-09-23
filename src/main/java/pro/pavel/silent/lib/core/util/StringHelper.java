package pro.pavel.silent.lib.core.util;

import java.util.Objects;

public class StringHelper {

    public static boolean hasLength(String string) {
        if (Objects.isNull(string)) {
            return false;
        }
        return !string.isEmpty();
    }

}
