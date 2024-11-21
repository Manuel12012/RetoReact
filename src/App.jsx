import React, { useState } from "react";

function App() {
  const usuarios = [
    { id: "1", nombre: "Manuel", correo: "manuel@manuel.com" },
    { id: "2", nombre: "Rosa", correo: "rosa@rosa.com" },
    { id: "3", nombre: "Marco", correo: "marco@marco.com" },
    { id: "4", nombre: "Lucas", correo: "lucas@lucas.com" },
  ];

  const [selectedIds, setSelectedIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [showNextForm, setShowNextForm] = useState(false);
  const [canalesSeleccionados, setCanalesSeleccionados] = useState([]);
  const [currentCanalFormIndex, setCurrentCanalFormIndex] = useState(0);
  const [finalMessages, setFinalMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMessages, setFormMessages] = useState({});

  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSendMessage = () => {
    if (selectedIds.length === 1) {
      const user = usuarios.find((usuario) => usuario.id === selectedIds[0]);
      setSelectedUser(user);
      setShowForm(true);
    } else {
      alert("Por favor, selecciona exactamente un usuario.");
    }
  };

  const handleRadioChange = (event) => {
    setMensaje(event.target.value);
  };

  const handleNextForm = () => {
    if (mensaje) {
      setShowNextForm(true);
    } else {
      alert("Por favor, selecciona un tipo de mensaje.");
    }
  };

  const handleCanalChange = (event) => {
    const value = event.target.value;
    setCanalesSeleccionados((prev) =>
      prev.includes(value)
        ? prev.filter((canal) => canal !== value)
        : [...prev, value]
    );
  };

  const handleNextCanalForm = () => {
    if (currentCanalFormIndex < canalesSeleccionados.length - 1) {
      setCurrentCanalFormIndex(currentCanalFormIndex + 1);
    }
  };

  const handlePrevCanalForm = () => {
    if (currentCanalFormIndex > 0) {
      setCurrentCanalFormIndex(currentCanalFormIndex - 1);
    }
  };

  const generateMessage = (canal) => {
    const userName = selectedUser ? selectedUser.nombre : "Usuario";
    const link = "http://example.com";

    const templates = {
      invitacion: {
        correo: {
          asunto: `Invitacion a proceso`,
          mensaje: `Hola, ${userName} hemos visto tu perfil y nos parece interesante. Encuentra mas informacion aqui: ${link}`,
        },
        sms_whatsapp: {
          mensaje: `Hola, ${userName} hemos visto tu perfil y nos parece interesante. Encuentra mas informacion aqui: ${link}`,
        },
      },
      recordatorio: {
        correo: {
          asunto: `Recordatorio de proceso`,
          mensaje: `Hola, ${userName} nos gustaria recordarte que tienes pendiente un proceso. Entra aqui para continuar ${link}`,
        },
        sms_whatsapp: {
          mensaje: `Hola, ${userName} nos gustaria recordarte que tienes pendiente un proceso. Entra aqui para continuar ${link}`,
        },
      },
      personalizado: {
        correo: {
          asunto: "Vacio",
          mensaje: "Vacio",
        },
        sms_whatsapp: {
          mensaje: "Vacio",
        },
      },
    };

    const type = mensaje === "invitacion" ? "invitacion" : mensaje === "recordatorio" ? "recordatorio" : "personalizado";
    const canalType = canal === "canal1" ? "correo" : "sms_whatsapp";

    return templates[type][canalType];
  };

  const handleFinalSubmit = () => {
    const messages = [];
    const newFormMessages = {};

    canalesSeleccionados.forEach((canal) => {
      const generatedMessage = generateMessage(canal);
      messages.push({
        usuario: selectedUser.nombre,
        canal,
        mensaje: generatedMessage,
      });

      newFormMessages[canal] = generatedMessage;
    });

    setFinalMessages(messages);
    setFormMessages(newFormMessages);
    console.log(JSON.stringify(messages, null, 2));
    alert("Mensajes enviados correctamente.");
  };

  return (
    <>
      <h1>Lista de Usuarios</h1>
      {usuarios.map((usuario) => (
        <div key={usuario.id}>
          <input
            type="checkbox"
            id={`checkbox-${usuario.id}`}
            checked={selectedIds.includes(usuario.id)}
            onChange={() => handleCheckboxChange(usuario.id)}
          />
          <label htmlFor={`checkbox-${usuario.id}`}>
            {usuario.nombre} - {usuario.correo}
          </label>
        </div>
      ))}

      <button onClick={handleSendMessage}>Enviar Mensaje</button>

      {showForm && (
        <div>
          <h2>Formulario de Mensaje</h2>
          <form>
            <div>
              <input
                type="radio"
                name="mensaje"
                id="invitacion"
                value="invitacion"
                checked={mensaje === "invitacion"}
                onChange={handleRadioChange}
              />
              <label htmlFor="invitacion">Invitación</label>
            </div>
            <div>
              <input
                type="radio"
                name="mensaje"
                id="recordatorio"
                value="recordatorio"
                checked={mensaje === "recordatorio"}
                onChange={handleRadioChange}
              />
              <label htmlFor="recordatorio">Recordatorio de proceso</label>
            </div>
            <div>
              <input
                type="radio"
                name="mensaje"
                id="personalizado"
                value="personalizado"
                checked={mensaje === "personalizado"}
                onChange={handleRadioChange}
              />
              <label htmlFor="personalizado">Personalizado</label>
            </div>
            <button type="button" onClick={handleNextForm}>
              Siguiente
            </button>
          </form>
        </div>
      )}

      {showNextForm && (
        <div>
          <h2>Selección de Canales</h2>
          <form>
            <div>
              <input
                type="checkbox"
                id="canal1"
                value="canal1"
                checked={canalesSeleccionados.includes("canal1")}
                onChange={handleCanalChange}
              />
              <label htmlFor="canal1">Correo Electronico</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="canal2"
                value="canal2"
                checked={canalesSeleccionados.includes("canal2")}
                onChange={handleCanalChange}
              />
              <label htmlFor="canal2">Mensaje de texto</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="canal3"
                value="canal3"
                checked={canalesSeleccionados.includes("canal3")}
                onChange={handleCanalChange}
              />
              <label htmlFor="canal3">Whatsapp</label>
            </div>

            <button type="button" onClick={handlePrevCanalForm}>
              Atras
            </button>
            <button type="button" onClick={handleNextCanalForm}>
              Siguiente
            </button>
          </form>
        </div>
      )}

      {canalesSeleccionados.length > 0 && currentCanalFormIndex === 0 && canalesSeleccionados.includes("canal1") && (
        <div>
          <h3>Formulario para Correo Electrónico</h3>
          <form>
            <label>Asunto:</label>
            <input type="text" value={formMessages["canal1"]?.asunto || ""} readOnly />
            <br />
            <label>Mensaje:</label>
            <textarea value={formMessages["canal1"]?.mensaje || ""} readOnly></textarea>
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}

      {canalesSeleccionados.length > 0 && currentCanalFormIndex === 1 && canalesSeleccionados.includes("canal2") && (
        <div>
          <h3>Formulario para Mensaje de Texto</h3>
          <form>
            <label>Mensaje:</label>
            <input type="text" value={formMessages["canal2"]?.mensaje || ""} readOnly />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}

      {canalesSeleccionados.length > 0 && currentCanalFormIndex === 2 && canalesSeleccionados.includes("canal3") && (
        <div>
          <h3>Formulario para WhatsApp</h3>
          <form>
            <label>Mensaje:</label>
            <input type="text" value={formMessages["canal3"]?.mensaje || ""} readOnly />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}

      {currentCanalFormIndex === canalesSeleccionados.length - 1 && (
        <button onClick={handleFinalSubmit}>Enviar</button>
      )}
    </>
  );
}

export default App;
