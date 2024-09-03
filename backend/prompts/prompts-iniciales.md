# Prompt 1

Actúa como un desarrollador backend que necesita preparar un proyecto para ejecutar pruebas unitarias desde la consola usando `npm test`. Queremos utilizar `ts-jest` para integrar TypeScript con Jest. Por favor, realiza los cambios necesarios en el proyecto para lograr este objetivo, siguiendo las indicaciones de esta guía:

[Guía básica para empezar a hacer unit testing con Jest](https://medium.com/@angelygranados/c%C3%B3mo-empezar-a-hacer-unit-testing-con-jest-gu%C3%ADa-b%C3%A1sica-ca6d9654672)

## Respuesta

Pasos para preparar el proyecto para ejecutar pruebas unitarias desde la consola usando `npm test`:

1. Instalar las dependencias necesarias:
2. Inicializar Jest:
3. Configurar `package.json`:
4. Configurar `tsconfig.json`:
5. Configurar `jest.config.js`:
6. Crear un archivo de prueba:
7. Crear el archivo de implementación:

# Prompt 2

Por favor, continúa con los tests para `addCandidateController`. Asegúrate de cubrir los siguientes casos adicionales:

1. Verificar que se manejen correctamente los datos faltantes en el cuerpo de la solicitud.
2. Verificar que se manejen correctamente los datos inválidos en el cuerpo de la solicitud.
3. Verificar que se maneje correctamente una respuesta del servicio `addCandidate` que no sea un objeto esperado.

# Prompt 3

Continúa implementando tests unitarios para la funcionalidad de guardado de candidatos en `@Candidate.ts`. Agrega los tests en `@tests-WBF.test.ts`, usando mocks para las dependencias de la base de datos.

# Prompt 4

Agrega pruebas adicionales para la función `validateName` en el archivo de validación. Asegúrate de cubrir los siguientes casos:

1. Verificar que se lance un error para nombres inválidos (vacío, demasiado corto, demasiado largo).
2. Verificar que no se lance un error para nombres válidos.

# Prompt 5

Agrega pruebas unitarias para el modelo `Education`. Asegúrate de cubrir los siguientes casos:

1. Verificar que se cree un nuevo registro de educación.
2. Verificar que se actualice un registro de educación existente.