# Arquitectura base

La app ahora esta organizada para crecer sin concentrar todo en `App.js`.

## Estructura

```text
src/
  app/
    navigation/
    providers/
  features/
    home/
      screens/
  shared/
    components/
    styles/
    theme/
```

## Criterios

- `app/`: composicion global, providers, bootstrap y navegacion.
- `features/`: dominio funcional por modulo. Cada feature puede crecer con `screens`, `components`, `hooks`, `services` y `api`.
- `shared/`: piezas reutilizables que no pertenecen a una sola feature.

## Regla practica

- Si algo sirve solo a un modulo, vive en su `feature`.
- Si algo sirve a varios modulos, pasa a `shared`.
- Si algo inicia o conecta toda la aplicacion, va en `app`.
