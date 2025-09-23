package pro.pavel.silent.lib.core.util;

import java.util.Optional;
import java.util.function.Function;

public class OptionalHelper {

    public static <T, R> R map(T data, Function<T, R> mapper) {
        return map(data, mapper, null);
    }

    public static <T, R> R map(T data, Function<T, R> mapper, R defaultValue) {
        return mapOptional(Optional.ofNullable(data), mapper, defaultValue);
    }

    public static <T, R> R mapOptional(Optional<T> data, Function<T, R> mapper) {
        return mapOptional(data, mapper, null);
    }

    public static <T, R> R mapOptional(Optional<T> data, Function<T, R> mapper, R defaultValue) {
        return data.map(mapper).orElse(defaultValue);
    }

}
