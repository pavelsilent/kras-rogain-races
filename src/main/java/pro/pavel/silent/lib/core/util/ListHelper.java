package pro.pavel.silent.lib.core.util;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;

public class ListHelper {

    public static <T, R> List<R> map(List<T> list, Function<T, R> mapper) {
        return list == null ? null : list.stream().map(mapper).toList();
    }

    public static <T> boolean hasLength(Collection<T> collection) {
        if (Objects.isNull(collection)) {
            return false;
        }
        return !collection.isEmpty();
    }

}
