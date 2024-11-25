import React, { useState } from "react";
import './index.css';

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
    if (selectedIds.length >= 1) {
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

    const type =
      mensaje === "invitacion"
        ? "invitacion"
        : mensaje === "recordatorio"
        ? "recordatorio"
        : "personalizado";
    const canalType = canal === "canal1" ? "correo" : "sms_whatsapp";

    return templates[type][canalType];
  };

  const handleFinalSubmit = () => {
    const messages = [];
  
    selectedIds.forEach((userId) => {
      const user = usuarios.find((usuario) => usuario.id === userId);
  
      canalesSeleccionados.forEach((canal) => {
        const generatedMessage = formMessages[userId]?.[canal] || generateMessage(canal);
  
        messages.push({
          usuario: user.nombre,
          canal,
          mensaje: generatedMessage,
        });
      });
    });
  
    console.log("Mensajes finales enviados:", JSON.stringify(messages, null, 2));
    alert("Mensajes enviados correctamente.");
  };
  
  const handleInputChange = (userId, canal, field, value) => {
    setFormMessages((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [canal]: {
          ...prev[userId]?.[canal],
          [field]: value,
        },
      },
    }));
  };
    

  return (
    <>
      <div className="bg-white inline-block m-5 leading-7 p-5 rounded-lg">
        <h1 className="text-4xl text-gray-950">Lista de Usuarios</h1>
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="leading-10">
            <input
              type="checkbox"
              id={`checkbox-${usuario.id}`}
              checked={selectedIds.includes(usuario.id)}
              onChange={() => handleCheckboxChange(usuario.id)}
              className="w-6 h-6"
            />
            <label className="pl-2" htmlFor={`checkbox-${usuario.id}`}>
              {usuario.nombre} - {usuario.correo}
            </label>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            className="bg-blue-400 rounded-lg text-white p-2 hover:bg-blue-500"
            onClick={handleSendMessage}
          >
            Enviar Mensaje
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white inline-block m-5 leading-7 p-5 rounded-lg">
          <h2 className="text-4xl text-gray-950">Seleccion de tipo de mensaje</h2>
          <form>
            <div className="outline outline-1 rounded-lg outline-gray-400 m-2 p-2">
              <input
                type="radio"
                name="mensaje"
                id="invitacion"
                value="invitacion"
                checked={mensaje === "invitacion"}
                onChange={handleRadioChange}
                className="w-6 h-6"
              />
              <label className="ml-3" htmlFor="invitacion">
                Invitación
              </label>
            </div>
            <div className="outline outline-1 rounded-lg outline-gray-400 m-2 p-2">
              <input
                type="radio"
                name="mensaje"
                id="recordatorio"
                value="recordatorio"
                checked={mensaje === "recordatorio"}
                onChange={handleRadioChange}
                className="w-6 h-6"
              />
              <label className="ml-3" htmlFor="recordatorio">
                Recordatorio de proceso
              </label>
            </div>
            <div className="outline outline-1 rounded-lg outline-gray-400 m-2 p-2">
              <input
                type="radio"
                name="mensaje"
                id="personalizado"
                value="personalizado"
                checked={mensaje === "personalizado"}
                onChange={handleRadioChange}
                className="w-6 h-6"
              />
              <label className="ml-3" htmlFor="personalizado">
                Personalizado
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-400 rounded-lg text-white p-3 hover:bg-blue-500"
                type="button"
                onClick={handleNextForm}
              >
                Siguiente
              </button>
            </div>
          </form>
        </div>
      )}

      {showNextForm && (
        <div className="bg-white inline-block m-5 leading-7 p-5 rounded-lg">
          <h2 className="text-4xl text-gray-950">Selección de Canales</h2>
          <form>
            <div className="outline outline-1 rounded-lg outline-gray-400 m-2 p-2">
              <input
                type="checkbox"
                id="canal1"
                value="canal1"
                checked={canalesSeleccionados.includes("canal1")}
                onChange={handleCanalChange}
                className="w-6 h-6"
              />
              <label className="ml-3" htmlFor="canal1">
                Correo Electrónico
              </label>
            </div>
            <div className="outline outline-1 rounded-lg outline-gray-400 m-2 p-2">
              <input
                type="checkbox"
                id="canal2"
                value="canal2"
                checked={canalesSeleccionados.includes("canal2")}
                onChange={handleCanalChange}
                className="w-6 h-6"
              />
              <label className="ml-3" htmlFor="canal2">
                Mensaje de texto
              </label>
            </div>
            <div className="outline outline-1 rounded-lg outline-gray-400 m-2 p-2">
              <input
                type="checkbox"
                id="canal3"
                value="canal3"
                checked={canalesSeleccionados.includes("canal3")}
                onChange={handleCanalChange}
                className="w-6 h-6"
              />
              <label className="ml-3" htmlFor="canal3">
                WhatsApp
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-400 rounded-lg text-white p-3 hover:bg-blue-500"
                type="button"
                onClick={() => {
                  if (canalesSeleccionados.length > 0) {
                    setCurrentCanalFormIndex(0);
                  } else {
                    alert("Debes seleccionar al menos un canal.");
                  }
                }}
              >
                Siguiente
              </button>
            </div>
          </form>
        </div>
      )}

{canalesSeleccionados.length > 0 &&
  currentCanalFormIndex < canalesSeleccionados.length &&
  canalesSeleccionados.includes(canalesSeleccionados[currentCanalFormIndex]) && (
    <div className="bg-white inline-block m-5 leading-7 p-5 rounded-lg">
      {selectedIds.map((userId) => {
        const user = usuarios.find((usuario) => usuario.id === userId);
        const canal = canalesSeleccionados[currentCanalFormIndex];
        const template = formMessages[userId]?.[canal] || generateMessage(canal);

        return (
          <div key={`${userId}-${canal}`}>
            <h3 className="text-4xl text-gray-950">
              Formulario para {canal === "canal1" ? "Correo Electrónico" : canal === "canal2" ? "Mensaje de Texto" : "WhatsApp"} de {user.nombre}
            </h3>
            <form>
              {canal === "canal1" && (
                <>
                  <label>Asunto:</label>
                  <input
                    className="w-full h-10 outline outline-1 rounded-lg outline-gray-400 mb-2 p-2"
                    placeholder="Escribe..."
                    type="text"
                    value={template.asunto || ""}
                    onChange={(e) => handleInputChange(userId, canal, "asunto", e.target.value)}
                  />
                </>
              )}
              <label>Mensaje:</label>
              <textarea
                className="w-full h-20 outline outline-1 rounded-lg outline-gray-400 p-2"
                placeholder="Escribe..."
                value={template.mensaje || ""}
                onChange={(e) => handleInputChange(userId, canal, "mensaje", e.target.value)}
              ></textarea>
            </form>
          </div>
        );
      })}
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 p-3 rounded-lg hover:bg-gray-400"
          onClick={handlePrevCanalForm}
          disabled={currentCanalFormIndex === 0}
        >
          Atrás
        </button>
        <button
          className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500"
          onClick={
            currentCanalFormIndex === canalesSeleccionados.length - 1
              ? handleFinalSubmit
              : handleNextCanalForm
          }
        >
          {currentCanalFormIndex === canalesSeleccionados.length - 1
            ? "Enviar"
            : "Siguiente"}
        </button>
      </div>
    </div>
  )}
    </>
  );
}

export default App;
