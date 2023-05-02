require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
//const {mostrarMenu, pausa} = require('./helpers/mensajes');
const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoCHeckList } = require('./helpers/inquirer');
//const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');


const main = async () => {
    console.clear();
    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB) {
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        console.clear();
        opt = await inquirerMenu();
        
        switch(opt) {
            case '1': // Crear tarea
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea(desc);
            break;
            case '2': // Listar tareas
                //console.log(tareas.listadoArr);
                tareas.listadoCompleto();
            break;
            case '3': // Listar tareas completadas
                tareas.listadoPendientesCompletadas(true);
            break;
            case '4': // Listar tareas pendientes
                tareas.listadoPendientesCompletadas(false);
            break;
            case '5': // Completar o pendiente
                const ids = await mostrarListadoCHeckList(tareas.listadoArr);
                //console.log(ids);
                tareas.toggleCompletadas(ids);
            break;
            case '6': //Borrar
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id !== '0') {
                    const ok = await confirmar('¿Esta seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
                
            break;
        }


        guardarDB( tareas.listadoArr );

        await pausa();

    } while (opt !== '0');

}

main();