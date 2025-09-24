package pro.pavel.silent.lib.core.util;

import java.time.Duration;
import org.junit.jupiter.api.Test;

class DurationHelperTest {

    @Test
    public void testDuration() {
        Duration parse = DurationHelper.parse("01:01:01");

        System.out.println(DurationHelper.format(parse));
    }
}
