package projeto.projetoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import projeto.projetoapi.models.Carros;

@Repository
public interface CarrosRepository extends JpaRepository<Carros,String> {

}
