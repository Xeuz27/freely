to do list

-   [ ] conectar las entidades
-   [ ] crear la bd
-   [ ] quitar version switcher
-   [ ] agregar add task en project sheet
-   [ ] agregar o juntar en time tracker las tareas por projectos o task del kanban o lead
-   [ ] los eventos se agregan un dia antes de

❗ Lo que TE FALTA (esto es clave)

Te lo separo por módulos:

📌 1. RELACIONES (core del sistema)

Ahora mismo tienes estructura, pero necesitas:

🔥 mínimo necesario:
crear EventLink
eliminar EventLink
obtener eventos por lead
evitar duplicados (mismo event + lead)

👉 sin esto, todo lo demás se vuelve inconsistente

📌 2. CALENDAR (te falta lógica real)

Tienes eventos, pero probablemente NO tienes:

ordenar eventos por fecha
filtrar por día / semana
detectar eventos pasados vs futuros
“próximo evento” (esto es CLAVE en CRM)
📌 3. CRM (esto te sube nivel)
“última actividad” (último evento relacionado)
“próxima acción” (evento futuro más cercano)
estado derivado (activo, frío, etc.)

👉 esto no se guarda, se calcula

📌 4. KANBAN (aunque no lo hayas conectado aún)
tareas con status (todo, doing, done)
mover entre columnas
opcional: link con eventos (deadline)
📌 5. TIME TRACKER (esto está verde aún)
start / stop tracking
guardar intervalos
link a task o event
calcular duración total
📌 6. INTEGRIDAD (esto es lo que evita bugs feos)
si borras un lead → borrar sus eventLinks
si borras un event → borrar sus eventLinks
evitar referencias rotas

👉 esto es lo que mucha gente olvida
