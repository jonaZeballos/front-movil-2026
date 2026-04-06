# Movil React Native

Aplicacion movil construida con Expo y React Native.

## Rama actual

Este README corresponde a la rama `main`.

## Requisitos

Antes de correr el proyecto, instala lo siguiente:

- `Node.js` version `20` o superior recomendada.
- `npm` incluido con Node.js.
- `Git` para clonar el repositorio.
- `Expo Go` en tu celular Android o iPhone si quieres probar desde un dispositivo fisico.

## Verificar instalaciones

Puedes revisar que todo este instalado con:

```bash
node -v
npm -v
git --version
```

## Instalar Node.js

Si no tienes Node.js:

1. Ve a `https://nodejs.org/`
2. Descarga la version `LTS`
3. Instalala con la configuracion por defecto
4. Cierra y vuelve a abrir tu terminal

Luego verifica:

```bash
node -v
npm -v
```

## Clonar el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd movil-react-native
```

## Instalar dependencias

```bash
npm install
```

## Correr el proyecto

Inicia el servidor de desarrollo con:

```bash
npm start
```

Tambien puedes usar:

```bash
npm run android
npm run ios
npm run web
```

## Probar en celular

1. Instala `Expo Go` desde la tienda de aplicaciones.
2. Ejecuta el proyecto con `npm start`.
3. Escanea el codigo QR que aparece en la terminal o en el navegador.

## Si algo no carga bien

Puedes limpiar cache con:

```bash
npx expo start -c
```

## Tecnologias principales

- `Expo`
- `React Native`
- `react-native-reanimated`
- `react-native-svg`
- `react-native-safe-area-context`
- `twrnc`

## Estructura base

```text
src/
  app/
  features/
  shared/
```

## Notas

- Para `iOS`, normalmente necesitas macOS si quieres ejecutar simulador nativo.
- Para `Android`, puedes usar emulador o `Expo Go`.
- Si solo quieres revisar rapido la app, `Expo Go` es la forma mas simple.
