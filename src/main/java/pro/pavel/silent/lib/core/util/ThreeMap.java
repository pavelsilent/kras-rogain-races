package pro.pavel.silent.lib.core.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;
import org.apache.commons.lang3.tuple.Triple;

public class ThreeMap<L, M, R> {

    private final Map<L, Map<M, R>> data = new HashMap<>();

    public void add(L left, M middle, R right) {
        data.computeIfAbsent(left, k -> new HashMap<>());

        Map<M, R> rightData = data.get(left);
        rightData.put(middle, right);
    }

    public void addIfAbsent(L left, M middle, R right) {
        if (!contains(left, middle)) {
            add(left, middle, right);
        }
    }

    public R get(L left, M middle) {
        return find(left, middle).orElseThrow(() -> new RuntimeException(
            "Not found value by keys: ('%s', '%s').".formatted(left, middle)
        ));
    }

    public Map<M, R> get(L left) {
        return data.get(left);
    }

    public Optional<R> find(L left, M middle) {
        if (!contains(left, middle)) {
            return Optional.empty();
        }

        return Optional.ofNullable(
            data.get(left)
                .get(middle));
    }

    public boolean contains(L left) {
        return data.containsKey(left);
    }

    public boolean contains(L left, M middle) {
        if (!contains(left)) {
            return false;
        }

        return data.get(left).containsKey(middle);
    }

    public List<L> leftKeys() {
        return new ArrayList<>(data.keySet());
    }

    public void forEach(TripleConsumer<L, M, R> consumer) {
        data.forEach((l, mrMap) -> mrMap.forEach((m, r) -> consumer.accept(l, m, r)));
    }

    public <T> Stream<T> map(TripleFunction<L, M, R, T> mapper) {
        return data.entrySet()
                   .stream()
                   .flatMap(leftEntry ->
                                leftEntry.getValue().entrySet().stream()
                                         .map(middleEntry ->
                                                  Triple.of(
                                                      leftEntry.getKey(),
                                                      middleEntry.getKey(),
                                                      middleEntry.getValue()
                                                  )))
                   .map(triple -> mapper.apply(triple.getLeft(), triple.getMiddle(), triple.getRight()));
    }

    public ThreeMap<L, M, R> filter(TripleFunction<L, M, R, Boolean> predicate) {
        return data.entrySet()
                   .stream()
                   .flatMap(leftEntry ->
                                leftEntry.getValue().entrySet().stream()
                                         .map(middleEntry ->
                                                  Triple.of(
                                                      leftEntry.getKey(),
                                                      middleEntry.getKey(),
                                                      middleEntry.getValue()
                                                  )))
                   .filter(triple -> predicate.apply(
                       triple.getLeft(),
                       triple.getMiddle(),
                       triple.getRight()
                   ))
                   .reduce(
                       new ThreeMap<>(),
                       (map, triple) -> {
                           map.add(triple.getLeft(), triple.getMiddle(), triple.getRight());
                           return map;
                       },
                       FunctionHelper.firstArgSupplier()
                   );
    }

    public ThreeMap<L, M, R> add(ThreeMap<L, M, R> map) {
        map.forEach(this::add);
        return this;
    }

}
