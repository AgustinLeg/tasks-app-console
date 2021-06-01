require('colors');
const {inquirerMenu,
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');
const {guardarDB, leerDB} = require('./helpers/guardarArchivo');

console.clear();

const main = async()=>{
    let opt='';
    const tareas = new Tareas();
    const tareasDB =  leerDB();
    if(tareasDB){
        tareas.cargarTareasFromArr(tareasDB);
    }

    do{
        opt = await inquirerMenu();
        
        switch(opt){
            case '1':
                const desc = await leerInput('Descipcion:');
                tareas.crearTarea(desc);
            break;
            case '2':
                tareas.listadoCompleto();
            break;
            case '3':
                tareas.listarPendientesCompletadas(true);
            break;
            case '4':
                tareas.listarPendientesCompletadas(false)
            break;
            case '5':
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
            break;
            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if(id!== '0'){
                    const confirmarBorrar = await confirmar('Esta seguro?');
                    if(confirmarBorrar){
                        tareas.borrarTarea(id);
                        console.log('Tarea Borrada'.green)
                    }
                }
            break;
        }

        guardarDB(tareas.listadoArr);


        await pausa();

    }while( opt !== '0')
    
}


main();