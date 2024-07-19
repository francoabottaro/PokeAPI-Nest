<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio:

```
git clone https://github.com/francoabottaro/Pokedex.git
```

2. Ejecuta:

```
yarn install
```

3. Levantar el proyecto con docker:

```
npm run start:docker
```

4. Clonar el archivo **.env.template** y renombrar la copia a **.env**

5. Llenar la variables de entorno definida en el **.env**

6. Ingresar pokemons en la base de datos con HTTP GET:

```
http://localhost:3000/api/v2/seed
```

## Stack usado

- MongoDB
- NestJS
- Docker
