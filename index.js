const [, , metodo, ruta, ...args] = process.argv;
//console.log("process.argv:");
//console.log(process.argv);

const URL_BASE = "https://dummyjson.com";
// const URL_BASE = "https://fakestoreapi.com";
//const URL_BASE = "https://jsonplaceholder.typicode.com";

const request = async (url, options = {}) => {
    const response = await fetch(url, options); 
    if(!response.ok){
        throw new Error("No response");
    }
    return await response.json();
}

let resource = ruta;
let id;

try{
    if(metodo === 'GET'){
        if(args.length > 0){
            throw new Error("argumentos no autorizados");
        }else if(ruta.includes('/')){ //Si hubiera una barra crea const para cada elem
            [resource, id] = ruta.split('/'); 
        }

        if(ruta.split('/').length>1){
            const data = await request(`${URL_BASE}/${resource}/${id}`);
            console.log(data);
        }else{
            const data = await request(`${URL_BASE}/${resource}`);
            console.log(data);
        }
    }else if(metodo === "POST"){
        const [username, email, password] = args;
        
        if(username && email && password){
            if(email.includes("@")&&email.includes(".")){
                console.log('resource en request: ',resource);
                const data = await request(`${URL_BASE}/${resource}/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }) 
                });
                console.log(`Usuario ${username} creado correctamente`);
                console.log(`Id asignado ${data.id}`);
            }else{
                throw new Error("Email inválido");
            }
        }else{
            throw new Error("faltan parámetros");
        }
    }else if(metodo === "DELETE"){
        if(!ruta.includes('/')){
            throw new Error("Recurso invalido");
        }else{
            [resource, id] = ruta.split('/'); 
            const data = await request(`${URL_BASE}/${resource}/${id}`, {method: "DELETE"});
            console.log(`Elemento id: ${id} eliminado`);
        }

    }else{
        throw new Error(`Método "${metodo}" no soportado`);
    }
}catch(error){
    console.log("Falla grave:",error.message);
}
