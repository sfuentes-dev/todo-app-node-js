require('colors')

const { guardarDB, leerDb } = require('./helpers/guardarArchivo')

const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoCheckList,
} = require('./helpers/inquirer')

const Tarea = require('./models/tarea')
const Tareas = require('./models/tareas')

console.clear()

const main = async () => {
  let opt = ''
  const tareas = new Tareas()

  const tareasDB = leerDb()

  if (tareasDB) {
    // Establecer las tareas
    tareas.cargarTareasFromArray(tareasDB)
  }

  do {
    opt = await inquirerMenu()

    switch (opt) {
      case '1':
        const desc = await leerInput('Descripcion:')
        tareas.crearTarea(desc)
        break

      case '2':
        tareas.listadoCompleto()
        break
      case '3':
        tareas.listarPendientesCompletadas(true)
        break

      case '4':
        tareas.listarPendientesCompletadas(false)
        break

      case '5':
        const ids = await mostrarListadoCheckList(tareas.listadoArr)
        tareas.toggleCompletadas(ids)
        break

      case '6':
        const id = await listadoTareasBorrar(tareas.listadoArr)

        if (id !== '0') {
          const deleteConfirmation = await confirmar('Esta seguro?')

          if (deleteConfirmation) {
            tareas.borrarTarea(id)
            console.log('Tarea Borrada')
          }
        }

        break
    }

    guardarDB(tareas.listadoArr)
    await pausa()
  } while (opt !== '0')
}

main()
