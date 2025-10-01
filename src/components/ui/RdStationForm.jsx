import React, { useEffect } from "react";

const RdStationForm = ({ formId, onConversion }) => {
  useEffect(() => {
    // 1. Verificamos se o script principal já existe para não o recarregar.
    const existingScript = document.querySelector(
      'script[src="https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js"]'
    );

    if (existingScript) {
      // Se o script já existe, apenas garantimos que o formulário é recriado.
      if (window.RDStationForms) {
        new window.RDStationForms(formId, "UA-519460-1").createForm();
      }
      return;
    }

    // 2. Se o script não existe, criamos a tag para a biblioteca principal do RD Station.
    const script = document.createElement("script");
    script.src =
      "https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js";
    script.async = true;

    // 3. A "magia" acontece aqui: quando o script terminar de carregar, executamos a segunda parte.
    script.onload = () => {
      if (window.RDStationForms) {
        // Este comando é o mesmo do código que você recebeu do RD.
        new window.RDStationForms(formId, "UA-519460-1").createForm();
      }
    };

    document.body.appendChild(script);

    // 4. Limpeza: removemos o script quando o componente é desmontado.
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [formId]);

  // O "ouvinte" para a conversão permanece o mesmo.
  useEffect(() => {
    const handleConversion = (event) => {
      console.log("RD Station: Conversão bem-sucedida!", event.detail.payload);

      const formData = event.detail.payload.conversion_data.reduce(
        (acc, field) => {
          acc[field.name] = field.value;
          return acc;
        },
        {}
      );

      if (formData.url) {
        onConversion(formData.url);
      }
    };

    window.addEventListener(
      "RDStation:SuccessfullyConverted",
      handleConversion
    );

    return () => {
      window.removeEventListener(
        "RDStation:SuccessfullyConverted",
        handleConversion
      );
    };
  }, [onConversion]);
  return <div role="main" id={formId}></div>;
};

export default RdStationForm;
