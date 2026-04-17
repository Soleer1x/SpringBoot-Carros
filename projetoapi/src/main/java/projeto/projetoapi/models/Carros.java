package projeto.projetoapi.models;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@JsonPropertyOrder({"id", "nome", "montadora" , "motor"})
@Table(name = "tb_carros")
public class Carros {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String nome;
    private String montadora;
    private String motor;

}
