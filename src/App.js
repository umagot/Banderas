import React, { useState, useEffect } from "react";

const JuegoBanderas = () => {
  const [paises, setPaises] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [puntos, setPuntos] = useState(0);
  const [nombreJugador, setNombreJugador] = useState("");
  const [tablaPuntuaciones, setTablaPuntuaciones] = useState(
    JSON.parse(localStorage.getItem("tablaPuntuaciones")) || []
  );

  useEffect(() => {
    const obtenerPaises = async () => {
      try {
        const respuesta = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images");
        const data = await respuesta.json();
        setPaises(data.data);
        seleccionarPaisAleatorio(data.data);
      } catch (error) {
        console.error("Error al obtener los países:", error);
      }
    };

    obtenerPaises();
  }, []);

  const seleccionarPaisAleatorio = (listaPaises) => {
    const indiceAleatorio = Math.floor(Math.random() * listaPaises.length);
    setPaisSeleccionado(listaPaises[indiceAleatorio]);
  };

  const arriesgarPais = (nombrePais) => {
    if (nombrePais.toLowerCase() === paisSeleccionado.name.toLowerCase()) {
      setPuntos((puntosActuales) => puntosActuales + 10);
      seleccionarPaisAleatorio(paises);
    } else {
      setPuntos((puntosActuales) => puntosActuales - 1);
    }
  };

  const guardarPuntuacion = () => {
    const nuevaPuntuacion = { nombre: nombreJugador, puntos };
    const nuevasPuntuaciones = [...tablaPuntuaciones, nuevaPuntuacion];
    setTablaPuntuaciones(nuevasPuntuaciones);
    localStorage.setItem("tablaPuntuaciones", JSON.stringify(nuevasPuntuaciones));
    setPuntos(0); 
  };

  return (
    <div className="juego-banderas">
      <h1>Juego de Banderas</h1>
      <input
        type="text"
        placeholder="Nombre del jugador"
        value={nombreJugador}
        onChange={(e) => setNombreJugador(e.target.value)}
      />
      <p>Puntos: {puntos}</p>
      {paisSeleccionado && (
        <div>
          <img src={paisSeleccionado.flag} alt="Bandera" />
          <input
            type="text"
            placeholder="¿A qué país pertenece?"
            onKeyDown={(e) => e.key === "Enter" && arriesgarPais(e.target.value)}
          />
        </div>
      )}
      <button onClick={guardarPuntuacion}>Guardar Puntuación</button>

      <h2>Tabla de puntuaciones</h2>
      <ul>
        {tablaPuntuaciones.map((jugador, index) => (
          <li key={index}>
            {jugador.nombre}: {jugador.puntos} puntos
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JuegoBanderas;
