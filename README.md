# Pendientes

## estados y persistencia

- [ ] al recargar o abrir la app recuperar estados locales vs nube y comparar la version mas reciente? o preguntar cual conservar?

## Base de datos y relaciones [P1]

- [ ] Crear la base de datos (supabase)
- [ ] Conectar las entidades
- [ ] Crear y eliminar relaciones entre eventos y leads
- [ ] Evitar relaciones duplicadas
- [ ] Limpiar las relaciones al borrar un evento o un lead
- [ ] verificar que los eventos al guardarse se se creen en la fecha y hora del usuario, y no a las 00:00 del sistema (no se registra la hora correctamente y pierden el start time)

## Calendar [p1]

- [ ] Ordenar los eventos por fecha
- [ ] Filtrar eventos por día y semana
- [ ] Distinguir eventos pasados y futuros
- [ ] Definir cuándo se deben agregar los eventos con anticipación
- [ ] mostrar proximos eventos por venir (quizas en una vista propia, en un 'inicio....')
- [ ] preguntar como y cuando se va recordar sobre un evento (antes el mismo dia, una hora antes, en el momento?)

## CRM

- [ ] Mostrar la última actividad de cada lead
- [ ] Mostrar la próxima acción pendiente
- [ ] estado derivado? (activo, frío, etc.)

## Kanban

- [ ] Definir estados para las tareas
- [ ] Permitir mover tareas entre columnas
- [ ] Vincular tareas con eventos o fechas límite
- [ ] vincular tareas con proyectos o contactos

## Projects

- [ ] Agregar una acción para crear tareas desde el panel del proyecto
- [ ] ver los proyectos como hojas independientes con todos sus relacionados

## Time Tracker [p2]

- [ ] Implementar iniciar y detener el seguimiento
- [ ] Guardar los intervalos de tiempo
- [ ] Vincular el tiempo registrado con proyectos, tareas o leads
- [ ] Calcular el tiempo total (de un bloque de tiempo? de todos los bloques de evento de un mismo tipo? en total de un proyecto o tarea u otra cosa? o todo el tiempo registrado de un dia, semana? mes?)

## Interfaz

- [ ] Quitar el version switcher
- [ ] estados de carga y error cuando se consultan datos online

## documentos

- [ ] Definir la diferencia entre plantillas y documentos creados
- [ ] Crear un documento nuevo a partir de una plantilla
- [ ] Implementar el botón Add Template (ahora solo muestra un console.log)
- [ ] Guardar, cargar y actualizar documentos desde la base de datos
- [ ] Mostrar si el documento se está guardando, se guardó o hubo un error
- [ ] Permitir eliminar o duplicar documentos
- [ ] Limpiar o sanitizar el HTML antes de mostrar contenido guardado
- [ ] guardar los documentos en otro lado, y editarlos desde otra interfaz como word o strapi

## en general

- [ ] cada cuanto se recordara algo? (una sola vez y ya o periodicamente, segun importancia?)
- [ ] validar los inputs de los usuarios, (buscar una libreria que limpie sql y html o js?)
- [ ] probar el uso en general
- [ ] evitar guardar duplicados (eso tiene que ver con relacionar unos con otros)
- [ ] borrar una entidad borra sus relaciones con otras cosas
- [ ] hacer el logo
- [ ] hacer el manifest y agregar unos captures
- [ ] eh decidir si persistir eventos o delegarlos con otra app o dejarlo solo como app de escritorio mientras este abierta y todo eso
- [ ] HACER COMPONENTES DE JSX MAS PEQUE;OS COMO EN LOS FORMS Y LOS INPUT DIALOGS

### todos comentados o features por agregar, o no

- [ ] crear rangos de eventos ya calculados para antes o despues dela dfecha en la que esta
