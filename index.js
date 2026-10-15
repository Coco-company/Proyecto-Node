const [, , metodo, ruta, ...args] = process.argv;
//console.log("process.argv:");
//console.log(process.argv);

//const URL_BASE = "https://dummyjson.com";
//const URL_BASE = "https://fakestoreapi.com";
const URL_BASE = "https://jsonplaceholder.typicode.com";

const request = async (url, options = {}) => {
    const response = await fetch(url, options); 
    if(!response.ok){
        throw new Error("No response");
    }
    return await response.json();
}

let resource;
let id;

try{

    if(metodo == 'GET'){

        if(args.length > 0){
            console.log(args);
            console.error("argumentos no autorizados");
        }else if(ruta.includes('/')){ //Si hubiera una barra crea const para cada elem
            [resource, id] = ruta.split('/'); 
        }else{
            resource = ruta; 
        }

        if(ruta.split('/').length>1){
            const data = await request(`${URL_BASE}/${resource}/${id}`);
            console.log(data);
        }else{
            const data = await request(`${URL_BASE}/${resource}`);
            console.log(data);
        }
    }else if(metodo == "POST"){
        const [name, username, email] = args;
        //console.table(args);
        if(name && username && email){
            if(email.includes("@")&&email.includes(".")){
                const data = await request(`${URL_BASE}/${resource}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, username, email }) 
                });
                console.log(data);
            }else{
                throw new Error("Email inválido");
            }
        }else{
            throw new Error("faltan parámetros");
        }
    }else if(metodo == "DELETE"){
        if(!id){
            throw new Error(`Id "${id}" incorrecto ó no encontrado`);
        }else{
            const data = await request(`${URL_BASE}/${resource}/${id}`, {method: "DELETE"});
        }
    }else{
        console.log(`Método "${metodo}" no soportado`);
    }
}catch(error){
    console.log("Falla grave:",error.message);
}
