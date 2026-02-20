import { useState, useEffect, lazy, Suspense } from "react"

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"]

function toRoman(num) {
    return ROMAN_NUMERALS[num - 1] || String(num)
}

export default function Journal({ days, routePoints }) {
    const [openedPage, setPage] = useState(0)
    const [transitioning, setTransitioning] = useState(false)
    const [logbookOpen, setLogbookOpen] = useState(false)

    const changePage = (newPage) => {
        setTransitioning(true)
        setTimeout(() => {
            setPage(newPage)
            setTransitioning(false)
        }, 300)
    }

    return (
        <main className="flex flex-col bg-[#1a0e08]" style={{ backgroundImage: "radial-gradient(ellipse at center, #2a1a0e 0%, #1a0e08 70%)" }}>
            <div className="journal-stage">
                <div className="journal-panel">
                    {openedPage > -1 && (
                        <Page
                            prev={() => openedPage >= 1 && changePage(openedPage - 1)}
                            next={() => openedPage < days.length - 1 && changePage(openedPage + 1)}
                            content={days[openedPage]}
                            currentPage={openedPage + 1}
                            totalPages={days.length}
                            transitioning={transitioning}
                            logbookOpen={logbookOpen}
                            setLogbookOpen={setLogbookOpen}
                        />
                    )}
                </div>
            </div>
            <RouteMap routePoints={routePoints} currentDay={openedPage + 1} />
        </main>
    )
}

