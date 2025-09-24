package pro.pavel.silent.rogain.races.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardController {

    @RequestMapping(value = "/{path:[^\\.]*}")
    public String forward() {
        // отдаём index.html для всех путей без точки (не /api, не .js/.css)
        return "forward:/index.html";
    }

}
