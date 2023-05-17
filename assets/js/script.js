//console.log('probando');
//vamos a trabajar con la pokeapi enviando la información al html manipulando el dom
function Pokedex() {
    this.pokemones = [];
};

Pokedex.prototype.pokemonOrdenados = function () {
    return this.pokemones.sort(function (a, b) {
        return a.pokedex - b.pokedex;
      });
  };

Pokedex.prototype.agregarPokemon = function (pokemon) { //con prototype puedo darle a la función la atribución de agregar
    let pokemonBuscado = this.pokemones.find(
        (elementPokemon) => elementPokemon.pokedex == pokemon.pokedex
    );
    if (pokemonBuscado) {
        //alert('pokemon ya existe en registro');
        return false;
    } else {
        this.pokemones.push(pokemon);
        //return true;
    }
};

Pokedex.prototype.eliminarPokemon = function (numeroPokedex) {
    let pokemon = this.pokemones.find((elementPokemon, index) => {
        if (elementPokemon.pokedex == numeroPokedex) {
            elementPokemon.indice = index;
            return elementPokemon;
        }
    }); 
    //console.log(pokemon);
    if (pokemon) {
        this.pokemones.splice(pokemon.index, 1);
        //alert('Pokemon eliminado');
        return true;
    } else {
        //alert('Pokemon no existe en la colección');
        return false;
    }
};

Pokedex.prototype.filtrarPokemones = function (nombre) {
    return this.pokemones.filter((pokemon) => pokemon.nombre.includes(nombre));
};

let miPokedex = new Pokedex();
let currentPokemon;

function Pokemon(pokedex, nombre, peso, imagen) {
    this.pokedex = pokedex;
    this.nombre = nombre;
    this.peso = peso;
    this.imagen = imagen;
};

async function getPokemon(id) { //para llamar con el await
    try {
        let url = "https://pokeapi.co/api/v2/pokemon/" + id;
        let response = await fetch(url);
        if (response.status == 200) {
            let pokemon = await response.json();
            let { id, name, weight, sprites } = pokemon;
            let image = sprites.other["official-artwork"].front_default;

            let nuevoPokemon = new Pokemon(id, name, weight, image);
            currentPokemon = nuevoPokemon;
            cargarCard(nuevoPokemon);
            //console.log(pokemon);
            //console.log(nuevoPokemon);    
        } else {
            let data = await response.text();
            alert(data);
        }
    } catch (error) {
        console.log(error);
    }
};

formPokemon.addEventListener('submit', function (event) { //permite que no se ejecute solo
    event.preventDefault(); //previene  que las acciones por defecto del formulario: enviar los datos - actualizar la página
    getPokemon(idPokemon.value);
});

function cargarCard(pokemon) {
    nombrePokemon.innerText = pokemon.nombre;
    pesoPokemon.innerText = pokemon.peso;
    imagenPokemon.setAttribute("src", pokemon.imagen);
    imagenPokemon.setAttribute("alt", pokemon.nombre);
};

btnAgregarPokemon.addEventListener('click', function (event) {
    if (currentPokemon) {
        let resultado = miPokedex.agregarPokemon(currentPokemon);
        if (resultado == false) {
            alert ('Pokemon ya se encuentra en la lista');
        } else {
            alert ('Pokemon agregado con exito');
            cargarTabla(miPokedex.pokemonOrdenados());
        }
    } else {
        alert("No existe un pokémon para agregar.");
    }
  });

  function cargarTabla(arrayPokemones) {
    try {
        let filas = "";
        arrayPokemones.forEach(pokemon => {
            filas += `
            <tr>
                <th scope="row">${pokemon.pokedex}</th>
                <td><img src="${pokemon.imagen} alt=${pokemon.pokedex}" style="whidth:100px;"></td>
                <td>${pokemon.nombre}</td>
                <td>${pokemon.peso}</td>
                <td><button clas="btn btn-danger deleteButons" data-pokedex="${pokemon.pokedex}">Eliminar</button></td>
            </tr>
             `;
        });
        cuerpoTablaPokemones.innerHTML = filas;
    } catch (error) {
        alert('Error al cargar la tabla');
    }

  };

  $('#cuerpoTablaPokemones').on('click', 'deleteButtons', function (event) {
    let boton = event.target;
    let numeroPokedex = boton.dataset.pokedex; //puedo ocupar todo los data algo que quiera, se usan en bootstrap para pasar atributos
    let resultado = miPokedex.eliminarPokemon(numeroPokedex);
    if (resultado) {
        alert('Pokémon eliminado con éxito');
        cargarTabla(miPokedex.pokemones);
    } else {
        alert('Pokémon no se pudo eliminar');
    }
});

searchNombrePokemon.addEventListener('keyup', function () {
    let elementos = miPokedex.filtrarPokemones(searchNombrePokemon.value);
    cargarTabla(elementos);
});
