package pro.pavel.silent.lib.core.util;

import java.util.Objects;

@FunctionalInterface
public interface TripleConsumer<T, U, V> {

    void accept(T t, U u, V v);


    default TripleConsumer<T, U, V> andThen(TripleConsumer<? super T, ? super U, ? super V> after) {
        Objects.requireNonNull(after);

        return (l, r, v) -> {
            accept(l, r, v);
            after.accept(l, r, v);
        };
    }
}
