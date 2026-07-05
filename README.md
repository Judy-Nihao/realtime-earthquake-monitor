# Realtime Earthquake Globe

An MVP (Minimum Viable Product) for exploring realtime data flow and 3D
visualization in React.

The app listens to live earthquake events, normalizes each message into a clean
`Earthquake` object, and renders the events as markers on a 3D globe.

這是一個用 React 練習即時資料流與 3D 視覺化的 MVP（最小可行版本）。它會接收即時地震事件，
整理成前端好使用的資料格式，再把每筆事件畫成 3D 地球上的標記點。

## Data Flow

```text
SockJS connection
-> realtime message
-> JSON.parse
-> normalized Earthquake object
-> React state
-> 3D globe markers and event panel
```

## Data Source

This project uses the public realtime earthquake stream provided by Seismic
Portal.

Documentation:
https://www.seismicportal.eu/realtime.html

SockJS endpoint:
https://www.seismicportal.eu/standing_order

The documentation page provides a JavaScript SockJS example. The actual app
connects to the SockJS endpoint and receives realtime earthquake events from
that stream.

## Tech Stack

- Vite
- React
- TypeScript
- SockJS
- Three.js / React Three Fiber
- Mantine
- CSS Modules

## Visualization Mapping

- Location: GeoJSON `[longitude, latitude]` coordinates normalized into `lon` /
  `lat`, then converted into a 3D `[x, y, z]` position on the globe
- Magnitude: marker size
- Depth: marker color

The stream payload includes GeoJSON-style `geometry.coordinates`. That order is
`[longitude, latitude, depth]`, not `[latitude, longitude]`, so the app first
normalizes the event into a clean object:

```ts
const earthquake = {
  lon: coords[0],
  lat: coords[1],
  depth: props.depth,
};
```

The normalized `lon` and `lat` are not mapped directly to `x` and `y`. Because
the globe is a 3D sphere, the app converts them through spherical coordinates
to calculate the final `[x, y, z]` marker position.

Before an event becomes a marker, the socket hook also validates the fields used
for rendering. The app only keeps events with a valid `id`, finite `lat`, `lon`,
`depth`, and `mag` values, and coordinates inside the normal latitude/longitude
ranges. This prevents incomplete or malformed stream messages from producing
markers at invalid positions or making multiple events appear stacked together.

## Realtime Reliability

The socket hook handles the basic realtime lifecycle:

- connecting
- connected
- reconnecting after an unexpected close

This helps the visualization recover from temporary network interruptions
instead of silently stopping after a socket disconnect.

## Run Locally

```bash
npm install
npm run dev
```

## Check the WebSocket in DevTools

To verify that the realtime stream is actually connected, open Chrome DevTools
and go to the Network tab.

SockJS may first send an `/info` request, for example:

```text
https://www.seismicportal.eu/standing_order/info?t=...
```

That request is a SockJS setup check. It confirms what transport options are
available, but it is not the live event stream itself.

The actual realtime connection appears as a `websocket` request, for example:

```text
wss://www.seismicportal.eu/standing_order/.../websocket
```

When the WebSocket handshake succeeds, the status code is `101 Switching
Protocols`. This means the browser and server upgraded the connection from a
normal HTTP request into a persistent WebSocket connection.

After that, the Messages tab should show incoming earthquake events. SockJS
wraps each event, so the raw message may look like an array containing a JSON
string. The app parses that message and normalizes it into a clean `Earthquake`
object before rendering it on the globe.
