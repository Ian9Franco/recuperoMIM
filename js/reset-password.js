import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const statusEl = document.getElementById("status");
const formEl = document.getElementById("reset-form");
const successEl = document.getElementById("success");
const passwordEl = document.getElementById("password");
const confirmPasswordEl = document.getElementById("confirm-password");

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function showMessage(type, html) {
  if (!statusEl) return;
  statusEl.className = "status";
  statusEl.classList.add(`status-${type}`);
  statusEl.innerHTML = html;
}

async function init() {
  if (!statusEl || !formEl || !passwordEl || !confirmPasswordEl || !successEl) return;
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const accessToken = params.get("access_token");

  if (SUPABASE_URL.includes("YOUR_SUPABASE") || SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")) {
    showMessage("error", "Configurá tu <code>SUPABASE_URL</code> y <code>SUPABASE_ANON_KEY</code> en <code>js/reset-password.js</code>.");
    return;
  }

  if (type !== "recovery" || !accessToken) {
    showMessage("error", "El enlace no contiene los parámetros de recuperación correctos. Verificá el link enviado por correo.");
    return;
  }

  showMessage("info", "Validando enlace de recuperación... por favor esperá.");

  const { data, error } = await supabase.auth.getSessionFromUrl();
  if (error) {
    console.error("Supabase recovery error:", error);
    showMessage("error", "No se pudo validar el enlace de recuperación. El token puede haber expirado.");
    return;
  }

  if (!data?.session) {
    showMessage("error", "No se encontró una sesión válida. Intentá solicitar un nuevo enlace de recuperación.");
    return;
  }

  showMessage("success", "Enlace validado. Completá la nueva contraseña y presioná el botón para actualizarla.");
  formEl.classList.remove("hidden");

  formEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = passwordEl.value.trim();
    const confirmPassword = confirmPasswordEl.value.trim();

    if (!password || !confirmPassword) {
      showMessage("error", "Completá ambos campos de contraseña.");
      return;
    }
    if (password !== confirmPassword) {
      showMessage("error", "Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      showMessage("error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    showMessage("info", "Actualizando contraseña...");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      console.error("Password update error:", updateError);
      showMessage("error", "No se pudo actualizar la contraseña. Intentá de nuevo o solicitá otro enlace.");
      return;
    }

    formEl.classList.add("hidden");
    successEl.classList.remove("hidden");
    showMessage("success", "Contraseña actualizada con éxito. Volvé a la app de escritorio para iniciar sesión con tu nueva contraseña.");
  });
}

init();
