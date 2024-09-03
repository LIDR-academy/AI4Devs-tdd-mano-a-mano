# Configuración de Jest (OK)
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


# Creación de tests para la funcionalidad de insertar candidatos en base de datos (Rollback)

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

> La solución también da error y la propuesta de solución ya indica refactorizar código de producción (Candidate.ts) para incluir en el constructor el objeto PrismaClient y poderlo pasar mockeado desde el test.
> Se pregunta a Cursor que nos explique mejor el código de Candidate.ts para entender como funciona Prisma. 

## Investigación de Prisma
```
Puedes explicar este código?
if (this.resumes.length > 0) {
    candidateData.resumes = {
        create: this.resumes.map(resume => ({
            filePath: resume.filePath,
            fileType: resume.fileType
        }))
    };
}
```

```
de donde saca la función `create` de prisma? Donde está declarada o como sabe que debe usarla?
```

```
De acuerdo, pero así como `prisma.candidate.update` es una función que se ve que pertenece al API de Prisma, donde está o qué hace realmente `candidateData.resumes = { create: ... }`?
Esta sintaxis de Javascript que hace?
```

> Esto me ha ayudado a entender que Candidate.ts realmente se trata de un Active Record, acoplado a infraestructura y no a dominio. Por lo que o bien mockeamos Candidate.ts o bien pasamos PrismaClient por constructor

```
Al tratarse @Candidate.ts  de un Active Record muy ligado a infraestructura qué recomendación me das para poder mockear el acceso a base de datos en el test que queremos hacer en @tests-JMLC.test.ts para @candidateService.ts ?
```

> Ofrece que la opción más mantenible es la de usar el patrón Repository. Al tratarse de un refactor grande aseguraremos con un test E2E primero

## Creación de un test E2E

```
Al tratarse de un refactor importante que puede romper alguna funcionalidad, primero crearemos un test E2E. Cual es la mejor opción para este test en el proyecto actual? 
Ten en cuenta las dependencias actuales del fichero @package.json y que el objetivo del test será testear 2 casos:
- Happy path de la creación de un candidato vía API REST. 
- Creación erronea de un candidato vía API REST

Utiliza el código y la definición del API para realizar este test.

Detalla la configuración, si es necesaria para implementar el test.
```

 > Se utiliza "Debug with AI" para depurar un error en la librería "supertest" requerida

```
Puedes revisar el fichero de test porque se produce el siguiente warning al finalizar los test con o sin errores:

Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.


Parece ser que la variable `app` provoca el cuelgue porque deja el servidor arrancado y escuchando. ¿Como lo puedo cerrar?
```

> Recuperamos la respuesta anterior que incluia los refactor a hacer para introducir el patrón Repository, ajustamos 2 cosas que daban error en CandidateRoutes y eliminamos CandidateController puesto que parece tener la misma lógica que CandidateRoutes y simplificamos.

## Creación de un test unitario para CandidateService con mock de CandidateRepository

```
Bien. Ahora queremos introducir varios test unitarios para @candidateService.ts dentro del fichero @tests-JMLC.test.ts 

Estos test deben probar toda la funcionalidad, no solo el happy path. 

Antes de escribir código, lista los test propuestos.
```

```
Puedes implementar el primer test propuesto con el Happy path.
```

> Falla porque en Education, WorkExperience y Resume siguen siendo Active Records, por lo que falla al usar Prisma.
> Se simplifica el Happy Path para crear un Candidato sin relaciones
