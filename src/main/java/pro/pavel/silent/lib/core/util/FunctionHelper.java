package pro.pavel.silent.lib.core.util;

import java.util.function.BinaryOperator;

public class FunctionHelper {

    public static <T> BinaryOperator<T> firstArgSupplier() {
        return (object1, object2) -> object1;
    }

}
