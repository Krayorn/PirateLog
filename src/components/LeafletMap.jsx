import { useEffect } from "react"
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

function FitBounds({ bounds }) {
    const map = useMap()
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [30, 30] })
        }
    }, [map, bounds])
    return null
}

export default function LeafletMap({ daySegments, currentDay, center }) {
    const allPoints = daySegments.flatMap((s) => s.points)
    const bounds = allPoints.length
        ? L.latLngBounds(allPoints.map((p) => [p.lat, p.lng]))
        : null

    const currentLabels = new Set()
    const currentSegment = daySegments.find((s) => s.day === currentDay)
    if (currentSegment) {
        currentSegment.points.forEach((p) => currentLabels.add(p.label))
    }

    const seenLabels = new Set()

    return (
        <MapContainer
            center={center}
            zoom={11}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "100%" }}
            attributionControl={false}
        >
            <FitBounds bounds={bounds} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {daySegments.map((segment) => {
                const isCurrent = segment.day === currentDay
                const positions = segment.points.map((p) => [p.lat, p.lng])
                return (
                    <Polyline
                        key={`line-${segment.day}`}
                        positions={positions}
                        pathOptions={{
                            color: isCurrent ? "#c9a84c" : "#5a4a3a",
                            weight: isCurrent ? 3 : 1.5,
                            dashArray: isCurrent ? "8 6" : "4 4",
                            opacity: isCurrent ? 0.9 : 0.35,
                        }}
                    />
                )
            })}
            {daySegments.map((segment) => {
                const isCurrent = segment.day === currentDay
                return segment.points.map((point, i) => {
                    if (seenLabels.has(point.label)) return null
                    seenLabels.add(point.label)
                    const belongsToCurrent = currentLabels.has(point.label)
                    return (
                        <CircleMarker
                            key={`marker-${segment.day}-${i}`}
                            center={[point.lat, point.lng]}
                            radius={belongsToCurrent ? 6 : 3}
                            pathOptions={{
                                color: belongsToCurrent ? "#3d2b1f" : "#4a3a2a",
                                fillColor: belongsToCurrent ? "#f5e6c8" : "#6b5a48",
                                fillOpacity: belongsToCurrent ? 0.9 : 0.6,
                                weight: belongsToCurrent ? 2 : 1,
                            }}
                        >
                            {belongsToCurrent && (
                                <Tooltip direction="top" permanent className="route-tooltip">
                                    {point.label}
                                </Tooltip>
                            )}
                        </CircleMarker>
                    )
                })
            })}
        </MapContainer>
    )
}