function Page({ content, prev, next, currentPage, totalPages, transitioning, logbookOpen, setLogbookOpen }) {
    const hasLogbook = !!content.logbook

    return (
        <div className="flex w-full h-full flex-col items-center justify-center">
            <div className="notch journal-notch bg-[#3d2b1f] w-[calc(80%_+_20px)] h-[8px]"></div>
            <div className={`journal-book relative flex w-[calc(80%_+_20px)] h-[90%] overflow-hidden transition-opacity duration-300 ${transitioning ? "opacity-0" : "opacity-100"}`}>
                <div className="journal-spine bg-[#3d2b1f] w-[10px] h-full"></div>
                <div className="py-[15px] leading-7 relative pr-[15px] pl-[35px] page_left w-1/2 h-full flex flex-col">
                    <PageHeader day={content.day} date={content.date} />
                    <div className="overflow-y-auto flex-1 pr-2 font-fondamento">
                        {renderText(content.textL)}
                    </div>
                    <span onClick={prev} className="nav-arrow absolute bottom-[10px] left-[10px] z-30">☜</span>
                </div>
                <div className="relative py-[15px] pl-[15px] pr-[35px] leading-7 page_right w-1/2 h-full flex flex-col">
                    {content.textR && (
                        <div className="overflow-y-auto flex-1 pl-2 font-fondamento">
                            {renderText(content.textR)}
                        </div>
                    )}
                    <div className="text-center text-sm text-[#8b7355] mt-auto pt-2 font-fondamento">
                        Page {currentPage} of {totalPages}
                    </div>
                    <span onClick={next} className="nav-arrow absolute bottom-[10px] right-[10px] z-30">☞</span>
                </div>
                <div className="journal-spine bg-[#3d2b1f] w-[10px] h-full"></div>

                {hasLogbook && (
                    <>
                        <div
                            className="logbook-tab"
                            onClick={() => setLogbookOpen(!logbookOpen)}
                        >
                            <span className="logbook-tab-text">Logbook</span>
                        </div>

                        <div className={`logbook-parchment ${logbookOpen ? "logbook-open" : "logbook-closed"}`}>
                            <div className="logbook-parchment-inner">
                                <div className="logbook-pull-tab" onClick={() => setLogbookOpen(false)}>
                                    <span>▸</span>
                                </div>

                                <h3 className="text-xl font-medieval text-[#3d2b1f] tracking-wide m-0 text-center pt-4 pb-2 border-b border-[#c4a265] mx-5">
                                    ⚓ Ship's Logbook ⚓
                                </h3>

                                <div className="flex-1 overflow-y-auto px-5 py-3">
                                    {(content.departure || content.arrival || content.purpose) && (
                                        <div className="flex justify-around mb-4 pb-3 border-b border-dashed border-[#c4a265]">
                                            {content.departure && (
                                                <div className="text-center">
                                                    <span className="font-medieval text-xs text-[#8b7355] block">Départ</span>
                                                    <span className="font-fondamento text-sm text-[#3d2b1f]">{content.departure}</span>
                                                </div>
                                            )}
                                            {content.arrival && (
                                                <div className="text-center">
                                                    <span className="font-medieval text-xs text-[#8b7355] block">Arrivée</span>
                                                    <span className="font-fondamento text-sm text-[#3d2b1f]">{content.arrival}</span>
                                                </div>
                                            )}
                                            {content.purpose && (
                                                <div className="text-center">
                                                    <span className="font-medieval text-xs text-[#8b7355] block">But</span>
                                                    <span className="font-fondamento text-sm text-[#3d2b1f]">{content.purpose}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <table className="w-full border-collapse font-fondamento text-sm text-[#3d2b1f]">
                                        <thead>
                                            <tr>
                                                {["Heure", "Événement", "Voilure", "Allure", "Vent", "Position"].map((col) => (
                                                    <th
                                                        key={col}
                                                        className="text-left py-2 px-2 border-b-2 border-[#c4a265] font-medieval text-base text-[#5a3e28]"
                                                    >
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {content.logbook.map((entry, i) => (
                                                <tr key={i} className="border-b border-[#d4c4a0] hover:bg-[rgba(196,162,101,0.1)]">
                                                    <td className="py-2 px-2 whitespace-nowrap">{entry.time}</td>
                                                    <td className="py-2 px-2">{entry.event}</td>
                                                    <td className="py-2 px-2">{entry.sails}</td>
                                                    <td className="py-2 px-2">{entry.allure}</td>
                                                    <td className="py-2 px-2">{entry.wind}</td>
                                                    <td className="py-2 px-2">{entry.position}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="notch journal-notch rotate-[180deg] w-[calc(80%_+_20px)] bg-[#3d2b1f] h-[8px]"></div>
        </div>
    )
}

const LazyLeafletMap = lazy(() => import("./LeafletMap"))

function RouteMap({ routePoints, currentDay }) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const daySegments = []
    for (let d = 1; d <= currentDay; d++) {
        const key = `day${d}`
        if (routePoints[key]) {
            daySegments.push({ day: d, points: routePoints[key] })
        }
    }

    const allPoints = daySegments.flatMap((s) => s.points)
    const minLat = allPoints.length ? Math.min(...allPoints.map((p) => p.lat)) : 47.72
    const maxLat = allPoints.length ? Math.max(...allPoints.map((p) => p.lat)) : 47.90
    const minLng = allPoints.length ? Math.min(...allPoints.map((p) => p.lng)) : -4.12
    const maxLng = allPoints.length ? Math.max(...allPoints.map((p) => p.lng)) : -3.91
    const center = [(minLat + maxLat) / 2, (minLng + maxLng) / 2]

    return (
        <section className="route-map-section">
            <div className="route-map-header">
                <h3 className="route-map-title">Route Chart</h3>
                <p className="route-map-subtitle">Day {toRoman(currentDay)} track across the coast.</p>
            </div>
            <div className="route-map-frame">
                {mounted && (
                    <Suspense fallback={<div style={{ width: "100%", height: "100%", background: "#0f1a24" }} />}>
                        <LazyLeafletMap daySegments={daySegments} currentDay={currentDay} center={center} />
                    </Suspense>
                )}
            </div>
        </section>
    )
}

function PageHeader({ day, date }) {
    return (
        <div className="text-center mb-4 pb-3 border-b border-[#c4a265]">
            <h2 className="text-3xl font-medieval text-[#3d2b1f] m-0 tracking-wide">
                Day {toRoman(day)}
            </h2>
            <p className="text-sm text-[#8b7355] m-0 mt-1 font-fondamento italic">
                {date}
            </p>
        </div>
    )
}

function renderText(text) {
    if (!text) return null
    return text
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((paragraph, i) => (
            <p key={i} className="log-entry">
                {paragraph.trim()}
            </p>
        ))
}
