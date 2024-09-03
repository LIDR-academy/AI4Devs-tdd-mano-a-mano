# Configuración de Jest (Cursor.sh)
```
Eres un programador experto en React.JS con Typescript y testing con Jest.
Queremos incorporar testing en el proyecto actual usando Jest. 
El proyecto contiene 2 proyectos: "backend" y "frontend". 
Puedes ayudarme a configurar cada proyecto? Ten en cuenta las librerías instaladas en cada uno para solo añadir las dependencias oportunas para usar Jest.
Descríbeme los pasos que propones seguir y pregunta cualquier duda al respecto.
```

```
Puedes revisar el test @App.test.tsx  que valide correctamente la funcionalidad de @App.js ?
Revisa conjuntamente con los componentes que carga App.js para comprobar que se muestra el título "Dashboard del Reclutador" en la pantalla al cargar la aplicación.
```

```
Ambos test dan el siguiente error:

● renders AddCandidate component when navigating to /add-candidate

    You cannot render a <Router> inside another <Router>. You should never have more than one in your app.

```


```
Ahora el error es el siguiente:


  ● renders RecruiterDashboard by default

    TypeError: expect(...).toBeInTheDocument is not a function

  ● renders AddCandidate component when navigating to /add-candidate

    TypeError: expect(...).toBeInTheDocument is not a function
```


# Creación de tests para la funcionalidad de insertar candidatos en base de datos (Cursor.sh)

> El primer prompt he tenido que iterarlo 3 veces porque no había forma de configurar bien el mock de Prisma. Al usar como referencia el enlace pasado en el enunciado del ejercicio se liaba, quizá porque no se usa Jest si no Vitest, otro framework que extiende de Jest.

```
Eres un programador de Typescript experto en testing con Jest.

En el proyecto "backend" queremos añadir tests unitarios para cubrir la funcionalidad de "Añadir un candidato".
Queremos seguir buenas prácticas en testing sabiendo que el proyecto sigue arquitectura hexagonal. Por ejemplo:
- no usaremos la base de datos real, deberemos mockear el cliente de Prisma que se usa en los objetos de "domain", pero sin mockear los métodos de estos objetos puesto que contienen lógica de negocio
- Crearemos test para los CU del package "application/services". El package "domain" se testeará indirectamente al testear los casos de uso de "application".

Puedes ayudarme a detectar qué tests puedo implementar para dicha funcionalidad y qué ficheros cubren? No implementes aún. 

Por requisitos del proyecto todos los test se ubicaran en el fichero @tests-JMLC.test.ts 

Revisa los ficheros para detectar lo que necesites y pregunta cualquier duda. 
Primero haz un listado de los pasos que seguirás. No escribas código aún.
```

```
Podemos empezar con los test
```

Solucionamos un error usando Debug with AI de Cursor:
```
Please help me debug this code. Only debug the latest error.
```

```
```