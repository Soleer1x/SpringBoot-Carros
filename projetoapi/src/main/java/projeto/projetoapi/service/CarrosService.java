package projeto.projetoapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projeto.projetoapi.models.Carros;
import projeto.projetoapi.repository.CarrosRepository;

import java.util.List;

@Service
public class CarrosService {

    @Autowired
    private CarrosRepository CarrosRepository;

    public List<Carros> findAll(){
        return CarrosRepository.findAll();
    }

    public Carros findById(String id){
        return CarrosRepository.findById(id).orElse(null);
    }

    public Carros save(Carros Carros){
        return CarrosRepository.save(Carros);
    }

    public Carros updateById(String id, Carros Carros){
        if(CarrosRepository.existsById(id)){
            Carros.setId(id); // atualiza o que esta dentro do id
            return CarrosRepository.save(Carros);
        } else {
            return null; // se o id nao existir tudo fica null
        }
    }

    public void deleteById(String id){
        CarrosRepository.deleteById(id);
    }

    public void deleteAll(){
        CarrosRepository.deleteAll();
    }
}
