package pro.pavel.silent.rogain.races;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import pro.pavel.silent.rogain.races.service.AppSettingsService;

@RequiredArgsConstructor
@SpringBootApplication(scanBasePackages = "pro.pavel.silent")
public class KrskRogainRacesApplication {

    private final AppSettingsService appSettingsService;

    public static void main(String[] args) {
        SpringApplication.run(KrskRogainRacesApplication.class, args);
    }

    @PostConstruct
    public void init() {
        appSettingsService.ensure();
    }

}
