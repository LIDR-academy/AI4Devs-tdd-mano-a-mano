# Configuración de Jest
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


# Creación de tests para la funcionalidad de insertar candidatos en base de datos
