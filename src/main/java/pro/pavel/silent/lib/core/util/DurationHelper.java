package pro.pavel.silent.lib.core.util;

import java.time.Duration;

public class DurationHelper {

    public static Duration parse(String duration) {
        if (duration == null || duration.isEmpty()) {
            return null;
        }
        if (!duration.matches("\\d{1,2}:\\d{1,2}:\\d{1,2}")) {
            throw new IllegalArgumentException("Некорректный формат: " + duration);
        }

        String[] parts = duration.split(":");
        int hours = Integer.parseInt(parts[0]);
        System.out.println(hours);
        int minutes = Integer.parseInt(parts[1]);
        System.out.println(minutes);
        int seconds = Integer.parseInt(parts[2]);
        System.out.println(seconds);

        if (minutes < 0 || minutes > 59) {
            throw new IllegalArgumentException("Минуты должны быть 0-59");
        }
        if (seconds < 0 || seconds > 59) {
            throw new IllegalArgumentException("Секунды должны быть 0-59");
        }

        return Duration.ofHours(hours)
                       .plusMinutes(minutes)
                       .plusSeconds(seconds);
    }

    public static String format(Duration duration) {
        if (duration == null) {
            return null;
        }

        long totalSeconds = duration.getSeconds();

        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;

        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }

}
