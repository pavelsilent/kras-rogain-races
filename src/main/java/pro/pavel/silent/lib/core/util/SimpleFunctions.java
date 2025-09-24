package pro.pavel.silent.lib.core.util;

import java.util.function.BinaryOperator;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public class SimpleFunctions {

    public static <T> Predicate<T> truePredicate() {
        return object -> true;
    }

    public static <T> Predicate<T> falsePredicate() {
        return object -> false;
    }

    public static <T> Consumer<T> emptyConsumer() {
        return object -> {
        };
    }

    public static <T> Function<T, T> sameValueFunction() {
        return object -> object;
    }

    public static <T> BinaryOperator<T> firstArgSupplier() {
        return (object1, object2) -> object1;
    }

}
