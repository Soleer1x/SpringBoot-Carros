package projeto.projetoapi.controller;

import lombok.Data;
import org.springframework.web.bind.annotation.*;
import projeto.projetoapi.models.Carros;
import projeto.projetoapi.service.CarrosService;

import java.util.List;

@Data
@RestController
@RequestMapping("carros")
public class CarrosController {

    private final CarrosService service;

    @GetMapping
    public List<Carros> findAll(){
        return service.findAll();
    }

    @GetMapping("{id}")
    public Carros findById(@PathVariable String id){
        return service.findById(id);
    }

    @PostMapping
    public Carros save(@RequestBody Carros Carros){
        return service.save(Carros);
    }

    @PutMapping("{id}")
    public Carros updateById(@PathVariable String id, @RequestBody Carros Carros){
        Carros.setId(id);
        return service.save(Carros);
    }

    @DeleteMapping("{id}")
    public void deleteById(@PathVariable String id){
        service.deleteById(id);
    }

    @DeleteMapping
    public String deleteAll() {
        service.deleteAll();
        return "Todos os registros foram deletados com sucesso!";
    }
}
