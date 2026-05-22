# Recupero MIM

Este es un sitio estático independiente para la recuperación de contraseña de tu app MIM.

## Qué contiene

- `index.html`: página de presentación e instrucciones.
- `reset-password.html`: página que recibe el enlace de recovery de Supabase y permite cambiar la contraseña.
- `css/styles.css`: estilos simples para la web.
- `js/reset-password.js`: lógica de Supabase para validar el enlace y actualizar la contraseña.

## Configuración

1. Reemplazá los valores `SUPABASE_URL` y `SUPABASE_ANON_KEY` en `js/reset-password.js`.
2. Configurá Supabase para usar un `redirectTo` público que apunte a esta página:

```ts
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: "https://recupero-mim-qbfb.vercel.app/reset-password.html",
});
```

3. Subí este repositorio a `https://github.com/Ian9Franco/recuperoMIM`.
4. Activá GitHub Pages en la rama principal (`main`) y usá la carpeta raíz.
5. El sitio público quedará disponible en `https://ian9franco.github.io/recuperoMIM/reset-password.html`.

> Ya podés desplegar también en Vercel. El sitio actual está disponible en `https://recupero-mim-qbfb.vercel.app/reset-password.html`.

## Notas

- El repositorio de la app principal no se ve afectado porque esta web está en una carpeta separada.
- En el repo principal, `recuperoMIM/` está agregado a `.gitignore` para que no se incluya en el código de la app.
