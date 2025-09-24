package pro.pavel.silent.lib.core.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;

public class ListHelper {

    public static <T, R> List<R> map(List<T> list, Function<T, R> mapper) {
        return list == null ? null : list.stream().map(mapper).toList();
    }


    public static <T, R> List<R> mapI(List<T> list, BiFunction<Integer, T, R> mapper) {
        if (list == null)
            return null;

        ArrayList<R> newList = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            newList.add(mapper.apply(i, list.get(i)));
        }

        return newList;
    }

    public static <T> boolean hasLength(Collection<T> collection) {
        if (Objects.isNull(collection)) {
            return false;
        }
        return !collection.isEmpty();
    }

}
