import { useState } from "react"

export default function Journal({days}) {
    const [openedPage, setPage] = useState(-1)
    
    return (
        <main className="flex h-screen" >
            <div className="w-4/6 h-full bg-cyan-500">
                {openedPage > -1 && 
                    <div className="h-full flex justify-center items-center">
                        <h1 className="text-amber-200 text-3xl">Day {days[openedPage].day}</h1>
                        <div>{days[openedPage].text}</div>
                    </div>
                }
            </div>
            <div className="w-2/6 h-full bg-yellow-900">
                {
                    days.map((day) => {
                        return <Entry action={() => setPage(day.day-1)} key={day.day} day={day} />
                    })
                }
            </div>
        </main>
    )
}

function Entry({ day, action }) {
    return (
        <div onClick={action} className="h-40 flex justify-center border border-black p-4 bg-yellow-950">
            <div className="w-full h-full flex justify-center items-center border border-black relative bg-yellow-900">
                <div className="absolute w-full h-[20px] rotate-[16deg] bg-yellow-950 z-0"></div>
                <div className="absolute w-full h-[20px] rotate-[-16deg] bg-yellow-950 z-0"></div>
                <h1  className="text-amber-200 text-3xl z-10">Day {day.day}</h1>
            </div>
        </div>
    )
}
