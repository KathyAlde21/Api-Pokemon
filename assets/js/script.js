//console.log('probando');
//vamos a trabajar con la pokeapi enviando la información al html manipulando el dom
function Pokedex() {
    this.pokemones = [];
}

function Pokemon(pokedex, nombre, peso) {
    this.pokedex = pokedex;
    this.nombre = nombre;
    this.peso = peso;
}

async function getPokemon(id) { //para llamar con el await
        try {    let url = "https://pokeapi.co/api/v2/pokemon/" + id;
        let response = await fetch(url);
        if (response.status == 200) {
            let data = await response.json();
            console.log(data);    
        } else {
            let data = await response.text();
            alert(data);
        }
    } catch (error) {
        console.log('Algo ha salido mal.');
        console.log(error);
    }
}

formPokemon.addEventListener('submit', function (event) { //permite que no se ejecute solo
    event.preventDefault(); //previene  que las acciones por defecto del formulario: enviar los datos - actualizar la página
    console.log(event);
});

